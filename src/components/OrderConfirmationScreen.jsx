import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  ShieldCheck, 
  Shield, 
  Copy, 
  User, 
  Receipt, 
  Shirt, 
  Banknote,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function OrderConfirmationScreen({
  partner,
  scheduledTime,
  totalAmount = '390.00',
  bookingReference = 'LB - 2026 - 0091',
  onBackToHome,
  onTrackStatus
}) {
  const [activeTab, setActiveTab] = useState('orders');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingReference.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const partnerDisplayName = partner?.name || 'Sparkle Express Laundry';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc]">
      {/* Top Header matching design screenshot */}
      <header className="px-5 pt-3.5 pb-3 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* QuickWash Logo Badge */}
          <div className="w-9 h-9 bg-[#006a60] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#006a60]/20">
            <svg className="w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 7v5l3 3"></path>
              <path d="M8 12a4 4 0 0 1 8 0"></path>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-[16.5px] font-extrabold text-slate-900 tracking-tight">QuickWash</h1>
            <span className="text-[11.5px] font-medium text-slate-500">Confirmation</span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Connecting to Support...')}
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
            onClick={() => alert('User Account Profile')}
            className="w-9 h-9 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm shadow-[#006a60]/20"
            aria-label="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sub-header Bar (Order Confirmed dot & All set badge) */}
      <div className="px-5 py-2.5 flex items-center justify-between text-xs bg-[#f7f9fc]">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
          <span>Order Confirmed</span>
        </div>

        <div className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full text-[11.5px] border border-emerald-200/60 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
          <span>All set</span>
        </div>
      </div>

      {/* Scrollable Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-1 pb-24 flex flex-col gap-4">
        
        {/* Hero Celebration Banner */}
        <div className="flex flex-col items-center text-center mt-1">
          {/* Glowing Green Checkmark Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100/70 flex items-center justify-center shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-md shadow-[#006a60]/30">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-[22px] font-extrabold text-[#0c1a30] tracking-tight mt-3">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed mt-1.5">
            Your laundry pickup is scheduled. We've sent the details and tracking link to your phone.
          </p>
        </div>

        {/* Booking Reference Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center gap-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            BOOKING REFERENCE
          </span>
          
          <div className="flex items-center gap-2.5 my-1">
            <span className="text-[21px] font-extrabold text-[#006a60] tracking-wider font-mono">
              {bookingReference}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-slate-100 text-[#006a60] transition-colors"
              title="Copy Booking Reference"
              aria-label="Copy code"
            >
              <Copy className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {copied ? '✓ Copied to clipboard!' : 'Tap icon to copy code'}
          </span>
        </div>

        {/* Hub & Order Details Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
          
          {/* Partner & Hub Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f4f2] text-[#006a60] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="2" width="16" height="20" rx="3" ry="3"></rect>
                <circle cx="12" cy="14" r="5"></circle>
                <circle cx="12" cy="14" r="2"></circle>
                <line x1="8" y1="6" x2="8.01" y2="6"></line>
                <line x1="12" y1="6" x2="12.01" y2="6"></line>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <h3 className="text-[15.5px] font-extrabold text-slate-900">
                QuickWash Hub Central
              </h3>
              <span className="text-xs font-medium text-slate-500 mt-0.5">
                {partnerDisplayName}
              </span>
            </div>
          </div>

          {/* Details Table Rows */}
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <Clock className="w-4 h-4 text-[#006a60]" />
                <span>Pickup Date & Time</span>
              </div>
              <span className="font-extrabold text-slate-900 text-[12.5px]">
                {scheduledTime || 'Tue, May 13 · 1:30 PM'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <Banknote className="w-4 h-4 text-[#006a60]" />
                <span>Amount Paid</span>
              </div>
              <span className="font-extrabold text-[#006a60] text-[15px]">
                GH₵ {totalAmount}
              </span>
            </div>
          </div>

        </div>

        {/* Trust & Guarantee Badges Row */}
        <div className="flex items-center justify-center gap-4 py-1 text-slate-600">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#006a60]" />
            <span>Eco-friendly detergents</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006a60]" />
            <span>Garment care warranty</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-1">
          {/* Primary Track Button */}
          <button
            onClick={onTrackStatus || (() => alert('Tracking pickup status for Kofi Ansah...'))}
            className="w-full h-12 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
          >
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span>Track Pickup Status</span>
          </button>

          {/* Secondary Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-2xl font-bold text-sm flex items-center justify-center shadow-xs active:scale-[0.99] transition-all"
          >
            <span>Back to Home</span>
          </button>
        </div>

      </div>

      {/* Bottom Navigation Bar (matching exact design screenshot) */}
      <nav className="bg-white border-t border-slate-200/80 px-6 py-2 z-20 flex items-center justify-around shadow-lg">
        <button
          onClick={onBackToHome}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'laundry' ? 'text-[#006a60] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <svg className="w-5 h-5 stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="4" y="2" width="16" height="20" rx="3" ry="3"></rect>
            <circle cx="12" cy="14" r="5"></circle>
            <circle cx="12" cy="14" r="2"></circle>
            <line x1="8" y1="6" x2="8.01" y2="6"></line>
            <line x1="12" y1="6" x2="12.01" y2="6"></line>
          </svg>
          <span className="text-[11px]">Laundry</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'orders' ? 'text-[#006a60] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Receipt className="w-5 h-5 stroke-[2] text-[#006a60]" />
          <span className="text-[11px] font-bold text-[#006a60]">Orders</span>
        </button>

        <button
          onClick={onBackToHome}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'pricing' ? 'text-[#006a60] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Shirt className="w-5 h-5 stroke-[2]" />
          <span className="text-[11px]">Pricing</span>
        </button>
      </nav>
    </div>
  );
}
