// Shared Store for Store/Shop Profile Configuration

const STORAGE_KEY = 'quickwash_shop_profile';

export const DEFAULT_SHOP_PROFILE = {
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

export function getShopProfile() {
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

export function saveShopProfile(data) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...getShopProfile(),
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('quickwash:shop_updated', { detail: payload }));
    return payload;
  } catch (e) {
    console.error('Error saving shop profile to storage', e);
  }
}
