export type ExperienceEntry = {
  role: string;
  org: string;
  period: string;
  location: string;
  stack: string[];
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Junior Developer Intern",
    org: "Bizzkonnect",
    period: "Nov 2025 — Jan 2026",
    location: "Remote",
    stack: ["Next.js 16", "TypeScript", "Firebase", "React 19", "Tailwind CSS", "Vercel"],
    highlights: [
      "Designed, developed, and deployed a business portfolio platform as the sole engineer — owning end-to-end architecture, implementation, and production deployment on Vercel.",
      "Shipped 8+ reusable UI components and authored unit/integration tests; debugged integration blockers independently while collaborating with stakeholders.",
    ],
  },
  {
    role: "Junior Software Developer",
    org: "Trionix Technologies",
    period: "Jul 2025 — Sep 2025",
    location: "Remote",
    stack: ["Next.js", "Firebase", "PostgreSQL", "REST APIs", "Row-Level Security"],
    highlights: [
      "Architected the VyaparPragati admin platform from scratch across 6 backend modules serving 500+ users; engineered real-time bidirectional messaging on Firestore snapshot subscriptions.",
      "Designed a normalized PostgreSQL schema with full CRUD REST APIs and Row-Level Security (RLS) policies enforcing strict multi-tenant isolation for the Saaro Creations e-commerce backend.",
      "Diagnosed and eliminated N+1 query patterns by refactoring PostgreSQL joins, halving database round-trips and improving SSR product route performance.",
    ],
  },
];
