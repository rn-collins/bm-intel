import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const HEADER_NAME = "x-dashboard-secret";

export function authorizeDashboardMutation(req: NextRequest): NextResponse | null {
  const configured = process.env.DASHBOARD_SECRET;
  if (!configured) {
    console.error("DASHBOARD_SECRET is not configured");
    return NextResponse.json(
      { error: "Dashboard mutations are temporarily unavailable" },
      { status: 503 },
    );
  }

  const supplied = req.headers.get(HEADER_NAME) ?? "";
  const expectedBuffer = Buffer.from(configured);
  const suppliedBuffer = Buffer.from(supplied);
  const authorized =
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
