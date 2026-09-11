import React, { useState } from 'react';
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
  MessageSquare,
  Bike
} from 'lucide-react';

export default function TrackLaundryScreen({
  partner,
  scheduledTime,
  totalAmount = '390.00',
  bookingReference = 'LB-2026-0091',
  momoNumber = '+233 24 123 4567',
  onBack,
  onSupportClick,
  onProfileClick
}) {
  const [searchPhone, setSearchPhone] = useState('24 123 4567');
  const [searchCode, setSearchCode] = useState(bookingReference);
  const [phoneCode, setPhoneCode] = useState('+233');
  const [isCopied, setIsCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasLookedUp, setHasLookedUp] = useState(true);
  const [toastText, setToastText] = useState(null);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(searchCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      if (text) setSearchCode(text.trim());
    } catch {
      setSearchCode(bookingReference);
    }
  };

  const handleLookup = () => {
    setHasLookedUp(true);
    setToastText('Booking found live!');
    setTimeout(() => setToastText(null), 2000);
  };

  const handleSaveReceipt = () => {
    alert(`Downloading Official QuickWash Digital Receipt for Order ${searchCode}...`);
  };

  const partnerDisplayName = partner?.name || 'Sparkle Express Laundry';

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
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
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
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Help & Support"
          >
            <svg className="w-5 h-5 text-slate-700 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
              <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </button>
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm shadow-[#006a60]/20"
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
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>No account or password needed</span>
            </span>
          </div>
        </div>

        {/* Lookup Inputs Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
          
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

              <div className="flex-1 bg-[#f4f7fa] rounded-2xl px-3.5 py-3 flex items-center gap-2 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="24 123 4567"
                  className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
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

            <div className="bg-[#f4f7fa] rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 border border-transparent focus-within:border-[#006a60] focus-within:bg-white transition-all">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-400 font-bold text-sm">#</span>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="LB-2026-0091"
                  className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-mono tracking-wider"
                />
              </div>

              <button
                type="button"
                onClick={handlePasteCode}
                className="bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold px-3 py-1 rounded-lg transition-colors"
              >
                Paste
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-medium leading-normal">
            Found on your SMS or instant booking confirmation screen.
          </p>

          {/* Look Up Booking Button */}
          <button
            onClick={handleLookup}
            className="w-full h-12 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all mt-1"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Look Up Booking</span>
          </button>

        </div>

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
        {hasLookedUp && (
          <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col gap-4 animate-fadeIn">
            
            {/* Header row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  BOOKING REFERENCE
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-extrabold text-slate-900 font-mono">
                    {searchCode}
                  </span>
                  <button onClick={handleCopyCode} title="Copy code">
                    <Copy className="w-4 h-4 text-[#006a60] hover:text-[#005850]" />
                  </button>
                  {isCopied && <span className="text-[10px] font-bold text-emerald-600">Copied!</span>}
                </div>
              </div>

              <div className="bg-teal-50 text-[#006a60] text-[11.5px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border border-teal-100">
                <span className="w-2 h-2 rounded-full bg-[#006a60] animate-pulse"></span>
                <span>Confirmed • Driver assigned</span>
              </div>
            </div>

            {/* Order Lifecycle Progress Bar */}
            <div className="bg-[#f0f4f9] rounded-2xl p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">Order Lifecycle</span>
                <span className="text-[#006a60]">Estimated: Today, 5:00 PM</span>
              </div>

              {/* 4-Step Horizontal Timeline Line */}
              <div className="grid grid-cols-4 gap-1 relative pt-2">
                {/* Connecting line */}
                <div className="absolute top-[21px] left-6 right-6 h-0.5 bg-slate-200 z-0"></div>
                <div className="absolute top-[21px] left-6 w-1/3 h-0.5 bg-[#006a60] z-0"></div>

                {/* Step 1: Booked */}
                <div className="flex flex-col items-center text-center z-10 gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-900 leading-tight">Booked</span>
                  <span className="text-[10px] font-medium text-slate-400">10:15 AM</span>
                </div>

                {/* Step 2: Pickup (Active) */}
                <div className="flex flex-col items-center text-center z-10 gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm ring-4 ring-[#006a60]/20">
                    <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#006a60] leading-tight">Pickup</span>
                  <span className="text-[10px] font-bold text-[#006a60]">On the way</span>
                </div>

                {/* Step 3: Care */}
                <div className="flex flex-col items-center text-center z-10 gap-1 opacity-50">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">Care</span>
                  <span className="text-[10px] text-slate-400">Upcoming</span>
                </div>

                {/* Step 4: Delivery */}
                <div className="flex flex-col items-center text-center z-10 gap-1 opacity-50">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">Delivery</span>
                  <span className="text-[10px] text-slate-400">5:00 PM</span>
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
                    Kwame Mensah • Rider #412
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Arriving for doorstep pickup in ~12 mins
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Calling Kwame Mensah (+233 20 888 9900)...')}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 border border-blue-200/60"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </button>
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
                <span className="font-extrabold text-slate-900">{scheduledTime || 'Tue, May 13 • 1:30 PM'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Shirt className="w-4 h-4 text-slate-400" />
                  <span>Services</span>
                </div>
                <span className="font-bold text-slate-900">Wash & Fold (5kg) + 2 Dry Clean</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <span>Total paid</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-extrabold text-[#006a60]">GH₵ {totalAmount}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Paid via MTN MoMo</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveReceipt}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </button>

              <button
                onClick={onSupportClick}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-100"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Help?</span>
              </button>
            </div>

          </div>
        )}

        {/* Can't find your reference code Accordion */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col gap-2">
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="flex items-center justify-between w-full text-left"
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
        </div>

      </div>
    </div>
  );
}
