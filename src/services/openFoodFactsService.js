/**
 * Open Food Facts API v3 Client Service
 * Official API Documentation: https://openfoodfacts.github.io/documentation/
 * Endpoint: https://world.openfoodfacts.org/api/v3/product/{barcode}.json
 */

const USER_AGENT = 'BeConsciousApp/1.0 (https://github.com/Aarnaaa22/Be-Concious)';
const CACHE_PREFIX = 'be_conscious_off_cache_';
const memoryCache = new Map();

/**
 * Normalizes Open Food Facts API v3 product payload into Be Conscious schema.
 * Strictly preserves units and does NOT invent or fake missing values.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;
  const p = raw.product || raw;
  const nutriments = p.nutriments || {};

  // Barcode & Basic Identifiers
  const barcode = p.code || raw.code || '';
  const productName = p.product_name || p.product_name_en || null;
  const brand = p.brands || p.brand_owner || null;
  const quantity = p.quantity || null;

  // Serving Size Data
  const servingSize = p.serving_size || null;
  const servingQuantity = p.serving_quantity ? Number(p.serving_quantity) : null;
  const servingUnit = p.serving_quantity_unit || 'g';

  // Category
  const category = p.categories ? p.categories.split(',')[0].trim() : null;

  // Images (prefer high-res front, fallback to thumb/image_url)
  const image =
    p.selected_images?.front?.display?.en ||
    p.selected_images?.front?.display?.fr ||
    p.image_front_url ||
    p.image_url ||
    null;

  // Energy & Calories (preserve kcal and kJ accurately)
  const calories100g = nutriments['energy-kcal_100g'] !== undefined ? Number(nutriments['energy-kcal_100g']) : null;
  const caloriesServing = nutriments['energy-kcal_serving'] !== undefined ? Number(nutriments['energy-kcal_serving']) : null;
  const energyKj100g = nutriments['energy_100g'] !== undefined ? Number(nutriments['energy_100g']) : null;
  const energyKjServing = nutriments['energy_serving'] !== undefined ? Number(nutriments['energy_serving']) : null;

  // Nutrients per 100g / 100ml
  const proteins100g = nutriments['proteins_100g'] !== undefined ? Number(nutriments['proteins_100g']) : null;
  const carbs100g = nutriments['carbohydrates_100g'] !== undefined ? Number(nutriments['carbohydrates_100g']) : null;
  const sugars100g = nutriments['sugars_100g'] !== undefined ? Number(nutriments['sugars_100g']) : null;
  const fat100g = nutriments['fat_100g'] !== undefined ? Number(nutriments['fat_100g']) : null;
  const saturatedFat100g = nutriments['saturated-fat_100g'] !== undefined ? Number(nutriments['saturated-fat_100g']) : null;
  const fiber100g = nutriments['fiber_100g'] !== undefined ? Number(nutriments['fiber_100g']) : null;
  const salt100g = nutriments['salt_100g'] !== undefined ? Number(nutriments['salt_100g']) : null;
  const sodium100g = nutriments['sodium_100g'] !== undefined ? Number(nutriments['sodium_100g']) : null;

  // Nutrients per serving (only if explicitly reported in database)
  const proteinsServing = nutriments['proteins_serving'] !== undefined ? Number(nutriments['proteins_serving']) : null;
  const carbsServing = nutriments['carbohydrates_serving'] !== undefined ? Number(nutriments['carbohydrates_serving']) : null;
  const sugarsServing = nutriments['sugars_serving'] !== undefined ? Number(nutriments['sugars_serving']) : null;
  const fatServing = nutriments['fat_serving'] !== undefined ? Number(nutriments['fat_serving']) : null;
  const saturatedFatServing = nutriments['saturated-fat_serving'] !== undefined ? Number(nutriments['saturated-fat_serving']) : null;
  const fiberServing = nutriments['fiber_serving'] !== undefined ? Number(nutriments['fiber_serving']) : null;
  const saltServing = nutriments['salt_serving'] !== undefined ? Number(nutriments['salt_serving']) : null;
  const sodiumServing = nutriments['sodium_serving'] !== undefined ? Number(nutriments['sodium_serving']) : null;

  // Scientific Classifications
  const novaGroup = p.nova_group ? Number(p.nova_group) : null;
  const nutriScore = p.nutriscore_grade ? p.nutriscore_grade.toUpperCase() : null;

  // Ingredients Parsing
  let ingredients = [];
  if (Array.isArray(p.ingredients) && p.ingredients.length > 0) {
    ingredients = p.ingredients.map((ing) => ({
      name: ing.text || ing.id || 'Ingredient',
      percent: ing.percent_estimate ? Math.round(Number(ing.percent_estimate)) : null,
      isVegan: ing.vegan === 'yes',
      isVegetarian: ing.vegetarian === 'yes',
    }));
  } else if (p.ingredients_text || p.ingredients_text_en) {
    const rawText = p.ingredients_text || p.ingredients_text_en;
    ingredients = rawText
      .split(/[,;()]/)
      .map((i) => i.trim())
      .filter((i) => i.length > 1 && i.length < 60)
      .slice(0, 15)
      .map((name) => ({ name, percent: null, isVegan: false, isVegetarian: false }));
  }

  // Confirmed Allergens vs Possible Traces (Cross-contamination)
  let allergens = [];
  if (Array.isArray(p.allergens_tags) && p.allergens_tags.length > 0) {
    allergens = p.allergens_tags.map((a) =>
      a.replace(/^[a-z]{2}:/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    );
  } else if (p.allergens) {
    allergens = p.allergens.split(',').map((a) => a.trim()).filter(Boolean);
  }

  let traces = [];
  if (Array.isArray(p.traces_tags) && p.traces_tags.length > 0) {
    traces = p.traces_tags.map((t) =>
      t.replace(/^[a-z]{2}:/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    );
  } else if (p.traces) {
    traces = p.traces.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // Additives
  let additives = [];
  if (Array.isArray(p.additives_tags)) {
    additives = p.additives_tags.map((a) => a.replace(/^[a-z]{2}:/, '').toUpperCase());
  }

  // Calculate Conscious Score (0 - 100) based strictly on objective nutritional density
  let score = 70;
  if (novaGroup === 1) score += 20;
  else if (novaGroup === 2) score += 10;
  else if (novaGroup === 3) score -= 5;
  else if (novaGroup === 4) score -= 25;

  if (sugars100g !== null) {
    if (sugars100g > 20) score -= 15;
    else if (sugars100g < 5) score += 5;
  }
  if (fiber100g !== null && fiber100g >= 6) score += 8;
  if (proteins100g !== null && proteins100g >= 10) score += 5;
  if (additives.length > 0) score -= Math.min(20, additives.length * 4);
  score = Math.max(10, Math.min(99, score));

  return {
    id: `off-${barcode}`,
    barcode,
    name: productName || `Product (${barcode})`,
    brand: brand || 'Declared Retail Brand',
    quantity,
    servingSize,
    servingQuantity,
    servingUnit,
    category: category || 'Packaged Grocery',
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    hasRealImage: !!image,
    consciousScore: score,
    novaGroup,
    nutriGrade: nutriScore,
    summary: p.generic_name || `${productName || 'Food Item'} verified in Open Food Facts database.`,

    // Per 100g Nutritional Values (Preserving units)
    nutritionPer100g: {
      calories: calories100g,
      energyKj: energyKj100g,
      proteins: proteins100g,
      carbohydrates: carbs100g,
      sugars: sugars100g,
      fat: fat100g,
      saturatedFat: saturatedFat100g,
      fiber: fiber100g,
      salt: salt100g,
      sodium: sodium100g,
    },

    // Per Serving Nutritional Values (Only when available on label)
    nutritionPerServing: {
      calories: caloriesServing,
      energyKj: energyKjServing,
      proteins: proteinsServing,
      carbohydrates: carbsServing,
      sugars: sugarsServing,
      fat: fatServing,
      saturatedFat: saturatedFatServing,
      fiber: fiberServing,
      salt: saltServing,
      sodium: sodiumServing,
      hasServingData: caloriesServing !== null || proteinsServing !== null || carbsServing !== null,
    },

    ingredients,
    allergens,
    traces,
    additives,
    rawPayload: p,
    isExternal: true,
  };
}

/**
 * Fetch product by barcode from Open Food Facts API v3.
 * Supports caching and handles proxy/direct fallback gracefully.
 */
