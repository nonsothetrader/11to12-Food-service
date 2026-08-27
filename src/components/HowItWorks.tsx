import { CalendarRange, Bike, Smile } from 'lucide-react';
import { motion } from 'motion/react';

interface HowItWorksProps {
  onStartPlanning: () => void;
}

export default function HowItWorks({ onStartPlanning }: HowItWorksProps) {
  const steps = [
    {
      number: '01',
      title: 'Pick Your Plan',
      description: 'Choose how often you want to avoid the office cafeteria. We won’t judge.',
      subtext: 'Select your preferred workdays, customize add-ons, and choose dietary preferences with complete flexibility.',
      icon: CalendarRange
    },
    {
      number: '02',
      title: 'We Bring Food',
      description: 'A real person brings you a hot meal. It’s like magic, but with more traffic.',
      subtext: 'Our dedicated dispatch network navigates Third Mainland Bridge gridlock so your meal hits your desk between 11:00 AM – 12:00 PM.',
      icon: Bike
    },
    {
      number: '03',
      title: 'You Eat',
      description: 'No cooking, no cleaning. Just try not to get any on your keyboard.',
      subtext: 'Unbox piping-hot smoky jollof, tender proteins, and chilled drinks. Go into that 1:00 PM meeting well-fed and energized.',
      icon: Smile
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-[#111827]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            It’s not rocket science. It's just lunch. Here’s the simple process to get started.
          </p>
        </div>

        {/* 3-Step Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                className="bg-[#FAF9F6] rounded-3xl p-8 border border-[#111827]/10 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-lg shadow-[#D97706]/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-extrabold text-[#111827]/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#111827] mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-base font-semibold text-stone-800 mb-3">
                    "{step.description}"
                  </p>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {step.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
