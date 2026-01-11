"use client";

"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/ExportButton";
import {
  FilterBar,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Event, generateMockEvents } from "@/lib/mock-data";

export default function GiveawayPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      const data = generateMockEvents(30);
      setEvents(data.filter((e) => e.type === "giveaway"));
    };
    fetchData();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Giveaway Events" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Giveaway Events
          </h2>
          <ExportButton data={events} filename="giveaway-events" />
        </div>

        <FilterBar>
          <SearchFilter
            placeholder="Search events..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={events}
          pagination={{ pageSize: 25, showPagination: true }}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            {
              key: "date",
              header: "Date",
              sortable: true,
              renderType: "date",
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (value) => (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    value === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : value === "ongoing"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
            { key: "location", header: "Location", sortable: true },
            {
              key: "participants",
              header: "Entrants",
              sortable: true,
            },
            {
              key: "participantNames",
              header: "Lucky Winners",
              sortable: false,
              render: (value) => (
                <div className="max-w-[200px] truncate" title={value?.join(", ") || "N/A"}>
                  {value ? `${value.slice(0, 3).join(", ")}${value.length > 3 ? "..." : ""}` : "N/A"}
                </div>
              ),
            },
            {
              key: "winnerNames",
              header: "Prize Winners",
              sortable: false,
              render: (value) => (
                <div className="max-w-[200px] truncate" title={value?.join(", ") || "N/A"}>
                  {value ? value.join(", ") : "N/A"}
                </div>
              ),
            },
            {
              key: "prizeAmount",
              header: "Prize Value",
              sortable: true,
              render: (value) => value ? `$${value.toLocaleString()}` : "N/A",
            },
            {
              key: "newCustomers",
              header: "New Participants",
              sortable: true,
            },
            {
              key: "salesSpike",
              header: "Engagement Boost",
              sortable: true,
              renderType: "percentage",
            },
          ]}
          emptyMessage="No giveaway events found"
        />
      </div>
    </>
  );
}
