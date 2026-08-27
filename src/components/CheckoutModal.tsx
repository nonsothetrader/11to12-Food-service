import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, CreditCard, Building, Clock, User, Phone, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutSummary {
  selectedDates: string[];
  pricePerMeal: number;
  mealTotal: number;
  addonsTotal: number;
  grandTotal: number;
  selectedAddons: { id: string; name: string; pricePerDay: number }[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: CheckoutSummary;
}

export default function CheckoutModal({ isOpen, onClose, summary }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [locationZone, setLocationZone] = useState('Victoria Island');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [deskFloor, setDeskFloor] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('Leave on desk if on a call.');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'transfer' | 'corporate'>('paystack');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoMsg, setPromoMsg] = useState('');

  const handleApplyPromo = () => {
    if (promoCode.trim().length > 0) {
      setDiscountApplied(0.15); // 15% discount
      setPromoMsg('🎉 15% Lagos Corporate Discount Applied!');
    }
  };

  const finalAmount = Math.round(summary.grandTotal * (1 - discountApplied));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#FAF4EB] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#1E140A]/15 overflow-hidden my-8"
      >
        {/* Header bar */}
        <div className="bg-[#1E140A] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-display text-[#FF5500]">11to12</span>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h3 className="font-black text-base font-display">
                {step === 'details' ? 'Configure Desk Delivery' : 'Subscription Confirmed! 🎉'}
              </h3>
              <p className="text-xs text-stone-300 font-sans">
                {step === 'details' ? 'Direct to your office desk in Lagos' : 'Your 11:00 AM lunch drops are scheduled'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
            
            {/* Plan Snapshot Pill */}
            <div className="bg-[#FF5500]/10 rounded-2xl p-4 border border-[#FF5500]/25 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="font-black text-[#1E140A]">{summary.selectedDates.length} Workdays Locked</span>
                <div className="text-[#1E140A]/60 text-xs">
                  Standard Gourmet Lunch Plan (₦2,900 / meal)
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#1E140A]/60">Total Investment</div>
                <div className="text-lg font-black text-[#FF5500] font-display">{formatNaira(finalAmount)}</div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1E140A]/60">
                1. Your Work & Contact Info
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babatunde Okafor"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">WhatsApp / Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="080 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E140A] mb-1">Work Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="babatunde@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>

            {/* Office Desk Location */}
            <div className="space-y-4 pt-4 border-t border-[#1E140A]/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1E140A]/60">
                2. Lagos Office Location & Desk Info
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">Company / Organization *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. KPMG / Paystack / Sterling"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">Delivery Zone *</label>
                  <select
                    value={locationZone}
                    onChange={(e) => setLocationZone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1E140A]/15 text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500] bg-white"
                  >
                    <option value="Victoria Island">Victoria Island (VI)</option>
                    <option value="Ikoyi">Ikoyi</option>
                    <option value="Marina / Broad St">Marina / Broad Street / CMS</option>
                    <option value="Lekki Phase 1">Lekki Phase 1</option>
                    <option value="Ikeja CBD / GRA">Ikeja CBD / Allen / GRA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">Street & Building Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14B Adeola Odeku St"
                    value={buildingAddress}
                    onChange={(e) => setBuildingAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E140A] mb-1">Floor & Desk / Dept *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5th Floor, Finance Dept, Desk 12"
                    value={deskFloor}
                    onChange={(e) => setDeskFloor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E140A] mb-1">Desk Drop Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Leave with receptionist Ms. Blessing if I am in a conference room."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            {/* Promo code voucher */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#1E140A] mb-1">Have a Lottery Voucher or Discount Code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SURVIVAL-LAGOS-20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs uppercase text-[#1E140A]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-[#1E140A] text-white text-xs font-bold hover:bg-black cursor-pointer"
                >
                  Apply Code
                </button>
              </div>
              {promoMsg && <div className="text-xs text-emerald-700 font-bold mt-1">{promoMsg}</div>}
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-4 border-t border-[#1E140A]/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1E140A]/60">
                3. Payment Method
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'paystack', label: 'Paystack (Card/USSD)', icon: CreditCard },
                  { id: 'transfer', label: 'Instant Bank Transfer', icon: Building },
                  { id: 'corporate', label: 'Company / HR Bill', icon: ShieldCheck },
                  { id: 'wallet', label: '11to12 Lunch Wallet', icon: Sparkles },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'border-[#FF5500] bg-[#FF5500]/10 text-[#FF5500] font-bold shadow-xs'
                        : 'border-[#1E140A]/15 bg-white hover:border-stone-400 text-[#1E140A]'
                    }`}
                  >
                    <pm.icon className={`w-4 h-4 mb-2 ${paymentMethod === pm.id ? 'text-[#FF5500]' : 'text-[#1E140A]/60'}`} />
                    <span className="text-[11px] leading-tight font-semibold">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-[#1E140A]/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-base shadow-xl shadow-[#FF5500]/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Reserving Kitchen Slot...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay {formatNaira(finalAmount)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#1E140A]/50 mt-2">
                🔒 256-bit encrypted checkout. First drop starts at 11:00 AM on your first scheduled workday.
              </p>
            </div>

          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-6 font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1E140A] font-display">
                You're In! Welcome to 11 to 12.
              </h3>
              <p className="text-sm text-[#1E140A]/70 max-w-md mx-auto">
                No more Gala and spite. Your dedicated rider will deliver piping-hot lunch to <strong>{companyName || 'your office'}</strong> ({deskFloor || 'Desk'}) between <strong>11:00 AM – 12:00 PM</strong>.
              </p>
            </div>

            {/* Confirmation Box */}
            <div className="bg-white p-5 rounded-2xl border border-[#1E140A]/10 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#1E140A]/60">Order ID:</span>
                <span className="font-mono font-bold text-[#1E140A]">#LAGOS-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E140A]/60">Total Workdays:</span>
                <span className="font-bold text-[#1E140A]">{summary.selectedDates.length} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E140A]/60">Recipient:</span>
                <span className="font-bold text-[#1E140A]">{fullName || 'Office Warrior'} ({phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1E140A]/60">Delivery Zone:</span>
                <span className="font-bold text-[#1E140A]">{locationZone}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-[#1E140A] hover:bg-black text-white text-sm font-bold transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
