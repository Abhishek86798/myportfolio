import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string | null; // public URL (see note on images below)
  readingTime: number;
  canonical: string | null; // original source URL (e.g. Medium), if cross-posted
};

export type Post = PostMeta & {
  content: string; // raw MDX body (frontmatter stripped)
  toc: TocItem[];
};

/** GitHub-style slugify, matched to rehype-slug's default so TOC links resolve. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Pull ## and ### headings for the table of contents. */
function extractToc(mdx: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = mdx.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const level = m[1].length as 2 | 3;
      const text = m[2].replace(/[#*`]/g, "").trim();
      toc.push({ id: slugify(text), text, level });
    }
  }
  return toc;
}

async function listPostDirs(): Promise<string[]> {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function readPost(slug: string): Promise<Post | null> {
  const file = path.join(BLOG_DIR, slug, "blog.mdx");
  let raw: string;
  try {
    raw = await readFile(file, "utf-8");
  } catch {
    return null; // dir exists but no blog.mdx yet (e.g. a stub folder)
  }

  const { data, content } = matter(raw);
  if (!data.title) return null; // require frontmatter to publish

  // Co-located images live in /content and aren't statically served. We rewrite
  // ./image refs to an API route that streams them (see app/blog-assets route).
  const rewritten = content.replace(
    /\((\.\/[^)]+)\)/g,
    (_all, rel: string) =>
      `(/blog-assets/${slug}/${rel.replace(/^\.\//, "")})`
  );

  const cover =
    typeof data.cover === "string"
      ? `/blog-assets/${slug}/${data.cover.replace(/^\.\//, "")}`
      : null;

  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    cover,
    readingTime: typeof data.readingTime === "number" ? data.readingTime : 5,
    canonical: typeof data.canonical === "string" ? data.canonical : null,
    content: rewritten,
    toc: extractToc(content),
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const dirs = await listPostDirs();
  const posts = await Promise.all(dirs.map(readPost));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(
      (p): PostMeta => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.date,
        tags: p.tags,
        cover: p.cover,
        readingTime: p.readingTime,
        canonical: p.canonical,
      })
    );
}

export async function getPost(slug: string): Promise<Post | null> {
  return readPost(slug);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
