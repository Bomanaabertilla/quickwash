import React, { useState, useEffect } from 'react';
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
  Moon,
  Send,
  Eye,
  AlertCircle,
  Trash2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { getPublishedAvailability, savePublishedAvailability } from '../data/availabilityStore.js';
import { getCurrentWeekLabel, getCalendarWeek } from '../utils/dateUtils.js';

export default function OwnerWeeklyAvailabilityScreen({ onShowToast, onPreviewCustomerView }) {
  // Load initial availability state from storage or default
  const [availabilityState, setAvailabilityState] = useState(() => getPublishedAvailability());
  const [isPublished, setIsPublished] = useState(() => availabilityState.isPublished);
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);

  // 7 Days state
  const [days, setDays] = useState(() => availabilityState.days);

  // Modal for editing a specific day's slots & hours
  const [selectedDayModal, setSelectedDayModal] = useState(null);
  const [newSlotTime, setNewSlotTime] = useState('11:00 AM');

  // Sync to storage on mount
  useEffect(() => {
    const current = getPublishedAvailability();
    if (current && current.days) {
      setDays(current.days);
      setIsPublished(current.isPublished);
    }
  }, []);

  // Action: Copy previous week's schedule
  const handleCopyPreviousWeek = () => {
    const updated = days.map(d => {
      if (d.id === 'sun') {
        return {
          ...d,
          status: 'Closed',
          hours: 'Closed',
          slots: []
        };
      }
      return {
        ...d,
        status: 'Open',
        hours: d.id === 'sat' ? '9:00 AM – 5:00 PM' : '8:00 AM – 6:30 PM',
        slots: d.id === 'sat' ? [
          { time: '9:00 AM', period: 'Morning', status: 'Available', capacity: 4 },
          { time: '11:30 AM', period: 'Morning', status: 'Available', capacity: 4 },
          { time: '2:00 PM', period: 'Afternoon', status: 'Available', capacity: 4 },
          { time: '4:30 PM', period: 'Evening', status: 'Available', capacity: 4 }
        ] : [
          { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
          { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
          { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
          { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
          { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
        ]
      };
    });
    setDays(updated);
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast('Copied schedule. Click "Publish Availability" to push live to customers.');
  };

  // Action: Set standard hours
  const handleSetStandardHours = () => {
    const updated = days.map(d => {
      if (d.id === 'sun') {
        return { ...d, status: 'Closed', hours: 'Closed', slots: [] };
      }
      return {
        ...d,
        status: 'Open',
        hours: '8:00 AM – 6:00 PM',
        slots: [
          { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
          { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
          { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
          { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
          { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
        ]
      };
    });
    setDays(updated);
    setIsUnsavedChanges(true);
    if (onShowToast) onShowToast('Standard hours configured (Mon–Sat 8:00 AM – 6:00 PM)');
  };

  // Action: Toggle single day open/closed
  const handleToggleDay = (dayId) => {
    const next = days.map(d => {
      if (d.id === dayId) {
        const willOpen = d.status === 'Closed';
        return {
          ...d,
          status: willOpen ? 'Open' : 'Closed',
          hours: willOpen ? '8:00 AM – 6:30 PM' : 'Closed',
          slots: willOpen ? [
            { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
            { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
            { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
            { time: '3:30 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
            { time: '5:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
          ] : []
        };
      }
      return d;
    });
    setDays(next);
    setIsUnsavedChanges(true);
  };

  // Action: Publish schedule live to marketplace and customer storefront
  const handlePublishSchedule = () => {
    const weekInfo = getCalendarWeek();
    const payload = {
      isPublished: true,
      weekRange: weekInfo.weekRange,
      weekLabel: weekInfo.weekLabel,
      days: days.map(d => {
        const calDay = weekInfo.days.find(c => c.id === d.id);
        return {
          ...d,
          date: calDay?.date || d.date,
          month: calDay?.month || d.month,
          dayNum: calDay?.dayNum || d.dayNum
        };
      })
    };
    savePublishedAvailability(payload);
    setIsPublished(true);
    setIsUnsavedChanges(false);
    if (onShowToast) onShowToast('✅ Published weekly availability! Customers can now book open pickup slots.');
  };

  // Action: Unpublish / Reset schedule to offline blueprint
  const handleUnpublishSchedule = () => {
    const weekInfo = getCalendarWeek();
    const closedDays = days.map(d => {
      const calDay = weekInfo.days.find(c => c.id === d.id);
      return {
        ...d,
        date: calDay?.date || d.date,
        month: calDay?.month || d.month,
        dayNum: calDay?.dayNum || d.dayNum,
        status: 'Closed',
        hours: 'Closed',
        slots: []
      };
    });
    setDays(closedDays);
    const payload = {
      isPublished: false,
      weekRange: weekInfo.weekRange,
      weekLabel: weekInfo.weekLabel,
      days: closedDays
    };
    savePublishedAvailability(payload);
    setIsPublished(false);
    setIsUnsavedChanges(false);
    if (onShowToast) onShowToast('Unpublished schedule. Intake is now offline.');
  };

  // Handle saving customized day slots from modal
  const handleSaveDayModal = (e) => {
    e.preventDefault();
    if (!selectedDayModal) return;
    setDays(prev => prev.map(d => d.id === selectedDayModal.id ? selectedDayModal : d));
    setIsUnsavedChanges(true);
    setSelectedDayModal(null);
    if (onShowToast) onShowToast(`Updated ${selectedDayModal.fullName} slots & hours`);
  };

  const handleAddSlotToModal = () => {
    if (!newSlotTime.trim() || !selectedDayModal) return;
    const existing = selectedDayModal.slots || [];
    if (existing.some(s => s.time === newSlotTime)) {
      if (onShowToast) onShowToast('Slot already exists for this day');
      return;
    }
    const newSlot = {
      time: newSlotTime,
      period: newSlotTime.includes('AM') ? 'Morning' : 'Afternoon',
      status: 'Available',
      capacity: 5
    };
    setSelectedDayModal({
      ...selectedDayModal,
      slots: [...existing, newSlot]
    });
    setNewSlotTime('');
  };

  const handleRemoveSlotFromModal = (slotTime) => {
    if (!selectedDayModal) return;
    setSelectedDayModal({
      ...selectedDayModal,
      slots: selectedDayModal.slots.filter(s => s.time !== slotTime)
    });
  };

  const totalOpenDays = days.filter(d => d.status === 'Open').length;
  const totalSlots = days.reduce((acc, d) => acc + (d.slots ? d.slots.length : 0), 0);
  const totalOperatingHours = totalOpenDays * 10;

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-28 overflow-y-auto">
      
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

          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Weekly availability
            </h1>
            {isPublished && totalOpenDays > 0 ? (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PUBLISHED TO MARKETPLACE</span>
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>UNPUBLISHED (DRAFT)</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Manage booking intake caps, open time windows, and publish your live slots so customers can book on their app.
          </p>
        </div>

        {/* Date Selector & Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Week Selector Box */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs gap-3">
            <button 
              onClick={() => onShowToast && onShowToast(`Previous week: ${getCalendarWeek(new Date(), -1).weekRange}`)}
              className="p-0.5 hover:text-slate-600 text-slate-400 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Calendar className="w-4 h-4 text-[#008276]" />
            <span className="tracking-tight">{availabilityState.weekRange || getCurrentWeekLabel()}</span>
            <button 
              onClick={() => onShowToast && onShowToast(`Next week: ${getCalendarWeek(new Date(), 1).weekRange}`)}
              className="p-0.5 hover:text-slate-600 text-slate-400 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* This Week Button */}
          <button 
            onClick={() => onShowToast && onShowToast('Viewing current calendar week')}
            className="px-4 py-2 bg-[#dce6f5] hover:bg-[#d0ddf0] text-[#2c538a] rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            This week
          </button>

          {/* Publish Availability CTA Button */}
          <button
            onClick={handlePublishSchedule}
            className="bg-[#008276] hover:bg-[#007065] text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Availability</span>
          </button>

        </div>

      </div>

      {/* Main Content Area */}
      <div className="px-6 lg:px-10 max-w-7xl mx-auto w-full flex flex-col gap-8 mt-2">
        
        {/* Hero Card: No availability set / Configured state */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-3.5 max-w-2xl">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-[#edf2f9] text-[#33557d] text-xs font-bold px-3.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33557d]"></span>
              <span>Upcoming Week • {availabilityState.weekRange || getCurrentWeekLabel()}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalOpenDays > 0 
                ? (isPublished ? 'Weekly schedule is live for customers' : 'Availability configured (Ready to publish)')
                : 'No availability set for this week'}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {totalOpenDays > 0
                ? (isPublished 
                    ? `Your ${totalOpenDays} open operating days and ${totalSlots} pickup slots are live on the customer storefront. Customers in Accra Central can book these time windows.`
                    : `You have configured ${totalOpenDays} days with ${totalSlots} slots. Click "Publish Availability" below to sync with customer storefronts.`)
                : 'Set your operating slots and delivery capacity to start taking customer bookings, or quickly duplicate last week\'s schedule.'}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3.5 pt-2 flex-wrap">
              <button
                onClick={handleCopyPreviousWeek}
                className="bg-[#005a52] hover:bg-[#004a43] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
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

              {totalOpenDays > 0 && (
                <button
                  onClick={handleUnpublishSchedule}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Unpublish / Reset All</span>
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
              {totalOpenDays > 0 ? `${totalOperatingHours} Hours Configured` : '0 Hours Configured'}
            </h3>

            <p className="text-xs text-slate-400 font-medium mt-1">
              {totalOpenDays > 0 ? `${totalSlots} active pickup slots` : 'Intake currently offline'}
            </p>

            {isPublished && totalOpenDays > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-2 flex items-center gap-1">
                <Check className="w-3 h-3" /> Live on Customer App
              </span>
            )}

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
                totalOpenDays > 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {totalOpenDays > 0 
                  ? `${totalOpenDays} of 7 Days Open (${totalSlots} Slots)` 
                  : 'All Days Closed'}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-normal">
              Click any day card or "Adjust slots" to customize pickup time windows
            </span>
          </div>

          {/* 7 Days Grid (Mon – Sun) matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {days.map((day) => {
              const isOpen = day.status === 'Open';
              const slotCount = day.slots ? day.slots.length : 0;

              return (
                <div
                  key={day.id}
                  onClick={() => setSelectedDayModal({ ...day })}
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
                            {slotCount} active slots
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDay(day.id);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isOpen
                          ? 'bg-teal-50 text-[#008276] hover:bg-teal-100'
                          : 'bg-[#eef3f9] text-slate-600 hover:bg-[#e2eaf4]'
                      }`}
                    >
                      <span>{isOpen ? 'Close day' : '+ Open day'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Floating Bottom Publishing Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-4 flex items-center gap-4 flex-wrap max-w-2xl w-[92%] justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isPublished && totalOpenDays > 0 ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
          <div>
            <span className="text-xs font-black text-slate-900 block">
              {isPublished && totalOpenDays > 0 
                ? 'Marketplace Live: Customers can book these slots' 
                : (totalOpenDays > 0 ? 'Draft updates pending publish' : 'Intake currently offline')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalOpenDays} days open • {totalSlots} pickup windows configured
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePublishSchedule}
            className="bg-[#008276] hover:bg-[#007065] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Customers</span>
          </button>
        </div>
      </div>

      {/* Edit Day Slots Modal Dialog */}
      {selectedDayModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {selectedDayModal.fullName}, {selectedDayModal.date}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedDayModal.status === 'Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedDayModal.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Configure operating windows and customer pickup slots
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDayModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDayModal} className="flex flex-col gap-4 text-xs font-medium">
              
              {/* Day Open/Close Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800">Store Status for {selectedDayModal.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    const willOpen = selectedDayModal.status === 'Closed';
                    setSelectedDayModal({
                      ...selectedDayModal,
                      status: willOpen ? 'Open' : 'Closed',
                      hours: willOpen ? '8:00 AM – 6:30 PM' : 'Closed',
                      slots: willOpen && (!selectedDayModal.slots || selectedDayModal.slots.length === 0) ? [
                        { time: '8:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
                        { time: '10:00 AM', period: 'Morning', status: 'Available', capacity: 5 },
                        { time: '1:00 PM', period: 'Afternoon', status: 'Available', capacity: 5 },
                        { time: '4:00 PM', period: 'Evening', status: 'Available', capacity: 5 }
                      ] : selectedDayModal.slots
                    });
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    selectedDayModal.status === 'Open'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {selectedDayModal.status === 'Open' ? 'Open for Bookings' : 'Closed'}
                </button>
              </div>

              {selectedDayModal.status === 'Open' && (
                <>
                  {/* Operating Hours */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Operating Hours Display</label>
                    <input
                      type="text"
                      value={selectedDayModal.hours}
                      onChange={(e) => setSelectedDayModal({ ...selectedDayModal, hours: e.target.value })}
                      placeholder="e.g. 8:00 AM – 6:30 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                    />
                  </div>

                  {/* Active Pickup Slot Time Windows */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700">Pickup Time Windows</label>
                      <span className="text-[11px] text-[#008276] font-bold">
                        {selectedDayModal.slots ? selectedDayModal.slots.length : 0} slots
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                      {selectedDayModal.slots && selectedDayModal.slots.map((slot) => (
                        <div
                          key={slot.time}
                          className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#008276]" />
                            <span className="font-bold text-slate-900">{slot.time}</span>
                            <span className="text-[10.5px] text-slate-400">({slot.capacity || 5} orders max)</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSlotFromModal(slot.time)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Slot row */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="e.g. 2:30 PM"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008276]"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlotToModal}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#008276] rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        + Add Slot
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDayModal(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008276] hover:bg-[#007065] text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-teal-200" />
                  <span>Save Day Settings</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
