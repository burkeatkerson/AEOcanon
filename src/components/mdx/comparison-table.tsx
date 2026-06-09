/** Comparison table for MDX (mirrors the design `.ctable`). */
export function ComparisonTable({
  columns,
  rows,
  caption,
  rowHeaders = false,
}: {
  columns: string[];
  rows: (string | React.ReactNode)[][];
  caption?: string;
  /**
   * When true, the first cell of each row is rendered as `<th scope="row">`
   * instead of `<td>`. Use for head-to-head comparisons where the first column
   * labels the row dimension — it lets screen readers announce the row label
   * with each cell. Backward-compatible: defaults to the original all-`<td>` body.
   */
  rowHeaders?: boolean;
}) {
  const firstCellClass = "border-line border-b px-2.5 py-[11px] text-left font-medium";
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
              {row.map((cell, j) =>
                j === 0 && rowHeaders ? (
                  <th key={j} scope="row" className={firstCellClass}>
                    {cell}
                  </th>
                ) : (
                  <td
                    key={j}
                    className={`border-line border-b px-2.5 py-[11px] ${
                      j === 0 ? "text-left font-medium" : "text-center"
                    }`}
                  >
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
