import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
});

// PUT /api/services - Bulk update or replace services catalog
router.put('/', async (req, res) => {
  try {
    const servicesList = req.body;
    if (!Array.isArray(servicesList)) {
      return res.status(400).json({ error: 'Expected an array of services' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const s of servicesList) {
        if (s.id) {
          const res = await tx.service.upsert({
            where: { id: Number(s.id) },
            update: {
              name: s.name,
              category: s.category || 'General',
              description: s.description || '',
              unit: s.unit || 'per item',
              price: String(s.price || '0.00'),
              turnaround: s.turnaround || '24 hrs',
              minOrder: s.minOrder || '1 item',
              popular: Boolean(s.popular),
              active: s.active !== undefined ? Boolean(s.active) : true,
              iconName: s.iconName || 'shirt'
            },
            create: {
              name: s.name,
              category: s.category || 'General',
              description: s.description || '',
              unit: s.unit || 'per item',
              price: String(s.price || '0.00'),
              turnaround: s.turnaround || '24 hrs',
              minOrder: s.minOrder || '1 item',
              popular: Boolean(s.popular),
              active: s.active !== undefined ? Boolean(s.active) : true,
              iconName: s.iconName || 'shirt'
            }
          });
          results.push(res);
        } else {
          const res = await tx.service.create({
            data: {
              name: s.name,
              category: s.category || 'General',
              description: s.description || '',
              unit: s.unit || 'per item',
              price: String(s.price || '0.00'),
              turnaround: s.turnaround || '24 hrs',
              minOrder: s.minOrder || '1 item',
              popular: Boolean(s.popular),
              active: s.active !== undefined ? Boolean(s.active) : true,
              iconName: s.iconName || 'shirt'
            }
          });
          results.push(res);
        }
      }
      return results;
    });

    res.json(updated);
  } catch (error) {
    console.error('Error saving services:', error);
    res.status(500).json({ error: 'Failed to save services', details: error.message });
  }
});

export default router;
