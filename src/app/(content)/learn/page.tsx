import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { ArticleCard } from "@/components/library/cards/article-card";
import { CourseCard } from "@/components/library/cards/course-card";
import { TopicGrid } from "@/components/library/topic-grid";
import { getAllArticles, getAllCourses, getUsedTopics } from "@/lib/content";
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

/** Section heading with an optional "see all" link or count on the right. */
function SectionHead({
  title,
  href,
  cta,
  count,
}: {
  title: string;
  href?: string;
  cta?: string;
  count?: string;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="text-[26px] font-medium tracking-tight">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-accent inline-flex shrink-0 items-center gap-1 font-mono text-[12px]"
        >
          {cta} <ArrowRight className="size-3.5" />
        </Link>
      ) : count ? (
        <span className="text-accent shrink-0 font-mono text-[11px] tracking-[0.1em] uppercase">
          {count}
        </span>
      ) : null}
    </div>
  );
}

export default function LearnPage() {
  const courses = getAllCourses();
  const topics = getUsedTopics();
  const latest = getAllArticles().slice(0, 6);
  const articleCount = getAllArticles().length;

  return (
    <div className="py-10 pb-20">
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
          Structured courses and a growing free archive — built the way the best
          technical educators teach: read it, then actually do it. Learn how AI
          decides who to name, and start becoming the business it recommends.
          The fundamentals are free.
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
          <Button href="/news" variant="ghost" size="lg">
            AEO news &amp; updates →
          </Button>
        </div>
      </header>

      {/* Courses */}
      <section className="mt-14">
        <SectionHead
          title="Courses, beginner to applied"
          href="/courses"
          cta="All courses"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course, i) => (
            <CourseCard key={course.slug} course={course} index={i} />
          ))}
        </div>
      </section>

      {/* Browse by topic */}
      <section className="mt-14">
        <SectionHead title="Browse by topic" href="/topics" cta="All topics" />
        <p className="text-ink-2 mb-6 max-w-[60ch] text-[15px] leading-relaxed">
          A topic gathers every article on a subject; courses sequence those
          same articles into a guided order. Browse freely or follow the path.
        </p>
        <TopicGrid topics={topics} />
      </section>

      {/* Latest articles */}
      <section className="mt-14">
        <SectionHead
          title="Latest articles"
          href="/articles"
          cta={`All ${articleCount} articles`}
        />
        <div className="grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mt-14">
        <SectionHead title="Interactive tools" href="/tools" cta="All tools" />
        <p className="text-ink-2 mb-6 max-w-[60ch] text-[15px] leading-relaxed">
          Every tool lives inside a lesson — you don&rsquo;t read about
          auditing, you audit. Each is also runnable standalone.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </section>

      {/* Certifications */}
      <section className="mt-14">
        <SectionHead title="Certifications" count="Real credentials" />
        <p className="text-ink-2 mb-6 max-w-[62ch] text-[15px] leading-relaxed">
          Each course ends in a certification: a shareable badge, a public
          profile, and a downloadable certificate. Finish the course to earn it.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </section>
    </div>
  );
}
