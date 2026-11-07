import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Camera,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Edit3,
  HelpCircle,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  recognizeImageText,
  parseNutritionFactsFromText,
  parseIngredientsFromText,
  extractBrandAndProductFromText
} from '../../services/ocrService';
import { registerDynamicProduct } from '../../services/productLookupService';
import { supabaseService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from '../../context/HistoryContext';

export const ProductFallbackFlow = ({
  barcode,
  format = 'EAN-13',
  gs1Info = null,
  onCancel = null
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToHistory } = useHistory();

  // Active step / tab in fallback flow
  const [activeStep, setActiveStep] = useState('options'); // 'options' | 'ocr_front' | 'ocr_ingredients' | 'ocr_nutrition' | 'review'
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrStatusMessage, setOcrStatusMessage] = useState('');
  const [ocrError, setOcrError] = useState('');

  // Editable Product State
  const [formData, setFormData] = useState({
    barcode: barcode || '',
    name: '',
    brand: '',
    category: 'Packaged Grocery',
    servingSize: '100g',
    calories: '',
    protein: '',
    carbs: '',
    sugars: '',
    fat: '',
    saturatedFat: '',
    fiber: '',
    sodium: '',
    salt: '',
    ingredientsText: '',
    allergens: [],
    packageImage: null,
  });

  const [ocrExtractedFlags, setOcrExtractedFlags] = useState({
    name: false,
    ingredients: false,
    nutrition: false,
  });

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Process Front of Pack image
  const handleProcessFrontImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setOcrError('');
    setOcrStatusMessage('Analyzing package label with OCR...');

    try {
      const text = await recognizeImageText(file);
      const extracted = extractBrandAndProductFromText(text);

      setFormData((prev) => ({
        ...prev,
        name: extracted.name || prev.name,
        brand: extracted.brand || prev.brand,
        packageImage: URL.createObjectURL(file),
      }));

      setOcrExtractedFlags((prev) => ({ ...prev, name: true }));
      setOcrStatusMessage('Front package detected successfully!');
      setTimeout(() => setActiveStep('review'), 600);
    } catch (err) {
      console.error(err);
      setOcrError('Could not read text from this image. Please take a clearer photo or enter details manually.');
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Process Ingredients image
  const handleProcessIngredientsImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setOcrError('');
    setOcrStatusMessage('Extracting ingredients & detecting allergens...');

    try {
      const text = await recognizeImageText(file);
      const parsed = parseIngredientsFromText(text);

      const ingredientsString = parsed.ingredients.map((i) => i.name).join(', ');

      setFormData((prev) => ({
        ...prev,
        ingredientsText: ingredientsString || text.substring(0, 300),
        allergens: parsed.allergens || prev.allergens,
      }));

      setOcrExtractedFlags((prev) => ({ ...prev, ingredients: true }));
      setOcrStatusMessage('Ingredients extracted successfully!');
      setTimeout(() => setActiveStep('review'), 600);
    } catch (err) {
      console.error(err);
      setOcrError('Could not parse ingredients list. Please ensure good lighting and clear text.');
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Process Nutrition Panel image
  const handleProcessNutritionImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setOcrError('');
    setOcrStatusMessage('Scanning Nutrition Facts table values...');

    try {
      const text = await recognizeImageText(file);
      const parsed = parseNutritionFactsFromText(text);

      setFormData((prev) => ({
        ...prev,
        calories: parsed.calories !== null ? String(parsed.calories) : prev.calories,
        protein: parsed.protein !== null ? String(parsed.protein) : prev.protein,
        carbs: parsed.carbs !== null ? String(parsed.carbs) : prev.carbs,
        sugars: parsed.sugars !== null ? String(parsed.sugars) : prev.sugars,
        fat: parsed.fat !== null ? String(parsed.fat) : prev.fat,
        saturatedFat: parsed.saturatedFat !== null ? String(parsed.saturatedFat) : prev.saturatedFat,
        fiber: parsed.fiber !== null ? String(parsed.fiber) : prev.fiber,
        sodium: parsed.sodium !== null ? String(parsed.sodium) : prev.sodium,
        servingSize: parsed.servingSize || prev.servingSize,
      }));

      setOcrExtractedFlags((prev) => ({ ...prev, nutrition: true }));
      setOcrStatusMessage('Nutrition table parsed successfully!');
      setTimeout(() => setActiveStep('review'), 600);
    } catch (err) {
      console.error(err);
      setOcrError('Could not parse nutrition numbers. Please check photo angle or enter manually.');
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Calculate dynamic conscious score heuristic
  const calculateHeuristicScore = () => {
    let score = 70;
    const sugarNum = parseFloat(formData.sugars);
    const fiberNum = parseFloat(formData.fiber);
    const proteinNum = parseFloat(formData.protein);
    const satFatNum = parseFloat(formData.saturatedFat);

    if (!isNaN(sugarNum)) {
      if (sugarNum > 20) score -= 15;
      else if (sugarNum < 5) score += 5;
    }
    if (!isNaN(satFatNum) && satFatNum > 5) score -= 10;
    if (!isNaN(fiberNum) && fiberNum >= 5) score += 10;
    if (!isNaN(proteinNum) && proteinNum >= 10) score += 8;

    return Math.max(15, Math.min(95, score));
  };

  // Submit and navigate to product analysis
  const handleSubmitProduct = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      setOcrError('Please provide a product name.');
      setActiveStep('review');
      return;
    }

    const consciousScore = calculateHeuristicScore();
    const finalBarcode = formData.barcode || barcode || `custom-${Date.now()}`;
    const uniqueId = `usr-${finalBarcode}`;

    const parsedIngredients = formData.ingredientsText
      ? formData.ingredientsText
          .split(/[,;]/)
          .map((i) => i.trim())
          .filter(Boolean)
          .map((name) => ({ name, isVegetarian: true }))
      : [{ name: 'Declared package ingredients', isVegetarian: true }];

    const productRecord = {
      id: uniqueId,
      barcode: finalBarcode,
      name: formData.name.trim(),
      brand: formData.brand.trim() || 'Declared Retail Brand',
      category: formData.category || 'Packaged Grocery',
      servingSize: formData.servingSize || '100g',
      image: formData.packageImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      hasRealImage: !!formData.packageImage,
      consciousScore,
      novaGroup: 3,
      novaLabel: 'Processed Packaged Product',
      nutriGrade: consciousScore >= 80 ? 'A' : consciousScore >= 65 ? 'B' : consciousScore >= 50 ? 'C' : 'D',
      summary: `User-submitted product record for ${formData.name.trim()} (${formData.brand.trim() || 'Declared Brand'}). Extracted from package label.`,
      nutritionPer100g: {
        calories: formData.calories ? parseFloat(formData.calories) : null,
        proteins: formData.protein ? parseFloat(formData.protein) : null,
        carbohydrates: formData.carbs ? parseFloat(formData.carbs) : null,
        sugars: formData.sugars ? parseFloat(formData.sugars) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null,
        saturatedFat: formData.saturatedFat ? parseFloat(formData.saturatedFat) : null,
        fiber: formData.fiber ? parseFloat(formData.fiber) : null,
        sodium: formData.sodium ? parseFloat(formData.sodium) : null,
        salt: formData.sodium ? parseFloat((parseFloat(formData.sodium) / 400).toFixed(2)) : null,
      },
      nutritionPerServing: {
        hasServingData: false,
      },
      ingredients: parsedIngredients,
      allergens: formData.allergens || [],
      dataSource: 'user_submitted',
      verificationStatus: 'unverified',
      isUserSubmitted: true,
      lastUpdated: new Date().toISOString(),
    };

    // 1. Cache dynamically in memory and sessionStorage
    registerDynamicProduct(productRecord);

    // 2. Add to history
    addToHistory(productRecord);

    // 3. Save to Supabase community catalog if configured
    try {
      await supabaseService.submitCommunityProduct(productRecord, user?.id);
    } catch {
      // Non-blocking
    }

    // 4. Navigate directly to the analysis view
    navigate(`/analysis/${uniqueId}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Notice */}
      <Card className="bg-white border-2 border-brand-border p-6 sm:p-8 shadow-soft-lg space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-warm-light border border-warm flex items-center justify-center shrink-0 text-berry">
            <Package className="w-6 h-6 text-vibrant" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-surface text-berry border border-brand-border">
                {barcode}
              </span>
              <Badge variant="soft" size="sm">
                {format}
              </Badge>
              {gs1Info?.country && (
                <span className="text-xs text-brand-muted">
                  Issuing Registry: <strong className="text-berry">{gs1Info.country}</strong>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-berry">
              We scanned your barcode, but this product isn't in our database yet.
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Help make conscious eating accessible! You can snap photos of the package to auto-fill the details with OCR, or enter them manually.
            </p>
          </div>
        </div>

        {/* Processing State Banner */}
        {isProcessingOcr && (
          <div className="p-4 rounded-xl bg-vibrant/10 border border-vibrant/20 flex items-center gap-3 text-berry animate-pulse">
            <Loader2 className="w-5 h-5 text-vibrant animate-spin" />
            <span className="text-sm font-semibold">{ocrStatusMessage}</span>
          </div>
        )}

        {ocrError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{ocrError}</span>
          </div>
        )}
      </Card>

      {/* Main Options / Review Tabs */}
      {activeStep === 'options' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Front of Pack Photo */}
          <Card className="bg-white border border-brand-border p-5 hover:border-vibrant transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-vibrant">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-berry text-base">Snap Front Package</h3>
              <p className="text-xs text-brand-muted">
                Extracts the product name and brand automatically from the front label using camera OCR.
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleProcessFrontImage}
                disabled={isProcessingOcr}
              />
              <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-xs font-heading font-bold text-berry bg-brand-surface hover:bg-warm border border-brand-border transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload / Snap Front
              </span>
            </label>
          </Card>

          {/* Option 2: Nutrition Facts Label Photo */}
          <Card className="bg-white border border-brand-border p-5 hover:border-vibrant transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-warm-light flex items-center justify-center text-berry">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-berry text-base">Snap Nutrition Panel</h3>
              <p className="text-xs text-brand-muted">
                Reads calories, protein, carbs, sugar, fat, and sodium directly from the nutrition table.
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleProcessNutritionImage}
                disabled={isProcessingOcr}
              />
              <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-xs font-heading font-bold text-berry bg-brand-surface hover:bg-warm border border-brand-border transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload / Snap Nutrition
              </span>
            </label>
          </Card>

          {/* Option 3: Ingredients Label Photo */}
          <Card className="bg-white border border-brand-border p-5 hover:border-vibrant transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-vibrant">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-berry text-base">Snap Ingredients List</h3>
              <p className="text-xs text-brand-muted">
                Parses the ingredient breakdown and automatically flags potential allergens like gluten or dairy.
              </p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleProcessIngredientsImage}
                disabled={isProcessingOcr}
              />
              <span className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-xs font-heading font-bold text-berry bg-brand-surface hover:bg-warm border border-brand-border transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload / Snap Ingredients
              </span>
            </label>
          </Card>

          {/* Option 4: Manual Entry */}
          <Card className="bg-white border border-brand-border p-5 hover:border-vibrant transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-warm-light flex items-center justify-center text-berry">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-berry text-base">Enter Details Manually</h3>
              <p className="text-xs text-brand-muted">
                Type the product name, brand, and key nutrition values directly into a clean, simple form.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setActiveStep('review')}
              className="w-full"
            >
              Fill In Form Manually
            </Button>
          </Card>
        </div>
      )}

      {/* Review & Edit Step */}
      {activeStep === 'review' && (
        <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6 shadow-soft-lg">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">Review & Save Product</h3>
              <p className="text-xs text-brand-muted">
                Verify the extracted information before submitting. Extracted values will be tagged as user-submitted.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveStep('options')}
              className="text-xs text-brand-muted"
            >
              ← Back to Scan Options
            </Button>
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-5">
            {/* Barcode & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-berry mb-1">Barcode</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => handleFieldChange('barcode', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-brand-surface rounded-xl border border-brand-border font-mono focus:outline-none focus:ring-2 focus:ring-vibrant"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-berry mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-vibrant"
                >
                  <option value="Biscuits & Cookies">Biscuits & Cookies</option>
                  <option value="Chips & Namkeen">Chips & Namkeen</option>
                  <option value="Instant Noodles">Instant Noodles</option>
                  <option value="Packaged Beverages">Packaged Beverages</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Breakfast Cereals">Breakfast Cereals</option>
                  <option value="Sauces & Condiments">Sauces & Condiments</option>
                  <option value="Chocolates & Confectionery">Chocolates & Confectionery</option>
                  <option value="Health & Protein Foods">Health & Protein Foods</option>
                  <option value="Packaged Grocery">Packaged Grocery</option>
                </select>
              </div>
            </div>

            {/* Name & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-berry">Product Name *</label>
                  {ocrExtractedFlags.name && (
                    <span className="text-[10px] text-vibrant font-semibold">📷 OCR Extracted</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Masala Munch"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-vibrant"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-berry mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kurkure"
                  value={formData.brand}
                  onChange={(e) => handleFieldChange('brand', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-vibrant"
                />
              </div>
            </div>

            {/* Nutrition Values (per 100g) */}
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-berry uppercase tracking-wider">
                  Nutritional Values (per 100g)
                </span>
                {ocrExtractedFlags.nutrition && (
                  <span className="text-[10px] text-vibrant font-semibold">📷 OCR Extracted</span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-brand-muted mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="450"
                    value={formData.calories}
                    onChange={(e) => handleFieldChange('calories', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="7.5"
                    value={formData.protein}
                    onChange={(e) => handleFieldChange('protein', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Carbohydrates (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="65"
                    value={formData.carbs}
                    onChange={(e) => handleFieldChange('carbs', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Total Sugars (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="22"
                    value={formData.sugars}
                    onChange={(e) => handleFieldChange('sugars', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Total Fat (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="15"
                    value={formData.fat}
                    onChange={(e) => handleFieldChange('fat', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Saturated Fat (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="6.5"
                    value={formData.saturatedFat}
                    onChange={(e) => handleFieldChange('saturatedFat', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Dietary Fiber (g)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="3.2"
                    value={formData.fiber}
                    onChange={(e) => handleFieldChange('fiber', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
                <div>
                  <label className="block text-brand-muted mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="650"
                    value={formData.sodium}
                    onChange={(e) => handleFieldChange('sodium', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-brand-border"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-berry">Declared Ingredients</label>
                {ocrExtractedFlags.ingredients && (
                  <span className="text-[10px] text-vibrant font-semibold">📷 OCR Extracted</span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Wheat flour, Palm oil, Sugar, Salt, Spices..."
                value={formData.ingredientsText}
                onChange={(e) => handleFieldChange('ingredientsText', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-vibrant"
              />
            </div>

            {/* Conscious Score Preview Banner */}
            <div className="p-4 rounded-xl bg-warm/30 border border-warm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-heading font-black text-berry">
                  {calculateHeuristicScore()}
                </span>
                <div>
                  <div className="text-xs font-heading font-bold text-berry">Estimated Conscious Score</div>
                  <div className="text-[11px] text-brand-muted">
                    Based on declared sugar, fat, fiber, and protein balance.
                  </div>
                </div>
              </div>
              <Badge variant="soft" size="sm">
                Unverified Preview
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={CheckCircle2}
                className="w-full sm:flex-1 shadow-vibrant-glow"
              >
                Save & View Full Analysis
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onCancel}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
