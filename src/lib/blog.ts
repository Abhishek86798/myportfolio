import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { sanityFetch } from "@/sanity/client";
import { postsQuery, postBySlugQuery } from "@/sanity/queries";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type TocItem = { id: string; text: string; level: 2 | 3 };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string | null;
  readingTime: number;
  canonical: string | null;
  source: "sanity" | "mdx";
};

export type Post = PostMeta & {
  source: "sanity" | "mdx";
  content?: string; // raw MDX body (frontmatter stripped)
  body?: any[]; // Sanity Portable Text blocks
  toc: TocItem[];
};

/** GitHub-style slugify, matched to rehype-slug's default so TOC links resolve. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Pull ## and ### headings for the table of contents from MDX. */
function extractMdxToc(mdx: string): TocItem[] {
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

/** Extract ## and ### headings from Sanity Portable Text body blocks. */
export function extractSanityToc(body: any[]): TocItem[] {
  if (!Array.isArray(body)) return [];
  const toc: TocItem[] = [];
  for (const block of body) {
    if (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    ) {
      const level = block.style === "h2" ? 2 : 3;
      const text = (block.children || [])
        .map((c: any) => c.text || "")
        .join("")
        .trim();
      if (text) {
        toc.push({ id: slugify(text), text, level });
      }
    }
  }
  return toc;
}

/** Calculate approximate reading time from Sanity Portable Text body blocks. */
export function calculateSanityReadingTime(body: any[]): number {
  if (!Array.isArray(body)) return 3;
  let wordCount = 0;
  for (const block of body) {
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const span of block.children) {
        if (typeof span.text === "string") {
          wordCount += span.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    } else if (block._type === "codeBlock" && typeof block.code === "string") {
      wordCount += block.code.trim().split(/\s+/).filter(Boolean).length;
    }
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

async function listPostDirs(): Promise<string[]> {
  try {
    const entries = await readdir(BLOG_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function readLocalMdxPost(slug: string): Promise<Post | null> {
  const file = path.join(BLOG_DIR, slug, "blog.mdx");
  let raw: string;
  try {
    raw = await readFile(file, "utf-8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  if (!data.title) return null;

  const rewritten = content.replace(
    /\((\.\/[^)]+)\)/g,
    (_all, rel: string) => `(/blog-assets/${slug}/${rel.replace(/^\.\//, "")})`
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
    source: "mdx",
    content: rewritten,
    toc: extractMdxToc(content),
  };
}

/**
 * Fetch all posts, combining Sanity published posts and local MDX files.
 * Sanity documents take priority if a slug exists in both.
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  const [sanityPosts, localDirs] = await Promise.all([
    sanityFetch<any[]>({ query: postsQuery, tags: ["post"] }).catch(
      () => []
    ),
    listPostDirs(),
  ]);

  const mdxPosts = (
    await Promise.all(localDirs.map(readLocalMdxPost))
  ).filter((p): p is Post => p !== null);

  const postsBySlug = new Map<string, PostMeta>();

  // Add local MDX posts first
  for (const post of mdxPosts) {
    postsBySlug.set(post.slug, {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      cover: post.cover,
      readingTime: post.readingTime,
      canonical: post.canonical,
      source: "mdx",
    });
  }

  // Override / append Sanity posts (higher priority)
  for (const sp of sanityPosts || []) {
    if (!sp.slug) continue;
    postsBySlug.set(sp.slug, {
      slug: sp.slug,
      title: sp.title || "Untitled",
      description: sp.description || "",
      date: sp.date || new Date().toISOString(),
      tags: Array.isArray(sp.tags) ? sp.tags : [],
      cover: sp.cover || null,
      readingTime: calculateSanityReadingTime(sp.body),
      canonical: sp.canonical || null,
      source: "sanity",
    });
  }

  return Array.from(postsBySlug.values()).sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
}

/**
 * Fetch a single post by slug, checking Sanity first then local MDX files.
 */
export async function getPost(slug: string): Promise<Post | null> {
  try {
    const sanityPost = await sanityFetch<any>({
      query: postBySlugQuery,
      params: { slug },
      tags: [`post:${slug}`],
    });

    if (sanityPost && sanityPost.title) {
      return {
        slug: sanityPost.slug,
        title: sanityPost.title,
        description: sanityPost.description || "",
        date: sanityPost.date || new Date().toISOString(),
        tags: Array.isArray(sanityPost.tags) ? sanityPost.tags : [],
        cover: sanityPost.cover || null,
        readingTime: calculateSanityReadingTime(sanityPost.body),
        canonical: sanityPost.canonical || null,
        source: "sanity",
        body: sanityPost.body || [],
        toc: extractSanityToc(sanityPost.body || []),
      };
    }
  } catch (err) {
    console.error(`Failed to fetch Sanity post for slug "${slug}":`, err);
  }

  // Fallback to local MDX file
  return readLocalMdxPost(slug);
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
