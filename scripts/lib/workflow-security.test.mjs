import assert from "node:assert/strict";
import test from "node:test";
import { analyzeWorkflow } from "./workflow-security.mjs";

const CHECKOUT = "actions/checkout@11d5960a326750d5838078e36cf38b85af677262";
const SETUP_NODE = "actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020";

function makeWorkflow(overrides = "") {
  return `
name: Prueba
on:
  pull_request:
    branches: [main]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: ${CHECKOUT}
        with:
          persist-credentials: false
      - uses: ${SETUP_NODE}
${overrides}
`;
}

test("acepta un workflow con permisos mínimos y acciones fijadas", () => {
  assert.deepEqual(analyzeWorkflow("ok.yml", makeWorkflow()), []);
});

test("rechaza pull_request_target", () => {
  const workflow = makeWorkflow().replace("pull_request:", "pull_request_target:");
  assert.match(analyzeWorkflow("fork.yml", workflow).join("\n"), /pull_request_target/);
});

test("rechaza acciones sin SHA completo", () => {
  const workflow = makeWorkflow().replace(SETUP_NODE, "actions/setup-node@v4");
  assert.match(analyzeWorkflow("pin.yml", workflow).join("\n"), /sin SHA completo/);
});

test("rechaza continue-on-error y checkout con credenciales persistentes", () => {
  const workflow = makeWorkflow(
    "      - run: echo oculto\n        continue-on-error: true",
  ).replace("          persist-credentials: false", "          persist-credentials: true");
  const errors = analyzeWorkflow("unsafe.yml", workflow).join("\n");
  assert.match(errors, /continue-on-error/);
  assert.match(errors, /persist-credentials/);
});

test("rechaza permisos de escritura globales", () => {
  const workflow = makeWorkflow().replace("contents: read", "contents: write");
  assert.match(analyzeWorkflow("write.yml", workflow).join("\n"), /contents debe ser read/);
});

test("rechaza jarsigner -strict con la upload key autofirmada", () => {
  const strict = makeWorkflow(`
      - run: jarsigner -verify -strict -certs app-release.aab
`);
  assert.match(analyzeWorkflow("android-release.yml", strict).join("\n"), /jarsigner -strict/);

  const safe = makeWorkflow(`
      - run: jarsigner -verify -certs app-release.aab
`);
  assert.deepEqual(analyzeWorkflow("android-release.yml", safe), []);
});

test("rechaza usar archivos del repositorio antes de actions/checkout", () => {
  const workflow = `
name: Prueba
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: node -e "require('./app.json')"
      - uses: ${CHECKOUT}
        with:
          persist-credentials: false
`;
  assert.match(analyzeWorkflow("orden.yml", workflow).join("\n"), /antes de actions\/checkout/);
});

function makePlayWorkflow({ jobIf = "github.ref == 'refs/heads/main'", withAction = false } = {}) {
  const action = withAction
    ? `
      - uses: r0adkll/upload-google-play@e738b9dd8f2476ea806d921b64aacd24f34515a5
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: mx.unihome.app
          releaseFiles: release/unihome-release.aab
          tracks: internal
          status: completed`
    : "";
  return `
name: Play
on:
  workflow_dispatch:
permissions:
  contents: read
  actions: read
jobs:
  publish:
    runs-on: ubuntu-latest
    ${jobIf ? `if: ${jobIf}` : ""}
    steps:
      - uses: ${CHECKOUT}
        with:
          persist-credentials: false
      - run: test "\${WORKFLOW_REF}" = "refs/heads/main"
      - run: node scripts/play-release.mjs
      - run: node scripts/verify-play-provenance.mjs
${action}
`;
}

test("exige checkout y doble guardia de main en play-publish.yml", () => {
  assert.deepEqual(analyzeWorkflow("play-publish.yml", makePlayWorkflow()), []);

  const withoutJobGuard = makePlayWorkflow({ jobIf: "" });
  assert.match(
    analyzeWorkflow("play-publish.yml", withoutJobGuard).join("\n"),
    /if: github\.ref == 'refs\/heads\/main'/,
  );

  const withoutRunGuard = makePlayWorkflow().replace(
    '      - run: test "${WORKFLOW_REF}" = "refs/heads/main"\n',
    "",
  );
  assert.match(
    analyzeWorkflow("play-publish.yml", withoutRunGuard).join("\n"),
    /GITHUB_REF\/WORKFLOW_REF/,
  );
});

test("rechaza upload-google-play en play-publish y valida tracks/estado", () => {
  const play = analyzeWorkflow("play-publish.yml", makePlayWorkflow({ withAction: true })).join(
    "\n",
  );
  assert.match(play, /no puede usar upload-google-play/);

  const obsolete = makeWorkflow(`
      - uses: r0adkll/upload-google-play@e738b9dd8f2476ea806d921b64aacd24f34515a5
        with:
          packageName: mx.unihome.app
          releaseFiles: release/unihome-release.aab
          track: internal
          status: draft
          userFraction: "0.05"
  `);
  const errors = analyzeWorkflow("upload.yml", obsolete).join("\n");
  assert.match(errors, /input obsoleto 'track'/);
  assert.match(errors, /debe declarar 'tracks'/);
  assert.match(errors, /no puede enviar userFraction con status: draft/);

  const missingFraction = makeWorkflow(`
      - uses: r0adkll/upload-google-play@e738b9dd8f2476ea806d921b64aacd24f34515a5
        with:
          packageName: mx.unihome.app
          releaseFiles: release/unihome-release.aab
          tracks: internal
          status: inProgress
  `);
  assert.match(analyzeWorkflow("upload.yml", missingFraction).join("\n"), /exige userFraction/);
});
