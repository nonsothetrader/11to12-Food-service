import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroFoodImg from '../assets/images/lagos_lunch_hero_1787694820866.jpg';

const ROTATING_TEXTS = [
  'On Time.',
  'Actually Good.',
  'Not Gala & Lacasera.',
  'Hot & Steamy.',
  'Pre-Meeting Bliss.'
];

interface HeroProps {
  onFeedMeClick: () => void;
  onExploreMenuClick: () => void;
}

export default function Hero({ onFeedMeClick, onExploreMenuClick }: HeroProps) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-warm-mesh"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Main Dynamic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] leading-[1.05]">
              Lunch that’s <br className="hidden sm:block" />
              <span className="inline-block relative min-w-[280px] sm:min-w-[340px] text-[#D97706]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="inline-block underline decoration-[#D97706]/40 decoration-wavy decoration-2 underline-offset-4"
                  >
                    {ROTATING_TEXTS[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subheadline with Lagos Humor */}
            <p className="text-lg sm:text-xl text-[#111827]/80 leading-relaxed max-w-2xl font-normal">
              Between back-to-back Zoom calls and 3rd Mainland traffic, your stomach shouldn't have to settle for Gala and spite. <strong>11 to 12</strong> brings hot, high-protein Nigerian comfort food straight to your desk before 12:00 PM.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-feed-me-cta"
                onClick={onFeedMeClick}
                className="inline-flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-9 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#D97706]/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>Feed Me</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-menu-cta"
                onClick={onExploreMenuClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-stone-50 text-[#111827] text-base font-bold border border-[#111827]/10 shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Inspect This Month's Menu</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card Frame with subtle shadow and border */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-2xl shadow-black/10 border border-[#111827]/10">
                
                {/* Hero Image */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={heroFoodImg}
                    alt="Smoky Nigerian Jollof Rice lunch delivered to Lagos office desk"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Bottom caption overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-base italic text-white font-medium">Smokey Firewood Jollof & Peppered Turkey</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
