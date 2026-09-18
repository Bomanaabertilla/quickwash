import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
      <Input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search laundry partners..."
        className="w-full h-12 bg-white border-slate-200 rounded-2xl pl-11 pr-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none shadow-sm focus-visible:ring-brand-teal transition-all"
      />
    </div>
  );
}
