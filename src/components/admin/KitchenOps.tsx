import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UtensilsCrossed, 
  Flame, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShieldAlert, 
  RefreshCw, 
  ChefHat, 
  Edit3,
  Clock
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { KitchenIngredient, KitchenPackaging } from '../../lib/store';

export default function KitchenOps() {
  const { store, actions } = useAppStore();
  const [editingSubstituteId, setEditingSubstituteId] = useState<string | null>(null);
  const [substituteText, setSubstituteText] = useState('');
  const [activeTab, setActiveTab] = useState<'cooklist' | 'ingredients' | 'packaging'>('cooklist');

  // Cook list calculation
  const totalAcceptedOrders = store.orders.filter(o => o.choice === 'accept');
  const standardPackCount = totalAcceptedOrders.filter(o => o.dietaryPreference === 'Standard').length;
  const fitfamPackCount = totalAcceptedOrders.filter(o => o.dietaryPreference === 'FitFam / Low Carb').length;

  // Spice distribution
  const mildCount = totalAcceptedOrders.filter(o => o.spiceLevel === 'Mild').length;
  const mediumCount = totalAcceptedOrders.filter(o => o.spiceLevel === 'Medium').length;
  const fireCount = totalAcceptedOrders.filter(o => o.spiceLevel === 'Lagos Fire').length;
  const ogaCount = totalAcceptedOrders.filter(o => o.spiceLevel === 'Oga At The Top').length;

  const handleSaveSubstitute = (id: string) => {
    actions.toggleIngredientStatus(id, 'Critical Shortage', substituteText);
    setEditingSubstituteId(null);
    setSubstituteText('');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Kitchen Back-of-House
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              Morning Prep Window (05:00 AM – 10:30 AM)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Kitchen Operations & Cook List
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Generates today's exact cook list, tracks ingredient shortages from Mile 12, and monitors packaging inventory.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#1E140A]/10 shadow-xs">
          {[
            { id: 'cooklist', label: '1. Cook List', icon: ChefHat },
            { id: 'ingredients', label: '2. Ingredient Shortages', icon: AlertTriangle },
            { id: 'packaging', label: '3. Packaging Inventory', icon: Package },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E140A] text-white shadow-xs'
                    : 'text-[#1E140A]/70 hover:bg-[#FAF4EB]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: COOK LIST */}
      {activeTab === 'cooklist' && (
        <div className="space-y-6">
          
          {/* Daily Cook Summary Banner */}
          <div className="bg-[#1E140A] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#FF5500] text-white text-[10px] font-black uppercase tracking-wider">
                  TODAY'S PRODUCTION BATCH
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                  {store.orders.length} Confirmed Desks
                </h2>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  Every meal is vacuum-portioned, sealed with a red tamper sticker, and boxed for 11:00 AM – 12:00 PM desk drops across Victoria Island, Ikoyi, Marina, Yaba, and Lekki.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[110px]">
                  <div className="text-2xl font-black text-[#FF5500] font-display">
                    {standardPackCount || 112}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-stone-300 mt-0.5">
                    Standard Pack
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[110px]">
                  <div className="text-2xl font-black text-emerald-400 font-display">
                    {fitfamPackCount || 42}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-stone-300 mt-0.5">
                    FitFam Sub Pack
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dishes & Portion Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Dish 1: Standard Main */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
                  Standard Dish (70% of Batch)
                </span>
                <span className="text-xs font-mono font-bold text-[#1E140A]">
                  Target: {standardPackCount || 112} Bowls
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-display text-[#1E140A]">
                  Smokey Firewood Jollof & Peppered Turkey
                </h3>
                <p className="text-xs text-[#1E140A]/70 mt-1 leading-relaxed">
                  Long-grain parboiled rice simmered in slow-roasted tatashe reduction with locked-in firewood smoke flavor. Served with golden spiced turkey and sweet fried plantain (dodo).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1E140A]/60">
                  Kitchen Chef Directives:
                </div>
                <ul className="text-xs text-[#1E140A]/80 space-y-1 list-disc list-inside">
                  <li>Leave bottom pot layer to char lightly for authentic Lagos party aroma.</li>
                  <li>Turkey glaze must be applied 5 mins before packaging to seal in moisture.</li>
                  <li>Dodo plantains must be diced 1.5cm and fried in clean vegetable oil at 180°C.</li>
                </ul>
              </div>
            </div>

            {/* Dish 2: FitFam Sub Pack */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  FitFam / Low Carb Sub Pack (30% of Batch)
                </span>
                <span className="text-xs font-mono font-bold text-[#1E140A]">
                  Target: {fitfamPackCount || 42} Bowls
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-display text-[#1E140A]">
                  Cauliflower Jollof Bowl with Herb Chicken Breast
                </h3>
                <p className="text-xs text-[#1E140A]/70 mt-1 leading-relaxed">
                  Grated organic cauliflower sautéed in light tomato-tatashe broth with cold-pressed olive oil, paired with herb-marinated skinless chicken breast and steamed broccoli.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1E140A]/60">
                  Kitchen Chef Directives:
                </div>
                <ul className="text-xs text-[#1E140A]/80 space-y-1 list-disc list-inside">
                  <li>Quick-flash sauté cauliflower (max 3 mins) to avoid excess moisture.</li>
                  <li>Chicken breasts grilled to internal temp of 75°C then sliced into strips.</li>
                  <li>Label bowl with distinctive Green FitFam sticker before placing tamper seal.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Spice Distribution Breakdown Bar */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-base font-display text-[#1E140A]">
                  Heat & Spice Level Distribution
                </h4>
                <p className="text-xs text-[#1E140A]/60">
                  Packaged into separate heated thermal carriers for riders.
                </p>
              </div>
              <span className="text-xs font-bold text-[#FF5500] font-mono">
                🔥 4 Custom Heat Profiles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Mild (Low Heat)', count: mildCount || 22, color: 'bg-emerald-50 border-emerald-200 text-emerald-900', pepperIcon: '🌶️' },
                { name: 'Medium (Standard)', count: mediumCount || 94, color: 'bg-amber-50 border-amber-200 text-amber-900', pepperIcon: '🌶️🌶️' },
                { name: 'Lagos Fire (Hot)', count: fireCount || 34, color: 'bg-orange-50 border-orange-200 text-orange-900', pepperIcon: '🌶️🌶️🌶️' },
                { name: 'Oga At The Top (Extreme)', count: ogaCount || 4, color: 'bg-rose-50 border-rose-200 text-rose-900', pepperIcon: '🌶️🌶️🌶️🌶️' },
              ].map((spice, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${spice.color} space-y-1`}>
                  <div className="text-sm">{spice.pepperIcon}</div>
                  <div className="text-xl font-black font-display">{spice.count} Packs</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">{spice.name}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INGREDIENT SHORTAGES TRACKER */}
      {activeTab === 'ingredients' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-lg font-display text-[#1E140A]">
                  Raw Ingredient Stock & Shortage Alert Board
                </h3>
                <p className="text-xs text-[#1E140A]/60">
                  Track bulk supplies from Mile 12, Ketu, and Oyingbo markets. Toggle status to alert kitchen staff in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Auto-synced with Kitchen Command</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    ing.status === 'Critical Shortage'
                      ? 'bg-rose-50 border-rose-300'
                      : ing.status === 'Low Stock'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-[#1E140A]/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-[#FF5500]">
                          {ing.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ing.status === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ing.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {ing.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1E140A] mt-1">
                        {ing.name}
                      </h4>
                      <p className="text-xs text-[#1E140A]/70 mt-0.5">
                        Current quantity: <span className="font-mono font-bold text-[#1E140A]">{ing.quantityRemaining}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <select
                        value={ing.status}
                        onChange={(e) => actions.toggleIngredientStatus(ing.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-xl border border-[#1E140A]/15 bg-white text-xs font-bold text-[#1E140A] cursor-pointer"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Critical Shortage">Critical Shortage</option>
                      </select>
                    </div>
                  </div>

                  {ing.substituteNote && (
                    <div className="p-3 rounded-xl bg-white/80 border border-[#1E140A]/10 text-xs text-[#1E140A] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Substitute Protocol: </span>
                        <span>{ing.substituteNote}</span>
                      </div>
                    </div>
                  )}

                  {editingSubstituteId === ing.id ? (
                    <div className="space-y-2 pt-2 border-t border-[#1E140A]/10">
                      <input
                        type="text"
                        placeholder="Enter kitchen substitute directive..."
                        value={substituteText}
                        onChange={(e) => setSubstituteText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#1E140A]/15 bg-white text-xs text-[#1E140A]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSubstituteId(null)}
                          className="px-3 py-1 text-xs text-stone-500 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveSubstitute(ing.id)}
                          className="px-3 py-1 bg-[#1E140A] text-white text-xs font-bold rounded-lg"
                        >
                          Save Protocol
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSubstituteId(ing.id);
                        setSubstituteText(ing.substituteNote || '');
                      }}
                      className="text-[11px] font-bold text-[#FF5500] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{ing.substituteNote ? 'Edit Substitute Directive' : '+ Add Substitute Directive'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGING INVENTORY */}
      {activeTab === 'packaging' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg font-display text-[#1E140A]">
                  Packaging & Security Seal Inventory
                </h3>
                <p className="text-xs text-[#1E140A]/60">
                  Every meal must be packaged in food-grade sugarcane boxes with an unbroken red tamper-evident seal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {store.packaging.map((pack) => (
                <div
                  key={pack.id}
                  className="p-5 rounded-2xl border border-[#1E140A]/10 bg-[#FAF4EB] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pack.status === 'Adequate'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pack.status === 'Reorder Soon'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pack.status}
                      </span>
                      <span className="text-[11px] text-[#1E140A]/50 font-mono">
                        Min: {pack.minimumThreshold} {pack.unit}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1E140A] mt-2">
                      {pack.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E140A]/10">
                    <div className="text-2xl font-black font-display text-[#1E140A]">
                      {pack.count.toLocaleString()} <span className="text-xs font-normal font-sans text-stone-500">{pack.unit}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => actions.updatePackagingCount(pack.id, Math.max(0, pack.count - 50))}
                        className="w-8 h-8 rounded-xl bg-white border border-[#1E140A]/15 text-[#1E140A] flex items-center justify-center font-bold hover:bg-stone-100 cursor-pointer"
                        title="Deduct 50"
                      >
                        -50
                      </button>
                      <button
                        type="button"
                        onClick={() => actions.updatePackagingCount(pack.id, pack.count + 100)}
                        className="w-8 h-8 rounded-xl bg-[#1E140A] text-white flex items-center justify-center font-bold hover:bg-black cursor-pointer text-xs"
                        title="Add 100 stock"
                      >
                        +100
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
