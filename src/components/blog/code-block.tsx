"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Wraps a Shiki-highlighted <pre>. Shiki renders the syntax colors server-side;
 * this adds the client-only copy button.
 */
export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
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
    <div className="group relative mt-6">
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
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-2xl border border-border bg-background-subtle p-5 text-small [&_code]:font-mono"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
