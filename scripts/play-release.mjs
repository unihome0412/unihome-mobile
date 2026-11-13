import fs from "node:fs";
import {
  createPlayClient,
  parseServiceAccountJson,
  performPlayRelease,
  readAppConfig,
  sha256File,
  validateMetadataForPlay,
  validateReleasePlan,
} from "./lib/play-release.mjs";

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const appJsonPath = getArg("--app-json") ?? "app.json";
const aabPath = getArg("--aab");
const metadataPath = getArg("--metadata");
const target = getArg("--target");
const productionRelease = getArg("--production-release") ?? "draft";
const userFraction = getArg("--user-fraction");
const closedTrack = getArg("--closed-track");
const expectedCommit = getArg("--expected-commit");
const expectedRunId = getArg("--expected-run-id");
const resultPath = getArg("--result-json") ?? "play-result.json";

if (!aabPath || !metadataPath || !target || !expectedCommit || !expectedRunId) {
  throw new Error(
    "Uso: node scripts/play-release.mjs --aab <ruta> --metadata <ruta> " +
      "--target internal|closed|production --expected-commit <sha> " +
      "--expected-run-id <id> [--production-release draft|staged] " +
      "[--user-fraction 0.05] [--closed-track <id>] [--result-json <ruta>]",
  );
}
if (!/^[0-9a-f]{40}$/.test(expectedCommit)) {
  throw new Error("--expected-commit debe ser un SHA de 40 caracteres hexadecimales");
}
if (!/^[0-9]+$/.test(expectedRunId)) {
  throw new Error("--expected-run-id debe ser numérico");
}

const app = readAppConfig(JSON.parse(fs.readFileSync(appJsonPath, "utf8")));
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
const sizeBytes = fs.statSync(aabPath).size;
if (sizeBytes < 100_000) {
  throw new Error(`${aabPath}: tamaño sospechoso; no parece un AAB real`);
}
const sha256 = sha256File(aabPath);

validateMetadataForPlay({
  metadata,
  app,
  sha256,
  sizeBytes,
  expectedCommit,
  expectedRunId,
});

const plan = validateReleasePlan({
  target,
  productionRelease,
  userFraction,
  closedTrack,
});

const serviceAccount = parseServiceAccountJson(process.env.PLAY_SERVICE_ACCOUNT_JSON);
const client = createPlayClient({
  serviceAccount,
  packageName: app.packageName,
});

const result = await performPlayRelease({
  client,
  aabPath,
  versionCode: app.versionCode,
  versionName: app.versionName,
  plan,
});

fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(
  `Google Play: target=${result.target} track=${result.trackName} ` +
    `status=${result.status} versionCode=${result.versionCode} ` +
    `uploaded=${result.uploaded} reused=${result.reused}`,
);
