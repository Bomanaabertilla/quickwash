import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  Star, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Printer, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Shirt,
  User,
  ChevronDown,
  Calendar,
  Layers,
  Settings,
  Plus,
  RefreshCw,
  Bell,
  HelpCircle,
  BarChart3,
  Tag
} from 'lucide-react';
import OwnerWeeklyAvailabilityScreen from './OwnerWeeklyAvailabilityScreen.jsx';

export default function OwnerDashboardScreen({
  onBackToApp,
  onLogout,
  onOpenProfile
}) {
  const [storeStatus, setStoreStatus] = useState('online');
  const [activeNav, setActiveNav] = useState('weekly-availability'); // 'bookings' | 'weekly-availability' | 'services' | 'profile' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };
  
  // Active Orders State
  const [orders, setOrders] = useState([
    {
      id: 'QW-89420',
      customerName: 'Alex Morgan',
      phone: '+233 24 123 4567',
      serviceSummary: '10kg Wash & Fold + 2 Dry Clean',
      amount: '390.00',
      paymentMethod: 'MTN MoMo',
      schedule: 'Today, 1:30 PM',
      address: 'Apartment 4B, 24 Ocean View Road',
      assignedRider: 'Kofi Ansah #412',
      status: 'Valet En Route',
      statusColor: 'bg-[#006a60] text-white'
    },
    {
      id: 'QW-89421',
      customerName: 'Sarah Jenkins',
      phone: '+233 20 888 9900',
      serviceSummary: '5kg Wash & Fold + 1 Steam Iron',
      amount: '175.00',
      paymentMethod: 'Telecel Cash',
      schedule: 'Today, 2:45 PM',
      address: 'House 12, Cantonments',
      assignedRider: 'Kwame Mensah #418',
      status: 'In Wash & Dry',
      statusColor: 'bg-amber-500 text-white'
    },
    {
      id: 'QW-89422',
      customerName: 'David Mensah',
      phone: '+233 27 555 4433',
      serviceSummary: '4 Suits Dry Cleaning & Press',
      amount: '140.00',
      paymentMethod: 'AT Money',
      schedule: 'Today, 4:15 PM',
      address: 'Suite 302, Airport Residential',
      assignedRider: 'Kofi Ansah #412',
      status: 'Ready for Delivery',
      statusColor: 'bg-emerald-600 text-white'
    }
  ]);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let color = 'bg-slate-700 text-white';
        if (newStatus === 'In Wash & Dry') color = 'bg-amber-500 text-white';
        if (newStatus === 'Ready for Delivery') color = 'bg-emerald-600 text-white';
        if (newStatus === 'Delivered & Completed') color = 'bg-[#006a60] text-white';
        return { ...o, status: newStatus, statusColor: color };
      }
      return o;
    }));
    showToast(`Updated Order #${orderId} status to: ${newStatus}`);
  };

  const handlePrintTag = (orderId) => {
    showToast(`Printing official QuickWash barcode tag for Order #${orderId}...`);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-[#f7f9fc] overflow-hidden">
      
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl z-[100] flex items-center gap-2 border border-teal-400/30 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Left Sidebar (Desktop/Tablet) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 border-r border-slate-800 z-20">
        
        <div className="p-4 flex flex-col gap-4">
          
          {/* Logo & Hub Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#006a60] flex items-center justify-center text-white shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">QuickWash</span>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-teal-500/30">
                  Pro
                </span>
              </div>
            </div>

            <button
              onClick={onBackToApp}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Switch to Customer App"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Store Selector Dropdown Card */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors">
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-white">Sparkle Express Laundry</span>
              <span className="text-[10.5px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Accra Central • Open
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {/* Sidebar Operations Navigation */}
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              OPERATIONS
            </span>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'bookings'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Bookings & Schedule</span>
              </div>
              <span className="bg-white/10 px-1.5 py-0.2 rounded text-[10px]">3</span>
            </button>

            <button
              onClick={() => setActiveNav('weekly-availability')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'weekly-availability'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Weekly Availability</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            <button
              onClick={() => {
                setActiveNav('services');
                onOpenProfile();
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'services'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Services & Pricing</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveNav('profile');
                onOpenProfile();
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'profile'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4" />
                <span>Shop Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'analytics'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'settings'
                  ? 'bg-[#006a60] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>
          </div>

        </div>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
          
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Accepting Orders</span>
            </div>

            <button
              onClick={() => showToast('QuickWash Owner Support Center online')}
              className="text-slate-400 hover:text-white text-[11px] font-medium underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Help Center</span>
            </button>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-2.5 flex items-center justify-between border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#006a60] text-white flex items-center justify-center font-extrabold text-xs">
                KA
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-white">Kwame Asante</span>
                <span className="text-[10.5px] text-slate-400">Store Operator</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between z-10 gap-3 shadow-2xs">
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold px-2.5 py-1 rounded-xl">
              Live Desk
            </span>

            <span className="text-xs font-bold text-slate-600">
              Thursday, 24 Oct
            </span>

            {/* Metrics Pills */}
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-700 text-[11.5px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                14 Active Today
              </span>

              <span className="bg-amber-50 text-amber-700 text-[11.5px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                3 In Progress
              </span>

              <span className="bg-sky-50 text-sky-800 text-[11.5px] font-extrabold px-2.5 py-1 rounded-full border border-sky-200">
                GHS 4,250 Revenue
              </span>
            </div>
          </div>

          {/* Right Top Bar Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Refreshed real-time schedule sync')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Sync Live Schedule"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => showToast('No new urgent dispatch notifications')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            <button
              onClick={() => showToast('Opened + New Walk-in Order Modal')}
              className="bg-[#006a60] hover:bg-[#005850] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs border border-teal-400/30"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ New Walk-in</span>
            </button>

            <div
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-[#006a60] text-white font-extrabold text-xs flex items-center justify-center cursor-pointer border border-teal-300/40 shadow-xs"
              title="Store Owner Profile"
            >
              KA
            </div>
          </div>

        </header>

        {/* View Switcher based on activeNav */}
        {activeNav === 'weekly-availability' && (
          <OwnerWeeklyAvailabilityScreen onShowToast={showToast} />
        )}

        {activeNav === 'bookings' && (
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-16">
            
            {/* Metrics Grid (4 Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Card 1: Today's Revenue */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today's Revenue</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    GH₵
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">GH₵ 2,450.00</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.2% vs yesterday</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Active Orders Queue */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Queue</span>
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#006a60] flex items-center justify-center font-bold text-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">18 Hampers</span>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    4 pickup • 8 wash • 6 delivery
                  </div>
                </div>
              </div>

              {/* Card 3: Couriers Active */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Couriers Active</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">4 Riders</span>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Kofi, Kwame, Yaw, Nana
                  </div>
                </div>
              </div>

              {/* Card 4: Store Rating */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Store Rating</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">4.9 / 5.0</span>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Based on 318 reviews
                  </div>
                </div>
              </div>

            </div>

            {/* Live Orders Management Board */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
              
              {/* Board Header & Search */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">Live Customer Orders</h2>
                  <span className="bg-[#006a60] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {orders.length}
                  </span>
                </div>

                {/* Search Input */}
                <div className="bg-[#f4f7fa] px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs border border-slate-200/60 w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search order ID..."
                    className="w-full bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Orders Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'pickup', 'washing', 'delivery'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10.5px] tracking-wider transition-all flex-shrink-0 ${
                      activeTab === tab 
                        ? 'bg-[#006a60] text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'all' ? 'All Orders' : tab}
                  </button>
                ))}
              </div>

              {/* Orders Cards List */}
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-2.5 hover:border-[#006a60]/50 transition-all shadow-2xs"
                  >
                    {/* Top order row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          #{order.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">• {order.customerName}</span>
                      </div>

                      {/* Status Badge & Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Service summary & phone */}
                    <div className="text-xs text-slate-600 font-medium leading-relaxed">
                      <p className="font-bold text-slate-900">{order.serviceSummary}</p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">
                        📍 {order.address} • 📞 {order.phone}
                      </p>
                    </div>

                    {/* Rider & Payment Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#006a60]" />
                        {order.assignedRider}
                      </span>

                      <span className="font-extrabold text-[#006a60] text-sm">
                        GH₵ {order.amount} <span className="text-[10px] text-slate-400 font-normal">({order.paymentMethod})</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 flex-wrap">
                      {/* Status Change Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-white border border-slate-300 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl focus:outline-none focus:border-[#006a60]"
                      >
                        <option value="Valet En Route">Status: Valet En Route</option>
                        <option value="In Wash & Dry">Status: In Wash & Dry</option>
                        <option value="Ready for Delivery">Status: Ready for Delivery</option>
                        <option value="Delivered & Completed">Status: Delivered & Completed</option>
                      </select>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePrintTag(order.id)}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Print Barcode Tag"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Tag</span>
                        </button>

                        <button
                          onClick={() => showToast(`Calling customer ${order.customerName} (${order.phone})...`)}
                          className="bg-[#006a60] hover:bg-[#005850] text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
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
              onClick={() => setActiveNav('weekly-availability')}
              className="mt-4 bg-[#006a60] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Return to Weekly Availability Matrix
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
