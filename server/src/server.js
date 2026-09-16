import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';

import ordersRouter from './routes/orders.js';
import availabilityRouter from './routes/availability.js';
import servicesRouter from './routes/services.js';
import shopRouter from './routes/shop.js';

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

// Modular Domain Routers
app.use('/api/orders', ordersRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/services', servicesRouter);
app.use('/api/shop', shopRouter);

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
