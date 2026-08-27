export type SpiceLevel = 'Mild' | 'Medium' | 'Lagos Fire' | 'Oga At The Top';

export interface MenuItem {
  id: string;
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: string;
  dayNumber: number;
  monthName: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  ingredients: string[];
  spiceLevel: SpiceLevel;
  allergens: string[];
  calories: number;
  subPack: {
    name: string;
    description: string;
    category: 'FitFam / Low Carb' | 'Vegetarian' | 'Comfort Classic';
    ingredients: string[];
  };
  chefNote?: string;
}

export interface PricingAddon {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  iconName: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  companyLocation: string;
  avatar: string;
  favoriteDish: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Delivery' | 'Subscription' | 'Food & Diet' | 'Payment';
}
