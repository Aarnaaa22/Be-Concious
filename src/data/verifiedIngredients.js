/**
 * Verified Plain-English Ingredient Database
 * Provides objective, evidence-based descriptions of common food ingredients,
 * natural botanicals, and certified food additives.
 * 
 * Rules:
 * - Neutral, informative tone.
 * - Everyday English without confusing chemistry jargon.
 * - No unsupported claims of harm.
 */

export const VERIFIED_INGREDIENTS = {
  // Whole grains & seeds
  'oats': {
    name: 'Whole Rolled Oats',
    category: 'Whole Grain',
    simpleDesc: 'Gently steamed and rolled oat grains rich in beta-glucan, a soluble fibre that helps maintain healthy cholesterol and promotes fullness.'
  },
  'whole rolled oats': {
    name: 'Whole Rolled Oats',
    category: 'Whole Grain',
    simpleDesc: 'Gently steamed and rolled oat groats packed with slow-digesting carbohydrates and soluble dietary fibre.'
  },
  'chia seeds': {
    name: 'Chia Seeds',
    category: 'Seeds & Superfoods',
    simpleDesc: 'Tiny black seeds from the Salvia hispanica plant, rich in plant-based omega-3 fatty acids (ALA), calcium, and gel-forming soluble fibre.'
  },
  'spelt flour': {
    name: 'Spelt Flour',
    category: 'Ancient Grain',
    simpleDesc: 'An ancient subspecies of wheat with a mild nutty flavor, milled from whole grain berries containing complex carbohydrates and minerals.'
  },
  'whole grain spelt flour': {
    name: 'Whole Grain Spelt Flour',
    category: 'Ancient Grain',
    simpleDesc: 'An ancient whole grain closely related to common wheat, offering protein, iron, and fibre.'
  },
  'wheat flour': {
    name: 'Wheat Flour',
    category: 'Cereal Grain',
    simpleDesc: 'Finely ground wheat grain used as the primary structural foundation in baking, containing natural gluten proteins and starches.'
  },
  'sesame seeds': {
    name: 'Sesame Seeds',
    category: 'Oilseed',
    simpleDesc: 'Nutty seeds high in heart-healthy unsaturated fats, lignans, iron, and calcium.'
  },
  'rice noodles': {
    name: 'Rice Noodles',
    category: 'Grain Product',
    simpleDesc: 'Noodles made primarily from milled rice flour and water, naturally gluten-free and easy to digest.'
  },

  // Fruits, Sweeteners & Flavorings
  'sugar': {
    name: 'Sugar (Sucrose)',
    category: 'Sweetener',
    simpleDesc: 'Common granulated table sugar derived from sugarcane or sugar beets, providing quick carbohydrates for flavor balance.'
  },
  'date paste': {
    name: 'Date Paste',
    category: 'Natural Fruit Sweetener',
    simpleDesc: 'Pureed whole dried dates providing natural sweetness alongside the fruit\'s inherent dietary fibre and potassium.'
  },
  'dried wild blueberries': {
    name: 'Wild Blueberries',
    category: 'Whole Fruit',
    simpleDesc: 'Small berries gently dried to concentrate their natural sweetness and rich anthocyanin antioxidants.'
  },
  'blueberries': {
    name: 'Blueberries',
    category: 'Whole Fruit',
    simpleDesc: 'Fresh or dried berries packed with natural vitamin C and polyphenol antioxidants.'
  },
  'hazelnuts': {
    name: 'Hazelnuts',
    category: 'Tree Nut',
    simpleDesc: 'Whole roasted nuts offering a rich aromatic flavor, monounsaturated fats (oleic acid), vitamin E, and magnesium.'
  },
  'cocoa': {
    name: 'Cocoa (Cacao)',
    category: 'Plant Extract',
    simpleDesc: 'Ground solids from fermented cacao beans, providing dark chocolate flavor and natural theobromine and flavanols.'
  },
  'raw criollo cacao powder': {
    name: 'Criollo Cacao Powder',
    category: 'Plant Extract',
    simpleDesc: 'Premium unroasted cacao powder prepared at low temperatures to preserve natural polyphenols and minerals.'
  },
  'hibiscus': {
    name: 'Hibiscus Flower Extract',
    category: 'Botanical Herb',
    simpleDesc: 'Dried calyces of the tropical hibiscus flower, steeped for a tart cranberry-like flavor and natural deep ruby color.'
  },
  'vanilla': {
    name: 'Vanilla Bean Extract',
    category: 'Natural Spice',
    simpleDesc: 'Fragrant aromatic extract derived from cured vanilla orchid seed pods.'
  },

  // Fats & Oils
  'palm oil': {
    name: 'Palm Oil',
    category: 'Plant Fat',
    simpleDesc: 'A semi-solid edible vegetable oil extracted from the pulp of oil palms, used in foods for smooth spreadability and shelf stability.'
  },
  'sunflower oil': {
    name: 'Sunflower Oil',
    category: 'Plant Oil',
    simpleDesc: 'A light cooking oil pressed from sunflower seeds, predominantly composed of unsaturated fats and vitamin E.'
  },
  'olive oil': {
    name: 'Extra Virgin Olive Oil',
    category: 'Healthy Fat',
    simpleDesc: 'Cold-pressed oil from freshly harvested olives, high in monounsaturated oleic acid and natural polyphenols.'
  },

  // Dairy & Cultured
  'milk': {
    name: 'Cow Milk',
    category: 'Dairy',
    simpleDesc: 'Wholesome dairy milk providing complete protein (casein and whey), bioavailable calcium, and vitamin D.'
  },
  'skimmed milk': {
    name: 'Skimmed Milk Powder',
    category: 'Dairy',
    simpleDesc: 'Pasteurized cow\'s milk with the cream removed and spray-dried into powder for smooth texture in chocolate and baking.'
  },
  'probiotic cultures': {
    name: 'Live Active Probiotic Cultures',
    category: 'Beneficial Bacteria',
    simpleDesc: 'Friendly live bacterial strains (like Lactobacillus and Bifidobacterium) that ferment milk sugars and support a balanced gut microbiome.'
  },

  // Common Additives & Leaveners
  'lecithins': {
    name: 'Lecithins (E322)',
    category: 'Emulsifier',
    simpleDesc: 'A natural fatty substance extracted from soybeans or sunflowers that prevents oils and cocoa from separating.'
  },
  'soy lecithin': {
    name: 'Soy Lecithin (E322)',
    category: 'Emulsifier',
    simpleDesc: 'A plant-derived substance from soybeans that helps blend oil and water components for a silky smooth consistency.'
  },
  'citric acid': {
    name: 'Citric Acid (E330)',
    category: 'Acidity Regulator',
    simpleDesc: 'A natural fruit acid used to impart a pleasant tart tang and maintain product freshness.'
  },
  'phosphoric acid': {
    name: 'Phosphoric Acid (E338)',
    category: 'Acidifier',
    simpleDesc: 'A mineral acid used in beverages to produce a distinct crisp bite and protect against bacterial growth.'
  },
  'caramel': {
    name: 'Sulfite Ammonia Caramel (E150d)',
    category: 'Colouring',
    simpleDesc: 'A food colorant prepared by controlled heat treatment of carbohydrates, giving colas their dark brown color.'
  },
  'xanthan gum': {
    name: 'Xanthan Gum (E415)',
    category: 'Thickener & Stabilizer',
    simpleDesc: 'A soluble plant fiber produced by natural fermentation that helps dressings and sauces maintain an even, creamy body.'
  },
  'guar gum': {
    name: 'Guar Gum (E412)',
    category: 'Natural Thickener',
    simpleDesc: 'A natural dietary fiber milled from cluster beans, used in dairy and baked goods to prevent ice crystallization and stabilize texture.'
  },
  'pectin': {
    name: 'Pectin (E440)',
    category: 'Fruit Gelling Agent',
    simpleDesc: 'A natural structural fiber extracted from apple or citrus peels that helps jams and fruit fillings set.'
  },
  'sodium bicarbonate': {
    name: 'Baking Soda (E500)',
    category: 'Leavening Agent',
    simpleDesc: 'A gentle mineral salt that releases tiny carbon dioxide bubbles when heated, giving baked goods a light, airy rise.'
  },
  'monosodium glutamate': {
    name: 'Monosodium Glutamate (MSG / E621)',
    category: 'Flavor Enhancer',
    simpleDesc: 'The sodium salt of glutamic acid (an amino acid found naturally in tomatoes and cheese) that intensifies savory umami flavor.'
  },
  'salt': {
    name: 'Salt (Sodium Chloride)',
    category: 'Mineral Seasoning',
    simpleDesc: 'Purified mineral crystals essential for taste enhancement, texture development, and natural preservation.'
  }
};

/**
 * Searches the verified dictionary for a matching plain-English explanation.
 * If not found, returns null so the UI can honestly state that no verified explanation exists.
 */
export function getVerifiedExplanation(rawIngredientName) {
  if (!rawIngredientName) return null;
  const clean = rawIngredientName.trim().toLowerCase();

  // 1. Direct match
  if (VERIFIED_INGREDIENTS[clean]) {
    return VERIFIED_INGREDIENTS[clean];
  }

  // 2. Substring matching against known keys
  for (const [key, val] of Object.entries(VERIFIED_INGREDIENTS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return val;
    }
  }

  return null;
}

