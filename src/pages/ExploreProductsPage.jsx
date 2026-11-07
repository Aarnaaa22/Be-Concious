import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Layers,
  Sparkles,
  ExternalLink,
  Loader2,
  ScanLine
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { mockProducts } from '../data/mockProducts';

export const ExploreProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNova, setSelectedNova] = useState('All');

  const categories = [
    'All',
    'Breakfast & Cereals',
    'Beverages',
    'Dairy & Cultured',
    'Snacks & Savory',
    'Spreads & Dips'
  ];

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesNova = selectedNova === 'All' || product.novaGroup === parseInt(selectedNova, 10);

      return matchesSearch && matchesCategory && matchesNova;
    });
  }, [searchTerm, selectedCategory, selectedNova]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
          Curated Food Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-berry tracking-tight">
          Explore Conscious Foods
        </h1>
        <p className="text-sm sm:text-base text-brand-muted">
          Compare verified packaged grocery items by nutrient density, natural sweetening, and NOVA processing degrees.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 max-w-3xl mx-auto">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name, brand, or ingredients (e.g. Oats, Spelt, Hibiscus)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#EFE4EB] focus:border-vibrant focus:ring-4 focus:ring-vibrant/10 outline-none text-sm text-brand-text shadow-xs transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted hover:text-berry"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-berry text-white shadow-soft'
                  : 'bg-white text-brand-text border border-[#EFE4EB] hover:bg-soft-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* NOVA Processing Degree Pills */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs">
          <span className="font-heading font-bold text-berry">Processing:</span>
          {['All', '1', '2', '3', '4'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedNova(grp)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                selectedNova === grp
                  ? 'bg-vibrant text-white shadow-xs'
                  : 'bg-white text-brand-muted hover:text-berry border border-[#EFE4EB]'
              }`}
            >
              {grp === 'All' ? 'All NOVA' : `NOVA ${grp}`}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-brand-muted pb-2 border-b border-[#EFE4EB]">
        <span>Showing {filteredProducts.length} verified products</span>
        {(searchTerm || selectedCategory !== 'All' || selectedNova !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedNova('All');
            }}
            className="font-bold text-vibrant hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="paper-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <Search className="w-10 h-10 text-vibrant mx-auto" />
          <h3 className="text-lg font-heading font-bold text-berry">No Catalog Matches</h3>
          <p className="text-xs text-brand-muted">
            We couldn't find items in this view matching "{searchTerm}". Try scanning the physical barcode directly!
          </p>
          <Button to="/scan" variant="primary" size="sm" icon={ScanLine}>
            Scan Physical Barcode
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="paper-card paper-card-hover rounded-3xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Product Packaging Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBF6F9] border border-[#EFE4EB]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <NovaBadge group={product.novaGroup} showLabel={false} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs text-xs font-heading font-extrabold text-berry border border-[#EFE4EB]">
                    Score {product.consciousScore}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-vibrant block">
                    {product.brand}
                  </span>
                  <h3 className="text-base font-heading font-black text-berry leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 pt-1 leading-relaxed">
                    {product.summary}
                  </p>
                </div>

                {/* Micro Nutrients Strip */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-warm-light border border-warm/80">
                    <span className="block font-heading font-bold text-berry">{product.caloriesPerServing}</span>
                    <span className="text-[10px] text-brand-muted">kcal / serv</span>
                  </div>
                  <div className="p-2 rounded-xl bg-soft-light border border-soft-border/50">
                    <span className="block font-heading font-bold text-berry">{product.nutritionPer100g.protein}g</span>
                    <span className="text-[10px] text-brand-muted">Protein</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#EFE4EB]">
                    <span className="block font-heading font-bold text-berry">{product.nutritionPer100g.fiber}g</span>
                    <span className="text-[10px] text-brand-muted">Fibre</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#EFE4EB] mt-4">
                <Link
                  to={`/analysis/${product.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry-dark transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>View Full Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Scanner Prompt Card */}
      <div className="paper-card rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 bg-warm-light/60 border-warm/80">
        <h3 className="text-xl font-heading font-black text-berry">
          Don't see your food on this shelf?
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted">
          Use the real camera scanner to look up any packaged barcode in the worldwide database in seconds.
        </p>
        <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
          Scan Barcode Now
        </Button>
      </div>

    </div>
  );
};
