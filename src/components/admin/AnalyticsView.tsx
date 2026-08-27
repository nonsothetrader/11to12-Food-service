import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Percent, 
  DollarSign
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';

export default function AnalyticsView() {
  const { store } = useAppStore();

  const zonePerformance = [
    { zone: 'Victoria Island (VI)', punctuality: '99.8%', activeDesks: 64, avgDropTime: '11:18 AM' },
    { zone: 'Ikoyi (Falomo & Banana)', punctuality: '99.5%', activeDesks: 38, avgDropTime: '11:22 AM' },
    { zone: 'Marina / Lagos Island CBD', punctuality: '99.1%', activeDesks: 35, avgDropTime: '11:25 AM' },
    { zone: 'Yaba / Mainland Tech Hub', punctuality: '98.9%', activeDesks: 28, avgDropTime: '11:34 AM' },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
            Operational Intelligence
          </span>
          <span className="text-xs text-[#1E140A]/50 font-mono">
            30-Day Cohort Analytics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
          Analytics & Punctuality Intelligence
        </h1>
        <p className="text-xs text-[#1E140A]/70 mt-0.5">
          Real-time metrics tracking on-time 11:00 AM – 12:00 PM drops, route efficiency, and subscription retention.
        </p>
      </div>

      {/* 3 Large KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#1E140A] text-white p-6 sm:p-7 rounded-3xl space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#FF5500]">
            System Punctuality Index
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-white">
            {store.metrics.onTimePunctualityPercent}%
          </div>
          <p className="text-xs text-stone-300 leading-relaxed pt-1">
            4,890 total meals delivered. Zero missed lunches in the 11:00 AM – 12:00 PM window.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
            Subscriber Retention Rate
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-emerald-600">
            91.4%
          </div>
          <p className="text-xs text-[#1E140A]/70 leading-relaxed pt-1">
            High 30-day renewal rate driven by Lunch Insurance credit rollover and strict menu alternation.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#1E140A]/60">
            Tamper Seal Satisfaction
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-[#1E140A]">
            99.9%
          </div>
          <p className="text-xs text-[#1E140A]/70 leading-relaxed pt-1">
            Subscribers report 100% seal integrity on arrival at office reception / desk.
          </p>
        </div>

      </div>

      {/* Zone Performance Table */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-sm p-6 sm:p-8 space-y-4">
        <h3 className="font-black text-lg font-display text-[#1E140A]">
          Zone-by-Zone Delivery & Punctuality Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E140A]">
            <thead className="bg-[#FAF4EB] text-[10px] font-black uppercase tracking-wider text-[#1E140A]/70">
              <tr>
                <th className="py-3 px-4">Lagos Zone</th>
                <th className="py-3 px-4">Active Desks</th>
                <th className="py-3 px-4">Average Drop Arrival</th>
                <th className="py-3 px-4">Punctuality Score</th>
                <th className="py-3 px-4 text-right">Route Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E140A]/10">
              {zonePerformance.map((zp, i) => (
                <tr key={i} className="hover:bg-[#FAF4EB]/50">
                  <td className="py-4 px-4 font-bold text-[#1E140A] text-sm">
                    {zp.zone}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold">
                    {zp.activeDesks} Desks
                  </td>
                  <td className="py-4 px-4 font-mono text-[#FF5500] font-bold">
                    {zp.avgDropTime}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px]">
                      {zp.punctuality}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[11px] font-bold text-emerald-600">
                      ✓ Flowing Smoothly
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
