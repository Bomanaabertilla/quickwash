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
  Info,
  Eye
} from 'lucide-react';
import { getOrders, saveOrders, updateOrderStatus, syncOrdersWithBackend } from '../data/ordersStore';
import { getPublishedAvailability } from '../data/availabilityStore';
import { formatDashboardHeaderDate, formatOrderTimestamp, formatCurrency, getTodayDayId, parseSlot, getCalendarWeek } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus, WeeklySchedule } from '@quickwash/shared';

export interface OwnerBookingsScheduleScreenProps {
  onShowToast?: (msg: string) => void;
}

export default function OwnerBookingsScheduleScreen({ onShowToast }: OwnerBookingsScheduleScreenProps) {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All slots');
  const [selectedRider, setSelectedRider] = useState('Kwame Mensah (#41)');
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable' | 'table'>('comfortable');
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => orders[0]?.id || null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [availability, setAvailability] = useState<WeeklySchedule>(() => getPublishedAvailability());
  const [weekOffset, setWeekOffset] = useState(0);

  const todayDayId = getTodayDayId();
  const currentCalendarWeek = useMemo(() => getCalendarWeek(new Date(), weekOffset), [weekOffset]);

  useEffect(() => {
    // Sync fresh orders from backend on mount
    syncOrdersWithBackend().then((latest) => {
      if (latest && latest.length > 0) {
        setOrders(latest);
        if (!selectedOrderId) setSelectedOrderId(latest[0].id);
      }
    });

    const handleOrdersUpdate = (e: any) => {
      const updatedOrders = (e.detail && e.detail.length > 0) ? e.detail : getOrders();
      setOrders(updatedOrders);
      setSelectedOrderId(prev => {
        if (prev && updatedOrders.some((o: Order) => o.id === prev)) return prev;
        return updatedOrders[0]?.id || null;
      });
    };

    const handleAvailUpdate = (e: any) => {
      if (e.detail) setAvailability(e.detail);
      else setAvailability(getPublishedAvailability());
    };

    window.addEventListener('quickwash:orders_updated', handleOrdersUpdate);
    window.addEventListener('quickwash:availability_updated', handleAvailUpdate);
    return () => {
      window.removeEventListener('quickwash:orders_updated', handleOrdersUpdate);
      window.removeEventListener('quickwash:availability_updated', handleAvailUpdate);
    };
  }, []);

  // Selected Order Object
  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || orders[0] || null;
  }, [orders, selectedOrderId]);

  // Days list for column matrix - dynamically derived from published schedule and current calendar week
  const daysList = useMemo(() => {
    const calDays = currentCalendarWeek.days;
    if (availability.days && availability.days.length > 0) {
      return availability.days
        .filter(d => d.id !== 'sun' || d.status !== 'Closed')
        .map(d => {
          const calDay = calDays.find(c => c.id === d.id);
          return {
            id: d.id,
            name: d.name,
            fullName: d.fullName,
            date: calDay?.date || d.date || d.dayNum || '',
            isToday: weekOffset === 0 && d.id === todayDayId
          };
        });
    }
    return calDays.filter(d => d.id !== 'sun').map(d => ({
      id: d.id,
      name: d.name,
      date: d.date,
      isToday: weekOffset === 0 && d.id === todayDayId
    }));
  }, [availability, currentCalendarWeek, todayDayId, weekOffset]);

  // Time slots for row matrix - includes immediate walk-ins and store pickup slots
  const timeSlots = useMemo(() => {
    const slotsMap = new Map<string, { key: string; label: string; sub: string; isPeak?: boolean }>();
    slotsMap.set('Immediate', { key: 'Immediate', label: 'Walk-In / Rush', sub: 'Today', isPeak: true });

    if (availability.days) {
      availability.days.forEach(d => {
        d.slots?.forEach(s => {
          if (!slotsMap.has(s.time)) {
            slotsMap.set(s.time, {
              key: s.time,
              label: s.time,
              sub: s.period || 'Pickup',
              isPeak: s.status === 'Filling Fast' || (s.capacity ?? 5) <= 3
            });
          }
        });
      });
    }

    if (slotsMap.size <= 1) {
      ['8:00 AM', '10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'].forEach(t => {
        slotsMap.set(t, { key: t, label: t, sub: 'Operating Window' });
      });
    }

    return Array.from(slotsMap.values());
  }, [availability]);

  // Count summaries
  const stats = useMemo(() => {
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const inProgress = orders.filter(o => o.status === 'In progress' || (o.status as any) === 'In wash').length;
    const ready = orders.filter(o => o.status === 'Ready / Delivered' || (o.status as any) === 'Ready' || (o.status as any) === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    return { confirmed, inProgress, ready, cancelled, total: orders.length };
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  }, [orders]);

  const activeOrdersCount = stats.confirmed + stats.inProgress;

  // Filtered Orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter && statusFilter !== 'All' && statusFilter !== 'All slots') {
        if (statusFilter === 'Confirmed') {
          if (order.status !== 'Confirmed') return false;
        } else if (statusFilter === 'In progress') {
          if (order.status !== 'In progress' && (order.status as any) !== 'In wash') return false;
        } else if (statusFilter === 'Ready / Delivered') {
          if (order.status !== 'Ready / Delivered' && (order.status as any) !== 'Ready' && (order.status as any) !== 'Delivered') return false;
        }
      }

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

  const handleOpenInspect = (order: Order) => {
    setSelectedOrderId(order.id);
    setIsOrderModalOpen(true);
  };

  const handleUpdateOrderStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder?.id) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    if (onShowToast) onShowToast(`Updated #${selectedOrder.id} status to: ${newStatus}`);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    if (status === 'Confirmed') {
      return (
        <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Confirmed
        </Badge>
      );
    }
    if (status === 'In progress' || (status as any) === 'In wash') {
      return (
        <Badge variant="warning" className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
          In wash
        </Badge>
      );
    }
    if (status === 'Ready / Delivered' || (status as any) === 'Ready' || (status as any) === 'Delivered') {
      return (
        <Badge variant="secondary" className="bg-sky-50 text-sky-800 border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-sky-600" />
          Ready
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
        Cancelled
      </Badge>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBFBF9] text-stone-800 overflow-x-auto custom-scrollbar pb-16">
      
      {/* Top Live Desk Bar */}
      <div className="bg-white border-b border-stone-200/90 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
              Live Desk & Booking Intake
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            {formatDashboardHeaderDate()}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-[#e6f4ea] text-[#137333] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200/60">
            {activeOrdersCount} Active
          </span>
          <span className="bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200/60">
            {stats.inProgress} In Wash
          </span>
          <span className="bg-[#fef7e0] text-[#b06000] text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200/60">
            {formatCurrency(totalRevenue)} Revenue
          </span>
        </div>
      </div>

      {/* Sub-Header Bar 1: Week Picker & Stat Summary Pills */}
      <div className="bg-white border-b border-stone-200/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Date Navigator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button 
              onClick={() => {
                setWeekOffset(prev => prev - 1);
                if (onShowToast) onShowToast('Switched to previous week');
              }}
              title="Previous Week"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 font-extrabold text-xs text-stone-800">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0D6352]" />
              <span>{currentCalendarWeek.weekRange}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                Live Storefront Schedule
              </span>
            </div>
            <button 
              onClick={() => {
                setWeekOffset(prev => prev + 1);
                if (onShowToast) onShowToast('Switched to next week');
              }}
              title="Next Week"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => {
              setWeekOffset(0);
              if (onShowToast) onShowToast('Returned to current week');
            }}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border border-stone-200 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span>Jump to today</span>
          </button>
        </div>

        {/* Status Count Summary */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span>{stats.confirmed} Confirmed</span>
          <span className="text-stone-300">•</span>
          <span>{stats.inProgress} In Wash</span>
          <span className="text-stone-300">•</span>
          <span>{stats.ready} Ready</span>
        </div>

      </div>

      {/* Sub-Header Bar 2: Filter Toolbar */}
      <div className="px-4 sm:px-6 py-2.5 bg-stone-50/70 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Search input & Status Tabs */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
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
                className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
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
                  className={cn(
                    'px-3 py-1 rounded-xl font-semibold text-xs transition-all flex-shrink-0 cursor-pointer',
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  )}
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

        {/* Right: Courier selector, View Toggle & Export button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-xl border border-stone-300">
            <button
              onClick={() => setViewMode('comfortable')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                viewMode !== 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Orders Feed ({filteredOrders.length})</span>
            </button>
          </div>

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

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (onShowToast) onShowToast('Exported weekly schedule manifest (CSV/PDF)');
            }}
            className="bg-white hover:bg-slate-100 text-slate-700 h-8 w-8 rounded-xl border border-slate-300 cursor-pointer shadow-2xs"
            title="Export Manifest"
          >
            <Download className="w-4 h-4 text-slate-600" />
          </Button>
        </div>

      </div>

      {/* Main Bookings & Schedule Calendar Grid Table OR Empty State */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <Card className="rounded-3xl border-slate-200/90 p-12 flex flex-col items-center justify-center text-center shadow-2xs max-w-lg mx-auto my-6 bg-white">
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
            <Button
              onClick={() => {
                setStatusFilter('All slots');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 bg-[#008276] hover:bg-[#007065] text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
            >
              View all slots ({orders.length} total bookings)
            </Button>
          </Card>
        ) : viewMode === 'table' ? (
          <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden bg-white">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-slate-900">Live Incoming Bookings</span>
                <span className="ml-2 text-xs text-slate-500 font-medium">({filteredOrders.length} bookings matching filter)</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Click "Inspect" or any order to open full details</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                    <th className="py-3 px-4">Order ID & Placed</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrderId === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => handleOpenInspect(order)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-teal-50/70 font-semibold' : 'hover:bg-slate-50'
                        )}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {order.id}
                          <div className="text-[10.5px] text-slate-400 font-sans font-normal mt-0.5">
                            {formatOrderTimestamp(order.createdAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500">{order.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                            {order.slot}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-700 font-medium">
                          {order.summary}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#006a60]">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="py-3 px-4">
                          {renderStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInspect(order);
                            }}
                            className="px-3.5 py-1.5 bg-[#008276] hover:bg-[#007065] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs min-w-[960px] overflow-hidden">
            
            {/* Matrix Column Headers */}
            <div
              className="grid border-b border-slate-200/80 bg-slate-50/90"
              style={{ gridTemplateColumns: `140px repeat(${daysList.length}, minmax(130px, 1fr))` }}
            >
              
              <div className="p-3.5 flex items-center justify-center border-r border-slate-200/60 bg-slate-100/60 font-extrabold text-[11px] uppercase tracking-wider text-slate-400">
                TIME
              </div>

              {daysList.map((day) => (
                <div
                  key={day.id}
                  className={cn(
                    'p-3 border-r last:border-r-0 border-slate-200/60 flex flex-col items-center justify-center transition-colors',
                    day.isToday ? 'bg-sky-50/70 border-b-2 border-b-sky-500' : ''
                  )}
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
              <div
                key={slot.key}
                className="grid border-b border-slate-200/60 hover:bg-slate-50/30 transition-colors min-h-[90px]"
                style={{ gridTemplateColumns: `140px repeat(${daysList.length}, minmax(130px, 1fr))` }}
              >
                
                <div className="p-3 border-r border-slate-200/60 flex flex-col justify-center bg-slate-50/30">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs text-slate-900">{slot.label}</span>
                    {slot.isPeak && <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />}
                  </div>
                  <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {slot.sub}
                  </span>
                </div>

                {daysList.map((day) => {
                  const dayBookings = filteredOrders.filter((o) => {
                    const oDay = (o.day || (o.slot?.toLowerCase().includes('today') ? todayDayId : o.slot?.toLowerCase().slice(0, 3))).toLowerCase();
                    const isMatchDay = oDay === day.id || (day.isToday && (o.slot?.toLowerCase().includes('today') || oDay === todayDayId));
                    if (!isMatchDay) return false;

                    if (slot.key === 'Immediate') {
                      return (
                        o.timeKey === 'Immediate' ||
                        o.slot?.toLowerCase().includes('immediate') ||
                        (o.slot?.toLowerCase().includes('today') && (!o.timeKey || o.timeKey === 'Immediate'))
                      );
                    }

                    return (
                      o.timeKey === slot.key ||
                      (o.slot && o.slot.includes(slot.key)) ||
                      (slot.key && o.timeKey && o.timeKey.startsWith(slot.key.split(' ')[0]))
                    );
                  });

                  const isTodayActiveSlot = day.isToday && slot.key === '1:30 PM';

                  return (
                    <div
                      key={day.id}
                      className={cn(
                        'p-2 border-r last:border-r-0 border-slate-200/60 flex flex-col gap-2 transition-colors',
                        isTodayActiveSlot ? 'bg-teal-50/30' : day.isToday ? 'bg-sky-50/20' : 'bg-white'
                      )}
                    >
                      {dayBookings.length > 1 && (
                        <div className="bg-teal-50 border border-teal-200 text-[#006a60] text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex items-center justify-between">
                          <span>{dayBookings.length} Bookings in Slot</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006a60]"></span>
                        </div>
                      )}

                      {dayBookings.length === 0 ? (
                        <div className="h-full min-h-[76px] rounded-xl border border-dashed border-slate-200/60 flex items-center justify-center text-slate-300 text-xs font-medium">
                          —
                        </div>
                      ) : (
                        dayBookings.map((order) => {
                          const isSelected = order.id === selectedOrderId;

                          return (
                            <div
                              key={order.id}
                              onClick={() => handleOpenInspect(order)}
                              className={cn(
                                'rounded-2xl p-2.5 border transition-all cursor-pointer shadow-2xs flex flex-col gap-1',
                                isSelected
                                  ? 'bg-white border-[#006a60] ring-2 ring-[#006a60]/20 shadow-md'
                                  : 'bg-slate-50 hover:bg-white border-slate-200/80 hover:border-slate-400'
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-extrabold text-[11px] text-slate-900">
                                  {order.id}
                                </span>
                                {renderStatusBadge(order.status)}
                              </div>

                              <span className="font-extrabold text-xs text-slate-900 leading-tight">
                                {order.customerName}
                              </span>

                              <span className="text-[10.5px] text-slate-500 font-medium truncate">
                                {order.summary}
                              </span>

                              {order.amount && (
                                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10.5px]">
                                  <span className="font-extrabold text-[#006a60]">
                                    {formatCurrency(order.amount)}
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
              onClick={() => setViewMode('comfortable')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                viewMode === 'comfortable' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Matrix Grid
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                viewMode === 'compact' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              All Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Order Inspection & Detail Card Drawer */}
      {selectedOrder && (
        <div className="px-4 sm:px-6 pb-6">
          <Card className="rounded-3xl border-slate-200/90 shadow-md p-5 sm:p-6 flex flex-col gap-5 bg-white">
            
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
                  Created {formatOrderTimestamp(selectedOrder.createdAt)} via Customer Mobile PWA
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
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

              {/* Call & WhatsApp Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Hello ${selectedOrder.customerName}! Regarding your laundry order (${selectedOrder.id}) at Sparkle Laundry Hub...`);
                    window.open(`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                    if (onShowToast) onShowToast(`Connecting with ${selectedOrder.customerName} on WhatsApp...`);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 font-bold text-xs cursor-pointer"
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
                  className="p-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors shadow-2xs cursor-pointer"
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
                  className={cn(
                    'p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer',
                    selectedOrder.status === 'Confirmed'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Confirmed</span>
                  {selectedOrder.status === 'Confirmed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('In progress')}
                  className={cn(
                    'p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer',
                    selectedOrder.status === 'In progress'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>In progress</span>
                  {selectedOrder.status === 'In progress' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('Ready / Delivered')}
                  className={cn(
                    'p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer',
                    selectedOrder.status === 'Ready / Delivered'
                      ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Completed</span>
                  {selectedOrder.status === 'Ready / Delivered' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </button>

                <button
                  onClick={() => handleUpdateOrderStatus('Cancelled')}
                  className={cn(
                    'p-3 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer',
                    selectedOrder.status === 'Cancelled'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Cancelled</span>
                  {selectedOrder.status === 'Cancelled' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                </button>

              </div>

              {/* Action Button: Update status */}
              <Button
                onClick={() => {
                  const nextStatus: OrderStatus = selectedOrder.status === 'Confirmed' ? 'In progress' : 'Ready / Delivered';
                  handleUpdateOrderStatus(nextStatus);
                }}
                className="w-full mt-1 bg-[#006a60] hover:bg-[#005850] text-white py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Update status to {selectedOrder.status === 'Confirmed' ? 'In progress' : 'Completed'}</span>
              </Button>
            </div>

            {/* Service Breakdown */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service breakdown</span>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex flex-col gap-2 text-xs">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-800 font-medium">
                    <span>{item.name}</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(item.price)}</span>
                  </div>
                ))}
                
                <div className="pt-2 mt-1 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total amount</span>
                  <span className="font-mono font-extrabold text-[#006a60] text-base">{formatCurrency(selectedOrder.amount)}</span>
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
              <Badge variant="success" className="text-[10.5px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                Paid in Full
              </Badge>
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
              <Button
                variant="outline"
                onClick={() => {
                  if (onShowToast) onShowToast(`Printing barcode garment tag for #${selectedOrder.id}...`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print bag tag</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  if (onShowToast) onShowToast(`Sent automated SMS tracking update to ${selectedOrder.phone}`);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-600" />
                <span>Notify via SMS</span>
              </Button>
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
              <Badge variant="success" className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                Optimal
              </Badge>
            </div>

          </Card>
        </div>
      )}

      {/* Centered Order Details Modal Dialog via shadcn Dialog */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-7 rounded-3xl bg-white shadow-2xl border border-slate-200">
          {selectedOrder && (
            <div className="flex flex-col gap-5 text-slate-800">
              
              {/* Modal Header */}
              <DialogHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pr-6">
                  <div className="flex items-center gap-2.5">
                    <DialogTitle className="font-mono font-extrabold text-2xl text-slate-900 tracking-tight">
                      {selectedOrder.id}
                    </DialogTitle>
                    <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      Slot {selectedOrder.slot}
                    </span>
                  </div>
                  <div>
                    {renderStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Placed on {formatOrderTimestamp(selectedOrder.createdAt)} via Customer Web App
                </DialogDescription>
              </DialogHeader>

              {/* Customer Information Card */}
              <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#006a60] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {selectedOrder.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base text-slate-900">{selectedOrder.customerName}</h4>
                      <Badge variant="outline" className="text-[10.5px] font-bold px-2 py-0.5 text-[#006a60] border-[#006a60]/30 bg-teal-50">
                        {selectedOrder.tier || 'Customer'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-[#006a60]" />
                        {selectedOrder.phone}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                        {selectedOrder.address || 'Accra Central'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = encodeURIComponent(`Hello ${selectedOrder.customerName}! Regarding your laundry order (${selectedOrder.id}) with Sparkle Laundry Hub...`);
                      window.open(`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                      if (onShowToast) onShowToast(`Connecting with ${selectedOrder.customerName} on WhatsApp...`);
                    }}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                    title="WhatsApp Customer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.open(`tel:${selectedOrder.phone}`, '_self');
                      if (onShowToast) onShowToast(`Calling ${selectedOrder.customerName} (${selectedOrder.phone})...`);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                    title="Call Phone"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#006a60]" />
                    <span>Call</span>
                  </button>
                </div>
              </div>

              {/* Order Status Controller */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Fulfillment Status</span>
                  <span className="text-[11px] font-normal text-slate-400">Click to advance stage</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus('Confirmed')}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      selectedOrder.status === 'Confirmed'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Confirmed</span>
                    {selectedOrder.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus('In progress')}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      selectedOrder.status === 'In progress' || (selectedOrder.status as any) === 'In wash'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>In Wash</span>
                    {(selectedOrder.status === 'In progress' || (selectedOrder.status as any) === 'In wash') && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus('Ready / Delivered')}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      selectedOrder.status === 'Ready / Delivered' || (selectedOrder.status as any) === 'Ready' || (selectedOrder.status as any) === 'Delivered'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>Ready</span>
                    {(selectedOrder.status === 'Ready / Delivered' || (selectedOrder.status as any) === 'Ready' || (selectedOrder.status as any) === 'Delivered') && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus('Cancelled')}
                    className={cn(
                      'p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      selectedOrder.status === 'Cancelled'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Cancelled</span>
                    {selectedOrder.status === 'Cancelled' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                  </button>
                </div>
              </div>

              {/* Order Items & Services Breakdown */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Items &amp; Services</span>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-2.5 text-xs">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-800 font-medium py-1 border-b border-slate-200/50 last:border-0">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#006a60]" />
                          <span className="font-semibold text-slate-900">{item.name}</span>
                        </div>
                        <span className="font-extrabold text-slate-900 font-mono">{formatCurrency(item.price)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between text-slate-800 font-medium py-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#006a60]" />
                        <span className="font-semibold text-slate-900">{selectedOrder.summary || 'Laundry Care Package'}</span>
                      </div>
                      <span className="font-extrabold text-slate-900 font-mono">{formatCurrency(selectedOrder.amount)}</span>
                    </div>
                  )}

                  <div className="pt-3 mt-1 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="font-extrabold text-slate-900">Total Billed</span>
                    <span className="font-mono font-black text-[#006a60] text-lg">{formatCurrency(selectedOrder.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-extrabold text-emerald-800 uppercase tracking-wider">Payment Information</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{selectedOrder.paymentMethod || 'Mobile Money'}</span>
                    <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {selectedOrder.isPaid ? 'Paid in Full' : 'Pending'}
                    </Badge>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500">TxID: {selectedOrder.txId || 'MOMO-8839213-GH'}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider">Fulfillment Logistics</span>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#006a60]" />
                    <span className="font-bold text-slate-900">{selectedOrder.assignedRider || 'Kwame Mensah (#41)'}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 truncate">📍 {selectedOrder.address || 'Pick-up point'}</span>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.specialNotes && (
                <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-2xl flex flex-col gap-1 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Special Customer Instructions</span>
                  </div>
                  <p className="font-medium leading-relaxed text-amber-900/90 text-[11.5px]">
                    {selectedOrder.specialNotes}
                  </p>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onShowToast) onShowToast(`Printing barcode garment tag for #${selectedOrder.id}...`);
                    }}
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Bag Tag</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onShowToast) onShowToast(`Sent SMS dispatch update to ${selectedOrder.phone}`);
                    }}
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-600" />
                    <span>Send SMS Alert</span>
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="bg-[#008276] hover:bg-[#007065] text-white px-5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
