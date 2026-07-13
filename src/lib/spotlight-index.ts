import type { SpotlightItem } from "@/lib/spotlight";
import type { PostMeta } from "@/lib/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site.config";

const SECTIONS: SpotlightItem[] = [
  { id: "s-about", label: "About", group: "Sections", href: "#about" },
  { id: "s-journey", label: "Journey", group: "Sections", href: "#journey", keywords: "timeline milestones" },
  { id: "s-experience", label: "Experience", group: "Sections", href: "#experience", keywords: "work jobs internships" },
  { id: "s-skills", label: "Skills", group: "Sections", href: "#skills", keywords: "tech stack languages" },
  { id: "s-projects", label: "Projects", group: "Sections", href: "#projects", keywords: "work built architecture" },
  { id: "s-dashboard", label: "Live Dashboard", group: "Sections", href: "#dashboard", keywords: "github stats commits coding" },
  { id: "s-blog", label: "Blog", group: "Sections", href: "#blog", keywords: "writing essays" },
];

const ACTIONS: SpotlightItem[] = [
  { id: "a-resume", label: "Download résumé", group: "Actions", href: siteConfig.links.resume, external: true },
  { id: "a-github", label: "GitHub profile", group: "Actions", href: siteConfig.links.github, external: true },
  { id: "a-linkedin", label: "LinkedIn profile", group: "Actions", href: siteConfig.links.linkedin, external: true },
  { id: "a-email", label: "Email me", group: "Actions", href: siteConfig.links.email, external: true },
];

/** Builds the full Spotlight index. Blog posts are passed in (server-fetched). */
export function buildSpotlightIndex(posts: PostMeta[]): SpotlightItem[] {
  const projectItems: SpotlightItem[] = projects.map((p) => ({
    id: `p-${p.slug}`,
    label: p.title,
    group: "Projects",
    href: "#projects",
    keywords: p.techStack.join(" "),
  }));

  const postItems: SpotlightItem[] = posts.map((p) => ({
    id: `b-${p.slug}`,
    label: p.title,
    group: "Writing",
    href: `/blog/${p.slug}`,
    keywords: `${p.description} ${p.tags.join(" ")}`,
  }));

  return [...SECTIONS, ...projectItems, ...postItems, ...ACTIONS];
}
