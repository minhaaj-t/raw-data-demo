"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** When true, sheet is positioned inside its parent (absolute), only covers the chat area, no full-page overlay */
  contained?: boolean;
};

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  contained = false,
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    if (!contained) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (!contained) document.body.style.overflow = "";
    };
  }, [isOpen, onClose, contained]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "z-50 flex w-full justify-center",
        contained
          ? "absolute inset-0 items-start pt-0"
          : "fixed inset-0 items-end sm:items-center sm:justify-center",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "bottom-sheet-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={cn(
          "relative z-10 w-full max-w-md bg-white shadow-xl dark:bg-gray-dark",
          contained
            ? "rounded-b-2xl border-b border-x border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200"
            : "rounded-t-2xl sm:rounded-2xl animate-in slide-in-from-bottom-full duration-200 sm:slide-in-from-bottom-4",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          {title && (
            <h2 id="bottom-sheet-title" className="min-w-0 flex-1 text-base font-semibold text-dark dark:text-white">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-dark-6 hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white"
            aria-label="Close"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
