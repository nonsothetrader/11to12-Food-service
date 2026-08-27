import { MenuItem, SpiceLevel } from '../types';

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'savage' | 'alert' | 'warning' | 'info' | 'promo';
  audience: 'all' | 'subscribers' | 'island' | 'mainland';
  isActive: boolean;
  timestamp: string;
  author: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Skipped' | 'Cancelled';

export type DecisionType = 'explicit_accept' | 'auto_accepted' | 'skipped' | 'cancelled';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  company: string;
  building: string;
  floor: string;
  zone: string;
  mealName: string;
  dietaryPreference: 'Standard' | 'FitFam / Low Carb';
  choice: 'accept' | 'skip' | 'cancel' | 'none';
  decisionType: DecisionType;
  standardPlates: number; // 1 for active plan drop, 0 if skipped/cancelled
  extraPlatesFromCredits: number; // 1, 2, 3... plates claimed with credits
  totalPlates: number; // standardPlates + extraPlatesFromCredits
  creditsUsed: number; // total insurance credits deducted for this delivery
  dateStr: string;
  deliveryDateLabel: string; // e.g. "Tomorrow's Drop"
  status: OrderStatus;
  riderName: string;
  riderPhone: string;
  spiceLevel: SpiceLevel;
  deliveryNotes?: string;
  amount: number;
  timeSlot: string;
  timestamp: string;
  isLockedAt8PM: boolean;
  isNextDayOrder: boolean;
}

export interface KitchenIngredient {
  id: string;
  name: string;
  category: 'Produce' | 'Proteins' | 'Dry Goods & Rice' | 'Oils & Spices' | 'Vegetables';
  status: 'In Stock' | 'Low Stock' | 'Critical Shortage';
  substituteNote?: string;
  quantityRemaining: string;
  lastUpdated: string;
}

export interface KitchenPackaging {
  id: string;
  name: string;
  count: number;
  minimumThreshold: number;
  unit: string;
  status: 'Adequate' | 'Reorder Soon' | 'Critical';
}

export interface AdminSubscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  building: string;
  floor: string;
  zone: string;
  plan: string;
  creditsBalance: number;
  status: 'Active' | 'Paused' | 'Past Due';
  joinDate: string;
  totalDelivered: number;
  dietaryPref: 'Standard' | 'FitFam / Low Carb';
  spiceLevel: SpiceLevel;
}

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  type: 'Inquiry' | 'Support' | 'Desk Drop Change' | 'Corporate';
  status: 'New' | 'Read' | 'Resolved';
  timestamp: string;
  replyText?: string;
}

export interface GiveawayEntry {
  id: string;
  code: string;
  campaign: string;
  discountType: '100% Free Week' | '₦5,000 Off Plan' | 'Free Delivery Voucher' | '2 Free Meals';
  discountAmount: number;
  status: 'Active' | 'Redeemed' | 'Expired';
  usedCount: number;
  maxUses: number;
  createdBy: string;
  expiresAt: string;
}

export interface AdminSettings {
  kitchenCutoffHour: number; // 20 for 8 PM
  skipCutoffHour: number; // 12 for 12 PM
  standardMealPrice: number; // 2900
  activeDeliveryZones: string[];
  autoLockAt8PM: boolean;
  savageAlertsEnabled: boolean;
  islandDispatchWindow: string;
  mainlandDispatchWindow: string;
  emergencyKitchenHold: boolean;
  adminEmails: string[];
}

export interface AdminMetrics {
  todayRevenue: number;
  activeSubscribers: number;
  todayConfirmations: number;
  todaySkips: number;
  onTimePunctualityPercent: number;
  mealsCookedToday: number;
  totalMealsDeliveredAllTime: number;
}

export interface AppStoreData {
  announcements: AdminAnnouncement[];
  orders: AdminOrder[];
  ingredients: KitchenIngredient[];
  packaging: KitchenPackaging[];
  subscribers: AdminSubscriber[];
  inbox: InboxMessage[];
  giveaways: GiveawayEntry[];
  settings: AdminSettings;
  metrics: AdminMetrics;
  customMenuOverrides: Record<string, Partial<MenuItem>>; // key is YYYY-MM-DD
  is8PMLocked: boolean;
  nextDeliveryDateLabel: string;
  currentUserRole: 'guest' | 'user' | 'admin';
  adminEmail: string | null;
}

const STORAGE_KEY = '11to12_app_store_v1';

