import { Redis } from "@upstash/redis";

// Single shared client — safe for serverless (each invocation gets its own instance)
export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ─── CRITICAL: parseRedisVal ──────────────────────────────────────────────────
// Upstash auto-deserializes JSON on read, so redis.get() may return an object
// OR a string depending on how the value was stored and which SDK version is
// in use. Never call JSON.parse() directly on redis.get() results — it will
// fail intermittently when Upstash returns an already-parsed object.
//
// Always pass redis.get() output through parseRedisVal() before use.

export function parseRedisVal<T>(val: unknown): T | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; }
    catch { return val as unknown as T; }
  }
  // Already deserialized by Upstash SDK
  return val as T;
}

// ─── Redis key namespace: bm: prefix to avoid collisions ─────────────────────
// Other projects on amusing-hippo-92821.upstash.io use different prefixes.

export const keys = {
  // Sorted sets (score = unix timestamp ms for date-ordering)
  signalIndex:    "bm:signals",
  sourceIndex:    "bm:sources",
  alertIndex:     "bm:alerts",
  leadIndex:      "bm:leads",

  // Individual records
  signal: (id: string) => `bm:signal:${id}`,
  source: (id: string) => `bm:source:${id}`,
  alert:  (id: string) => `bm:alert:${id}`,
  lead:   (id: string) => `bm:lead:${id}`,

  // Lookup sets (for filtering without scanning)
  byCategory:    (cat: string)  => `bm:signals:cat:${cat.replace(/\W+/g, "_")}`,
  byJurisdiction:(jur: string)  => `bm:signals:jur:${jur}`,
  byStatus:      (status: string) => `bm:signals:status:${status.replace(/\W+/g, "_")}`,
  byPriority:    (pri: string)  => `bm:signals:pri:${pri.toLowerCase()}`,

  // Meta
  meta: (key: string) => `bm:meta:${key}`,
};
