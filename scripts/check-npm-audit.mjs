import fs from "node:fs";

const file = process.argv[2] ?? "reports/npm-audit-all.json";
const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
const report = JSON.parse(raw);
const counts = report.metadata?.vulnerabilities ?? {};

const summary = [
  `npm audit: ${file}`,
  `- low: ${counts.low ?? 0}`,
  `- moderate: ${counts.moderate ?? 0}`,
  `- high: ${counts.high ?? 0}`,
  `- critical: ${counts.critical ?? 0}`,
  `- total: ${counts.total ?? 0}`,
];

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join("\n")}\n`);
}
console.log(summary.join("\n"));

const blocking = Object.values(report.vulnerabilities ?? {}).filter((item) =>
  ["high", "critical"].includes(item.severity),
);
if (blocking.length > 0) {
  for (const item of blocking) {
    console.error(`BLOQUEANTE ${item.severity}: ${item.name}`);
  }
  process.exitCode = 1;
}
