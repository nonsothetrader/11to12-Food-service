import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, HeartHandshake, Building2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="reviews" className="py-20 bg-warm-mesh overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight font-display">
              People Tolerate Us
            </h2>
            <p className="text-base sm:text-lg text-[#111827]/70 leading-relaxed">
              Look, some people don't hate our food. Here's proof from professionals who are probably just as tired as you are.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={prevTestimonial}
              aria-label="Previous review"
              className="p-3 rounded-full bg-white hover:bg-stone-100 text-[#111827] border border-[#111827]/10 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next review"
              className="p-3 rounded-full bg-white hover:bg-stone-100 text-[#111827] border border-[#111827]/10 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel View */}
        <div className="relative" ref={containerRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, idx) => {
              const isHighlight = idx === activeIndex;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 ${
                    isHighlight
                      ? 'border-[#D97706] shadow-xl ring-2 ring-[#D97706]/20'
                      : 'border-[#111827]/10 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Stars & Quote Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-[#D97706]">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-stone-300" />
                    </div>

                    {/* Quote Text */}
                    <p className="text-base font-serif italic text-[#111827] leading-relaxed mb-6">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author Meta */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D97706]/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#111827] text-sm truncate">{item.author}</div>
                      <div className="text-xs font-semibold text-[#B45309] truncate">{item.role}</div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span>{item.companyLocation}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stat Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-[#111827]/10 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#D97706] font-display">11:18 AM</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Average Desk Arrival Time</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#111827]/10 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#111827] font-display">0%</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Roadside Mystery Meat</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#111827]/10 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-[#B45309] font-display">4,800+</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Lagos Desks Fed Monthly</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#111827]/10 shadow-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-display">99.4%</div>
            <div className="text-xs text-stone-500 font-medium mt-1">On-Time Desk Delivery Rate</div>
          </div>
        </div>

      </div>
    </section>
  );
}
