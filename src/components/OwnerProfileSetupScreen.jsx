import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Bell, 
  User, 
  Eye, 
  Save, 
  LogOut, 
  Calendar, 
  TrendingUp, 
  Check, 
  Building, 
  CreditCard,
  Sliders,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronRight,
  Shirt
} from 'lucide-react';

export default function OwnerProfileSetupScreen({
  onBackToDashboard,
  onBackToApp,
  onLogout,
  onSupportClick
}) {
  const [activeNav, setActiveNav] = useState('Shop Profile');
  const [isUnsaved, setIsUnsaved] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Shop Profile State
  const [shopName, setShopName] = useState('Sparkle Express Laundry');
  const [branchDescriptor, setBranchDescriptor] = useState('Ring Road Central Flagship');
  const [physicalAddress, setPhysicalAddress] = useState('Plot 14B, Upper West Side / Ring Road Central, Accra (Near Kwame Nkrumah Circle)');
  const [primaryPhone, setPrimaryPhone] = useState('+233 24 123 4567');
  const [opsEmail, setOpsEmail] = useState('accra@sparkleexpress.com');
  const [whatsapp, setWhatsapp] = useState('+233 55 987 6543');

  // Operating Hours State
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('20:30');
  const [turnaroundGuarantee, setTurnaroundGuarantee] = useState('24 hours');

  // Services Rates State
  const [services, setServices] = useState([
    {
      id: 'wash_fold',
      title: 'Wash & fold',
      desc: 'Everyday garments, tumbled dry & folded',
      enabled: true,
      rate: '37.00',
      unit: 'kg',
      minOrder: '3'
    },
    {
      id: 'dry_cleaning',
      title: 'Dry cleaning',
      desc: 'Solvent gentle cycle with pressing',
      enabled: true,
      rate: '90.00',
      unit: 'item avg',
      tags: ['Suits', 'Dresses', 'Coats']
    },
    {
      id: 'iron_only',
      title: 'Iron only',
      desc: 'Steam press without laundering',
      enabled: true,
      rate: '25.00',
      unit: 'item'
    },
    {
      id: 'duvet_clean',
      title: 'Duvet & bulky clean',
      desc: 'Comforters, heavy blankets & beddings',
      enabled: true,
      rate: '120.00',
      unit: 'piece'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleService = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setIsUnsaved(true);
  };

  const handleRateChange = (id, newRate) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, rate: newRate } : s));
    setIsUnsaved(true);
  };

  const handleSaveAll = () => {
    setIsUnsaved(false);
    showToast('Business profile & pricing saved successfully!');
  };

  return (
    <div className="flex-1 flex h-full bg-[#f4f7fa] overflow-hidden text-slate-900 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl z-[100] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Operations Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0 z-20">
        <div className="flex flex-col gap-5">
          
          {/* Header Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#006a60] rounded-xl flex items-center justify-center text-white shadow-xs">
                <svg className="w-4.5 h-4.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                  <path d="M8 12a4 4 0 0 1 8 0"></path>
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight">QuickWash</span>
                <span className="text-[11px] font-bold text-slate-400">Owner Hub</span>
              </div>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Pro
            </span>
          </div>

          {/* Store Selector Box */}
          <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-extrabold text-slate-900">Sparkle Express Laundry</span>
                <span className="text-[10px] text-slate-500">Accra Central • Open</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Operations Menu List */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-1">
              OPERATIONS
            </span>

            {[
              { label: 'Bookings & Schedule', icon: Calendar },
              { label: 'Weekly Availability', icon: Clock },
              { label: 'Services & Pricing', icon: Sliders },
              { label: 'Shop Profile', icon: Store, active: true },
              { label: 'Analytics', icon: TrendingUp },
              { label: 'Settings', icon: ShieldCheck }
            ].map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.label !== 'Shop Profile') onBackToDashboard();
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                    isActive 
                      ? 'bg-[#006a60] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer Operator Profile */}
        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Accepting Orders</span>
            </div>
            <button onClick={onSupportClick} className="text-slate-500 hover:underline">Help</button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#006a60] text-white font-bold flex items-center justify-center text-xs">
                KA
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-extrabold text-slate-900">Kwame Asante</span>
                <span className="text-[10px] text-slate-400">Store Operator</span>
              </div>
            </div>

            <button onClick={onLogout} title="Log Out" className="text-slate-400 hover:text-rose-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
        
        {/* Top Bar Header (Live Desk Bar) */}
        <header className="px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Operations &gt; Shop configuration &gt;</span>
            <span className="text-xs font-bold text-slate-900">Business profile & pricing</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Metrics Bar */}
            <div className="bg-[#f4f7fa] px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs font-bold text-slate-700 flex items-center gap-3">
              <span>Live Desk Thursday, 24 Oct</span>
              <span className="bg-teal-100 text-[#006a60] px-2 py-0.5 rounded">14 Active Today</span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">3 In Progress</span>
              <span className="text-[#006a60] font-extrabold">GH₵ 4,280 Revenue</span>
            </div>

            {/* Sync & Catalog buttons */}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems synced
            </span>

            <button
              onClick={onBackToApp}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View public catalog</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="bg-[#006a60] hover:bg-[#005850] text-white px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Walk-in</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="p-6 flex-1 flex flex-col gap-6 pb-28">
          
          {/* Title Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Business profile setup
              </h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                LIVE ON MARKETPLACE
              </span>
            </div>
          </div>

          {/* 2-Column Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column (7 cols): Identity, Location & Operating Hours */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              
              {/* Card 1: Shop identity & physical location */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#006a60]" />
                    <h2 className="text-base font-extrabold text-slate-900">Shop identity & physical location</h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    SHOP-ID: ACC-SPK-684
                  </span>
                </div>

                {/* Shop Legal Name & Branch Descriptor */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-800">Shop legal name</label>
                    <div className="bg-[#f4f7fa] px-3.5 py-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between">
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => { setShopName(e.target.value); setIsUnsaved(true); }}
                        className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                      />
                      <CheckCircle2 className="w-4 h-4 text-[#006a60] fill-[#006a60]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-800">Branch descriptor</label>
                    <div className="bg-[#f4f7fa] px-3.5 py-2.5 rounded-xl border border-slate-200/60">
                      <input
                        type="text"
                        value={branchDescriptor}
                        onChange={(e) => { setBranchDescriptor(e.target.value); setIsUnsaved(true); }}
                        className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Physical address & delivery pickup point</label>
                  <div className="bg-[#f4f7fa] px-3.5 py-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={physicalAddress}
                      onChange={(e) => { setPhysicalAddress(e.target.value); setIsUnsaved(true); }}
                      className="w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Geo-Fenced Map Preview Card */}
                <div className="relative rounded-2xl h-24 overflow-hidden bg-gradient-to-r from-slate-700 to-slate-900 text-white p-3 flex items-end justify-between shadow-inner">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/assets/images/sparkle_express_laundry.jpg')" }}></div>
                  <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-teal-200">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span>Accra Central dispatch radius: 8.5 km geo-fenced</span>
                  </div>
                  <button onClick={() => showToast('Geo-fence pin updated!')} className="relative z-10 bg-[#006a60] hover:bg-[#005850] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors">
                    Adjust pin
                  </button>
                </div>

                {/* Contact Channels Grid */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-[#f4f7fa] p-2.5 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Primary phone
                    </span>
                    <input
                      type="text"
                      value={primaryPhone}
                      onChange={(e) => { setPrimaryPhone(e.target.value); setIsUnsaved(true); }}
                      className="text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#f4f7fa] p-2.5 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Operations email
                    </span>
                    <input
                      type="text"
                      value={opsEmail}
                      onChange={(e) => { setOpsEmail(e.target.value); setIsUnsaved(true); }}
                      className="text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none truncate"
                    />
                  </div>

                  <div className="bg-[#f4f7fa] p-2.5 rounded-xl border border-slate-200/60 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> WhatsApp support
                    </span>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => { setWhatsapp(e.target.value); setIsUnsaved(true); }}
                      className="text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Card 2: Hours & turnaround promise */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#006a60]" />
                    <h2 className="text-base font-extrabold text-slate-900">Hours & turnaround promise</h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    GMT (UTC+0)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Operating Window */}
                  <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Standard operating window</span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.2 rounded font-extrabold">Open 7 days</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Opening time</span>
                        <input
                          type="text"
                          value={openTime}
                          onChange={(e) => { setOpenTime(e.target.value); setIsUnsaved(true); }}
                          className="text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg p-1.5 w-full text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Closing time</span>
                        <input
                          type="text"
                          value={closeTime}
                          onChange={(e) => { setCloseTime(e.target.value); setIsUnsaved(true); }}
                          className="text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg p-1.5 w-full text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Turnaround Guarantee Tabs */}
                  <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200/60 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-800">Standard turnaround guarantee</span>
                    
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                      {['24 hours', '48 hours', 'Same day'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setTurnaroundGuarantee(opt); setIsUnsaved(true); }}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                            turnaroundGuarantee === opt
                              ? 'bg-[#006a60] text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Courier pickup cutoff:</span>
                      <span className="font-extrabold text-slate-900">17:00 PM</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column (5 cols): Services, Unit Rates & Payout Accounts */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              
              {/* Card 3: Services & unit rates */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#006a60]" />
                    <h2 className="text-base font-extrabold text-slate-900">Services & unit rates</h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Currency: <strong>GHC (GHS)</strong></span>
                </div>

                {/* Services List */}
                <div className="flex flex-col gap-3">
                  {services.map((srv) => (
                    <div key={srv.id} className="bg-[#f8fafc] rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#006a60] flex items-center justify-center">
                            <Shirt className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{srv.title}</h3>
                            <p className="text-[11px] text-slate-500">{srv.desc}</p>
                          </div>
                        </div>

                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleToggleService(srv.id)}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                            srv.enabled ? 'bg-[#006a60] justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white shadow-xs"></span>
                        </button>
                      </div>

                      {/* Rate Input Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Rate per {srv.unit}:</span>
                          <span className="font-extrabold text-[#006a60]">GH₵</span>
                          <input
                            type="text"
                            value={srv.rate}
                            onChange={(e) => handleRateChange(srv.id, e.target.value)}
                            className="w-16 bg-white border border-slate-300 rounded-lg p-1 text-xs font-bold text-slate-900 text-center"
                          />
                        </div>

                        {srv.minOrder && (
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {srv.minOrder} kg min load
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Custom Service */}
                  <button
                    onClick={() => alert('Custom Service creation modal opened...')}
                    className="border-2 border-dashed border-[#006a60]/40 hover:border-[#006a60] bg-teal-50/40 text-[#006a60] rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add new custom service</span>
                  </button>
                </div>

              </div>

              {/* Card 4: Settlement & MoMo payouts */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#006a60]" />
                    <h2 className="text-base font-extrabold text-slate-900">Settlement & MoMo payouts</h2>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10.5px] font-bold">Primary</span>
                </div>

                <div className="bg-[#f8fafc] rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#ffcc00] text-slate-900 flex items-center justify-center font-black text-[9px]">
                        MTN
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">MTN Merchant Account</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Merchant ID / Till</span>
                      <span className="font-mono font-extrabold text-slate-900">638102</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Account title</span>
                      <span className="font-extrabold text-slate-900 truncate">SPARKLE LAUNDRY LTD</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Sticky Floating Save Changes Bar (Exact match to prompt screenshot) */}
        {isUnsaved && (
          <div className="fixed bottom-4 left-72 right-8 bg-slate-900 text-white rounded-3xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-700 animate-slideUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#006a60] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold">Unsaved configuration changes</span>
                <span className="text-xs text-slate-400">Rates and hours modified 2 minutes ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUnsaved(false)}
                className="text-slate-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Discard changes
              </button>

              <button
                onClick={handleSaveAll}
                className="bg-[#006a60] hover:bg-[#005850] text-white text-xs font-extrabold px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save profile & pricing changes</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
