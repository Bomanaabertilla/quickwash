import React from 'react';
import { Navigation, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface PickupLocationProps {
  address: string;
  onChangeAddress: () => void;
}

export default function PickupLocation({ address, onChangeAddress }: PickupLocationProps) {
  return (
    <Card 
      onClick={onChangeAddress}
      className="p-4 flex items-center justify-between border-slate-200/80 hover:border-brand-teal hover:shadow-md transition-all cursor-pointer group"
      title="Click to change location"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-brand-teal flex-shrink-0 group-hover:scale-105 transition-transform">
          <Navigation className="w-5 h-5 fill-brand-teal/10" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">PICKUP LOCATION</span>
          {address && address.trim() ? (
            <span className="text-[16px] font-extrabold text-slate-900 leading-snug">{address}</span>
          ) : (
            <span className="text-[15px] font-medium text-slate-400 italic">Select pickup address...</span>
          )}
        </div>
      </div>

      <button 
        className="p-2 text-brand-teal rounded-lg hover:bg-brand-light transition-colors cursor-pointer"
        aria-label="Location filter options"
        onClick={(e) => {
          e.stopPropagation();
          onChangeAddress();
        }}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </Card>
  );
}
