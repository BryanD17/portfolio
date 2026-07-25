import type { Profile } from "@/content/schema";

/**
 * Transcribed from the master document CONTENT BLOCK. Wording is verbatim
 * except that em dashes are replaced with standard punctuation (site-wide
 * rule: no em dashes anywhere).
 */
export const profile: Profile = {
  fullName: "Bryan Djenabia Joseph",
  shortName: "Bryan Joseph",
  location: "San Diego, CA · from Chicago, IL",
  email: "bdjenabia5@gmail.com",
  linkedin: "https://www.linkedin.com/in/bryanjoseph-339479243",
  github: "https://github.com/BryanD17",
  githubUsername: "BryanD17",
  openToWork: "Open to Summer 2027 SWE internships",

  headline: "I ship production software.",
  subHeadline:
    "CS @ San Diego State '28. An iOS app on the App Store, the site that sells it, a MIPS toolchain running in the browser, and a multithreaded trading engine in Java.",
  metaDescription:
    "Bryan Joseph, software engineer. Shipped an 80,000-line iOS app to the App Store, led a browser-based MIPS simulator, built a Java trading engine.",

  about: `I'm a computer science student at San Diego State carrying a 3.85 GPA, and I spend most of my time shipping software people actually use rather than coursework that gets graded and deleted.

StayFit is my native iOS app, live on the App Store: 80,000+ lines of Swift across 260+ files, with on-device pose detection scoring exercise form in real time, an offline-first sync layer that survives a dead connection, and Stripe Connect payouts for creators. I built its marketing site too, at getstayfitapp.com. I led core-engine development on WebMARS, a complete MIPS32 assembler and simulator that runs entirely in the browser at webmarsimulator.com, including a time-travel debugger that rewinds register and memory state. And I built an event-driven futures trading engine in Java 21 with a Monte Carlo risk simulator running 10,000+ paths.

Before that, a Digital Scholars internship with the University of Illinois System put me in front of a classroom: I taught Swift to 100+ middle-school students, coaching every cohort from zero experience to a working iOS app. Explaining a retain cycle to a thirteen-year-old changes how you write code.

I work across the whole stack an idea has to cross to reach a user (the app, the site, the backend, the CI) and I care most about software that is reliable, measurable, and built for real people. I'm looking for a high-performing team where I can grow fast and ship things that matter.`,

  shortBio:
    "CS @ SDSU '28. Shipped StayFit to the App Store: 80,000+ lines of Swift with on-device pose detection. Led the core engine of WebMARS, a browser-based MIPS simulator. Built a multithreaded futures trading engine in Java 21.",

  heroBootLines: [
    { command: "whoami", output: ["Bryan Djenabia Joseph"] },
    { command: "cat headline.txt", output: ["I ship production software."] },
    { command: "ls ./shipped", output: ["stayfit/    stayfit-web/    webmars/    futures-engine/"] },
  ],

  heroStats: [
    { value: 80000, suffix: "+", label: "lines of Swift shipped to the App Store" },
    { value: 15000, suffix: "+", label: "lines of TypeScript in a live MIPS toolchain" },
    { value: 3.85, decimals: 2, label: "GPA at San Diego State" },
    { value: 100, suffix: "+", label: "students taught to build their first iOS app" },
  ],

  ctas: [
    { label: "View the work", href: "#projects", variant: "primary" },
    { label: "Read the StayFit case study", href: "/projects/stayfit", variant: "primary" },
    { label: "Download résumé", href: "/Bryan-Joseph-Resume.pdf", variant: "secondary" },
    { label: "Get in touch", href: "#contact", variant: "secondary" },
  ],

  contactHeading: "Let's build something.",
  contactBody:
    "I'm looking for Summer 2027 software engineering internships, and I'm always happy to talk about iOS, systems, or anything running in a browser it shouldn't be. The fastest way to reach me is email.",
  footerLine:
    "Built by Bryan Joseph. Next.js, TypeScript, deployed on Vercel. Source on GitHub.",
};
