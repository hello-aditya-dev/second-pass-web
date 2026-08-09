import type { ArticleBlock } from "@/lib/types";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={index}>{block.text}</p>;
        }

        if (block.type === "heading") {
          return <h2 key={index}>{block.text}</h2>;
        }

        if (block.type === "callout") {
          return (
            <aside className="article-callout" key={index}>
              <strong>{block.label}</strong>
              <p>{block.text}</p>
            </aside>
          );
        }

        return (
          <div className="table-wrap" key={index}>
            <table>
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
