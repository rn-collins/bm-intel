import { NextRequest, NextResponse } from "next/server";
import { listSources, createSource } from "@/lib/sources";
import type { CreateSourceInput } from "@/lib/types";

export async function GET() {
  try {
    const sources = await listSources();
    return NextResponse.json({ sources, count: sources.length });
  } catch (err) {
    console.error("GET /api/sources error:", err);
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateSourceInput = await req.json();
    const required = ["name","url","jurisdiction","category","tier","updateFrequency"] as const;
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }
    const source = await createSource(body);
    return NextResponse.json({ source }, { status: 201 });
  } catch (err) {
    console.error("POST /api/sources error:", err);
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 });
  }
}
