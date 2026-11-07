import React, { useState, useMemo } from 'react';
import { 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  ShieldAlert,
  Layers,
  Tag
} from 'lucide-react';
import { getVerifiedExplanation } from '../../data/verifiedIngredients';

// Verified additive function & purpose descriptions
const VERIFIED_ADDITIVES = {
  'E150D': {
    code: 'E150d',
    name: 'Sulfite Ammonia Caramel',
    purpose: 'Colouring',
    simpleExplanation: 'A food colorant produced by heating carbohydrates with food-grade sulfites, creating the characteristic dark brown color in colas and gravies.'
  },
  'E338': {
    code: 'E338',
    name: 'Phosphoric Acid',
    purpose: 'Acidity Regulator',
    simpleExplanation: 'An acidifier commonly used in dark sodas to provide a distinctive crisp, tangy taste and inhibit the growth of molds and bacteria.'
  },
  'E322': {
    code: 'E322',
    name: 'Lecithins',
    purpose: 'Emulsifier',
    simpleExplanation: 'A natural plant fat usually extracted from soybeans or sunflowers that prevents oils and cocoa solids from separating in chocolates and spreads.'
  },
  'E330': {
    code: 'E330',
    name: 'Citric Acid',
    purpose: 'Acidity Regulator & Antioxidant',
    simpleExplanation: 'A natural acid found in lemons and oranges, added to foods to provide a refreshing tart flavor and naturally extend shelf life.'
  },
  'E471': {
    code: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    purpose: 'Emulsifier & Texture Stabilizer',
    simpleExplanation: 'Fats composed of glycerol and fatty acids used in baking, ice creams, and spreads to keep moisture balanced and prevent oil separation.'
  },
  'E621': {
    code: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    purpose: 'Flavor Enhancer',
    simpleExplanation: 'The sodium salt of glutamic acid, an amino acid occurring naturally in aged cheeses and ripe tomatoes, used to enhance savory umami depth.'
  },
  'E415': {
    code: 'E415',
    name: 'Xanthan Gum',
    purpose: 'Thickener & Stabilizer',
    simpleExplanation: 'A natural soluble plant fibre produced by bio-fermentation, added in very small amounts to keep salad dressings and gluten-free doughs smoothly blended.'
  },
  'E412': {
    code: 'E412',
    name: 'Guar Gum',
    purpose: 'Natural Thickener',
    simpleExplanation: 'A dietary fibre milled from cluster beans, used in plant milks and sauces to produce a rich, creamy consistency without dairy.'
  },
  'E440': {
    code: 'E440',
    name: 'Pectins',
    purpose: 'Natural Gelling Agent',
    simpleExplanation: 'A soluble fruit fibre derived from citrus and apple rinds, traditionally used to help jams and fruit fillings set naturally.'
  },
  'E500': {
    code: 'E500',
    name: 'Sodium Carbonates (Baking Soda)',
    purpose: 'Leavening Agent',
    simpleExplanation: 'A mineral salt that releases gentle carbon dioxide bubbles during baking, helping crackers and biscuits bake light and crisp.'
  },
  'E503': {
    code: 'E503',
    name: 'Ammonium Carbonates',
    purpose: 'Leavening Agent',
    simpleExplanation: 'A traditional baking salt used for thin, crisp cookies and crackers that completely evaporates during baking, leaving no taste.'
  },
  'E202': {
    code: 'E202',
    name: 'Potassium Sorbate',
    purpose: 'Preservative',
    simpleExplanation: 'A widely used food preservative that inhibits yeast and mold growth in cheeses, fruit spreads, and baked goods.'
  },
  'E211': {
    code: 'E211',
    name: 'Sodium Benzoate',
    purpose: 'Preservative',
    simpleExplanation: 'An antimicrobial preservative used in acidic foods like soft drinks and condiments to maintain freshness.'
  }
};

