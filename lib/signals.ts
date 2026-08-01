import { nanoid } from "nanoid";
import { redis, keys, parseRedisVal } from "./redis";
import {
  calculatePriorityScore,
  getPriorityLabel,
  getRecommendedAction,
} from "./scoring";
import type { Signal, CreateSignalInput, SignalStatus } from "./types";

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSignal(input: CreateSignalInput): Promise<Signal> {
  const priorityScore = calculatePriorityScore(
    input.businessImpactScore,
    input.legalComplexityScore,
    input.urgencyScore
  );
  const priorityLabel     = getPriorityLabel(priorityScore);
  const recommendedAction = getRecommendedAction(priorityLabel, input.outsideCounselNeeded);

  const now = new Date().toISOString();
  const signal: Signal = {
    ...input,
    id: nanoid(),
    priorityScore,
    priorityLabel,
    recommendedAction,
    status: "New",
    alertSent: false,
    createdAt: now,
    updatedAt: now,
  };

  const ts = Date.now();

  await Promise.all([
    // Store full record
    redis.set(keys.signal(signal.id), JSON.stringify(signal)),
    // Add to main sorted set (score = timestamp for date ordering)
    redis.zadd(keys.signalIndex, { score: ts, member: signal.id }),
    // Add to filter sets
    redis.sadd(keys.byCategory(signal.category), signal.id),
    redis.sadd(keys.byJurisdiction(signal.jurisdiction), signal.id),
    redis.sadd(keys.byStatus(signal.status), signal.id),
    redis.sadd(keys.byPriority(signal.priorityLabel), signal.id),
  ]);

  return signal;
}

// ─── Get one ──────────────────────────────────────────────────────────────────

export async function getSignal(id: string): Promise<Signal | null> {
  const raw = await redis.get(keys.signal(id));
  return parseRedisVal<Signal>(raw);
}

// ─── Get all (newest first, paginated) ───────────────────────────────────────

export async function listSignals(opts: {
  limit?: number;
  offset?: number;
} = {}): Promise<Signal[]> {
  const { limit = 50, offset = 0 } = opts;
  // zrange with REV = newest first
  const ids = await redis.zrange(keys.signalIndex, offset, offset + limit - 1, {
    rev: true,
  }) as string[];

  if (!ids.length) return [];

  const raws = await Promise.all(ids.map((id) => redis.get(keys.signal(id))));
  return raws
    .map((r) => parseRedisVal<Signal>(r))
    .filter((s): s is Signal => s !== null);
}

// ─── Update (partial) ────────────────────────────────────────────────────────

export async function updateSignal(
  id: string,
  patch: Partial<Signal>
): Promise<Signal | null> {
  const existing = await getSignal(id);
  if (!existing) return null;

  const oldStatus   = existing.status;
  const oldPriority = existing.priorityLabel;

  const updated: Signal = {
    ...existing,
    ...patch,
    id,                                    // never overwrite id
    updatedAt: new Date().toISOString(),
  };

  // Recalculate derived fields if scores changed
  if (
    patch.businessImpactScore !== undefined ||
    patch.legalComplexityScore !== undefined ||
    patch.urgencyScore !== undefined ||
    patch.outsideCounselNeeded !== undefined
  ) {
    updated.priorityScore = calculatePriorityScore(
      updated.businessImpactScore,
      updated.legalComplexityScore,
      updated.urgencyScore
    );
    updated.priorityLabel     = getPriorityLabel(updated.priorityScore);
    updated.recommendedAction = getRecommendedAction(
      updated.priorityLabel,
      updated.outsideCounselNeeded
    );
  }

  const ops: Promise<unknown>[] = [
    redis.set(keys.signal(id), JSON.stringify(updated)),
  ];

  // Update filter sets if status changed
  if (patch.status && patch.status !== oldStatus) {
    ops.push(redis.srem(keys.byStatus(oldStatus), id));
    ops.push(redis.sadd(keys.byStatus(updated.status), id));
  }

  // Update filter sets if priority changed
  if (updated.priorityLabel !== oldPriority) {
    ops.push(redis.srem(keys.byPriority(oldPriority.toLowerCase()), id));
    ops.push(redis.sadd(keys.byPriority(updated.priorityLabel.toLowerCase()), id));
  }

  await Promise.all(ops);
  return updated;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSignal(id: string): Promise<boolean> {
  const signal = await getSignal(id);
  if (!signal) return false;

  await Promise.all([
    redis.del(keys.signal(id)),
    redis.zrem(keys.signalIndex, id),
    redis.srem(keys.byCategory(signal.category), id),
    redis.srem(keys.byJurisdiction(signal.jurisdiction), id),
    redis.srem(keys.byStatus(signal.status), id),
    redis.srem(keys.byPriority(signal.priorityLabel.toLowerCase()), id),
  ]);
  return true;
}

// ─── Stats for dashboard home ─────────────────────────────────────────────────

export async function getSignalStats() {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const [total, newThisWeek, criticalIds, highIds, ocIds] = await Promise.all([
    redis.zcard(keys.signalIndex),
    redis.zcount(keys.signalIndex, oneWeekAgo, "+inf"),
    redis.smembers(keys.byPriority("critical")),
    redis.smembers(keys.byPriority("high")),
    // OC filter: get all signals and count — small dataset so OK
    redis.zrange(keys.signalIndex, 0, -1),
  ]);

  // Count outside counsel needed
  let needsOC = 0;
  if (Array.isArray(ocIds) && ocIds.length) {
    const all = await Promise.all(
      (ocIds as string[]).map((id) => redis.get(keys.signal(id)))
    );
    needsOC = all
      .map((r) => parseRedisVal<Signal>(r))
      .filter((s): s is Signal => s !== null && s.outsideCounselNeeded)
      .length;
  }

  return {
    totalSignals: total as number,
    critical: Array.isArray(criticalIds) ? criticalIds.length : 0,
    high: Array.isArray(highIds) ? highIds.length : 0,
    needsOutsideCounsel: needsOC,
    newThisWeek: newThisWeek as number,
  };
}
