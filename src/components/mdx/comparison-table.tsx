/** Comparison table for MDX (mirrors the design `.ctable`). */
export function ComparisonTable({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: (string | React.ReactNode)[][];
  caption?: string;
}) {
  return (
    <div className="my-8 overflow-x-auto font-sans">
      <table className="w-full border-collapse text-[13.5px]">
        {caption ? (
          <caption className="text-muted mb-2 text-left text-sm">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`border-ink text-muted border-b-2 px-2.5 py-2.5 font-mono text-[10px] tracking-[0.05em] uppercase ${
                  i === 0 ? "text-left" : "text-center"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-line border-b px-2.5 py-[11px] ${
                    j === 0 ? "text-left font-medium" : "text-center"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
