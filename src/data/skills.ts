export type SkillGroup = {
  category: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["C++", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
  },
  {
    category: "AI / ML",
    skills: ["RAG", "LangChain", "HuggingFace Transformers", "BioBERT"],
  },
  {
    category: "Backend",
    skills: ["Next.js", "REST APIs", "PostgreSQL", "Firebase Firestore", "MongoDB", "ChromaDB"],
  },
  {
    category: "Systems & Security",
    skills: ["Docker", "Seccomp / strace", "Row-Level Security (RLS)", "Zero-Trust Architecture"],
  },
  {
    category: "Tools & Cloud",
    skills: ["Git", "GitHub", "Vercel", "AWS (fundamentals)", "Figma", "VS Code"],
  },
  {
    category: "Coursework",
    skills: ["OOP", "OS", "Computer Networks", "DBMS", "DSA"],
  },
];
