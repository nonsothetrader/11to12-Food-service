import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Bike, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Check, 
  AlertTriangle,
  Lock,
  MinusCircle
} from 'lucide-react';
import { MenuItem } from '../types';

export type DashboardMode = 'morning' | 'dispatch' | 'post_lunch';
export type TomorrowChoice = 'accept' | 'skip' | 'none';

interface MealActionCardProps {
  currentDate: Date;
  todayMeal: MenuItem | null;
  tomorrowMeal: MenuItem | null;
  creditsBalance: number;
  onSkipToday: (dateStr: string) => void;
  onUndoSkipToday: (dateStr: string) => void;
  isTodaySkipped: boolean;
  onConfirmDelivery: () => void;
  isDeliveryConfirmed: boolean;
  // Tomorrow's state & actions
  tomorrowChoice: TomorrowChoice;
  onSelectTomorrowChoice: (choice: TomorrowChoice) => void;
  isPast8PM: boolean;
  extraPlates?: number;
  onUpdateExtraPlates?: (plates: number) => void;
}

export default function MealActionCard({
  currentDate,
  todayMeal,
  tomorrowMeal,
  creditsBalance,
  onSkipToday,
  onUndoSkipToday,
  isTodaySkipped,
  onConfirmDelivery,
  isDeliveryConfirmed,
  tomorrowChoice,
  onSelectTomorrowChoice,
  isPast8PM,
  extraPlates = 0,
  onUpdateExtraPlates
}: MealActionCardProps) {
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const timeInDec = currentHour + currentMinute / 60;

  // Time Rules:
  // Before 9:00 AM: Morning prep
  // 9:00 AM – 1:00 PM: Food is on the way (Dispatch Mode)
  // 1:00 PM onwards: Food delivered / confirm receipt (Post-Lunch Mode)
  let activeMode: DashboardMode = 'morning';
  if (timeInDec >= 9 && timeInDec < 13) {
    activeMode = 'dispatch';
  } else if (timeInDec >= 13) {
    activeMode = 'post_lunch';
  }

  const [rating, setRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Undo notification message state
  const [undoMessage, setUndoMessage] = useState<string | null>(null);

  // 5-Minute Undo Countdown (300 seconds)
  const [undoSecondsLeft, setUndoSecondsLeft] = useState<number>(300);

  // Confirmation Modal State for Tomorrow's Choice
  const [pendingChoice, setPendingChoice] = useState<TomorrowChoice | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTodaySkipped && undoSecondsLeft > 0) {
      timer = setInterval(() => {
        setUndoSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTodaySkipped, undoSecondsLeft]);

  const handleSkip = () => {
    if (!todayMeal) return;
    setUndoSecondsLeft(300);
    setUndoMessage(null);
    onSkipToday(todayMeal.dateStr);
  };

  const handleUndo = () => {
    if (!todayMeal) return;
    onUndoSkipToday(todayMeal.dateStr);
    setUndoMessage("Lagos stress avoided! Last action reversed.");
    setTimeout(() => {
      setUndoMessage(null);
    }, 6000);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Real-time countdown to tomorrow's 11:00 AM delivery window ("Countdown to Culinary Salvation")
  const [tomorrowCountdown, setTomorrowCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTomorrowTimer = () => {
      const now = new Date();
      const target = new Date();
      if (now.getHours() >= 11) {
        target.setDate(target.getDate() + 1);
      }
      target.setHours(11, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTomorrowCountdown({ hours: h, minutes: m, seconds: s });
      }
    };

    updateTomorrowTimer();
    const interval = setInterval(updateTomorrowTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInitiateChoice = (choice: TomorrowChoice) => {
    if (isPast8PM) return;
    setPendingChoice(choice);
  };

  const handleConfirmChoice = () => {
    if (pendingChoice) {
      onSelectTomorrowChoice(pendingChoice);
      setPendingChoice(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================
          CONFIRMATION MODAL (CANNOT BE REVERSED)
         ======================================================== */}
      <AnimatePresence>
        {pendingChoice !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#1E140A]/15 text-left space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1E140A] font-display">
                    Confirm Tomorrow's Decision
                  </h3>
                  <p className="text-xs text-[#1E140A]/60">
                    Important: This action cannot be reversed
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-2">
                <div className="text-xs font-extrabold uppercase text-[#1E140A]/60 tracking-wider">
                  You are selecting:
                </div>
                <div className="text-sm font-extrabold text-[#1E140A]">
                  {pendingChoice === 'accept' && "✅ Accept Tomorrow's Meal Delivery"}
                  {pendingChoice === 'skip' && "💳 Skip Tomorrow's Meal (+1 Credit Banked)"}
                  {pendingChoice === 'none' && "🚫 Forfeit Delivery (Take No Food At All)"}
                </div>
                <p className="text-xs text-[#1E140A]/70 leading-relaxed pt-1">
                  {pendingChoice === 'accept' && "Tomorrow's chef special will be freshly cooked and delivered directly to your office desk between 11:00 AM – 12:00 PM."}
                  {pendingChoice === 'skip' && "1 meal credit will be added to your Lunch Insurance balance to rollover into next month. No food will be cooked for your desk tomorrow."}
                  {pendingChoice === 'none' && "You are choosing to receive no food tomorrow (fasting, traveling, or out of office). No food will be dispatched."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/25 text-[11px] text-[#1E140A] font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-[#FF5500]" />
                <span>Our kitchen preps based on exact headcount. This choice cannot be changed once confirmed.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingChoice(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#1E140A]/15 hover:bg-stone-100 text-[#1E140A] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel / Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmChoice}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#1E140A] hover:bg-[#FF5500] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Yes, Confirm Choice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Undo Reversed Feedback Banner */}
      <AnimatePresence>
        {undoMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-between gap-3 border border-emerald-700 font-sans"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>{undoMessage}</span>
            </div>
            <button
              onClick={() => setUndoMessage(null)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5-Minute Undo Banner (If skipped) */}
      <AnimatePresence>
        {isTodaySkipped && undoSecondsLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1E140A] text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#FF5500]/30 font-sans"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center font-bold text-lg">
                <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                  <span>1 credit added. We only accept skips before 12 PM because our chefs aren't psychics.</span>
                  <span className="bg-[#FF5500] text-white px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0">
                    {formatTime(undoSecondsLeft)} left
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Did your colleague cancel their lunch plans? Undo now to keep today's desk delivery.
                </p>
              </div>
            </div>

            <button
              onClick={handleUndo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1E140A] text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#FF5500]" />
              <span>Undo Skip</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          ROW SECTION: TODAY'S MEAL & LIVE DISPATCH TRACKER
         ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-xl overflow-hidden font-sans">
        
        {/* Status Bar */}
        <div className="bg-[#1E140A] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${
              activeMode === 'dispatch' ? 'bg-emerald-400 animate-ping' : activeMode === 'post_lunch' ? 'bg-emerald-500' : 'bg-[#FF5500] animate-pulse'
            }`} />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5500]">
              {activeMode === 'dispatch' 
                ? 'Live Dispatch Window (9:00 AM – 1:00 PM)' 
                : activeMode === 'post_lunch'
                ? 'Delivery Completed (1:00 PM+)'
                : 'Morning Kitchen Prep (Before 9:00 AM)'}
            </span>
          </div>

          <div className="text-xs font-semibold text-stone-300">
            Desk Delivery Window: <strong className="text-white">11:00 AM – 12:00 PM</strong>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Headline for Dispatch vs Morning vs Post-lunch */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E140A]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5500] block mb-1">
                Today's Lunch Order
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display">
                {activeMode === 'dispatch' 
                  ? 'Our rider is currently battling Lagos traffic for your stomach.' 
                  : activeMode === 'post_lunch'
                  ? 'Your lunch has arrived! Confirm receipt below.'
                  : 'Your kitchen special is cooking in morning batches.'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isTodaySkipped
                  ? 'bg-rose-100 text-rose-800'
                  : isDeliveryConfirmed
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeMode === 'dispatch'
                  ? 'bg-[#FF5500]/15 text-[#FF5500] animate-pulse font-extrabold'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {isTodaySkipped 
                  ? 'Skipped (Credit Banked)' 
                  : isDeliveryConfirmed 
                  ? 'Delivered to Desk' 
                  : activeMode === 'dispatch' 
                  ? 'Rider En Route' 
                  : 'Kitchen Prepping'}
              </span>
            </div>
          </div>

          {/* If today is NOT skipped, show the active meal and live tracker */}
          {!isTodaySkipped && todayMeal ? (
            <div className="space-y-8">
              
              {/* Dispatch Progress Tracker (Active 9:00 AM - 1:00 PM & Post 1:00 PM) */}
              <div className="space-y-4 bg-[#FAF4EB] p-6 rounded-2xl border border-[#1E140A]/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#1E140A]/70">
                    Live Route Status (9:00 AM – 1:00 PM)
                  </span>
                  <span className="text-xs font-bold text-[#FF5500]">
                    {isDeliveryConfirmed ? '100% Complete' : activeMode === 'dispatch' ? 'Island Transit' : 'Kitchen Ready'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-2">
                  <div className="overflow-hidden h-2.5 mb-6 text-xs flex rounded-full bg-[#1E140A]/10">
                    <div
                      style={{ 
                        width: isDeliveryConfirmed ? '100%' : activeMode === 'dispatch' ? '75%' : '30%' 
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-linear-to-r from-[#FF5500] to-emerald-500 transition-all duration-700"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                    <div className="text-emerald-700">
                      <div className="w-7 h-7 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                        <Check className="w-4 h-4" />
                      </div>
                      Kitchen Boxed
                    </div>
                    <div className={activeMode === 'dispatch' || activeMode === 'post_lunch' || isDeliveryConfirmed ? 'text-emerald-700' : 'text-stone-400'}>
                      <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        activeMode === 'dispatch' || activeMode === 'post_lunch' || isDeliveryConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      Dispatched
                    </div>
                    <div className={isDeliveryConfirmed ? 'text-emerald-700' : activeMode === 'dispatch' ? 'text-[#FF5500]' : 'text-stone-400'}>
                      <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        isDeliveryConfirmed ? 'bg-emerald-100 text-emerald-700' : activeMode === 'dispatch' ? 'bg-[#FF5500]/15 text-[#FF5500] animate-pulse' : 'bg-stone-100 text-stone-400'
                      }`}>
                        <Bike className="w-4 h-4" />
                      </div>
                      In Building
                    </div>
                    <div className={isDeliveryConfirmed ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>
                      <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 ${
                        isDeliveryConfirmed ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      At Your Desk
                    </div>
                  </div>
                </div>
              </div>

              {/* Rider & Confirmation Row */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#1E140A]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E140A] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                    🏍️
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-[#FF5500] tracking-wider">
                      Assigned Lagos Dispatch Rider
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-[#1E140A] font-display">
                      Emeka Nwosu
                    </h4>
                    <p className="text-xs text-[#1E140A]/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      Honda 125 (Plate: KJA-482-XY) • Falomo / Marina Express Route
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href="tel:08031234567"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-[#1E140A]/15 text-xs font-bold text-[#1E140A] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Rider</span>
                  </a>

                  {/* 1:00 PM Confirmation Button */}
                  {!isDeliveryConfirmed ? (
                    <button
                      type="button"
                      onClick={onConfirmDelivery}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold shadow-lg shadow-[#FF5500]/25 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Lunch Received</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-5 py-3 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Desk Drop Confirmed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rate Today's Lunch (Shown when post lunch or confirmed) */}
              {(activeMode === 'post_lunch' || isDeliveryConfirmed) && (
                <div className="p-5 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-[#1E140A] text-sm sm:text-base font-display">
                      How was today's lunch?
                    </h4>
                    <p className="text-xs text-[#1E140A]/70 mt-0.5">
                      Your ratings help our head chef fine-tune pepper levels and portion balance for your floor.
                    </p>
                  </div>

                  {!ratingSubmitted ? (
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRating(star);
                            setRatingSubmitted(true);
                          }}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-125 cursor-pointer ${
                            rating && rating >= star ? 'text-[#FF5500]' : 'text-stone-300 hover:text-[#FF5500]'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Rating of {rating}★ submitted! Thank you.</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : isTodaySkipped ? (
            <div className="p-8 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FF5500]/15 text-[#FF5500] mx-auto flex items-center justify-center font-bold text-xl">
                💳
              </div>
              <h3 className="text-lg font-black text-[#1E140A] font-display">
                You have skipped today's meal
              </h3>
              <p className="text-xs text-[#1E140A]/70 max-w-md mx-auto">
                1 credit added. We only accept skips before 12 PM because our chefs aren't psychics. Your balance is safely in your Lunch Insurance wallet.
              </p>
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-[#1E140A]/15 text-xs font-bold text-[#1E140A] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Undo Skip (Keep Lunch)</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="text-3xl">🏖️</div>
              <h3 className="text-xl font-black text-[#1E140A] font-display">Weekend Rest</h3>
              <p className="text-sm text-[#1E140A]/60">The kitchen is resting and prepping fresh stocks for Monday.</p>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================
          ROW SECTION: TOMORROW'S MEAL & 8:00 PM CUTOFF
          "Countdown to Culinary Salvation"
         ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#1E140A]/10 shadow-xl overflow-hidden font-sans">
        
        {/* Header Countdown Bar */}
        <div className="bg-[#1E140A] text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#FF5500] tracking-wider block">
              Tomorrow's Desk Drop
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-display">
              Countdown to Culinary Salvation (Tomorrow's 11 AM window)
            </h3>
          </div>

          {/* Live Ticker Clock */}
          <div className="flex items-center gap-2 font-mono">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
              <span className="text-lg font-black text-[#FF5500]">
                {String(tomorrowCountdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-stone-400 block uppercase">Hrs</span>
            </div>
            <span className="text-lg font-bold text-white/40">:</span>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
              <span className="text-lg font-black text-[#FF5500]">
                {String(tomorrowCountdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-stone-400 block uppercase">Min</span>
            </div>
            <span className="text-lg font-bold text-white/40">:</span>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
              <span className="text-lg font-black text-[#FF5500]">
                {String(tomorrowCountdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-stone-400 block uppercase">Sec</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* 8:00 PM Cutoff Notification Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isPast8PM 
              ? 'bg-[#1E140A] text-white border-[#1E140A]' 
              : 'bg-[#FF5500]/10 text-[#1E140A] border-[#FF5500]/25'
          }`}>
            <div className="flex items-center gap-3">
              {isPast8PM ? (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FF5500] shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="font-black text-xs sm:text-sm">
                  {isPast8PM
                    ? '8:00 PM Cutoff Passed — Selection Locked!'
                    : 'Tomorrow’s Meal Selection Window (Locks tonight at 8:00 PM)'}
                </div>
                <p className={`text-xs mt-0.5 ${isPast8PM ? 'text-stone-300' : 'text-[#1E140A]/80'}`}>
                  {isPast8PM
                    ? 'After 8:00 PM, choices are locked and the 3 action buttons are disabled. It is automatically taken that you want tomorrow’s meal.'
                    : 'You can only do 3 things: accept meal, skip for credit, or forfeit delivery. After 8:00 PM, buttons lock.'}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1 ${
                isPast8PM ? 'bg-[#FF5500] text-white' : 'bg-white text-[#1E140A] border border-[#1E140A]/15'
              }`}>
                {isPast8PM ? 'Locked for Prep' : 'Editable until 8:00 PM'}
              </span>
            </div>
          </div>

          {/* Tomorrow's Dish Showcase (Single meal only - no alternatives) */}
          {tomorrowMeal && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-[#1E140A]/60 tracking-wider">
                    Menu for {tomorrowMeal.dayOfWeek} (One Meal For The Day)
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1E140A] font-display">
                    {tomorrowMeal.name}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-xl bg-[#FAF4EB] border border-[#1E140A]/10 text-[#1E140A] text-xs font-bold">
                  {tomorrowMeal.dayOfWeek === 'Friday' ? '🍲 Friday Swallow' : '🍛 Strict Alternation'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FAF4EB] p-6 rounded-3xl border border-[#1E140A]/10">
                <div className="md:col-span-4 rounded-2xl overflow-hidden aspect-4/3 bg-stone-100">
                  <img
                    src={tomorrowMeal.image}
                    alt={tomorrowMeal.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="md:col-span-8 space-y-3">
                  <p className="text-sm text-[#1E140A]/80 leading-relaxed">
                    {tomorrowMeal.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tomorrowMeal.ingredients.map(ing => (
                      <span key={ing} className="px-2.5 py-1 rounded-xl bg-white text-[#1E140A] text-xs font-medium border border-[#1E140A]/10">
                        {ing}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-xs text-[#1E140A]/60 font-semibold">
                    Current Status:{' '}
                    <strong className="text-[#FF5500]">
                      {tomorrowChoice === 'accept' ? 'Scheduled for Delivery' : tomorrowChoice === 'skip' ? 'Skipped (Credit Banked)' : 'Delivery Forfeited (No Food)'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tomorrow's 3-Way Choice Buttons (Accept, Skip, Take No Food at all) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#1E140A]/70">
                Choose for tomorrow (3 options only):
              </div>
              {isPast8PM && (
                <span className="text-xs text-rose-500 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Faded & Locked after 8:00 PM
                </span>
              )}
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
              isPast8PM ? 'opacity-40 pointer-events-none cursor-not-allowed' : ''
            }`}>
              
              {/* Option 1: Accept Tomorrow's Meal */}
              <button
                type="button"
                disabled={isPast8PM}
                onClick={() => handleInitiateChoice('accept')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isPast8PM ? 'cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500'
                } ${
                  tomorrowChoice === 'accept'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-[#FAF4EB] border-[#1E140A]/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${tomorrowChoice === 'accept' ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span className="font-black text-sm text-[#1E140A]">Accept Meal</span>
                  </div>
                  {tomorrowChoice === 'accept' && (
                    <span className="text-[10px] uppercase font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1E140A]/70">
                  Deliver tomorrow's single chef special between 11:00 AM – 12:00 PM.
                </p>
              </button>

              {/* Option 2: Skip Tomorrow's Meal */}
              <button
                type="button"
                disabled={isPast8PM}
                onClick={() => handleInitiateChoice('skip')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isPast8PM ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[#FF5500]'
                } ${
                  tomorrowChoice === 'skip'
                    ? 'bg-[#FF5500]/10 border-[#FF5500] ring-2 ring-[#FF5500]/20'
                    : 'bg-[#FAF4EB] border-[#1E140A]/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <XCircle className={`w-4 h-4 ${tomorrowChoice === 'skip' ? 'text-[#FF5500]' : 'text-stone-400'}`} />
                    <span className="font-black text-sm text-[#1E140A]">Skip (+1 Credit)</span>
                  </div>
                  {tomorrowChoice === 'skip' && (
                    <span className="text-[10px] uppercase font-extrabold bg-[#FF5500] text-white px-2 py-0.5 rounded-md">
                      Banked
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1E140A]/70">
                  Skip tomorrow and deposit 1 meal credit to your Lunch Insurance balance.
                </p>
              </button>

              {/* Option 3: Forfeit / Take No Food at All */}
              <button
                type="button"
                disabled={isPast8PM}
                onClick={() => handleInitiateChoice('none')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isPast8PM ? 'cursor-not-allowed' : 'cursor-pointer hover:border-stone-400'
                } ${
                  tomorrowChoice === 'none'
                    ? 'bg-stone-200/70 border-stone-600 ring-2 ring-stone-600/20'
                    : 'bg-[#FAF4EB] border-[#1E140A]/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MinusCircle className={`w-4 h-4 ${tomorrowChoice === 'none' ? 'text-stone-700' : 'text-stone-400'}`} />
                    <span className="font-black text-sm text-[#1E140A]">Forfeit Delivery</span>
                  </div>
                  {tomorrowChoice === 'none' && (
                    <span className="text-[10px] uppercase font-extrabold bg-[#1E140A] text-white px-2 py-0.5 rounded-md">
                      Forfeited
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1E140A]/70">
                  Take no food at all for tomorrow (out of office or fasting).
                </p>
              </button>

            </div>
          </div>

          {/* Extra Plates with Credits Section (When Tomorrow is Accepted) */}
          {tomorrowChoice === 'accept' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-[#FAF4EB] border border-[#FF5500]/30 space-y-4 font-sans"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E140A]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider">
                      Feed A Colleague / Extra Portion
                    </span>
                    <span className="text-xs font-bold text-stone-500 font-mono">
                      1 Credit = 1 Extra Plate
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#1E140A] font-display mt-1">
                    Add Extra Plates to Tomorrow's Desk Drop
                  </h4>
                  <p className="text-xs text-[#1E140A]/70 mt-0.5">
                    Have unused Lunch Insurance credits? Use them to add extra plates for colleagues, interns, or team members.
                  </p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#1E140A]/10 text-right shrink-0">
                  <div className="text-[10px] font-black uppercase text-[#1E140A]/60">
                    Available Insurance Wallet
                  </div>
                  <div className="text-lg font-black font-display text-[#FF5500]">
                    {creditsBalance} {creditsBalance === 1 ? 'Credit' : 'Credits'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-[#1E140A]">
                      Standard Plate: <span className="text-[#FF5500]">1 Included</span>
                    </div>
                    <div className="text-stone-600">
                      Extra Plates via Credit: <strong className="text-[#1E140A]">+{extraPlates}</strong> ({extraPlates} {extraPlates === 1 ? 'Credit' : 'Credits'} Deducted)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#1E140A]">Adjust Extra Plates:</span>
                  <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#1E140A]/15 shadow-xs">
                    <button
                      type="button"
                      disabled={isPast8PM || extraPlates <= 0}
                      onClick={() => onUpdateExtraPlates && onUpdateExtraPlates(Math.max(0, extraPlates - 1))}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-[#1E140A] font-black text-base flex items-center justify-center cursor-pointer"
                      title="Remove 1 extra plate"
                    >
                      −
                    </button>
                    
                    <span className="font-black text-sm w-8 text-center font-display text-[#1E140A]">
                      {extraPlates}
                    </span>

                    <button
                      type="button"
                      disabled={isPast8PM || (creditsBalance <= 0 && extraPlates >= creditsBalance)}
                      onClick={() => onUpdateExtraPlates && onUpdateExtraPlates(extraPlates + 1)}
                      className="w-8 h-8 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs"
                      title="Add 1 extra plate using 1 credit"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Delivery Summary Banner */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#1E140A]/10 flex items-center justify-between text-xs">
                <span className="font-bold text-[#1E140A]">
                  Total Kitchen Warmer Count for Your Desk:
                </span>
                <span className="font-black text-sm font-display text-[#FF5500]">
                  {1 + extraPlates} {1 + extraPlates === 1 ? 'Plate' : 'Plates Total'}
                </span>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}
