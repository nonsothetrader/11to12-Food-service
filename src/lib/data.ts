import { MenuItem, SpiceLevel } from '../types';
import { loadStore } from './store';

export interface DashboardUser {
  name: string;
  email: string;
  phone: string;
  company: string;
  building: string;
  floor: string;
  area: string;
  subscriptionPlan: string;
  creditsBalance: number;
  dietaryPreference: 'Standard' | 'FitFam / Low Carb';
  spiceLevel: SpiceLevel;
}

export const DEFAULT_DASHBOARD_USER: DashboardUser = {
  name: 'Babatunde Adeyemi',
  email: 'babatunde@paystack.com',
  phone: '0803 123 4567',
  company: 'Fintech HQ',
  building: 'Landmark Towers',
  floor: '4th Floor, Innovation Wing',
  area: 'Victoria Island, Lagos',
  subscriptionPlan: 'Monthly Corporate Desk Drop',
  creditsBalance: 2,
  dietaryPreference: 'Standard',
  spiceLevel: 'Medium'
};

// 1. Mon-Thu Rice Dishes
export const RICE_DISHES: Array<{
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
}> = [
  {
    name: "Smokey Firewood Jollof & Peppered Turkey",
    tagline: "Party Jollof with bottom-pot fragrance and tender glazed turkey",
    description: "Long-grain rice slow-cooked in rich red bell pepper reduction, seasoned with bay leaf, thyme, and locked-in firewood smoke flavor.",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Long Grain Parboiled Rice", "Tatashe & Rodo Blend", "Peppered Turkey", "Fried Sweet Plantain (Dodo)", "Sweet Corn & Peas"],
    spiceLevel: "Medium",
    allergens: ["Poultry"],
    calories: 680,
    subPack: {
      name: "Cauliflower Jollof Bowl with Herb Grilled Chicken Breast",
      description: "Low-carb cauliflower rice cooked in spiced tomato-tatashe base.",
      category: "FitFam / Low Carb",
      ingredients: ["Cauliflower Rice", "Grilled Chicken Breast", "Steamed Broccoli", "Cold-Pressed Olive Oil"]
    },
    chefNote: "Cooked in traditional cast-iron pots for that authentic party smoky bottom-pot aroma."
  },
  {
    name: "Classic Lagos Fried Rice with Crisp Grilled Chicken",
    tagline: "Vibrant yellow rice sautéed with liver cubes, sweet veggies and savory chicken",
    description: "Savory curry and thyme infused rice tossed with sweet corn, carrots, diced liver, and green beans. Served with golden spiced chicken.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Fried Rice", "Grilled Chicken Quarter", "Diced Seasoned Liver", "Sweet Corn & Green Beans", "Fried Plantain"],
    spiceLevel: "Mild",
    allergens: ["Poultry", "Liver"],
    calories: 710,
    subPack: {
      name: "Quinoa Stir-Fry Bowl with Herb Chicken Breast",
      description: "Organic quinoa sautéed in cold-pressed coconut oil with crisp garden veggies.",
      category: "FitFam / Low Carb",
      ingredients: ["Quinoa", "Grilled Chicken Breast", "Shredded Carrots", "Green Bell Pepper"]
    },
    chefNote: "Veggies are quick-tossed at the end to keep their fresh crunch."
  },
  {
    name: "Aromatic Ofada Rice with Ayamase Sauce & Assorted Meats",
    tagline: "Indigenous unpolished brown rice drenched in spicy bleached-oil green pepper stew",
    description: "Rich traditional unpolished Ofada rice served with authentic Ayamase (designer stew) packed with diced beef, shaki, boiled egg, and locust beans (iru).",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Short Grain Ofada Rice", "Green Rodo & Tatashe Blend", "Iru (Locust Beans)", "Assorted Diced Beef & Shaki", "Boiled Egg"],
    spiceLevel: "Lagos Fire",
    allergens: ["Eggs", "Beef"],
    calories: 740,
    subPack: {
      name: "Brown Rice & Steamed Spinach Ayamase Bowl",
      description: "Low-oil green pepper sauce over fibre-rich brown rice with lean beef cuts.",
      category: "FitFam / Low Carb",
      ingredients: ["Fibre Brown Rice", "Lean Beef Cubes", "Steamed Spinach", "Light Green Pepper Sauce"]
    },
    chefNote: "Authentic Iru and dried crayfish create the unmistakable indigenous depth."
  },
  {
    name: "Native Red Oil Concoction Rice with Chopped Meat & Boiled Egg",
    tagline: "Street-style traditional palm oil rice rich in dried fish and crayfish",
    description: "A comfort classic infused with authentic palm oil, dried bonga fish, crayfish, scent leaf, and diced beef chunks.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Rice", "Grade-A Palm Oil", "Dry Bonga Fish", "Smoked Crayfish", "Diced Beef", "Hard-Boiled Egg"],
    spiceLevel: "Medium",
    allergens: ["Fish", "Eggs", "Beef"],
    calories: 690,
    subPack: {
      name: "Wild Rice & Flaked Mackerel Scent-Leaf Bowl",
      description: "Low-carb wild rice blend with fresh flaked smoked mackerel.",
      category: "FitFam / Low Carb",
      ingredients: ["Wild Rice", "Smoked Mackerel", "Fresh Scent Leaf", "Virgin Palm Oil Drop"]
    },
    chefNote: "Slow-simmered so the palm oil deeply permeates every rice grain."
  },
  {
    name: "Fluffy White Rice & Red Oil Beans with Fried Fish",
    tagline: "Golden rice and honey beans paired with spiced pepper sauce and fresh fish",
    description: "Tender Ewa Oloyin (honey beans) and aromatic long-grain white rice paired with Nigerian buka stew and crispy Titus fish.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop",
    ingredients: ["White Rice", "Honey Beans (Ewa Oloyin)", "Fried Titus (Mackerel) Fish", "Buka Stew", "Fried Plantain"],
    spiceLevel: "Medium",
    allergens: ["Fish"],
    calories: 720,
    subPack: {
      name: "Steamed Beans & Grilled Fish Protein Bowl",
      description: "Portion-controlled protein bowl without fried carbs.",
      category: "FitFam / Low Carb",
      ingredients: ["Honey Beans", "Grilled Mackerel", "Steamed Vegetables", "Tomato-Herb Dip"]
    },
    chefNote: "Beans are slow-cooked to natural creaminess with zero artificial thickeners."
  }
];

