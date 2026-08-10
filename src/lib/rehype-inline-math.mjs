/**
 * rehype-inline-math
 *
 * A rehype plugin that finds <math>...</math> patterns in raw HTML nodes
 * and renders their content as inline KaTeX math.
 *
 * In Astro's markdown pipeline, inline HTML like <math>v_c</math> is
 * preserved as raw hast nodes (not parsed elements). This plugin
 * processes those raw nodes to find and render <math> elements.
 *
 * Convention:
 *   - <math>v_c</math> in markdown → inline KaTeX rendering
 *   - $ in prose → literal $ (currency, never math with singleDollarTextMath: false)
 *   - $$...$$ → display math (existing remark-math behavior)
 */

import katex from "katex";

/**
 * @type {import('unified').Plugin<[], import('hast').Root>}
 */
export default function rehypeInlineMath() {
  return (tree) => {
    visit(tree);
  };
}

/**
 * Visit all nodes in the hast tree and process raw nodes containing <math>.
 * @param {import('hast').Nodes} node
 */
function visit(node) {
  if (!node.children) return;

  const newChildren = [];

  for (const child of node.children) {
    // Handle <imath> as an element node (when Astro parses HTML into elements)
    if (child.type === "element" && child.tagName === "imath" && child.children) {
      const mathContent = extractText(child);
      try {
        const rendered = katex.renderToString(mathContent, {
          throwOnError: false,
          strict: false,
          trust: true,
          displayMode: false,
        });
        newChildren.push({ type: "raw", value: `<span class="math-inline">${rendered}</span>` });
      } catch (e) {
        newChildren.push({ type: "element", tagName: "em", properties: { className: ["math-inline-error"] }, children: [{ type: "text", value: mathContent }] });
      }
    }
    // Handle <imath> in raw HTML nodes (when inline HTML is preserved as raw)
    else if (child.type === "raw" && typeof child.value === "string" && child.value.includes("<imath>")) {
      console.log(`[rehype-inline-math] Processing raw node with <imath>: ${child.value.slice(0, 100)}`);
      // Process the raw HTML to find and render <math> elements
      const parts = processRawHtml(child.value);
      for (const part of parts) {
        if (part.type === "raw") {
          newChildren.push({ type: "raw", value: part.value });
        } else if (part.type === "katex") {
          newChildren.push({ type: "raw", value: part.value });
        }
      }
    } else {
      newChildren.push(child);
    }
  }

  node.children = newChildren;

  // Recurse into children
  for (const child of node.children) {
    if (child.type === "element") {
      visit(child);
    }
  }
}

/**
 * Process raw HTML string, finding <math>...</math> patterns and
 * replacing them with KaTeX-rendered HTML.
 *
 * @param {string} html
 * @returns {Array<{type: 'raw' | 'katex', value: string}>}
 */
function processRawHtml(html) {
  const result = [];
  let remaining = html;

  while (remaining.length > 0) {
    const openIdx = remaining.indexOf("<imath>");
    if (openIdx === -1) {
      // No more <imath> elements
      if (remaining.length > 0) {
        result.push({ type: "raw", value: remaining });
      }
      break;
    }

    const closeIdx = remaining.indexOf("</imath>", openIdx + 7);
    if (closeIdx === -1) {
      // No matching close tag - leave as-is
      result.push({ type: "raw", value: remaining });
      break;
    }

    // Text before <math>
    if (openIdx > 0) {
      result.push({ type: "raw", value: remaining.slice(0, openIdx) });
    }

    // Math content between <imath> and </imath>
    const mathContent = remaining.slice(openIdx + 7, closeIdx);

    try {
      const rendered = katex.renderToString(mathContent, {
        throwOnError: false,
        strict: false,
        trust: true,
        displayMode: false,
      });
      result.push({ type: "katex", value: `<span class="math-inline">${rendered}</span>` });
    } catch (e) {
      // If KaTeX fails, keep as italic text
      result.push({ type: "katex", value: `<em class="math-inline-error">${mathContent}</em>` });
    }

    // Continue after </imath>
    remaining = remaining.slice(closeIdx + 8);
  }

  return result;
}
