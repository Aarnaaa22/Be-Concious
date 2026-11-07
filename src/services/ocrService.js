/**
 * Client-Side OCR Service with Preprocessing & Intelligent Nutrition Parsing
 * Powered by Tesseract.js
 *
 * Designed to extract:
 * - Product Name & Brand from Front-of-Pack
 * - Ingredient Lists with Allergen Flagging
 * - Nutrition Facts (Calories, Protein, Carbs, Sugars, Fat, Saturated Fat, Fiber, Sodium, Serving Size)
 */

import { createWorker } from 'tesseract.js';

let sharedWorker = null;

/**
 * Preprocess image on an offscreen HTML5 canvas to enhance OCR readability:
 * - Resizes high-res images to optimal OCR dimension (~1400px width)
 * - Converts to grayscale
 * - Enhances contrast using an adaptive threshold
 */
export async function preprocessImageForOcr(imageSource) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Constrain dimensions to prevent browser memory exhaustion
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      const maxDim = 1600;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Extract pixel buffer
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Grayscale + Contrast Boost
      // Formula: luminance = 0.299*R + 0.587*G + 0.114*B
      // Contrast factor ~1.3
      const contrast = 35;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrasted = factor * (gray - 128) + 128;
        const finalVal = Math.min(255, Math.max(0, contrasted));

        data[i] = finalVal;
        data[i + 1] = finalVal;
        data[i + 2] = finalVal;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => {
      // Return original on failure
      resolve(imageSource);
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      resolve(null);
    }
  });
}

/**
 * Run OCR recognition on an image or data URL
 */
export async function recognizeImageText(imageSource, onProgress = null) {
  try {
    const preprocessed = await preprocessImageForOcr(imageSource);

    if (!sharedWorker) {
      sharedWorker = await createWorker('eng');
    }

    const ret = await sharedWorker.recognize(preprocessed);
    return ret.data.text || '';
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    throw err;
  }
}

/**
 * Intelligent Nutrition Facts Regex Parser
 * Parses lines such as:
 * - "Energy: 450 kcal" / "Calories 120"
 * - "Protein: 8.5g"
 * - "Total Carbohydrate: 65 g"
 * - "Total Sugars: 24 g" / "Added Sugar 18g"
 * - "Total Fat 14.5 g" / "Saturated Fat 6.2g"
 * - "Dietary Fiber 4.0g"
 * - "Sodium: 280 mg" or "Salt 0.7g"
 * - "Serving size: 30g"
 */