// 2. Mon-Thu Non-Rice Dishes
export const NON_RICE_DISHES: Array<{
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
}> = [
  {
    name: "Spiced Stir-Fry Spaghetti with Grilled Chicken",
    tagline: "Street-seasoned wok pasta with carrots, bell peppers, sweet corn, and chicken",
    description: "Al dente spaghetti wok-tossed in Lagos suya spice, curry, sweet bell peppers, sweet corn, and paired with flame-grilled chicken.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Spaghetti Pasta", "Grilled Chicken Quarter", "Suya Spice Blend", "Carrots & Sweet Corn", "Red & Green Bell Peppers"],
    spiceLevel: "Medium",
    allergens: ["Gluten", "Poultry"],
    calories: 660,
    subPack: {
      name: "Zucchini Spiral Zoodles with Grilled Chicken",
      description: "Fresh spiralized zucchini tossed in herb tomato sauce.",
      category: "FitFam / Low Carb",
      ingredients: ["Zucchini Zoodles", "Grilled Chicken Breast", "Cherry Tomatoes", "Cold Pressed Olive Oil"]
    },
    chefNote: "Flash-fried over high heat to keep peppers crisp and savory."
  },
  {
    name: "Creamy Asaro (Yam Porridge) & Ugwu with Fried Croaker",
    tagline: "Tender slow-simmered yam cubes in rich palm oil, smoked fish and fresh greens",
    description: "Soft sweet Pona yams mashed into a thick, fragrant red oil broth with shredded dry fish and fresh Ugwu (pumpkin leaves). Served with whole peppered croaker.",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Pona White Yam", "Fresh Ugwu Leaves", "Grade-A Palm Oil", "Smoked Fish Flakes", "Fried Croaker Fish"],
    spiceLevel: "Medium",
    allergens: ["Fish"],
    calories: 640,
    subPack: {
      name: "Sweet Potato & Pumpkin Mash with Steamed Fish",
      description: "Low glycemic sweet potato mash with steamed croaker fillets.",
      category: "FitFam / Low Carb",
      ingredients: ["Sweet Potato", "Steamed Croaker", "Ugwu Greens", "Olive Oil Infusion"]
    },
    chefNote: "We mash half the yam for luxurious velvety texture while keeping whole bites intact."
  },
  {
    name: "Boiled Pona Yam & Rich Egg-Garden Egg Sauce with Grilled Fish",
    tagline: "Steamed sweet yams with fluffy peppered egg and garden egg scramble",
    description: "Hot boiled white yam slices served with a rich sauce made from fresh farm eggs, diced plum tomatoes, Scotch bonnet peppers, and seasoned grilled fish.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Pona Yam Slices", "Farm Fresh Eggs", "Garden Egg & Tomato Relish", "Scotch Bonnet Peppers", "Grilled Mackerel"],
    spiceLevel: "Medium",
    allergens: ["Eggs", "Fish"],
    calories: 590,
    subPack: {
      name: "Egg-White & Spinach Scramble with Grilled Salmon Fillet",
      description: "High-protein egg white scramble with leafy greens.",
      category: "FitFam / Low Carb",
      ingredients: ["Egg Whites", "Baby Spinach", "Grilled Salmon", "Avocado Slices"]
    },
    chefNote: "Yam is salted perfectly in boiling water for natural sweetness."
  },
  {
    name: "Grilled Plantain (Boli) & Spicy Pepper Sauce with Grilled Croaker",
    tagline: "Street-style chargrilled plantain with hot onion-pepper relish and fish",
    description: "Charred sweet and semi-ripe plantains paired with an unforgettable fried pepper and onion dipping sauce, served with seasoned grilled croaker fish.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Semi-Ripe Plantain", "Grilled Croaker Fish", "Palm Oil Pepper Relish", "Fried Onions", "Utazi Garnish"],
    spiceLevel: "Lagos Fire",
    allergens: ["Fish"],
    calories: 610,
    subPack: {
      name: "Charred Veggies & Grilled Croaker Plate",
      description: "Chargrilled seasonal squash and peppers with whole croaker.",
      category: "FitFam / Low Carb",
      ingredients: ["Grilled Zucchini", "Grilled Bell Peppers", "Whole Croaker", "Herb Vinaigrette"]
    },
    chefNote: "Plantains are roasted over charcoal grill grates for authentic street smokiness."
  },
  {
    name: "Steamed Moimoi Elemi Meje & Premium Chilled Garri Mix",
    tagline: "Leaf-wrapped steamed bean pudding with fish, boiled egg, and crushed ice garri",
    description: "Traditional banana-leaf steamed bean pudding stuffed with boiled egg slices, corned beef, and deboned fish, paired with Ijebu garri, groundnuts, and milk.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Black-Eyed Beans", "Boiled Egg Slices", "Smoked Fish", "Ijebu Garri", "Roasted Groundnuts"],
    spiceLevel: "Mild",
    allergens: ["Eggs", "Fish", "Peanuts"],
    calories: 580,
    subPack: {
      name: "Double Protein Leaf-Wrapped Moimoi Bowl",
      description: "Twin steamed bean puddings packed with extra egg whites and fish.",
      category: "FitFam / Low Carb",
      ingredients: ["Steamed Beans", "Egg Whites", "Flaked Fish", "Cucumber Salad"]
    },
    chefNote: "Uma leaf wrapping seals in authentic aroma and vital nutrients."
  }
];

