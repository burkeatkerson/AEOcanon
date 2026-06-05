import "server-only";
import { safeFetch } from "./safe-fetch";

/**
 * Minimal robots.txt fetch + parse. Used both to honor robots when we crawl and
 * to report (in the audit) whether AI crawlers are allowed. Not a full spec
 * implementation — it covers User-agent groups with Allow/Disallow prefix rules,
 * which is what the audit needs.
 */
export interface RobotsRule {
  path: string;
  allow: boolean;
}

export interface RobotsData {
  fetched: boolean;
  /** Lower-cased user-agent token -> ordered rules. */
  groups: Map<string, RobotsRule[]>;
  sitemaps: string[];
  raw: string;
}

/** Well-known AI/agent crawler user-agents worth reporting on. */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
] as const;

export async function fetchRobots(origin: string): Promise<RobotsData> {
  const url = new URL("/robots.txt", origin).toString();
  const empty: RobotsData = {
    fetched: false,
    groups: new Map(),
    sitemaps: [],
    raw: "",
  };
  try {
    const res = await safeFetch(url, { accept: "text/plain,*/*;q=0.8" });
    if (res.status >= 400) return empty;
    return parseRobots(res.body);
  } catch {
    return empty;
  }
}

export function parseRobots(raw: string): RobotsData {
  const groups = new Map<string, RobotsRule[]>();
  const sitemaps: string[] = [];
  let currentAgents: string[] = [];
  let sawDirectiveSinceAgent = false;

  for (const line of raw.split(/\r?\n/)) {
    const withoutComment = line.split("#")[0] ?? "";
    const trimmed = withoutComment.trim();
    if (!trimmed) continue;
    const sepIndex = trimmed.indexOf(":");
    if (sepIndex === -1) continue;
    const field = trimmed.slice(0, sepIndex).trim().toLowerCase();
    const value = trimmed.slice(sepIndex + 1).trim();

    if (field === "user-agent") {
      // Consecutive user-agent lines share the following rule block.
      if (sawDirectiveSinceAgent) {
        currentAgents = [];
        sawDirectiveSinceAgent = false;
      }
      const agent = value.toLowerCase();
      currentAgents.push(agent);
      if (!groups.has(agent)) groups.set(agent, []);
    } else if (field === "allow" || field === "disallow") {
      sawDirectiveSinceAgent = true;
      const allow = field === "allow";
      for (const agent of currentAgents) {
        groups.get(agent)?.push({ path: value, allow });
      }
    } else if (field === "sitemap") {
      sitemaps.push(value);
    }
  }

  return { fetched: true, groups, sitemaps, raw };
}

/**
 * Is `path` allowed for `userAgent`? Uses the most specific matching group
 * (exact agent token, else `*`), longest-match-wins between Allow/Disallow.
 */
export function isAllowed(
  robots: RobotsData,
  path: string,
  userAgent: string,
): boolean {
  if (!robots.fetched) return true; // no robots.txt => allowed
  const agent = userAgent.toLowerCase();
  const rules =
    robots.groups.get(agent) ??
    [...robots.groups.entries()].find(([token]) =>
      agent.includes(token),
    )?.[1] ??
    robots.groups.get("*");
  if (!rules || rules.length === 0) return true;

  let decision = true;
  let matchLength = -1;
  for (const rule of rules) {
    if (rule.path === "") continue;
    if (path.startsWith(rule.path) && rule.path.length > matchLength) {
      decision = rule.allow;
      matchLength = rule.path.length;
    }
  }
  return decision;
}

/** Report which AI crawlers are explicitly disallowed from the site root. */
export function blockedAiCrawlers(robots: RobotsData): string[] {
  return AI_CRAWLERS.filter((bot) => !isAllowed(robots, "/", bot));
}
