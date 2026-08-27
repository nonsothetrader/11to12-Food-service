import { ShieldCheck, Calendar, Clock, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface TermsPageProps {
  onJoinWaitlistClick: () => void;
}

export default function TermsPage({ onJoinWaitlistClick }: TermsPageProps) {
  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 border-b border-stone-200 pb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-[#111827] tracking-tight font-display">
          Terms of Service & Subscription Guidelines
        </h1>
        <p className="text-stone-600 text-sm">
          Last Updated: Launch Version 2026.1 • Applicable to all individual and corporate subscribers across Lagos.
        </p>
      </div>

      {/* Structured Sections */}
      <div className="space-y-10 text-stone-700 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D97706]" />
            <span>1. Service Hours & Delivery Window</span>
          </h2>
          <p>
            <strong>11to12</strong> operates strictly <strong>Monday through Friday</strong>. Our primary delivery window is between <strong>11:00 AM and 12:00 PM (WAT)</strong> to ensure that office staff receive warm, fresh lunch on their desk before standard midday rush hours. Weekend deliveries are not offered as our culinary facilities perform deep sanitization and prep cycles.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D97706]" />
            <span>2. Public Holidays & Calendar Adjustments</span>
          </h2>
          <p>
            In the event of an official Nigerian Federal or Lagos State public holiday falling on a workday, our kitchen administration will automatically update the master schedule. Any pre-booked lunch falling on an official holiday will be <strong>automatically credited to your wallet balance or rolled over</strong> to your next scheduled workday with zero administrative penalty.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#D97706]" />
            <span>3. Meal Swapping, Skipping & Rollover Credits</span>
          </h2>
          <p>
            Subscribers maintain complete control over their lunch calendar. You may skip or reschedule any workday up until <strong>9:00 PM the evening prior</strong> to dispatch through your subscriber dashboard or WhatsApp line. Skipped meals convert immediately into a 100% monetary credit rollover for future booking. Requests received after the morning cutoff cannot be credited as fresh cooking commences at 6:00 AM daily.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D97706]" />
            <span>4. Pricing, Minimum Commitment & 20-Day Bonus</span>
          </h2>
          <p>
            The standard base lunch rate is fixed at <strong>₦2,900 per meal</strong>, which includes all packaging, cutlery, and guaranteed direct-to-desk dispatch. A minimum commitment of 5 workdays is required to initialize route logistics. Subscribers who book <strong>20 or more workdays in a single cycle automatically receive 1 Free Lunch</strong> credit redeemable on another eligible workday.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D97706]" />
            <span>5. Food Safety, Quality & Allergen Notices</span>
          </h2>
          <p>
            All meals are prepared in an inspected commercial kitchen adhering to strict HACCP food safety standards. Meals are packaged in tamper-evident, biodegradable heat-retentive containers. While we list all major allergens (such as crustaceans/crayfish, groundnuts, dairy, and eggs) on our daily menu, items are prepared in a shared kitchen environment. Customers with severe anaphylactic allergies should consult our dietary team before booking.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#111827] font-display flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#D97706]" />
            <span>6. Office Building Access & Desk Drop Policy</span>
          </h2>
          <p>
            To guarantee 11:00 AM – 12:00 PM delivery, subscribers must provide accurate office building names, floor numbers, and security desk instructions. In buildings where external delivery personnel are restricted from upper floors, our rider will leave your labeled, sealed package with your designated reception security desk and notify you instantly via SMS/WhatsApp.
          </p>
        </section>

      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-[#111827] text-white text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-bold font-display text-white">
          Ready to Guarantee Your Lunch Peace of Mind?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
          Join hundreds of smart corporate professionals on our early access roster.
        </p>
        <button
          onClick={onJoinWaitlistClick}
          className="px-8 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-lg shadow-[#D97706]/30 transition-all cursor-pointer"
        >
          Join 11to12 Waitlist Now
        </button>
      </div>

    </div>
  );
}
