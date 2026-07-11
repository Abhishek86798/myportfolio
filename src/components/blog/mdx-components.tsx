import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./code-block";

/** Slugify matched to rehype-slug / lib/blog.ts so heading IDs line up with the TOC. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function headingId(children: React.ReactNode): string {
  const text = typeof children === "string" ? children : String(children ?? "");
  return slugify(text);
}

export const mdxComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      id={headingId(children)}
      className="mt-16 scroll-mt-24 text-title font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      id={headingId(children)}
      className="mt-10 scroll-mt-24 text-[1.375rem] font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-6 text-body-lg leading-[1.8] text-foreground-muted" {...props} />
  ),
  a: ({ href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-medium text-accent underline-offset-4 hover:underline"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-6 flex flex-col gap-3 text-body-lg leading-[1.7] text-foreground-muted" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-6 flex list-decimal flex-col gap-3 pl-6 text-body-lg leading-[1.7] text-foreground-muted" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="marker:text-accent" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mt-6 border-l-2 border-accent pl-5 text-body-lg italic leading-[1.7] text-foreground"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  hr: () => <hr className="my-12 border-border" />,
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") return null;
    return (
      <figure className="mt-10">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={675}
          className="w-full rounded-2xl border border-border"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        {alt ? (
          <figcaption className="mt-3 text-center text-small text-foreground-subtle">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  pre: CodeBlock,
  code: (props: ComponentPropsWithoutRef<"code">) => {
    // Inline code only — fenced blocks are handled by <pre>/CodeBlock + Shiki.
    return (
      <code
        className="rounded-md border border-border bg-background-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
        {...props}
      />
    );
  },
};
