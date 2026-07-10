export type Project = {
  slug: string;
  title: string;
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
    github: "https://github.com/Abhishek86798",
  },
  {
    slug: "ayusynapse",
    title: "AyuSynapse — Clinical Trial Matching Pipeline",
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
