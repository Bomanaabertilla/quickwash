import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  User, 
  MapPin, 
  FileText, 
  ArrowRight,
  Phone,
  Zap,
  Receipt,
  Store,
  Clock,
  ChevronDown,
  ChevronUp,
  Navigation,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Partner, CheckoutDetails } from '@quickwash/shared';

const COUNTRY_CODES = [
  { code: '+233', label: 'GH +233', flag: '🇬🇭', country: 'Ghana' },
  { code: '+234', label: 'NG +234', flag: '🇳🇬', country: 'Nigeria' },
  { code: '+254', label: 'KE +254', flag: '🇰🇪', country: 'Kenya' },
  { code: '+44', label: 'UK +44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+1', label: 'US +1', flag: '🇺🇸', country: 'United States' }
];

export interface PreferencesScreenProps {
  partner?: Partner | null;
  scheduledTime?: string;
  estimatedTotal?: string;
  selectedNetwork?: string;
  initialFullName?: string;
  initialPhone?: string;
  initialAddress?: string;
  initialNotes?: string;
  onBack: () => void;
  onContinueToPayment: (details: CheckoutDetails) => void;
  onSupportClick?: () => void;
  onProfileClick?: () => void;
}

export default function PreferencesScreen({
  partner,
  scheduledTime,
  estimatedTotal = '0.00',
  selectedNetwork = 'mtn',
  initialFullName = '',
  initialPhone = '',
  initialAddress = '',
  initialNotes = '',
  onBack,
  onContinueToPayment,
  onSupportClick,
  onProfileClick
}: PreferencesScreenProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phoneCode, setPhoneCode] = useState('+233');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState(initialNotes);
  
  // Interactive Enhancements State
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // Auto-detect network from phone number prefix
  const detectedNetwork = useMemo(() => {
    const cleanNum = phoneNumber.replace(/\s+/g, '');
    if (cleanNum.includes('24') || cleanNum.includes('54') || cleanNum.includes('55') || cleanNum.includes('59')) {
      return { name: 'MTN MoMo', badge: 'bg-[#ffcc00] text-slate-900' };
    }
    if (cleanNum.includes('20') || cleanNum.includes('50') || cleanNum.includes('80') || cleanNum.includes('81')) {
      return { name: 'Telecel Cash', badge: 'bg-[#e11d48] text-white' };
    }
    if (cleanNum.includes('27') || cleanNum.includes('57')) {
      return { name: 'AT Money', badge: 'bg-[#0284c7] text-white' };
    }
    return { name: 'MoMo', badge: 'bg-slate-200 text-slate-700' };
  }, [phoneNumber]);

  const handleUseCurrentLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          setAddress(`Current Location (${coords})`);
          setToastText('Location updated from device GPS!');
          setTimeout(() => setToastText(null), 2500);
        },
        () => {
          setIsLocating(false);
          setToastText('Location access unavailable');
          setTimeout(() => setToastText(null), 2500);
        },
        { timeout: 8000 }
      );
    } else {
      setToastText('Geolocation not supported');
      setTimeout(() => setToastText(null), 2000);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onContinueToPayment({
      fullName,
      momoNumber: phoneNumber.trim() ? `${phoneCode} ${phoneNumber.trim()}` : '',
      address,
      notes,
      estimatedTotal
    });
  };

  const partnerDisplayName = partner?.name || 'Sparkle Express Laundry';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc] relative">
      
      {/* Toast Notification */}
      {toastText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-50 flex items-center gap-2">
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
        
        {/* Card 1: Contact & Pickup Details */}
        <Card className="rounded-3xl p-4.5 border-slate-200/80 shadow-xs flex flex-col gap-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-slate-900">
              Contact &amp; Pickup Details
            </h2>
            
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border-0">
              <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
              <span>Guest checkout</span>
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Field 1: Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">
                Full name
              </label>
              <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9"
                />
              </div>
            </div>

            {/* Field 2: Mobile phone number */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Mobile phone number</span>
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', detectedNetwork.badge)}>
                  {detectedNetwork.name}
                </span>
              </label>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="bg-[#f4f7fa] rounded-2xl px-3 py-3 flex items-center gap-1.5 text-xs font-bold text-slate-800 border border-transparent hover:bg-slate-200/60 transition-all cursor-pointer"
                  >
                    <span>{COUNTRY_CODES.find(c => c.code === phoneCode)?.label || `GH ${phoneCode}`}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute top-12 left-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 w-44 flex flex-col gap-1">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setPhoneCode(c.code);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={cn(
                            'p-2 rounded-xl text-left text-xs font-bold flex items-center justify-between hover:bg-slate-100 cursor-pointer',
                            phoneCode === c.code ? 'text-[#006a60] bg-teal-50' : 'text-slate-700'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>{c.country} ({c.code})</span>
                          </span>
                          {phoneCode === c.code && <Check className="w-3.5 h-3.5 text-[#006a60]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 24 123 4567"
                    className="w-full text-xs font-semibold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: Pickup address */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Pickup address or drop-off note
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-[11px] font-bold text-[#006a60] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Navigation className={cn('w-3 h-3', isLocating && 'animate-spin')} />
                  <span>GPS Fill</span>
                </button>
              </div>
              
              <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 14B, Ring Road Central, Accra"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9"
                />
              </div>
            </div>

            {/* Field 4: Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800">
                Notes or special instructions (Optional)
              </label>
              <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-1 flex items-center gap-3 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 2 large bags, delicate fabrics"
                  className="w-full text-xs font-semibold text-slate-900 bg-transparent border-0 focus-visible:ring-0 shadow-none p-0 h-9"
                />
              </div>
            </div>
          </form>
        </Card>

        {/* Card 2: Order Summary */}
        <Card className="rounded-3xl p-4.5 border-slate-200/80 shadow-xs flex flex-col gap-3 bg-white">
          <div 
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#e8f4f2] text-[#006a60] flex items-center justify-center">
                <Receipt className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[15.5px] font-extrabold text-slate-900">
                  Order Summary
                </h3>
                {isSummaryExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>

            <span className="text-[17px] font-extrabold text-[#006a60]">
              GH₵ {estimatedTotal}
            </span>
          </div>

          {/* Expandable Breakdown Accordion */}
          {isSummaryExpanded && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-2 text-xs text-slate-600 my-1">
              <div className="flex justify-between">
                <span>Wash &amp; Fold:</span>
                <span className="font-bold text-slate-900">Calculated</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-400">
                <span>Service Fee &amp; Taxes:</span>
                <span>Included</span>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Store className="w-4 h-4 text-[#006a60]" />
                <span>{partnerDisplayName}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10.5px] font-bold border-0">
                Standard
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Pickup: {scheduledTime || 'Tue, May 13 • 1:30 PM'}</span>
            </div>
          </div>
        </Card>

        {/* Action Button & Helper Text */}
        <div className="flex flex-col gap-2 mt-1">
          <Button
            onClick={handleSubmit}
            className="w-full h-13 py-3.5 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-[15.5px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            <span>Proceed to payment</span>
          </Button>

          <p className="text-xs text-slate-400 text-center font-medium">
            Quick, secure checkout with no password needed
          </p>
        </div>

      </div>
    </div>
  );
}
