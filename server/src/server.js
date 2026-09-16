import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Quick DB query to verify connection
    const shop = await prisma.shopProfile.findFirst();
    res.json({
      status: 'ok',
      service: 'QuickWash API',
      database: 'connected',
      shopName: shop ? shop.name : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'QuickWash API',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Shop Profile
app.get('/api/shop', async (req, res) => {
  try {
    let shop = await prisma.shopProfile.findUnique({ where: { id: 'sparkle' } });
    if (!shop) {
      shop = await prisma.shopProfile.findFirst();
    }
    if (!shop) {
      return res.status(404).json({ error: 'Shop profile not found' });
    }
    // Parse JSON facilities
    const formatted = {
      ...shop,
      facilities: typeof shop.facilities === 'string' ? JSON.parse(shop.facilities) : shop.facilities
    };
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services Catalog
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weekly Availability & Slots
app.get('/api/availability', async (req, res) => {
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
      return res.status(404).json({ error: 'Availability not configured' });
    }

    res.json(week);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
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
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 QuickWash Server running on http://localhost:${PORT}`);
});
