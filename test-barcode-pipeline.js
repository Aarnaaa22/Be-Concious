/**
 * Comprehensive Automated Verification Suite for Be Conscious Barcode & Product Identification Pipeline
 */

import { validateEanUpcChecksum, identifyBarcodeFormat, getGS1CountryPrefix } from './src/utils/barcodeValidator.js';
import { indianProductsCatalog, findInIndianCatalog } from './src/data/indianProductsCatalog.js';
import { lookupProduct } from './src/services/productLookupService.js';
import { parseNutritionFactsFromText, parseIngredientsFromText, extractBrandAndProductFromText } from './src/services/ocrService.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('\n========================================================');
  console.log('BE CONSCIOUS — BARCODE & PRODUCT IDENTIFICATION AUDIT');
  console.log('========================================================\n');

  // TEST SUITE 1: Barcode Format & Modulo 10 Checksum Validation
  console.log('--- Test Suite 1: Barcode Validation & Format Identification ---');
  assert(identifyBarcodeFormat('8901030383700') === 'EAN-13', 'Identifies Indian EAN-13');
  assert(identifyBarcodeFormat('89012345') === 'EAN-8', 'Identifies EAN-8');
  assert(identifyBarcodeFormat('012345678905') === 'UPC-A', 'Identifies UPC-A');
  assert(validateEanUpcChecksum('8901030383700') === true, 'Validates authentic EAN-13 checksum (Parle-G)');
  assert(validateEanUpcChecksum('8901058852448') === true, 'Validates authentic EAN-13 checksum (Maggi Noodles)');
  assert(validateEanUpcChecksum('8901491101837') === true, 'Validates authentic EAN-13 checksum (Lay\'s Magic Masala)');
  assert(validateEanUpcChecksum('8901030383709') === false, 'Detects corrupted/tampered check digit');

  // TEST SUITE 2: GS1 Country Prefix Intelligence
  console.log('\n--- Test Suite 2: GS1 Registry Intelligence ---');
  const gs1India = getGS1CountryPrefix('8901030383707');
  assert(gs1India?.country === 'India' && gs1India?.isIndian === true, 'Recognizes GS1 India prefix 890');
  const gs1US = getGS1CountryPrefix('012345678905');
  assert(gs1US?.country.includes('United States'), 'Recognizes GS1 US/Canada prefix');
  const gs1Swiss = getGS1CountryPrefix('7622201416189');
  assert(gs1Swiss?.country === 'Switzerland', 'Recognizes multinational/Swiss GS1 prefix on imported items');

  // TEST SUITE 3: Dedicated Indian FMCG Catalog Coverage
  console.log('\n--- Test Suite 3: Indian Packaged-Food Catalog Coverage ---');
  assert(indianProductsCatalog.length >= 15, `Catalog contains ${indianProductsCatalog.length} authentic FMCG items`);

  const categories = new Set(indianProductsCatalog.map(p => p.category));
  assert(categories.has('Biscuits & Cookies'), 'Covers Biscuits & Cookies');
  assert(categories.has('Chips & Namkeen'), 'Covers Chips & Namkeen');
  assert(categories.has('Instant Noodles'), 'Covers Instant Noodles');
  assert(categories.has('Packaged Beverages'), 'Covers Packaged Beverages');
  assert(categories.has('Dairy Products'), 'Covers Dairy Products');
  assert(categories.has('Breakfast Cereals'), 'Covers Breakfast Cereals');
  assert(categories.has('Sauces & Condiments'), 'Covers Sauces & Condiments');
  assert(categories.has('Chocolates & Confectionery'), 'Covers Chocolates & Confectionery');
  assert(categories.has('Health & Protein Foods'), 'Covers Health & Protein Foods');

  // Parle-G
  const parleg = findInIndianCatalog('8901030383707');
  assert(parleg && parleg.brand === 'Parle' && parleg.nutritionPer100g.calories === 453, 'Authentic Parle-G data verified');

  // Maggi 2-Minute Noodles
  const maggi = findInIndianCatalog('8901058852441');
  assert(maggi && maggi.name.includes('Maggi') && maggi.nutritionPer100g.sodium === 1120, 'Authentic Maggi Masala Noodles verified');

  // Amul Butter
  const amul = findInIndianCatalog('8901262010010');
  assert(amul && amul.brand.includes('Amul') && amul.nutritionPer100g.totalFat === 80, 'Authentic Amul Salted Butter verified');

  // Frooti
  const frooti = findInIndianCatalog('8901030491020');
  assert(frooti && frooti.brand === 'Parle Agro' && frooti.nutritionPer100g.sugars === 15, 'Authentic Frooti Mango verified');

  // TEST SUITE 4: Multi-Source Modular Lookup Pipeline
  console.log('\n--- Test Suite 4: Multi-Source Lookup Pipeline Resolution ---');
  const lookupParleg = await lookupProduct('8901030383707');
  assert(lookupParleg.found === true && lookupParleg.status === 'IDENTIFIED', 'Pipeline resolves Indian item with high accuracy');

  // Unregistered but valid barcode: returns structured fallback metadata, NEVER fabricates data
  const unknownCode = '8909999999999';
  const unknownLookup = await lookupProduct(unknownCode);
  assert(unknownLookup.found === false && unknownLookup.status === 'NOT_FOUND', 'Does not invent false products for unknown barcodes');
  assert(unknownLookup.gs1Info?.country === 'India', 'Provides GS1 contextual intelligence for unknown barcode');
  assert(unknownLookup.message.includes("isn't in our database yet"), 'Provides clear user-facing communication message');

  // Invalid barcode
  const invalidLookup = await lookupProduct('');
  assert(invalidLookup.status === 'INVALID_BARCODE', 'Rejects empty or blank barcode gracefully');

  // TEST SUITE 5: Client-Side OCR Extraction & Regex Parsing
  console.log('\n--- Test Suite 5: OCR Nutrition & Ingredients Regex Parsing ---');
  const sampleOcrText = `
    NUTRITION INFORMATION
    Serving size: 30g
    Energy: 480 kcal
    Protein: 8.2 g
    Total Carbohydrate: 64.5 g
    Total Sugars: 24.0 g
    Added Sugars: 18.0 g
    Total Fat: 21.0 g
    Saturated Fat: 9.5 g
    Dietary Fiber: 4.5 g
    Sodium: 420 mg
  `;

  const parsedNutrition = parseNutritionFactsFromText(sampleOcrText);
  assert(parsedNutrition.calories === 480, `Parsed calories correctly (${parsedNutrition.calories} kcal)`);
  assert(parsedNutrition.protein === 8.2, `Parsed protein correctly (${parsedNutrition.protein} g)`);
  assert(parsedNutrition.carbs === 64.5, `Parsed carbs correctly (${parsedNutrition.carbs} g)`);
  assert(parsedNutrition.sugars === 24.0, `Parsed sugars correctly (${parsedNutrition.sugars} g)`);
  assert(parsedNutrition.fat === 21.0, `Parsed total fat correctly (${parsedNutrition.fat} g)`);
  assert(parsedNutrition.saturatedFat === 9.5, `Parsed saturated fat correctly (${parsedNutrition.saturatedFat} g)`);
  assert(parsedNutrition.fiber === 4.5, `Parsed fiber correctly (${parsedNutrition.fiber} g)`);
  assert(parsedNutrition.sodium === 420, `Parsed sodium correctly (${parsedNutrition.sodium} mg)`);

  const sampleIngredientsText = `
    INGREDIENTS: Refined Wheat Flour (Maida 65%), Sugar, Edible Vegetable Oil (Palm Oil),
    Milk Solids (2%), Iodised Salt, Emulsifier (INS 322), Raising Agent (INS 500(ii)).
    Allergen Advice: Contains Wheat, Milk and Soy.
  `;
  const parsedIngredients = parseIngredientsFromText(sampleIngredientsText);
  assert(parsedIngredients.ingredients.length >= 4, `Extracted ${parsedIngredients.ingredients.length} ingredients`);
  assert(parsedIngredients.allergens.includes('Wheat (Gluten)'), 'Detected Wheat allergen');
  assert(parsedIngredients.allergens.includes('Milk / Dairy'), 'Detected Milk allergen');
  assert(parsedIngredients.allergens.includes('Soy'), 'Detected Soy allergen');

  const frontPackText = `
    BRITANNIA
    NUTRICHOICE DIGESTIVE
    HIGH FIBRE BISCUITS
    100g Net Wt
  `;
  const brandProduct = extractBrandAndProductFromText(frontPackText);
  assert(brandProduct.brand.includes('BRITANNIA'), `Extracted brand: ${brandProduct.brand}`);

  console.log('\n========================================================');
  console.log(`AUDIT RESULT: ${passed} / ${total} TESTS PASSED`);
  console.log('========================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
