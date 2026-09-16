// Shared Store for Customer Orders & Owner Hub Fulfillment with Backend Synchronization
import { getTodayDayId } from '../utils/dateUtils';

const STORAGE_KEY = 'quickwash_orders_data';

export const INITIAL_ORDERS = [
  {
    id: 'LB-2026-0091',
    customerName: 'Alex Morgan',
    phone: '+233 24 123 4567',
    tier: 'Loyal Customer',
    slot: 'Today (10:00 AM)',
    day: getTodayDayId(),
    timeKey: '10:00 AM',
    status: 'Confirmed',
    summary: 'Wash & Fold 5kg + Steam Iron (2 pcs)',
    amount: '235.00',
    paymentMethod: 'MTN Mobile Money',
    txId: 'MOMO-8839213-GH',
    isPaid: true,
    assignedRider: 'Kwame Mensah (#41)',
    address: 'Plot 14B, Ring Road Central, Accra',
    specialNotes: 'Use lavender scent detergent. Ring bell twice upon arrival.',
    items: [
      { name: 'Wash & Fold (Everyday Clothes) 5kg', price: '185.00' },
      { name: 'Steam Iron & Press Only (x2)', price: '50.00' }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    history: [
      { stage: 'Order Placed & Confirmed', time: '1 hour ago', done: true },
      { stage: 'Rider Dispatched for Pickup', time: 'Pending', done: false },
      { stage: 'Washing & Care in Progress', time: 'Pending', done: false },
      { stage: 'Ready & Packed for Delivery', time: 'Pending', done: false }
    ]
  }
];

export function getOrders() {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading orders from storage', e);
  }
  return INITIAL_ORDERS;
}

export function saveOrders(orders) {
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
export async function syncOrdersWithBackend() {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const orders = await res.json();
      if (Array.isArray(orders) && orders.length > 0) {
        saveOrders(orders);
        return orders;
      }
    }
  } catch (err) {
    // Backend offline or unreachable; gracefully fallback to cached storage
    console.warn('Orders API not reachable, using cached orders store:', err.message);
  }
  return getOrders();
}

import { parseSlot } from '../utils/dateUtils.js';

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
}) {
  const current = getOrders();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `LB-2026-${randomNum}`;

  const parsed = parseSlot(slot);
  const orderDay = parsed.dayId;
  const orderTimeKey = parsed.timeKey;

  const summary = services.length > 0
    ? services.map(s => s.name).join(' + ')
    : 'Custom Laundry Service';

  const newOrder = {
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
        // Replace optimistic order with server order
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

export function updateOrderStatus(orderId, newStatus, extraNotes) {
  const current = getOrders();
  const updated = current.map(order => {
    if (order.id !== orderId) return order;

    let history = [...(order.history || [])];
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

export function getOrderById(orderId) {
  const current = getOrders();
  return current.find(o => o.id === orderId) || current[0];
}

export function getLatestOrder() {
  const current = getOrders();
  return current[0] || null;
}

// Auto-sync on client load and window focus
if (typeof window !== 'undefined') {
  syncOrdersWithBackend();
  window.addEventListener('focus', () => syncOrdersWithBackend());
}
