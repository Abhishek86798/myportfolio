import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Dashboard } from "@/components/sections/dashboard";
import { Blog } from "@/components/sections/blog";
import { Footer } from "@/components/sections/footer";
import { getGitHubStats } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";

// Rebuild the page's live data at most hourly (ISR) — §0.
export const revalidate = 3600;

export default async function Home() {
  const [stats, coding, posts] = await Promise.all([
    getGitHubStats(),
    getCodingStats(),
    getAllPosts(),
  ]);
  const spotlightIndex = buildSpotlightIndex(posts);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to content
      </a>
      <Nav spotlightIndex={spotlightIndex} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Hero />
        <About />
        <Journey />
        <Experience />
        <Skills />
        <Projects />
        <Dashboard stats={stats} coding={coding} />
        <Blog posts={posts} />
      </main>
      <Footer />
    </>
  );
}
