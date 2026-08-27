import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Bike, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Phone, 
  MapPin, 
  Building2, 
  ChevronRight, 
  UserCheck, 
  AlertCircle,
  Truck,
  Download,
  Printer,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  PlusCircle,
  MinusCircle,
  Calendar,
  CreditCard,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { AdminOrder, OrderStatus, DecisionType } from '../../lib/store';

export default function OrderManagement() {
  const { store, actions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all_next_day' | 'explicit_accept' | 'auto_accepted' | 'skipped' | 'cancelled' | 'today'>('all_next_day');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [assignRiderModalOrder, setAssignRiderModalOrder] = useState<AdminOrder | null>(null);
  const [riderNameInput, setRiderNameInput] = useState('Emeka Nwosu');
  const [riderPhoneInput, setRiderPhoneInput] = useState('0803 999 1122');
  const [showPrintManifest, setShowPrintManifest] = useState(false);
  const [plateEditOrder, setPlateEditOrder] = useState<AdminOrder | null>(null);
  const [editExtraPlates, setEditExtraPlates] = useState<number>(0);

  const availableRiders = [
    { name: 'Emeka Nwosu', phone: '0803 999 1122', zone: 'Victoria Island & Marina' },
    { name: 'Taiwo Afolabi', phone: '0805 777 8899', zone: 'Ikoyi & Lekki 1' },
    { name: 'Ibrahim Sani', phone: '0802 111 4455', zone: 'Yaba / Mainland' },
  ];

  // Tab counts
  const counts = useMemo(() => {
    const nextDayOrders = store.orders.filter(o => o.isNextDayOrder !== false);
    return {
      all_next_day: nextDayOrders.length,
      explicit_accept: nextDayOrders.filter(o => o.decisionType === 'explicit_accept').length,
      auto_accepted: nextDayOrders.filter(o => o.decisionType === 'auto_accepted').length,
      skipped: nextDayOrders.filter(o => o.decisionType === 'skipped').length,
      cancelled: nextDayOrders.filter(o => o.decisionType === 'cancelled').length,
      today: store.orders.filter(o => o.isNextDayOrder === false).length,
      totalPlatesToCook: nextDayOrders.reduce((sum, o) => sum + (o.choice === 'accept' ? (o.totalPlates || 1) : 0), 0),
      totalCreditsUsed: nextDayOrders.reduce((sum, o) => sum + (o.creditsUsed || 0), 0),
    };
  }, [store.orders]);

  // Filtered dataset
  const filteredOrders = useMemo(() => {
    return store.orders.filter(order => {
      // Tab filter
      if (activeTab === 'all_next_day' && order.isNextDayOrder === false) return false;
      if (activeTab === 'explicit_accept' && (order.isNextDayOrder === false || order.decisionType !== 'explicit_accept')) return false;
      if (activeTab === 'auto_accepted' && (order.isNextDayOrder === false || order.decisionType !== 'auto_accepted')) return false;
      if (activeTab === 'skipped' && (order.isNextDayOrder === false || order.decisionType !== 'skipped')) return false;
      if (activeTab === 'cancelled' && (order.isNextDayOrder === false || order.decisionType !== 'cancelled')) return false;
      if (activeTab === 'today' && order.isNextDayOrder !== false) return false;

      // Zone filter
      if (zoneFilter !== 'All' && order.zone !== zoneFilter) return false;

      // Search filter
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matches = 
          order.customerName.toLowerCase().includes(q) ||
          order.email.toLowerCase().includes(q) ||
          order.phone.toLowerCase().includes(q) ||
          order.company.toLowerCase().includes(q) ||
          order.building.toLowerCase().includes(q) ||
          order.orderNumber.toLowerCase().includes(q) ||
          (order.riderName && order.riderName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [store.orders, activeTab, zoneFilter, searchTerm]);

  // Handle Assign Rider
  const handleAssignRiderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignRiderModalOrder) return;
    actions.assignRider(assignRiderModalOrder.id, riderNameInput, riderPhoneInput);
    setAssignRiderModalOrder(null);
  };

  // Handle Export Dispatch CSV
  const handleDownloadDispatchSheet = () => {
    const deliveringOrders = store.orders.filter(o => o.isNextDayOrder !== false && o.choice === 'accept');
    
    const headers = [
      'Order Number',
      'Customer Name',
      'Phone Number',
      'Email',
      'Company',
      'Delivery Building',
      'Floor / Desk / Wing',
      'Zone',
      'Decision Status',
      'Total Plates to Deliver',
      'Standard Plates',
      'Extra Plates (Credit Used)',
      'Credits Deducted',
      'Meal Name',
      'Dietary Preference',
      'Spice Level',
      'Special Delivery Notes',
      'Assigned Rider',
      'Rider Phone',
      'Delivery Window'
    ];

    const rows = deliveringOrders.map(o => [
      `"${o.orderNumber}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.email}"`,
      `"${o.company}"`,
      `"${o.building}"`,
      `"${o.floor}"`,
      `"${o.zone}"`,
      `"${o.decisionType === 'auto_accepted' ? 'Auto-Accepted by System (No User Action)' : 'Explicitly Accepted'}"`,
      o.totalPlates || (1 + (o.extraPlatesFromCredits || 0)),
      o.standardPlates ?? 1,
      o.extraPlatesFromCredits || 0,
      o.creditsUsed || 0,
      `"${o.mealName}"`,
      `"${o.dietaryPreference}"`,
      `"${o.spiceLevel}"`,
      `"${(o.deliveryNotes || '').replace(/"/g, '""')}"`,
      `"${o.riderName}"`,
      `"${o.riderPhone}"`,
      `"${o.timeSlot}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `11to12_Rider_Dispatch_Manifest_NextDay_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSavePlateChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateEditOrder) return;
    actions.updateOrderExtraPlates(plateEditOrder.id, editExtraPlates);
    setPlateEditOrder(null);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* 8:00 PM Lock Status Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#1E140A] text-white border border-[#1E140A]/20 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-3 rounded-2xl ${store.is8PMLocked ? 'bg-[#FF5500]/20 text-[#FF5500]' : 'bg-emerald-500/20 text-emerald-400'} shrink-0`}>
            {store.is8PMLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider">
                {store.is8PMLocked ? '8:00 PM Orders Locked' : 'Pre-Cutoff Window Open'}
              </span>
              <span className="text-xs text-white/70 font-mono">
                {store.nextDeliveryDateLabel || 'Tomorrow (8:00 PM Locked)'}
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {store.is8PMLocked ? (
                <span>All next-day subscribers are locked in for kitchen production. Subscribers who took no action have been <strong>Auto-Accepted</strong> by the system with 1 standard plate.</span>
              ) : (
                <span>Subscribers can still accept, skip (+1 rollover credit), or add extra plates using credits until 8:00 PM.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => actions.toggle8PMLock()}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              store.is8PMLocked 
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700' 
                : 'bg-[#FF5500] hover:bg-[#E04B00] text-white'
            }`}
          >
            {store.is8PMLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{store.is8PMLocked ? 'Force Unlock Window' : 'Trigger 8 PM Lock'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleDownloadDispatchSheet}
            className="px-4 py-2 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Download CSV for Dispatch Riders"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dispatch Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrintManifest(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Print Manifest"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Kitchen Production Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#1E140A]/10 shadow-xs">
          <div className="text-[11px] font-bold text-[#1E140A]/60 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Total Plates to Cook</span>
          </div>
          <div className="text-2xl font-black font-display text-[#1E140A] mt-1">
            {counts.totalPlatesToCook} <span className="text-xs font-normal text-stone-500 font-sans">plates</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
            Standard + Extra Credit Plates
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#1E140A]/10 shadow-xs">
          <div className="text-[11px] font-bold text-[#1E140A]/60 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Extra Plates (Credits Used)</span>
          </div>
          <div className="text-2xl font-black font-display text-blue-600 mt-1">
            +{counts.totalCreditsUsed} <span className="text-xs font-normal text-stone-500 font-sans">credits deducted</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            Real-time subscriber credit burn
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#1E140A]/10 shadow-xs">
          <div className="text-[11px] font-bold text-[#1E140A]/60 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Auto-Accepted by System</span>
          </div>
          <div className="text-2xl font-black font-display text-purple-700 mt-1">
            {counts.auto_accepted} <span className="text-xs font-normal text-stone-500 font-sans">users</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            Defaulted at 8:00 PM cutoff
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#1E140A]/10 shadow-xs">
          <div className="text-[11px] font-bold text-[#1E140A]/60 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Skipped & Rolled Over</span>
          </div>
          <div className="text-2xl font-black font-display text-amber-700 mt-1">
            {counts.skipped} <span className="text-xs font-normal text-stone-500 font-sans">users</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            +1 credit added to insurance
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1E140A]/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('all_next_day')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all_next_day'
              ? 'bg-[#1E140A] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-[#1E140A]/70 border border-[#1E140A]/10'
          }`}
        >
          <span>All Next-Day Orders</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all_next_day' ? 'bg-[#FF5500] text-white' : 'bg-stone-200 text-stone-800'}`}>
            {counts.all_next_day}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('explicit_accept')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'explicit_accept'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-[#1E140A]/70 border border-[#1E140A]/10'
          }`}
        >
          <span>Explicitly Accepted</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'explicit_accept' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {counts.explicit_accept}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auto_accepted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'auto_accepted'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-[#1E140A]/70 border border-[#1E140A]/10'
          }`}
        >
          <span>Auto-Accepted (No Action)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'auto_accepted' ? 'bg-white text-purple-800' : 'bg-purple-100 text-purple-800'}`}>
            {counts.auto_accepted}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skipped')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'skipped'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-[#1E140A]/70 border border-[#1E140A]/10'
          }`}
        >
          <span>Skipped (Banked Credit)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'skipped' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800'}`}>
            {counts.skipped}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cancelled'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-[#1E140A]/70 border border-[#1E140A]/10'
          }`}
        >
          <span>Cancelled</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'cancelled' ? 'bg-white text-rose-800' : 'bg-rose-100 text-rose-800'}`}>
            {counts.cancelled}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
            activeTab === 'today'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
          }`}
        >
          <span>Today's Active Dispatch</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'today' ? 'bg-white text-blue-800' : 'bg-blue-200 text-blue-900'}`}>
            {counts.today}
          </span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#1E140A]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#1E140A]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone, company, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A] font-medium focus:outline-none focus:border-[#FF5500]"
          />
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#1E140A]/50" />
          <span className="text-xs font-bold text-[#1E140A]/70">Lagos Zone:</span>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-bold text-[#1E140A] cursor-pointer"
          >
            <option value="All">All Delivery Zones</option>
            <option value="Victoria Island">Victoria Island</option>
            <option value="Ikoyi">Ikoyi</option>
            <option value="Marina / Lagos Island">Marina / Lagos Island</option>
            <option value="Lekki Phase 1">Lekki Phase 1</option>
            <option value="Yaba / Mainland">Yaba / Mainland</option>
          </select>
        </div>
      </div>

      {/* Orders & Plates Table */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E140A]">
            <thead className="bg-[#1E140A] text-white text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Customer & Phone</th>
                <th className="py-3.5 px-4">Desk Delivery Address</th>
                <th className="py-3.5 px-4">Plates & Credits Used</th>
                <th className="py-3.5 px-4">Decision / Lock Status</th>
                <th className="py-3.5 px-4">Meal & Dietary</th>
                <th className="py-3.5 px-4">Rider Assigned</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E140A]/10 font-sans">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#1E140A]/50">
                    No orders found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isAccepted = order.choice === 'accept';
                  const extraPlates = order.extraPlatesFromCredits || 0;
                  const totalPlates = order.totalPlates || (isAccepted ? 1 + extraPlates : 0);

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF4EB]/60 transition-colors">
                      
                      {/* Customer & Phone */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-[#1E140A] text-sm flex items-center gap-1.5">
                          <span>{order.customerName}</span>
                        </div>
                        <div className="text-[11px] text-[#1E140A]/70 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#FF5500]" />
                          <span className="font-mono font-bold text-[#1E140A]">{order.phone}</span>
                        </div>
                        <div className="text-[10px] text-[#1E140A]/50 font-mono mt-0.5">
                          {order.orderNumber} • {order.email}
                        </div>
                      </td>

                      {/* Desk Location */}
                      <td className="py-4 px-4 max-w-[240px]">
                        <div className="font-bold text-[#1E140A] flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                          <span className="truncate">{order.company}</span>
                        </div>
                        <div className="text-[11px] text-[#1E140A]/80 truncate mt-0.5">
                          {order.building}
                        </div>
                        <div className="text-[10px] text-[#1E140A]/60 truncate">
                          {order.floor}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                          {order.zone}
                        </span>
                      </td>

                      {/* Plates & Credits Used */}
                      <td className="py-4 px-4">
                        {isAccepted ? (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200">
                              <span className="text-sm font-black font-display text-[#FF5500]">
                                {totalPlates} {totalPlates === 1 ? 'Plate' : 'Plates'}
                              </span>
                            </div>
                            
                            {extraPlates > 0 ? (
                              <div className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Used {extraPlates} {extraPlates === 1 ? 'Credit' : 'Credits'} (+{extraPlates} extra)</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-stone-500">
                                Standard Subscription (1 Plate)
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setPlateEditOrder(order);
                                setEditExtraPlates(order.extraPlatesFromCredits || 0);
                              }}
                              className="text-[10px] text-[#FF5500] hover:underline font-bold block cursor-pointer"
                            >
                              Edit Plate/Credit Count
                            </button>
                          </div>
                        ) : order.choice === 'skip' ? (
                          <div className="text-[11px] font-bold text-amber-700">
                            0 Plates (Skipped)
                            <div className="text-[10px] font-normal text-amber-900/70">+1 Credit Rolled Over</div>
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold text-rose-700">
                            0 Plates (Cancelled)
                          </div>
                        )}
                      </td>

                      {/* Decision & 8 PM Lock Status */}
                      <td className="py-4 px-4">
                        {order.decisionType === 'auto_accepted' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>Auto-Accepted (No Action)</span>
                            </span>
                            <div className="text-[10px] text-stone-500">
                              Locked in at 8:00 PM cutoff
                            </div>
                          </div>
                        )}

                        {order.decisionType === 'explicit_accept' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Explicitly Accepted</span>
                            </span>
                            <div className="text-[10px] text-stone-500 font-mono">
                              {order.timestamp}
                            </div>
                          </div>
                        )}

                        {order.decisionType === 'skipped' && (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Skipped Day</span>
                            </span>
                            <div className="text-[10px] text-amber-800">
                              Insurance Wallet Updated
                            </div>
                          </div>
                        )}

                        {order.decisionType === 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </td>

                      {/* Meal & Dietary */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-bold text-[#1E140A] truncate">
                          {order.mealName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            order.dietaryPreference === 'FitFam / Low Carb'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.dietaryPreference}
                          </span>
                          <span className="text-[10px] font-mono text-[#1E140A]/60">
                            {order.spiceLevel}
                          </span>
                        </div>
                        {order.deliveryNotes && (
                          <div className="text-[10px] text-[#1E140A]/70 truncate italic mt-0.5">
                            Note: {order.deliveryNotes}
                          </div>
                        )}
                      </td>

                      {/* Rider Assigned */}
                      <td className="py-4 px-4">
                        {isAccepted ? (
                          <div>
                            <div className="font-bold text-[#1E140A] flex items-center gap-1">
                              <Bike className="w-3.5 h-3.5 text-[#FF5500]" />
                              <span>{order.riderName || 'Unassigned'}</span>
                            </div>
                            <div className="text-[10px] text-[#1E140A]/60 font-mono">
                              {order.riderPhone}
                            </div>
                            <button
                              type="button"
                              onClick={() => setAssignRiderModalOrder(order)}
                              className="text-[10px] text-[#FF5500] hover:underline font-bold mt-0.5 cursor-pointer block"
                            >
                              Change Rider
                            </button>
                          </div>
                        ) : (
                          <span className="text-stone-400 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E140A] text-[11px] font-bold cursor-pointer"
                            title="View Full Delivery Card"
                          >
                            Details
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Extra Plates Modal */}
      <AnimatePresence>
        {plateEditOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setPlateEditOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#1E140A]/10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider">
                  Plate & Credit Adjustment
                </span>
                <h3 className="text-xl font-black font-display text-[#1E140A]">
                  {plateEditOrder.customerName}
                </h3>
                <p className="text-xs text-[#1E140A]/70 mt-1">
                  Adjust standard subscription plates + extra plates requested via credit rollover.
                </p>
              </div>

              <form onSubmit={handleSavePlateChanges} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1E140A]">Standard Subscription Plate:</span>
                    <span className="font-black text-[#1E140A]">1 Plate (Included)</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-[#1E140A]/10">
                    <span className="font-bold text-[#1E140A]">Extra Plates (from Credits):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditExtraPlates(v => Math.max(0, v - 1))}
                        className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-[#1E140A] cursor-pointer"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span className="font-black text-sm w-6 text-center">{editExtraPlates}</span>
                      <button
                        type="button"
                        onClick={() => setEditExtraPlates(v => v + 1)}
                        className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-[#1E140A] cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-[#1E140A]/10">
                    <span className="font-black text-[#FF5500]">Total Plates to Deliver:</span>
                    <span className="font-black text-base text-[#FF5500]">
                      {1 + editExtraPlates} Plates ({editExtraPlates} {editExtraPlates === 1 ? 'Credit' : 'Credits'} Used)
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPlateEditOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-stone-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Save & Update Real-Time Kitchen Count
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#1E140A]/10 text-left max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E140A]/10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500]">
                    Dispatch Ticket Card
                  </span>
                  <h3 className="text-xl font-black font-display text-[#1E140A]">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-1.5">
                  <div className="font-black text-sm text-[#1E140A]">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-[#1E140A]/80">
                    <span className="font-bold">Phone: </span> <span className="font-mono font-bold text-[#FF5500]">{selectedOrder.phone}</span>
                  </div>
                  <div className="text-[#1E140A]/80">
                    <span className="font-bold">Email: </span> {selectedOrder.email}
                  </div>
                </div>

                {/* Desk Address */}
                <div className="p-4 rounded-2xl bg-white border border-[#1E140A]/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#1E140A]">
                    <Building2 className="w-4 h-4 text-[#FF5500]" />
                    <span>{selectedOrder.company}</span>
                  </div>
                  <div className="text-[#1E140A]/70">
                    <span className="font-bold">Building: </span> {selectedOrder.building}
                  </div>
                  <div className="text-[#1E140A]/70">
                    <span className="font-bold">Floor / Wing: </span> {selectedOrder.floor}
                  </div>
                  <div className="text-[#1E140A]/70">
                    <span className="font-bold">Zone: </span> {selectedOrder.zone}
                  </div>
                  {selectedOrder.deliveryNotes && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium mt-2">
                      <span className="font-bold">Special Note: </span> {selectedOrder.deliveryNotes}
                    </div>
                  )}
                </div>

                {/* Plates & Decision Details */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2">
                  <div className="font-bold text-[#1E140A] flex items-center justify-between">
                    <span>Delivery Plate Breakdown:</span>
                    <span className="font-black text-[#FF5500] text-sm">
                      {selectedOrder.choice === 'accept' ? `${selectedOrder.totalPlates || 1} Plates Total` : '0 Plates'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#1E140A]/70">
                    • Standard Plan: {selectedOrder.choice === 'accept' ? '1 Plate' : '0 Plates'}<br />
                    • Extra Credit Plates: +{selectedOrder.extraPlatesFromCredits || 0} Plates ({selectedOrder.creditsUsed || 0} credits used)<br />
                    • Decision Type: <strong>{selectedOrder.decisionType || 'explicit_accept'}</strong>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1E140A]">
                    Override Decision Status:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        actions.updateOrderDecision(selectedOrder.id, 'accept', 'explicit_accept');
                        setSelectedOrder({ ...selectedOrder, choice: 'accept', decisionType: 'explicit_accept' });
                      }}
                      className={`p-2 rounded-xl text-center font-bold text-xs cursor-pointer ${
                        selectedOrder.choice === 'accept' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Accept (Deliver)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        actions.updateOrderDecision(selectedOrder.id, 'skip', 'skipped');
                        setSelectedOrder({ ...selectedOrder, choice: 'skip', decisionType: 'skipped' });
                      }}
                      className={`p-2 rounded-xl text-center font-bold text-xs cursor-pointer ${
                        selectedOrder.choice === 'skip' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Skip (+1 Credit)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        actions.updateOrderDecision(selectedOrder.id, 'cancel', 'cancelled');
                        setSelectedOrder({ ...selectedOrder, choice: 'cancel', decisionType: 'cancelled' });
                      }}
                      className={`p-2 rounded-xl text-center font-bold text-xs cursor-pointer ${
                        selectedOrder.choice === 'cancel' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E140A] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Rider Modal */}
      <AnimatePresence>
        {assignRiderModalOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setAssignRiderModalOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#1E140A]/10 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider">
                  Dispatch Assignment
                </span>
                <h3 className="text-xl font-black font-display text-[#1E140A]">
                  Assign Rider to {assignRiderModalOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#1E140A]/70 mt-1">
                  Destination: {assignRiderModalOrder.company} ({assignRiderModalOrder.zone})
                </p>
              </div>

              <form onSubmit={handleAssignRiderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1E140A]">
                    Select Available Rider:
                  </label>
                  <div className="space-y-2">
                    {availableRiders.map((r) => (
                      <button
                        key={r.name}
                        type="button"
                        onClick={() => {
                          setRiderNameInput(r.name);
                          setRiderPhoneInput(r.phone);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs cursor-pointer transition-all ${
                          riderNameInput === r.name
                            ? 'bg-[#FAF4EB] border-[#FF5500]'
                            : 'bg-white border-[#1E140A]/10'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[#1E140A]">{r.name}</div>
                          <div className="text-[11px] text-[#1E140A]/60">{r.zone}</div>
                        </div>
                        <div className="font-mono text-[#FF5500] font-bold">
                          {r.phone}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignRiderModalOrder(null)}
                    className="px-4 py-2 text-xs font-bold text-stone-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Confirm Rider
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printable Dispatch Sheet Modal */}
      <AnimatePresence>
        {showPrintManifest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPrintManifest(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-8 space-y-6 shadow-2xl border border-[#1E140A]/10 text-left my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1E140A]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl font-display text-[#1E140A]">11to12</span>
                    <span className="px-2 py-0.5 bg-[#FF5500] text-white text-[10px] font-black uppercase rounded">Rider Dispatch Sheet</span>
                  </div>
                  <p className="text-xs text-[#1E140A]/70 mt-1">
                    Next Day Batch Manifest • 11:00 AM – 12:00 PM Delivery Window • Locked at 8:00 PM
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#1E140A] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPrintManifest(false)}
                    className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-300">
                  <thead className="bg-stone-100 font-bold border-b border-stone-300 text-[11px]">
                    <tr>
                      <th className="p-2 border-r border-stone-300">#</th>
                      <th className="p-2 border-r border-stone-300">Customer Name & Phone</th>
                      <th className="p-2 border-r border-stone-300">Delivery Address & Floor</th>
                      <th className="p-2 border-r border-stone-300">Plates to Hand Over</th>
                      <th className="p-2 border-r border-stone-300">Meal & Dietary</th>
                      <th className="p-2 border-r border-stone-300">Special Notes</th>
                      <th className="p-2">Recipient Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-sans">
                    {store.orders.filter(o => o.isNextDayOrder !== false && o.choice === 'accept').map((o, idx) => (
                      <tr key={o.id} className="text-[11px]">
                        <td className="p-2 font-bold border-r border-stone-200">{idx + 1}</td>
                        <td className="p-2 border-r border-stone-200">
                          <div className="font-bold">{o.customerName}</div>
                          <div className="font-mono text-[#FF5500] font-bold">{o.phone}</div>
                        </td>
                        <td className="p-2 border-r border-stone-200">
                          <div className="font-bold">{o.company}</div>
                          <div>{o.building}, {o.floor}</div>
                          <div className="font-mono text-[10px] text-stone-500">{o.zone}</div>
                        </td>
                        <td className="p-2 font-bold text-center border-r border-stone-200 bg-orange-50/50">
                          <span className="text-sm font-black text-[#FF5500]">{o.totalPlates || 1}</span>
                          <div className="text-[9px] text-stone-500">
                            {o.extraPlatesFromCredits ? `(+${o.extraPlatesFromCredits} Credit)` : 'Std 1'}
                          </div>
                        </td>
                        <td className="p-2 border-r border-stone-200">
                          <div className="font-medium">{o.mealName}</div>
                          <div className="text-[10px] text-stone-500">{o.dietaryPreference} • {o.spiceLevel}</div>
                        </td>
                        <td className="p-2 border-r border-stone-200 text-[10px] text-stone-600 italic">
                          {o.deliveryNotes || '—'}
                        </td>
                        <td className="p-2 border-b border-stone-200 w-28"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs text-stone-500 pt-4 border-t border-stone-200">
                <div>Total Delivery Drops: <strong>{store.orders.filter(o => o.isNextDayOrder !== false && o.choice === 'accept').length} desks</strong></div>
                <div>Total Meals to Load in Warmer: <strong>{counts.totalPlatesToCook} plates</strong></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
