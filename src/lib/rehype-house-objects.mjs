/**
 * rehype-house-objects
 * Transforms specific heading patterns into styled house editorial objects:
 *   / CALCULATION  → <section class="calculation-block">
 *   / CLAIM CHECK  → <section class="claim-check">
 *   / ASSUMPTION   → <section class="assumption-block">
 *   / INTELLIGENCE → <section class="intelligence-block">
 *
 * Key design decisions:
 * - Labels (QUESTION, RESULT, CLAIM, etc.) may appear on their own line as
 *   a separate <p><strong>LABEL</strong></p>. When this happens, the content
 *   follows in subsequent sibling paragraphs/tables/lists. The processor
 *   must consume those subsequent siblings as the label's content.
 * - When content is a single <p> with only inline children, the children are
 *   extracted into the emphasis-tag container (e.g. <p class="calc-result">)
 *   so the visual styling is preserved.
 * - When content contains block-level elements (table, list, display-math),
 *   a <div> container is used to keep HTML valid.
 * - Each / CALCULATION or / CLAIM CHECK heading creates exactly one section.
 *   Content is collected until the next heading of the same or higher level.
 */
import { visit } from "unist-util-visit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the trimmed text content of a node (recursive). */
function textContent(node) {
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(textContent).join("");
  return "";
}

/** Heading level number: h1 → 1, h2 → 2, etc. Returns Infinity for non-headings. */
function headingLevel(node) {
  if (node.type !== "element") return Infinity;
  const m = node.tagName.match(/^h(\d)$/);
  return m ? Number(m[1]) : Infinity;
}

/** Create a simple element node. */
function elem(tag, props, children) {
  return { type: "element", tagName: tag, properties: props || {}, children: children || [] };
}

/** Create a text node. */
function text(value) {
  return { type: "text", value };
}

/** Block-level HTML tags that cannot be nested inside <p>. */
const BLOCK_TAGS = new Set([
  "p", "table", "ul", "ol", "pre", "blockquote", "div", "figure", "hr",
]);

/** Check if a list of nodes contains any block-level element. */
function hasBlockChild(nodes) {
  return nodes.some(
    (n) => n.type === "element" && BLOCK_TAGS.has(n.tagName)
  );
}

/**
 * Build a content container that preserves emphasis styling when possible.
 *
 * - If content is a single <p> with only inline children → re-tag to
 *   preferredTag with the class (e.g. <p class="calc-result">text</p>).
 * - If content is all inline → wrap in preferredTag.
 * - If content has block-level children → use <div> to keep HTML valid.
 */
function buildContainer(preferredTag, className, content) {
  // Case 1: single <p> with only inline children → extract children
  if (
    content.length === 1 &&
    content[0].type === "element" &&
    content[0].tagName === "p" &&
    !hasBlockChild(content[0].children)
  ) {
    return elem(preferredTag, { className: [className] }, content[0].children);
  }

  // Case 2: all inline content → wrap in preferredTag
  if (!hasBlockChild(content)) {
    return elem(preferredTag, { className: [className] }, content);
  }

  // Case 3: has block children → use div
  return elem("div", { className: [className] }, content);
}

/**
 * Check if a node is a <p> whose first non-whitespace child is a <strong>
 * matching one of the given label set. Returns the label string or null.
 */
function getParagraphLabel(node, labelSet) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  for (const child of node.children) {
    if (child.type === "text" && /^\s*$/.test(child.value)) continue;
    if (child.type === "element" && child.tagName === "strong") {
      const t = textContent(child).trim();
      if (labelSet.has(t)) return t;
    }
    return null; // first non-whitespace child is not a matching <strong>
  }
  return null; // empty or whitespace-only paragraph
}

/**
 * Extract inline content from a label paragraph (everything except the
 * <strong> label node itself). Returns an array of nodes.
 */
function extractInlineContent(labelP) {
  const remaining = labelP.children.filter(
    (c) => !(c.type === "element" && c.tagName === "strong")
  );
  // Trim leading whitespace text
  while (remaining.length && remaining[0].type === "text" && /^\s*$/.test(remaining[0].value)) {
    remaining.shift();
  }
  // Trim trailing whitespace text
  while (remaining.length && remaining[remaining.length - 1].type === "text" && /^\s*$/.test(remaining[remaining.length - 1].value)) {
    remaining.pop();
  }
  return remaining;
}