// Initial Seed Data
const INITIAL_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: '⚠️ Savage Colleague Alert — Protect Your Food Box!',
    message: 'We noticed desk vultures hovering around the 4th-floor fridge in Marina. Your meal is sealed with tamper-proof labels. Do not allow your desk neighbor to "sample" your smoky turkey.',
    type: 'savage',
    audience: 'all',
    isActive: true,
    timestamp: 'Today, 8:30 AM',
    author: 'Chef Femi (Head of Kitchen Justice)'
  },
  {
    id: 'ann-2',
    title: '🌧️ Lagos Island Traffic & Rain Advisory',
    message: 'Slight drizzle on Falomo Bridge. Our riders are on Honda 125s with waterproof thermals — all 11:00 AM – 12:00 PM drops will arrive piping hot strictly on schedule.',
    type: 'alert',
    audience: 'island',
    isActive: true,
    timestamp: 'Today, 9:15 AM',
    author: 'Dispatch Command (HQ)'
  }
];

const INITIAL_SUBSCRIBERS: AdminSubscriber[] = [
  {
    id: 'sub-1',
    name: 'Babatunde Adeyemi',
    email: 'babatunde@paystack.com',
    phone: '0803 123 4567',
    company: 'Fintech HQ (Paystack)',
    building: 'Landmark Towers',
    floor: '4th Floor, Innovation Wing',
    zone: 'Victoria Island',
    plan: 'Monthly Corporate Desk Drop (20 Days)',
    creditsBalance: 2,
    status: 'Active',
    joinDate: '2026-06-10',
    totalDelivered: 42,
    dietaryPref: 'Standard',
    spiceLevel: 'Medium'
  },
  {
    id: 'sub-2',
    name: 'Chioma Okonkwo',
    email: 'chioma.o@kuda.com',
    phone: '0812 345 6789',
    company: 'Kuda Microfinance Bank',
    building: '1-11 Commercial Avenue',
    floor: 'Penthouse Office',
    zone: 'Yaba / Mainland',
    plan: 'Bi-Weekly Flex Plan (10 Days)',
    creditsBalance: 1,
    status: 'Active',
    joinDate: '2026-07-01',
    totalDelivered: 28,
    dietaryPref: 'FitFam / Low Carb',
    spiceLevel: 'Mild'
  },
  {
    id: 'sub-3',
    name: 'Tunde Bakare',
    email: 'tbakare@sterling.ng',
    phone: '0802 888 9911',
    company: 'Sterling Tower',
    building: 'Sterling Bank HQ',
    floor: '8th Floor, Treasury Desk',
    zone: 'Marina / Lagos Island',
    plan: 'Monthly Corporate Desk Drop (20 Days)',
    creditsBalance: 4,
    status: 'Active',
    joinDate: '2026-05-18',
    totalDelivered: 65,
    dietaryPref: 'Standard',
    spiceLevel: 'Lagos Fire'
  },
  {
    id: 'sub-4',
    name: 'Fatima Aliyu',
    email: 'fatima@venturesplatform.com',
    phone: '0814 990 1234',
    company: 'Ventures Platform Hub',
    building: 'Heritage Place',
    floor: '2nd Floor, Deal Room',
    zone: 'Ikoyi',
    plan: 'Custom 15-Workday Pack',
    creditsBalance: 0,
    status: 'Active',
    joinDate: '2026-08-02',
    totalDelivered: 14,
    dietaryPref: 'Standard',
    spiceLevel: 'Medium'
  },
  {
    id: 'sub-5',
    name: 'Damilola Adeleke',
    email: 'dami@moniepoint.com',
    phone: '0703 445 6789',
    company: 'Moniepoint HQ',
    building: 'Oyo State House / Campbell',
    floor: '3rd Floor, Platform Engineering',
    zone: 'Victoria Island',
    plan: 'Monthly Corporate Desk Drop (20 Days)',
    creditsBalance: 3,
    status: 'Active',
    joinDate: '2026-07-15',
    totalDelivered: 31,
    dietaryPref: 'FitFam / Low Carb',
    spiceLevel: 'Medium'
  }
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-next-1',
    orderNumber: 'LAG-9041',
    customerName: 'Babatunde Adeyemi',
    email: 'babatunde@paystack.com',
    phone: '0803 123 4567',
    company: 'Fintech HQ (Paystack)',
    building: 'Landmark Towers',
    floor: '4th Floor, Innovation Wing (Desk 14)',
    zone: 'Victoria Island',
    mealName: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
    dietaryPreference: 'Standard',
    choice: 'accept',
    decisionType: 'explicit_accept',
    standardPlates: 1,
    extraPlatesFromCredits: 2,
    totalPlates: 3,
    creditsUsed: 2,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Preparing',
    riderName: 'Emeka Nwosu',
    riderPhone: '0803 999 1122',
    spiceLevel: 'Medium',
    deliveryNotes: '2 Extra plates for Strategy Team guests. Drop with Blessing at Reception.',
    amount: 8700,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 07:15 PM',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-2',
    orderNumber: 'LAG-9042',
    customerName: 'Chioma Okonkwo',
    email: 'chioma.o@kuda.com',
    phone: '0812 345 6789',
    company: 'Kuda Microfinance Bank',
    building: '1-11 Commercial Avenue',
    floor: 'Penthouse Office (Desk 4B)',
    zone: 'Yaba / Mainland',
    mealName: 'Brown Rice & Steamed Spinach Ayamase Bowl',
    dietaryPreference: 'FitFam / Low Carb',
    choice: 'accept',
    decisionType: 'auto_accepted',
    standardPlates: 1,
    extraPlatesFromCredits: 0,
    totalPlates: 1,
    creditsUsed: 0,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Preparing',
    riderName: 'Ibrahim Sani',
    riderPhone: '0802 111 4455',
    spiceLevel: 'Mild',
    deliveryNotes: 'Auto-accepted at 8:00 PM cutoff (User took no action).',
    amount: 2900,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 08:00 PM (Auto-Lock)',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-3',
    orderNumber: 'LAG-9043',
    customerName: 'Tunde Bakare',
    email: 'tbakare@sterling.ng',
    phone: '0802 888 9911',
    company: 'Sterling Bank HQ',
    building: 'Sterling Tower',
    floor: '8th Floor, Treasury Desk',
    zone: 'Marina / Lagos Island',
    mealName: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
    dietaryPreference: 'Standard',
    choice: 'accept',
    decisionType: 'explicit_accept',
    standardPlates: 1,
    extraPlatesFromCredits: 1,
    totalPlates: 2,
    creditsUsed: 1,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Preparing',
    riderName: 'Emeka Nwosu',
    riderPhone: '0803 999 1122',
    spiceLevel: 'Lagos Fire',
    deliveryNotes: 'Used 1 Insurance Credit for Colleague lunch plate.',
    amount: 5800,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 06:40 PM',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-4',
    orderNumber: 'LAG-9044',
    customerName: 'Fatima Aliyu',
    email: 'fatima@venturesplatform.com',
    phone: '0814 990 1234',
    company: 'Ventures Platform Hub',
    building: 'Heritage Place',
    floor: '2nd Floor, Deal Room',
    zone: 'Ikoyi',
    mealName: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
    dietaryPreference: 'Standard',
    choice: 'skip',
    decisionType: 'skipped',
    standardPlates: 0,
    extraPlatesFromCredits: 0,
    totalPlates: 0,
    creditsUsed: 0,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Skipped',
    riderName: 'Unassigned',
    riderPhone: '-',
    spiceLevel: 'Medium',
    deliveryNotes: 'Working from home tomorrow. +1 Credit banked to Lunch Insurance wallet.',
    amount: 0,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 04:30 PM',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-5',
    orderNumber: 'LAG-9045',
    customerName: 'Damilola Adeleke',
    email: 'dami@moniepoint.com',
    phone: '0703 445 6789',
    company: 'Moniepoint HQ',
    building: 'Oyo State House / Campbell',
    floor: '3rd Floor, Platform Engineering',
    zone: 'Victoria Island',
    mealName: 'Brown Rice & Steamed Spinach Ayamase Bowl',
    dietaryPreference: 'FitFam / Low Carb',
    choice: 'accept',
    decisionType: 'auto_accepted',
    standardPlates: 1,
    extraPlatesFromCredits: 1,
    totalPlates: 2,
    creditsUsed: 1,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Preparing',
    riderName: 'Taiwo Afolabi',
    riderPhone: '0805 777 8899',
    spiceLevel: 'Medium',
    deliveryNotes: 'Auto-accepted default plan + 1 pre-set extra plate (1 credit used).',
    amount: 5800,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 08:00 PM (Auto-Lock)',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-6',
    orderNumber: 'LAG-9046',
    customerName: 'Kemi Johnson',
    email: 'kemi.j@flutterwavego.com',
    phone: '0809 112 3344',
    company: 'Flutterwave HQ',
    building: '8 Providence Street',
    floor: '5th Floor, Growth & Expansion',
    zone: 'Lekki Phase 1',
    mealName: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
    dietaryPreference: 'Standard',
    choice: 'cancel',
    decisionType: 'cancelled',
    standardPlates: 0,
    extraPlatesFromCredits: 0,
    totalPlates: 0,
    creditsUsed: 0,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Cancelled',
    riderName: 'Unassigned',
    riderPhone: '-',
    spiceLevel: 'Medium',
    deliveryNotes: 'Travelling to Abuja branch. Cancelled before 8 PM cutoff.',
    amount: 0,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 05:10 PM',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-next-7',
    orderNumber: 'LAG-9047',
    customerName: 'Obinna Eze',
    email: 'obinna@interswitch.com',
    phone: '0803 777 2211',
    company: 'Interswitch Group',
    building: 'Oko Awo Street',
    floor: '7th Floor, Switching Infrastructure',
    zone: 'Victoria Island',
    mealName: 'Aromatic Ofada Rice with Ayamase & Assorted Meats',
    dietaryPreference: 'Standard',
    choice: 'accept',
    decisionType: 'explicit_accept',
    standardPlates: 1,
    extraPlatesFromCredits: 3,
    totalPlates: 4,
    creditsUsed: 3,
    dateStr: 'Tomorrow',
    deliveryDateLabel: 'Tomorrow (8 PM Locked)',
    status: 'Preparing',
    riderName: 'Emeka Nwosu',
    riderPhone: '0803 999 1122',
    spiceLevel: 'Lagos Fire',
    deliveryNotes: '3 Extra Plates (Used 3 Credits from team pooled balance). Server room desk.',
    amount: 11600,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: 'Yesterday, 07:48 PM',
    isLockedAt8PM: true,
    isNextDayOrder: true
  },
  {
    id: 'ord-101',
    orderNumber: 'LAG-8921',
    customerName: 'Babatunde Adeyemi',
    email: 'babatunde@paystack.com',
    phone: '0803 123 4567',
    company: 'Fintech HQ (Paystack)',
    building: 'Landmark Towers',
    floor: '4th Floor, Innovation Wing',
    zone: 'Victoria Island',
    mealName: 'Smokey Firewood Jollof & Peppered Turkey',
    dietaryPreference: 'Standard',
    choice: 'accept',
    decisionType: 'explicit_accept',
    standardPlates: 1,
    extraPlatesFromCredits: 0,
    totalPlates: 1,
    creditsUsed: 0,
    dateStr: 'Today',
    deliveryDateLabel: 'Today (Active Drop)',
    status: 'Out for Delivery',
    riderName: 'Emeka Nwosu',
    riderPhone: '0803 999 1122',
    spiceLevel: 'Medium',
    deliveryNotes: 'Drop with receptionist Blessing if in standup',
    amount: 2900,
    timeSlot: '11:00 AM – 12:00 PM',
    timestamp: '08:45 AM',
    isLockedAt8PM: true,
    isNextDayOrder: false
  }
];

