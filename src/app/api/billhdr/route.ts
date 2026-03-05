import { NextRequest, NextResponse } from "next/server";

const FLASK_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3123";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const custCode = searchParams.get("cust_code") ?? "";
  if (!custCode) {
    return NextResponse.json({ data: [], error: "cust_code required" });
  }
  try {
    const res = await fetch(
      `${FLASK_BASE}/api/billhdr?cust_code=${encodeURIComponent(custCode)}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ data: [], error: message });
  }
}
