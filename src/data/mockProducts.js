// Real-world benchmark food items based on Open Food Facts & standard nutritional tables
export const mockProducts = [
  {
    id: "prod-1",
    barcode: "8901234567890",
    name: "Wild Berry & Chia Ancient Grain Granola",
    brand: "Earth & Hearth Organics",
    category: "Breakfast & Cereals",
    servingSize: "45g",
    caloriesPerServing: 185,
    caloriesPer100g: 411,
    image: "https://images.unsplash.com/photo-1517093707530-9b634d16db2c?auto=format&fit=crop&w=600&q=80",
    consciousScore: 88,
    novaGroup: 2,
    novaLabel: "Processed Culinary Ingredients & Grains",
    nutriGrade: "A",
    summary: "Whole rolled oats, chia seeds, dried wild berries, and cold-pressed sunflower oil. Lightly sweetened with pure date paste.",
    nutritionPer100g: {
      calories: 411,
      totalFat: 14.2,
      saturatedFat: 2.1,
      carbohydrates: 58.4,
      sugars: 8.5,
      fiber: 9.8,
      protein: 11.2,
      sodium: 45, // mg
    },
    nutritionDailyPercent: {
      fat: "18%",
      saturatedFat: "10%",
      carbs: "21%",
      sugars: "9%",
      fiber: "35%",
      protein: "22%",
      sodium: "2%",
    },
    ingredients: [
      { name: "Whole Rolled Oats", type: "whole-grain", isOrganic: true },
      { name: "Chia Seeds", type: "superfood", isOrganic: true },
      { name: "Dried Wild Blueberries", type: "fruit", isOrganic: true },
      { name: "Date Paste", type: "natural-sweetener", isOrganic: true },
      { name: "Cold-Pressed Sunflower Oil", type: "healthy-fat", isOrganic: true },
      { name: "Himalayan Pink Salt", type: "mineral", isOrganic: false },
    ],
    allergens: ["May contain traces of Tree Nuts and Sesame"],
    additives: [],
    processingDetails: {
      novaRating: 2,
      ultraProcessed: false,
      preservativesCount: 0,
      artificialSweeteners: false,
      hydrogenatedOils: false,
      processingSummary: "Gently baked at low temperature to preserve seed micronutrients.",
    },
    tags: ["High Fiber", "No Added Refined Sugar", "Non-GMO", "Plant-Based", "Organic"]
  },
  {
    id: "prod-2",
    barcode: "8909876543210",
    name: "Sparkling Hibiscus & Berry Botanical Infusion",
    brand: "Aura Botanical Labs",
    category: "Beverages",
    servingSize: "330ml",
    caloriesPerServing: 12,
    caloriesPer100g: 3.6,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
    consciousScore: 94,
    novaGroup: 1,
    novaLabel: "Unprocessed / Minimally Processed",
    nutriGrade: "A",
    summary: "Slow cold-brewed Egyptian hibiscus petals, crushed raspberries, and sparkling spring water with zero artificial sweeteners.",
    nutritionPer100g: {
      calories: 3.6,
      totalFat: 0,
      saturatedFat: 0,
      carbohydrates: 0.9,
      sugars: 0.7,
      fiber: 0.2,
      protein: 0.1,
      sodium: 5,
    },
    nutritionDailyPercent: {
      fat: "0%",
      saturatedFat: "0%",
      carbs: "< 1%",
      sugars: "< 1%",
      fiber: "1%",
      protein: "< 1%",
      sodium: "< 1%",
    },
    ingredients: [
      { name: "Carbonated Spring Water", type: "water", isOrganic: true },
      { name: "Cold-Brewed Hibiscus Flower Extract", type: "botanical", isOrganic: true },
      { name: "Real Raspberry Juice Concentrate", type: "fruit", isOrganic: true },
      { name: "Organic Lemon Juice", type: "citrus", isOrganic: true },
    ],
    allergens: ["None"],
    additives: [],
    processingDetails: {
      novaRating: 1,
      ultraProcessed: false,
      preservativesCount: 0,
      artificialSweeteners: false,
      hydrogenatedOils: false,
      processingSummary: "Cold infusion extraction with natural carbonation.",
    },
    tags: ["Zero Added Sugar", "Caffeine Free", "Antioxidant Rich", "Vegan", "Gluten Free"]
  },
  {
    id: "prod-3",
    barcode: "8905544332211",
    name: "Probiotic Greek-Style Sheep & Cow Milk Yogurt",
    brand: "Pure Meadow Artisans",
    category: "Dairy & Cultured",
    servingSize: "150g",
    caloriesPerServing: 130,
    caloriesPer100g: 86.6,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    consciousScore: 91,
    novaGroup: 1,
    novaLabel: "Minimally Processed Cultured Food",
    nutriGrade: "A",
    summary: "Traditional pot-set whole milk with 6 live and active cultures including L. acidophilus and Bifidobacteria.",
    nutritionPer100g: {
      calories: 86.6,
      totalFat: 4.8,
      saturatedFat: 3.1,
      carbohydrates: 3.8,
      sugars: 3.8, // naturally occurring lactose
      fiber: 0,
      protein: 7.2,
      sodium: 48,
    },
    nutritionDailyPercent: {
      fat: "9%",
      saturatedFat: "15%",
      carbs: "2%",
      sugars: "4%",
      fiber: "0%",
      protein: "20%",
      sodium: "2%",
    },
    ingredients: [
      { name: "Pasteurized Whole Cow Milk", type: "dairy", isOrganic: true },
      { name: "Pasteurized Sheep Milk", type: "dairy", isOrganic: true },
      { name: "Live Active Probiotic Cultures", type: "probiotic", isOrganic: false },
    ],
    allergens: ["Contains Milk"],
    additives: [],
    processingDetails: {
      novaRating: 1,
      ultraProcessed: false,
      preservativesCount: 0,
      artificialSweeteners: false,
      hydrogenatedOils: false,
      processingSummary: "Fermented using heritage starter cultures. No thickeners or starch added.",
    },
    tags: ["High Protein", "Gut Health", "No Gums", "No Added Sugar", "Pasture Raised"]
  },
  {
    id: "prod-4",
    barcode: "8907766554433",
    name: "Stoneground Sesame & Sea Salt Spelt Crackers",
    brand: "Heritage Mills",
    category: "Snacks & Savory",
    servingSize: "30g",
    caloriesPerServing: 125,
    caloriesPer100g: 416,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    consciousScore: 82,
    novaGroup: 3,
    novaLabel: "Processed Food",
    nutriGrade: "B",
    summary: "Whole spelt flour milled fresh, toasted white and black sesame seeds, extra virgin olive oil, and sea salt.",
    nutritionPer100g: {
      calories: 416,
      totalFat: 13.5,
      saturatedFat: 2.2,
      carbohydrates: 59.0,
      sugars: 1.8,
      fiber: 8.2,
      protein: 12.0,
      sodium: 380,
    },
    nutritionDailyPercent: {
      fat: "17%",
      saturatedFat: "11%",
      carbs: "21%",
      sugars: "2%",
      fiber: "29%",
      protein: "24%",
      sodium: "16%",
    },
    ingredients: [
      { name: "Whole Grain Spelt Flour", type: "grain", isOrganic: true },
      { name: "Toasted Sesame Seeds", type: "seed", isOrganic: true },
      { name: "Extra Virgin Olive Oil", type: "healthy-fat", isOrganic: true },
      { name: "Coarse Sea Salt", type: "mineral", isOrganic: false },
      { name: "Rosemary Extract", type: "natural-antioxidant", isOrganic: true },
    ],
    allergens: ["Contains Gluten (Spelt)", "Contains Sesame"],
    additives: [],
    processingDetails: {
      novaRating: 3,
      ultraProcessed: false,
      preservativesCount: 0,
      artificialSweeteners: false,
      hydrogenatedOils: false,
      processingSummary: "Baked slowly with cold-pressed olive oil. No palm oil or chemical leaveners.",
    },
    tags: ["Ancient Grain", "Zero Palm Oil", "Good Source of Iron", "Vegan"]
  },
  {
    id: "prod-5",
    barcode: "8901122334455",
    name: "Raw Cacao & Hazelnut Conscious Butter",
    brand: "Nourish Botanics",
    category: "Spreads & Dips",
    servingSize: "32g",
    caloriesPerServing: 190,
    caloriesPer100g: 593,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    consciousScore: 86,
    novaGroup: 2,
    novaLabel: "Processed Culinary Food",
    nutriGrade: "B",
    summary: "Dry-roasted Italian hazelnuts stone-ground with Peruvian raw criollo cacao and a touch of coconut nectar.",
    nutritionPer100g: {
      calories: 593,
      totalFat: 47.0,
      saturatedFat: 5.5,
      carbohydrates: 28.0,
      sugars: 12.0,
      fiber: 9.5,
      protein: 13.5,
      sodium: 12,
    },
    nutritionDailyPercent: {
      fat: "32%",
      saturatedFat: "14%",
      carbs: "9%",
      sugars: "13%",
      fiber: "34%",
      protein: "22%",
      sodium: "< 1%",
    },
    ingredients: [
      { name: "Dry Roasted Hazelnuts (75%)", type: "nut", isOrganic: true },
      { name: "Raw Criollo Cacao Powder (15%)", type: "cacao", isOrganic: true },
      { name: "Evaporated Coconut Nectar", type: "natural-sweetener", isOrganic: true },
      { name: "Real Vanilla Bean", type: "spice", isOrganic: true },
    ],
    allergens: ["Contains Tree Nuts (Hazelnuts)"],
    additives: [],
    processingDetails: {
      novaRating: 2,
      ultraProcessed: false,
      preservativesCount: 0,
      artificialSweeteners: false,
      hydrogenatedOils: false,
      processingSummary: "Stone-ground for 24 hours below 42°C to preserve natural antioxidants.",
    },
    tags: ["Dairy Free", "Palm Oil Free", "No Emulsifiers", "Direct Trade Cacao"]
  },
  {
    id: "prod-6",
    barcode: "8903344556677",
    name: "Commercial Ultra-Processed Cheesy Puffs (Comparison Item)",
    brand: "MegaSnack Global",
    category: "Snacks & Savory",
    servingSize: "28g",
    caloriesPerServing: 160,
    caloriesPer100g: 571,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    consciousScore: 32,
    novaGroup: 4,
    novaLabel: "Ultra-Processed Food",
    nutriGrade: "D",
    summary: "Extruded corn meal with fractionated palm olein, MSG, artificial colorings (Yellow 6), and synthetic flavor enhancers.",
    nutritionPer100g: {
      calories: 571,
      totalFat: 36.0,
      saturatedFat: 16.0,
      carbohydrates: 54.0,
      sugars: 4.2,
      fiber: 1.1,
      protein: 5.5,
      sodium: 890,
    },
    nutritionDailyPercent: {
      fat: "46%",
      saturatedFat: "80%",
      carbs: "19%",
      sugars: "4%",
      fiber: "4%",
      protein: "11%",
      sodium: "39%",
    },
    ingredients: [
      { name: "Degerminated Corn Meal", type: "refined-grain", isOrganic: false },
      { name: "Hydrogenated Palm Olein", type: "unhealthy-fat", isOrganic: false },
      { name: "Maltodextrin", type: "additive", isOrganic: false },
      { name: "Monosodium Glutamate (E621)", type: "flavor-enhancer", isOrganic: false },
      { name: "Artificial Color Sunset Yellow (E110)", type: "artificial-color", isOrganic: false },
      { name: "Disodium Inosinate & Guanylate", type: "flavor-enhancer", isOrganic: false },
    ],
    allergens: ["Contains Milk", "Contains Soy"],
    additives: ["E621 (MSG)", "E110 (Sunset Yellow)", "E627", "E631"],
    processingDetails: {
      novaRating: 4,
      ultraProcessed: true,
      preservativesCount: 4,
      artificialSweeteners: false,
      hydrogenatedOils: true,
      processingSummary: "High-heat extrusion with industrial hydrogenated oils and synthetic flavor compounds.",
    },
    tags: ["Ultra Processed (NOVA 4)", "High Saturated Fat", "High Sodium", "Contains E-Numbers"]
  }
];

