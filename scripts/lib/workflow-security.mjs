import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const PINNED_ACTION = /^[^@\s]+@[0-9a-f]{40}$/;
const SAFE_LOCAL_ACTION = /^\.\/.+/;
const UPLOAD_GOOGLE_PLAY_ACTION = /^r0adkll\/upload-google-play@/;
const PLAY_PUBLISH_WORKFLOW = "play-publish.yml";
const REPOSITORY_FILE_REFERENCE =
  /(?:^|[\s"'`=])(?:\.\/)?(?:app\.json|package\.json|package-lock\.json|\.nvmrc|scripts\/[\w./-]+|src\/[\w./-]+|__tests__\/[\w./-]+|\.github\/[\w./-]+)/m;
const RELEASE_STATUSES = new Set(["completed", "draft", "inProgress", "halted"]);
const SELF_SIGNED_JARSIGNER_STRICT = /jarsigner\s+-verify\b[^\n]*-strict/;

function walk(node, visitor, pathParts = []) {
  if (Array.isArray(node)) {
    node.forEach((value, index) => walk(value, visitor, [...pathParts, index]));
    return;
  }

  if (node && typeof node === "object") {
    visitor(node, pathParts);
    for (const [key, value] of Object.entries(node)) {
      walk(value, visitor, [...pathParts, key]);
    }
  }
}

function isEnabled(value) {
  return value === true || value === "true";
}

function referencesRepositoryFile(step) {
  return typeof step?.run === "string" && REPOSITORY_FILE_REFERENCE.test(step.run);
}

function validateUploadGooglePlayStep({ fileName, jobId, step, errors }) {
  const inputs = step.with ?? {};
  if (inputs.track !== undefined) {
    errors.push(`${fileName}: ${jobId} usa el input obsoleto 'track'; debe usar 'tracks'`);
  }
  if (typeof inputs.tracks !== "string" || inputs.tracks.trim() === "") {
    errors.push(`${fileName}: ${jobId} debe declarar 'tracks' para la acción de Play`);
  }

  const status = inputs.status ?? "completed";
  if (!RELEASE_STATUSES.has(status)) {
    errors.push(`${fileName}: ${jobId} usa un estado de Play desconocido: ${status}`);
  }
  const fraction = inputs.userFraction ?? inputs["user-fraction"];
  if (status === "draft" && fraction !== undefined) {
    errors.push(`${fileName}: ${jobId} no puede enviar userFraction con status: draft`);
  }
  if (status === "inProgress" && fraction === undefined) {
    errors.push(`${fileName}: ${jobId} exige userFraction cuando status es inProgress`);
  }
  if (status !== "inProgress" && fraction !== undefined) {
    errors.push(`${fileName}: ${jobId} solo admite userFraction con status: inProgress`);
  }
}

/**
 * Valida las reglas de seguridad aplicables a un workflow de GitHub Actions.
 * No ejecuta el workflow ni sustituye la validación de GitHub.
 */
export function analyzeWorkflow(fileName, content) {
  const errors = [];
  let workflow;

  try {
    workflow = parse(content);
  } catch (error) {
    return [`${fileName}: YAML inválido: ${error.message}`];
  }

  if (!workflow || typeof workflow !== "object") {
    return [`${fileName}: el workflow no contiene un objeto YAML`];
  }

  const triggers = workflow.on;
  if (
    triggers === "pull_request_target" ||
    (Array.isArray(triggers) && triggers.includes("pull_request_target")) ||
    (triggers && typeof triggers === "object" && "pull_request_target" in triggers)
  ) {
    errors.push(`${fileName}: pull_request_target está prohibido para código no confiable`);
  }

  const topPermissions = workflow.permissions;
  if (!topPermissions || typeof topPermissions !== "object") {
    errors.push(`${fileName}: falta permissions explícitos en el workflow`);
  } else if (topPermissions.contents !== "read") {
    errors.push(`${fileName}: permissions.contents debe ser read por defecto`);
  }

  const seenUses = new Set();
  walk(workflow, (node) => {
    if (isEnabled(node["continue-on-error"])) {
      errors.push(`${fileName}: continue-on-error: true oculta fallos y está prohibido`);
    }

    const uses = node.uses;
    if (typeof uses !== "string" || seenUses.has(uses)) {
      return;
    }
    seenUses.add(uses);

    if (SAFE_LOCAL_ACTION.test(uses)) {
      return;
    }
    if (!PINNED_ACTION.test(uses)) {
      errors.push(`${fileName}: acción sin SHA completo: ${uses}`);
    }
  });

  for (const [jobId, job] of Object.entries(workflow.jobs ?? {})) {
    if (!job || typeof job !== "object") {
      errors.push(`${fileName}: job inválido: ${jobId}`);
      continue;
    }
    if (job.permissions && job.permissions.contents === "write-all") {
      errors.push(`${fileName}: ${jobId} no puede usar contents: write-all`);
    }
    if (job.permissions && job.permissions["*"] === "write") {
      errors.push(`${fileName}: ${jobId} no puede elevar todos los permisos a write`);
    }

    let checkoutSeen = false;
    for (const step of job.steps ?? []) {
      if (typeof step?.uses === "string" && step.uses.startsWith("actions/checkout@")) {
        checkoutSeen = true;
        if (step.with?.["persist-credentials"] !== false) {
          errors.push(
            `${fileName}: ${jobId} debe usar persist-credentials: false en actions/checkout`,
          );
        }
      }

      if (referencesRepositoryFile(step) && !checkoutSeen) {
        errors.push(`${fileName}: ${jobId} usa archivos del repositorio antes de actions/checkout`);
      }

      if (
        ["android-release.yml", "play-publish.yml"].includes(fileName) &&
        typeof step?.run === "string" &&
        SELF_SIGNED_JARSIGNER_STRICT.test(step.run)
      ) {
        errors.push(
          `${fileName}: ${jobId} no puede usar jarsigner -strict con la upload key autofirmada`,
        );
      }

      if (typeof step?.uses === "string" && UPLOAD_GOOGLE_PLAY_ACTION.test(step.uses)) {
        if (fileName === PLAY_PUBLISH_WORKFLOW) {
          errors.push(
            `${fileName}: ${jobId} no puede usar upload-google-play; ` +
              "la promoción debe reutilizar el versionCode con la API de Play",
          );
        }
        validateUploadGooglePlayStep({ fileName, jobId, step, errors });
      }
    }
  }

  if (fileName === PLAY_PUBLISH_WORKFLOW) {
    const jobs = Object.entries(workflow.jobs ?? {});
    const steps = jobs.flatMap(([, job]) => job?.steps ?? []);
    const hasCheckout = steps.some(
      (step) => typeof step?.uses === "string" && step.uses.startsWith("actions/checkout@"),
    );
    const hasMainJobGuard = jobs.some(
      ([, job]) => typeof job?.if === "string" && job.if.includes("refs/heads/main"),
    );
    const hasMainRunGuard = steps.some(
      (step) =>
        typeof step?.run === "string" &&
        /GITHUB_REF|WORKFLOW_REF/.test(step.run) &&
        step.run.includes("refs/heads/main"),
    );

    if (!hasCheckout) {
      errors.push(`${fileName}: la publicación privilegiada exige actions/checkout`);
    }
    if (!hasMainJobGuard) {
      errors.push(
        `${fileName}: el job privilegiado debe restringirse con if: github.ref == 'refs/heads/main'`,
      );
    }
    if (!hasMainRunGuard) {
      errors.push(`${fileName}: debe verificar GITHUB_REF/WORKFLOW_REF contra refs/heads/main`);
    }
  }

  return errors;
}

export function analyzeDirectory(directory) {
  const errors = [];
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    errors.push(...analyzeWorkflow(entry.name, fs.readFileSync(fullPath, "utf8")));
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = process.argv[2] ?? ".github/workflows";
  const errors = analyzeDirectory(directory);
  if (errors.length > 0) {
    errors.forEach((error) => console.error(`ERROR ${error}`));
    process.exitCode = 1;
  } else {
    console.log(`OK ${directory}: workflows con permisos, eventos y acciones verificados`);
  }
}
