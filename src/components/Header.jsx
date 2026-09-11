import React from 'react';
import { HelpCircle, User } from 'lucide-react';

export default function Header({ onSupportClick, onProfileClick }) {
  return (
    <header className="flex items-center justify-between pt-1">
      {/* Brand Title Block */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-brand-teal rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-teal/20">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 3"></path>
            <path d="M8 12a4 4 0 0 1 8 0"></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[19px] font-extrabold text-slate-900 tracking-tight leading-none">QuickWash</h1>
          <span className="text-[13px] font-medium text-slate-500 mt-0.5">Providers</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={onSupportClick}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          aria-label="Help & Support"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-md shadow-brand-teal/20 hover:bg-brand-hover transition-colors"
          aria-label="User Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
