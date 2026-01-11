"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartContainerProps {
  options: ApexCharts.ApexOptions;
  series: ApexCharts.ApexOptions["series"];
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "treemap"
    | "boxPlot"
    | "candlestick"
    | "radar"
    | "polarArea"
    | "rangeBar";
  height?: number | string;
  className?: string;
  title?: string;
}

export function ChartContainer({
  options,
  series,
  type,
  height = 350,
  className = "",
  title,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5",
        className,
      )}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>
      )}
      <Chart
        options={{
          ...options,
          chart: {
            ...options.chart,
            toolbar: {
              show: true,
            },
            fontFamily: "inherit",
          },
          theme: {
            mode: "light",
          },
        }}
        series={series}
        type={type}
        height={height}
      />
    </div>
  );
}
