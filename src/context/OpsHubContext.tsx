"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Customer,
  ServiceItem,
  PestPlanItem,
  BookingRecord,
  PaymentRecord,
  TeamMember,
  AppNotification,
  BusinessSettings,
  BookingStatusType,
  PaymentStatusType,
  ExtraCharge,
  ServiceCategoryType,
} from "@/types/opsHub";
import { Service, Booking } from "@/types";
import {
  SEED_CUSTOMERS,
  SEED_SERVICES,
  SEED_PEST_PLANS,
  SEED_TEAM,
  SEED_BOOKINGS,
  SEED_PAYMENTS,
  SEED_NOTIFICATIONS,
  SEED_SETTINGS,
} from "@/lib/opsHubSeed";

interface OpsHubContextType {
  customers: Customer[];
  services: ServiceItem[];
  pestPlans: PestPlanItem[];
  team: TeamMember[];
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  notifications: AppNotification[];
  settings: BusinessSettings;

  // Actions
  addCustomer: (data: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => boolean;

  addService: (data: Omit<ServiceItem, "id">) => ServiceItem;
  updateService: (id: string, patch: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  addPestPlan: (data: Omit<PestPlanItem, "id">) => PestPlanItem;
  updatePestPlan: (id: string, patch: Partial<PestPlanItem>) => void;
  deletePestPlan: (id: string) => void;

  addTeamMember: (data: Omit<TeamMember, "id" | "joinedAt">) => TeamMember;
  updateTeamMember: (id: string, patch: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  addBooking: (data: {
    customerId: string;
    serviceId: string;
    date: string;
    time: string;
    address: string;
    assignedStaffId?: string;
    notes?: string;
    amount?: number;
  }) => BookingRecord;
  updateBookingStatus: (id: string, newStatus: BookingStatusType, note?: string) => void;
  updateBookingPricing: (
    id: string,
    pricing: { amount?: number; advancePaid?: number; extraCharges?: ExtraCharge[] }
  ) => void;
  deleteBooking: (id: string) => void;

  updatePaymentStatus: (id: string, newStatus: PaymentStatusType) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  updateSettings: (patch: Partial<BusinessSettings>) => void;
  resetAllData: () => void;

  // Lookups
  getCustomerById: (id: string) => Customer | undefined;
  getServiceById: (id: string) => ServiceItem | undefined;
  getTeamMemberById: (id: string) => TeamMember | undefined;
}

export const defaultFallbackOpsHub: OpsHubContextType = {
  customers: SEED_CUSTOMERS,
  services: SEED_SERVICES,
  pestPlans: SEED_PEST_PLANS,
  team: SEED_TEAM,
  bookings: SEED_BOOKINGS,
  payments: SEED_PAYMENTS,
  notifications: SEED_NOTIFICATIONS,
  settings: SEED_SETTINGS,
  addCustomer: (data) => ({
    ...data,
    id: `C-${Date.now()}`,
    createdAt: "Just now",
  }),
  updateCustomer: () => {},
  deleteCustomer: () => true,
  addService: (data) => ({
    ...data,
    id: `SVC-${Date.now()}`,
  }),
  updateService: () => {},
  deleteService: () => {},
  addPestPlan: (data) => ({
    ...data,
    id: `PCT-${Date.now()}`,
  }),
  updatePestPlan: () => {},
  deletePestPlan: () => {},
  addTeamMember: (data) => ({
    ...data,
    id: `T-${Date.now()}`,
    joinedAt: "Just now",
  }),
  updateTeamMember: () => {},
  deleteTeamMember: () => {},
  addBooking: (data) => ({
    id: `PC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: data.customerId,
    serviceId: data.serviceId,
    date: data.date,
    time: data.time,
    address: data.address,
    assignedStaffId: data.assignedStaffId || "T-003",
    status: "Pending",
    amount: data.amount || 1200,
    notes: data.notes,
    createdAt: "Just now",
    statusHistory: [],
  }),
  updateBookingStatus: () => {},
  updateBookingPricing: () => {},
  deleteBooking: () => {},
  updatePaymentStatus: () => {},
  markNotificationAsRead: () => {},
  markAllNotificationsAsRead: () => {},
  deleteNotification: () => {},
  updateSettings: () => {},
  resetAllData: () => {},
  getCustomerById: (id: string) => SEED_CUSTOMERS.find((c) => c.id === id),
  getServiceById: (id: string) => SEED_SERVICES.find((s) => s.id === id),
  getTeamMemberById: (id: string) => SEED_TEAM.find((t) => t.id === id),
};

const OpsHubContext = createContext<OpsHubContextType>(defaultFallbackOpsHub);

const STORAGE_KEY = "planc_opshub_state_v2";

function mapWebsiteServiceToServiceItem(s: Service): ServiceItem {
  let cat: ServiceCategoryType = "Cleaning";
  if (s.category === "pest_control") cat = "Pest Control";
  else if (s.category === "commercial") cat = "Commercial";
  else if (s.category === "specialised") cat = "Specialised";

  return {
    id: s.id,
    name: s.title,
    category: cat,
    description: s.short_desc || s.long_desc || "",
    price: (s as any).price || 1200,
    duration: s.duration || "2–3 hours",
    status: s.is_active === false ? "Inactive" : "Active",
  };
}

function mapWebsiteBookingToRecord(b: Booking, existingServices: ServiceItem[]): BookingRecord {
  // Find matching service by name
  const matchedSvc = existingServices.find(
    (s) => s.name.toLowerCase() === (b.service_name || "").toLowerCase()
  );
  const dateStr = b.preferred_date || b.created_at?.split("T")[0] || new Date().toISOString().split("T")[0];

  const statusMap: Record<string, BookingStatusType> = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    "In Progress": "In Progress",
    Completed: "Completed",
    Cancelled: "Cancelled",
  };

  return {
    id: b.booking_code || b.id,
    customerId: `WEB-${b.phone?.replace(/\D/g, "").slice(-10) || Date.now()}`,
    serviceId: matchedSvc?.id || "SVC-001",
    date: dateStr,
    time: "10:00 AM",
    address: b.address || "",
    assignedStaffId: "T-003",
    status: statusMap[b.status] || "Pending",
    amount: b.amount ?? 0,
    notes: [b.message, b.admin_notes].filter(Boolean).join(" · ") || `Website booking from ${b.name}`,
    createdAt: b.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
    statusHistory: [
      {
        status: statusMap[b.status] || "Pending",
        timestamp: b.created_at
          ? new Date(b.created_at).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Website submission",
      },
    ],
    customerName: b.name,
    customerPhone: b.phone,
    customerEmail: b.email,
    serviceName: b.service_name,
  };
}

export function OpsHubProvider({
  children,
  initialServices,
  initialBookings,
}: {
  children: React.ReactNode;
  initialServices?: Service[];
  initialBookings?: Booking[];
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);
  const [services, setServices] = useState<ServiceItem[]>(() => {
    if (initialServices && initialServices.length > 0) {
      return initialServices.map(mapWebsiteServiceToServiceItem);
    }
    return SEED_SERVICES;
  });
  const [pestPlans, setPestPlans] = useState<PestPlanItem[]>(SEED_PEST_PLANS);
  const [team, setTeam] = useState<TeamMember[]>(SEED_TEAM);
  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_BOOKINGS);
  const [payments, setPayments] = useState<PaymentRecord[]>(SEED_PAYMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [settings, setSettings] = useState<BusinessSettings>(SEED_SETTINGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.services && Array.isArray(parsed.services) && parsed.services.length >= 10) {
          setServices(parsed.services);
        } else if (initialServices && initialServices.length > 0) {
          setServices(initialServices.map(mapWebsiteServiceToServiceItem));
        }
        if (parsed.pestPlans) setPestPlans(parsed.pestPlans);
        if (parsed.team) setTeam(parsed.team);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.settings) setSettings(parsed.settings);
      } else if (initialServices && initialServices.length > 0) {
        setServices(initialServices.map(mapWebsiteServiceToServiceItem));
      }
    } catch (e) {
      console.error("Failed to load OpsHub state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, [initialServices]);

  // Merge website bookings (from server) into local state
  useEffect(() => {
    if (!isLoaded || !initialBookings || initialBookings.length === 0) return;

    // Resolve services for the mapper
    const currentServices = services;

    setBookings((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const mapped = initialBookings
        .map((wb) => mapWebsiteBookingToRecord(wb, currentServices))
        .filter((wb) => !existingIds.has(wb.id));

      if (mapped.length === 0) return prev;

      // Also auto-create customer records for new website bookings
      setCustomers((prevCustomers) => {
        const existingPhones = new Set(prevCustomers.map((c) => c.phone));
        const newCustomers: Customer[] = [];
        for (const wb of initialBookings) {
          if (wb.phone && !existingPhones.has(wb.phone)) {
            existingPhones.add(wb.phone);
            newCustomers.push({
              id: `WEB-${wb.phone.replace(/\D/g, "").slice(-10)}`,
              name: wb.name || "Website Customer",
              phone: wb.phone,
              email: wb.email || "",
              address: wb.address || "",
              district: "Trivandrum",
              status: "Active",
              notes: "Auto-created from website booking",
              createdAt: wb.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            });
          }
        }
        if (newCustomers.length === 0) return prevCustomers;
        return [...newCustomers, ...prevCustomers];
      });

      return [...mapped, ...prev];
    });
  }, [isLoaded, initialBookings, services]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          customers,
          services,
          pestPlans,
          team,
          bookings,
          payments,
          notifications,
          settings,
        })
      );
    } catch (e) {
      console.error("Failed to persist OpsHub state", e);
    }
  }, [customers, services, pestPlans, team, bookings, payments, notifications, settings, isLoaded]);

  // Helpers
  const getCustomerById = (id: string) => customers.find((c) => c.id === id);
  const getServiceById = (id: string) => services.find((s) => s.id === id);
  const getTeamMemberById = (id: string) => team.find((t) => t.id === id);

  const notify = (message: string, type: AppNotification["type"], relatedId?: string, targetTab?: string) => {
    const newNotif: AppNotification = {
      id: `N-${String(Date.now()).slice(-4)}`,
      type,
      message,
      relatedId,
      targetTab,
      read: false,
      createdAt: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Actions: Customer
  const addCustomer = (data: Omit<Customer, "id" | "createdAt">): Customer => {
    const nextNum = customers.length + 1;
    const newCust: Customer = {
      ...data,
      id: `C-${String(nextNum).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    notify(`New customer added: ${newCust.name}`, "customer", newCust.id, "customers");
    return newCust;
  };

  const updateCustomer = (id: string, patch: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const deleteCustomer = (id: string): boolean => {
    // Check if customer has active bookings
    const hasBookings = bookings.some((b) => b.customerId === id);
    if (hasBookings) {
      return false;
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  // Actions: Services
  const addService = (data: Omit<ServiceItem, "id">): ServiceItem => {
    const nextNum = services.length + 1;
    const newSvc: ServiceItem = {
      ...data,
      id: `SVC-${String(nextNum).padStart(3, "0")}`,
    };
    setServices((prev) => [newSvc, ...prev]);
    notify(`New service created: ${newSvc.name}`, "service", newSvc.id, "services");
    return newSvc;
  };

  const updateService = (id: string, patch: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Actions: Pest Plans
  const addPestPlan = (data: Omit<PestPlanItem, "id">): PestPlanItem => {
    const nextNum = pestPlans.length + 1;
    const newPlan: PestPlanItem = {
      ...data,
      id: `PCT-${String(nextNum).padStart(3, "0")}`,
    };
    setPestPlans((prev) => [newPlan, ...prev]);
    notify(`New pest plan created: ${newPlan.type}`, "service", newPlan.id, "pest-control");
    return newPlan;
  };

  const updatePestPlan = (id: string, patch: Partial<PestPlanItem>) => {
    setPestPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deletePestPlan = (id: string) => {
    setPestPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Actions: Team
  const addTeamMember = (data: Omit<TeamMember, "id" | "joinedAt">): TeamMember => {
    const nextNum = team.length + 1;
    const newMember: TeamMember = {
      ...data,
      id: `T-${String(nextNum).padStart(3, "0")}`,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setTeam((prev) => [newMember, ...prev]);
    return newMember;
  };

  const updateTeamMember = (id: string, patch: Partial<TeamMember>) => {
    setTeam((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions: Bookings
  const addBooking = (data: {
    customerId: string;
    serviceId: string;
    date: string;
    time: string;
    address: string;
    assignedStaffId?: string;
    notes?: string;
    amount?: number;
  }): BookingRecord => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `PC-${new Date().getFullYear()}-${randomSuffix}`;
    const svc = services.find((s) => s.id === data.serviceId);
    const cost = data.amount ?? (svc ? svc.price : 1200);

    const newBooking: BookingRecord = {
      id: bookingId,
      customerId: data.customerId,
      serviceId: data.serviceId,
      date: data.date,
      time: data.time,
      address: data.address,
      assignedStaffId: data.assignedStaffId || "T-003",
      status: "Confirmed",
      amount: cost,
      notes: data.notes || "",
      createdAt: new Date().toISOString().split("T")[0],
      statusHistory: [
        {
          status: "Confirmed",
          timestamp: "Just now",
          note: "Appointment scheduled via admin operations console",
        },
      ],
    };

    // Auto-create matching payment record
    const nextInvNum = payments.length + 1;
    const newInvoice: PaymentRecord = {
      id: `INV-${String(nextInvNum).padStart(3, "0")}`,
      bookingId: newBooking.id,
      customerId: newBooking.customerId,
      amount: newBooking.amount,
      method: "UPI",
      status: "Pending",
      date: newBooking.date,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setPayments((prev) => [newInvoice, ...prev]);

    const custName = getCustomerById(data.customerId)?.name || "Customer";
    notify(`New booking confirmed for ${custName} (${newBooking.id})`, "booking", newBooking.id, "bookings");

    return newBooking;
  };

  const updateBookingStatus = (id: string, newStatus: BookingStatusType, note?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status: newStatus,
          statusHistory: [
            ...b.statusHistory,
            {
              status: newStatus,
              timestamp: "Just now",
              note: note || `Status changed to ${newStatus}`,
            },
          ],
        };
      })
    );

    // If marked completed, mark invoice paid if it was pending
    if (newStatus === "Completed") {
      setPayments((prev) =>
        prev.map((p) => (p.bookingId === id ? { ...p, status: "Paid" } : p))
      );
    }

    notify(`Booking ${id} status updated to ${newStatus}`, "booking", id, "bookings");
  };

  const updateBookingPricing = (
    id: string,
    pricing: { amount?: number; advancePaid?: number; extraCharges?: ExtraCharge[] }
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          ...(pricing.amount !== undefined ? { amount: pricing.amount } : {}),
          ...(pricing.advancePaid !== undefined ? { advancePaid: pricing.advancePaid } : {}),
          ...(pricing.extraCharges !== undefined ? { extraCharges: pricing.extraCharges } : {}),
        };
      })
    );

    if (pricing.amount !== undefined) {
      setPayments((prev) =>
        prev.map((p) => (p.bookingId === id ? { ...p, amount: pricing.amount! } : p))
      );
    }
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setPayments((prev) => prev.filter((p) => p.bookingId !== id));
  };

  // Actions: Payments
  const updatePaymentStatus = (id: string, newStatus: PaymentStatusType) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    notify(`Invoice ${id} marked as ${newStatus}`, "payment", id, "payments");
  };

  // Actions: Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Actions: Settings
  const updateSettings = (patch: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const resetAllData = () => {
    setCustomers(SEED_CUSTOMERS);
    setServices(SEED_SERVICES);
    setPestPlans(SEED_PEST_PLANS);
    setTeam(SEED_TEAM);
    setBookings(SEED_BOOKINGS);
    setPayments(SEED_PAYMENTS);
    setNotifications(SEED_NOTIFICATIONS);
    setSettings(SEED_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      customers,
      services,
      pestPlans,
      team,
      bookings,
      payments,
      notifications,
      settings,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addService,
      updateService,
      deleteService,
      addPestPlan,
      updatePestPlan,
      deletePestPlan,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addBooking,
      updateBookingStatus,
      updateBookingPricing,
      deleteBooking,
      updatePaymentStatus,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      updateSettings,
      resetAllData,
      getCustomerById,
      getServiceById,
      getTeamMemberById,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers, services, pestPlans, team, bookings, payments, notifications, settings]
  );

  return <OpsHubContext.Provider value={value}>{children}</OpsHubContext.Provider>;
}

export function useOpsHub(): OpsHubContextType {
  const context = useContext(OpsHubContext);
  return context || defaultFallbackOpsHub;
}

