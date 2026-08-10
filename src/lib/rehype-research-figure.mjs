/**
 * rehype-research-figure
 * Transforms standalone <img> elements that are the sole child of a <p>
 * inside .article-body into semantic <figure class="research-figure"> elements.
 */
import { visit } from "unist-util-visit";

/**
 * Check if a node is a whitespace-only text node.
 */
function isWhitespace(node) {
  return node.type === "text" && /^\s*$/.test(node.value);
}

export default function rehypeResearchFigure() {
  return (tree) => {
    const targets = [];
    let pCount = 0;
    let imgCount = 0;

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "img") imgCount++;
      if (node.tagName !== "p" || !parent) return;
      pCount++;

      // Find the single <img> child, ignoring whitespace text nodes
      const meaningfulChildren = node.children.filter(
        (child) => !isWhitespace(child)
      );
      if (meaningfulChildren.length !== 1) return;
      const img = meaningfulChildren[0];
      if (img.type !== "element" || img.tagName !== "img") return;

      targets.push({ p: node, index, parent, img });
    });

    // Process in reverse order to avoid index shifts
    for (let i = targets.length - 1; i >= 0; i--) {
      const { p, index, parent, img } = targets[i];

      // Add loading="lazy" and decoding="async" to the <img> if not present
      if (!img.properties) img.properties = {};
      if (!img.properties.loading) img.properties.loading = "lazy";
      if (!img.properties.decoding) img.properties.decoding = "async";

      // Build scroll wrapper classes
      const scrollClasses = ["research-figure-scroll"];
      if (img.properties.src && String(img.properties.src).includes("/research/")) {
        scrollClasses.push("research-figure--scroll");
      }

      // <div class="research-figure-scroll"> wrapper around the <img>
      const scrollWrapper = {
        type: "element",
        tagName: "div",
        properties: { className: scrollClasses },
        children: [img],
      };

      // Build <figure class="research-figure">
      const figure = {
        type: "element",
        tagName: "figure",
        properties: { className: ["research-figure"] },
        children: [scrollWrapper],
      };

      // If the <img> has a title attribute, create a <figcaption>
      if (img.properties.title) {
        const captionText = img.properties.title;
        delete img.properties.title;

        figure.children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: captionText }],
        });
      }

      // Replace the <p> with the <figure> in the parent
      parent.children.splice(index, 1, figure);
    }
  };
}
