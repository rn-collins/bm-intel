import { Resend } from "resend";
import type { Signal } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

const PRIORITY_COLOR: Record<string, string> = {
  Critical: "#7B0000",
  High:     "#8B4513",
  Medium:   "#2F5496",
  Low:      "#375623",
};

export async function sendEmailAlert(signal: Signal): Promise<boolean> {
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM ?? "alerts@burgermeister-intel.com";
  if (!to) {
    console.warn("ALERT_EMAIL_TO not set — skipping email alert");
    return false;
  }

  const color = PRIORITY_COLOR[signal.priorityLabel] ?? "#1C1B1F";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#F6F3EC;color:#1C1B1F;">
  <div style="background:#1E3651;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;font-size:18px;">🔔 Burgermeister Expansion Signal</h2>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #ddd;">
    <div style="display:inline-block;background:${color};color:#fff;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:bold;margin-bottom:16px;">
      ${signal.priorityLabel.toUpperCase()}
    </div>
    <h3 style="margin:0 0 8px;color:#1E3651;">${signal.title}</h3>
    <p style="margin:0 0 16px;color:#444;">${signal.summary}</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;width:40%;">Category</td>
        <td style="padding:6px 0;font-weight:bold;">${signal.category}</td>
      </tr>
      <tr style="background:#f9f7f4;">
        <td style="padding:6px 12px 6px 0;color:#666;">Jurisdiction</td>
        <td style="padding:6px 0;font-weight:bold;">${signal.jurisdiction}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;">Recommended Action</td>
        <td style="padding:6px 0;font-weight:bold;">${signal.recommendedAction}</td>
      </tr>
      <tr style="background:#f9f7f4;">
        <td style="padding:6px 12px 6px 0;color:#666;">Outside Counsel Needed</td>
        <td style="padding:6px 0;font-weight:bold;">${signal.outsideCounselNeeded ? "Yes ⚠️" : "No"}</td>
      </tr>
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;">Source (Tier ${signal.sourceTier})</td>
        <td style="padding:6px 0;"><a href="${signal.sourceUrl}" style="color:#1E3651;">${signal.sourceName}</a></td>
      </tr>
      <tr style="background:#f9f7f4;">
        <td style="padding:6px 12px 6px 0;color:#666;">Date Found</td>
        <td style="padding:6px 0;">${new Date(signal.dateFound).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
      </tr>
      ${signal.datePublished ? `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;">Date Published</td>
        <td style="padding:6px 0;">${new Date(signal.datePublished).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
      </tr>` : ""}
    </table>

    <div style="margin-top:24px;padding:12px;background:#FDF0F0;border-left:4px solid ${color};border-radius:4px;font-size:13px;color:#666;font-style:italic;">
      ⚖️ Not legal advice. This is an issue-spotting and monitoring tool. Items marked 'Outside Counsel: Yes' require attorney confirmation before action.
    </div>
  </div>
  <p style="font-size:12px;color:#999;margin-top:16px;text-align:center;">
    Burgermeister Expansion Intel · Built by RN Collins · Aloha AI Consulting · collins.ra@northeastern.edu
  </p>
</body>
</html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[${signal.priorityLabel}] Burgermeister Expansion Signal: ${signal.title}`,
      html,
    });
    if (error) { console.error("Resend error:", error); return false; }
    return true;
  } catch (err) {
    console.error("Email alert failed:", err);
    return false;
  }
}
