import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CreditCard, 
  Building2, 
  CalendarCheck, 
  Copy, 
  Check, 
  Mail, 
  Send, 
  Download, 
  ShieldCheck, 
  User, 
  Phone, 
  ArrowRight,
  Sparkles,
  HeadphonesIcon
} from 'lucide-react';
import { downloadInvoicePDF } from '../lib/pdfGenerator';

export interface InvoiceModalSummary {
  selectedDates: string[];
  pricePerMeal: number;
  mealTotal: number;
  addonsTotal: number;
  grandTotal: number;
  selectedAddons?: { id: string; name: string; pricePerDay: number }[];
}

export interface UserContactData {
  fullName: string;
  workEmail: string;
  phone: string;
  address: string;
  ticketNumber?: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: InvoiceModalSummary;
  initialUserData?: UserContactData | null;
}

const PRICE_PER_MEAL = 2900;

export default function InvoiceModal({
  isOpen,
  onClose,
  summary,
  initialUserData
}: InvoiceModalProps) {
  const [userData, setUserData] = useState<UserContactData>(() => {
    if (initialUserData?.fullName) return initialUserData;
    try {
      const saved = localStorage.getItem('11to12_waitlist_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      fullName: '',
      workEmail: '',
      phone: '',
      address: '',
      ticketNumber: ''
    };
  });

  const [hasDetails, setHasDetails] = useState<boolean>(() => {
    if (initialUserData?.fullName && initialUserData?.workEmail) return true;
    try {
      const saved = localStorage.getItem('11to12_waitlist_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && parsed.workEmail) return true;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Sync if initialUserData changes or when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('11to12_waitlist_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName && parsed.workEmail) {
            setUserData(parsed);
            setHasDetails(true);
            return;
          }
        }
      } catch {
        // ignore
      }
      if (initialUserData?.fullName) {
        setUserData(initialUserData);
        setHasDetails(true);
      }
    }
  }, [isOpen, initialUserData]);

  if (!isOpen) return null;

  const ticketNumber = userData.ticketNumber || `#11TO12-OCT-${Math.floor(1000 + Math.random() * 9000)}`;

  const totalDays = summary.selectedDates.length;
  const grandTotal = summary.grandTotal || totalDays * PRICE_PER_MEAL;

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  const formattedDatesList = summary.selectedDates
    .map(d => {
      const date = new Date(d);
      return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    })
    .join(', ');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userData.fullName || !userData.workEmail || !userData.phone || !userData.address) return;

    const fullData: UserContactData = {
      ...userData,
      ticketNumber: userData.ticketNumber || `#11TO12-OCT-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setUserData(fullData);
    setHasDetails(true);
    try {
      localStorage.setItem('11to12_waitlist_user', JSON.stringify(fullData));
    } catch {
      // ignore
    }
  };

  const handleDownloadPDF = () => {
    setIsPdfGenerating(true);
    try {
      downloadInvoicePDF({
        ticketNumber,
        subscriberName: userData.fullName || 'Valued Subscriber',
        email: userData.workEmail || '',
        phone: userData.phone || '',
        address: userData.address || 'Office Desk',
        selectedDates: summary.selectedDates,
        totalDays,
        pricePerMeal: PRICE_PER_MEAL,
        grandTotal
      });
    } catch (err) {
      console.error('Failed to generate PDF invoice', err);
    } finally {
      setTimeout(() => setIsPdfGenerating(false), 800);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello 11to12 Support Team! 🍲\n\nI have selected my corporate lunch plan on 11to12 and made the subscription transfer.\n\n*Invoice & Reservation Summary:*\n- Invoice / Pass: ${ticketNumber}\n- Subscriber: ${userData.fullName}\n- Work Email: ${userData.workEmail}\n- Phone: ${userData.phone}\n- Delivery Address: ${userData.address}\n\n*Selected Workdays (${totalDays} days):*\n${formattedDatesList}\n\n*Total Amount Paid:* ${formatNaira(grandTotal)}\n\n(Attached is my payment proof receipt & invoice PDF). Kindly confirm my schedule and onboarding!`
  );

  const emailSubject = encodeURIComponent(`Proof of Payment - ${ticketNumber} - ${userData.fullName}`);
  const emailBody = encodeURIComponent(
    `Hello 11to12 Accounts & Customer Care Team,\n\nI have completed my subscription transfer for the desk lunch delivery plan.\n\nInvoice / Pass: ${ticketNumber}\nSubscriber: ${userData.fullName}\nWork Email: ${userData.workEmail}\nPhone: ${userData.phone}\nDesk Address: ${userData.address}\n\nSelected Workdays (${totalDays} days):\n${formattedDatesList}\n\nTotal Paid: ${formatNaira(grandTotal)}\n\nPlease find attached the bank transfer payment receipt / invoice copy.\n\nThank you!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#111827]/15 overflow-hidden my-6 text-left"
      >
        {/* Header Bar */}
        <div className="bg-[#111827] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white font-black flex items-center justify-center font-display text-lg shadow-md">
              11:12
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-display text-white">
                  Subscription Invoice & Payment
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706] text-[10px] font-mono font-bold">
                  {ticketNumber}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans">
                Official Desk Drop Invoice • Dispatch Launch: Oct 12, 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            {!hasDetails ? (
              /* If user arrived without filling waitlist, prompt once */
              <motion.form
                key="quick-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleQuickFormSubmit}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#111827]">
                    Where should we deliver your lunch?
                  </h4>
                  <p className="text-xs text-stone-500">
                    Enter your work details once to generate your personalized invoice and lock in your desk delivery.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">Full Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Adeyemi"
                        value={userData.fullName}
                        onChange={e => setUserData({ ...userData, fullName: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-stone-700">WhatsApp / Phone *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="0803 123 4567"
                        value={userData.phone}
                        onChange={e => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-stone-700">Work Email *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="babatunde@paystack.com"
                        value={userData.workEmail}
                        onChange={e => setUserData({ ...userData, workEmail: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-stone-700">Exact Office Address / Building & Floor *</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Landmark Towers, 4th Floor, Innovation Wing, VI"
                        value={userData.address}
                        onChange={e => setUserData({ ...userData, address: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Generate Invoice & Payment Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              /* Full Invoice & Payment View */
              <motion.div
                key="invoice-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                
                {/* 1. Itemized Invoice Breakdown Card */}
                <div className="bg-[#FAF9F6] border border-[#111827]/10 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Subscriber Desk</div>
                      <div className="font-bold text-[#111827] text-sm">{userData.fullName}</div>
                      <div className="text-xs text-stone-600 truncate max-w-sm">{userData.address}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">{userData.workEmail} • {userData.phone}</div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Delivery Window</div>
                      <div className="text-xs font-bold text-emerald-700">11:00 AM – 12:00 PM (Mon–Fri)</div>
                      <div className="text-[11px] text-stone-500">Launch: Mon, Oct 12, 2026</div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-700">
                      <div>
                        <span className="font-bold text-[#111827]">Corporate Lunch Plan ({totalDays} Workdays)</span>
                        <div className="text-[11px] text-stone-500">₦2,900 per meal • Hot authentic Nigerian recipes</div>
                      </div>
                      <span className="font-bold text-[#111827]">{formatNaira(grandTotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-emerald-700">
                      <span className="font-medium">Direct Desk Dispatch & Eco Wooden Cutlery</span>
                      <span className="font-bold uppercase tracking-wider text-[11px]">Free (₦0)</span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm">
                      <span className="font-bold text-[#111827]">Total Amount Payable</span>
                      <span className="font-black text-lg text-[#D97706] font-display">{formatNaira(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Selected Days Pills */}
                  <div className="pt-2 border-t border-stone-200 space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Scheduled Workdays ({totalDays} Days):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {summary.selectedDates.map(dStr => {
                        const date = new Date(dStr);
                        const label = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                        return (
                          <span
                            key={dStr}
                            className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[#111827] text-[11px] font-medium shadow-2xs"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Official Bank Account Details Card */}
                <div className="bg-[#111827] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white uppercase tracking-wider text-[11px]">Official Bank Transfer Details</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-stone-400 text-[10px] uppercase">Bank Name</div>
                      <div className="font-bold text-white text-sm mt-0.5">Moniepoint / Providus</div>
                    </div>

                    <div>
                      <div className="text-stone-400 text-[10px] uppercase">Account Name</div>
                      <div className="font-bold text-white text-sm mt-0.5 truncate">11to12 Foods Limited</div>
                    </div>

                    <div>
                      <div className="text-stone-400 text-[10px] uppercase">Account Number</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-black text-amber-400 text-base">8031234567</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('8031234567', 'account')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-stone-300">Amount to Transfer:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-amber-400 font-display">{formatNaira(grandTotal)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(grandTotal.toString(), 'amount')}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                        title="Copy Amount"
                      >
                        {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Download Invoice PDF Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isPdfGenerating}
                    className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {isPdfGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-[#D97706]" />
                        <span>Generating Invoice PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#D97706]" />
                        <span>Download Invoice PDF (Copy to Attach)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 4. Send Proof of Payment to Official Channels */}
                <div className="space-y-3 pt-1">
                  <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Send Proof of Payment to Official Channels:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp Channel */}
                    <a
                      href={`https://wa.me/2348031234567?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-between transition-all shadow-md group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" />
                          <span>Send via WhatsApp</span>
                        </div>
                        <div className="text-[11px] text-emerald-100 font-mono">11to12 Official (0803 123 4567)</div>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Email Channel */}
                    <a
                      href={`mailto:payment@11to12.com?subject=${emailSubject}&body=${emailBody}`}
                      className="p-3.5 rounded-2xl bg-[#111827] hover:bg-black text-white flex items-center justify-between transition-all shadow-md group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send via Official Mail</span>
                        </div>
                        <div className="text-[11px] text-stone-300 font-mono">payment@11to12.com</div>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* 5. Customer Care Onboarding Reassurance Notice */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-stone-700">
                  <HeadphonesIcon className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-[#111827]">Customer Care Onboarding Notice</div>
                    <p className="text-stone-600 leading-relaxed">
                      After sending your proof of payment, our dedicated customer care desk will verify your transaction, finalize your desk delivery schedule, and manage your complete onboarding until our kitchen dispatch begins on <strong>Monday, October 12, 2026</strong>.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
