import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCaseStudies, getExperience, getProfile } from "@/content";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ThemeToggle } from "@/components/interactive/ThemeToggle";
import { CommandK } from "@/components/interactive/CommandK";
import { PageTransition } from "@/components/motion/PageTransition";
import type { PaletteData } from "@/components/interactive/palette-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const profile = getProfile();

export const metadata: Metadata = {
  title: {
    default: "Bryan Joseph",
    template: "%s · Bryan Joseph",
  },
  description: profile.metaDescription,
};

/** Applies the stored theme BEFORE first paint; no flash of wrong theme. */
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paletteData: PaletteData = {
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    resumeAvailable: fs.existsSync(path.join(process.cwd(), "public", "Bryan-Joseph-Resume.pdf")),
    caseStudies: getCaseStudies().map((s) => ({
      slug: s.frontmatter.slug,
      title: s.frontmatter.title,
    })),
    repos: [
      { name: "WebMARS (org)", url: "https://github.com/Webmarssimulator/WebMARS" },
      { name: "SDSUMaps", url: "https://github.com/BryanD17/SDSUMaps" },
      { name: "webmars-api", url: "https://github.com/BryanD17/webmars-api" },
      { name: "hate-speech-detector", url: "https://github.com/BryanD17/hate-speech-detector" },
      { name: "Stock-Market-Predictor", url: "https://github.com/BryanD17/Stock-Market-Predictor" },
      { name: "NLP-Project", url: "https://github.com/BryanD17/NLP-Project" },
      { name: "Ai-reservation-bot", url: "https://github.com/BryanD17/Ai-reservation-bot" },
    ],
    roles: getExperience().flatMap((g) =>
      g.roles.map((r) => ({ title: r.title, dates: `${r.startDate} to ${r.endDate ?? "present"}` }))
    ),
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-accent px-3 py-2 font-mono text-sm text-accent-fg focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4"
        >
          Skip to main content
        </a>
        <Header
          githubUrl={profile.github}
          linkedinUrl={profile.linkedin}
          themeToggle={<ThemeToggle />}
          commandHint={<CommandK data={paletteData} />}
        />
        <div id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </body>
    </html>
  );
}
