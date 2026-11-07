import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Layers,
  Sparkles, 
  ExternalLink, 
  Loader2, 
  ScanLine,
  Scale,
  Bookmark,
  BookmarkCheck,
  X,
  AlertCircle,
  Filter,
  CheckCircle2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts, registerDynamicProduct } from '../data/mockProducts';
import { searchOpenFoodFacts } from '../services/openFoodFactsService';
import { useHistory } from '../context/HistoryContext';

export const ExploreProductsPage = () => {
  const navigate = useNavigate();
  const { isSaved, toggleSaveProduct } = useHistory();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNova, setSelectedNova] = useState('All');

  // Live Open Food Facts database search states
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [dbError, setDbError] = useState(null);
  const searchTimeoutRef = useRef(null);

  const categories = [
    'All',
    'Breakfast & Cereals',
    'Beverages',
    'Dairy & Cultured',
    'Snacks & Savory',
    'Spreads & Dips',
    'Plant-Based',
    'Organic'
  ];

  // Debounce user search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Query Open Food Facts database when search term changes
  useEffect(() => {
    let isMounted = true;
    async function executeRemoteSearch() {
      const q = debouncedQuery;
      if (!q || q.length < 3) {
        setRemoteProducts([]);
        setIsSearchingDb(false);
        setDbError(null);
        return;
      }

      setIsSearchingDb(true);
      setDbError(null);

      try {
        const results = await searchOpenFoodFacts(q, 10);
        if (isMounted) {
          // Register results in dynamic cache so analysis page can display them
          results.forEach(p => registerDynamicProduct(p));
          setRemoteProducts(results || []);
        }
      } catch (err) {
        if (isMounted) {
          setDbError('Could not reach the Open Food Facts registry.');
          setRemoteProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsSearchingDb(false);
        }
      }
    }

    executeRemoteSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Merge and deduplicate local catalog with live search results
  const combinedProducts = useMemo(() => {
    const pool = [...mockProducts, ...remoteProducts];
    const seen = new Set();
    const unique = [];

    for (const p of pool) {
      const key = p.barcode || p.id;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    return unique;
  }, [remoteProducts]);

  // Filter products by search, category, and NOVA processing
  const filteredProducts = useMemo(() => {
    return combinedProducts.filter((product) => {
      const q = debouncedQuery.toLowerCase();
      const matchesSearch = !q || (
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.brand && product.brand.toLowerCase().includes(q)) ||
        (product.barcode && product.barcode.includes(q)) ||
        (Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes(q))) ||
        (Array.isArray(product.ingredients) && product.ingredients.some(i => (i.name || '').toLowerCase().includes(q)))
      );

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Plant-Based') {
          matchesCategory = (Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes('plant') || t.toLowerCase().includes('vegan'))) ||
            (product.category && product.category.toLowerCase().includes('plant'));
        } else if (selectedCategory === 'Organic') {
          matchesCategory = (Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes('organic'))) ||
            (product.name && product.name.toLowerCase().includes('organic'));
        } else {
          matchesCategory = product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase());
        }
      }

      const matchesNova = selectedNova === 'All' || product.novaGroup === parseInt(selectedNova, 10);

      return matchesSearch && matchesCategory && matchesNova;
    });
  }, [combinedProducts, debouncedQuery, selectedCategory, selectedNova]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* HEADER: "Discover Your Food."                                             */}
      {/* ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="vibrant" size="md">
          Worldwide Food Catalog & Registry
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-berry tracking-tight">
          Discover Your Food.
        </h1>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
          Search by product name, explore mindful category shelves, and inspect verified nutritional breakdown, NOVA processing, and ingredients.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SEARCH AND FILTERS BAR                                                    */}
      {/* ========================================================================= */}
      <div className="space-y-4 max-w-4xl mx-auto">
        
        {/* Large Accessible Search Input */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name, brand, or ingredients (e.g. Oats, Nutella, Yogurt, Spelt)..."
            className="w-full pl-13 pr-12 py-4 rounded-3xl bg-white border border-[#EFE4EB] focus:border-vibrant focus:ring-4 focus:ring-vibrant/10 outline-none text-sm sm:text-base text-brand-text shadow-xs transition-all font-medium"
            aria-label="Search food products by name, brand, or barcode"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setDebouncedQuery(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-brand-muted hover:text-berry hover:bg-soft-light transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Database Search Indicator / Status Pill */}
        {isSearchingDb && (
          <div className="flex items-center justify-center gap-2 text-xs font-heading font-bold text-berry animate-fadeIn">
            <Loader2 className="w-4 h-4 text-vibrant animate-spin" />
            <span>Querying Open Food Facts global database for "{debouncedQuery}"...</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-heading font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-berry text-white shadow-soft'
                  : 'bg-white text-brand-text border border-[#EFE4EB] hover:bg-soft-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* NOVA Processing Degree Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="font-heading font-bold text-berry flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-vibrant" />
            Processing Level:
          </span>
          {[
            { id: 'All', label: 'All NOVA' },
            { id: '1', label: 'NOVA 1 (Minimally Processed)' },
            { id: '2', label: 'NOVA 2 (Culinary)' },
            { id: '3', label: 'NOVA 3 (Processed)' },
            { id: '4', label: 'NOVA 4 (Ultra-Processed)' }
          ].map((grp) => (
            <button
              key={grp.id}
              type="button"
              onClick={() => setSelectedNova(grp.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                selectedNova === grp.id
                  ? 'bg-vibrant text-white shadow-xs'
                  : 'bg-white text-brand-muted hover:text-berry border border-[#EFE4EB]'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ERROR STATE                                                               */}
      {/* ========================================================================= */}
      {dbError && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-warm-light/70 border border-warm/80 text-center space-y-2 text-berry animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-vibrant mx-auto" />
          <p className="text-xs font-semibold">
            {dbError} You can still browse our local verified collection.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMPTY STATE                                                               */}
      {/* ========================================================================= */}
      {!isSearchingDb && filteredProducts.length === 0 && (
        <div className="paper-card rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-warm-light border border-warm/80 text-berry flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-berry" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-heading font-black text-berry">
              No matching products found
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              We couldn't find any items matching "{searchTerm}". Try a different spelling, switch categories, or scan the package barcode with your camera.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedNova('All'); }}
              variant="secondary"
              size="md"
            >
              Reset Filters
            </Button>
            <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
              Scan Barcode with Camera
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRODUCT GRID                                                              */}
      {/* ========================================================================= */}
      {filteredProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-brand-muted px-2">
            <span>Showing {filteredProducts.length} verified products</span>
            {remoteProducts.length > 0 && (
              <span className="flex items-center gap-1 text-berry">
                <Globe className="w-3.5 h-3.5 text-vibrant" />
                Live Open Food Facts Database Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const productKey = product.barcode || product.id;
              const saved = isSaved(productKey);
              const nutr = product.nutritionPer100g || {};

              return (
                <div
                  key={productKey}
                  className="paper-card paper-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-4">
                    
                    {/* Image & Quick Badges */}
                    <div className="relative aspect-square rounded-2xl bg-brand-bg/80 border border-[#EFE4EB] p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.novaGroup && (
                          <NovaBadge group={product.novaGroup} showLabel={false} />
                        )}
                      </div>

                      {/* Top Right Save Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => toggleSaveProduct(product)}
                        title={saved ? 'Remove from Saved' : 'Save Product'}
                        className={`absolute top-3 right-3 p-2 rounded-xl border transition-all ${
                          saved
                            ? 'bg-berry text-white border-berry shadow-soft'
                            : 'bg-white/90 backdrop-blur-xs text-brand-muted hover:text-berry border-[#EFE4EB]'
                        }`}
                        aria-label={saved ? 'Saved in favorites' : 'Save in favorites'}
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4 text-warm" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      {/* Bottom Conscious Score Overlay */}
                      {product.consciousScore && (
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs border border-[#EFE4EB] font-heading font-extrabold text-xs text-berry shadow-xs">
                            Score <span className="text-vibrant">{product.consciousScore}</span>/100
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Identifiers & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider truncate">
                          {product.brand || 'Verified Food'}
                        </span>
                        <span className="text-[10px] font-mono text-brand-muted flex-shrink-0">
                          {product.barcode}
                        </span>
                      </div>

                      <h3 className="text-base font-heading font-extrabold text-berry leading-snug line-clamp-2 group-hover:text-vibrant transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-brand-muted line-clamp-2 pt-0.5 leading-relaxed">
                        {product.summary || `${product.category || 'Food product'} documented with laboratory nutritional values.`}
                      </p>
                    </div>

                    {/* Micro Nutrients Strip (Per 100g) */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                      <div className="p-2 rounded-xl bg-warm-light/70 border border-warm/80">
                        <span className="block font-heading font-bold text-berry">
                          {nutr.calories !== null && nutr.calories !== undefined ? `${Math.round(nutr.calories)}` : '--'}
                        </span>
                        <span className="text-[10px] text-brand-muted">kcal/100g</span>
                      </div>
                      <div className="p-2 rounded-xl bg-soft-light/70 border border-soft-border/50">
                        <span className="block font-heading font-bold text-berry">
                          {nutr.proteins !== null && nutr.proteins !== undefined ? `${nutr.proteins}g` : '--'}
                        </span>
                        <span className="text-[10px] text-brand-muted">Protein</span>
                      </div>
                      <div className="p-2 rounded-xl bg-brand-bg border border-[#EFE4EB]">
                        <span className="block font-heading font-bold text-berry">
                          {nutr.sugars !== null && nutr.sugars !== undefined ? `${nutr.sugars}g` : '--'}
                        </span>
                        <span className="text-[10px] text-brand-muted">Sugar</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions Strip */}
                  <div className="pt-3 border-t border-[#EFE4EB] flex items-center justify-between gap-2">
                    <Link
                      to={`/compare?b1=${encodeURIComponent(product.barcode || product.id)}`}
                      className="px-3 py-2 rounded-xl bg-white border border-[#EFE4EB] text-berry hover:bg-soft-light text-xs font-heading font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Scale className="w-3.5 h-3.5 text-vibrant" />
                      <span>Compare</span>
                    </Link>

                    <Link
                      to={`/analysis/${encodeURIComponent(product.barcode || product.id)}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry/95 transition-all flex items-center justify-center gap-1.5 shadow-soft group-hover:scale-[1.01]"
                    >
                      <span>Full Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCANNER PROMPT CARD                                                       */}
      {/* ========================================================================= */}
      <div className="paper-card rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-4 bg-warm-light/60 border border-warm/80 shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-berry text-white flex items-center justify-center mx-auto">
          <ScanLine className="w-6 h-6 text-warm" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-black text-berry">
            Don't see your snack on the shelf?
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
            Use our device camera barcode scanner to instantly look up any packaged item from the worldwide database in under 2 seconds.
          </p>
        </div>
        <div className="pt-1">
          <Button to="/scan" variant="primary" size="md" icon={ScanLine} className="shadow-vibrant-glow">
            Scan Barcode Now
          </Button>
        </div>
      </div>

    </div>
  );
};
