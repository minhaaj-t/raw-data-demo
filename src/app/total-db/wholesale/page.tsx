"use client";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/ExportButton";
import {
  FilterBar,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { BRANCH_OPTIONS } from "@/lib/filter-options";
import { getWholesaleData, type ApiColumnDef } from "../fetch";
import { Customer } from "@/lib/mock-data";

const DEFAULT_COLUMNS: { key: string; header: string; sortable?: boolean; renderType?: "date" | "status" }[] = [
  { key: "id", header: "Customer Code", sortable: true },
  { key: "name", header: "Customer Name", sortable: true },
  { key: "email", header: "Address", sortable: true },
  { key: "phone", header: "Mobile" },
  { key: "location", header: "Route Name", sortable: true },
  { key: "nationality", header: "Category Name", sortable: true },
  { key: "loyaltyStatus", header: "Loyalty", sortable: true, renderType: "status" },
  { key: "orderHistory", header: "Orders", sortable: true },
  { key: "status", header: "Status", sortable: true, renderType: "status" },
];

function apiColumnsToTableColumns(cols: ApiColumnDef[] | undefined) {
  if (!cols?.length) return DEFAULT_COLUMNS;
  const renderTypeByKey: Record<string, "date" | "status"> = {
    loyaltyStatus: "status",
    status: "status",
  };
  return cols.map((c) => ({
    key: c.key,
    header: c.header,
    sortable: c.sortable ?? true,
    ...(renderTypeByKey[c.key] && { renderType: renderTypeByKey[c.key] }),
  }));
}

export default function WholesalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [columns, setColumns] = useState<ApiColumnDef[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"api" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const urlSearchParams = new URLSearchParams();
      searchParams.forEach((value, key) => {
        urlSearchParams.set(key, value);
      });

      const result = await getWholesaleData(urlSearchParams);
      setCustomers(Array.isArray(result.data) ? result.data : []);
      setColumns(result.columns);
      setDataSource(result.source);
      setError(result.error ?? null);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const tableColumns = useMemo(
    () => apiColumnsToTableColumns(columns),
    [columns],
  );

  const locations = Array.from(new Set(customers.map((c) => c.location).filter(Boolean))).sort();
  const nationalities = Array.from(new Set(customers.map((c) => c.nationality).filter(Boolean))).sort();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Breadcrumb pageName="Wholesale" />

      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Wholesale Customers
            </h2>
            {dataSource === "api" && (
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
                Data from HO (Head Office) database
              </p>
            )}
          </div>
          <ExportButton data={customers} filename="wholesale-customers" />
        </div>

        <FilterBar>
          <SearchFilter
            placeholder="Search by ID, name, email, or phone..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="location"
            placeholder="All Locations"
            options={locations.map((loc) => ({ value: loc, label: loc }))}
          />
          <SelectFilter
            paramKey="nationality"
            placeholder="All Nationalities"
            options={nationalities.length > 0
              ? nationalities.map((n) => ({ value: n, label: n }))
              : [
                  { value: "Indian", label: "Indian" },
                  { value: "Pakistani", label: "Pakistani" },
                  { value: "Bangladeshi", label: "Bangladeshi" },
                  { value: "Sri Lankan", label: "Sri Lankan" },
                  { value: "Nepali", label: "Nepali" },
                  { value: "Bhutanese", label: "Bhutanese" },
                  { value: "Maldivian", label: "Maldivian" },
                  { value: "Afghan", label: "Afghan" },
                ]}
          />
          <SelectFilter
            paramKey="loyaltyStatus"
            placeholder="All Loyalty Status"
            options={[
              { value: "gold", label: "Gold" },
              { value: "silver", label: "Silver" },
              { value: "bronze", label: "Bronze" },
              { value: "none", label: "None" },
            ]}
          />
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <SelectFilter
            paramKey="branch"
            placeholder="All Branches"
            options={BRANCH_OPTIONS}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            <strong>Could not load from server:</strong> {error}
            <span className="mt-2 block text-dark-6 dark:text-dark-5">
              Ensure the API is running at http://localhost:3123 and Oracle (HO) is reachable.
            </span>
          </div>
        )}

        <DataTable
          data={customers}
          pagination={{ pageSize: 25, showPagination: true }}
          columns={tableColumns}
          emptyMessage="No wholesale customers found"
          loading={loading}
          onRowClick={(row) => router.push(`/total-db/wholesale/${encodeURIComponent(String(row.id ?? ""))}`)}
        />
      </div>
    </Suspense>
  );
}
