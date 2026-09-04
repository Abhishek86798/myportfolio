import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-7 sm:p-8 shadow-xl text-left before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4 font-mono text-xs text-foreground-subtle">
          <span>// 404 NOT FOUND</span>
          <span className="text-red-400">exit 127</span>
        </div>

        <p className="font-mono text-small text-foreground">
          <span className="text-accent mr-2 font-bold">❯</span>
          <span className="text-red-400 dark:text-red-300">command not found:</span> target route
        </p>
        <p className="mt-2 font-mono text-xs text-foreground-muted leading-relaxed">
          The requested path does not exist in this environment.
        </p>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-subtle px-4 py-2 font-mono text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            <span>cd ~</span>
            <span className="text-foreground-subtle">↵</span>
          </Link>
          <span className="font-mono text-[11px] text-foreground-subtle">
            status: unresolved
          </span>
        </div>
      </div>
    </div>
  );
}
