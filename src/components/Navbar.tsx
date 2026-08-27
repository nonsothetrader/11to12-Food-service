import { useState, useEffect, type MouseEvent } from 'react';
import { UtensilsCrossed, Menu, X, Sparkles, Clock, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode } from '../App';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode, sectionId?: string) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (view: ViewMode, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, sectionId);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF4EB]/95 backdrop-blur-md shadow-xs border-b border-[#1E140A]/10 py-3'
          : 'bg-[#FAF4EB]/90 backdrop-blur-xs py-3.5 border-b border-[#1E140A]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - 11to12 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLinkClick('home')}
            className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E140A] hover:text-[#FF5500] transition-colors focus:outline-none cursor-pointer font-display"
            aria-label="11to12 Homepage"
          >
            11to12
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1E140A]/80 font-sans">
          <button
            onClick={() => handleLinkClick('home')}
            className={`hover:text-[#FF5500] transition-colors py-1 cursor-pointer ${
              currentView === 'home' ? 'text-[#FF5500] font-bold' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleLinkClick('home', 'waitlist')}
            className="hover:text-[#FF5500] transition-colors py-1 cursor-pointer"
          >
            Waitlist
          </button>

          <button
            onClick={() => handleLinkClick('home', 'pricing')}
            className="hover:text-[#FF5500] transition-colors py-1 cursor-pointer"
          >
            Pricing
          </button>

          <button
            onClick={() => handleLinkClick('home', 'menu')}
            className="hover:text-[#FF5500] transition-colors py-1 cursor-pointer"
          >
            Menu
          </button>

          <button
            onClick={() => handleLinkClick('home', 'how-it-works')}
            className="hover:text-[#FF5500] transition-colors py-1 cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={() => handleLinkClick('about')}
            className={`hover:text-[#FF5500] transition-colors py-1 cursor-pointer ${
              currentView === 'about' ? 'text-[#FF5500] font-bold' : ''
            }`}
          >
            About Us
          </button>

          <button
            onClick={() => handleLinkClick('userdashboard')}
            className={`hover:text-[#FF5500] transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'userdashboard' ? 'text-[#FF5500] font-bold' : ''
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#FF5500]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleLinkClick('admin' as any)}
            className={`hover:text-[#FF5500] transition-colors py-1 cursor-pointer flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full border ${
              currentView === ('admin' as any)
                ? 'bg-[#1E140A] text-white border-[#1E140A]'
                : 'border-[#1E140A]/15 text-[#1E140A]/70 hover:border-[#FF5500]'
            }`}
            title="Admin Command & Dispatch Operations"
          >
            <span>🔒 Admin</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => handleLinkClick('home', 'waitlist')}
            className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-[#FF5500]/25 transition-all duration-200 cursor-pointer font-sans"
          >
            <span>Join Waitlist</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleLinkClick('userdashboard')}
            className="px-3 py-1.5 rounded-full bg-white text-[#1E140A] border border-[#1E140A]/15 text-xs font-bold shadow-xs cursor-pointer"
          >
            Dashboard
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#1E140A]/10 bg-[#FAF4EB] px-4 pt-3 pb-6 space-y-3 shadow-lg"
          >
            <div className="grid gap-1 font-sans">
              <button
                onClick={() => handleLinkClick('home')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-semibold text-sm text-left"
              >
                <span>Home</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('userdashboard')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FF5500]/10 text-[#FF5500] font-bold text-sm text-left border border-[#FF5500]/20"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Subscriber Dashboard</span>
                </span>
                <span className="text-xs font-bold text-[#FF5500]">Live</span>
              </button>

              <button
                onClick={() => handleLinkClick('waitlist')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF5500]" />
                  <span>Join Waitlist</span>
                </span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('home', 'how-it-works')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>How It Works</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('home', 'menu')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>Monthly Menu</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('home', 'pricing')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>Pricing Calculator</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('about')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>About Us</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('contact')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>Contact Us</span>
                <span className="text-xs text-stone-400">→</span>
              </button>

              <button
                onClick={() => handleLinkClick('terms')}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-[#1E140A] hover:bg-[#1E140A]/5 font-medium text-sm text-left"
              >
                <span>Terms of Service</span>
                <span className="text-xs text-stone-400">→</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
