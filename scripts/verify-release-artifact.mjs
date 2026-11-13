import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const aab = getArg("--aab");
const shaFile = getArg("--sha256-file");
const metadataFile = getArg("--metadata");
const expectedVersionCode = getArg("--expected-version-code");

if (!aab || !shaFile || !metadataFile) {
  throw new Error(
    "Uso: node scripts/verify-release-artifact.mjs --aab <ruta> --sha256-file <ruta> --metadata <ruta> [--expected-version-code N]",
  );
}

const appJson = JSON.parse(fs.readFileSync("app.json", "utf8")).expo;
const android = appJson.android;
const stat = fs.statSync(aab);
if (stat.size < 100_000) {
  throw new Error(`${aab}: tamaño sospechoso (${stat.size} bytes); no parece un AAB real`);
}

const sha256 = crypto.createHash("sha256").update(fs.readFileSync(aab)).digest("hex");
fs.writeFileSync(shaFile, `${sha256}  ${path.basename(aab)}\n`);

const expectedSha = fs.readFileSync(shaFile, "utf8").trim().split(/\s+/)[0];
if (expectedSha !== sha256) {
  throw new Error(`${shaFile}: el SHA256 registrado no coincide con el artefacto`);
}
if (expectedVersionCode && Number(expectedVersionCode) !== android.versionCode) {
  throw new Error(
    `versionCode de app.json (${android.versionCode}) no coincide con el autorizado (${expectedVersionCode})`,
  );
}

const metadata = {
  package: android.package,
  versionCode: android.versionCode,
  versionName: appJson.version,
  sha256,
  sizeBytes: stat.size,
  commit: process.env.GITHUB_SHA ?? "NO_DISPONIBLE",
  ref: process.env.GITHUB_REF ?? "NO_DISPONIBLE",
  runId: process.env.GITHUB_RUN_ID ?? "NO_DISPONIBLE",
  runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? "NO_DISPONIBLE",
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);

console.log(`AAB: ${aab}`);
console.log(
  `package=${metadata.package} versionCode=${metadata.versionCode} versionName=${metadata.versionName}`,
);
console.log(`bytes=${metadata.sizeBytes} sha256=${metadata.sha256}`);
