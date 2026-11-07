import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, X, Sparkles } from 'lucide-react';

export const NUTRITION_DEFINITIONS = {
  nova: {
    term: 'NOVA Classification',
    definition: 'A globally recognized food processing benchmark (University of São Paulo) categorizing foods from Group 1 (minimally processed whole foods) to Group 4 (industrial ultra-processed formulations).'
  },
  nutriScore: {
    term: 'Nutri-Score',
    definition: 'An official European nutritional quality rating (A to E) calculated from positive components (fruits, fiber, protein) minus negative components (excess calories, sugars, salt, saturated fat).'
  },
  consciousScore: {
    term: 'Conscious Score',
    definition: 'An objective 0–100 composite index calculated purely from nutrient density, minimal industrial modification, presence of whole ingredients, and absence of synthetic additives.'
  },
  sugars: {
    term: 'Sugars (Free vs Intrinsic)',
    definition: 'Total simple carbohydrates. Includes both natural whole-food sugars (e.g. lactose in milk, fructose in fruit) and added refined sweeteners like high-fructose syrups and cane sugar.'
  },
  saturatedFat: {
    term: 'Saturated Fat',
    definition: 'Fats that remain solid at room temperature (common in palm oil, butter, and processed meats). Health authorities recommend moderating saturated fat in favor of unsaturated plant lipids.'
  },
  sodium: {
    term: 'Sodium vs Salt',
    definition: 'Sodium is a natural mineral component of salt. To convert sodium into common table salt, multiply by 2.5 (e.g., 400mg sodium = ~1.0g salt).'
  },
  fiber: {
    term: 'Dietary Fibre',
    definition: 'Non-digestible complex plant carbohydrates that nourish beneficial gut microbiome bacteria, slow glucose absorption, and maintain steady digestive health.'
  },
  additives: {
    term: 'Food Additives & E-Numbers',
    definition: 'Legally authorized substances evaluated by food safety authorities (EFSA/FDA) added to maintain shelf life, prevent oil separation, or standardize color and texture.'
  },
  protein: {
    term: 'Protein',
    definition: 'Essential macronutrient composed of amino acids required for muscle synthesis, cellular repair, enzyme production, and sustained fullness.'
  }
};

export const NutritionTooltip = ({ 
  termKey, 
  title, 
  content, 
  children, 
  iconOnly = false,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 9)}`);

  const def = termKey && NUTRITION_DEFINITIONS[termKey] ? NUTRITION_DEFINITIONS[termKey] : null;
  const displayTitle = title || def?.term || 'Nutrition Note';
  const displayText = content || def?.definition || '';

  // Close when tapping outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <span ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      {iconOnly ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          aria-expanded={isOpen}
          aria-describedby={tooltipId.current}
          aria-label={`What is ${displayTitle}?`}
          className="p-1 rounded-full text-brand-muted hover:text-berry hover:bg-soft-light/60 transition-colors focus-visible:ring-2 focus-visible:ring-vibrant"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          aria-expanded={isOpen}
          aria-describedby={tooltipId.current}
          className="inline-flex items-center gap-1 border-b border-dashed border-berry/40 hover:border-vibrant transition-colors group cursor-help text-inherit text-left"
        >
          <span>{children}</span>
          <HelpCircle className="w-3 h-3 text-brand-muted group-hover:text-vibrant transition-colors flex-shrink-0" />
        </button>
      )}

      {/* Floating Tooltip Bubble */}
      {isOpen && (
        <div
          id={tooltipId.current}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3.5 rounded-2xl bg-berry text-white shadow-soft-lg text-xs space-y-1.5 animate-fadeIn pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1">
            <span className="font-heading font-extrabold text-[11px] tracking-wider text-warm uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-warm" />
              {displayTitle}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-0.5 rounded-full"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-white/90 leading-relaxed font-normal">
            {displayText}
          </p>

          {/* Small Arrow Pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-berry rotate-45" />
        </div>
      )}
    </span>
  );
};

