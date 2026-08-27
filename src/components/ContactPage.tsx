import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Clock, Building, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactPageProps {
  onJoinWaitlistClick: () => void;
}

export default function ContactPage({ onJoinWaitlistClick }: ContactPageProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Corporate HR Subscription',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight font-display">
          Talk to the 11to12 Kitchen & Dispatch Team
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed">
          Questions about corporate bulk subscriptions, custom floor deliveries, or dietary adjustments? We’re always here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Contact Details & Fast Channels */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <h2 className="text-2xl font-black text-[#111827] font-display">
              Reach Out Directly
            </h2>

            <div className="space-y-5">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email Us</div>
                  <a href="mailto:hello@11to12.com" className="text-sm font-bold text-[#111827] hover:text-[#D97706] transition-colors">
                    hello@11to12.com / corporate@11to12.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">WhatsApp Dispatch Hotline</div>
                  <a 
                    href="https://api.whatsapp.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-bold text-[#111827] hover:text-[#25D366] transition-colors"
                  >
                    +234 812 345 6789 (Mon – Fri, 7 AM – 5 PM)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Culinary & Dispatch Hub</div>
                  <p className="text-sm font-medium text-stone-700">
                    Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Kitchen & Drop Hours</div>
                  <p className="text-sm font-medium text-stone-700">
                    Mon – Fri: 11:00 AM – 12:00 PM (Strict Drop Window)
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Button for Corporate */}
            <div className="pt-4 border-t border-stone-100">
              <a
                href="https://api.whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </a>
            </div>

          </div>

          {/* Corporate HR Card */}
          <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#D97706] text-xs font-bold uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>For People & HR Leaders</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Sponsoring Team Lunch?
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              We offer single-invoice consolidated monthly billing, custom dietary surveys for your staff, and dedicated floor delivery captains for offices with 10+ employees.
            </p>
            <button
              onClick={onJoinWaitlistClick}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#111827] font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Sign Up Your Company
            </button>
          </div>

        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#111827] font-display">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    We respond within 2 hours during Lagos business hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#111827] block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Fola Davies"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#111827] block mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                        placeholder="fola@company.ng"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#111827] block mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={e => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="0802 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#111827] block mb-1.5">
                      What is your inquiry regarding?
                    </label>
                    <select
                      value={formState.inquiryType}
                      onChange={e => setFormState({ ...formState, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white cursor-pointer"
                    >
                      <option value="Corporate HR Subscription">Corporate Team Subscription (10+ Staff)</option>
                      <option value="Dietary & Allergen Questions">Dietary & Allergen Questions</option>
                      <option value="Office Delivery Route Verification">Office Delivery Route Verification</option>
                      <option value="Billing & Invoice Query">Billing & Invoice Query</option>
                      <option value="Feedback / Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#111827] block mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={e => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us how we can help make your office lunch seamless..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm focus:outline-none focus:border-[#D97706] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-md shadow-[#D97706]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Kitchen Support</span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-display text-[#111827]">
                  Message Dispatched!
                </h3>
                <p className="text-stone-600 text-sm max-w-sm mx-auto">
                  Thank you, {formState.name}. One of our team members will get back to you at <strong>{formState.email}</strong> shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        email: '',
                        phone: '',
                        inquiryType: 'Corporate HR Subscription',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold"
                  >
                    Send Another Note
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