const INITIAL_INGREDIENTS: KitchenIngredient[] = [
  {
    id: 'ing-1',
    name: 'Fresh Tatashe & Rodo (Red Bell Pepper Blend)',
    category: 'Produce',
    status: 'In Stock',
    quantityRemaining: '140 kg (Direct from Mile 12 bulk buy)',
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'ing-2',
    name: 'Grade-A Prime Peppered Turkey Cuts',
    category: 'Proteins',
    status: 'In Stock',
    quantityRemaining: '85 kg',
    lastUpdated: 'Today, 06:30 AM'
  },
  {
    id: 'ing-3',
    name: 'Long-Grain Parboiled Jollof Rice',
    category: 'Dry Goods & Rice',
    status: 'In Stock',
    quantityRemaining: '12 bags (50kg each)',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'ing-4',
    name: 'Fresh Sweet Plantains (Ripe Dodo)',
    category: 'Produce',
    status: 'Low Stock',
    substituteNote: 'Supplementary bunches inbound from Ketu market truck',
    quantityRemaining: '18 bunches',
    lastUpdated: 'Today, 07:15 AM'
  },
  {
    id: 'ing-5',
    name: 'Authentic Iru (Fermented Locust Beans)',
    category: 'Oils & Spices',
    status: 'In Stock',
    quantityRemaining: '25 kg (Washed & salted)',
    lastUpdated: '2 days ago'
  },
  {
    id: 'ing-6',
    name: 'Fresh Croaker Fish (Whole Steaks)',
    category: 'Proteins',
    status: 'In Stock',
    quantityRemaining: '60 kg chilled',
    lastUpdated: 'Today, 05:45 AM'
  }
];

