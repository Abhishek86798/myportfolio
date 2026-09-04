export const siteConfig = {
  name: "Abhishek Kokadwar",
  role: "Backend & AI Systems Engineer",
  tagline:
    "I build high-performance backend infrastructure, secure AI agents, and scalable web applications. Currently a pre-final year Dual Degree student at IIITM Gwalior.",
  location: "Gwalior, Madhya Pradesh, India",
  status: {
    label: "Currently Building",
    project: "Zero-Trust Security Gateway",
  },
  // Static dashboard values — "set at launch, refresh occasionally" (§5, §6).
  // DSA counts are now live via Codolio (see lib/data/codolio.ts).
  dashboard: {
    reading: "Designing Data-Intensive Applications",
  },
  // Raw email address; the `mailto:` link is derived where needed.
  email: "abhikokadwar2@gmail.com",
  links: {
    github: "https://github.com/Abhishek86798",
    linkedin: "https://www.linkedin.com/in/abhishek-kokadwar/",
    email: "mailto:abhikokadwar2@gmail.com",
    phone: "+91-9307229712",
    codolio: "https://codolio.com/profile/abhishek_1005",
    resume: "/resume.pdf",
  },
  about: [
    { 
      specLabel: "Academics",
      icon: "graduation", 
      label: "B.Tech IT + MBA @ IIITM Gwalior",
      meta: "IIITM Gwalior · 2022–2027",
      description: "Pre-final year student in a 5-year integrated dual degree program. Blending deep technical systems engineering with business strategy, focusing on distributed systems and software architecture.",
    },
    { 
      specLabel: "Discipline",
      icon: "terminal", 
      label: "Backend & AI Systems Engineering",
      meta: "FastAPI · Next.js · PostgreSQL · ChromaDB",
      description: "Specialized in scalable web applications, microservices, and production RAG pipelines. Building high-throughput APIs with Python, C++, TypeScript, and robust database indexing.",
    },
    { 
      specLabel: "Security",
      icon: "shield", 
      label: "AI Security Tooling & Sandboxing",
      meta: "Zero-Trust · Linux Sandboxing",
      description: "Architecting least-privilege execution environments and security proxies for LLM tools. Exploring seccomp, strace system call tracing, and deterministic authorization gateways.",
    },
    { 
      specLabel: "Availability",
      icon: "rocket", 
      label: "Software Engineering Internships",
      meta: "Open for Summer & Fall 2025/2026",
      description: "Active open-source contributor in the cloud native ecosystem (CNCF/Meshery). Solved 852 DSA problems (393 Medium, 55 Hard) across LeetCode, GeeksforGeeks, and Code360.",
    },
  ],
} as const;
