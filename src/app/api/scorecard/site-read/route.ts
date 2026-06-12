import { z } from "zod";
import { readSite } from "@/lib/scorecard/site-read";

/**
 * POST /api/scorecard/site-read — quietly read one page of the visitor's site in
 * the background while they answer, so the read is ready by the email step with
 * no extra waiting. Always returns 200 with a SiteRead; a failed read is
 * `{ ok: false }`, never an error the UI has to handle.
 */

export const runtime = "nodejs";

const bodySchema = z.object({ url: z.string().trim().min(1).max(2048) });

export async function POST(req: Request) {
  let url: string;
  try {
    const body = await req.json();
    url = bodySchema.parse(body).url;
  } catch {
    return Response.json({ ok: false });
  }

  const result = await readSite(url);
  return Response.json(result);
}