export async function fetchProductFromOpenFoodFacts(barcode) {
  const code = (barcode || '').trim();
  if (!code) {
    return { found: false, error: 'INVALID_BARCODE', message: 'Barcode is empty.' };
  }

  // 1. Check in-memory cache
  if (memoryCache.has(code)) {
    return { found: true, product: memoryCache.get(code), fromCache: true };
  }

  // 2. Check persistent session cache
  try {
    const cached = sessionStorage.getItem(`${CACHE_PREFIX}${code}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      memoryCache.set(code, parsed);
      return { found: true, product: parsed, fromCache: true };
    }
  } catch {
    // ignore storage access errors
  }

  // 3. Prepare URLs: try Vite local proxy first, with direct fallback to world.openfoodfacts.org
  const proxyUrl = `/off-api/api/v3/product/${encodeURIComponent(code)}.json`;
  const directUrl = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;

  const urlsToTry = [proxyUrl, directUrl];
  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': USER_AGENT,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        return {
          found: false,
          error: 'NOT_FOUND',
          message: "Oops! We couldn't find this product.",
          barcode: code,
        };
      }

      if (!response.ok) {
        lastError = new Error(`HTTP error ${response.status}`);
        continue;
      }

      const data = await response.json();

      // Check Open Food Facts v3 status
      if (
        data.status === 'success' ||
        data.status === 'success_with_warnings' ||
        data.result?.id === 'product_found' ||
        (data.product && data.status !== 'failure')
      ) {
        const normalized = normalizeProduct(data);
        if (normalized) {
          // Cache in memory and sessionStorage
          memoryCache.set(code, normalized);
          try {
            sessionStorage.setItem(`${CACHE_PREFIX}${code}`, JSON.stringify(normalized));
          } catch {
            // ignore
          }
          return { found: true, product: normalized, fromCache: false };
        }
      }

      if (data.status === 'failure' || data.result?.id === 'product_not_found') {
        return {
          found: false,
          error: 'NOT_FOUND',
          message: "Oops! We couldn't find this product.",
          barcode: code,
        };
      }
    } catch (err) {
      lastError = err;
      // Continue to next URL attempt (e.g. direct fallback)
    }
  }

  // If network or timeout failed
  return {
    found: false,
    error: 'NETWORK_ERROR',
    message: lastError?.name === 'AbortError'
      ? 'Request timed out connecting to food database.'
      : 'Network connection failed while querying Open Food Facts.',
    barcode: code,
  };
}

/**
 * Searches Open Food Facts by keyword/terms
 */
export async function searchOpenFoodFacts(query, limit = 8) {
  const q = (query || '').trim();
  if (!q) return [];

  const proxyUrl = `/off-api/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=${limit}`;
  const directUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=${limit}`;

  for (const url of [proxyUrl, directUrl]) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': USER_AGENT,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) {
          return data.products
            .map(normalizeProduct)
            .filter(p => p && p.name && p.nutritionPer100g?.calories !== null);
        }
      }
    } catch {
      // try next
    }
  }

  return [];
}

