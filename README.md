# Bryan Joseph, Portfolio

Personal portfolio for Bryan Djenabia Joseph: software engineer, CS at San Diego
State University. Live projects include StayFit (iOS, App Store), the StayFit
marketing site, WebMARS (browser MIPS simulator), and a Java futures trading
engine.

## Stack

- Next.js (App Router) with TypeScript strict mode
- Tailwind CSS v4 with shadcn/ui components
- Motion (Framer Motion) for the animation system
- MDX for case studies
- Resend for the contact form
- Deployed on Vercel

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Scripts: `dev`, `build`, `typecheck`, `lint`, `format`, `sync:github`.

## Content

Site copy lives in `src/content/` (typed TypeScript) and
`content/case-studies/` (MDX). GitHub project data is fetched server-side and
revalidated hourly.

`content/source/` holds owner-provided source material (resume PDF, raw assets)
and is git-ignored. It is required for the resume download to build; the site
still builds without it and hides the resume button.
