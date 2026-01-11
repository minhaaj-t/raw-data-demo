import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/ExportButton";
import {
  FilterBar,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { getTotalDbData } from "../total-db/fetch";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

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

export default async function PromotionsDbPage(props: PropsType) {
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

  // Fetch customers from all divisions and filter those with promotion activity
  const data = await getTotalDbData(undefined, urlSearchParams);

  // Filter to show customers who are likely to participate in promotions
  // Show customers with order history OR loyalty status OR include active customers
  let promotionCustomers = data.filter(customer =>
    customer.orderHistory > 0 || customer.loyaltyStatus !== "none"
  );

  // If no customers found, include some active customers to ensure data is always shown
  if (promotionCustomers.length === 0) {
    promotionCustomers = data.filter(customer => customer.status === "active").slice(0, 10);
  }

  const locations = Array.from(
    new Set(promotionCustomers.map((c) => c.location)),
  ).sort();

  return (
    <>
      <Breadcrumb pageName="Promotions Customers" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Promotion Customers
          </h2>
          <ExportButton data={promotionCustomers} filename="promotion-customers" />
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
          data={promotionCustomers}
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
          emptyMessage="No promotion customers found"
        />
      </div>
    </>
  );
}
