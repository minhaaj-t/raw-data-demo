"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface Column<T> {
  key: keyof T | string;
  header: string;
  renderType?: "date" | "status" | "currency" | "percentage" | "custom";
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  pagination?: {
    pageSize?: number;
    showPagination?: boolean;
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  className = "",
  emptyMessage = "No data available",
  loading = false,
  pagination,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes (filters applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const pageSize = pagination?.pageSize || 10;
  const showPagination = pagination?.showPagination !== false;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const column = columns.find((col) => col.key === sortConfig.key);
    if (!column || !column.sortable) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = showPagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div
      className={cn(
        "rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    column.sortable && "cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-dark-3",
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-dark-6"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-dark-6"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    "border-[#eee] dark:border-dark-3",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={column.className}
                    >
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : column.renderType ? (
                        renderCellValue(row[column.key], column.renderType)
                      ) : (
                        String(row[column.key] ?? "")
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-stroke px-4 py-4 dark:border-dark-3">
          <div className="text-sm text-dark-6 dark:text-dark-6">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      currentPage === pageNumber
                        ? "bg-primary text-white"
                        : "text-dark hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-2"
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to render cell values based on type
function renderCellValue(value: any, renderType: string): React.ReactNode {
  switch (renderType) {
    case "date":
      return dayjs(value).format("MMM DD, YYYY");
    case "currency":
      return `$${Number(value).toLocaleString()}`;
    case "percentage":
      return `${Number(value).toFixed(1)}%`;
    case "status":
      return (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            value === "active" || value === "completed"
              ? "bg-green-100 text-green-800"
              : value === "inactive"
                ? "bg-red-100 text-red-800"
                : value === "pending" || value === "scheduled"
                  ? "bg-yellow-100 text-yellow-800"
                  : value === "draft"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800",
          )}
        >
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </span>
      );
    default:
      return String(value ?? "");
  }
}
