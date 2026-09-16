import React, { useState, useEffect } from 'react';
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
  Check,
  Building,
  CreditCard,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Shirt,
  Trash2,
  ExternalLink,
  ChevronDown,
  Truck,
  RotateCcw,
  Star,
  Cpu,
  Power
} from 'lucide-react';
import { getShopProfile, saveShopProfile } from '../data/shopStore';

export default function OwnerShopProfileScreen({
  onBackToDashboard,
  onBackToApp,
  onShowToast
}) {
  const [isUnsaved, setIsUnsaved] = useState(false);

  // Shop Details & Location State loaded from store
  const [shopName, setShopName] = useState(() => getShopProfile().name);
  const [branchDescriptor, setBranchDescriptor] = useState(() => getShopProfile().branchDescriptor);
  const [shopCategory, setShopCategory] = useState(() => getShopProfile().category);
  const [physicalAddress, setPhysicalAddress] = useState(() => getShopProfile().physicalAddress);
  const [digitalAddress, setDigitalAddress] = useState(() => getShopProfile().digitalAddress);
  const [deliveryRadius, setDeliveryRadius] = useState(() => getShopProfile().deliveryRadius);

  // Contact Information State
  const [primaryPhone, setPrimaryPhone] = useState(() => getShopProfile().primaryPhone);
  const [whatsapp, setWhatsapp] = useState(() => getShopProfile().whatsapp);
  const [businessEmail, setBusinessEmail] = useState(() => getShopProfile().businessEmail);

  // Operating Hours & Turnaround Promise
  const [openTime, setOpenTime] = useState(() => getShopProfile().openTime);
  const [closeTime, setCloseTime] = useState(() => getShopProfile().closeTime);
  const [turnaroundPromise, setTurnaroundPromise] = useState(() => getShopProfile().turnaroundPromise);

  // Facilities
  const [equipment] = useState([
    { name: '8 Industrial Washers', desc: '18kg SpeedQueen wash drums' },
    { name: '6 Gas Heated Tumbler Dryers', desc: 'Gentle low-heat drying' },
    { name: 'Standby Generator', desc: 'Zero downtime during power outages' },
    { name: 'RO Soft Water System', desc: 'Protects delicate colored fabrics' }
  ]);

  // Highlighted Services for Customer Preview
  const [previewServices] = useState([
    { id: 1, name: 'Wash & fold', price: '37.00', unit: 'kg' },
    { id: 2, name: 'Dry cleaning', price: '90.00', unit: 'item' },
    { id: 3, name: 'Iron only', price: '25.00', unit: 'item' },
    { id: 4, name: 'Duvet & bulky clean', price: '120.00', unit: 'piece' }
  ]);

  const handleSave = () => {
    saveShopProfile({
      name: shopName,
      branchDescriptor,
      category: shopCategory,
      physicalAddress,
      digitalAddress,
      deliveryRadius,
      primaryPhone,
      whatsapp,
      businessEmail,
      openTime,
      closeTime,
      turnaroundPromise
    });
    setIsUnsaved(false);
    if (onShowToast) onShowToast('Shop profile changes live synced to QuickWash marketplace!');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-24 overflow-y-auto">
      
      {/* Sub-Header Breadcrumb & Page Title Bar (Matching Reference Screen 1) */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <span className="hover:text-slate-600 transition-colors">Operations</span>
            <span className="text-slate-400">&gt;</span>
            <span className="hover:text-slate-600 transition-colors">Shop configuration</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#008276] font-bold">Business profile</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Business profile setup
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE ON MARKETPLACE
            </span>
          </div>
        </div>

        {/* Top Right Status & Navigation Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#dce6f5] text-[#2c538a] px-3.5 py-1.5 rounded-2xl text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2c538a]"></span>
            <span>All systems synced</span>
          </div>

          <button
            onClick={() => onShowToast && onShowToast('Opening public QuickWash customer store page...')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4 text-[#008276]" />
            <span>View public catalog</span>
          </button>
        </div>
      </div>

      {/* Main Content Area (Two Columns matching Reference Screenshot 1) */}
      <div className="px-6 lg:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
        
        {/* Left Column: Live Customer View Mobile App Card Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 sticky top-4">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live customer view</span>
            </div>
            <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
              Mobile App Card
            </span>
          </div>

          {/* Customer Preview Phone Card Frame */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col transition-all">
            
            {/* Store Cover Photo */}
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80"
                alt="Store Interior"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20"></div>

              {/* Status Badges on Cover */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>Open now • Closes {closeTime}</span>
              </div>

              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-amber-600 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 (318)</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold">
                  {branchDescriptor || 'Ring Road Central Flagship'}
                </span>
                <span className="bg-[#008276] text-white px-2 py-0.5 rounded-md text-[10.5px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  QuickWash Verified
                </span>
              </div>
            </div>

            {/* Store Details Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-1.5 bg-white">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {shopName || 'Sparkle Express Laundry'}
                </h2>
                <CheckCircle2 className="w-4 h-4 text-[#008276] fill-[#008276]" />
              </div>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Upper West Side • Accra Central • 0.6 km away</span>
              </p>

              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-600 flex-wrap">
                <span className="bg-teal-50 text-[#008276] px-2.5 py-0.5 rounded-md border border-teal-200/60 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#008276]" />
                  {turnaroundPromise} standard turnaround
                </span>
                <span className="bg-[#dce6f5] text-[#2c538a] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#2c538a]" />
                  Free courier pickup
                </span>
              </div>
            </div>

            {/* Services & Pricing Preview Catalog */}
            <div className="p-4 flex flex-col gap-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-wider text-[10.5px]">SERVICES &amp; PRICING</span>
                <span className="text-[#008276] font-bold text-[11px]">
                  4 active
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {previewServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white p-2.5 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-50 text-[#008276] flex items-center justify-center font-bold">
                        <Shirt className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-800">{service.name}</span>
                    </div>

                    <div className="flex items-baseline gap-1 font-bold text-slate-900">
                      <span className="text-[#008276]">GH₵ {service.price}</span>
                      <span className="text-[10.5px] text-slate-400 font-normal">/ {service.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Customer Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                <button 
                  onClick={() => onShowToast && onShowToast(`Dialing ${primaryPhone}`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>{primaryPhone}</span>
                </button>

                <button 
                  onClick={() => onShowToast && onShowToast(`Opening WhatsApp chat with ${whatsapp}`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </button>
              </div>

            </div>

          </div>

          <p className="text-[11px] text-slate-400 font-medium px-2 leading-relaxed">
            Preview updates in real time as changes are made. This is how customers discover and book your laundry shop on the QuickWash app.
          </p>

        </div>

        {/* Right Column: Form Configuration Sections (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Shop Details & Location */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Store className="w-4 h-4 text-[#008276]" />
                <span>1. Shop details &amp; location</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-400">ACC-SPK-081</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Shop Name */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Shop name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      setIsUnsaved(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276] pr-8"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Branch descriptor */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Branch descriptor / tagline</label>
                <input
                  type="text"
                  value={branchDescriptor}
                  onChange={(e) => {
                    setBranchDescriptor(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                />
              </div>

            </div>

            {/* Shop Category */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700">Shop category</label>
              <select
                value={shopCategory}
                onChange={(e) => {
                  setShopCategory(e.target.value);
                  setIsUnsaved(true);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276] cursor-pointer"
              >
                <option value="Laundromat & Dry Cleaning">Laundromat &amp; Dry Cleaning</option>
                <option value="Commercial Laundry & Uniforms">Commercial Laundry &amp; Uniforms</option>
                <option value="Express Steam Pressing Only">Express Steam Pressing Only</option>
              </select>
            </div>

            {/* Physical Address */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Physical address &amp; pickup point</label>
                <button
                  onClick={() => onShowToast && onShowToast('Opened GPS pin locator on map')}
                  className="text-[11px] text-[#008276] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  Select on map
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={physicalAddress}
                  onChange={(e) => {
                    setPhysicalAddress(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276] pl-8"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Dispatch Delivery Radius Slider */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Dispatch delivery radius</span>
                <span className="text-base font-black text-[#008276]">
                  {deliveryRadius} km
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={deliveryRadius}
                onChange={(e) => {
                  setDeliveryRadius(parseFloat(e.target.value));
                  setIsUnsaved(true);
                }}
                className="w-full accent-[#008276] cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-medium">
                <span>1 km (Local neighborhood)</span>
                <span className="text-slate-600 font-bold">Coverage: Ring Road, Circle, Osu, Ridge, Cantonments</span>
                <span>25 km</span>
              </div>
            </div>

          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#008276]" />
                <span>2. Contact information</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">Customer-facing channels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Primary phone
                </label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => {
                    setPrimaryPhone(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  WhatsApp line
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Business email
                </label>
                <input
                  type="text"
                  value={businessEmail}
                  onChange={(e) => {
                    setBusinessEmail(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                />
              </div>

            </div>

          </div>

          {/* Section 3: Operating Hours & Turnaround Promise */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#008276]" />
                <span>3. Operating hours &amp; turnaround promise</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-400">GMT (UTC+0)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Working Window */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2">
                <span className="font-bold text-slate-800">Daily working window</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10.5px] text-slate-500 font-medium">Opening time</span>
                    <input
                      type="text"
                      value={openTime}
                      onChange={(e) => {
                        setOpenTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10.5px] text-slate-500 font-medium">Closing time</span>
                    <input
                      type="text"
                      value={closeTime}
                      onChange={(e) => {
                        setCloseTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                    />
                  </div>
                </div>
              </div>

              {/* Turnaround Guarantee */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2">
                <span className="font-bold text-slate-800">Standard turnaround promise</span>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {['24h', '48h', 'Same day'].map((promise) => (
                    <button
                      key={promise}
                      onClick={() => {
                        setTurnaroundPromise(promise);
                        setIsUnsaved(true);
                      }}
                      className={`py-2 rounded-xl font-bold text-xs transition-all ${
                        turnaroundPromise === promise
                          ? 'bg-[#008276] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {promise}
                    </button>
                  ))}
                </div>

                <span className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                  Evening intake accepted until 19:45 daily
                </span>
              </div>

            </div>

          </div>

          {/* Section 4: Facilities & Equipment */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Building className="w-4 h-4 text-[#008276]" />
                <span>4. Facilities &amp; Equipment Badges</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Facility
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {equipment.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#008276] flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{item.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Save & Sync Sticky Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <RefreshCw className="w-4 h-4 text-[#008276] animate-spin" />
              <div>
                <span className="font-extrabold text-slate-900 block">Profile updates ready</span>
                <span className="text-[11px] text-slate-500">Real-time sync to marketplace preview enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setIsUnsaved(false);
                  if (onShowToast) onShowToast('Discarded shop profile edits');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors border border-slate-200"
              >
                Discard changes
              </button>

              <button
                onClick={handleSave}
                className="bg-[#008276] hover:bg-[#007065] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all"
              >
                <Check className="w-4 h-4 text-teal-200" />
                <span>Save profile &amp; update live preview</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