const INITIAL_PACKAGING: KitchenPackaging[] = [
  {
    id: 'pack-1',
    name: 'Heavy-Duty 3-Compartment Sugarcane Eco-Bowls',
    count: 1420,
    minimumThreshold: 500,
    unit: 'Units',
    status: 'Adequate'
  },
  {
    id: 'pack-2',
    name: '11to12 Red Tamper-Evident Security Seals',
    count: 3200,
    minimumThreshold: 800,
    unit: 'Stickers',
    status: 'Adequate'
  },
  {
    id: 'pack-3',
    name: 'Foil Thermal Insulated Soup Pouches (For Friday Swallow)',
    count: 480,
    minimumThreshold: 400,
    unit: 'Pouches',
    status: 'Reorder Soon'
  },
  {
    id: 'pack-4',
    name: 'Eco Wooden Cutlery & Wet Wipe Packs',
    count: 1950,
    minimumThreshold: 600,
    unit: 'Sets',
    status: 'Adequate'
  }
];

const INITIAL_INBOX: InboxMessage[] = [
  {
    id: 'msg-1',
    name: 'Kehinde Olayinka',
    email: 'kehinde@interswitchng.com',
    phone: '0809 111 2233',
    company: 'Interswitch Group',
    subject: 'Corporate Lunch account for 35 engineers on 6th Floor',
    message: 'Hello, our engineering team at Interswitch wants to consolidate our workday lunches. Can we get a unified invoice with desk drop directly to our scrum floor?',
    type: 'Corporate',
    status: 'New',
    timestamp: 'Today, 09:40 AM'
  },
  {
    id: 'msg-2',
    name: 'Amina Bello',
    email: 'amina@flutter.dev',
    phone: '0813 444 5566',
    company: 'Civic Hive / Co-Creation Hub',
    subject: 'Temporary desk change for next week (Yaba to Ikoyi)',
    message: 'Hi 11to12 team! I will be working out of our Ikoyi satellite office from Monday to Wednesday next week. How do I switch my drop address without disrupting my subscription?',
    type: 'Desk Drop Change',
    status: 'New',
    timestamp: 'Today, 08:20 AM'
  },
  {
    id: 'msg-3',
    name: 'Folarin Shonibare',
    email: 'folarin@kpmg.com',
    phone: '0802 333 4455',
    company: 'KPMG Tower',
    subject: 'Feedback on yesterday\'s Asaro and Croaker',
    message: 'The yam porridge was phenomenal! The fish was fresh and still steaming hot when rider reached the 9th floor. Please make sure the pepper level stays like this!',
    type: 'Inquiry',
    status: 'Resolved',
    timestamp: 'Yesterday, 02:15 PM',
    replyText: 'Thank you Folarin! Head Chef Femi was thrilled to hear this. We made sure your heat profile is locked at Medium.'
  }
];

