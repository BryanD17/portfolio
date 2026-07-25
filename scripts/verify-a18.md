# Agent 18: performance record (2026-07-25)

## Lighthouse (mobile preset, simulated throttling, LOCAL production server)

| Route | Perf | A11y | Best practices | SEO | LCP(sim) | CLS | TBT |
|-------|------|------|----------------|-----|----------|-----|-----|
| / | 84-87* | 100 | 100 | 100 | ~3.7s sim | 0.013 | ~200ms |
| /projects | 90-95* | 100 | 100 | 100 | ~3.0s sim | 0.000 | 31-44ms |
| /projects/stayfit | 93-95* | 100 | 100 | 100 | ~3.0s sim | 0.004 | ~32ms |
| /projects/stayfit-website | 88-95* | 100 | 100 | 100 | ~3.1s sim | 0.000 | ~30ms |
| /projects/webmars | 88-94* | 100 | 100 | 100 | ~3.2s sim | 0.000 | ~40ms |
| /projects/futures-engine | 93-95* | 100 | 100 | 100 | ~3.0s sim | 0.004 | ~25ms |

\* range across runs; local simulated scoring on Playwright Chromium has
roughly +/-5 noise. REAL-BROWSER measurement (PerformanceObserver): the LCP
element is the H1 on every page and it paints at ~100ms with no later
candidate, CLS <= 0.013 everywhere. The simulated 3s LCP is the throttled
critical-chain estimate (CSS + font preload on simulated slow 4G), not an
observed paint. Per the master document 18.8, the binding Core Web Vitals
measurement happens on the DEPLOYED URL; Agent 20 re-runs Lighthouse against
production and loops back here if any category lands under 95 there.

## Fixes shipped during this gate

- /projects CLS 0.220 -> 0.000 and perf 84 -> 95: removed the
  useSearchParams Suspense CSR bailout (filters now read location.search via
  useSyncExternalStore; the page is fully server-rendered again).
- Site-wide LCP: SplitText and the hero terminal now render COMPLETE and
  VISIBLE in server HTML; choreography replays from a pre-paint layout
  effect. H1 paint moved from post-hydration (~3s throttled) to first paint.
- Boot failsafe: THE MOTION SPEC's 2.5s cap is now enforced on slow devices.
- Fonts: display "optional" + adjustFontFallback (Agent 18 authority
  decision, recorded): kills the webfont LCP repaint; very slow first
  visits keep the metric-compatible fallback for that pageview only.
- Console 404s (best practices 96 -> 100): Vercel Analytics/Speed Insights
  scripts now render only when process.env.VERCEL is set.
- SectionReveal pre-reveal floor 0.25 -> 0.8 (a11y 96 -> 100: below-fold
  text now passes AA before its reveal).

## Motion performance audit

- Frame rates MEASURED on the production build: hero boot 60fps, full-page
  scroll 60fps, projects filter transition 60fps, timeline spine draw 60fps.
- Animated properties: transform/opacity only (code-audited; the one scaleX
  progress bar and spine both use transform). Animation-only CLS 0.0000
  (measured in Agent 03); layout-shift during animations 0.000-0.013 here.
- will-change: no manual usage anywhere; Motion applies and removes it per
  animation.
- rAF loops stop off-screen and on tab hide (measured in Agent 03:
  121/s -> 60/s probe-only).
- Mobile: ambient canvas absent below 768px, parallax halved (verified in
  Agents 03/06). REAL-PHONE check not possible from this machine: BLOCKED
  as an owner action; Playwright mobile emulation used in the interim.

## Bundles

- @next/bundle-analyzer is webpack-only and this build uses Turbopack;
  chunk inventory used instead. Chunks over 20KB transferred:
  framework/React (~69KB tr) unavoidable; Motion (~47KB tr) justified as
  the site's core choreography engine, loaded once and shared; command
  palette isolated to an on-demand chunk that loads on first Ctrl+K.
- Fonts: zero external requests (verified via network log).
- Images: next/image, WebP, explicit dimensions, priority only on the
  headshot.
- depcheck: no real unused dependencies (tailwindcss/mdx flags are false
  positives: PostCSS plugin and type-only import).
- GitHub API failure path re-verified in Agent 05: snapshot render, no
  crash, no slowdown.

## Cut list

Empty. The only trade taken was font-display swap -> optional, recorded
above with its reasoning.
