import Link from "next/link";
import { Badge } from "@/components/ui/tag";
import { CourseThumbnail } from "@/components/library/thumbnail";
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
 * Summary card for a course. Leads with a generated "lesson path" thumbnail
 * (coloured by level), then the level, title, summary, and lesson/credential
 * meta. Shared by /learn and /courses for one consistent treatment.
 */
export function CourseCard({
  course,
  index = 0,
  className,
}: {
  course: Course;
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
      <CourseThumbnail slug={course.slug} level={course.level} lessons={count} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <Badge className="capitalize" style={{ color, borderColor: color }}>
            {course.level}
          </Badge>
          <span className="text-muted font-mono text-[11px]">
            Course {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-[22px] font-medium">{course.title}</h3>
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
