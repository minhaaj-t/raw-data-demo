"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/dropdown";

interface SelectFilterOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  options: SelectFilterOption[];
  paramKey: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SelectFilter({
  options,
  paramKey,
  placeholder = "Select...",
  label,
  className = "",
}: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const selectedValue = searchParams.get(paramKey) || "";
  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-dark dark:text-white">
          {label}
        </label>
      )}
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <DropdownTrigger className="flex h-10 w-full items-center justify-between gap-x-1 rounded-lg border border-stroke bg-white px-3 py-2 text-sm font-medium text-dark-5 outline-none ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:ring-offset-neutral-950 [&>span]:line-clamp-1 [&[data-state='open']>svg]:rotate-0">
          <span className={cn(!selectedValue && "text-dark-6")}>
            {selectedLabel}
          </span>
          <ChevronUpIcon className="size-4 rotate-180 transition-transform" />
        </DropdownTrigger>

        <DropdownContent
          align="start"
          className="min-w-[10rem] overflow-hidden rounded-lg border border-stroke bg-white p-1 font-medium text-dark-5 shadow-md dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <ul>
            <li>
              <button
                className="flex w-full select-none items-center truncate rounded-md px-3 py-2 text-sm outline-none hover:bg-gray-100 hover:text-dark dark:hover:bg-[#FFFFFF1A] dark:hover:text-white"
                onClick={() => handleSelect("")}
              >
                All
              </button>
            </li>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  className={cn(
                    "flex w-full select-none items-center truncate rounded-md px-3 py-2 text-sm outline-none hover:bg-gray-100 hover:text-dark dark:hover:bg-[#FFFFFF1A] dark:hover:text-white",
                    selectedValue === option.value &&
                      "bg-primary/10 text-primary dark:bg-primary/20",
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
