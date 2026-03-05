import { NextRequest, NextResponse } from "next/server";

const FLASK_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3123";

/**
 * Proxy GET /api/total-db to the Flask server so the browser makes same-origin
 * requests and avoids CORS "Failed to fetch".
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = `${FLASK_BASE}/api/total-db${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ...data, error: data?.error || `API error: ${res.status}` },
        { status: 200 }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { data: [], source: "api", error: message },
      { status: 200 }
    );
  }
}
