/** A quantified impact stat, surfaced as a small accent stat in the card. */
export type Metric = {
  /** The number/figure, e.g. "500+", "8+", "6". Rendered in tabular-nums. */
  value: string;
  /** What it measures, e.g. "users served", "UI components". */
  label: string;
};

export type ExperienceEntry = {
  role: string;
  org: string;
  /** Company website, linked from the org name. */
  orgUrl?: string;
  period: string;
  location: string;
  stack: string[];
  /** Outcome-framed bullets shown in both modes (Recruiter default). */
  highlights: string[];
  /** Deeper implementation notes shown only in Engineer mode (§4b). */
  engineerHighlights?: string[];
  /** Headline metrics pulled out of the prose for fast scanning. */
  metrics?: Metric[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Junior Developer Intern",
    org: "Bizzkonnect",
    orgUrl: "https://www.bizzkonnect.com/",
    period: "Nov 2025 — Jan 2026",
    location: "Remote",
    stack: ["Next.js 16", "TypeScript", "Firebase", "React 19", "Tailwind CSS", "Vercel"],
    metrics: [
      { value: "Sole", label: "engineer" },
      { value: "8+", label: "UI components" },
      { value: "100%", label: "shipped to prod" },
    ],
    highlights: [
      "Designed, developed, and deployed a business portfolio platform as the sole engineer — owning end-to-end architecture, implementation, and production deployment on Vercel.",
      "Shipped 8+ reusable UI components and authored unit/integration tests; debugged integration blockers independently while collaborating with stakeholders.",
    ],
    engineerHighlights: [
      "Component library built on a typed props contract with variant composition, so pages compose from primitives instead of one-off markup.",
      "CI on Vercel preview deploys per PR; caught layout/regression issues before merge via the integration tests.",
    ],
  },
  {
    role: "Junior Software Developer",
    org: "Trionix Technologies",
    orgUrl: "https://trionixtechnologies.in/",
    period: "Jul 2025 — Sep 2025",
    location: "Remote",
    stack: ["Next.js", "Firebase", "PostgreSQL", "REST APIs", "Row-Level Security"],
    metrics: [
      { value: "500+", label: "users served" },
      { value: "6", label: "backend modules" },
      { value: "50%", label: "fewer DB round-trips" },
    ],
    highlights: [
      "Architected the VyaparPragati admin platform from scratch across 6 backend modules serving 500+ users; engineered real-time bidirectional messaging on Firestore snapshot subscriptions.",
      "Designed a normalized PostgreSQL schema with full CRUD REST APIs and Row-Level Security (RLS) policies enforcing strict multi-tenant isolation for the Saaro Creations e-commerce backend.",
      "Diagnosed and eliminated N+1 query patterns by refactoring PostgreSQL joins, halving database round-trips and improving SSR product route performance.",
    ],
    engineerHighlights: [
      "RLS policies enforced tenant isolation at the database layer (not just the app), so a query can't leak across tenants even if application code is wrong.",
      "Real-time messaging rode Firestore snapshot listeners with optimistic local updates reconciled against server state on each snapshot.",
    ],
  },
];
