import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  CalendarCheck, 
  CreditCard, 
  Copy, 
  Check, 
  Mail, 
  Share2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface PostWaitlistPaymentGuideProps {
  ticketNumber: string;
  userData: {
    fullName: string;
    workEmail: string;
    phone: string;
    address: string;
  };
  onRegisterAnother?: () => void;
}

const PRICE_PER_MEAL = 2900;
const LAUNCH_DATE_STR = '2026-10-12';

// 10 default initial launch workdays (starting Monday Oct 12, 2026)
const INITIAL_WORKDAYS = [
  '2026-10-12',
  '2026-10-13',
  '2026-10-14',
  '2026-10-15',
  '2026-10-16',
  '2026-10-19',
  '2026-10-20',
  '2026-10-21',
  '2026-10-22',
  '2026-10-23'
];

export default function PostWaitlistPaymentGuide({
  ticketNumber,
  userData,
  onRegisterAnother
}: PostWaitlistPaymentGuideProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(INITIAL_WORKDAYS);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedCount = selectedDates.length;
  const grandTotal = selectedCount * PRICE_PER_MEAL;

  const handleToggleDay = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr].sort()
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  const formattedDatesList = selectedDates
    .map(d => {
      const date = new Date(d);
      return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    })
    .join(', ');

  const whatsappMessage = encodeURIComponent(
    `Hello 11to12 Support Team! 🍲\n\nI have joined the desk delivery waitlist and completed my subscription payment.\n\n*Reservation Details:*\n- Pass Number: ${ticketNumber}\n- Subscriber: ${userData.fullName}\n- Email: ${userData.workEmail}\n- Phone: ${userData.phone}\n- Desk Address: ${userData.address}\n\n*Selected Workdays (${selectedCount} days):*\n${formattedDatesList}\n\n*Total Amount Paid:* ${formatNaira(grandTotal)}\n\n(Attached is my payment proof/receipt below). Kindly confirm my schedule!`
  );

  const emailSubject = encodeURIComponent(`Proof of Payment - ${ticketNumber} - ${userData.fullName}`);
  const emailBody = encodeURIComponent(
    `Hello 11to12 Accounts Team,\n\nI have joined the 11to12 waitlist and completed my subscription transfer.\n\nTicket Pass: ${ticketNumber}\nSubscriber: ${userData.fullName}\nWork Email: ${userData.workEmail}\nPhone: ${userData.phone}\nDelivery Address: ${userData.address}\n\nSelected Workdays (${selectedCount} days):\n${formattedDatesList}\n\nTotal Paid: ${formatNaira(grandTotal)}\n\nPlease find attached the bank transfer payment receipt.\n\nThank you!`
  );

  const shareText = encodeURIComponent(
    `I just reserved my desk lunch delivery on 11to12 in Lagos! Hot Nigerian comfort meals delivered to your desk by 12:00 PM. Join here: ${window.location.origin}`
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Header Confirmation Badge */}
      <div className="text-center space-y-3 pb-2 border-b border-[#111827]/10">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
          Welcome to 11to12, {userData.fullName.split(' ')[0]}!
        </h2>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Your desk delivery priority slot is reserved for <strong>{userData.address}</strong>.
        </p>

        {/* Priority Pass Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-mono font-bold shadow-md">
          <span className="text-stone-400 uppercase font-sans font-medium text-[10px]">Priority Pass:</span>
          <span className="text-amber-400">{ticketNumber}</span>
        </div>
      </div>

      {/* 2. Step 1: Select Desired Delivery Workdays */}
      <div className="bg-[#FAF9F6] p-6 sm:p-7 rounded-3xl border border-[#111827]/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#D97706] text-white text-xs font-bold">Step 1</span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#111827] flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-[#D97706]" />
                <span>Select Your Delivery Workdays</span>
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Choose the days you want your food delivered. Dispatch launches Monday, October 12, 2026.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-stone-500 font-medium">Selected Plan</div>
            <div className="text-lg font-black text-[#111827]">
              {selectedCount} {selectedCount === 1 ? 'Workday' : 'Workdays'} ({formatNaira(grandTotal)})
            </div>
          </div>
        </div>

        {/* Workday chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {INITIAL_WORKDAYS.map((dStr) => {
            const date = new Date(dStr);
            const isSelected = selectedDates.includes(dStr);
            const formattedLabel = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

            return (
              <button
                key={dStr}
                type="button"
                onClick={() => handleToggleDay(dStr)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border cursor-pointer ${
                  isSelected
                    ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                }`}
              >
                <span>{formattedLabel}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                  {isSelected ? '✓ Selected' : '+ Add Day'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDates(INITIAL_WORKDAYS)}
              className="text-[#D97706] hover:underline font-bold cursor-pointer"
            >
              Select 2 Weeks (10 Days)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSelectedDates(INITIAL_WORKDAYS.slice(0, 5))}
              className="text-[#D97706] hover:underline font-bold cursor-pointer"
            >
              Select 1 Week (5 Days)
            </button>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">₦2,900 / meal • Free Desk Drop</span>
        </div>
      </div>

      {/* 3. Step 2: Make Payment & Send Proof */}
      <div className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-bold">Step 2</span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Make Payment & Send Proof</span>
            </h3>
            <p className="text-xs text-stone-400">
              Transfer your lunch total and send proof of payment to activate your desk delivery slot.
            </p>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-300 pb-2 border-b border-white/10">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-400">Bank Transfer Account</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Official Account
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-stone-400 text-[11px] uppercase">Bank Name</div>
              <div className="font-bold text-white text-sm mt-0.5">Moniepoint MFB / Providus</div>
            </div>

            <div>
              <div className="text-stone-400 text-[11px] uppercase">Account Name</div>
              <div className="font-bold text-white text-sm mt-0.5 truncate">11to12 Foods Limited</div>
            </div>

            <div>
              <div className="text-stone-400 text-[11px] uppercase">Account Number</div>
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
            <span className="text-stone-300">Total Subscription Amount:</span>
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

        {/* Send Proof of Payment Action Channels */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Send Proof of Payment to Official Channels:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Official Button */}
            <a
              href={`https://wa.me/2348031234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-between transition-all shadow-md group cursor-pointer"
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

            {/* Email Official Button */}
            <a
              href={`mailto:payment@11to12.com?subject=${emailSubject}&body=${emailBody}`}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white flex items-center justify-between transition-all shadow-md group cursor-pointer"
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

          <p className="text-[11px] text-stone-400 text-center sm:text-left">
            * Once payment proof is received on WhatsApp or <strong>payment@11to12.com</strong>, your desk deliveries are locked and your subscriber dashboard profile will be dispatched.
          </p>
        </div>

      </div>

      {/* 4. Footer Actions (Share & Another Colleague) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Tell a Colleague on WhatsApp</span>
        </a>

        {onRegisterAnother && (
          <button
            type="button"
            onClick={onRegisterAnother}
            className="text-stone-500 hover:text-stone-900 text-xs font-semibold hover:underline cursor-pointer"
          >
            Register Another Colleague
          </button>
        )}
      </div>

    </div>
  );
}
