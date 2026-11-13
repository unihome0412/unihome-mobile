import fs from "node:fs";
import { sha256File } from "./lib/play-release.mjs";
import {
  validateArtifactList,
  validateReleaseMetadata,
  validateReleaseRun,
  validateSha256File,
} from "./lib/release-provenance.mjs";

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const releaseRunPath = getArg("--release-run");
const artifactsPath = getArg("--artifacts");
const metadataPath = getArg("--metadata");
const aabPath = getArg("--aab");
const sha256Path = getArg("--sha256-file");
const appJsonPath = getArg("--app-json") ?? "app.json";
const expectedRunId = getArg("--expected-run-id");
const repository = getArg("--repository");
const artifactName = getArg("--artifact-name") ?? "unihome-release-aab";
const expectedVersionCode = getArg("--expected-version-code");

if (
  !releaseRunPath ||
  !artifactsPath ||
  !metadataPath ||
  !aabPath ||
  !sha256Path ||
  !expectedRunId ||
  !repository
) {
  throw new Error(
    "Uso: node scripts/verify-play-provenance.mjs --release-run <json> " +
      "--artifacts <json> --metadata <json> --aab <ruta> --sha256-file <ruta> " +
      "--expected-run-id <id> --repository <owner/repo> " +
      "[--app-json <ruta>] [--artifact-name <nombre>] [--expected-version-code N]",
  );
}

const run = JSON.parse(fs.readFileSync(releaseRunPath, "utf8"));
const artifactList = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
const aabSize = fs.statSync(aabPath).size;
if (aabSize < 100_000) {
  throw new Error(`${aabPath}: tamaño sospechoso; no parece un AAB real`);
}
const sha256 = sha256File(aabPath);

const validatedRun = validateReleaseRun(run, {
  expectedRunId,
  repository,
});
const artifact = validateArtifactList(artifactList, {
  expectedRunId,
  artifactName,
  headSha: validatedRun.headSha,
});
validateSha256File(fs.readFileSync(sha256Path, "utf8"), sha256);
const validatedMetadata = validateReleaseMetadata({
  metadata,
  app: appJson.expo,
  run: validatedRun,
  sha256,
  sizeBytes: aabSize,
  expectedVersionCode,
});

console.log(
  `Play provenance OK: run=${validatedRun.id} commit=${validatedRun.headSha} ` +
    `artifact=${artifact.id} package=${validatedMetadata.package} ` +
    `versionCode=${validatedMetadata.versionCode} sha256=${validatedMetadata.sha256}`,
);
