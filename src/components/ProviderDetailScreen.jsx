import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  User, 
  MapPin, 
  Star, 
  Clock, 
  Sunrise, 
  Sun, 
  Moon, 
  CalendarDays, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Check,
  WifiOff,
  RefreshCw,
  Truck,
  Leaf,
  Shield,
  Zap,
  AlertCircle
} from 'lucide-react';
import { getPublishedAvailability } from '../data/availabilityStore.js';
import { getShopProfile } from '../data/shopStore.js';

export default function ProviderDetailScreen({
  partner,
  onBack,
  onContinueToServices,
  onSupportClick,
  onProfileClick
}) {
  const [shopProfile, setShopProfile] = useState(() => getShopProfile());
  const [publishedSchedule, setPublishedSchedule] = useState(() => getPublishedAvailability());
  const [selectedDateId, setSelectedDateId] = useState('tue');
  const [selectedSlot, setSelectedSlot] = useState({
    time: '1:30 PM',
    date: 'Tue May 26',
    period: 'Afternoon'
  });
  const [isRetrying, setIsRetrying] = useState(false);

  // Listen for live published schedule and shop profile updates
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail) {
        setPublishedSchedule(e.detail);
      }
    };
    const handleShopSync = (e) => {
      if (e.detail) {
        setShopProfile(e.detail);
      }
    };
    window.addEventListener('quickwash:availability_updated', handleSync);
    window.addEventListener('quickwash:shop_updated', handleShopSync);
    return () => {
      window.removeEventListener('quickwash:availability_updated', handleSync);
      window.removeEventListener('quickwash:shop_updated', handleShopSync);
    };
  }, []);

  const handleRetryOffline = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setPublishedSchedule(getPublishedAvailability());
      setShopProfile(getShopProfile());
      setIsRetrying(false);
    }, 600);
  };

  // Selected Day Object from published schedule
  const activeDay = useMemo(() => {
    const found = publishedSchedule.days?.find(d => d.id === selectedDateId);
    return found || publishedSchedule.days?.[0] || null;
  }, [publishedSchedule, selectedDateId]);

  // Dynamic slots data based on the owner's published slots for the selected day
  const slotsData = useMemo(() => {
    if (!activeDay || activeDay.status === 'Closed' || !activeDay.slots || activeDay.slots.length === 0) {
      return [];
    }

    const morning = activeDay.slots.filter(s => s.period === 'Morning' || s.time.includes('AM'));
    const afternoon = activeDay.slots.filter(s => s.period === 'Afternoon' || (s.time.includes('PM') && !s.time.startsWith('5') && !s.time.startsWith('6') && !s.time.startsWith('7')));
    const evening = activeDay.slots.filter(s => s.period === 'Evening' || s.time.startsWith('4') || s.time.startsWith('5') || s.time.startsWith('6') || s.time.startsWith('7'));

    const sections = [];
    if (morning.length > 0) {
      sections.push({
        period: 'Morning',
        timeRange: '8:00 AM – 11:30 AM',
        icon: Sunrise,
        slots: morning
      });
    }
    if (afternoon.length > 0) {
      sections.push({
        period: 'Afternoon',
        timeRange: '12:00 PM – 3:30 PM',
        icon: Sun,
        slots: afternoon
      });
    }
    if (evening.length > 0) {
      sections.push({
        period: 'Evening',
        timeRange: '4:00 PM – 7:00 PM',
        icon: Moon,
        slots: evening
      });
    }

    // Fallback if no period matched
    if (sections.length === 0 && activeDay.slots.length > 0) {
      sections.push({
        period: 'Open Slots',
        timeRange: activeDay.hours || '8:00 AM – 6:30 PM',
        icon: Sun,
        slots: activeDay.slots
      });
    }

    return sections;
  }, [activeDay]);

  const handleSelectSlot = (slotTime, period) => {
    setSelectedSlot({
      time: slotTime,
      date: `${activeDay.name} ${activeDay.date}`,
      period: period
    });
  };

  const partnerName = partner?.id === 'sparkle' || !partner?.id ? shopProfile.name : (partner?.name || 'Sparkle Express Laundry');
  const partnerImage = partner?.image || '/assets/images/sparkle_express_laundry.jpg';
  const partnerAddress = partner?.id === 'sparkle' || !partner?.id ? `${shopProfile.neighborhood || 'Midtown'} • ${shopProfile.digitalAddress || '0.8 mi'}` : `${partner?.neighborhood || 'Midtown'} • ${partner?.distance || '0.8 mi'}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f7f9fc]">
      
      {/* Top Header */}
      <header className="px-5 pt-3.5 pb-3 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Back to providers"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#006a60] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#006a60]/20">
              <svg className="w-4.5 h-4.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 3"></path>
                <path d="M8 12a4 4 0 0 1 8 0"></path>
              </svg>
            </div>
            <h1 className="text-[17px] font-extrabold text-slate-900 tracking-tight">Provider Detail</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSupportClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Help & Support"
          >
            <svg className="w-5 h-5 text-slate-700 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
              <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </button>
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-[#006a60] text-white flex items-center justify-center shadow-sm shadow-[#006a60]/20"
            aria-label="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Stepper Bar: Step 2 of 6 */}
      <div className="px-5 pt-3.5 flex flex-col gap-2 bg-[#f7f9fc]">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 font-medium">Step 2 of 6</span>
          <span className="text-[#006a60] font-bold">Pickup & Drop-off</span>
        </div>
        <div className="w-full h-1.5 bg-[#e8edf5] rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#006a60] rounded-full transition-all duration-300" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-3 pb-24 flex flex-col gap-4">
        
        {/* Offline Alert Callout Banner (Exact match to screenshot) */}
        <div className="bg-[#fffbeb] border border-[#fce6a0] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <WifiOff className="w-4.5 h-4.5 text-amber-800 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col text-xs">
              <div className="font-extrabold text-amber-900">
                You're offline <span className="font-semibold text-slate-500">• Viewing cached schedule</span>
              </div>
              <p className="text-amber-800 text-[11px] font-medium mt-0.5 leading-relaxed">
                Last updated today at 11:42 AM. Availability may have changed.
              </p>
            </div>
          </div>

          <button
            onClick={handleRetryOffline}
            disabled={isRetrying}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 flex-shrink-0 transition-colors border border-amber-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Retry</span>
          </button>
        </div>

        {/* Provider Summary Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex gap-3.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img 
                src={partnerImage} 
                alt={partnerName} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[17px] font-extrabold text-slate-900 leading-tight truncate">
                    {partnerName}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-[#006a60] fill-[#006a60] flex-shrink-0" />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{partnerAddress}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 flex-wrap text-xs font-semibold">
                <span className="bg-blue-50 text-[#006a60] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#006a60] text-[#006a60]" />
                  4.9 <span className="text-slate-400 font-normal">(318)</span>
                </span>
                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Open 7:00 AM – 9:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* 3 Feature Pills Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div className="bg-blue-50/70 text-[#006a60] py-1.5 px-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#006a60]" />
              <span>Free courier</span>
            </div>
            <div className="bg-blue-50/70 text-[#006a60] py-1.5 px-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#006a60]" />
              <span>Eco detergent</span>
            </div>
            <div className="bg-blue-50/70 text-[#006a60] py-1.5 px-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#006a60]" />
              <span>Sanitized bag</span>
            </div>
          </div>
        </div>

        {/* 24-hour turnaround banner */}
        <div className="bg-[#f0f6ff] border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4.5 h-4.5 text-blue-600 fill-blue-600" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900">24-hour turnaround</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.2 rounded text-[10px] font-bold">Standard</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                Ready in 24 hours from pickup. Free bag tag...
              </span>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mt-1">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-tight">
            Select pickup window
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose when we should collect your laundry hamper
          </p>
        </div>

        {/* Horizontal Date Picker Grid (Synchronized with Owner's Published Week) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {publishedSchedule.days && publishedSchedule.days.map((d) => {
            const isSelected = selectedDateId === d.id;
            const isClosed = d.status === 'Closed';

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDateId(d.id)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006a60] text-white shadow-md shadow-[#006a60]/20 scale-[1.02]'
                    : isClosed
                    ? 'bg-slate-100/80 text-slate-400 border border-slate-200/50 hover:bg-slate-200/60'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase opacity-80">{d.name}</span>
                <span className="text-sm sm:text-base font-black leading-tight my-0.5">{d.dayNum}</span>
                <span className={`text-[9px] font-extrabold px-1 py-0.2 rounded-md ${
                  isSelected 
                    ? 'bg-teal-700 text-teal-100' 
                    : isClosed 
                    ? 'bg-slate-200 text-slate-500' 
                    : 'text-emerald-700 bg-emerald-50'
                }`}>
                  {isClosed ? 'Closed' : 'Open'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Closed Day Notice or Dynamic Time Slots */}
        {activeDay && activeDay.status === 'Closed' ? (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 my-2 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">
              No pickup slots on {activeDay.fullName}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              <strong>{partnerName}</strong> is closed on {activeDay.fullName}, {activeDay.date}. Please select an open weekday above (Monday – Saturday) to reserve your pickup.
            </p>
          </div>
        ) : slotsData.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 my-2">
            <AlertCircle className="w-6 h-6 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">No active slots published for this day</span>
          </div>
        ) : (
          /* Time Slots Sections */
          <div className="flex flex-col gap-4 mt-1">
            {slotsData.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.period} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SectionIcon className="w-4 h-4 text-[#006a60]" />
                      <span className="text-sm font-extrabold text-slate-900">{section.period}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{section.timeRange}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {section.slots.map((slot) => {
                      const isBooked = slot.status === 'Booked';
                      const isSelected = selectedSlot.time === slot.time && selectedSlot.date.includes(activeDay.name);

                      if (isBooked) {
                        return (
                          <div
                            key={slot.time}
                            className="bg-slate-100/70 border border-slate-200/80 rounded-2xl py-3 px-2 flex flex-col items-center justify-center select-none cursor-not-allowed opacity-80"
                          >
                            <span className="text-xs font-bold text-slate-400 line-through">
                              {slot.time}
                            </span>
                            <span className="text-[10.5px] font-semibold text-rose-500 mt-0.5">
                              Booked
                            </span>
                          </div>
                        );
                      }

                      if (isSelected) {
                        return (
                          <button
                            key={slot.time}
                            onClick={() => handleSelectSlot(slot.time, section.period)}
                            className="bg-[#006a60] text-white border-2 border-[#006a60] rounded-2xl py-3 px-2 flex flex-col items-center justify-center shadow-md shadow-[#006a60]/20 transition-all scale-[1.02] cursor-pointer"
                          >
                            <span className="text-xs font-extrabold leading-tight">
                              {slot.time}
                            </span>
                            <span className="text-[10.5px] font-bold text-teal-100 flex items-center gap-1 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Selected
                            </span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={slot.time}
                          onClick={() => handleSelectSlot(slot.time, section.period)}
                          className="bg-white border border-[#006a60]/40 hover:border-[#006a60] rounded-2xl py-3 px-2 flex flex-col items-center justify-center transition-all hover:bg-slate-50 shadow-xs cursor-pointer"
                        >
                          <span className="text-xs font-extrabold text-slate-900 leading-tight">
                            {slot.time}
                          </span>
                          <span className="text-[10.5px] font-semibold text-[#006a60] mt-0.5">
                            Available
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Reservation Banner */}
        <div className="bg-[#f0f6ff] rounded-2xl p-3.5 flex items-center justify-between border border-blue-100 shadow-xs mt-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#006a60] shadow-xs flex-shrink-0">
              <CalendarDays className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected reservation</span>
              <span className="text-[14.5px] font-extrabold text-slate-900">
                {selectedSlot.date} • {selectedSlot.time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="bg-amber-100 text-amber-900 text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3 text-amber-800" />
              Cached slot
            </span>
            <span className="bg-teal-100 text-[#006a60] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006a60]" />
              Guaranteed
            </span>
          </div>
        </div>

        {/* Valet Pickup Instructions Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Info className="w-4 h-4 text-[#006a60] flex-shrink-0" />
            <span>Valet pickup instructions</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            A vetted courier will message you 15 minutes before arrival. Leave your laundry bag with doorman or have it ready by the door.
          </p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="bg-white border-t border-slate-200/80 px-5 pt-3 pb-5 z-20 shadow-lg flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Standard clean</span>
          <span className="text-[15.5px] font-extrabold text-slate-900 leading-tight">
            From GH₵ 25.00/kg
          </span>
        </div>

        <button
          onClick={() => onContinueToServices(`${selectedSlot.date} (${selectedSlot.time})`)}
          className="bg-[#006a60] hover:bg-[#005850] text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md active:scale-[0.99] transition-all flex-shrink-0"
        >
          <span>Continue to services</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
