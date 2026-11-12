import {
  Customer,
  ServiceItem,
  PestPlanItem,
  BookingRecord,
  PaymentRecord,
  TeamMember,
  AppNotification,
  BusinessSettings,
} from "@/types/opsHub";

export const SEED_CUSTOMERS: Customer[] = [];

export const SEED_SERVICES: ServiceItem[] = [
  { id: "SVC-001", name: "Full House Deep Cleaning", category: "Cleaning", description: "Comprehensive top-to-bottom sanitisation, single-disc scrubbing, windows & kitchen degreasing", price: 2999, duration: "4-6 hours", status: "Active" },
  { id: "SVC-002", name: "Normal & Regular House Cleaning", category: "Cleaning", description: "Routine sweeping, mopping, dusting, furniture wipe-down and surface sanitisation", price: 1200, duration: "2-3 hours", status: "Active" },
  { id: "SVC-003", name: "Kitchen Deep Cleaning", category: "Cleaning", description: "Heavy oil degreasing of chimneys, tiles, modular cabinets inside-out & countertops", price: 1499, duration: "2-3 hours", status: "Active" },
  { id: "SVC-004", name: "Bathroom Deep Cleaning", category: "Cleaning", description: "Intensive hard-water stain removal, grout scrubbing, limescale and tile descaling", price: 899, duration: "1.5-2 hours", status: "Active" },
  { id: "SVC-005", name: "Bathroom Steam Sanitisation", category: "Cleaning", description: "140°C high-pressure chemical-free steam cleaning for 99.9% germ and mold eradication", price: 1199, duration: "1.5-2 hours", status: "Active" },
  { id: "SVC-006", name: "Floor Scrubbing & Polishing", category: "Cleaning", description: "Mechanized single-disc rotary scrubbing for vitrified tiles, granite, Kota stone & marble", price: 1800, duration: "2-3 hours", status: "Active" },
  { id: "SVC-007", name: "Water Tank & Sump Cleaning", category: "Cleaning", description: "6-stage mechanized cleaning, sludge vacuum extraction and UV disinfection", price: 1299, duration: "2-3 hours", status: "Active" },
  { id: "SVC-008", name: "Sofa, Mattress & Carpet Shampooing", category: "Specialised", description: "Deep injection-extraction foam wash removing stains, dust mites, and odors", price: 1499, duration: "2-3 hours", status: "Active" },
  { id: "SVC-009", name: "Outdoor & Interlock Paver Cleaning", category: "Cleaning", description: "High-PSI pressure washing to strip moss, black fungal slime, and driveway grime", price: 1599, duration: "2-3 hours", status: "Active" },
  { id: "SVC-010", name: "Glass & Facade Cleaning", category: "Commercial", description: "Streak-free window, glass railing, and architectural glazing with telescopic kits", price: 1299, duration: "2-3 hours", status: "Active" },
  { id: "SVC-011", name: "General Pest Control", category: "Pest Control", description: "Integrated pest management using odorless Bayer/Syngenta spray for roaches, ants and spiders", price: 999, duration: "1-2 hours", status: "Active" },
  { id: "SVC-012", name: "Anti-Termite Treatment (Pre & Post)", category: "Pest Control", description: "Subterranean termite defense with perimeter drilling and long-term warranty certificate", price: 4499, duration: "3-5 hours", status: "Active" },
  { id: "SVC-013", name: "Cockroach Gel & Herbal Treatment", category: "Pest Control", description: "Precision odorless gel baiting in kitchen modular drawers without moving utensils", price: 799, duration: "1 hour", status: "Active" },
  { id: "SVC-014", name: "Bed Bugs Eradication & Steam Wash", category: "Pest Control", description: "Dual-stage residual knockdown spray plus high-heat thermal mattress steaming", price: 1899, duration: "2 hours", status: "Active" },
  { id: "SVC-015", name: "Rodent & Rat Control", category: "Pest Control", description: "Tamper-proof bait stations, heavy-duty glue traps, and entry point exclusion", price: 999, duration: "1-2 hours", status: "Active" },
  { id: "SVC-016", name: "Mosquito Control & Thermal Fogging", category: "Pest Control", description: "Biological larvicide drain treatment and outdoor thermal fogging for compounds", price: 1199, duration: "1-2 hours", status: "Active" },
];

export const SEED_PEST_PLANS: PestPlanItem[] = [
  { id: "PCT-001", type: "General Pest Control", description: "Covers all household pests including cockroaches, ants and spiders", price: 800, warrantyMonths: 3, status: "Active" },
  { id: "PCT-002", type: "Termite Treatment", description: "Anti-termite drilling, piping, chemical barrier guarantee", price: 1200, warrantyMonths: 24, status: "Active" },
  { id: "PCT-003", type: "Mosquito Control", description: "Outdoor & indoor thermal fogging & larval breeding site treatment", price: 600, warrantyMonths: 1, status: "Active" },
  { id: "PCT-004", type: "Rodent Control", description: "Industrial bait stations and humane trapping with follow-up removal", price: 800, warrantyMonths: 3, status: "Active" },
];

export const SEED_TEAM: TeamMember[] = [];

export const SEED_BOOKINGS: BookingRecord[] = [];

export const SEED_PAYMENTS: PaymentRecord[] = [];

export const SEED_NOTIFICATIONS: AppNotification[] = [];

export const SEED_SETTINGS: BusinessSettings = {
  businessName: "Plan C Operations Hub",
  phone: "+91 98765 43210",
  email: "info@plancsolutions.in",
  address: "Thrikannapuram, Thiruvananthapuram, Kerala 695032",
  currency: "INR (₹)",
  dateFormat: "DD/MM/YYYY",
  timezone: "Asia/Kolkata (IST)",
  workingHours: "07:00 AM – 09:00 PM",
  emailAlerts: true,
  smsAlerts: true,
  inAppAlerts: true,
  twoFactorAuth: false,
};

