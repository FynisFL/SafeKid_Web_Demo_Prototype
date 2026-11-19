import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const output = process.env.SAFEKID_QA_OUTPUT ?? ".qa-output";
const launchArgs = ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"];
const variants = [
  { name: "baseline", origin: process.env.SAFEKID_BASELINE_URL ?? "http://127.0.0.1:4174", dist: process.env.SAFEKID_BASELINE_DIST ?? ".qa-baseline/dist" },
  { name: "candidate", origin: process.env.SAFEKID_BASE_URL ?? "http://127.0.0.1:4173", dist: "dist" },
];
const profiles = [
  { name: "normal", latency: 0, downloadThroughput: -1, uploadThroughput: -1 },
  { name: "fast4g", latency: 20, downloadThroughput: 500000, uploadThroughput: 375000 },
  { name: "slow3g", latency: 400, downloadThroughput: 62500, uploadThroughput: 31250 },
];
const devices = [
  { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
];
const median = values => {
  const valid = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (valid.length !== values.length || !valid.length) return null;
  const middle = Math.floor(valid.length / 2);
  return valid.length % 2 ? valid[middle] : (valid[middle - 1] + valid[middle]) / 2;
};
const results = Object.fromEntries(variants.map(({ name }) => [name, { profiles: {}, scroll: {} }]));
const browser = await chromium.launch({ args: launchArgs });

async function open(variant, device, { network, cpu } = {}) {
  const { viewport, deviceScaleFactor, isMobile, hasTouch } = device;
  const context = await browser.newContext({ viewport, deviceScaleFactor, isMobile, hasTouch });
  await context.route("https://fonts.googleapis.com/**", route => route.abort());
  await context.addInitScript(() => {
    window.lab = { lcp: null, shifts: [], long: [] };
    for (const type of ["largest-contentful-paint", "layout-shift", "longtask"]) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (type === "largest-contentful-paint") window.lab.lcp = entry.startTime;
          if (type === "layout-shift" && !entry.hadRecentInput) window.lab.shifts.push({ value: entry.value, time: entry.startTime });
          if (type === "longtask") window.lab.long.push({ duration: entry.duration, time: entry.startTime });
        }
      }).observe({ type, buffered: true });
    }
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (network) {
    const { latency, downloadThroughput, uploadThroughput } = network;
    await session.send("Network.emulateNetworkConditions", { offline: false, latency, downloadThroughput, uploadThroughput });
  }
  if (cpu) await session.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await page.goto(variant.origin + "/", { waitUntil: "commit", timeout: 60000 });
  await page.waitForFunction(() => performance.getEntriesByName("safekid-hero-enter").length > 0, undefined, { timeout: 60000 });
  return { context, page };
}

const gzipSize = async (directory, file) => gzipSync(await readFile(join(directory, file)), { level: 9 }).length;
async function measureNetwork(variant, profile) {
  const { context, page } = await open(variant, devices[0], { network: profile });
  try {
    await page.waitForTimeout(3400);
    const entry = await page.evaluate(() => ({
      lcp: window.lab.lcp,
      hero: performance.getEntriesByName("safekid-hero-enter")[0].startTime,
      scripts: [...new Set(performance.getEntriesByType("resource").map(entry => new URL(entry.name)).filter(url => url.origin === location.origin && url.pathname.endsWith(".js")).map(url => url.pathname.slice(1)))],
    }));
    const sizes = await Promise.all(entry.scripts.map(file => gzipSize(variant.dist, file)));
    return { ...entry, jsGzip: sizes.reduce((total, bytes) => total + bytes, 0) };
  } finally {
    await context.close();
  }
}

async function measureScroll(variant, device) {
  const { context, page } = await open(variant, device, { cpu: 4 });
  try {
    await page.waitForTimeout(2000);
    return await page.evaluate(() => new Promise(resolve => {
      const frames = [];
      const start = performance.now();
      let last = start;
      let previousShift = -Infinity;
      let windowStart = -Infinity;
      let currentCLS = 0;
      let cls = 0;
      const extent = document.documentElement.scrollHeight - innerHeight;
      function frame(now) {
        frames.push(now - last);
        last = now;
        const elapsed = now - start;
        window.scrollTo(0, Math.min(1, elapsed / 9000) * extent);
        if (elapsed < 9000) {
          requestAnimationFrame(frame);
          return;
        }
        setTimeout(() => {
          for (const shift of window.lab.shifts) {
            if (shift.time - previousShift > 1000 || shift.time - windowStart >= 5000) {
              currentCLS = 0;
              windowStart = shift.time;
            }
            currentCLS += shift.value;
            previousShift = shift.time;
            cls = Math.max(cls, currentCLS);
          }
          const sorted = frames.toSorted((a, b) => a - b);
          const long = window.lab.long.filter(task => task.time >= start && task.time <= now);
          resolve({ fps: frames.length * 1000 / elapsed, p95: sorted[Math.ceil(sorted.length * .95) - 1], cls, long });
        }, 100);
      }
      requestAnimationFrame(frame);
    }));
  } finally {
    await context.close();
  }
}

