import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildCommitRequest,
  buildTrackUpdate,
  createSignedJwt,
  decideBundleAction,
  findBundle,
  findTestingTracks,
  parseServiceAccountJson,
  performPlayRelease,
  readAppConfig,
  resolveTrackName,
  validateMetadataForPlay,
  validateReleasePlan,
  validateTrackUpdateResponse,
} from "./play-release.mjs";

const SHA_A = "a".repeat(64);

test("acepta app.json válido y rechaza versionCode inválido", () => {
  assert.deepEqual(
    readAppConfig({
      expo: {
        version: "1.2.3",
        android: { package: "mx.unihome.app", versionCode: 1000000 },
      },
    }),
    {
      packageName: "mx.unihome.app",
      versionCode: 1000000,
      versionName: "1.2.3",
    },
  );
  assert.throws(
    () =>
      readAppConfig({
        expo: { version: "1.2.3", android: { package: "mx.unihome.app", versionCode: 0 } },
      }),
    /versionCode/,
  );
});

test("exige el identificador real de la pista cerrada", () => {
  assert.equal(
    resolveTrackName({
      target: "closed",
      closedTrack: "closed-qa",
      availableTracks: ["internal", "closed-qa", "production"],
    }),
    "closed-qa",
  );
  assert.throws(
    () =>
      resolveTrackName({
        target: "closed",
        closedTrack: "",
        availableTracks: ["internal", "closed-qa"],
      }),
    /PLAY_CLOSED_TRACK/,
  );
  assert.throws(
    () =>
      resolveTrackName({
        target: "closed",
        closedTrack: "closed-qa",
        availableTracks: ["internal", "production"],
      }),
    /no existe/,
  );
  for (const closedTrack of ["internal", "production", "wear:production"]) {
    assert.throws(
      () =>
        resolveTrackName({
          target: "closed",
          closedTrack,
          availableTracks: [closedTrack],
        }),
      /pista cerrada/,
    );
  }
});

test("producción queda draft por defecto y no envía userFraction", () => {
  const plan = validateReleasePlan({
    target: "production",
    productionRelease: "draft",
  });
  assert.equal(plan.status, "draft");
  assert.equal(plan.userFraction, undefined);
  assert.equal(plan.changesNotSentForReview, true);

  const body = buildTrackUpdate({
    trackName: plan.trackName,
    status: plan.status,
    versionCode: 1000000,
    versionName: "1.0.0",
    userFraction: plan.userFraction,
  });
  assert.deepEqual(body.releases[0], {
    name: "1.0.0",
    versionCodes: ["1000000"],
    status: "draft",
  });
  assert.equal("userFraction" in body.releases[0], false);
});

test("rechaza combinaciones incompatibles de estado y rollout", () => {
  assert.throws(
    () =>
      validateReleasePlan({
        target: "production",
        productionRelease: "draft",
        userFraction: "0.05",
      }),
    /draft no admite userFraction/,
  );
  assert.throws(
    () =>
      validateReleasePlan({
        target: "production",
        productionRelease: "staged",
      }),
    /exige userFraction/,
  );
  assert.throws(
    () =>
      validateReleasePlan({
        target: "production",
        productionRelease: "staged",
        userFraction: "1",
      }),
    /mayor que 0/,
  );
  assert.throws(
    () =>
      validateReleasePlan({
        target: "internal",
        productionRelease: "staged",
        userFraction: "0.05",
      }),
    /Solo producción/,
  );
});

test("un rollout escalonado solo usa inProgress con fracción válida", () => {
  const plan = validateReleasePlan({
    target: "production",
    productionRelease: "staged",
    userFraction: "0.25",
  });
  assert.equal(plan.status, "inProgress");
  assert.equal(plan.userFraction, 0.25);
  assert.equal(plan.changesNotSentForReview, false);

  const body = buildTrackUpdate({
    trackName: plan.trackName,
    status: plan.status,
    versionCode: 1000000,
    versionName: "1.0.0",
    userFraction: plan.userFraction,
  });
  assert.equal(body.releases[0].userFraction, 0.25);
  assert.equal(buildCommitRequest({ status: plan.status }).changesNotSentForReview, false);
});

test("internal y closed se completan sin subir el mismo AAB si ya existe", () => {
  const plan = validateReleasePlan({
    target: "closed",
    closedTrack: "closed-qa",
    availableTracks: ["internal", "closed-qa", "production"],
  });
  assert.equal(plan.status, "completed");
  assert.equal(plan.trackName, "closed-qa");
  assert.equal(plan.userFraction, undefined);
  assert.equal(buildCommitRequest({ status: plan.status }).changesNotSentForReview, false);

  const decision = decideBundleAction({
    target: "closed",
    bundle: { versionCode: 1000000, sha256: SHA_A },
    versionCode: 1000000,
    sha256: SHA_A,
  });
  assert.deepEqual(decision, { action: "reuse", sourceTracks: [] });
});

