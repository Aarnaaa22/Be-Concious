import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ScanLine, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Heart, 
  Search, 
  HelpCircle,
  Eye,
  Sliders,
  Award,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts } from '../data/mockProducts';

export const HomePage = () => {
  // Interactive preview state for "Nutrition Made Simple"
  const [selectedDemoProduct, setSelectedDemoProduct] = useState(mockProducts[0]);
  const [showRealityToggle, setShowRealityToggle] = useState(false);

  const demoItems = [mockProducts[0], mockProducts[1], mockProducts[5]];

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        {/* Subtle decorative brand blurs (non-distracting, accessible) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-soft/30 via-warm/30 to-vibrant/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-light border border-soft-border text-berry text-xs sm:text-sm font-heading font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-vibrant animate-pulse" />
                <span>Know what you eat. Choose what matters.</span>
              </div>

              {/* Hero Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-berry leading-[1.12]">
                What's Really Inside <br />
                <span className="text-vibrant relative inline-block">
                  Your Food?
                  <svg className="absolute -bottom-2 left-0 w-full text-warm" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C40 2 120 1.5 199 5.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
                Scan it. Understand it. Make conscious choices. Uncover calories, hidden sugars, synthetic additives, and food processing transparency in one snap.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  to="/scan"
                  variant="primary"
                  size="lg"
                  icon={ScanLine}
                  className="w-full sm:w-auto shadow-vibrant-glow text-lg"
                >
                  Scan Your Food
                </Button>

                <Button
                  to="#how-it-works"
                  variant="outline"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto"
                >
                  How It Works
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-brand-border/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs font-medium text-brand-muted">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-warm-light text-berry flex items-center justify-center border border-warm">
                    <CheckCircle2 className="w-4 h-4 text-berry" />
                  </div>
                  <span>Instant Barcode Lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-soft-light text-berry flex items-center justify-center border border-soft-border">
                    <ShieldCheck className="w-4 h-4 text-berry" />
                  </div>
                  <span>NOVA Ultra-Processed Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-warm-light text-berry flex items-center justify-center border border-warm">
                    <Sparkles className="w-4 h-4 text-berry" />
                  </div>
                  <span>100% Free & Transparent</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Hero Card with Barcode & Nutrition Motifs */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Background soft accent card */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-soft via-warm/50 to-vibrant/20 rounded-3xl blur-md opacity-70 transform rotate-1" />

                {/* Main Product Feature Showcase Card */}
                <Card className="relative bg-white border border-brand-border shadow-soft-lg p-6 sm:p-7 space-y-5">
                  
                  {/* Top Bar: Barcode Motif + Category */}
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded bg-brand-bg border border-brand-border font-mono text-[11px] text-brand-muted flex items-center gap-1.5">
                        <ScanLine className="w-3.5 h-3.5 text-vibrant" />
                        <span>8901234567890</span>
                      </div>
                      <span className="text-xs text-brand-muted font-medium">Scanned Just Now</span>
                    </div>

                    <NovaBadge group={2} showLabel={false} />
                  </div>

                  {/* Food Image + Conscious Score Overlay */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-brand-bg group">
                    <img 
                      src="https://images.unsplash.com/photo-1517093707530-9b634d16db2c?auto=format&fit=crop&w=600&q=80" 
                      alt="Artisan Granola" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating Conscious Score Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-soft border border-brand-border flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-vibrant" />
                      <div>
                        <span className="text-xs font-extrabold text-berry">88 / 100</span>
                        <span className="block text-[9px] uppercase font-bold text-brand-muted leading-tight">Conscious</span>
                      </div>
                    </div>

                    {/* Laser Scan line animation motif */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-vibrant to-transparent animate-pulse top-1/2" />
                  </div>

                  {/* Product Title & Brand */}
                  <div>
                    <span className="text-xs font-bold text-vibrant uppercase tracking-wider">Earth & Hearth Organics</span>
                    <h3 className="text-lg font-heading font-extrabold text-berry leading-snug">
                      Wild Berry & Chia Ancient Grain Granola
                    </h3>
                  </div>

                  {/* Micro Nutrition Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-warm-light border border-warm/80">
                      <span className="block text-xs font-bold text-berry">185</span>
                      <span className="text-[10px] text-brand-muted">Calories</span>
                    </div>
                    <div className="p-2 rounded-xl bg-soft-light border border-soft-border/50">
                      <span className="block text-xs font-bold text-berry">9.8g</span>
                      <span className="text-[10px] text-brand-muted">Fiber</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-brand-border">
                      <span className="block text-xs font-bold text-berry">8.5g</span>
                      <span className="text-[10px] text-brand-muted">Sugars</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-brand-border">
                      <span className="block text-xs font-bold text-berry">11.2g</span>
                      <span className="text-[10px] text-brand-muted">Protein</span>
                    </div>
                  </div>

                  {/* Interactive Front vs Reality Peek */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowRealityToggle(!showRealityToggle)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-brand-bg hover:bg-soft-light border border-brand-border text-xs font-heading font-bold text-berry flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-vibrant" />
                        {showRealityToggle ? 'Showing: Conscious Reality' : 'Tap to Reveal Hidden Nutrition'}
                      </span>
                      <span className="text-vibrant text-[11px] underline">
                        {showRealityToggle ? 'Reset' : 'Inspect'}
                      </span>
                    </button>

                    {showRealityToggle && (
                      <div className="mt-2 p-3 rounded-2xl bg-soft-light border border-soft-border text-xs space-y-1.5 animate-fadeIn">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-brand-text">Sweetener Source:</span>
                          <span className="font-bold text-berry">100% Pure Date Paste (No refined sugar)</span>
                        </div>
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-brand-text">Ultra-Processed Additives:</span>
                          <span className="font-bold text-berry">0 Synthetic Emulsifiers</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-1">
                    <Link
                      to="/analysis/prod-1"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry-dark transition-colors"
                    >
                      <span>Explore Full Nutritional Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </Card>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 1: HOW BE CONSCIOUS WORKS                                         */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="warm" size="md">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry">
            How Be Conscious Works
          </h2>
          <p className="text-base sm:text-lg text-brand-muted">
            We transform confusing barcode digits and deceptive marketing buzzwords into clear, actionable food intelligence.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <Card className="bg-white border border-brand-border p-8 relative flex flex-col justify-between hover:shadow-soft-md transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-soft-light border border-soft-border flex items-center justify-center text-berry">
                <ScanLine className="w-7 h-7 text-vibrant" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-warm-light text-berry font-heading font-bold text-xs">
                Step 01
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Scan Any Food Barcode
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Aim your phone camera at any packaged food in the grocery aisle or kitchen pantry. Or type the barcode numbers directly.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 flex items-center text-xs font-semibold text-vibrant">
              <span>Fast barcode detection</span>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="bg-white border border-brand-border p-8 relative flex flex-col justify-between hover:shadow-soft-md transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-warm-light border border-warm flex items-center justify-center text-berry">
                <Sliders className="w-7 h-7 text-berry" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-soft-light text-berry font-heading font-bold text-xs">
                Step 02
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Decode The Micro-Details
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Instantly see calories, macro breakdowns, hidden added sugars, chemical preservatives, allergen hazards, and NOVA processing group.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 flex items-center text-xs font-semibold text-berry">
              <span>Deep transparency metrics</span>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="bg-white border border-brand-border p-8 relative flex flex-col justify-between hover:shadow-soft-md transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-soft-light border border-soft-border flex items-center justify-center text-berry">
                <Award className="w-7 h-7 text-vibrant" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-warm-light text-berry font-heading font-bold text-xs">
                Step 03
              </div>
              <h3 className="text-xl font-heading font-bold text-berry">
                Choose What Matters
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Make confident dietary decisions aligned with your personal health goals. Compare with wholesome, minimally-processed alternatives.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 flex items-center text-xs font-semibold text-vibrant">
              <span>Empowered nutrition choices</span>
            </div>
          </Card>

        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
            Try The Food Scanner
          </Button>
        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 2: DISCOVER WHAT'S INSIDE                                         */}
      {/* ========================================================================= */}
      <section className="bg-white border-y border-brand-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="soft" size="md">
              Complete Food Clarity
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry">
              Discover What's Inside
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              We look past front-of-package marketing claims to reveal what's actually entering your body.
            </p>
          </div>

          {/* 4 Feature Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. NOVA Processing Index */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border space-y-4 hover:border-vibrant/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-warm flex items-center justify-center text-brand-text font-bold text-lg shadow-sm">
                4
              </div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Processing Degree
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Classifies foods using the globally recognized NOVA scientific system from minimally processed (Group 1) to ultra-processed formulations (Group 4).
              </p>
              <div className="text-xs font-semibold text-berry">
                Identifies industrial reformulation
              </div>
            </div>

            {/* 2. Hidden Sugars & Sweeteners */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border space-y-4 hover:border-vibrant/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-soft flex items-center justify-center text-berry font-bold text-lg shadow-sm">
                <Flame className="w-6 h-6 text-berry" />
              </div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Sugar Transparency
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Exposes over 60 cryptic pseudonyms for refined sugars, high-fructose syrups, and synthetic zero-calorie sweeteners.
              </p>
              <div className="text-xs font-semibold text-berry">
                Differentiates natural vs added sugars
              </div>
            </div>

            {/* 3. Allergen & Sensitivity Warnings */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border space-y-4 hover:border-vibrant/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-berry text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <ShieldCheck className="w-6 h-6 text-warm" />
              </div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Allergen Detection
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Immediate detection of top allergens including gluten, dairy, peanuts, soy, tree nuts, and sulfites, plus cross-contamination warnings.
              </p>
              <div className="text-xs font-semibold text-berry">
                Protects sensitive eaters
              </div>
            </div>

            {/* 4. Chemical Additives & E-Numbers */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-border space-y-4 hover:border-vibrant/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-vibrant text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Chemical Additives
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Flags artificial coloring, chemical thickeners, sodium benzoates, and flavor enhancers with clear explanations of why they are used.
              </p>
              <div className="text-xs font-semibold text-berry">
                Clear plain-English explanations
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 3: NUTRITION MADE SIMPLE (INTERACTIVE PREVIEW)                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="warm" size="md">
            Interactive Product Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry">
            Nutrition Made Simple
          </h2>
          <p className="text-base sm:text-lg text-brand-muted">
            Tap on sample foods below to see how Be Conscious breaks down real food data without confusing scientific jargon.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {demoItems.map((item) => {
            const isSelected = selectedDemoProduct.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDemoProduct(item)}
                className={`px-5 py-3 rounded-2xl font-heading text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-berry text-white border-berry shadow-soft'
                    : 'bg-white text-brand-text border-brand-border hover:bg-soft-light'
                }`}
              >
                <span>{item.name.split(' ')[0]} {item.name.split(' ')[1]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-warm-light text-berry'}`}>
                  Score {item.consciousScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Detail Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-brand-border shadow-soft-lg p-6 sm:p-10">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Product Visual & Badges */}
              <div className="md:col-span-5 space-y-4">
                <div className="h-56 rounded-2xl overflow-hidden bg-brand-bg relative">
                  <img
                    src={selectedDemoProduct.image}
                    alt={selectedDemoProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <NovaBadge group={selectedDemoProduct.novaGroup} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-vibrant uppercase tracking-wider">
                    {selectedDemoProduct.brand}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-berry leading-snug">
                    {selectedDemoProduct.name}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Serving size: {selectedDemoProduct.servingSize}
                  </p>
                </div>

                <div className="pt-2">
                  <ConsciousScoreBadge score={selectedDemoProduct.consciousScore} size="lg" />
                </div>
              </div>

              {/* Nutrition & Ingredient Insights */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Calories Highlight banner */}
                <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-brand-muted block">Energy Per Serving</span>
                    <span className="text-2xl font-heading font-extrabold text-berry">
                      {selectedDemoProduct.caloriesPerServing} kcal
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-brand-muted block">Per 100g</span>
                    <span className="text-sm font-bold text-brand-text">
                      {selectedDemoProduct.caloriesPer100g} kcal
                    </span>
                  </div>
                </div>

                {/* Macronutrient Progress Bars (Visual & Accessible) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-berry">
                    Key Macronutrients & Daily Value
                  </h4>

                  {/* Protein */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Protein</span>
                      <span className="font-bold text-berry">{selectedDemoProduct.nutritionPer100g.protein}g ({selectedDemoProduct.nutritionDailyPercent.protein})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                      <div 
                        className="h-full bg-berry rounded-full" 
                        style={{ width: `${Math.min(100, selectedDemoProduct.nutritionPer100g.protein * 4)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Fiber */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Fiber</span>
                      <span className="font-bold text-berry">{selectedDemoProduct.nutritionPer100g.fiber}g ({selectedDemoProduct.nutritionDailyPercent.fiber})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                      <div 
                        className="h-full bg-vibrant rounded-full" 
                        style={{ width: `${Math.min(100, selectedDemoProduct.nutritionPer100g.fiber * 8)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Sugars */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Sugars</span>
                      <span className="font-bold text-berry">{selectedDemoProduct.nutritionPer100g.sugars}g ({selectedDemoProduct.nutritionDailyPercent.sugars})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                      <div 
                        className="h-full bg-warm rounded-full" 
                        style={{ width: `${Math.min(100, selectedDemoProduct.nutritionPer100g.sugars * 3)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Total Fat */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Total Fat</span>
                      <span className="font-bold text-berry">{selectedDemoProduct.nutritionPer100g.totalFat}g ({selectedDemoProduct.nutritionDailyPercent.fat})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-bg overflow-hidden border border-brand-border">
                      <div 
                        className="h-full bg-soft-deep rounded-full" 
                        style={{ width: `${Math.min(100, selectedDemoProduct.nutritionPer100g.totalFat * 2)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Key Ingredients Pill List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-berry">
                    Ingredients Checklist
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDemoProduct.ingredients.map((ing, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-brand-bg border border-brand-border text-brand-text font-medium"
                      >
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Full Analysis Button */}
                <div className="pt-2">
                  <Button
                    to={`/analysis/${selectedDemoProduct.id}`}
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto"
                  >
                    View Comprehensive Analysis
                  </Button>
                </div>

              </div>

            </div>

          </Card>
        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 4: WHY FOOD AWARENESS MATTERS                                     */}
      {/* ========================================================================= */}
      <section className="bg-soft-light/60 border-y border-soft-border/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mission text & stats */}
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="berry" size="md">
                Why It Matters
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry leading-tight">
                Modern Supermarkets Are Designed To Confuse You.
              </h2>

              <p className="text-base text-brand-muted leading-relaxed">
                Food packaging is covered with health slogans like "Natural", "Gluten-Free", or "Multigrain" that mask ultra-processed formulations, industrial emulsifiers, and excessive chemical additives.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vibrant text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-berry text-sm">Over 70% Ultra-Processed Food Exposure</h4>
                    <p className="text-xs text-brand-muted mt-0.5">Studies show the standard Western grocery cart is dominated by NOVA Group 4 products linked to metabolic fatigue.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vibrant text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-berry text-sm">60+ Chemical Names for Sugars</h4>
                    <p className="text-xs text-brand-muted mt-0.5">Manufacturers split sugars into different fractions to push them further down the ingredient list.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vibrant text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-berry text-sm">Conscious Choices Create Sustainable Health</h4>
                    <p className="text-xs text-brand-muted mt-0.5">Knowing what you eat puts power back into your hands, without restrictive fad diets or guilt.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button to="/about" variant="secondary" size="md" icon={Info}>
                  Read Our Scientific Methodology
                </Button>
              </div>

            </div>

            {/* Right Column: Key Metric Callout Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <Card className="bg-white border border-brand-border p-6 space-y-3">
                <span className="text-4xl font-heading font-black text-berry">73%</span>
                <h4 className="font-heading font-bold text-brand-text text-base">Supermarket Ultra-Processed Foods</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  The proportion of packaged foods that contain ingredients you would never find in a home kitchen.
                </p>
              </Card>

              <Card className="bg-white border border-brand-border p-6 space-y-3">
                <span className="text-4xl font-heading font-black text-vibrant">&lt; 1 sec</span>
                <h4 className="font-heading font-bold text-brand-text text-base">Instant Clarity</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Scan any barcode to decode calories, additives, and nutrition facts faster than reading fine print.
                </p>
              </Card>

              <Card className="bg-white border border-brand-border p-6 space-y-3">
                <span className="text-4xl font-heading font-black text-berry">4 Levels</span>
                <h4 className="font-heading font-bold text-brand-text text-base">NOVA Classification</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Scientifically proven standard adopted by the WHO and epidemiologists worldwide.
                </p>
              </Card>

              <Card className="bg-warm-light border border-warm/80 p-6 space-y-3">
                <span className="text-4xl font-heading font-black text-berry">100%</span>
                <h4 className="font-heading font-bold text-brand-text text-base">Free Food Transparency</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  No paywalls, no sponsored brands, and no compromised rankings. Truth in every scan.
                </p>
              </Card>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 5: FINAL SCAN NOW CTA                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-berry text-white overflow-hidden p-8 sm:p-14 shadow-soft-lg">
          
          {/* Decorative motif shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-vibrant/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-warm/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-warm border border-white/20 text-xs font-heading font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready To Start Your Conscious Journey?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
              Know What You Eat. <br />
              <span className="text-warm">Choose What Matters.</span>
            </h2>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto">
              Scan your favorite snacks, pantry staples, and beverages today. See the real ingredients behind the label in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                to="/scan"
                variant="warm"
                size="lg"
                icon={ScanLine}
                className="w-full sm:w-auto text-berry font-extrabold shadow-lg"
              >
                Scan A Food Barcode Now
              </Button>

              <Button
                to="/explore"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10 hover:border-white"
              >
                Explore Food Database
              </Button>
            </div>

            <div className="pt-4 text-xs text-white/70">
              Works on mobile phones, tablets, and desktop browsers. No download required.
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

