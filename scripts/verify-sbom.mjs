import fs from "node:fs";

const file = process.argv[2] ?? "reports/sbom.cdx.json";
const bom = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));

if (bom.bomFormat !== "CycloneDX") {
  throw new Error(`${file}: no es un SBOM CycloneDX`);
}
if (!Array.isArray(bom.components) || bom.components.length === 0) {
  throw new Error(`${file}: no contiene componentes`);
}

const message = `SBOM CycloneDX válido: ${bom.components.length} componentes (${bom.specVersion})`;
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
}
console.log(message);
