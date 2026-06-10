import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { ArticleFilter } from "@/components/library/article-filter";
import { ArticleCard } from "@/components/library/cards/article-card";
import { CourseCard } from "@/components/library/cards/course-card";
import { TopicGrid } from "@/components/library/topic-grid";
import { TabGroup, type TabDef } from "@/components/library/tab-group";
import { getAllArticles, getAllCourses, getUsedTopics } from "@/lib/content";
import { TOPIC_SLUGS } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AEO school — courses, articles & tools",
  description:
    "Learn to get found, cited, and recommended by AI search. Structured learning paths, a growing article archive, hands-on tools, and certifications.",
  path: "/learn",
});

const LEVEL_COLORS = ["var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"];

const SCHOOL_TOOLS = [
  {
    icn: "◎",
    t: "AI Visibility Audit",
    d: "How the five major engines describe and recommend you today, scored 0–100.",
    href: "/audit",
  },
  {
    icn: "⌗",
    t: "Schema Generator",
    d: "Copy-paste LocalBusiness & Service structured data tuned for answer engines.",
    href: "/tools",
  },
  {
    icn: "▤",
    t: "Content Scorer",
    d: "Paste a page; get an extractability score and sentence-level rewrite hints.",
    href: "/tools",
  },
  {
    icn: "◫",
    t: "Competitive Analyzer",
    d: "See which competitors the engines name in your category — and why.",
    href: "/tools",
  },
];

function CoursesPane() {
  const courses = getAllCourses();
  const latest = getAllArticles().slice(0, 3);

  return (
    <div>
      <header className="max-w-3xl">
        <Kicker>From zero to AEO expert</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.6vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          Learn to get{" "}
          <em className="text-accent [font-style:italic]">
            found, cited, and recommended
          </em>{" "}
          by AI search.
        </h1>
        <p className="text-ink-2 mt-4 text-[19px] leading-relaxed">
          Structured paths and a growing free archive — built the way the best
          technical educators teach: read it, then actually do it. Start with
          the fundamentals, free.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {courses[0] ? (
            <Button href={`/courses/${courses[0].slug}`} size="lg">
              Start {courses[0].title} — Free
            </Button>
          ) : null}
          <Button href="/audit" variant="ghost" size="lg">
            Not sure where to start? Run the analyzer
          </Button>
        </div>
      </header>

      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[26px] font-medium tracking-tight">
            Courses, beginner to applied
          </h2>
          <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course, i) => (
            <CourseCard key={course.slug} course={course} index={i} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[26px] font-medium tracking-tight">
            Latest articles
          </h2>
          <Link href="/topics" className="text-accent font-mono text-[12px]">
            Browse by topic →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TopicsPane() {
  const topics = getUsedTopics();
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-[26px] font-medium tracking-tight">
          Browse by topic
        </h2>
        <Link href="/topics" className="text-accent font-mono text-[12px]">
          All topics →
        </Link>
      </div>
      <p className="text-ink-2 mb-8 max-w-[60ch] text-[15px] leading-relaxed">
        A topic gathers every article on a subject. The same articles get
        sequenced into courses — so you can browse freely or follow a guided
        order.
      </p>
      <TopicGrid topics={topics} />
    </div>
  );
}

function ArticlesPane() {
  const articles = getAllArticles();
  const usedTopics = TOPIC_SLUGS.filter((topic) =>
    articles.some((a) => a.topics.some((t) => t === topic)),
  );
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-[26px] font-medium tracking-tight">
          The article archive
        </h2>
        <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
          {articles.length} free{" "}
          {articles.length === 1 ? "article" : "articles"}
        </span>
      </div>
      <ArticleFilter articles={articles} topics={[...usedTopics]} />
    </div>
  );
}

function ToolsPane() {
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-[26px] font-medium tracking-tight">
          Interactive tools
        </h2>
        <Link href="/tools" className="text-accent font-mono text-[12px]">
          All tools →
        </Link>
      </div>
      <p className="text-ink-2 mb-8 max-w-[60ch] text-[15px] leading-relaxed">
        Every tool lives inside a lesson — you don&rsquo;t read about auditing,
        you audit. Each is also runnable standalone.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SCHOOL_TOOLS.map((tool) => (
          <Link
            key={tool.t}
            href={tool.href}
            className="border-line hover:border-accent bg-panel flex flex-col gap-3 rounded-2xl border p-6 transition-colors"
          >
            <span className="text-accent text-[22px]">{tool.icn}</span>
            <h3 className="text-[16px] font-medium">{tool.t}</h3>
            <p className="text-muted text-[13px] leading-relaxed">{tool.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CertsPane() {
  const courses = getAllCourses();
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-[26px] font-medium tracking-tight">
          Certifications
        </h2>
        <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
          Real credentials
        </span>
      </div>
      <p className="text-ink-2 mb-8 max-w-[62ch] text-[15px] leading-relaxed">
        Each course ends in a certification: a shareable badge, a public
        profile, and a downloadable certificate. Finish the course to earn it.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => {
          const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
          return (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="border-line hover:border-accent bg-paper flex items-center gap-4 rounded-2xl border p-5"
            >
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full text-[18px] text-white"
                style={{ background: color }}
              >
                ✦
              </span>
              <span>
                <span className="block text-[15px] font-medium">
                  {course.certificate}
                </span>
                <span className="text-muted block font-mono text-[10.5px]">
                  {course.title}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const articleCount = getAllArticles().length;
  const courseCount = getAllCourses().length;
  const topicCount = getUsedTopics().length;

  const tabs: TabDef[] = [
    { id: "courses", label: "Courses", content: <CoursesPane /> },
    {
      id: "topics",
      label: "Topics",
      count: topicCount,
      content: <TopicsPane />,
    },
    {
      id: "articles",
      label: "Articles",
      count: articleCount,
      content: <ArticlesPane />,
    },
    {
      id: "tools",
      label: "Tools",
      count: SCHOOL_TOOLS.length,
      content: <ToolsPane />,
    },
    {
      id: "certs",
      label: "Certifications",
      count: courseCount,
      content: <CertsPane />,
    },
  ];

  return (
    <Container className="py-10 pb-20">
      <TabGroup tabs={tabs} />
    </Container>
  );
}
