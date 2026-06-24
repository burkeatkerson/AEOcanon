import type { Metadata } from "next";
import { Kicker } from "@/components/ui/eyebrow";
import { CourseCard } from "@/components/library/cards/course-card";
import { getCoursesByTier, getAllCourses } from "@/lib/courses";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description:
    "Guided courses that turn the AEO library into an ordered curriculum — with objectives, knowledge checks, and a certificate. Start with the Foundation tier.",
  path: "/courses",
});

/** One-line framing for each tier, shown above its courses on the index. */
const TIER_BLURB: Record<string, string> = {
  Foundation:
    "Start here. What AEO is, how AI answer engines actually work, and the Canon framework — the two courses everything else builds on.",
  Practitioner:
    "Go deep on the craft — writing, technical, authority, tooling, strategy, and measurement. Take these in any order once the Foundation is done.",
  Specialist:
    "Apply AEO to your context — small business, content operations, local and multi-location, and ecommerce.",
};

export default function CoursesIndexPage() {
  const tiers = getCoursesByTier();
  const total = getAllCourses().length;
  // The single recommended starting point: first course of the first tier.
  const startSlug = tiers[0]?.courses[0]?.slug;

  return (
    <div className="py-14">
      <header className="max-w-3xl">
        <Kicker>Guided courses</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          The AEO curriculum
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          {total} guided courses across three tiers, sequenced in the order you
          should learn them. Every lesson pairs clear objectives and a knowledge
          check with the canonical article it reuses, so you learn in order
          without losing the source. Finish a course to earn its certificate —
          and they stack toward full AEO mastery.
        </p>
        {/* Tier path, at a glance */}
        <ol className="text-muted mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px]">
          {tiers.map((group, i) => (
            <li key={group.tier} className="flex items-center gap-2">
              {i > 0 ? <span className="text-faint">→</span> : null}
              <span className="text-ink">{group.tier}</span>
              <span className="text-faint">({group.courses.length})</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="mt-12 flex flex-col gap-14">
        {tiers.map((group) => (
          <section key={group.tier} aria-labelledby={`tier-${group.tier}`}>
            <div className="max-w-3xl">
              <h2
                id={`tier-${group.tier}`}
                className="text-[26px] font-medium tracking-tight"
              >
                {group.tier}
                <span className="text-muted ml-2 font-mono text-[13px] font-normal">
                  {group.courses.length}{" "}
                  {group.courses.length === 1 ? "course" : "courses"}
                </span>
              </h2>
              {TIER_BLURB[group.tier] ? (
                <p className="text-ink-2 mt-2 text-[15px] leading-relaxed">
                  {TIER_BLURB[group.tier]}
                </p>
              ) : null}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {group.courses.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  startHere={course.slug === startSlug}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
