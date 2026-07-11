import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { getPost, getPostSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Abhishek Kokadwar`,
    description: post.description,
    alternates: post.canonical ? { canonical: post.canonical } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />

      <article className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-small text-foreground-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All posts
          </Link>

          {/* Header */}
          <header className="mt-8 max-w-[68ch]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-foreground-subtle">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>
            {post.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-small text-foreground-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          {/* Body + TOC */}
          <div className="mt-12 gap-12 lg:grid lg:grid-cols-[minmax(0,68ch)_1fr]">
            <div className="min-w-0">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeShiki,
                        {
                          themes: {
                            light: "github-light",
                            dark: "github-dark-dimmed",
                          },
                        },
                      ],
                    ],
                  },
                }}
              />

              {post.canonical ? (
                <p className="mt-12 border-t border-border pt-6 text-small text-foreground-subtle">
                  Originally published on{" "}
                  <a
                    href={post.canonical}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent underline-offset-4 hover:underline"
                  >
                    Medium
                  </a>
                  .
                </p>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={post.toc} />
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
