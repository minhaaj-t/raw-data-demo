"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SelectFilter } from "@/components/Filters";
import { cn } from "@/lib/utils";


const mockSyncSettings = [
  {
    id: "1",
    name: "ERP Sync",
    status: "active",
    frequency: "Every 15 minutes",
    lastSync: "2024-01-15 10:30:00",
    nextSync: "2024-01-15 10:45:00",
  },
  {
    id: "2",
    name: "POS Sync",
    status: "active",
    frequency: "Real-time",
    lastSync: "2024-01-15 10:35:00",
    nextSync: "Real-time",
  },
  {
    id: "3",
    name: "eCommerce Sync",
    status: "inactive",
    frequency: "Every 1 hour",
    lastSync: "2024-01-15 09:00:00",
    nextSync: "2024-01-15 11:00:00",
  },
];

export default function DatabaseSyncPage() {
  return (
    <>
      <Breadcrumb pageName="Database Sync Settings" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Database Sync Settings
        </h2>

        <FilterBar>
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </FilterBar>

        <DataTable
          data={mockSyncSettings}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Sync Name", sortable: true },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (value) => (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    value === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
            { key: "frequency", header: "Frequency", sortable: true },
            { key: "lastSync", header: "Last Sync", sortable: true },
            { key: "nextSync", header: "Next Sync", sortable: true },
          ]}
          emptyMessage="No sync settings found"
        />
      </div>
    </>
  );
}
