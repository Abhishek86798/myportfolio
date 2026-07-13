"use client";

import { useEffect, useRef } from "react";
import { useTerminal } from "./context";

const OPEN_WORD = "sudo";

/**
 * Predictable Terminal triggers (§4d, revised):
 *  1. Ctrl+Shift+T (preventDefault so it beats the browser's reopen-tab).
 *  2. Typing "sudo" ONLY when nothing is focused and no overlay is open —
 *     never fires while reading, in Spotlight, or in any input.
 * The footer glyph opens it directly via context; it's not handled here.
 */
export function TerminalTriggers() {
  const { open, setOpen } = useTerminal();
  const bufferRef = useRef("");
  const bufferTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+Shift+T
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setOpen(!open);
        return;
      }

      if (open) return; // typed-word trigger only when terminal is closed

      const target = e.target as HTMLElement | null;
      const typingInField =
        !!target &&
        (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
          target.isContentEditable);
      const overlayOpen = !!document.querySelector('[role="dialog"]');
      if (typingInField || overlayOpen) {
        bufferRef.current = "";
        return;
      }

      // Only track plain letter keys for the buffer.
      if (e.key.length === 1 && /[a-z]/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-OPEN_WORD.length);
        if (bufferRef.current === OPEN_WORD) {
          bufferRef.current = "";
          setOpen(true);
        }
        // reset the buffer if the user pauses
        if (bufferTimer.current) clearTimeout(bufferTimer.current);
        bufferTimer.current = setTimeout(() => {
          bufferRef.current = "";
        }, 1000);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (bufferTimer.current) clearTimeout(bufferTimer.current);
    };
  }, [open, setOpen]);

  return null;
}
