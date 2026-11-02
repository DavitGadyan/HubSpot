#!/usr/bin/env node
/**
 * Records a walkthrough of the full app (home, case studies, use case, audit, quiz,
 * AI results page, admin) as a video plus full-page screenshots for portfolio use.
 *
 * Usage: start the app (npm run dev, or build + start), then:
 *   set -a; . ./.env.local; set +a; npm run demo:record
 * Output: demo/hubaiops-demo.mp4 (and .webm), demo/screenshots/*.png
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.DEMO_BASE_URL ?? "http://localhost:3000";
const OUT = "demo";
const ADMIN = process.env.ADMIN_PASSWORD;
const W = 1440;
const H = 900;

mkdirSync(`${OUT}/screenshots`, { recursive: true });
for (const f of ["hubaiops-demo.webm", "hubaiops-demo.mp4"]) rmSync(`${OUT}/${f}`, { force: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  colorScheme: "dark",
  recordVideo: { dir: OUT, size: { width: W, height: H } },
  httpCredentials: ADMIN ? { username: "admin", password: ADMIN } : undefined,
});
const page = await ctx.newPage();
const video = page.video();
const sleep = (ms) => page.waitForTimeout(ms);

async function scrollThrough({ step = 520, pause = 420, back = true } = {}) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h - H; y += step) {
    await page.mouse.wheel(0, step);
    await sleep(pause);
  }
  await sleep(700);
  if (back) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(900);
  }
}
async function shot(name) {
  await page.screenshot({ path: `${OUT}/screenshots/${name}.png`, fullPage: true });
}
async function go(path, settle = 2200) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await sleep(settle);
}

console.log("1/8 home");
await go("/");
await scrollThrough();
await shot("01-home");

console.log("2/8 case studies");
await go("/case-studies");
await page.locator("select").nth(0).selectOption({ label: "Financial Services" });
await sleep(1400);
await page.locator("select").nth(2).selectOption({ label: "Sales Hub" });
await sleep(1400);
await page.getByRole("button", { name: "Clear" }).click();
await sleep(1000);
await scrollThrough({ step: 700, pause: 380 });
await shot("02-case-studies");

console.log("3/8 case study detail");
await go("/case-studies/duplicates-netsuite-sync-education");
await scrollThrough();
await shot("03-case-study-detail");

console.log("4/8 use case");
await go("/use-cases/customer-agent");
await scrollThrough({ step: 600 });
await shot("04-use-case");

console.log("5/8 audit landing");
await go("/audit");
await sleep(800);
await shot("05-audit");

console.log("6/8 quiz");
await page.getByRole("link", { name: "Start the self-assessment" }).click();
await page.waitForURL("**/audit/quiz");
await sleep(1500);
let i = 0;
for (let section = 0; section < 7; section++) {
  const fieldsets = page.locator("fieldset");
  const n = await fieldsets.count();
  for (let k = 0; k < n; k++) {
    const answer = i % 4 === 1 ? "No" : i % 7 === 3 ? "Not sure" : "Yes";
    await fieldsets.nth(k).getByText(answer, { exact: true }).click();
    await sleep(260);
    i++;
  }
  if (section === 0) await shot("06-quiz");
  await sleep(500);
  await page.getByRole("button", { name: /Continue|Skip section/ }).click();
  await sleep(900);
}
await page.getByPlaceholder("Work email").fill("demo@hubaiops.example");
await sleep(250);
await page.getByPlaceholder("Name").fill("Demo User");
await sleep(250);
await page.getByPlaceholder("Company").fill("Acme Industrial");
await sleep(600);
await page.getByRole("button", { name: "See my results" }).click();

console.log("7/8 results (waiting for the plan)");
await page.getByText("Readiness by use case").waitFor({ timeout: 240_000 });
await page.waitForURL("**/audit/**");
await sleep(2500);
await page.screenshot({ path: `${OUT}/screenshots/07-results-hero.png` });
await scrollThrough({ step: 480, pause: 520 });
await shot("07-results");

if (ADMIN) {
  console.log("8/8 admin");
  await go("/admin", 1500);
  await shot("08-admin");
} else {
  console.log("8/8 admin skipped (no ADMIN_PASSWORD)");
}

await sleep(1200);
await ctx.close();
await browser.close();

const webm = await video.path();
renameSync(webm, `${OUT}/hubaiops-demo.webm`);
const ff = spawnSync(
  "ffmpeg",
  ["-y", "-loglevel", "error", "-i", `${OUT}/hubaiops-demo.webm`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-crf", "20", `${OUT}/hubaiops-demo.mp4`],
  { stdio: "inherit" },
);
console.log(ff.status === 0 && existsSync(`${OUT}/hubaiops-demo.mp4`) ? `done: ${OUT}/hubaiops-demo.mp4` : `done: ${OUT}/hubaiops-demo.webm (ffmpeg unavailable)`);
