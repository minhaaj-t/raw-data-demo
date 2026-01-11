// Mock data utilities for all pages

export type Division = "retail" | "wholesale" | "restaurant" | "food-factory" | "distribution";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  division: Division;
  location: string;
  loyaltyStatus: "gold" | "silver" | "bronze" | "none";
  signupDate: Date;
  orderHistory: number;
  totalSpent: number;
  status: "active" | "inactive";
  nationality: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: "discount" | "bundle" | "loyalty-points";
  status: "active" | "past" | "scheduled";
  redemptions: number;
  conversionRate: number;
  divisions: Division[];
  startDate: Date;
  endDate: Date;
  customers: string[]; // Array of customer IDs who participated in this promotion
}

export interface Event {
  id: string;
  name: string;
  type: "marathon" | "giveaway" | "sports" | "other" | "tournament" | "competition" | "charity" | "concert" | "festival";
  date: Date;
  status: "upcoming" | "ongoing" | "completed";
  participants: number;
  newCustomers: number;
  salesSpike: number;
  location: string;
  participantNames: string[]; // Array of participant names
  playerNames?: string[]; // For sports events
  winnerNames: string[]; // Array of winner names
  prizeAmount?: number; // Prize money for winners
  eventCategory: "sports" | "entertainment" | "charity" | "competition" | "cultural";
  registrationFee?: number;
  maxCapacity: number;
  sponsors?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "app";
  status: "draft" | "scheduled" | "sent" | "completed";
  segment: string;
  sent: number;
  opened: number;
  clicked: number;
  scheduledDate?: Date;
  sentDate?: Date;
}

