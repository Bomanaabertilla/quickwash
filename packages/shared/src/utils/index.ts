// Shared Date and Formatting Utilities
import type { CalendarWeek, CalendarWeekDay } from '../types/index.js';

const DAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export function getTodayDayId(refDate: Date = new Date()): string {
  const day = refDate.getDay();
  // Sunday is 0 in JS Date, convert to 0-6 where Monday is 0
  const index = (day + 6) % 7;
  return DAY_IDS[index];
}

export function getCalendarWeek(refDate: Date = new Date(), weekOffset: number = 0): CalendarWeek {
  const current = new Date(refDate);
  current.setDate(current.getDate() + weekOffset * 7);

  const dayOfWeek = current.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(current);
  monday.setDate(current.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const today = new Date(refDate);
  today.setHours(0, 0, 0, 0);

  const days: CalendarWeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();
    const dayName = DAY_NAMES[i];
    const isToday = d.getTime() === today.getTime();

    days.push({
      dayId: DAY_IDS[i],
      dayName,
      dayNumber,
      monthName,
      formattedDate: `${monthName} ${dayNumber}`,
      dateKey: d.toISOString().split('T')[0],
      isToday,
      isoDate: d.toISOString()
    });
  }

  const firstDay = days[0];
  const lastDay = days[6];
  const startYear = new Date(monday).getFullYear();
  const weekLabel = `${firstDay.monthName} ${firstDay.dayNumber} – ${lastDay.monthName} ${lastDay.dayNumber}, ${startYear}`;

  return {
    weekLabel,
    startIso: firstDay.isoDate,
    endIso: lastDay.isoDate,
    days
  };
}

export function formatDashboardHeaderDate(refDate: Date = new Date()): string {
  const dayName = refDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = refDate.getDate();
  const monthName = refDate.toLocaleDateString('en-US', { month: 'short' });
  const year = refDate.getFullYear();
  return `${dayName}, ${dayNumber} ${monthName} ${year}`;
}

export function getCurrentWeekLabel(refDate: Date = new Date(), weekOffset: number = 0): string {
  const week = getCalendarWeek(refDate, weekOffset);
  return `Week of ${week.weekLabel}`;
}

export function formatCurrency(amount: number | string, currency: string = 'GH₵'): string {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return `${currency} 0.00`;
  return `${currency} ${val.toFixed(2)}`;
}
