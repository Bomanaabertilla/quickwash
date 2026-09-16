import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Tag, 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Bell, 
  Plus, 
  LogOut, 
  HelpCircle, 
  ChevronDown,
  User,
  CheckCircle2,
  X
} from 'lucide-react';
import OwnerWeeklyAvailabilityScreen from './OwnerWeeklyAvailabilityScreen.jsx';
import OwnerBookingsScheduleScreen from './OwnerBookingsScheduleScreen.jsx';
import OwnerProfileSetupScreen from './OwnerProfileSetupScreen.jsx';
import OwnerServicesPricingScreen from './OwnerServicesPricingScreen.jsx';
import OwnerShopProfileScreen from './OwnerShopProfileScreen.jsx';

export default function OwnerDashboardScreen({
  onBackToApp,
  onLogout,
  onOpenProfile
}) {
  // Navigation state: 'weekly-availability' (matches screenshot) | 'bookings' | 'profile' | 'services' | 'analytics' | 'settings'
  const [activeNav, setActiveNav] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab')) return params.get('tab');
    }
    return 'weekly-availability';
  });
  const [storeStatus, setStoreStatus] = useState('open');
  const [toastMsg, setToastMsg] = useState(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInService, setWalkInService] = useState('Wash & fold');
  const [walkInAmount, setWalkInAmount] = useState('120.00');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      showToast('Please enter customer name');
      return;
    }
    showToast(`Created walk-in wash ticket for ${walkInName}`);
    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#FAF9F5] text-slate-800 font-sans">
      
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl z-[100] flex items-center gap-2.5 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Left Sidebar (Matching Screenshot light theme) */}
      <aside className="w-full md:w-64 bg-[#f0f3f8] text-slate-700 flex flex-col justify-between flex-shrink-0 border-r border-slate-200/90 z-20">
        
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          
          {/* Logo & Hub Header */}
          <div className="flex items-center gap-3">
            {/* img placeholder box */}
            <div className="w-16 h-8 rounded bg-[#c5ccd6] text-slate-700 text-xs font-bold flex items-center justify-center shadow-2xs">
              img
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">QuickWash</span>
                <span className="border border-slate-300 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </div>
              <p className="text-xs text-[#008276] font-bold">Owner Hub</p>
            </div>
          </div>

          {/* Store Selector Dropdown Card */}
          <div 
            onClick={() => showToast('Sparkle Express Laundry (Accra Central Flagship)')}
            className="bg-[#e5ebf4] hover:bg-[#dce3ee] border border-slate-200/60 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-800">Sparkle Express ...</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium pl-3.5 mt-0.5">
                Accra Central • Open
              </span>
            </div>
          </div>

          {/* Sidebar Operations Navigation */}
          <nav className="mt-2 flex flex-col gap-1.5">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">
              OPERATIONS
            </span>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'bookings'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Bookings & Schedule</span>
              <Calendar className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => setActiveNav('weekly-availability')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'weekly-availability'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Weekly Availability</span>
              <Clock className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => setActiveNav('services')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'services'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Services & Pricing</span>
              <Tag className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => setActiveNav('profile')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'profile'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Shop Profile</span>
              <Store className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'analytics'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Analytics</span>
              <BarChart3 className="w-4 h-4 ml-2" />
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'settings'
                  ? 'bg-[#008276] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <span>Settings</span>
              <Settings className="w-4 h-4 ml-2" />
            </button>
          </nav>

        </div>

        {/* Footer: Operator & Status */}
        <div className="p-3.5 border-t border-slate-200/80 bg-[#e8edf5] flex flex-col gap-2">
          
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Accepting Orders</span>
            </div>

            <button
              onClick={() => showToast('QuickWash Partner Help Desk online')}
              className="text-slate-500 hover:text-slate-800 text-[11px] font-medium"
            >
              Help Center
            </button>
          </div>

          <div className="bg-white rounded-2xl p-2.5 flex items-center justify-between border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#005a52] text-white flex items-center justify-center font-extrabold text-xs">
                KA
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-slate-800">Kwame Asante</span>
                <span className="text-[10.5px] text-slate-400">Store Operator</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Main Operations Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Bar (Matching Screenshot) */}
        <header className="px-4 sm:px-8 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between z-10 gap-3 shadow-2xs">
          
          {/* Left Metrics & Date */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl">
              Live Desk
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Thursday, 24 Oct
            </span>

            {/* Metrics Pills */}
            <div className="flex items-center gap-2">
              <span className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl">
                14 Active Today
              </span>

              <span className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl">
                3 In Progress
              </span>

              <span className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3 py-1.5 rounded-xl">
                GH₵ 4,280 Revenue
              </span>
            </div>
          </div>

          {/* Right Top Bar Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Synced latest marketplace orders')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Sync Schedule"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => showToast('No new urgent dispatch notifications')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <button
              onClick={() => setIsWalkInModalOpen(true)}
              className="bg-[#008276] hover:bg-[#007065] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ New Walk-in</span>
            </button>

            <div
              onClick={() => setActiveNav('profile')}
              className="w-8 h-8 rounded-full bg-[#005a52] text-white flex items-center justify-center cursor-pointer shadow-xs"
              title="Store Owner Profile"
            >
              <User className="w-4 h-4" />
            </div>
          </div>

        </header>

        {/* View Switcher based on activeNav */}
        {activeNav === 'profile' && (
          <OwnerShopProfileScreen
            onBackToDashboard={() => setActiveNav('bookings')}
            onBackToApp={onBackToApp}
            onShowToast={showToast}
          />
        )}

        {activeNav === 'services' && (
          <OwnerServicesPricingScreen onShowToast={showToast} />
        )}

        {activeNav === 'bookings' && (
          <OwnerBookingsScheduleScreen onShowToast={showToast} />
        )}

        {activeNav === 'weekly-availability' && (
          <OwnerWeeklyAvailabilityScreen onShowToast={showToast} />
        )}

        {(activeNav === 'analytics' || activeNav === 'settings') && (
          <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#006a60] flex items-center justify-center mb-3">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 capitalize">{activeNav} Module</h2>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Real-time store operations intelligence & configuration rules synced with your QuickWash Partner Account.
            </p>
            <button
              onClick={() => setActiveNav('profile')}
              className="mt-4 bg-[#006a60] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Return to Business Profile
            </button>
          </div>
        )}

      </div>

      {/* Walk-in modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">New Walk-in Order</h3>
              <button
                onClick={() => setIsWalkInModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="flex flex-col gap-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaw Mensah"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006a60]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+233 24 123 4567"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006a60]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#006a60] text-white font-bold"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
