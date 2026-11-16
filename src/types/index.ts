export type ServiceCategory = 'cleaning' | 'pest_control' | 'commercial' | 'specialised';

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  short_desc: string;
  long_desc: string;
  image_url: string;
  icon?: string;
  duration?: string;
  is_featured: boolean;
  is_active?: boolean;
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'In progress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  booking_code: string;
  name: string;
  email?: string;
  phone: string;
  service_id?: string;
  service_name: string;
  address: string;
  preferred_date?: string;
  reschedule_requested_date?: string | null;
  reschedule_reason?: string | null;
  reschedule_requested_at?: string | null;
  message?: string;
  status: BookingStatus;
  amount?: number | null;
  is_paid?: boolean;
  assigned_team?: string;
  admin_notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  service_id?: string;
  service_name?: string;
  comment: string;
  approved: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
  published_at: string;
}

export interface FAQ {
  id: string;
  service_id?: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  phone: string;
  phone_display: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  experience_years: string;
  service_areas: string;
}