// Generate mock customers with diverse nationalities
export function generateMockCustomers(count: number = 100): Customer[] {
  const divisions: Division[] = ["retail", "wholesale", "restaurant", "food-factory", "distribution"];
  const loyaltyStatuses: Customer["loyaltyStatus"][] = ["gold", "silver", "bronze", "none"];

  // Diverse customer profiles with authentic names
  const customerProfiles = [
    // Indian (various regions)
    { names: ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sunita Singh", "Rajesh Gupta", "Meera Joshi", "Sanjay Verma", "Kavita Sharma", "Ravi Kumar", "Anita Patel"], nationality: "Indian" },
    // Pakistani
    { names: ["Ahmed Khan", "Fatima Ali", "Muhammad Khan", "Aisha Khan", "Omar Khan", "Zara Khan", "Bilal Khan", "Hina Khan", "Tariq Khan", "Sadia Khan"], nationality: "Pakistani" },
    // Bangladeshi
    { names: ["Mohammad Rahman", "Fatema Begum", "Abdul Karim", "Rina Akhter", "Hasan Mahmud", "Shamima Khan", "Rahman Ali", "Nasrin Begum", "Jamal Hossain", "Farida Khan"], nationality: "Bangladeshi" },
    // Sri Lankan
    { names: ["Arjun Fernando", "Priya Fernando", "Nimal Perera", "Kumari Silva", "Rohan Fernando", "Anjali Fernando", "Saman Perera", "Nisha Silva", "Chaminda Fernando", "Dilini Fernando"], nationality: "Sri Lankan" },
    // Nepali
    { names: ["Rajesh Thapa", "Priya Sharma", "Amit Gurung", "Sunita Rai", "Bikash Tamang", "Meera Sherpa", "Sanjay Lama", "Kavita Gurung", "Ravi Thapa", "Anita Rai"], nationality: "Nepali" },
    // Bhutanese
    { names: ["Tashi Dorji", "Deki Wangmo", "Karma Tshering", "Yangchen Dorji", "Sonam Wangchuk", "Pema Dorji", "Kinley Tshering", "Chimi Wangmo", "Jigme Dorji", "Dechen Wangmo"], nationality: "Bhutanese" },
    // Maldivian
    { names: ["Ahmed Hassan", "Aishath Mohamed", "Mohamed Ali", "Fathimath Ibrahim", "Ibrahim Hassan", "Mariyam Ali", "Hassan Mohamed", "Aminath Ibrahim", "Ahmed Ali", "Hawwa Hassan"], nationality: "Maldivian" },
    // Afghan
    { names: ["Ahmad Khan", "Fatima Karimi", "Mohammad Reza", "Zara Ahmad", "Rahman Ali", "Layla Khan", "Tariq Reza", "Aisha Karimi", "Jamal Ahmad", "Nadia Khan"], nationality: "Afghan" },
  ];

  const locations = [
    "Doha", "Al Wakrah", "Al Khor", "Umm Salal", "Al Shamal", "Al Daayen", "Al Rayyan", "Lusail",
    "Doha City Centre", "Villaggio Mall", "Mall of Qatar", "Landmark Mall", "Gulf Mall",
    "RFC", "RFSS", "Grand Hyper", "Rawabi Hyper", "Ajmal Electronics"
  ];

  return Array.from({ length: count }, (_, i) => {
    const profile = customerProfiles[Math.floor(Math.random() * customerProfiles.length)];
    const name = profile.names[Math.floor(Math.random() * profile.names.length)];

    return {
      id: `CUST-${String(i + 1).padStart(6, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@${['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'][Math.floor(Math.random() * 4)]}`,
      phone: `+974${String(Math.floor(Math.random() * 40000000) + 30000000)}`,
      division: divisions[Math.floor(Math.random() * divisions.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      loyaltyStatus: loyaltyStatuses[Math.floor(Math.random() * loyaltyStatuses.length)],
      signupDate: new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      orderHistory: Math.floor(Math.random() * 200),
      totalSpent: Math.floor(Math.random() * 50000),
      status: Math.random() > 0.2 ? "active" : "inactive",
      nationality: profile.nationality,
    };
  });
}

// Generate mock promotions
export function generateMockPromotions(count: number = 50): Promotion[] {
  const types: Promotion["type"][] = ["discount", "bundle", "loyalty-points"];
  const statuses: Promotion["status"][] = ["active", "past", "scheduled"];
  const divisions: Division[] = ["retail", "wholesale", "restaurant", "food-factory", "distribution"];

  return Array.from({ length: count }, (_, i) => {
    // Generate random number of customers (1-20) for this promotion
    const customerCount = Math.floor(Math.random() * 20) + 1;
    const customers: string[] = [];

    // Generate unique customer IDs for this promotion
    const usedIds = new Set<number>();
    while (customers.length < customerCount) {
      const customerId = Math.floor(Math.random() * 10000) + 1;
      if (!usedIds.has(customerId)) {
        usedIds.add(customerId);
        customers.push(`CUST-${String(customerId).padStart(6, "0")}`);
      }
    }

    return {
      id: `PROMO-${String(i + 1).padStart(4, "0")}`,
      name: `Promotion ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      redemptions: Math.floor(Math.random() * 500000),
      conversionRate: Math.random() * 30,
      divisions: divisions.slice(0, Math.floor(Math.random() * divisions.length) + 1),
      startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      endDate: new Date(2024, Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 28) + 1),
      customers,
    };
  });
}

// Generate mock events with detailed participant and winner information
export function generateMockEvents(count: number = 30): Event[] {
  const types: Event["type"][] = ["marathon", "giveaway", "sports", "other", "tournament", "competition", "charity", "concert", "festival"];
  const statuses: Event["status"][] = ["upcoming", "ongoing", "completed"];
  const locations = ["Doha", "Al Wakrah", "Al Khor", "Umm Salal", "Al Shamal", "Al Daayen", "Al Rayyan", "Lusail", "Villaggio Mall", "Mall of Qatar"];
  const categories: Event["eventCategory"][] = ["sports", "entertainment", "charity", "competition", "cultural"];
  const sponsors = ["Qatar Airways", "Doha Bank", "Ooredoo", "Qatar Foundation", "Qatar Tourism", "Ezdan", "Hamad International Airport"];

  // Sample names for participants and winners
  const firstNames = ["Ahmed", "Mohammed", "Fatima", "Aisha", "Omar", "Khalid", "Noor", "Sara", "Abdullah", "Maryam", "Hamad", "Lulwa"];
  const lastNames = ["Al-Mansoori", "Al-Hamad", "Al-Kuwari", "Al-Thani", "Al-Sulaiti", "Al-Mahmoud", "Al-Rashid", "Al-Zayed", "Al-Hassan", "Al-Jaber"];

  const generateNames = (count: number): string[] => {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      names.push(`${firstName} ${lastName}`);
    }
    return names;
  };

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const participants = Math.floor(Math.random() * 1000) + 10; // 10-1000 participants
    const winnerCount = Math.max(1, Math.floor(participants * 0.1)); // Up to 10% winners

    // Generate participant and winner names
    const participantNames = generateNames(Math.min(participants, 20)); // Show up to 20 names
    const winnerNames = generateNames(Math.min(winnerCount, 5)); // Up to 5 winners

    // Generate player names for sports events
    const playerNames = type === "sports" || type === "tournament" || type === "competition"
      ? generateNames(Math.floor(Math.random() * 50) + 10)
      : undefined;

    return {
      id: `EVT-${String(i + 1).padStart(4, "0")}`,
      name: type === "marathon" ? `Qatar ${type.charAt(0).toUpperCase() + type.slice(1)} ${2024 + Math.floor(Math.random() * 3)}`
             : type === "sports" ? `${locations[Math.floor(Math.random() * locations.length)]} ${type.charAt(0).toUpperCase() + type.slice(1)} Championship`
             : type === "giveaway" ? `${sponsors[Math.floor(Math.random() * sponsors.length)]} ${type.charAt(0).toUpperCase() + type.slice(1)}`
             : type === "tournament" ? `Qatar ${["Football", "Basketball", "Tennis", "Swimming", "Athletics"][Math.floor(Math.random() * 5)]} ${type.charAt(0).toUpperCase() + type.slice(1)}`
             : type === "charity" ? `${["Cancer Research", "Education", "Environment", "Healthcare", "Community"][Math.floor(Math.random() * 5)]} ${type.charAt(0).toUpperCase() + type.slice(1)} Event`
             : type === "concert" ? `${["Arabian", "Western", "Fusion", "Jazz", "Rock"][Math.floor(Math.random() * 5)]} Music ${type.charAt(0).toUpperCase() + type.slice(1)}`
             : type === "festival" ? `Qatar ${["Cultural", "Food", "Art", "Music", "Film"][Math.floor(Math.random() * 5)]} ${type.charAt(0).toUpperCase() + type.slice(1)}`
             : `Qatar ${type.charAt(0).toUpperCase() + type.slice(1)} Event ${i + 1}`,
      type,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      status,
      participants,
      newCustomers: Math.floor(Math.random() * Math.max(1, participants * 0.2)),
      salesSpike: Math.random() * 50,
      location: locations[Math.floor(Math.random() * locations.length)],
      participantNames,
      playerNames,
      winnerNames,
      prizeAmount: Math.random() > 0.7 ? Math.floor(Math.random() * 100000) + 10000 : undefined,
      eventCategory: categories[Math.floor(Math.random() * categories.length)],
      registrationFee: Math.random() > 0.8 ? Math.floor(Math.random() * 500) + 50 : undefined,
      maxCapacity: Math.floor(Math.random() * 5000) + 100,
      sponsors: Math.random() > 0.6 ? sponsors.slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
    };
  });
}

// Generate mock campaigns
export function generateMockCampaigns(count: number = 40): Campaign[] {
  const types: Campaign["type"][] = ["email", "sms", "app"];
  const statuses: Campaign["status"][] = ["draft", "scheduled", "sent", "completed"];
  const segments = ["All Customers", "Gold Members", "New Customers", "Inactive Customers", "High Value"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `CAMP-${String(i + 1).padStart(4, "0")}`,
    name: `Campaign ${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    segment: segments[Math.floor(Math.random() * segments.length)],
    sent: Math.floor(Math.random() * 5000000),
    opened: Math.floor(Math.random() * 2500000),
    clicked: Math.floor(Math.random() * 500000),
    scheduledDate: statuses.includes("scheduled") ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
    sentDate: statuses.includes("sent") || statuses.includes("completed") ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
  }));
}
