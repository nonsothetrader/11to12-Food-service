import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gift, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Percent, 
  Users
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { GiveawayEntry } from '../../lib/store';

export default function GiveawaysManagement() {
  const { store, actions } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [code, setCode] = useState('');
  const [campaign, setCampaign] = useState('');
  const [discountType, setDiscountType] = useState<GiveawayEntry['discountType']>('₦5,000 Off Plan');
  const [discountAmount, setDiscountAmount] = useState<number>(5000);
  const [maxUses, setMaxUses] = useState<number>(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !campaign.trim()) return;

    actions.createGiveawayCode(code, campaign, discountType, discountAmount, maxUses);
    setCode('');
    setCampaign('');
    setIsCreating(false);
  };

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Marketing & Floor Lotteries
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              {store.giveaways.filter(g => g.status === 'Active').length} Active Promo Campaigns
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Giveaway Entries & Promo Codes
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Create promotional discount codes, reward tech hub winners, and track redemption quotas in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Promo Code</span>
        </button>
      </div>

      {/* Creator Drawer */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E140A]/10">
              <h3 className="font-black text-lg font-display text-[#1E140A]">
                Create New Giveaway / Promo Voucher
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-stone-500 hover:text-black font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateCode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Voucher Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SURVIVAL-OCTOBER-10"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs font-mono font-bold uppercase text-[#1E140A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Campaign Name / Purpose *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Island Developer Hub Lottery"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setDiscountType(val);
                      if (val === '100% Free Week') setDiscountAmount(14500);
                      else if (val === '2 Free Meals') setDiscountAmount(5800);
                      else setDiscountAmount(5000);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-bold text-[#1E140A]"
                  >
                    <option value="₦5,000 Off Plan">₦5,000 Off Any Plan</option>
                    <option value="100% Free Week">100% Free Week (5 Workdays)</option>
                    <option value="2 Free Meals">2 Free Meal Credits</option>
                    <option value="Free Delivery Voucher">Free Island Delivery Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Discount Value (₦)
                  </label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-mono font-bold text-[#1E140A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-mono font-bold text-[#1E140A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save & Activate Voucher
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vouchers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {store.giveaways.map((give) => (
          <div
            key={give.id}
            className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  give.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                }`}>
                  {give.status}
                </span>

                <span className="text-[10px] text-stone-500 font-mono">
                  Expires {give.expiresAt}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 flex items-center justify-between">
                <span className="font-mono font-black text-base text-[#1E140A] tracking-wider">
                  {give.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(give.id, give.code)}
                  className="p-1.5 rounded-lg bg-white border border-[#1E140A]/10 text-stone-600 hover:text-black cursor-pointer"
                  title="Copy code"
                >
                  {copiedId === give.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h4 className="font-bold text-xs text-[#1E140A]">
                {give.campaign}
              </h4>
              <div className="text-[11px] text-[#1E140A]/70">
                Reward: <span className="font-bold text-[#FF5500]">{give.discountType}</span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#1E140A]/10">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#1E140A]/60">Redeemed:</span>
                <span className="font-mono font-bold text-[#1E140A]">
                  {give.usedCount} / {give.maxUses} uses
                </span>
              </div>

              <button
                type="button"
                onClick={() => actions.toggleGiveawayStatus(give.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  give.status === 'Active'
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                }`}
              >
                {give.status === 'Active' ? 'Deactivate Code' : 'Reactivate Code'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
