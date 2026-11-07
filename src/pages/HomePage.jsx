import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Heart, 
  Search, 
  Eye, 
  Sliders, 
  Award, 
  ChevronRight, 
  Zap, 
  Info,
  Layers,
  Sparkles,
  Droplet,
  Package,
  Check
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts } from '../data/mockProducts';

export const HomePage = () => {
  // Interactive Front-of-Package Marketing vs Conscious Reality Toggle
  const [realityMode, setRealityMode] = useState(false);

  // Interactive Nutrition Made Simple demo item
  const [activeDemo, setActiveDemo] = useState(mockProducts[0]);

  return (
    <div className="space-y-24 sm:space-y-36 pb-16">
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-8 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Authentic Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-soft/20 border border-soft text-berry text-xs font-heading font-extrabold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-vibrant" />
                <span>Know what you eat. Choose what matters.</span>
              </div>

              {/* Exact Requested Hero Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-heading font-black tracking-[-0.04em] text-berry leading-[1.05]">
                What's Really Inside <br />
                <span className="text-vibrant relative inline-block">
                  Your Food?
                  <svg className="absolute -bottom-2 left-0 w-full text-warm" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C40 2 120 1.5 199 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Exact Requested Subheading */}
              <p className="text-lg sm:text-xl text-brand-muted max-w-xl mx-auto lg:mx-0 font-body leading-relaxed">
                Scan it. Understand it. Make conscious choices.
              </p>

              <p className="text-sm text-brand-muted/90 max-w-lg mx-auto lg:mx-0 leading-normal">
                Cut through misleading supermarket slogans. Scan any packaged food barcode to uncover actual calories, hidden added sugars, industrial additives, and NOVA processing levels.
              </p>

              {/* Exact Requested Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/scan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-vibrant text-white font-heading font-extrabold text-base hover:bg-vibrant-hover shadow-[0_6px_20px_rgba(246,36,119,0.35)] hover:shadow-lg active:scale-95 transition-all"
                >
                  <ScanLine className="w-5 h-5 text-warm" />
                  <span>Scan Your Food</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white border border-[#EFE4EB] text-berry font-heading font-bold text-base hover:bg-soft-light transition-all shadow-xs"
                >
                  <span>How It Works</span>
                  <ChevronRight className="w-4 h-4 text-berry" />
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-[#EFE4EB] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-brand-muted font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-warm text-berry flex items-center justify-center font-bold text-[10px]">✓</span>
                  <span>Open Food Facts Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-soft text-berry flex items-center justify-center font-bold text-[10px]">✓</span>
                  <span>NOVA Ultra-Processed Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-warm text-berry flex items-center justify-center font-bold text-[10px]">✓</span>
                  <span>100% Free Food Transparency</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Packaging Reality Card */}
            <div className="lg:col-span-5">
              <div className="relative max-w-md mx-auto">
                
                {/* Physical Packaging Card Motif */}
                <div className="paper-card rounded-3xl p-6 sm:p-7 space-y-5 relative">
                  
                  {/* Top Grocery Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#EFE4EB]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-berry text-white text-[10px] font-mono font-bold tracking-widest uppercase">
                        GROCERY AUDIT
                      </span>
                      <span className="text-xs font-mono text-brand-muted">8901234567890</span>
                    </div>

                    <NovaBadge group={2} showLabel={false} />
                  </div>

                  {/* Packaging Image & Interactive Toggle */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#FBF6F9] border border-[#EFE4EB] group">
                    <img
                      src="https://images.unsplash.com/photo-1517093707530-9b634d16db2c?auto=format&fit=crop&w=600&q=80"
                      alt="Artisan Granola"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Barcode scanner laser motif */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-vibrant to-transparent animate-pulse" />

                    {/* Marketing overlay vs Reality overlay */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-[#EFE4EB] text-xs flex items-center justify-between shadow-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-vibrant block">
                          {realityMode ? 'CONSCIOUS REALITY' : 'FRONT-OF-PACKAGE CLAIM'}
                        </span>
                        <span className="font-heading font-extrabold text-berry text-xs">
                          {realityMode ? 'NOVA 2: Gently Baked Whole Seeds' : '★ "100% Natural Superfood Fuel!"'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRealityMode(!realityMode)}
                        className="px-2.5 py-1 rounded-lg bg-berry text-white font-heading text-[11px] font-bold hover:bg-berry-dark transition-colors"
                      >
                        {realityMode ? 'View Slogan' : 'Reveal Truth'}
                      </button>
                    </div>
                  </div>

                  {/* Product Title */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-vibrant">
                      Earth & Hearth Organics
                    </span>
                    <h3 className="text-lg font-heading font-black text-berry leading-snug">
                      Wild Berry & Chia Ancient Grain Granola
                    </h3>
                  </div>

                  {/* Micro Nutrition Facts Strip */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-warm-light border border-warm/80">
                      <span className="block font-heading font-extrabold text-berry text-sm">185</span>
                      <span className="text-[10px] text-brand-muted uppercase font-bold">Calories</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-soft-light border border-soft-border/50">
                      <span className="block font-heading font-extrabold text-berry text-sm">9.8g</span>
                      <span className="text-[10px] text-brand-muted uppercase font-bold">Fibre</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFE4EB]">
                      <span className="block font-heading font-extrabold text-berry text-sm">8.5g</span>
                      <span className="text-[10px] text-brand-muted uppercase font-bold">Sugar</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#EFE4EB]">
                      <span className="block font-heading font-extrabold text-berry text-sm">11.2g</span>
                      <span className="text-[10px] text-brand-muted uppercase font-bold">Protein</span>
                    </div>
                  </div>

                  {/* Realistic Barcode Print Strip */}
                  <div className="pt-2 border-t border-[#EFE4EB] flex items-center justify-between">
                    <div className="flex items-center gap-1 font-mono text-[10px] text-brand-muted tracking-widest">
                      <span>||||| ||| |||| || |||||</span>
                      <span>8901234567890</span>
                    </div>
                    <Link
                      to="/analysis/prod-1"
                      className="text-xs font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
                    >
                      <span>Full Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 1: HOW BE CONSCIOUS WORKS                                         */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        <div className="text-center max-w-xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
            Clear & Instant
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-berry tracking-tight">
            How Be Conscious Works
          </h2>
          <p className="text-sm sm:text-base text-brand-muted">
            Three simple steps to take full control over what enters your body.
          </p>
        </div>

        {/* Narrative Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Step 1 */}
          <div className="paper-card paper-card-hover rounded-3xl p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-berry text-warm flex items-center justify-center font-heading font-black text-lg">
                01
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Scan Any Food Barcode
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Aim your phone camera at the barcode on any packaged snack, drink, or cereal in the grocery aisle or pantry. Or type the numbers manually.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EFE4EB] text-xs font-semibold text-vibrant flex items-center gap-1">
              <ScanLine className="w-3.5 h-3.5" />
              <span>Decodes retail barcodes in &lt;1 second</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="paper-card paper-card-hover rounded-3xl p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-vibrant text-white flex items-center justify-center font-heading font-black text-lg shadow-sm">
                02
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Decode The Micro-Details
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                We cut through misleading claims to reveal exact calories, added sugars, artificial additives, and scientific NOVA processing degrees.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EFE4EB] text-xs font-semibold text-berry flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-vibrant" />
              <span>Powered by Open Food Facts database</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="paper-card paper-card-hover rounded-3xl p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-warm text-berry flex items-center justify-center font-heading font-black text-lg shadow-sm">
                03
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Choose What Matters
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Save your favorites, compare alternatives side-by-side, and make empowered shopping choices without guilt or food anxiety.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EFE4EB] text-xs font-semibold text-berry flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-vibrant" />
              <span>Personalized food intelligence</span>
            </div>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 2: DISCOVER WHAT'S INSIDE                                         */}
      {/* ========================================================================= */}
      <section className="bg-white border-y border-[#EFE4EB] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2 mb-14">
            <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
              Complete Food Clarity
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-berry tracking-tight">
              Discover What's Inside
            </h2>
            <p className="text-sm sm:text-base text-brand-muted">
              We look past front-of-package marketing slogans to expose what really goes into your food.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. NOVA Processing */}
            <div className="p-6 rounded-3xl bg-[#FFFAFC] border border-[#EFE4EB] space-y-3 hover:border-vibrant/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center font-heading font-black text-berry text-base">
                1–4
              </div>
              <h3 className="text-base font-heading font-bold text-berry">
                Processing Degree (NOVA)
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Identifies whether a food is whole and natural or an ultra-processed industrial formulation with synthetic ingredients.
              </p>
            </div>

            {/* 2. Sugar Transparency */}
            <div className="p-6 rounded-3xl bg-[#FFFAFC] border border-[#EFE4EB] space-y-3 hover:border-vibrant/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-soft flex items-center justify-center font-heading font-black text-berry text-base">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-berry">
                Sugar Transparency
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Exposes over 60 chemical aliases for refined sugars, high-fructose syrups, and synthetic zero-calorie sweeteners.
              </p>
            </div>

            {/* 3. Allergen Alerts */}
            <div className="p-6 rounded-3xl bg-[#FFFAFC] border border-[#EFE4EB] space-y-3 hover:border-vibrant/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-berry text-white flex items-center justify-center font-heading font-black text-base">
                <ShieldCheck className="w-5 h-5 text-warm" />
              </div>
              <h3 className="text-base font-heading font-bold text-berry">
                Allergen Detection
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Instant identification of dairy, nuts, soy, gluten, and common cross-contaminants declared on packaging.
              </p>
            </div>

            {/* 4. Chemical Additives */}
            <div className="p-6 rounded-3xl bg-[#FFFAFC] border border-[#EFE4EB] space-y-3 hover:border-vibrant/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-vibrant text-white flex items-center justify-center font-heading font-black text-base">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-heading font-bold text-berry">
                Additives & E-Numbers
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Flags artificial coloring, chemical thickeners, preservatives, and flavor enhancers with objective explanations.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 3: NUTRITION MADE SIMPLE                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
            Interactive Shelf
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-berry tracking-tight">
            Nutrition Made Simple
          </h2>
          <p className="text-sm sm:text-base text-brand-muted">
            Tap between sample grocery items below to see how Be Conscious decodes real food facts.
          </p>
        </div>

        {/* Product Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[mockProducts[0], mockProducts[1], mockProducts[5]].map((item) => {
            const isSelected = activeDemo.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDemo(item)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all border ${
                  isSelected
                    ? 'bg-berry text-white border-berry shadow-soft'
                    : 'bg-white text-brand-text border-[#EFE4EB] hover:bg-soft-light'
                }`}
              >
                <span>{item.name.split(' ').slice(0, 3).join(' ')}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-warm-light text-berry'}`}>
                  NOVA {item.novaGroup}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Product Inspector Card */}
        <div className="max-w-4xl mx-auto paper-card rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Visual Box */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-brand-bg border border-[#EFE4EB] relative">
                <img
                  src={activeDemo.image}
                  alt={activeDemo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <NovaBadge group={activeDemo.novaGroup} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-vibrant uppercase tracking-wider">
                  {activeDemo.brand}
                </span>
                <h4 className="text-lg font-heading font-black text-berry leading-snug">
                  {activeDemo.name}
                </h4>
              </div>

              <ConsciousScoreBadge score={activeDemo.consciousScore} size="lg" />
            </div>

            {/* Nutrition Facts Strip */}
            <div className="md:col-span-7 space-y-5">
              
              <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Energy per 100g</span>
                  <span className="text-2xl font-heading font-black text-berry">
                    {activeDemo.nutritionPer100g.calories} kcal
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">Nutri-Score</span>
                  <span className="text-lg font-heading font-black text-vibrant">
                    Grade {activeDemo.nutriGrade}
                  </span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Fibre ({activeDemo.nutritionPer100g.fiber}g)</span>
                    <span className="text-brand-muted">{activeDemo.nutritionDailyPercent.fiber} DV</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-bg border border-[#EFE4EB] overflow-hidden">
                    <div className="h-full bg-vibrant rounded-full" style={{ width: `${Math.min(100, activeDemo.nutritionPer100g.fiber * 8)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Sugars ({activeDemo.nutritionPer100g.sugars}g)</span>
                    <span className="text-brand-muted">{activeDemo.nutritionDailyPercent.sugars} DV</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-bg border border-[#EFE4EB] overflow-hidden">
                    <div className="h-full bg-warm rounded-full" style={{ width: `${Math.min(100, activeDemo.nutritionPer100g.sugars * 3)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Protein ({activeDemo.nutritionPer100g.protein}g)</span>
                    <span className="text-brand-muted">{activeDemo.nutritionDailyPercent.protein} DV</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-bg border border-[#EFE4EB] overflow-hidden">
                    <div className="h-full bg-berry rounded-full" style={{ width: `${Math.min(100, activeDemo.nutritionPer100g.protein * 4)}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/analysis/${activeDemo.id}`}
                  className="inline-flex items-center gap-2 text-xs font-heading font-bold text-vibrant hover:underline"
                >
                  <span>Open Complete Analysis Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 4: WHY FOOD AWARENESS MATTERS                                     */}
      {/* ========================================================================= */}
      <section className="bg-soft-light/50 border-y border-soft-border/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-heading font-extrabold text-berry uppercase tracking-wider">
                The Reality of Packaged Foods
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-berry tracking-tight leading-tight">
                Modern Supermarkets Are Designed To Confuse You.
              </h2>
              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Over 70% of packaged foods in modern grocery stores are classified as ultra-processed (NOVA Group 4). Marketing claims like "Natural" or "Gluten-Free" often mask industrial emulsifiers, hidden sugars, and chemical preservatives.
              </p>
              <div className="pt-2">
                <Button to="/about" variant="secondary" size="md">
                  Read Our Methodology
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="paper-card rounded-2xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-heading font-black text-berry">73%</span>
                <h4 className="text-xs font-heading font-bold text-brand-text">Supermarket Foods are Ultra-Processed</h4>
                <p className="text-[11px] text-brand-muted">Contains ingredients you'd never find in a home kitchen.</p>
              </div>

              <div className="paper-card rounded-2xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-heading font-black text-vibrant">60+</span>
                <h4 className="text-xs font-heading font-bold text-brand-text">Alternative Sugar Names</h4>
                <p className="text-[11px] text-brand-muted">Used to split sugars down the ingredient list.</p>
              </div>

              <div className="paper-card rounded-2xl p-6 space-y-2">
                <span className="text-3xl sm:text-4xl font-heading font-black text-berry">&lt; 1s</span>
                <h4 className="text-xs font-heading font-bold text-brand-text">Instant Clarity</h4>
                <p className="text-[11px] text-brand-muted">Scan any barcode to decode calories and ingredients.</p>
              </div>

              <div className="paper-card rounded-2xl p-6 space-y-2 bg-warm-light/60 border-warm/80">
                <span className="text-3xl sm:text-4xl font-heading font-black text-berry">100%</span>
                <h4 className="text-xs font-heading font-bold text-brand-text">Independent Data</h4>
                <p className="text-[11px] text-brand-muted">No sponsored brands or compromised ratings.</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 5: FINAL SCAN NOW CTA                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-berry text-white p-8 sm:p-14 text-center space-y-6 shadow-soft-lg relative overflow-hidden">
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-warm text-xs font-heading font-bold uppercase tracking-wider">
              Start Your Conscious Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
              Know What You Eat. <br />
              <span className="text-warm">Choose What Matters.</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Scan your pantry items, favorite snacks, and drinks today to see the real ingredients behind the label in seconds.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/scan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-vibrant text-white font-heading font-extrabold text-base hover:bg-vibrant-hover shadow-vibrant-glow transition-all"
              >
                <ScanLine className="w-5 h-5 text-warm" />
                <span>Scan Food Now</span>
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-base border border-white/20 transition-all"
              >
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
