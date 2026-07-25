// Agent 03 verification on /motion-lab.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.text().includes("Hydration") || msg.text().includes("hydration"))
    consoleErrors.push(msg.text().slice(0, 200));
});

// Instrument BEFORE load: count rAF callbacks and event listener balance.
await page.addInitScript(() => {
  window.__rafCount = 0;
  const origRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    window.__rafCount += 1;
    return origRaf(cb);
  };
  window.__listeners = { add: 0, remove: 0 };
  const origAdd = document.addEventListener.bind(document);
  const origRemove = document.removeEventListener.bind(document);
  document.addEventListener = (type, ...rest) => {
    if (type === "visibilitychange") window.__listeners.add += 1;
    return origAdd(type, ...rest);
  };
  document.removeEventListener = (type, ...rest) => {
    if (type === "visibilitychange") window.__listeners.remove += 1;
    return origRemove(type, ...rest);
  };
});

await page.goto("http://localhost:3000/motion-lab", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

// 1. FPS while scrolling through the page with everything running.
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const step = () => {
        frames += 1;
        if (performance.now() - start < 3000) requestAnimationFrame(step);
        else resolve(Math.round((frames / (performance.now() - start)) * 1000));
      };
      requestAnimationFrame(step);
      let y = 0;
      const scroller = setInterval(() => {
        y += 120;
        window.scrollTo(0, y % document.body.scrollHeight);
      }, 50);
      setTimeout(() => clearInterval(scroller), 3000);
    })
);

// 2. CountUp formatting mid-flight: replay and sample.
await page.evaluate(() => window.scrollTo(0, 0));
await page.getByRole("button", { name: "Replay" }).click();
await page.waitForTimeout(400);
const midCount = await page.evaluate(() => {
  const metrics = [...document.querySelectorAll("dl, .grid")]
    .flatMap((n) => [...n.querySelectorAll("span")])
    .map((s) => s.textContent)
    .filter((t) => t && /^[\d,.]+$/.test(t));
  return metrics.slice(0, 8);
});
await page.waitForTimeout(1500);
const finalCount = await page.evaluate(() =>
  [...document.querySelectorAll("span")]
    .map((s) => s.textContent)
    .filter((t) => t && /^[\d,]+(\.\d+)?$/.test(t) && t.length > 2)
    .slice(0, 8)
);

// 3. SplitText accessibility structure.
const splitA11y = await page.evaluate(() => {
  const srOnly = [...document.querySelectorAll(".sr-only")].map((s) => s.textContent);
  const hasHiddenAnimated = !!document.querySelector("h2 [aria-hidden='true']");
  return { srOnly: srOnly.slice(0, 4), hasHiddenAnimated };
});

// 4. AmbientBackdrop pause off-screen: measure rAF rate in view vs scrolled away.
async function rafRate(ms) {
  const before = await page.evaluate(() => window.__rafCount);
  await page.waitForTimeout(ms);
  const after = await page.evaluate(() => window.__rafCount);
  return Math.round(((after - before) / ms) * 1000);
}
await page.evaluate(() => {
  document.querySelector("canvas")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(600);
const rateInView = await rafRate(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
const rateOffScreen = await rafRate(1500);

// 5. Tab-hide pause: fake document.hidden and dispatch visibilitychange.
await page.evaluate(() => {
  document.querySelector("canvas")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  Object.defineProperty(document, "hidden", { value: true, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
});
await page.waitForTimeout(300);
const rateTabHidden = await rafRate(1500);
await page.evaluate(() => {
  Object.defineProperty(document, "hidden", { value: false, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
});

// 6. Unmount cleanup: replay remounts the demo section 5 times.
for (let i = 0; i < 5; i++) {
  await page.getByRole("button", { name: "Replay" }).click();
  await page.waitForTimeout(250);
}
const listeners = await page.evaluate(() => window.__listeners);

// 7. Reduced motion toggle: final values instant, canvas replaced.
await page.getByRole("button", { name: /Reduced motion/ }).click();
await page.waitForTimeout(400);
const reducedState = await page.evaluate(() => ({
  canvasPresent: !!document.querySelector("canvas"),
  gpa: [...document.querySelectorAll("span")].some((s) => s.textContent === "3.85"),
  swift: [...document.querySelectorAll("span")].some((s) => s.textContent === "80,000"),
}));

// 8. Layout shift during animations.
await page.getByRole("button", { name: /Reduced motion/ }).click();
const cls = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let total = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      setTimeout(() => resolve(total.toFixed(4)), 2000);
    })
);

console.log(
  JSON.stringify(
    {
      fps,
      rafRate: { inView: rateInView, offScreen: rateOffScreen, tabHidden: rateTabHidden },
      midCount,
      finalCount,
      splitA11y,
      listeners,
      reducedState,
      cls,
      consoleErrors,
    },
    null,
    2
  )
);
await browser.close();
