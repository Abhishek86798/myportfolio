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
    title: "Joined IIITM Gwalior",
    summary: "Started the B.Tech IT + MBA dual degree, and learned C.",
    detail:
      "Began college at IIITM Gwalior. First real programming was C — pointers, memory, the fundamentals that make everything after it click.",
    tags: ["C", "Fundamentals"],
  },
  {
    id: "figma-campussafe",
    year: "2024",
    title: "Design — Figma & UI/UX",
    summary: "Learned Figma and UI/UX, designed the CampusSafe app.",
    detail:
      "Picked up Figma and UI/UX design, then designed the interface for CampusSafe — a campus emergency SOS alert app. Learning to think about the user before the code shaped how I build now.",
    tags: ["Figma", "UI/UX", "CampusSafe"],
  },
  {
    id: "cpp-oops",
    year: "2024",
    period: "Late 2024",
    title: "C++ & OOP",
    summary: "Learned C++ and object-oriented concepts.",
    detail:
      "Moved to C++ and got comfortable with object-oriented programming — classes, inheritance, polymorphism — the mental model I still reach for when structuring larger systems.",
    tags: ["C++", "OOP"],
  },
  {
    id: "python-aiml",
    year: "2025",
    period: "Early 2025",
    title: "Python & AI/ML",
    summary: "Started exploring Python and AI/ML.",
    detail:
      "Shifted into Python and began exploring AI/ML — the space that would end up defining most of my projects since.",
    tags: ["Python", "AI/ML"],
  },
  {
    id: "hackathons-projects",
    year: "2025",
    period: "Mid 2025",
    title: "Hackathons & AI projects",
    summary: "Started doing hackathons and building real AI projects.",
    detail:
      "Went from learning to shipping — hackathons and AI projects, including AyuSynapse (a clinical-trial matching pipeline built solo at a Healthcare AI Hackathon). This is where ideas started turning into working things under time pressure.",
    tags: ["Hackathons", "AyuSynapse", "RAG"],
  },
  {
    id: "internships",
    year: "2025",
    period: "Late 2025",
    title: "Internships — backend & frontend",
    summary: "Engineering internships, focused on learning backend and frontend.",
    detail:
      "Trionix Technologies and Bizzkonnect — real production work across backend and frontend. Architected admin platforms, designed PostgreSQL schemas with row-level security, and shipped as the sole engineer. The jump from projects to production taught me what 'done' actually means.",
    tags: ["Next.js", "PostgreSQL", "Backend", "Frontend"],
  },
  {
    id: "dsa-focus",
    year: "2026",
    title: "DSA & problem-solving focus",
    summary: "Focused on DSA and LeetCode — sharpening fundamentals.",
    detail:
      "Currently deep in data structures and algorithms — 600+ problems across LeetCode, GeeksforGeeks, and Code360, alongside AI-security work on the MCP Zero-Trust Security Gateway. Building depth to match the breadth.",
    tags: ["DSA", "LeetCode", "AI Security"],
    link: {
      label: "See coding stats",
      href: "#dashboard",
    },
    current: true,
  },
];
