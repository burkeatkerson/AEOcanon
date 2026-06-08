/**
 * The AEO Canon — eight evidence-grounded pillars in three layers. The
 * conceptual backbone of the brand, used by /canon, /manifesto, and /whitepaper.
 * Content mirrors design/templates/canon.html.
 */

export type CanonLayer = "Foundation" | "Reputation" | "Momentum";

export interface Pillar {
  n: number;
  layer: CanonLayer;
  /** CSS var for the layer color. */
  color: string;
  title: string;
  sub: string;
  principle: string;
  metaphor: string;
  /** Headline evidence figure. */
  big: string;
  /** Source for the figure. */
  src: string;
  moves: string[];
}

export const LAYERS: {
  name: CanonLayer;
  color: string;
  question: string;
}[] = [
  {
    name: "Foundation",
    color: "var(--c2)",
    question: "Can the machine use you?",
  },
  {
    name: "Reputation",
    color: "var(--c3)",
    question: "Does the web vouch for you?",
  },
  {
    name: "Momentum",
    color: "var(--c4)",
    question: "Do you stay chosen as things move?",
  },
];

export const PILLARS: Pillar[] = [
  {
    n: 1,
    layer: "Foundation",
    color: "var(--c2)",
    title: "Access",
    sub: "The price of admission",
    principle: "If a machine can’t read your page, it can’t quote you.",
    metaphor:
      "The locked door. Pass or fail — no partial credit, no workaround.",
    big: "0",
    src: "JavaScript executed by GPTBot — it reads raw HTML only (Vercel, 500M requests)",
    moves: [
      "Allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot) in robots.txt",
      "Serve server-side or static HTML — not browser-assembled",
      "Stay fast: FCP under 0.4s earned ~3× more citations",
    ],
  },
  {
    n: 2,
    layer: "Foundation",
    color: "var(--c2)",
    title: "Alignment",
    sub: "The compass",
    principle: "You can be the best answer to a question nobody is asking AI.",
    metaphor:
      "The compass before the map. Aim at the real question before you build toward the wrong one.",
    big: "Q&A",
    src: "Search was shorthand; AI queries are full conversations. Write for the question actually asked.",
    moves: [
      "Map real questions — interviews, support, Reddit, prompting the engines",
      "Use the question itself as your heading",
      "Match structure to intent: definitional, comparative, decision-support",
    ],
  },
  {
    n: 3,
    layer: "Foundation",
    color: "var(--c2)",
    title: "Extractability",
    sub: "The mechanism",
    principle:
      "Answer engines cite passages, not pages. Write the sentence you want quoted — and put it first.",
    metaphor:
      "The pull quote. AI doesn’t read your book; it photocopies a paragraph.",
    big: "44%",
    src: "of ChatGPT citations come from the first third of a page (Profound)",
    moves: [
      "Lead with the claim in the first sentence — answer-first",
      "Make passages self-contained, specific, and evidenced inline",
      "Aim for 120–180 words under a question-shaped heading",
    ],
  },
  {
    n: 4,
    layer: "Reputation",
    color: "var(--c3)",
    title: "Authority",
    sub: "Mentions over links",
    principle:
      "AI trusts what the web already trusts. Mentions matter more than links.",
    metaphor:
      "Word of mouth at internet scale. The machine listens to the room — give it something true to say.",
    big: "0.664",
    src: "brand-mention correlation with AI visibility vs 0.218 for backlinks (Ahrefs, 75k brands)",
    moves: [
      "Earn genuine presence on Reddit, YouTube, Wikipedia, LinkedIn",
      "Build mentions and corroboration, not just backlinks",
      "Become a recognized entity engines can identify and connect",
    ],
  },
  {
    n: 5,
    layer: "Reputation",
    color: "var(--c3)",
    title: "Credibility",
    sub: "Show your work",
    principle:
      "Back every claim. Statistics, quotations, and cited sources are proven to raise AI visibility.",
    metaphor: "Math homework with the working shown. Receipts, not adjectives.",
    big: "+41%",
    src: "visibility lift from adding quotations — the top move in the Princeton GEO study (KDD 2024)",
    moves: [
      "Replace adjectives with numbers",
      "Attribute quotations and cite sources inline, in the text",
      "Sign the work with a real name and real credentials",
    ],
  },
  {
    n: 6,
    layer: "Reputation",
    color: "var(--c3)",
    title: "Originality",
    sub: "Be the primary source",
    principle:
      "Machines are built to find the best source. Originality is what makes you that source.",
    metaphor:
      "The lighthouse in a sea of generated content. Be the study everyone cites — not the article that cites it.",
    big: "∞→1",
    src: "Generic content is now infinite; specific, owned, first-hand knowledge is the scarce thing",
    moves: [
      "Run primary research you own",
      "Mine proprietary data and first-hand experience",
      "Take a clear, defended, evidence-backed point of view",
    ],
  },
  {
    n: 7,
    layer: "Momentum",
    color: "var(--c4)",
    title: "Freshness",
    sub: "The expiration date",
    principle:
      "Answer engines prefer the recent. Undated content reads as expired.",
    metaphor: "Milk has a date. Still on the shelf, but nobody’s serving it.",
    big: "65%",
    src: "of AI crawler visits target content under one year old (Seer, 5,000+ URLs)",
    moves: [
      "Revise substantively — don’t just change the date",
      "Show a visible published and last-updated date",
      "Match cadence to your topic’s clock-speed",
    ],
  },
  {
    n: 8,
    layer: "Momentum",
    color: "var(--c4)",
    title: "Adaptability",
    sub: "The only permanent advantage",
    principle: "The engines change monthly; your doctrine must too.",
    metaphor:
      "The river you can’t step in twice. A compass, not a map — written in pencil.",
    big: "~11%",
    src: "average citation overlap between engines — they live in separate citation universes",
    moves: [
      "Measure share of voice per engine, on a fixed prompt set",
      "Treat every tactic as a hypothesis (schema & llms.txt didn’t hold up)",
      "Build systems that bend — keep what the data confirms",
    ],
  },
];
