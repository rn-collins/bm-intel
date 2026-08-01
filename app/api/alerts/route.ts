import { NextRequest, NextResponse } from "next/server";
import { getSignal, updateSignal } from "@/lib/signals";
import { sendSlackAlert } from "@/lib/slack";
import { sendEmailAlert } from "@/lib/email";
import { redis, keys } from "@/lib/redis";
import { nanoid } from "nanoid";
import type { AlertRecord } from "@/lib/types";
import { getAlertLevel } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const { signalId, channels = ["slack", "email"] } = await req.json();
    if (!signalId) {
      return NextResponse.json({ error: "signalId required" }, { status: 400 });
    }

    const signal = await getSignal(signalId);
    if (!signal) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 });
    }

    const results: Record<string, boolean> = {};
    if (channels.includes("slack")) {
      results.slack = await sendSlackAlert(signal);
    }
    if (channels.includes("email")) {
      results.email = await sendEmailAlert(signal);
    }

    // Record the alert
    const record: AlertRecord = {
      id: nanoid(),
      signalId,
      channels,
      sentAt: new Date().toISOString(),
      alertLevel: getAlertLevel(signal.priorityLabel),
      messagePreview: signal.summary.slice(0, 200),
    };
    await Promise.all([
      redis.set(keys.alert(record.id), JSON.stringify(record)),
      redis.zadd(keys.alertIndex, { score: Date.now(), member: record.id }),
    ]);

    // Mark signal as alerted
    await updateSignal(signalId, { alertSent: true });

    return NextResponse.json({ ok: true, results, alert: record });
  } catch (err) {
    console.error("POST /api/alerts error:", err);
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
  }
}
