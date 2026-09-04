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
import { getGitHubStats, mergeUnifiedContributions, type GitHubStats } from "@/lib/data/github";
import { getCodingStats } from "@/lib/data/codolio";
import { getAllPosts } from "@/lib/blog";
import { buildSpotlightIndex } from "@/lib/spotlight-index";

// Rebuild the page's live data at most hourly (ISR) — §0.
export const revalidate = 3600;

import { sanityFetch } from "@/sanity/client";
import { journeyQuery, experienceQuery, skillsQuery, projectsQuery, siteSettingsQuery } from "@/sanity/queries";

export default async function Home() {
  const [rawStats, coding, posts, journeyData, experienceData, skillsData, projectsData, settingsData] = await Promise.all([
    getGitHubStats(),
    getCodingStats(),
    getAllPosts(),
    sanityFetch({ query: journeyQuery, tags: ["journey"] }),
    sanityFetch({ query: experienceQuery, tags: ["experience"] }),
    sanityFetch({ query: skillsQuery, tags: ["skill"] }),
    sanityFetch({ query: projectsQuery, tags: ["project"] }),
    sanityFetch({ query: siteSettingsQuery, tags: ["siteSettings"] }),
  ]);

  // Compute unified contributions (GitHub commits ∪ Codolio DSA submissions)
  const unified = mergeUnifiedContributions(
    rawStats.contributions,
    coding.dailySubmissions
  );

  const stats: GitHubStats = {
    ...rawStats,
    contributions: unified.contributions,
    activeDays: unified.activeDays,
    longestStreak: unified.longestStreak,
    weeklySparkline: unified.weeklySparkline,
  };

  const spotlightIndex = buildSpotlightIndex(posts);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed -top-full left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to content
      </a>
      <Nav spotlightIndex={spotlightIndex} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Hero settings={settingsData as any} stats={stats} />
        <About />
        <Experience data={experienceData as any} />
        <Projects data={projectsData as any} />
        <Skills data={skillsData as any} />
        <Journey data={journeyData as any} />
        <Dashboard stats={stats} coding={coding} />
        <Blog posts={posts} />
      </main>
      <Footer />
    </>
  );
}
