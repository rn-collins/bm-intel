import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { nanoid } from "nanoid";
import { redis, keys } from "@/lib/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadInput {
  name?: string;
  email: string;
  message?: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  let body: LeadInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, source } = body;
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const id = nanoid();
  const createdAt = new Date().toISOString();
  const lead = { id, name, email, message, source: source ?? "bm-intel", createdAt };

  try {
    await Promise.all([
      redis.set(keys.lead(id), JSON.stringify(lead)),
      redis.zadd(keys.leadIndex, { score: Date.now(), member: id }),
    ]);
  } catch (err) {
    console.error("Lead redis write failed:", err);
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📥 *Burgermeister Intel — new contact form lead*\n*Name:* ${name || "—"}\n*Email:* ${email}\n*Message:* ${message || "—"}\n*Source:* ${source ?? "bm-intel"}`,
        }),
      });
    } catch (err) {
      console.error("Lead Slack alert failed:", err);
    }
  }

  const to = process.env.ALERT_EMAIL_TO;
  if (to) {
    try {
      const { error } = await resend.emails.send({
        from: process.env.ALERT_EMAIL_FROM ?? "alerts@burgermeister-intel.com",
        to: [to],
        subject: `New contact form lead: ${name || email}`,
        html: `<p><strong>From:</strong> ${name || "—"} (${email})</p><p>${message || ""}</p><p><em>Source: ${source ?? "bm-intel"}</em></p>`,
      });
      if (error) console.error("Lead Resend error:", error);
    } catch (err) {
      console.error("Lead email alert failed:", err);
    }
  }

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
