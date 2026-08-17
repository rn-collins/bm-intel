import { NextResponse } from "next/server";
import { getSignalStats } from "@/lib/signals";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    const stats = await getSignalStats();
    return NextResponse.json(
      {
        status: "ok",
        service: "burgermeister-expansion-intel",
        checkedAt,
        data: {
          signalsAvailable: stats.totalSignals,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("GET /api/health error:", error);
    return NextResponse.json(
      {
        status: "degraded",
        service: "burgermeister-expansion-intel",
        checkedAt,
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
