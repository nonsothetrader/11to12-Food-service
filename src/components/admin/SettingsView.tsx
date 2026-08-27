import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';

export default function SettingsView() {
  const { store, actions } = useAppStore();
  const [cutoffHour, setCutoffHour] = useState(store.settings.kitchenCutoffHour);
  const [skipHour, setSkipHour] = useState(store.settings.skipCutoffHour);
  const [mealPrice, setMealPrice] = useState(store.settings.standardMealPrice);
  const [emergencyHold, setEmergencyHold] = useState(store.settings.emergencyKitchenHold);
  const [newZoneInput, setNewZoneInput] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    actions.updateSettings({
      kitchenCutoffHour: cutoffHour,
      skipCutoffHour: skipHour,
      standardMealPrice: mealPrice,
      emergencyKitchenHold: emergencyHold
    });
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleAddZone = () => {
    if (!newZoneInput.trim()) return;
    const updatedZones = [...store.settings.activeDeliveryZones, newZoneInput.trim()];
    actions.updateSettings({ activeDeliveryZones: updatedZones });
    setNewZoneInput('');
  };

  const handleRemoveZone = (zone: string) => {
    const updatedZones = store.settings.activeDeliveryZones.filter(z => z !== zone);
    actions.updateSettings({ activeDeliveryZones: updatedZones });
  };

  const handleAddAdminEmail = () => {
    if (!newAdminEmail.trim()) return;
    const updatedEmails = [...store.settings.adminEmails, newAdminEmail.trim().toLowerCase()];
    actions.updateSettings({ adminEmails: updatedEmails });
    setNewAdminEmail('');
  };

  const handleRemoveAdminEmail = (email: string) => {
    const updatedEmails = store.settings.adminEmails.filter(e => e !== email);
    actions.updateSettings({ adminEmails: updatedEmails });
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              System Configuration
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              Live Parameter Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Kitchen & System Settings
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Configure cutoff clocks, meal price benchmarks, Lagos delivery zones, and authorized admin permissions.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {saveAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Settings updated successfully! Changes are synced in real-time across all user dashboards.</span>
            </div>
            <button onClick={() => setSaveAlert(false)} className="text-emerald-200 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timing & Pricing Form */}
        <div className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-black text-lg font-display text-[#1E140A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF5500]" />
            <span>Deadlines & Pricing Benchmark</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#1E140A] mb-1">
                Night Before Kitchen Cutoff Hour (24h format):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={12}
                  max={23}
                  value={cutoffHour}
                  onChange={(e) => setCutoffHour(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-sm font-mono font-bold text-[#1E140A]"
                />
                <span className="text-stone-500 font-medium">
                  {cutoffHour}:00 PM ({cutoffHour === 20 ? 'Standard 8:00 PM Cutoff' : `${cutoffHour - 12}:00 PM`})
                </span>
              </div>
              <p className="text-[11px] text-[#1E140A]/50 mt-1">
                Next-day decision buttons lock at this exact hour.
              </p>
            </div>

            <div>
              <label className="block font-bold text-[#1E140A] mb-1">
                Same-Day Lunch Skip Deadline Hour:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={8}
                  max={15}
                  value={skipHour}
                  onChange={(e) => setSkipHour(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-sm font-mono font-bold text-[#1E140A]"
                />
                <span className="text-stone-500 font-medium">
                  {skipHour}:00 PM (Lagos Office Lunch Window)
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1E140A] mb-1">
                Base Meal Benchmark Price (₦):
              </label>
              <input
                type="number"
                step={100}
                value={mealPrice}
                onChange={(e) => setMealPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-sm font-mono font-bold text-[#1E140A]"
              />
              <p className="text-[11px] text-[#1E140A]/50 mt-1">
                Default: ₦2,900 / workday meal.
              </p>
            </div>

            {/* Emergency Hold Switch */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Emergency Kitchen Hold</span>
                </span>
                <input
                  type="checkbox"
                  checked={emergencyHold}
                  onChange={(e) => setEmergencyHold(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                When activated, pauses all dispatch out assignments and broadcasts an alert to all subscribers.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E140A] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>

        {/* Delivery Zones & Admin Permissions */}
        <div className="space-y-6">
          
          {/* Active Delivery Zones */}
          <div className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-black text-lg font-display text-[#1E140A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF5500]" />
              <span>Covered Lagos Delivery Zones</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {store.settings.activeDeliveryZones.map((zone) => (
                <div
                  key={zone}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF4EB] border border-[#1E140A]/10 text-xs font-bold text-[#1E140A] flex items-center gap-2"
                >
                  <span>{zone}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveZone(zone)}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. Surulere Office Axis"
                value={newZoneInput}
                onChange={(e) => setNewZoneInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A]"
              />
              <button
                type="button"
                onClick={handleAddZone}
                className="px-4 py-2 bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Add Zone
              </button>
            </div>
          </div>

          {/* Admin Email Gating */}
          <div className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-black text-lg font-display text-[#1E140A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF5500]" />
              <span>Authorized Admin Emails</span>
            </h3>

            <div className="space-y-2">
              {store.settings.adminEmails.map((email) => (
                <div
                  key={email}
                  className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 text-xs font-mono flex items-center justify-between"
                >
                  <span className="font-bold text-[#1E140A]">{email}</span>
                  {email !== 'nonsothetrader@gmail.com' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmail(email)}
                      className="text-stone-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="email"
                placeholder="e.g. dispatch@11to12.ng"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A]"
              />
              <button
                type="button"
                onClick={handleAddAdminEmail}
                className="px-4 py-2 bg-[#1E140A] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Authorize
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
