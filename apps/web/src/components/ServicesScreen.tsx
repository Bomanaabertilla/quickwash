import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, HelpCircle, User, Store, Plus, Minus, Check, ArrowRight, Tag } from 'lucide-react';
import { getServicesCatalog } from '../data/servicesStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Partner, ServiceCatalogItem, OrderItem } from '@quickwash/shared';

export interface ServicesScreenProps {
  partner?: Partner | null;
  scheduledTime?: string;
  onBack: () => void;
  onContinue: (total: string, items: OrderItem[]) => void;
  onSupportClick?: () => void;
  onProfileClick?: () => void;
}

export default function ServicesScreen({
  partner,
  scheduledTime,
  onBack,
  onContinue,
  onSupportClick,
  onProfileClick
}: ServicesScreenProps) {
  const [catalog, setCatalog] = useState<ServiceCatalogItem[]>(() => 
    getServicesCatalog().filter(s => s.active !== false)
  );
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setCatalog(e.detail.filter((s: ServiceCatalogItem) => s.active !== false));
      }
    };
    window.addEventListener('quickwash:services_updated', handleUpdate);
    return () => window.removeEventListener('quickwash:services_updated', handleUpdate);
  }, []);

  const handleUpdateQuantity = (id: string | number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculate estimated total based on catalog prices
  const { estimatedTotal, selectedItemsList } = useMemo(() => {
    let total = 0;
    const selected: OrderItem[] = [];
    catalog.forEach(item => {
      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        const priceNum = parseFloat(item.price) || 0;
        const subtotal = qty * priceNum;
        total += subtotal;
        selected.push({
          id: item.id,
          name: `${item.name} (${qty} ${item.unit || 'units'})`,
          price: subtotal.toFixed(2),
          quantity: qty
        });
      }
    });
    return { estimatedTotal: total.toFixed(2), selectedItemsList: selected };
  }, [catalog, quantities]);

  const partnerDisplayName = partner?.name?.replace(' Laundry', '') || 'Sparkle Express';
  const displaySchedule = scheduledTime || 'Today (Immediate)';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc]">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-3 pb-28 flex flex-col gap-4">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pt-1">
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
            aria-label="Back to providers"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

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
              className="w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-sm shadow-brand-teal/20 hover:bg-brand-hover transition-colors cursor-pointer"
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

        {/* Section Heading */}
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-tight">
            Choose your laundry services
          </h2>
          <div className="w-9 h-9 rounded-xl border border-brand-teal/30 bg-brand-light flex items-center justify-center text-brand-teal flex-shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Dynamic Service Cards from Live Catalog */}
        <div className="flex flex-col gap-3.5 mt-1">
          {catalog.map((service) => {
            const qty = quantities[service.id] || 0;
            const isSelected = qty > 0;
            const isPerKg = service.unit?.toLowerCase().includes('kg');
            const unitLabel = isPerKg ? 'kg' : service.unit?.replace('per ', '') || 'item';

            return (
              <Card
                key={service.id}
                className={cn(
                  'rounded-2xl p-4 transition-all duration-200 border-2 bg-white',
                  isSelected ? 'border-brand-teal shadow-md ring-1 ring-brand-teal/10' : 'border-slate-200/90'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[16px] font-bold text-slate-900 leading-snug">{service.name}</h3>
                      {service.popular && (
                        <Badge variant="secondary" className="px-2 py-0.5 rounded-full bg-brand-light text-brand-teal text-[10px] font-bold uppercase tracking-wide border-0">
                          Popular
                        </Badge>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        • {service.turnaround}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="text-[13.5px] font-extrabold text-slate-900 mt-2">
                      GH₵ {parseFloat(service.price).toFixed(2)}{' '}
                      <span className="text-slate-500 font-normal text-xs">/ {unitLabel}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Stepper Controls */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {isPerKg ? 'Weight estimate' : 'Quantity'}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(service.id, -1)}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-slate-900 min-w-[55px] text-center">
                      {qty} {unitLabel}{qty !== 1 && !isPerKg ? 's' : ''}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(service.id, 1)}
                      className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-hover transition-colors shadow-sm cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Estimated Total Card */}
          <Card className="rounded-2xl p-4.5 flex items-center justify-between border-slate-200/90 shadow-sm mt-1 bg-white">
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-slate-800">Estimated total</span>
              <span className="text-[12px] font-medium text-slate-400 mt-0.5">Taxes &amp; delivery fees included</span>
            </div>
            <div className="text-[22px] font-extrabold text-brand-teal tracking-tight">
              GH₵ {estimatedTotal}
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto z-30">
        <Button
          onClick={() => onContinue(estimatedTotal, selectedItemsList)}
          disabled={parseFloat(estimatedTotal) <= 0}
          className={cn(
            'w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-btn transition-all cursor-pointer',
            parseFloat(estimatedTotal) > 0
              ? 'bg-brand-teal hover:bg-brand-hover text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          <ArrowRight className="w-4 h-4" />
          <span>Continue to Preferences</span>
        </Button>
      </div>
    </div>
  );
}
