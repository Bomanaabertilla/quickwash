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
  RefreshCw,
  Eye,
  Check,
  Building,
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
  Cpu,
  Sliders,
  X,
  Compass,
  Info
} from 'lucide-react';
import { getShopProfile, saveShopProfile } from '../data/shopStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { ShopProfile } from '@quickwash/shared';

export interface OwnerShopProfileScreenProps {
  onBackToDashboard?: () => void;
  onBackToApp?: () => void;
  onShowToast?: (msg: string) => void;
}

export default function OwnerShopProfileScreen({
  onBackToDashboard,
  onBackToApp,
  onShowToast
}: OwnerShopProfileScreenProps) {
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'identity' | 'location' | 'hours' | 'contact' | 'facilities'>('all');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Shop Details & Location State loaded from store
  const [shopName, setShopName] = useState(() => getShopProfile().name);
  const [branchDescriptor, setBranchDescriptor] = useState(() => getShopProfile().branchDescriptor);
  const [shopCategory, setShopCategory] = useState(() => getShopProfile().category);
  const [physicalAddress, setPhysicalAddress] = useState(() => getShopProfile().physicalAddress);
  const [digitalAddress, setDigitalAddress] = useState(() => getShopProfile().digitalAddress || 'GA-183-4920');
  const [deliveryRadius, setDeliveryRadius] = useState<number>(() => getShopProfile().deliveryRadius);

  // Contact Information State
  const [primaryPhone, setPrimaryPhone] = useState(() => getShopProfile().primaryPhone);
  const [whatsapp, setWhatsapp] = useState(() => getShopProfile().whatsapp);
  const [businessEmail, setBusinessEmail] = useState(() => getShopProfile().businessEmail);

  // Operating Hours & Turnaround Promise
  const [openTime, setOpenTime] = useState(() => getShopProfile().openTime);
  const [closeTime, setCloseTime] = useState(() => getShopProfile().closeTime);
  const [turnaroundPromise, setTurnaroundPromise] = useState(() => getShopProfile().turnaroundPromise || '24h');

  // Facilities
  const [equipment] = useState([
    { name: '8 Industrial Washers', desc: '18kg SpeedQueen wash drums', tag: 'Washers' },
    { name: '6 Gas Heated Tumbler Dryers', desc: 'Gentle low-heat drying', tag: 'Dryers' },
    { name: 'Standby Generator', desc: 'Zero downtime during power outages', tag: 'Power Backup' },
    { name: 'RO Soft Water System', desc: 'Protects delicate colored fabrics', tag: 'Water Care' }
  ]);

  // Neighborhoods covered by current radius
  const coverageNeighborhoods = [
    'Ring Road Central',
    'Osu',
    'Ridge',
    'Cantonments',
    'Airport Residential',
    'Labone',
    'Roman Ridge'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveShopProfile({
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
      if (onShowToast) onShowToast('Shop profile updated and synced to QuickWash marketplace!');
    } catch (err) {
      console.error('Failed to save shop profile', err);
      if (onShowToast) onShowToast('Error saving profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    const original = getShopProfile();
    setShopName(original.name);
    setBranchDescriptor(original.branchDescriptor);
    setShopCategory(original.category);
    setPhysicalAddress(original.physicalAddress);
    setDigitalAddress(original.digitalAddress || 'GA-183-4920');
    setDeliveryRadius(original.deliveryRadius);
    setPrimaryPhone(original.primaryPhone);
    setWhatsapp(original.whatsapp);
    setBusinessEmail(original.businessEmail);
    setOpenTime(original.openTime);
    setCloseTime(original.closeTime);
    setTurnaroundPromise(original.turnaroundPromise || '24h');
    setIsUnsaved(false);
    if (onShowToast) onShowToast('Discarded unsaved changes');
  };

  const tabs: Array<{ id: 'all' | 'identity' | 'location' | 'hours' | 'contact' | 'facilities'; label: string; icon?: any }> = [
    { id: 'all', label: 'All Settings' },
    { id: 'identity', label: 'Store Identity', icon: Store },
    { id: 'location', label: 'Location & Delivery', icon: MapPin },
    { id: 'hours', label: 'Hours & Turnaround', icon: Clock },
    { id: 'contact', label: 'Contact Channels', icon: Phone },
    { id: 'facilities', label: 'Facilities', icon: Sparkles }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-28 overflow-y-auto">
      
      {/* Top Header Bar */}
      <div className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">Operations</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-bold text-[#006a60]">Shop Profile</span>
              <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live on Marketplace
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Business Profile Setup
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your storefront identity, delivery radius, operating hours, and customer contact channels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border-stone-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
              title="Preview Customer Storefront View"
            >
              <Eye className="w-4 h-4 text-[#006a60]" />
              <span>Preview Storefront</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer',
                isUnsaved
                  ? 'bg-[#006a60] hover:bg-[#005047] text-white'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
              )}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isUnsaved ? 'Save Changes' : 'Saved'}</span>
            </Button>
          </div>

        </div>

        {/* Filter Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 overflow-x-auto no-scrollbar pb-2.5 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                  isActive
                    ? 'bg-[#006a60] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                )}
              >
                {Icon && <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-slate-400')} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full px-6 py-6 space-y-6">

        {/* SECTION 1: Store Identity & Branding */}
        {(activeTab === 'all' || activeTab === 'identity') && (
          <Card className="p-6 sm:p-7 border-stone-200/80 shadow-2xs bg-white">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Store Identity &amp; Branding</h2>
                  <p className="text-xs text-slate-500">How your shop appears in search and marketplace listings.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006a60]" />
                Verified Partner
              </span>
            </div>

            {/* Store Banner Preview & Change Action */}
            <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200/70 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80"
                  alt="Store Front"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-2xs"
                />
                <div>
                  <span className="text-xs font-black text-slate-900 block">{shopName}</span>
                  <span className="text-[11px] text-slate-500 block">{branchDescriptor}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500">{shopCategory}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => onShowToast && onShowToast('Cover photo updated')}
                className="text-xs font-bold text-[#006a60] bg-white hover:bg-stone-100 border-stone-200 cursor-pointer"
              >
                Change Cover Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              {/* Shop Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Shop name</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      setIsUnsaved(true);
                    }}
                    placeholder="e.g. Sparkle Express Laundry"
                    className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all pr-9"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
                </div>
              </div>

              {/* Branch / Tagline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Branch descriptor / Tagline</label>
                <Input
                  type="text"
                  value={branchDescriptor}
                  onChange={(e) => {
                    setBranchDescriptor(e.target.value);
                    setIsUnsaved(true);
                  }}
                  placeholder="e.g. Ring Road Central Flagship"
                  className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all"
                />
              </div>

              {/* Shop Category */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Shop category</label>
                <select
                  value={shopCategory}
                  onChange={(e) => {
                    setShopCategory(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#006a60] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Laundromat & Dry Cleaning">Laundromat &amp; Dry Cleaning</option>
                  <option value="Commercial Laundry & Uniforms">Commercial Laundry &amp; Uniforms</option>
                  <option value="Express Steam Pressing Only">Express Steam Pressing Only</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 2: Location & Delivery Coverage */}
        {(activeTab === 'all' || activeTab === 'location') && (
          <Card className="p-6 sm:p-7 border-stone-200/80 shadow-2xs bg-white">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Location &amp; Delivery Coverage</h2>
                  <p className="text-xs text-slate-500">Physical pickup hub and courier dispatch radius.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onShowToast && onShowToast('GPS Pin Location Confirmed on Map')}
                className="text-xs font-bold text-[#006a60] hover:text-[#005047] flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Pin on Map</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {/* Physical Address */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Physical address &amp; pickup point</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={physicalAddress}
                    onChange={(e) => {
                      setPhysicalAddress(e.target.value);
                      setIsUnsaved(true);
                    }}
                    placeholder="Enter storefront street address"
                    className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all pl-9"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Digital Address (GhanaPost GPS) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Digital address (GhanaPost GPS)</label>
                <Input
                  type="text"
                  value={digitalAddress}
                  onChange={(e) => {
                    setDigitalAddress(e.target.value);
                    setIsUnsaved(true);
                  }}
                  placeholder="e.g. GA-183-4920"
                  className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Delivery Radius Slider Card */}
            <div className="mt-5 p-5 rounded-xl bg-stone-50/80 border border-stone-200/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Dispatch Courier Radius</span>
                  <span className="text-[11px] text-slate-500">Pickups and deliveries accepted within this distance.</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#006a60]">{deliveryRadius} km</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium">radius from shop</span>
                </div>
              </div>

              <Slider
                value={[deliveryRadius]}
                min={1}
                max={25}
                step={0.5}
                onValueChange={(val) => {
                  if (val && val.length > 0) {
                    setDeliveryRadius(val[0]);
                    setIsUnsaved(true);
                  }
                }}
                className="w-full"
              />

              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  Active Coverage Neighborhoods ({coverageNeighborhoods.length} areas):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {coverageNeighborhoods.map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-stone-200 text-slate-700 px-2.5 py-0.5 rounded-md"
                    >
                      <Check className="w-3 h-3 text-[#006a60]" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 3: Operating Hours & Turnaround */}
        {(activeTab === 'all' || activeTab === 'hours') && (
          <Card className="p-6 sm:p-7 border-stone-200/80 shadow-2xs bg-white">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Operating Hours &amp; Turnaround</h2>
                  <p className="text-xs text-slate-500">Working window and customer fulfillment speed guarantee.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
              
              {/* Daily Working Window */}
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800">Daily Store Working Hours</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Opening time</span>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => {
                        setOpenTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#006a60]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Closing time</span>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => {
                        setCloseTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#006a60]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Customers can schedule pickups and drop-offs within this window.
                </p>
              </div>

              {/* Turnaround Guarantee */}
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800">Standard Turnaround Promise</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Same day', label: 'Same day', sub: 'Express' },
                    { id: '24h', label: '24 Hours', sub: 'Standard' },
                    { id: '48h', label: '48 Hours', sub: 'Economy' }
                  ].map((option) => {
                    const isSelected = turnaroundPromise === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setTurnaroundPromise(option.id);
                          setIsUnsaved(true);
                        }}
                        className={cn(
                          'p-2.5 rounded-xl text-center transition-all cursor-pointer border',
                          isSelected
                            ? 'bg-[#006a60] text-white border-[#006a60] shadow-xs'
                            : 'bg-white text-slate-700 border-stone-200 hover:border-slate-300'
                        )}
                      >
                        <span className="block text-xs font-black">{option.label}</span>
                        <span className={cn('block text-[10px]', isSelected ? 'text-teal-200' : 'text-slate-400')}>
                          {option.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Evening drop-offs accepted until 19:45 daily.</span>
                </div>
              </div>

            </div>
          </Card>
        )}

        {/* SECTION 4: Customer Contact Channels */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <Card className="p-6 sm:p-7 border-stone-200/80 shadow-2xs bg-white">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Direct Customer Contacts</h2>
                  <p className="text-xs text-slate-500">Public communication channels displayed to customers.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {/* Primary Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Primary Phone
                </label>
                <Input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => {
                    setPrimaryPhone(e.target.value);
                    setIsUnsaved(true);
                  }}
                  placeholder="+233 24 123 4567"
                  className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all"
                />
              </div>

              {/* WhatsApp Line */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Line
                </label>
                <Input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setIsUnsaved(true);
                  }}
                  placeholder="+233 55 987 6543"
                  className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all"
                />
              </div>

              {/* Business Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Business Email
                </label>
                <Input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => {
                    setBusinessEmail(e.target.value);
                    setIsUnsaved(true);
                  }}
                  placeholder="contact@quickwash.com"
                  className="w-full bg-stone-50/60 border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:border-[#006a60] focus:bg-white transition-all"
                />
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 5: Facilities & Verified Equipment */}
        {(activeTab === 'all' || activeTab === 'facilities') && (
          <Card className="p-6 sm:p-7 border-stone-200/80 shadow-2xs bg-white">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Verified Equipment &amp; Facilities</h2>
                  <p className="text-xs text-slate-500">Quality badges verified by QuickWash operations team.</p>
                </div>
              </div>

              <Badge variant="success" className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All 4 Verified
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
              {equipment.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#006a60] flex items-center justify-center font-bold shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>

      {/* Floating Save Changes Bar */}
      {isUnsaved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-700 max-w-lg w-[90%] justify-between animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-bold">Unsaved changes pending</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors font-medium cursor-pointer"
            >
              Discard
            </button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-[#006a60] hover:bg-[#005047] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      )}

      {/* Storefront Customer View Drawer Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
            
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Customer Storefront Preview</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Card Content */}
            <div className="overflow-y-auto p-4 flex flex-col gap-3.5">
              
              {/* Photo & Badges */}
              <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80"
                  alt="Store"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Open • Closes {closeTime}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 (318)</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md truncate max-w-[180px]">
                    {branchDescriptor}
                  </span>
                  <span className="bg-[#006a60] text-white px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{shopName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{physicalAddress}</span>
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] font-bold text-[#006a60] bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {turnaroundPromise} turnaround
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Courier dispatch ({deliveryRadius} km)
                  </span>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onShowToast && onShowToast(`Calling ${primaryPhone}`)}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Store</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast && onShowToast(`Chatting with ${whatsapp}`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
