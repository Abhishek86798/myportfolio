"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  runCommand,
  autocomplete,
  WELCOME,
  type OutputLine,
} from "@/lib/terminal-commands";
import { useTerminal } from "./context";
import { useTheme } from "@/components/theme/theme-provider";

type HistoryEntry =
  | { kind: "input"; text: string }
  | { kind: "output"; line: OutputLine };

export function Terminal() {
  const { open, setOpen } = useTerminal();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerReturnRef = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    setInput("");
    setHistoryIdx(null);
  }, [setOpen]);

  // Seed the welcome banner the first time it opens; restore focus on open,
  // remember the previously-focused element to restore on close.
  useEffect(() => {
    if (open) {
      triggerReturnRef.current = document.activeElement;
      setLog((prev) =>
        prev.length === 0
          ? WELCOME.map((line) => ({ kind: "output" as const, line }))
          : prev
      );
      document.body.style.overflow = "hidden";
      // focus after paint
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      (triggerReturnRef.current as HTMLElement | null)?.focus?.();
    }
  }, [open]);

  // Keep the log scrolled to the bottom.
  useEffect(() => {
    if (open) logEndRef.current?.scrollIntoView({ block: "end" });
  }, [log, open]);

  const applyEffect = useCallback(
    (effect: ReturnType<typeof runCommand>["effect"]) => {
      if (!effect) return;
      switch (effect.type) {
        case "clear":
          setLog([]);
          break;
        case "exit":
          close();
          break;
        case "navigate":
          close();
          if (effect.href.startsWith("#")) {
            document.querySelector(effect.href)?.scrollIntoView({ behavior: "smooth" });
            history.replaceState(null, "", effect.href);
          } else {
            router.push(effect.href);
          }
          break;
        case "theme":
          if (theme !== effect.value) toggle();
          break;
      }
    },
    [close, router, theme, toggle]
  );

  const submit = useCallback(
    (raw: string) => {
      const entry: HistoryEntry = { kind: "input", text: raw };
      const result = runCommand(raw);
      setLog((prev) => [
        ...prev,
        entry,
        ...result.lines.map((line) => ({ kind: "output" as const, line })),
      ]);
      if (raw.trim()) setCmdHistory((h) => [...h, raw.trim()]);
      setHistoryIdx(null);
      setInput("");
      applyEffect(result.effect);
    },
    [applyEffect]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = historyIdx === null ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const next = historyIdx + 1;
      if (next >= cmdHistory.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completed = autocomplete(input);
      if (completed) setInput(completed);
    }
  };

  const promptLabel = "~ %";

  const body = useMemo(
    () => (
      <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[8vh] sm:pt-[12vh]">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={close}
          aria-hidden
        />
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#2a2a2e] bg-[#0a0a0b] font-mono shadow-2xl"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[#2a2a2e] px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <span className="ml-2 text-small text-[#a1a1a8]">
              abhishek@portfolio — ~
            </span>
          </div>

          {/* Output log */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 text-small leading-relaxed"
            aria-live="polite"
          >
            {log.map((entry, i) =>
              entry.kind === "input" ? (
                <div key={i} className="flex gap-2">
                  <span className="text-[#34d399]">{promptLabel}</span>
                  <span className="text-[#f2f2f3]">{entry.text}</span>
                </div>
              ) : (
                <OutputRow key={i} line={entry.line} />
              )
            )}
            <div ref={logEndRef} />
          </div>

          {/* Input line */}
          <div className="flex items-center gap-2 border-t border-[#2a2a2e] px-4 py-3">
            <span className="text-[#34d399]" aria-hidden>{promptLabel}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-small text-[#f2f2f3] caret-[#34d399] focus:outline-none"
            />
          </div>

          {/* Hint bar */}
          <div className="border-t border-[#2a2a2e] px-4 py-2 text-[0.7rem] text-[#6b6b70]">
            esc exit · ↑↓ history · tab autocomplete · type 'help'
          </div>
        </motion.div>
      </div>
    ),
    [log, input, reduceMotion, close] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!mounted || !open) return null;
  return createPortal(body, document.body);
}

function OutputRow({ line }: { line: OutputLine }) {
  const color = line.accent
    ? "text-[#34d399]"
    : line.dim
      ? "text-[#6b6b70]"
      : "text-[#c9c9cf]";
  if (line.link) {
    return (
      <a
        href={line.link.href}
        target={line.link.external ? "_blank" : undefined}
        rel={line.link.external ? "noopener noreferrer" : undefined}
        className={`block whitespace-pre-wrap underline-offset-4 hover:underline ${color}`}
      >
        {line.text}
      </a>
    );
  }
  return <div className={`whitespace-pre-wrap ${color}`}>{line.text || " "}</div>;
}
