"use client";

import { SearchIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuickSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function QuickSearch({
  onSearch,
  placeholder = "Search by ID, phone, or email...",
  className = "",
}: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Default: navigate to total-db with search
      router.push(`/total-db?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex w-full items-center gap-3.5 rounded-full border border-stroke bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus-visible:border-primary"
        />
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 size-5" />
      </div>
    </form>
  );
}
