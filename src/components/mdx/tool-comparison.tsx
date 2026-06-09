import Link from "next/link";

/**
 * Comparison table for AI tools — linked tool names down the left, feature
 * columns across the top. Used in roundups and comparison pages. Static and
 * fully in the DOM (good for AI extraction); internal review links route through
 * next/link, vendor links open externally.
 */
export interface ToolRow {
  name: string;
  /** Internal review URL (e.g. /tools/profound-review) or external vendor URL. */
  href?: string;
  /** Cell values aligned to `columns`. */
  cells: string[];
}

export function ToolComparison({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: ToolRow[];
  caption?: string;
}) {
  return (
    <div className="not-prose my-8 overflow-x-auto font-sans">
      <table className="w-full border-collapse text-[13px]">
        {caption ? (
          <caption className="text-muted mb-2 text-left text-sm">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            <th
              scope="col"
              className="border-ink text-muted border-b-2 px-2.5 py-2.5 text-left font-mono text-[10px] tracking-[0.05em] uppercase"
            >
              Tool
            </th>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="border-ink text-muted border-b-2 px-2.5 py-2.5 text-left font-mono text-[10px] tracking-[0.05em] uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isInternal = row.href?.startsWith("/");
            const nameEl = row.href ? (
              isInternal ? (
                <Link href={row.href} className="text-accent font-medium">
                  {row.name}
                </Link>
              ) : (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-medium"
                >
                  {row.name}
                </a>
              )
            ) : (
              <span className="text-ink font-medium">{row.name}</span>
            );
            return (
              <tr key={row.name}>
                <th
                  scope="row"
                  className="border-line border-b px-2.5 py-[11px] text-left font-normal"
                >
                  {nameEl}
                </th>
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className="border-line text-ink-2 border-b px-2.5 py-[11px]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
