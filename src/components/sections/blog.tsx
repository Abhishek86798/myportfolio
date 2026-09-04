import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { BlogCard } from "@/components/blog/blog-card";
import type { PostMeta } from "@/lib/blog";

export function Blog({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <Section id="blog" variant="raised">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading id="blog">Blog</SectionHeading>
        <Link
          href="/blog"
          className="mb-8 hidden shrink-0 items-center gap-1.5 text-small font-medium text-accent transition-colors hover:text-accent-hover sm:inline-flex sm:mb-10"
        >
          All posts
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.slice(0, 3).map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-1.5 text-small font-medium text-accent transition-colors hover:text-accent-hover sm:hidden"
      >
        All posts
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Section>
  );
}
