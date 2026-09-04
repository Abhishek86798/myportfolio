"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy, FileCode } from "lucide-react";

export type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  filename?: string;
  language?: string;
};

/**
 * Wraps a syntax-highlighted <pre>. Supports optional filename header
 * and copy-to-clipboard button.
 */
export function CodeBlock({
  children,
  filename,
  language,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="group relative mt-6 overflow-hidden rounded-2xl border border-border bg-background-subtle">
      {filename || language ? (
        <div className="flex items-center justify-between border-b border-border/60 bg-surface/60 px-4 py-2 text-xs font-mono text-foreground-subtle">
          <div className="flex items-center gap-2">
            <FileCode className="h-3.5 w-3.5 text-accent" />
            <span className="font-medium text-foreground-muted">
              {filename || language}
            </span>
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy code"}
            className="inline-flex items-center gap-1.5 text-xs text-foreground-muted transition-colors hover:text-accent focus-visible:outline-none"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="text-accent">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-md border border-border bg-background/80 text-foreground-muted opacity-100 backdrop-blur transition-opacity hover:text-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:opacity-0 md:group-hover:opacity-100"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
        </button>
      )}
      <pre
        ref={preRef}
        className="overflow-x-auto p-5 text-small [&_code]:font-mono"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
