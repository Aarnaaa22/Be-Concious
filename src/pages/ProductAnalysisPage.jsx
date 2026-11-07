import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts, getProductById } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';

export const ProductAnalysisPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaveProduct } = useHistory();

  // Find product, fallback to first mock product if none found or route is generic /analysis
  const product = getProductById(productId) || mockProducts[0];
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'nutrition' | 'ingredients' | 'processing'
  const [copiedLink, setCopiedLink] = useState(false);

  const saved = isSaved(product.id);

  // Recharts Macro Data
  const macroChartData = [
    { name: 'Carbs', value: product.nutritionPer100g.carbohydrates, color: '#FFE185' }, // Warm Yellow
    { name: 'Fat', value: product.nutritionPer100g.totalFat, color: '#FFADEE' },        // Soft Pink
    { name: 'Protein', value: product.nutritionPer100g.protein, color: '#92003A' },      // Deep Berry
    { name: 'Fiber', value: product.nutritionPer100g.fiber, color: '#F62477' },         // Vibrant Pink
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Actions */}
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

      {/* Main Header Product Banner */}
      <Card className="bg-white border border-brand-border shadow-soft-md p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Product Image */}
          <div className="lg:col-span-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-bg relative border border-brand-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <NovaBadge group={product.novaGroup} />
              </div>
            </div>
          </div>

          {/* Core Info */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-vibrant uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-brand-muted">•</span>
              <span className="text-xs text-brand-muted font-medium">
                {product.category}
              </span>
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

            {/* Score & Key Highlights Ribbon */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <ConsciousScoreBadge score={product.consciousScore} size="lg" />
              
              <div className="px-3 py-1.5 rounded-full bg-warm-light border border-warm/80 text-xs font-bold text-berry flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-vibrant" />
                <span>{product.caloriesPerServing} kcal / serving ({product.servingSize})</span>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-soft-light border border-soft-border/60 text-xs font-bold text-berry">
                <span>Nutri-Grade: {product.nutriGrade}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-brand-bg border border-brand-border text-brand-text font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

        </div>
      </Card>


      {/* Navigation Tabs for Deep Breakdown */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-2">
        {[
          { id: 'overview', label: 'Overview & Highlights' },
          { id: 'nutrition', label: 'Nutrition & Macros' },
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


      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Metrics */}
          <Card className="bg-white border border-brand-border p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <Flame className="w-5 h-5 text-vibrant" />
              <span>Energy & Serving</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Recommended Serving</span>
                <span className="font-bold text-berry">{product.servingSize}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Calories (Per Serving)</span>
                <span className="font-bold text-berry">{product.caloriesPerServing} kcal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-border">
                <span className="text-brand-muted">Calories (Per 100g)</span>
                <span className="font-bold text-berry">{product.caloriesPer100g} kcal</span>
              </div>
            </div>
          </Card>

          {/* Processing Snapshot */}
          <Card className="bg-white border border-brand-border p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-berry" />
              <span>Processing Verdict</span>
            </h3>
            <div className="p-3 rounded-2xl bg-warm-light border border-warm/80 text-xs font-semibold text-berry">
              {product.novaLabel}
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              {product.processingDetails.processingSummary}
            </p>
            <div className="text-xs font-bold text-brand-text">
              Ultra-Processed: <span className={product.processingDetails.ultraProcessed ? 'text-berry' : 'text-vibrant'}>
                {product.processingDetails.ultraProcessed ? 'Yes (NOVA 4)' : 'No (Natural / Culinary)'}
              </span>
            </div>
          </Card>

          {/* Allergen & Additives */}
          <Card className="bg-white border border-brand-border p-6 space-y-4">
            <h3 className="text-base font-heading font-bold text-berry flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warm-dark" />
              <span>Allergen Snapshot</span>
            </h3>
            <div className="space-y-2">
              {product.allergens.map((alg, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-berry-50 border border-berry-200 text-xs font-semibold text-berry">
                  {alg}
                </div>
              ))}
            </div>
            <div className="text-xs text-brand-muted">
              Chemical Additives count: <span className="font-bold text-berry">{product.additives.length}</span>
            </div>
          </Card>

        </div>
      )}


      {/* TAB 2: NUTRITION & MACROS */}
      {activeTab === 'nutrition' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Recharts Macro Donut */}
            <div className="lg:col-span-5">
              <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
                <h3 className="text-base font-heading font-bold text-berry">
                  Macronutrient Proportions (per 100g)
                </h3>
                
                <div className="h-64 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
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
                          boxShadow: '0 4px 20px -2px rgba(146,0,58,0.1)',
                          fontSize: '12px',
                          fontFamily: 'DM Sans',
                          fontWeight: 'bold',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Donut Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-heading font-extrabold text-berry">
                      {product.caloriesPer100g}
                    </span>
                    <span className="text-[11px] font-bold text-brand-muted uppercase">
                      kcal / 100g
                    </span>
                  </div>
                </div>

                {/* Macro Legend */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold">
                  {macroChartData.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-brand-bg border border-brand-border">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                      <span className="text-brand-text">{m.name}:</span>
                      <span className="font-bold text-berry ml-auto">{m.value}g</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Nutrition Table (Per 100g vs Daily Reference) */}
            <div className="lg:col-span-7">
              <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
                <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                  <h3 className="text-base font-heading font-bold text-berry">
                    Nutritional Values Table
                  </h3>
                  <span className="text-xs text-brand-muted">
                    Based on standard 2,000 kcal diet
                  </span>
                </div>

                <div className="divide-y divide-brand-border text-sm">
                  
                  <div className="py-2.5 flex justify-between items-center font-bold text-berry">
                    <span>Calories</span>
                    <span>{product.nutritionPer100g.calories} kcal</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Total Fat</span>
                      <span className="block text-xs text-brand-muted">Saturated Fat: {product.nutritionPer100g.saturatedFat}g</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-berry">{product.nutritionPer100g.totalFat}g</span>
                      <span className="block text-xs text-brand-muted">{product.nutritionDailyPercent.fat} DV</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Carbohydrates</span>
                      <span className="block text-xs text-brand-muted">Sugars: {product.nutritionPer100g.sugars}g</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-berry">{product.nutritionPer100g.carbohydrates}g</span>
                      <span className="block text-xs text-brand-muted">{product.nutritionDailyPercent.carbs} DV</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Dietary Fiber</span>
                      <span className="block text-xs text-brand-muted">Supports gut digestion</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-berry">{product.nutritionPer100g.fiber}g</span>
                      <span className="block text-xs text-brand-muted">{product.nutritionDailyPercent.fiber} DV</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Protein</span>
                      <span className="block text-xs text-brand-muted">Cellular repair & fullness</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-berry">{product.nutritionPer100g.protein}g</span>
                      <span className="block text-xs text-brand-muted">{product.nutritionDailyPercent.protein} DV</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-brand-text">Sodium</span>
                      <span className="block text-xs text-brand-muted">Electrolyte balance</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-berry">{product.nutritionPer100g.sodium}mg</span>
                      <span className="block text-xs text-brand-muted">{product.nutritionDailyPercent.sodium} DV</span>
                    </div>
                  </div>

                </div>
              </Card>
            </div>

          </div>

        </div>
      )}


      {/* TAB 3: INGREDIENTS & ADDITIVES */}
      {activeTab === 'ingredients' && (
        <div className="space-y-6">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">
                Full Ingredient Breakdown
              </h3>
              <p className="text-xs text-brand-muted">
                Ingredients listed in order of predominance by weight as reported on package label.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-brand-text text-sm">
                        {ing.name}
                      </span>
                      {ing.isOrganic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warm-light text-berry border border-warm">
                          Organic
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-brand-muted capitalize">
                      Category: {ing.type.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-soft-light border border-soft-border flex items-center justify-center text-berry text-xs font-bold">
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Additives Section */}
            <div className="pt-6 border-t border-brand-border space-y-3">
              <h4 className="text-base font-heading font-bold text-berry">
                Chemical Additives & E-Numbers
              </h4>
              {product.additives.length === 0 ? (
                <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-berry flex-shrink-0" />
                  <span className="text-sm font-semibold text-berry">
                    Zero chemical additives, artificial colorings, or synthetic preservatives detected.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.additives.map((add, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-berry-50 border border-berry/30 text-xs font-semibold text-berry flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{add}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </Card>
        </div>
      )}


      {/* TAB 4: NOVA FOOD PROCESSING */}
      {activeTab === 'processing' && (
        <div className="space-y-6">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-berry">
                NOVA Food Classification System
              </h3>
              <p className="text-xs text-brand-muted">
                Created by scientific researchers at the Center for Epidemiological Studies in Health & Nutrition, University of São Paulo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-soft-light border border-soft-border space-y-2">
              <div className="flex items-center gap-3">
                <NovaBadge group={product.novaGroup} />
                <span className="font-heading font-bold text-berry text-sm">
                  {product.novaLabel}
                </span>
              </div>
              <p className="text-sm text-brand-text leading-relaxed pt-2">
                {product.processingDetails.processingSummary}
              </p>
            </div>

            {/* NOVA 4 explanation guide */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${product.novaGroup === 1 ? 'bg-warm-light border-warm font-bold text-berry' : 'bg-brand-bg border-brand-border text-brand-muted'}`}>
                <span className="block font-bold">Group 1</span>
                <span>Unprocessed or minimally processed foods (grains, seeds, milk, fruits).</span>
              </div>
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${product.novaGroup === 2 ? 'bg-warm-light border-warm font-bold text-berry' : 'bg-brand-bg border-brand-border text-brand-muted'}`}>
                <span className="block font-bold">Group 2</span>
                <span>Processed culinary ingredients (oils, butter, honey, salt).</span>
              </div>
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${product.novaGroup === 3 ? 'bg-warm-light border-warm font-bold text-berry' : 'bg-brand-bg border-brand-border text-brand-muted'}`}>
                <span className="block font-bold">Group 3</span>
                <span>Processed foods (fresh breads, cured items, simple canned foods).</span>
              </div>
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${product.novaGroup === 4 ? 'bg-berry text-white font-bold' : 'bg-brand-bg border-brand-border text-brand-muted'}`}>
                <span className="block font-bold">Group 4</span>
                <span>Ultra-processed food & drink formulations (emulsified, extruded).</span>
              </div>
            </div>

          </Card>
        </div>
      )}

    </div>
  );
};

