import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wallet, 
  ChevronDown, 
  ArrowLeft,
  Building2,
  Megaphone,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Bike
} from 'lucide-react';
import MealActionCard, { TomorrowChoice } from './MealActionCard';
import { DEFAULT_DASHBOARD_USER, DashboardUser, getMealForDate } from '../lib/data';
import { MenuItem } from '../types';
import { useAppStore } from '../lib/useAppStore';

interface UserDashboardProps {
  onNavigateHome?: () => void;
}

// Savage Lagos Office Lunch FAQ items
const SAVAGE_DASHBOARD_FAQS = [
  {
    q: "Can I cancel or am I trapped forever?",
    a: "You can pause, skip, or cancel your subscription anytime directly with zero hidden penalties. We don't hold hostages in corporate Lagos—though your colleagues will definitely judge you when you're eating cold fast food while they're enjoying firewood jollof."
  },
  {
    q: "Why can't I change my meal at 11:59 AM?",
    a: "Because our chefs aren't psychics and our dispatch bikes don't have time-travel capabilities. By 9:00 AM, fresh batches are cooked, boxed, and packed in thermal insulated bags. We only accept skips before 12 PM because kitchen prep follows strict discipline."
  },
  {
    q: "Why does tomorrow's choice lock at 8:00 PM tonight?",
    a: "Our head chefs source fresh farm proteins, live catfish, and market produce at 5:00 AM every morning based on exact headcount. After 8:00 PM, kitchen orders are locked and it is automatically taken that you want tomorrow's meal."
  },
  {
    q: "Why is there only one meal option per day?",
    a: "Quality over chaos. By focusing entirely on mastering one spectacular, fresh Nigerian meal each day, we guarantee hot, premium-grade desk delivery between 11:00 AM and 12:00 PM without cut corners or delays."
  },
  {
    q: "What happens if Third Mainland Bridge has bumper-to-bumper traffic?",
    a: "Our riders are dedicated island navigators who know every backstreet through Falomo, Marina, and Oniru. Your meal is pre-dispatched in temperature-holding insulated boxes to hit your desk between 11:00 AM and 12:00 PM guaranteed."
  },
  {
    q: "How does my Lunch Insurance wallet work?",
    a: "Whenever you skip a meal before the cutoff, 1 meal credit is automatically deposited into your Lunch Insurance balance. Use them or lose them (don't lose them)—they rollover seamlessly into your next month."
  }
];