// 3. Friday Swallow Rotation (10 Traditional Soups)
export const FRIDAY_SWALLOW_ROTATION: Array<{
  soupName: string;
  swallowOptions: string[];
  protein: string;
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
}> = [
  {
    soupName: "Rich Egusi Soup with Bitterleaf & Tender Goat Meat",
    swallowOptions: ["Soft Yellow Eba", "Pounded Yam", "Fine Semo"],
    protein: "Tender Stewed Goat Meat & Shaki",
    tagline: "Lumpy ground melon seed stew cooked in palm oil with dried fish and bitterleaf",
    description: "Thick hand-rolled Egusi balls fried in red palm oil, fortified with stockfish head, crayfish, shredded bitterleaf, and slow-cooked goat meat.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Melon Seeds (Egusi)", "Goat Meat Chunks", "Shaki (Tripe)", "Stockfish Head", "Washed Bitterleaf", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Fish", "Goat"],
    calories: 780,
    subPack: {
      name: "Oat Swallow & Spinach Egusi Bowl",
      description: "Low-carb oat meal swallow with light-oil Egusi and lean beef.",
      category: "FitFam / Low Carb",
      ingredients: ["Oat Swallow", "Light Egusi Soup", "Lean Beef Cut", "Steamed Spinach"]
    },
    chefNote: "Melon seeds are toasted and hand-lumped for rich texture."
  },
  {
    soupName: "Ogbono & Draw Okro Soup with Assorted Fish & Semo",
    tagline: "Silky wild mango seed soup paired with crunchy diced okro and smoked catfish",
    swallowOptions: ["Fine Semo", "Yellow Eba", "Pounded Yam"],
    protein: "Smoked Catfish, Beef & Kpomo",
    description: "Deeply savory wild mango seed broth cooked with ground crayfish and dried shrimp, combined with fresh diced okro. Slips down effortlessly.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Ogbono Seeds", "Fresh Okro", "Smoked Catfish", "Kpomo", "Crayfish", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Fish", "Shellfish"],
    calories: 750,
    subPack: {
      name: "Plantain Flour Swallow & Seafood Okro",
      description: "Low glycemic plantain swallow with prawn-loaded okro soup.",
      category: "FitFam / Low Carb",
      ingredients: ["Plantain Swallow", "Seafood Okro", "Tiger Prawns", "Ugwu Leaves"]
    },
    chefNote: "Zero water added during oil bloom for maximum stretch and silkiness."
  },
  {
    soupName: "Authentic Calabar Afang Soup with Assorted Beef & Yellow Eba",
    swallowOptions: ["Soft Yellow Eba", "Pounded Yam", "Wheat Meal"],
    protein: "Dry Fish, Assorted Beef, Shaki & Snails",
    tagline: "Shredded wild okazi leaves and waterleaf cooked with periwinkles and smoked fish",
    description: "The crown jewel of Efik cuisine—finely ground Afang leaves and tender waterleaf simmered in rich palm oil broth with dried fish and periwinkles.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Afang Leaves (Okazi)", "Waterleaf", "Smoked Periwinkles", "Assorted Beef", "Kpomo", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Molluscs", "Fish", "Beef"],
    calories: 760,
    subPack: {
      name: "Fibre Wheat & Steamed Afang Bowl",
      description: "Whole wheat swallow with nutrient-dense afang soup and snail.",
      category: "FitFam / Low Carb",
      ingredients: ["Wheat Swallow", "Afang Greens", "Steamed Giant Snail", "Dry Fish"]
    },
    chefNote: "Afang leaves are pounded in wooden mortars to release herbal aromatic oils."
  },
  {
    soupName: "Edikang Ikong Royalty Soup with Dry Fish & Pounded Yam",
    swallowOptions: ["Pounded Yam", "Yellow Eba", "Fine Semo"],
    protein: "Smoked Dry Fish, Beef Chunks & Cow Leg",
    tagline: "Water-free vegetable soup packed with Ugwu, waterleaf and rich proteins",
    description: "Classic vegetable powerhouse cooked strictly in the natural juices of meats, palm oil, crayfish, and shredded pumpkin leaves. Served with smooth pounded yam.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Ugwu Leaves", "Waterleaf", "Cow Leg Gelatin", "Smoked Dry Fish", "Ground Crayfish", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Fish", "Beef"],
    calories: 790,
    subPack: {
      name: "Edikang Ikong Green Bowl (No Swallow)",
      description: "Double portion of rich Edikang Ikong soup with grilled fish.",
      category: "FitFam / Low Carb",
      ingredients: ["Edikang Ikong Vegetables", "Grilled Croaker Cut", "Cow Leg Strips"]
    },
    chefNote: "No added water; all flavor comes from the meat broth and vegetable reduction."
  },
  {
    soupName: "Ofe Nsala (White Soup) with Fresh Catfish & Pounded Yam",
    swallowOptions: ["Smooth Pounded Yam", "Yellow Eba", "Fine Semo"],
    protein: "Fresh River Catfish & Utazi Leaves",
    tagline: "Palm-oil-free aromatic broth thickened with pounded yam and scented with uda",
    description: "Delicate Igbo royal soup made with aromatic spices (ehuru, uda, uziza) and fresh point-and-kill catfish. Light yet intensely satisfying.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Fresh Catfish", "Pounded Yam Thickener", "Utazi Garnish", "Ehuru & Uda Spice", "Crayfish", "Choice of Swallow"],
    spiceLevel: "Lagos Fire",
    allergens: ["Fish"],
    calories: 670,
    subPack: {
      name: "Clear Ofe Nsala Catfish Broth Bowl",
      description: "Low-carb spicy catfish soup without yam starch thickener.",
      category: "FitFam / Low Carb",
      ingredients: ["Catfish Steaks", "Clear Pepper Broth", "Uziza Leaves", "Utazi Garnish"]
    },
    chefNote: "Catfish is washed with alum and lime for clean, delicate flakes."
  },
  {
    soupName: "Gourmet Seafood Okro with Jumbo Prawns, Crab & Yellow Eba",
    swallowOptions: ["Soft Yellow Eba", "Pounded Yam", "Fine Semo"],
    protein: "Jumbo Tiger Prawns, Blue Crab & Croaker Fish",
    tagline: "Chunky sliced okro loaded with sweet coastal seafood and uziza leaves",
    description: "Crisp sliced okro simmered in seafood reduction with fresh jumbo prawns, crab claws, and fish fillets. Finished with fragrant uziza leaves.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Fresh Okro", "Jumbo Tiger Prawns", "Blue Crab", "Croaker Fish", "Uziza Leaves", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Crustaceans", "Fish", "Shellfish"],
    calories: 710,
    subPack: {
      name: "Keto Seafood Okro Bowl",
      description: "Seafood okro soup with extra tiger prawns and no starch swallow.",
      category: "FitFam / Low Carb",
      ingredients: ["Seafood Okro", "Tiger Prawns", "Crab Meat", "Steamed Ugwu"]
    },
    chefNote: "Okro is cooked for only 4 minutes to maintain supreme crunch."
  },
  {
    soupName: "Ofe Onugbu (Bitterleaf Soup) with Assorted Beef & Semo",
    swallowOptions: ["Fine Semo", "Pounded Yam", "Yellow Eba"],
    protein: "Assorted Beef, Shaki & Smoked Fish",
    tagline: "Coco-yam thickened traditional broth with sweet debittered washed leaves",
    description: "Hearty Anambra celebration soup thickened with mashed cocoyam (ede) and simmered with washed bitterleaf, stockfish, and tender beef.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Ede (Cocoyam)", "Washed Bitterleaf", "Stockfish", "Shaki & Beef", "Ogiri Igbo", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Fish", "Beef"],
    calories: 740,
    subPack: {
      name: "Oat Swallow with Lean Beef Bitterleaf",
      description: "Fibre rich oat swallow with lean beef and bitterleaf broth.",
      category: "FitFam / Low Carb",
      ingredients: ["Oat Swallow", "Bitterleaf Soup", "Lean Beef Cut", "Smoked Fish"]
    },
    chefNote: "Traditional Ogiri Igbo provides the authentic village depth."
  },
  {
    soupName: "Delta Banga Soup (Ofe Akwu) with Fresh Fish & Starch / Eba",
    swallowOptions: ["Soft Yellow Eba", "Delta Starch", "Pounded Yam"],
    protein: "Fresh Fish & Beef Cuts",
    tagline: "Freshly squeezed palm fruit extract spiced with oburunbebe stick and beletete",
    description: "Silky aromatic soup extracted from freshly boiled palm nuts, simmered with authentic Delta Banga spices and fresh fish steaks.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Palm Fruit Extract", "Banga Spice Blend", "Fresh Fish Steaks", "Oburunbebe Stick", "Beletete Leaves", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Fish"],
    calories: 790,
    subPack: {
      name: "Banga Fish Bowl with Steamed Vegetables",
      description: "Rich Banga broth over fresh fish and steamed greens.",
      category: "FitFam / Low Carb",
      ingredients: ["Banga Soup", "Fresh Fish Steak", "Steamed Spinach"]
    },
    chefNote: "Extract is boiled down until fragrant red palm oil beads on the surface."
  },
  {
    soupName: "Classic Abula: Gbegiri & Ewedu with Amala & Goat Meat",
    swallowOptions: ["Hot Soft Amala (Lafun/Isu)", "Yellow Eba", "Fine Semo"],
    protein: "Peppered Stewed Goat Meat & Shaki",
    tagline: "Silky brown beans soup and blended jute leaves topped with spicy buka obe ata",
    description: "The quintessential Lagos Friday favorite. Velvety peeled bean soup (Gbegiri) meets draw soup (Ewedu) and hot fiery buka stew, wrapped in fluffy black Amala.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Peeled Beans (Gbegiri)", "Ewedu Leaves", "Buka Pepper Stew", "Goat Meat Chunks", "Hot Amala Flour"],
    spiceLevel: "Lagos Fire",
    allergens: ["Goat"],
    calories: 730,
    subPack: {
      name: "Gbegiri & Ewedu Bowl with Grilled Chicken Breast",
      description: "Low-carb soup duo with grilled chicken without heavy starch.",
      category: "FitFam / Low Carb",
      ingredients: ["Gbegiri", "Ewedu", "Grilled Chicken Breast", "Light Buka Sauce"]
    },
    chefNote: "Ewedu is whipped with traditional short broom (ijabe) for ultimate draw."
  },
  {
    soupName: "Efo Riro Elemi Meje (7-Soul Vegetable Soup) & Pounded Yam",
    swallowOptions: ["Smooth Pounded Yam", "Yellow Eba", "Fine Semo"],
    protein: "Smoked Fish, Shaki, Beef, Ponmo & Prawns",
    tagline: "Richly fried spinach and tatashe relish loaded with 7 assorted proteins",
    description: "Yoruba party favorite vegetable stew prepared with coarse-blended red bell peppers, smoked prawns, shaki, cow skin, and fresh spinach.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Fresh Green Spinach (Shoko/Tete)", "Tatashe Pepper Relish", "Assorted Shaki & Beef", "Dried Prawns", "Iru (Locust Beans)", "Choice of Swallow"],
    spiceLevel: "Medium",
    allergens: ["Crustaceans", "Beef", "Fish"],
    calories: 740,
    subPack: {
      name: "Efo Riro FitFam Bowl (Extra Shaki & Fish)",
      description: "Rich nutrient-packed vegetable bowl without swallow.",
      category: "FitFam / Low Carb",
      ingredients: ["Efo Riro Greens", "Assorted Shaki", "Smoked Fish", "Grilled Chicken"]
    },
    chefNote: "Spinach is blanched in iced water to preserve its vibrant green color."
  }
];