// Dynamic in-memory / session cache for newly scanned or fetched products
const dynamicProducts = new Map();

export const getProductByBarcode = (barcode) => {
  const code = barcode.trim();
  if (dynamicProducts.has(code)) {
    return dynamicProducts.get(code);
  }
  return mockProducts.find((p) => p.barcode === code) || null;
};

export const getProductById = (id) => {
  // Check dynamic products first
  for (const prod of dynamicProducts.values()) {
    if (prod.id === id) return prod;
  }
  return mockProducts.find((p) => p.id === id) || null;
};

export const registerDynamicProduct = (product) => {
  if (product && product.barcode) {
    dynamicProducts.set(product.barcode, product);
    // Also save in sessionStorage for session persistence across page reloads
    try {
      sessionStorage.setItem(`prod_${product.id}`, JSON.stringify(product));
    } catch (e) {
      // ignore
    }
  }
};

// Async lookup that checks local benchmark items first, then real Open Food Facts API
export const fetchProductByBarcode = async (barcode) => {
  const code = barcode.trim();
  
  // 1. Check local catalog
  const local = getProductByBarcode(code);
  if (local) return local;

  // Check sessionStorage
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('prod_')) {
        const item = JSON.parse(sessionStorage.getItem(key));
        if (item && item.barcode === code) {
          registerDynamicProduct(item);
          return item;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Fetch from Open Food Facts API (real-world barcode resolution)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();

    if (data.status === 1 && data.product) {
      const p = data.product;
      const nutriments = p.nutriments || {};
      
      const calories100g = Math.round(nutriments['energy-kcal_100g'] || (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 0));
      const servingSize = p.serving_size || '100g';
      const servingMultiplier = parseFloat(servingSize) ? (parseFloat(servingSize) / 100) : 1;
      const caloriesServing = Math.round(calories100g * servingMultiplier) || calories100g;

      const nova = p.nova_group || 3;
      const novaLabels = {
        1: "Unprocessed or Minimally Processed",
        2: "Processed Culinary Ingredients",
        3: "Processed Foods",
        4: "Ultra-Processed Food Formulation"
      };

      // Conscious score formula based on NOVA, sugars, fiber, and additives
      let score = 75;
      if (nova === 1) score += 18;
      else if (nova === 2) score += 10;
      else if (nova === 4) score -= 25;

      const sugars = parseFloat(nutriments.sugars_100g || 0);
      if (sugars > 15) score -= 12;
      else if (sugars < 5) score += 5;

      const additivesCount = Array.isArray(p.additives_tags) ? p.additives_tags.length : 0;
      score -= additivesCount * 3;
      score = Math.max(15, Math.min(98, Math.round(score)));

      // Parse ingredients text
      const ingredientsList = (p.ingredients_text || '')
        .split(/[,;]/)
        .map(i => i.trim())
        .filter(i => i.length > 1 && i.length < 50)
        .slice(0, 10)
        .map(name => ({
          name,
          type: "ingredient",
          isOrganic: name.toLowerCase().includes('organic') || name.toLowerCase().includes('bio')
        }));

      const allergens = (p.allergens_tags || [])
        .map(a => a.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))
        .filter(Boolean);

      const parsedProduct = {
        id: `off-${code}`,
        barcode: code,
        name: p.product_name || p.product_name_en || `Food Item (${code})`,
        brand: p.brands || 'Packaged Grocery',
        category: p.categories?.split(',')[0]?.trim() || 'Packaged Food',
        servingSize: servingSize,
        caloriesPerServing: caloriesServing,
        caloriesPer100g: calories100g,
        image: p.image_front_url || p.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        consciousScore: score,
        novaGroup: nova,
        novaLabel: novaLabels[nova] || "Processed Food",
        nutriGrade: (p.nutriscore_grade || 'c').toUpperCase(),
        summary: p.generic_name || `${p.product_name || 'Item'} with verified nutritional label from Open Food Facts database.`,
        nutritionPer100g: {
          calories: calories100g,
          totalFat: parseFloat(nutriments.fat_100g || 0),
          saturatedFat: parseFloat(nutriments['saturated-fat_100g'] || 0),
          carbohydrates: parseFloat(nutriments.carbohydrates_100g || 0),
          sugars: sugars,
          fiber: parseFloat(nutriments.fiber_100g || 0),
          protein: parseFloat(nutriments.proteins_100g || 0),
          sodium: Math.round(parseFloat(nutriments.sodium_100g || 0) * 1000),
        },
        nutritionDailyPercent: {
          fat: `${Math.round((nutriments.fat_100g || 0) / 70 * 100)}%`,
          saturatedFat: `${Math.round((nutriments['saturated-fat_100g'] || 0) / 20 * 100)}%`,
          carbs: `${Math.round((nutriments.carbohydrates_100g || 0) / 260 * 100)}%`,
          sugars: `${Math.round((nutriments.sugars_100g || 0) / 50 * 100)}%`,
          fiber: `${Math.round((nutriments.fiber_100g || 0) / 28 * 100)}%`,
          protein: `${Math.round((nutriments.proteins_100g || 0) / 50 * 100)}%`,
          sodium: `${Math.round((nutriments.sodium_100g || 0) / 2.3 * 100)}%`,
        },
        ingredients: ingredientsList.length > 0 ? ingredientsList : [
          { name: "Declared package ingredients", type: "mixed", isOrganic: false }
        ],
        allergens: allergens.length > 0 ? allergens.map(a => `Contains ${a}`) : ["No common allergens declared"],
        additives: (p.additives_tags || []).map(a => a.replace(/^[a-z]{2}:/, '').toUpperCase()),
        processingDetails: {
          novaRating: nova,
          ultraProcessed: nova === 4,
          preservativesCount: additivesCount,
          artificialSweeteners: false,
          hydrogenatedOils: false,
          processingSummary: `NOVA Group ${nova}: ${novaLabels[nova]}. Evaluated according to international food processing standards.`,
        },
        tags: [
          `NOVA ${nova}`,
          nova === 4 ? "Ultra-Processed" : "Conscious Choice",
          sugars < 5 ? "Low Sugar" : "Contains Sugars",
          "Open Food Facts Verified"
        ]
      };

      registerDynamicProduct(parsedProduct);
      return parsedProduct;
    }
  } catch (err) {
    console.warn("Could not query Open Food Facts API:", err);
  }

  return null;
};


