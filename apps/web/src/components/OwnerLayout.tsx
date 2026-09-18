import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Tag,
  Store,
  BarChart3,
  Settings,
  ShoppingBag,
  Plus,
  LogOut,
  ChevronDown,
  X,
  Menu,
  RotateCcw,
  Bell,
  User,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getOrders, createOrder, syncOrdersWithBackend } from '../data/ordersStore';
import { getShopProfile } from '../data/shopStore';
import { cn } from '@/lib/utils';
import type { Order } from '@quickwash/shared';

export type OwnerRoute = 
  | 'owner-bookings' 
  | 'owner-availability' 
  | 'owner-services' 
  | 'owner-profile' 
  | 'owner-analytics' 
  | 'owner-settings';

export interface OwnerLayoutProps {
  currentRoute: OwnerRoute;
  onNavigate: (route: string) => void;
  onLogout?: () => void;
  onBackToApp?: () => void;
  onShowToast?: (msg: string) => void;
  children: React.ReactNode;
}

export default function OwnerLayout({
  currentRoute,
  onNavigate,
  onLogout,
  onBackToApp,
  onShowToast,
  children
}: OwnerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInService, setWalkInService] = useState('Wash & fold');
  const [walkInAmount, setWalkInAmount] = useState('120.00');

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

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Ready / Delivered' && (o.status as any) !== 'Delivered' && (o.status as any) !== 'Ready' && o.status !== 'Cancelled'
  ).length;

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      if (onShowToast) onShowToast('Please enter customer name');
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

    if (onShowToast) onShowToast(`Created & logged walk-in wash ticket for ${walkInName}`);
    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    onNavigate('owner-bookings');
  };

  const navItems = [
    {
      id: 'owner-bookings',
      label: 'Bookings & Schedule',
      icon: Calendar,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined
    },
    {
      id: 'owner-availability',
      label: 'Weekly Availability',
      icon: Clock
    },
    {
      id: 'owner-services',
      label: 'Services & Pricing',
      icon: Tag
    },
    {
      id: 'owner-profile',
      label: 'Shop Profile',
      icon: Store
    },
    {
      id: 'owner-analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'owner-settings',
      label: 'Settings',
      icon: Settings
    }
  ];

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
          onClick={() => {
            onNavigate('owner-profile');
            if (isDrawer) setIsSidebarOpen(false);
          }}
          className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              storeStatus === 'open' ? 'bg-[#008276] animate-pulse' : 'bg-rose-500'
            )} />
            <div>
              <p className="font-extrabold text-xs text-slate-900 tracking-tight">Sparkle Express Laundry</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Accra Central</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  storeStatus === 'open' ? 'text-emerald-700' : 'text-rose-600'
                )}>
                  {storeStatus === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Operations Navigation Links */}
        <div className="flex flex-col gap-1.5 pt-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
            OPERATIONS
          </span>

          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (isDrawer) setIsSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left',
                  isActive
                    ? 'bg-[#008276] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <IconComp className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-white text-[#008276]' : 'bg-[#008276] text-white'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Customer Storefront Link */}
          <button
            onClick={() => {
              if (onBackToApp) onBackToApp();
              else onNavigate('providers');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition-all cursor-pointer mt-2 border border-slate-200 bg-white"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 flex-shrink-0 text-[#008276]" />
              <span>Customer Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Operator Footer Profile & Logout */}
      <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#008276] text-white flex items-center justify-center font-bold text-xs">
              KA
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Kwame Asante</p>
              <p className="text-[10px] text-slate-400">Store Manager</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else onNavigate('owner-login');
              if (isDrawer) setIsSidebarOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex w-full relative">
      
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/80 bg-[#f0f3f8] min-h-screen flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Responsive Drawer via shadcn Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-[85vw] border-r border-slate-200">
          <SheetHeader className="sr-only">
            <SheetTitle>Store Manager Operations</SheetTitle>
          </SheetHeader>
          {renderSidebarContent(true)}
        </SheetContent>
      </Sheet>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-y-auto">
        
        {/* Global Hub Navigation Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 bg-white flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile / Bezel Sidebar Hamburger Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Toggle operations navigation"
            >
              <Menu className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold text-slate-700">Menu</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-800">
                Sparkle Express • Owner Hub
              </span>
              <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-[10px] font-bold">
                Online
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsWalkInModalOpen(true)}
              className="bg-[#008276] hover:bg-[#007065] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>New Walk-in</span>
            </Button>

            <button
              onClick={() => onNavigate('owner-profile')}
              className="w-8 h-8 rounded-full bg-[#005a52] text-white flex items-center justify-center cursor-pointer shadow-xs"
              title="Store Owner Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Dedicated Page Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>

      {/* Walk-in Modal Dialog */}
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
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaw Badu"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full bg-[#f4f7fa] border border-transparent focus:border-[#008276] rounded-xl px-3 py-2 font-bold text-slate-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+233 24 XXX XXXX"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full bg-[#f4f7fa] border border-transparent focus:border-[#008276] rounded-xl px-3 py-2 font-bold text-slate-800 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Service Type</label>
                  <select
                    value={walkInService}
                    onChange={(e) => setWalkInService(e.target.value)}
                    className="w-full bg-[#f4f7fa] border border-transparent focus:border-[#008276] rounded-xl px-2 py-2 font-bold text-slate-800 text-xs outline-none"
                  >
                    <option value="Wash & fold">Wash & Fold</option>
                    <option value="Steam Press & Ironing">Steam Press</option>
                    <option value="Dry Cleaning">Dry Cleaning</option>
                    <option value="Duvet & Heavy Linen">Duvet & Bedding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deposit (GH₵)</label>
                  <input
                    type="number"
                    value={walkInAmount}
                    onChange={(e) => setWalkInAmount(e.target.value)}
                    className="w-full bg-[#f4f7fa] border border-transparent focus:border-[#008276] rounded-xl px-3 py-2 font-bold text-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="flex-1 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#008276] hover:bg-[#007065] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Confirm & Print Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
