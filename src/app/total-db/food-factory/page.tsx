"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/ExportButton";
import {
  FilterBar,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { getTotalDbData } from "../fetch";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

export default function FoodFactoryPage() {
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Create URLSearchParams from the actual URL search params
      const urlSearchParams = new URLSearchParams();
      searchParams.forEach((value, key) => {
        urlSearchParams.set(key, value);
      });

      const data = await getTotalDbData("food-factory", urlSearchParams);
      setCustomers(data);
      setLoading(false);
    }
    fetchData();
    // Use searchParams.toString() for stable dependency comparison
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const locations = Array.from(
    new Set(customers.map((c) => c.location)),
  ).sort();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Breadcrumb pageName="Food Factory" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Food Factory Customers
          </h2>
          <ExportButton data={customers} filename="food-factory-customers" />
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
            options={[
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
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={customers}
          pagination={{ pageSize: 25, showPagination: true }}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            { key: "email", header: "Email", sortable: true },
            { key: "phone", header: "Phone" },
            { key: "location", header: "Location", sortable: true },
            {
              key: "nationality",
              header: "Nationality",
              sortable: true,
            },
            {
              key: "loyaltyStatus",
              header: "Loyalty",
              sortable: true,
              renderType: "status",
            },
            {
              key: "signupDate",
              header: "Signup Date",
              sortable: true,
              renderType: "date",
            },
            { key: "orderHistory", header: "Orders", sortable: true },
            {
              key: "status",
              header: "Status",
              sortable: true,
              renderType: "status",
            },
          ]}
          emptyMessage="No food factory customers found"
          loading={loading}
        />
      </div>
    </Suspense>
  );
}
