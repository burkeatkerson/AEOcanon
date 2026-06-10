import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { CourseCard } from "@/components/library/cards/course-card";
import { getAllCourses } from "@/lib/courses";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description:
    "Guided courses that turn the AEO library into an ordered curriculum — with objectives, knowledge checks, and a certificate. Start with the Foundation tier.",
  path: "/courses",
});

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
        {courses.map((course, i) => (
          <CourseCard key={course.slug} course={course} index={i} />
        ))}
      </div>
    </Container>
  );
}
