import React, { useState, useMemo } from 'react';
import { ArrowLeft, HelpCircle, User, Store, Plus, Minus, Check, ArrowRight } from 'lucide-react';

export default function ServicesScreen({
  partner,
  scheduledTime,
  onBack,
  onContinue,
  onSupportClick,
  onProfileClick
}) {
  // Quantities for services
  const [washAndFoldKg, setWashAndFoldKg] = useState(10); // 10 kg @ 32 = 320
  const [dryCleanItems, setDryCleanItems] = useState(2);  // 2 items @ 35 = 70 => total 390!
  const [steamIronItems, setSteamIronItems] = useState(0); // 0 items @ 15 = 0

  // Rates
  const washAndFoldRate = 32.0;
  const dryCleanRate = 35.0;
  const steamIronRate = 15.0;

  // Calculate estimated total
  const estimatedTotal = useMemo(() => {
    const total = (washAndFoldKg * washAndFoldRate) +
                  (dryCleanItems * dryCleanRate) +
                  (steamIronItems * steamIronRate);
    return total.toFixed(2);
  }, [washAndFoldKg, dryCleanItems, steamIronItems]);

  const partnerDisplayName = partner?.name?.replace(' Laundry', '') || 'Sparkle Express';
  const displaySchedule = scheduledTime || 'Tue, May 13 (2:00 PM)';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc]">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-3 pb-28 flex flex-col gap-4">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pt-1">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200/70 transition-colors"
            aria-label="Back to providers"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Logo & Services Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-teal rounded-xl flex items-center justify-center text-white shadow-sm shadow-brand-teal/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
                <path d="M8 12a4 4 0 0 1 8 0"></path>
              </svg>
            </div>
            <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Services</h1>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSupportClick}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-sm shadow-brand-teal/20 hover:bg-brand-hover transition-colors"
              aria-label="User Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Progress Stepper Bar: Step 3 of 6 */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Step 3 of 6</span>
            <span className="text-brand-teal font-bold">Service selection</span>
          </div>
          <div className="w-full h-1.5 bg-[#e8edf5] rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-brand-teal rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Partner Store & Scheduled Window Subtitle */}
        <div className="flex items-center gap-2 text-[13.5px] font-medium text-slate-700 mt-1">
          <Store className="w-4 h-4 text-brand-teal flex-shrink-0" />
          <span className="truncate">
            <strong className="font-bold text-slate-900">{partnerDisplayName}</strong> • {displaySchedule}
          </span>
        </div>

        {/* Section Heading with Washing Machine Icon */}
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-tight">
            Choose your laundry services
          </h2>
          <div className="w-9 h-9 rounded-xl border border-brand-teal/30 bg-brand-light flex items-center justify-center text-brand-teal flex-shrink-0">
            <svg className="w-5 h-5 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="4" y="2" width="16" height="20" rx="3" ry="3"></rect>
              <circle cx="12" cy="14" r="5"></circle>
              <circle cx="12" cy="14" r="2"></circle>
              <line x1="8" y1="6" x2="8.01" y2="6"></line>
              <line x1="12" y1="6" x2="12.01" y2="6"></line>
            </svg>
          </div>
        </div>

        {/* Service Cards */}
        <div className="flex flex-col gap-4 mt-1">
          
          {/* Card 1: Wash & Fold (Selected - Active Teal Border) */}
          <div className={`bg-white rounded-2xl p-4 transition-all duration-200 border-2 ${
            washAndFoldKg > 0 ? 'border-brand-teal shadow-md ring-1 ring-brand-teal/10' : 'border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-slate-900 leading-snug">Wash & Fold</h3>
                  <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-teal text-[10.5px] font-bold uppercase tracking-wide">
                    Popular
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                  Everyday clothes, t-shirts, towels, and linens. Washed with premium detergents, tumbled dry, and crisply folded.
                </p>
                <div className="text-[13px] font-extrabold text-slate-900 mt-2">
                  GH₵ {washAndFoldRate.toFixed(2)} <span className="text-slate-500 font-normal text-xs">/ kg</span>
                </div>
              </div>

              {/* Checkmark Indicator */}
              {washAndFoldKg > 0 && (
                <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Weight estimate</span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWashAndFoldKg(Math.max(0, washAndFoldKg - 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Decrease weight"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[50px] text-center">
                  {washAndFoldKg} kg
                </span>
                <button
                  onClick={() => setWashAndFoldKg(washAndFoldKg + 1)}
                  className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-hover transition-colors shadow-sm"
                  aria-label="Increase weight"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Dry Clean & Press */}
          <div className={`bg-white rounded-2xl p-4 transition-all duration-200 border ${
            dryCleanItems > 0 ? 'border-brand-teal shadow-md ring-1 ring-brand-teal/10' : 'border-slate-200/90'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-slate-900 leading-snug">Dry Clean & Press</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10.5px] font-semibold">
                    Garment Care
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                  Suits, dresses, blazers, and delicates. Expertly stain-treated, solvent dry-cleaned, and returned on hangers.
                </p>
                <div className="text-[13px] font-extrabold text-slate-900 mt-2">
                  GH₵ {dryCleanRate.toFixed(2)} <span className="text-slate-500 font-normal text-xs">/ item</span>
                </div>
              </div>

              {dryCleanItems > 0 && (
                <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Items quantity</span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDryCleanItems(Math.max(0, dryCleanItems - 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Decrease items"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[50px] text-center">
                  {dryCleanItems} {dryCleanItems === 1 ? 'item' : 'items'}
                </span>
                <button
                  onClick={() => setDryCleanItems(dryCleanItems + 1)}
                  className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-hover transition-colors shadow-sm"
                  aria-label="Increase items"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Steam Ironing Only */}
          <div className={`bg-white rounded-2xl p-4 transition-all duration-200 border ${
            steamIronItems > 0 ? 'border-brand-teal shadow-md ring-1 ring-brand-teal/10' : 'border-slate-200/90'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug">Steam Press & Iron</h3>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                  Clean garments that just need professional crease-free steam iron finish.
                </p>
                <div className="text-[13px] font-extrabold text-slate-900 mt-2">
                  GH₵ {steamIronRate.toFixed(2)} <span className="text-slate-500 font-normal text-xs">/ item</span>
                </div>
              </div>

              {steamIronItems > 0 && (
                <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Items quantity</span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSteamIronItems(Math.max(0, steamIronItems - 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Decrease items"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-slate-900 min-w-[50px] text-center">
                  {steamIronItems} {steamIronItems === 1 ? 'item' : 'items'}
                </span>
                <button
                  onClick={() => setSteamIronItems(steamIronItems + 1)}
                  className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-hover transition-colors shadow-sm"
                  aria-label="Increase items"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Estimated Total Card */}
          <div className="bg-white rounded-2xl p-4.5 flex items-center justify-between border border-slate-200/90 shadow-sm mt-1">
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-800">Estimated total</span>
              <span className="text-[12px] font-medium text-slate-400 mt-0.5">Taxes & fees included</span>
            </div>
            <div className="text-[22px] font-extrabold text-brand-teal tracking-tight">
              GH₵ {estimatedTotal}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom Continue Button */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-glass border-t border-slate-200/80 px-5 pt-3.5 pb-6 z-20 shadow-lg">
        <button
          onClick={() => onContinue(estimatedTotal)}
          className="w-full h-13 py-3.5 bg-brand-teal hover:bg-brand-hover text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2.5 shadow-btn active:scale-[0.99] transition-all"
        >
          <span>Continue to preferences</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
