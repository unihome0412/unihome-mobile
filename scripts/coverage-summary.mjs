import fs from "node:fs";

const file = process.argv[2] ?? "coverage/coverage-summary.json";
const report = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const total = report.total;

if (!total) {
  throw new Error(`${file}: falta el resumen total de cobertura`);
}

const metrics = ["statements", "branches", "functions", "lines"];
const lines = ["Cobertura global medida:"];
for (const metric of metrics) {
  lines.push(
    `- ${metric}: ${total[metric].pct}% (${total[metric].covered}/${total[metric].total})`,
  );
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}
console.log(lines.join("\n"));
