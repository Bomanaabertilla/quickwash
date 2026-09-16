import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// Helper to format shop profile
function formatShop(shop) {
  if (!shop) return null;
  return {
    ...shop,
    facilities: typeof shop.facilities === 'string' ? JSON.parse(shop.facilities) : shop.facilities
  };
}

// GET /api/shop - Get shop profile
router.get('/', async (req, res) => {
  try {
    let shop = await prisma.shopProfile.findUnique({ where: { id: 'sparkle' } });
    if (!shop) {
      shop = await prisma.shopProfile.findFirst();
    }
    if (!shop) {
      return res.status(404).json({ error: 'Shop profile not found' });
    }
    res.json(formatShop(shop));
  } catch (error) {
    console.error('Error fetching shop profile:', error);
    res.status(500).json({ error: 'Failed to fetch shop profile', details: error.message });
  }
});

// PUT /api/shop - Update shop profile
router.put('/', async (req, res) => {
  try {
    const data = req.body;
    const facilities = Array.isArray(data.facilities)
      ? JSON.stringify(data.facilities)
      : typeof data.facilities === 'string'
        ? data.facilities
        : '[]';

    const shop = await prisma.shopProfile.upsert({
      where: { id: data.id || 'sparkle' },
      update: {
        name: data.name,
        branchDescriptor: data.branchDescriptor,
        category: data.category,
        neighborhood: data.neighborhood,
        physicalAddress: data.physicalAddress,
        digitalAddress: data.digitalAddress,
        deliveryRadius: data.deliveryRadius !== undefined ? Number(data.deliveryRadius) : 8.5,
        primaryPhone: data.primaryPhone,
        whatsapp: data.whatsapp,
        businessEmail: data.businessEmail,
        openTime: data.openTime,
        closeTime: data.closeTime,
        turnaroundPromise: data.turnaroundPromise,
        rating: data.rating !== undefined ? Number(data.rating) : 4.9,
        currency: data.currency || 'GH₵',
        pricePerKg: String(data.pricePerKg || '32.00'),
        image: data.image,
        facilities
      },
      create: {
        id: data.id || 'sparkle',
        name: data.name || 'Sparkle Express Laundry',
        branchDescriptor: data.branchDescriptor,
        category: data.category,
        neighborhood: data.neighborhood,
        physicalAddress: data.physicalAddress || 'Plot 14B, Upper West Side, Ring Road Central, Accra',
        digitalAddress: data.digitalAddress,
        deliveryRadius: data.deliveryRadius !== undefined ? Number(data.deliveryRadius) : 8.5,
        primaryPhone: data.primaryPhone || '+233 24 123 4567',
        whatsapp: data.whatsapp,
        businessEmail: data.businessEmail,
        openTime: data.openTime || '07:00',
        closeTime: data.closeTime || '20:30',
        turnaroundPromise: data.turnaroundPromise || '24h',
        rating: data.rating !== undefined ? Number(data.rating) : 4.9,
        currency: data.currency || 'GH₵',
        pricePerKg: String(data.pricePerKg || '32.00'),
        image: data.image,
        facilities
      }
    });

    res.json(formatShop(shop));
  } catch (error) {
    console.error('Error updating shop profile:', error);
    res.status(500).json({ error: 'Failed to update shop profile', details: error.message });
  }
});

export default router;
