"use client";

import { SearchIcon } from "@/assets/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchFilterProps {
  placeholder?: string;
  paramKey?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchFilter({
  placeholder = "Search...",
  paramKey = "search",
  debounceMs = 300,
  className = "",
}: SearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get(paramKey) || "",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set(paramKey, searchValue);
      } else {
        params.delete(paramKey);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, paramKey, pathname, router, searchParams, debounceMs]);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="flex w-full items-center gap-3.5 rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus-visible:border-primary"
      />
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-dark-6 dark:text-dark-6" />
    </div>
  );
}
