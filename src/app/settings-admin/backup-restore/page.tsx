"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";


const mockBackups = Array.from({ length: 20 }, (_, i) => ({
  id: `BACKUP-${i + 1}`,
  name: `Backup ${i + 1}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  size: `${(Math.random() * 1000 + 100).toFixed(2)} MB`,
  status: i < 2 ? "completed" : "completed" as "completed" | "failed" | "in-progress",
  type: ["Full", "Incremental"][Math.floor(Math.random() * 2)] as "Full" | "Incremental",
}));

export default function BackupRestorePage() {
  return (
    <>
      <Breadcrumb pageName="Backup & Restore" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Backup & Restore
          </h2>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            Create Backup
          </button>
        </div>

        <FilterBar>
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
              { value: "in-progress", label: "In Progress" },
            ]}
          />
          <SelectFilter
            paramKey="type"
            placeholder="All Types"
            options={[
              { value: "Full", label: "Full" },
              { value: "Incremental", label: "Incremental" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={mockBackups}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            {
              key: "date",
              header: "Date",
              sortable: true,
              render: (value) => dayjs(value).format("MMM DD, YYYY HH:mm"),
            },
            { key: "size", header: "Size", sortable: true },
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
                    value === "completed"
                      ? "bg-green-100 text-green-800"
                      : value === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
          ]}
          emptyMessage="No backups found"
        />
      </div>
    </>
  );
}
