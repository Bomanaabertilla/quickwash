import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Send,
  X,
  AlertTriangle,
  Flame,
  UserCheck,
  Package,
  Layers,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';
import { getOrders, saveOrders, updateOrderStatus } from '../data/ordersStore';

export default function OwnerBookingsScheduleScreen({ onShowToast }) {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All slots');
  const [selectedRider, setSelectedRider] = useState('Kwame Mensah (#41)');
  const [viewMode, setViewMode] = useState('comfortable'); // 'compact' | 'comfortable'
  const [orders, setOrders] = useState(() => getOrders());
  const [selectedOrderId, setSelectedOrderId] = useState(() => orders[0]?.id || 'LB-2026-0091');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setOrders(e.detail);
        if (!selectedOrderId && e.detail.length > 0) {
          setSelectedOrderId(e.detail[0].id);
        }
      } else {
        const fresh = getOrders();
        setOrders(fresh);
        if (!selectedOrderId && fresh.length > 0) {
          setSelectedOrderId(fresh[0].id);
        }
      }
    };
    window.addEventListener('quickwash:orders_updated', handleUpdate);
    return () => window.removeEventListener('quickwash:orders_updated', handleUpdate);
  }, [selectedOrderId]);

  // Selected Order Object
  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  // Days list for column matrix
  const daysList = [
    { id: 'mon', name: 'Mon', date: '12', isToday: false },
    { id: 'tue', name: 'Tue', date: '13', isToday: true },
    { id: 'wed', name: 'Wed', date: '14', isToday: false },
    { id: 'thu', name: 'Thu', date: '15', isToday: false },
    { id: 'fri', name: 'Fri', date: '16', isToday: false },
    { id: 'sat', name: 'Sat', date: '17', isToday: false }
  ];

  // Time slots for row matrix
  const timeSlots = [
    { key: '8:00 AM', label: '8:00 AM', sub: 'Pickup' },
    { key: '9:00 AM', label: '9:00 AM', sub: 'Transit' },
    { key: '10:15 AM', label: '10:15 AM', sub: 'Processing' },
    { key: '12:15 PM', label: '12:15 PM', sub: 'Noon' },
    { key: '1:30 PM', label: '1:30 PM', sub: 'ACTIVE', isPeak: true },
    { key: '4:15 PM', label: '4:15 PM', sub: 'Evening' }
  ];

  // Count summaries
  const stats = useMemo(() => {
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const inProgress = orders.filter(o => o.status === 'In progress').length;
    const ready = orders.filter(o => o.status === 'Ready / Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    return { confirmed, inProgress, ready, cancelled, total: orders.length };
  }, [orders]);

  // Filtered Orders calculation based on statusFilter and searchQuery
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (statusFilter && statusFilter !== 'All' && statusFilter !== 'All slots') {
        if (statusFilter === 'Confirmed') {
          if (order.status !== 'Confirmed') return false;
        } else if (statusFilter === 'In progress') {
          if (order.status !== 'In progress' && order.status !== 'In wash') return false;
        } else if (statusFilter === 'Ready / Delivered') {
          if (order.status !== 'Ready / Delivered' && order.status !== 'Ready' && order.status !== 'Delivered') return false;
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomer = order.customerName.toLowerCase().includes(query);
        const matchesSummary = order.summary?.toLowerCase().includes(query);
        if (!matchesId && !matchesCustomer && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Handle status update of selected order
  const handleUpdateOrderStatus = (newStatus) => {
    if (!selectedOrder?.id) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    if (onShowToast) onShowToast(`Updated #${selectedOrder.id} status to: ${newStatus}`);
  };

  // Helper for status badge styling
  const renderStatusBadge = (status) => {
    if (status === 'Confirmed') {
      return (
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Confirmed
        </span>
      );
    }
    if (status === 'In progress' || status === 'In wash') {
      return (
        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
          In wash
        </span>
      );
    }
    if (status === 'Ready / Delivered' || status === 'Ready' || status === 'Delivered') {
      return (
        <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-sky-600" />
          Ready
        </span>
      );
    }
    return (
      <span className="bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
        Cancelled
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBFBF9] text-stone-800 overflow-x-auto custom-scrollbar pb-16">
      
      {/* Sub-Header Bar 1: Week Picker & Stat Summary Pills */}
      <div className="bg-white border-b border-stone-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Date Navigator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 font-extrabold text-xs text-stone-800">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0D6352]" />
              <span>May 12 – May 18, 2026</span>
              <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded-md">
                Week 20
              </span>
            </div>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-stone-200">
            Jump to today
          </button>
        </div>

        {/* Status Count Summary - Calm & Unified */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span>{stats.confirmed} Confirmed</span>
          <span className="text-stone-300">•</span>
          <span>{stats.inProgress} In Wash</span>
          <span className="text-stone-300">•</span>
          <span>{stats.ready} Ready</span>
        </div>

      </div>

      {/* Sub-Header Bar 2: Clean Filter Toolbar */}
      <div className="px-4 sm:px-6 py-2.5 bg-stone-50/70 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Search input & Status Tabs */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          {/* Search box */}
          <div className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs w-56 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name or service..."
              className="w-full bg-transparent focus:outline-none text-stone-800 font-medium placeholder-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All slots', 'Confirmed', 'In progress', 'Ready / Delivered'].map((pillLabel) => {
              const isActive = statusFilter === pillLabel || (statusFilter === 'All' && pillLabel === 'All slots');
              return (
                <button
                  key={pillLabel}
                  onClick={() => {
                    setStatusFilter(pillLabel);
                  }}
                  className={`px-3 py-1 rounded-xl font-semibold text-xs transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {pillLabel}
                  {pillLabel === 'Confirmed' && ` (${stats.confirmed})`}
                  {pillLabel === 'In progress' && ` (${stats.inProgress})`}
                  {pillLabel === 'Ready / Delivered' && ` (${stats.ready})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Courier selector & Export button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-[#006a60]" />
            <select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="Kwame Mensah (#41)">Kwame Mensah (#41)</option>
              <option value="Kofi Ansah (#412)">Kofi Ansah (#412)</option>
              <option value="Yaw Mensah (#405)">Yaw Mensah (#405)</option>
              <option value="All Couriers">All Couriers</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (onShowToast) onShowToast('Exported weekly schedule manifest (CSV/PDF)');
            }}
            className="bg-white hover:bg-slate-100 text-slate-700 p-2 rounded-xl border border-slate-300 transition-colors shadow-2xs"
            title="Export Manifest"
          >
            <Download className="w-4 h-4 text-slate-600" />
          </button>
        </div>

      </div>

      {/* Main Bookings & Schedule Calendar Grid Table OR Empty State */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        {filteredOrders.length === 0 ? (
          /* Empty State View when no orders match the filter */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 flex flex-col items-center justify-center text-center shadow-2xs max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3.5">
              <Package className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              No {statusFilter === 'All slots' ? '' : `"${statusFilter}"`} bookings found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              {searchQuery
                ? `No orders matched your search query "${searchQuery}". Try searching by a different name or order code.`
                : `There are currently no laundry bookings matching the "${statusFilter}" status filter for this calendar week.`}
            </p>
            <button
              onClick={() => {
                setStatusFilter('All slots');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 bg-[#008276] hover:bg-[#007065] text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
            >
              View all slots ({orders.length} total bookings)
            </button>
          </div>
        ) : (
          /* Matrix Table with filtered orders */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs min-w-[960px] overflow-hidden">
            
            {/* Matrix Column Headers: Days of the Week */}
            <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/90">
              
              {/* Time Header Corner */}
              <div className="p-3.5 flex items-center justify-center border-r border-slate-200/60 bg-slate-100/60 font-extrabold text-[11px] uppercase tracking-wider text-slate-400">
                TIME
              </div>

              {/* 6 Day Column Headers */}
              {daysList.map((day) => (
                <div
                  key={day.id}
                  className={`p-3 border-r last:border-r-0 border-slate-200/60 flex flex-col items-center justify-center transition-colors ${
                    day.isToday ? 'bg-sky-50/70 border-b-2 border-b-sky-500' : ''
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{day.name}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-extrabold text-slate-900">{day.date}</span>
                    {day.isToday && (
                      <span className="text-[9px] font-extrabold text-sky-700 uppercase tracking-tight">
                        TODAY
                      </span>
                    )}
                  </div>
                </div>
              ))}

            </div>

            {/* Matrix Rows by Time Slot */}
            {timeSlots.map((slot) => (
              <div key={slot.key} className="grid grid-cols-7 border-b border-slate-200/60 hover:bg-slate-50/30 transition-colors min-h-[90px]">
                
                {/* Time Slot Label Cell */}
                <div className="p-3 border-r border-slate-200/60 flex flex-col justify-center bg-slate-50/30">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{slot.label}</span>
                    {slot.isPeak && <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />}
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {slot.sub}
                  </span>
                </div>

                {/* 6 Day Booking Cells */}
                {daysList.map((day) => {
                  // Find filtered bookings for this day and time slot
                  const dayBookings = filteredOrders.filter(
                    o => o.day === day.id && o.timeKey === slot.key
                  );

                  const isTodayActiveSlot = day.isToday && slot.key === '1:30 PM';

                  return (
                    <div
                      key={day.id}
                      className={`p-2 border-r last:border-r-0 border-slate-200/60 flex flex-col gap-2 transition-colors ${
                        isTodayActiveSlot ? 'bg-teal-50/30' : day.isToday ? 'bg-sky-50/20' : 'bg-white'
                      }`}
                    >
                      {/* Multi-booking indicator badge if multiple bookings in slot */}
                      {dayBookings.length > 1 && (
                        <div className="bg-teal-50 border border-teal-200 text-[#006a60] text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center justify-between">
                          <span>{dayBookings.length} Bookings in Slot</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006a60]"></span>
                        </div>
                      )}

                      {/* Empty cell indicator if no bookings match this slot */}
                      {dayBookings.length === 0 ? (
                        <div className="h-full min-h-[76px] rounded-xl border border-dashed border-slate-200/60 flex items-center justify-center text-slate-300 text-xs font-medium">
                          —
                        </div>
                      ) : (
                        /* Booking Cards inside Cell */
                        dayBookings.map((order) => {
                          const isSelected = order.id === selectedOrderId;

                          return (
                            <div
                              key={order.id}
                              onClick={() => {
                                setSelectedOrderId(order.id);
                                setIsOrderModalOpen(true);
                              }}
                              className={`rounded-2xl p-2.5 border transition-all cursor-pointer shadow-2xs flex flex-col gap-1 ${
                                isSelected
                                  ? 'bg-white border-[#006a60] ring-2 ring-[#006a60]/20 shadow-md'
                                  : 'bg-slate-50 hover:bg-white border-slate-200/80 hover:border-slate-400'
                              }`}
                            >
                              {/* Top Row: Order ID & Status Badge */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-extrabold text-[11px] text-slate-900">
                                  {order.id}
                                </span>
                                {renderStatusBadge(order.status)}
                              </div>

                              {/* Customer Name */}
                              <span className="font-extrabold text-xs text-slate-900 leading-tight">
                                {order.customerName}
                              </span>

                              {/* Summary */}
                              <span className="text-[10.5px] text-slate-500 font-medium truncate">
                                {order.summary}
                              </span>

                              {/* Price & Paid Pill if available */}
                              {order.amount && (
                                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                                  <span className="font-extrabold text-[#006a60]">
                                    GHC {order.amount}
                                  </span>
                                  {order.isPaid && (
                                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                      Mobile Paid
                                    </span>
                                  )}
                                </div>
                              )}

                            </div>
                          );
                        })
                      )}

                    </div>
                  );
                })}

              </div>
            ))}

          </div>
        )}

        {/* Schedule Matrix Footer Info & View Toggles */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Capacity utilization: <strong className="text-slate-900">74% of 90 daily slots</strong> • Average turn-around: <strong className="text-slate-900">5.2 hrs</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl border border-slate-300">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'compact' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compact View
            </button>
            <button
              onClick={() => setViewMode('comfortable')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'comfortable' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comfortable View
            </button>
          </div>
        </div>
      </div>

      {/* Order Inspection & Detail Card Drawer (Matches Screenshot Bottom Card) */}
      {selectedOrder && (
        <div className="px-4 sm:px-6 pb-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-6 flex flex-col gap-5">
            
            {/* Header: Order ID & Slot Badge */}
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-extrabold text-xl text-slate-900 tracking-tight">
                    {selectedOrder.id}
                  </h3>
                  <span className="bg-slate-200 text-slate-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md">
                    Slot {selectedOrder.slot}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Created Today at 09:14 AM via Customer Mobile PWA
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#006a60] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                  {selectedOrder.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-extrabold text-base text-slate-900">{selectedOrder.customerName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <Phone className="w-3 h-3 text-[#006a60]" />
                      {selectedOrder.phone}
                    </span>
                    <span>•</span>
                    <span>{selectedOrder.tier}</span>
                  </div>
                </div>
              </div>

              {/* Call, WhatsApp & SMS Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Hello ${selectedOrder.customerName}! Regarding your laundry order (${selectedOrder.id}) at Sparkle Laundry Hub...`);
                    window.open(`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                    if (onShowToast) onShowToast(`Connecting with ${selectedOrder.customerName} on WhatsApp...`);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 font-bold text-xs"
                  title="WhatsApp Customer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    window.open(`tel:${selectedOrder.phone}`, '_self');
                    if (onShowToast) onShowToast(`Dialing ${selectedOrder.customerName} (${selectedOrder.phone})...`);
                  }}
                  className="p-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4 text-[#0D6352]" />
                </button>
              </div>
            </div>

            {/* Interactive Booking Status State Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Booking status</span>
                <span className="text-[11px] font-normal text-slate-400">Tap to swap state</span>
              </div>

              {/* 4 Status Choice Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-extrabold">
                
                <button
                  onClick={() => handleUpdateOrderStatus('Confirmed')}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Confirmed'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Confirmed</span>
                  {selectedOrder.status === 'Confirmed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('In progress')}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'In progress'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>In progress</span>
                  {selectedOrder.status === 'In progress' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('Ready / Delivered')}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Ready / Delivered'
                      ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Completed</span>
                  {selectedOrder.status === 'Ready / Delivered' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('Cancelled')}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Cancelled'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Cancelled</span>
                  {selectedOrder.status === 'Cancelled' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </button>

              </div>

              {/* Action Button: Update status to In progress */}
              <button
                onClick={() => {
                  const nextStatus = selectedOrder.status === 'Confirmed' ? 'In progress' : 'Ready / Delivered';
                  handleUpdateOrderStatus(nextStatus);
                }}
                className="w-full mt-1 bg-[#006a60] hover:bg-[#005850] text-white py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Update status to {selectedOrder.status === 'Confirmed' ? 'In progress' : 'Completed'}</span>
              </button>
            </div>

            {/* Service Breakdown */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service breakdown</span>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex flex-col gap-2 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-800 font-medium">
                    <span>{item.name}</span>
                    <span className="font-extrabold text-slate-900">GHC {item.price}</span>
                  </div>
                ))}
                
                <div className="pt-2 mt-1 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total amount</span>
                  <span className="font-mono font-extrabold text-[#006a60] text-base">GHC {selectedOrder.amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Pill */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{selectedOrder.paymentMethod}</span>
                  <span className="text-[10.5px] text-slate-500">TxID: {selectedOrder.txId || 'MOMO-8839213-GH'}</span>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                Paid in Full
              </span>
            </div>

            {/* Assigned Rider Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned rider</span>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#006a60]" />
                  <span className="font-bold text-slate-900">{selectedOrder.assignedRider}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">Delivery address</span>
              <p className="font-bold text-slate-900">📍 {selectedOrder.address}</p>
            </div>

            {/* Special Handling Note Card */}
            {selectedOrder.specialNotes && (
              <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex flex-col gap-1 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Special handling note</span>
                </div>
                <p className="font-medium leading-relaxed text-amber-900/90 text-[11.5px]">
                  {selectedOrder.specialNotes}
                </p>
              </div>
            )}

            {/* Bottom Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  if (onShowToast) onShowToast(`Printing barcode garment tag for #${selectedOrder.id}...`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print bag tag</span>
              </button>

              <button
                onClick={() => {
                  if (onShowToast) onShowToast(`Sent automated SMS tracking update to ${selectedOrder.phone}`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Send className="w-4 h-4 text-slate-600" />
                <span>Notify via SMS</span>
              </button>
            </div>

            {/* Equipment Status Footer */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#006a60]" />
                <div>
                  <span className="font-bold text-slate-900 block">Commercial Dryers 1–4</span>
                  <span className="text-[10.5px] text-slate-500">3 Active cycles • 1 Standby</span>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                Optimal
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Centered Order Details Modal Dialog (Matching Screenshot 2) */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 text-slate-800 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
                    {selectedOrder.id}
                  </h3>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{selectedOrder.status}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Scheduled today • 1:00 PM – 2:30 PM
                </p>
              </div>

              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Information Row */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#006a60] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  {selectedOrder.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedOrder.customerName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedOrder.phone} • Cantonments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.open(`tel:${selectedOrder.phone}`, '_self');
                    if (onShowToast) onShowToast(`Calling ${selectedOrder.customerName}...`);
                  }}
                  className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                </button>
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Hello ${selectedOrder.customerName}! Your QuickWash laundry order #${selectedOrder.id} is being handled.`);
                    window.open(`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                    if (onShowToast) onShowToast(`Messaging ${selectedOrder.customerName}...`);
                  }}
                  className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
                  title="Message Customer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                ITEMS
              </span>
              <div className="flex flex-col gap-2 text-xs">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-800 font-medium">
                      <span>{item.name}</span>
                      <span className="font-bold text-slate-900">GH₵ {item.price}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between text-slate-800 font-medium">
                      <span>Standard wash &amp; fold (5 kg)</span>
                      <span className="font-bold text-slate-900">GH₵ 210.00</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-800 font-medium">
                      <span>Dry clean men's suit (x1)</span>
                      <span className="font-bold text-slate-900">GH₵ 120.00</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-800 font-medium">
                      <span>Delicate silk blouse press (x1)</span>
                      <span className="font-bold text-slate-900">GH₵ 60.00</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Total Amount Row */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-700 text-sm">Total Amount</span>
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Paid via MoMo
                </span>
                <span className="font-mono font-extrabold text-xl text-[#006a60]">
                  GH₵ {selectedOrder.amount || '390.00'}
                </span>
              </div>
            </div>

            {/* Special Note Box (Matching Screenshot 2) */}
            <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Note:</strong> {selectedOrder.specialNotes || '2 large green laundry bags. One contains a delicate silk blouse — use hypoallergenic lavender detergent.'}
              </p>
            </div>

            {/* Modal Actions (Dismiss / Print Tag / Mark as In Progress) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Dismiss
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onShowToast) onShowToast(`Printing barcode tag for ${selectedOrder.id}...`);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Tag</span>
                </button>

                <button
                  onClick={() => {
                    handleUpdateOrderStatus('In progress');
                    if (onShowToast) onShowToast(`Order ${selectedOrder.id} marked as In progress`);
                    setIsOrderModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#006a60] hover:bg-[#005850] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Mark as In Progress</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
