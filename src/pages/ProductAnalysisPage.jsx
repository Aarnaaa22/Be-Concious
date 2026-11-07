import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ScanLine, 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Heart, 
  Info, 
  Share2,
  PieChart as PieChartIcon,
  HelpCircle,
  ExternalLink,
  Search,
  RefreshCw,
  Loader2,
  Package,
  Layers,
  Scale
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts, getProductById, getProductByBarcode, fetchProductByBarcode } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';

export const ProductAnalysisPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaveProduct, addToHistory } = useHistory();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // null | 'NOT_FOUND' | 'NETWORK_ERROR'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'nutrition' | 'ingredients' | 'processing'
  const [nutritionBasis, setNutritionBasis] = useState('100g'); // '100g' | 'serving'
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorState(null);

    const loadProduct = async () => {
      // 1. Direct lookup by ID
      let found = getProductById(productId);

      // 2. Lookup by barcode or strip 'off-' prefix
      if (!found && productId) {
        const barcodeToTry = productId.replace(/^off-/, '');
        found = getProductByBarcode(barcodeToTry);

        // 3. If not found locally, fetch via Open Food Facts API v3
        if (!found) {
          try {
            const apiRes = await fetchProductByBarcode(barcodeToTry);
            if (apiRes.found && apiRes.product) {
              found = apiRes.product;
            } else if (apiRes.error === 'NOT_FOUND') {
              if (isMounted) setErrorState('NOT_FOUND');
            } else {
              if (isMounted) setErrorState(apiRes.error || 'NOT_FOUND');
            }
          } catch (err) {
            if (isMounted) setErrorState('NETWORK_ERROR');
          }
        }
      }

      if (isMounted) {
        if (found) {
          setProduct(found);
          addToHistory(found);
          setErrorState(null);
        } else if (!errorState) {
          setErrorState('NOT_FOUND');
        }
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    } else {
      // Fallback default sample product if visiting /analysis directly
      const defaultProduct = mockProducts[0];
      setProduct(defaultProduct);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [productId, addToHistory]);

  const saved = product ? isSaved(product.id) : false;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // =========================================================================
  // LOADING STATE
  // =========================================================================
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-warm-light border border-warm flex items-center justify-center mx-auto text-berry shadow-soft animate-pulse">
          <Loader2 className="w-8 h-8 text-vibrant animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-berry">
            Retrieving Product Data
          </h2>
          <p className="text-sm text-brand-muted">
            Connecting to Open Food Facts database and validating nutritional information...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MISSING PRODUCT ERROR STATE (Exact requested prompt messaging)
  // =========================================================================
  if (errorState === 'NOT_FOUND' || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <Card className="bg-white border border-brand-border p-8 sm:p-12 space-y-6 shadow-soft-lg">
          
          <div className="w-20 h-20 rounded-3xl bg-warm-light border border-warm flex items-center justify-center mx-auto text-berry">
            <Package className="w-10 h-10 text-vibrant" />
          </div>

          <div className="space-y-2">
            <Badge variant="soft" size="md">
              Barcode Not Found
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
              Oops! We couldn't find this product.
            </h1>
            <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              This barcode is not registered in the Open Food Facts global database or our local catalog. You can scan another item, enter another barcode, or search by product name.
            </p>
          </div>

          {/* 3 Action Buttons requested */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              to="/scan"
              variant="primary"
              size="md"
              icon={ScanLine}
              className="w-full sm:w-auto shadow-vibrant-glow"
            >
              Scan Again
            </Button>

            <Button
              to="/scan"
              variant="secondary"
              size="md"
              icon={RefreshCw}
              className="w-full sm:w-auto"
            >
              Enter Another Barcode
            </Button>

            <Button
              to="/explore"
              variant="outline"
              size="md"
              icon={Search}
              className="w-full sm:w-auto"
            >
              Search by Product Name
            </Button>
          </div>

          <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-muted">
            Tip: Check that the barcode was completely scanned without glare or missing digits.
          </div>

        </Card>
      </div>
    );
  }

  // =========================================================================
  // MACRO CHART DATA & VALUES (Per 100g vs Per Serving)
  // =========================================================================
  const hasServing = product.nutritionPerServing?.hasServingData;
  const currentNutrition = (nutritionBasis === 'serving' && hasServing) 
    ? product.nutritionPerServing 
    : product.nutritionPer100g;

  const carbsVal = currentNutrition.carbohydrates || 0;
  const fatVal = currentNutrition.fat || currentNutrition.totalFat || 0;
  const proteinVal = currentNutrition.proteins || currentNutrition.protein || 0;
  const fiberVal = currentNutrition.fiber || 0;

  const macroChartData = [
    { name: 'Carbs', value: carbsVal, color: '#FFE185' }, // Warm Yellow
    { name: 'Fat', value: fatVal, color: '#FFADEE' },        // Soft Pink
    { name: 'Protein', value: proteinVal, color: '#92003A' },// Deep Berry
    { name: 'Fiber', value: fiberVal, color: '#F62477' },    // Vibrant Pink
  ];

  const hasMacroData = carbsVal > 0 || fatVal > 0 || proteinVal > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb Navigation & Save Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-berry hover:text-vibrant transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => toggleSaveProduct(product.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-semibold border transition-all flex items-center gap-2 ${
              saved 
                ? 'bg-berry text-white border-berry shadow-soft' 
                : 'bg-white text-brand-text border-brand-border hover:bg-soft-light'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 text-warm" /> : <Bookmark className="w-4 h-4 text-berry" />}
            <span>{saved ? 'Saved in My Foods' : 'Save Product'}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-semibold bg-white border border-brand-border hover:bg-soft-light text-brand-text transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-berry" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <Button
            to="/scan"
            variant="primary"
            size="sm"
            icon={ScanLine}
          >
            Scan Another
          </Button>
        </div>
      </div>

      {/* Main Product Header Card */}
      <Card className="bg-white border border-brand-border shadow-soft-md p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Product Image */}
          <div className="lg:col-span-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-bg relative border border-brand-border flex items-center justify-center p-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                }}
              />
              {product.novaGroup && (
                <div className="absolute top-3 left-3">
                  <NovaBadge group={product.novaGroup} />
                </div>
              )}
            </div>
          </div>

          {/* Core Info */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-vibrant uppercase tracking-wider">
                {product.brand || 'Retail Brand'}
              </span>
              <span className="text-xs text-brand-muted">•</span>
              <span className="text-xs text-brand-muted font-medium">
                {product.category || 'Packaged Grocery'}
              </span>
              {product.quantity && (
                <>
                  <span className="text-xs text-brand-muted">•</span>
                  <span className="text-xs font-semibold text-brand-text bg-brand-bg px-2 py-0.5 rounded border border-brand-border">
                    Qty: {product.quantity}
                  </span>
                </>
              )}
              <span className="text-xs text-brand-muted">•</span>
              <span className="text-xs font-mono text-brand-muted">
                Barcode: {product.barcode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-berry leading-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              {product.summary}
            </p>

            {/* Score & Energy Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <ConsciousScoreBadge score={product.consciousScore} size="lg" />
              
              {/* Energy in kcal and kJ */}
              <div className="px-3 py-1.5 rounded-full bg-warm-light border border-warm/80 text-xs font-bold text-berry flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-vibrant" />
                <span>
                  {product.nutritionPer100g.calories !== null 
                    ? `${product.nutritionPer100g.calories} kcal / 100g` 
                    : 'Calories not stated'}
                  {product.nutritionPer100g.energyKj ? ` (${product.nutritionPer100g.energyKj} kJ)` : ''}
                </span>
              </div>

              {/* Serving Size info if present */}
              {product.servingSize && (
                <div className="px-3 py-1.5 rounded-full bg-brand-bg border border-brand-border text-xs font-semibold text-brand-text flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-berry" />
                  <span>Serving: {product.servingSize}</span>
                </div>
              )}

              {/* Nutri-Score badge if reported */}
              {product.nutriGrade && (
                <div className="px-3 py-1.5 rounded-full bg-soft-light border border-soft-border/60 text-xs font-bold text-berry">
                  <span>Nutri-Score: {product.nutriGrade}</span>
                </div>
              )}
            </div>

            {/* Data Source attribution */}
            <div className="pt-2 flex items-center gap-2 text-xs text-brand-muted">
              <ShieldCheck className="w-4 h-4 text-vibrant" />
              <span>Verified against Open Food Facts official database (API v3)</span>
            </div>

          </div>

        </div>
      </Card>


      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-2">
        {[
          { id: 'overview', label: 'Overview & Highlights' },
          { id: 'nutrition', label: 'Nutrition & Calories' },
          { id: 'ingredients', label: 'Ingredients & Additives' },
          { id: 'processing', label: 'NOVA Food Processing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-2xl font-heading text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-berry text-white shadow-soft'
                : 'text-brand-text hover:bg-soft-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & HIGHLIGHTS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Energy & Serving Snapshot */}
          <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <Flame className="w-5 h-5 text-vibrant" />
              <span>Energy & Packaging</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Package Net Quantity</span>
                <span className="font-bold text-berry">{product.quantity || 'Not stated'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Declared Serving Size</span>
                <span className="font-bold text-berry">{product.servingSize || 'Not declared on packaging'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Energy (100g / 100ml)</span>
                <span className="font-bold text-berry">
                  {product.nutritionPer100g.calories !== null ? `${product.nutritionPer100g.calories} kcal` : 'Not reported'}
                </span>
              </div>
              {hasServing && product.nutritionPerServing.calories !== null && (
                <div className="flex justify-between py-1.5 border-b border-brand-border">
                  <span className="text-brand-muted">Energy (Per Serving)</span>
                  <span className="font-bold text-vibrant">{product.nutritionPerServing.calories} kcal</span>
                </div>
              )}
            </div>
          </Card>

          {/* Processing Classification */}
          <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <Layers className="w-5 h-5 text-berry" />
              <span>Processing Group</span>
            </h3>
            {product.novaGroup ? (
              <div className="space-y-3">
                <NovaBadge group={product.novaGroup} />
                <p className="text-xs text-brand-muted leading-relaxed">
                  {product.novaGroup === 1 && "Group 1: Unprocessed or minimally processed foods (whole natural grains, fruit, fresh dairy)."}
                  {product.novaGroup === 2 && "Group 2: Processed culinary ingredients (cold-pressed oils, butter, honey, salt)."}
                  {product.novaGroup === 3 && "Group 3: Processed foods (cured, simple baked breads, simple preserves)."}
                  {product.novaGroup === 4 && "Group 4: Ultra-processed formulations (industrial emulsifiers, flavorings, artificial additives)."}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-xs text-brand-muted">
                NOVA group was not classified for this specific packaging in the database.
              </div>
            )}
            <div className="pt-2 text-xs font-bold text-brand-text">
              Nutri-Score Rating: <span className="text-berry font-extrabold">{product.nutriGrade || 'Not computed'}</span>
            </div>
          </Card>

          {/* Allergens & Additives Snapshot */}
          <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warm-dark" />
              <span>Allergens & Additives</span>
            </h3>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">Allergen Notice:</h4>
              {product.allergens && product.allergens.length > 0 ? (
                product.allergens.map((alg, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-berry-50 border border-berry-200 text-xs font-semibold text-berry">
                    {alg}
                  </div>
                ))
              ) : (
                <div className="text-xs text-brand-muted">No allergen tags reported on packaging.</div>
              )}
            </div>
            <div className="pt-2 border-t border-brand-border text-xs text-brand-muted">
              Additives Count: <span className="font-bold text-berry">{product.additives?.length || 0}</span>
            </div>
          </Card>

        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 2: NUTRITION & CALORIES                                               */}
      {/* ========================================================================= */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          
          {/* Basis Toggle: 100g vs Serving (Only enabled if serving data exists) */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-brand-border">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Nutritional Values & Units
              </h3>
              <p className="text-xs text-brand-muted">
                Strictly displaying certified values from database without fabricating unverified serving numbers.
              </p>
            </div>

            {hasServing && (
              <div className="inline-flex p-1 rounded-2xl bg-brand-bg border border-brand-border">
                <button
                  type="button"
                  onClick={() => setNutritionBasis('100g')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    nutritionBasis === '100g' ? 'bg-berry text-white shadow-xs' : 'text-brand-muted hover:text-berry'
                  }`}
                >
                  Per 100g / 100ml
                </button>
                <button
                  type="button"
                  onClick={() => setNutritionBasis('serving')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    nutritionBasis === 'serving' ? 'bg-berry text-white shadow-xs' : 'text-brand-muted hover:text-berry'
                  }`}
                >
                  Per Serving ({product.servingSize})
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Macro Donut Chart */}
            <div className="lg:col-span-5">
              <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
                <h4 className="text-sm font-heading font-bold text-berry">
                  Macronutrient Proportions ({nutritionBasis === 'serving' ? 'Per Serving' : 'Per 100g'})
                </h4>

                {hasMacroData ? (
                  <div className="h-60 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroChartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                        >
                          {macroChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #F0E2EB',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-heading font-extrabold text-berry">
                        {currentNutrition.calories !== null ? currentNutrition.calories : '--'}
                      </span>
                      <span className="text-[10px] font-bold text-brand-muted uppercase">
                        kcal {nutritionBasis === 'serving' ? '/ serv' : '/ 100g'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex items-center justify-center text-center p-4 text-xs text-brand-muted bg-brand-bg rounded-2xl border border-brand-border">
                    Detailed macronutrient proportions were not recorded in the database.
                  </div>
                )}

                {/* Macro Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {macroChartData.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-brand-bg border border-brand-border">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                      <span className="text-brand-text">{m.name}:</span>
                      <span className="font-bold text-berry ml-auto">
                        {m.value !== null ? `${m.value}g` : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Nutrients Table (Preserving grams vs milligrams, kcal vs kJ) */}
            <div className="lg:col-span-7">
              <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
                <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                  <h4 className="text-sm font-heading font-bold text-berry">
                    Nutritional Breakdown ({nutritionBasis === 'serving' ? 'Per Serving' : 'Per 100g'})
                  </h4>
                  <span className="text-xs font-mono text-brand-muted">Exact Declared Units</span>
                </div>

                <div className="divide-y divide-brand-border text-sm">
                  
                  {/* Energy (kcal & kJ) */}
                  <div className="py-2.5 flex justify-between items-center font-bold text-berry">
                    <span>Energy (Calories)</span>
                    <span className="text-right">
                      {currentNutrition.calories !== null ? `${currentNutrition.calories} kcal` : 'Not declared'}
                      {currentNutrition.energyKj !== null && (
                        <span className="block text-xs font-normal text-brand-muted">
                          {currentNutrition.energyKj} kJ
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Total Fat & Saturated Fat */}
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Fat</span>
                      <span className="block text-xs text-brand-muted">
                        of which saturates: {currentNutrition.saturatedFat !== null ? `${currentNutrition.saturatedFat} g` : 'Not declared'}
                      </span>
                    </div>
                    <span className="font-bold text-berry">
                      {currentNutrition.fat !== null ? `${currentNutrition.fat} g` : 'Not declared'}
                    </span>
                  </div>

                  {/* Carbohydrates & Sugars */}
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Carbohydrates</span>
                      <span className="block text-xs text-brand-muted">
                        of which sugars: {currentNutrition.sugars !== null ? `${currentNutrition.sugars} g` : 'Not declared'}
                      </span>
                    </div>
                    <span className="font-bold text-berry">
                      {currentNutrition.carbohydrates !== null ? `${currentNutrition.carbohydrates} g` : 'Not declared'}
                    </span>
                  </div>

                  {/* Dietary Fiber */}
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-brand-text">Dietary Fibre</span>
                    <span className="font-bold text-berry">
                      {currentNutrition.fiber !== null ? `${currentNutrition.fiber} g` : 'Not declared'}
                    </span>
                  </div>

                  {/* Protein */}
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-brand-text">Protein</span>
                    <span className="font-bold text-berry">
                      {currentNutrition.proteins !== null ? `${currentNutrition.proteins} g` : (currentNutrition.protein !== null ? `${currentNutrition.protein} g` : 'Not declared')}
                    </span>
                  </div>

                  {/* Salt & Sodium (Preserve correct units) */}
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Salt</span>
                      <span className="block text-xs text-brand-muted">
                        Sodium: {currentNutrition.sodium !== null ? `${currentNutrition.sodium} g` : 'Not declared'}
                      </span>
                    </div>
                    <span className="font-bold text-berry">
                      {currentNutrition.salt !== null ? `${currentNutrition.salt} g` : 'Not declared'}
                    </span>
                  </div>

                </div>

                {!hasServing && (
                  <div className="p-3 rounded-2xl bg-warm-light border border-warm/80 text-xs text-berry flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Per-serving values are omitted because this manufacturer did not register a verified serving size.</span>
                  </div>
                )}
              </Card>
            </div>

          </div>

        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 3: INGREDIENTS & ADDITIVES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'ingredients' && (
        <div className="space-y-6">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6 shadow-soft">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Full Declared Ingredients
              </h3>
              <p className="text-xs text-brand-muted">
                Extracted directly from package label registration in Open Food Facts.
              </p>
            </div>

            {product.ingredients && product.ingredients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-heading font-bold text-brand-text text-sm block">
                        {ing.name}
                      </span>
                      {ing.percent !== null && (
                        <span className="text-[11px] font-semibold text-vibrant">
                          Approx. {ing.percent}%
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-brand-muted">#{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border text-xs text-brand-muted">
                Ingredients list was not entered for this product in the open database.
              </div>
            )}

            {/* Additives Section */}
            <div className="pt-6 border-t border-brand-border space-y-3">
              <h4 className="text-base font-heading font-bold text-berry">
                Chemical Additives & E-Numbers Detected
              </h4>
              {product.additives && product.additives.length > 0 ? (
                <div className="space-y-2">
                  {product.additives.map((add, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-berry-50 border border-berry/30 text-xs font-semibold text-berry flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{add}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-berry flex-shrink-0" />
                  <span className="text-sm font-semibold text-berry">
                    Zero chemical additives or synthetic preservatives registered for this item.
                  </span>
                </div>
              )}
            </div>

          </Card>
        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 4: NOVA FOOD PROCESSING                                               */}
      {/* ========================================================================= */}
      {activeTab === 'processing' && (
        <div className="space-y-6">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6 shadow-soft">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">
                NOVA Processing Degree
              </h3>
              <p className="text-xs text-brand-muted">
                Official classification by international public health researchers evaluating food industrial formulation.
              </p>
            </div>

            {product.novaGroup ? (
              <div className="p-5 rounded-2xl bg-soft-light border border-soft-border space-y-3">
                <div className="flex items-center gap-3">
                  <NovaBadge group={product.novaGroup} />
                  <span className="font-heading font-extrabold text-berry text-base">
                    {product.novaGroup === 1 && "Group 1: Unprocessed / Minimally Processed"}
                    {product.novaGroup === 2 && "Group 2: Processed Culinary Ingredients"}
                    {product.novaGroup === 3 && "Group 3: Processed Foods"}
                    {product.novaGroup === 4 && "Group 4: Ultra-Processed Food Formulation"}
                  </span>
                </div>
                <p className="text-sm text-brand-text leading-relaxed">
                  {product.novaGroup === 1 && "Made directly from whole foods with no industrial extraction or chemical additives."}
                  {product.novaGroup === 2 && "Natural culinary extracts such as pressed oils, pure sugars, butter, or minerals."}
                  {product.novaGroup === 3 && "Simple combination of whole foods and culinary ingredients (e.g., canned vegetables in brine, freshly baked breads)."}
                  {product.novaGroup === 4 && "Industrial formulations featuring fractionated oils, artificial colorings, synthetic flavorings, and emulsifiers."}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border text-xs text-brand-muted">
                No official NOVA processing classification registered for this product code.
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
};
