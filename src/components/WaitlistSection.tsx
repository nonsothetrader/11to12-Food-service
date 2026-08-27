import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2,
  Building2, 
  Mail, 
  Phone, 
  User, 
  ArrowRight, 
  Lock,
  ChevronDown
} from 'lucide-react';
import LaunchCountdown from './LaunchCountdown';

interface WaitlistSectionProps {
  onProceedToPricing?: () => void;
}

export default function WaitlistSection({ onProceedToPricing }: WaitlistSectionProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    address: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.workEmail || !formData.phone || !formData.address) {
      return;
    }

    const randomTicket = `11TO12-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(randomTicket);
    setIsSubmitted(true);

    try {
      localStorage.setItem('11to12_waitlist_user', JSON.stringify({
        ...formData,
        ticketNumber: randomTicket,
        registeredAt: new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Storage disabled', err);
    }
  };

  const handleScrollToPricing = () => {
    if (onProceedToPricing) {
      onProceedToPricing();
    } else {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="waitlist" className="py-16 bg-[#FAF9F6] border-t border-[#111827]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Countdown Header */}
        <div className="mb-10">
          <LaunchCountdown />
        </div>

        {/* Waitlist Form Card */}
        <div id="waitlist-form" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#111827]/10 shadow-xl max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                    Join the Desk Drop Waitlist
                  </h2>
                  <p className="text-base text-stone-600 max-w-xl mx-auto">
                    Reserve your corporate office spot before route capacity fills up with complimentary desk delivery.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Babatunde Adeyemi"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-[#111827] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Work Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Work Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.workEmail}
                        onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                        placeholder="yourname@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-[#111827] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* WhatsApp Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>WhatsApp Phone Number *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0803 123 4567"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-[#111827] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Delivery Address (Office details) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Exact Office Address / Building & Floor *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. Landmark Towers, 4th Floor, FinTech Wing"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-[#111827] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white transition-colors"
                      />
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#D97706]/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Join Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      No payment required to reserve your spot
                    </span>

                    <button
                      type="button"
                      onClick={handleScrollToPricing}
                      className="text-[#D97706] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Or build your lunch plan below</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111827] text-white text-xs font-mono font-bold shadow-xs">
                    <span className="text-stone-400 uppercase font-sans font-medium text-[10px]">Priority Pass:</span>
                    <span className="text-amber-400">{ticketNumber}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                    Spot Reserved, {formData.fullName.split(' ')[0]}!
                  </h2>
                  <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
                    Your priority desk delivery slot at <strong>{formData.address}</strong> is saved. Now, go to <strong>Build Your Perfect Lunch Plan</strong> to choose the exact workdays you want your hot meals delivered.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleScrollToPricing}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold shadow-xl shadow-[#D97706]/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <span>Build Your Perfect Lunch Plan</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        fullName: '',
                        workEmail: '',
                        phone: '',
                        address: ''
                      });
                      setIsSubmitted(false);
                    }}
                    className="px-5 py-3 rounded-xl text-stone-500 hover:text-stone-900 text-xs font-semibold hover:underline cursor-pointer"
                  >
                    Register Another Colleague
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
