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
  HelpCircle, 
  Search, 
  RefreshCw, 
  Loader2, 
  Package, 
  Layers, 
  Scale,
  Zap,
  Droplet,
  ChevronDown,
  ChevronUp,
  BarChart2,
  SlidersHorizontal,
  X,
  ExternalLink,
  Check,
  Award
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { IngredientDetective } from '../components/product/IngredientDetective';
import { mockProducts, getProductById, getProductByBarcode, fetchProductByBarcode } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';

export const ProductAnalysisPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaveProduct, addToHistory, history } = useHistory();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // null | 'NOT_FOUND' | 'NETWORK_ERROR'
  const [nutritionBasis, setNutritionBasis] = useState('100g'); // '100g' | 'serving'
  const [copiedLink, setCopiedLink] = useState(false);

  // Progressive disclosure accordions
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Comparison Drawer / Modal State
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareTarget, setCompareTarget] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorState(null);

    const loadProduct = async () => {
      let found = getProductById(productId);

      if (!found && productId) {
        const barcodeToTry = productId.replace(/^off-/, '');
        found = getProductByBarcode(barcodeToTry);

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
          // Set initial comparison target from other products
          const candidate = mockProducts.find(p => p.id !== found.id) || mockProducts[0];
          setCompareTarget(candidate);
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
      const defaultProduct = mockProducts[0];
      setProduct(defaultProduct);
      setCompareTarget(mockProducts[1]);
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
            Loading Food Intelligence...
          </h2>
          <p className="text-sm text-brand-muted">
            Validating real nutritional facts and processing insights...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MISSING PRODUCT ERROR STATE
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
              This barcode is not registered in the Open Food Facts global database or our local catalog.
            </p>
          </div>

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
        </Card>
      </div>
    );
  }

  // =========================================================================
  // NUTRITIONAL BASIS SELECTION
  // =========================================================================
  const hasServing = product.nutritionPerServing?.hasServingData;
  const currentNutrients = (nutritionBasis === 'serving' && hasServing) 
    ? product.nutritionPerServing 
    : product.nutritionPer100g;

  // Extract core quick summary values
  const calVal = currentNutrients.calories !== null ? currentNutrients.calories : null;
  const proteinVal = currentNutrients.proteins !== null ? currentNutrients.proteins : (currentNutrients.protein !== null ? currentNutrients.protein : null);
  const sugarVal = currentNutrients.sugars !== null ? currentNutrients.sugars : null;
  const fatVal = currentNutrients.fat !== null ? currentNutrients.fat : (currentNutrients.totalFat !== null ? currentNutrients.totalFat : null);

  // Check data sufficiency for Conscious Score
  const hasSufficientScoreData = calVal !== null || sugarVal !== null || product.novaGroup !== null;

  // Generate short, friendly "Things Worth Knowing" food observations based on real data
  const observations = [];
  if (currentNutrients.fiber && currentNutrients.fiber >= 5) {
    observations.push({
      icon: '🌱',
      title: 'High in Dietary Fibre',
      text: `Provides ${currentNutrients.fiber}g of fibre, supporting digestion and sustained energy release.`
    });
  }
  if (proteinVal && proteinVal >= 10) {
    observations.push({
      icon: '💪',
      title: 'Good Protein Content',
      text: `Offers ${proteinVal}g of protein to help build and repair muscle tissue and promote satiety.`
    });
  }
  if (sugarVal !== null) {
    if (sugarVal <= 4) {
      observations.push({
        icon: '🌿',
        title: 'Naturally Low in Sugar',
        text: `Contains only ${sugarVal}g of sugar, making it an easy everyday choice for steady glucose balance.`
      });
    } else if (sugarVal >= 25) {
      observations.push({
        icon: '🍯',
        title: 'High Sugar Proportion',
        text: `Features ${sugarVal}g of sugar. Ideal enjoyed mindfully as an occasional treat rather than a primary staple.`
      });
    }
  }
  if (product.novaGroup === 1) {
    observations.push({
      icon: '✨',
      title: 'Minimally Processed (NOVA 1)',
      text: 'Made from whole natural foods close to their harvested state with no industrial reformulations.'
    });
  } else if (product.novaGroup === 4) {
    observations.push({
      icon: '🏭',
      title: 'Ultra-Processed Formulation (NOVA 4)',
      text: 'Manufactured using industrial additives, modified fats, or synthetic flavoring compounds.'
    });
  }
  if (product.additives && product.additives.length === 0) {
    observations.push({
      icon: '🎉',
      title: 'Zero Chemical Additives',
      text: 'No synthetic artificial colors, chemical emulsifiers, or preservatives reported on the label.'
    });
  }

  // Fallback if very few observations
  if (observations.length === 0) {
    observations.push({
      icon: '🥗',
      title: 'Balanced Pantry Item',
      text: 'Check the ingredient list and serving portions to fit this product into your daily meal routine.'
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Breadcrumb & Share Navigation */}
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


      {/* ========================================================================= */}
      {/* SECTION 1: PRODUCT OVERVIEW                                               */}
      {/* ========================================================================= */}
      <section>
        <Card className="bg-white border border-brand-border shadow-soft-md p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Product Image */}
            <div className="lg:col-span-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-brand-bg relative border border-brand-border flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
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

            {/* Product Identifiers & Actions */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-vibrant uppercase tracking-wider">
                  {product.brand || 'Retail Brand'}
                </span>
                <span className="text-brand-muted">•</span>
                <span className="text-brand-muted font-medium">
                  {product.category || 'Packaged Grocery'}
                </span>
                {product.quantity && (
                  <>
                    <span className="text-brand-muted">•</span>
                    <span className="font-semibold text-brand-text bg-brand-bg px-2.5 py-0.5 rounded-full border border-brand-border">
                      Qty: {product.quantity}
                    </span>
                  </>
                )}
                <span className="text-brand-muted">•</span>
                <span className="font-mono text-brand-muted">
                  Barcode: {product.barcode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-berry leading-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                {product.summary}
              </p>

              {/* Serving Size & Declared Portion Indicator */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="px-3.5 py-1.5 rounded-2xl bg-warm-light border border-warm/80 text-xs font-semibold text-berry flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-vibrant" />
                  <span>
                    {product.servingSize 
                      ? `Serving Size: ${product.servingSize}` 
                      : 'Serving Size: Not specified on packaging'}
                  </span>
                </div>

                {product.nutriGrade && (
                  <div className="px-3 py-1.5 rounded-2xl bg-soft-light border border-soft-border/60 text-xs font-bold text-berry">
                    Nutri-Score Grade {product.nutriGrade}
                  </div>
                )}
              </div>

              {/* Primary Action Buttons: Save Product & Scan Another */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => toggleSaveProduct(product.id)}
                  className={`px-5 py-3 rounded-2xl font-heading text-sm font-bold border transition-all flex items-center gap-2 shadow-soft ${
                    saved 
                      ? 'bg-berry text-white border-berry shadow-soft-md' 
                      : 'bg-white text-brand-text border-brand-border hover:bg-soft-light'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-4 h-4 text-warm" /> : <Bookmark className="w-4 h-4 text-berry" />}
                  <span>{saved ? 'Saved in My Foods' : 'Save Product'}</span>
                </button>

                <Button
                  to="/scan"
                  variant="primary"
                  size="md"
                  icon={ScanLine}
                  className="shadow-vibrant-glow"
                >
                  Scan Another
                </Button>

                <button
                  type="button"
                  onClick={() => setIsCompareOpen(true)}
                  className="px-5 py-3 rounded-2xl font-heading text-sm font-bold bg-brand-bg hover:bg-soft-light border border-brand-border text-berry transition-colors flex items-center gap-2"
                >
                  <BarChart2 className="w-4 h-4 text-vibrant" />
                  <span>Compare Products</span>
                </button>
              </div>

            </div>

          </div>
        </Card>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 2: QUICK NUTRITION SUMMARY                                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-berry">
              Quick Nutrition Summary
            </h2>
            <p className="text-xs text-brand-muted">
              Displaying values {nutritionBasis === 'serving' && hasServing ? `per serving (${product.servingSize})` : 'per 100g / 100ml'}
            </p>
          </div>

          {/* Basis Switcher */}
          {hasServing && (
            <div className="inline-flex p-1 rounded-2xl bg-white border border-brand-border shadow-xs">
              <button
                type="button"
                onClick={() => setNutritionBasis('100g')}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  nutritionBasis === '100g' ? 'bg-berry text-white shadow-xs' : 'text-brand-muted hover:text-berry'
                }`}
              >
                Per 100g
              </button>
              <button
                type="button"
                onClick={() => setNutritionBasis('serving')}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  nutritionBasis === 'serving' ? 'bg-berry text-white shadow-xs' : 'text-brand-muted hover:text-berry'
                }`}
              >
                Per Serving
              </button>
            </div>
          )}
        </div>

        {/* 4 Attractive Cards with Subtle Pink and Yellow Accents */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* 1. Calories */}
          <Card className="bg-white border border-soft-border/50 hover:border-vibrant/40 p-5 sm:p-6 shadow-soft transition-all space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-warm-light rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider">
                Energy
              </span>
              <div className="w-8 h-8 rounded-xl bg-warm-light border border-warm/80 flex items-center justify-center text-berry">
                <Flame className="w-4 h-4 text-vibrant" />
              </div>
            </div>
            <div className="relative z-10 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
                  {calVal !== null ? calVal : '--'}
                </span>
                <span className="text-xs font-bold text-brand-muted">kcal</span>
              </div>
              <p className="text-[11px] text-brand-muted mt-1">
                {currentNutrients.energyKj ? `${currentNutrients.energyKj} kJ equivalent` : 'Standard energy basis'}
              </p>
            </div>
          </Card>

          {/* 2. Protein */}
          <Card className="bg-white border border-soft-border/50 hover:border-vibrant/40 p-5 sm:p-6 shadow-soft transition-all space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-soft-light rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider">
                Protein
              </span>
              <div className="w-8 h-8 rounded-xl bg-soft-light border border-soft-border flex items-center justify-center text-berry">
                <Zap className="w-4 h-4 text-berry" />
              </div>
            </div>
            <div className="relative z-10 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
                  {proteinVal !== null ? proteinVal : '--'}
                </span>
                <span className="text-xs font-bold text-brand-muted">g</span>
              </div>
              <p className="text-[11px] text-brand-muted mt-1">
                Cellular repair & satiety
              </p>
            </div>
          </Card>

          {/* 3. Sugar */}
          <Card className="bg-white border border-soft-border/50 hover:border-vibrant/40 p-5 sm:p-6 shadow-soft transition-all space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-warm-light rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider">
                Sugars
              </span>
              <div className="w-8 h-8 rounded-xl bg-warm-light border border-warm/80 flex items-center justify-center text-berry">
                <Droplet className="w-4 h-4 text-warm-dark" />
              </div>
            </div>
            <div className="relative z-10 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
                  {sugarVal !== null ? sugarVal : '--'}
                </span>
                <span className="text-xs font-bold text-brand-muted">g</span>
              </div>
              <p className="text-[11px] text-brand-muted mt-1">
                Natural & added sweetening
              </p>
            </div>
          </Card>

          {/* 4. Fat */}
          <Card className="bg-white border border-soft-border/50 hover:border-vibrant/40 p-5 sm:p-6 shadow-soft transition-all space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-soft-light rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:scale-110 transition-transform" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider">
                Total Fat
              </span>
              <div className="w-8 h-8 rounded-xl bg-soft-light border border-soft-border flex items-center justify-center text-berry">
                <Heart className="w-4 h-4 text-vibrant" />
              </div>
            </div>
            <div className="relative z-10 pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
                  {fatVal !== null ? fatVal : '--'}
                </span>
                <span className="text-xs font-bold text-brand-muted">g</span>
              </div>
              <p className="text-[11px] text-brand-muted mt-1">
                Essential lipids & oils
              </p>
            </div>
          </Card>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 3: CONSCIOUS FOOD INSIGHTS                                        */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div>
          <Badge variant="soft" size="md">
            Scientific & Holistic View
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1">
            Let's Look a Little Closer!
          </h2>
          <p className="text-sm text-brand-muted">
            Understanding official scientific processing indices alongside our transparent community balance score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Official Nutri-Score */}
          <Card className="bg-white border border-brand-border p-6 space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-muted">
                Official Standard
              </span>
              <Award className="w-4 h-4 text-vibrant" />
            </div>
            <h3 className="text-lg font-heading font-bold text-berry">
              Nutri-Score Indicator
            </h3>
            {product.nutriGrade ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-warm-light border border-warm text-berry font-heading font-extrabold text-lg">
                  <span>Grade {product.nutriGrade}</span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">
                  The official French & European nutritional quality classification evaluating favorable nutrients (fiber, protein, fruit/veg) against energy, sugar, and saturated fat.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-xs text-brand-muted">
                Not officially calculated for this product in the registry.
              </div>
            )}
          </Card>

          {/* Card 2: Official NOVA Processing */}
          <Card className="bg-white border border-brand-border p-6 space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-muted">
                Scientific Index
              </span>
              <Layers className="w-4 h-4 text-berry" />
            </div>
            <h3 className="text-lg font-heading font-bold text-berry">
              NOVA Processing Group
            </h3>
            {product.novaGroup ? (
              <div className="space-y-3">
                <NovaBadge group={product.novaGroup} />
                <p className="text-xs text-brand-muted leading-relaxed">
                  {product.novaGroup === 1 && "Group 1: Natural, whole, or minimally altered ingredients (e.g. grains, pasteurized milk, dried berries)."}
                  {product.novaGroup === 2 && "Group 2: Processed culinary ingredients derived directly from nature (e.g. oils, butter, salt, sugar)."}
                  {product.novaGroup === 3 && "Group 3: Processed foods created by combining foods and culinary ingredients (e.g. freshly baked bread, cheese)."}
                  {product.novaGroup === 4 && "Group 4: Ultra-processed industrial formulations featuring fractionated oils, colorings, and emulsifiers."}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-brand-bg border border-brand-border text-xs text-brand-muted">
                No NOVA group registered for this specific packaging.
              </div>
            )}
          </Card>

          {/* Card 3: Transparent Community Conscious Score */}
          <Card className="bg-white border border-brand-border p-6 space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-muted">
                Holistic Reference
              </span>
              <Sparkles className="w-4 h-4 text-vibrant" />
            </div>
            <h3 className="text-lg font-heading font-bold text-berry">
              Conscious Balance Score
            </h3>

            {hasSufficientScoreData ? (
              <div className="space-y-3">
                <ConsciousScoreBadge score={product.consciousScore} size="lg" />
                <p className="text-xs text-brand-muted leading-relaxed">
                  A community reference evaluating processing degree, fiber density, and natural vs refined sweetening.
                </p>
                <button
                  type="button"
                  onClick={() => setShowFormulaModal(!showFormulaModal)}
                  className="text-xs font-bold text-vibrant hover:underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showFormulaModal ? 'Hide Calculation Formula' : 'View Scoring Methodology'}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-warm-light border border-warm/80 text-xs text-berry font-medium">
                Not enough information to calculate an accurate conscious score.
              </div>
            )}
          </Card>

        </div>

        {/* Expandable Scoring Methodology Box */}
        {showFormulaModal && (
          <div className="p-5 rounded-3xl bg-soft-light/70 border border-soft-border text-xs text-brand-text space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-soft-border/50">
              <h4 className="font-heading font-bold text-berry text-sm">
                Transparent Conscious Score Formula (Out of 100)
              </h4>
              <span className="text-[11px] text-brand-muted">
                *Not an official medical or regulatory rating
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
              <div>
                <p className="font-bold text-berry mb-1">• Base Score: 70 Points</p>
                <p className="text-brand-muted">Every food begins with a balanced baseline score before adjustments.</p>
                <p className="font-bold text-berry mt-2">• NOVA Processing Adjustment:</p>
                <p className="text-brand-muted">Group 1 (+20 pts) | Group 2 (+10 pts) | Group 3 (-5 pts) | Group 4 (-25 pts)</p>
              </div>
              <div>
                <p className="font-bold text-berry mb-1">• Nutrient Density Bonuses & Deductions:</p>
                <p className="text-brand-muted">• Sugars: -15 pts if &gt;20g/100g, +5 pts if &lt;5g/100g.</p>
                <p className="text-brand-muted">• Fibre Bonus: +8 pts if &gt;=6g/100g.</p>
                <p className="text-brand-muted">• Additives: -4 pts per chemical additive (max -20 pts).</p>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* SECTION 4: NUTRITION BREAKDOWN                                            */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-berry">
              Nutrition Breakdown
            </h2>
            <p className="text-xs text-brand-muted">
              Clean visual meters with exact declared units ({nutritionBasis === 'serving' && hasServing ? `Per Serving: ${product.servingSize}` : 'Per 100g / 100ml'})
            </p>
          </div>

          {/* Basis Toggle */}
          {hasServing && (
            <div className="inline-flex p-1 rounded-2xl bg-white border border-brand-border shadow-xs">
              <button
                type="button"
                onClick={() => setNutritionBasis('100g')}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  nutritionBasis === '100g' ? 'bg-berry text-white shadow-xs' : 'text-brand-muted hover:text-berry'
                }`}
              >
                Per 100g
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

        <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-5 shadow-soft">
          
          <div className="space-y-4 divide-y divide-brand-border/60">
            
            {/* 1. Energy */}
            <div className="pt-2 first:pt-0 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-brand-text">Energy (Calories)</span>
                <span className="font-heading font-extrabold text-berry">
                  {currentNutrients.calories !== null ? `${currentNutrients.calories} kcal` : 'Not declared'}
                  {currentNutrients.energyKj ? ` (${currentNutrients.energyKj} kJ)` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-vibrant rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.calories || 0) / 600) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 2. Carbohydrates */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-brand-text">Carbohydrates</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.carbohydrates !== null ? `${currentNutrients.carbohydrates} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-warm rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.carbohydrates || 0) / 80) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 3. Sugars */}
            <div className="pt-3 space-y-1.5 pl-3 border-l-2 border-warm">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-brand-muted">↳ of which Sugars</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.sugars !== null ? `${currentNutrients.sugars} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-warm-accent rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.sugars || 0) / 50) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 4. Total Fat */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-brand-text">Total Fat</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.fat !== null ? `${currentNutrients.fat} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-soft-deep rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.fat || 0) / 50) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 5. Saturated Fat */}
            <div className="pt-3 space-y-1.5 pl-3 border-l-2 border-soft">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-brand-muted">↳ of which Saturated Fat</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.saturatedFat !== null ? `${currentNutrients.saturatedFat} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-soft rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.saturatedFat || 0) / 20) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 6. Fibre */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-brand-text">Dietary Fibre</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.fiber !== null ? `${currentNutrients.fiber} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-vibrant rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.fiber || 0) / 15) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 7. Protein */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-brand-text">Protein</span>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.proteins !== null ? `${currentNutrients.proteins} g` : (currentNutrients.protein !== null ? `${currentNutrients.protein} g` : 'Not declared')}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-berry rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (((currentNutrients.proteins || currentNutrients.protein) || 0) / 30) * 100)}%` }} 
                />
              </div>
            </div>

            {/* 8. Salt & Sodium */}
            <div className="pt-3 space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <div>
                  <span className="text-brand-text">Salt</span>
                  {currentNutrients.sodium !== null && (
                    <span className="block text-xs font-normal text-brand-muted">
                      Sodium: {currentNutrients.sodium} g
                    </span>
                  )}
                </div>
                <span className="font-heading font-bold text-berry">
                  {currentNutrients.salt !== null ? `${currentNutrients.salt} g` : 'Not declared'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                <div 
                  className="h-full bg-berry-light rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentNutrients.salt || 0) / 3) * 100)}%` }} 
                />
              </div>
            </div>

          </div>

          {!hasServing && (
            <div className="p-3.5 rounded-2xl bg-warm-light border border-warm/80 text-xs text-berry flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Per-serving values are hidden because the package does not register a verified serving size.</span>
            </div>
          )}

        </Card>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 5: INGREDIENT DETECTIVE (ENHANCED)                                 */}
      {/* ========================================================================= */}
      <IngredientDetective product={product} />


      {/* ========================================================================= */}
      {/* SECTION 6: FOOD INSIGHTS                                                  */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div>
          <Badge variant="soft" size="md">
            Helpful Takeaways
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1">
            Things Worth Knowing
          </h2>
          <p className="text-sm text-brand-muted">
            Short, understandable observations written in friendly language—no guilt, just honest facts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {observations.map((item, idx) => (
            <Card
              key={idx}
              className="bg-white border border-brand-border p-5 space-y-2.5 shadow-soft hover:shadow-soft-md transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-heading font-bold text-berry text-sm">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                {item.text}
              </p>
            </Card>
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 7: ACTIONS                                                        */}
      {/* ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-warm-light border border-warm/80 text-center space-y-6 shadow-soft">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-heading font-extrabold text-berry">
            Ready to Take the Next Step?
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Keep this item handy in your personal food log, compare it against wholesome alternatives, or scan another grocery item.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => toggleSaveProduct(product.id)}
            className={`px-6 py-3.5 rounded-2xl font-heading text-sm font-bold border transition-all flex items-center gap-2 ${
              saved 
                ? 'bg-berry text-white border-berry shadow-soft' 
                : 'bg-white text-brand-text border-brand-border hover:bg-soft-light shadow-soft'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 text-warm" /> : <Bookmark className="w-4 h-4 text-berry" />}
            <span>{saved ? 'Saved in My Foods' : 'Save Product'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="px-6 py-3.5 rounded-2xl font-heading text-sm font-bold bg-white text-berry border border-brand-border hover:bg-soft-light shadow-soft transition-all flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-vibrant" />
            <span>Compare Products</span>
          </button>

          <Button
            to="/scan"
            variant="primary"
            size="md"
            icon={ScanLine}
            className="shadow-vibrant-glow"
          >
            Scan Another Product
          </Button>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* INTERACTIVE COMPARISON MODAL / DRAWER                                     */}
      {/* ========================================================================= */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-brand-border shadow-soft-lg p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-vibrant" />
                <h3 className="text-xl font-heading font-extrabold text-berry">
                  Side-by-Side Product Comparison
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-full hover:bg-soft-light text-brand-muted hover:text-berry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Selector for Comparison Target */}
            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-brand-muted uppercase tracking-wider">
                Select Food to Compare With:
              </label>
              <div className="flex flex-wrap gap-2">
                {mockProducts.filter(p => p.id !== product.id).map(cand => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => setCompareTarget(cand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                      compareTarget?.id === cand.id 
                        ? 'bg-berry text-white shadow-soft' 
                        : 'bg-brand-bg text-brand-text border border-brand-border hover:bg-soft-light'
                    }`}
                  >
                    {cand.name.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Grid Table */}
            {compareTarget && (
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                
                {/* Current Product Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-brand-border p-1" 
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-vibrant block">Current Item</span>
                      <h4 className="font-heading font-bold text-berry text-xs sm:text-sm line-clamp-1">{product.name}</h4>
                    </div>
                  </div>

                  <div className="divide-y divide-brand-border text-xs pt-2">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Calories (100g)</span>
                      <span className="font-bold text-berry">{product.nutritionPer100g.calories || '--'} kcal</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Sugars</span>
                      <span className="font-bold text-berry">{product.nutritionPer100g.sugars || '--'} g</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Protein</span>
                      <span className="font-bold text-berry">{product.nutritionPer100g.proteins || product.nutritionPer100g.protein || '--'} g</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">NOVA Group</span>
                      <span className="font-bold text-berry">Group {product.novaGroup || 'N/A'}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Conscious Score</span>
                      <span className="font-extrabold text-vibrant">{product.consciousScore} / 100</span>
                    </div>
                  </div>
                </div>

                {/* Compared Product Column */}
                <div className="p-4 sm:p-5 rounded-2xl bg-warm-light/60 border border-warm/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={compareTarget.image} 
                      alt={compareTarget.name} 
                      className="w-12 h-12 rounded-xl object-contain bg-white border border-brand-border p-1" 
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-berry block">Comparison</span>
                      <h4 className="font-heading font-bold text-berry text-xs sm:text-sm line-clamp-1">{compareTarget.name}</h4>
                    </div>
                  </div>

                  <div className="divide-y divide-warm/60 text-xs pt-2">
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Calories (100g)</span>
                      <span className="font-bold text-berry">{compareTarget.nutritionPer100g.calories || '--'} kcal</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Sugars</span>
                      <span className="font-bold text-berry">{compareTarget.nutritionPer100g.sugars || '--'} g</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Protein</span>
                      <span className="font-bold text-berry">{compareTarget.nutritionPer100g.proteins || compareTarget.nutritionPer100g.protein || '--'} g</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">NOVA Group</span>
                      <span className="font-bold text-berry">Group {compareTarget.novaGroup || 'N/A'}</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span className="text-brand-muted">Conscious Score</span>
                      <span className="font-extrabold text-vibrant">{compareTarget.consciousScore} / 100</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => setIsCompareOpen(false)}
                variant="primary"
                size="sm"
              >
                Close Comparison
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
