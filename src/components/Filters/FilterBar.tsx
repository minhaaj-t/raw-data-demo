"use client";

import { FilterChips } from "./FilterChips";
import { SearchFilter } from "./SearchFilter";
import { SelectFilter } from "./SelectFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { DateRangeFilter } from "./DateRangeFilter";

interface FilterBarProps {
  children?: React.ReactNode;
  showChips?: boolean;
  className?: string;
}

export function FilterBar({
  children,
  showChips = true,
  className = "",
}: FilterBarProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-end gap-4">
        {children}
      </div>
      {showChips && <FilterChips />}
    </div>
  );
}

// Export all filter components for convenience
export {
  SearchFilter,
  SelectFilter,
  MultiSelectFilter,
  DateRangeFilter,
  FilterChips,
};
