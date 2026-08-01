import type { Signal, AlertLevel } from "./types";
import { getAlertLevel } from "./scoring";

const EMOJI: Record<string, string> = {
  Critical: "🔴",
  High:     "🟠",
  Medium:   "🟡",
  Low:      "🟢",
};

export async function sendSlackAlert(signal: Signal): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL not set — skipping Slack alert");
    return false;
  }

  const emoji = EMOJI[signal.priorityLabel] ?? "⚪";
  const level = getAlertLevel(signal.priorityLabel);

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji} Burgermeister Expansion Signal — ${level}`,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Category:*\n${signal.category}` },
          { type: "mrkdwn", text: `*Jurisdiction:*\n${signal.jurisdiction}` },
          { type: "mrkdwn", text: `*Priority:*\n${signal.priorityLabel}` },
          { type: "mrkdwn", text: `*Outside Counsel:*\n${signal.outsideCounselNeeded ? "Yes ⚠️" : "No"}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Signal:*\n${signal.title}` },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Summary:*\n${signal.summary}` },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Recommended Action:*\n${signal.recommendedAction}` },
          { type: "mrkdwn", text: `*Source (Tier ${signal.sourceTier}):*\n${signal.sourceName}` },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "⚖️ Not legal advice · Burgermeister Expansion Intel · Built by RN Collins · Aloha AI Consulting",
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("Slack alert failed:", err);
    return false;
  }
}
