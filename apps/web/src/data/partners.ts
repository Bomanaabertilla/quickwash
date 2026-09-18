import type { Partner } from '@quickwash/shared';
import { getShopProfile } from './shopStore';

export type { Partner };

export function getPartners(): Partner[] {
  const shop = getShopProfile();
  return [
    {
      id: shop.id || 'sparkle',
      name: shop.name || 'QuickWash Laundry Hub',
      rating: shop.rating || 4.9,
      distance: `${shop.deliveryRadius || 7.5} km radius`,
      neighborhood: shop.neighborhood || 'Midtown',
      deliveryTime: `${shop.turnaroundPromise || '24h'} Turnaround`,
      pricePerKg: shop.pricePerKg || '32.00',
      currency: shop.currency || 'GH₵',
      image: shop.image || '/assets/images/sparkle_express_laundry.jpg',
    }
  ];
}

export const PARTNERS_DATA: Partner[] = getPartners();

export const CATEGORIES: string[] = ['All'];

