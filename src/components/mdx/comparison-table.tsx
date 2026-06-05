/**
 * Simple comparison table for MDX. Authors pass columns + rows as data so the
 * markup stays semantic (and easy for answer engines to parse) without writing
 * raw HTML tables.
 */
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
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption ? (
          <caption className="text-muted-foreground mb-2 text-left text-sm">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-border border-b">
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-3 py-2 text-left font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-border/60 border-b last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">
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
