// Agent 02 verification: external font requests, focus ring, light theme.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const external = [];
page.on("request", (req) => {
  const u = new URL(req.url());
  if (u.hostname !== "localhost") external.push(req.url());
});

await page.goto("http://localhost:3000/styleguide", { waitUntil: "networkidle" });

// focus ring: Tab until a link/button is focused, read computed outline
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
const focus = await page.evaluate(() => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  return { tag: el.tagName, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, outlineStyle: cs.outlineStyle, offset: cs.outlineOffset };
});

// light theme swap
await page.evaluate(() => document.documentElement.classList.add("light"));
const light = await page.evaluate(() => {
  const cs = getComputedStyle(document.body);
  return { bg: cs.backgroundColor, fg: cs.color };
});
await page.evaluate(() => document.documentElement.classList.remove("light"));
const dark = await page.evaluate(() => {
  const cs = getComputedStyle(document.body);
  return { bg: cs.backgroundColor, fg: cs.color };
});

console.log(JSON.stringify({ externalRequests: external, focus, light, dark }, null, 2));
await browser.close();
