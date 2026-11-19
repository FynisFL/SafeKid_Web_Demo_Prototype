import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const variants = [
  ["before", process.env.SAFEKID_BASELINE_URL ?? "http://127.0.0.1:4174"],
  ["after", process.env.SAFEKID_BASE_URL ?? "http://127.0.0.1:4173"],
];
const viewports = [[390, 844], [768, 1024], [1440, 900], [844, 390]];
const routes = ["/", "/zodiac/", "/product/dragon/", "/watch-passport/", "/app/", "/about/", "/support/",
  "/contact/", "/s-f-ai/", "/sos/", "/cart/", "/checkout/", "/not-a-safekid-page/"];
const output = process.env.SAFEKID_QA_OUTPUT ?? ".qa-output";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.SAFEKID_CHROMIUM });
const captures = [];

try {
  for (const [width, height] of viewports) {
    const mobile = width < 1024;
    for (const [variant, base] of variants) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
      await context.route("https://fonts.googleapis.com/**", route => route.fulfill({
        body: "", contentType: "text/css", headers: { "access-control-allow-origin": "*" },
      }));
      const page = await context.newPage();
      for (const path of routes) {
        await page.goto(base + path, { waitUntil: "domcontentloaded" });
        await page.locator("main h1").first().waitFor();
        await page.getByTestId("first-scene").waitFor({ state: "detached", timeout: 12000 });
        // Keep the camera at the same time from the usable entry in both builds.
        await page.waitForTimeout(850);
        const name = path.slice(1).replace(/\/$/, "").replaceAll("/", "-") || "home";
        const filename = `${variant}-${width}x${height}-${name}.png`;
        await page.screenshot({ path: join(output, filename) });
        captures.push({ variant, width, height, path, filename });
        if (path === "/") {
          const closing = page.locator("[data-closing-stage]");
          await closing.evaluate(node => node.closest("section").scrollIntoView({ block: "start" }));
          await closing.locator("img").first().evaluate(image => image.decode().catch(() => undefined));
          await page.waitForTimeout(320);
          const closingFile = `${variant}-${width}x${height}-closing.png`;
          await page.screenshot({ path: join(output, closingFile) });
          captures.push({ variant, width, height, path: "/#home-closing-heading", filename: closingFile });
        }
      }
      await context.close();
      console.log(`VISUAL ${variant} ${width}x${height}: ${captures.length} captures so far`);
    }
  }
} finally {
  await browser.close();
  await writeFile(join(output, "visual-index.json"), JSON.stringify(captures, null, 2));
}