/**
 * Evaluates why an alternative product might be preferable for particular nutritional goals.
 * Does NOT claim that one product is universally healthier than another.
 */
export function evaluateGoalTradeoffs(candidate, reference) {
  if (!candidate || !reference) return [];

  const cNutr = candidate.nutritionPer100g || {};
  const rNutr = reference.nutritionPer100g || {};
  const goals = [];

  // 1. Lower Sugar Goal
  if (
    cNutr.sugars !== null &&
    rNutr.sugars !== null &&
    cNutr.sugars < rNutr.sugars - 1.5
  ) {
    const diff = (rNutr.sugars - cNutr.sugars).toFixed(1);
    const pct = rNutr.sugars > 0 ? Math.round(((rNutr.sugars - cNutr.sugars) / rNutr.sugars) * 100) : null;
    goals.push({
      goal: 'Lower Sugar',
      title: 'Sugar Moderation',
      summary: `~${diff}g less sugar per 100g (${cNutr.sugars}g vs ${rNutr.sugars}g${pct ? `, -${pct}%` : ''}).`,
      explanation: 'Helpful for those moderating added sugars or managing blood glucose swings.',
      type: 'sugar',
      favorableFor: 'low-sugar'
    });
  }

  // 2. Higher Protein Goal
  if (
    cNutr.proteins !== null &&
    rNutr.proteins !== null &&
    cNutr.proteins > rNutr.proteins + 1.5
  ) {
    const diff = (cNutr.proteins - rNutr.proteins).toFixed(1);
    goals.push({
      goal: 'Higher Protein',
      title: 'Protein Density',
      summary: `+${diff}g more protein per 100g (${cNutr.proteins}g vs ${rNutr.proteins}g).`,
      explanation: 'Supports satiety, active recovery, and daily macronutrient requirements.',
      type: 'protein',
      favorableFor: 'high-protein'
    });
  }

  // 3. Higher Fibre Goal
  if (
    cNutr.fiber !== null &&
    rNutr.fiber !== null &&
    cNutr.fiber > rNutr.fiber + 1.5
  ) {
    const diff = (cNutr.fiber - rNutr.fiber).toFixed(1);
    goals.push({
      goal: 'Higher Dietary Fibre',
      title: 'Digestive Fibre',
      summary: `+${diff}g more fibre per 100g (${cNutr.fiber}g vs ${rNutr.fiber}g).`,
      explanation: 'Supports gut microbiome diversity and promotes steady digestion.',
      type: 'fiber',
      favorableFor: 'high-fiber'
    });
  }

  // 4. Lower Saturated Fat Goal
  if (
    cNutr.saturatedFat !== null &&
    rNutr.saturatedFat !== null &&
    cNutr.saturatedFat < rNutr.saturatedFat - 1.5
  ) {
    const diff = (rNutr.saturatedFat - cNutr.saturatedFat).toFixed(1);
    goals.push({
      goal: 'Lower Saturated Fat',
      title: 'Heart-Conscious Fat Profile',
      summary: `~${diff}g less saturated fat per 100g (${cNutr.saturatedFat}g vs ${rNutr.saturatedFat}g).`,
      explanation: 'Prefers unsaturated plant oils or leaner ingredients to support cardiovascular dietary guidelines.',
      type: 'fat',
      favorableFor: 'low-sat-fat'
    });
  }

  // 5. Lower Sodium Goal
  if (
    cNutr.sodium !== null &&
    rNutr.sodium !== null &&
    cNutr.sodium < rNutr.sodium - 80
  ) {
    const diff = Math.round(rNutr.sodium - cNutr.sodium);
    goals.push({
      goal: 'Lower Sodium',
      title: 'Sodium Moderation',
      summary: `~${diff}mg less sodium per 100g (${Math.round(cNutr.sodium)}mg vs ${Math.round(rNutr.sodium)}mg).`,
      explanation: 'Favorable for individuals following low-salt cardiovascular or blood pressure regimens.',
      type: 'sodium',
      favorableFor: 'low-sodium'
    });
  }

  // 6. Lower Industrial Processing Goal (NOVA)
  if (
    candidate.novaGroup &&
    reference.novaGroup &&
    candidate.novaGroup < reference.novaGroup
  ) {
    goals.push({
      goal: 'Less Industrially Processed',
      title: 'Whole Food Formulation',
      summary: `NOVA Group ${candidate.novaGroup} (compared to Group ${reference.novaGroup}).`,
      explanation: 'Crafted with fewer industrial fractionated isolates and minimal mechanical or chemical modification.',
      type: 'nova',
      favorableFor: 'whole-food'
    });
  }

  // 7. Clean Formulation / Zero Additives
  const cAdditives = candidate.additives?.length || 0;
  const rAdditives = reference.additives?.length || 0;
  if (cAdditives === 0 && rAdditives > 0) {
    goals.push({
      goal: 'Zero Additives Detected',
      title: 'Additive-Free Recipe',
      summary: `0 chemical additives (vs ${rAdditives} in compared item).`,
      explanation: 'Contains no synthetic emulsifiers, artificial colorings, or chemical preservatives.',
      type: 'additives',
      favorableFor: 'clean-label'
    });
  }

  return goals;
}

