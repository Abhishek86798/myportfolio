import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; file: string }> }
) {
  const { slug, file } = await params;

  // Prevent path traversal — only allow a plain filename inside the post dir.
  if (slug.includes("..") || file.includes("..") || file.includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(file).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) return new NextResponse("Not found", { status: 404 });

  try {
    const buf = await readFile(path.join(BLOG_DIR, slug, file));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
