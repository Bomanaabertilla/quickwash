import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  User, 
  Lock, 
  CheckCheck, 
  Smartphone, 
  ShieldCheck, 
  RefreshCw,
  Receipt,
  PhoneCall,
  CheckCircle2,
  Signal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Partner } from '@quickwash/shared';

interface NetworkConfig {
  id: string;
  name: string;
  shortName: string;
  badgeText: string;
  badgeClass: string;
  headerTitle: string;
  defaultPhone: string;
  promptText: string;
  authorizeText: string;
}

const NETWORKS: Record<string, NetworkConfig> = {
  mtn: {
    id: 'mtn',
    name: 'MTN Mobile Money',
    shortName: 'MTN MoMo',
    badgeText: 'MoMo',
    badgeClass: 'bg-[#ffcc00] text-slate-900',
    headerTitle: 'MTN Mobile Money Ghana',
    defaultPhone: '+233 24 123 4567',
    promptText: 'Prompt sent to phone — approve with MoMo PIN',
    authorizeText: 'Authorize MoMo payment'
  },
  telecel: {
    id: 'telecel',
    name: 'Telecel Cash (Vodafone)',
    shortName: 'Telecel Cash',
    badgeText: 'Telecel',
    badgeClass: 'bg-[#e11d48] text-white',
    headerTitle: 'Telecel Cash Ghana',
    defaultPhone: '+233 20 888 9900',
    promptText: 'Prompt sent to phone — approve with Telecel PIN',
    authorizeText: 'Authorize Telecel payment'
  },
  at: {
    id: 'at',
    name: 'AT Money (AirtelTigo)',
    shortName: 'AT Money',
    badgeText: 'AT',
    badgeClass: 'bg-[#0284c7] text-white',
    headerTitle: 'AT Money Ghana',
    defaultPhone: '+233 27 555 4433',
    promptText: 'Prompt sent to phone — approve with AT PIN',
    authorizeText: 'Authorize AT Money payment'
  }
};

export interface PaymentCheckoutScreenProps {
  partner?: Partner | null;
  scheduledTime?: string;
  totalAmount?: string;
  momoNumber?: string;
  selectedNetwork?: string;
  onBack: () => void;
  onAuthorize: () => void;
  onSupportClick?: () => void;
  onProfileClick?: () => void;
}

