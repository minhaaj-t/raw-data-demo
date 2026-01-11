import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";

export const metadata = {
  title: "Product Popularity Analytics",
};

export default function ProductPopularityPage() {
  return (
    <>
      <Breadcrumb pageName="Product Popularity" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Product Popularity Analytics
        </h2>

        <FilterBar>
          <SelectFilter
            paramKey="category"
            placeholder="All Categories"
            options={[
              { value: "category1", label: "Category 1" },
              { value: "category2", label: "Category 2" },
              { value: "category3", label: "Category 3" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartContainer
            type="pie"
            title="Top Products"
            height={350}
            series={[44, 55, 13, 43, 22]}
            options={{
              labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
            }}
          />
          <ChartContainer
            type="bar"
            title="Product Sales"
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
                  "Product 1",
                  "Product 2",
                  "Product 3",
                  "Product 4",
                  "Product 5",
                  "Product 6",
                  "Product 7",
                ],
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
