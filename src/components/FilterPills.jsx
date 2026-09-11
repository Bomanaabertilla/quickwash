import React from 'react';

export default function FilterPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-0.5 min-h-[52px]">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all select-none shadow-sm ${
              isActive
                ? 'bg-brand-teal text-white shadow-brand-teal/30 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/60'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