test("sube un AAB nuevo solo a pistas de prueba", () => {
  assert.deepEqual(
    decideBundleAction({
      target: "internal",
      bundle: undefined,
      versionCode: 1000000,
      sha256: SHA_A,
    }),
    { action: "upload", sourceTracks: [] },
  );
  assert.throws(
    () =>
      decideBundleAction({
        target: "production",
        bundle: undefined,
        versionCode: 1000000,
        sha256: SHA_A,
      }),
    /directamente a producción/,
  );
});

test("producción solo promociona un versionCode ya probado", () => {
  const tracks = [
    { track: "internal", releases: [{ versionCodes: ["1000000"], status: "completed" }] },
    { track: "production", releases: [] },
  ];
  assert.deepEqual(findTestingTracks(tracks, 1000000), ["internal"]);
  assert.deepEqual(
    findTestingTracks(
      [
        {
          track: "internal",
          releases: [{ versionCodes: ["1000000"], status: "draft" }],
        },
        {
          track: "closed-qa",
          releases: [{ versionCodes: ["1000000"], status: "halted" }],
        },
        {
          track: "wear:production",
          releases: [{ versionCodes: ["1000000"], status: "completed" }],
        },
      ],
      1000000,
    ),
    [],
  );
  assert.deepEqual(
    decideBundleAction({
      target: "production",
      bundle: { versionCode: 1000000, sha256: SHA_A },
      versionCode: 1000000,
      sha256: SHA_A,
      testingTracks: tracks,
    }),
    { action: "reuse", sourceTracks: ["internal"] },
  );
  assert.throws(
    () =>
      decideBundleAction({
        target: "production",
        bundle: { versionCode: 1000000, sha256: SHA_A },
        versionCode: 1000000,
        sha256: SHA_A,
        testingTracks: [{ track: "production", releases: [] }],
      }),
    /pista de pruebas/,
  );
});

test("rechaza reutilizar un versionCode con otro SHA256", () => {
  assert.throws(
    () =>
      decideBundleAction({
        target: "internal",
        bundle: { versionCode: 1000000, sha256: "b".repeat(64) },
        versionCode: 1000000,
        sha256: SHA_A,
      }),
    /otro SHA256/,
  );
  assert.equal(findBundle([{ versionCode: 1000000 }], "1000000")?.versionCode, 1000000);
});

test("valida la respuesta de la pista y detecta userFraction en draft", () => {
  assert.throws(
    () =>
      validateTrackUpdateResponse(
        {
          track: "production",
          releases: [{ versionCodes: ["1000000"], status: "draft", userFraction: 0.05 }],
        },
        {
          trackName: "production",
          status: "draft",
          versionCode: 1000000,
          userFraction: undefined,
        },
      ),
    /userFraction/,
  );
});

test("parsea cuentas de servicio y firma JWT RS256 con clave efímera", () => {
  assert.deepEqual(
    parseServiceAccountJson(
      JSON.stringify({
        type: "service_account",
        client_email: "robot@example.test",
        private_key: "fake-key-material",
      }),
    ),
    {
      clientEmail: "robot@example.test",
      privateKey: "fake-key-material",
    },
  );
  assert.throws(
    () => parseServiceAccountJson(JSON.stringify({ type: "authorized_user" })),
    /cuenta de servicio/,
  );

  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  const jwt = createSignedJwt({
    clientEmail: "robot@example.test",
    privateKey: privateKey.export({ type: "pkcs8", format: "pem" }),
    now: 1_700_000_000,
  });
  const [header, payload, signature] = jwt.split(".");
  assert.equal(JSON.parse(Buffer.from(header, "base64url").toString()).alg, "RS256");
  assert.equal(JSON.parse(Buffer.from(payload, "base64url").toString()).iss, "robot@example.test");
  assert.equal(
    crypto.verify(
      "RSA-SHA256",
      Buffer.from(`${header}.${payload}`),
      publicKey,
      Buffer.from(signature, "base64url"),
    ),
    true,
  );
});

test("valida metadata de Play contra app, SHA, commit y run", () => {
  const app = {
    packageName: "mx.unihome.app",
    versionCode: 1000000,
    versionName: "1.0.0",
  };
  const metadata = {
    commit: "a".repeat(40),
    runId: "12345",
    ref: "refs/heads/main",
    package: app.packageName,
    versionCode: app.versionCode,
    versionName: app.versionName,
    sha256: SHA_A,
    sizeBytes: 123456,
  };
  assert.doesNotThrow(() =>
    validateMetadataForPlay({
      metadata,
      app,
      sha256: SHA_A,
      sizeBytes: 123456,
      expectedCommit: "a".repeat(40),
      expectedRunId: "12345",
    }),
  );
  assert.throws(
    () =>
      validateMetadataForPlay({
        metadata: { ...metadata, versionCode: 1 },
        app,
        sha256: SHA_A,
        sizeBytes: 123456,
        expectedCommit: "a".repeat(40),
        expectedRunId: "12345",
      }),
    /versionCode/,
  );
  assert.throws(
    () =>
      validateMetadataForPlay({
        metadata: { ...metadata, runId: "999" },
        app,
        sha256: SHA_A,
        sizeBytes: 123456,
        expectedCommit: "a".repeat(40),
        expectedRunId: "12345",
      }),
    /run/,
  );
});

