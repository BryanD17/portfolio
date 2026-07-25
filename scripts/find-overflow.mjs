// Dev utility: report elements wider than the viewport at a given width.
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/styleguide";
const width = Number(process.argv[3] ?? 375);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });

const result = await page.evaluate(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.right > doc.clientWidth + 1 || r.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString().slice(0, 90)) || "",
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
  }
  return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, overflow, offenders: offenders.slice(0, 15) };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
