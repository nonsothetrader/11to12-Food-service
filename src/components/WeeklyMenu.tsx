import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Flame, 
  Sparkles, 
  Salad, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { MenuItem, SpiceLevel } from '../types';
import { getMonthData, MENU_DISHES_TEMPLATE } from '../data/mockData';
import { loadStore } from '../lib/store';

interface WeeklyMenuProps {
  onPlanSelectedDay: (dateStr: string) => void;
}

export default function WeeklyMenu({ onPlanSelectedDay }: WeeklyMenuProps) {
  // Use October 2026 as starting launch month
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // 9 is October (0-indexed)
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setStoreVersion(v => v + 1);
    window.addEventListener('11to12_store_update', handleUpdate);
    return () => window.removeEventListener('11to12_store_update', handleUpdate);
  }, []);

  const {
    year,
    month,
    daysInMonth,
    mondayBasedOffset,
    monthName,
    todayDate,
    isCurrentMonth
  } = getMonthData(selectedYear, selectedMonth);

  // Default selected day
  const [selectedDayNum, setSelectedDayNum] = useState<number>(12);
  const [viewSubPack, setViewSubPack] = useState(false);

  const canGoPrev = !(selectedYear === 2026 && selectedMonth <= 9);

  const handlePrevMonth = () => {
    if (selectedYear === 2026 && selectedMonth <= 9) return;
    if (selectedMonth === 0) {
      setSelectedYear(y => y - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(m => m - 1);
    }
    setSelectedDayNum(1);
    setViewSubPack(false);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(y => y + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(m => m + 1);
    }
    setSelectedDayNum(1);
    setViewSubPack(false);
  };

  // Generate menu items for each day of active month
  const monthDays = useMemo(() => {
    const list: { dayNum: number; date: Date; dateStr: string; isWeekend: boolean; menuItem: MenuItem | null }[] = [];
    let workdayIndex = 0;
    const store = loadStore();
    const overrides = store.customMenuOverrides || {};
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      let menuItem: MenuItem | null = null;
      if (!isWeekend) {
        const templateIndex = (workdayIndex + (month * 7)) % MENU_DISHES_TEMPLATE.length;
        const template = MENU_DISHES_TEMPLATE[templateIndex];
        workdayIndex++;
        const baseItem: MenuItem = {
          id: `menu-${dateStr}`,
          dateStr,
          dayOfWeek: date.toLocaleDateString('default', { weekday: 'long' }),
          dayNumber: d,
          monthName,
          ...template
        };

        const override = overrides[dateStr];
        if (override) {
          menuItem = {
            ...baseItem,
            ...override,
            subPack: {
              ...baseItem.subPack,
              ...(override.subPack || {})
            }
          };
        } else {
          menuItem = baseItem;
        }
      }

      list.push({
        dayNum: d,
        date,
        dateStr,
        isWeekend,
        menuItem
      });
    }
    return list;
  }, [year, month, daysInMonth, monthName, storeVersion]);

  // Selected Day Details
  const selectedDayInfo = useMemo(() => {
    const found = monthDays.find(d => d.dayNum === selectedDayNum);
    if (!found && monthDays.length > 0) {
      const firstWorkday = monthDays.find(d => !d.isWeekend);
      return firstWorkday || monthDays[0];
    }
    return found;
  }, [monthDays, selectedDayNum]);

  // Spice meter visual representation
  const renderSpiceMeter = (level: SpiceLevel) => {
    const config: { [key in SpiceLevel]: { flames: number; label: string; color: string } } = {
      'Mild': { flames: 1, label: 'Mild', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      'Medium': { flames: 2, label: 'Medium Spice', color: 'text-orange-600 bg-orange-50 border-orange-200' },
      'Lagos Fire': { flames: 3, label: 'Lagos Fire', color: 'text-rose-600 bg-rose-50 border-rose-200' },
      'Oga At The Top': { flames: 4, label: 'Oga Fire', color: 'text-red-700 bg-red-100 border-red-300' }
    };
    const c = config[level] || config['Medium'];

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold ${c.color}`}>
        <div className="flex items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Flame
              key={i}
              className={`w-3.5 h-3.5 ${i < c.flames ? 'fill-current' : 'opacity-25'}`}
            />
          ))}
        </div>
        <span>{c.label}</span>
      </div>
    );
  };

  return (
    <section id="menu" className="py-20 bg-warm-mesh border-t border-[#111827]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            What is the Kitchen Cooking This Month?
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Click any workday on the calendar to reveal ingredients, spice levels, allergens, and the custom Sub Pack alternative.
          </p>
        </div>

        {/* SIDE-BY-SIDE SPLIT SCREEN: Left Calendar | Right Dish Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Calendar Schedule Picker */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#111827]/10">
            
            {/* Month Switcher Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#111827]/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-extrabold text-lg text-[#111827]">
                  {monthName} {year}
                </h3>
              </div>
              
              {/* Switcher Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className={`p-2 rounded-xl border text-[#111827] transition-all ${
                    !canGoPrev
                      ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed opacity-50'
                      : 'bg-[#FAF9F6] hover:bg-stone-200 border-stone-200 cursor-pointer'
                  }`}
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-stone-200 border border-stone-200 text-[#111827] cursor-pointer transition-all"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => (
                <div key={name} className="text-[11px] font-bold text-stone-400 uppercase py-1">
                  {name}
                </div>
              ))}

              {/* Offset empty slots for first day alignment */}
              {Array.from({ length: mondayBasedOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="p-2 rounded-xl bg-transparent" />
              ))}

              {monthDays.map((item) => {
                const isSelected = item.dayNum === selectedDayInfo?.dayNum;
                const isToday = isCurrentMonth && item.dayNum === todayDate;

                return (
                  <button
                    key={item.dateStr}
                    disabled={item.isWeekend}
                    title={item.isWeekend ? 'Kitchen closed on weekends (Mon to Fri only)' : undefined}
                    onClick={() => {
                      if (item.isWeekend) return;
                      setSelectedDayNum(item.dayNum);
                      setViewSubPack(false);
                    }}
                    className={`relative p-2 rounded-2xl flex flex-col items-center justify-center transition-all min-h-[58px] ${
                      item.isWeekend
                        ? 'bg-stone-100/50 text-stone-300 opacity-40 cursor-not-allowed border-transparent'
                        : isSelected
                        ? 'bg-[#D97706] text-white shadow-md shadow-[#D97706]/30 scale-[1.04] z-10 font-bold cursor-pointer'
                        : 'bg-[#FAF9F6] text-[#111827] hover:bg-amber-50 hover:border-amber-200 border border-[#111827]/10 cursor-pointer'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">
                      {item.dayNum}
                    </span>
                    
                    <span className={`text-[9px] mt-0.5 font-medium truncate max-w-full px-1 ${
                      isSelected ? 'text-amber-100' : item.isWeekend ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      {item.isWeekend ? 'Off' : item.menuItem?.name.split(' ')[0]}
                    </span>

                    {isToday && (
                      <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#D97706]'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#111827]/10 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                Selected Day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-100 border border-stone-200" />
                Weekend Rest
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Selected Day Meal Reveal & Details */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedDayInfo && selectedDayInfo.menuItem ? (
                <motion.div
                  key={selectedDayInfo.dateStr}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#111827]/10 space-y-6"
                >
                  {/* Photo & Date Banner */}
                  <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-[#111827]/10">
                    <img
                      src={selectedDayInfo.menuItem.image}
                      alt={selectedDayInfo.menuItem.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#111827]/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <span>{selectedDayInfo.menuItem.dayOfWeek}</span>
                      <span className="text-[#D97706]">•</span>
                      <span>{selectedDayInfo.menuItem.monthName} {selectedDayInfo.menuItem.dayNumber}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#111827] text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
                      🔥 ~{selectedDayInfo.menuItem.calories} kcal
                    </div>
                  </div>

                  {/* Main Dish Details or Sub Pack */}
                  {!viewSubPack ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {renderSpiceMeter(selectedDayInfo.menuItem.spiceLevel)}
                        
                        {/* Sub Pack Switch Button */}
                        <button
                          onClick={() => setViewSubPack(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Salad className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View FitFam Sub Pack</span>
                        </button>
                      </div>

                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                          {selectedDayInfo.menuItem.name}
                        </h3>

                        <p className="text-sm font-semibold text-[#B45309] mt-1">
                          "{selectedDayInfo.menuItem.tagline}"
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                        {selectedDayInfo.menuItem.description}
                      </p>

                      {/* Ingredients */}
                      <div className="pt-4 border-t border-[#111827]/10">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                          Ingredients & Seasonings:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDayInfo.menuItem.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-3 py-1 rounded-xl bg-[#FAF9F6] text-[#111827] text-xs font-medium border border-[#111827]/10"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Allergens & Kitchen Note */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#111827]/10">
                        <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-900">
                            <strong>Allergens: </strong>
                            {selectedDayInfo.menuItem.allergens.join(', ')}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-[#111827]/10">
                          <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                          <div className="text-xs text-stone-700">
                            <strong>Kitchen Note: </strong>
                            {selectedDayInfo.menuItem.chefNote}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Sub Pack View */
                    <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-200 text-emerald-900 text-xs font-bold uppercase">
                          Sub Pack: {selectedDayInfo.menuItem.subPack.category}
                        </span>
                        
                        <button
                          onClick={() => setViewSubPack(false)}
                          className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                        >
                          ← Back to Signature Dish
                        </button>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                        {selectedDayInfo.menuItem.subPack.name}
                      </h3>

                      <p className="text-sm text-stone-700 leading-relaxed">
                        {selectedDayInfo.menuItem.subPack.description}
                      </p>

                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                          Clean Ingredients:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDayInfo.menuItem.subPack.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-3 py-1 rounded-xl bg-white text-emerald-900 text-xs font-medium border border-emerald-200"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add to Custom Plan CTA */}
                  <div className="pt-4 border-t border-[#111827]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-stone-500">
                      Delivered warm between 11:00 AM – 12:00 PM
                    </div>

                    <button
                      onClick={() => onPlanSelectedDay(selectedDayInfo.dateStr)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Include {selectedDayInfo.menuItem.dayOfWeek} in Plan</span>
                    </button>
                  </div>

                </motion.div>
              ) : (
                /* Non-workday fallback */
                <motion.div
                  key="fallback-weekend"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-10 text-center border border-dashed border-stone-300 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto text-2xl">
                    🏖️
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    No Meal Scheduled for {selectedDayInfo?.date.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                  <p className="text-sm text-stone-600 max-w-md mx-auto">
                    Kitchen is closed for weekend rest or prep. Pick any workday from Monday to Friday!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#111827] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D97706]/20 text-[#D97706] flex items-center justify-center shrink-0 border border-[#D97706]/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base sm:text-lg">Don’t Like What You See?</h4>
              <p className="text-xs text-stone-300 max-w-md">
                Skip any day’s meal before 9:00 PM the night before and get an automatic subscription credit.
              </p>
            </div>
          </div>

          <a
            href="#pricing"
            className="px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shrink-0 shadow-lg shadow-[#D97706]/20"
          >
            Start Plan
          </a>
        </div>

      </div>
    </section>
  );
}
