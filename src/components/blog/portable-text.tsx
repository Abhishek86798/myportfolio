import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity-image";
import { CodeBlock } from "./code-block";
import { Info, Lightbulb, AlertTriangle, Quote } from "lucide-react";

/** Slugify matched to rehype-slug / lib/blog.ts so heading IDs line up with the TOC. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getNodeText(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getNodeText).join("");
  if (children?.props?.children) return getNodeText(children.props.children);
  return "";
}

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-body-lg leading-[1.75] text-foreground-muted">
        {children}
      </p>
    ),
    h2: ({ children }) => {
      const id = slugify(getNodeText(children));
      return (
        <h2
          id={id}
          className="mt-16 scroll-mt-24 text-title font-semibold tracking-tight text-foreground"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getNodeText(children));
      return (
        <h3
          id={id}
          className="mt-10 scroll-mt-24 text-[1.375rem] font-semibold tracking-tight text-foreground"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const id = slugify(getNodeText(children));
      return (
        <h4
          id={id}
          className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-accent pl-5 text-body-lg italic leading-[1.7] text-foreground">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 flex flex-col gap-3 text-body-lg leading-[1.7] text-foreground-muted">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 flex list-decimal flex-col gap-3 pl-6 text-body-lg leading-[1.7] text-foreground-muted">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="marker:text-accent pl-1">{children}</li>
    ),
    number: ({ children }) => (
      <li className="marker:text-accent pl-1">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-4">{children}</span>
    ),
    "strike-through": ({ children }) => (
      <span className="line-through text-foreground-subtle">{children}</span>
    ),
    code: ({ children }) => (
      <code className="rounded-md border border-border bg-background-subtle px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      const openInNewTab = value?.openInNewTab !== false && isExternal;
      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value)?.url();
      if (!imageUrl) return null;

      return (
        <figure className="mt-10">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={1200}
            height={675}
            className="w-full rounded-2xl border border-border"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {value.caption ? (
            <figcaption className="mt-3 text-center text-small text-foreground-subtle">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },

    codeBlock: ({ value }) => {
      if (value.highlightedHtml) {
        return (
          <CodeBlock filename={value.filename} language={value.language}>
            <div
              dangerouslySetInnerHTML={{ __html: value.highlightedHtml }}
              className="[&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&>pre]:!border-none"
            />
          </CodeBlock>
        );
      }

      return (
        <CodeBlock filename={value.filename} language={value.language}>
          <code>{value.code}</code>
        </CodeBlock>
      );
    },

    callout: ({ value }) => {
      const tone = value?.tone || "info";
      const configs: Record<
        string,
        {
          icon: React.ComponentType<{ className?: string }>;
          border: string;
          iconColor: string;
        }
      > = {
        info: {
          icon: Info,
          border: "border-blue-500/30 bg-blue-500/5",
          iconColor: "text-blue-400",
        },
        tip: {
          icon: Lightbulb,
          border: "border-emerald-500/30 bg-emerald-500/5",
          iconColor: "text-emerald-400",
        },
        warning: {
          icon: AlertTriangle,
          border: "border-amber-500/30 bg-amber-500/5",
          iconColor: "text-amber-400",
        },
        quote: {
          icon: Quote,
          border: "border-accent/40 bg-accent/5",
          iconColor: "text-accent",
        },
      };

      const current = configs[tone] || configs.info;
      const IconComponent = current.icon;

      return (
        <div className={`mt-8 rounded-2xl border p-5 ${current.border}`}>
          <div className="flex items-start gap-3.5">
            <IconComponent
              className={`mt-0.5 h-5 w-5 shrink-0 ${current.iconColor}`}
            />
            <div className="min-w-0 flex-1">
              {value.title ? (
                <h4 className="text-small font-semibold text-foreground">
                  {value.title}
                </h4>
              ) : null}
              <p
                className={`text-small leading-relaxed text-foreground-muted ${
                  value.title ? "mt-1.5" : ""
                }`}
              >
                {value.text}
              </p>
            </div>
          </div>
        </div>
      );
    },
  },
};

export function PortableTextRenderer({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={portableTextComponents} />;
}
