import express, { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { getCalendarWeek } from '../utils/dateUtils.js';

const router = express.Router();

// GET /api/availability - Get current published availability
router.get('/', async (_req: Request, res: Response) => {
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

    const cal = getCalendarWeek();
    const alignedDays = week.days.map((d) => {
      const match = cal.days.find((c) => c.id === d.id);
      if (!match) return d;
      return {
        ...d,
        date: match.date,
        month: match.month,
        dayNum: match.dayNum
      };
    });

    res.json({
      ...week,
      weekRange: cal.weekRange,
      weekLabel: cal.weekLabel,
      days: alignedDays
    });
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability', details: error.message });
  }
});

// PUT /api/availability - Update weekly schedule and slot capacities
router.put('/', async (req: Request, res: Response) => {
  try {
    const cal = getCalendarWeek();
    const {
      isPublished = true,
      weekRange = cal.weekRange,
      weekLabel = cal.weekLabel,
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
  } catch (error: any) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Failed to save availability', details: error.message });
  }
});

export default router;
