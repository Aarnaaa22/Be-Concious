import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  SlidersHorizontal,
  ScanLine,
  Check
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
        <Badge variant="warm" size="md">
          Curated Food Catalog
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry">
          Explore Conscious Foods
        </h1>
        <p className="text-base text-brand-muted">
          Browse verified food products to compare nutritional integrity, ingredient quality, and processing transparency.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name, brand, or ingredient (e.g. Oats, Hibiscus, Spelt)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-brand-border focus:border-vibrant focus:ring-4 focus:ring-vibrant/20 outline-none text-sm text-brand-text shadow-soft transition-all"
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
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-berry text-white shadow-soft'
                  : 'bg-white text-brand-text border border-brand-border hover:bg-soft-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* NOVA Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs">
          <span className="font-heading font-bold text-berry">Processing:</span>
          {['All', '1', '2', '3', '4'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedNova(grp)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                selectedNova === grp
                  ? 'bg-vibrant text-white'
                  : 'bg-brand-bg text-brand-muted hover:text-berry border border-brand-border'
              }`}
            >
              {grp === 'All' ? 'All NOVA' : `NOVA ${grp}`}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count & Clear Filter */}
      <div className="flex items-center justify-between text-xs text-brand-muted pb-2 border-b border-brand-border">
        <span>Showing {filteredProducts.length} conscious products</span>
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
        <Card className="bg-white border border-brand-border p-12 text-center max-w-lg mx-auto space-y-4">
          <Sparkles className="w-10 h-10 text-vibrant mx-auto" />
          <h3 className="text-lg font-heading font-bold text-berry">No Products Found</h3>
          <p className="text-xs text-brand-muted">
            We couldn't find any items matching your search criteria. Try clearing filters or search for another food.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedNova('All');
            }}
            variant="outline"
            size="sm"
          >
            Clear Search
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-white border border-brand-border hover:shadow-soft-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Product Image + NOVA group */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-brand-bg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <NovaBadge group={product.novaGroup} showLabel={false} />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-xl shadow-xs text-xs font-bold text-berry border border-brand-border">
                    {product.consciousScore} / 100
                  </div>
                </div>

                {/* Brand & Name */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-vibrant">
                    {product.brand}
                  </span>
                  <h3 className="text-base font-heading font-extrabold text-berry leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2 pt-1 leading-relaxed">
                    {product.summary}
                  </p>
                </div>

                {/* Quick Nutrition Pill Bar */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-warm-light border border-warm/60">
                    <span className="block font-bold text-berry">{product.caloriesPerServing}</span>
                    <span className="text-[10px] text-brand-muted">kcal / serv</span>
                  </div>
                  <div className="p-2 rounded-xl bg-soft-light border border-soft-border/50">
                    <span className="block font-bold text-berry">{product.nutritionPer100g.protein}g</span>
                    <span className="text-[10px] text-brand-muted">Protein</span>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-bg border border-brand-border">
                    <span className="block font-bold text-berry">{product.nutritionPer100g.fiber}g</span>
                    <span className="text-[10px] text-brand-muted">Fiber</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-brand-border/60 mt-4">
                <Link
                  to={`/analysis/${product.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry-dark transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Nutrition & Ingredients</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Scanner Prompt Card */}
      <Card className="bg-warm-light border border-warm p-8 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-xl font-heading font-extrabold text-berry">
          Don't see your food in the list?
        </h3>
        <p className="text-sm text-brand-muted">
          Use the Be Conscious barcode scanner to instantly look up any packaged food in seconds.
        </p>
        <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
          Scan Barcode Now
        </Button>
      </Card>

    </div>
  );
};

