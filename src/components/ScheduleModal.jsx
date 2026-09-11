import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, partnerName, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('2:00 PM - 4:00 PM');

  if (!isOpen) return null;

  const dates = [
    { label: 'Today', date: 'Sep 11' },
    { label: 'Tomorrow', date: 'Sep 12' },
    { label: 'Sat', date: 'Sep 13' },
    { label: 'Sun', date: 'Sep 14' }
  ];

  const timeSlots = [
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 AM - 10:00 AM'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center transition-opacity">
      <div className="w-full max-w-[480px] bg-white rounded-t-3xl p-6 flex flex-col gap-5 modal-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">Schedule Pickup</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Select preferred pickup window for <strong className="text-brand-teal">{partnerName}</strong>
        </p>

        {/* Date Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-teal" />
            PICKUP DATE
          </span>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {dates.map((d) => (
              <button
                key={d.label}
                onClick={() => setSelectedDate(d.label)}
                className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl text-center border transition-all ${
                  selectedDate === d.label
                    ? 'border-brand-teal bg-brand-light text-brand-teal font-bold ring-2 ring-brand-teal/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-semibold">{d.label}</div>
                <div className="text-xs text-slate-400 font-normal mt-0.5">{d.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Window Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-teal" />
            PICKUP TIME WINDOW
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedTime === slot
                    ? 'border-brand-teal bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onConfirm(selectedDate, selectedTime)}
          className="w-full h-12 bg-brand-teal hover:bg-brand-hover text-white rounded-xl font-bold text-sm mt-2 flex items-center justify-center gap-2 shadow-btn transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Confirm Pickup & Continue
        </button>
      </div>
    </div>
  );
}
