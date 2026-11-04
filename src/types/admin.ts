export type BookingStatus = "Pending" | "Confirmed" | "In progress" | "Completed" | "Cancelled";

export interface BookingTimelineItem {
  time: string;
  title: string;
  description: string;
}

export type PaymentStatus = "Paid" | "Unpaid";

export interface AdminBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: string;
  serviceName: string;
  area: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number | null;
  createdAt: string;
  serviceDate: string;
  statusUpdatedAt: string;
  assignedTechnician?: string;
  note?: string;
  timeline: BookingTimelineItem[];
}

export interface AdminService {
  id: string;
  slug: string;
  name: string;
  category: "Cleaning" | "Pest control" | "Commercial" | "Specialised";
  shortDesc: string;
  duration: string;
  bookingsCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  serviceName: string;
  comment: string;
  status: "Pending" | "Approved" | "Hidden";
  createdAt: string;
}

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: "Home cleaning" | "Pest prevention" | "Water hygiene" | "Seasonal care";
  author: string;
  date: string;
  status: "Published" | "Draft";
}

export interface AdminClientNote {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  note: string;
  handled: boolean;
  createdAt: string;
}

export interface OpsOverviewMetrics {
  totalBookings: {
    value: number;
    sublabel: string;
    badge: string;
  };
  pendingDispatch: {
    value: number;
    sublabel: string;
  };
  inProgress: {
    value: number;
    sublabel: string;
  };
  billedRevenue: {
    value: string;
    sublabel: string;
  };
}

export interface OpsPipelineFulfillment {
  percentage: number;
  summary: string;
  counts: {
    completed: number;
    inProgress: number;
    confirmed: number;
    pending: number;
  };
}

export type AdminTab = "overview" | "bookings" | "services" | "reviews" | "blog" | "messages";
