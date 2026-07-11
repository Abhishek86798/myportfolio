import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing — Abhishek Kokadwar",
  description:
    "Essays on product discovery, AI security, systems, and the trade-offs behind engineering decisions.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-small text-foreground-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Home
        </Link>

        <header className="mb-12 mt-8 md:mb-16">
          <p className="mb-3 flex items-center gap-2 text-small font-medium uppercase tracking-widest text-foreground-muted">
            <span className="h-px w-6 bg-accent" aria-hidden />
            Writing
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Essays & notes
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-foreground-muted">
            Thinking out loud about product discovery, AI security, and the
            trade-offs behind engineering decisions.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-body text-foreground-muted">
            No posts yet — check back soon.
          </p>
        )}
      </div>
    </main>
  );
}
