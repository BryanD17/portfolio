# Agent 15: visibility and attribution record (2026-07-24)

## Secret scans (mandatory before any visibility change)

- stayfit-website: full-history scan (95 commits) for key patterns
  (sk_live, pk_live, AKIA, JWT prefixes, re\_ keys, gh tokens, RSA/OPENSSH
  blocks). Result: CLEAN. All matches were env-var references, placeholder
  examples (re_xxx...), design-token naming, and Lighthouse report text.
  Note for the owner: the repo history contains internal planning documents
  (agent execution plans with candid notes). Consider whether those should
  be scrubbed before any visibility flip.
- Futures-Trading-Algorithm: full-history scan on the local clone for
  literal keys/passwords/private-key blocks. Result: CLEAN (no literal
  secrets; credentials live outside the repo). The live account id is NOT
  in history (0 hits). However, history references the live trading
  platform integration extensively (4,262 matching lines).

## Decisions

1. Futures-Trading-Algorithm: OWNER DECISION PENDING. Recommendation here
   deliberately differs from the master document's default (a):
   RECOMMEND (b), a public companion repo with the architecture write-up,
   the event bus, and the risk pipeline, keeping strategy and live platform
   integration private. Reason: this is not a paper project; the engine
   trades real prop-firm evaluation/funded accounts, and the master document
   itself says to choose (b) when real capital is involved. Until decided:
   stays private, allow-listed, PRIVATE badge, no repo link (current state).
2. stayfit-website: OWNER DECISION PENDING. Scan is clean, so flipping
   public is LOW RISK once the internal planning docs question is settled.
   Recommended: make public after scrubbing/accepting the planning docs.
3. StayFit iOS: stays PRIVATE (commercial product with payments); confirmed
   allow-listed; card links to getstayfitapp.com, never a repo URL.
   Optional pose-scoring extraction remains an owner option.
4. WebMARS: option (a) already in effect: the case study links to the
   canonical org repo (public, verified), role renders "Core-engine lead"
   (50 authored commits verified by API), attribution note visible on the
   page. No fork created; nothing implies sole authorship.

## Link check

Crawled /, /projects, and all four case studies: 61 unique links, zero
404s. The only non-200 is the mailto: scheme, which is not fetchable.
