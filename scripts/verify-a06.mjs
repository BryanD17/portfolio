// Agent 06 verification: hero boot, count-ups, scroll-linked exit, a11y.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleIssues = [];
page.on("console", (m) => {
  const t = m.text();
  if (m.type() === "error" || /hydration/i.test(t)) consoleIssues.push(t.slice(0, 160));
});

// Instrument metric first-change timestamps before load.
await page.addInitScript(() => {
  window.__metricStarts = [];
  const obs = new MutationObserver((muts) => {
    for (const mut of muts) {
      const el = mut.target.parentElement;
      if (el && el.closest("dl") && !el.dataset.seen) {
        el.dataset.seen = "1";
        window.__metricStarts.push(performance.now());
      }
    }
  });
  window.addEventListener("DOMContentLoaded", () => {
    obs.observe(document.body, { characterData: true, subtree: true, childList: true });
  });
});

const t0 = Date.now();
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });

// Boot duration: from first paint of the terminal to the final prompt row
// becoming visible (the row after all lines resolve).
await page.waitForFunction(
  () => {
    const rows = [...document.querySelectorAll("section p")];
    const finalPrompt = rows.find(
      (p) => p.textContent?.includes("$") && !p.textContent.includes("whoami") && p.querySelector("[class*='cursor-blink']")
    );
    return finalPrompt && getComputedStyle(finalPrompt).visibility !== "hidden" &&
      [...document.querySelectorAll("p")].some((x) => x.textContent?.includes("stayfit-web/") && getComputedStyle(x).visibility !== "hidden");
  },
  { timeout: 15000 }
);
const bootMs = Date.now() - t0;

await page.waitForTimeout(2000);

// Metrics: final formatted values present, decimals correct.
const metricsFinal = await page.evaluate(() =>
  [...document.querySelectorAll("dl span")].map((s) => s.textContent).filter((t) => t && /^[\d,]+(\.\d+)?$/.test(t))
);
const metricStarts = await page.evaluate(() => window.__metricStarts.slice(0, 4));
const staggers = metricStarts.slice(1).map((t, i) => Math.round(t - metricStarts[i]));

// Scroll-linked exit: sample opacity/transform at several scroll positions.
const samples = [];
for (const y of [0, 200, 400, 600]) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
  samples.push(
    await page.evaluate(() => {
      const el = document.querySelector("section > div[style]");
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { opacity: Number(cs.opacity).toFixed(2), transform: cs.transform.slice(0, 40) };
    })
  );
}

// h1 count, phone sweep, headline in DOM.
const checks = await page.evaluate(() => ({
  h1Count: document.querySelectorAll("h1").length,
  phone: document.documentElement.outerHTML.includes("655-8730") || document.documentElement.outerHTML.includes("7736558730"),
  openToWork: document.body.textContent.includes("Open to Summer 2027 SWE internships"),
  primaryButtons: [...document.querySelectorAll("a")].filter((a) => a.dataset.slot === "button" && !a.className.includes("outline") && a.closest("section")).length,
}));

// FPS through a full hero scroll.
await page.evaluate(() => window.scrollTo(0, 0));
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const step = () => {
        frames += 1;
        if (performance.now() - start < 2500) requestAnimationFrame(step);
        else resolve(Math.round((frames / (performance.now() - start)) * 1000));
      };
      requestAnimationFrame(step);
      let y = 0;
      const s = setInterval(() => {
        y += 60;
        window.scrollTo(0, y);
      }, 30);
      setTimeout(() => clearInterval(s), 2500);
    })
);

// Mobile: ambient canvas must be absent at 375.
const mobile = await browser.newPage({ viewport: { width: 375, height: 800 } });
await mobile.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const mobileCanvas = await mobile.evaluate(() => !!document.querySelector("section canvas"));
const mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);

// Reduced motion: everything instant and complete.
const rm = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
await rm.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const rmState = await rm.evaluate(() => ({
  canvas: !!document.querySelector("section canvas"),
  headline: [...document.querySelectorAll("h1")].some((h) => h.textContent.includes("I ship production software.")),
  swift: [...document.querySelectorAll("dl span")].some((s) => s.textContent === "80,000"),
  gpa: [...document.querySelectorAll("dl span")].some((s) => s.textContent === "3.85"),
  bootComplete: document.body.textContent.includes("stayfit-web/"),
  hiddenLines: [...document.querySelectorAll("section p")].filter((p) => getComputedStyle(p).visibility === "hidden").length,
}));
await rm.screenshot({ path: process.env.SCRATCH_DIR + "/hero-reduced.png", fullPage: true });

console.log(
  JSON.stringify(
    { bootMs, metricsFinal, metricStarts: metricStarts.map(Math.round), staggers, samples, checks, fps, mobileCanvas, mobileOverflow, rmState, consoleIssues },
    null,
    2
  )
);
await browser.close();
