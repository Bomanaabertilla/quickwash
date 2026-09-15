import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Copy,
  Sliders,
  CheckCircle,
  RefreshCw,
  Power,
  ChevronLeft,
  ChevronRight,
  Flame,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  XCircle,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';

export default function OwnerWeeklyAvailabilityScreen({ onShowToast }) {
  // Days of the week configuration
  const [days, setDays] = useState([
    { id: 'mon', name: 'Mon', date: 'May 12', isToday: false, enabled: true },
    { id: 'tue', name: 'Tue', date: 'May 13', isToday: true, enabled: true },
    { id: 'wed', name: 'Wed', date: 'May 14', isToday: false, enabled: true },
    { id: 'thu', name: 'Thu', date: 'May 15', isToday: false, enabled: true },
    { id: 'fri', name: 'Fri', date: 'May 16', isToday: false, enabled: true },
    { id: 'sat', name: 'Sat', date: 'May 17', isToday: false, enabled: true },
  ]);

  // Initial slot grid dataset mapped by [timeId][dayId] = { booked, capacity, active }
  const [scheduleGrid, setScheduleGrid] = useState({
    // Morning Window
    '8:00 AM': {
      label: '8:00 AM',
      sublabel: 'First dropoff',
      window: 'morning',
      mon: { booked: 4, capacity: 4, active: true },
      tue: { booked: 3, capacity: 4, active: true },
      wed: { booked: 2, capacity: 4, active: true },
      thu: { booked: 4, capacity: 4, active: true },
      fri: { booked: 3, capacity: 4, active: true },
      sat: { booked: 1, capacity: 4, active: true },
    },
    '9:00 AM': {
      label: '9:00 AM',
      sublabel: 'Standard wash',
      window: 'morning',
      mon: { booked: 4, capacity: 4, active: true },
      tue: { booked: 4, capacity: 4, active: true },
      wed: { booked: 3, capacity: 4, active: true },
      thu: { booked: 3, capacity: 4, active: true },
      fri: { booked: 4, capacity: 5, active: true },
      sat: { booked: 2, capacity: 4, active: true },
    },
    '10:15 AM': {
      label: '10:15 AM',
      sublabel: 'Late morning',
      window: 'morning',
      mon: { booked: 3, capacity: 4, active: true },
      tue: { booked: 2, capacity: 4, active: true },
      wed: { booked: 4, capacity: 4, active: true },
      thu: { booked: 2, capacity: 4, active: true },
      fri: { booked: 4, capacity: 4, active: true },
      sat: { booked: 2, capacity: 4, active: true },
    },

    // Afternoon Window
    '12:15 PM': {
      label: '12:15 PM',
      sublabel: 'Midday drop',
      window: 'afternoon',
      mon: { booked: 3, capacity: 4, active: true },
      tue: { booked: 4, capacity: 4, active: true },
      wed: { booked: 2, capacity: 4, active: true },
      thu: { booked: 3, capacity: 4, active: true },
      fri: { booked: 3, capacity: 4, active: true },
      sat: { booked: 3, capacity: 4, active: true },
    },
    '1:30 PM': {
      label: '1:30 PM',
      sublabel: 'Peak demand',
      isPeak: true,
      window: 'afternoon',
      mon: { booked: 4, capacity: 4, active: true },
      tue: { booked: 5, capacity: 5, active: true },
      wed: { booked: 3, capacity: 4, active: true },
      thu: { booked: 3, capacity: 4, active: true },
      fri: { booked: 4, capacity: 4, active: true },
      sat: { booked: 2, capacity: 4, active: true },
    },
    '2:45 PM': {
      label: '2:45 PM',
      sublabel: 'Afternoon cycle',
      window: 'afternoon',
      mon: { booked: 2, capacity: 4, active: true },
      tue: { booked: 2, capacity: 4, active: true },
      wed: { booked: 3, capacity: 4, active: true },
      thu: { booked: 2, capacity: 4, active: true },
      fri: { booked: 3, capacity: 4, active: true },
      sat: { booked: 2, capacity: 4, active: true },
    },

    // Evening Window
    '4:15 PM': {
      label: '4:15 PM',
      sublabel: 'Early commuter',
      window: 'evening',
      mon: { booked: 2, capacity: 4, active: true },
      tue: { booked: 3, capacity: 4, active: true },
      wed: { booked: 3, capacity: 4, active: true },
      thu: { booked: 2, capacity: 4, active: true },
      fri: { booked: 3, capacity: 4, active: true },
      sat: { booked: 2, capacity: 4, active: true },
    },
    '5:30 PM': {
      label: '5:30 PM',
      sublabel: 'Evening peak',
      window: 'evening',
      mon: { booked: 4, capacity: 4, active: true },
      tue: { booked: 2, capacity: 4, active: true },
      wed: { booked: 1, capacity: 4, active: true },
      thu: { booked: 2, capacity: 4, active: true },
      fri: { booked: 2, capacity: 4, active: true },
      sat: { booked: 1, capacity: 4, active: true },
    },
    '6:45 PM': {
      label: '6:45 PM',
      sublabel: 'Last collection',
      window: 'evening',
      mon: { booked: 2, capacity: 4, active: true },
      tue: { booked: 1, capacity: 4, active: true },
      wed: { booked: 1, capacity: 4, active: true },
      thu: { booked: 2, capacity: 4, active: true },
      fri: { booked: 1, capacity: 4, active: true },
      sat: { booked: 1, capacity: 4, active: true },
    },
  });

  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);

  // Toggle day enabled status
  const handleToggleDay = (dayId) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, enabled: !d.enabled } : d))
    );
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast(`Toggled availability for day: ${dayId.toUpperCase()}`);
  };

  // Adjust capacity for a specific slot
  const handleAdjustCapacity = (timeKey, dayId, delta) => {
    setScheduleGrid((prev) => {
      const slot = prev[timeKey][dayId];
      const newCap = Math.max(slot.booked, slot.capacity + delta);
      return {
        ...prev,
        [timeKey]: {
          ...prev[timeKey],
          [dayId]: {
            ...slot,
            capacity: newCap,
          },
        },
      };
    });
    setIsUnsavedChanges(true);
  };

  // Toggle active power status of a slot
  const handleToggleSlotActive = (timeKey, dayId) => {
    setScheduleGrid((prev) => {
      const slot = prev[timeKey][dayId];
      return {
        ...prev,
        [timeKey]: {
          ...prev[timeKey],
          [dayId]: {
            ...slot,
            active: !slot.active,
          },
        },
      };
    });
    setIsUnsavedChanges(true);
  };

  // Set default capacity (4/slot)
  const handleSetDefaultCapacity = () => {
    setScheduleGrid((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((timeKey) => {
        days.forEach((d) => {
          updated[timeKey][d.id] = {
            ...updated[timeKey][d.id],
            capacity: Math.max(updated[timeKey][d.id].booked, 4),
            active: true,
          };
        });
      });
      return updated;
    });
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast('Reset default capacity to 4 orders/slot across all windows');
  };

  // Copy last week schedule
  const handleCopyLastWeek = () => {
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast("Successfully duplicated last week's schedule & capacity rules!");
  };

  // Mark specific day closed via dropdown
  const handleMarkDayClosed = (dayId) => {
    setDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, enabled: false } : d))
    );
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast(`Marked ${dayId.toUpperCase()} as closed/blackout`);
  };

  // Save changes
  const handleSave = () => {
    setIsUnsavedChanges(false);
    if (onShowToast) onShowToast('Weekly availability & slot capacity live synced to customer app!');
  };

  // Compute stats across the grid
  const metrics = useMemo(() => {
    let totalCap = 0;
    let totalBooked = 0;
    let activeSlotCount = 0;
    let peakSlot = { name: 'Tue 1:30 PM', ratio: '5/5', load: 100 };

    days.forEach((day) => {
      if (!day.enabled) return;
      Object.keys(scheduleGrid).forEach((timeKey) => {
        const slot = scheduleGrid[timeKey][day.id];
        if (slot && slot.active) {
          totalCap += slot.capacity;
          totalBooked += slot.booked;
          activeSlotCount += 1;
        }
      });
    });

    // Compute day totals for totals row
    const dayTotals = {};
    days.forEach((day) => {
      let b = 0;
      let c = 0;
      Object.keys(scheduleGrid).forEach((timeKey) => {
        const slot = scheduleGrid[timeKey][day.id];
        if (day.enabled && slot.active) {
          b += slot.booked;
          c += slot.capacity;
        }
      });
      dayTotals[day.id] = { booked: b, capacity: c };
    });

    const loadPct = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : 0;

    return {
      totalCap,
      totalBooked,
      activeSlotCount,
      loadPct,
      peakSlot,
      dayTotals,
    };
  }, [scheduleGrid, days]);

  // Helper renderer for capacity pill status styling
  const renderSlotStatusPill = (slot, isDayEnabled) => {
    if (!isDayEnabled || !slot.active) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-500 uppercase tracking-wider">
          Closed
        </span>
      );
    }
    const ratio = slot.booked / slot.capacity;
    if (ratio >= 1.0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-rose-500 text-white flex items-center gap-1 shadow-xs">
          <span>Full</span>
          {slot.capacity > 4 && <span>({slot.booked}/{slot.capacity})</span>}
        </span>
      );
    }
    if (ratio >= 0.75) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-500 text-white">
          {slot.booked} / {slot.capacity}
        </span>
      );
    }
    if (ratio >= 0.5) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#006a60] text-white">
          {slot.booked} / {slot.capacity}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-sky-100 text-sky-700">
        {slot.booked} / {slot.capacity}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fb] text-slate-900 pb-24 overflow-x-auto custom-scrollbar">
      
      {/* Sub-Header Navigation & Control Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        
        {/* Left: Week selector & status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 font-extrabold text-xs text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-[#006a60]" />
              <span>Week of May 12 – May 18, 2026</span>
            </div>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-slate-200/60">
            This week
          </button>

          {/* Live schedule synced status badge */}
          <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200/70 px-2.5 py-1 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>Live schedule synced</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLastWeek}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy last week's schedule</span>
          </button>

          <button
            onClick={handleSetDefaultCapacity}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Set default capacity (4/slot)</span>
          </button>

          {/* Mark day closed drop menu */}
          <div className="relative group">
            <select
              onChange={(e) => {
                if (e.target.value) handleMarkDayClosed(e.target.value);
              }}
              defaultValue=""
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer appearance-none pr-7 shadow-2xs"
            >
              <option value="" disabled>Mark day closed ▾</option>
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  Close {d.name} ({d.date})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#006a60] hover:bg-[#005850] text-white px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all border border-teal-400/30"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>Apply changes</span>
          </button>
        </div>

      </div>

      {/* Capacity State Indicator Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">Capacity state:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="font-medium text-slate-700">Full (100%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-medium text-slate-700">Filling (50-99%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006a60]"></span>
            <span className="font-medium text-slate-700">Available (&lt;50%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="font-medium text-slate-700">Blacked out / Closed</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Click limit counter to adjust slot intake quota. Closed slots prevent checkout.</span>
        </div>
      </div>

      {/* Main Schedule Matrix Grid Table */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs min-w-[920px] overflow-hidden">
          
          {/* Table Header Row: Days */}
          <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/80">
            {/* Corner header */}
            <div className="p-3.5 flex flex-col justify-center border-r border-slate-200/60 bg-slate-100/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Time Windows</span>
              <span className="text-xs font-extrabold text-slate-800 mt-0.5">Standard slots</span>
            </div>

            {/* Day Column Headers */}
            {days.map((day) => {
              const dayTotal = metrics.dayTotals[day.id] || { booked: 0, capacity: 0 };
              return (
                <div
                  key={day.id}
                  className={`p-3 border-r last:border-r-0 border-slate-200/60 flex flex-col items-center justify-between transition-colors ${
                    day.isToday ? 'bg-teal-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">{day.name}</span>
                    {day.isToday && (
                      <span className="bg-[#006a60] text-white text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md uppercase">
                        Today
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium">{day.date}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between w-full text-[11px]">
                    <span className="font-bold text-slate-600">
                      {dayTotal.booked} / {dayTotal.capacity} <span className="font-normal text-[10px] text-slate-400">booked</span>
                    </span>

                    <button
                      onClick={() => handleToggleDay(day.id)}
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                        day.enabled
                          ? 'bg-slate-200/70 hover:bg-slate-300 text-slate-700 border-slate-300'
                          : 'bg-rose-100 text-rose-700 border-rose-300'
                      }`}
                    >
                      {day.enabled ? 'Toggle' : 'Closed'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Matrix Rows grouped by Time Window */}
          {[
            {
              title: 'Morning Window',
              timeRange: '8:00 AM – 11:00 AM',
              icon: Sun,
              iconColor: 'text-amber-500',
              bgColor: 'bg-amber-50/40',
              slots: ['8:00 AM', '9:00 AM', '10:15 AM'],
            },
            {
              title: 'Afternoon Window',
              timeRange: '12:00 PM – 3:00 PM',
              icon: Sun,
              iconColor: 'text-orange-500',
              bgColor: 'bg-orange-50/40',
              slots: ['12:15 PM', '1:30 PM', '2:45 PM'],
            },
            {
              title: 'Evening Window',
              timeRange: '4:00 PM – 7:00 PM',
              icon: Moon,
              iconColor: 'text-indigo-500',
              bgColor: 'bg-indigo-50/40',
              slots: ['4:15 PM', '5:30 PM', '6:45 PM'],
            },
          ].map((section) => (
            <React.Fragment key={section.title}>
              
              {/* Section Header Row */}
              <div className={`px-4 py-2 border-y border-slate-200/80 ${section.bgColor} flex items-center gap-2 font-bold text-xs text-slate-800`}>
                <section.icon className={`w-4 h-4 ${section.iconColor}`} />
                <span className="font-extrabold tracking-tight">{section.title}</span>
                <span className="text-slate-500 font-normal">{section.timeRange}</span>
              </div>

              {/* Slots inside Section */}
              {section.slots.map((timeKey) => {
                const rowData = scheduleGrid[timeKey];
                return (
                  <div key={timeKey} className="grid grid-cols-7 border-b border-slate-200/60 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Slot Title Cell */}
                    <div className="p-3 border-r border-slate-200/60 flex flex-col justify-center bg-slate-50/30">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">{rowData.label}</span>
                        {rowData.isPeak && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{rowData.sublabel}</span>
                    </div>

                    {/* 6 Day Cells */}
                    {days.map((day) => {
                      const slot = rowData[day.id];
                      const isDayEnabled = day.enabled;

                      return (
                        <div
                          key={day.id}
                          className={`p-2.5 border-r last:border-r-0 border-slate-200/60 flex flex-col items-center justify-between gap-1.5 ${
                            !isDayEnabled || !slot.active
                              ? 'bg-slate-100/60'
                              : day.isToday
                              ? 'bg-teal-50/20'
                              : 'bg-white'
                          }`}
                        >
                          {/* Top row: Status Badge & Power Toggle button */}
                          <div className="flex items-center justify-between w-full">
                            {renderSlotStatusPill(slot, isDayEnabled)}

                            <button
                              onClick={() => handleToggleSlotActive(timeKey, day.id)}
                              className={`p-1 rounded-md transition-colors ${
                                slot.active && isDayEnabled
                                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                                  : 'text-rose-400 hover:text-rose-600 hover:bg-rose-100'
                              }`}
                              title={slot.active ? 'Disable this slot' : 'Enable this slot'}
                            >
                              <Power className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Capacity Counter Control: booked / capacity with - + buttons */}
                          {isDayEnabled && slot.active ? (
                            <div className="flex items-center justify-between w-full bg-slate-100/90 rounded-xl px-2 py-1 border border-slate-200/70 text-xs mt-0.5">
                              <span className="font-extrabold text-slate-800 text-[11.5px]">
                                {slot.booked} / {slot.capacity}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleAdjustCapacity(timeKey, day.id, -1)}
                                  disabled={slot.capacity <= slot.booked}
                                  className="w-4 h-4 rounded-md bg-white border border-slate-300 flex items-center justify-center font-extrabold text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white text-[11px]"
                                >
                                  -
                                </button>
                                <span className="font-bold text-[11px] text-slate-700 min-w-[10px] text-center">
                                  {slot.capacity}
                                </span>
                                <button
                                  onClick={() => handleAdjustCapacity(timeKey, day.id, 1)}
                                  className="w-4 h-4 rounded-md bg-white border border-slate-300 flex items-center justify-center font-extrabold text-slate-700 hover:bg-slate-200 text-[11px]"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10.5px] font-bold text-slate-400 py-1">
                              Blocked
                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                );
              })}

            </React.Fragment>
          ))}

        </div>
      </div>

      {/* Metrics & Guardrails Cards Section */}
      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Weekly Utilization & Capacity Metrics (2 cols wide) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between gap-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#006a60]" />
                <span>Weekly Utilization & Capacity Metrics</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live computational tally across {metrics.activeSlotCount} discrete slots
              </p>
            </div>

            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Optimal Intake Rate
            </span>
          </div>

          {/* 3 Metric Mini Cards */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Card 1: Total Capacity */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Weekly Capacity</span>
              <div className="mt-1">
                <span className="text-lg font-extrabold text-slate-900">{metrics.totalCap} orders</span>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Across 42 active pickup windows</p>
              </div>
            </div>

            {/* Card 2: Booked Orders */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booked Orders</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-[#006a60]">{metrics.totalBooked} booked</span>
                <span className="text-xs font-bold text-teal-700">[{metrics.loadPct}% load]</span>
              </div>
            </div>

            {/* Card 3: Peak Demand Bottleneck */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Peak Demand Bottleneck</span>
              <div className="mt-1">
                <div className="flex items-center gap-1 text-rose-600 font-extrabold text-sm">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Tue 1:30 PM</span>
                </div>
                <p className="text-[10.5px] text-rose-600 font-bold mt-0.5">100% full (5/5 orders)</p>
              </div>
            </div>

          </div>

          {/* Intra-day Booking Load Velocity SVG Chart */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>Intra-day Booking Load Velocity</span>
              <span className="text-[10px] font-mono text-slate-400">Mon • Tue • Wed • Thu • Fri • Sat • Sun</span>
            </div>

            <div className="h-16 w-full bg-slate-50 rounded-2xl border border-slate-200/70 p-2 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="loadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#006a60" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006a60" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 35 Q 40 38, 80 10 T 160 38 T 240 30 T 320 25 T 400 35 L 400 50 L 0 50 Z"
                  fill="url(#loadGrad)"
                />
                <path
                  d="M 0 35 Q 40 38, 80 10 T 160 38 T 240 30 T 320 25 T 400 35"
                  fill="none"
                  stroke="#006a60"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Red Peak Indicator Dot on Tue */}
                <circle cx="80" cy="10" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>
          </div>

        </div>

        {/* Right Column: Capacity Guardrails */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Capacity Guardrails</span>
            </h3>
            <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed mt-1.5">
              Standard wash turnaround operates at 4 garments/kg-batches per 80-minute window. Overbooking beyond 5 slots may cause delayed collection courier dispatches.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Turnaround buffer</span>
                <span className="text-[10.5px] text-slate-500">Dry cleaning requires 24h</span>
              </div>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                Standard
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Courier limit</span>
                <span className="text-[10.5px] text-slate-500">2 dispatch vans assigned</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                Active
              </span>
            </div>

          </div>

          <button
            onClick={() => {
              if (onShowToast) onShowToast('Restored standard store default capacity settings');
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/80 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restore standard store default</span>
          </button>
        </div>

      </div>

      {/* Bottom Sticky Schedule Summary & Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:px-8 flex flex-wrap items-center justify-between gap-3 z-40 shadow-lg">
        
        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-extrabold text-slate-900">Schedule Summary:</span>
          <span>
            Total weekly capacity: <strong className="text-slate-900">{metrics.totalCap} orders</strong> •{' '}
            <strong className="text-[#006a60]">{metrics.totalBooked} booked</strong> ({metrics.loadPct}% load) • Peak slot:{' '}
            <strong className="text-rose-600">{metrics.peakSlot.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isUnsavedChanges && (
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              Unsaved changes
            </span>
          )}

          <button
            onClick={() => {
              setIsUnsavedChanges(false);
              if (onShowToast) onShowToast('Discarded schedule modifications');
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            Discard changes
          </button>

          <button
            onClick={handleSave}
            className="bg-[#006a60] hover:bg-[#005850] text-white px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all border border-teal-400/30"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>Save weekly schedule</span>
          </button>
        </div>

      </div>

    </div>
  );
}
