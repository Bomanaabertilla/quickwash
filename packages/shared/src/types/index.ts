// Shared Domain Types for QuickWash

export type OrderStatus = 
  | 'Confirmed' 
  | 'In progress' 
  | 'In wash' 
  | 'Ready / Delivered' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderItem {
  id?: number;
  orderId?: string;
  name: string;
  price: string;
  quantity?: number;
}

export interface OrderHistoryItem {
  id?: number;
  orderId?: string;
  stage: string;
  time: string;
  done: boolean;
  orderIndex?: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  tier: string;
  slot: string;
  day: string;
  timeKey: string;
  timeSlotId?: number | null;
  status: OrderStatus;
  summary: string;
  amount: string;
  paymentMethod: string;
  txId: string;
  isPaid: boolean;
  assignedRider: string;
  address: string;
  specialNotes?: string;
  extraNotes?: string;
  partnerName?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  history: OrderHistoryItem[];
}

export interface Partner {
  id: string;
  name: string;
  rating: number;
  distance?: string;
  neighborhood: string;
  deliveryTime: string;
  pricePerKg: string;
  currency?: string;
  image?: string;
  reviewCount?: number;
  tags?: string[];
  isSuperPartner?: boolean;
}

export interface CheckoutDetails {
  fullName: string;
  momoNumber: string;
  address: string;
  notes?: string;
  instructions?: string;
  estimatedTotal?: string;
  network?: string;
}

export interface ShopProfile {
  id: string;
  name: string;
  branchDescriptor: string;
  category: string;
  neighborhood: string;
  physicalAddress: string;
  digitalAddress: string;
  deliveryRadius: number;
  primaryPhone: string;
  whatsapp: string;
  businessEmail: string;
  openTime: string;
  closeTime: string;
  turnaroundPromise: string;
  rating: number;
  currency: string;
  pricePerKg: string;
  image: string;
  facilities: string[];
}

export interface ServiceCatalogItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  unit: string;
  turnaround: string;
  popular?: boolean;
  active?: boolean;
  minOrder?: string;
  iconName?: string;
}

export interface TimeSlot {
  id?: number;
  time: string;
  booked?: number;
  max?: number;
  status?: string;
  locked?: boolean;
  period?: 'Morning' | 'Afternoon' | 'Evening';
  capacity?: number;
  bookedCount?: number;
}

export interface DaySchedule {
  id?: number | string;
  dayId?: string;
  dayName?: string;
  shortDate?: string;
  fullDate?: string;
  name?: string;
  fullName?: string;
  date?: string;
  month?: string;
  dayNum?: string | number;
  status?: string;
  hours?: string;
  open?: boolean;
  startTime?: string;
  endTime?: string;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  weekLabel: string;
  weekRange?: string;
  startDate?: string;
  endDate?: string;
  days: DaySchedule[];
  isPublished?: boolean;
  updatedAt?: string;
}

export interface CalendarWeekDay {
  dayId: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  formattedDate: string;
  dateKey: string;
  isToday: boolean;
  isoDate: string;
}

export interface CalendarWeek {
  weekLabel: string;
  startIso: string;
  endIso: string;
  days: CalendarWeekDay[];
}
