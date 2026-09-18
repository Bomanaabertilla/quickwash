// Date & Time Utilities for QuickWash Storefront & Owner Dashboard

const DAY_IDS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export interface ClientCalendarDay {
  id: string;
  name: string;
  fullName: string;
  date: string;
  month: string;
  dayNum: string;
  fullDateStr: string;
}

export interface ClientCalendarWeek {
  weekRange: string;
  weekLabel: string;
  monday: Date;
  sunday: Date;
  days: ClientCalendarDay[];
}

export interface ParsedSlot {
  dayId: string;
  timeKey: string;
  isToday: boolean;
}

/**
 * Returns today's formatted date for top dashboards
 * Example output: "Wednesday, 16 Sep 2026"
 */
export function formatDashboardHeaderDate(date: Date | string = new Date()): string {
  const d = new Date(date);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

/**
 * Calculates current calendar week dates, day labels, and week range strings.
 */
export function getCalendarWeek(refDate: Date | string = new Date(), weekOffset: number = 0): ClientCalendarWeek {
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

  const days: ClientCalendarDay[] = dayMeta.map((m, idx) => {
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

export function getCurrentWeekLabel(date: Date | string = new Date()): string {
  return getCalendarWeek(date).weekLabel;
}

export function getTodayDayId(): string {
  return DAY_IDS[new Date().getDay()];
}

export function parseSlot(slotStr: string = ''): ParsedSlot {
  if (!slotStr) {
    const todayId = getTodayDayId();
    return { dayId: todayId, timeKey: 'Immediate', isToday: true };
  }

  const lower = slotStr.toLowerCase();
  const todayId = getTodayDayId();

  let resolvedDay: string = todayId;
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

  let timeKey = '10:00 AM';
  const parenMatch = slotStr.match(/\((.*?)\)/);
  if (parenMatch && parenMatch[1]) {
    timeKey = parenMatch[1].trim();
  } else {
    const timeMatch = slotStr.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\b/i);
    if (timeMatch) {
      timeKey = timeMatch[1].trim().toUpperCase();
    } else if (lower.includes('immediate')) {
      timeKey = 'Immediate';
    }
  }

  return { dayId: resolvedDay, timeKey, isToday };
}

export function formatOrderTimestamp(isoString?: string): string {
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

export function formatCurrency(amount: number | string = 0, currency: string = 'GH₵'): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
