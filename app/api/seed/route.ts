import { NextRequest, NextResponse } from "next/server";
import { createSignal } from "@/lib/signals";
import { createSource } from "@/lib/sources";
import { SEED_SIGNALS, SEED_SOURCES } from "@/lib/seed";

// Protected by a simple shared secret — set SEED_SECRET in env vars
// POST /api/seed  { "secret": "your_secret" }

export async function POST(req: NextRequest) {
  try {
    const { secret, mode = "all" } = await req.json();

    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: { signals: number; sources: number; errors: string[] } = {
      signals: 0,
      sources: 0,
      errors: [],
    };

    if (mode === "all" || mode === "sources") {
      for (const sourceInput of SEED_SOURCES) {
        try {
          await createSource(sourceInput);
          results.sources++;
        } catch (err) {
          results.errors.push(`Source "${sourceInput.name}": ${err}`);
        }
      }
    }

    if (mode === "all" || mode === "signals") {
      for (const signalInput of SEED_SIGNALS) {
        try {
          await createSignal(signalInput);
          results.signals++;
        } catch (err) {
          results.errors.push(`Signal "${signalInput.title}": ${err}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      seeded: results,
      message: `Seeded ${results.signals} signals and ${results.sources} sources.`,
    });
  } catch (err) {
    console.error("POST /api/seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