// ---------------------------------------------------------------------------
// CALCULATION label handling
// ---------------------------------------------------------------------------

const CALC_LABELS = new Set([
  "QUESTION", "ASSUMPTIONS", "EQUATION", "RESULT", "SO WHAT", "SO WHAT?", "CAVEAT",
]);

/**
 * Process <p> elements inside a calculation-block section.
 *
 * Strategy: scan forward through section.children. When a paragraph with a
 * known label is found, collect all subsequent siblings until the next
 * labeled paragraph (or end of section) as that label's content.
 *
 * This handles both:
 *   **QUESTION** What is the result?       (inline — label + content same paragraph)
 *   **QUESTION**                            (block — label on own line, content follows)
 *   What is the result?
 *
 * Mutates section.children in place.
 */
function processCalculationLabels(section) {
  // Find all label positions
  const labelIndices = [];
  for (let i = 0; i < section.children.length; i++) {
    const child = section.children[i];
    const label = getParagraphLabel(child, CALC_LABELS);
    if (label) {
      labelIndices.push({ index: i, label });
    }
  }

  if (labelIndices.length === 0) return;

  // Build new children array
  const newChildren = [];

  // Preserve any children before the first label
  for (let i = 0; i < labelIndices[0].index; i++) {
    newChildren.push(section.children[i]);
  }

  // For each label, collect its content
  for (let li = 0; li < labelIndices.length; li++) {
    const { index, label } = labelIndices[li];
    const labelP = section.children[index];

    // Content within the same paragraph as the label (after <strong>)
    const inlineContent = extractInlineContent(labelP);

    // Content from subsequent siblings until the next label (or end of section)
    const nextLabelStart =
      li + 1 < labelIndices.length
        ? labelIndices[li + 1].index
        : section.children.length;

    const followingContent = [];
    for (let i = index + 1; i < nextLabelStart; i++) {
      followingContent.push(section.children[i]);
    }

    const allContent = [...inlineContent, ...followingContent];
    const labelDiv = elem("div", { className: ["calc-label"] }, [text(label)]);

    switch (label) {
      case "QUESTION":
        newChildren.push(labelDiv);
        newChildren.push(buildContainer("p", "calc-question", allContent));
        break;

      case "ASSUMPTIONS":
        // Assumptions is always a <div> container (may have lists, tables)
        newChildren.push(
          elem("div", { className: ["calc-section"] }, [labelDiv, ...allContent])
        );
        break;

      case "EQUATION":
        // Label + raw content (math stays as-is, no wrapper)
        newChildren.push(labelDiv);
        newChildren.push(...allContent);
        break;

      case "RESULT":
        newChildren.push(labelDiv);
        newChildren.push(buildContainer("p", "calc-result", allContent));
        break;

      case "SO WHAT":
      case "SO WHAT?":
        newChildren.push(labelDiv);
        newChildren.push(buildContainer("p", "calc-so-what", allContent));
        break;

      case "CAVEAT":
        newChildren.push(labelDiv);
        newChildren.push(buildContainer("p", "calc-caveat", allContent));
        break;

      default:
        newChildren.push(labelP);
    }
  }

  section.children = newChildren;
}

// ---------------------------------------------------------------------------
// CLAIM CHECK label handling
// ---------------------------------------------------------------------------

const CLAIM_LABELS = new Set([
  "CLAIM",
  "WHAT IS TRUE",
  "WHAT IS MISSING",
  "WHAT THAT MEASURES",
  "WHAT IT DOES NOT MEASURE",
  "WHEN IT IS USEFUL",
  "WHEN IT IS NOT ENOUGH",
  "SECOND / PASS",
  "EVIDENCE STATUS",
]);

/**
 * Process <p> elements inside a claim-check section.
 * Same forward-scan strategy as processCalculationLabels.
 * Mutates section.children in place.
 */
