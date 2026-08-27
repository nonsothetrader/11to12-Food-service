import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  BookOpen, 
  Mail, 
  BarChart3, 
  Gift, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Radio, 
  ArrowLeft, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import AdminLogin from './AdminLogin';

export type AdminTab = 
  | 'home' 
  | 'orders' 
  | 'users' 
  | 'menu';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  currentTab,
  onSelectTab,
  onExitAdmin,
  children
}: AdminLayoutProps) {
  const { store, actions } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminAuthenticated = store.currentUserRole === 'admin';

  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag, badge: store.orders.filter(o => o.isNextDayOrder || o.status === 'Out for Delivery' || o.status === 'Preparing').length },
    { id: 'users', label: 'Subscribers and Users', icon: Users, badge: store.subscribers.length },
    { id: 'menu', label: 'Menu Management', icon: BookOpen },
  ];

  // If not authenticated as Admin, show strictly gated access screen
  if (!isAdminAuthenticated) {
    return <AdminLogin onBackToSite={onExitAdmin} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF4EB] text-[#1E140A] flex flex-col font-sans selection:bg-[#FF5500]/20">
      
      {/* Top Real-time Bar */}
      <header className="bg-[#1E140A] text-white border-b border-[#1E140A]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-display text-[#FF5500] tracking-tight">
                11to12
              </span>
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-mono uppercase tracking-wider text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Admin Command</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time sync ticker */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
              <Radio className="w-3.5 h-3.5 text-[#FF5500] animate-pulse" />
              <span>Real-time Store Synced</span>
              <span className="text-white/40">|</span>
              <span className="font-mono text-emerald-400">
                {store.orders.filter(o => o.status === 'Out for Delivery').length} In Transit
              </span>
            </div>

            {/* Admin identity badge */}
            <div className="flex items-center gap-2.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-black text-[10px]">
                HQ
              </div>
              <span className="font-bold hidden sm:inline text-white truncate max-w-[140px]">
                {store.adminEmail || 'Admin'}
              </span>
            </div>

            <button
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              title="Return to user view"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </button>

            <button
              onClick={() => actions.logoutAdmin()}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              title="Log out from admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-4 border border-[#1E140A]/10 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#1E140A]/50">
              Operations & Justice
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#1E140A] text-white shadow-md'
                      : 'text-[#1E140A]/80 hover:bg-[#FAF4EB] hover:text-[#1E140A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5500]' : 'text-[#1E140A]/60'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                      isActive ? 'bg-[#FF5500] text-white' : 'bg-[#FF5500]/15 text-[#FF5500]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time System Status Card */}
          <div className="bg-[#1E140A] text-white p-5 rounded-3xl border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#FF5500] font-black uppercase text-[10px] tracking-wider">
                Kitchen Status
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-sm font-black font-display">
              {store.settings.emergencyKitchenHold ? '🚨 EMERGENCY HOLD' : '🔥 Kitchen Active & Cooking'}
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Auto-locks at {store.settings.kitchenCutoffHour}:00 PM tonight. Any changes here reflect live to all users.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              className="fixed inset-0 z-50 bg-black/60 md:hidden flex"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div 
                className="w-72 bg-white h-full p-6 space-y-4 shadow-2xl flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#1E140A]/10">
                    <span className="text-xl font-black font-display text-[#FF5500]">
                      11to12 Admin
                    </span>
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-stone-100 text-[#1E140A]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-left ${
                            isActive
                              ? 'bg-[#1E140A] text-white shadow-md'
                              : 'text-[#1E140A]/80 hover:bg-[#FAF4EB]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF5500]' : 'text-[#1E140A]/60'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5500] text-white font-bold font-mono">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E140A]/10">
                  <button
                    onClick={onExitAdmin}
                    className="w-full py-3 rounded-xl bg-[#FAF4EB] border border-[#1E140A]/10 text-xs font-bold text-[#1E140A] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Site</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Pane */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

    </div>
  );
}
