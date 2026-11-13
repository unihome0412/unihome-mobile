const SHA_PATTERN = /^[0-9a-f]{40}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function normalizeSha256(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function validateReleaseRun(run, { expectedRunId, repository }) {
  if (!run || typeof run !== "object") {
    throw new Error("El metadata del run de release está vacío");
  }
  if (String(run.id) !== String(expectedRunId)) {
    throw new Error("El run consultado no coincide con release_run_id");
  }
  if (run.event !== "workflow_dispatch") {
    throw new Error("El run del AAB no fue iniciado con workflow_dispatch");
  }
  if (run.status !== "completed" || run.conclusion !== "success") {
    throw new Error("El run del AAB no está completado con éxito");
  }
  if (run.path !== ".github/workflows/android-release.yml") {
    throw new Error("El run no corresponde a android-release.yml");
  }
  if (run.head_branch !== "main") {
    throw new Error("El run del AAB no proviene de la rama main");
  }
  if (!SHA_PATTERN.test(String(run.head_sha ?? ""))) {
    throw new Error("El run no contiene un head_sha válido");
  }
  if (!Number.isSafeInteger(run.run_attempt) || run.run_attempt < 1) {
    throw new Error("El run no contiene un run_attempt válido");
  }
  if (run.repository?.full_name !== repository) {
    throw new Error("El run no pertenece al repositorio autorizado");
  }
  if (run.head_repository?.full_name !== repository) {
    throw new Error("El run no proviene del repositorio autorizado");
  }
  if (run.head_commit?.id && String(run.head_commit.id) !== String(run.head_sha)) {
    throw new Error("head_commit no coincide con head_sha en el run");
  }

  return {
    id: run.id,
    headSha: run.head_sha,
    runAttempt: run.run_attempt,
  };
}

export function validateArtifactList(artifactList, { expectedRunId, artifactName, headSha }) {
  const matches = (artifactList?.artifacts ?? []).filter(
    (artifact) =>
      artifact.name === artifactName &&
      artifact.expired === false &&
      String(artifact.workflow_run?.id) === String(expectedRunId) &&
      artifact.workflow_run?.head_branch === "main" &&
      artifact.workflow_run?.head_sha === headSha,
  );

  if (matches.length !== 1) {
    throw new Error(
      `Se esperaba exactamente un artefacto ${artifactName} vigente del run ${expectedRunId}; ` +
        `encontrados: ${matches.length}`,
    );
  }
  if (!Number.isSafeInteger(matches[0].id)) {
    throw new Error("El artefacto del AAB no tiene un id válido");
  }

  return {
    id: matches[0].id,
    name: matches[0].name,
    sizeInBytes: matches[0].size_in_bytes,
  };
}

export function validateSha256File(contents, sha256) {
  const expected = normalizeSha256(sha256);
  if (!SHA256_PATTERN.test(expected)) {
    throw new Error("El SHA256 del AAB no es válido");
  }
  const recorded = normalizeSha256(
    String(contents ?? "")
      .trim()
      .split(/\s+/)[0],
  );
  if (recorded !== expected) {
    throw new Error("El archivo .sha256 no coincide con el AAB descargado");
  }
}

export function validateReleaseMetadata({
  metadata,
  app,
  run,
  sha256,
  sizeBytes,
  expectedVersionCode,
}) {
  const expectedSha = normalizeSha256(sha256);
  if (!SHA256_PATTERN.test(expectedSha)) {
    throw new Error("El SHA256 del AAB no es válido");
  }
  if (metadata?.commit !== run.headSha) {
    throw new Error("El commit del metadata no coincide con el head_sha del run");
  }
  if (metadata?.ref !== "refs/heads/main") {
    throw new Error("El metadata del AAB no fue generado desde refs/heads/main");
  }
  if (String(metadata?.runId) !== String(run.id)) {
    throw new Error("El runId del metadata no coincide con el run consultado");
  }
  if (String(metadata?.runAttempt) !== String(run.runAttempt)) {
    throw new Error("El runAttempt del metadata no coincide con el intento del run");
  }
  if (metadata?.package !== app.android?.package) {
    throw new Error("El applicationId del metadata no coincide con app.json del commit");
  }
  if (Number(metadata?.versionCode) !== app.android?.versionCode) {
    throw new Error("El versionCode del metadata no coincide con app.json del commit");
  }
  if (metadata?.versionName !== app.version) {
    throw new Error("El versionName del metadata no coincide con app.json del commit");
  }
  if (normalizeSha256(metadata?.sha256) !== expectedSha) {
    throw new Error("El SHA256 del metadata no coincide con el AAB descargado");
  }
  if (Number(metadata?.sizeBytes) !== Number(sizeBytes)) {
    throw new Error("El tamaño del metadata no coincide con el AAB descargado");
  }
  if (
    expectedVersionCode !== undefined &&
    Number(expectedVersionCode) !== Number(metadata?.versionCode)
  ) {
    throw new Error("El versionCode no coincide con el autorizado");
  }

  return {
    commit: metadata.commit,
    package: metadata.package,
    versionCode: metadata.versionCode,
    versionName: metadata.versionName,
    sha256: expectedSha,
    sizeBytes: Number(sizeBytes),
  };
}
