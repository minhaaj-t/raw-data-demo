import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { FilterBar, SelectFilter, MultiSelectFilter, DateRangeFilter } from "@/components/Filters";

export const metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return (
    <>
      <Breadcrumb pageName="Analytics" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Analytics Overview
        </h2>

        <FilterBar>
          <SelectFilter
            paramKey="division"
            placeholder="All Divisions"
            options={[
              { value: "retail", label: "Retail" },
              { value: "wholesale", label: "Wholesale" },
              { value: "restaurant", label: "Restaurant" },
              { value: "food-factory", label: "Food Factory" },
              { value: "distribution", label: "Distribution" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartContainer
            type="line"
            title="Sales Trend"
            height={300}
            series={[
              {
                name: "Sales",
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
              },
            ]}
            options={{
              xaxis: {
                categories: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                ],
              },
            }}
          />
          <ChartContainer
            type="bar"
            title="Customer Growth"
            height={300}
            series={[
              {
                name: "New Customers",
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
              },
            ]}
            options={{
              xaxis: {
                categories: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                ],
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
