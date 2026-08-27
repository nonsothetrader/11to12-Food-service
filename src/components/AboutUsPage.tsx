import { UtensilsCrossed, Clock, ShieldCheck, Flame, Heart, ArrowRight } from 'lucide-react';
import spreadImg from '../assets/images/nigerian_dish_spread_1787694834762.jpg';
import heroFoodImg from '../assets/images/lagos_lunch_hero_1787694820866.jpg';

interface AboutUsPageProps {
  onJoinWaitlistClick: () => void;
  onExploreMenuClick: () => void;
}

export default function AboutUsPage({ onJoinWaitlistClick, onExploreMenuClick }: AboutUsPageProps) {
  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight font-display">
          Born Out of Pure Corporate Lunch Trauma
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed">
          We built <strong>11to12</strong> because no hardworking professional in Lagos should have to survive on Gala, spite, and lukewarm canteen jollof.
        </p>
      </div>

      {/* Origin Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] font-display">
            The 1:00 PM Lagos Dilemma
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">
            Every Lagos 9-to-5er knows the routine: You promise yourself you'll cook on Sunday night. By Tuesday, you're opening delivery apps at 12:45 PM in a panic. The rider gets trapped in Falomo traffic, your Jollof arrives stone-cold at 2:15 PM, and your 2:30 PM client presentation is ruined.
          </p>
          <p className="text-base text-stone-600 leading-relaxed">
            <strong>11to12 was engineered to flip the script.</strong> By cooking in dedicated high-capacity morning batches and deploying dedicated delivery corridors across Victoria Island, Ikoyi, Lekki Phase 1, Marina, and Ikeja between 11:00 AM and 12:00 PM, your lunch sits on your desk hot, steamy, and ready before the lunch rush even begins.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onJoinWaitlistClick}
              className="px-7 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-md shadow-[#D97706]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreMenuClick}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-[#111827] font-bold text-sm shadow-2xs transition-all cursor-pointer"
            >
              <span>Inspect Dishes</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-4/3">
            <img
              src={spreadImg}
              alt="Nigerian Gourmet Lunch Dishes Spread"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Our Kitchen Standard</span>
              <p className="text-lg font-display font-bold mt-0.5">Firewood Tatashe, Local Locust Beans, Farm-Fresh Daily</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our 4 Core Pillars */}
      <div className="pt-10 border-t border-stone-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-black text-[#111827] font-display">
            The 11to12 Standard
          </h2>
          <p className="text-stone-600 text-sm">How we maintain consistency, hygiene, and military-grade delivery timings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#111827] font-display">
              11:00 AM – 12:00 PM Strict Drop
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We deliver early to beat the Lagos midday traffic jam. Your lunch is resting comfortably on your desk before hunger sets in.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#111827] font-display">
              Authentic Firewood Flavor
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No artificial colorants or shortcut pastes. We use real reduced tatashe, rodo, smoked catfish stock, and traditional Nigerian spices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#111827] font-display">
              ISO-Grade Food Safety
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our central culinary facility adheres to strict health and sanitation protocols. Sealed tamper-evident biodegradable boxes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#111827] font-display">
              Healthy Sub Pack Options
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Watching carbs or calories? Every single day features an alternative FitFam low-carb, vegan, or mild bowl ready for instant swap.
            </p>
          </div>

        </div>
      </div>

      {/* Serving Zones */}
      <div className="bg-[#111827] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase font-bold text-[#D97706] tracking-widest">
              Lagos Priority Corridors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
              Active Delivery Hubs
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed">
              Our riders cover the financial and tech epicenters of Lagos:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-stone-200">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">📍 Victoria Island</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">📍 Ikoyi & Banana Island</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">📍 Lekki Phase 1</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">📍 Marina / Broad St</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">📍 Ikeja CBD & GRA</div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">🏢 Corporate Campuses</div>
            </div>
          </div>

          <div className="lg:col-span-5 text-center lg:text-right">
            <button
              onClick={onJoinWaitlistClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-base shadow-xl shadow-[#D97706]/30 transition-all cursor-pointer"
            >
              Join the Launch Waitlist
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
