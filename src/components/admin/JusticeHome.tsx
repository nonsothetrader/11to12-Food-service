import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Megaphone, 
  Trash2, 
  Bike, 
  TrendingUp, 
  Send,
  Eye,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Utensils
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { AdminAnnouncement } from '../../lib/store';
import { AdminTab } from './AdminLayout';
import { getMealForDate } from '../../lib/data';

interface JusticeHomeProps {
  onNavigateTab?: (tab: AdminTab) => void;
}

export default function JusticeHome({ onNavigateTab }: JusticeHomeProps) {
  const { store, actions } = useAppStore();

  // Announcement composer state
  const [isComposing, setIsComposing] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<AdminAnnouncement['type']>('savage');
  const [annAudience, setAnnAudience] = useState<AdminAnnouncement['audience']>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Stats calculation
  const totalRevenueFormatted = `₦${store.metrics.todayRevenue.toLocaleString()}`;
  const activeSubsCount = store.subscribers.filter(s => s.status === 'Active').length;
  const acceptedOrdersCount = store.orders.filter(o => o.choice === 'accept').length;
  const skippedOrdersCount = store.orders.filter(o => o.choice === 'skip').length;
  const inTransitCount = store.orders.filter(o => o.status === 'Out for Delivery').length;
  const deliveredCount = store.orders.filter(o => o.status === 'Delivered').length;

  // Next day order metrics
  const nextDayOrders = store.orders.filter(o => o.isNextDayOrder);
  const nextDayAccepts = nextDayOrders.filter(o => o.choice === 'accept');
  const nextDaySkips = nextDayOrders.filter(o => o.choice === 'skip');
  const nextDayTotalPlates = nextDayAccepts.reduce((acc, o) => acc + (o.totalPlates || 1), 0);
  const nextDayExtraPlates = nextDayAccepts.reduce((acc, o) => acc + (o.extraPlatesFromCredits || 0), 0);
  const nextDayCreditsUsed = nextDayAccepts.reduce((acc, o) => acc + (o.creditsUsed || 0), 0);

  // Tomorrow meal lookup
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  if (tomorrowDate.getDay() === 6) tomorrowDate.setDate(tomorrowDate.getDate() + 2);
  if (tomorrowDate.getDay() === 0) tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowMeal = getMealForDate(tomorrowDate);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    actions.addAnnouncement(annTitle, annMessage, annType, annAudience);
    setAnnTitle('');
    setAnnMessage('');
    setIsComposing(false);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const quickTemplates = [
    {
      title: '🚨 Savage Colleague Alert — Protect Your Food Box!',
      msg: 'We spotted desk vultures circling the 3rd floor kitchenette. Tamper-evident red seals are on your meal—do not let anyone "taste small".',
      type: 'savage' as const
    },
    {
      title: '🌧️ Falomo Bridge Drizzle Update',
      msg: 'Light rain on the Island. Riders have thermal insulated rain covers—all drops arrive steaming hot on schedule.',
      type: 'alert' as const
    },
    {
      title: '🌶️ Extra Pepper Warning Today',
      msg: 'Head Chef Femi went full Lagos heat on today\'s sauce. Have your chilled zobo or water ready at your desk.',
      type: 'warning' as const
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Lagos Command Center
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              Live Updates Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Justice Dashboard
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            All-in-one command center for orders, subscribers, menu schedules, and dispatch logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsComposing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span>Push Savage Alert</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Jump Bar */}
      {onNavigateTab && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="p-4 rounded-2xl bg-white border border-[#1E140A]/10 hover:border-[#FF5500] hover:bg-[#FAF4EB] text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-sm text-[#1E140A]">
                <ShoppingBag className="w-4 h-4 text-[#FF5500]" />
                <span>Order Management</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-[#1E140A]/60">
              {nextDayTotalPlates} plates for tomorrow • Download dispatch sheet for riders.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('users')}
            className="p-4 rounded-2xl bg-white border border-[#1E140A]/10 hover:border-[#FF5500] hover:bg-[#FAF4EB] text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-sm text-[#1E140A]">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Subscribers and Users</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-[#1E140A]/60">
              {activeSubsCount} active desk drops • Manage corporate plans & credits.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('menu')}
            className="p-4 rounded-2xl bg-white border border-[#1E140A]/10 hover:border-[#FF5500] hover:bg-[#FAF4EB] text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-black text-sm text-[#1E140A]">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Menu Management</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-[#1E140A]/60">
              Upload food photos • Update daily dishes & recipes for weekdays.
            </p>
          </button>
        </div>
      )}

      {/* Real-time Broadcast Success Alert */}
      <AnimatePresence>
        {broadcastSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Broadcast pushed in real-time! All active users will see this on their dashboard immediately.</span>
            </div>
            <button onClick={() => setBroadcastSuccess(false)} className="text-emerald-100 hover:text-white">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Real-time KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue (Today) */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
              Revenue (Today)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₦
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1E140A] font-display">
            {totalRevenueFormatted}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last Tuesday</span>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
              Active Subscribers
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1E140A] font-display">
            {activeSubsCount}
          </div>
          <div className="text-[11px] text-[#1E140A]/60 font-medium">
            Across VI, Ikoyi, Marina, Yaba & Lekki
          </div>
        </div>

        {/* Next Day Locked Plates */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
              Tomorrow's Plates
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1E140A] font-display">
            {nextDayTotalPlates} <span className="text-xs font-normal text-[#1E140A]/50 font-sans">({nextDayExtraPlates} via credits)</span>
          </div>
          <div className="text-[11px] text-stone-600 font-bold flex items-center gap-2">
            <span className="text-emerald-600">{nextDayAccepts.length} Accepted</span>
            <span>•</span>
            <span className="text-rose-600">{nextDaySkips.length} Skipped</span>
          </div>
        </div>

        {/* Drop Punctuality */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
              Drop Punctuality
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#1E140A] font-display">
            {store.metrics.onTimePunctualityPercent}%
          </div>
          <div className="text-[11px] text-emerald-600 font-bold">
            100% delivered before 12:00 PM cutoff
          </div>
        </div>

      </div>

      {/* THREE-WAY COMPREHENSIVE SNAPSHOT: Orders, Users & Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Tomorrow's Order Summary & Dispatch List */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider">
                Tomorrow's Delivery
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-mono text-stone-600">
                8 PM Locked
              </span>
            </div>
            
            <h3 className="font-black text-lg font-display text-[#1E140A]">
              Next-Day Meal Roster
            </h3>
            
            <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#1E140A]/70">Standard Accepted Meals:</span>
                <span className="font-black text-[#1E140A]">{nextDayAccepts.length} users</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1E140A]/70">Extra Plates via Credits:</span>
                <span className="font-black text-[#FF5500]">+{nextDayExtraPlates} extra plates</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#1E140A]/70">Credits Redeemed:</span>
                <span className="font-black text-blue-700">{nextDayCreditsUsed} credits</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#1E140A]/10 font-bold">
                <span className="text-[#1E140A]">Total Plates for Kitchen:</span>
                <span className="text-emerald-700 text-sm">{nextDayTotalPlates} plates</span>
              </div>
            </div>
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E140A] hover:bg-[#2A1D0F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Manage Orders & Dispatch CSV</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF5500]" />
            </button>
          )}
        </div>

        {/* Module 2: Subscribers & Corporate Desks */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                Subscribers Directory
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                {activeSubsCount} Active
              </span>
            </div>
            
            <h3 className="font-black text-lg font-display text-[#1E140A]">
              Corporate Hubs & Desks
            </h3>

            <div className="space-y-2">
              {store.subscribers.slice(0, 3).map((sub) => (
                <div key={sub.id} className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#1E140A]/10 text-xs flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="font-bold text-[#1E140A] truncate">{sub.name}</div>
                    <div className="text-[10px] text-[#1E140A]/60 truncate">{sub.company} • {sub.zone}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {sub.creditsBalance} Credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E140A] hover:bg-[#2A1D0F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View All Subscribers & Users</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          )}
        </div>

        {/* Module 3: Tomorrow's Dish & Kitchen Menu */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                Tomorrow's Recipe
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                {tomorrowMeal?.dayOfWeek || 'Weekday'} Special
              </span>
            </div>
            
            <h3 className="font-black text-lg font-display text-[#1E140A] truncate">
              {tomorrowMeal?.name || 'Chef Daily Special'}
            </h3>

            {tomorrowMeal && (
              <div className="space-y-2">
                <div className="h-24 rounded-2xl overflow-hidden bg-stone-100 relative border border-stone-200">
                  <img
                    src={tomorrowMeal.image}
                    alt={tomorrowMeal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                    {tomorrowMeal.spiceLevel}
                  </div>
                </div>
                <p className="text-xs text-[#1E140A]/70 line-clamp-2 leading-relaxed">
                  {tomorrowMeal.description}
                </p>
              </div>
            )}
          </div>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('menu')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E140A] hover:bg-[#2A1D0F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Edit Menu & Upload Food Image</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>

      </div>

      {/* ANNOUNCEMENTS MANAGER ("Savage Colleague" Alerts & Flash Broadcasts) */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#1E140A] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center font-bold shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg font-display text-white">
                  Announcements Manager
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5500] text-white text-[10px] font-bold uppercase tracking-wider">
                  Live Push
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Push "Savage Colleague" alerts and flash broadcasts to all active Lagos office workers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsComposing(!isComposing)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1E140A] text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {isComposing ? 'Close Composer' : '+ New Broadcast Alert'}
          </button>
        </div>

        {/* Live Composer Drawer */}
        <AnimatePresence>
          {isComposing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#FAF4EB] border-b border-[#1E140A]/10 p-6 sm:p-8 space-y-6 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF5500]">
                  Create Real-time Flash Broadcast
                </span>
                <span className="text-[11px] text-[#1E140A]/60">
                  Broadcasts sync instantly via BroadcastChannel & Local Storage
                </span>
              </div>

              {/* Quick Template Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1E140A]/70">
                  Quick Savage Templates:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {quickTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAnnTitle(t.title);
                        setAnnMessage(t.msg);
                        setAnnType(t.type);
                      }}
                      className="p-3 rounded-2xl bg-white border border-[#1E140A]/10 text-left hover:border-[#FF5500] transition-all cursor-pointer text-xs"
                    >
                      <div className="font-bold text-[#1E140A] truncate">{t.title}</div>
                      <div className="text-[11px] text-[#1E140A]/60 truncate mt-0.5">{t.msg}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E140A] mb-1">
                      Alert Type / Severity *
                    </label>
                    <select
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-bold text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    >
                      <option value="savage">🚨 Savage Colleague / Fridge Alert</option>
                      <option value="alert">🌧️ Weather & Falomo Traffic Advisory</option>
                      <option value="warning">🌶️ Chef Heat & Pepper Notice</option>
                      <option value="info">ℹ️ Kitchen Schedule / General Info</option>
                      <option value="promo">🎁 Promo & Flash Voucher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E140A] mb-1">
                      Target Audience / Floor
                    </label>
                    <select
                      value={annAudience}
                      onChange={(e) => setAnnAudience(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-bold text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    >
                      <option value="all">All Lagos Subscribers</option>
                      <option value="vi">Victoria Island (VI) Desks Only</option>
                      <option value="ikoyi">Ikoyi Hubs Only</option>
                      <option value="marina">Marina & Lagos Island Only</option>
                      <option value="mainland">Yaba / Mainland Offices Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Alert Headline / Banner *
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. 🚨 Savage Colleague Alert: Protect Your Meal Box!"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] font-bold focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Detailed Broadcast Copy *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="Describe the dispatch note, colleague warning, or kitchen update clearly..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                {/* Preview Box */}
                {annTitle && (
                  <div className="p-4 rounded-2xl bg-white border border-[#1E140A]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Live User Dashboard Preview
                      </span>
                      <span className="text-[10px] bg-[#FF5500]/15 text-[#FF5500] px-2 py-0.5 rounded-md font-bold">
                        {annAudience.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1E140A] text-white flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center font-bold shrink-0 text-sm">
                        🚨
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{annTitle}</div>
                        <div className="text-[11px] text-stone-300 mt-0.5">{annMessage}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#1E140A]/15 text-[#1E140A] text-xs font-bold hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-md shadow-[#FF5500]/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast Now</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Announcements Feed */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E140A]/60">
              Active Broadcasts & Alert History ({store.announcements.length})
            </h4>
            <span className="text-[11px] text-[#1E140A]/50">
              Click toggle to activate/deactivate in real-time
            </span>
          </div>

          <div className="space-y-3">
            {store.announcements.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#1E140A]/50">
                No active announcements currently pushed.
              </div>
            ) : (
              store.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    ann.isActive 
                      ? 'bg-white border-[#1E140A]/15 shadow-xs' 
                      : 'bg-stone-100/70 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      ann.type === 'savage'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.type === 'alert'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ann.type === 'savage' ? '🚨' : ann.type === 'alert' ? '🌧️' : '📢'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="font-bold text-sm text-[#1E140A]">
                          {ann.title}
                        </h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ann.isActive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-stone-200 text-stone-600'
                        }`}>
                          {ann.isActive ? 'Live on Users Screen' : 'Deactivated'}
                        </span>
                        <span className="text-[10px] font-mono text-[#1E140A]/50 bg-stone-100 px-2 py-0.5 rounded-md">
                          Audience: {ann.audience.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-[#1E140A]/70 leading-relaxed max-w-2xl">
                        {ann.message}
                      </p>
                      <div className="text-[10px] text-[#1E140A]/50">
                        Pushed {ann.timestamp} by {ann.author}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => actions.toggleAnnouncement(ann.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        ann.isActive
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {ann.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => actions.deleteAnnouncement(ann.id)}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Live Dispatch & Kitchen Ops Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Dispatch Roster */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#FF5500]" />
              <h4 className="font-black text-base font-display text-[#1E140A]">
                Active Lagos Dispatch Fleet
              </h4>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              3 Riders on Island Express
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Emeka Nwosu', bike: 'Honda 125 (KJA-482-XY)', route: 'Marina & Falomo Corridor', drops: '6 / 8 Completed', status: 'In Transit' },
              { name: 'Taiwo Afolabi', bike: 'Yamaha 150 (LSR-301-AA)', route: 'Victoria Island & Lekki 1', drops: '4 / 7 Completed', status: 'In Transit' },
              { name: 'Ibrahim Sani', bike: 'Honda 125 (GGE-910-BC)', route: 'Yaba / Commercial Ave Hub', drops: '5 / 5 Completed', status: 'All Delivered' },
            ].map((rider, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1E140A]">{rider.name}</div>
                  <div className="text-[11px] text-[#1E140A]/60">{rider.bike} • {rider.route}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rider.status === 'All Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FF5500]/15 text-[#FF5500]'
                  }`}>
                    {rider.status}
                  </span>
                  <div className="text-[10px] font-mono text-[#1E140A]/60 mt-0.5">{rider.drops}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8:00 PM Master Cutoff Controller */}
        <div className="bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#FF5500] tracking-wider">
                Daily Operational Deadlines
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700">
                Rule Engine
              </span>
            </div>
            <h4 className="font-black text-lg font-display text-[#1E140A]">
              8:00 PM Cutoff & 12:00 PM Skip Rules
            </h4>
            <p className="text-xs text-[#1E140A]/70 leading-relaxed">
              At 8:00 PM, tomorrow's 3-way choice buttons automatically lock across all user dashboards. 
              Skips for today's lunch must occur before 12:00 PM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E140A] text-white space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span>Auto-Lock at 8:00 PM:</span>
              <span className="font-mono text-emerald-400 font-bold">ACTIVE (Enabled)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Standard Meal Price:</span>
              <span className="font-mono text-[#FF5500] font-bold">₦2,900 / meal</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Tamper Seal Compliance:</span>
              <span className="font-mono text-emerald-400 font-bold">100% Enforced</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
