import "server-only";

/**
 * Provider-agnostic rate limiter. Ships with a working in-memory fixed-window
 * implementation so the audit endpoint can be limited from day one. Note: an
 * in-memory store is per-instance and resets on redeploy/scale-out — for
 * durable, multi-instance limiting, swap `defaultLimiter` for an Upstash-backed
 * implementation of `RateLimiter` (env vars UPSTASH_REDIS_REST_URL/TOKEN are
 * already reserved in .env.example). No interface changes required.
 */
export interface RateLimitResult {
  success: boolean;
  /** Configured max in the window. */
  limit: number;
  /** Remaining in the current window. */
  remaining: number;
  /** Epoch ms when the window resets. */
  reset: number;
}

export interface RateLimitOptions {
  /** Max requests per window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
}

export interface RateLimiter {
  check(key: string, options: RateLimitOptions): Promise<RateLimitResult>;
}

interface Bucket {
  count: number;
  reset: number;
}

class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  async check(
    key: string,
    { limit, windowMs }: RateLimitOptions,
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.reset <= now) {
      const reset = now + windowMs;
      this.buckets.set(key, { count: 1, reset });
      this.sweep(now);
      return { success: true, limit, remaining: limit - 1, reset };
    }

    if (existing.count >= limit) {
      return { success: false, limit, remaining: 0, reset: existing.reset };
    }

    existing.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - existing.count,
      reset: existing.reset,
    };
  }

  /** Drop expired buckets so the map doesn't grow unbounded. */
  private sweep(now: number): void {
    if (this.buckets.size < 1000) return;
    for (const [key, bucket] of this.buckets) {
      if (bucket.reset <= now) this.buckets.delete(key);
    }
  }
}

export const defaultLimiter: RateLimiter = new InMemoryRateLimiter();

/** Convenience wrapper around the default limiter. */
export function rateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  return defaultLimiter.check(key, options);
}
