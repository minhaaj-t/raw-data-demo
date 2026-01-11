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

export default function FestivalPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50));
      const data = generateMockEvents(30);
      setEvents(data.filter((e) => e.type === "festival"));
    };
    fetchData();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Festival Events" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Festival Events
          </h2>
          <ExportButton data={events} filename="festival-events" />
        </div>

        <FilterBar>
          <SearchFilter
            placeholder="Search festivals..."
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
          <SelectFilter
            paramKey="eventCategory"
            placeholder="All Categories"
            options={[
              { value: "cultural", label: "Cultural" },
              { value: "entertainment", label: "Entertainment" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={events}
          pagination={{ pageSize: 25, showPagination: true }}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Festival Name", sortable: true },
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
              header: "Visitors",
              sortable: true,
            },
            {
              key: "participantNames",
              header: "Featured Guests",
              sortable: false,
              render: (value) => (
                <div className="max-w-[200px] truncate" title={value?.join(", ") || "N/A"}>
                  {value ? `${value.slice(0, 3).join(", ")}${value.length > 3 ? "..." : ""}` : "N/A"}
                </div>
              ),
            },
            {
              key: "maxCapacity",
              header: "Capacity",
              sortable: true,
            },
            {
              key: "registrationFee",
              header: "Entry Fee",
              sortable: true,
              render: (value) => value ? `$${value}` : "Free",
            },
            {
              key: "sponsors",
              header: "Major Sponsors",
              sortable: false,
              render: (value) => (
                <div className="max-w-[200px] truncate" title={value?.join(", ") || "N/A"}>
                  {value ? value.join(", ") : "N/A"}
                </div>
              ),
            },
            {
              key: "salesSpike",
              header: "Economic Impact",
              sortable: true,
              renderType: "percentage",
            },
          ]}
          emptyMessage="No festival events found"
        />
      </div>
    </>
  );
}