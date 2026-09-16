import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// GET /api/availability - Get current published availability
router.get('/', async (req, res) => {
  try {
    const week = await prisma.availabilityWeek.findFirst({
      where: { id: 'current' },
      include: {
        days: {
          orderBy: { sortOrder: 'asc' },
          include: {
            slots: {
              orderBy: { id: 'asc' }
            }
          }
        }
      }
    });

    if (!week) {
      return res.status(404).json({ error: 'Availability schedule not found' });
    }

    res.json(week);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability', details: error.message });
  }
});

// PUT /api/availability - Update weekly schedule and slot capacities
router.put('/', async (req, res) => {
  try {
    const {
      isPublished = true,
      weekRange = 'May 25 – May 31, 2026',
      weekLabel = 'Week of May 25 – May 31, 2026',
      days = []
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update or create week
      const updatedWeek = await tx.availabilityWeek.upsert({
        where: { id: 'current' },
        update: {
          isPublished,
          weekRange,
          weekLabel
        },
        create: {
          id: 'current',
          isPublished,
          weekRange,
          weekLabel
        }
      });

      // 2. Update each day and its slots
      for (let i = 0; i < days.length; i++) {
        const d = days[i];
        await tx.daySchedule.upsert({
          where: { id: d.id },
          update: {
            weekId: updatedWeek.id,
            name: d.name,
            fullName: d.fullName,
            date: d.date,
            month: d.month,
            dayNum: d.dayNum,
            status: d.status,
            hours: d.hours,
            sortOrder: i + 1
          },
          create: {
            id: d.id,
            weekId: updatedWeek.id,
            name: d.name,
            fullName: d.fullName,
            date: d.date,
            month: d.month,
            dayNum: d.dayNum,
            status: d.status,
            hours: d.hours,
            sortOrder: i + 1
          }
        });

        // Update slots if provided
        if (Array.isArray(d.slots)) {
          for (const s of d.slots) {
            const existingSlot = await tx.timeSlot.findFirst({
              where: { dayId: d.id, time: s.time }
            });

            if (existingSlot) {
              await tx.timeSlot.update({
                where: { id: existingSlot.id },
                data: {
                  period: s.period || existingSlot.period,
                  capacity: s.capacity !== undefined ? Number(s.capacity) : existingSlot.capacity,
                  status: s.status || existingSlot.status
                }
              });
            } else {
              await tx.timeSlot.create({
                data: {
                  dayId: d.id,
                  time: s.time,
                  period: s.period || 'Morning',
                  capacity: s.capacity !== undefined ? Number(s.capacity) : 5,
                  status: s.status || 'Available',
                  bookedCount: 0
                }
              });
            }
          }
        }
      }

      // Return fully hydrated week
      return tx.availabilityWeek.findUnique({
        where: { id: 'current' },
        include: {
          days: {
            orderBy: { sortOrder: 'asc' },
            include: {
              slots: {
                orderBy: { id: 'asc' }
              }
            }
          }
        }
      });
    });

    res.json(result);
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Failed to save availability', details: error.message });
  }
});

export default router;
