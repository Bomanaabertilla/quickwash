// Shared Store for Customer Orders & Owner Hub Fulfillment

const STORAGE_KEY = 'quickwash_orders_data';

export const INITIAL_ORDERS = [
  {
    id: 'LB-2026-0091',
    customerName: 'Alex Morgan',
    phone: '+233 24 123 4567',
    tier: 'Loyal Customer',
    slot: 'Mon May 25 (10:00 AM)',
    day: 'mon',
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

  const summary = services.length > 0
    ? services.map(s => s.name).join(' + ')
    : 'Custom Laundry Service';

  const newOrder = {
    id: newId,
    customerName,
    phone,
    tier: 'New Booking',
    slot,
    day: slot.toLowerCase().slice(0, 3),
    timeKey: slot,
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

  const updated = [newOrder, ...current];
  saveOrders(updated);
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

  saveOrders(updated);
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
