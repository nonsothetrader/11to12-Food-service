import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WaitlistSection from './components/WaitlistSection';
import PricingBuilder from './components/PricingBuilder';
import WeeklyMenu from './components/WeeklyMenu';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import InvoiceModal, { InvoiceModalSummary } from './components/InvoiceModal';
import WaitlistPage from './components/WaitlistPage';
import AboutUsPage from './components/AboutUsPage';
import ContactPage from './components/ContactPage';
import TermsPage from './components/TermsPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getActiveMonthData } from './data/mockData';

export type ViewMode = 'home' | 'waitlist' | 'about' | 'contact' | 'terms' | 'userdashboard' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash.startsWith('admin')) return 'admin';
    if (hash === 'waitlist') return 'waitlist';
    if (hash === 'about') return 'about';
    if (hash === 'contact') return 'contact';
    if (hash === 'terms') return 'terms';
    if (hash === 'userdashboard' || hash === 'dashboard') return 'userdashboard';
    return 'home';
  });

  // Listen for hash change for browser back/forward and deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('admin')) setCurrentView('admin');
      else if (hash === 'waitlist') setCurrentView('waitlist');
      else if (hash === 'about') setCurrentView('about');
      else if (hash === 'contact') setCurrentView('contact');
      else if (hash === 'terms') setCurrentView('terms');
      else if (hash === 'userdashboard' || hash === 'dashboard') setCurrentView('userdashboard');
      else setCurrentView('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: ViewMode, sectionId?: string) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : `/${view}`;

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { year, month, daysInMonth, todayDate, currentHour } = getActiveMonthData();

  // Pre-populate with initial eligible future workdays
  const initialEligibleDates = useMemo(() => {
    const dates: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = d < todayDate;
      const isTodayPastCutoff = d === todayDate && currentHour >= 12;

      if (!isWeekend && !isPast && !isTodayPastCutoff) {
        dates.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
    return dates.slice(0, 10);
  }, [year, month, daysInMonth, todayDate, currentHour]);

  const [selectedDates, setSelectedDates] = useState<string[]>(initialEligibleDates);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState<InvoiceModalSummary>({
    selectedDates: initialEligibleDates,
    pricePerMeal: 2900,
    mealTotal: initialEligibleDates.length * 2900,
    addonsTotal: 0,
    grandTotal: initialEligibleDates.length * 2900,
    selectedAddons: []
  });

  // Toggle date in pricing builder
  const handleToggleDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr].sort()
    );
  };

  // When user clicks "Include Day in Plan" from the Menu section
  const handlePlanSelectedDay = (dateStr: string) => {
    if (!selectedDates.includes(dateStr)) {
      setSelectedDates(prev => [...prev, dateStr].sort());
    }
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll helpers
  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-form') || document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCheckout = (summary: typeof checkoutSummary) => {
    setCheckoutSummary(summary);
    setIsCheckoutOpen(true);
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onNavigateHome={() => handleNavigate('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111827]">
      {/* Sticky Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Routed View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Section 1: Hero */}
            <Hero
              onFeedMeClick={scrollToWaitlist}
              onExploreMenuClick={scrollToMenu}
            />

            {/* Section 2: Waitlist Form & Countdown on Main Homepage */}
            <WaitlistSection onProceedToPricing={scrollToPricing} />

            {/* Section 3: Dynamic Custom Pricing Builder right below Waitlist Form */}
            <PricingBuilder
              selectedDates={selectedDates}
              onToggleDate={handleToggleDate}
              onSetSelectedDates={setSelectedDates}
              onOpenCheckout={handleOpenCheckout}
            />

            {/* Section 4: Interactive Weekly Menu Inspector */}
            <WeeklyMenu onPlanSelectedDay={handlePlanSelectedDay} />

            {/* Section 5: How It Works */}
            <HowItWorks onStartPlanning={scrollToWaitlist} />

            {/* Section 6: Social Proof & Testimonials */}
            <Testimonials />

            {/* Section 7: FAQ Accordion */}
            <FAQ />
          </>
        )}

        {currentView === 'waitlist' && (
          <WaitlistPage onNavigateHome={() => handleNavigate('home')} />
        )}

        {currentView === 'about' && (
          <AboutUsPage
            onJoinWaitlistClick={() => handleNavigate('home', 'waitlist')}
            onExploreMenuClick={() => handleNavigate('home', 'menu')}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            onJoinWaitlistClick={() => handleNavigate('home', 'waitlist')}
          />
        )}

        {currentView === 'terms' && (
          <TermsPage
            onJoinWaitlistClick={() => handleNavigate('home', 'waitlist')}
          />
        )}

        {currentView === 'userdashboard' && (
          <UserDashboard
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer with deep link integration */}
      <Footer onNavigate={handleNavigate} />

      {/* Subscription Invoice & Payment Details Modal */}
      <InvoiceModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        summary={checkoutSummary}
      />
    </div>
  );
}
