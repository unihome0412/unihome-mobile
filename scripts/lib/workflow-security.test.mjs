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
