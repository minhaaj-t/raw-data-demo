import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import LayoutWrapper from "@/components/Layouts/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s | RAW-DATA",
    default: "RAW-DATA Dashboard",
  },
  description:
    "RAW-DATA Business Intelligence Dashboard - Comprehensive customer analytics, promotions management, and business insights platform.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
