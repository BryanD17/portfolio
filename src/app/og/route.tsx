import { ImageResponse } from "next/og";
import { getCaseStudy, getProfile } from "@/content";
import { OG_COLORS as C } from "@/lib/site";

/**
 * Dynamic OG images, 1200x630. No slug: the site card. ?slug=<case-study>:
 * that project's card with title, tagline, role, and stack.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const profile = getProfile();

  const study = slug ? getCaseStudy(slug) : undefined;

  const terminalBar = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 14, height: 14, borderRadius: 4, background: "#e5534b" }} />
      <div style={{ width: 14, height: 14, borderRadius: 4, background: "#d4a72c" }} />
      <div style={{ width: 14, height: 14, borderRadius: 4, background: "#57ab5a" }} />
      <div style={{ color: C.muted, fontSize: 24, marginLeft: 12 }}>bryan@portfolio: ~</div>
    </div>
  );

  if (study) {
    const fm = study.frontmatter;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: C.bg,
            padding: 64,
            fontFamily: "monospace",
            justifyContent: "space-between",
          }}
        >
          {terminalBar}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ color: C.accent, fontSize: 28 }}>{`~/shipped/${fm.slug}`}</div>
            <div style={{ color: C.fg, fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
              {fm.title}
            </div>
            <div style={{ display: "flex", gap: 12, color: C.muted, fontSize: 30 }}>{fm.tagline}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: C.muted, fontSize: 24 }}>{fm.role.split(",")[0]}</div>
            <div style={{ color: C.accent, fontSize: 24 }}>
              {fm.stack.slice(0, 4).join(" · ")}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.bg,
          padding: 64,
          fontFamily: "monospace",
          justifyContent: "space-between",
        }}
      >
        {terminalBar}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 12, color: C.muted, fontSize: 30 }}>
            <span style={{ color: C.accent }}>$</span> whoami
          </div>
          <div style={{ color: C.fg, fontSize: 64, fontWeight: 700 }}>{profile.fullName}</div>
          <div style={{ display: "flex", color: C.fg, fontSize: 40 }}>
            I ship production software.<span style={{ color: C.accent }}>_</span>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 24 }}>
          iOS on the App Store · browser MIPS toolchain · Java trading engine
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
