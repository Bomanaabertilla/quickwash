// Date & Time Utilities for QuickWash Storefront & Owner Dashboard

const DAY_IDS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns today's formatted date for top dashboards
 * Example output: "Wednesday, 16 Sep 2026"
 */
export function formatDashboardHeaderDate(date = new Date()) {
  const d = new Date(date);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

/**
 * Calculates current calendar week dates, day labels, and week range strings.
 * Defaults to current week based on system date.
 * If weekOffset is provided (e.g. -1 for prev week, +1 for next week), it shifts the week accordingly.
 */
export function getCalendarWeek(refDate = new Date(), weekOffset = 0) {
  const d = new Date(refDate);
  d.setDate(d.getDate() + (weekOffset * 7));
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMon = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMon);

  const dayMeta = [
    { id: 'mon', name: 'Mon', fullName: 'Monday' },
    { id: 'tue', name: 'Tue', fullName: 'Tuesday' },
    { id: 'wed', name: 'Wed', fullName: 'Wednesday' },
    { id: 'thu', name: 'Thu', fullName: 'Thursday' },
    { id: 'fri', name: 'Fri', fullName: 'Friday' },
    { id: 'sat', name: 'Sat', fullName: 'Saturday' },
    { id: 'sun', name: 'Sun', fullName: 'Sunday' }
  ];

  const days = dayMeta.map((m, idx) => {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + idx);
    const month = cur.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = cur.getDate();
    return {
      ...m,
      date: `${month} ${dayNum}`,
      month,
      dayNum: String(dayNum),
      fullDateStr: cur.toISOString().split('T')[0]
    };
  });

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const startDay = monday.getDate();
  const endDay = sunday.getDate();
  const year = sunday.getFullYear();

  const weekRange = `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  const weekLabel = `Week of ${weekRange}`;

  return {
    weekRange,
    weekLabel,
    monday,
    sunday,
    days
  };
}

/**
 * Returns current week range label
 * Example output: "Week of Sep 14 – Sep 20, 2026"
 */
export function getCurrentWeekLabel(date = new Date()) {
  return getCalendarWeek(date).weekLabel;
}

/**
 * Returns today's Day ID ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')
 */
export function getTodayDayId() {
  return DAY_IDS[new Date().getDay()];
}

/**
 * Parses any slot string into a normalized dayId and timeKey
 * Examples:
 * - "Today (Immediate)" -> { dayId: 'wed', timeKey: 'Immediate', isToday: true }
 * - "Mon May 25 (10:00 AM)" -> { dayId: 'mon', timeKey: '10:00 AM', isToday: false }
 * - "Wed, Sep 16 (1:00 PM)" -> { dayId: 'wed', timeKey: '1:00 PM', isToday: true }
 */
export function parseSlot(slotStr = '') {
  if (!slotStr) {
    const todayId = getTodayDayId();
    return { dayId: todayId, timeKey: 'Immediate', isToday: true };
  }

  const lower = slotStr.toLowerCase();
  const todayId = getTodayDayId();

  // 1. Resolve Day
  let resolvedDay = todayId;
  let isToday = false;

  if (lower.includes('today') || lower.includes('now') || lower.includes('immediate')) {
    resolvedDay = todayId;
    isToday = true;
  } else {
    for (const d of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
      if (lower.includes(d)) {
        resolvedDay = d;
        break;
      }
    }
    isToday = resolvedDay === todayId;
  }

  // 2. Resolve Time
  let timeKey = '10:00 AM';
  // Check if parentheses contain time: e.g. "(10:00 AM)" or "(Immediate)"
  const parenMatch = slotStr.match(/\((.*?)\)/);
  if (parenMatch && parenMatch[1]) {
    timeKey = parenMatch[1].trim();
  } else {
    // Check for HH:MM AM/PM pattern
    const timeMatch = slotStr.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/i);
    if (timeMatch) {
      timeKey = timeMatch[1].trim().toUpperCase();
    } else if (lower.includes('immediate')) {
      timeKey = 'Immediate';
    }
  }

  return { dayId: resolvedDay, timeKey, isToday };
}

/**
 * Formats an order createdAt ISO timestamp for humans
 * Example: "Today at 12:45 PM" or "16 Sep 2026 at 12:45 PM"
 */
export function formatOrderTimestamp(isoString) {
  if (!isoString) return 'Recent';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recent';

    const now = new Date();
    const isSameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isSameDay) {
      return `Today at ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Yesterday at ${timeStr}`;
    }

    const dateStr = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `${dateStr} at ${timeStr}`;
  } catch {
    return 'Recent';
  }
}

/**
 * Format currency amount with commas and 2 decimals
 */
export function formatCurrency(amount = 0, currency = 'GH₵') {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
