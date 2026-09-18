// Date & Time utilities for backend routes and database seeds

export interface ServerCalendarDay {
  id: string;
  name: string;
  fullName: string;
  date: string;
  month: string;
  dayNum: string;
  fullDateStr: string;
}

export interface ServerCalendarWeek {
  weekRange: string;
  weekLabel: string;
  monday: Date;
  sunday: Date;
  days: ServerCalendarDay[];
}

export function getCalendarWeek(refDate: Date = new Date(), weekOffset: number = 0): ServerCalendarWeek {
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

  const days: ServerCalendarDay[] = dayMeta.map((m, idx) => {
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
