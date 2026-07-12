/** A quantified impact stat, surfaced as a small accent stat in the card. */
export type Metric = {
  /** The figure, e.g. "8", "5", "900→4". Rendered in tabular-nums. */
  value: string;
  /** What it measures, e.g. "OWASP threats", "MCP servers". */
  label: string;
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
    architectureNodes?: Array<{
      id: string;
      label: string;
      why: string;
      tradeoff: string;
      rejected: string;
    }>;
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
        "Gateway → Verifier → Profiler → Sandbox → Tool pipeline. Manifest inspection, Docker sandbox profiling (seccomp/strace), and declared-vs-observed capability drift analysis. Runtime proxy streams verdicts to a React dashboard. Full node-level design decisions land in Phase 1.5 (Content Day).",
      // architectureNodes: filled in during Phase 1.5 — Content Day (§4a, §8)
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
