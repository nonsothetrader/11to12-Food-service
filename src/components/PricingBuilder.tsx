import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, ShieldAlert, Check, ArrowRight, Lock, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthData } from '../data/mockData';

interface PricingBuilderProps {
  selectedDates: string[];
  onToggleDate: (dateStr: string) => void;
  onSetSelectedDates: (dates: string[]) => void;
  onOpenCheckout?: (summary: {
    selectedDates: string[];
    pricePerMeal: number;
    mealTotal: number;
    addonsTotal: number;
    grandTotal: number;
    selectedAddons: { id: string; name: string; pricePerDay: number }[];
  }) => void;
  isWaitlistMode?: boolean;
  minSelectableDate?: string; // e.g. "2026-10-19"
  initialYearOverride?: number;
  initialMonthOverride?: number;
  onJoinWaitlistClick?: () => void;
}

const PRICE_PER_MEAL = 2900;
const MIN_DAYS_REQUIRED = 5;
const LAUNCH_DATE_STR = '2026-10-12';

export default function PricingBuilder({
  selectedDates,
  onToggleDate,
  onSetSelectedDates,
  onOpenCheckout,
  isWaitlistMode = false,
  minSelectableDate = LAUNCH_DATE_STR,
  initialYearOverride,
  initialMonthOverride,
  onJoinWaitlistClick
}: PricingBuilderProps) {
  const defaultYear = initialYearOverride ?? 2026;
  const defaultMonth = initialMonthOverride ?? 9; // 9 = October 2026

  const [activeYear, setActiveYear] = useState<number>(defaultYear);
  const [activeMonth, setActiveMonth] = useState<number>(defaultMonth);

  useEffect(() => {
    if (initialYearOverride !== undefined) setActiveYear(initialYearOverride);
    if (initialMonthOverride !== undefined) setActiveMonth(initialMonthOverride);
  }, [initialYearOverride, initialMonthOverride]);

  const { year, month, daysInMonth, mondayBasedOffset, monthName, todayDate, isCurrentMonth } = useMemo(() => {
    return getMonthData(activeYear, activeMonth);
  }, [activeYear, activeMonth]);

  const handlePrevMonth = () => {
    if (activeYear === 2026 && activeMonth <= 9) return; // Limit to launch month (Oct 2026) onwards

    if (activeMonth === 0) {
      setActiveMonth(11);
      setActiveYear(prev => prev - 1);
    } else {
      setActiveMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 11) {
      setActiveMonth(0);
      setActiveYear(prev => prev + 1);
    } else {
      setActiveMonth(prev => prev + 1);
    }
  };

  const canGoPrev = !(activeYear === 2026 && activeMonth <= 9);

  // Calculate calendar grid information
  const calendarDays = useMemo(() => {
    const days = [];
    const minDate = minSelectableDate || LAUNCH_DATE_STR;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay(); // 0: Sun, 6: Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      // Inactive if weekend or before launch date (Oct 12, 2026)
      const isBeforeLaunch = dateStr < minDate;
      const isDisabled = isWeekend || isBeforeLaunch;

      let disableReason = '';
      if (isWeekend) disableReason = 'Weekend (Kitchen closed — Mon to Fri only)';
      else if (isBeforeLaunch) disableReason = `Available from Launch Dispatch (${minDate})`;

      days.push({
        dayNum: d,
        dateStr,
        dayOfWeek,
        isWeekend,
        isBeforeLaunch,
        isDisabled,
        disableReason,
        isToday: isCurrentMonth && d === todayDate,
      });
    }
    return days;
  }, [year, month, daysInMonth, todayDate, isCurrentMonth, minSelectableDate]);

  // All eligible future workdays in current visible month
  const eligibleWorkdays = useMemo(() => {
    return calendarDays.filter(d => !d.isDisabled).map(d => d.dateStr);
  }, [calendarDays]);

  // Quick selection helpers
  const handleSelectAllWorkdays = () => {
    const combined = Array.from(new Set([...selectedDates, ...eligibleWorkdays]));
    onSetSelectedDates(combined);
  };

  const handleSelectNextTwoWeeks = () => {
    const twoWeeks = eligibleWorkdays.slice(0, 10);
    const combined = Array.from(new Set([...selectedDates, ...twoWeeks]));
    onSetSelectedDates(combined);
  };

  const handleClearSelection = () => {
    onSetSelectedDates([]);
  };

  // Financial Calculations
  const selectedCount = selectedDates.length;
  const isMinMet = selectedCount >= MIN_DAYS_REQUIRED;
  const daysNeeded = Math.max(0, MIN_DAYS_REQUIRED - selectedCount);

  // Bonus for 20+ days: 1 free lunch on another day!
  const hasFreeBonus = selectedCount >= 20;

  const mealTotal = selectedCount * PRICE_PER_MEAL;
  const grandTotal = mealTotal;

  // Formatter for Naira currency
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const handleProceed = () => {
    if (isWaitlistMode) {
      if (onJoinWaitlistClick) {
        onJoinWaitlistClick();
      } else {
        const formEl = document.getElementById('waitlist-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (!isMinMet || !onOpenCheckout) return;
    onOpenCheckout({
      selectedDates,
      pricePerMeal: PRICE_PER_MEAL,
      mealTotal,
      addonsTotal: 0,
      grandTotal,
      selectedAddons: []
    });
  };

  return (
    <section id="pricing" className="py-20 bg-white border-y border-[#111827]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight font-display">
            Build Your Perfect Lunch Plan
          </h2>
          <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            {isWaitlistMode
              ? "Pre-calculate your corporate lunch budget. Deliveries activate October 19th. No locked contracts — choose your exact workdays."
              : "No more rigid tiers. You decide how many meals you need across any month. We cook Monday to Friday with flexible rollovers."}
          </p>
        </div>

        {/* 2-Column Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Date Selector */}
          <div className="lg:col-span-7 bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-[#111827]/10 shadow-xs">
            
            <div className="pb-4 mb-6 border-b border-[#111827]/10">
              <h3 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D97706]" />
                <span>Select Delivery Workdays</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Click the specific workdays you want your food delivered. We cook Mon to Fri.
              </p>
            </div>

            {/* Quick Bulk Action Buttons & Month Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSelectAllWorkdays}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#111827] text-xs font-semibold border border-[#111827]/10 shadow-2xs transition-colors cursor-pointer"
                >
                  + Select All ({eligibleWorkdays.length} days)
                </button>
                <button
                  onClick={handleSelectNextTwoWeeks}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#111827] text-xs font-semibold border border-[#111827]/10 shadow-2xs transition-colors cursor-pointer"
                >
                  + 2 Weeks (10 days)
                </button>
                {selectedCount > 0 && (
                  <button
                    onClick={handleClearSelection}
                    className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#111827]/10">
                <button
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    canGoPrev ? 'text-[#111827] hover:bg-stone-100' : 'text-stone-300 cursor-not-allowed'
                  }`}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#111827] px-1.5">
                  {monthName} {year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg text-[#111827] hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Multi-select Matrix */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#111827]/10 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#111827] mb-3 pb-2 border-b border-stone-100">
                <span>{monthName} {year}</span>
                <span className="text-[11px] text-stone-400 font-normal">Mon – Fri Kitchen Schedule</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-[11px] font-bold text-stone-400 uppercase py-1">
                    {day}
                  </div>
                ))}

                {/* Blank offset placeholders for alignment */}
                {Array.from({ length: mondayBasedOffset }).map((_, i) => (
                  <div key={`blank-offset-${i}`} className="p-2 rounded-xl" />
                ))}

                {calendarDays.map(item => {
                  const isSelected = selectedDates.includes(item.dateStr);

                  if (item.isDisabled) {
                    return (
                      <div
                        key={item.dateStr}
                        title={item.disableReason}
                        className="p-2 sm:p-2.5 rounded-xl bg-stone-100/60 text-stone-400 flex flex-col items-center justify-center cursor-not-allowed text-xs relative"
                      >
                        <span className={item.isWeekend ? 'text-stone-300' : 'text-stone-400 font-medium'}>
                          {item.dayNum}
                        </span>
                        <span className="text-[9px] scale-90 text-stone-400">
                          {item.isWeekend ? 'Closed' : 'Pre-Launch'}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => onToggleDate(item.dateStr)}
                      className={`p-2 sm:p-2.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-xs relative ${
                        isSelected
                          ? 'bg-[#D97706] text-white font-bold shadow-md shadow-[#D97706]/30 scale-105 z-10'
                          : 'bg-[#FAF9F6] hover:bg-amber-50 hover:border-[#D97706]/40 text-[#111827] border border-[#111827]/10 font-medium'
                      }`}
                    >
                      <span>{item.dayNum}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                        {isSelected ? '✓ In Plan' : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum commitment progress indicator & Holiday Disclaimer */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-[#111827]/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  {isMinMet ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Minimum commitment achieved ({selectedCount} days)
                    </span>
                  ) : (
                    <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Select {daysNeeded} more {daysNeeded === 1 ? 'workday' : 'workdays'} to reach minimum commitment
                    </span>
                  )}
                </span>
                <span className="text-stone-500 font-bold">{selectedCount} / {MIN_DAYS_REQUIRED} min</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isMinMet ? 'bg-emerald-500' : 'bg-[#D97706]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (selectedCount / MIN_DAYS_REQUIRED) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* 20+ Days Bonus Banner */}
              {hasFreeBonus ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-bold">
                  <Gift className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>🎉 Bonus Unlocked: You get +1 Free Lunch added to another day of your choice!</span>
                </div>
              ) : (
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span>Tip: Select 20+ workdays to unlock <strong>1 Free Bonus Lunch</strong> on another day!</span>
                </div>
              )}

              <p className="text-[11px] text-stone-400">
                * We cook Monday through Friday. Any official public holiday will be automatically credited or rescheduled in your dashboard by kitchen admin.
              </p>
            </div>

          </div>

          {/* Right Column: Live Price Calculator Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Your Lunch Investment</h3>
                  <p className="text-xs text-stone-400">Desk delivery included</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Per Meal</span>
                  <div className="text-lg font-black text-white">{formatNaira(PRICE_PER_MEAL)}</div>
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 text-sm text-stone-300">
                <div className="flex items-center justify-between">
                  <span>Selected Workdays:</span>
                  <span className="font-bold text-white">{selectedCount} {selectedCount === 1 ? 'day' : 'days'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Base Lunch Total ({selectedCount} × {formatNaira(PRICE_PER_MEAL)}):</span>
                  <span className="font-semibold text-white">{formatNaira(mealTotal)}</span>
                </div>

                {hasFreeBonus && (
                  <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      <span>20+ Days Reward:</span>
                    </span>
                    <span>+1 Free Lunch Included (₦0)</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-emerald-400 text-xs">
                  <span>Desk Dispatch & Cutlery:</span>
                  <span className="font-bold uppercase tracking-wider">FREE (₦0)</span>
                </div>
              </div>

              {/* Total Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1">
                  Total Subscription
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl sm:text-4xl font-black text-[#D97706] font-display">
                    {formatNaira(grandTotal)}
                  </div>
                  {hasFreeBonus && (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                      +{selectedCount + 1} Meals Total
                    </span>
                  )}
                </div>
              </div>

              {/* Plan Feature Perks */}
              <div className="space-y-2 text-xs text-stone-300 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Delivered directly to your floor/desk (11:00 AM – 12:00 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Skip or swap any workday with full credit rollover</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Biodegradable packaging + wooden cutlery</span>
                </div>
              </div>

              {/* Checkout / Waitlist Button */}
              {isWaitlistMode ? (
                <button
                  id="waitlist-pricing-cta-button"
                  onClick={handleProceed}
                  className="w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white shadow-xl shadow-[#D97706]/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  id="checkout-cta-button"
                  disabled={!isMinMet}
                  onClick={handleProceed}
                  className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isMinMet
                      ? 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-xl shadow-[#D97706]/30 active:scale-[0.98]'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  {isMinMet ? (
                    <>
                      <span>Proceed to Lock In Plan & Get Invoice</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Select {daysNeeded} More {daysNeeded === 1 ? 'Day' : 'Days'} to Unlock</span>
                    </>
                  )}
                </button>
              )}

              {isWaitlistMode ? (
                <p className="text-[11px] text-center text-stone-400">
                  * Launching Monday, October 12th. Choose your exact workdays.
                </p>
              ) : (
                <p className="text-[11px] text-center text-stone-400">
                  * Launching Monday, October 12, 2026. Click proceed to generate your official invoice and payment transfer details.
                </p>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
