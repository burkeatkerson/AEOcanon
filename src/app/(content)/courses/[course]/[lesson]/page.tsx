import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { KnowledgeCheck } from "@/components/courses/knowledge-check";
import { LessonNav } from "@/components/courses/lesson-nav";
import { Checklist } from "@/components/mdx/interactive";
import { getAllCourses, getLesson } from "@/lib/courses";
import { getAuthor, getArticle, getPillar } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  graph,
  lessonResourceNode,
  personNode,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllCourses().flatMap((course) =>
    course.lessons.map((lesson) => ({
      course: course.slug,
      lesson: lesson.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) return {};
  const { course, lesson, index } = found;
  return buildMetadata({
    title: `${lesson.title} — ${course.title} (Lesson ${index + 1})`,
    description: lesson.intro,
    path: `/courses/${course.slug}/${lesson.slug}`,
    type: "article",
    publishedTime: course.published,
    modifiedTime: course.updated,
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) notFound();
  const { course, lesson, index } = found;

  const author = getAuthor(course.authorSlug);
  const article = getArticle(lesson.articleSlug) ?? getPillar(lesson.articleSlug);
  const lessonPath = `/courses/${course.slug}/${lesson.slug}`;

  const jsonLd = graph([
    lessonResourceNode({
      title: lesson.title,
      description: lesson.intro,
      path: lessonPath,
      datePublished: course.published,
      dateModified: course.updated,
      authorUrl: author?.url,
      courseName: course.title,
      coursePath: `/courses/${course.slug}`,
    }),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Courses", path: "/courses" },
      { name: course.title, path: `/courses/${course.slug}` },
      { name: lesson.title, path: lessonPath },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <article className="mx-auto max-w-[760px]">
        <nav
          aria-label="Breadcrumb"
          className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
        >
          <Link href="/courses" className="hover:text-accent">
            Courses
          </Link>
          <span className="text-faint">/</span>
          <Link href={`/courses/${course.slug}`} className="hover:text-accent">
            {course.title}
          </Link>
          <span className="text-faint">/</span>
          <span className="text-ink">Lesson {index + 1}</span>
        </nav>

        <header className="mt-4">
          <p className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            Lesson {index + 1} of {course.lessons.length}
          </p>
          <h1 className="mt-2 text-[clamp(28px,4vw,42px)] leading-[1.08] font-medium tracking-[-0.02em]">
            {lesson.title}
          </h1>
          <p className="text-ink-2 mt-4 font-serif text-[19px] leading-normal">
            {lesson.intro}
          </p>
        </header>

        {/* objectives */}
        <section className="border-line bg-panel my-8 rounded-2xl border p-6 font-sans">
          <h2 className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
            Learning objectives
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {lesson.objectives.map((o) => (
              <li
                key={o}
                className="text-ink-2 flex gap-2.5 text-[14.5px] leading-snug"
              >
                <span className="text-accent">▸</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* lesson — reuse the canonical article */}
        <section aria-labelledby="lesson-heading">
          <h2
            id="lesson-heading"
            className="text-[24px] font-medium tracking-tight"
          >
            The lesson
          </h2>
          {article ? (
            <Link
              href={article.url}
              className="border-line hover:border-accent bg-paper mt-4 flex flex-col gap-2 rounded-2xl border p-6 no-underline"
            >
              <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
                Read the full lesson →
              </span>
              <span className="text-ink text-[18px] font-medium">
                {article.title}
              </span>
              <span className="text-ink-2 text-[14px] leading-relaxed">
                {article.summary}
              </span>
              <span className="text-muted mt-1 font-mono text-[11px]">
                {article.metadata.readingTime} min read
              </span>
            </Link>
          ) : null}
        </section>

        {/* key takeaways */}
        <section className="border-accent bg-accent-soft my-8 rounded-xl border border-dashed p-5 font-sans">
          <p className="text-accent-2 mb-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
            Key takeaways
          </p>
          <ul className="flex flex-col gap-2">
            {lesson.takeaways.map((t) => (
              <li
                key={t}
                className="text-ink-2 flex gap-2.5 text-[14.5px] leading-snug"
              >
                <span className="text-accent">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* optional audit checklist (e.g. Foundations L5) */}
        {lesson.audit ? (
          <section aria-label="Audit checklist">
            <Checklist title={lesson.audit.title} items={lesson.audit.items} />
          </section>
        ) : null}

        {/* knowledge check */}
        <section aria-labelledby="check-heading">
          <h2 id="check-heading" className="sr-only">
            Knowledge check
          </h2>
          <KnowledgeCheck questions={lesson.check} />
        </section>

        <LessonNav course={course} index={index} />
      </article>
    </Container>
  );
}
