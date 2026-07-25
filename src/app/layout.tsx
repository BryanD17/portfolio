import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { getCaseStudies, getExperience, getProfile, getSkills } from "@/content";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bryan Joseph",
    template: "%s · Bryan Joseph",
  },
  description: profile.metaDescription,
  authors: [{ name: profile.fullName, url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Bryan Joseph",
    title: "Bryan Joseph",
    description: profile.metaDescription,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Bryan Joseph, software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bryan Joseph",
    description: profile.metaDescription,
    images: ["/og"],
  },
};

/** JSON-LD Person, validated structure; rendered once in the root layout. */
function personJsonLd() {
  const skills = getSkills().groups.flatMap((g) => g.skills.map((s) => s.name));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.shortName,
    jobTitle: "Software Engineer",
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "San Diego State University" },
      { "@type": "HighSchool", name: "Lane Technical College Prep High School" },
    ],
    knowsAbout: skills,
  };
}

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
