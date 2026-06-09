/**
 * Structured courses — the AEO school's guided curricula. Unlike a flat list of
 * article slugs, a course defines per-lesson objectives, a knowledge check, and
 * ordering, while each lesson REUSES a canonical /learn article (it cross-links,
 * it never duplicates the article's content). Pure data + lookup helpers; the
 * article-aware queries (by topic/article) live in content.ts to avoid cycles.
 */

export interface KnowledgeQuestion {
  question: string;
  options: string[];
  /** Zero-based index of the correct option. */
  correct: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  /** 1–2 sentence framing shown above the link to the full article. */
  intro: string;
  objectives: string[];
  /** Canonical /learn article slug this lesson reuses. */
  articleSlug: string;
  takeaways: string[];
  check: KnowledgeQuestion[];
  /** Optional self-scoring checklist (e.g. the Foundations L5 authority audit). */
  audit?: { title: string; items: string[] };
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  tier: string;
  certificate: string;
  level: string;
  estimatedHours: number;
  authorSlug: string;
  published: string;
  updated: string;
  outcomes: string[];
  lessons: Lesson[];
  /**
   * Optional course-preview presentation. `url` points to a self-contained deck
   * served from /public (embedded in an isolated iframe on the intro page).
   * `poster` mirrors the deck's own cover for the click-to-load state.
   */
  preview?: {
    url: string;
    title: string;
    poster?: { headline: string; subhead: string };
  };
}