/**
 * Searches the available product database for similar products within a relevant food category.
 * Only returns verified products with goal-based explanations.
 * If none qualify, returns an empty array.
 */
export async function fetchCategoryAlternatives(referenceProduct, localCatalog = []) {
  if (!referenceProduct) return [];

  const currentBarcode = referenceProduct.barcode || '';
  const currentCategory = (referenceProduct.category || '').toLowerCase();
  const currentName = (referenceProduct.name || '').toLowerCase();

  // Extract a sensible search keyword based on category and product name
  let keyword = 'snack';
  if (currentCategory.includes('cereal') || currentCategory.includes('breakfast') || currentName.includes('granola') || currentName.includes('oat')) {
    keyword = 'granola oats cereal';
  } else if (currentCategory.includes('beverage') || currentCategory.includes('drink') || currentName.includes('soda') || currentName.includes('tea') || currentName.includes('juice')) {
    keyword = 'tea juice sparkling beverage';
  } else if (currentCategory.includes('dairy') || currentCategory.includes('yogurt') || currentName.includes('yogurt') || currentName.includes('milk')) {
    keyword = 'yogurt milk';
  } else if (currentCategory.includes('spread') || currentName.includes('butter') || currentName.includes('nutella') || currentName.includes('hazelnut')) {
    keyword = 'spread hazelnut peanut butter';
  } else if (currentCategory.includes('snack') || currentName.includes('cracker') || currentName.includes('chip') || currentName.includes('puff')) {
    keyword = 'crackers biscuit organic snack';
  } else if (referenceProduct.category && referenceProduct.category !== 'Packaged Grocery') {
    keyword = referenceProduct.category.split(',')[0].trim();
  }

  // 1. Gather candidates from local catalog
  const localCandidates = localCatalog.filter(p => {
    if (!p || p.barcode === currentBarcode) return false;
    const catMatch = p.category && referenceProduct.category && (
      p.category.toLowerCase().includes(currentCategory) ||
      currentCategory.includes(p.category.toLowerCase())
    );
    const tagMatch = Array.isArray(p.tags) && p.tags.some(t => currentCategory.includes(t.toLowerCase()));
    return catMatch || tagMatch;
  });

  // 2. Fetch candidates from Open Food Facts database
  let remoteCandidates = [];
  try {
    const searchTerms = keyword.split(' ')[0] || keyword;
    remoteCandidates = await searchOpenFoodFacts(searchTerms, 8);
  } catch {
    remoteCandidates = [];
  }

  // 3. Merge, deduplicate by barcode, and filter verified products
  const pool = [...localCandidates, ...remoteCandidates];
  const seenBarcodes = new Set([currentBarcode]);
  const verifiedAlternatives = [];

  for (const item of pool) {
    if (!item || !item.barcode || seenBarcodes.has(item.barcode)) continue;
    seenBarcodes.add(item.barcode);

    // Verify product has essential nutritional values
    const nutr = item.nutritionPer100g || {};
    const hasNutritionalData = 
      nutr.calories !== null && 
      (nutr.sugars !== null || nutr.proteins !== null || nutr.fat !== null);

    if (!hasNutritionalData) continue;

    // Evaluate nutritional goal trade-offs
    const goalReasons = evaluateGoalTradeoffs(item, referenceProduct);

    // Only include if at least 1 genuine goal-based reason applies
    if (goalReasons.length > 0) {
      verifiedAlternatives.push({
        ...item,
        goalReasons,
      });
    }
  }

  // Return list of verified alternatives (empty if none qualify)
  return verifiedAlternatives;
}

