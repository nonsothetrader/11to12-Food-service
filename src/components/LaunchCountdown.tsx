import { useState, useEffect } from 'react';
import { Sparkles, BellRing } from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function LaunchCountdown() {
  // Target Launch Date: October 12, 2026 00:00:00 Lagos Time
  const TARGET_DATE = new Date('2026-10-12T00:00:00+01:00').getTime();

  const calculateTimeLeft = (): CountdownTime => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (value: number) => String(value).padStart(2, '0');

  const timeUnits = [
    { label: 'Days', value: formatUnit(timeLeft.days) },
    { label: 'Hours', value: formatUnit(timeLeft.hours) },
    { label: 'Mins', value: formatUnit(timeLeft.minutes) },
    { label: 'Secs', value: formatUnit(timeLeft.seconds) },
  ];

  return (
    <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Countdown Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-black shadow-lg shadow-[#D97706]/30">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-[#D97706]">
                Official Launch Countdown
              </div>
              <h3 className="text-xl font-black text-white">
                October 12, 2026
              </h3>
            </div>
          </div>
        </div>

        {/* Live Timer Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {timeUnits.map((unit, index) => (
            <div
              key={unit.label}
              className="bg-black/50 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center text-center relative shadow-inner"
            >
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight tabular-nums">
                {unit.value}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D97706] mt-1">
                {unit.label}
              </div>

              {/* Colon divider between units (except last) */}
              {index < timeUnits.length - 1 && (
                <div className="hidden sm:block absolute -right-3 sm:-right-2.5 top-1/2 -translate-y-1/2 text-white/30 font-bold text-xl pointer-events-none">
                  :
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subtitle / Promise */}
        <div className="text-center text-xs sm:text-sm text-stone-400 max-w-xl mx-auto space-y-1 pt-2">
          <p className="flex items-center justify-center gap-1.5 text-stone-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Hot, authentic Nigerian comfort meals delivered to your desk by 12:00 PM.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
