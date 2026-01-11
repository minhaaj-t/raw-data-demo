"use client";

import { Download } from "react-iconly";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  data: any[];
  filename?: string;
  format?: "csv" | "excel";
  className?: string;
  children?: React.ReactNode;
}

export function ExportButton({
  data,
  filename = "export",
  format = "csv",
  className = "",
  children,
}: ExportButtonProps) {
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            if (typeof value === "object") return JSON.stringify(value);
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // For Excel, we'll export as CSV with .xlsx extension
    // In a real app, you'd use a library like xlsx
    exportToCSV();
  };

  const handleExport = () => {
    if (format === "csv") {
      exportToCSV();
    } else {
      exportToExcel();
    }
  };

  return (
    <button
      onClick={handleExport}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-[#FFFFFF1A]",
        className,
      )}
    >
      {children || (
        <>
          <Download set="bold" size={18} />
          Export {format.toUpperCase()}
        </>
      )}
    </button>
  );
}