export default function UserDashboard({ onNavigateHome }: UserDashboardProps) {
  const { store, actions } = useAppStore();
  
  // User Profile state
  const [user, setUser] = useState<DashboardUser>(() => {
    try {
      const savedWaitlist = localStorage.getItem('11to12_waitlist_user');
      if (savedWaitlist) {
        const parsed = JSON.parse(savedWaitlist);
        return {
          ...DEFAULT_DASHBOARD_USER,
          name: parsed.fullName || DEFAULT_DASHBOARD_USER.name,
          email: parsed.workEmail || DEFAULT_DASHBOARD_USER.email,
          phone: parsed.phone || DEFAULT_DASHBOARD_USER.phone,
          building: parsed.address || DEFAULT_DASHBOARD_USER.building,
          area: parsed.area || DEFAULT_DASHBOARD_USER.area
        };
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_DASHBOARD_USER;
  });

  const [extraPlates, setExtraPlates] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('11to12_extra_plates');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Real-time Clock State (updates every 5 seconds)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentDate.getHours();
  
  // Dynamic Welcome Header copy based on time of day
  const getGreetingHeader = () => {
    if (currentHour < 12) {
      return "Your stomach called. We answered.";
    } else if (currentHour < 17) {
      return "Powering your spreadsheets one meal at a time.";
    } else {
      return "Your stomach called. We answered.";
    }
  };

  // Skip Saturday & Sunday for cooking schedules
  let workingToday = new Date(currentDate);
  if (workingToday.getDay() === 0) { // Sunday -> Monday
    workingToday.setDate(workingToday.getDate() + 1);
  } else if (workingToday.getDay() === 6) { // Saturday -> Monday
    workingToday.setDate(workingToday.getDate() + 2);
  }

  const workingTomorrow = new Date(workingToday);
  workingTomorrow.setDate(workingTomorrow.getDate() + 1);
  if (workingTomorrow.getDay() === 6) { // Friday's tomorrow -> Monday
    workingTomorrow.setDate(workingTomorrow.getDate() + 2);
  } else if (workingTomorrow.getDay() === 0) { // Sunday -> Monday
    workingTomorrow.setDate(workingTomorrow.getDate() + 1);
  }

  const todayMeal = useMemo(() => getMealForDate(workingToday), [workingToday.toDateString()]);
  const tomorrowMeal = useMemo(() => getMealForDate(workingTomorrow), [workingTomorrow.toDateString()]);

  // Skipped dates
  const [skippedDates, setSkippedDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('11to12_skipped_dates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Delivery confirmation
  const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);

  // Tomorrow's choice: 'accept' | 'skip' | 'none'
  const [tomorrowChoice, setTomorrowChoice] = useState<TomorrowChoice>(() => {
    try {
      const saved = localStorage.getItem('11to12_tomorrow_choice');
      return (saved as TomorrowChoice) || 'accept';
    } catch {
      return 'accept';
    }
  });

  // Is past 8:00 PM (20:00) calculated strictly in real-time
  const isPast8PM = currentHour >= 20;

  // Skip today handler
  const handleSkipToday = (dateStr: string) => {
    setSkippedDates(prev => {
      const next = [...prev, dateStr];
      localStorage.setItem('11to12_skipped_dates', JSON.stringify(next));
      return next;
    });
    setUser(prev => ({
      ...prev,
      creditsBalance: prev.creditsBalance + 1
    }));
  };

  // Undo skip today handler
  const handleUndoSkipToday = (dateStr: string) => {
    setSkippedDates(prev => {
      const next = prev.filter(d => d !== dateStr);
      localStorage.setItem('11to12_skipped_dates', JSON.stringify(next));
      return next;
    });
    setUser(prev => ({
      ...prev,
      creditsBalance: Math.max(0, prev.creditsBalance - 1)
    }));
  };

  // Select tomorrow's choice handler
  const handleSelectTomorrowChoice = (choice: TomorrowChoice) => {
    if (isPast8PM) return; // Locked after 8:00 PM!
    
    // Adjust credits if changing to or from skip
    if (choice === 'skip' && tomorrowChoice !== 'skip') {
      setUser(prev => ({ ...prev, creditsBalance: prev.creditsBalance + 1 }));
      actions.recordUserDecisionWithCredits(user.email, 'skip', 0, 'skipped');
    } else if (tomorrowChoice === 'skip' && choice !== 'skip') {
      setUser(prev => ({ ...prev, creditsBalance: Math.max(0, prev.creditsBalance - 1) }));
    }

    if (choice === 'accept') {
      actions.recordUserDecisionWithCredits(user.email, 'accept', extraPlates, 'explicit_accept');
    } else if (choice === 'none') {
      actions.recordUserDecisionWithCredits(user.email, 'cancel', 0, 'cancelled');
    }

    setTomorrowChoice(choice);
    localStorage.setItem('11to12_tomorrow_choice', choice);
  };

  // Update extra plates with credits
  const handleUpdateExtraPlates = (newPlates: number) => {
    if (isPast8PM) return;
    const diff = newPlates - extraPlates;
    if (diff > 0 && user.creditsBalance < diff) return; // Not enough credits

    setUser(prev => ({
      ...prev,
      creditsBalance: Math.max(0, prev.creditsBalance - diff)
    }));
    setExtraPlates(newPlates);
    localStorage.setItem('11to12_extra_plates', String(newPlates));

    // Real-time broadcast to Admin Order Management!
    actions.recordUserDecisionWithCredits(user.email, 'accept', newPlates, 'explicit_accept');
  };

  const isTodaySkipped = todayMeal ? skippedDates.includes(todayMeal.dateStr) : false;

  // Generate this week's 5-day schedule (Mon-Fri)
  const [weekSchedule, setWeekSchedule] = useState<Array<{ date: Date; meal: MenuItem | null }>>([]);

  useEffect(() => {
    const monday = new Date(workingToday);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
    monday.setDate(diff);

    const schedule = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      schedule.push({
        date: d,
        meal: getMealForDate(d)
      });
    }
    setWeekSchedule(schedule);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF4EB] text-[#1E140A] pb-24 font-sans">
      
      {/* ========================================================
          ROW 1: WELCOME HEADER & LUNCH INSURANCE ROW
         ======================================================== */}
      <header className="bg-white/90 backdrop-blur-xs border-b border-[#1E140A]/10 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* User Greeting & Status */}
            <div className="flex items-center gap-4">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="p-2.5 rounded-xl border border-[#1E140A]/15 hover:bg-[#FAF4EB] text-[#1E140A] transition-colors cursor-pointer"
                  title="Return to Landing Page"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <div className="w-12 h-12 rounded-2xl bg-[#1E140A] text-[#FF5500] font-black flex items-center justify-center text-lg shadow-sm shrink-0 font-display">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#1E140A] font-display">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold font-sans">
                    Active Subscriber
                  </span>
                </div>

                {/* Specific Header Copy */}
                <p className="text-sm font-extrabold text-[#FF5500] mt-0.5 flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-4 h-4 text-[#FF5500]" />
                  <span>"{getGreetingHeader()}"</span>
                </p>

                <p className="text-xs text-[#1E140A]/60 flex items-center gap-1 mt-0.5 font-sans">
                  <Building2 className="w-3.5 h-3.5 text-[#1E140A]/40" />
                  <span>{user.building} ({user.area}) • Desk Drop 11:00 AM – 12:00 PM</span>
                </p>
              </div>
            </div>

            {/* Meal Credit Tracker: "Lunch Insurance" */}
            <div className="flex items-center gap-3 font-sans">
              <div className="p-4 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/25 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase font-black text-[#1E140A] tracking-wider flex items-center gap-1">
                    <span>Lunch Insurance</span>
                    <span className="text-[10px] font-bold text-[#FF5500]">({user.creditsBalance} credits)</span>
                  </div>
                  <div className="text-xs font-semibold text-[#1E140A]/80 mt-0.5">
                    "Use them or lose them (don't lose them)."
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container - Sequential Stacked Rows */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Live Admin Broadcast Announcements */}
        {store.announcements.filter(a => a.active).length > 0 && (
          <div className="space-y-3">
            {store.announcements.filter(a => a.active).map(ann => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border shadow-md flex items-start gap-4 ${
                  ann.level === 'savage'
                    ? 'bg-[#1E140A] text-white border-[#FF5500]/50'
                    : ann.level === 'critical'
                    ? 'bg-rose-950 text-white border-rose-500'
                    : 'bg-[#FAF4EB] text-[#1E140A] border-[#FF5500]/30'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-[#FF5500]">
                      HQ Broadcast
                    </span>
                    <span className="text-[10px] opacity-70 font-mono">
                      {ann.timestamp}
                    </span>
                  </div>
                  <h4 className="font-black text-sm font-display tracking-tight">
                    {ann.title}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-90 font-sans">
                    {ann.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ========================================================
            ROW 2 & 3: MEAL ACTION CARDS
            (Today's Dispatch & Tomorrow's Culinary Salvation)
           ======================================================== */}
        <MealActionCard
          currentDate={currentDate}
          todayMeal={todayMeal}
          tomorrowMeal={tomorrowMeal}
          creditsBalance={user.creditsBalance}
          onSkipToday={handleSkipToday}
          onUndoSkipToday={handleUndoSkipToday}
          isTodaySkipped={isTodaySkipped}
          onConfirmDelivery={() => setIsDeliveryConfirmed(true)}
          isDeliveryConfirmed={isDeliveryConfirmed}
          tomorrowChoice={tomorrowChoice}
          onSelectTomorrowChoice={handleSelectTomorrowChoice}
          isPast8PM={isPast8PM}
          extraPlates={extraPlates}
          onUpdateExtraPlates={handleUpdateExtraPlates}
        />

        {/* ========================================================
            ROW 4: MENU ROTATION (LAGOS RULES)
           ======================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1E140A]/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1E140A]/10">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#FF5500] tracking-wider block font-sans">
                Office Lunch Rule Enforced
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E140A] font-display">
                Menu Rotation (Lagos Rules)
              </h2>
            </div>
            
            <div className="space-y-1 text-xs text-[#1E140A]/70 sm:text-right font-sans">
              <div className="font-bold text-[#1E140A]">
                Mon–Thu: Alternates between Rice and Non-Rice to prevent "Jollof Fatigue."
              </div>
              <div className="text-purple-700 font-semibold">
                Friday: Dedicated Swallow Day rotating through traditional Nigerian soups.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {weekSchedule.map(({ date, meal }, idx) => {
              if (!meal) return null;
              const isFriday = idx === 4;
              const isRice = idx % 2 === 0 && !isFriday;
              const isToday = date.toDateString() === workingToday.toDateString();
              const isSkipped = skippedDates.includes(meal.dateStr);

              return (
                <div
                  key={meal.id}
                  className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-[#FF5500]/5 border-[#FF5500] ring-2 ring-[#FF5500]/20'
                      : 'bg-[#FAF4EB] border-[#1E140A]/10 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#1E140A] font-display">
                        {meal.dayOfWeek}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-sans ${
                        isFriday 
                          ? 'bg-purple-100 text-purple-900'
                          : isRice 
                            ? 'bg-[#FF5500]/15 text-[#FF5500]'
                            : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {isFriday ? 'Friday Swallow' : isRice ? 'Rice Classic' : 'Non-Rice'}
                      </span>
                    </div>

                    <div className="aspect-video rounded-xl overflow-hidden bg-stone-100 relative">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isSkipped && (
                        <div className="absolute inset-0 bg-[#1E140A]/80 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold font-sans">
                          Skipped (1 Credit Added)
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#1E140A] font-display line-clamp-2 leading-tight">
                        {meal.name}
                      </h4>
                      <p className="text-[11px] text-[#1E140A]/60 mt-1 line-clamp-2 font-sans">
                        {meal.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            ROW 5: SAVAGE FAQ ROW
           ======================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1E140A]/10 shadow-xl space-y-6">
          <div className="pb-4 border-b border-[#1E140A]/10">
            <span className="text-xs uppercase font-extrabold text-[#FF5500] tracking-wider block font-sans">
              Unfiltered Office Realities
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E140A] font-display">
              Frequently Asked Questions (Savage Edition)
            </h2>
            <p className="text-xs text-[#1E140A]/60 mt-1 font-sans">
              Direct, transparent answers to corporate Lagos hunger questions.
            </p>
          </div>

          <div className="space-y-3">
            {SAVAGE_DASHBOARD_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'bg-[#FAF4EB] border-[#FF5500] shadow-xs'
                      : 'bg-white border-[#1E140A]/10 hover:border-stone-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-[#1E140A] text-sm sm:text-base font-display">
                      {faq.q}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                      isOpen ? 'bg-[#FF5500] text-white rotate-180' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#1E140A]/80 leading-relaxed border-t border-[#1E140A]/10 pt-3 font-sans">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>

    </div>
  );
}
