import { NextRequest, NextResponse } from "next/server";

const FLASK_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3123";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ custCode: string }> },
) {
  const { custCode } = await params;
  if (!custCode) {
    return NextResponse.json({ data: null, error: "custCode required" });
  }
  try {
    const res = await fetch(`${FLASK_BASE}/api/customers/${encodeURIComponent(custCode)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ data: null, error: message });
  }
}
