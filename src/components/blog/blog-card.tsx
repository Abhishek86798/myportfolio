import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex touch-manipulation flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 md:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-foreground-subtle">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime} min</span>
      </div>

      <h3 className="mt-3 flex items-start gap-2 text-title font-semibold tracking-tight text-foreground">
        <span className="transition-colors group-hover:text-accent">
          {post.title}
        </span>
        <ArrowUpRight
          className="mt-1.5 h-5 w-5 shrink-0 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </h3>

      {post.description ? (
        <p className="mt-3 max-w-2xl text-body text-foreground-muted">
          {post.description}
        </p>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-background-subtle px-3 py-1 text-small text-foreground-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
