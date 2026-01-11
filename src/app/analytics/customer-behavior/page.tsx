import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";

export const metadata = {
  title: "Customer Behavior Analytics",
};

export default function CustomerBehaviorPage() {
  return (
    <>
      <Breadcrumb pageName="Customer Behavior" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Customer Behavior Analytics
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
            type="area"
            title="Purchase Frequency"
            height={350}
            series={[
              {
                name: "Frequency",
                data: [31, 40, 28, 51, 42, 109, 100],
              },
            ]}
            options={{
              xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              },
            }}
          />
          <ChartContainer
            type="bar"
            title="Average Order Value"
            height={350}
            series={[
              {
                name: "AOV",
                data: [400, 430, 448, 470, 540, 580, 690],
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
                ],
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
