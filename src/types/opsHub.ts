export type CustomerStatus = "Active" | "Inactive";
export type ServiceCategoryType = "Cleaning" | "Pest Control" | "Commercial" | "Specialised" | "Other";
export type BookingStatusType = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
export type PaymentMethodType = "Cash" | "UPI" | "Card" | "Bank";
export type PaymentStatusType = "Paid" | "Pending" | "Refunded";
export type StaffRoleType = "Manager" | "Support" | "Technician" | "Cleaner";
export type NotificationType = "booking" | "payment" | "customer" | "appointment" | "service" | "reschedule";

export interface Customer {
  id: string; // C-001
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string; // SVC-001
  name: string;
  category: ServiceCategoryType;
  description: string;
  price: number;
  duration: string;
  status: "Active" | "Inactive";
}

export interface PestPlanItem {
  id: string; // PCT-001
  type: string;
  description: string;
  price: number;
  warrantyMonths: number;
  status: "Active" | "Inactive";
}

export interface StatusHistoryEntry {
  status: BookingStatusType;
  timestamp: string;
  note?: string;
}

export interface ExtraCharge {
  id: string;
  title: string;
  amount: number;
}

export interface BookingRecord {
  id: string; // PC-2026-1234
  customerId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:00 AM"
  address: string;
  assignedStaffId?: string;
  status: BookingStatusType;
  amount: number;
  advancePaid?: number;
  extraCharges?: ExtraCharge[];
  notes?: string;
  rescheduleRequestedDate?: string;
  rescheduleReason?: string;
  rescheduleRequestedAt?: string;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
  // Extra fields for website bookings (looked up when no matching customer exists)
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceName?: string;
}

export interface PaymentRecord {
  id: string; // INV-001
  bookingId: string;
  customerId: string;
  amount: number;
  method: PaymentMethodType;
  status: PaymentStatusType;
  date: string;
}

export interface TeamMember {
  id: string; // T-001
  name: string;
  role: StaffRoleType;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  joinedAt: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  relatedId?: string;
  targetTab?: string;
  read: boolean;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  dateFormat: string;
  timezone: string;
  workingHours: string;
  taxPercent?: number;
  bookingLeadHours?: number;
  emailAlerts: boolean;
  smsAlerts: boolean;
  inAppAlerts: boolean;
  twoFactorAuth: boolean;
}
