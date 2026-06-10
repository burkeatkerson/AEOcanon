import Link from "next/link";
import { CourseCover } from "@/components/library/thumbnail";
import type { Course } from "@/lib/content";
import { cn } from "@/lib/utils";

const LEVEL_COLOR: Record<string, string> = {
  beginner: "var(--c3)",
  intermediate: "var(--c4)",
  advanced: "var(--c5)",
  applied: "var(--c6)",
  practitioner: "var(--c5)",
};

/**
 * Summary card for a course. A typographic cover (the course title on a level-
 * tinted ground) leads; the body carries the summary and lesson/credential meta.
 * Shared by /learn and /courses.
 */
export function CourseCard({
  course,
  className,
}: {
  course: Course;
  /** Accepted for backwards-compatibility; no longer used. */
  index?: number;
  className?: string;
}) {
  const color = LEVEL_COLOR[(course.level ?? "").toLowerCase()] ?? "var(--accent)";
  const count = course.lessons.length;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group border-line hover:border-accent bg-paper text-ink relative flex flex-col overflow-hidden rounded-2xl border no-underline transition-transform hover:-translate-y-[2px]",
        className,
      )}
    >
      <CourseCover slug={course.slug} level={course.level} title={course.title} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-ink-2 text-[14px] leading-relaxed">{course.summary}</p>
        <div className="text-muted mt-auto flex flex-wrap gap-4 pt-1 font-mono text-[11px]">
          <span>
            {count} {count === 1 ? "lesson" : "lessons"}
          </span>
          {course.estimatedHours ? <span>~{course.estimatedHours} hrs</span> : null}
          <span style={{ color }}>✦ Earns a credential</span>
        </div>
      </div>
    </Link>
  );
}
