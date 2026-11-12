import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const PINNED_ACTION = /^[^@\s]+@[0-9a-f]{40}$/;
const SAFE_LOCAL_ACTION = /^\.\/.+/;

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

    for (const step of job.steps ?? []) {
      if (typeof step?.uses === "string" && step.uses.startsWith("actions/checkout@")) {
        if (step.with?.["persist-credentials"] !== false) {
          errors.push(
            `${fileName}: ${jobId} debe usar persist-credentials: false en actions/checkout`,
          );
        }
      }
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
