import React from 'react';
import { 
  ShoppingBag, 
  Store, 
  Calendar, 
  Clock, 
  Tag, 
  Truck, 
  Smartphone, 
  Maximize2, 
  HelpCircle, 
  LogOut, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Layers,
  BarChart3,
  Settings as SettingsIcon
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ScreenType } from '../App';

export interface AppSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isResponsiveMode: boolean;
  onToggleResponsiveMode: () => void;
  onSupportClick?: () => void;
  onLogout?: () => void;
}

export default function AppSidebar({
  isOpen,
  onOpenChange,
  currentScreen,
  onNavigate,
  isResponsiveMode,
  onToggleResponsiveMode,
  onSupportClick,
  onLogout
}: AppSidebarProps) {
  const isOwnerScreen = currentScreen.startsWith('owner-');

  const handleSelectScreen = (screen: ScreenType) => {
    onNavigate(screen);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0 flex flex-col justify-between bg-white text-slate-800">
        
        {/* Top Header / Brand Block */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <SheetHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-md shadow-brand-teal/20">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                    <path d="M8 12a4 4 0 0 1 8 0" />
                  </svg>
                </div>
                <div>
                  <SheetTitle className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                    QuickWash
                  </SheetTitle>
                  <span className="text-[11px] font-semibold text-brand-teal">
                    Laundry Network
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-teal-50 text-brand-teal border-teal-200/60 font-bold text-[10px] px-2 py-0.5">
                v2.0 Pro
              </Badge>
            </div>
            <SheetDescription className="text-xs text-slate-500 pt-1">
              Select an operational portal or customer screen below.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          
          {/* Customer Storefront Section */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Customer Storefront
              </span>
              <span className="text-[10px] font-bold text-slate-400">Public</span>
            </div>

            <button
              onClick={() => handleSelectScreen('providers')}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'providers'
                  ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Partners</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'providers' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('services')}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'services'
                  ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Wash Services</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'services' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('tracking')}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'tracking'
                  ? 'bg-brand-teal text-white shadow-sm shadow-brand-teal/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Track Laundry Order</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'tracking' && 'text-white')} />
            </button>
          </div>

          <Separator className="bg-slate-100" />

          {/* Store Manager & Owner Hub Section */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Store Manager Hub
              </span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50 font-bold">
                Operator
              </Badge>
            </div>

            <button
              onClick={() => handleSelectScreen('owner-bookings' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                (currentScreen === 'owner-bookings' || currentScreen === 'owner-dashboard')
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Bookings & Live Desk</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', (currentScreen === 'owner-bookings' || currentScreen === 'owner-dashboard') && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('owner-availability' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'owner-availability'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Weekly Availability</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'owner-availability' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('owner-services' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'owner-services'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Services & Pricing</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'owner-services' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('owner-profile' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'owner-profile'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>Shop Profile</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'owner-profile' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('owner-analytics' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'owner-analytics'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'owner-analytics' && 'text-white')} />
            </button>

            <button
              onClick={() => handleSelectScreen('owner-settings' as ScreenType)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                currentScreen === 'owner-settings'
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </div>
              <ChevronRight className={cn('w-3.5 h-3.5 opacity-60', currentScreen === 'owner-settings' && 'text-white')} />
            </button>
          </div>

          <Separator className="bg-slate-100" />

          {/* Device & View Options */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Preview & Display
              </span>
            </div>

            <button
              onClick={() => {
                onToggleResponsiveMode();
                onOpenChange(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {isResponsiveMode ? <Smartphone className="w-4 h-4 text-brand-teal" /> : <Maximize2 className="w-4 h-4 text-brand-teal" />}
                <span>Display Mode</span>
              </div>
              <Badge variant="secondary" className="text-[10.5px] font-semibold bg-slate-100">
                {isResponsiveMode ? 'Phone Frame' : 'Full Canvas'}
              </Badge>
            </button>

            {onSupportClick && (
              <button
                onClick={() => {
                  onSupportClick();
                  onOpenChange(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Customer Support</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Live</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                KA
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-slate-800">Kwame Asante</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Sparkle Flagship (Online)
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  onOpenChange(false);
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
