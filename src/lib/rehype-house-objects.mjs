/**
 * rehype-house-objects
 * Transforms specific heading patterns into styled house editorial objects:
 *   / CALCULATION  → <section class="calculation-block">
 *   / CLAIM CHECK  → <section class="claim-check">
 *   / ASSUMPTION   → <section class="assumption-block">
 *   / INTELLIGENCE → <section class="intelligence-block">
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

/** Check if an element has a specific class. */
function hasClass(node, cls) {
  return node.properties?.className?.includes(cls);
}

// ---------------------------------------------------------------------------
// CALCULATION label handling
// ---------------------------------------------------------------------------

const CALC_LABELS = new Set([
  "QUESTION", "ASSUMPTIONS", "EQUATION", "RESULT", "SO WHAT", "SO WHAT?", "CAVEAT",
]);

/**
 * Process <strong> elements inside a calculation-block section.
 * Mutates section.children in place.
 */
function processCalculationLabels(section) {
  // We iterate children and may splice, so go backwards
  for (let i = section.children.length - 1; i >= 0; i--) {
    const child = section.children[i];
    if (child.type !== "element" || child.tagName !== "p") continue;

    // Find a <strong> that matches a known label
    const strongIdx = child.children.findIndex((c) => {
      if (c.type !== "element" || c.tagName !== "strong") return false;
      const t = textContent(c).trim();
      return CALC_LABELS.has(t);
    });

    if (strongIdx === -1) continue;

    const strongNode = child.children[strongIdx];
    const label = textContent(strongNode).trim();

    // Build the label div
    const labelDiv = elem("div", { className: ["calc-label"] }, [text(label)]);

    // Remaining content = everything in the <p> except the <strong>
    const remaining = child.children.filter((_, idx) => idx !== strongIdx);

    // Trim leading whitespace text from remaining
    while (remaining.length && remaining[0].type === "text" && /^\s*$/.test(remaining[0].value)) {
      remaining.shift();
    }

    let replacement;
    switch (label) {
      case "QUESTION":
        replacement = [
          labelDiv,
          elem("div", { className: ["calc-question"] }, remaining),
        ];
        break;

      case "ASSUMPTIONS":
        replacement = [
          elem("div", { className: ["calc-section"] }, [
            labelDiv,
            ...remaining,
          ]),
        ];
        break;

      case "EQUATION":
        // Just add the label, leave math as-is
        replacement = [labelDiv, ...remaining];
        break;

      case "RESULT":
        replacement = [
          labelDiv,
          elem("p", { className: ["calc-result"] }, remaining),
        ];
        break;

      case "SO WHAT":
      case "SO WHAT?":
        replacement = [
          labelDiv,
          elem("p", { className: ["calc-so-what"] }, remaining),
        ];
        break;

      case "CAVEAT":
        replacement = [
          labelDiv,
          elem("p", { className: ["calc-caveat"] }, remaining),
        ];
        break;

      default:
        replacement = [child]; // no-op fallback
    }

    section.children.splice(i, 1, ...replacement);
  }
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
 * Process <strong> elements inside a claim-check section.
 * Mutates section.children in place.
 */
function processClaimLabels(section) {
  for (let i = section.children.length - 1; i >= 0; i--) {
    const child = section.children[i];
    if (child.type !== "element" || child.tagName !== "p") continue;

    const strongIdx = child.children.findIndex((c) => {
      if (c.type !== "element" || c.tagName !== "strong") return false;
      const t = textContent(c).trim();
      return CLAIM_LABELS.has(t);
    });

    if (strongIdx === -1) continue;

    const strongNode = child.children[strongIdx];
    const label = textContent(strongNode).trim();

    const labelDiv = elem("div", { className: ["claim-label"] }, [text(label)]);

    const remaining = child.children.filter((_, idx) => idx !== strongIdx);

    // Trim leading whitespace text from remaining
    while (remaining.length && remaining[0].type === "text" && /^\s*$/.test(remaining[0].value)) {
      remaining.shift();
    }

    let contentP;
    if (label === "CLAIM") {
      contentP = elem("p", { className: ["claim-statement"] }, remaining);
    } else if (label === "SECOND / PASS") {
      contentP = elem("p", { className: ["claim-verdict"] }, remaining);
    } else {
      contentP = elem("p", { className: ["claim-detail"] }, remaining);
    }

    section.children.splice(i, 1, labelDiv, contentP);
  }
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

      // Check if this heading matches any pattern (prefix match for titles like "/ CALCULATION — A price-only break-even")
      const headingText = textContent(node).trim();
      // Use includes() for flexible matching: "/ CALCULATION" can appear with trailing text
      const pattern = PATTERNS.find((p) => headingText === p.match || headingText.startsWith(p.match + " ") || headingText.startsWith(p.match + " —") || headingText.startsWith(p.match + " –") || headingText.startsWith(p.match + ":"));
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

    // Filter out nested transforms: if a transform's range is entirely inside another transform's range,
    // skip it (the outer transform will handle the content including the inner heading).
    // Also, the inner heading will be processed by the outer transform's label processor.
    const filteredTransforms = transforms.filter((t, i) => {
      return !transforms.some((other, j) => {
        if (i === j) return false;
        // t is inside other if other starts before t and other ends after t ends
        return other.parent === t.parent && other.index < t.index && other.endIdx >= t.endIdx;
      });
    });

    // Apply transforms in reverse order to preserve indices
    for (let t = filteredTransforms.length - 1; t >= 0; t--) {
      const { index, endIdx, parent, pattern, collected } = filteredTransforms[t];

      // Build the kicker div
      const kicker = elem("div", { className: [pattern.kickerClass] }, [text(pattern.match)]);

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