function processClaimLabels(section) {
  const labelIndices = [];
  for (let i = 0; i < section.children.length; i++) {
    const child = section.children[i];
    const label = getParagraphLabel(child, CLAIM_LABELS);
    if (label) {
      labelIndices.push({ index: i, label });
    }
  }

  if (labelIndices.length === 0) return;

  const newChildren = [];

  // Preserve any children before the first label
  for (let i = 0; i < labelIndices[0].index; i++) {
    newChildren.push(section.children[i]);
  }

  for (let li = 0; li < labelIndices.length; li++) {
    const { index, label } = labelIndices[li];
    const labelP = section.children[index];

    const inlineContent = extractInlineContent(labelP);

    const nextLabelStart =
      li + 1 < labelIndices.length
        ? labelIndices[li + 1].index
        : section.children.length;

    const followingContent = [];
    for (let i = index + 1; i < nextLabelStart; i++) {
      followingContent.push(section.children[i]);
    }

    const allContent = [...inlineContent, ...followingContent];
    const labelDiv = elem("div", { className: ["claim-label"] }, [text(label)]);

    let contentClass;
    if (label === "CLAIM") {
      contentClass = "claim-statement";
    } else if (label === "SECOND / PASS") {
      contentClass = "claim-verdict";
    } else {
      contentClass = "claim-detail";
    }

    newChildren.push(labelDiv);
    newChildren.push(buildContainer("p", contentClass, allContent));
  }

  section.children = newChildren;
}

// ---------------------------------------------------------------------------
// Main plugin
// ---------------------------------------------------------------------------

/** Heading pattern definitions */
const PATTERNS = [
  {
    match: "/ CALCULATION",
    sectionClass: "calculation-block",
    kickerClass: "calc-kicker",
    process: processCalculationLabels,
  },
  {
    match: "/ CLAIM CHECK",
    sectionClass: "claim-check",
    kickerClass: "claim-kicker",
    process: processClaimLabels,
  },
  {
    match: "/ ASSUMPTION",
    sectionClass: "assumption-block",
    kickerClass: "assumption-kicker",
    process: null,
  },
  {
    match: "/ INTELLIGENCE",
    sectionClass: "intelligence-block",
    kickerClass: "intelligence-kicker",
    process: null,
  },
];

export default function rehypeHouseObjects() {
  return (tree) => {
    // Collect all transformations first, then apply in reverse order
    const transforms = [];

    visit(tree, "element", (node, index, parent) => {
      if (!parent) return;

      const level = headingLevel(node);
      if (level === Infinity) return;

      // Check if this heading matches any pattern (prefix match for titles
      // like "/ CALCULATION — A price-only break-even")
      const headingText = textContent(node).trim();
      const pattern = PATTERNS.find(
        (p) =>
          headingText === p.match ||
          headingText.startsWith(p.match + " ") ||
          headingText.startsWith(p.match + " —") ||
          headingText.startsWith(p.match + " –") ||
          headingText.startsWith(p.match + ":")
      );
      if (!pattern) return;

      // Collect sibling elements after this heading until the next heading
      // of the same or higher level (lower number = higher level)
      const collected = [];
      let endIdx = index + 1;
      while (endIdx < parent.children.length) {
        const sibling = parent.children[endIdx];
        if (headingLevel(sibling) <= level) break;
        collected.push(sibling);
        endIdx++;
      }

      transforms.push({ index, endIdx, parent, pattern, collected, headingText });
    });

    // Filter out nested transforms: if a transform's range is entirely inside
    // another transform's range, skip it (the outer transform will handle it).
    const filteredTransforms = transforms.filter((t, i) => {
      return !transforms.some((other, j) => {
        if (i === j) return false;
        return (
          other.parent === t.parent &&
          other.index < t.index &&
          other.endIdx >= t.endIdx
        );
      });
    });

    // Apply transforms in reverse order to preserve indices
    for (let t = filteredTransforms.length - 1; t >= 0; t--) {
      const { index, endIdx, parent, pattern, collected } = filteredTransforms[t];

      // Build the kicker div
      const kicker = elem("div", { className: [pattern.kickerClass] }, [
        text(pattern.match),
      ]);

      // Build the section with collected content
      const section = elem("section", { className: [pattern.sectionClass] }, collected);

      // Run label processing if defined
      if (pattern.process) {
        pattern.process(section);
      }

      // Replace: remove [index .. endIdx) and insert kicker + section at index
      parent.children.splice(index, endIdx - index, kicker, section);
    }
  };
}
