# Agent 17: accessibility and motion QA record (2026-07-24)

## Results

- axe: ZERO violations on all 8 routes (/, /projects, 4 case studies,
  /styleguide, /motion-lab) after fixes: dl misuse replaced with semantic
  lists, h1 added to /projects, /styleguide, /motion-lab, heading order
  corrected on dev pages.
- Contrast: every token pairing passes in BOTH themes (full table in the
  audit output; worst dark pair fg-subtle on bg-elevated 4.93:1). Fixed:
  border-strong (both themes) and light warning.
- Skip link: first tab stop, visible on focus. 40-stop keyboard traverse:
  every focusable shows an outline or ring after fixing the terminal input
  (outline-none removed; 2px solid verified).
- Screen-reader review: ARIA snapshot on /, /projects, /projects/stayfit:
  zero unnamed interactive elements. NOTE: this is an accessibility-tree
  review via Playwright, not a literal NVDA session; a human NVDA pass
  remains worthwhile before applications.
- Reduced motion: 0 stuck elements (opacity-0 or pre-animation offsets) on
  all 6 public routes; ambient canvas absent; full-page screenshots captured
  in both modes; the reduced pages read as finished designs.
- No scroll-jacking: 0 prevented wheel events across 20 wheel gestures.
- No re-fires: 0 low-opacity reveal targets after scroll-down/up cycles.
- Breakpoints: 0 horizontal overflow at 320/375/414/768/1024/1280/1440/1920.
- 200% zoom equivalent (640px viewport): 0 overflow, fully usable.
- Tap targets: standalone controls expanded to a 44px hit area via the
  .touch-target pseudo-element; adjacent inline chips stay natural size
  under the WCAG inline/spacing exception so hit areas never overlap.
- Light theme: full-page screenshot reviewed; composed, all sections work.

## Animation table (every animation, its agent, primitive, reduced behavior)

| # | Animation | Agent | Primitive | Reduced motion |
|---|-----------|-------|-----------|----------------|
| 1 | Hero boot typing | 06 | TypeLine | full text instantly |
| 2 | Terminal cursor blink | 02 | CSS .cursor-blink | static block |
| 3 | Headline split reveal | 06 | SplitText (word) | complete text |
| 4 | Hero metric count-ups | 06 | CountUp | final values |
| 5 | Headshot parallax | 06 | ParallaxLayer | static at mid offset |
| 6 | Hero scroll-linked exit | 06 | ScrollLinked | static, opacity 1 |
| 7 | Ambient backdrop | 06 | AmbientBackdrop | static gradient; absent <768px |
| 8 | Header progressive blur | 06 | useScroll opacity | backdrop fully shown |
| 9 | Card entry reveals | 07 | RevealOnScroll | visible in place |
| 10 | Magnetic card hover | 07 | MagneticCard | border color only |
| 11 | Filter layout animation | 07 | layout + AnimatePresence | instant |
| 12 | Ken-Burns cover drift | 07 | ScrollLinked scale | static |
| 13 | Case-study title reveal | 08 | SplitText (line) | complete text |
| 14 | Metric wall count-ups | 08 | CountUp | final values |
| 15 | Body section reveals | 08 | SectionReveal (ScrollLinked) | static visible |
| 16 | TOC indicator slide | 08 | layoutId + SPRING_SNAP | jumps |
| 17 | Reading progress bar | 08 | scaleX scroll-linked | removed |
| 18 | Gallery + lightbox shared element | 08 | layoutId | plain fade |
| 19 | Timeline spine draw | 10 | scaleY scroll-bound | fully drawn |
| 20 | Node pop + card slide | 10 | whileInView SPRING_SNAP | visible |
| 21 | Language proportion fill | 11 | scaleX 900ms | full width |
| 22 | Skill chip wave + hover | 11 | variants + whileHover | visible; color hover |
| 23 | Awards fade-rise | 11 | RevealOnScroll | visible |
| 24 | Form field stagger | 12 | variants | visible |
| 25 | Success checkmark draw | 12 | SVG pathLength | complete |
| 26 | Page transitions | 13 | PageTransition | none |
| 27 | Smooth anchor scroll | 13 | CSS scroll-behavior | auto |

Vestibular safety: parallax clamped to 16-40px, no zoom bursts, no flashing
above 3Hz anywhere (cursor blink is ~0.94Hz).

## Cut list

Empty. Nothing needed removal; every animation passed as built or was fixed.
