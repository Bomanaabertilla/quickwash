import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Sliders,
  Plus,
  Minus,
  Check,
  X,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';

export default function OwnerWeeklyAvailabilityScreen({ onShowToast }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  // 7 Days for Week of May 25 – May 31, 2026 exactly matching the screenshot
  const [days, setDays] = useState([
    { 
      id: 'mon', 
      name: 'MON', 
      month: 'May',
      dayNum: '25', 
      fullDate: 'Monday, May 25, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
      hours: 'Closed'
    },
    { 
      id: 'tue', 
      name: 'TUE', 
      month: 'May',
      dayNum: '26', 
      fullDate: 'Tuesday, May 26, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
      hours: 'Closed'
    },
    { 
      id: 'wed', 
      name: 'WED', 
      month: 'May',
      dayNum: '27', 
      fullDate: 'Wednesday, May 27, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
      hours: 'Closed'
    },
    { 
      id: 'thu', 
      name: 'THU', 
      month: 'May',
      dayNum: '28', 
      fullDate: 'Thursday, May 28, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
      hours: 'Closed'
    },
    { 
      id: 'fri', 
      name: 'FRI', 
      month: 'May',
      dayNum: '29', 
      fullDate: 'Friday, May 29, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
      hours: 'Closed'
    },
    { 
      id: 'sat', 
      name: 'SAT', 
      month: 'May',
      dayNum: '30', 
      fullDate: 'Saturday, May 30, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
      hours: 'Closed'
    },
    { 
      id: 'sun', 
      name: 'SUN', 
      month: 'May',
      dayNum: '31', 
      fullDate: 'Sunday, May 31, 2026', 
      status: 'Closed', 
      activeSlots: 0,
      slots: [],
      hours: 'Closed'
    },
  ]);

  // Action: Copy previous week's schedule
  const handleCopyPreviousWeek = () => {
    setDays(prev => prev.map(d => {
      if (d.id === 'sun') {
        return { ...d, status: 'Closed', activeSlots: 0, hours: 'Closed' };
      }
      return {
        ...d,
        status: 'Open',
        activeSlots: d.id === 'sat' ? 4 : 5,
        hours: d.id === 'sat' ? '9:00 AM – 5:00 PM' : '8:00 AM – 6:30 PM'
      };
    }));
    setIsConfigured(true);
    if (onShowToast) onShowToast('Copied May 18–24 schedule (6 operating days, 29 intake slots)');
  };

  // Action: Set standard hours
  const handleSetStandardHours = () => {
    setDays(prev => prev.map(d => {
      if (d.id === 'sun') {
        return { ...d, status: 'Closed', activeSlots: 0, hours: 'Closed' };
      }
      return {
        ...d,
        status: 'Open',
        activeSlots: 5,
        hours: '8:00 AM – 6:00 PM'
      };
    }));
    setIsConfigured(true);
    if (onShowToast) onShowToast('Standard hours set: Monday to Saturday (8:00 AM – 6:00 PM)');
  };

  // Action: Toggle day status or open editor
  const handleToggleDay = (dayId) => {
    setDays(prev => {
      const next = prev.map(d => {
        if (d.id === dayId) {
          const willOpen = d.status === 'Closed';
          return {
            ...d,
            status: willOpen ? 'Open' : 'Closed',
            activeSlots: willOpen ? (d.id === 'sat' ? 4 : 5) : 0,
            hours: willOpen ? '8:00 AM – 6:30 PM' : 'Closed'
          };
        }
        return d;
      });
      const anyOpen = next.some(d => d.status === 'Open');
      setIsConfigured(anyOpen);
      return next;
    });
  };

  // Reset to unpublished empty blueprint
  const handleReset = () => {
    setDays(prev => prev.map(d => ({
      ...d,
      status: 'Closed',
      activeSlots: 0,
      hours: 'Closed'
    })));
    setIsConfigured(false);
    if (onShowToast) onShowToast('Reset schedule to unconfigured blueprint');
  };

  const totalOpenDays = days.filter(d => d.status === 'Open').length;
  const totalSlots = days.reduce((acc, d) => acc + d.activeSlots, 0);
  const totalOperatingHours = totalOpenDays * 10;

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-20 overflow-y-auto">
      
      {/* Sub-Header Breadcrumbs & Navigation Bar */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4">
        
        <div>
          {/* Breadcrumb row */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Operations</span>
            <span className="text-slate-400">&gt;</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Scheduling</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#008276] font-semibold">Weekly availability</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weekly availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Manage booking intake caps and time window capacity across the week.
          </p>
        </div>

        {/* Date Selector & Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Week Selector Box */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs gap-3">
            <button 
              onClick={() => onShowToast && onShowToast('Previous week: May 18 – May 24, 2026')}
              className="p-0.5 hover:text-slate-600 text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Calendar className="w-4 h-4 text-[#008276]" />
            <span className="tracking-tight">Week of May 25 – May 31, 2026</span>
            <button 
              onClick={() => onShowToast && onShowToast('Next week: Jun 1 – Jun 7, 2026')}
              className="p-0.5 hover:text-slate-600 text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* This Week Button */}
          <button 
            onClick={() => onShowToast && onShowToast('Viewing current calendar week')}
            className="px-4 py-2 bg-[#dce6f5] hover:bg-[#d0ddf0] text-[#2c538a] rounded-2xl text-xs sm:text-sm font-bold transition-colors"
          >
            This week
          </button>

          {/* Status Badge: Unpublished / Published */}
          {isConfigured ? (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Published</span>
            </span>
          ) : (
            <span className="bg-[#fde8e8] text-[#c53030] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#fbd5d5] flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#e53e3e]"></span>
              <span>Unpublished</span>
            </span>
          )}

        </div>

      </div>

      {/* Main Content Area */}
      <div className="px-6 lg:px-10 max-w-7xl mx-auto w-full flex flex-col gap-8 mt-2">
        
        {/* Hero Card: No availability set for this week */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-3.5 max-w-2xl">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-[#edf2f9] text-[#33557d] text-xs font-bold px-3.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33557d]"></span>
              <span>Upcoming Week • May 25 – May 31</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isConfigured ? 'Schedule configured for this week' : 'No availability set for this week'}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {isConfigured
                ? `You have opened ${totalOpenDays} operating days with ${totalSlots} booking slots. Customers can choose pickup times during these windows.`
                : 'Set your operating slots and delivery capacity to start taking customer bookings, or quickly duplicate last week\'s schedule.'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3.5 pt-2 flex-wrap">
              <button
                onClick={handleCopyPreviousWeek}
                className="bg-[#005a52] hover:bg-[#004a43] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Copy Previous Week's Schedule</span>
                <span className="bg-[#00423c] text-teal-200 text-[11px] font-bold px-2 py-0.5 rounded-md ml-1">
                  May 18–24
                </span>
              </button>

              <button
                onClick={handleSetStandardHours}
                className="text-slate-700 hover:text-slate-900 px-3 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Set Standard Hours</span>
              </button>

              {isConfigured && (
                <button
                  onClick={handleReset}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Closed</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column Metric Box */}
          <div className="bg-[#f4f7fb] border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center w-full md:w-64 min-h-[175px] flex-shrink-0 shadow-2xs">
            
            <div className="w-13 h-13 rounded-2xl bg-white text-[#008276] border border-slate-200/80 flex items-center justify-center shadow-xs mb-3">
              <Calendar className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {isConfigured ? `${totalOperatingHours} Hours Configured` : '0 Hours Configured'}
            </h3>

            <p className="text-xs text-slate-400 font-medium mt-1">
              {isConfigured ? `${totalSlots} intake slots active` : 'Intake currently offline'}
            </p>

          </div>

        </div>

        {/* Section: Weekly Schedule Blueprint */}
        <div className="flex flex-col gap-4">
          
          {/* Section Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Weekly Schedule Blueprint
              </h3>
              
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                isConfigured && totalOpenDays > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {isConfigured && totalOpenDays > 0 
                  ? `${totalOpenDays} of 7 Days Open` 
                  : 'All Days Closed'}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-normal">
              Select a day to open booking slots
            </span>
          </div>

          {/* 7 Days Grid (Mon – Sun) matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {days.map((day) => {
              const isOpen = day.status === 'Open';

              return (
                <div
                  key={day.id}
                  onClick={() => handleToggleDay(day.id)}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between min-h-[220px] transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                    isOpen
                      ? 'border-[#008276] ring-2 ring-[#008276]/15 bg-gradient-to-b from-white to-teal-50/25'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Top: Day Name and Status Pill */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-500 tracking-wider">
                        {day.name}
                      </span>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#e2e8f0] text-slate-700'
                      }`}>
                        {day.status}
                      </span>
                    </div>

                    {/* Month and Day Number stacked exactly like screenshot */}
                    <div className="mt-2.5">
                      <div className="text-xs font-semibold text-slate-500 leading-none">
                        {day.month}
                      </div>
                      <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5 tracking-tight">
                        {day.dayNum}
                      </div>
                    </div>

                    {/* Slot capacity / description */}
                    <div className="mt-3">
                      {isOpen ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#008276]">
                            {day.activeSlots} active slots
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            {day.hours}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">
                          No active slots
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom rounded pill toggle hint */}
                  <div className="pt-3 border-t border-slate-100/80 mt-4">
                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        isOpen
                          ? 'bg-teal-50 text-[#008276] hover:bg-teal-100'
                          : 'bg-[#eef3f9] text-slate-600 hover:bg-[#e2eaf4]'
                      }`}
                    >
                      <span>{isOpen ? 'Adjust slots' : '+ Open day'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
