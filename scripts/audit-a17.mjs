// Agent 17: automated accessibility + motion QA across every route.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/projects", "/projects/stayfit", "/projects/stayfit-website", "/projects/webmars", "/projects/futures-engine", "/styleguide", "/motion-lab"];
const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const report = { axe: {}, structure: {}, contrast: {}, breakpoints: {}, reduced: {}, tapTargets: {}, misc: {} };

// ---------- axe on every route ----------
for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page }).analyze();
  report.axe[route] = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    sample: v.nodes[0]?.target?.[0],
  }));
  // structure
  report.structure[route] = await page.evaluate(() => {
    const h1s = document.querySelectorAll("h1").length;
    const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => Number(h.tagName[1]));
    let skipped = false;
    for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skipped = true;
    const imgs = [...document.querySelectorAll("img")].map((i) => ({ src: i.src.split("/").pop(), alt: i.alt }));
    return {
      h1s,
      skippedLevel: skipped,
      landmarks: {
        header: document.querySelectorAll("header").length,
        nav: document.querySelectorAll("nav").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
      },
      imgs,
    };
  });
  await context.close();
}

// ---------- contrast audit (both themes, real computed pairs) ----------
function luminance(r, g, b) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const l1 = luminance(...fg);
  const l2 = luminance(...bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
const PAIRS = [
  ["--fg", "--bg", 4.5],
  ["--fg-muted", "--bg", 4.5],
  ["--fg-subtle", "--bg", 4.5],
  ["--fg", "--bg-elevated", 4.5],
  ["--fg-muted", "--bg-elevated", 4.5],
  ["--fg-subtle", "--bg-elevated", 4.5],
  ["--fg-muted", "--bg-subtle", 4.5],
  ["--accent", "--bg", 4.5],
  ["--accent", "--bg-elevated", 4.5],
  ["--accent-fg", "--accent", 4.5],
  ["--success", "--bg", 4.5],
  ["--warning", "--bg", 4.5],
  ["--danger", "--bg", 4.5],
  ["--border", "--bg", 1.0],
  ["--border-strong", "--bg", 3.0],
];
for (const theme of ["dark", "light"]) {
  const page = await browser.newPage();
  await page.goto(BASE + "/styleguide", { waitUntil: "networkidle" });
  if (theme === "light") await page.evaluate(() => document.documentElement.classList.add("light"));
  const resolved = await page.evaluate((pairs) => {
    // Canvas pixel readback: immune to oklch/lab computed-color serialization.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const get = (v) => {
      probe.style.color = `var(${v})`;
      const computed = getComputedStyle(probe).color;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = computed;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    return pairs.map(([fg, bg, min]) => ({ fg, bg, min, fgRgb: get(fg), bgRgb: get(bg) }));
  }, PAIRS);
  report.contrast[theme] = resolved.map((p) => {
    const r = p.fgRgb && p.bgRgb ? ratio(p.fgRgb, p.bgRgb) : 0;
    return { pair: `${p.fg} on ${p.bg}`, ratio: r.toFixed(2), min: p.min, pass: r >= p.min };
  });
  await page.close();
}

// ---------- breakpoints, overflow, tap targets ----------
for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  report.breakpoints[width] = { overflow };
  if (width === 375) {
    report.tapTargets = await page.evaluate(() => {
      const small = [];
      for (const el of document.querySelectorAll("a, button, input, select, textarea")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue; // hidden
        if (r.height < 24 || (r.height < 44 && r.width < 44 && !el.closest("p, li"))) {
          small.push({ tag: el.tagName, label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
      return small.slice(0, 15);
    });
  }
  await page.close();
}

// ---------- reduced-motion static composition per route ----------
for (const route of ROUTES.slice(0, 6)) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  report.reduced[route] = await page.evaluate(() => {
    const stuck = [...document.querySelectorAll("main *")].filter((el) => {
      const cs = getComputedStyle(el);
      const hasText = (el.textContent?.trim().length ?? 0) > 0;
      const offset = cs.transform !== "none" && /matrix\(1, 0, 0, 1, 0, (2[0-9]|[3-9][0-9])/.test(cs.transform);
      return hasText && (Number(cs.opacity) === 0 || offset);
    }).length;
    return { stuckElements: stuck, canvas: !!document.querySelector("canvas") };
  });
  const clean = route.replace(/\//g, "_") || "_home";
  await page.screenshot({ path: `${process.env.SC}/rm${clean}.png`, fullPage: true });
  await page.close();
}

// ---------- misc: scroll-jack, re-fire, wheel handlers ----------
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  window.__wheelPrevented = 0;
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.defaultPrevented) window.__wheelPrevented += 1;
    },
    { passive: false, capture: false }
  );
});
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
for (let i = 0; i < 10; i++) {
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(100);
}
for (let i = 0; i < 10; i++) {
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(100);
}
report.misc.wheelPrevented = await page.evaluate(() => window.__wheelPrevented);
report.misc.refire = await page.evaluate(() => {
  return [...document.querySelectorAll("[data-reveal]")].filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length;
});
await page.close();

await browser.close();
console.log(JSON.stringify(report, null, 1));
