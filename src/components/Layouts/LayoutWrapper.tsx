"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import AuthLayout from "./AuthLayout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}