export const IngredientDetective = ({ product }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedAdditive, setSelectedAdditive] = useState(null);

  // Accordion expansion states
  const [showFullIngredients, setShowFullIngredients] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);
  const [showAdditives, setShowAdditives] = useState(true);

  const rawIngredients = product?.ingredients || [];
  const confirmedAllergens = product?.allergens || [];
  const possibleTraces = product?.traces || [];
  const additives = product?.additives || [];

  // Filter ingredients by search term
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return rawIngredients;
    const query = searchTerm.toLowerCase().trim();
    return rawIngredients.filter((ing) => {
      const name = typeof ing === 'string' ? ing : (ing.name || '');
      return name.toLowerCase().includes(query);
    });
  }, [rawIngredients, searchTerm]);

  // Highlight matching search term in ingredient name
  const renderHighlightedName = (name) => {
    if (!searchTerm.trim()) return name;
    const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
    const parts = name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warm text-berry font-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleSelectIngredient = (ing) => {
    const rawName = typeof ing === 'string' ? ing : ing.name;
    const percent = typeof ing === 'object' ? ing.percent : null;
    const verified = getVerifiedExplanation(rawName);

    setSelectedIngredient({
      rawName,
      percent,
      verified,
    });
  };

  return (
    <section className="space-y-6">
      
      {/* Section Header */}
      <div>
        <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
          Ingredient Detective
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-berry tracking-tight mt-1">
          What's Actually Inside?
        </h2>
        <p className="text-sm text-brand-muted">
          Deciphering complicated food labels into simple, everyday English—click any ingredient to see its real purpose.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* ========================================================================= */}
        {/* CARD 1: FULL INGREDIENT LIST WITH REAL-TIME SEARCH                       */}
        {/* ========================================================================= */}
        <div className="paper-card rounded-3xl p-6 sm:p-7 space-y-5 bg-white border border-[#EFE4EB]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFE4EB]">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry flex items-center gap-2">
                <span>Declared Ingredient List</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-soft-light text-berry border border-soft font-mono font-bold">
                  {rawIngredients.length} items
                </span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Ingredients are listed in order of predominance by weight as declared on the packaging label.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFullIngredients(!showFullIngredients)}
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{showFullIngredients ? 'Collapse List' : 'Expand List'}</span>
              {showFullIngredients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showFullIngredients && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Ingredient Search Input */}
              {rawIngredients.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search within ingredients (e.g. sugar, palm, cocoa, lecithin)..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-brand-bg border border-[#EFE4EB] text-xs font-medium text-brand-text outline-none focus:border-vibrant focus:ring-2 focus:ring-vibrant/20 transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted hover:text-berry"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {searchTerm && (
                <div className="text-xs text-brand-muted font-medium">
                  Showing {filteredIngredients.length} of {rawIngredients.length} ingredients matching "<span className="text-berry font-bold">{searchTerm}</span>"
                </div>
              )}

              {/* Ingredients Chips Grid */}
              {filteredIngredients.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredIngredients.map((ing, idx) => {
                    const name = typeof ing === 'string' ? ing : ing.name;
                    const percent = typeof ing === 'object' ? ing.percent : null;
                    const hasVerified = !!getVerifiedExplanation(name);
                    const isSelected = selectedIngredient?.rawName === name;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectIngredient(ing)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-warm-light border-warm shadow-xs ring-2 ring-warm'
                            : 'bg-white hover:bg-soft-light/60 border-[#EFE4EB] hover:border-vibrant/40'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-heading font-bold text-brand-text group-hover:text-berry break-words">
                              {renderHighlightedName(name)}
                            </span>
                            {hasVerified && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-soft/30 text-berry border border-soft/50">
                                Explainer
                              </span>
                            )}
                          </div>
                          {percent !== null && (
                            <span className="text-[10px] font-mono font-bold text-vibrant block">
                              Approx. {percent}%
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-brand-muted flex-shrink-0">
                          #{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-brand-bg border border-[#EFE4EB] text-center text-xs text-brand-muted">
                  No ingredients matched your search for "{searchTerm}".
                </div>
              )}

              <div className="text-[11px] text-brand-muted flex items-center gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-vibrant flex-shrink-0" />
                <span>Tip: Tap any ingredient above to see an everyday plain-English explanation of its purpose.</span>
              </div>

            </div>
          )}

          {/* Expanded Selected Ingredient Explanation Box (Warm Yellow Theme) */}
          {selectedIngredient && (
            <div className="p-5 rounded-3xl bg-warm-light border border-warm text-brand-text space-y-3 animate-fadeIn relative">
              <button
                type="button"
                onClick={() => setSelectedIngredient(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-brand-muted hover:text-berry hover:bg-warm"
                aria-label="Close explainer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-berry text-white">
                  Ingredient Explainer
                </span>
                {selectedIngredient.verified?.category && (
                  <span className="text-[11px] font-heading font-bold text-berry bg-white px-2 py-0.5 rounded-full border border-warm">
                    {selectedIngredient.verified.category}
                  </span>
                )}
                {selectedIngredient.percent !== null && (
                  <span className="text-[11px] font-mono font-bold text-vibrant">
                    Declared Portioned: ~{selectedIngredient.percent}%
                  </span>
                )}
              </div>

              <h4 className="text-base font-heading font-extrabold text-berry">
                {selectedIngredient.verified?.name || selectedIngredient.rawName}
              </h4>

              {selectedIngredient.verified ? (
                <p className="text-xs sm:text-sm text-brand-text leading-relaxed font-body">
                  {selectedIngredient.verified.simpleDesc}
                </p>
              ) : (
                <div className="text-xs text-brand-muted leading-relaxed">
                  <p className="font-semibold text-berry">No verified explanation exists in our database yet.</p>
                  <p className="mt-0.5">
                    We only provide verified, peer-checked plain-English descriptions rather than guessing or fabricating definitions.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>


        {/* ========================================================================= */}
        {/* CARD 2: ALLERGEN HIGHLIGHTS (CONFIRMED VS POSSIBLE TRACES)                 */}
        {/* ========================================================================= */}
        <div className="paper-card rounded-3xl p-6 sm:p-7 space-y-5 bg-white border border-[#EFE4EB]">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4EB]">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry flex items-center gap-2">
                <span>Allergen & Cross-Contamination Guard</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  confirmedAllergens.length > 0 ? 'bg-berry-50 text-berry border border-berry-200' : 'bg-warm-light text-berry'
                }`}>
                  {confirmedAllergens.length} Confirmed
                </span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Clearly distinguishes verified recipe allergens from shared manufacturing facility traces.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllergens(!showAllergens)}
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1"
            >
              <span>{showAllergens ? 'Collapse' : 'Expand'}</span>
              {showAllergens ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAllergens && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Confirmed Recipe Allergens */}
              <div className="space-y-2">
                <h4 className="text-xs font-heading font-bold text-berry uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-vibrant" />
                  <span>Confirmed Recipe Allergens:</span>
                </h4>

                {confirmedAllergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {confirmedAllergens.map((alg, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-berry-50 border border-berry-200 text-berry text-xs font-heading font-extrabold flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-vibrant" />
                        <span>Contains {alg}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted">
                    No allergens were declared as deliberate ingredients on this registered packaging.
                  </p>
                )}
              </div>

              {/* Possible Cross-Contamination Traces */}
              <div className="space-y-2 pt-2 border-t border-[#EFE4EB]">
                <h4 className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-warm-dark" />
                  <span>Possible Shared Facility Traces (Cross-Contamination):</span>
                </h4>

                {possibleTraces.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {possibleTraces.map((trace, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-warm-light border border-warm/80 text-berry text-xs font-heading font-semibold"
                      >
                        May contain traces of {trace}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted">
                    No cross-contamination traces were registered by the manufacturer.
                  </p>
                )}
              </div>

              {/* Crucial Allergen Disclaimer Guard (Strict Compliance) */}
              <div className="p-4 rounded-2xl bg-berry-50/70 border border-berry/20 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-berry flex-shrink-0 mt-0.5" />
                <div className="text-xs text-berry leading-relaxed">
                  <span className="font-bold block">Important Allergy Safety Notice:</span>
                  <span>
                    We never claim a product is 100% allergen-free based solely on missing database records. Manufacturers frequently update factory shared lines. Always verify the physical package label if you have severe sensitivities.
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>


        {/* ========================================================================= */}
        {/* CARD 3: IDENTIFIED ADDITIVES & E-NUMBERS WITH FACTUAL PURPOSES            */}
        {/* ========================================================================= */}
        <div className="paper-card rounded-3xl p-6 sm:p-7 space-y-5 bg-white border border-[#EFE4EB]">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4EB]">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry flex items-center gap-2">
                <span>Identified Additives & E-Numbers</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  additives.length > 0 ? 'bg-berry text-white' : 'bg-warm text-brand-text'
                }`}>
                  {additives.length} Detected
                </span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Objective food science explanations of preservatives, emulsifiers, and regulators.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAdditives(!showAdditives)}
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1"
            >
              <span>{showAdditives ? 'Collapse' : 'Expand'}</span>
              {showAdditives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAdditives && (
            <div className="space-y-4 animate-fadeIn">
              
              {additives.length > 0 ? (
                <div className="space-y-3">
                  {additives.map((addCode, idx) => {
                    const cleanCode = addCode.replace(/^[a-z]{2}:/, '').toUpperCase();
                    const verifiedInfo = VERIFIED_ADDITIVES[cleanCode] || null;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-brand-bg border border-[#EFE4EB] space-y-2 hover:border-vibrant/30 transition-colors"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-berry text-white font-mono font-bold text-xs">
                              {cleanCode}
                            </span>
                            <span className="font-heading font-bold text-brand-text text-sm">
                              {verifiedInfo ? verifiedInfo.name : `Additive ${cleanCode}`}
                            </span>
                          </div>

                          {verifiedInfo?.purpose && (
                            <span className="text-[11px] font-heading font-semibold text-berry bg-warm-light px-2.5 py-0.5 rounded-full border border-warm/80">
                              {verifiedInfo.purpose}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-brand-muted leading-relaxed">
                          {verifiedInfo ? (
                            verifiedInfo.simpleExplanation
                          ) : (
                            "This officially authorized food additive is registered with food safety authorities. Detailed plain-English summary is being compiled."
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-center gap-2.5 text-xs font-semibold text-berry">
                  <CheckCircle2 className="w-5 h-5 text-berry flex-shrink-0" />
                  <span>
                    Zero chemical food additives, artificial preservatives, or synthetic colorings detected in this product's formulation.
                  </span>
                </div>
              )}

              <div className="text-[11px] text-brand-muted flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-berry flex-shrink-0 mt-0.5" />
                <span>
                  Scientific Note: Food additives (E-numbers) are legally evaluated substances used to maintain freshness, improve texture, or enhance color. We explain their real food purposes without unsupported alarmist claims.
                </span>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
};

