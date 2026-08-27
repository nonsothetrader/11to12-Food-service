import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Flame, 
  UtensilsCrossed, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Layers, 
  Image as ImageIcon,
  Clock,
  Salad,
  Eye,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { MenuItem, SpiceLevel } from '../../types';
import { getMonthData, MENU_DISHES_TEMPLATE } from '../../data/mockData';
import { getMealForDate, RICE_DISHES, NON_RICE_DISHES, FRIDAY_SWALLOW_ROTATION } from '../../lib/data';

export default function MenuManagement() {
  const { store, actions } = useAppStore();

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // October (0-indexed)
  const [selectedDayNum, setSelectedDayNum] = useState<number>(13);
  const [isSavedNotification, setIsSavedNotification] = useState(false);

  const {
    year,
    month,
    daysInMonth,
    mondayBasedOffset,
    monthName,
    todayDate
  } = getMonthData(selectedYear, selectedMonth);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear(y => y - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(m => m - 1);
    }
    setSelectedDayNum(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(y => y + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(m => m + 1);
    }
    setSelectedDayNum(1);
  };

  // Generate calendar days
  const monthDays = useMemo(() => {
    const list: { dayNum: number; date: Date; dateStr: string; isWeekend: boolean; meal: MenuItem | null; hasOverride: boolean }[] = [];
    const overrides = store.customMenuOverrides || {};

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      let meal: MenuItem | null = null;
      let hasOverride = false;

      if (!isWeekend) {
        meal = getMealForDate(date);
        hasOverride = !!overrides[dateStr];
      }

      list.push({
        dayNum: d,
        date,
        dateStr,
        isWeekend,
        meal,
        hasOverride
      });
    }
    return list;
  }, [year, month, daysInMonth, store.customMenuOverrides]);

  const selectedDayItem = useMemo(() => {
    return monthDays.find(d => d.dayNum === selectedDayNum) || monthDays[0];
  }, [monthDays, selectedDayNum]);

  // Form edit states
  const [dishName, setDishName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [calories, setCalories] = useState<number>(650);
  const [ingredientsText, setIngredientsText] = useState('');
  const [allergensText, setAllergensText] = useState('');
  const [chefNote, setChefNote] = useState('');
  const [subPackSides, setSubPackSides] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadSuccessNote, setUploadSuccessNote] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        setUploadSuccessNote(`Uploaded "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`);
        setTimeout(() => setUploadSuccessNote(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Sync form when selected day changes
  React.useEffect(() => {
    if (selectedDayItem && selectedDayItem.meal) {
      const m = selectedDayItem.meal;
      setDishName(m.name);
      setTagline(m.tagline || '');
      setDescription(m.description || '');
      setImageUrl(m.image || '');
      setSpiceLevel(m.spiceLevel || 'Medium');
      setCalories(m.calories || 650);
      setIngredientsText((m.ingredients || []).join(', '));
      setAllergensText((m.allergens || []).join(', '));
      setChefNote(m.chefNote || '');
      setSubPackSides((m.subPack?.sides || []).join(', '));
    }
  }, [selectedDayItem]);

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayItem || selectedDayItem.isWeekend) return;

    const ingredients = ingredientsText.split(',').map(s => s.trim()).filter(Boolean);
    const allergens = allergensText.split(',').map(s => s.trim()).filter(Boolean);
    const sides = subPackSides.split(',').map(s => s.trim()).filter(Boolean);

    actions.updateDailyMenu(selectedDayItem.dateStr, {
      name: dishName,
      tagline,
      description,
      image: imageUrl,
      spiceLevel,
      calories: Number(calories) || 650,
      ingredients,
      allergens,
      chefNote,
      subPack: {
        name: selectedDayItem.meal?.subPack?.name || `${dishName} FitFam Bowl`,
        description: selectedDayItem.meal?.subPack?.description || 'Custom chef alteration with high protein and balanced sides.',
        category: selectedDayItem.meal?.subPack?.category || 'Comfort Classic',
        ingredients: sides.length > 0 ? sides : (selectedDayItem.meal?.subPack?.ingredients || ['Steamed Vegetables', 'Diced Plantain'])
      }
    });

    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 3000);
  };

  const handleResetMenu = () => {
    if (!selectedDayItem) return;
    actions.resetDailyMenu(selectedDayItem.dateStr);
    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 3000);
  };

  // Dish Preset Quick Picker
  const dishPresets = [
    {
      name: 'Smokey Firewood Jollof & Peppered Turkey',
      tagline: 'Lagos Island Iconic Recipe with Party Smoke Aroma',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
      spice: 'Medium' as SpiceLevel,
      cal: 720
    },
    {
      name: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
      tagline: 'Bleached Palm Oil Green Pepper Sauce & Fried Plantain',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      spice: 'Lagos Fire' as SpiceLevel,
      cal: 780
    },
    {
      name: 'Fisherman Fresh Seafood Okro with Poundo Yam',
      tagline: 'Giant Tiger Prawns, Crabs & Fresh Snapper in Rich Okro Broth',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      spice: 'Medium' as SpiceLevel,
      cal: 680
    },
    {
      name: 'Cauliflower Low-Carb Jollof & Herb Grilled Chicken',
      tagline: 'FitFam Low-Glycemic Desk Drop with Steamed Asparagus',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      spice: 'Mild' as SpiceLevel,
      cal: 460
    },
    {
      name: 'Spiced Native Fried Rice with Smoked Catfish & Liver',
      tagline: 'Local Basil (Efirin), Chili Flakes & Ripe Dodo Cubes',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
      spice: 'Medium' as SpiceLevel,
      cal: 710
    }
  ];

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Real-Time Kitchen Sync
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              Live updates propagate to Homepage & User Dashboards
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Menu Management & Daily Dishes
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Select any date on the calendar to update or customize the daily lunch dish for all corporate subscribers.
          </p>
        </div>

        {isSavedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Menu Updated & Live on App!</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Calendar Selector (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-4">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black font-display text-[#1E140A]">
                {monthName} {year}
              </div>
              <div className="text-[11px] text-[#1E140A]/60">
                Click any working day (Mon-Fri) to manage
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E140A] cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1E140A] cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-black text-[10px] uppercase text-[#1E140A]/50 py-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span className="text-stone-300">Sat</span>
            <span className="text-stone-300">Sun</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset tiles */}
            {Array.from({ length: mondayBasedOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-14 sm:h-16 rounded-xl bg-stone-50/50" />
            ))}

            {/* Days */}
            {monthDays.map((d) => {
              const isSelected = d.dayNum === selectedDayNum;
              const isWeekend = d.isWeekend;

              return (
                <button
                  key={`day-${d.dayNum}`}
                  type="button"
                  disabled={isWeekend}
                  onClick={() => setSelectedDayNum(d.dayNum)}
                  className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col justify-between text-left transition-all relative border cursor-pointer ${
                    isWeekend
                      ? 'bg-stone-100/50 border-transparent opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#1E140A] text-white border-[#1E140A] shadow-md scale-[1.03]'
                      : d.hasOverride
                      ? 'bg-orange-50/80 hover:bg-orange-100 border-[#FF5500]/40 text-[#1E140A]'
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-[#1E140A]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-black">{d.dayNum}</span>
                    {d.hasOverride && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5500]" title="Custom Override Active" />
                    )}
                  </div>

                  {!isWeekend && d.meal && (
                    <div className="truncate text-[9px] font-bold opacity-80 leading-tight">
                      {d.meal.name.split(' ')[0]} {d.meal.name.split(' ')[1] || ''}
                    </div>
                  )}

                  {isWeekend && (
                    <div className="text-[8px] text-stone-400 font-mono">Rest</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#1E140A]/10 flex items-center justify-between text-[11px] text-[#1E140A]/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
              <span>Custom Admin Override</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-300" />
              <span>Standard Rotation</span>
            </div>
          </div>

          {/* Quick Presets Picker */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-[#1E140A] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Quick Lagos Classics (1-Click Fill)</span>
            </div>
            <div className="space-y-1.5">
              {dishPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setDishName(preset.name);
                    setTagline(preset.tagline);
                    setImageUrl(preset.image);
                    setSpiceLevel(preset.spice);
                    setCalories(preset.cal);
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-[#FF5500] hover:bg-[#FAF4EB] text-left transition-all text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="truncate pr-2 font-medium text-[#1E140A]">
                    {preset.name}
                  </div>
                  <span className="text-[10px] text-[#FF5500] font-bold shrink-0">Use</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Dish Editor Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#1E140A]/10 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#1E140A]/10">
            <div>
              <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider">
                Editing Menu For:
              </span>
              <h2 className="text-xl font-black font-display text-[#1E140A]">
                {selectedDayItem?.meal?.dayOfWeek || 'Weekday'}, {selectedDayItem?.meal?.monthName || monthName} {selectedDayNum}, {year}
              </h2>
            </div>
            
            {selectedDayItem?.hasOverride && (
              <button
                type="button"
                onClick={handleResetMenu}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                title="Reset to default rotation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
            
            {/* Dish Name */}
            <div className="space-y-1">
              <label className="block font-bold text-[#1E140A]">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Smokey Firewood Jollof & Peppered Turkey"
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] font-bold text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <label className="block font-bold text-[#1E140A]">
                Short Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Lagos Island Iconic Recipe with Party Smoke Aroma"
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block font-bold text-[#1E140A]">
                Full Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of flavors, texture, and cooking method..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
              />
            </div>

            {/* Dish Image Upload & Photo Center */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#1E140A] flex items-center gap-1.5 text-xs">
                  <Camera className="w-4 h-4 text-[#FF5500]" />
                  <span>Dish Photo (Upload from Kitchen or Camera)</span>
                </label>
                {imageUrl && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Image Active
                  </span>
                )}
              </div>

              {/* Upload Success Banner */}
              {uploadSuccessNote && (
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between">
                  <span>✓ {uploadSuccessNote}</span>
                  <button type="button" onClick={() => setUploadSuccessNote(null)} className="text-white text-xs ml-2">✕</button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                onDragLeave={() => setIsDraggingImage(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  isDraggingImage 
                    ? 'border-[#FF5500] bg-[#FF5500]/10 scale-[1.01]' 
                    : 'border-[#1E140A]/20 hover:border-[#FF5500] bg-white hover:bg-orange-50/40'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1E140A]">
                      Click to Browse or Drag & Drop Food Photo
                    </div>
                    <div className="text-[10px] text-[#1E140A]/60 mt-0.5">
                      Upload freshly cooked food shot from your kitchen phone or device (JPG, PNG, WEBP)
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Preview or Web URL input */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-[#1E140A]/60 uppercase tracking-wider">
                      Or Paste Image Web URL
                    </span>
                    <input
                      type="url"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>

                  {imageUrl && (
                    <div className="relative group shrink-0">
                      <div className="w-20 h-16 rounded-xl overflow-hidden border-2 border-[#FF5500] shadow-sm">
                        <img src={imageUrl} alt="Dish Preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUrl('');
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow hover:bg-rose-700 cursor-pointer"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Spice, Calories, & Allergens Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-[#1E140A]">
                  Spice Level
                </label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white font-bold text-xs text-[#1E140A] cursor-pointer"
                >
                  <option value="Mild">Mild (Gentle Heat)</option>
                  <option value="Medium">Medium (Balanced Kick)</option>
                  <option value="Lagos Fire">Lagos Fire (Hot Rodo)</option>
                  <option value="Oga At The Top">Oga At The Top (Intense)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#1E140A]">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white font-bold text-xs text-[#1E140A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#1E140A]">
                  Allergens (comma-sep)
                </label>
                <input
                  type="text"
                  value={allergensText}
                  onChange={(e) => setAllergensText(e.target.value)}
                  placeholder="Dairy Free, Nut Free"
                  className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A]"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-1">
              <label className="block font-bold text-[#1E140A]">
                Key Ingredients (comma-separated)
              </label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Parboiled Rice, Rodo, Tatashe, Turkey, Dodo, Thyme"
                className="w-full px-4 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A]"
              />
            </div>

            {/* Sub-Pack Sides & Chef Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-[#1E140A]">
                  Sub-Pack Sides
                </label>
                <input
                  type="text"
                  value={subPackSides}
                  onChange={(e) => setSubPackSides(e.target.value)}
                  placeholder="Fried Plantain (Dodo), Steamed Veggies"
                  className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#1E140A]">
                  Head Chef's Note
                </label>
                <input
                  type="text"
                  value={chefNote}
                  onChange={(e) => setChefNote(e.target.value)}
                  placeholder="e.g. Smoked with authentic mangrove wood"
                  className="w-full px-3 py-2 rounded-xl border border-[#1E140A]/15 bg-white text-xs text-[#1E140A]"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#1E140A]/10 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#FF5500] flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Live Subscriber Preview Card</span>
              </div>
              <div className="flex items-center gap-3">
                {imageUrl && (
                  <img src={imageUrl} alt={dishName} className="w-14 h-14 rounded-xl object-cover border border-stone-300" />
                )}
                <div>
                  <div className="font-bold text-sm text-[#1E140A]">{dishName || 'Dish Name'}</div>
                  <div className="text-[11px] text-[#1E140A]/70">{tagline || 'Tagline'}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {spiceLevel} • {calories} kcal • {subPackSides || 'Sides Included'}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save & Broadcast Menu Change</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
