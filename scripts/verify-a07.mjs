// Agent 07 verification on /projects.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const audit = await page.evaluate(() => {
  const text = document.body.textContent ?? "";
  const anchors = [...document.querySelectorAll("a")];
  const badgeOf = (name) => {
    const h = [...document.querySelectorAll("h3")].find((x) => x.textContent?.trim().startsWith(name));
    if (!h) return null;
    return [...h.parentElement.querySelectorAll("span")].map((s) => s.textContent).filter((t) =>
      ["FORK", "TEAM PROJECT", "LIVE", "APP STORE", "PRIVATE", "EARLY WORK"].includes(t ?? "")
    );
  };
  const caseTitles = [...document.querySelectorAll("h3")]
    .map((h) => h.textContent?.trim() ?? "")
    .filter((t) => /StayFit|WebMARS|Futures/.test(t));
  return {
    caseTitles: caseTitles.slice(0, 6),
    sdsuBadges: badgeOf("SDSUMaps"),
    sdsuRoleNote: text.includes("26 commits authored"),
    privateRepoLinks: anchors
      .filter((a) => /github\.com\/BryanD17\/(StayFit---Healthy-lifestyle-|stayfit-website|Futures-Trading-Algorithm)/.test(a.href))
      .map((a) => a.href),
    webmarsLive: anchors.some((a) => a.href.startsWith("https://webmarsimulator.com")),
    stayfitWebLive: anchors.some((a) => a.href.startsWith("https://getstayfitapp.com")),
    inventedDescCheck: text.includes("No description yet"),
    repoCount: (text.match(/pushed .*? ago/g) || []).length,
  };
});

// Filter URL round-trip: set language filter, reload in a fresh context.
await page.selectOption("select >> nth=0", "Python");
await page.waitForTimeout(600);
const urlAfterFilter = page.url();
const page2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page2.goto(urlAfterFilter, { waitUntil: "networkidle" });
await page2.waitForTimeout(800);
const roundTrip = await page2.evaluate(() => {
  const sel = document.querySelector("select");
  const names = [...document.querySelectorAll("li span, h3")].map((x) => x.textContent?.trim());
  return { selectValue: sel?.value, hasHateSpeech: names.some((n) => n?.includes("hateSpeechDetector")) };
});
await page2.close();

// Entry animation fires ONCE: scroll to bottom, back to top, check opacity stays 1.
await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
const onceCheck = await page.evaluate(() => {
  const cards = [...document.querySelectorAll("h3")].map((h) => {
    let el = h;
    let op = 1;
    while (el && el !== document.body) {
      op = Math.min(op, Number(getComputedStyle(el).opacity));
      el = el.parentElement;
    }
    return { name: h.textContent?.slice(0, 24), minOpacity: op };
  });
  return cards.filter((c) => c.minOpacity < 0.99);
});

// FPS during a filter transition.
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const step = () => {
        frames += 1;
        if (performance.now() - start < 1500) requestAnimationFrame(step);
        else resolve(Math.round((frames / (performance.now() - start)) * 1000));
      };
      requestAnimationFrame(step);
    })
);
// trigger filter change while measuring
await page.selectOption("select >> nth=0", "TypeScript");
const fpsVal = await fps;

// Reduced motion pass.
const rm = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
await rm.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await rm.waitForTimeout(800);
const rmCheck = await rm.evaluate(() => {
  const hidden = [...document.querySelectorAll("main *")].filter((el) => {
    const cs = getComputedStyle(el);
    return Number(cs.opacity) < 0.5 && (el.textContent?.trim().length ?? 0) > 0;
  });
  return { hiddenCount: hidden.length };
});
await rm.close();

// 375px check.
const mob = await browser.newPage({ viewport: { width: 375, height: 800 } });
await mob.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await mob.waitForTimeout(1200);
const mobOverflow = await mob.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
await mob.close();

console.log(JSON.stringify({ audit, urlAfterFilter, roundTrip, onceCheck, fpsVal, rmCheck, mobOverflow }, null, 2));
await browser.close();
