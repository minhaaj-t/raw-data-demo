"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a] flex flex-col">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}