/**
 * Generates the deterministic meal for any given date adhering strictly to:
 * 1. Mon-Thu Rotation: Strict alternation between Rice Dishes and Non-Rice Dishes (never rice 2 days in a row)
 * 2. Friday Swallow Tradition: Friday hard-coded to Swallow Rotation (10 traditional soups)
 */
export function getMealForDate(date: Date): MenuItem | null {
  const dayOfWeekNum = date.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  if (dayOfWeekNum === 0 || dayOfWeekNum === 6) {
    return null; // Weekend Kitchen Rest
  }

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('default', { month: 'long' });
  const dayOfWeek = date.toLocaleDateString('default', { weekday: 'long' });

  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNum = Math.floor((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  // Mon=1, Tue=2, Wed=3, Thu=4. Mon/Wed = Rice; Tue/Thu = Non-Rice
  const isRiceDay = dayOfWeekNum % 2 === 1;
  const rotationIndex = Math.floor(dayNumber / 2) + weekNum;

  let baseMeal: MenuItem;

  if (dayOfWeekNum === 5) {
    const swallow = FRIDAY_SWALLOW_ROTATION[weekNum % FRIDAY_SWALLOW_ROTATION.length];
    baseMeal = {
      id: `meal-${dateStr}`,
      dateStr,
      dayOfWeek,
      dayNumber,
      monthName,
      name: `${swallow.soupName} & ${swallow.swallowOptions[0]}`,
      tagline: swallow.tagline,
      description: swallow.description,
      image: swallow.image,
      ingredients: swallow.ingredients,
      spiceLevel: swallow.spiceLevel,
      allergens: swallow.allergens,
      calories: swallow.calories,
      subPack: swallow.subPack,
      chefNote: swallow.chefNote
    };
  } else if (isRiceDay) {
    const dish = RICE_DISHES[rotationIndex % RICE_DISHES.length];
    baseMeal = {
      id: `meal-${dateStr}`,
      dateStr,
      dayOfWeek,
      dayNumber,
      monthName,
      name: dish.name,
      tagline: dish.tagline,
      description: dish.description,
      image: dish.image,
      ingredients: dish.ingredients,
      spiceLevel: dish.spiceLevel,
      allergens: dish.allergens,
      calories: dish.calories,
      subPack: dish.subPack,
      chefNote: dish.chefNote
    };
  } else {
    const dish = NON_RICE_DISHES[rotationIndex % NON_RICE_DISHES.length];
    baseMeal = {
      id: `meal-${dateStr}`,
      dateStr,
      dayOfWeek,
      dayNumber,
      monthName,
      name: dish.name,
      tagline: dish.tagline,
      description: dish.description,
      image: dish.image,
      ingredients: dish.ingredients,
      spiceLevel: dish.spiceLevel,
      allergens: dish.allergens,
      calories: dish.calories,
      subPack: dish.subPack,
      chefNote: dish.chefNote
    };
  }

  try {
    const store = loadStore();
    const override = store.customMenuOverrides?.[dateStr];
    if (override) {
      return {
        ...baseMeal,
        ...override,
        subPack: {
          ...baseMeal.subPack,
          ...(override.subPack || {})
        }
      };
    }
  } catch (e) {
    // fallback if SSR or store unavailable
  }

  return baseMeal;
}
