import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";

export const metadata = {
  title: "Region-wise Analysis",
};

export default function RegionWisePage() {
  return (
    <>
      <Breadcrumb pageName="Region-wise Analysis" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Region-wise Analysis
        </h2>

        <FilterBar>
          <SelectFilter
            paramKey="region"
            placeholder="All Regions"
            options={[
              { value: "north", label: "North" },
              { value: "south", label: "South" },
              { value: "east", label: "East" },
              { value: "west", label: "West" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartContainer
            type="bar"
            title="Sales by Region"
            height={350}
            series={[
              {
                name: "Sales",
                data: [400, 430, 448, 470, 540, 580, 690],
              },
            ]}
            options={{
              xaxis: {
                categories: [
                  "North",
                  "South",
                  "East",
                  "West",
                  "Central",
                  "Northeast",
                  "Northwest",
                ],
              },
            }}
          />
          <ChartContainer
            type="pie"
            title="Customer Distribution"
            height={350}
            series={[35, 25, 20, 15, 5]}
            options={{
              labels: ["North", "South", "East", "West", "Central"],
            }}
          />
        </div>
      </div>
    </>
  );
}
