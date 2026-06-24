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
  specialist: "var(--c6)",
};

/**
 * Summary card for a course. A typographic cover (the course title on a level-
 * tinted ground) leads; the body carries the summary and lesson/credential meta.
 * Shared by /learn and /courses.
 */
export function CourseCard({
  course,
  className,
  startHere = false,
}: {
  course: Course;
  /** Accepted for backwards-compatibility; no longer used. */
  index?: number;
  className?: string;
  /** Renders a "Start here" ribbon — used for the first course in the path. */
  startHere?: boolean;
}) {
  const color = LEVEL_COLOR[(course.level ?? "").toLowerCase()] ?? "var(--accent)";
  const count = course.lessons.length;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group border-line hover:border-accent bg-paper text-ink relative flex flex-col overflow-hidden rounded-2xl border no-underline transition-transform hover:-translate-y-[2px]",
        startHere && "border-accent",
        className,
      )}
    >
      {startHere ? (
        <span className="bg-accent absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-white uppercase">
          Start here
        </span>
      ) : null}
      <CourseCover slug={course.slug} level={course.level} title={course.title} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px]">
          <span
            className="rounded-full border px-2 py-0.5 tracking-[0.04em]"
            style={{ color, borderColor: color }}
          >
            {course.tier}
          </span>
          <span className="text-muted capitalize">{course.level}</span>
        </div>
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
