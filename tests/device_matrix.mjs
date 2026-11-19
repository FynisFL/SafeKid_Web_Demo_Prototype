import { chromium, firefox, webkit } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const base = process.env.SAFEKID_BASE_URL ?? "http://127.0.0.1:4173";
const engine = process.env.SAFEKID_BROWSER ?? "chromium";
const output = process.env.SAFEKID_QA_OUTPUT ?? ".qa-output";
const browsers = { chromium, firefox, webkit };
const widths = [
  [320, 568], [344, 882], [360, 640], [375, 667], [390, 844], [412, 915], [430, 932],
  [667, 375], [844, 390], [932, 430], [768, 1024], [820, 1180],
  [1024, 768], [1180, 820], [1280, 720], [1366, 768], [1440, 900], [1920, 1080],
];
const editions = ["rat", "buffalo", "tiger", "cat", "dragon", "snake", "horse", "sheep", "monkey", "rooster", "dog", "pig"];
const routes = [
  ["/", "Discover SafeKid"], ["/zodiac", "Explore all 12 editions"],
  ...editions.map(edition => [`/product/${edition}`, "Add to bag"]),
  ["/watch-passport", "Open the sample passport"], ["/app", "Open Web App"],
  ["/about", null], ["/support", "Browse common questions"], ["/contact", "Write to the SafeKid team"],
  ["/chat", "Open the demo chat"], ["/s-f-ai", "Open the demo chat"], ["/sos", null],
  ["/cart", null], ["/checkout", null], ["/not-a-safekid-page", "Back to the story"],
];
const samples = process.env.SAFEKID_QA_QUICK ? [[320, 568], [390, 844], [844, 390], [1440, 900]] : widths;
const summary = { engine, samples: [], regressions: [], axe: [], axeErrors: [] };
await mkdir(output, { recursive: true });
const browser = await browsers[engine].launch({ executablePath: process.env[`SAFEKID_${engine.toUpperCase()}`] });
summary.version = browser.version();

