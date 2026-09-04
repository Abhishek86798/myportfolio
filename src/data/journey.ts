export type JourneyMilestone = {
  id: string;
  year: string;
  /** Optional finer-grained period within the year, e.g. "Early 2025". */
  period?: string;
  title: string;
  /** One-line summary shown collapsed. */
  summary: string;
  /** Longer detail shown when the node is expanded. Edit freely. */
  detail: string;
  /** Short tags — skills/tools picked up at this milestone (for chips). */
  tags?: string[];
  /** Optional link (project, live demo, etc.). */
  link?: { label: string; href: string };
  /** Marks the "now" node — visually emphasized. */
  current?: boolean;
};

/**
 * Abhishek's journey — real timeline (rough draft, edit anytime).
 * Order is chronological, oldest → newest.
 */
export const journey: JourneyMilestone[] = [
  {
    id: "iiitm-c",
    year: "2023",
    title: "Joined IIITM Gwalior & Learned C",
    summary:
      "Started B.Tech IT + MBA at IIITM Gwalior. Mastered C programming, pointers, memory allocation, and low-level computing fundamentals.",
    detail:
      "Began college at IIITM Gwalior. First real programming was C — pointers, memory management, and the core low-level computing fundamentals that make everything after it click.",
    tags: ["C", "Pointers", "Memory", "Fundamentals"],
  },
  {
    id: "figma-campussafe",
    year: "2024",
    period: "Early 2024",
    title: "Design Systems & UI/UX",
    summary:
      "Learned Figma and design systems. Prototyped CampusSafe, a campus emergency SOS app that instilled a user-first mindset.",
    detail:
      "Picked up Figma and UI/UX design, then designed the interface for CampusSafe — a campus emergency SOS alert app. Learning to think about the user before the code shaped how I build now.",
    tags: ["Figma", "UI/UX", "CampusSafe", "Prototyping"],
  },
  {
    id: "cpp-oops",
    year: "2024",
    period: "Late 2024",
    title: "C++ & Object-Oriented Architecture",
    summary:
      "Advanced into C++ and OOP systems design. Implemented core data structures and established architectural mental models for scale.",
    detail:
      "Moved to C++ and got comfortable with object-oriented programming — classes, inheritance, polymorphism — the mental model I still reach for when structuring larger systems.",
    tags: ["C++", "OOP", "Data Structures", "System Design"],
  },
  {
    id: "python-aiml",
    year: "2025",
    period: "Early 2025",
    title: "Python & Applied AI/ML",
    summary:
      "Pivoted into Python, PyTorch, and NLP models. Built retrieval-augmented generation (RAG) experiments and transformer pipelines.",
    detail:
      "Shifted into Python and began exploring AI/ML — building neural network architectures and RAG pipelines that would define my systems engineering trajectory.",
    tags: ["Python", "PyTorch", "Transformers", "RAG"],
  },
  {
    id: "hackathons-projects",
    year: "2025",
    period: "Mid 2025",
    title: "Hackathons & Autonomous AI",
    summary:
      "Built AyuSynapse solo at Healthcare AI Hackathon. Shipped an end-to-end clinical trial matching engine under a 36-hour sprint.",
    detail:
      "Went from learning to shipping — hackathons and AI projects, including AyuSynapse (a clinical-trial matching pipeline built solo at a Healthcare AI Hackathon). This is where ideas started turning into working things under time pressure.",
    tags: ["Hackathons", "AyuSynapse", "BioBERT", "ChromaDB"],
  },
  {
    id: "internships",
    year: "2025",
    period: "Late 2025",
    title: "Production Engineering Internships",
    summary:
      "Engineered production portals at Trionix & Bizzkonnect as sole developer. Architected PostgreSQL schemas with Row-Level Security (RLS).",
    detail:
      "Trionix Technologies and Bizzkonnect — real production work across backend and frontend. Architected admin platforms, designed PostgreSQL schemas with row-level security, and shipped as the sole engineer. The jump from projects to production taught me what 'done' actually means.",
    tags: ["Next.js", "PostgreSQL", "RLS", "FastAPI"],
  },
  {
    id: "dsa-focus",
    year: "2026",
    period: "Present",
    title: "DSA Mastery & AI Security Gateway",
    summary:
      "Solved 852 DSA problems (393 Medium, 55 Hard) across LeetCode, GeeksforGeeks, and Code360. Architecting MCP Zero-Trust Security Gateway with seccomp sandboxing.",
    detail:
      "Currently deep in data structures and algorithms — 852 problems across LeetCode, GeeksforGeeks, and Code360, alongside AI-security work on the MCP Zero-Trust Security Gateway. Building depth to match the breadth.",
    tags: ["852 DSA", "393 Med", "55 Hard", "AI Security"],
    link: {
      label: "See coding stats",
      href: "#dashboard",
    },
    current: true,
  },
];
