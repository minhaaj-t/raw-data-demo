import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";

export const metadata = {
  title: "Sales Trends Analytics",
};

export default function SalesTrendsPage() {
  return (
    <>
      <Breadcrumb pageName="Sales Trends" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Sales Trends Analytics
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

        <ChartContainer
          type="line"
          title="Sales Trend Over Time"
          height={400}
          series={[
            {
              name: "Sales",
              data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 140, 150, 180],
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
                "Oct",
                "Nov",
                "Dec",
              ],
            },
          }}
        />
      </div>
    </>
  );
}
