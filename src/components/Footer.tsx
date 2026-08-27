import { Heart, ArrowUp, MapPin, Sparkles, LayoutDashboard } from 'lucide-react';
import { ViewMode } from '../App';

interface FooterProps {
  onNavigate: (view: ViewMode, sectionId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111827] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('home')}
                className="text-3xl font-black tracking-tight text-white font-display hover:text-[#D97706] transition-colors cursor-pointer text-left"
              >
                11to12
              </button>
            </div>

            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Fueling the Lagos corporate hustle without the cafeteria regret. Hot, authentic Nigerian meals delivered right to your office desk between 11:00 AM and 12:00 PM (Monday to Friday).
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('userdashboard')} className="hover:text-[#D97706] text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Subscriber Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('waitlist')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>Join Waitlist</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'menu')} className="hover:text-white transition-colors cursor-pointer">
                  Monthly Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home', 'faq')} className="hover:text-white transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us & Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Corporate Catering
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  HR Bulk Subs & Invoicing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin' as any)} className="hover:text-[#FF5500] text-stone-400 font-bold transition-colors cursor-pointer flex items-center gap-1">
                  <span>🔒 Operations & Admin Hub</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Social & Jump to Top */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D97706] text-white flex items-center justify-center text-xs transition-colors border border-white/10 font-bold"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D97706] text-white flex items-center justify-center text-xs transition-colors border border-white/10"
              >
                📸
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#D97706] text-white flex items-center justify-center text-xs transition-colors border border-white/10 font-bold"
              >
                in
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white pt-2 cursor-pointer transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Lagos Disclaimer */}
        <div className="pt-8 text-xs text-stone-500 space-y-3">
          <p className="leading-relaxed">
            * Disclaimer: All delivery bikes are equipped with custom reinforced soup shock absorbers for Third Mainland Bridge potholes. 11to12 is not legally responsible for spontaneous 2:00 PM productivity naps resulting from our Ayamase Ofada rice. Please clear your Google Calendar accordingly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-stone-400">
            <div>
              © {new Date().getFullYear()} 11to12 Inc. All rights reserved. Built for Lagos 9-to-5ers with <Heart className="w-3.5 h-3.5 inline text-rose-500" /> and smoky firewood.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => onNavigate('terms')} className="hover:text-white cursor-pointer">
                Terms of Service
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('about')} className="hover:text-white cursor-pointer">
                Kitchen Hygiene Standards
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">
                Support
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
