import { codeToHtml } from "shiki";

/**
 * Pre-highlights code blocks in Sanity Portable Text on the server
 * so they render synchronously without React 19 async suspension.
 */
export async function highlightSanityBlocks(body: any[]): Promise<any[]> {
  if (!Array.isArray(body)) return [];

  return Promise.all(
    body.map(async (block) => {
      if (block._type === "codeBlock" && typeof block.code === "string") {
        try {
          const highlightedHtml = await codeToHtml(block.code, {
            lang: block.language || "typescript",
            themes: {
              light: "github-light",
              dark: "github-dark-dimmed",
            },
            defaultColor: false,
          });
          return { ...block, highlightedHtml };
        } catch {
          // Fallback if the language isn't supported by Shiki
          try {
            const highlightedHtml = await codeToHtml(block.code, {
              lang: "plaintext",
              themes: {
                light: "github-light",
                dark: "github-dark-dimmed",
              },
              defaultColor: false,
            });
            return { ...block, highlightedHtml };
          } catch {
            return block;
          }
        }
      }
      return block;
    })
  );
}
