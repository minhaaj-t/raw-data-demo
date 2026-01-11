import { generateMockCustomers } from "@/lib/mock-data";

export interface OverviewData {
  totalCustomers: number;
  revenueByDivision: {
    division: string;
    revenue: number;
    growth: number;
  }[];
  topLocations: {
    location: string;
    customers: number;
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    date: Date;
  }[];
  retentionRate: number;
  newCustomers: number;
}

export async function getOverviewData(): Promise<OverviewData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50)); // Reduced delay

  const customers = generateMockCustomers(50000); // Generate 50K customers for overview (enough for stats)
  const divisions = ["retail", "wholesale", "restaurant", "food-factory", "distribution"];
  
  const revenueByDivision = divisions.map((div) => ({
    division: div.charAt(0).toUpperCase() + div.slice(1),
    revenue: Math.floor(Math.random() * 5000000) + 1000000, // 1M to 6M per division
    growth: (Math.random() * 20 - 10), // -10% to +10%
  }));

  // Use Qatar-based top locations with scaled customer counts
  const topLocations = [
    { location: "Doha City Centre", customers: Math.floor(Math.random() * 10000) + 15000 },
    { location: "Villaggio Mall", customers: Math.floor(Math.random() * 8000) + 12000 },
    { location: "Mall of Qatar", customers: Math.floor(Math.random() * 6000) + 8000 },
    { location: "Landmark Mall", customers: Math.floor(Math.random() * 4000) + 6000 },
    { location: "RFC", customers: Math.floor(Math.random() * 3000) + 5000 },
  ].sort((a, b) => b.customers - a.customers);

  // Generate realistic customer activities based on actual customer data
  const activityTypes = [
    "Customer Registration",
    "Order Placed",
    "Promotion Redeemed",
    "Event Registration",
    "Loyalty Points Earned",
    "Review Submitted",
    "Referral Bonus",
    "Account Upgrade"
  ];

  const customerNames = [
    "Ahmed Al-Mansoori", "Fatima Al-Kuwari", "Mohammed Al-Thani", "Aisha Al-Sulaiti",
    "Omar Al-Khalidi", "Noor Al-Mahmoud", "Sara Al-Rashid", "Khalid Al-Jaber",
    "Maryam Al-Zayed", "Abdullah Al-Hassan", "Lulwa Al-Mohammed", "Hamad Al-Sulaiman"
  ];

  const locations = [
    "Doha City Centre", "Villaggio Mall", "Mall of Qatar", "Landmark Mall",
    "RFC", "Al Wakrah", "Umm Salal", "Al Khor"
  ];

  const displayDivisions = ["Retail", "Wholesale", "Restaurant", "Food Factory", "Distribution"];

  const recentActivities = Array.from({ length: 10 }, (_, i) => {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const division = displayDivisions[Math.floor(Math.random() * displayDivisions.length)];

    let description = "";

    switch (type) {
      case "Customer Registration":
        description = `${customerName} registered from ${location}`;
        break;
      case "Order Placed":
        const orderAmount = Math.floor(Math.random() * 500) + 50;
        description = `${customerName} placed QR${orderAmount} order in ${division}`;
        break;
      case "Promotion Redeemed":
        const discount = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
        description = `${customerName} redeemed ${discount}% discount at ${location}`;
        break;
      case "Event Registration":
        const events = ["Qatar Marathon", "Food Festival", "Shopping Event", "Charity Run"];
        const event = events[Math.floor(Math.random() * events.length)];
        description = `${customerName} registered for ${event}`;
        break;
      case "Loyalty Points Earned":
        const points = Math.floor(Math.random() * 500) + 100;
        description = `${customerName} earned ${points} loyalty points`;
        break;
      case "Review Submitted":
        const rating = [4, 5][Math.floor(Math.random() * 2)];
        description = `${customerName} gave ${rating}-star review for recent purchase`;
        break;
      case "Referral Bonus":
        description = `${customerName} received referral bonus for bringing new customer`;
        break;
      case "Account Upgrade":
        description = `${customerName} upgraded to Gold membership status`;
        break;
      default:
        description = `${customerName} completed ${type.toLowerCase()}`;
    }

    return {
      id: `ACT-${String(i + 1).padStart(3, '0')}`,
      type,
      description,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by most recent first

  return {
    totalCustomers: customers.length,
    revenueByDivision,
    topLocations,
    recentActivities,
    retentionRate: 75.5 + Math.random() * 10,
  newCustomers: Math.floor(Math.random() * 5000) + 1000, // 1K to 6K new customers
  };
}
