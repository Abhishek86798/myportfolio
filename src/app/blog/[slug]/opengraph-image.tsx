import { ImageResponse } from "next/og";
import { getPost, getPostSlugs } from "@/lib/blog";

export const alt = "Blog post — Abhishek Kokadwar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Per-post OG card with the post title, matching the site's dark palette.
export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "Writing";
  const readingTime = post?.readingTime ?? null;

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
          Writing
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? "64px" : "80px",
            fontWeight: 700,
            color: "#f2f2f3",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "30px",
            color: "#a1a1aa",
          }}
        >
          <span style={{ color: "#34d399", fontWeight: 600 }}>
            Abhishek Kokadwar
          </span>
          {readingTime ? <span>· {readingTime} min read</span> : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
