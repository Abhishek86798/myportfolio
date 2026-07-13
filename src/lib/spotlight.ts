/**
 * Spotlight search index (§4c). Small enough (a few dozen items) that a
 * dependency-free subsequence fuzzy matcher beats pulling in fuse.js.
 */

export type SpotlightItem = {
  id: string;
  label: string;
  /** Extra searchable text (description, tags) not shown as the title. */
  keywords?: string;
  group: "Sections" | "Projects" | "Writing" | "Actions";
  /** In-page anchor (#id), route (/blog/...), or external URL. */
  href: string;
  external?: boolean;
};

/**
 * Subsequence fuzzy match. Returns a score (higher = better) or -1 for no match.
 * Rewards contiguous runs and start-of-word hits so "arch" ranks the Architecture
 * item above an incidental "a…r…c…h" elsewhere.
 */
/** Lowercase + strip diacritics so "res" matches "résumé". */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function fuzzyScore(query: string, text: string): number {
  const q = normalize(query).trim();
  const t = normalize(text);
  if (q === "") return 0;
  if (t.includes(q)) {
    // Direct substring — strong. Bonus if it's at a word boundary.
    const idx = t.indexOf(q);
    const boundary = idx === 0 || /\s|-|\//.test(t[idx - 1]) ? 50 : 0;
    return 100 + boundary - idx;
  }

  let score = 0;
  let ti = 0;
  let run = 0;
  for (const qc of q) {
    let found = false;
    while (ti < t.length) {
      if (t[ti] === qc) {
        run += 1;
        score += 1 + run; // reward contiguous runs
        ti += 1;
        found = true;
        break;
      }
      run = 0;
      ti += 1;
    }
    if (!found) return -1;
  }
  return score;
}

export function searchItems(
  query: string,
  items: SpotlightItem[]
): SpotlightItem[] {
  if (query.trim() === "") return items;
  return items
    .map((item) => ({
      item,
      score: Math.max(
        fuzzyScore(query, item.label),
        fuzzyScore(query, item.keywords ?? "") - 10 // keyword hits rank lower
      ),
    }))
    .filter((r) => r.score > -1)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
