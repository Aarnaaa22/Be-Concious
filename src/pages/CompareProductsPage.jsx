import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ArrowLeftRight, 
  Search, 
  ScanLine, 
  Flame, 
  Zap, 
  Droplet, 
  Wheat, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ArrowRight, 
  ArrowUpRight, 
  Loader2, 
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  Heart
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts, getProductByBarcode, fetchProductByBarcode } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';
import { BetterAlternatives } from '../components/compare/BetterAlternatives';

// Curated comparison benchmark pairings
const BENCHMARK_PAIRS = [
  {
    name: 'Spreads: Hazelnut Butter vs Nutella',
    b1: '8901122334455',
    b2: '3017620422003',
    desc: 'Compare raw artisan cacao butter with global commercial hazelnut spread'
  },
  {
    name: 'Beverages: Botanical Tea vs Soda',
    b1: '8909876543210',
    b2: '5449000000996',
    desc: 'Compare sparkling cold-brewed hibiscus infusion with classic cola'
  },
  {
    name: 'Snacks: Ancient Spelt vs Cheesy Puffs',
    b1: '8907766554433',
    b2: '8903344556677',
    desc: 'Compare stoneground olive oil crackers with extruded ultra-processed snacks'
  },
  {
    name: 'Breakfast: Whole Granola vs Cereal',
    b1: '8901234567890',
    b2: '8907766554433',
    desc: 'Compare low-sugar whole grain granola with savory grain crackers'
  }
];