for (const [width, height] of samples) {
  const touch = width < 1024 || width === 1024 && height === 768 || width === 1180;
  const context = await browser.newContext({
    viewport: { width, height }, hasTouch: touch, deviceScaleFactor: touch ? 2 : 1,
    ...(engine === "firefox" ? {} : { isMobile: touch }),
  });
  await context.route("https://fonts.googleapis.com/**", route => route.fulfill({ body: "", contentType: "text/css", headers: { "access-control-allow-origin": "*" } }));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && !/^Failed to load resource:/.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    if (!window.PerformanceObserver?.supportedEntryTypes.includes("layout-shift")) return;
    window.rotationShifts = [];
    new PerformanceObserver(list => {
      window.rotationShifts.push(...list.getEntries().filter(entry => !entry.hadRecentInput).map(entry => entry.value));
    }).observe({ type: "layout-shift" });
  });
  for (const [path, cta] of routes) {
    errors.length = 0;
    const failures = [];
    try {
      await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.locator("main h1").first().waitFor({ timeout: 10000 });
      await page.getByTestId("first-scene").waitFor({ state: "detached", timeout: 10000 });
      const info = await page.evaluate(() => {
        const shown = element => !!element.getClientRects().length && getComputedStyle(element).visibility !== "hidden";
        const label = element => (element.getAttribute("aria-label") || element.textContent || element.tagName).trim().slice(0, 90);
        const buttons = [...document.querySelectorAll("header button, footer a, main button, main a[href], [role=dialog] button")].filter(shown);
        const undersized = buttons.flatMap(element => {
          const { width, height } = element.getBoundingClientRect();
          if (width >= 43.5 && height >= 43.5) return [];
          return [{ label: label(element), w: Math.round(width), h: Math.round(height) }];
        });
        const clippedText = [...document.querySelectorAll("main h1, main h2, main p, main label")]
          .filter(element => shown(element) && !element.classList.contains("sr-only") && element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2)
          .map(label);
        const smallInputs = [...document.querySelectorAll("input:not([type=hidden]), textarea, select")]
          .filter(element => shown(element) && parseFloat(getComputedStyle(element).fontSize) < 16)
          .map(label);
        return { width: document.documentElement.scrollWidth, undersized, clippedText, smallInputs };
      });
      if (info.width > width + 1) failures.push(`page overflows by ${info.width - width}px`);
      if (info.smallInputs.length) failures.push(`inputs under 16px: ${info.smallInputs.join(", ")}`);
      if (width < 1024) {
        const menu = page.getByRole("button", { name: "Open menu" });
        if (await menu.isVisible()) {
          const box = await menu.boundingBox();
          if (box.width < 43.5 || box.height < 43.5) failures.push("menu target below 44×44px");
        }
      }
      let ctaInFirstScreen = null;
      if (cta) {
        const target = page.getByRole("link", { name: cta, exact: true })
          .or(page.getByRole("button", { name: cta, exact: true })).first();
        const box = await target.boundingBox({ timeout: 500 }).catch(() => null);
        ctaInFirstScreen = box ? box.y >= 0 && box.y + box.height <= height : false;
        // The product purchase action follows the inspectable gallery on small displays.
        if (width <= 430 && height >= 640 && !path.startsWith("/product/") && !ctaInFirstScreen) failures.push(`CTA below first screen: ${cta}`);
      }
      let rotation = null;
      if (touch && [390, 844].includes(width) && ["/", "/zodiac", "/watch-passport", "/checkout"].includes(path)) {
        await page.evaluate(() => { if (window.rotationShifts) window.rotationShifts.length = 0; });
        await page.setViewportSize({ width: height, height: width });
        await page.waitForTimeout(180);
        rotation = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth, visible: innerWidth,
          shifts: window.rotationShifts ?? null,
        }));
        if (rotation.width > rotation.visible + 1) failures.push("overflow after rotating");
        await page.setViewportSize({ width, height });
      }
      if ((width === 390 && height === 844 || width === 1440 && height === 900) &&
          (!path.startsWith("/product") || path.endsWith("/dragon"))) {
        const key = path.replace(/[^a-z0-9]+/gi, "-") || "home";
        await page.screenshot({ path: join(output, `${engine}-${width}x${height}${key}.png`), animations: "disabled" });
        if (width === 390) {
          try {
            await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
            const result = await page.evaluate(() => window.axe.run({
              runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
            }));
            summary.axe.push({ path, violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(node => node.target) })) });
          } catch (error) {
            summary.axeErrors.push({ path, error: error.message });
          }
        }
      }
      summary.samples.push({ path, width, height, ...info, ctaInFirstScreen, rotation, errors: [...new Set(errors)] });
    } catch (error) {
      failures.push(error.message.split("\n")[0]);
    }
    if (errors.length) failures.push(...new Set(errors));
    if (failures.length) summary.regressions.push({ path, width, height, failures });
  }
  await context.close();
  console.log(`MATRIX ${engine} ${width}x${height}: ${summary.samples.length} pages so far`);
}
await browser.close();
await writeFile(join(output, `matrix-${engine}.json`), JSON.stringify(summary, null, 2));
const totals = {
  engine, version: summary.version, pages: summary.samples.length, regressions: summary.regressions,
  clippedText: summary.samples.filter(sample => sample.clippedText.length).length,
  undersized: summary.samples.filter(sample => sample.undersized.length).length,
  axe: summary.axe.map(({ path, violations }) => ({ path, ids: violations.map(violation => violation.id) })),
  axeErrors: summary.axeErrors,
};
console.log(`DEVICE_MATRIX_JSON ${JSON.stringify(totals)}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, `### ${engine} device matrix\n\nChecked ${totals.pages} page/viewport combinations.\n\n\`\`\`json\n${JSON.stringify(totals, null, 2)}\n\`\`\`\n`, { flag: "a" });
}

if (summary.regressions.length || summary.axeErrors.length) process.exitCode = 1;
