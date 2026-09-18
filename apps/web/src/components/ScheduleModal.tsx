import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPublishedAvailability } from '../data/availabilityStore';
import { getTodayDayId } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WeeklySchedule, DaySchedule } from '@quickwash/shared';

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName?: string;
  onConfirm: (dayStr: string, timeStr: string) => void;
}

export default function ScheduleModal({ isOpen, onClose, partnerName, onConfirm }: ScheduleModalProps) {
  const [availability, setAvailability] = useState<WeeklySchedule>(getPublishedAvailability());
  const [selectedDayId, setSelectedDayId] = useState<string>(() => getTodayDayId() || 'mon');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setAvailability(e.detail);
      } else {
        setAvailability(getPublishedAvailability());
      }
    };
    window.addEventListener('quickwash:availability_updated', handleUpdate);
    return () => window.removeEventListener('quickwash:availability_updated', handleUpdate);
  }, []);

  const activeDay: DaySchedule | undefined = availability.days?.find(d => d.id === selectedDayId) || availability.days?.[0];

  useEffect(() => {
    if (activeDay && activeDay.status !== 'Closed' && activeDay.slots && activeDay.slots.length > 0) {
      setSelectedTime(activeDay.slots[0].time);
    } else {
      setSelectedTime('');
    }
  }, [selectedDayId, activeDay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center transition-opacity">
      <div className="w-full max-w-[480px] bg-white rounded-t-3xl p-6 flex flex-col gap-5 modal-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Schedule Pickup</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Live Storefront Schedule
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Showing real-time published pickup windows for <strong className="text-brand-teal">{partnerName || 'Sparkle Express Laundry'}</strong> ({availability.weekRange})
        </p>

        {/* Date Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-teal" />
            SELECT PICKUP DAY
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {availability.days?.map((d) => {
              const isSelected = selectedDayId === String(d.id);
              const isClosed = d.status === 'Closed';
              return (
                <button
                  key={String(d.id)}
                  onClick={() => setSelectedDayId(String(d.id))}
                  className={cn(
                    'flex-shrink-0 min-w-[72px] py-2.5 px-2 rounded-xl text-center border transition-all relative cursor-pointer',
                    isSelected
                      ? 'border-brand-teal bg-brand-light text-brand-teal font-bold ring-2 ring-brand-teal/20 shadow-sm'
                      : isClosed
                      ? 'border-slate-200 bg-slate-50 text-slate-400'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <div className="text-xs font-bold">{d.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{d.date}</div>
                  <div className={cn(
                    'text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded-md inline-block',
                    isClosed ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  )}>
                    {isClosed ? 'Closed' : 'Open'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Window Selection or Closed Notice */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-teal" />
            PICKUP TIME WINDOW ({activeDay?.fullName || 'Selected Day'})
          </span>

          {activeDay?.status === 'Closed' ? (
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Closed on {activeDay?.fullName || 'Selected Day'}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  The laundromat is closed on this day. Please select another day from the list above.
                </p>
              </div>
            </div>
          ) : !activeDay?.slots || activeDay.slots.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No pickup slots available for this day.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {activeDay.slots.map((slot, idx) => {
                const isChosen = selectedTime === slot.time;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(slot.time)}
                    className={cn(
                      'py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center cursor-pointer',
                      isChosen
                        ? 'border-brand-teal bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    )}
                  >
                    <span>{slot.time}</span>
                    <span className={cn('text-[10px] font-normal', isChosen ? 'text-teal-100' : 'text-slate-400')}>
                      {slot.period}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            if (activeDay?.status === 'Closed' || !selectedTime) return;
            onConfirm(`${activeDay?.name || ''}, ${activeDay?.date || ''}`, selectedTime);
          }}
          disabled={activeDay?.status === 'Closed' || !selectedTime}
          className={cn(
            'w-full h-12 rounded-xl font-bold text-sm mt-2 flex items-center justify-center gap-2 shadow-btn transition-all cursor-pointer',
            activeDay?.status === 'Closed' || !selectedTime
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-brand-teal hover:bg-brand-hover text-white'
          )}
        >
          <CheckCircle2 className="w-5 h-5" />
          {activeDay?.status === 'Closed' ? 'Select An Open Day' : 'Confirm Pickup & Continue'}
        </Button>
      </div>
    </div>
  );
}
