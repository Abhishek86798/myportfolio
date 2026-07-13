"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { siteConfig } from "@/data/site.config";

/**
 * Email action that never silently fails. A plain `mailto:` link does nothing
 * when the OS has no default mail handler — common on desktop. This still opens
 * the mail app when one exists, but ALSO copies the address to the clipboard and
 * shows a brief "Copied" confirmation, so a click is always useful.
 */
export function EmailAction({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard?.writeText(siteConfig.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        /* clipboard blocked — mailto still fires via the href */
      }
    );
  };

  return (
    <a
      href={`mailto:${siteConfig.email}`}
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          Copied
        </>
      ) : (
        children
      )}
    </a>
  );
}
