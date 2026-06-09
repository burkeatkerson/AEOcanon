import Link from "next/link";
import type { Course } from "@/lib/courses";

/**
 * Per-lesson navigation: a positional progress bar ("Lesson N of M") plus
 * previous/next links. Progress is positional (no completion tracking, since we
 * avoid localStorage); the last lesson's "next" returns to the syllabus to claim
 * the certificate.
 */
export function LessonNav({
  course,
  index,
}: {
  course: Course;
  index: number;
}) {
  const total = course.lessons.length;
  const prev = index > 0 ? course.lessons[index - 1] : null;
  const next = index < total - 1 ? course.lessons[index + 1] : null;
  const pct = Math.round(((index + 1) / total) * 100);

  return (
    <nav aria-label="Lesson navigation" className="not-prose my-8 font-sans">
      <div className="text-muted flex items-center justify-between font-mono text-[11px]">
        <span>
          Lesson {index + 1} of {total}
        </span>
        <Link href={`/courses/${course.slug}`} className="hover:text-accent">
          {course.title} syllabus
        </Link>
      </div>
      <div className="bg-bg-2 mt-2 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/courses/${course.slug}/${prev.slug}`}
            className="border-line hover:border-accent rounded-xl border p-4 no-underline"
          >
            <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
              ← Previous
            </span>
            <span className="text-ink mt-1 block text-[14.5px] font-medium">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/courses/${course.slug}/${next.slug}`}
            className="border-line hover:border-accent rounded-xl border p-4 text-right no-underline"
          >
            <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
              Next →
            </span>
            <span className="text-ink mt-1 block text-[14.5px] font-medium">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={`/courses/${course.slug}#certificate`}
            className="border-accent bg-accent-soft rounded-xl border p-4 text-right no-underline"
          >
            <span className="text-accent-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">
              Course complete →
            </span>
            <span className="text-ink mt-1 block text-[14.5px] font-medium">
              Claim your {course.certificate}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
