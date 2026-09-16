// Shared Store for Published Owner Availability & Customer Storefront Sync

const STORAGE_KEY = 'quickwash_published_availability';

export const DEFAULT_AVAILABILITY = {
  isPublished: true,
  weekRange: 'May 25 – May 31, 2026',
  weekLabel: 'Week of May 25 – May 31, 2026',
  updatedAt: new Date().toISOString(),
  days: [
    {
      id: 'mon',
      name: 'Mon',
      fullName: 'Monday',
      date: 'May 25',
      month: 'May',
      dayNum: '25',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'tue',
      name: 'Tue',
      fullName: 'Tuesday',
      date: 'May 26',
      month: 'May',
      dayNum: '26',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'wed',
      name: 'Wed',
      fullName: 'Wednesday',
      date: 'May 27',
      month: 'May',
      dayNum: '27',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'thu',
      name: 'Thu',
      fullName: 'Thursday',
      date: 'May 28',
      month: 'May',
      dayNum: '28',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'fri',
      name: 'Fri',
      fullName: 'Friday',
      date: 'May 29',
      month: 'May',
      dayNum: '29',
      status: 'Open',
      hours: '8:00 AM – 6:30 PM',
      slots: [
        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
        { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
      ]
    },
    {
      id: 'sat',
      name: 'Sat',
      fullName: 'Saturday',
      date: 'May 30',
      month: 'May',
      dayNum: '30',
      status: 'Open',
      hours: '9:00 AM – 5:00 PM',
      slots: [
        { time: '9:00 AM', period: 'Morning', status: 'Available', capacity: 4 },
        { time: '11:30 AM', period: 'Morning', status: 'Available', capacity: 4 },
        { time: '2:00 PM', period: 'Afternoon', status: 'Available', capacity: 4 },
        { time: '4:30 PM', period: 'Evening', status: 'Available', capacity: 4 }
      ]
    },
    {
      id: 'sun',
      name: 'Sun',
      fullName: 'Sunday',
      date: 'May 31',
      month: 'May',
      dayNum: '31',
      status: 'Closed',
      hours: 'Closed',
      slots: []
    }
  ]
};

// Helper: Get current published availability from storage
export function getPublishedAvailability() {
  if (typeof window === 'undefined') return DEFAULT_AVAILABILITY;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading availability from storage', e);
  }
  return DEFAULT_AVAILABILITY;
}

// Helper: Save and broadcast availability
export function savePublishedAvailability(data) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('quickwash:availability_updated', { detail: payload }));
  } catch (e) {
    console.error('Error saving availability to storage', e);
  }
}
