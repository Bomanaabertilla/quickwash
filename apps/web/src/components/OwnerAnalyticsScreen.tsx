import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  Clock,
  Download,
  Calendar,
  ArrowUpRight,
  Filter,
  Layers,
  Sparkles,
  Shirt,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../utils/dateUtils';
import { cn } from '@/lib/utils';

export interface OwnerAnalyticsScreenProps {
  onShowToast?: (msg: string) => void;
}

export default function OwnerAnalyticsScreen({ onShowToast }: OwnerAnalyticsScreenProps) {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');

  const stats = {
    grossRevenue: 4890.00,
    revenueGrowth: '+18.4%',
    completedOrders: 142,
    orderGrowth: '+12.5%',
    avgBasket: 172.50,
    avgBasketGrowth: '+5.2%',
    onTimeRate: '98.6%',
    onTimeGrowth: '+1.1%'
  };

  const revenueByDay = [
    { day: 'Mon', date: 'Sep 14', amount: 580, height: '45%' },
    { day: 'Tue', date: 'Sep 15', amount: 720, height: '60%' },
    { day: 'Wed', date: 'Sep 16', amount: 890, height: '75%' },
    { day: 'Thu', date: 'Sep 17', amount: 640, height: '52%' },
    { day: 'Fri', date: 'Sep 18', amount: 1050, height: '90%' },
    { day: 'Sat', date: 'Sep 19', amount: 1220, height: '100%', isPeak: true },
    { day: 'Sun', date: 'Sep 20', amount: 490, height: '38%' }
  ];

  const serviceBreakdown = [
    { name: 'Wash & Fold (Bag/Weight)', revenue: 2340, percent: 48, orders: 74, icon: Shirt, color: 'bg-teal-500' },
    { name: 'Ironing & Steam Press', revenue: 1120, percent: 23, orders: 36, icon: Layers, color: 'bg-indigo-500' },
    { name: 'Dry Cleaning (Suits & Dresses)', revenue: 950, percent: 19, orders: 21, icon: Sparkles, color: 'bg-amber-500' },
    { name: 'Bulky & Bedding Care', revenue: 480, percent: 10, orders: 11, icon: PackageCheck, color: 'bg-emerald-500' }
  ];

  const peakPickupHours = [
    { time: '08:00 AM - 10:00 AM', label: 'Morning Commute', orders: 48, percentage: 85 },
    { time: '12:00 PM - 02:00 PM', label: 'Lunchtime Express', orders: 28, percentage: 50 },
    { time: '04:30 PM - 06:30 PM', label: 'Evening Drop-off', orders: 54, percentage: 95 },
    { time: '06:30 PM - 08:00 PM', label: 'Late Intake', orders: 12, percentage: 22 }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-24 overflow-y-auto">
      
      {/* Header Bar */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 bg-white shadow-2xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Operations</span>
            <span>&gt;</span>
            <span>Business Intelligence</span>
            <span>&gt;</span>
            <span className="text-[#008276] font-semibold">Analytics</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analytics & Insights
            </h1>
            <Badge variant="outline" className="border-emerald-300 text-emerald-800 bg-emerald-50 text-xs font-bold px-2.5 py-0.5">
              Live Sync
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time financial performance, volume metrics, and order fulfillment throughput.
          </p>
        </div>

        {/* Date Range Filter & Export Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setDateRange(range);
                  if (onShowToast) onShowToast(`Filtered by ${range}`);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer',
                  dateRange === range
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : range}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => onShowToast && onShowToast('Exporting analytics CSV report...')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="px-6 lg:px-10 max-w-7xl mx-auto w-full flex flex-col gap-6 mt-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 rounded-3xl border-slate-200/90 shadow-2xs bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Gross Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#008276] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(stats.grossRevenue)}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stats.revenueGrowth} vs last week</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-3xl border-slate-200/90 shadow-2xs bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Orders Fulfilled</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.completedOrders} Orders
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stats.orderGrowth} order volume</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-3xl border-slate-200/90 shadow-2xs bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Avg Basket Size</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(stats.avgBasket)}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stats.avgBasketGrowth} basket yield</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-3xl border-slate-200/90 shadow-2xs bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>On-Time Readiness</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.onTimeRate}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standard turnaround met</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts & Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Bar Visualizer */}
          <Card className="lg:col-span-2 p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Daily Revenue Trend</h3>
                <p className="text-xs text-slate-400">Total collected earnings through online MoMo & desk payments</p>
              </div>
              <Badge variant="secondary" className="bg-[#eef3f9] text-[#2c538a] font-bold text-xs">
                Sep 14 – Sep 20, 2026
              </Badge>
            </div>

            {/* Bars */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
              {revenueByDay.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-10">
                    {formatCurrency(item.amount)}
                  </div>

                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: item.height }}
                      className={cn(
                        'w-full transition-all duration-500 rounded-t-xl',
                        item.isPeak ? 'bg-[#008276]' : 'bg-teal-200/80 group-hover:bg-[#008276]/70'
                      )}
                    />
                  </div>

                  <div className="text-center">
                    <span className="block text-xs font-bold text-slate-700">{item.day}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Peak day: <strong className="text-slate-800">Saturday (GH₵ 1,220.00)</strong></span>
              <span>Weekly Average: <strong className="text-slate-800">GH₵ 698.57 / day</strong></span>
            </div>
          </Card>

          {/* Service Volume Breakdown */}
          <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Revenue by Service</h3>
              <p className="text-xs text-slate-400">Contribution of each wash category</p>
            </div>

            <div className="flex flex-col gap-4">
              {serviceBreakdown.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 text-slate-800">
                        <IconComponent className="w-3.5 h-3.5 text-slate-500" />
                        <span>{srv.name}</span>
                      </div>
                      <span className="text-slate-900">{formatCurrency(srv.revenue)} ({srv.percent}%)</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${srv.percent}%` }}
                        className={cn('h-full rounded-full', srv.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Top Performer</span>
              <span className="font-extrabold text-[#008276]">Wash & Fold (48%)</span>
            </div>
          </Card>

        </div>

        {/* Peak Intake Windows Table */}
        <Card className="p-6 rounded-3xl border-slate-200/90 shadow-2xs bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Peak Customer Drop-off Hours</h3>
              <p className="text-xs text-slate-400">Optimal dispatch and courier scheduling based on booking distribution</p>
            </div>
            <Badge variant="outline" className="text-xs font-bold text-slate-600 border-slate-200">
              Live Courier Data
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {peakPickupHours.map((slot, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-[#fbfcfd] flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{slot.label}</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{slot.time}</h4>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">{slot.orders} Pickups</span>
                    <span className="text-[#008276]">{slot.percentage}% cap</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${slot.percentage}%` }}
                      className="h-full bg-[#008276] rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
