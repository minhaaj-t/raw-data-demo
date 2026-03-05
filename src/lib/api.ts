/** Default Flask URL (used by server and by Next.js API proxy). */
const DEFAULT_API_URL = "http://localhost:3123";

/**
 * In the browser we use same-origin /api/* (Next.js proxy) to avoid CORS "Failed to fetch".
 * On the server we use the direct Flask URL.
 */
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return ""; // browser: same-origin → Next.js proxy at /api/total-db
  }
  const env = process.env.NEXT_PUBLIC_API_URL?.trim();
  return env || DEFAULT_API_URL;
};

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = getApiUrl(path);
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = getApiUrl(path);
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export function isApiConfigured(): boolean {
  if (typeof window !== "undefined") return true; // browser: proxy /api/total-db is always available
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL);
}
