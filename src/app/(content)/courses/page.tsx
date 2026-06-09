import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/tag";
import { getAllCourses } from "@/lib/courses";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description:
    "Guided courses that turn the AEO library into an ordered curriculum — with objectives, knowledge checks, and a certificate. Start with the Foundation tier.",
  path: "/courses",
});

const LEVEL_COLORS = ["var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"];

export default function CoursesIndexPage() {
  const courses = getAllCourses();

  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <Kicker>Guided courses</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          Courses
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          Each course sequences lessons in the order you should learn them — every
          lesson pairs clear objectives and a knowledge check with the canonical
          article it reuses, so you can learn in order without losing the source.
          Finish a tier to earn its certificate.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {courses.map((course, i) => {
          const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
          return (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-3 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
              style={{ boxShadow: `inset 0 4px 0 ${color}` }}
            >
              <div className="flex items-center justify-between">
                <Badge className="capitalize" style={{ color, borderColor: color }}>
                  {course.level}
                </Badge>
                <span className="text-muted font-mono text-[11px]">
                  {course.lessons.length} lessons
                  {course.estimatedHours ? ` · ~${course.estimatedHours}h` : null}
                </span>
              </div>
              <h2 className="text-[22px] font-medium">{course.title}</h2>
              <p className="text-ink-2 text-[14px] leading-relaxed">
                {course.summary}
              </p>
              <span className="text-muted mt-auto font-mono text-[11px]">
                {course.tier} tier · ✦ {course.certificate}
              </span>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
