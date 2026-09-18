import React from 'react';
import { Shirt, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-200 flex items-center justify-around z-30 pb-1">
      {/* Laundry Tab */}
      <button
        onClick={() => onTabChange('laundry')}
        className={cn(
          'flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
          activeTab === 'laundry' ? 'text-brand-teal' : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <svg
          className={cn('w-5 h-5', activeTab === 'laundry' ? 'text-brand-teal stroke-[2.3]' : 'text-slate-500')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="3" ry="3"></rect>
          <circle cx="12" cy="14" r="5"></circle>
          <circle cx="12" cy="14" r="2"></circle>
          <line x1="8" y1="6" x2="8.01" y2="6"></line>
          <line x1="12" y1="6" x2="12.01" y2="6"></line>
        </svg>
        <span>Laundry</span>
      </button>

      {/* Orders Tab */}
      <button
        onClick={() => onTabChange('orders')}
        className={cn(
          'flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
          activeTab === 'orders' ? 'text-brand-teal' : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <FileText className={cn('w-5 h-5', activeTab === 'orders' ? 'text-brand-teal stroke-[2.3]' : 'text-slate-500')} />
        <span>Orders</span>
      </button>

      {/* Pricing Tab */}
      <button
        onClick={() => onTabChange('pricing')}
        className={cn(
          'flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
          activeTab === 'pricing' ? 'text-brand-teal' : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <Shirt className={cn('w-5 h-5', activeTab === 'pricing' ? 'text-brand-teal stroke-[2.3]' : 'text-slate-500')} />
        <span>Pricing</span>
      </button>
    </nav>
  );
}