function writeSyntheticAab(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "unihome-play-test-"));
  const aabPath = path.join(directory, "unihome-release.aab");
  const contents = Buffer.alloc(100_001, 7);
  fs.writeFileSync(aabPath, contents);
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return {
    aabPath,
    sha256: crypto.createHash("sha256").update(contents).digest("hex"),
  };
}

test("sube un AAB nuevo a una pista de prueba y confirma el edit", async (t) => {
  const { aabPath, sha256 } = writeSyntheticAab(t);
  const calls = { uploaded: false, committed: false, deleted: false };
  const client = {
    async createEdit() {
      return { id: "edit-1" };
    },
    async listTracks() {
      return { tracks: [{ track: "internal", releases: [] }] };
    },
    async listBundles() {
      return { bundles: [] };
    },
    async uploadBundle() {
      calls.uploaded = true;
      return { versionCode: 1000000, sha256 };
    },
    async updateTrack(_editId, _trackName, body) {
      assert.deepEqual(body.releases[0].versionCodes, ["1000000"]);
      return {
        track: "internal",
        releases: [{ versionCodes: ["1000000"], status: "completed" }],
      };
    },
    async commitEdit(_editId, options) {
      calls.committed = true;
      assert.equal(options.changesNotSentForReview, false);
    },
    async deleteEdit() {
      calls.deleted = true;
    },
  };

  const result = await performPlayRelease({
    client,
    aabPath,
    versionCode: 1000000,
    versionName: "1.0.0",
    plan: validateReleasePlan({ target: "internal" }),
  });
  assert.equal(result.uploaded, true);
  assert.equal(result.reused, false);
  assert.equal(result.sha256, sha256);
  assert.deepEqual(calls, { uploaded: true, committed: true, deleted: false });
});

test("promociona por versionCode sin volver a subir el AAB", async (t) => {
  const { aabPath, sha256 } = writeSyntheticAab(t);
  const calls = { uploaded: false, committed: false };
  const client = {
    async createEdit() {
      return { id: "edit-2" };
    },
    async listTracks() {
      return {
        tracks: [
          { track: "internal", releases: [{ versionCodes: ["1000000"], status: "completed" }] },
          { track: "production", releases: [] },
        ],
      };
    },
    async listBundles() {
      return { bundles: [{ versionCode: 1000000, sha256 }] };
    },
    async uploadBundle() {
      calls.uploaded = true;
      throw new Error("no debe subir un AAB ya existente");
    },
    async updateTrack(_editId, _trackName, body) {
      assert.equal(body.releases[0].status, "draft");
      assert.equal("userFraction" in body.releases[0], false);
      return {
        track: "production",
        releases: [{ versionCodes: ["1000000"], status: "draft" }],
      };
    },
    async commitEdit(_editId, options) {
      calls.committed = true;
      assert.equal(options.changesNotSentForReview, true);
    },
    async deleteEdit() {
      throw new Error("no debe borrar un edit confirmado");
    },
  };

  const result = await performPlayRelease({
    client,
    aabPath,
    versionCode: 1000000,
    versionName: "1.0.0",
    plan: validateReleasePlan({ target: "production", productionRelease: "draft" }),
  });
  assert.equal(result.uploaded, false);
  assert.equal(result.reused, true);
  assert.deepEqual(result.sourceTracks, ["internal"]);
  assert.deepEqual(calls, { uploaded: false, committed: true });
});

test("borra el edit si la promoción falla antes de confirmar", async (t) => {
  const { aabPath, sha256 } = writeSyntheticAab(t);
  let deleted = false;
  const client = {
    async createEdit() {
      return { id: "edit-3" };
    },
    async listTracks() {
      return { tracks: [{ track: "production", releases: [] }] };
    },
    async listBundles() {
      return { bundles: [{ versionCode: 1000000, sha256 }] };
    },
    async uploadBundle() {
      throw new Error("no aplica");
    },
    async updateTrack() {
      throw new Error("no aplica");
    },
    async commitEdit() {
      throw new Error("no aplica");
    },
    async deleteEdit() {
      deleted = true;
    },
  };

  await assert.rejects(
    performPlayRelease({
      client,
      aabPath,
      versionCode: 1000000,
      versionName: "1.0.0",
      plan: validateReleasePlan({ target: "production", productionRelease: "draft" }),
    }),
    /pista de pruebas/,
  );
  assert.equal(deleted, true);
});
