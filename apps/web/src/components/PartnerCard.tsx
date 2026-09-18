import React from 'react';
import { Star, Zap, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Partner } from '@quickwash/shared';

export interface PartnerCardProps {
  partner: Partner;
  isSelected: boolean;
  onSelect: (partner: Partner) => void;
}

export default function PartnerCard({ partner, isSelected, onSelect }: PartnerCardProps) {
  return (
    <Card
      onClick={() => onSelect(partner)}
      className={cn(
        'relative p-4 flex gap-4 transition-all duration-200 cursor-pointer overflow-hidden group shadow-sm hover:shadow-md',
        isSelected
          ? 'border-brand-teal/30 shadow-md ring-1 ring-brand-teal/20'
          : 'border-slate-200/80 hover:border-slate-300'
      )}
    >
      {/* Selected Accent Bar on Left */}
      <div 
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5 bg-brand-teal transition-opacity duration-200',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Select Checkmark Badge Top Right */}
      <div 
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all',
          isSelected ? 'bg-brand-teal text-white shadow-sm scale-105' : 'bg-slate-100 text-transparent'
        )}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>

      {/* Thumbnail Image */}
      <div className="w-[88px] h-[88px] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
        <img 
          src={partner.image} 
          alt={partner.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-between pr-6 min-w-0">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900 leading-tight truncate">{partner.name}</h3>
          
          <div className="flex items-center gap-1.5 text-[13.5px] mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-brand-teal font-bold">
              <Star className="w-3.5 h-3.5 fill-brand-teal text-brand-teal" />
              {partner.rating}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{partner.distance}</span>
            <span className="text-slate-300">•</span>
            <span className="text-brand-teal font-semibold">{partner.neighborhood}</span>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-1">
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
            <Zap className="w-4 h-4 fill-brand-teal text-brand-teal flex-shrink-0" />
            <span>{partner.deliveryTime}</span>
          </div>

          <div className="text-[12px] text-slate-500 text-right">
            From <span className="text-[15px] font-extrabold text-slate-900">{partner.currency} {partner.pricePerKg}</span><span className="text-slate-400 font-normal">/kg</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
