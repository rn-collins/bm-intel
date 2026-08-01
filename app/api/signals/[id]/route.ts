import { NextRequest, NextResponse } from "next/server";
import { getSignal, updateSignal, deleteSignal } from "@/lib/signals";
import { sendSlackAlert } from "@/lib/slack";
import { sendEmailAlert } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const signal = await getSignal(id);
    if (!signal) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ signal });
  } catch (err) {
    console.error("GET /api/signals/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch signal" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { sendAlert, ...patch } = body;

    const updated = await updateSignal(id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (sendAlert) {
      await Promise.all([
        sendSlackAlert(updated),
        sendEmailAlert(updated),
      ]);
    }

    return NextResponse.json({ signal: updated });
  } catch (err) {
    console.error("PATCH /api/signals/[id] error:", err);
    return NextResponse.json({ error: "Failed to update signal" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await deleteSignal(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/signals/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete signal" }, { status: 500 });
  }
}
