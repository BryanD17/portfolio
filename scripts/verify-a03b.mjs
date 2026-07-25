// Agent 03 follow-up: reduced-motion final values + animation-only CLS.
import { chromium } from "playwright";

const browser = await chromium.launch();

// Pass 1: OS-level reduced motion emulation, fresh load.
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:3000/motion-lab", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const reducedFresh = await page.evaluate(() => ({
  canvasPresent: !!document.querySelector("canvas"),
  gpa: [...document.querySelectorAll("span")].some((s) => s.textContent === "3.85"),
  swift: [...document.querySelectorAll("span")].some((s) => s.textContent === "80,000"),
  headlineVisible: [...document.querySelectorAll("h2")].some((h) =>
    (h.textContent || "").includes("I ship production software.")
  ),
  typedLineFull: [...document.querySelectorAll("span")].some(
    (s) => s.getAttribute("aria-hidden") === "true" && s.textContent === "cat headline.txt"
  ),
  anyOpacityZero: [...document.querySelectorAll("main *")].filter((el) => {
    const cs = getComputedStyle(el);
    return cs.opacity === "0" && el.textContent && el.textContent.trim().length > 0;
  }).length,
}));
await page.close();

// Pass 2: normal motion, CLS measured ONLY during animation playback (not remounts).
const page2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page2.goto("http://localhost:3000/motion-lab", { waitUntil: "networkidle" });
await page2.waitForTimeout(2500); // initial animations done
const cls = await page2.evaluate(
  () =>
    new Promise((resolve) => {
      let total = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value;
      }).observe({ type: "layout-shift" }); // NOT buffered: only new shifts
      // Trigger scroll-linked + reveal animations by scrolling.
      let y = 0;
      const scroller = setInterval(() => {
        y += 200;
        window.scrollTo(0, y % document.body.scrollHeight);
      }, 60);
      setTimeout(() => {
        clearInterval(scroller);
        resolve(total.toFixed(4));
      }, 2500);
    })
);

// Mid-animation reduced-motion flip: values must settle at finals.
await page2.evaluate(() => window.scrollTo(0, 0));
await page2.getByRole("button", { name: "Replay" }).click();
await page2.waitForTimeout(300); // counts mid-flight
await page2.getByRole("button", { name: /Reduced motion/ }).click();
await page2.waitForTimeout(300);
const midFlip = await page2.evaluate(() => ({
  gpa: [...document.querySelectorAll("span")].some((s) => s.textContent === "3.85"),
  swift: [...document.querySelectorAll("span")].some((s) => s.textContent === "80,000"),
}));

console.log(JSON.stringify({ reducedFresh, animationOnlyCLS: cls, midFlip }, null, 2));
await browser.close();
