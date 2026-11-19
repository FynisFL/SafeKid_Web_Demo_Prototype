import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const origin = process.env.SAFEKID_BASE_URL ?? "http://127.0.0.1:4173";
const output = process.env.SAFEKID_QA_OUTPUT ?? ".qa-output";
const summary = [];
const errors = [];
await mkdir(output, { recursive: true });
for (const preset of ["mobile", "desktop"]) {
  for (const path of ["/", "/zodiac", "/product/dragon", "/watch-passport", "/about"]) {
    const key = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
    const filename = join(output, `lighthouse-${preset}-${key}.json`);
    try {
      execFileSync(process.execPath, [
        fileURLToPath(new URL("./node_modules/lighthouse/cli/index.js", import.meta.url)),
        origin + path, "--quiet", "--only-categories=performance,accessibility",
        "--output=json", `--output-path=${filename}`, "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-gpu",
        ...(preset === "desktop" ? ["--preset=desktop"] : []),
      ], { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, timeout: 120000 });
      const report = JSON.parse(await readFile(filename, "utf8"));
      if (report.runtimeError) throw new Error(report.runtimeError.message);
      const score = name => report.categories[name]?.score;
      summary.push({ preset, path, performance: score("performance"), accessibility: score("accessibility"),
        lcp: report.audits["largest-contentful-paint"]?.numericValue, cls: report.audits["cumulative-layout-shift"]?.numericValue });
    } catch (error) {
      errors.push({ preset, path, error: error.message.split("\n")[0] });
    }
  }
}
const result = JSON.stringify({ summary, errors }, null, 2);
await writeFile(join(output, "lighthouse-summary.json"), result);
console.log(`LIGHTHOUSE_JSON ${JSON.stringify({summary, errors})}`);
if (process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY, "\n### Lighthouse\n\n```json\n" + result + "\n```\n", { flag: "a" });
if (errors.length) process.exitCode = 1;
