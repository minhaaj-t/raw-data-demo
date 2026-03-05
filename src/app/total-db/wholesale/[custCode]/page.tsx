"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const BILL_PAGE_SIZE = 20;

type CustomerDetail = Record<string, string | number | null>;

const LABELS: Record<string, string> = {
  LOCATIONCODE: "Location Code",
  CUST_CODE: "Customer Code",
  CUST_NAME: "Customer Name",
  ADDRESS: "Address",
  CREDIT_LIMIT: "Credit Limit",
  CREDIT_AMOUNT: "Credit Amount",
  CATEGORY: "Category",
  CATEGORYNAME: "Category Name",
  ROUTE: "Route",
  ROUTENAME: "Route Name",
  SALESMAN: "Salesman",
  SALESMANNAME: "Salesman Name",
  TYPE: "Type",
  MOBILE: "Mobile",
  LOCATIONMAP: "Location Map",
  PRIORITY: "Priority",
  BYSALESMAN: "By Salesman",
  BYSALESMANNAME: "By Salesman Name",
  CREATEDSTATUS: "Created Status",
  CUSTOMERSTATUS: "Customer Status",
  BRANCHFLAG: "Branch Flag",
};

export default function WholesaleCustomerDetailsPage() {
  const params = useParams();
  const custCode = String(params?.custCode ?? "");

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [bills, setBills] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billDetail, setBillDetail] = useState<Record<string, unknown>[] | null>(null);
  const [billDetailBillNo, setBillDetailBillNo] = useState<string | null>(null);
  const [billDetailLoading, setBillDetailLoading] = useState(false);
  const [billPage, setBillPage] = useState(1);

  useEffect(() => {
    if (!custCode) return;
    setLoading(true);
    setError(null);
    fetch(typeof window !== "undefined" ? `/api/customers/${encodeURIComponent(custCode)}` : "")
      .then((res) => res.json())
      .then((json: { data?: CustomerDetail; error?: string }) => {
        if (json.error) setError(json.error);
        else setCustomer(json.data ?? null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [custCode]);

  useEffect(() => {
    if (!custCode) return;
    setBillsLoading(true);
    fetch(
      typeof window !== "undefined"
        ? `/api/billhdr?cust_code=${encodeURIComponent(custCode)}`
        : "",
    )
      .then((res) => res.json())
      .then((json: { data?: Record<string, unknown>[]; error?: string }) => {
        setBills(Array.isArray(json.data) ? json.data : []);
      })
      .finally(() => setBillsLoading(false));
  }, [custCode]);

  const openBillDetail = (billNo: string) => {
    setBillDetailBillNo(billNo);
    setBillDetail(null);
    setBillDetailLoading(true);
    fetch(
      typeof window !== "undefined"
        ? `/api/billdtl?bill_no=${encodeURIComponent(billNo)}`
        : "",
    )
      .then((res) => res.json())
      .then((json: { data?: Record<string, unknown>[]; error?: string }) => {
        setBillDetail(Array.isArray(json.data) ? json.data : []);
      })
      .finally(() => setBillDetailLoading(false));
  };

  const closeBillDetail = () => {
    setBillDetail(null);
    setBillDetailBillNo(null);
  };

  const billNoKey = bills.length
    ? (Object.keys(bills[0]!).find(
        (k) => k.toUpperCase() === "BILLNO" || k.toUpperCase() === "BILL_NO",
      ) ?? Object.keys(bills[0]!)[0])
    : "BILLNO";

  const billTotalPages = Math.ceil(bills.length / BILL_PAGE_SIZE) || 1;
  const paginatedBills = useMemo(() => {
    const start = (billPage - 1) * BILL_PAGE_SIZE;
    return bills.slice(start, start + BILL_PAGE_SIZE);
  }, [bills, billPage]);

  const handleBillPageChange = (page: number) => {
    setBillPage(Math.max(1, Math.min(page, billTotalPages)));
  };

  useEffect(() => {
    setBillPage(1);
  }, [bills.length]);

  return (
    <>
      <Breadcrumb pageName="Wholesale Customer Details" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Customer Details {custCode ? `— ${custCode}` : ""}
          </h2>
          <Link
            href="/total-db/wholesale"
            className="rounded border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            ← Back to list
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-gray-dark">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-2 text-dark-6">Loading customer...</p>
          </div>
        ) : customer ? (
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Customer information
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(customer).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded border border-stroke bg-gray-2/50 p-3 dark:border-dark-3 dark:bg-dark-2/50"
                >
                  <div className="text-xs font-medium uppercase text-dark-6 dark:text-dark-5">
                    {LABELS[key] ?? key}
                  </div>
                  <div className="mt-1 text-sm font-medium text-dark dark:text-white">
                    {value != null ? String(value) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Bill headers (BILLHDR)
          </h3>
          {billsLoading ? (
            <div className="py-8 text-center text-dark-6">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2">Loading bills...</span>
            </div>
          ) : bills.length === 0 ? (
            <p className="py-6 text-center text-dark-6">No bills found for this customer.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2">
                      {Object.keys(bills[0]!).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left font-medium text-dark dark:text-white"
                        >
                          {key}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left font-medium text-dark dark:text-white">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBills.map((row, idx) => {
                      const no = row[billNoKey];
                      const billNo = no != null ? String(no) : "";
                      const handleRowClick = () => {
                        if (billNo) openBillDetail(billNo);
                      };
                      return (
                        <tr
                          key={idx}
                          role="button"
                          tabIndex={0}
                          onClick={handleRowClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRowClick();
                            }
                          }}
                          className="cursor-pointer border-b border-stroke transition-colors hover:bg-gray-2/50 dark:border-dark-3 dark:hover:bg-dark-2/50"
                        >
                          {Object.keys(bills[0]!).map((key) => (
                            <td
                              key={key}
                              className="px-4 py-3 text-dark dark:text-dark-5"
                            >
                              {row[key] != null ? String(row[key]) : "—"}
                            </td>
                          ))}
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => billNo && openBillDetail(billNo)}
                              className="text-primary hover:underline"
                            >
                              View details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {billTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stroke px-4 py-4 dark:border-dark-3">
                  <div className="text-sm text-dark-6 dark:text-dark-5">
                    Showing {(billPage - 1) * BILL_PAGE_SIZE + 1} to{" "}
                    {Math.min(billPage * BILL_PAGE_SIZE, bills.length)} of {bills.length} bills
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBillPageChange(billPage - 1)}
                      disabled={billPage === 1}
                      className="rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, billTotalPages) }, (_, i) => {
                        let pageNum: number;
                        if (billTotalPages <= 5) {
                          pageNum = i + 1;
                        } else if (billPage <= 3) {
                          pageNum = i + 1;
                        } else if (billPage >= billTotalPages - 2) {
                          pageNum = billTotalPages - 4 + i;
                        } else {
                          pageNum = billPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handleBillPageChange(pageNum)}
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                              billPage === pageNum
                                ? "bg-primary text-white"
                                : "text-dark hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-dark-2",
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBillPageChange(billPage + 1)}
                      disabled={billPage === billTotalPages}
                      className="rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bill details modal */}
      {(billDetail !== null || billDetailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeBillDetail}
          onKeyDown={(e) => e.key === "Escape" && closeBillDetail()}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-stroke bg-white shadow-xl dark:border-dark-3 dark:bg-gray-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stroke px-4 py-3 dark:border-dark-3">
              <h4 className="font-semibold text-dark dark:text-white">
                Bill details {billDetailBillNo ? `— ${billDetailBillNo}` : ""}
              </h4>
              <button
                type="button"
                onClick={closeBillDetail}
                className="rounded p-1 text-dark-6 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto p-4">
              {billDetailLoading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-2 text-dark-6">Loading bill lines...</p>
                </div>
              ) : billDetail?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2">
                        {Object.keys(billDetail[0]!).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-2 text-left font-medium text-dark dark:text-white"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {billDetail.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-stroke dark:border-dark-3"
                        >
                          {Object.keys(billDetail[0]!).map((key) => (
                            <td
                              key={key}
                              className="px-4 py-2 text-dark dark:text-dark-5"
                            >
                              {row[key] != null ? String(row[key]) : "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-6 text-center text-dark-6">No line items for this bill.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
