import { siteConfig } from "@/data/site.config";
import { projects } from "@/data/projects";
import { journey } from "@/data/journey";
import { skillGroups } from "@/data/skills";

/** A single line of terminal output. `accent` renders emerald; `link` is clickable. */
export type OutputLine = {
  text: string;
  accent?: boolean;
  dim?: boolean;
  link?: { href: string; external?: boolean };
};

/** The side effect a command may request from the host component. */
export type CommandEffect =
  | { type: "none" }
  | { type: "clear" }
  | { type: "exit" }
  | { type: "navigate"; href: string }
  | { type: "theme"; value: "dark" | "light" };

export type CommandResult = {
  lines: OutputLine[];
  effect?: CommandEffect;
};

type Command = {
  name: string;
  /** One-line description shown in `help`. Omit to hide from help (easter eggs). */
  help?: string;
  run: (args: string[]) => CommandResult;
};

const line = (text: string, extra?: Partial<OutputLine>): OutputLine => ({
  text,
  ...extra,
});

// Public, listed commands ---------------------------------------------------

const COMMANDS: Command[] = [
  {
    name: "help",
    help: "list available commands",
    run: () => ({
      lines: [
        line("Available commands:", { dim: true }),
        ...COMMANDS.filter((c) => c.help).map((c) =>
          line(`  ${c.name.padEnd(12)} ${c.help}`)
        ),
        line(""),
        line("Tip: ↑/↓ history · tab autocomplete · esc to exit", { dim: true }),
      ],
    }),
  },
  {
    name: "whoami",
    help: "who is this",
    run: () => ({
      lines: [
        line(`${siteConfig.name} · ${siteConfig.role}`, { accent: true }),
        line(siteConfig.tagline),
      ],
    }),
  },
  {
    name: "about",
    help: "the short version",
    run: () => ({
      lines: siteConfig.about.map((a) => line(`• ${a.label}`)),
    }),
  },
  {
    name: "projects",
    help: "things I've built",
    run: () => ({
      lines: [
        ...projects.map((p) =>
          line(`  ${p.slug.padEnd(34)} ${p.title}`)
        ),
        line(""),
        line("Run 'open <name>' to jump to a project.", { dim: true }),
      ],
    }),
  },
  {
    name: "journey",
    help: "how I got here",
    run: () => ({
      lines: journey.map((m) =>
        line(`  ${m.year}  ${m.title}${m.current ? "  ← now" : ""}`, {
          accent: m.current,
        })
      ),
    }),
  },
  {
    name: "skills",
    help: "what I work with",
    run: () => ({
      lines: skillGroups.map((g) =>
        line(`  ${g.category.padEnd(20)} ${g.skills.join(", ")}`)
      ),
    }),
  },
  {
    name: "blog",
    help: "things I've written",
    run: () => ({
      lines: [
        line("Opening the blog…", { dim: true }),
      ],
      effect: { type: "navigate", href: "/blog" },
    }),
  },
  {
    name: "resume",
    help: "download my resume",
    run: () => ({
      lines: [
        line("resume.pdf", { accent: true, link: { href: siteConfig.links.resume, external: true } }),
        line("Click above to download.", { dim: true }),
      ],
    }),
  },
  {
    name: "contact",
    help: "get in touch",
    run: () => ({
      lines: [
        line(siteConfig.email, { accent: true, link: { href: `mailto:${siteConfig.email}`, external: true } }),
        line(siteConfig.links.github, { link: { href: siteConfig.links.github, external: true } }),
        line(siteConfig.links.linkedin, { link: { href: siteConfig.links.linkedin, external: true } }),
      ],
    }),
  },
  {
    name: "currently",
    help: "what I'm doing right now",
    run: () => ({
      lines: [
        line(`${siteConfig.status.label}: ${siteConfig.status.project}`, { accent: true }),
      ],
    }),
  },
  {
    name: "reading",
    help: "current book",
    run: () => ({
      lines: [line(siteConfig.dashboard.reading, { accent: true })],
    }),
  },
  {
    name: "status",
    help: "a quick snapshot",
    run: () => ({
      lines: [
        line("Current Project", { dim: true }),
        line(`  ${siteConfig.status.project}`, { accent: true }),
        line(""),
        line("Reading", { dim: true }),
        line(`  ${siteConfig.dashboard.reading}`, { accent: true }),
        line(""),
        line("Mood", { dim: true }),
        line("  Building.", { accent: true }),
      ],
    }),
  },
  {
    name: "roadmap",
    help: "what's next",
    run: () => ({
      lines: [
        line("Open to SWE internships.", { accent: true }),
        line("Deep in DSA + AI-security work. Let's build something."),
      ],
    }),
  },
  {
    name: "open",
    help: "open <section|project>",
    run: (args) => {
      const target = args[0]?.toLowerCase();
      if (!target) {
        return { lines: [line("Usage: open <section|project>", { dim: true })] };
      }
      const sections = ["about", "journey", "experience", "skills", "projects", "dashboard", "blog"];
      const project = projects.find((p) => p.slug === target || p.slug.includes(target));
      if (sections.includes(target)) {
        return { lines: [line(`Opening #${target}…`, { dim: true })], effect: { type: "navigate", href: `#${target}` } };
      }
      if (project) {
        return { lines: [line(`Opening ${project.title}…`, { dim: true })], effect: { type: "navigate", href: "#projects" } };
      }
      return { lines: [line(`Not found: ${target}. Try 'ls' or 'projects'.`)] };
    },
  },
  {
    name: "theme",
    help: "theme <dark|light>",
    run: (args) => {
      const v = args[0]?.toLowerCase();
      if (v === "dark" || v === "light") {
        return { lines: [line(`Theme → ${v}`, { dim: true })], effect: { type: "theme", value: v } };
      }
      return { lines: [line("Usage: theme <dark|light>", { dim: true })] };
    },
  },
  {
    name: "clear",
    help: "clear the screen",
    run: () => ({ lines: [], effect: { type: "clear" } }),
  },
  {
    name: "exit",
    help: "close the terminal",
    run: () => ({ lines: [], effect: { type: "exit" } }),
  },

  // Hidden easter eggs (no `help`, absent from the listing) -----------------
  {
    name: "coffee",
    run: () => ({
      lines: [
        line("☕ Brewing..."),
        line("Compiling caffeine..."),
        line("Done.", { accent: true }),
      ],
    }),
  },
  {
    name: "sudo",
    run: () => ({
      lines: [line("Permission denied. Nice try.", { accent: true })],
    }),
  },
];

const NAMES = COMMANDS.map((c) => c.name);

/** Parse + run a raw input line. Unknown commands return a friendly error. */
export function runCommand(raw: string): CommandResult {
  const trimmed = raw.trim();
  if (trimmed === "") return { lines: [] };
  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = COMMANDS.find((c) => c.name === name.toLowerCase());
  if (!cmd) {
    return {
      lines: [
        { text: `command not found: ${name}`, },
        { text: "Type 'help' for a list.", dim: true },
      ],
    };
  }
  return cmd.run(args);
}

/** Tab-completion: the first command name that starts with the partial input. */
export function autocomplete(partial: string): string | null {
  const p = partial.trim().toLowerCase();
  if (p === "") return null;
  return NAMES.find((n) => n.startsWith(p)) ?? null;
}

export const WELCOME: OutputLine[] = [
  { text: "abhishek.sh — interactive portfolio shell", accent: true },
  { text: "Type 'help' to see what's here, or 'exit' to leave.", dim: true },
  { text: "" },
];
