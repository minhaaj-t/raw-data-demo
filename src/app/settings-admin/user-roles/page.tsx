"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SearchFilter, SelectFilter } from "@/components/Filters";
import { cn } from "@/lib/utils";

const mockRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access",
    users: 5,
    permissions: ["All"],
    status: "active",
  },
  {
    id: "2",
    name: "Manager",
    description: "Management access",
    users: 12,
    permissions: ["View", "Edit", "Export"],
    status: "active",
  },
  {
    id: "3",
    name: "Analyst",
    description: "Read-only analytics access",
    users: 8,
    permissions: ["View", "Export"],
    status: "active",
  },
  {
    id: "4",
    name: "Viewer",
    description: "View-only access",
    users: 20,
    permissions: ["View"],
    status: "active",
  },
];

export default function UserRolesPage() {
  return (
    <>
      <Breadcrumb pageName="User Roles & Permissions" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          User Roles & Permissions
        </h2>

        <FilterBar>
          <SearchFilter
            placeholder="Search roles..."
            paramKey="search"
            className="min-w-[300px]"
          />
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
          data={mockRoles}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Role Name", sortable: true },
            { key: "description", header: "Description" },
            { key: "users", header: "Users", sortable: true },
            {
              key: "permissions",
              header: "Permissions",
              render: (value) => (
                <div className="flex flex-wrap gap-1">
                  {(value as string[]).map((perm, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
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
                    value === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                  )}
                >
                  {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
                </span>
              ),
            },
          ]}
          emptyMessage="No roles found"
        />
      </div>
    </>
  );
}
