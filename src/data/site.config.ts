export const siteConfig = {
  name: "Abhishek Kokadwar",
  role: "Software Engineer",
  tagline:
    "B.Tech IT + MBA student at IIITM Gwalior, building AI systems, backend infrastructure, and security tooling.",
  location: "Gwalior, Madhya Pradesh, India",
  status: {
    label: "Currently Building",
    project: "MCP Zero-Trust Security Gateway",
  },
  // Static dashboard values — "set at launch, refresh occasionally" (§5, §6).
  // DSA counts are now live via Codolio (see lib/data/codolio.ts).
  dashboard: {
    reading: "Designing Data-Intensive Applications",
  },
  links: {
    github: "https://github.com/Abhishek86798",
    linkedin: "https://www.linkedin.com/in/abhishek-kokadwar/",
    email: "mailto:abhikokadwar2@gmail.com",
    phone: "+91-9307229712",
    codolio: "https://codolio.com/profile/abhishek_1005",
    resume: "/resume.pdf",
  },
  about: [
    { icon: "map-pin", label: "IIITM Gwalior — B.Tech IT + MBA" },
    { icon: "code", label: "AI + Backend + Systems" },
    { icon: "shield", label: "Interested in AI Security" },
    { icon: "rocket", label: "Looking for SWE Internships" },
  ],
} as const;