export const CompareProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { history } = useHistory();

  const b1Param = searchParams.get('b1') || '8901122334455';
  const b2Param = searchParams.get('b2') || '3017620422003';

  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  // Manual barcode entry input states
  const [inputCode1, setInputCode1] = useState('');
  const [inputCode2, setInputCode2] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  // Quick picker drawer / modal states
  const [activePickerSlot, setActivePickerSlot] = useState(null); // null | 1 | 2

  // Fetch product 1
  useEffect(() => {
    let isMounted = true;
    async function loadP1() {
      if (!b1Param) {
        setProduct1(mockProducts[4]);
        setLoading1(false);
        return;
      }
      setLoading1(true);
      setError1('');
      try {
        const res = await fetchProductByBarcode(b1Param);
        if (isMounted) {
          if (res.found && res.product) {
            setProduct1(res.product);
          } else {
            setError1("Product 1 not found in database.");
            setProduct1(mockProducts[4]); // Fallback
          }
        }
      } catch {
        if (isMounted) {
          setError1("Network error loading Product 1.");
          setProduct1(mockProducts[4]);
        }
      } finally {
        if (isMounted) setLoading1(false);
      }
    }
    loadP1();
    return () => { isMounted = false; };
  }, [b1Param]);

  // Fetch product 2
  useEffect(() => {
    let isMounted = true;
    async function loadP2() {
      if (!b2Param) {
        setProduct2(mockProducts[0]);
        setLoading2(false);
        return;
      }
      setLoading2(true);
      setError2('');
      try {
        const res = await fetchProductByBarcode(b2Param);
        if (isMounted) {
          if (res.found && res.product) {
            setProduct2(res.product);
          } else {
            setError2("Product 2 not found in database.");
            setProduct2(mockProducts[0]);
          }
        }
      } catch {
        if (isMounted) {
          setError2("Network error loading Product 2.");
          setProduct2(mockProducts[0]);
        }
      } finally {
        if (isMounted) setLoading2(false);
      }
    }
    loadP2();
    return () => { isMounted = false; };
  }, [b2Param]);

  const handleManualLookup = async (slot) => {
    const code = slot === 1 ? inputCode1.trim() : inputCode2.trim();
    if (!code) return;

    if (slot === 1) {
      setSearchParams({ b1: code, b2: product2?.barcode || b2Param });
      setInputCode1('');
    } else {
      setSearchParams({ b1: product1?.barcode || b1Param, b2: code });
      setInputCode2('');
    }
  };

  const handleSelectProduct = (product, slot) => {
    const code = product.barcode || product.id;
    if (slot === 1) {
      setSearchParams({ b1: code, b2: product2?.barcode || b2Param });
    } else {
      setSearchParams({ b1: product1?.barcode || b1Param, b2: code });
    }
    setActivePickerSlot(null);
  };

  const handleSwap = () => {
    if (product1 && product2) {
      setSearchParams({
        b1: product2.barcode || product2.id,
        b2: product1.barcode || product1.id
      });
    }
  };

  const p1Nutr = product1?.nutritionPer100g || {};
  const p2Nutr = product2?.nutritionPer100g || {};

  // Difference calculator
  const calculateDiff = (val1, val2, unit = 'g', isLowerBetter = true) => {
    if (val1 === null || val1 === undefined || val2 === null || val2 === undefined) {
      return { diff: null, text: 'No data', pct: null, p1Advantage: null };
    }
    const num1 = Number(val1);
    const num2 = Number(val2);
    const diff = num1 - num2;
    const absDiff = Math.abs(diff);

    if (absDiff < 0.05) {
      return { diff: 0, text: 'Virtually equal', pct: 0, p1Advantage: null };
    }

    const pct = num2 > 0 ? Math.round((diff / num2) * 100) : null;
    const isP1Lower = diff < 0;
    const isP1Higher = diff > 0;

    let p1Advantage = false;
    if (isLowerBetter) {
      p1Advantage = isP1Lower; // lower is better (e.g. sugar, sodium, saturated fat)
    } else {
      p1Advantage = isP1Higher; // higher is better (e.g. protein, fiber)
    }

    const sign = diff > 0 ? '+' : '-';
    const displayDiff = `${sign}${absDiff < 10 ? absDiff.toFixed(1) : Math.round(absDiff)}${unit}`;
    const displayPct = pct !== null ? ` (${diff > 0 ? '+' : ''}${pct}%)` : '';

    return {
      diff,
      text: `${displayDiff}${displayPct}`,
      pct,
      p1Advantage,
      isP1Lower,
      isP1Higher,
      absDiff
    };
  };

  // Compare rows configuration
  const rows = [
    {
      label: 'Calories',
      unit: 'kcal',
      icon: Flame,
      val1: p1Nutr.calories,
      val2: p2Nutr.calories,
      isLowerBetter: null, // neutral energy density
      format: (v) => v !== null && v !== undefined ? `${Math.round(v)} kcal` : '--',
      note: 'Energy density per 100g'
    },
    {
      label: 'Sugar',
      unit: 'g',
      icon: Sparkles,
      val1: p1Nutr.sugars,
      val2: p2Nutr.sugars,
      isLowerBetter: true,
      format: (v) => v !== null && v !== undefined ? `${v} g` : '--',
      goalLabel: 'Sugar Moderation'
    },
    {
      label: 'Protein',
      unit: 'g',
      icon: Zap,
      val1: p1Nutr.proteins !== undefined ? p1Nutr.proteins : p1Nutr.protein,
      val2: p2Nutr.proteins !== undefined ? p2Nutr.proteins : p2Nutr.protein,
      isLowerBetter: false, // higher protein is typically advantageous
      format: (v) => v !== null && v !== undefined ? `${v} g` : '--',
      goalLabel: 'Protein Goal'
    },
    {
      label: 'Total Fat',
      unit: 'g',
      icon: Droplet,
      val1: p1Nutr.fat !== undefined ? p1Nutr.fat : p1Nutr.totalFat,
      val2: p2Nutr.fat !== undefined ? p2Nutr.fat : p2Nutr.totalFat,
      isLowerBetter: null,
      format: (v) => v !== null && v !== undefined ? `${v} g` : '--',
      note: 'Total lipids'
    },
    {
      label: 'Saturated Fat',
      unit: 'g',
      icon: AlertTriangle,
      val1: p1Nutr.saturatedFat,
      val2: p2Nutr.saturatedFat,
      isLowerBetter: true,
      format: (v) => v !== null && v !== undefined ? `${v} g` : '--',
      goalLabel: 'Heart-Conscious Fat'
    },
    {
      label: 'Fibre',
      unit: 'g',
      icon: Wheat,
      val1: p1Nutr.fiber,
      val2: p2Nutr.fiber,
      isLowerBetter: false,
      format: (v) => v !== null && v !== undefined ? `${v} g` : '--',
      goalLabel: 'Digestive Health'
    },
    {
      label: 'Sodium',
      unit: 'mg',
      icon: Heart,
      val1: p1Nutr.sodium,
      val2: p2Nutr.sodium,
      isLowerBetter: true,
      format: (v) => v !== null && v !== undefined ? `${Math.round(v)} mg` : '--',
      goalLabel: 'Low Sodium'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* MAIN HEADING & PAGE SUBTITLE                                              */}
      {/* ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="vibrant" size="md">
          Nutritional Showdown
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-berry tracking-tight">
          Compare Before You Choose.
        </h1>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
          Side-by-side nutritional transparency. See the verified per-100g differences, compare macronutrients, and pick what fits your personal goals.
        </p>

        {/* Curated Benchmark Quick Selectors */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-heading font-bold text-brand-muted uppercase tracking-wider">
            Try Benchmark Pairs:
          </span>
          {BENCHMARK_PAIRS.map((pair, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSearchParams({ b1: pair.b1, b2: pair.b2 })}
              className={`px-3 py-1 rounded-full text-xs font-heading font-semibold transition-all ${
                b1Param === pair.b1 && b2Param === pair.b2
                  ? 'bg-berry text-white shadow-soft'
                  : 'bg-white text-brand-text border border-[#EFE4EB] hover:bg-soft-light'
              }`}
            >
              {pair.name}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT SELECTORS & SWAP CONTROLS                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        
        {/* Product Slot 1 Card */}
        <div className="md:col-span-5 rounded-3xl bg-white border border-[#EFE4EB] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-berry uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-berry text-white flex items-center justify-center text-[10px]">1</span>
              Product A (Baseline)
            </span>
            <button
              type="button"
              onClick={() => setActivePickerSlot(1)}
              className="text-xs font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
            >
              <span>Change Product</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode1}
              onChange={(e) => setInputCode1(e.target.value)}
              placeholder="Enter barcode (e.g. 8901122334455)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-brand-bg border border-[#EFE4EB] text-xs font-mono text-brand-text focus:outline-none focus:border-vibrant"
            />
            <Button
              onClick={() => handleManualLookup(1)}
              variant="secondary"
              size="sm"
            >
              Load
            </Button>
          </div>

          {error1 && (
            <p className="text-[11px] text-vibrant font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> {error1}
            </p>
          )}
        </div>

        {/* Swap Button (Middle) */}
        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap products"
            className="w-12 h-12 rounded-2xl bg-white border border-[#EFE4EB] hover:border-vibrant text-berry hover:text-vibrant shadow-soft flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Swap Products"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Product Slot 2 Card */}
        <div className="md:col-span-5 rounded-3xl bg-white border border-[#EFE4EB] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-berry uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-vibrant text-white flex items-center justify-center text-[10px]">2</span>
              Product B (Comparison Target)
            </span>
            <button
              type="button"
              onClick={() => setActivePickerSlot(2)}
              className="text-xs font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
            >
              <span>Change Product</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode2}
              onChange={(e) => setInputCode2(e.target.value)}
              placeholder="Enter barcode (e.g. 3017620422003)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-brand-bg border border-[#EFE4EB] text-xs font-mono text-brand-text focus:outline-none focus:border-vibrant"
            />
            <Button
              onClick={() => handleManualLookup(2)}
              variant="secondary"
              size="sm"
            >
              Load
            </Button>
          </div>

          {error2 && (
            <p className="text-[11px] text-vibrant font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> {error2}
            </p>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* QUICK PRODUCT PICKER MODAL (From Scan History & Catalog)                   */}
      {/* ========================================================================= */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#EFE4EB] shadow-soft-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE4EB]">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-berry">
                  Choose Product for Slot {activePickerSlot}
                </h3>
                <p className="text-xs text-brand-muted">
                  Select from your recent scans, curated foods, or scan a new item with camera.
                </p>
              </div>
              <button
                onClick={() => setActivePickerSlot(null)}
                className="p-2 rounded-full hover:bg-soft-light text-brand-muted hover:text-berry"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera Scan Action */}
            <div className="p-4 rounded-2xl bg-warm-light/60 border border-warm/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-berry text-white flex items-center justify-center">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-berry">Scan Package with Camera</h4>
                  <p className="text-[11px] text-brand-muted">Point device camera at any retail barcode</p>
                </div>
              </div>
              <Link
                to="/scan"
                className="px-4 py-2 rounded-xl bg-vibrant text-white font-heading text-xs font-bold shadow-soft hover:bg-vibrant/95"
              >
                Open Scanner
              </Link>
            </div>

            {/* List from Scanned History & Mock Catalog */}
            <div className="space-y-2">
              <span className="text-[11px] font-heading font-bold text-brand-muted uppercase tracking-wider block">
                Available Products ({history.length > 0 ? 'Recent Scans & Benchmarks' : 'Catalog Benchmarks'}):
              </span>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {[...history, ...mockProducts].filter((v, i, a) => a.findIndex(t => t.barcode === v.barcode) === i).map((item) => (
                  <button
                    key={item.barcode || item.id}
                    type="button"
                    onClick={() => handleSelectProduct(item, activePickerSlot)}
                    className="w-full p-3 rounded-2xl border border-[#EFE4EB] hover:border-vibrant hover:bg-soft-light/40 transition-all text-left flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-contain bg-white border border-[#EFE4EB] p-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-vibrant uppercase block">{item.brand}</span>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-text truncate group-hover:text-berry">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-brand-muted block">Barcode: {item.barcode}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {item.nutritionPer100g?.calories && (
                        <span className="text-xs font-mono font-bold text-berry bg-brand-bg px-2 py-0.5 rounded-lg border border-[#EFE4EB]">
                          {Math.round(item.nutritionPer100g.calories)} kcal
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-vibrant group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: SIDE-BY-SIDE PRODUCT CARDS                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Product Card 1 */}
        <div className="rounded-3xl bg-white border-2 border-berry/20 p-6 sm:p-7 shadow-soft space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-berry text-white font-heading font-bold text-xs uppercase tracking-wider">
            Product 1
          </div>

          {loading1 ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-vibrant animate-spin mx-auto" />
              <p className="text-xs font-bold text-brand-muted">Loading Product 1...</p>
            </div>
          ) : product1 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={product1.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                    alt={product1.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <span className="text-xs font-heading font-bold text-vibrant uppercase tracking-wider block">
                    {product1.brand || 'Verified Brand'}
                  </span>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-berry tracking-tight line-clamp-2 mt-0.5">
                    {product1.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-brand-bg border border-[#EFE4EB] text-brand-muted">
                      {product1.quantity || 'Standard pack'}
                    </span>
                    {product1.novaGroup && (
                      <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-soft-light text-berry border border-soft">
                        NOVA {product1.novaGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#EFE4EB] text-xs">
                <span className="font-mono text-brand-muted">Barcode: {product1.barcode}</span>
                <Link
                  to={`/analysis/${encodeURIComponent(product1.barcode || product1.id)}`}
                  className="font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
                >
                  <span>Full Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-brand-muted">No product loaded</div>
          )}
        </div>

        {/* Product Card 2 */}
        <div className="rounded-3xl bg-white border-2 border-vibrant/20 p-6 sm:p-7 shadow-soft space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-vibrant text-white font-heading font-bold text-xs uppercase tracking-wider">
            Product 2
          </div>

          {loading2 ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-vibrant animate-spin mx-auto" />
              <p className="text-xs font-bold text-brand-muted">Loading Product 2...</p>
            </div>
          ) : product2 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={product2.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                    alt={product2.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <span className="text-xs font-heading font-bold text-vibrant uppercase tracking-wider block">
                    {product2.brand || 'Verified Brand'}
                  </span>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-berry tracking-tight line-clamp-2 mt-0.5">
                    {product2.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-brand-bg border border-[#EFE4EB] text-brand-muted">
                      {product2.quantity || 'Standard pack'}
                    </span>
                    {product2.novaGroup && (
                      <span className="text-xs font-heading font-bold px-2.5 py-0.5 rounded-full bg-warm-light text-berry border border-warm">
                        NOVA {product2.novaGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#EFE4EB] text-xs">
                <span className="font-mono text-brand-muted">Barcode: {product2.barcode}</span>
                <Link
                  to={`/analysis/${encodeURIComponent(product2.barcode || product2.id)}`}
                  className="font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
                >
                  <span>Full Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-brand-muted">No product loaded</div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CLEAN COMPARISON TABLE (PER 100g / 100ml)                       */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Badge variant="warm" size="md">
              Normalized Comparison
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1 tracking-tight">
              Nutritional Values (Per 100g / 100ml)
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Apples-to-apples comparison using verified laboratory units. Differences highlight specific dietary advantages.
            </p>
          </div>
          <div className="text-[11px] font-mono text-brand-muted bg-white border border-[#EFE4EB] px-3 py-1.5 rounded-xl">
            Reference Standard: 100g
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#EFE4EB] overflow-hidden shadow-soft">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-brand-bg/80 border-b border-[#EFE4EB] p-4 text-xs font-heading font-extrabold text-berry tracking-wider uppercase">
            <div className="col-span-4 sm:col-span-3">Nutrient</div>
            <div className="col-span-3 sm:col-span-3 text-right pr-2">
              <span className="truncate block">{product1?.name || 'Product 1'}</span>
            </div>
            <div className="col-span-2 sm:col-span-3 text-center">Difference</div>
            <div className="col-span-3 sm:col-span-3 text-left pl-2">
              <span className="truncate block">{product2?.name || 'Product 2'}</span>
            </div>
          </div>

          {/* Table Body Rows */}
          <div className="divide-y divide-[#EFE4EB]">
            {rows.map((row, idx) => {
              const diffInfo = calculateDiff(row.val1, row.val2, row.unit, row.isLowerBetter);
              const RowIcon = row.icon;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 items-center text-xs sm:text-sm hover:bg-soft-light/20 transition-colors"
                >
                  {/* Nutrient Label */}
                  <div className="col-span-4 sm:col-span-3 flex items-center gap-2 font-heading font-bold text-berry">
                    <div className="w-7 h-7 rounded-lg bg-brand-bg border border-[#EFE4EB] flex items-center justify-center text-vibrant flex-shrink-0">
                      <RowIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span>{row.label}</span>
                      {row.goalLabel && (
                        <span className="hidden sm:block text-[10px] font-medium text-brand-muted">
                          {row.goalLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product 1 Value */}
                  <div className="col-span-3 sm:col-span-3 text-right pr-2">
                    <span className={`font-mono font-bold text-sm sm:text-base ${
                      diffInfo.p1Advantage === true ? 'text-vibrant' : 'text-brand-text'
                    }`}>
                      {row.format(row.val1)}
                    </span>
                  </div>

                  {/* Difference Badge (Center) */}
                  <div className="col-span-2 sm:col-span-3 flex justify-center">
                    {diffInfo.diff === null ? (
                      <span className="text-[11px] text-brand-muted">--</span>
                    ) : diffInfo.diff === 0 ? (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-bg text-brand-muted border border-[#EFE4EB]">
                        Equal
                      </span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className={`text-[11px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded-full border ${
                          diffInfo.p1Advantage === true
                            ? 'bg-soft-light text-berry border-soft'
                            : diffInfo.p1Advantage === false
                              ? 'bg-warm-light text-berry border-warm/80'
                              : 'bg-brand-bg text-brand-text border-[#EFE4EB]'
                        }`}>
                          {diffInfo.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product 2 Value */}
                  <div className="col-span-3 sm:col-span-3 text-left pl-2">
                    <span className={`font-mono font-bold text-sm sm:text-base ${
                      diffInfo.p1Advantage === false ? 'text-vibrant' : 'text-brand-text'
                    }`}>
                      {row.format(row.val2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: NUTRITIONAL TRADE-OFF INSIGHTS                                  */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div>
          <Badge variant="soft" size="md">
            Goal Highlights
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1 tracking-tight">
            Key Differences at a Glance
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            Transparent breakdown of trade-offs between both products to help inform your personal grocery decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Sugar Insight Card */}
          <div className="p-5 rounded-3xl bg-warm-light/70 border border-warm/80 space-y-2 text-berry">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-berry" />
              <h4 className="font-heading font-bold text-sm">Sugar Intake Perspective</h4>
            </div>
            <p className="text-xs text-brand-text leading-relaxed">
              {p1Nutr.sugars !== null && p2Nutr.sugars !== null ? (
                p1Nutr.sugars < p2Nutr.sugars ? (
                  <>
                    <strong className="text-berry font-bold">{product1?.name}</strong> has{' '}
                    <span className="font-mono font-bold text-vibrant">
                      {(p2Nutr.sugars - p1Nutr.sugars).toFixed(1)}g less sugar
                    </span>{' '}
                    per 100g than {product2?.name}. Preferable for moderating blood sugar spikes.
                  </>
                ) : p1Nutr.sugars > p2Nutr.sugars ? (
                  <>
                    <strong className="text-berry font-bold">{product2?.name}</strong> has{' '}
                    <span className="font-mono font-bold text-vibrant">
                      {(p1Nutr.sugars - p2Nutr.sugars).toFixed(1)}g less sugar
                    </span>{' '}
                    per 100g than {product1?.name}.
                  </>
                ) : (
                  'Both products declare identical sugar levels per 100g.'
                )
              ) : (
                'Sugar values are missing for one of the products in the database registry.'
              )}
            </p>
          </div>

          {/* Protein Insight Card */}
          <div className="p-5 rounded-3xl bg-warm-light/70 border border-warm/80 space-y-2 text-berry">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-berry" />
              <h4 className="font-heading font-bold text-sm">Protein & Satiety Density</h4>
            </div>
            <p className="text-xs text-brand-text leading-relaxed">
              {p1Nutr.proteins !== null && p2Nutr.proteins !== null ? (
                p1Nutr.proteins > p2Nutr.proteins ? (
                  <>
                    <strong className="text-berry font-bold">{product1?.name}</strong> delivers{' '}
                    <span className="font-mono font-bold text-vibrant">
                      +{(p1Nutr.proteins - p2Nutr.proteins).toFixed(1)}g more protein
                    </span>{' '}
                    per 100g, supporting active recovery and fullness.
                  </>
                ) : p1Nutr.proteins < p2Nutr.proteins ? (
                  <>
                    <strong className="text-berry font-bold">{product2?.name}</strong> delivers{' '}
                    <span className="font-mono font-bold text-vibrant">
                      +{(p2Nutr.proteins - p1Nutr.proteins).toFixed(1)}g more protein
                    </span>{' '}
                    per 100g.
                  </>
                ) : (
                  'Both products declare comparable protein levels per 100g.'
                )
              ) : (
                'Protein values are missing or unlisted for one of these items.'
              )}
            </p>
          </div>

          {/* Saturated Fat & Sodium Insight Card */}
          <div className="p-5 rounded-3xl bg-warm-light/70 border border-warm/80 space-y-2 text-berry">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-berry" />
              <h4 className="font-heading font-bold text-sm">Heart-Conscious Profile</h4>
            </div>
            <p className="text-xs text-brand-text leading-relaxed">
              {p1Nutr.saturatedFat !== null && p2Nutr.saturatedFat !== null ? (
                p1Nutr.saturatedFat < p2Nutr.saturatedFat ? (
                  <>
                    <strong className="text-berry font-bold">{product1?.name}</strong> contains{' '}
                    <span className="font-mono font-bold text-vibrant">
                      {(p2Nutr.saturatedFat - p1Nutr.saturatedFat).toFixed(1)}g less saturated fat
                    </span>{' '}
                    per 100g.
                  </>
                ) : (
                  <>
                    <strong className="text-berry font-bold">{product2?.name}</strong> contains{' '}
                    <span className="font-mono font-bold text-vibrant">
                      {(p1Nutr.saturatedFat - p2Nutr.saturatedFat).toFixed(1)}g less saturated fat
                    </span>{' '}
                    per 100g.
                  </>
                )
              ) : (
                'Saturated fat declarations are pending in the open registry.'
              )}
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: BETTER ALTERNATIVES SECTION                                    */}
      {/* ========================================================================= */}
      {product1 && (
        <div className="pt-6 border-t border-[#EFE4EB]">
          <BetterAlternatives
            product={product1}
            currentComparedBarcode={product2?.barcode}
            onSelectAlternative={(alt) => {
              setSearchParams({
                b1: product1.barcode || product1.id,
                b2: alt.barcode || alt.id
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

    </div>
  );
};

