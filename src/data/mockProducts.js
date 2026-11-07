// Real-world benchmark food items based on Open Food Facts & standard nutritional tables
import { fetchProductFromOpenFoodFacts, normalizeProduct, fetchCategoryAlternatives, evaluateGoalTradeoffs } from '../services/openFoodFactsService.js';
import { findInIndianCatalog, indianProductsCatalog } from './indianProductsCatalog.js';
import { lookupProduct } from '../services/productLookupService.js';

export const mockProducts = [
  {
    id: "prod-1",
    barcode: "8901234567890",
    name: "Wild Berry & Chia Ancient Grain Granola",
    brand: "Earth & Hearth Organics",
    category: "Breakfast & Cereals",
    quantity: "350g",
    servingSize: "45g",
    caloriesPerServing: 185,
    caloriesPer100g: 411,
    image: "https://images.unsplash.com/photo-1517093707530-9b634d16db2c?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 88,
    novaGroup: 2,
    novaLabel: "Processed Culinary Ingredients & Grains",
    nutriGrade: "A",
    summary: "Whole rolled oats, chia seeds, dried wild berries, and cold-pressed sunflower oil. Lightly sweetened with pure date paste.",
    nutritionPer100g: {
      calories: 411,
      energyKj: 1720,
      totalFat: 14.2,
      saturatedFat: 2.1,
      carbohydrates: 58.4,
      sugars: 8.5,
      fiber: 9.8,
      protein: 11.2,
      salt: 0.11,
      sodium: 45, // mg
    },
    nutritionPerServing: {
      calories: 185,
      energyKj: 774,
      proteins: 5.0,
      carbohydrates: 26.2,
      sugars: 3.8,
      fat: 6.4,
      saturatedFat: 0.9,
      fiber: 4.4,
      salt: 0.05,
      sodium: 20,
      hasServingData: true,
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
    quantity: "330ml",
    servingSize: "330ml",
    caloriesPerServing: 12,
    caloriesPer100g: 3.6,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 94,
    novaGroup: 1,
    novaLabel: "Unprocessed / Minimally Processed",
    nutriGrade: "A",
    summary: "Slow cold-brewed Egyptian hibiscus petals, crushed raspberries, and sparkling spring water with zero artificial sweeteners.",
    nutritionPer100g: {
      calories: 3.6,
      energyKj: 15,
      totalFat: 0,
      saturatedFat: 0,
      carbohydrates: 0.9,
      sugars: 0.7,
      fiber: 0.2,
      protein: 0.1,
      salt: 0.01,
      sodium: 5,
    },
    nutritionPerServing: {
      calories: 12,
      energyKj: 50,
      proteins: 0.3,
      carbohydrates: 3.0,
      sugars: 2.3,
      fat: 0,
      saturatedFat: 0,
      fiber: 0.6,
      salt: 0.03,
      sodium: 15,
      hasServingData: true,
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
    allergens: ["None declared"],
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
    quantity: "450g",
    servingSize: "150g",
    caloriesPerServing: 130,
    caloriesPer100g: 86.6,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 91,
    novaGroup: 1,
    novaLabel: "Minimally Processed Cultured Food",
    nutriGrade: "A",
    summary: "Traditional pot-set whole milk with 6 live and active cultures including L. acidophilus and Bifidobacteria.",
    nutritionPer100g: {
      calories: 86.6,
      energyKj: 362,
      totalFat: 4.8,
      saturatedFat: 3.1,
      carbohydrates: 3.8,
      sugars: 3.8, // naturally occurring lactose
      fiber: 0,
      protein: 7.2,
      salt: 0.12,
      sodium: 48,
    },
    nutritionPerServing: {
      calories: 130,
      energyKj: 543,
      proteins: 10.8,
      carbohydrates: 5.7,
      sugars: 5.7,
      fat: 7.2,
      saturatedFat: 4.65,
      fiber: 0,
      salt: 0.18,
      sodium: 72,
      hasServingData: true,
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
    quantity: "180g",
    servingSize: "30g",
    caloriesPerServing: 125,
    caloriesPer100g: 416,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 82,
    novaGroup: 3,
    novaLabel: "Processed Food",
    nutriGrade: "B",
    summary: "Whole spelt flour milled fresh, toasted white and black sesame seeds, extra virgin olive oil, and sea salt.",
    nutritionPer100g: {
      calories: 416,
      energyKj: 1740,
      totalFat: 13.5,
      saturatedFat: 2.2,
      carbohydrates: 59.0,
      sugars: 1.8,
      fiber: 8.2,
      protein: 12.0,
      salt: 0.95,
      sodium: 380,
    },
    nutritionPerServing: {
      calories: 125,
      energyKj: 522,
      proteins: 3.6,
      carbohydrates: 17.7,
      sugars: 0.54,
      fat: 4.05,
      saturatedFat: 0.66,
      fiber: 2.46,
      salt: 0.28,
      sodium: 114,
      hasServingData: true,
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
    quantity: "250g",
    servingSize: "32g",
    caloriesPerServing: 190,
    caloriesPer100g: 593,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 86,
    novaGroup: 2,
    novaLabel: "Processed Culinary Food",
    nutriGrade: "B",
    summary: "Dry-roasted Italian hazelnuts stone-ground with Peruvian raw criollo cacao and a touch of coconut nectar.",
    nutritionPer100g: {
      calories: 593,
      energyKj: 2480,
      totalFat: 47.0,
      saturatedFat: 5.5,
      carbohydrates: 28.0,
      sugars: 12.0,
      fiber: 9.5,
      protein: 13.5,
      salt: 0.03,
      sodium: 12,
    },
    nutritionPerServing: {
      calories: 190,
      energyKj: 794,
      proteins: 4.3,
      carbohydrates: 8.96,
      sugars: 3.84,
      fat: 15.0,
      saturatedFat: 1.76,
      fiber: 3.04,
      salt: 0.01,
      sodium: 3.8,
      hasServingData: true,
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
    quantity: "150g",
    servingSize: "28g",
    caloriesPerServing: 160,
    caloriesPer100g: 571,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    hasRealImage: true,
    consciousScore: 32,
    novaGroup: 4,
    novaLabel: "Ultra-Processed Food",
    nutriGrade: "D",
    summary: "Extruded corn meal with fractionated palm olein, MSG, artificial colorings (Yellow 6), and synthetic flavor enhancers.",
    nutritionPer100g: {
      calories: 571,
      energyKj: 2389,
      totalFat: 36.0,
      saturatedFat: 16.0,
      carbohydrates: 54.0,
      sugars: 4.2,
      fiber: 1.1,
      protein: 5.5,
      salt: 2.22,
      sodium: 890,
    },
    nutritionPerServing: {
      calories: 160,
      energyKj: 669,
      proteins: 1.54,
      carbohydrates: 15.1,
      sugars: 1.18,
      fat: 10.08,
      saturatedFat: 4.48,
      fiber: 0.31,
      salt: 0.62,
      sodium: 249,
      hasServingData: true,
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

// In-memory runtime cache for queried products
const dynamicProducts = new Map();

export const registerDynamicProduct = (product) => {
  if (product && product.barcode) {
    dynamicProducts.set(product.barcode, product);
    dynamicProducts.set(product.id, product);
    try {
      sessionStorage.setItem(`be_conscious_prod_${product.id}`, JSON.stringify(product));
      sessionStorage.setItem(`be_conscious_prod_${product.barcode}`, JSON.stringify(product));
    } catch {
      // ignore
    }
  }
};

export const getProductByBarcode = (barcode) => {
  const code = (barcode || '').trim();
  if (dynamicProducts.has(code)) {
    return dynamicProducts.get(code);
  }
  // Check Indian catalog
  const indian = findInIndianCatalog(code);
  if (indian) return indian;

  return mockProducts.find((p) => p.barcode === code) || null;
};

export const getProductById = (id) => {
  if (!id) return null;
  if (dynamicProducts.has(id)) {
    return dynamicProducts.get(id);
  }
  // Check Indian catalog by id or barcode
  const indian = indianProductsCatalog.find((p) => p.id === id || p.barcode === id);
  if (indian) return indian;

  const fromMock = mockProducts.find((p) => p.id === id);
  if (fromMock) return fromMock;

  try {
    const saved = sessionStorage.getItem(`be_conscious_prod_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      dynamicProducts.set(id, parsed);
      return parsed;
    }
  } catch {
    // ignore
  }

  return null;
};

// Unified async lookup: Multi-source pipeline with Indian FMCG catalog, Open Food Facts, Supabase, and GS1 fallback
export const fetchProductByBarcode = async (barcode) => {
  const code = (barcode || '').trim();
  if (!code) {
    return { found: false, error: 'INVALID_BARCODE', message: 'Barcode is empty.' };
  }

  // Delegate to modular multi-source lookup service
  const res = await lookupProduct(code);
  if (res.found && res.product) {
    registerDynamicProduct(res.product);
    return {
      found: true,
      product: res.product,
      source: res.source,
      verificationStatus: res.verificationStatus,
      status: res.status
    };
  }

  return {
    found: false,
    error: 'NOT_FOUND',
    status: res.status,
    barcode: code,
    format: res.format,
    gs1Info: res.gs1Info,
    message: res.message
  };
};

// Find verified alternatives in the same category from database
export const fetchAlternativesForProduct = async (product) => {
  return await fetchCategoryAlternatives(product, mockProducts);
};

export { evaluateGoalTradeoffs };
