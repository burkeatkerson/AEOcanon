import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllCourses, getCourse } from "@/lib/courses";
import { getAuthor, getArticle } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, courseNode, graph, personNode } from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ course: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.title} — ${course.tier} course`,
    description: course.summary,
    path: `/courses/${course.slug}`,
    type: "article",
    publishedTime: course.published,
    modifiedTime: course.updated,
  });
}

export default async function CourseSyllabusPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const author = getAuthor(course.authorSlug);
  const coursePath = `/courses/${course.slug}`;
  const first = course.lessons[0]!;

  const jsonLd = graph([
    courseNode({
      title: course.title,
      description: course.summary,
      path: coursePath,
      datePublished: course.published,
      dateModified: course.updated,
      authorUrl: author?.url,
      lessons: course.lessons.map((l) => ({
        title: l.title,
        path: `${coursePath}/${l.slug}`,
      })),
    }),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Courses", path: "/courses" },
      { name: course.title, path: coursePath },
    ]),
  ]);

  return (
    <Container className="py-12 pb-20">
      <JsonLd graph={jsonLd} />

      <nav
        aria-label="Breadcrumb"
        className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
      >
        <Link href="/courses" className="hover:text-accent">
          Courses
        </Link>
        <span className="text-faint">/</span>
        <span className="text-ink">{course.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="capitalize">{course.level}</Badge>
          <span className="text-muted font-mono text-[11px]">
            {course.lessons.length} lessons
            {course.estimatedHours ? ` · ~${course.estimatedHours}h` : null} ·{" "}
            {course.tier} tier
          </span>
        </div>
        <h1 className="mt-4 text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
          {course.title}
        </h1>
        <p className="text-ink-2 mt-4 font-serif text-[20px] leading-normal">
          {course.summary}
        </p>
        <div className="border-line text-muted mt-6 flex flex-wrap items-center gap-4 border-t pt-5 font-mono text-[11.5px]">
          {author ? (
            <span>
              By{" "}
              <Link href={author.url} className="text-ink hover:text-accent">
                <b>{author.name}</b>
              </Link>
              {author.role ? `, ${author.role}` : null}
            </span>
          ) : null}
        </div>
        <div className="mt-6">
          <Button href={`${coursePath}/${first.slug}`} size="lg">
            Start the course — Lesson 1 →
          </Button>
        </div>
      </header>

      {/* outcomes */}
      <section className="mt-12 max-w-3xl" aria-labelledby="outcomes">
        <h2 id="outcomes" className="text-[26px] font-medium tracking-tight">
          What you'll learn
        </h2>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {course.outcomes.map((o) => (
            <li key={o} className="text-ink-2 flex gap-2.5 text-[14.5px] leading-snug">
              <span className="text-accent">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* syllabus */}
      <section className="mt-12" aria-labelledby="syllabus">
        <h2 id="syllabus" className="text-[26px] font-medium tracking-tight">
          Syllabus
        </h2>
        <ol className="mt-6 flex flex-col gap-3">
          {course.lessons.map((lesson, i) => {
            const article = getArticle(lesson.articleSlug);
            return (
              <li key={lesson.slug}>
                <Link
                  href={`${coursePath}/${lesson.slug}`}
                  className="border-line hover:border-accent bg-paper flex gap-4 rounded-2xl border p-5 no-underline transition-colors"
                >
                  <span
                    className="bg-accent grid size-8 shrink-0 place-items-center rounded-full font-serif text-sm text-white"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink block font-medium">
                      {lesson.title}
                    </span>
                    <span className="text-muted mt-1 block text-[13.5px] leading-snug">
                      {lesson.intro}
                    </span>
                    {article ? (
                      <span className="text-faint mt-1.5 block font-mono text-[10.5px]">
                        Reuses: {article.title}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* certificate */}
      <section
        id="certificate"
        className="border-accent bg-accent-soft mt-12 scroll-mt-24 rounded-2xl border p-7"
      >
        <p className="text-accent-2 font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {course.tier} tier · {course.certificate}
        </p>
        <h2 className="text-ink mt-2 text-[22px] font-medium">
          Finish all {course.lessons.length} lessons to earn your{" "}
          {course.certificate}.
        </h2>
        <p className="text-ink-2 mt-2 max-w-[60ch] text-[14.5px] leading-relaxed">
          Complete every lesson and pass the knowledge checks to claim a shareable
          Tier 1 credential — proof you've mastered the foundations of getting
          cited by AI.
        </p>
        <div className="mt-4">
          <Button href={`${coursePath}/${first.slug}`}>Begin Lesson 1 →</Button>
        </div>
      </section>
    </Container>
  );
}
