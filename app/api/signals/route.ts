import { NextRequest, NextResponse } from "next/server";
import { listSignals, createSignal } from "@/lib/signals";
import { sendSlackAlert } from "@/lib/slack";
import { sendEmailAlert } from "@/lib/email";
import type { CreateSignalInput } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit  = parseInt(searchParams.get("limit")  ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const signals = await listSignals({ limit, offset });
    return NextResponse.json({ signals, count: signals.length });
  } catch (err) {
    console.error("GET /api/signals error:", err);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateSignalInput & { sendAlert?: boolean } = await req.json();

    // Validate required fields
    const required = [
      "title","summary","sourceUrl","sourceName","sourceTier",
      "dateFound","jurisdiction","category",
      "businessImpactScore","legalComplexityScore","urgencyScore","confidenceScore",
      "outsideCounselNeeded",
    ] as const;
    for (const field of required) {
      if (body[field as keyof typeof body] === undefined) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const sendAlert = body.sendAlert ?? false;
    const { sendAlert: _, ...signalInput } = body;

    const signal = await createSignal(signalInput as CreateSignalInput);

    // Fire alerts if requested
    if (sendAlert) {
      await Promise.all([
        sendSlackAlert(signal),
        sendEmailAlert(signal),
      ]);
    }

    return NextResponse.json({ signal }, { status: 201 });
  } catch (err) {
    console.error("POST /api/signals error:", err);
    return NextResponse.json({ error: "Failed to create signal" }, { status: 500 });
  }
}
