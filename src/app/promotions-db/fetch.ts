import { Promotion, generateMockPromotions } from "@/lib/mock-data";

export async function getPromotionsData(
  searchParams?: URLSearchParams,
): Promise<Promotion[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let promotions = generateMockPromotions(50);

  if (searchParams) {
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const division = searchParams.get("division");
    const dateRange = searchParams.get("dateRange");

    if (type) {
      promotions = promotions.filter((p) => p.type === type);
    }

    if (status) {
      promotions = promotions.filter((p) => p.status === status);
    }

    if (division) {
      const divisions = division.split(",");
      promotions = promotions.filter((p) =>
        p.divisions.some((d) => divisions.includes(d)),
      );
    }

    if (dateRange) {
      const [start, end] = dateRange.split(",");
      const startDate = new Date(start);
      const endDate = new Date(end);
      promotions = promotions.filter((p) => {
        const promoStart = new Date(p.startDate);
        return promoStart >= startDate && promoStart <= endDate;
      });
    }
  }

  return promotions;
}
