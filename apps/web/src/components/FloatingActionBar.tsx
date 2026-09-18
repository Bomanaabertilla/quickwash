import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FloatingActionBarProps {
  selectedPartnerName: string;
  onContinue: () => void;
}

export default function FloatingActionBar({ selectedPartnerName, onContinue }: FloatingActionBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 backdrop-glass border-t border-slate-200/80 px-5 pt-3.5 pb-20 z-20 shadow-lg flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-slate-500 font-medium">Selected partner:</span>
        <span className="text-brand-teal font-bold truncate max-w-[200px]">{selectedPartnerName}</span>
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full h-13 py-3.5 bg-brand-teal hover:bg-brand-hover text-white rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2.5 shadow-btn active:scale-[0.99] transition-all cursor-pointer"
      >
        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        <span>Continue to schedule</span>
      </Button>
    </div>
  );
}
