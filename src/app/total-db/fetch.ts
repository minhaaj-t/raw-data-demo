import { apiGet, getApiUrl, isApiConfigured } from "@/lib/api";
import { Customer, Division, generateMockCustomers } from "@/lib/mock-data";

interface WholesaleApiRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  division: string;
  location: string;
  loyaltyStatus: string;
  signupDate: string | null;
  orderHistory: number;
  totalSpent: number;
  status: string;
  nationality: string;
}

export type ApiColumnDef = { key: string; header: string; sortable?: boolean };

/** Fetch customers from HO API with optional division (wholesale or all). */
async function getCustomersFromApi(
  searchParams?: URLSearchParams,
  division: "wholesale" | "all" = "wholesale",
): Promise<{ data: Customer[]; columns?: ApiColumnDef[] }> {
  const base = getApiUrl("/api/total-db");
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const params = new URLSearchParams();
  if (division === "wholesale") params.set("division", "wholesale");
  if (searchParams) {
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const status = searchParams.get("status");
    const nationality = searchParams.get("nationality");
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (status) params.set("status", status);
    if (nationality) params.set("nationality", nationality);
  }
  const res = await fetch(`${base}?${params.toString()}`, { cache: "no-store" });
  const json = (await res.json().catch(() => ({}))) as {
    data?: WholesaleApiRow[];
    columns?: { key: string; header: string; sortable?: boolean }[];
    error?: string;
  };
  if (!res.ok) throw new Error(json?.error || `API error: ${res.status}`);
  if (json.error) throw new Error(json.error);
  let rows = Array.isArray(json.data) ? json.data : [];
  const dateRange = searchParams?.get("dateRange");
  const loyaltyStatus = searchParams?.get("loyaltyStatus");
  if (loyaltyStatus) {
    rows = rows.filter((r) => (r.loyaltyStatus || "none") === loyaltyStatus);
  }
  if (dateRange) {
    const [start, end] = dateRange.split(",");
    const startDate = new Date(start);
    const endDate = new Date(end);
    rows = rows.filter((r) => {
      const d = r.signupDate ? new Date(r.signupDate) : new Date();
      return d >= startDate && d <= endDate;
    });
  }
  const data = rows.map((r) => ({
    ...r,
    division: (r.division || "wholesale") as Division,
    loyaltyStatus: (r.loyaltyStatus || "none") as Customer["loyaltyStatus"],
    signupDate: r.signupDate ? new Date(r.signupDate) : new Date(),
    status: (r.status || "active") as Customer["status"],
  }));
  return { data, columns: json.columns };
}

export type WholesaleDataResult = {
  data: Customer[];
  columns?: ApiColumnDef[];
  source: "api" | "mock";
  error?: string;
};

/** Wholesale page: only from HO database when API is configured; no mock fallback. */
export async function getWholesaleData(
  searchParams?: URLSearchParams,
): Promise<WholesaleDataResult> {
  if (isApiConfigured()) {
    try {
      const { data, columns } = await getCustomersFromApi(searchParams, "wholesale");
      return { data, columns, source: "api" };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("Wholesale API error:", e);
      return { data: [], source: "api", error: message };
    }
  }
  return { data: [], source: "api", error: "API URL not configured" };
}

export async function getTotalDbData(
  division?: Division,
  searchParams?: URLSearchParams,
): Promise<Customer[]> {
  if (division === "wholesale") {
    const { data } = await getWholesaleData(searchParams);
    return data;
  }

  if (!division && isApiConfigured()) {
    try {
      const { data } = await getCustomersFromApi(searchParams, "all");
      return data;
    } catch {
      // Fall through to mock
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  let customers = generateMockCustomers(500);

  // Filter by division if provided
  if (division) {
    customers = customers.filter((c) => c.division === division);
  }

  // Apply filters from search params
  if (searchParams) {
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const nationality = searchParams.get("nationality");
    const loyaltyStatus = searchParams.get("loyaltyStatus");
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    const branch = searchParams.get("branch");

    if (branch) {
      const branchToLocation: Record<string, string> = {
        "umm-salal": "Umm Salal",
        wakhra: "Al Wakrah",
        rayyan: "Al Rayyan",
      };
      if (branchToLocation[branch]) {
        customers = customers.filter((c) => c.location === branchToLocation[branch]);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.id.toLowerCase().includes(searchLower) ||
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(search),
      );
    }

    if (location) {
      customers = customers.filter((c) => c.location === location);
    }

    if (nationality) {
      customers = customers.filter((c) => c.nationality === nationality);
    }

    if (loyaltyStatus) {
      customers = customers.filter((c) => c.loyaltyStatus === loyaltyStatus);
    }

    if (status) {
      customers = customers.filter((c) => c.status === status);
    }

    if (dateRange) {
      const [start, end] = dateRange.split(",");
      const startDate = new Date(start);
      const endDate = new Date(end);
      customers = customers.filter((c) => {
        const signupDate = new Date(c.signupDate);
        return signupDate >= startDate && signupDate <= endDate;
      });
    }
  }

  return customers;
}
