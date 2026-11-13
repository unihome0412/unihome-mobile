import assert from "node:assert/strict";
import test from "node:test";
import {
  validateArtifactList,
  validateReleaseMetadata,
  validateReleaseRun,
  validateSha256File,
} from "./release-provenance.mjs";

const HEAD_SHA = "a".repeat(40);
const SHA256 = "b".repeat(64);
const REPOSITORY = "unihome0412/unihome-mobile";

function makeRun(overrides = {}) {
  return {
    id: 12345,
    event: "workflow_dispatch",
    status: "completed",
    conclusion: "success",
    path: ".github/workflows/android-release.yml",
    head_branch: "main",
    head_sha: HEAD_SHA,
    run_attempt: 2,
    repository: { full_name: REPOSITORY },
    head_repository: { full_name: REPOSITORY },
    head_commit: { id: HEAD_SHA },
    ...overrides,
  };
}

function makeArtifacts(overrides = {}) {
  return {
    total_count: 1,
    artifacts: [
      {
        id: 987,
        name: "unihome-release-aab",
        expired: false,
        size_in_bytes: 123456,
        workflow_run: {
          id: 12345,
          head_branch: "main",
          head_sha: HEAD_SHA,
        },
        ...overrides,
      },
    ],
  };
}

function makeMetadata(overrides = {}) {
  return {
    commit: HEAD_SHA,
    ref: "refs/heads/main",
    runId: "12345",
    runAttempt: "2",
    package: "mx.unihome.app",
    versionCode: 1000000,
    versionName: "1.0.0",
    sha256: SHA256,
    sizeBytes: 123456,
    ...overrides,
  };
}

test("acepta un run de release exitoso de main y del repositorio autorizado", () => {
  assert.deepEqual(
    validateReleaseRun(makeRun(), {
      expectedRunId: "12345",
      repository: REPOSITORY,
    }),
    { id: 12345, headSha: HEAD_SHA, runAttempt: 2 },
  );
});

test("rechaza run de otra rama, evento, workflow o repositorio", () => {
  assert.throws(
    () =>
      validateReleaseRun(makeRun({ head_branch: "feature/x" }), {
        expectedRunId: "12345",
        repository: REPOSITORY,
      }),
    /rama main/,
  );
  assert.throws(
    () =>
      validateReleaseRun(makeRun({ event: "push" }), {
        expectedRunId: "12345",
        repository: REPOSITORY,
      }),
    /workflow_dispatch/,
  );
  assert.throws(
    () =>
      validateReleaseRun(makeRun({ path: ".github/workflows/otro.yml" }), {
        expectedRunId: "12345",
        repository: REPOSITORY,
      }),
    /android-release/,
  );
  assert.throws(
    () =>
      validateReleaseRun(makeRun({ head_repository: { full_name: "fork/repo" } }), {
        expectedRunId: "12345",
        repository: REPOSITORY,
      }),
    /repositorio autorizado/,
  );
});

test("rechaza run fallido o con id distinto", () => {
  assert.throws(
    () =>
      validateReleaseRun(makeRun({ conclusion: "failure" }), {
        expectedRunId: "12345",
        repository: REPOSITORY,
      }),
    /completado con éxito/,
  );
  assert.throws(
    () =>
      validateReleaseRun(makeRun(), {
        expectedRunId: "99999",
        repository: REPOSITORY,
      }),
    /release_run_id/,
  );
});

test("exige exactamente un artefacto vigente del mismo run y head", () => {
  assert.deepEqual(
    validateArtifactList(makeArtifacts(), {
      expectedRunId: "12345",
      artifactName: "unihome-release-aab",
      headSha: HEAD_SHA,
    }),
    { id: 987, name: "unihome-release-aab", sizeInBytes: 123456 },
  );
  assert.throws(
    () =>
      validateArtifactList(makeArtifacts({ expired: true }), {
        expectedRunId: "12345",
        artifactName: "unihome-release-aab",
        headSha: HEAD_SHA,
      }),
    /exactamente un artefacto/,
  );
  assert.throws(
    () =>
      validateArtifactList(
        makeArtifacts({ workflow_run: { id: 12345, head_sha: "c".repeat(40) } }),
        {
          expectedRunId: "12345",
          artifactName: "unihome-release-aab",
          headSha: HEAD_SHA,
        },
      ),
    /exactamente un artefacto/,
  );
});

test("valida SHA256 registrado y metadatos completos del AAB", () => {
  assert.doesNotThrow(() => validateSha256File(`${SHA256}  unihome-release.aab\n`, SHA256));
  assert.throws(() => validateSha256File(`${"c".repeat(64)}  aab\n`, SHA256), /no coincide/);

  const run = validateReleaseRun(makeRun(), {
    expectedRunId: "12345",
    repository: REPOSITORY,
  });
  const app = {
    version: "1.0.0",
    android: { package: "mx.unihome.app", versionCode: 1000000 },
  };
  assert.deepEqual(
    validateReleaseMetadata({
      metadata: makeMetadata(),
      app,
      run,
      sha256: SHA256,
      sizeBytes: 123456,
      expectedVersionCode: 1000000,
    }),
    {
      commit: HEAD_SHA,
      package: "mx.unihome.app",
      versionCode: 1000000,
      versionName: "1.0.0",
      sha256: SHA256,
      sizeBytes: 123456,
    },
  );
});

test("detecta commit, runAttempt, versionCode o SHA256 incoherentes", () => {
  const run = validateReleaseRun(makeRun(), {
    expectedRunId: "12345",
    repository: REPOSITORY,
  });
  const app = {
    version: "1.0.0",
    android: { package: "mx.unihome.app", versionCode: 1000000 },
  };
  const base = {
    metadata: makeMetadata(),
    app,
    run,
    sha256: SHA256,
    sizeBytes: 123456,
  };

  assert.throws(
    () => validateReleaseMetadata({ ...base, metadata: makeMetadata({ commit: "d".repeat(40) }) }),
    /commit/,
  );
  assert.throws(
    () => validateReleaseMetadata({ ...base, metadata: makeMetadata({ runAttempt: "1" }) }),
    /runAttempt/,
  );
  assert.throws(
    () => validateReleaseMetadata({ ...base, metadata: makeMetadata({ versionCode: 999 }) }),
    /versionCode/,
  );
  assert.throws(
    () => validateReleaseMetadata({ ...base, metadata: makeMetadata({ sha256: "e".repeat(64) }) }),
    /SHA256/,
  );
  assert.throws(
    () => validateReleaseMetadata({ ...base, metadata: makeMetadata({ sizeBytes: 1 }) }),
    /tamaño/,
  );
});
