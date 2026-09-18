import React, { useState, useEffect } from 'react';
import { 
  Store, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Tag, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Bell, 
  Plus, 
  LogOut, 
  HelpCircle, 
  ChevronDown,
  User,
  CheckCircle2,
  X,
  Menu,
  ShoppingBag
} from 'lucide-react';
import {
  Sheet,
  SheetContent
} from '@/components/ui/sheet';
import OwnerWeeklyAvailabilityScreen from './OwnerWeeklyAvailabilityScreen';
import OwnerBookingsScheduleScreen from './OwnerBookingsScheduleScreen';
import OwnerProfileSetupScreen from './OwnerProfileSetupScreen';
import OwnerServicesPricingScreen from './OwnerServicesPricingScreen';
import OwnerShopProfileScreen from './OwnerShopProfileScreen';

import { createOrder, getOrders, syncOrdersWithBackend } from '../data/ordersStore';
import { formatDashboardHeaderDate, formatCurrency } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Order } from '@quickwash/shared';

export interface OwnerDashboardScreenProps {
  onBackToApp?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export type OwnerNavTab = 'weekly-availability' | 'bookings' | 'profile' | 'services' | 'analytics' | 'settings';

export default function OwnerDashboardScreen({
  onBackToApp,
  onLogout,
  onOpenProfile
}: OwnerDashboardScreenProps) {
  // Navigation state: 'weekly-availability' | 'bookings' | 'profile' | 'services' | 'analytics' | 'settings'
  const [activeNav, setActiveNav] = useState<OwnerNavTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as OwnerNavTab;
      if (tab) return tab;
    }
    return 'bookings';
  });
  const [storeStatus, setStoreStatus] = useState<'open' | 'closed'>('open');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  // Listen to order updates and sync with backend on mount
  useEffect(() => {
    syncOrdersWithBackend().then((latest) => {
      if (latest && latest.length > 0) {
        setOrders(latest);
      }
    });

    const handleOrdersUpdate = (e: any) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        setOrders(getOrders());
      }
    };

    window.addEventListener('quickwash:orders_updated', handleOrdersUpdate);
    return () => window.removeEventListener('quickwash:orders_updated', handleOrdersUpdate);
  }, []);

  // Live calculated metrics
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Ready / Delivered' && (o.status as any) !== 'Delivered' && (o.status as any) !== 'Ready' && o.status !== 'Cancelled'
  ).length;
  const inProgressCount = orders.filter(
    (o) => o.status === 'In progress' || (o.status as any) === 'In wash'
  ).length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (parseFloat(o.amount) || 0),
    0
  );

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInService, setWalkInService] = useState('Wash & fold');
  const [walkInAmount, setWalkInAmount] = useState('120.00');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      showToast('Please enter customer name');
      return;
    }

    const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    createOrder({
      customerName: walkInName.trim(),
      phone: walkInPhone.trim() || '+233 24 000 0000',
      address: 'Walk-In Customer (In-Store Dropoff)',
      slot: `Today (${timeNow})`,
      services: [{ name: walkInService, price: walkInAmount }],
      amount: walkInAmount,
      paymentMethod: 'Cash / In-Store POS',
      specialNotes: 'Direct shop walk-in intake'
    });

    showToast(`Created & logged walk-in wash ticket for ${walkInName}`);
    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setActiveNav('bookings');
  };

  const renderSidebarContent = (isDrawer = false) => (
    <div className="h-full flex flex-col justify-between bg-[#f0f3f8] text-slate-700">
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Logo & Hub Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#008276] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#008276]/20">
            QW
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">QuickWash</span>
              <span className="border border-slate-300 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Pro
              </span>
            </div>
            <p className="text-xs text-[#008276] font-bold">Owner Hub</p>
          </div>
        </div>

        {/* Store Selector Dropdown Card */}
        <div 
          onClick={() => showToast('Sparkle Express Laundry (Accra Central Flagship)')}
          className="bg-[#e5ebf4] hover:bg-[#dce3ee] border border-slate-200/60 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-800">Sparkle Express ...</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span className="text-[11px] text-slate-500 font-medium pl-3.5 mt-0.5">
              Accra Central • Open
            </span>
          </div>
        </div>

        {/* Sidebar Operations Navigation */}
        <nav className="mt-2 flex flex-col gap-1.5">
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">
            OPERATIONS
          </span>

          <button
            onClick={() => {
              setActiveNav('bookings');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'bookings'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Bookings & Schedule</span>
            </div>
            {orders.length > 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeNav === 'bookings' ? 'bg-white text-[#008276]' : 'bg-[#008276] text-white'
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveNav('weekly-availability');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'weekly-availability'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Weekly Availability</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveNav('services');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'services'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 flex-shrink-0" />
              <span>Services & Pricing</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveNav('profile');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'profile'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 flex-shrink-0" />
              <span>Shop Profile</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveNav('analytics');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'analytics'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span>Analytics</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveNav('settings');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              activeNav === 'settings'
                ? 'bg-[#008276] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>Settings</span>
            </div>
          </button>

          {onBackToApp && (
            <button
              onClick={() => {
                if (isDrawer) setIsSidebarOpen(false);
                onBackToApp();
              }}
              className="mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-white/70 hover:bg-white border border-slate-200/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 flex-shrink-0 text-[#008276]" />
                <span>Customer Storefront</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Footer: Operator & Status */}
      <div className="p-3.5 border-t border-slate-200/80 bg-[#e8edf5] flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Accepting Orders</span>
          </div>

          <button
            onClick={() => showToast('QuickWash Partner Help Desk online')}
            className="text-slate-500 hover:text-slate-800 text-[11px] font-medium cursor-pointer"
          >
            Help Center
          </button>
        </div>

        <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#005a52] text-white flex items-center justify-center font-extrabold text-xs">
              KA
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-slate-800">Kwame Asante</span>
              <span className="text-[10.5px] text-slate-400">Store Operator</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#FAF9F5] text-slate-800 font-sans">
      
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl z-[100] flex items-center gap-2.5 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between flex-shrink-0 border-r border-slate-200/90 z-20">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile & Small Screen Sliding Sidebar Drawer */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[290px] border-r border-slate-200 bg-[#f0f3f8]">
          {renderSidebarContent(true)}
        </SheetContent>
      </Sheet>

      {/* Main Operations Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="px-4 sm:px-8 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between z-10 gap-3 shadow-2xs">
          
          {/* Left Metrics & Date (with mobile hamburger menu trigger) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer mr-1"
              title="Open Operations Menu"
              aria-label="Open Operations Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Badge variant="secondary" className="bg-[#dce6f5] text-[#2c538a] hover:bg-[#dce6f5] text-xs font-bold px-3 py-1.5 rounded-xl border-0">
              Live Desk
            </Badge>

            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {formatDashboardHeaderDate()}
            </span>

            {/* Metrics Pills */}
            <div className="flex items-center gap-2">
              <span
                onClick={() => setActiveNav('bookings')}
                className="bg-[#dce6f5] hover:bg-[#ccdcf2] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                title="View active bookings"
              >
                {activeOrdersCount} Active
              </span>

              <span
                onClick={() => setActiveNav('bookings')}
                className="bg-[#dce6f5] hover:bg-[#ccdcf2] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                title="View in progress bookings"
              >
                {inProgressCount} In Progress
              </span>

              <span className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl">
                {formatCurrency(totalRevenue)} Revenue
              </span>
            </div>
          </div>

          {/* Right Top Bar Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Synced latest marketplace orders')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Sync Schedule"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => showToast('No new urgent dispatch notifications')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <Button
              onClick={() => setIsWalkInModalOpen(true)}
              className="bg-[#008276] hover:bg-[#007065] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Walk-in</span>
            </Button>

            <div
              onClick={() => setActiveNav('profile')}
              className="w-8 h-8 rounded-full bg-[#005a52] text-white flex items-center justify-center cursor-pointer shadow-xs"
              title="Store Owner Profile"
            >
              <User className="w-4 h-4" />
            </div>
          </div>

        </header>

        {/* View Switcher based on activeNav */}
        {activeNav === 'profile' && (
          <OwnerShopProfileScreen
            onBackToDashboard={() => setActiveNav('bookings')}
            onBackToApp={onBackToApp}
            onShowToast={showToast}
          />
        )}

        {activeNav === 'services' && (
          <OwnerServicesPricingScreen onShowToast={showToast} />
        )}

        {activeNav === 'bookings' && (
          <OwnerBookingsScheduleScreen onShowToast={showToast} />
        )}

        {activeNav === 'weekly-availability' && (
          <OwnerWeeklyAvailabilityScreen onShowToast={showToast} />
        )}

        {(activeNav === 'analytics' || activeNav === 'settings') && (
          <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#006a60] flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 capitalize">{activeNav} Module</h2>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Real-time store operations intelligence & configuration rules synced with your QuickWash Partner Account.
            </p>
            <Button
              onClick={() => setActiveNav('profile')}
              className="mt-4 bg-[#006a60] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Return to Business Profile
            </Button>
          </div>
        )}

      </div>

      {/* Walk-in modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <Card className="rounded-3xl max-w-md w-full shadow-2xl border-slate-200 p-6 flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">New Walk-in Order</h3>
              <button
                onClick={() => setIsWalkInModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="flex flex-col gap-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Yaw Mensah"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full border-slate-300 focus:border-[#006a60]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <Input
                  type="text"
                  placeholder="+233 24 123 4567"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full border-slate-300 focus:border-[#006a60]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#006a60] hover:bg-[#005850] text-white font-bold cursor-pointer"
                >
                  Create Order
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
