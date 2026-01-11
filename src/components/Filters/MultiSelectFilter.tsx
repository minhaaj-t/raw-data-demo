"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/dropdown";

interface MultiSelectFilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: MultiSelectFilterOption[];
  paramKey: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MultiSelectFilter({
  options,
  paramKey,
  placeholder = "Select...",
  label,
  className = "",
}: MultiSelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = searchParams.get(paramKey)?.split(",") || [];
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`
      : placeholder;

  const toggleValue = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(paramKey)?.split(",") || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    if (newValues.length > 0) {
      params.set(paramKey, newValues.join(","));
    } else {
      params.delete(paramKey);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
          <span className={cn(selectedLabels.length === 0 && "text-dark-6")}>
            {displayText}
          </span>
          <ChevronUpIcon className="size-4 rotate-180 transition-transform" />
        </DropdownTrigger>

        <DropdownContent
          align="start"
          className="min-w-[10rem] max-h-[20rem] overflow-y-auto rounded-lg border border-stroke bg-white p-1 font-medium text-dark-5 shadow-md dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <ul>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    className={cn(
                      "flex w-full select-none items-center gap-2 truncate rounded-md px-3 py-2 text-sm outline-none hover:bg-gray-100 hover:text-dark dark:hover:bg-[#FFFFFF1A] dark:hover:text-white",
                      isSelected &&
                        "bg-primary/10 text-primary dark:bg-primary/20",
                    )}
                    onClick={() => toggleValue(option.value)}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-stroke dark:border-dark-3",
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="size-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
