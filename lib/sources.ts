import { nanoid } from "nanoid";
import { redis, keys, parseRedisVal } from "./redis";
import type { Source, CreateSourceInput } from "./types";

export async function createSource(input: CreateSourceInput): Promise<Source> {
  const source: Source = {
    ...input,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };
  const ts = Date.now();
  await Promise.all([
    redis.set(keys.source(source.id), JSON.stringify(source)),
    redis.zadd(keys.sourceIndex, { score: ts, member: source.id }),
  ]);
  return source;
}

export async function getSource(id: string): Promise<Source | null> {
  const raw = await redis.get(keys.source(id));
  return parseRedisVal<Source>(raw);
}

export async function listSources(): Promise<Source[]> {
  const ids = await redis.zrange(keys.sourceIndex, 0, -1, { rev: true }) as string[];
  if (!ids.length) return [];
  const raws = await Promise.all(ids.map((id) => redis.get(keys.source(id))));
  return raws
    .map((r) => parseRedisVal<Source>(r))
    .filter((s): s is Source => s !== null);
}

export async function updateSource(
  id: string,
  patch: Partial<Source>
): Promise<Source | null> {
  const existing = await getSource(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id };
  await redis.set(keys.source(id), JSON.stringify(updated));
  return updated;
}

export async function deleteSource(id: string): Promise<boolean> {
  const source = await getSource(id);
  if (!source) return false;
  await Promise.all([
    redis.del(keys.source(id)),
    redis.zrem(keys.sourceIndex, id),
  ]);
  return true;
}
