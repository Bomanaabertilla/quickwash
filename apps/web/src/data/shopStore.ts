// Shared Store for Store/Shop Profile Configuration with Backend Sync
import type { ShopProfile } from '@quickwash/shared';

const STORAGE_KEY = 'quickwash_shop_profile';

export const DEFAULT_SHOP_PROFILE: ShopProfile = {
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
  facilities: [
    'Eco-friendly Detergents',
    'Commercial Steam Ironing',
    'Express 4-Hour Turnaround',
    'SMS & WhatsApp Tracking',
    'MoMo Cashless Payment'
  ]
};

export function getShopProfile(): ShopProfile {
  if (typeof window === 'undefined') return DEFAULT_SHOP_PROFILE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SHOP_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading shop profile from storage', e);
  }
  return DEFAULT_SHOP_PROFILE;
}

// Fetch shop profile from backend API
export async function syncShopProfileWithBackend(): Promise<ShopProfile> {
  if (typeof window === 'undefined') return DEFAULT_SHOP_PROFILE;
  try {
    const res = await fetch('/api/shop');
    if (res.ok) {
      const shop = await res.json();
      if (shop && shop.id) {
        const payload: ShopProfile = { ...DEFAULT_SHOP_PROFILE, ...shop };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent('quickwash:shop_updated', { detail: payload }));
        return payload;
      }
    }
  } catch (err: any) {
    console.warn('Shop API not reachable, using cached profile:', err.message);
  }
  return getShopProfile();
}

export function saveShopProfile(data: Partial<ShopProfile>): ShopProfile | undefined {
  if (typeof window === 'undefined') return;
  try {
    const payload: ShopProfile = {
      ...getShopProfile(),
      ...data,
    };
    // 1. Optimistic update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('quickwash:shop_updated', { detail: payload }));

    // 2. Persist to backend API asynchronously
    fetch('/api/shop', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (res.ok) {
          const fresh = await res.json();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        }
      })
      .catch((err) => {
        console.warn('Backend shop sync failed, saved locally:', err.message);
      });

    return payload;
  } catch (e) {
    console.error('Error saving shop profile to storage', e);
  }
}

// Auto-sync on client load and window focus
if (typeof window !== 'undefined') {
  syncShopProfileWithBackend();
  window.addEventListener('focus', () => syncShopProfileWithBackend());
}
