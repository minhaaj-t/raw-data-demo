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
  MultiSelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Campaign, generateMockCampaigns } from "@/lib/mock-data";

export default function NotificationsMarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = generateMockCampaigns(40); // Reasonable number of campaigns
      setCampaigns(data);
    };
    fetchData();
  }, []);

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "sent" || c.status === "completed",
  );
  const totalSent = activeCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = activeCampaigns.reduce((sum, c) => sum + c.opened, 0);
  const totalClicked = activeCampaigns.reduce((sum, c) => sum + c.clicked, 0);
  const openRate =
    totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const clickRate =
    totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";

  return (
    <>
      <Breadcrumb pageName="Notifications / Marketing" />

      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h3 className="text-sm font-medium text-dark-6">Total Sent</h3>
            <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
              {totalSent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h3 className="text-sm font-medium text-dark-6">Total Opened</h3>
            <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
              {totalOpened.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h3 className="text-sm font-medium text-dark-6">Open Rate</h3>
            <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
              {openRate}%
            </p>
          </div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h3 className="text-sm font-medium text-dark-6">Click Rate</h3>
            <p className="mt-2 text-2xl font-bold text-dark dark:text-white">
              {clickRate}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Campaigns
          </h2>
          <ExportButton data={campaigns} filename="campaigns" />
        </div>

        <FilterBar>
          <SearchFilter
            placeholder="Search campaigns..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="type"
            placeholder="All Types"
            options={[
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
              { value: "app", label: "App Notification" },
            ]}
          />
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "scheduled", label: "Scheduled" },
              { value: "sent", label: "Sent" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <MultiSelectFilter
            paramKey="segment"
            placeholder="All Segments"
            options={[
              { value: "All Customers", label: "All Customers" },
              { value: "Gold Members", label: "Gold Members" },
              { value: "New Customers", label: "New Customers" },
              { value: "Inactive Customers", label: "Inactive Customers" },
              { value: "High Value", label: "High Value" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={campaigns}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            {
              key: "type",
              header: "Type",
              sortable: true,
              render: (value) => (
                <span className="uppercase">{String(value)}</span>
              ),
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
                      : value === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : value === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
            { key: "segment", header: "Segment", sortable: true },
            { key: "sent", header: "Sent", sortable: true },
            { key: "opened", header: "Opened", sortable: true },
            { key: "clicked", header: "Clicked", sortable: true },
            {
              key: "scheduledDate",
              header: "Scheduled Date",
              sortable: true,
              render: (value, row) =>
                value
                  ? dayjs(value).format("MMM DD, YYYY")
                  : row.sentDate
                    ? dayjs(row.sentDate).format("MMM DD, YYYY")
                    : "-",
            },
          ]}
          emptyMessage="No campaigns found"
        />
      </div>
    </>
  );
}
