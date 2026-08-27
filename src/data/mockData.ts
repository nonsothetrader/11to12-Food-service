import { MenuItem, PricingAddon, Testimonial, FAQItem } from '../types';

import heroImg from '../assets/images/lagos_lunch_hero_1787694820866.jpg';
import spreadImg from '../assets/images/nigerian_dish_spread_1787694834762.jpg';

// Helper to generate dynamic days for any year and month (supports future month navigation)
export const getMonthData = (targetYear?: number, targetMonth?: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();
  const currentHour = now.getHours();

  const year = targetYear !== undefined ? targetYear : currentYear;
  const month = targetMonth !== undefined ? targetMonth : currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Calculate first day of the week (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // Monday-based offset (0 = Monday, ..., 6 = Sunday)
  const mondayBasedOffset = (firstDayOfWeek + 6) % 7;

  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  const isCurrentMonth = year === currentYear && month === currentMonth;
  const isPastMonth = year < currentYear || (year === currentYear && month < currentMonth);

  return {
    year,
    month,
    daysInMonth,
    mondayBasedOffset,
    monthName,
    todayDate,
    currentHour,
    isCurrentMonth,
    isPastMonth,
    currentYear,
    currentMonth
  };
};

export const getActiveMonthData = () => {
  return getMonthData();
};

export const MENU_DISHES_TEMPLATE = [
  // 1. Jollof Rice with Grilled Chicken
  {
    name: "Jollof Rice with Grilled Chicken",
    tagline: "Firewood-infused Lagos classic with golden dodo.",
    description: "Smoky party-style jollof rice simmered in slow-reduced tatashe, rodo, and catfish stock. Paired with a juicy seasoned grilled quarter chicken and sweet fried plantains (dodo).",
    ingredients: ["Long-grain Parboiled Rice", "Firewood Tatashe Puree", "Grilled Quarter Chicken", "Sweet Ripe Plantains", "Smoked Catfish Stock", "Nutmeg & Thyme"],
    spiceLevel: "Medium" as const,
    allergens: ["None", "Fish (in stock)"],
    calories: 670,
    chefNote: "Cooked in morning batches over genuine charcoal smoke for that distinct party aroma.",
    subPack: {
      name: "Grilled Chicken & Steamed Vegetable Salad",
      description: "Charred chicken breast with steamed broccoli, carrots, and sweetcorn salad.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Chicken Breast", "Broccoli", "Carrots", "Sweetcorn", "Olive Oil Dressing"]
    },
    image: heroImg
  },

  // 2. Boiled Yam and Egg Sauce with Grilled Fish
  {
    name: "Boiled Yam and Egg Sauce with Grilled Fish",
    tagline: "Soft sweet puna yam with rich farm egg sauce and fish.",
    description: "Tender, steaming white puna yam slices served with a rich, peppery egg and onion sauce, accompanied by a seasoned charcoal-grilled fish portion.",
    ingredients: ["White Puna Yam", "Fresh Farm Eggs", "Tomatoes & Habanero", "Grilled Fish Fillet", "Spring Onions", "Vegetable Oil"],
    spiceLevel: "Medium" as const,
    allergens: ["Eggs", "Fish"],
    calories: 590,
    chefNote: "Comforting corporate staple that keeps energy steady throughout the afternoon.",
    subPack: {
      name: "Boiled Plantain & Egg White Veggie Sauce",
      description: "Unripe boiled plantain fingers with egg white, spinach, and tomato sauce.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Unripe Plantain", "Egg Whites", "Spinach", "Bell Peppers"]
    },
    image: spreadImg
  },

  // 3. Stir-Fry Spag and Grilled Chicken
  {
    name: "Stir-Fry Spag and Grilled Chicken",
    tagline: "Wok-tossed spicy spaghetti with vibrant veggies and juicy chicken.",
    description: "Spaghetti tossed in a scorching pan with shredded bell peppers, carrots, sweetcorn, and aromatic Lagos spices, served with a crispy spiced grilled chicken thigh.",
    ingredients: ["Italian Spaghetti", "Grilled Chicken", "Red & Green Bell Peppers", "Sweetcorn & Green Peas", "Chili Pepper Reduction", "Herbs"],
    spiceLevel: "Medium" as const,
    allergens: ["Wheat / Gluten"],
    calories: 630,
    chefNote: "Quick, energetic midday fuel packed with savory crunch and spice.",
    subPack: {
      name: "Zucchini Noodle Stir-Fry with Grilled Chicken",
      description: "Fresh spiralized zucchini noodles tossed in spicy ginger-garlic sauce with chicken.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Zucchini Noodles", "Grilled Chicken", "Sesame Oil", "Bell Peppers"]
    },
    image: heroImg
  },

  // 4. Moimoi and 3 in 1 Garri Mix
  {
    name: "Moimoi and 3 in 1 Garri Mix",
    tagline: "Steamed bean pudding paired with chilled garri, groundnuts & milk.",
    description: "Fluffy, rich steamed bean pudding (moimoi) loaded with flaked fish and boiled egg, paired with crisp Ijebu garri, crunchy roasted groundnuts, and chilled evaporated milk mix.",
    ingredients: ["Black-eyed Beans", "Hard Boiled Egg", "Smoked Fish", "Ijebu Garri", "Roasted Groundnuts", "Evaporated Milk", "Pure Cane Sugar"],
    spiceLevel: "Mild" as const,
    allergens: ["Eggs", "Fish", "Peanuts", "Dairy"],
    calories: 580,
    chefNote: "The ultimate classic Lagos lifesaver on warm sunny afternoons.",
    subPack: {
      name: "Double Moimoi Bowl with Steamed Greens",
      description: "Two wrapped steamed bean cakes with sauteed ugu greens and flaked fish.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Black-eyed Beans", "Ugu Leaves", "Smoked Mackerel", "Egg"]
    },
    image: spreadImg
  },

  // 5. Shawarma and Soda (Pepsi)
  {
    name: "Shawarma and Soda (Pepsi)",
    tagline: "Double-sausage beef/chicken wrap with chilled Pepsi.",
    description: "Warm flatbread loaded with spiced shredded beef and chicken, double sausage, crunchy cabbage, and creamy garlic-mayo chili dressing, served with a chilled Pepsi.",
    ingredients: ["Flatbread Pita", "Shredded Beef & Chicken", "Beef Sausages", "Cabbage & Carrots", "Special Cream Dressing", "Chilled Pepsi 50cl"],
    spiceLevel: "Medium" as const,
    allergens: ["Wheat / Gluten", "Dairy", "Eggs"],
    calories: 720,
    chefNote: "Friday reward lunch for surviving another grueling week of deadlines.",
    subPack: {
      name: "Naked Shawarma Salad Bowl",
      description: "Spiced shredded chicken and sausages over a bed of seasoned crunchy greens and olive dressing.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Shredded Chicken", "Sausages", "Cabbage", "Cucumber", "Light Mayo"]
    },
    image: heroImg
  },

  // 6. Red Oil Rice and Beans with Chopped Fried Meat
  {
    name: "Red Oil Rice and Beans with Chopped Fried Meat",
    tagline: "Native village-style unpolished rice, beans, iru and fried beef bites.",
    description: "Simmered native rice and brown honey beans in bleached palm oil, smoked crayfish, and locust beans (iru), topped with generous crispy chopped fried beef cuts.",
    ingredients: ["Parboiled Rice", "Honey Brown Beans", "Palm Oil", "Locust Beans (Iru)", "Smoked Crayfish", "Chopped Fried Beef", "Fried Plantain"],
    spiceLevel: "Medium" as const,
    allergens: ["Crustaceans / Crayfish"],
    calories: 690,
    chefNote: "Deeply savory native aroma that reminds you of home cooking.",
    subPack: {
      name: "Clean Honey Beans with Grilled Chicken",
      description: "Low-oil stewed beans with steamed vegetables and tender grilled chicken.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Honey Beans", "Grilled Chicken", "Steamed Spinach", "Tomato Sauce"]
    },
    image: spreadImg
  },

  // 7. Fried Yam and Fish Sauce
  {
    name: "Fried Yam and Fish Sauce",
    tagline: "Crisp golden yam fingers with savory flaked fish and pepper dip.",
    description: "Freshly cut white yam fries with crisp exterior and fluffy center, served with a robust, aromatic tomato-pepper sauce loaded with tender flaked fish.",
    ingredients: ["Puna White Yam", "Fresh Titus / Mackerel Fish", "Tomatoes & Scotch Bonnet", "Onions & Scent Leaves", "Vegetable Oil"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish"],
    calories: 610,
    chefNote: "Fried fresh in morning rounds to retain satisfying crispness.",
    subPack: {
      name: "Grilled Sweet Potato with Steamed Fish Sauce",
      description: "Oven-baked sweet potato wedges with low-oil mackerel fish relish.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Sweet Potato", "Mackerel Fish", "Tomatoes", "Scent Leaf"]
    },
    image: heroImg
  },

  // 8. Stir-Fry Spag and 2 Boiled Egg
  {
    name: "Stir-Fry Spag and 2 Boiled Egg",
    tagline: "Spiced wok noodles tossed with bell peppers and 2 farm eggs.",
    description: "Savory spaghetti wok-fried in rich chili oil with diced carrots, green bell peppers, and sweetcorn, served with two freshly boiled farm eggs.",
    ingredients: ["Italian Spaghetti", "Two Hard-Boiled Eggs", "Mixed Bell Peppers", "Carrots & Sweetcorn", "Lagos Seasoning Spices"],
    spiceLevel: "Mild" as const,
    allergens: ["Wheat / Gluten", "Eggs"],
    calories: 560,
    chefNote: "Light, protein-balanced and comfortable on the stomach.",
    subPack: {
      name: "Egg White Veggie Spag Bowl",
      description: "Whole wheat spaghetti tossed with steamed greens and boiled egg whites.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Whole Wheat Spag", "Egg Whites", "Broccoli", "Bell Peppers"]
    },
    image: spreadImg
  },

  // 9. Porridge Yam and Vegetables (Asaro)
  {
    name: "Porridge Yam and Vegetables",
    tagline: "Rich, creamy mashed yam pottage simmered with ugu and smoked fish.",
    description: "Traditional soft puna yam pottage cooked down in rich palm oil, crayfish broth, and smoked catfish, finished with fresh vibrant fluted pumpkin (ugu) leaves.",
    ingredients: ["Puna White Yam", "Palm Oil", "Smoked Catfish", "Ground Crayfish", "Fresh Ugu Leaves", "Habanero Pepper"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish", "Crustaceans / Crayfish"],
    calories: 590,
    chefNote: "Melt-in-your-mouth texture that calms mid-week office fatigue.",
    subPack: {
      name: "Vegetable Pottage with Steamed Tofu",
      description: "Low-oil yam porridge with generous garden vegetables and grilled tofu cubes.",
      category: "Vegetarian" as const,
      ingredients: ["Yam", "Spinach", "Tofu", "Bell Peppers", "Olive Oil"]
    },
    image: heroImg
  },

  // 10. Fried Rice with Grilled Chicken
  {
    name: "Fried Rice with Grilled Chicken",
    tagline: "Classic liver-infused Nigerian fried rice with golden chicken.",
    description: "Long-grain rice stir-fried in rich meat stock with curry, thyme, diced beef liver, sweetcorn, carrots, green beans, and paired with juicy spiced grilled chicken.",
    ingredients: ["Parboiled Rice", "Diced Liver Bites", "Carrots & Green Beans", "Sweetcorn", "Grilled Chicken", "Curry & Thyme Broth"],
    spiceLevel: "Mild" as const,
    allergens: ["None"],
    calories: 660,
    chefNote: "Balanced, colorful corporate favorite with rich herbal flavor.",
    subPack: {
      name: "Cauliflower Fried Rice with Grilled Chicken",
      description: "Grated cauliflower sauteed with veggies, curry herbs, and grilled chicken breast.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Cauliflower", "Chicken Breast", "Green Beans", "Carrots", "Turmeric"]
    },
    image: spreadImg
  },

  // 11. Pepper Soup with Yam
  {
    name: "Pepper Soup with Yam",
    tagline: "Aromatic herbal goat meat / catfish broth with soft yam chunks.",
    description: "Steaming hot traditional pepper soup brewed with authentic uda, uziza, scent leaves, and tender protein, poured over soft boiled yam cubes.",
    ingredients: ["White Yam Chunks", "Tender Braised Meat", "Uziza & Scent Leaves", "Uda & Ehu Spices", "Fresh Scotch Bonnet", "Native Broth"],
    spiceLevel: "Lagos Fire" as const,
    allergens: ["None"],
    calories: 490,
    chefNote: "Opens the nasal passages and revitalizes mind and body immediately.",
    subPack: {
      name: "Clear Fish Pepper Soup with Steamed Veggies",
      description: "Light catfish pepper soup with generous fresh scent leaves and steamed carrots.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Catfish", "Scent Leaves", "Uziza", "Carrots", "Clear Broth"]
    },
    image: heroImg
  },

  // 12. White Rice & Stew and Boiled Kote Fish
  {
    name: "White Rice & Stew and Boiled Kote Fish",
    tagline: "Fluffy steamed rice with Lagos buka tomato stew and seasoned kote fish.",
    description: "Piping hot parboiled white rice drenched in slow-fried buka tomato-tatashe stew, served with a succulent portion of well-seasoned boiled kote (horse mackerel) fish.",
    ingredients: ["White Parboiled Rice", "Fried Tatashe Stew", "Boiled Seasoned Kote Fish", "Fried Plantains", "Onions & Garlic"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish"],
    calories: 620,
    chefNote: "Wholesome, home-style taste cooked exactly like Sunday afternoon stew.",
    subPack: {
      name: "Steamed Brown Rice with Fish Stew",
      description: "Brown rice with low-oil tomato fish reduction and steamed green beans.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Kote Fish", "Tomato Puree", "Green Beans"]
    },
    image: spreadImg
  },

  // 13. Stir-Fry Spag and Fried Chopped Meat
  {
    name: "Stir-Fry Spag and Fried Chopped Meat",
    tagline: "Sizzling spaghetti wok-tossed with spicy chopped beef bites.",
    description: "Al dente spaghetti tossed in a fiery skillet with bell peppers, onions, carrots, and generous tender fried beef chunks seasoned with aromatic herbs.",
    ingredients: ["Spaghetti", "Chopped Fried Beef", "Green & Red Peppers", "Onions & Carrots", "Chili Pepper Glaze"],
    spiceLevel: "Medium" as const,
    allergens: ["Wheat / Gluten"],
    calories: 640,
    chefNote: "Hearty and satisfying meal designed for busy non-stop workdays.",
    subPack: {
      name: "Sauteed Cabbage & Veggie Beef Bowl",
      description: "Shredded cabbage stir-fry with chopped lean beef and bell peppers.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Cabbage", "Lean Beef", "Bell Peppers", "Garlic Oil"]
    },
    image: heroImg
  },

  // 14. Boiled Yam and Vegetable Sauce
  {
    name: "Boiled Yam and Vegetable Sauce",
    tagline: "Tender white yam with rich, leafy Ugu and spinach sauce.",
    description: "Soft steaming white yam served with a deeply seasoned vegetable sauce prepared with fresh ugu, waterleaf, smoked fish flakes, and iru.",
    ingredients: ["Puna Yam", "Fresh Ugu & Spinach", "Smoked Fish Flakes", "Palm Oil", "Locust Beans (Iru)", "Scotch Bonnet"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish"],
    calories: 520,
    chefNote: "Loaded with iron, potassium, and wholesome fiber for clean afternoon energy.",
    subPack: {
      name: "Steamed Plantain with Ugu Vegetable Sauce",
      description: "Boiled unripe plantain fingers with rich low-oil ugu vegetable reduction.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Unripe Plantain", "Ugu Leaves", "Smoked Fish", "Iru"]
    },
    image: spreadImg
  },

  // 15. Small Chops and Juice with Chicken
  {
    name: "Small Chops and Juice with Chicken",
    tagline: "Puff-puff, samosa, spring rolls, spicy peppered chicken and cold juice.",
    description: "Crispy beef samosa, crunchy spring roll, sweet golden puff-puff, spicy mosaic gizzard/chicken bites, accompanied by a fresh chilled fruit juice pack.",
    ingredients: ["Golden Puff-Puff", "Beef Samosa", "Vegetable Spring Roll", "Peppered Chicken Wing", "Chilled Fruit Juice 350ml"],
    spiceLevel: "Medium" as const,
    allergens: ["Wheat / Gluten"],
    calories: 680,
    chefNote: "The ultimate Nigerian party box delivered straight to your workstation.",
    subPack: {
      name: "Grilled Chicken & Fruit Medley Bowl",
      description: "Skewered peppered chicken breast served with watermelon and pineapple cubes.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Chicken Breast", "Watermelon", "Pineapple", "Cucumber"]
    },
    image: heroImg
  },

  // 16. Red Oil Concoction Rice and Chopped Meat with 1 Boiled Egg
  {
    name: "Red Oil Concoction Rice and Chopped Meat with 1 Boiled Egg",
    tagline: "Smoky native jollof rice simmered with dried fish, iru, meat & egg.",
    description: "Traditional local concoction rice cooked in bleached palm oil, smoked panla, locust beans (iru), and dried prawns, topped with chopped fried beef and a whole boiled egg.",
    ingredients: ["Local Parboiled Rice", "Palm Oil & Iru", "Smoked Panla Fish", "Dried Prawns", "Chopped Beef Cuts", "Hard-Boiled Egg"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish", "Crustaceans / Prawns", "Eggs"],
    calories: 670,
    chefNote: "Pure childhood nostalgia packed with deeply savory native seasonings.",
    subPack: {
      name: "Steamed Brown Concoction Rice & Egg",
      description: "Brown rice cooked in light crayfish broth with boiled egg and scent leaves.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Boiled Egg", "Scent Leaf", "Crayfish"]
    },
    image: spreadImg
  },

  // 17. Fried Yam with Pepper Ketchup and Grilled Chicken
  {
    name: "Fried Yam with Pepper Ketchup and Grilled Chicken",
    tagline: "Crisp yam wedges with sweet & spicy tomato pepper ketchup dip.",
    description: "Golden-crusted white yam batons paired with our house-made spicy tomato-chili ketchup reduction and seasoned charred grilled chicken quarter.",
    ingredients: ["Puna White Yam", "Grilled Chicken", "House Pepper Ketchup", "Scotch Bonnet & Tatashe", "Herbs"],
    spiceLevel: "Medium" as const,
    allergens: ["None"],
    calories: 660,
    chefNote: "Crisp, flavorful, and satisfyingly spicy down to the last bite.",
    subPack: {
      name: "Baked Yam Fries with Grilled Chicken",
      description: "Oven-baked low-oil yam wedges with roasted pepper dip and chicken breast.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Yam Wedges", "Chicken Breast", "Roasted Peppers", "Olive Oil"]
    },
    image: heroImg
  },

  // 18. White Rice and Chicken Sauce
  {
    name: "White Rice and Chicken Sauce",
    tagline: "Steamed fluffy rice smothered in thick Chinese-Nigerian chicken sauce.",
    description: "Steamed parboiled rice served with a rich, savory chicken and vegetable gravy loaded with sweet corn, shredded carrots, green peas, and tender chicken strips.",
    ingredients: ["Steamed White Rice", "Shredded Chicken Breast", "Carrots & Green Peas", "Sweetcorn", "Thick Chicken Broth Gravy", "Sesame Hint"],
    spiceLevel: "Mild" as const,
    allergens: ["Soy"],
    calories: 610,
    chefNote: "Silky, fragrant, and gentle on the stomach for productive afternoons.",
    subPack: {
      name: "Chicken Vegetable Stir-Fry with Brown Rice",
      description: "Steamed brown rice with thick low-oil chicken and vegetable stir-fry.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Chicken Breast", "Broccoli", "Carrots", "Soy Glaze"]
    },
    image: spreadImg
  },

  // 19. Grilled Plantain (Boli) and Sauce with Grilled Fish
  {
    name: "Grilled Plantain and Sauce and Grilled Fish",
    tagline: "Charcoal-roasted sweet Boli with fiery pepper sauce & Titus fish.",
    description: "Sweet ripe plantain charcoal-grilled to caramelized perfection, served with spicy peppered onion relish and a generous whole grilled seasoned Titus (mackerel) fish.",
    ingredients: ["Ripe Sweet Plantain (Boli)", "Whole Grilled Titus Fish", "Fried Pepper & Onion Sauce", "Palm Oil Relish", "Scent Leaf"],
    spiceLevel: "Lagos Fire" as const,
    allergens: ["Fish"],
    calories: 640,
    chefNote: "Lagos street food royalty elevated into a hygienic desk-ready delicacy.",
    subPack: {
      name: "Semi-Ripe Boli with Steamed Fish Salad",
      description: "Grilled semi-ripe plantain with grilled tilapia fillet and garden greens.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Semi-Ripe Plantain", "Tilapia Fillet", "Garden Salad", "Chili Relish"]
    },
    image: heroImg
  },

  // 20. Jollof Rice with Chopped Fried Meat
  {
    name: "Jollof Rice with Chopped Fried Meat",
    tagline: "Smoky firewood Jollof topped with crispy spicy beef chunks.",
    description: "Our signature red tatashe firewood jollof rice paired with seasoned, tender, and crispy chopped fried beef cubes and sweet fried dodo.",
    ingredients: ["Parboiled Long-grain Rice", "Tatashe Puree", "Chopped Fried Beef", "Fried Plantain", "Catfish Broth", "Spices"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish (in stock)"],
    calories: 660,
    chefNote: "Classic staple that never fails to boost desk productivity.",
    subPack: {
      name: "Basmati Jollof with Lean Beef Cuts",
      description: "Low-oil basmati jollof with grilled lean beef and cucumber slices.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Basmati Rice", "Lean Beef", "Cucumber", "Tomato Reduction"]
    },
    image: spreadImg
  },

  // 21. Pepper Soup and White Rice
  {
    name: "Pepper Soup and White Rice",
    tagline: "Fluffy steamed rice served with rich, spicy herbal catfish pepper soup.",
    description: "Steaming parboiled rice paired with a hot bowl of traditional Nigerian catfish/goat meat pepper soup infused with fragrant uziza leaves and native aromatics.",
    ingredients: ["Steamed White Rice", "Fresh Catfish / Goat Meat", "Uziza & Scent Leaves", "Uda Spice Broth", "Habanero Chili"],
    spiceLevel: "Lagos Fire" as const,
    allergens: ["Fish"],
    calories: 550,
    chefNote: "Clears your thoughts and keeps you wide awake for afternoon reviews.",
    subPack: {
      name: "Brown Rice with Fish Pepper Soup",
      description: "Steamed brown rice with light aromatic fish pepper soup broth.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Fresh Fish", "Uziza Leaf", "Pepper Soup Broth"]
    },
    image: heroImg
  },

  // 22. Red Oil Rice and Beans with Fried Fish
  {
    name: "Red Oil Rice and Beans with Fried Fish",
    tagline: "Native unpolished rice & brown beans with crisp seasoned fried fish.",
    description: "Village-style cooked rice and tender brown beans in palm oil, iru, and dried crayfish, paired with a golden, seasoned fried croaker fish portion.",
    ingredients: ["Parboiled Rice", "Brown Honey Beans", "Palm Oil", "Locust Beans", "Crisp Fried Croaker Fish", "Fried Dodo"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish", "Crustaceans / Crayfish"],
    calories: 670,
    chefNote: "Rich in plant protein and authentic native coastal flavors.",
    subPack: {
      name: "Clean Stewed Beans & Grilled Fish",
      description: "Low-oil honey beans with seasoned grilled fish fillet and steamed greens.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Honey Beans", "Grilled Fish", "Steamed Spinach", "Tomato Sauce"]
    },
    image: spreadImg
  },

  // 23. White Rice and Vegetable Sauce
  {
    name: "White Rice and Vegetable Sauce",
    tagline: "Steamed white rice paired with rich, thick Efo Riro vegetable sauce.",
    description: "Fluffy white rice topped with a thick, rich green spinach and ugu vegetable sauce cooked with smoked fish, shredded kpomo, and locust beans.",
    ingredients: ["Parboiled White Rice", "Fresh Spinach & Ugu", "Smoked Fish", "Shredded Kpomo", "Iru (Locust Beans)", "Palm Oil & Tatashe"],
    spiceLevel: "Medium" as const,
    allergens: ["Fish"],
    calories: 580,
    chefNote: "Loaded with fresh greens and savory stock for balanced nutrition.",
    subPack: {
      name: "Brown Rice with Steamed Veggie Sauce",
      description: "Brown rice with low-oil vegetable reduction and grilled chicken strips.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Ugu Leaves", "Chicken Breast", "Bell Peppers"]
    },
    image: heroImg
  },

  // 24. Red Oil Rice and Beans with Grilled Chicken
  {
    name: "Red Oil Rice and Beans with Grilled Chicken",
    tagline: "Native rice, beans and locust beans paired with a charred grilled chicken.",
    description: "Authentic native rice and brown beans simmered in palm oil and crayfish, accompanied by a juicy pepper-glazed grilled chicken quarter.",
    ingredients: ["Parboiled Rice", "Honey Beans", "Palm Oil & Iru", "Grilled Chicken Quarter", "Smoked Crayfish", "Fried Plantain"],
    spiceLevel: "Medium" as const,
    allergens: ["Crustaceans / Crayfish"],
    calories: 680,
    chefNote: "Rich, deeply filling combination that sustains you through late evenings.",
    subPack: {
      name: "Honey Beans & Herb Grilled Chicken",
      description: "Steamed brown honey beans with rosemary grilled chicken breast.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Honey Beans", "Chicken Breast", "Rosemary", "Steamed Carrots"]
    },
    image: spreadImg
  },

  // 25. Fried Rice with Chopped Fried Meat
  {
    name: "Fried Rice with Chopped Fried Meat",
    tagline: "Vibrant liver-seasoned fried rice with crisp fried beef cubes.",
    description: "Long-grain rice stir-fried with diced carrots, sweetcorn, green peas, and liver seasoning, topped with crispy chopped fried meat bites.",
    ingredients: ["Parboiled Rice", "Chopped Fried Beef", "Diced Liver Broth", "Carrots & Sweetcorn", "Green Beans & Spices"],
    spiceLevel: "Mild" as const,
    allergens: ["None"],
    calories: 650,
    chefNote: "Savory and colorful corporate plate that brightens your desk.",
    subPack: {
      name: "Veggie Fried Rice with Boiled Egg",
      description: "Stir-fried rice with extra vegetables and two hard-boiled eggs.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Rice", "Boiled Eggs", "Carrots", "Peas", "Curry Herbs"]
    },
    image: heroImg
  },

  // 26. White Rice & Stew and Grilled Chicken
  {
    name: "White Rice & Stew and Grilled Chicken",
    tagline: "Steamed fluffy white rice with rich buka stew and grilled chicken quarter.",
    description: "Fluffy steamed rice served with rich, slow-simmered Lagos buka tomato stew, accompanied by a seasoned flame-grilled chicken quarter and dodo.",
    ingredients: ["White Rice", "Rich Buka Stew", "Grilled Chicken Quarter", "Fried Plantains", "Tomatoes & Tatashe"],
    spiceLevel: "Medium" as const,
    allergens: ["None"],
    calories: 660,
    chefNote: "Simple, nostalgic, and flawlessly executed corporate lunch classic.",
    subPack: {
      name: "Brown Rice with Stewed Chicken Breast",
      description: "Steamed brown basmati rice with low-oil tomato stew and chicken breast.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Basmati", "Chicken Breast", "Tomato Sauce", "Steamed Broccoli"]
    },
    image: spreadImg
  },

  // 27. White Rice and Beans with Stew
  {
    name: "White Rice and Beans with Stew",
    tagline: "Classic duo of steamed rice and soft honey beans with fried stew.",
    description: "The timeless combination of fluffy white parboiled rice and tender brown beans, drenched in rich tomato stew with fried plantain and boiled egg.",
    ingredients: ["White Rice", "Honey Brown Beans", "Fried Tatashe Stew", "Boiled Egg", "Fried Plantains"],
    spiceLevel: "Medium" as const,
    allergens: ["Eggs"],
    calories: 610,
    chefNote: "Wholesome, high-protein comfort food loved across all Lagos offices.",
    subPack: {
      name: "Brown Rice & Beans with Vegetable Sauce",
      description: "Steamed brown rice and beans with rich spinach vegetable relish.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Brown Rice", "Beans", "Spinach", "Bell Peppers"]
    },
    image: heroImg
  },

  // 28. White Rice & Stew and Chopped Fried Meat
  {
    name: "White Rice & Stew and Chopped Fried Meat",
    tagline: "Steamed rice drenched in spicy buka stew with crispy fried beef chunks.",
    description: "Steamed parboiled rice layered with hot, peppery tomato-tatashe stew and loaded with bite-sized crispy fried beef cuts and sweet fried plantain.",
    ingredients: ["Parboiled White Rice", "Fried Buka Stew", "Chopped Fried Beef", "Fried Plantains", "Onions & Tatashe"],
    spiceLevel: "Medium" as const,
    allergens: ["None"],
    calories: 670,
    chefNote: "Tasty, quick-eating favorite that powers you through the afternoon.",
    subPack: {
      name: "Steamed Rice & Veggie Beef Relish",
      description: "White rice with low-oil tomato and beef relish with garden greens.",
      category: "FitFam / Low Carb" as const,
      ingredients: ["Rice", "Lean Beef", "Spinach", "Tomatoes"]
    },
    image: spreadImg
  }
];

