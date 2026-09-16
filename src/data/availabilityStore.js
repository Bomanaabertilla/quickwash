// Shared Store for Published Owner Availability & Customer Storefront Sync with Backend
import { getCalendarWeek } from '../utils/dateUtils';

const STORAGE_KEY = 'quickwash_published_availability';

export function buildDefaultAvailability(week = getCalendarWeek()) {
  const defaultConfigs = {
    mon: { status: 'Open', hours: '8:00 AM – 6:30 PM', capacity: 5, slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
    tue: { status: 'Open', hours: '8:00 AM – 6:30 PM', capacity: 5, slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
    wed: { status: 'Open', hours: '8:00 AM – 6:30 PM', capacity: 5, slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
    thu: { status: 'Open', hours: '8:00 AM – 6:30 PM', capacity: 5, slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
    fri: { status: 'Open', hours: '8:00 AM – 6:30 PM', capacity: 5, slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
    sat: { status: 'Open', hours: '9:00 AM – 5:00 PM', capacity: 4, slots: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'] },
    sun: { status: 'Closed', hours: 'Closed', capacity: 0, slots: [] }
  };

  const getPeriod = (t) => {
    if (t.includes('AM')) return 'Morning';
    if (t.startsWith('12:') || t.startsWith('1:') || t.startsWith('2:') || t.startsWith('3:')) return 'Afternoon';
    return 'Evening';
  };

  const days = week.days.map((d) => {
    const cfg = defaultConfigs[d.id] || defaultConfigs.mon;
    return {
      id: d.id,
      name: d.name,
      fullName: d.fullName,
      date: d.date,
      month: d.month,
      dayNum: d.dayNum,
      status: cfg.status,
      hours: cfg.hours,
      slots: cfg.slots.map(t => ({
        time: t,
        period: getPeriod(t),
        status: 'Available',
        capacity: cfg.capacity
      }))
    };
  });

  return {
    isPublished: true,
    weekRange: week.weekRange,
    weekLabel: week.weekLabel,
    updatedAt: new Date().toISOString(),
    days
  };
}

export const DEFAULT_AVAILABILITY = buildDefaultAvailability();

/**
 * Ensures saved or fetched availability preserves owner's custom hours, status and slots,
 * while aligning the dates and week ranges to the current calendar week.
 */
export function alignAvailabilityDates(avail, targetWeek = getCalendarWeek()) {
  if (!avail || !avail.days) return buildDefaultAvailability(targetWeek);
  const currentWeekDays = targetWeek.days;
  const days = avail.days.map((d) => {
    const matchingCal = currentWeekDays.find((c) => c.id === d.id);
    if (!matchingCal) return d;
    return {
      ...d,
      date: matchingCal.date,
      month: matchingCal.month,
      dayNum: matchingCal.dayNum
    };
  });
  return {
    ...avail,
    weekRange: targetWeek.weekRange,
    weekLabel: targetWeek.weekLabel,
    days
  };
}

// Helper: Get current published availability from storage
export function getPublishedAvailability() {
  if (typeof window === 'undefined') return DEFAULT_AVAILABILITY;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return alignAvailabilityDates(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Error reading availability from storage', e);
  }
  return alignAvailabilityDates(DEFAULT_AVAILABILITY);
}

// Helper: Fetch availability from backend API
export async function syncAvailabilityWithBackend() {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/availability');
    if (res.ok) {
      const data = await res.json();
      if (data && data.days) {
        const aligned = alignAvailabilityDates(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(aligned));
        window.dispatchEvent(new CustomEvent('quickwash:availability_updated', { detail: aligned }));
        return aligned;
      }
    }
  } catch (err) {
    console.warn('Availability API not reachable, using cached schedule:', err.message);
  }
  return getPublishedAvailability();
}

// Helper: Save and broadcast availability
export function savePublishedAvailability(data) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    // 1. Optimistic update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('quickwash:availability_updated', { detail: payload }));

    // 2. Persist to backend API asynchronously
    fetch('/api/availability', {
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
        console.warn('Backend availability sync failed, saved locally:', err.message);
      });

    return payload;
  } catch (e) {
    console.error('Error saving availability to storage', e);
  }
}

// Auto-sync on client load and window focus
if (typeof window !== 'undefined') {
  syncAvailabilityWithBackend();
  window.addEventListener('focus', () => syncAvailabilityWithBackend());
}
