import { SchoolShell } from "@/components/school/school-shell";
import { getSchoolSearchIndex } from "@/lib/school";
import { getUsedTopics } from "@/lib/content";

/**
 * Shared layout for the entire AEO School (the `(content)` route group). Wraps
 * every learning surface — articles, courses, topics, glossary, pillars,
 * playbooks, industries, authors — in the persistent left-rail navigation and
 * ⌘K search. The search index and topic counts are built once on the server and
 * handed to the client shell.
 */
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = getSchoolSearchIndex();
  const topics = getUsedTopics();

  return (
    <SchoolShell items={items} topics={topics}>
      {children}
    </SchoolShell>
  );
}
