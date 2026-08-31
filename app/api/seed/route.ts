import { NextRequest, NextResponse } from "next/server";
import { upsertSignal } from "@/lib/signals";
import { upsertSource } from "@/lib/sources";
import { SEED_SIGNALS, SEED_SOURCES } from "@/lib/seed";

// Protected by a simple shared secret — set SEED_SECRET in env vars
// POST /api/seed  { "secret": "your_secret" }

export async function POST(req: NextRequest) {
  try {
    const { secret, mode = "all" } = await req.json();

    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
      signals: 0, signalsUpdated: 0,
      sources: 0, sourcesUpdated: 0,
      errors: [] as string[],
    };

    if (mode === "all" || mode === "sources") {
      for (const sourceInput of SEED_SOURCES) {
        try {
          const { created } = await upsertSource(sourceInput);
          if (created) results.sources++; else results.sourcesUpdated++;
        } catch (err) {
          results.errors.push(`Source "${sourceInput.name}": ${err}`);
        }
      }
    }

    if (mode === "all" || mode === "signals") {
      for (const signalInput of SEED_SIGNALS) {
        try {
          const { created } = await upsertSignal(signalInput);
          if (created) results.signals++; else results.signalsUpdated++;
        } catch (err) {
          results.errors.push(`Signal "${signalInput.title}": ${err}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      seeded: results,
      message:
        `Created ${results.signals} signals and ${results.sources} sources; ` +
        `updated ${results.signalsUpdated} signals and ${results.sourcesUpdated} sources in place.`,
    });
  } catch (err) {
    console.error("POST /api/seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
