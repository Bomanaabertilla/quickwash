import React, { useState } from 'react';
import {
  Settings,
  CreditCard,
  Bell,
  Printer,
  Users,
  ShieldCheck,
  Smartphone,
  Save,
  CheckCircle2,
  Lock,
  Building,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface OwnerSettingsScreenProps {
  onShowToast?: (msg: string) => void;
}

export default function OwnerSettingsScreen({ onShowToast }: OwnerSettingsScreenProps) {
  const [momoNetwork, setMomoNetwork] = useState('MTN Mobile Money');
  const [momoNumber, setMomoNumber] = useState('024 123 4567');
  const [merchantName, setMerchantName] = useState('Sparkle Express Laundry Ent.');
  const [autoSettle, setAutoSettle] = useState(true);
  const [smsNotify, setSmsNotify] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);
  const [rushOrderEnabled, setRushOrderEnabled] = useState(true);
  const [rushSurcharge, setRushSurcharge] = useState('25');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    if (onShowToast) onShowToast('Store settings & payout configuration saved successfully!');
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-24 overflow-y-auto">
      {/* Header Bar */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 bg-white shadow-2xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Operations</span>
            <span>&gt;</span>
            <span>Administration</span>
            <span>&gt;</span>
            <span className="text-[#008276] font-semibold">Settings</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store Operations & Settings
            </h1>
            <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-xs font-bold px-2.5 py-0.5">
              Production Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage payout gateways, automated order dispatching, SMS notifications, and operator roles.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-[#008276] hover:bg-[#007065] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
        </Button>
      </div>

      {/* Main Settings Body */}
      <form onSubmit={handleSave} className="px-6 lg:px-10 max-w-5xl mx-auto w-full flex flex-col gap-6 mt-6">
        
        {/* Section 1: Mobile Money Payout Account */}
        <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#008276] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Mobile Money Settlement Account</h2>
                <p className="text-xs text-slate-400">Where customer order payments and automated daily disbursements are wired</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
              Verified Gateway
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Payout Network</label>
              <select
                value={momoNetwork}
                onChange={(e) => setMomoNetwork(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#008276]"
              >
                <option value="MTN Mobile Money">MTN Mobile Money (Ghana)</option>
                <option value="Telecel Cash">Telecel Cash (Vodafone)</option>
                <option value="AT Money">AT Money (AirtelTigo)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Registered Merchant / Phone Number</label>
              <Input
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="024 XXX XXXX"
                className="text-xs font-bold bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Account Legal Name</label>
              <Input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Business Registration Name"
                className="text-xs font-bold bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Toggle for Auto-settlement */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="block text-xs font-bold text-slate-800">Daily Automated Settlement</span>
              <span className="block text-[11px] text-slate-400">Transfer net balance to merchant wallet every evening at 10:00 PM</span>
            </div>
            <button
              type="button"
              onClick={() => setAutoSettle(!autoSettle)}
              className="text-[#008276] cursor-pointer"
            >
              {autoSettle ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
            </button>
          </div>
        </Card>

        {/* Section 2: Store Automation & Surcharges */}
        <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Intake & Pricing Controls</h2>
              <p className="text-xs text-slate-400">Order processing policies, emergency rush buffers, and auto-confirmations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2">
              <div>
                <span className="block text-xs font-bold text-slate-800">Allow Same-Day Express Rush</span>
                <span className="block text-[11px] text-slate-400">Offer 4-hour rush turnaround for premium customers</span>
              </div>
              <button
                type="button"
                onClick={() => setRushOrderEnabled(!rushOrderEnabled)}
                className="text-[#008276] cursor-pointer"
              >
                {rushOrderEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
            </div>

            {rushOrderEnabled && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Express Surcharge Rate (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={rushSurcharge}
                    onChange={(e) => setRushSurcharge(e.target.value)}
                    className="max-w-[120px] text-xs font-bold bg-slate-50 border-slate-200 rounded-xl"
                  />
                  <span className="text-xs font-bold text-slate-500">% markup on base services</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Section 3: Notification & Ticket Printing */}
        <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Notifications & Dispatch Tickets</h2>
              <p className="text-xs text-slate-400">SMS alerts to laundry manager and automated Bluetooth receipt printing</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Instant SMS Notification on New Booking</span>
                  <span className="block text-[11px] text-slate-400">Send immediate SMS alert to store phone when customer books</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmsNotify(!smsNotify)}
                className="text-[#008276] cursor-pointer"
              >
                {smsNotify ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Printer className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Thermal Printer Auto-Print Tickets</span>
                  <span className="block text-[11px] text-slate-400">Automatically print laundry intake tickets upon booking confirmation</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoPrint(!autoPrint)}
                className="text-[#008276] cursor-pointer"
              >
                {autoPrint ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
            </div>
          </div>
        </Card>

        {/* Section 4: Authorized Team Members */}
        <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Authorized Facility Staff</h2>
                <p className="text-xs text-slate-400">Operators and dispatch personnel with access to the store dashboard</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onShowToast && onShowToast('Invite staff modal')}
              className="text-xs font-bold rounded-xl border-slate-200"
            >
              + Add Staff
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#008276] text-white font-bold flex items-center justify-center">
                  KA
                </div>
                <div>
                  <span className="block font-bold text-slate-900">Kwame Asante (You)</span>
                  <span className="block text-[11px] text-slate-400">Managing Director • kwame@sparkleexpress.com</span>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 font-bold border-none">
                Owner Admin
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center">
                  AM
                </div>
                <div>
                  <span className="block font-bold text-slate-900">Ama Mensah</span>
                  <span className="block text-[11px] text-slate-400">Wash Plant Supervisor • +233 24 555 1234</span>
                </div>
              </div>
              <Badge variant="outline" className="text-slate-600 font-bold border-slate-200">
                Operator
              </Badge>
            </div>
          </div>
        </Card>

      </form>
    </div>
  );
}
