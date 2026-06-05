# `src/lib/db` — application-data seam (placeholder)

**Intentionally empty for now. No database dependency is installed.**

This directory marks the boundary between the two data concerns of the project:

- **Content** (articles, paths, verticals, authors) lives in MDX under `content/`,
  is the single source of truth, and is queried through `src/lib/content.ts`. It
  is version-controlled and built statically by Velite. **It never touches a
  database.**
- **Application data** (future): contact/lead-form submissions, website-auditor
  results, and any eventual course-progress or account features. _That_ is where
  a database (planned: **Supabase**) enters.

When the first application-data feature lands (e.g. the contact form's server
action), add the client here — e.g. `src/lib/db/client.ts` — and keep all DB
access behind this module so content and app data stay cleanly separated.

Until then, this is a documented seam only.
