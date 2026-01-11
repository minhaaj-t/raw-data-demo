"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SearchFilter, SelectFilter, DateRangeFilter } from "@/components/Filters";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";


const mockLogs = Array.from({ length: 50 }, (_, i) => ({
  id: `LOG-${i + 1}`,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  level: ["info", "warning", "error"][Math.floor(Math.random() * 3)] as "info" | "warning" | "error",
  message: `System log message ${i + 1}`,
  source: ["API", "Database", "Auth", "Sync"][Math.floor(Math.random() * 4)],
}));

export default function SystemLogsPage() {
  return (
    <>
      <Breadcrumb pageName="System Logs" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          System Logs
        </h2>

        <FilterBar>
          <SearchFilter
            placeholder="Search logs..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="level"
            placeholder="All Levels"
            options={[
              { value: "info", label: "Info" },
              { value: "warning", label: "Warning" },
              { value: "error", label: "Error" },
            ]}
          />
          <SelectFilter
            paramKey="source"
            placeholder="All Sources"
            options={[
              { value: "API", label: "API" },
              { value: "Database", label: "Database" },
              { value: "Auth", label: "Auth" },
              { value: "Sync", label: "Sync" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={mockLogs}
          columns={[
            { key: "id", header: "ID", sortable: true },
            {
              key: "timestamp",
              header: "Timestamp",
              sortable: true,
              render: (value) => dayjs(value).format("MMM DD, YYYY HH:mm:ss"),
            },
            {
              key: "level",
              header: "Level",
              sortable: true,
              render: (value) => (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    value === "error"
                      ? "bg-red-100 text-red-800"
                      : value === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800",
                  )}
                >
                  {String(value).toUpperCase()}
                </span>
              ),
            },
            { key: "message", header: "Message", sortable: true },
            { key: "source", header: "Source", sortable: true },
          ]}
          emptyMessage="No logs found"
        />
      </div>
    </>
  );
}
