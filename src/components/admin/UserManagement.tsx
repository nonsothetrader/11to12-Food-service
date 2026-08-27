import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  PauseCircle,
  Clock
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { AdminSubscriber } from '../../lib/store';

export default function UserManagement() {
  const { store, actions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState<AdminSubscriber | null>(null);
  const [creditAdjustmentMsg, setCreditAdjustmentMsg] = useState<string | null>(null);

  const filteredSubs = store.subscribers.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdjustCredits = (subId: string, amount: number, subName: string) => {
    actions.adjustUserCredits(subId, amount);
    setCreditAdjustmentMsg(`${amount > 0 ? '+' : ''}${amount} Credit(s) updated for ${subName} in real-time!`);
    setTimeout(() => setCreditAdjustmentMsg(null), 3500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Desk Directory
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              {store.subscribers.length} Registered Lagos Desks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Subscribers & User Management
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Manage subscriber accounts, adjust Lunch Insurance credits in real-time, and update office drop routes.
          </p>
        </div>
      </div>

      {/* Credit adjustment alert */}
      <AnimatePresence>
        {creditAdjustmentMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{creditAdjustmentMsg}</span>
            </div>
            <button onClick={() => setCreditAdjustmentMsg(null)} className="text-emerald-200 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#1E140A]/10 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#1E140A]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search subscriber by name, company, email, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A] font-medium focus:outline-none focus:border-[#FF5500]"
          />
        </div>

        <div className="text-xs font-mono text-[#1E140A]/60">
          Showing {filteredSubs.length} subscribers
        </div>
      </div>

      {/* Subscribers Grid / Table */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E140A]">
            <thead className="bg-[#1E140A] text-white text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Subscriber Name</th>
                <th className="py-3.5 px-4">Office & Desk Location</th>
                <th className="py-3.5 px-4">Plan & Preferences</th>
                <th className="py-3.5 px-4 text-center">Lunch Insurance Credits</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Credit Adjuster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E140A]/10">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FAF4EB]/60 transition-colors">
                  
                  {/* Name & Contact */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-[#1E140A] text-sm">
                      {sub.name}
                    </div>
                    <div className="text-[11px] text-[#1E140A]/60 flex items-center gap-1.5 mt-0.5">
                      <span>{sub.email}</span>
                      <span>•</span>
                      <span>{sub.phone}</span>
                    </div>
                  </td>

                  {/* Office & Desk */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1E140A]">
                      {sub.company}
                    </div>
                    <div className="text-[11px] text-[#1E140A]/70 truncate max-w-[200px]">
                      {sub.building}, {sub.floor}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-mono text-[#FF5500] font-bold">
                      {sub.zone}
                    </span>
                  </td>

                  {/* Plan */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1E140A]">
                      {sub.plan}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        sub.dietaryPref === 'FitFam / Low Carb'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.dietaryPref}
                      </span>
                      <span className="text-[10px] font-mono text-stone-600">
                        {sub.spiceLevel}
                      </span>
                    </div>
                  </td>

                  {/* Credits Balance */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF4EB] border border-[#1E140A]/10 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                      <span className="text-sm font-black font-display text-[#1E140A]">
                        {sub.creditsBalance}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">Credits</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      sub.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>

                  {/* Credit Adjuster Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustCredits(sub.id, -1, sub.name)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1E140A] flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Deduct 1 Credit"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdjustCredits(sub.id, 1, sub.name)}
                        className="w-7 h-7 rounded-lg bg-[#FF5500] hover:bg-[#E04B00] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs"
                        title="Add 1 Rollover Credit"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdjustCredits(sub.id, 5, sub.name)}
                        className="px-2 py-1 rounded-lg bg-[#1E140A] text-white font-bold text-[10px] hover:bg-black cursor-pointer ml-1"
                        title="Add +5 Bonus Pack"
                      >
                        +5 Bonus
                      </button>
                    </div>
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
