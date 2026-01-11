"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3L3 9M3 3L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  className?: string;
}

export function FilterChips({ className = "" }: FilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips: FilterChip[] = [];
  searchParams.forEach((value, key) => {
    if (key === "page") return; // Skip pagination
    if (value.includes(",")) {
      // Multi-select values
      value.split(",").forEach((v) => {
        chips.push({ key, label: `${formatFilterKey(key)}: ${v}`, value: v });
      });
    } else {
      chips.push({ key, label: `${formatFilterKey(key)}: ${value}`, value });
    }
  });

  // Format filter keys to be more readable
  function formatFilterKey(key: string): string {
    const keyMap: Record<string, string> = {
      search: "Search",
      location: "Location",
      nationality: "Nationality",
      loyaltyStatus: "Loyalty",
      status: "Status",
      dateRange: "Date Range",
      division: "Division",
    };
    return keyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  const removeFilter = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = params.get(key);

    if (valueToRemove && currentValue?.includes(",")) {
      const values = currentValue.split(",").filter((v) => v !== valueToRemove);
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    router.push(pathname, { scroll: false });
  };

  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip, index) => (
        <button
          key={`${chip.key}-${chip.value}-${index}`}
          onClick={() => removeFilter(chip.key, chip.value)}
          className="flex items-center gap-1.5 rounded-full border border-stroke bg-white px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-[#FFFFFF1A]"
        >
          <span>{chip.label}</span>
          <XIcon className="size-3" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="rounded-full border border-stroke bg-white px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-gray-100 dark:border-dark-3 dark:bg-dark-2 dark:text-primary dark:hover:bg-[#FFFFFF1A]"
      >
        Clear all
      </button>
    </div>
  );
}