try {
  for (const profile of profiles) {
    for (const variant of variants) results[variant.name].profiles[profile.name] = [];
    for (let sample = 0; sample < 5; sample++) {
      for (const variant of variants) {
        const audit = await measureNetwork(variant, profile);
        results[variant.name].profiles[profile.name].push(audit);
        console.log(`COLD ${variant.name} ${profile.name} ${sample + 1}/5: hero ${Math.round(audit.hero)}, LCP ${audit.lcp}, gzip ${audit.jsGzip}`);
      }
    }
  }
  for (const device of devices) {
    for (const variant of variants) results[variant.name].scroll[device.name] = [];
    for (let sample = 0; sample < 3; sample++) {
      for (const variant of variants) {
        const audit = await measureScroll(variant, device);
        results[variant.name].scroll[device.name].push(audit);
        console.log(`SCROLL ${variant.name} ${device.name} ${sample + 1}/3: ${audit.fps.toFixed(1)}fps, p95 ${audit.p95.toFixed(1)}ms, ${audit.long.length} long tasks, CLS ${audit.cls}`);
      }
    }
  }
} finally {
  await browser.close();
  await mkdir(output, { recursive: true });
  await writeFile(join(output, "performance-raw.json"), JSON.stringify(results, null, 2));
}

async function routeChunks(variant) {
  const manifest = JSON.parse(await readFile(join(variant.dist, ".vite/manifest.json"), "utf8"));
  const routeEntries = Object.entries(manifest).filter(([key]) => key.startsWith("src/pages/") && manifest[key].isDynamicEntry);
  return Object.fromEntries(await Promise.all(routeEntries.map(async ([key, item]) => [key, await gzipSize(variant.dist, item.file)])));
}

const summary = {};
for (const variant of variants) {
  const data = results[variant.name];
  summary[variant.name] = {
    profiles: Object.fromEntries(Object.entries(data.profiles).map(([name, runs]) => [name, {
      hero: median(runs.map(run => run.hero)), lcp: median(runs.map(run => run.lcp)), jsGzip: median(runs.map(run => run.jsGzip)),
    }])),
    scroll: Object.fromEntries(Object.entries(data.scroll).map(([name, runs]) => [name, {
      fps: median(runs.map(run => run.fps)), p95: median(runs.map(run => run.p95)),
      cls: Math.max(...runs.map(run => run.cls)), longTasks: runs.map(run => run.long.length),
    }])),
    routeChunks: await routeChunks(variant),
  };
}

const { baseline, candidate } = summary;
const before = baseline.profiles.normal;
const after = candidate.profiles.normal;
summary.regressions = [];
for (const field of ["hero", "lcp", "jsGzip"]) {
  const limit = field === "jsGzip" ? 15000 : 300;
  if (before[field] === null || after[field] === null || after[field] - before[field] > limit) summary.regressions.push({ field, before: before[field], after: after[field], limit });
}
for (const { name } of devices) {
  const previous = baseline.scroll[name];
  const current = candidate.scroll[name];
  if (current.fps === null || current.fps < previous.fps) summary.regressions.push({ device: name, metric: "fps", before: previous.fps, after: current.fps });
  if (current.cls > previous.cls) summary.regressions.push({ device: name, metric: "cls", before: previous.cls, after: current.cls });
}
for (const [route, bytes] of Object.entries(candidate.routeChunks)) {
  if (bytes > 40000) summary.regressions.push({ route, bytes, limit: 40000 });
}

console.log(`DEVICE_PERF_JSON ${JSON.stringify(summary)}`);
await writeFile(join(output, "performance-summary.json"), JSON.stringify(summary, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, "\n### Paired production performance\n\n```json\n" + JSON.stringify(summary, null, 2) + "\n```\n", { flag: "a" });
}
if (summary.regressions.length) process.exitCode = 1;
