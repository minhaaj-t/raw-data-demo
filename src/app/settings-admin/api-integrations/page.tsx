"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SearchFilter, SelectFilter } from "@/components/Filters";
import { cn } from "@/lib/utils";


const mockIntegrations = [
  {
    id: "1",
    name: "ERP System",
    type: "ERP",
    status: "connected",
    lastSync: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    name: "POS System",
    type: "POS",
    status: "connected",
    lastSync: "2024-01-15 10:35:00",
  },
  {
    id: "3",
    name: "eCommerce Platform",
    type: "eCommerce",
    status: "disconnected",
    lastSync: "2024-01-14 15:20:00",
  },
];

export default function ApiIntegrationsPage() {
  return (
    <>
      <Breadcrumb pageName="API Integrations" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          API Integrations
        </h2>

        <FilterBar>
          <SearchFilter
            placeholder="Search integrations..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="type"
            placeholder="All Types"
            options={[
              { value: "ERP", label: "ERP" },
              { value: "POS", label: "POS" },
              { value: "eCommerce", label: "eCommerce" },
            ]}
          />
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "connected", label: "Connected" },
              { value: "disconnected", label: "Disconnected" },
            ]}
          />
        </FilterBar>

        <DataTable
          data={mockIntegrations}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            {
              key: "type",
              header: "Type",
              sortable: true,
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (value) => (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    value === "connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
            { key: "lastSync", header: "Last Sync", sortable: true },
          ]}
          emptyMessage="No integrations found"
        />
      </div>
    </>
  );
}