const INITIAL_GIVEAWAYS: GiveawayEntry[] = [
  {
    id: 'give-1',
    code: 'SURVIVAL-LAGOS-20',
    campaign: 'Launch Day Lagos Office Relief Campaign',
    discountType: '₦5,000 Off Plan',
    discountAmount: 5000,
    status: 'Active',
    usedCount: 38,
    maxUses: 100,
    createdBy: 'System HQ',
    expiresAt: '2026-09-30'
  },
  {
    id: 'give-2',
    code: 'HUNGER-JUSTICE-FREE',
    campaign: 'Tech Hub Floor Lottery Winner',
    discountType: '100% Free Week',
    discountAmount: 14500,
    status: 'Active',
    usedCount: 6,
    maxUses: 10,
    createdBy: 'Marketing Ops',
    expiresAt: '2026-09-15'
  },
  {
    id: 'give-3',
    code: 'FINTECH-LUNCH-VIP',
    campaign: 'Partner Perks Discount',
    discountType: '2 Free Meals',
    discountAmount: 5800,
    status: 'Active',
    usedCount: 14,
    maxUses: 50,
    createdBy: 'Corporate Relations',
    expiresAt: '2026-10-01'
  }
];

const INITIAL_SETTINGS: AdminSettings = {
  kitchenCutoffHour: 20, // 8:00 PM
  skipCutoffHour: 12, // 12:00 PM
  standardMealPrice: 2900,
  activeDeliveryZones: [
    'Victoria Island (VI)',
    'Ikoyi',
    'Marina / Lagos Island',
    'Lekki Phase 1',
    'Yaba / Mainland'
  ],
  autoLockAt8PM: true,
  savageAlertsEnabled: true,
  islandDispatchWindow: '09:00 AM – 01:00 PM',
  mainlandDispatchWindow: '09:30 AM – 01:00 PM',
  emergencyKitchenHold: false,
  adminEmails: [
    'admin@11to12.com',
    'admin@11to12.ng',
    'nonsothetrader@gmail.com',
    'chef@11to12.ng',
    'justice@11to12.ng'
  ]
};

