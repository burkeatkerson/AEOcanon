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
  {
    slug: "aeo-tools-mastery",
    title: "AEO Tools Mastery",
    summary:
      "Master the AI visibility tooling stack — choosing, running, and getting value from trackers across budgets and team sizes. A Practitioner-tier course that turns the Tools library into a working measurement operation and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Choose the right AI visibility tracker for your size and budget.",
      "Run team- and enterprise-grade trackers effectively.",
      "Fold AI tracking into an existing SEO suite.",
      "Assemble a free or low-cost AEO toolstack.",
      "Evaluate any tool on a fixed prompt set, not feature lists.",
    ],
    lessons: [
      {
        slug: "choose-your-stack",
        title: "Choosing Your AI Visibility Stack",
        intro:
          "Every AI visibility tool does the same core job — track how engines cite you. This lesson is how to choose by scale, engines covered, and budget rather than feature lists.",
        objectives: [
          "Explain what an AI visibility tool actually measures.",
          "Match tool tiers to team size and budget.",
          "Evaluate any tracker on a fixed prompt set.",
        ],
        articleSlug: "best-ai-visibility-tools",
        takeaways: [
          "All trackers run a prompt set on a schedule and report citation share.",
          "Otterly and Peec fit most teams; Profound and Scrunch are enterprise.",
          "Judge tools on trends across a fixed prompt set, not single readings.",
        ],
        check: [
          {
            question: "What is the core job of an AI visibility tool?",
            options: [
              "Write your content for you",
              "Track how often and how engines cite your brand",
              "Buy ad placement inside AI chats",
              "Submit your site to AI engines",
            ],
            correct: 1,
            explanation:
              "It runs prompts on a schedule and reports citation share, competitors, and sources.",
          },
          {
            question: "How should you evaluate a tracker?",
            options: [
              "By its longest feature list",
              "On a fixed prompt set, watching the trend",
              "By price alone",
              "By how many logos it shows",
            ],
            correct: 1,
            explanation:
              "Citations are volatile, so judge tools on trends across a stable prompt set.",
          },
        ],
      },
      {
        slug: "team-tracking-peec",
        title: "Team-Scale Tracking with Peec AI",
        intro:
          "Peec AI targets marketing teams and agencies with daily multi-engine tracking. This lesson covers when it is the right fit and how to get value from it.",
        objectives: [
          "Describe who Peec AI is built for.",
          "Use its mentions-vs-citations and multi-brand features.",
          "Decide when to choose it over entry or enterprise tools.",
        ],
        articleSlug: "peec-ai-review",
        takeaways: [
          "Peec AI suits teams and agencies with daily multi-engine tracking.",
          "It separates mentions from citations and supports multiple brands.",
          "Match the plan to prompts times engines to control cost.",
        ],
        check: [
          {
            question: "Who is Peec AI best suited for?",
            options: [
              "Solo hobbyists only",
              "Marketing teams and agencies",
              "Enterprises exclusively",
              "People who do not track at all",
            ],
            correct: 1,
            explanation:
              "It targets teams and agencies with multi-brand, daily multi-engine tracking.",
          },
          {
            question: "Why track mentions and citations separately?",
            options: [
              "They are identical",
              "They are different wins that need different work",
              "Mentions do not matter",
              "Citations do not matter",
            ],
            correct: 1,
            explanation:
              "A mention builds awareness; a citation links and credits you — track both.",
          },
        ],
      },
      {
        slug: "enterprise-profound",
        title: "Enterprise Tracking with Profound",
        intro:
          "Profound is an enterprise-grade answer-engine analytics platform covering many engines with content workflows. This lesson covers what it adds at scale.",
        objectives: [
          "Describe Profound's enterprise positioning.",
          "Explain its analytics and content/agent workflows.",
          "Know when enterprise tooling is justified.",
        ],
        articleSlug: "profound-review",
        takeaways: [
          "Profound covers 10+ engines with enterprise analytics.",
          "It adds content and agent workflows beyond raw tracking.",
          "Enterprise tooling is justified by scale and integration needs.",
        ],
        check: [
          {
            question: "What tier does Profound target?",
            options: ["Free and solo", "Enterprise", "No one", "Only Bing users"],
            correct: 1,
            explanation: "Profound is enterprise-grade, priced and built for scale.",
          },
          {
            question: "When is enterprise tracking justified?",
            options: [
              "Always, for everyone",
              "When scale and integration needs warrant it",
              "Never",
              "Only for personal blogs",
            ],
            correct: 1,
            explanation:
              "Enterprise tooling pays off at scale; smaller teams start cheaper.",
          },
        ],
      },
      {
        slug: "ai-in-your-seo-suite",
        title: "AI Tracking Inside Your SEO Suite",
        intro:
          "SE Ranking folds AI visibility tracking into an existing SEO platform. This lesson covers when an integrated suite beats a standalone tool.",
        objectives: [
          "Explain the integrated SE Visible approach.",
          "Weigh integrated versus standalone trackers.",
          "See AI citations and rankings side by side.",
        ],
        articleSlug: "se-ranking-ai-review",
        takeaways: [
          "SE Ranking integrates AI tracking with SEO in one suite.",
          "Integration helps when you want rankings and citations together.",
          "Standalone tools may go deeper on AI specifically.",
        ],
        check: [
          {
            question: "What is the appeal of SE Ranking's AI tracking?",
            options: [
              "It is the only tool that works",
              "It lives in the same suite as your SEO",
              "It replaces all content work",
              "It is Google-only",
            ],
            correct: 1,
            explanation:
              "Integration lets you see rankings and AI citations side by side in one place.",
          },
          {
            question: "When might you prefer a standalone AI tracker?",
            options: [
              "Never",
              "When you need deeper AI-specific analysis",
              "When you dislike SEO",
              "When you have no prompts",
            ],
            correct: 1,
            explanation:
              "Standalone tools can go deeper on AI; suites win on integration.",
          },
        ],
      },
      {
        slug: "content-optimization-tools",
        title: "Content Optimization Tools",
        intro:
          "Optimization tools help you shape content to be extractable and citable. This lesson covers what they do and where they stop.",
        objectives: [
          "Describe what content optimization tools do for AEO.",
          "Use them to improve extractability and coverage.",
          "Recognize their limits versus genuine quality.",
        ],
        articleSlug: "best-content-optimization-tools",
        takeaways: [
          "Optimization tools guide structure, coverage, and extractability.",
          "They assist but do not replace original, credible content.",
          "Pair tool guidance with answer-first writing.",
        ],
        check: [
          {
            question: "What do content optimization tools mainly help with?",
            options: [
              "Buying links",
              "Shaping structure and coverage for extraction",
              "Hosting your site",
              "Writing your invoices",
            ],
            correct: 1,
            explanation:
              "They guide structure, coverage, and extractability — the on-page craft.",
          },
          {
            question: "What is their limit?",
            options: [
              "They replace expertise",
              "They cannot substitute for original, credible content",
              "They guarantee citations",
              "They write flawless content",
            ],
            correct: 1,
            explanation:
              "Tools assist; genuine originality and evidence still win citations.",
          },
        ],
      },
      {
        slug: "free-toolstack",
        title: "The Free AEO Toolstack",
        intro:
          "You can start AEO measurement for free. This lesson assembles a no-budget toolstack and the manual method behind it.",
        objectives: [
          "Assemble a free AEO measurement stack.",
          "Know when to upgrade to paid tracking.",
          "Run a basic manual prompt set.",
        ],
        articleSlug: "best-free-aeo-tools",
        takeaways: [
          "Free tiers and manual tracking cover a real baseline.",
          "Upgrade when you need daily, multi-engine, at-scale tracking.",
          "Start measuring before you spend.",
        ],
        check: [
          {
            question: "Can you start AEO measurement for free?",
            options: [
              "No, never",
              "Yes — free tiers and manual tracking cover a baseline",
              "Only with an enterprise budget",
              "Only on Bing",
            ],
            correct: 1,
            explanation:
              "Free options and a manual prompt set establish a real baseline.",
          },
          {
            question: "When should you upgrade to paid tracking?",
            options: [
              "Immediately, always",
              "When you need daily, multi-engine, at-scale tracking",
              "Never",
              "Only if forced",
            ],
            correct: 1,
            explanation:
              "Upgrade for daily sampling, more prompts and engines, and competitor analysis at scale.",
          },
        ],
      },
    ],
  },
  {
    slug: "authority-and-off-site-aeo",
    title: "Authority and Off-Site AEO",
    summary:
      "Earn the off-site authority answer engines trust — mentions over links, Reddit, digital PR, and a clean entity. A Practitioner-tier course that turns the Off-Site Playbooks into an authority program and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 4,
    authorSlug: "jordan-vega",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Prioritize brand mentions over backlinks for AI visibility.",
      "Audit your off-site footprint and find the gaps.",
      "Earn genuine Reddit and community citations.",
      "Run digital PR aimed at AI citation.",
      "Build a coherent, trusted brand entity.",
    ],
    lessons: [
      {
        slug: "mentions-over-backlinks",
        title: "Why Mentions Beat Backlinks",
        intro:
          "For AI visibility, brand mentions outweigh backlinks by more than three to one. This lesson reframes off-site work from link-building to being talked about.",
        objectives: [
          "Cite the mentions-versus-backlinks correlation.",
          "Explain why unlinked mentions count.",
          "Shift effort from links to mentions.",
        ],
        articleSlug: "mentions-vs-backlinks",
        takeaways: [
          "Ahrefs found mentions correlated at 0.664 versus 0.218 for backlinks.",
          "Unlinked mentions count — engines read how the web refers to you.",
          "Pursue mentions; good links often come bundled with them.",
        ],
        check: [
          {
            question: "Which correlates more with AI visibility?",
            options: ["Backlinks", "Brand mentions", "Meta tags", "Domain age"],
            correct: 1,
            explanation:
              "Ahrefs found mentions at 0.664 versus 0.218 for backlinks across 75,000 brands.",
          },
          {
            question: "Do unlinked mentions count?",
            options: [
              "No",
              "Yes — engines read how the web refers to you",
              "Only with a link",
              "Only on your own site",
            ],
            correct: 1,
            explanation:
              "Engines build their picture of you from mentions, linked or not.",
          },
        ],
      },
      {
        slug: "audit-your-footprint",
        title: "Audit Your Off-Site Footprint",
        intro:
          "You cannot improve authority you have not measured. This lesson audits where the web mentions and cites you — and where it does not.",
        objectives: [
          "Inventory your off-site mentions and citations.",
          "Spot the gaps competitors fill.",
          "Prioritize authority work by impact.",
        ],
        articleSlug: "off-site-authority-audit",
        takeaways: [
          "Audit mentions across the sources engines trust.",
          "Find the questions and surfaces where rivals are cited and you are not.",
          "Prioritize by where citations actually move.",
        ],
        check: [
          {
            question: "Why audit your off-site footprint first?",
            options: [
              "To brag",
              "To find authority gaps before investing",
              "To buy links",
              "It is not useful",
            ],
            correct: 1,
            explanation:
              "An audit shows where you are absent so you invest where it counts.",
          },
          {
            question: "What is the adaptability tie-in?",
            options: [
              "Audit once and stop",
              "Re-audit periodically as the web changes",
              "Never measure",
              "Only measure on-page",
            ],
            correct: 1,
            explanation: "Authority shifts, so the audit is a recurring discipline.",
          },
        ],
      },
      {
        slug: "reddit-citations",
        title: "Earning Reddit Citations",
        intro:
          "Reddit is the single most-cited domain across AI engines. This lesson covers earning genuine presence there without manipulation.",
        objectives: [
          "Explain why engines lean on Reddit.",
          "Participate authentically in relevant subreddits.",
          "Avoid manipulation that backfires.",
        ],
        articleSlug: "reddit-aeo-playbook",
        takeaways: [
          "Reddit is the number-one cited domain across engines.",
          "Genuine, helpful participation earns citations; spam does not.",
          "Match subreddits to your category's real conversations.",
        ],
        check: [
          {
            question: "Why does Reddit matter for AEO?",
            options: [
              "It is the number-one cited domain across engines",
              "It has no influence",
              "It is only for memes",
              "Engines ignore it",
            ],
            correct: 0,
            explanation:
              "Reddit is consistently the most-cited domain across major AI engines.",
          },
          {
            question: "What works on Reddit?",
            options: [
              "Mass self-promotion",
              "Genuine, helpful participation",
              "Vote manipulation",
              "Buying upvotes",
            ],
            correct: 1,
            explanation:
              "Authentic contribution earns trust; manipulation is detected and backfires.",
          },
        ],
      },
      {
        slug: "digital-pr",
        title: "Digital PR for AI Citation",
        intro:
          "Digital PR is the engine of off-site authority — earning mentions in the publications engines trust. This lesson reframes PR around AI citation.",
        objectives: [
          "Frame PR around earning brand mentions.",
          "Pitch stories that earn cited coverage.",
          "Connect PR to citation outcomes.",
        ],
        articleSlug: "digital-pr-for-ai",
        takeaways: [
          "PR earns the mentions that move AI visibility most.",
          "A good placement carries the mention that matters, plus a link.",
          "Aim for reputable, frequently-cited publications.",
        ],
        check: [
          {
            question: "How does digital PR help AEO?",
            options: [
              "It buys citations",
              "It earns brand mentions engines weight heavily",
              "It has no effect",
              "It only helps social media",
            ],
            correct: 1,
            explanation:
              "PR earns the credible mentions that correlate most with AI visibility.",
          },
          {
            question: "What is the most valuable part of a placement for AEO?",
            options: [
              "The byline photo",
              "The brand mention in credible coverage",
              "The publish time",
              "The font",
            ],
            correct: 1,
            explanation:
              "The mention in trusted coverage does the heavy AI-visibility lifting.",
          },
        ],
      },
      {
        slug: "branded-mentions",
        title: "Building Branded Mentions at Scale",
        intro:
          "Beyond PR, branded mentions accrue from being genuinely mention-worthy. This lesson builds a repeatable mentions program.",
        objectives: [
          "Create assets worth mentioning — data, tools, a point of view.",
          "Distribute across the surfaces engines read.",
          "Track branded mention growth.",
        ],
        articleSlug: "build-branded-mentions",
        takeaways: [
          "Original data and tools earn mentions repeatedly.",
          "Distribute where engines look, not just on your own site.",
          "Track mentions, not only links.",
        ],
        check: [
          {
            question: "What earns mentions repeatedly?",
            options: [
              "Thin reposts",
              "Original data, tools, and a clear point of view",
              "Keyword stuffing",
              "Hidden text",
            ],
            correct: 1,
            explanation: "Genuinely mention-worthy assets compound; sameness does not.",
          },
          {
            question: "What should you track?",
            options: [
              "Only backlinks",
              "Branded mentions across the web",
              "Nothing",
              "Ad spend only",
            ],
            correct: 1,
            explanation: "Track mentions and search lift, not just links.",
          },
        ],
      },
      {
        slug: "wikipedia-entity",
        title: "The Wikipedia Entity",
        intro:
          "A correct Wikipedia entity helps engines know your brand. This lesson covers the honest path to entity presence.",
        objectives: [
          "Explain why entities matter to engines.",
          "Pursue notability the right way.",
          "Keep your entity accurate and sourced.",
        ],
        articleSlug: "wikipedia-strategy",
        takeaways: [
          "A correct entity helps engines recognize and trust you.",
          "Notability and reliable sources are prerequisites — no shortcuts.",
          "Accuracy and citations matter more than promotion.",
        ],
        check: [
          {
            question: "Why does a Wikipedia entity help AEO?",
            options: [
              "It guarantees rank one",
              "It helps engines recognize and trust your brand",
              "It is irrelevant",
              "It hides your content",
            ],
            correct: 1,
            explanation: "A well-sourced entity strengthens how engines know you.",
          },
          {
            question: "What is required for a Wikipedia entity?",
            options: [
              "Paying for it",
              "Genuine notability and reliable sources",
              "Keyword stuffing",
              "A press release only",
            ],
            correct: 1,
            explanation:
              "Notability backed by reliable, independent sources — not promotion.",
          },
        ],
      },
    ],
  },
  {
    slug: "technical-aeo",
    title: "Technical AEO",
    summary:
      "Make your site technically eligible to be cited — crawlable, renderable, fast, and verifiable. A Practitioner-tier course that turns the Technical cluster into a working checklist and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 4,
    authorSlug: "priya-nair",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Allow the right AI crawlers in robots.txt.",
      "Confirm crawlers can read your rendered content.",
      "Fix client-rendering that breaks citation eligibility.",
      "Read server logs for AI crawler activity.",
      "Improve page speed as a citation factor.",
    ],
    lessons: [
      {
        slug: "robots-txt",
        title: "Allow AI Crawlers in robots.txt",
        intro:
          "AI engines can only cite pages their crawlers may fetch. This lesson deploys a verified, permissive robots.txt.",
        objectives: [
          "Write an explicit allow block for AI crawlers.",
          "Avoid the leftover Disallow that blocks everyone.",
          "Verify robots.txt is live and correct.",
        ],
        articleSlug: "allow-ai-crawlers-robots-txt",
        takeaways: [
          "The most specific user-agent group wins.",
          "A stray site-wide Disallow silently blocks every crawler.",
          "robots.txt must return 200 as text/plain at the root.",
        ],
        check: [
          {
            question: "Which robots.txt group does a crawler obey?",
            options: [
              "The first one in the file",
              "The most specific matching user-agent group",
              "A random one",
              "None of them",
            ],
            correct: 1,
            explanation: "A per-bot group overrides the wildcard for that bot.",
          },
          {
            question: "What is the most common blocking mistake?",
            options: [
              "Too many sitemaps",
              "A leftover site-wide Disallow that blocks all bots",
              "Allowing GPTBot",
              "Serving text/plain",
            ],
            correct: 1,
            explanation:
              "A staging-era Disallow blocks every crawler without its own group.",
          },
        ],
      },
      {
        slug: "which-crawlers",
        title: "Which Crawlers to Allow",
        intro:
          "Crawlers do different jobs — search, user-fetch, and training. This lesson decides which to allow for citations.",
        objectives: [
          "Distinguish search, user-fetch, and training crawlers.",
          "Allow the citation-driving bots.",
          "Decide training opt-in deliberately.",
        ],
        articleSlug: "which-ai-crawlers-to-allow",
        takeaways: [
          "Allow OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot, and Bingbot.",
          "Training crawlers like GPTBot and ClaudeBot are a separate choice.",
          "Google-Extended gates Gemini's use of your content.",
        ],
        check: [
          {
            question: "Which bots drive citations?",
            options: [
              "Training crawlers only",
              "Search-indexing and user-fetch bots",
              "No bots",
              "Only Googlebot",
            ],
            correct: 1,
            explanation:
              "Search and user-fetch bots build the candidate set engines cite.",
          },
          {
            question: "What is Google-Extended?",
            options: [
              "A CDN",
              "A robots token gating Gemini's use of your content",
              "A ranking factor",
              "A sitemap type",
            ],
            correct: 1,
            explanation:
              "It controls generative-AI use separately from Googlebot's Search crawling.",
          },
        ],
      },
      {
        slug: "test-what-crawlers-see",
        title: "Test What Crawlers See",
        intro:
          "Most AI crawlers do not run JavaScript, so test the raw HTML, not the rendered DOM. This lesson runs the JS-disabled and curl tests.",
        objectives: [
          "Run the JavaScript-disabled browser test.",
          "Fetch your page as a crawler with curl.",
          "Tell raw HTML from the rendered DOM.",
        ],
        articleSlug: "check-ai-crawlers-can-read-site",
        takeaways: [
          "Test the raw HTML via View Source or curl, not Inspect.",
          "If content vanishes with JavaScript off, crawlers miss it too.",
          "Fetching with a crawler user-agent shows the exact bytes it receives.",
        ],
        check: [
          {
            question: "What should you inspect for crawlability?",
            options: [
              "The rendered DOM in Inspect",
              "The raw HTML via View Source or curl",
              "Your analytics dashboard",
              "The favicon",
            ],
            correct: 1,
            explanation: "Crawlers read raw HTML; Inspect shows the post-JavaScript DOM.",
          },
          {
            question: "Content shows in the browser but not in curl — why?",
            options: [
              "The server is down",
              "It is client-rendered and crawlers cannot see it",
              "robots.txt is missing",
              "It is a font issue",
            ],
            correct: 1,
            explanation:
              "JavaScript injected it client-side; non-rendering crawlers miss it.",
          },
        ],
      },
      {
        slug: "javascript-and-rendering",
        title: "Why JavaScript Breaks Citations",
        intro:
          "Vercel and MERJ found AI crawlers execute essentially no JavaScript. This lesson fixes client-rendering with SSR or SSG.",
        objectives: [
          "Explain why client-rendered content is invisible.",
          "Choose SSR, SSG, or prerendering.",
          "Keep your framework while rendering on the server.",
        ],
        articleSlug: "javascript-breaks-ai-citation",
        takeaways: [
          "500M+ GPTBot requests showed zero JavaScript execution (Vercel/MERJ).",
          "Put citable content in the initial HTML.",
          "React and Vue are fine — render on the server.",
        ],
        check: [
          {
            question: "Do AI crawlers run JavaScript?",
            options: [
              "Yes, all of them",
              "Mostly no — they read raw HTML",
              "Only on weekends",
              "Always, fully",
            ],
            correct: 1,
            explanation:
              "Vercel and MERJ found no JavaScript execution across 500M+ GPTBot requests.",
          },
          {
            question: "What is the fix for client-rendered content?",
            options: [
              "Add more JavaScript",
              "Server-render or prerender so content is in the initial HTML",
              "Block the crawlers",
              "Use bigger images",
            ],
            correct: 1,
            explanation:
              "SSR, SSG, or prerendering put the answer in the HTML the crawler receives.",
          },
        ],
      },
      {
        slug: "server-logs",
        title: "Read Server Logs for Crawler Activity",
        intro:
          "Server logs are the ground truth for crawler activity that analytics misses. This lesson greps for AI crawlers and reads status codes.",
        objectives: [
          "Grep logs for AI user-agents.",
          "Check status codes for blocks.",
          "See which pages each bot crawls.",
        ],
        articleSlug: "read-server-logs-ai-crawlers",
        takeaways: [
          "Logs capture bots that JavaScript analytics never sees.",
          "Status 200 is healthy; 403, 404, and 5xx signal problems.",
          "Verify suspicious user-agents by IP if certainty is needed.",
        ],
        check: [
          {
            question: "Why use server logs over analytics for bots?",
            options: [
              "Analytics is illegal",
              "Bots rarely fire JavaScript trackers; logs capture every request",
              "Logs are prettier",
              "There is no reason",
            ],
            correct: 1,
            explanation: "Crawlers do not run analytics JavaScript; logs record raw requests.",
          },
          {
            question: "A wall of 403s for GPTBot means what?",
            options: [
              "Everything is fine",
              "You are blocking it via robots.txt or a firewall",
              "It converted well",
              "It is indexed",
            ],
            correct: 1,
            explanation:
              "403s mean access is blocked — check robots.txt and firewall rules.",
          },
        ],
      },
      {
        slug: "page-speed",
        title: "Page Speed and Citations",
        intro:
          "SE Ranking found fast pages earn far more AI citations. This lesson measures and improves server response time.",
        objectives: [
          "Cite the speed-to-citation finding.",
          "Measure TTFB and FCP with curl and Lighthouse.",
          "Cut server response time.",
        ],
        articleSlug: "page-speed-ai-citations",
        takeaways: [
          "SE Ranking found FCP under 0.4s earned about 3x more citations.",
          "Crawlers have budgets and timeouts — slow pages get fetched less.",
          "Serve fast, cached, server-rendered HTML from a CDN.",
        ],
        check: [
          {
            question: "Does speed affect AI citations?",
            options: [
              "No",
              "Yes — SE Ranking found about 3x for FCP under 0.4s",
              "Only for ads",
              "Only on mobile",
            ],
            correct: 1,
            explanation:
              "Fast pages are crawled more reliably and earned far more citations.",
          },
          {
            question: "What is the biggest speed lever for crawlers?",
            options: [
              "More JavaScript",
              "Fast, cached, server-rendered HTML via a CDN",
              "Bigger hero videos",
              "More redirects",
            ],
            correct: 1,
            explanation:
              "Ready HTML on first byte fixes crawlability and speed together.",
          },
        ],
      },
    ],
  },
  {
    slug: "writing-for-answer-engines",
    title: "Writing for Answer Engines",
    summary:
      "Write passages AI will quote — answer-first, evidenced, right-sized, and structured for extraction. A Practitioner-tier course that turns the writing-craft cluster into a repeatable workflow and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Write self-contained passages engines can lift.",
      "Lead every section with the answer.",
      "Use question-shaped headings that match real queries.",
      "Right-size passages to the citable sweet spot.",
      "Back claims with evidence that raises visibility.",
    ],
    lessons: [
      {
        slug: "quotable-content",
        title: "Write Content AI Will Quote",
        intro:
          "Engines quote passages, not pages. This lesson is the craft of writing the quotable passage.",
        objectives: [
          "Define the quotable passage.",
          "Apply the answer-first, evidence, right-size loop.",
          "Test a passage by reading it lifted out.",
        ],
        articleSlug: "write-content-ai-will-quote",
        takeaways: [
          "Engines cite passages — write the sentence you want quoted, first.",
          "Profound found 44% of citations come from the first third of a page.",
          "If it makes sense lifted out, it is citable.",
        ],
        check: [
          {
            question: "What unit do engines quote?",
            options: ["The domain", "A self-contained passage", "The footer", "The sitemap"],
            correct: 1,
            explanation: "Citations happen at the passage level.",
          },
          {
            question: "Where does most citation opportunity live?",
            options: [
              "The first third of the page (Profound: 44%)",
              "The footer",
              "Image alt text",
              "The print stylesheet",
            ],
            correct: 0,
            explanation:
              "Profound found 44% of ChatGPT citations come from the first third.",
          },
        ],
      },
      {
        slug: "answer-first",
        title: "The Answer-First Sentence",
        intro:
          "The highest-leverage move in AEO is leading with the answer. This lesson teaches the pattern and the one-line test.",
        objectives: [
          "Write a complete answer in sentence one.",
          "Delete throat-clearing openers.",
          "Apply the delete-all-but-first test.",
        ],
        articleSlug: "answer-first-sentence",
        takeaways: [
          "State the complete answer before any context.",
          "Cut openers like 'there are many factors'.",
          "If only the first sentence survives, does it still answer?",
        ],
        check: [
          {
            question: "What is an answer-first sentence?",
            options: [
              "A teaser",
              "The complete answer stated before any context",
              "A keyword list",
              "A call to action",
            ],
            correct: 1,
            explanation: "It delivers the full answer up front; context follows.",
          },
          {
            question: "How do you test for a buried answer?",
            options: [
              "Count the words",
              "Delete all but the first sentence — does it still answer?",
              "Check the title tag",
              "Add more intro",
            ],
            correct: 1,
            explanation:
              "If the opener does not answer the heading, the answer is buried.",
          },
        ],
      },
      {
        slug: "question-headings",
        title: "Question-Shaped Headings",
        intro:
          "AI queries are questions; headings that mirror them win the match. This lesson converts labels into real questions.",
        objectives: [
          "Convert label headings into questions.",
          "Mirror real, conversational query language.",
          "Structure a page around questions.",
        ],
        articleSlug: "question-shaped-headings",
        takeaways: [
          "Seer found most AI citations are an exact-question match.",
          "'Pricing' becomes 'How much does it cost?'",
          "One question per heading, answer-first beneath.",
        ],
        check: [
          {
            question: "Why phrase headings as questions?",
            options: [
              "For decoration",
              "Engines match queries to question-shaped passages",
              "To add length",
              "Because SEO is dead",
            ],
            correct: 1,
            explanation:
              "Seer found most citations correspond to an exact-question match.",
          },
          {
            question: "Which is the better heading rewrite?",
            options: ["'Pricing'", "'How much does it cost?'", "'Info'", "'Click here'"],
            correct: 1,
            explanation: "Mirror the real question a buyer would ask.",
          },
        ],
      },
      {
        slug: "passage-length",
        title: "Right-Sizing Passages",
        intro:
          "Citable passages cluster around 120 to 180 words. This lesson sizes answers to be complete but liftable.",
        objectives: [
          "Target the 120 to 180 word range.",
          "Split passages that cover two questions.",
          "Build long pages from short passages.",
        ],
        articleSlug: "passage-length-for-ai-citation",
        takeaways: [
          "SE Ranking associates roughly 120 to 180 words with citations.",
          "Too thin under-answers; too long covers two questions.",
          "Depth across the page, concision within the passage.",
        ],
        check: [
          {
            question: "What is the citable passage range?",
            options: ["10 to 20 words", "About 120 to 180 words", "800+ words", "Exactly 500"],
            correct: 1,
            explanation: "SE Ranking points to roughly 120 to 180 words.",
          },
          {
            question: "A 450-word block answering four questions should be...",
            options: [
              "Left alone",
              "Split into four single-question passages",
              "Deleted",
              "Made even longer",
            ],
            correct: 1,
            explanation: "Split it so each answer is independently liftable.",
          },
        ],
      },
      {
        slug: "evidence-that-cites",
        title: "Evidence That Gets Cited",
        intro:
          "The Princeton GEO study proved evidence raises visibility. This lesson adds stats, quotes, and sources that get you cited.",
        objectives: [
          "Add inline statistics, quotations, and named sources.",
          "Attribute in the sentence, not a footnote.",
          "Avoid keyword stuffing.",
        ],
        articleSlug: "statistics-quotes-citations-aeo",
        takeaways: [
          "GEO study: quotations +41%, statistics +30%, cite sources +30%.",
          "Keyword stuffing lowered visibility by about 10%.",
          "Attribute inline so engines connect claim to source.",
        ],
        check: [
          {
            question: "Which tactic raised visibility most in the GEO study?",
            options: [
              "Keyword stuffing",
              "Adding quotations (+41%)",
              "Hiding sources",
              "Longer titles",
            ],
            correct: 1,
            explanation:
              "Quotations led at about +41%, with statistics and cited sources around +30%.",
          },
          {
            question: "Where should a citation go?",
            options: [
              "In a footnote only",
              "Inline, in the same sentence as the claim",
              "In the sitemap",
              "Nowhere",
            ],
            correct: 1,
            explanation:
              "Inline attribution lets engines connect the claim to its source.",
          },
        ],
      },
      {
        slug: "qa-library",
        title: "Turn a Page Into a Q&A Library",
        intro:
          "Decompose a page into standalone question-and-answer pairs, each independently citable. This lesson multiplies citation opportunities.",
        objectives: [
          "Decompose a topic into real questions.",
          "Write answer-first passages per question.",
          "Mark up the genuine Q&A as FAQ.",
        ],
        articleSlug: "turn-page-into-qa-library",
        takeaways: [
          "More discrete answers means more citation opportunities.",
          "Each heading a real question; each answer self-contained.",
          "FAQ schema makes the structure machine-readable.",
        ],
        check: [
          {
            question: "Why turn a page into a Q&A library?",
            options: [
              "To pad length",
              "More discrete, query-matched answers to be cited",
              "To remove content",
              "For ads",
            ],
            correct: 1,
            explanation: "Each Q&A pair is an independently citable unit.",
          },
          {
            question: "What makes a Q&A library legitimate?",
            options: [
              "Invented questions",
              "Real questions, each fully answered",
              "Duplicate headings",
              "Questions with no answers",
            ],
            correct: 1,
            explanation:
              "Use genuine questions answered completely — do not manufacture them.",
          },
        ],
      },
    ],
  },
  {
    slug: "aeo-strategy",
    title: "AEO Strategy",
    summary:
      "Make and defend the case for AEO — business case, ROI, cost of inaction, budget, team, and moat. A Practitioner-tier course that turns the Strategy cluster into a leadership playbook and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Make the executive case for AEO.",
      "Model AEO ROI and payback.",
      "Quantify the cost of being invisible.",
      "Budget and staff an AEO program.",
      "Build a defensible share-of-voice moat.",
    ],
    lessons: [
      {
        slug: "business-case",
        title: "The Business Case for AEO",
        intro:
          "AI answers absorb clicks and concentrate the rest on cited sources. This lesson builds the board-ready case.",
        objectives: [
          "Explain the click-to-citation shift.",
          "Cite the demand-side data.",
          "Frame the board narrative.",
        ],
        articleSlug: "business-case-for-aeo",
        takeaways: [
          "Seer found organic CTR fell about 61% on AI Overview queries.",
          "Cited sources capture the surviving, higher-intent clicks.",
          "The ask is modest; inaction cedes demand.",
        ],
        check: [
          {
            question: "What is the core shift behind the business case?",
            options: [
              "From citation to ranking",
              "From ranking to being cited in the answer",
              "From SEO to ads",
              "Nothing changed",
            ],
            correct: 1,
            explanation: "Visibility moves from ranked links to being the cited source.",
          },
          {
            question: "What did Seer find on AI Overview queries?",
            options: [
              "CTR rose 61%",
              "Organic CTR fell about 61%",
              "No change",
              "Clicks doubled",
            ],
            correct: 1,
            explanation: "Seer measured roughly a 61% drop in organic CTR.",
          },
        ],
      },
      {
        slug: "roi",
        title: "Modeling AEO ROI",
        intro:
          "AEO ROI comes from high-intent demand at modest incremental cost. This lesson models the value with the estimator.",
        objectives: [
          "Model cited-traffic value.",
          "Account for zero-click brand exposure.",
          "Frame payback to a CFO.",
        ],
        articleSlug: "roi-of-aeo",
        takeaways: [
          "Value = queries x SOV x CTR x conversion x value.",
          "Ahrefs found AI traffic converted about 23x better.",
          "Much value is zero-click exposure the click math misses.",
        ],
        check: [
          {
            question: "Why is AEO ROI strong despite fewer clicks?",
            options: [
              "Clicks do not matter",
              "Remaining clicks are far higher-intent (about 23x, Ahrefs)",
              "It is not strong",
              "Ads subsidize it",
            ],
            correct: 1,
            explanation: "AI traffic converted about 23x better in Ahrefs' analysis.",
          },
          {
            question: "What does the click math miss?",
            options: [
              "Nothing",
              "Zero-click brand exposure and compounding",
              "Server costs",
              "Font licensing",
            ],
            correct: 1,
            explanation:
              "Brand exposure, defensive value, and compounding are not in the click figure.",
          },
        ],
      },
      {
        slug: "cost-of-invisibility",
        title: "The Cost of Invisibility",
        intro:
          "Invisibility costs the category's highest-intent demand — captured by cited rivals and compounding. This lesson quantifies the downside.",
        objectives: [
          "Explain compounding competitor capture.",
          "See why the cost is hidden.",
          "Identify who pays most.",
        ],
        articleSlug: "cost-of-being-invisible-in-ai-search",
        takeaways: [
          "Citations compound — early leads widen.",
          "The cost is an absence, invisible in analytics.",
          "Research-led, high-consideration categories pay most.",
        ],
        check: [
          {
            question: "Why is the cost of invisibility easy to miss?",
            options: [
              "It is on the invoice",
              "It is an absence, invisible in analytics",
              "It is always tiny",
              "It is illegal to measure",
            ],
            correct: 1,
            explanation:
              "There is no invoice for citations you did not earn; analytics misses bot activity.",
          },
          {
            question: "Why does the cost compound?",
            options: [
              "It does not",
              "Citations beget authority beget more citations",
              "Random chance",
              "Ad budgets",
            ],
            correct: 1,
            explanation: "An early citation lead reinforces itself over time.",
          },
        ],
      },
      {
        slug: "budget",
        title: "Budgeting for AEO",
        intro:
          "Most AEO budget is reallocated SEO and content spend. This lesson sizes and phases the investment.",
        objectives: [
          "Identify the three incremental line items.",
          "Avoid the prompts-times-engines cost trap.",
          "Phase spend to prove return.",
        ],
        articleSlug: "how-to-budget-for-aeo",
        takeaways: [
          "Lines: measurement tool, content reshaping, off-site authority.",
          "Trackers price by prompts times engines — size deliberately.",
          "Prove on a focused set before scaling breadth.",
        ],
        check: [
          {
            question: "Most AEO budget is...",
            options: [
              "Net-new headcount",
              "Reallocated SEO and content spend",
              "Ad spend",
              "Hardware",
            ],
            correct: 1,
            explanation:
              "AEO shares 70 to 80% of SEO's foundation; most cost is redirected.",
          },
          {
            question: "What is the common budgeting trap?",
            options: [
              "Too few prompts",
              "Underestimating prompts-times-engines tool cost",
              "Using free tools",
              "Measuring at all",
            ],
            correct: 1,
            explanation:
              "Tracking everything across many engines blows past entry-tier caps.",
          },
        ],
      },
      {
        slug: "operating-model",
        title: "The AEO Operating Model",
        intro:
          "AEO is a cross-functional operating model with one owner for citation share. This lesson staffs and schedules it.",
        objectives: [
          "Name an accountable owner.",
          "Resource the four capabilities.",
          "Run the measure-fix-remeasure loop.",
        ],
        articleSlug: "build-an-aeo-team",
        takeaways: [
          "Four capabilities: content, technical, authority, analytics.",
          "One owner accountable for citation share.",
          "Run a continuous loop, not a project.",
        ],
        check: [
          {
            question: "Who should own AEO?",
            options: [
              "No one",
              "One accountable owner for citation share",
              "Every team equally",
              "An external vendor only",
            ],
            correct: 1,
            explanation: "A single owner prevents diffusion across functions.",
          },
          {
            question: "The four AEO capabilities are...",
            options: [
              "Sales, legal, HR, ops",
              "Content, technical, authority, analytics",
              "Design only",
              "Ads, PR, email, SMS",
            ],
            correct: 1,
            explanation: "They map to the Canon's pillars.",
          },
        ],
      },
      {
        slug: "competitive-moat",
        title: "AEO as a Competitive Moat",
        intro:
          "Citation share compounds and resists copying — a defensible moat. This lesson builds and defends it.",
        objectives: [
          "Explain why share of voice is a moat.",
          "Invest in copy-resistant originality and authority.",
          "Defend the lead with measurement.",
        ],
        articleSlug: "aeo-competitive-moat",
        takeaways: [
          "Tactics equalize fast; originality and authority do not.",
          "Evertune found no domain over about 5% — share is won question by question.",
          "Measure per engine to catch erosion.",
        ],
        check: [
          {
            question: "Why is citation share a moat?",
            options: [
              "It is a single rank",
              "It compounds and resists copying",
              "It cannot be measured",
              "It is free",
            ],
            correct: 1,
            explanation: "It behaves like brand equity — slow to build, slow to erode.",
          },
          {
            question: "What can competitors not copy quickly?",
            options: [
              "Answer-first formatting",
              "Your originality and earned authority",
              "Schema markup",
              "robots.txt",
            ],
            correct: 1,
            explanation: "Tactics equalize fast; reputation and original data do not.",
          },
        ],
      },
    ],
  },
  {
    slug: "aeo-measurement",
    title: "AEO Measurement",
    summary:
      "Measure what matters in AEO — share of voice, per-engine tracking, prompt sets, competitors, and traffic impact. A Practitioner-tier course that turns the Measurement cluster into a running program and earns a stackable Tier 2 badge.",
    tier: "Practitioner",
    certificate: "Tier 2 Certificate",
    level: "Intermediate",
    estimatedHours: 3,
    authorSlug: "jordan-vega",
    published: "2026-02-23",
    updated: "2026-06-09",
    outcomes: [
      "Define and calculate AI share of voice.",
      "Measure per engine, not a blended average.",
      "Run the DIY measurement method.",
      "Build a durable tracking prompt set.",
      "Benchmark competitors and quantify AI traffic.",
    ],
    lessons: [
      {
        slug: "share-of-voice",
        title: "Share of Voice in AI Search",
        intro:
          "Citation share of voice is the core AEO metric. This lesson defines and calculates it.",
        objectives: [
          "Define brand versus competitive share of voice.",
          "Calculate share of voice on a prompt set.",
          "Track the trend, not snapshots.",
        ],
        articleSlug: "share-of-voice-ai-search",
        takeaways: [
          "Share of voice is the share of tracked questions where you are cited.",
          "Compute it per engine; watch the trend.",
          "Mentions and citations are different shares of voice.",
        ],
        check: [
          {
            question: "What is AI share of voice?",
            options: [
              "Your ad budget",
              "Share of tracked questions where you are cited",
              "Your domain rating",
              "Your page count",
            ],
            correct: 1,
            explanation:
              "It is how often you appear versus competitors across tracked questions.",
          },
          {
            question: "How do you read share of voice honestly?",
            options: [
              "From one reading",
              "As a trend across a fixed prompt set",
              "By gut feel",
              "By revenue alone",
            ],
            correct: 1,
            explanation:
              "Answers are non-deterministic; trust the trend, not a snapshot.",
          },
        ],
      },
      {
        slug: "per-engine",
        title: "Measure Per Engine, Not a Blend",
        intro:
          "Engines overlap only about 11%, so a blended average hides where you stand. This lesson measures per engine.",
        objectives: [
          "Explain why blending misleads.",
          "Report share of voice per engine.",
          "Use a weighted index only as a headline.",
        ],
        articleSlug: "per-engine-vs-blended-measurement",
        takeaways: [
          "Profound found about 11% cross-engine citation overlap.",
          "A blend can hide a one-engine collapse.",
          "Decide from the per-engine view.",
        ],
        check: [
          {
            question: "Why measure per engine?",
            options: [
              "Engines cite the same sources",
              "They overlap only about 11% — a blend hides reality",
              "To slow down",
              "There is no reason",
            ],
            correct: 1,
            explanation:
              "With about 11% overlap, a blended number matches no real surface.",
          },
          {
            question: "When is a blended number acceptable?",
            options: [
              "For all decisions",
              "As a headline over the per-engine breakdown",
              "Never show engines",
              "Always optimize against it",
            ],
            correct: 1,
            explanation: "Use it as a headline; decide from the breakdown.",
          },
        ],
      },
      {
        slug: "diy-method",
        title: "The DIY Measurement Method",
        intro:
          "You can measure AI visibility manually for free. This lesson runs the prompt-set-across-engines method.",
        objectives: [
          "Run a fixed prompt set across engines.",
          "Log mentions, citations, and competitors.",
          "Track citation share over time.",
        ],
        articleSlug: "measure-aeo",
        takeaways: [
          "Run real customer questions on a schedule.",
          "Log who is mentioned, who is cited, and which rivals appear.",
          "Free manually; automate when you scale.",
        ],
        check: [
          {
            question: "What is the DIY method's backbone?",
            options: [
              "Guessing",
              "A fixed prompt set run across engines on a cadence",
              "A one-time check",
              "Ad reports",
            ],
            correct: 1,
            explanation: "A stable prompt set, sampled regularly, reveals the trend.",
          },
          {
            question: "What do you log per answer?",
            options: [
              "Only your rank",
              "Mentions, citations, and competitors",
              "Font size",
              "Page weight",
            ],
            correct: 1,
            explanation: "Capture brand mention, site citation, and rival presence.",
          },
        ],
      },
      {
        slug: "prompt-set",
        title: "Build Your Tracking Prompt Set",
        intro:
          "Every measurement is only as good as the prompt set. This lesson builds 15 to 30 high-intent questions and freezes them.",
        objectives: [
          "Source real, high-intent questions.",
          "Prioritize decision-stage queries.",
          "Freeze the set for comparability.",
        ],
        articleSlug: "build-an-ai-prompt-set",
        takeaways: [
          "Use 15 to 30 real, conversational questions.",
          "Weight toward decision-stage value.",
          "Freeze it; evolve deliberately.",
        ],
        check: [
          {
            question: "How big should a starter prompt set be?",
            options: [
              "1 to 2 questions",
              "15 to 30 high-intent questions",
              "500+ questions",
              "It does not matter",
            ],
            correct: 1,
            explanation: "Enough to cover what matters without runaway cost.",
          },
          {
            question: "Why freeze the prompt set?",
            options: [
              "Laziness",
              "Comparability over time",
              "To save money only",
              "There is no reason",
            ],
            correct: 1,
            explanation:
              "Swapping questions destroys the comparability that makes trends meaningful.",
          },
        ],
      },
      {
        slug: "competitor-tracking",
        title: "Track Competitor Citations",
        intro:
          "Competitive share of voice shows where rivals are cited and you are not. This lesson benchmarks competitors over time.",
        objectives: [
          "Add competitors to your prompt-set tracking.",
          "Compute competitive share of voice.",
          "Turn gaps into a content and authority plan.",
        ],
        articleSlug: "track-competitor-ai-citations",
        takeaways: [
          "Track who else gets cited on your questions.",
          "Competitive share of voice is your slice of all brand mentions.",
          "Gaps become the work queue.",
        ],
        check: [
          {
            question: "What does competitor tracking reveal?",
            options: [
              "Nothing useful",
              "Where rivals are cited and you are not",
              "Their ad spend",
              "Their payroll",
            ],
            correct: 1,
            explanation: "It surfaces the questions to prioritize.",
          },
          {
            question: "Competitive share of voice is...",
            options: [
              "Your mentions divided by total prompts",
              "Your mentions divided by all brands' mentions",
              "Random",
              "Backlinks",
            ],
            correct: 1,
            explanation: "It is your slice of all brand mentions in the space.",
          },
        ],
      },
      {
        slug: "traffic-impact",
        title: "Measuring AI Traffic and Impact",
        intro:
          "AI search sends less but higher-quality traffic. This lesson measures referral traffic and impact beyond citations.",
        objectives: [
          "Track AI referral traffic.",
          "Interpret quality over volume.",
          "Connect citations to business impact.",
        ],
        articleSlug: "does-ai-search-send-traffic",
        takeaways: [
          "Fewer clicks, but far higher intent (Ahrefs about 23x).",
          "Watch referrals from chatgpt.com, perplexity.ai, and others.",
          "Pair citation share with downstream conversion.",
        ],
        check: [
          {
            question: "How does AI traffic differ from classic organic?",
            options: [
              "More volume, low intent",
              "Less volume, much higher intent",
              "Identical",
              "No conversions ever",
            ],
            correct: 1,
            explanation: "Ahrefs found AI visitors converted about 23x better.",
          },
          {
            question: "What should you pair with citation share?",
            options: [
              "Nothing",
              "Downstream conversion and impact",
              "Font metrics",
              "Server temperature",
            ],
            correct: 1,
            explanation:
              "Tie citations to referral traffic and conversions for the full picture.",
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
