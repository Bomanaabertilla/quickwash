import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Shop Profile
  await prisma.shopProfile.upsert({
    where: { id: 'sparkle' },
    update: {},
    create: {
      id: 'sparkle',
      name: 'Sparkle Express Laundry',
      branchDescriptor: 'Ring Road Central Flagship',
      category: 'Laundromat & Dry Cleaning',
      neighborhood: 'Midtown',
      physicalAddress: 'Plot 14B, Upper West Side, Ring Road Central, Accra',
      digitalAddress: 'GA-183-4920',
      deliveryRadius: 8.5,
      primaryPhone: '+233 24 123 4567',
      whatsapp: '+233 55 987 6543',
      businessEmail: 'accra@sparklewash.com',
      openTime: '07:00',
      closeTime: '20:30',
      turnaroundPromise: '24h',
      rating: 4.9,
      currency: 'GH₵',
      pricePerKg: '32.00',
      image: '/assets/images/sparkle_express_laundry.jpg',
      facilities: JSON.stringify([
        'Eco-friendly Detergents',
        'Commercial Steam Ironing',
        'Express 4-Hour Turnaround',
        'SMS & WhatsApp Tracking',
        'MoMo Cashless Payment'
      ])
    }
  });

  // 2. Seed Services Catalog
  const defaultServices = [
    {
      id: 1,
      name: 'Wash & Fold (Everyday Clothes)',
      category: 'Wash & Fold',
      description: 'Everyday garments, t-shirts, jeans, bedsheets, and towels washed, dried, and neatly packed.',
      unit: 'per kg',
      price: '37.00',
      turnaround: '24 hrs',
      minOrder: '3 kg min',
      popular: true,
      active: true,
      iconName: 'shirt'
    },
    {
      id: 2,
      name: 'Dry Cleaning (Suits & Blazers)',
      category: 'Dry Clean & Press',
      description: 'Gentle eco-solvent cycle for two-piece suits, formal blazers, dinner jackets, and silk ties.',
      unit: 'per item',
      price: '90.00',
      turnaround: '48 hrs',
      minOrder: '1 item',
      popular: false,
      active: true,
      iconName: 'building'
    },
    {
      id: 3,
      name: 'Steam Iron & Press Only',
      category: 'Dry Clean & Press',
      description: 'High-pressure commercial steam pressing without wash cycle. Crisp collars and sharp creases.',
      unit: 'per item',
      price: '25.00',
      turnaround: '12 hrs',
      minOrder: '2 items',
      popular: true,
      active: true,
      iconName: 'sparkles'
    },
    {
      id: 4,
      name: 'Bulky Bedding & Duvets (King/Queen)',
      category: 'Bulky & Bedding',
      description: 'Deep sanitary thermal wash and fluff cycle for king/queen comforters, duvets, and thick blankets.',
      unit: 'per item',
      price: '120.00',
      turnaround: '48 hrs',
      minOrder: '1 item',
      popular: false,
      active: true,
      iconName: 'zap'
    },
    {
      id: 5,
      name: 'Express 4-Hour Same-Day Rush',
      category: 'Specialty & Shoe Care',
      description: 'Priority queue placement with dedicated washer and instant high-speed finish and packing.',
      unit: 'flat rate',
      price: '80.00',
      turnaround: '4 hrs',
      minOrder: '1 load',
      popular: false,
      active: true,
      iconName: 'zap'
    }
  ];

  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }

  // 3. Seed Availability Schedule
  const week = await prisma.availabilityWeek.upsert({
    where: { id: 'current' },
    update: {},
    create: {
      id: 'current',
      isPublished: true,
      weekRange: 'May 25 – May 31, 2026',
      weekLabel: 'Week of May 25 – May 31, 2026'
    }
  });

  const daysData = [
    {
      id: 'mon',
      name: 'Mon',
      fullName: 'Monday',
      date: 'May 25',
      month: 'May',
      dayNum: '25',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      sortOrder: 1,
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'tue',
      name: 'Tue',
      fullName: 'Tuesday',
      date: 'May 26',
      month: 'May',
      dayNum: '26',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      sortOrder: 2,
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'wed',
      name: 'Wed',
      fullName: 'Wednesday',
      date: 'May 27',
      month: 'May',
      dayNum: '27',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      sortOrder: 3,
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'thu',
      name: 'Thu',
      fullName: 'Thursday',
      date: 'May 28',
      month: 'May',
      dayNum: '28',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      sortOrder: 4,
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'fri',
      name: 'Fri',
      fullName: 'Friday',
      date: 'May 29',
      month: 'May',
      dayNum: '29',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      sortOrder: 5,
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'sat',
      name: 'Sat',
      fullName: 'Saturday',
      date: 'May 30',
      month: 'May',
      dayNum: '30',
      status: 'Open',
      hours: '9:00 AM – 5:00 PM',
      sortOrder: 6,
      slots: [
        { time: '9:00 AM', period: 'Morning', status: 'Available', capacity: 4 },
        { time: '11:30 AM', period: 'Morning', status: 'Available', capacity: 4 },
        { time: '2:00 PM', period: 'Afternoon', status: 'Available', capacity: 4 },
        { time: '4:30 PM', period: 'Evening', status: 'Available', capacity: 4 }
      ]
    },
    {
      id: 'sun',
      name: 'Sun',
      fullName: 'Sunday',
      date: 'May 31',
      month: 'May',
      dayNum: '31',
      status: 'Closed',
      hours: 'Closed',
      sortOrder: 7,
      slots: []
    }
  ];

  for (const day of daysData) {
    const { slots, ...dayFields } = day;
    await prisma.daySchedule.upsert({
      where: { id: day.id },
      update: { ...dayFields, weekId: week.id },
      create: { ...dayFields, weekId: week.id }
    });

    for (const slot of slots) {
      const existing = await prisma.timeSlot.findFirst({
        where: { dayId: day.id, time: slot.time }
      });
      if (!existing) {
        await prisma.timeSlot.create({
          data: {
            dayId: day.id,
            time: slot.time,
            period: slot.period,
            status: slot.status,
            capacity: slot.capacity,
            bookedCount: 0
          }
        });
      }
    }
  }

  // 4. Seed Initial Order
  const existingOrder = await prisma.order.findUnique({
    where: { id: 'LB-2026-0091' }
  });

  if (!existingOrder) {
    // Find matching slot for Mon 10:00 AM
    const mon10Slot = await prisma.timeSlot.findFirst({
      where: { dayId: 'mon', time: '10:00 AM' }
    });

    await prisma.order.create({
      data: {
        id: 'LB-2026-0091',
        customerName: 'Alex Morgan',
        phone: '+233 24 123 4567',
        tier: 'Loyal Customer',
        slot: 'Mon May 25 (10:00 AM)',
        day: 'mon',
        timeKey: '10:00 AM',
        timeSlotId: mon10Slot?.id,
        status: 'Confirmed',
        summary: 'Wash & Fold 5kg + Steam Iron (2 pcs)',
        amount: '235.00',
        paymentMethod: 'MTN Mobile Money',
        txId: 'MOMO-8839213-GH',
        isPaid: true,
        assignedRider: 'Kwame Mensah (#41)',
        address: 'Plot 14B, Ring Road Central, Accra',
        specialNotes: 'Use lavender scent detergent. Ring bell twice upon arrival.',
        items: {
          create: [
            { name: 'Wash & Fold (Everyday Clothes) 5kg', price: '185.00', quantity: 1 },
            { name: 'Steam Iron & Press Only (x2)', price: '50.00', quantity: 1 }
          ]
        },
        history: {
          create: [
            { stage: 'Order Placed & Confirmed', time: '1 hour ago', done: true, orderIndex: 0 },
            { stage: 'Rider Dispatched for Pickup', time: 'Pending', done: false, orderIndex: 1 },
            { stage: 'Washing & Care in Progress', time: 'Pending', done: false, orderIndex: 2 },
            { stage: 'Ready & Packed for Delivery', time: 'Pending', done: false, orderIndex: 3 }
          ]
        }
      }
    });

    if (mon10Slot) {
      await prisma.timeSlot.update({
        where: { id: mon10Slot.id },
        data: { bookedCount: 1 }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
