/**
 * Static, theme-aware SVG diagrams for MDX articles. No image files, no client
 * JS — the markup is plain inline SVG using the design tokens, so it renders
 * crisply at any size, adapts to light/dark, and is fully prerendered for AEO.
 */

interface RagStage {
  n: number;
  key: string;
  title: string;
  sub: string;
  fill: string;
}

const RAG_STAGES: RagStage[] = [
  { n: 1, key: "query", title: "Query", sub: "Question is embedded", fill: "var(--c4)" },
  { n: 2, key: "retrieve", title: "Retrieve", sub: "Pull candidate passages", fill: "var(--c4)" },
  { n: 3, key: "rerank", title: "Rerank", sub: "Score the candidates", fill: "var(--accent)" },
  { n: 4, key: "generate", title: "Generate", sub: "LLM writes the answer", fill: "var(--c3)" },
  { n: 5, key: "cite", title: "Cite", sub: "Attribute the sources", fill: "var(--c3)" },
];

/**
 * The retrieve → rerank → generate → cite pipeline that powers AI answer
 * engines. Reused across the RAG and citation articles. `highlight` thickens
 * the border of one stage to focus the reader on it.
 */
export function RagPipeline({
  caption = "How an answer engine turns a question into a cited answer (RAG).",
  highlight,
}: {
  caption?: string;
  highlight?: "query" | "retrieve" | "rerank" | "generate" | "cite";
}) {
  const NODE_W = 158;
  const NODE_H = 92;
  const GAP = 32;
  const PAD = 16;
  const top = 30;
  const width = PAD * 2 + RAG_STAGES.length * NODE_W + (RAG_STAGES.length - 1) * GAP;
  const height = 210;

  return (
    <figure className="not-prose border-line bg-panel my-8 overflow-x-auto rounded-2xl border p-5 font-sans">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Retrieval-augmented generation pipeline: a query is embedded, candidate passages are retrieved, reranked for relevance, authority and freshness, fed to a language model that generates the answer, and the sources of the passages it used are cited."
        className="h-auto w-full min-w-[760px]"
      >
        <defs>
          <marker
            id="rag-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--muted)" />
          </marker>
        </defs>

        {RAG_STAGES.map((stage, i) => {
          const x = PAD + i * (NODE_W + GAP);
          const cy = top + NODE_H / 2;
          const on = highlight === stage.key;
          return (
            <g key={stage.key}>
              {/* connector to next stage */}
              {i < RAG_STAGES.length - 1 ? (
                <line
                  x1={x + NODE_W}
                  y1={cy}
                  x2={x + NODE_W + GAP}
                  y2={cy}
                  stroke="var(--muted)"
                  strokeWidth="1.5"
                  markerEnd="url(#rag-arrow)"
                />
              ) : null}

              {/* node */}
              <rect
                x={x}
                y={top}
                width={NODE_W}
                height={NODE_H}
                rx="14"
                fill="var(--panel)"
                stroke={on ? stage.fill : "var(--line-2)"}
                strokeWidth={on ? 2.5 : 1.5}
              />
              {/* number badge */}
              <circle cx={x + 22} cy={top + 24} r="13" fill={stage.fill} />
              <text
                x={x + 22}
                y={top + 24}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="600"
                fill="#fff"
                fontFamily="var(--mono)"
              >
                {stage.n}
              </text>
              <text
                x={x + 44}
                y={top + 28}
                fontSize="16"
                fontWeight="600"
                fill="var(--ink)"
                fontFamily="var(--sans)"
              >
                {stage.title}
              </text>
              <text
                x={x + 16}
                y={top + 62}
                fontSize="12.5"
                fill="var(--muted)"
                fontFamily="var(--sans)"
              >
                {stage.sub}
              </text>
            </g>
          );
        })}

        {/* rerank-signals callout under stage 3 */}
        {(() => {
          const x = PAD + 2 * (NODE_W + GAP);
          const labelY = top + NODE_H + 34;
          return (
            <g>
              <line
                x1={x + NODE_W / 2}
                y1={top + NODE_H}
                x2={x + NODE_W / 2}
                y2={labelY - 18}
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={x + NODE_W / 2}
                y={labelY}
                textAnchor="middle"
                fontSize="11"
                fill="var(--accent)"
                fontFamily="var(--mono)"
                letterSpacing="0.04em"
              >
                relevance · authority · freshness
              </text>
            </g>
          );
        })()}
      </svg>
      {caption ? (
        <figcaption className="text-muted mt-3 text-center text-[12.5px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
