import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  User, 
  Search, 
  ShieldCheck, 
  Copy, 
  PhoneCall, 
  Clock, 
  Store, 
  Shirt, 
  Receipt, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Truck, 
  Download, 
  Bike, 
  PackageCheck 
} from 'lucide-react';
import { getOrders, getOrderById, getLatestOrder } from '../data/ordersStore';
import { formatCurrency } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Partner, Order } from '@quickwash/shared';

export interface TrackLaundryScreenProps {
  partner?: Partner | null;
  scheduledTime?: string;
  totalAmount?: string;
  bookingReference?: string;
  momoNumber?: string;
  onBack: () => void;
  onSupportClick?: () => void;
  onProfileClick?: () => void;
}

export default function TrackLaundryScreen({
  partner,
  scheduledTime,
  totalAmount = '390.00',
  bookingReference,
  momoNumber = '+233 24 123 4567',
  onBack,
  onSupportClick,
  onProfileClick
}: TrackLaundryScreenProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    if (bookingReference) return getOrderById(bookingReference) || null;
    return null;
  });
  const [searchPhone, setSearchPhone] = useState(() => momoNumber?.replace('+233 ', '') || '');
  const [searchCode, setSearchCode] = useState(() => bookingReference || '');
  const [phoneCode, setPhoneCode] = useState('+233');
  const [isCopied, setIsCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasLookedUp, setHasLookedUp] = useState(() => Boolean(bookingReference));
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    if (bookingReference) {
      const cleanRef = bookingReference.replace(/\s+/g, '');
      setSearchCode(cleanRef);
      const all = getOrders();
      const match = all.find(o => o.id === cleanRef);
      if (match) {
        setCurrentOrder(match);
        setHasLookedUp(true);
      }
    }
  }, [bookingReference]);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      const all: Order[] = e.detail || getOrders();
      if (searchCode) {
        const match = all.find(o => o.id === searchCode);
        if (match) setCurrentOrder(match);
      }
    };
    window.addEventListener('quickwash:orders_updated', handleUpdate);
    return () => window.removeEventListener('quickwash:orders_updated', handleUpdate);
  }, [searchCode]);

  const handleCopyCode = () => {
    if (!searchCode) return;
    navigator.clipboard?.writeText(searchCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      if (text) setSearchCode(text.trim());
    } catch {
      if (bookingReference) setSearchCode(bookingReference);
    }
  };

  const handleLookup = () => {
    const all = getOrders();
    const query = searchCode.trim().toLowerCase();
    const phoneClean = searchPhone.replace(/\s+/g, '');
    const found = all.find(o => 
      o.id.toLowerCase() === query || 
      (phoneClean && o.phone?.replace(/\s+/g, '').includes(phoneClean))
    );

    if (found) {
      setCurrentOrder(found);
      setSearchCode(found.id);
      setHasLookedUp(true);
      setToastText(`Found live order #${found.id}!`);
    } else {
      setToastText('Order not found with provided reference');
    }
    setTimeout(() => setToastText(null), 2500);
  };

  const handleSaveReceipt = () => {
    alert(`Downloading Official QuickWash Digital Receipt for Order ${searchCode}...`);
  };

  const partnerDisplayName = currentOrder?.partnerName || partner?.name || 'Sparkle Express Laundry';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc] relative">
      
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-50 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="px-5 pt-3.5 pb-3 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#006a60] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#006a60]/20">
              <svg className="w-4.5 h-4.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
                <path d="M8 12a4 4 0 0 1 8 0"></path>
              </svg>
            </div>
            <h1 className="text-[17px] font-extrabold text-slate-900 tracking-tight">Booking Details</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSupportClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm shadow-[#006a60]/20 cursor-pointer"
            aria-label="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Scrollable Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-4 pb-12 flex flex-col gap-4">
        
        {/* Hero Title & Subtitle */}
        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#006a60] uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="4" y="2" width="16" height="20" rx="3" ry="3"></rect>
              <circle cx="12" cy="14" r="5"></circle>
            </svg>
            <span>SELF-SERVICE PORTAL</span>
          </div>

          <h2 className="text-[23px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Track My Laundry
          </h2>
          
          <p className="text-xs text-slate-500 font-normal">
            Lookup status with your phone number and reference code.
          </p>

          <div className="mt-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>No account or password needed</span>
            </Badge>
          </div>
        </div>

        {/* Lookup Inputs Card */}
        <Card className="rounded-3xl p-4.5 border-slate-200/80 shadow-xs flex flex-col gap-3.5 bg-white">
          {/* Field 1: Phone number */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Phone number</label>
              <span className="text-[11px] font-medium text-slate-400">Used during booking</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#f4f7fa] rounded-2xl px-3 py-3 flex items-center gap-1 text-xs font-bold text-slate-800 border border-transparent">
                <span>GH {phoneCode}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>

              <div className="flex-1 bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center gap-2 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <Input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="24 123 4567"
                  className="w-full text-xs font-bold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9"
                />
              </div>
            </div>
          </div>

          {/* Field 2: Reference code */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Reference code</label>
              <span className="text-[11px] font-medium text-slate-400">SMS confirmation</span>
            </div>

            <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center justify-between gap-2 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-400 font-bold text-sm">#</span>
                <Input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="e.g. LB-2026-0091"
                  className="w-full text-xs font-bold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9 font-mono tracking-wider"
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePasteCode}
                className="bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold px-3 py-1 rounded-lg transition-colors h-7 cursor-pointer"
              >
                Paste
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-medium leading-normal">
            Found on your SMS or instant booking confirmation screen.
          </p>

          <Button
            onClick={handleLookup}
            className="w-full h-12 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all mt-1 cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Look Up Booking</span>
          </Button>
        </Card>

        {/* System Status Guide Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              SYSTEM STATUS GUIDE
            </span>
            <span className="text-xs font-bold text-[#006a60] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a60] animate-ping"></span>
              Live sync active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-teal-50 text-teal-800 py-1.5 px-2 rounded-full font-extrabold flex items-center justify-center gap-1.5 border border-teal-100">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>Confirmed</span>
            </div>
            <div className="bg-slate-100 text-slate-700 py-1.5 px-2 rounded-full font-extrabold flex items-center justify-center gap-1.5 border border-slate-200/70">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>In Progress</span>
            </div>
            <div className="bg-rose-50 text-rose-700 py-1.5 px-2 rounded-full font-extrabold flex items-center justify-center gap-1.5 border border-rose-100">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Cancelled</span>
            </div>
          </div>
        </div>

        {/* Found Order Status Card */}
        {hasLookedUp && currentOrder && (
          <Card className="rounded-3xl p-4.5 border-slate-200/80 shadow-xs flex flex-col gap-4 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  BOOKING REFERENCE
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-extrabold text-slate-900 font-mono">
                    {currentOrder?.id || searchCode}
                  </span>
                  <button onClick={handleCopyCode} title="Copy code" className="cursor-pointer">
                    <Copy className="w-4 h-4 text-[#006a60] hover:text-[#005850]" />
                  </button>
                  {isCopied && <span className="text-[10px] font-bold text-emerald-600">Copied!</span>}
                </div>
              </div>

              <Badge
                variant={
                  currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                    ? 'success'
                    : currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash'
                    ? 'warning'
                    : 'secondary'
                }
                className="text-[11.5px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5"
              >
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                    ? 'bg-emerald-600'
                    : currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-[#006a60] animate-pulse'
                )}></span>
                <span>{currentOrder?.status || 'Confirmed'} • {currentOrder?.assignedRider || 'Driver assigned'}</span>
              </Badge>
            </div>

            {/* Order Lifecycle Progress Bar */}
            <div className="bg-[#f0f4f9] rounded-2xl p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">Order Lifecycle</span>
                <span className="text-[#006a60]">
                  {currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered' ? 'Completed & Delivered' : 'Estimated: In Progress'}
                </span>
              </div>

              {/* 4-Step Horizontal Timeline Line */}
              <div className="grid grid-cols-4 gap-1 relative pt-2">
                <div className="absolute top-[21px] left-6 right-6 h-0.5 bg-slate-200 z-0"></div>
                <div className={cn(
                  'absolute top-[21px] left-6 h-0.5 bg-[#006a60] z-0 transition-all duration-500',
                  currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                    ? 'w-[90%]'
                    : currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash'
                    ? 'w-[60%]'
                    : 'w-[25%]'
                )}></div>

                {/* Step 1: Booked */}
                <div className="flex flex-col items-center text-center z-10 gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-900 leading-tight">Booked</span>
                  <span className="text-[10px] font-medium text-slate-400">Confirmed</span>
                </div>

                {/* Step 2: Pickup */}
                <div className="flex flex-col items-center text-center z-10 gap-1">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shadow-sm',
                    currentOrder?.status !== 'Confirmed'
                      ? 'bg-[#006a60] text-white'
                      : 'bg-[#006a60] text-white ring-4 ring-[#006a60]/20'
                  )}>
                    <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#006a60] leading-tight">Pickup</span>
                  <span className="text-[10px] font-bold text-[#006a60]">Collected</span>
                </div>

                {/* Step 3: Care / Wash */}
                <div className={cn(
                  'flex flex-col items-center text-center z-10 gap-1',
                  currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash' || currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                    ? ''
                    : 'opacity-50'
                )}>
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                      : currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                      ? 'bg-[#006a60] text-white'
                      : 'bg-slate-200 text-slate-600'
                  )}>
                    <Shirt className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">Washing</span>
                  <span className="text-[10px] text-slate-400">
                    {currentOrder?.status === 'In progress' || (currentOrder?.status as any) === 'In wash' ? 'In Wash' : 'Step 3'}
                  </span>
                </div>

                {/* Step 4: Delivery */}
                <div className={cn(
                  'flex flex-col items-center text-center z-10 gap-1',
                  currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                    ? ''
                    : 'opacity-50'
                )}>
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20'
                      : 'bg-slate-200 text-slate-600'
                  )}>
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">Delivery</span>
                  <span className="text-[10px] text-slate-400">
                    {currentOrder?.status === 'Delivered' || (currentOrder?.status as any) === 'Ready / Delivered' ? 'Done' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Rider Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {currentOrder?.assignedRider || 'Courier will be assigned'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {currentOrder?.address || 'Pickup from customer address'}
                  </div>
                </div>
              </div>

              {currentOrder?.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Calling courier (${currentOrder.phone})...`)}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 border-blue-200/60 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </Button>
              )}
            </div>

            {/* Order Details List */}
            <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Store className="w-4 h-4 text-slate-400" />
                  <span>Facility</span>
                </div>
                <span className="font-extrabold text-slate-900">{partnerDisplayName}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Scheduled slot</span>
                </div>
                <span className="font-extrabold text-slate-900">{currentOrder?.slot || scheduledTime || 'Today (Immediate)'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Shirt className="w-4 h-4 text-slate-400" />
                  <span>Services</span>
                </div>
                <span className="font-bold text-slate-900">{currentOrder?.summary || 'Wash & Fold'}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <span>Total paid</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-extrabold text-[#006a60]">
                    {formatCurrency(currentOrder?.amount || totalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Paid via {currentOrder?.paymentMethod || 'MTN MoMo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={handleSaveReceipt}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors border-blue-100 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </Button>

              <Button
                variant="outline"
                onClick={onSupportClick}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors border-blue-100 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Help?</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Not Found State */}
        {hasLookedUp && !currentOrder && (
          <Card className="rounded-3xl p-6 border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-3 bg-white">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">No Booking Found</h3>
              <p className="text-xs text-slate-500 max-w-[280px] mt-1">
                We couldn't find an active order matching your lookup. Please verify your reference number or phone.
              </p>
            </div>
          </Card>
        )}

        {/* Empty Search Prompt State */}
        {!hasLookedUp && (
          <Card className="rounded-3xl p-6 border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-3 bg-white">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-brand-teal flex items-center justify-center">
              <Shirt className="w-6 h-6 text-[#006a60]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Track Your Laundry Order</h3>
              <p className="text-xs text-slate-500 max-w-[280px] mt-1">
                Enter your booking reference code or registered phone number above to track pickup, wash, and delivery status live.
              </p>
            </div>
          </Card>
        )}
        <Card className="rounded-2xl p-3.5 border-slate-200/80 shadow-xs flex flex-col gap-2 bg-white">
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="flex items-center justify-between w-full text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <HelpCircle className="w-4 h-4 text-[#006a60]" />
              <span>Can't find your reference code?</span>
            </div>
            {isHelpOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isHelpOpen && (
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
              Your booking reference was sent via SMS to your phone right after payment confirmation. Check your SMS inbox for a message from <strong>QuickWash</strong>, or contact customer support for instant lookup.
            </p>
          )}
        </Card>

      </div>
    </div>
  );
}