export const COURSES: Course[] = [
  {
    slug: "aeo-foundations",
    title: "AEO Foundations",
    summary:
      "The complete beginner's course in Answer Engine Optimization — what it is, how engines choose what to cite, the Canon framework, and the core moves to become the source AI quotes.",
    tier: "Foundation",
    certificate: "Tier 1 Certificate",
    level: "Beginner",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-06-08",
    updated: "2026-06-09",
    preview: {
      url: "/aeo-foundations-preview.html",
      title: "AEO Foundations",
      poster: { headline: "AEO", subhead: "Foundations" },
    },
    outcomes: [
      "Explain what AEO is and why being cited matters more than ranking.",
      "Describe how AI answer engines retrieve, rerank, and cite sources.",
      "Apply the eight-pillar AEO Canon as a diagnostic.",
      "Write answer-first, extractable passages an engine can quote.",
      "Build genuine off-site authority and audit your footprint.",
      "Measure AI visibility and adapt as engines change.",
    ],
    lessons: [
      {
        slug: "what-is-aeo",
        title: "What AEO Is and Why It Matters",
        intro:
          "AEO is the practice of structuring content so AI answer engines extract, trust, and cite it. This lesson sets the foundation: why being the cited source is the new visibility.",
        objectives: [
          "Define Answer Engine Optimization in one sentence.",
          "Explain why citation is replacing the click as the prize.",
          "Distinguish AEO from (and connect it to) SEO.",
        ],
        articleSlug: "what-is-aeo",
        takeaways: [
          "AEO optimizes for being cited inside an AI answer, not ranked in a list of links.",
          "Engines cite passages, not whole pages — the passage is the unit you optimize.",
          "AEO extends SEO; the same crawlability, semantics, and authority feed both.",
        ],
        check: [
          {
            question: "What does AEO optimize for?",
            options: [
              "Ranking #1 in a list of blue links",
              "Being cited as a source inside an AI-generated answer",
              "Buying ads in AI chat interfaces",
              "More backlinks from any site",
            ],
            correct: 1,
            explanation:
              "AEO competes to be the source an engine quotes, not to rank in a list of links.",
          },
          {
            question: "What is the unit answer engines actually cite?",
            options: [
              "The whole domain",
              "The whole page",
              "A specific passage",
              "The meta description",
            ],
            correct: 2,
            explanation:
              "Engines retrieve and quote passages, so a single strong passage can be cited even on an ordinary page.",
          },
          {
            question: "How does AEO relate to SEO?",
            options: [
              "It replaces SEO entirely",
              "It has nothing to do with SEO",
              "It extends SEO — they share most fundamentals",
              "It only matters for paid search",
            ],
            correct: 2,
            explanation:
              "Roughly 70–80% overlaps with strong SEO; AEO adds an extraction-and-trust layer on top.",
          },
        ],
      },
      {
        slug: "how-engines-cite",
        title: "How AI Engines Choose What to Cite",
        intro:
          "AI engines run a retrieve → rerank → cite pipeline. This lesson shows what happens at each stage so you know exactly what you're optimizing for.",
        objectives: [
          "Describe the retrieve-rerank-cite pipeline.",
          "Name the three signals rerankers weigh most.",
          "Explain why ranking #1 doesn't guarantee a citation.",
        ],
        articleSlug: "how-ai-engines-choose-citations",
        takeaways: [
          "Citation is a pipeline: retrieve candidate passages, rerank them, then cite the ones used.",
          "Rerankers weigh relevance, authority, and freshness above keyword match.",
          "A lower-ranked but cleaner, better-evidenced passage can be cited over the #1 result.",
        ],
        check: [
          {
            question: "What are the core stages that produce a citation?",
            options: [
              "Crawl, index, advertise",
              "Retrieve, rerank, generate, cite",
              "Click, bounce, convert",
              "Submit, review, approve",
            ],
            correct: 1,
            explanation:
              "Engines retrieve candidate passages, rerank them for the query, generate the answer, and cite the sources used.",
          },
          {
            question: "Which signals does the reranker weigh most?",
            options: [
              "Keyword density, ad spend, domain age",
              "Relevance, authority, and freshness",
              "Font size, image count, page length",
              "Number of pages on the site",
            ],
            correct: 1,
            explanation:
              "Relevance, authority, and freshness decide which passages survive to inform the answer.",
          },
          {
            question: "Does ranking #1 in Google guarantee an AI citation?",
            options: [
              "Yes, always",
              "No — the best passage for the query can win instead",
              "Only for branded queries",
              "Only on Tuesdays",
            ],
            correct: 1,
            explanation:
              "Ranking helps you get retrieved, but reranking re-scores candidates; the most liftable, credible passage wins.",
          },
        ],
      },
      {
        slug: "the-canon",
        title: "The AEO Canon Framework",
        intro:
          "The AEO Canon organizes everything that drives AI citation into eight pillars across three layers. This lesson gives you the map and how to use it as a diagnostic.",
        objectives: [
          "Name the three layers of the Canon and what each asks.",
          "List the eight pillars in order.",
          "Use the Canon as a cascade to find your first broken gate.",
        ],
        articleSlug: "aeo-canon",
        takeaways: [
          "Three layers: Foundation (usable), Reputation (trusted), Momentum (kept).",
          "Eight pillars: Access, Alignment, Extractability, Authority, Credibility, Originality, Freshness, Adaptability.",
          "It's a cascade — fix the highest broken pillar first.",
        ],
        check: [
          {
            question: "What are the Canon's three layers?",
            options: [
              "Crawl, Index, Rank",
              "Foundation, Reputation, Momentum",
              "Awareness, Consideration, Conversion",
              "Bronze, Silver, Gold",
            ],
            correct: 1,
            explanation:
              "Foundation (can the machine use you?), Reputation (does the web vouch for you?), Momentum (do you stay chosen?).",
          },
          {
            question: "Why is the Canon called a cascade, not a checklist?",
            options: [
              "You can do the pillars in any order",
              "An earlier broken pillar makes later effort irrelevant",
              "It only has one step",
              "It resets every month",
            ],
            correct: 1,
            explanation:
              "The pillars depend on each other; a fix below a broken gate can't reach an engine until the gate is fixed.",
          },
          {
            question: "Which pillar is the binary gate you must pass first?",
            options: ["Authority", "Freshness", "Access", "Originality"],
            correct: 2,
            explanation:
              "If a crawler can't read your page (Access), nothing downstream can be cited.",
          },
        ],
      },
      {
        slug: "extractability",
        title: "Writing Passages AI Will Quote",
        intro:
          "Engines cite passages, so you have to write the sentence you want quoted and put it first. This lesson is the craft of extractability.",
        objectives: [
          "Write an answer-first, self-contained passage.",
          "Explain why placement and structure beat format.",
          "Add inline evidence that makes a passage safe to cite.",
        ],
        articleSlug: "extractability",
        takeaways: [
          "Lead with the answer in the first sentence under a question-shaped heading.",
          "Make passages self-contained (~120–180 words) so they make sense lifted out of context.",
          "Back claims with a specific statistic, quotation, or named source.",
        ],
        check: [
          {
            question: "Where should the answer go in a passage?",
            options: [
              "In the conclusion",
              "In the first sentence",
              "In the meta description",
              "In an image caption",
            ],
            correct: 1,
            explanation:
              "Answer-first: engines lift the opening sentence, so it should be a complete answer.",
          },
          {
            question: "What makes a passage 'self-contained'?",
            options: [
              "It uses lots of keywords",
              "It makes sense quoted alone, with no orphan pronouns or 'as above'",
              "It links to ten other pages",
              "It is under 20 words",
            ],
            correct: 1,
            explanation:
              "A self-contained passage can be lifted out of context and still stand on its own.",
          },
          {
            question: "What most improves a passage's chance of being cited?",
            options: [
              "Repeating the target keyword",
              "Inline evidence — a specific stat, quote, or source",
              "Bigger fonts",
              "A longer introduction",
            ],
            correct: 1,
            explanation:
              "The Princeton GEO study found citations, quotations, and statistics lifted visibility most.",
          },
        ],
      },
      {
        slug: "authority",
        title: "Earning Off-Site Authority",
        intro:
          "AI trusts what the web already trusts, and it weighs brand mentions over backlinks. This lesson covers earning genuine off-site authority — and auditing yours.",
        objectives: [
          "Explain why mentions matter more than backlinks for AEO.",
          "Identify the off-site surfaces engines read most.",
          "Audit your own off-site authority footprint.",
        ],
        articleSlug: "authority",
        takeaways: [
          "Brand mentions correlate with AI visibility far more than backlinks (0.664 vs 0.218, Ahrefs).",
          "Reddit, YouTube, and Wikipedia are among the most-cited domains in AI answers.",
          "Authority is earned through genuine participation — never manipulation.",
        ],
        audit: {
          title: "Quick off-site authority audit",
          items: [
            "We genuinely participate where our topic is discussed (e.g. Reddit, niche forums).",
            "We're mentioned in or produce relevant YouTube videos.",
            "We earn mentions in reputable publications and press.",
            "We have authentic profiles on the review platforms our buyers use.",
            "Our brand is mentioned consistently across the web — linked or not.",
          ],
        },
        check: [
          {
            question: "Which signal correlates most with AI visibility?",
            options: [
              "Backlinks",
              "Brand mentions across the web",
              "Meta keywords",
              "Page count",
            ],
            correct: 1,
            explanation:
              "Ahrefs found brand mentions (0.664) correlate with AI visibility far more than backlinks (0.218).",
          },
          {
            question: "Which is the most-cited domain in AI answers?",
            options: ["Reddit", "Your own blog", "LinkedIn ads", "A press release wire"],
            correct: 0,
            explanation:
              "Reddit is consistently the #1 cited domain across major AI engines.",
          },
          {
            question: "What's the right way to build authority?",
            options: [
              "Buy reviews and upvotes",
              "Astroturf with fake accounts",
              "Genuine, helpful, disclosed participation",
              "Spam links into forums",
            ],
            correct: 2,
            explanation:
              "Engines reward authentic, distributed trust — manipulation is fragile and gets detected.",
          },
        ],
      },
      {
        slug: "measurement",
        title: "Measuring AEO and Adapting",
        intro:
          "Engines change monthly and citations are volatile, so AEO is a measure-and-adapt discipline. This lesson covers what to track and how to stay chosen.",
        objectives: [
          "Choose the right AEO metrics (citation share, AI referrals).",
          "Set up per-engine measurement on a fixed prompt set.",
          "Treat tactics as hypotheses and adapt as engines change.",
        ],
        articleSlug: "adaptability",
        takeaways: [
          "Measure citation share and AI referral traffic, not just rankings.",
          "Track per engine — they overlap on only a fraction of citations.",
          "Citations are volatile (40–60% of sources change monthly), so adapt continuously.",
        ],
        check: [
          {
            question: "What's the headline AEO metric?",
            options: [
              "Keyword rankings only",
              "Citation share — how often you're named in answers",
              "Bounce rate",
              "Total page count",
            ],
            correct: 1,
            explanation:
              "Because clicks shrink, being named as a cited source becomes the metric that matters.",
          },
          {
            question: "Why measure each engine separately?",
            options: [
              "They always cite the same sources",
              "They overlap on only a fraction of citations",
              "It's required by law",
              "There's only one engine",
            ],
            correct: 1,
            explanation:
              "Engines live in different citation universes, so a blended score hides where you win or lose.",
          },
          {
            question: "How should you treat AEO tactics over time?",
            options: [
              "Set once and never revisit",
              "As hypotheses to measure and adapt — engines change",
              "Copy whatever a competitor did last year",
              "Ignore measurement entirely",
            ],
            correct: 1,
            explanation:
              "Adaptability: keep what the data confirms and adjust as engines and citations shift.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-and-llms-for-marketers",
    title: "AI & LLMs for Marketers",
    summary:
      "A plain-English course in how AI language models actually work — training, RAG, hallucination, and knowledge cutoffs — so you can make smart AEO decisions grounded in how the machines really behave.",
    tier: "Foundation",
    certificate: "Tier 1 Certificate",
    level: "Beginner",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-06-08",
    updated: "2026-06-09",
    preview: {
      url: "/ai-and-llms-preview.html",
      title: "AI & LLMs for Marketers",
      poster: { headline: "AI", subhead: "& LLMs for Marketers" },
    },
    outcomes: [
      "Explain what an LLM is and how it generates answers.",
      "Describe how models are trained and where their knowledge comes from.",
      "Explain retrieval-augmented generation and why it powers answer engines.",
      "Understand why models hallucinate and how grounding reduces it.",
      "Connect base vs. search-augmented models to your AEO strategy.",
    ],
    lessons: [
      {
        slug: "what-is-an-llm",
        title: "What Is a Large Language Model?",
        intro:
          "Every AI assistant runs on an LLM — a model trained to predict the next token. This lesson demystifies what that means and what it doesn't.",
        objectives: [
          "Define a large language model in plain terms.",
          "Explain next-token prediction at a high level.",
          "Separate the model from the product built around it.",
        ],
        articleSlug: "what-is-an-llm",
        takeaways: [
          "An LLM predicts the next token, scaled to billions of parameters and trillions of words.",
          "The model (e.g. GPT-5.5) is distinct from the product (e.g. ChatGPT) around it.",
          "LLMs model patterns in language — they don't 'understand,' which is why they can be confidently wrong.",
        ],
        check: [
          {
            question: "What does an LLM fundamentally do?",
            options: [
              "Look up answers in a database",
              "Predict the next token of text",
              "Crawl the web in real time by default",
              "Store every webpage verbatim",
            ],
            correct: 1,
            explanation:
              "An LLM repeatedly predicts the most likely next token; everything it does is built on that.",
          },
          {
            question: "Is ChatGPT the same as the LLM?",
            options: [
              "Yes, identical",
              "No — ChatGPT is a product wrapping a model",
              "ChatGPT has no model",
              "The LLM is the chat interface",
            ],
            correct: 1,
            explanation:
              "The LLM is the engine; the product adds the interface, tools, safety, and often live search.",
          },
          {
            question: "Do LLMs 'understand' language like people?",
            options: [
              "Yes, fully",
              "No — they model statistical patterns, which is why they can be confidently wrong",
              "Only in other languages",
              "Only when connected to the web",
            ],
            correct: 1,
            explanation:
              "They produce plausible text, not verified truth — the root of hallucination.",
          },
        ],
      },
      {
        slug: "how-llms-work",
        title: "How LLMs Work",
        intro:
          "Tokens become embeddings, attention weighs context, and the model predicts the next token. This lesson walks the loop from prompt to answer.",
        objectives: [
          "Trace the steps from prompt to generated answer.",
          "Explain what attention does.",
          "Explain why a base model can't cite sources.",
        ],
        articleSlug: "how-llms-work",
        takeaways: [
          "Text → tokens → embeddings → transformer attention → next-token prediction, repeated.",
          "Attention lets the model weigh how tokens relate — it's the transformer breakthrough.",
          "A base model answers from frozen patterns; it can't look things up unless connected to retrieval.",
        ],
        check: [
          {
            question: "What is the transformer's key operation?",
            options: ["Compression", "Attention", "Encryption", "Pagination"],
            correct: 1,
            explanation:
              "Attention weighs which tokens matter for predicting the next one — the core of modern LLMs.",
          },
          {
            question: "What does a token become before the model processes it?",
            options: ["A backlink", "An embedding (vector)", "A cookie", "A meta tag"],
            correct: 1,
            explanation:
              "Tokens are mapped to embeddings — numeric vectors encoding meaning — so the model can do math on language.",
          },
          {
            question: "Why does a plain model give different answers to the same prompt?",
            options: [
              "It's broken",
              "Generation is probabilistic (sampling, temperature)",
              "It rewrites your prompt",
              "It depends on your IP address",
            ],
            correct: 1,
            explanation:
              "The model samples from a probability distribution; temperature controls the randomness.",
          },
        ],
      },
      {
        slug: "training",
        title: "How AI Models Are Trained",
        intro:
          "Models learn in stages — pretraining, fine-tuning, RLHF — from huge amounts of text. This lesson shows where their abilities and blind spots come from.",
        objectives: [
          "Outline the three stages of training an LLM.",
          "Explain what training data is and where it comes from.",
          "Explain why a trained model is frozen at a knowledge cutoff.",
        ],
        articleSlug: "how-ai-models-are-trained",
        takeaways: [
          "Pretraining (learn language) → fine-tuning (follow instructions) → RLHF (be helpful & safe).",
          "Training data is trillions of tokens from the web, books, code, and licensed sources.",
          "Training is a frozen snapshot — built-in knowledge stops at the cutoff date.",
        ],
        check: [
          {
            question: "Which is the correct training order?",
            options: [
              "RLHF → pretraining → fine-tuning",
              "Pretraining → supervised fine-tuning → RLHF",
              "Fine-tuning → pretraining → RLHF",
              "There is only one stage",
            ],
            correct: 1,
            explanation:
              "Pretraining builds language ability; fine-tuning teaches instruction-following; RLHF aligns to human preferences.",
          },
          {
            question: "What is RLHF for?",
            options: [
              "Crawling the web",
              "Tuning the model toward helpful, human-preferred answers",
              "Compressing the model",
              "Adding live search",
            ],
            correct: 1,
            explanation:
              "Reinforcement learning from human feedback turns a raw predictor into a usable assistant.",
          },
          {
            question: "Why can a model be confidently out of date?",
            options: [
              "It updates hourly",
              "Its knowledge is frozen at a training cutoff",
              "It only reads your site",
              "It never makes mistakes",
            ],
            correct: 1,
            explanation:
              "Once trained, built-in knowledge doesn't change until retraining — hence the knowledge cutoff.",
          },
        ],
      },
      {
        slug: "rag",
        title: "How AI Answers Are Built (RAG)",
        intro:
          "Retrieval-augmented generation is how answer engines stay current and cite sources. This lesson connects RAG directly to how you get cited.",
        objectives: [
          "Explain retrieval-augmented generation in plain terms.",
          "Describe the retrieve-rerank-generate-cite pipeline.",
          "Explain why RAG makes the passage the unit of AEO.",
        ],
        articleSlug: "what-is-rag",
        takeaways: [
          "RAG retrieves real passages first, then generates an answer grounded in them.",
          "It's why AI answers can be current and can cite their sources.",
          "Because RAG quotes passages, the passage — not the page — is what you optimize.",
        ],
        check: [
          {
            question: "What does RAG add to a base model?",
            options: [
              "A bigger vocabulary",
              "Retrieval of real sources at query time, so answers can be current and cited",
              "Faster typing",
              "More parameters",
            ],
            correct: 1,
            explanation:
              "RAG grounds the model in retrieved passages, enabling current, attributable answers.",
          },
          {
            question: "Which is the RAG pipeline?",
            options: [
              "Retrieve → rerank → generate → cite",
              "Click → scroll → convert",
              "Crawl → rank → advertise",
              "Train → freeze → forget",
            ],
            correct: 0,
            explanation:
              "Retrieve candidates, rerank them, generate the answer, and cite the sources used.",
          },
          {
            question: "What does RAG make the unit of optimization?",
            options: ["The domain", "The passage", "The sitemap", "The ad"],
            correct: 1,
            explanation:
              "Retrieval works on chunks, so a self-contained passage is what gets retrieved and cited.",
          },
        ],
      },
      {
        slug: "hallucination",
        title: "Why AI Gets Things Wrong",
        intro:
          "Models hallucinate because they generate plausible text, not verified truth. This lesson explains why — and why grounding and evidence are the defense.",
        objectives: [
          "Define an AI hallucination.",
          "Explain the root cause of hallucination.",
          "Explain how grounding and evidence reduce it.",
        ],
        articleSlug: "why-do-ai-models-hallucinate",
        takeaways: [
          "A hallucination is confident, fluent output that's false or unsupported.",
          "Root cause: models optimize for plausibility, not truth, and can't tell the difference.",
          "Grounding in retrieved sources reduces it — and engines favor evidenced, low-risk sources.",
        ],
        check: [
          {
            question: "Why do LLMs hallucinate?",
            options: [
              "They run out of memory",
              "They generate the most plausible text, not verified truth",
              "They are connected to the wrong server",
              "They only hallucinate on purpose",
            ],
            correct: 1,
            explanation:
              "When patterns are thin, a model still produces a confident, plausible — sometimes wrong — answer.",
          },
          {
            question: "What's the most effective way to reduce hallucination?",
            options: [
              "Ask more politely",
              "Ground the model in retrieved sources (RAG)",
              "Increase temperature",
              "Use longer prompts",
            ],
            correct: 1,
            explanation:
              "Grounding gives the model real text to draw on instead of guessing.",
          },
          {
            question: "Why is being well-evidenced good for AEO?",
            options: [
              "It isn't",
              "Engines favor sources that are safe to repeat, lowering their hallucination risk",
              "It increases ad revenue",
              "It hides your content",
            ],
            correct: 1,
            explanation:
              "Specific, sourced claims are low-risk to repeat, so engines prefer to cite them.",
          },
        ],
      },
      {
        slug: "what-it-means",
        title: "What This Means for Marketers",
        intro:
          "Base models are frozen and can't cite you; search-augmented models retrieve live sources and can. This lesson turns the mechanics into your AEO strategy.",
        objectives: [
          "Distinguish base from search-augmented models.",
          "Explain why only the retrieval layer can cite you.",
          "Connect LLM mechanics to concrete AEO actions.",
        ],
        articleSlug: "base-vs-search-augmented-models",
        takeaways: [
          "A base model answers from frozen training; a search-augmented model retrieves live sources and cites them.",
          "Your opportunity is the retrieval layer — you can't reliably influence frozen weights.",
          "Be reachable, current, answer-first, and authoritative so the retrieval step surfaces and cites you.",
        ],
        check: [
          {
            question: "Which type of system can cite your content?",
            options: [
              "A base model answering from memory",
              "A search-augmented model that retrieves live sources",
              "Neither",
              "Only paid models",
            ],
            correct: 1,
            explanation:
              "Only the retrieval layer fetches live sources at answer time, so only it can name you.",
          },
          {
            question: "Why can't you 'optimize into' a base model's training?",
            options: [
              "You can, easily",
              "Its knowledge is frozen and unattributed — you can't reliably influence weights",
              "Training happens daily",
              "Base models don't exist",
            ],
            correct: 1,
            explanation:
              "Training is frozen and anonymous; your route to citation is being retrieved, not trained on.",
          },
          {
            question: "What's the practical takeaway for marketers?",
            options: [
              "Ignore AI entirely",
              "Be reachable, current, answer-first, and authoritative so retrieval surfaces you",
              "Buy more backlinks",
              "Stuff keywords",
            ],
            correct: 1,
            explanation:
              "Win the retrieval-and-rerank step with content that's easy to find, trust, and lift.",
          },
        ],
      },
    ],
  },
];

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLesson(
  courseSlug: string,
  lessonSlug: string,
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index]!, index };
}