export const PRICING_ADDONS: PricingAddon[] = [
  {
    id: "zobo",
    name: "Chilled Ginger Zobo Infusion",
    description: "Cold-pressed hibiscus flower with spicy ginger, cloves, and fresh pineapple juice. 0% added sugar.",
    pricePerDay: 800,
    iconName: "GlassWater"
  },
  {
    id: "dodo-extra",
    name: "Double Portion Sweet Dodo",
    description: "Because one handful of fried plantain is an insult to your emotional well-being.",
    pricePerDay: 700,
    iconName: "Flame"
  },
  {
    id: "parfait",
    name: "Greek Yoghurt & Honey Granola Parfait",
    description: "Creamy unsweetened Greek yoghurt layered with toasted oats, chia seeds, and Lagos honey.",
    pricePerDay: 1200,
    iconName: "Sparkles"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "I used to survive on Gala and spite. Now I survive on Gala, spite, and this Jollof Rice. It's an improvement.",
    author: "Sarah J.",
    role: "Professional Email Sender",
    companyLocation: "Big 4 Consulting • Victoria Island",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    favoriteDish: "Jollof Rice with Grilled Chicken",
    rating: 5
  },
  {
    id: "2",
    quote: "My VLOOKUPs are sharper and my soul is less crushed since I started ordering. Coincidence? Probably not.",
    author: "Michael B.",
    role: "Spreadsheet Wizard & Senior Analyst",
    companyLocation: "Fintech HQ • Lekki Phase 1",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    favoriteDish: "Boiled Yam and Egg Sauce with Grilled Fish",
    rating: 5
  },
  {
    id: "3",
    quote: "Finally, a lunch that doesn't make me question all my life choices. Just most of them. Which is a win.",
    author: "Emily R.",
    role: "Manager of Things & Blockers",
    companyLocation: "Commercial Bank Tower • Marina",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    favoriteDish: "Stir-Fry Spag and Grilled Chicken",
    rating: 5
  },
  {
    id: "4",
    quote: "Our HR thought our employee retention was down because of salary. It was actually the cold cafeteria food. 11to12 saved our Q3.",
    author: "Tunde A.",
    role: "Head of Culture & Unnecessary Meetings",
    companyLocation: "Advertising Agency • Ikeja GRA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    favoriteDish: "Moimoi and 3 in 1 Garri Mix",
    rating: 5
  },
  {
    id: "5",
    quote: "The delivery rider arrived at 11:14 AM while my boss was lecturing us about Q4 projections. The aroma of peppered chicken completely derailed his slide deck. 10/10.",
    author: "Chioma E.",
    role: "Senior Deck Producer & Crisis Navigator",
    companyLocation: "Law Chambers • Ikoyi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    favoriteDish: "Shawarma and Soda (Pepsi)",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    category: "Delivery",
    question: "Where in Lagos do you actually deliver?",
    answer: "We currently deliver to desks across Victoria Island (VI), Ikoyi, Marina/Broad Street, Lekki Phase 1, and Ikeja CBD/GRA. If your office building has an elevator or security guard that asks 'Who are you seeing?', our riders get your lunch right to your floor."
  },
  {
    category: "Delivery",
    question: "Why the strict 11:00 AM – 12:00 PM delivery window?",
    answer: "Because by 1:00 PM in Lagos, you're already hungry and dispatch riders start giving excuses about rain in Ajah. Delivering before 12:00 PM guarantees your food is placed on your desk warm, steamy, and ready before your 1:00 PM meetings commence."
  },
  {
    category: "Subscription",
    question: "Can I skip days if I'm working from home or traveling?",
    answer: "Yes! You have 100% control. You can pause or skip any scheduled day directly in your portal up until 9:00 PM the previous evening. Any skipped meal turns into an automatic credit toward your next subscription cycle."
  },
  {
    category: "Food & Diet",
    question: "What if I don't like spicy food or I'm on a FitFam diet?",
    answer: "Every single workday comes with our signature hot dish PLUS our curated 'Sub Pack' alternative (such as low-carb brown basmati, grilled herb chicken bowls, or vegan pottage). You can swap to the Sub Pack with one tap."
  },
  {
    category: "Payment",
    question: "How does billing and company group orders work?",
    answer: "You can pay with debit cards, Paystack, instant bank transfers, or our 11to12 Lunch Wallet. We also provide corporate team billing with consolidated monthly VAT invoices."
  },
  {
    category: "Subscription",
    question: "Is there a minimum commitment of 5 workdays?",
    answer: "Yes. Setting up a dedicated dispatch route through Lagos requires logistics harmony. 5 days ensures you lock in our direct kitchen bulk pricing with complimentary desk drop."
  }
];
