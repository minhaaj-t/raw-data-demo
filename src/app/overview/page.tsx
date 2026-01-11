import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChartContainer } from "@/components/ChartContainer";
import { DataTable } from "@/components/DataTable";
import { FilterBar, SelectFilter, DateRangeFilter } from "@/components/Filters";
import { getOverviewData } from "./fetch";
import dayjs from "dayjs";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";

export const metadata = {
  title: "Dashboard Overview",
};

export default async function OverviewPage() {
  const data = await getOverviewData();

  const divisionChartData = {
    labels: data.revenueByDivision.map((d) => d.division),
    series: data.revenueByDivision.map((d) => d.revenue),
  };

  const locationChartData = {
    labels: data.topLocations.map((l) => l.location),
    series: data.topLocations.map((l) => l.customers),
  };

  return (
    <>
      <Breadcrumb pageName="Dashboard" />

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Customers",
              value: formatNumber(data.totalCustomers),
              growthRate: 12.5,
              icon: (
                <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/20">
                  <svg
                    className="size-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              ),
            },
            {
              label: "New Customers",
              value: formatNumber(data.newCustomers),
              growthRate: 8.3,
              icon: (
                <div className="rounded-full bg-green/10 p-3 dark:bg-green/20">
                  <svg
                    className="size-6 text-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              ),
            },
            {
              label: "Retention Rate",
              value: `${data.retentionRate.toFixed(1)}%`,
              growthRate: 2.1,
              icon: (
                <div className="rounded-full bg-blue/10 p-3 dark:bg-blue/20">
                  <svg
                    className="size-6 text-blue"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              ),
            },
            {
              label: "Total Revenue",
              value: `$${formatNumber(data.revenueByDivision.reduce((sum, d) => sum + d.revenue, 0))}`,
              growthRate: 15.7,
              icon: (
                <div className="rounded-full bg-purple/10 p-3 dark:bg-purple/20">
                  <svg
                    className="size-6 text-purple"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              ),
            },
          ].map((card, idx) => {
            const isDecreasing = card.growthRate < 0;
            return (
              <div
                key={idx}
                className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
              >
                {card.icon}
                <div className="mt-6 flex items-end justify-between">
                  <dl>
                    <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                      {card.value}
                    </dt>
                    <dd className="text-sm font-medium text-dark-6">
                      {card.label}
                    </dd>
                  </dl>
                  <dl
                    className={cn(
                      "text-sm font-medium",
                      isDecreasing ? "text-red" : "text-green",
                    )}
                  >
                    <dt className="flex items-center gap-1.5">
                      {Math.abs(card.growthRate).toFixed(1)}%
                      {isDecreasing ? (
                        <ArrowDownIcon aria-hidden />
                      ) : (
                        <ArrowUpIcon aria-hidden />
                      )}
                    </dt>
                  </dl>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
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

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartContainer
            type="pie"
            title="Revenue by Division"
            series={divisionChartData.series}
            options={{
              labels: divisionChartData.labels,
              legend: {
                position: "bottom",
              },
            }}
          />
          <ChartContainer
            type="bar"
            title="Top Locations"
            series={[{ name: "Customers", data: locationChartData.series }]}
            options={{
              xaxis: {
                categories: locationChartData.labels,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
            }}
          />
        </div>

        {/* Recent Activities */}
        <DataTable
          data={data.recentActivities}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "type", header: "Type", sortable: true },
            { key: "description", header: "Description" },
            {
              key: "date",
              header: "Date",
              sortable: true,
              renderType: "date",
            },
          ]}
          emptyMessage="No recent activities"
        />
      </div>
    </>
  );
}
