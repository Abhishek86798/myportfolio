/** A quantified impact stat, surfaced as a small accent stat in the card. */
export type Metric = {
  /** The figure, e.g. "8", "5", "900→4". Rendered in tabular-nums. */
  value: string;
  /** What it measures, e.g. "OWASP threats", "MCP servers". */
  label: string;
};

/** One stage in a project's architecture pipeline (§4a Explorer). */
export type ArchitectureNode = {
  id: string;
  label: string;
  /** Why this piece exists. */
  why: string;
  /** What it costs / what was given up. */
  tradeoff: string;
  /** The alternative considered and dropped, and why. */
  rejected: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Featured projects render as a larger card (asymmetric bento hierarchy). */
  featured?: boolean;
  metrics?: Metric[];
  recruiter: {
    overview: string;
    impact: string;
  };
  engineer: {
    summary: string;
    // Populated in Phase 1.5 (Content Day) for Explorer-eligible projects: §4a
    architectureNodes?: ArchitectureNode[];
  };
  techStack: string[];
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "mcp-zero-trust-security-gateway",
    title: "MCP Zero-Trust Security Gateway",
    featured: true,
    metrics: [
      { value: "8", label: "OWASP threats mapped" },
      { value: "5", label: "MCP servers tested" },
      { value: "900→4", label: "trace lines / tool" },
    ],
    recruiter: {
      overview:
        "A zero-trust security gateway that sits between LLM agents and MCP tool servers, catching malicious or drifting tools before they execute.",
      impact:
        "6-layer defense mapped to 8 OWASP MCP Top 10 threat categories. Cut syscall trace noise from 900+ lines to 4 signal lines per tool while enforcing least-privilege across 5 tested MCP servers.",
    },
    engineer: {
      summary:
        "Gateway → Verifier → Profiler → Sandbox → Tool pipeline. Manifest inspection, Docker sandbox profiling (seccomp/strace), and declared-vs-observed capability drift analysis. Runtime proxy streams verdicts to a React dashboard.",
      // NOTE: DRAFT placeholder content — refine each why/tradeoff/rejected
      // with your real decisions before shipping (§4a depth bar).
      architectureNodes: [
        {
          id: "gateway",
          label: "Gateway",
          why: "A single entry point every tool call must pass through, so policy is enforced in one place instead of scattered across each MCP server.",
          tradeoff: "Adds one network hop and a central component that must stay highly available — the gateway becomes a chokepoint if it goes down.",
          rejected: "Per-server middleware (enforce inside each tool). Rejected because policy would drift across servers and every new server would re-implement security from scratch.",
        },
        {
          id: "verifier",
          label: "Verifier",
          why: "Inspects each tool's manifest up front — declared capabilities, permissions, schemas — to reject obviously malicious or malformed tools before any execution.",
          tradeoff: "Static inspection can't catch everything; a tool can declare innocent intent and misbehave at runtime, so the Verifier alone is insufficient.",
          rejected: "Trusting the manifest as-is (declaration = truth). Rejected because a manifest is a claim, not a guarantee — which is exactly what the Profiler exists to check.",
        },
        {
          id: "profiler",
          label: "Profiler",
          why: "Runs the tool under seccomp/strace in a throwaway sandbox to observe the syscalls it actually makes, then compares observed vs. declared capability.",
          tradeoff: "Profiling costs real execution time and produces noisy traces — 900+ syscall lines per tool — that need aggressive filtering to be useful.",
          rejected: "Full static analysis of tool code. Rejected because many MCP tools are opaque binaries or remote services with no source to analyze.",
        },
        {
          id: "sandbox",
          label: "Sandbox",
          why: "Executes the tool with least-privilege — a locked-down Docker profile granting only the capabilities the Verifier approved — so a compromised tool can't reach the host.",
          tradeoff: "Tight sandboxing can break legitimate tools that need broader access, requiring per-tool profile tuning rather than one universal policy.",
          rejected: "Running tools in the host process for speed. Rejected outright — a single malicious tool would have full host access, defeating the entire point.",
        },
        {
          id: "tool",
          label: "Tool",
          why: "The actual MCP tool server, now reached only after a verdict is issued — the proxy streams allow/deny decisions to a dashboard so drift is visible in real time.",
          tradeoff: "The verdict pipeline adds latency before the tool responds; acceptable for a security boundary, but not free.",
          rejected: "Post-hoc logging (let it run, audit later). Rejected because prohibited processing can't be undone after the fact — the check has to happen before execution.",
        },
      ],
    },
    techStack: ["Python", "FastAPI", "Docker", "SQLite", "React", "Tailwind CSS"],
    github: "https://github.com/nabrahma/MCP_Zero-Trust_Gateway_BTP",
  },
  {
    slug: "ayusynapse",
    title: "AyuSynapse — Clinical Trial Matching Pipeline",
    metrics: [
      { value: "Solo", label: "hackathon build" },
      { value: "FHIR", label: "EMR parsing" },
      { value: "RAG", label: "trial ranking" },
    ],
    recruiter: {
      overview:
        "An AI-integrated pipeline that matches patients to clinical trials by reading their medical records and ranking eligible trials.",
      impact:
        "Built solo at a Healthcare AI Hackathon — parses FHIR EMRs, extracts medical entities via fine-tuned BioBERT, and ranks trial candidates with a RAG pipeline.",
    },
    engineer: {
      summary:
        "Parses FHIR EMRs, extracts medical entities via fine-tuned BioBERT NER, indexes embeddings in ChromaDB for semantic retrieval over trial eligibility criteria, then orchestrates a LangChain RAG workflow for downstream filtering and candidate ranking.",
    },
    techStack: ["Python", "BioBERT", "LangChain", "ChromaDB", "FHIR", "RAG"],
    github: "https://github.com/Abhishek86798/ayusynapse3.0",
  },
];
