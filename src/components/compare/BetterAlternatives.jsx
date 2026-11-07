import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Zap, 
  Droplet, 
  Layers, 
  ShieldCheck, 
  Info,
  Loader2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, NovaBadge } from '../common/Badge';
import { fetchAlternativesForProduct } from '../../data/mockProducts';

export const BetterAlternatives = ({ product, onSelectAlternative, currentComparedBarcode }) => {
  const navigate = useNavigate();
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'sugar' | 'protein' | 'fiber' | 'nova' | 'fat'

  useEffect(() => {
    let isMounted = true;
    async function loadAlternatives() {
      if (!product) {
        setAlternatives([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const alts = await fetchAlternativesForProduct(product);
        if (isMounted) {
          setAlternatives(alts || []);
        }
      } catch (err) {
        if (isMounted) {
          setAlternatives([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAlternatives();
    return () => {
      isMounted = false;
    };
  }, [product?.barcode, product?.id]);

  // Filter alternatives by active dietary goal
  const filteredAlternatives = alternatives.filter(alt => {
    if (activeFilter === 'all') return true;
    return alt.goalReasons?.some(r => r.type === activeFilter || r.favorableFor?.includes(activeFilter));
  });

  const handleCompareClick = (alt) => {
    if (onSelectAlternative) {
      onSelectAlternative(alt);
    } else {
      navigate(`/compare?b1=${encodeURIComponent(product.barcode || product.id)}&b2=${encodeURIComponent(alt.barcode || alt.id)}`);
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge variant="vibrant" size="md">
            Goal-Based Food Choices
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1 tracking-tight">
            Better Alternatives for Your Goals
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl leading-relaxed">
            Verified items in this category that may align better with specific dietary priorities such as lower sugar, higher protein, or minimal industrial processing.
          </p>
        </div>

        {/* Nutritional Neutrality Note */}
        <div className="flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-light border border-warm/80 text-[11px] font-heading font-bold text-berry">
            <Info className="w-3.5 h-3.5 text-berry flex-shrink-0" />
            <span>Goal-Dependent, Not Universal</span>
          </div>
        </div>
      </div>

      {/* Editorial Transparency Philosophy Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-warm-light/60 border border-warm/80 flex items-start gap-3 text-xs text-berry leading-relaxed">
        <Sparkles className="w-4 h-4 text-berry flex-shrink-0 mt-0.5" />
        <p>
          <strong className="font-heading font-bold text-berry">Our Transparency Promise: </strong>
          Nutritional preferences depend on individual health goals. A product higher in protein may be ideal for active lifestyles, while one lower in carbohydrates or sodium benefits metabolic wellness. 
          <span className="font-bold underline decoration-vibrant decoration-2 underline-offset-2 ml-1">
            We do not claim that any product is universally healthier than another.
          </span>
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#EFE4EB] shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 text-vibrant animate-spin mx-auto" />
          <p className="text-sm font-heading font-bold text-berry">
            Searching database for verified category alternatives...
          </p>
          <p className="text-xs text-brand-muted">
            Checking real nutritional profiles per 100g in Open Food Facts.
          </p>
        </div>
      )}

      {/* Empty State: Requirement - "No alternatives found yet. Try comparing another product!" */}
      {!loading && alternatives.length === 0 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EFE4EB] shadow-xs text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-warm-light border border-warm/80 text-berry flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7 text-berry" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-extrabold text-berry">
              No alternatives found yet. Try comparing another product!
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              We only show verified products from the open database that offer documented nutritional differences. We do not generate fake alternatives or unverified suggestions.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link
              to="/scan"
              className="px-5 py-2.5 rounded-xl bg-vibrant text-white font-heading text-xs font-bold shadow-soft hover:bg-vibrant/95 transition-all inline-flex items-center gap-2"
            >
              <span>Scan Another Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/compare"
              className="px-5 py-2.5 rounded-xl bg-brand-bg border border-[#EFE4EB] text-brand-text font-heading text-xs font-bold hover:bg-soft-light transition-all"
            >
              Open Comparison Hub
            </Link>
          </div>
        </div>
      )}

      {/* Content when alternatives are found */}
      {!loading && alternatives.length > 0 && (
        <div className="space-y-4">
          
          {/* Goal Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter by Goal:
            </span>

            {[
              { id: 'all', label: `All Alternatives (${alternatives.length})` },
              { id: 'sugar', label: 'Lower Sugar' },
              { id: 'protein', label: 'Higher Protein' },
              { id: 'fiber', label: 'Higher Fibre' },
              { id: 'fat', label: 'Lower Saturated Fat' },
              { id: 'nova', label: 'Less Processed' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-berry text-white shadow-soft'
                    : 'bg-white text-brand-text border border-[#EFE4EB] hover:bg-soft-light'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredAlternatives.map((alt) => {
              const isCurrentlyCompared = currentComparedBarcode === alt.barcode;
              const nutr = alt.nutritionPer100g || {};

              return (
                <div
                  key={alt.barcode || alt.id}
                  className="rounded-3xl bg-white border border-[#EFE4EB] p-5 sm:p-6 shadow-xs hover:shadow-soft hover:border-vibrant/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Top: Product Identifiers */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                        <img
                          src={alt.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                          alt={alt.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-heading font-extrabold text-vibrant uppercase tracking-wider">
                            {alt.brand || 'Verified Brand'}
                          </span>
                          {alt.novaGroup && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-soft-light border border-soft text-berry font-bold">
                              NOVA {alt.novaGroup}
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-extrabold text-base sm:text-lg text-berry tracking-tight line-clamp-2 mt-0.5">
                          {alt.name}
                        </h3>

                        <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-1 font-mono">
                          <span>{alt.quantity || 'Packaged item'}</span>
                          <span>•</span>
                          <span>Barcode: {alt.barcode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Nutrition Metrics (Per 100g) */}
                    <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-2xl bg-brand-bg/70 border border-[#EFE4EB]/80 text-center">
                      <div>
                        <span className="block text-[10px] font-medium text-brand-muted uppercase">Energy</span>
                        <span className="text-xs sm:text-sm font-heading font-bold text-berry">
                          {nutr.calories !== null ? `${Math.round(nutr.calories)}` : '--'}
                        </span>
                        <span className="block text-[9px] text-brand-muted font-mono">kcal</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-medium text-brand-muted uppercase">Sugar</span>
                        <span className={`text-xs sm:text-sm font-heading font-bold ${
                          nutr.sugars !== null && product?.nutritionPer100g?.sugars !== null && nutr.sugars < product.nutritionPer100g.sugars
                            ? 'text-vibrant'
                            : 'text-berry'
                        }`}>
                          {nutr.sugars !== null ? `${nutr.sugars}g` : '--'}
                        </span>
                        <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-medium text-brand-muted uppercase">Protein</span>
                        <span className={`text-xs sm:text-sm font-heading font-bold ${
                          nutr.proteins !== null && product?.nutritionPer100g?.proteins !== null && nutr.proteins > product.nutritionPer100g.proteins
                            ? 'text-vibrant'
                            : 'text-berry'
                        }`}>
                          {nutr.proteins !== null ? `${nutr.proteins}g` : '--'}
                        </span>
                        <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-medium text-brand-muted uppercase">Fibre</span>
                        <span className={`text-xs sm:text-sm font-heading font-bold ${
                          nutr.fiber !== null && product?.nutritionPer100g?.fiber !== null && nutr.fiber > product.nutritionPer100g.fiber
                            ? 'text-vibrant'
                            : 'text-berry'
                        }`}>
                          {nutr.fiber !== null ? `${nutr.fiber}g` : '--'}
                        </span>
                        <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                      </div>
                    </div>

                    {/* Goal-Specific Reasons Section */}
                    {alt.goalReasons && alt.goalReasons.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-heading font-extrabold text-berry flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-vibrant" />
                          Why this may fit specific dietary priorities:
                        </span>

                        <div className="space-y-1.5">
                          {alt.goalReasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-warm-light/50 border border-warm/80 text-xs text-berry space-y-0.5"
                            >
                              <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-berry">
                                <CheckCircle2 className="w-3.5 h-3.5 text-vibrant flex-shrink-0" />
                                <span>{reason.title}</span>
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-white border border-warm text-berry font-mono font-bold">
                                  {reason.summary}
                                </span>
                              </div>
                              <p className="text-[11px] text-brand-text/80 pl-5 leading-relaxed">
                                {reason.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Action CTA */}
                  <div className="pt-2 border-t border-[#EFE4EB] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-brand-muted font-medium">
                      Values verified in database
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCompareClick(alt)}
                      className={`px-4 py-2.5 rounded-xl font-heading text-xs font-bold transition-all flex items-center gap-2 ${
                        isCurrentlyCompared
                          ? 'bg-berry text-white shadow-soft cursor-default'
                          : 'bg-vibrant hover:bg-vibrant/95 text-white shadow-soft group-hover:scale-[1.02]'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCurrentlyCompared ? 'Currently Comparing' : 'Compare Side-by-Side'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </section>
  );
};

