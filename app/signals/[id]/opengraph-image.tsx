import { ImageResponse } from "next/og";
import { getSignal } from "@/lib/signals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Burgermeister Expansion Intel — tracked risk signal";

// Palette lifted from the app's own classes so the card matches the build.
const IVORY = "#F6F3EC";
const NAVY = "#1E3651";
const GOLD = "#B8842A";
const OXBLOOD = "#7B0000";
const BLUE = "#2F5496";
const GREEN = "#375623";
const LINE = "#E0DDD6";
const MUTED = "#5A5A5F";

const PRIORITY_COLOR: Record<string, string> = {
  Critical: OXBLOOD,
  High: GOLD,
  Medium: BLUE,
  Low: GREEN,
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signal = await getSignal(id).catch(() => null);

  const title = signal?.title ?? "Signal";
  const jurisdiction = signal?.jurisdiction ?? "";
  const category = signal?.category ?? "";
  const priority = signal?.priorityLabel ?? "";
  const accent = PRIORITY_COLOR[priority] ?? NAVY;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: IVORY,
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: "0",
        }}
      >
        <div style={{ height: 10, background: accent, display: "flex" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "54px 84px 0 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 23,
              letterSpacing: 3,
              color: accent,
              fontWeight: 700,
            }}
          >
            <span>{[jurisdiction, priority].filter(Boolean).join("  ·  ").toUpperCase()}</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 90 ? 52 : 64,
              lineHeight: 1.14,
              color: NAVY,
              fontWeight: 700,
              marginTop: 26,
              maxWidth: 1010,
            }}
          >
            {title.length > 170 ? title.slice(0, 167) + "…" : title}
          </div>

          {category ? (
            <div style={{ display: "flex", fontSize: 27, color: MUTED, marginTop: 22 }}>
              {category}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${LINE}`,
            margin: "0 84px",
            padding: "22px 0 40px 0",
            fontSize: 22,
            color: MUTED,
          }}
        >
          <span>Burgermeister Expansion Intel · independent analysis by RN Collins</span>
          <span style={{ color: NAVY, fontWeight: 700 }}>Not legal advice</span>
        </div>
      </div>
    ),
    size,
  );
}
