import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// Helper to format order response to match frontend expectations
function formatOrder(order) {
  if (!order) return null;
  return {
    ...order,
    items: order.items || [],
    history: order.history || []
  };
}

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        history: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        history: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(formatOrder(order));
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// POST /api/orders - Create new order with atomic slot capacity check
router.post('/', async (req, res) => {
  try {
    const {
      customerName = 'Customer',
      phone = '+233 24 123 4567',
      address = 'Plot 14B, Ring Road Central, Accra',
      slot = 'Today (Immediate)',
      timeSlotId,
      day,
      timeKey,
      services = [],
      amount = '0.00',
      paymentMethod = 'MTN Mobile Money',
      specialNotes = '',
      partnerName = 'Sparkle Express Laundry'
    } = req.body;

    // Determine dayId and time from payload
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayDayId = dayNames[new Date().getDay()];
    const slotLower = (slot || '').toLowerCase();

    let resolvedDay = day ? day.trim().toLowerCase() : '';
    if (resolvedDay.includes('today') || resolvedDay.includes('now') || slotLower.includes('today') || slotLower.includes('immediate')) {
      resolvedDay = todayDayId;
    } else {
      let matchedDay = null;
      for (const d of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
        if ((resolvedDay && resolvedDay.includes(d)) || slotLower.includes(d)) {
          matchedDay = d;
          break;
        }
      }
      resolvedDay = matchedDay || todayDayId;
    }

    // Extract time from slot or timeKey
    let resolvedTime = timeKey || '';
    if (resolvedTime.includes('(') && resolvedTime.includes(')')) {
      const match = resolvedTime.match(/\((.*?)\)/);
      if (match) resolvedTime = match[1].trim();
    } else if (!resolvedTime && slot.includes('(') && slot.includes(')')) {
      const match = slot.match(/\((.*?)\)/);
      if (match) resolvedTime = match[1].trim();
    }
    const timeRegexMatch = (resolvedTime || slot).match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/i);
    if (timeRegexMatch) {
      resolvedTime = timeRegexMatch[1].trim().toUpperCase();
    } else if (slotLower.includes('immediate')) {
      resolvedTime = 'Immediate';
    }

    // Generate unique order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `LB-2026-${randomNum}`;

    const summary = services.length > 0
      ? services.map(s => s.name).join(' + ')
      : 'Custom Laundry Service';

    const txId = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-GH`;

    // Execute within transaction for atomic capacity check & booking
    const result = await prisma.$transaction(async (tx) => {
      let matchedSlot = null;

      if (timeSlotId) {
        matchedSlot = await tx.timeSlot.findUnique({
          where: { id: Number(timeSlotId) }
        });
      } else if (resolvedDay && resolvedTime) {
        matchedSlot = await tx.timeSlot.findFirst({
          where: {
            dayId: resolvedDay,
            time: { contains: resolvedTime }
          }
        });
      }

      // Check slot capacity if slot is found
      if (matchedSlot) {
        if (matchedSlot.bookedCount >= matchedSlot.capacity) {
          throw new Error('SLOT_FULL');
        }

        // Increment slot booking count
        const newBookedCount = matchedSlot.bookedCount + 1;
        const newStatus = newBookedCount >= matchedSlot.capacity
          ? 'Full'
          : newBookedCount >= matchedSlot.capacity - 1
            ? 'Filling Fast'
            : 'Available';

        await tx.timeSlot.update({
          where: { id: matchedSlot.id },
          data: {
            bookedCount: newBookedCount,
            status: newStatus
          }
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          id: newId,
          customerName,
          phone,
          tier: 'New Booking',
          slot,
          day: resolvedDay,
          timeKey: resolvedTime || slot,
          timeSlotId: matchedSlot ? matchedSlot.id : null,
          status: 'Confirmed',
          summary,
          amount: String(amount),
          paymentMethod,
          txId,
          isPaid: true,
          assignedRider: 'Kwame Mensah (#41)',
          address,
          specialNotes: specialNotes || 'Standard handling',
          items: {
            create: (services.length > 0 ? services : [{ name: summary, price: String(amount) }]).map(item => ({
              name: item.name,
              price: String(item.price || amount),
              quantity: item.quantity || 1
            }))
          },
          history: {
            create: [
              { stage: 'Order Placed & Confirmed', time: 'Just now', done: true, orderIndex: 0 },
              { stage: 'Rider Dispatched for Pickup', time: 'Assigned (Kwame #41)', done: false, orderIndex: 1 },
              { stage: 'Washing & Care in Progress', time: 'Scheduled', done: false, orderIndex: 2 },
              { stage: 'Ready & Packed for Delivery', time: 'Estimated 24h', done: false, orderIndex: 3 }
            ]
          }
        },
        include: {
          items: true,
          history: {
            orderBy: { orderIndex: 'asc' }
          }
        }
      });

      return newOrder;
    });

    res.status(201).json(formatOrder(result));
  } catch (error) {
    if (error.message === 'SLOT_FULL') {
      return res.status(409).json({
        error: 'This time slot is fully booked. Please select another slot.'
      });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order fulfillment stage
router.patch('/:id/status', async (req, res) => {
  try {
    const { status: newStatus, extraNotes } = req.body;
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { history: true }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let updatedHistoryData = [];
    if (newStatus === 'In progress' || newStatus === 'In Progress') {
      updatedHistoryData = [
        { stage: 'Order Placed & Confirmed', time: 'Completed', done: true, orderIndex: 0 },
        { stage: 'Rider Dispatched & Collected', time: 'Completed', done: true, orderIndex: 1 },
        { stage: 'Washing & Care in Progress', time: 'Active now', done: true, orderIndex: 2 },
        { stage: 'Ready & Packed for Delivery', time: 'Pending', done: false, orderIndex: 3 }
      ];
    } else if (newStatus === 'Ready / Delivered' || newStatus === 'Delivered') {
      updatedHistoryData = [
        { stage: 'Order Placed & Confirmed', time: 'Completed', done: true, orderIndex: 0 },
        { stage: 'Rider Dispatched & Collected', time: 'Completed', done: true, orderIndex: 1 },
        { stage: 'Washing & Care in Progress', time: 'Completed', done: true, orderIndex: 2 },
        { stage: 'Delivered & Completed', time: 'Just now', done: true, orderIndex: 3 }
      ];
    }

    // Update inside transaction
    const updated = await prisma.$transaction(async (tx) => {
      if (updatedHistoryData.length > 0) {
        // Delete existing history and recreate
        await tx.orderHistory.deleteMany({ where: { orderId: id } });
        await tx.orderHistory.createMany({
          data: updatedHistoryData.map(h => ({ ...h, orderId: id }))
        });
      }

      return tx.order.update({
        where: { id },
        data: {
          status: newStatus,
          specialNotes: extraNotes ? `${existingOrder.specialNotes || ''} | ${extraNotes}` : existingOrder.specialNotes
        },
        include: {
          items: true,
          history: {
            orderBy: { orderIndex: 'asc' }
          }
        }
      });
    });

    res.json(formatOrder(updated));
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
});

export default router;