const INITIAL_METRICS: AdminMetrics = {
  todayRevenue: 478500,
  activeSubscribers: 165,
  todayConfirmations: 148,
  todaySkips: 17,
  onTimePunctualityPercent: 99.4,
  mealsCookedToday: 154,
  totalMealsDeliveredAllTime: 4890
};

// Singleton broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('11to12_realtime_sync');
  }
} catch (e) {
  // fallback if unsupported
}

export function isCurrentTimePast8PM(): boolean {
  return new Date().getHours() >= 20;
}

export function loadStore(): AppStoreData {
  const currentLockState = isCurrentTimePast8PM();

  if (typeof window === 'undefined') {
    return {
      announcements: INITIAL_ANNOUNCEMENTS,
      orders: INITIAL_ORDERS,
      ingredients: INITIAL_INGREDIENTS,
      packaging: INITIAL_PACKAGING,
      subscribers: INITIAL_SUBSCRIBERS,
      inbox: INITIAL_INBOX,
      giveaways: INITIAL_GIVEAWAYS,
      settings: INITIAL_SETTINGS,
      metrics: INITIAL_METRICS,
      customMenuOverrides: {},
      is8PMLocked: currentLockState,
      nextDeliveryDateLabel: currentLockState ? 'Tomorrow (8:00 PM Locked)' : 'Tomorrow (Open for Selection)',
      currentUserRole: 'user',
      adminEmail: null
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData: AppStoreData = {
        announcements: INITIAL_ANNOUNCEMENTS,
        orders: INITIAL_ORDERS,
        ingredients: INITIAL_INGREDIENTS,
        packaging: INITIAL_PACKAGING,
        subscribers: INITIAL_SUBSCRIBERS,
        inbox: INITIAL_INBOX,
        giveaways: INITIAL_GIVEAWAYS,
        settings: INITIAL_SETTINGS,
        metrics: INITIAL_METRICS,
        customMenuOverrides: {},
        is8PMLocked: currentLockState,
        nextDeliveryDateLabel: currentLockState ? 'Tomorrow (8:00 PM Locked)' : 'Tomorrow (Open for Selection)',
        currentUserRole: 'user',
        adminEmail: null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    const parsed = JSON.parse(raw) as AppStoreData;
    // merge in any missing properties to prevent null crashes
    return {
      announcements: parsed.announcements || INITIAL_ANNOUNCEMENTS,
      orders: parsed.orders && parsed.orders.length > 0 ? parsed.orders : INITIAL_ORDERS,
      ingredients: parsed.ingredients || INITIAL_INGREDIENTS,
      packaging: parsed.packaging || INITIAL_PACKAGING,
      subscribers: parsed.subscribers || INITIAL_SUBSCRIBERS,
      inbox: parsed.inbox || INITIAL_INBOX,
      giveaways: parsed.giveaways || INITIAL_GIVEAWAYS,
      settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
      metrics: { ...INITIAL_METRICS, ...(parsed.metrics || {}) },
      customMenuOverrides: parsed.customMenuOverrides || {},
      is8PMLocked: currentLockState,
      nextDeliveryDateLabel: currentLockState ? 'Tomorrow (8:00 PM Locked)' : 'Tomorrow (Open for Selection)',
      currentUserRole: parsed.currentUserRole || 'user',
      adminEmail: parsed.adminEmail || null
    };
  } catch (err) {
    return {
      announcements: INITIAL_ANNOUNCEMENTS,
      orders: INITIAL_ORDERS,
      ingredients: INITIAL_INGREDIENTS,
      packaging: INITIAL_PACKAGING,
      subscribers: INITIAL_SUBSCRIBERS,
      inbox: INITIAL_INBOX,
      giveaways: INITIAL_GIVEAWAYS,
      settings: INITIAL_SETTINGS,
      metrics: INITIAL_METRICS,
      customMenuOverrides: {},
      is8PMLocked: currentLockState,
      nextDeliveryDateLabel: currentLockState ? 'Tomorrow (8:00 PM Locked)' : 'Tomorrow (Open for Selection)',
      currentUserRole: 'user',
      adminEmail: null
    };
  }
}

export function saveStore(data: AppStoreData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('11to12_store_update', { detail: data }));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'STORE_UPDATED', timestamp: Date.now() });
    }
  } catch (err) {
    console.error('Failed to save store', err);
  }
}

