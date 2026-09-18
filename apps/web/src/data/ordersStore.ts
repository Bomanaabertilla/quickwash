// Shared Store for Customer Orders & Owner Hub Fulfillment with Backend Synchronization
import type { Order, OrderItem, OrderHistoryItem, OrderStatus } from '@quickwash/shared';
import { getTodayDayId, parseSlot } from '../utils/dateUtils';

const STORAGE_KEY = 'quickwash_orders_data';

export const INITIAL_ORDERS: Order[] = [];

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Strip out legacy dummy order if previously saved
        return parsed.filter((o: Order) => o.id !== 'LB-2026-0091' && o.customerName !== 'Alex Morgan');
      }
    }
  } catch (e) {
    console.error('Error reading orders from storage', e);
  }
  return INITIAL_ORDERS;
}

export function saveOrders(orders: Order[]): Order[] | undefined {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('quickwash:orders_updated', { detail: orders }));
    return orders;
  } catch (e) {
    console.error('Error saving orders to storage', e);
  }
}

// Fetch latest orders from the backend API
export async function syncOrdersWithBackend(): Promise<Order[]> {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const orders = await res.json();
      if (Array.isArray(orders) && orders.length > 0) {
        saveOrders(orders);
        return orders;
      }
    }
  } catch (err: any) {
    console.warn('Orders API not reachable, using cached orders store:', err.message);
  }
  return getOrders();
}

export interface CreateOrderParams {
  customerName?: string;
  phone?: string;
  address?: string;
  slot?: string;
  services?: Array<{ name: string; price: string; quantity?: number }>;
  amount?: string;
  paymentMethod?: string;
  specialNotes?: string;
  partnerName?: string;
}

export function createOrder({
  customerName = 'Customer',
  phone = '+233 24 123 4567',
  address = 'Plot 14B, Ring Road Central, Accra',
  slot = 'Mon May 25 (10:00 AM)',
  services = [],
  amount = '0.00',
  paymentMethod = 'MTN Mobile Money',
  specialNotes = '',
  partnerName = 'Sparkle Express Laundry'
}: CreateOrderParams): Order {
  const current = getOrders();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `LB-2026-${randomNum}`;

  const parsed = parseSlot(slot);
  const orderDay = parsed.dayId;
  const orderTimeKey = parsed.timeKey;

  const summary = services.length > 0
    ? services.map(s => s.name).join(' + ')
    : 'Custom Laundry Service';

  const newOrder: Order = {
    id: newId,
    customerName,
    phone,
    tier: 'New Booking',
    slot,
    day: orderDay,
    timeKey: orderTimeKey,
    status: 'Confirmed',
    summary,
    amount,
    paymentMethod,
    txId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-GH`,
    isPaid: true,
    assignedRider: 'Kwame Mensah (#41)',
    address,
    specialNotes: specialNotes || 'Standard handling',
    partnerName,
    items: services.length > 0 ? services : [{ name: summary, price: amount }],
    createdAt: new Date().toISOString(),
    history: [
      { stage: 'Order Placed & Confirmed', time: 'Just now', done: true },
      { stage: 'Rider Dispatched for Pickup', time: 'Assigned (Kwame #41)', done: false },
      { stage: 'Washing & Care in Progress', time: 'Scheduled', done: false },
      { stage: 'Ready & Packed for Delivery', time: 'Estimated 24h', done: false }
    ]
  };

  // 1. Optimistic local update
  const updated = [newOrder, ...current];
  saveOrders(updated);

  // 2. Persist to backend API asynchronously
  fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName,
      phone,
      address,
      slot,
      day: orderDay,
      timeKey: orderTimeKey,
      services,
      amount,
      paymentMethod,
      specialNotes,
      partnerName
    })
  })
    .then(async (res) => {
      if (res.ok) {
        const serverOrder = await res.json();
        const fresh = getOrders().map(o => (o.id === newId ? serverOrder : o));
        saveOrders(fresh);
      } else if (res.status === 409) {
        const errorData = await res.json();
        console.error('Booking conflict:', errorData.error);
        window.dispatchEvent(new CustomEvent('quickwash:booking_conflict', { detail: errorData }));
      }
    })
    .catch((err) => {
      console.warn('Backend sync failed, order saved locally:', err.message);
    });

  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, extraNotes?: string): Order | undefined {
  const current = getOrders();
  const updated = current.map(order => {
    if (order.id !== orderId) return order;

    let history: OrderHistoryItem[] = [...(order.history || [])];
    if (newStatus === 'In progress') {
      history = [
        { stage: 'Order Placed & Confirmed', time: 'Completed', done: true },
        { stage: 'Rider Dispatched & Collected', time: 'Completed', done: true },
        { stage: 'Washing & Care in Progress', time: 'Active now', done: true },
        { stage: 'Ready & Packed for Delivery', time: 'Pending', done: false }
      ];
    } else if (newStatus === 'Ready / Delivered' || newStatus === 'Delivered') {
      history = [
        { stage: 'Order Placed & Confirmed', time: 'Completed', done: true },
        { stage: 'Rider Dispatched & Collected', time: 'Completed', done: true },
        { stage: 'Washing & Care in Progress', time: 'Completed', done: true },
        { stage: 'Delivered & Completed', time: 'Just now', done: true }
      ];
    }

    return {
      ...order,
      status: newStatus,
      extraNotes: extraNotes || order.extraNotes,
      history
    };
  });

  // 1. Optimistic local update
  saveOrders(updated);

  // 2. Persist to backend API asynchronously
  fetch(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus, extraNotes })
  })
    .then(async (res) => {
      if (res.ok) {
        const serverOrder = await res.json();
        const fresh = getOrders().map(o => (o.id === orderId ? serverOrder : o));
        saveOrders(fresh);
      }
    })
    .catch((err) => {
      console.warn('Backend status update failed, updated locally:', err.message);
    });

  return updated.find(o => o.id === orderId);
}

export function getOrderById(orderId: string): Order {
  const current = getOrders();
  return current.find(o => o.id === orderId) || current[0];
}

export function getLatestOrder(): Order | null {
  const current = getOrders();
  return current[0] || null;
}

// Auto-sync on client load and window focus
if (typeof window !== 'undefined') {
  syncOrdersWithBackend();
  window.addEventListener('focus', () => syncOrdersWithBackend());
}
