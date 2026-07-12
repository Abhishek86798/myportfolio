import type { Root, Paragraph } from "mdast";

/**
 * Unwraps paragraphs that contain only an image. Markdown wraps a standalone
 * image line in a <p>, but our MDX `img` component renders a <figure> — a block
 * element that is invalid inside <p> and causes a React hydration mismatch.
 * Lifting the image out of the paragraph at the AST level fixes the nesting
 * before any HTML is produced.
 *
 * Standalone-image paragraphs are always direct children of the root, so a
 * single-level pass over `tree.children` is sufficient.
 */
export function remarkUnwrapImages() {
  return (tree: Root) => {
    tree.children = tree.children.flatMap((node) =>
      node.type === "paragraph" && isImageOnlyParagraph(node)
        ? node.children
        : node
    );
  };
}

function isImageOnlyParagraph(node: Paragraph): boolean {
  const meaningful = node.children.filter(
    (c) => !(c.type === "text" && c.value.trim() === "")
  );
  return meaningful.length > 0 && meaningful.every((c) => c.type === "image");
}