// Helper methods for Admin actions that sync in real-time
export const AdminActions = {
  // Announcements
  addAnnouncement: (title: string, message: string, type: AdminAnnouncement['type'] = 'savage', audience: AdminAnnouncement['audience'] = 'all') => {
    const store = loadStore();
    const newAnn: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      type,
      audience,
      isActive: true,
      timestamp: 'Just now',
      author: 'Kitchen Command (HQ)'
    };
    store.announcements = [newAnn, ...store.announcements];
    saveStore(store);
    return newAnn;
  },

  toggleAnnouncement: (id: string) => {
    const store = loadStore();
    store.announcements = store.announcements.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    saveStore(store);
  },

  deleteAnnouncement: (id: string) => {
    const store = loadStore();
    store.announcements = store.announcements.filter(a => a.id !== id);
    saveStore(store);
  },

  // 8:00 PM Lock Control
  toggle8PMLock: (forceLock?: boolean) => {
    const store = loadStore();
    store.is8PMLocked = forceLock !== undefined ? forceLock : !store.is8PMLocked;
    // Mark next day orders as locked
    store.orders = store.orders.map(o => o.isNextDayOrder ? { ...o, isLockedAt8PM: store.is8PMLocked } : o);
    saveStore(store);
    return store.is8PMLocked;
  },

  // Menu Management Overrides
  updateDailyMenu: (dateStr: string, menuData: Partial<MenuItem>) => {
    const store = loadStore();
    const existing = store.customMenuOverrides[dateStr] || {};
    store.customMenuOverrides[dateStr] = {
      ...existing,
      ...menuData,
      dateStr
    };
    saveStore(store);
    return store.customMenuOverrides[dateStr];
  },

  resetDailyMenu: (dateStr: string) => {
    const store = loadStore();
    if (store.customMenuOverrides[dateStr]) {
      delete store.customMenuOverrides[dateStr];
      saveStore(store);
    }
  },

  // Orders & Next Day Multi-Plate Tracking
  updateOrderStatus: (orderId: string, status: OrderStatus, riderName?: string, riderPhone?: string) => {
    const store = loadStore();
    store.orders = store.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          ...(riderName ? { riderName } : {}),
          ...(riderPhone ? { riderPhone } : {})
        };
      }
      return o;
    });

    // recalculate today metrics
    const deliveredCount = store.orders.filter(o => o.status === 'Delivered').length;
    store.metrics.todayConfirmations = deliveredCount;
    saveStore(store);
  },

  assignRider: (orderId: string, riderName: string, riderPhone: string) => {
    const store = loadStore();
    store.orders = store.orders.map(o => o.id === orderId ? { ...o, riderName, riderPhone, status: 'Out for Delivery' } : o);
    saveStore(store);
  },

  updateOrderDecision: (orderId: string, choice: 'accept' | 'skip' | 'cancel', decisionType: DecisionType) => {
    const store = loadStore();
    store.orders = store.orders.map(o => {
      if (o.id === orderId) {
        const standardPlates = (choice === 'accept') ? 1 : 0;
        const totalPlates = standardPlates + (choice === 'accept' ? o.extraPlatesFromCredits : 0);
        return {
          ...o,
          choice,
          decisionType,
          standardPlates,
          totalPlates,
          status: choice === 'skip' ? 'Skipped' : choice === 'cancel' ? 'Cancelled' : 'Preparing'
        };
      }
      return o;
    });
    saveStore(store);
  },

  updateOrderExtraPlates: (orderId: string, extraPlatesCount: number) => {
    const store = loadStore();
    store.orders = store.orders.map(o => {
      if (o.id === orderId) {
        const cleanExtra = Math.max(0, extraPlatesCount);
        const standardPlates = o.choice === 'accept' ? 1 : 0;
        return {
          ...o,
          extraPlatesFromCredits: cleanExtra,
          creditsUsed: cleanExtra,
          totalPlates: standardPlates + cleanExtra,
          amount: (standardPlates + cleanExtra) * 2900
        };
      }
      return o;
    });
    saveStore(store);
  },

  recordUserDecisionWithCredits: (
    userEmail: string, 
    choice: 'accept' | 'skip' | 'cancel', 
    extraCreditsUsed: number = 0,
    decisionType: DecisionType = 'explicit_accept'
  ) => {
    const store = loadStore();
    const orderIndex = store.orders.findIndex(o => o.isNextDayOrder && o.email.toLowerCase() === userEmail.toLowerCase());
    
    if (orderIndex >= 0) {
      const existing = store.orders[orderIndex];
      const standardPlates = choice === 'accept' ? 1 : 0;
      const extraPlates = choice === 'accept' ? Math.max(0, extraCreditsUsed) : 0;
      
      store.orders[orderIndex] = {
        ...existing,
        choice,
        decisionType,
        standardPlates,
        extraPlatesFromCredits: extraPlates,
        creditsUsed: extraPlates,
        totalPlates: standardPlates + extraPlates,
        status: choice === 'skip' ? 'Skipped' : choice === 'cancel' ? 'Cancelled' : 'Preparing'
      };
    }
    saveStore(store);
  },

  // Kitchen Ingredients
  toggleIngredientStatus: (id: string, status: KitchenIngredient['status'], substituteNote?: string) => {
    const store = loadStore();
    store.ingredients = store.ingredients.map(i => i.id === id ? {
      ...i,
      status,
      substituteNote: substituteNote !== undefined ? substituteNote : i.substituteNote,
      lastUpdated: 'Just now'
    } : i);
    saveStore(store);
  },

  updatePackagingCount: (id: string, newCount: number) => {
    const store = loadStore();
    store.packaging = store.packaging.map(p => {
      if (p.id === id) {
        const status: KitchenPackaging['status'] = newCount <= p.minimumThreshold / 2 ? 'Critical' : newCount <= p.minimumThreshold ? 'Reorder Soon' : 'Adequate';
        return { ...p, count: newCount, status };
      }
      return p;
    });
    saveStore(store);
  },

  // Subscribers
  adjustUserCredits: (subscriberId: string, creditDelta: number) => {
    const store = loadStore();
    store.subscribers = store.subscribers.map(s => {
      if (s.id === subscriberId) {
        return { ...s, creditsBalance: Math.max(0, s.creditsBalance + creditDelta) };
      }
      return s;
    });
    saveStore(store);
  },

  toggleSubscriberStatus: (subscriberId: string, status: AdminSubscriber['status']) => {
    const store = loadStore();
    store.subscribers = store.subscribers.map(s => s.id === subscriberId ? { ...s, status } : s);
    saveStore(store);
  },

  // Inbox
  replyInboxMessage: (id: string, replyText: string) => {
    const store = loadStore();
    store.inbox = store.inbox.map(m => m.id === id ? { ...m, replyText, status: 'Resolved' } : m);
    saveStore(store);
  },

  updateInboxStatus: (id: string, status: InboxMessage['status']) => {
    const store = loadStore();
    store.inbox = store.inbox.map(m => m.id === id ? { ...m, status } : m);
    saveStore(store);
  },

  // Giveaways
  createGiveawayCode: (code: string, campaign: string, discountType: GiveawayEntry['discountType'], discountAmount: number, maxUses: number = 50) => {
    const store = loadStore();
    const newGiveaway: GiveawayEntry = {
      id: `give-${Date.now()}`,
      code: code.toUpperCase().trim(),
      campaign,
      discountType,
      discountAmount,
      status: 'Active',
      usedCount: 0,
      maxUses,
      createdBy: 'Admin Ops',
      expiresAt: '2026-10-31'
    };
    store.giveaways = [newGiveaway, ...store.giveaways];
    saveStore(store);
    return newGiveaway;
  },

  toggleGiveawayStatus: (id: string) => {
    const store = loadStore();
    store.giveaways = store.giveaways.map(g => g.id === id ? {
      ...g,
      status: g.status === 'Active' ? 'Expired' : 'Active'
    } : g);
    saveStore(store);
  },

  // Settings
  updateSettings: (newSettings: Partial<AdminSettings>) => {
    const store = loadStore();
    store.settings = { ...store.settings, ...newSettings };
    saveStore(store);
  },

  // Admin Auth Gating
  loginAsAdmin: (email: string, password?: string) => {
    const store = loadStore();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    // Check email authorization
    const isWhitelisted = store.settings.adminEmails.some(e => e.toLowerCase() === cleanEmail) || 
                          cleanEmail.endsWith('@11to12.ng') ||
                          cleanEmail.endsWith('@11to12.com') ||
                          cleanEmail === 'nonsothetrader@gmail.com' ||
                          cleanEmail === 'admin@11to12.com';

    if (!isWhitelisted) {
      return { success: false, message: 'Access Denied: That email is not registered as an authorized Admin.' };
    }

    // Check master password (supports user's PASSWORDadmin123, admin123, etc.)
    const validPasswords = [
      'PASSWORDadmin123',
      'passwordadmin123',
      'Passwordadmin123',
      'PasswordAdmin123',
      'admin123',
      'ADMIN123',
      '11to12admin'
    ];

    if (!cleanPassword || !validPasswords.includes(cleanPassword)) {
      return { success: false, message: 'Invalid Admin Password. Please use "PASSWORDadmin123".' };
    }

    store.currentUserRole = 'admin';
    store.adminEmail = cleanEmail;
    saveStore(store);
    return { success: true, message: 'Welcome to 11to12 Admin Command' };
  },

  logoutAdmin: () => {
    const store = loadStore();
    store.currentUserRole = 'user';
    store.adminEmail = null;
    saveStore(store);
  }
};
