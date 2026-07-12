import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site.config";

export const alt = "Abhishek Kokadwar — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG card, generated at build time. Matches the site's dark palette
// (bg #0a0a0b, fg #f2f2f3, emerald accent #34d399).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#a1a1aa",
            fontSize: "28px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: "48px", height: "4px", background: "#34d399" }} />
          Portfolio
        </div>

        {/* Middle: name + role */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "92px",
              fontWeight: 700,
              color: "#f2f2f3",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "40px",
              color: "#34d399",
              fontWeight: 600,
            }}
          >
            {siteConfig.role}
          </div>
        </div>

        {/* Bottom: tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "30px",
            color: "#a1a1aa",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          Building AI systems, backend infrastructure, and security tooling.
        </div>
      </div>
    ),
    { ...size }
  );
}
