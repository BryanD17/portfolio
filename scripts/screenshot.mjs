// Dev utility: full-page screenshot, optionally with reduced motion emulated.
// Usage: node scripts/screenshot.mjs <url> <outfile> <width> [--reduced-motion] [--light]
import { chromium } from "playwright";

const [url, outfile, widthArg, ...flags] = process.argv.slice(2);
const width = Number(widthArg ?? 1440);
const reducedMotion = flags.includes("--reduced-motion") ? "reduce" : "no-preference";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  reducedMotion,
  colorScheme: "dark",
});
await page.goto(url, { waitUntil: "networkidle" });
if (flags.includes("--light")) {
  await page.evaluate(() => document.documentElement.classList.add("light"));
}
// Let entrance animations settle and lazy content mount.
await page.mouse.wheel(0, 20000);
await page.waitForTimeout(1200);
await page.mouse.wheel(0, -40000);
await page.waitForTimeout(800);
await page.screenshot({ path: outfile, fullPage: true });
console.log(`saved ${outfile} (${width}px, reducedMotion=${reducedMotion})`);
await browser.close();
