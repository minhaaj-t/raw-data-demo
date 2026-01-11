"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DateRangeFilterProps {
  paramKey?: string;
  label?: string;
  className?: string;
}

export function DateRangeFilter({
  paramKey = "dateRange",
  label,
  className = "",
}: DateRangeFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstanceRef = useRef<flatpickr.Instance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!inputRef.current || isInitialized) return;

    const instance = flatpickr(inputRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedDates.length === 2) {
          const [start, end] = selectedDates;
          params.set(
            paramKey,
            `${start.toISOString().split("T")[0]},${end.toISOString().split("T")[0]}`,
          );
        } else {
          params.delete(paramKey);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      },
    });

    flatpickrInstanceRef.current = instance;
    setIsInitialized(true);

    return () => {
      instance.destroy();
      flatpickrInstanceRef.current = null;
    };
  }, [isInitialized]);

  useEffect(() => {
    if (!isInitialized || !flatpickrInstanceRef.current) return;

    const dateRange = searchParams.get(paramKey);
    if (dateRange) {
      try {
        const [start, end] = dateRange.split(",");
        if (start && end) {
          flatpickrInstanceRef.current.setDate([start, end], false, "Y-m-d");
        }
      } catch (error) {
        // Silently handle date parsing errors
        console.warn("Invalid date range format:", dateRange);
      }
    } else {
      // Clear the date range if no param
      flatpickrInstanceRef.current.clear();
    }
  }, [searchParams, paramKey, isInitialized]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Select date range"
          className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 pl-10 text-sm outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus-visible:border-primary"
        />
        <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-dark-6" />
      </div>
    </div>
  );
}
