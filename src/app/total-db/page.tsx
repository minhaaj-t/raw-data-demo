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
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { getTotalDbData } from "./fetch";

type PropsType = {
  searchParams: Promise<{
    search?: string;
    location?: string;
    nationality?: string;
    loyaltyStatus?: string;
    status?: string;
    dateRange?: string;
  }>;
};

export default async function TotalDbPage(props: PropsType) {
  const searchParams = await props.searchParams;
  const urlSearchParams = new URLSearchParams(
    Object.entries(searchParams).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const customers = await getTotalDbData(undefined, urlSearchParams);

  const locations = Array.from(
    new Set(customers.map((c) => c.location)),
  ).sort();

  return (
    <>
      <Breadcrumb pageName="Total DB" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            All Customers
          </h2>
          <ExportButton data={customers} filename="customers" />
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
            {
              key: "division",
              header: "Division",
              sortable: true,
              renderType: "division",
            },
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
              renderType: "loyalty",
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
          emptyMessage="No customers found"
        />
      </div>
    </>
  );
}
