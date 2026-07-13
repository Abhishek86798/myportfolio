export type SkillGroup = {
  category: string;
  skills: string[];
  /** How/where these are actually used — shown only in Engineer mode (§4b). */
  usage?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["C++", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
    usage: "C++/DSA for problem-solving; Python for AI/ML pipelines; TypeScript across full-stack web.",
  },
  {
    category: "AI / ML",
    skills: ["RAG", "LangChain", "HuggingFace Transformers", "BioBERT"],
    usage: "Fine-tuned BioBERT for medical NER; RAG over ChromaDB embeddings for trial retrieval (AyuSynapse).",
  },
  {
    category: "Backend",
    skills: ["Next.js", "REST APIs", "PostgreSQL", "Firebase Firestore", "MongoDB", "ChromaDB"],
    usage: "Normalized Postgres schemas with RLS; Firestore snapshot listeners for real-time; ChromaDB for vector search.",
  },
  {
    category: "Systems & Security",
    skills: ["Docker", "Seccomp / strace", "Row-Level Security (RLS)", "Zero-Trust Architecture"],
    usage: "Docker sandboxing with seccomp/strace syscall profiling for the MCP Zero-Trust Gateway.",
  },
  {
    category: "Tools & Cloud",
    skills: ["Git", "GitHub", "Vercel", "AWS (fundamentals)", "Figma", "VS Code"],
    usage: "Vercel preview deploys per PR; Figma for UI design before build.",
  },
  {
    category: "Coursework",
    skills: ["OOP", "OS", "Computer Networks", "DBMS", "DSA"],
  },
];