export function parseNutritionFactsFromText(rawText) {
  if (!rawText) return {};

  const clean = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .toLowerCase();

  const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);

  const extractNumber = (patterns) => {
    for (const pat of patterns) {
      for (const line of lines) {
        const match = line.match(pat);
        if (match && match[1]) {
          const val = parseFloat(match[1].replace(',', '.'));
          if (!isNaN(val)) return val;
        }
      }
    }
    return null;
  };

  // 1. Calories / Energy
  const calories = extractNumber([
    /(?:energy|calories|caloric\s*value)[^\d]{0,20}(\d+(?:\.\d+)?)\s*(?:kcal|cal)/i,
    /(?:energy|calories)[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 2. Protein
  const protein = extractNumber([
    /protein[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /protein[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 3. Carbohydrates
  const carbs = extractNumber([
    /(?:total\s*)?carbohydrate[s]?[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /carbs[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /carbohydrate[s]?[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 4. Sugars
  const sugars = extractNumber([
    /(?:total\s*)?sugar[s]?[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /added\s*sugar[s]?[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /sugar[s]?[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 5. Total Fat
  const fat = extractNumber([
    /(?:total\s*)?fat[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /fat[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 6. Saturated Fat
  const saturatedFat = extractNumber([
    /(?:saturated\s*fat|sat\s*fat)[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /saturates[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 7. Dietary Fiber
  const fiber = extractNumber([
    /(?:dietary\s*)?fib(?:er|re)[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /fib(?:er|re)[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  // 8. Sodium / Salt (normalize: 1g salt ≈ 400mg sodium)
  let sodium = extractNumber([
    /sodium[^\d]{0,15}(\d+(?:\.\d+)?)\s*mg/i,
    /sodium[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  let salt = extractNumber([
    /salt[^\d]{0,15}(\d+(?:\.\d+)?)\s*g/i,
    /salt[^\d]{0,15}(\d+(?:\.\d+)?)/i,
  ]);

  if (sodium === null && salt !== null) {
    sodium = Math.round(salt * 400);
  } else if (salt === null && sodium !== null) {
    salt = parseFloat((sodium / 400).toFixed(2));
  }

  // 9. Serving Size
  let servingSize = null;
  for (const line of lines) {
    const match = line.match(/(?:serving\s*size|per\s*serving)[^\d]{0,10}(\d+\s*(?:g|ml|piece|biscuit|pack|tsp|tbsp))/i);
    if (match && match[1]) {
      servingSize = match[1].trim();
      break;
    }
  }

  return {
    calories,
    protein,
    carbs,
    sugars,
    fat,
    saturatedFat,
    fiber,
    sodium,
    salt,
    servingSize,
  };
}

/**
 * Intelligent Ingredients & Allergen Parser
 */
export function parseIngredientsFromText(rawText) {
  if (!rawText) return { ingredients: [], allergens: [], additives: [] };

  const clean = rawText.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
  let targetSection = clean;

  // Look for "Ingredients:" boundary
  const markerMatch = clean.match(/(?:ingredients?|contains?)\s*[:\-](.*?)(?:nutrition|mfg|batch|best before|net wt|$)/i);
  if (markerMatch && markerMatch[1]) {
    targetSection = markerMatch[1];
  }

  // Split into components
  const rawItems = targetSection
    .split(/[,;•\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2 && item.length < 80);

  const ingredients = rawItems.slice(0, 20).map((name) => {
    const lower = name.toLowerCase();
    const isVegetarian = !lower.includes('gelatin') && !lower.includes('meat') && !lower.includes('fish') && !lower.includes('egg');
    return {
      name,
      isVegetarian,
    };
  });

  // Detect common allergens
  const knownAllergens = [
    { key: 'Milk / Dairy', match: /milk|dairy|butter|cheese|whey|casein|curd|paneer|ghee/i },
    { key: 'Wheat (Gluten)', match: /wheat|gluten|maida|atta|barley|rye|oat/i },
    { key: 'Soy', match: /soy|soya|lecithin/i },
    { key: 'Peanuts', match: /peanut|groundnut/i },
    { key: 'Tree Nuts', match: /almond|cashew|walnut|pistachio|hazelnut/i },
    { key: 'Sesame', match: /sesame|til/i },
    { key: 'Egg', match: /egg|albumin/i },
    { key: 'Mustard', match: /mustard|rai/i },
  ];

  const allergens = [];
  for (const allergen of knownAllergens) {
    if (allergen.match.test(targetSection)) {
      allergens.push(allergen.key);
    }
  }

  // Detect INS / E food additives
  const additiveMatches = targetSection.match(/(?:ins\s*\d+[a-z]?\(?[ivx0-9]*\)?|e\s*\d{3,4}[a-z]?)/gi) || [];
  const additives = [...new Set(additiveMatches.map((a) => a.toUpperCase().trim()))];

  return {
    ingredients,
    allergens,
    additives,
    rawSection: targetSection.substring(0, 300),
  };
}

/**
 * Extract Name and Brand heuristics from front-of-pack text
 */
export function extractBrandAndProductFromText(rawText) {
  if (!rawText) return { name: '', brand: '' };

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !/^\d+$/.test(l));

  if (lines.length === 0) return { name: '', brand: '' };

  // First notable line is often Brand or Product Name
  const candidateBrand = lines[0].substring(0, 30);
  const candidateName = lines.length > 1 ? lines.slice(0, 2).join(' ').substring(0, 60) : lines[0];

  return {
    brand: candidateBrand,
    name: candidateName,
  };
}

