import { Customer, Division, generateMockCustomers } from "@/lib/mock-data";

export async function getTotalDbData(
  division?: Division,
  searchParams?: URLSearchParams,
): Promise<Customer[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let customers = generateMockCustomers(500);

  // Filter by division if provided
  if (division) {
    customers = customers.filter((c) => c.division === division);
  }

  // Apply filters from search params
  if (searchParams) {
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const nationality = searchParams.get("nationality");
    const loyaltyStatus = searchParams.get("loyaltyStatus");
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");

    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.id.toLowerCase().includes(searchLower) ||
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(search),
      );
    }

    if (location) {
      customers = customers.filter((c) => c.location === location);
    }

    if (nationality) {
      customers = customers.filter((c) => c.nationality === nationality);
    }

    if (loyaltyStatus) {
      customers = customers.filter((c) => c.loyaltyStatus === loyaltyStatus);
    }

    if (status) {
      customers = customers.filter((c) => c.status === status);
    }

    if (dateRange) {
      const [start, end] = dateRange.split(",");
      const startDate = new Date(start);
      const endDate = new Date(end);
      customers = customers.filter((c) => {
        const signupDate = new Date(c.signupDate);
        return signupDate >= startDate && signupDate <= endDate;
      });
    }
  }

  return customers;
}
