/**
 * rehype-table-wrap
 * Wraps every <table> in a scrollable <div class="table-wrap">
 * with appropriate accessibility semantics.
 */
import { visit } from "unist-util-visit";

export default function rehypeTableWrap() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "table" && parent) {
        // Don't double-wrap tables already inside .table-wrap
        if (
          parent.tagName === "div" &&
          parent.properties?.className?.includes("table-wrap")
        ) {
          return;
        }

        const wrapper = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["table-wrap"],
            role: "region",
            tabIndex: 0,
            ariaLabel: "Scrollable data table",
          },
          children: [node],
        };

        parent.children.splice(index, 1, wrapper);
      }
    });
  };
}
