// Shared Store for Services & Pricing Catalog

const STORAGE_KEY = 'quickwash_services_catalog';

export const DEFAULT_SERVICES = [
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

export function getServicesCatalog() {
  if (typeof window === 'undefined') return DEFAULT_SERVICES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading services catalog from storage', e);
  }
  return DEFAULT_SERVICES;
}

export function saveServicesCatalog(services) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    window.dispatchEvent(new CustomEvent('quickwash:services_updated', { detail: services }));
    return services;
  } catch (e) {
    console.error('Error saving services catalog to storage', e);
  }
}