export default function PaymentCheckoutScreen({
  partner,
  scheduledTime,
  totalAmount = '0.00',
  momoNumber = '',
  selectedNetwork = 'mtn',
  onBack,
  onAuthorize,
  onSupportClick,
  onProfileClick
}: PaymentCheckoutScreenProps) {
  const [activeNetwork, setActiveNetwork] = useState(selectedNetwork || 'mtn');
  const [phone, setPhone] = useState(momoNumber);
  const [countdown, setCountdown] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Sync phone when prop changes
  useEffect(() => {
    if (momoNumber) setPhone(momoNumber);
  }, [momoNumber]);

  // Active countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleNetworkSwitch = (netId: string) => {
    setActiveNetwork(netId);
    setCountdown(45);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setCountdown(45);
      setIsResending(false);
    }, 800);
  };

  const handleAuthorizeClick = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      onAuthorize();
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentNetConfig = NETWORKS[activeNetwork] || NETWORKS.mtn;
  const partnerDisplayName = partner?.name || 'QuickWash Laundry';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-3 pb-24 flex flex-col gap-3">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pt-1">
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Back to preferences"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#006a60] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#006a60]/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
                <path d="M8 12a4 4 0 0 1 8 0"></path>
              </svg>
            </div>
            <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Pay QuickWash</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSupportClick}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm shadow-[#006a60]/20 hover:bg-[#005850] transition-colors cursor-pointer"
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Progress Stepper Bar: Step 5 of 6 */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 font-medium">Step 5 of 6</span>
            <div className="flex items-center gap-1.5 text-[#006a60] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7ec4bd] inline-block"></span>
              <span>Payment Checkout</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#e8edf5] rounded-full overflow-hidden">
            <div className="w-[83.33%] h-full bg-[#006a60] rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Upper Order Summary Box */}
        <Card className="rounded-2xl p-4 border-slate-200/80 shadow-xs flex flex-col gap-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#006a60]" />
              <span className="text-sm font-bold text-slate-800">{partnerDisplayName}</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Order #QW-89420
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
            <span>Pickup schedule:</span>
            <span className="font-semibold text-slate-900">{scheduledTime || 'Tue, May 13 (1:30 PM)'}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Payment method:</span>
            <span className="font-bold text-[#006a60] flex items-center gap-1">
              {currentNetConfig.shortName} {phone ? `(${phone})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Charge</span>
            <span className="text-lg font-extrabold text-slate-900">GH₵ {totalAmount}</span>
          </div>
        </Card>

        {/* Network Provider Switcher Pills */}
        <Card className="rounded-2xl p-3 border-slate-200/80 shadow-xs flex flex-col gap-2 bg-white">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Signal className="w-3.5 h-3.5 text-[#006a60]" />
              <span>Select Mobile Network Provider:</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.values(NETWORKS).map((net) => {
              const isSelected = activeNetwork === net.id;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => handleNetworkSwitch(net.id)}
                  className={cn(
                    'py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                    isSelected
                      ? `${net.badgeClass} shadow-md ring-2 ring-slate-900/10 scale-[1.02]`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  <span>{net.shortName}</span>
                  {isSelected && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Main Payment Checkout Card */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm flex flex-col flex-1 min-h-[310px] overflow-hidden justify-between bg-white">
          
          {/* Header area with soft blue-grey tint background */}
          <div className="bg-[#f0f4f9] p-3.5 px-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-6 h-6 rounded-lg font-black text-[10px] flex items-center justify-center shadow-xs', currentNetConfig.badgeClass)}>
                {currentNetConfig.badgeText}
              </div>
              <span className="text-xs font-extrabold text-slate-800">{currentNetConfig.headerTitle}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          {/* Card Body - Content */}
          <div className="p-4 flex-1 flex flex-col justify-between gap-4">
            
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-900">Complete payment on your phone</h3>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-[#006a60]/10 text-[#006a60] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A payment prompt request of <strong className="text-slate-900">GH₵ {totalAmount}</strong> has been sent to your <strong className="text-slate-900">{currentNetConfig.shortName}</strong> number <strong className="text-slate-900">{phone}</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-[#006a60]/10 text-[#006a60] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter your PIN on your mobile device to authorize payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Amber Alert Callout Box */}
            <div className="bg-[#fff9e6] border border-[#fce9a6] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0 shadow-sm shadow-amber-400" />
                <span className="text-[13.5px] font-semibold text-slate-900 leading-snug">
                  {currentNetConfig.promptText}
                </span>
              </div>

              <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-800 flex-shrink-0">
                <Smartphone className="w-5 h-5 text-amber-800" />
              </div>
            </div>

          </div>

        </Card>

      </div>

      {/* Sticky Bottom Actions & Authorize Button */}
      <div className="bg-[#f7f9fc] border-t border-slate-200/60 px-5 pt-3 pb-5 z-20 flex flex-col gap-3">
        
        {/* Deep Teal Authorize Button */}
        <Button
          onClick={handleAuthorizeClick}
          disabled={isAuthorizing}
          className="w-full h-13 py-3.5 bg-[#006a60] hover:bg-[#005850] text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all disabled:opacity-80 cursor-pointer"
        >
          {isAuthorizing ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Verifying {currentNetConfig.shortName} authorization...</span>
            </div>
          ) : (
            <>
              <Lock className="w-5 h-5 stroke-[2.2]" />
              <span>{currentNetConfig.authorizeText} (GH₵ {totalAmount})</span>
            </>
          )}
        </Button>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between px-1 text-xs select-none">
          
          <button
            onClick={onAuthorize}
            className="flex items-center gap-1.5 text-[#006a60] font-bold hover:underline transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-[#006a60] stroke-[2.5]" />
            <span>I have approved</span>
          </button>

          <div className="text-slate-600 font-medium">
            {countdown > 0 ? (
              <span>
                Resend prompt in <strong className="font-bold text-slate-800">{formatTimer(countdown)}</strong>
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#006a60] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>Resend prompt now</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
