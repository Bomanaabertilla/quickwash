import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FilterPillsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function FilterPills({ categories, activeCategory, onSelectCategory }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-0.5 min-h-[52px]">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all select-none shadow-sm cursor-pointer',
              isActive
                ? 'bg-brand-teal text-white shadow-brand-teal/30 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60'
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
