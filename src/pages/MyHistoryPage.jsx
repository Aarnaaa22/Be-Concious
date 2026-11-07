import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Trash2,
  ScanLine,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Flame,
  CheckCircle2,
  Calendar,
  Scale,
  Search,
  X,
  AlertTriangle,
  Sparkles,
  Filter,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { useHistory } from '../context/HistoryContext';

export const MyHistoryPage = () => {
  const {
    history,
    savedProducts,
    removeFromHistory,
    clearHistory,
    removeSavedProduct,
    toggleSaveProduct,
    isSaved
  } = useHistory();

  const [activeTab, setActiveTab] = useState('scans'); // 'scans' | 'saved'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNova, setFilterNova] = useState('all'); // 'all' | 'nova12' | 'nova34' | 'highScore'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatScanTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  // Filter history items
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );

      let matchesFilter = true;
      if (filterNova === 'nova12') {
        matchesFilter = item.novaGroup === 1 || item.novaGroup === 2;
      } else if (filterNova === 'nova34') {
        matchesFilter = item.novaGroup === 3 || item.novaGroup === 4;
      } else if (filterNova === 'highScore') {
        matchesFilter = (item.consciousScore || 0) >= 80;
      }

      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, filterNova]);

  // Filter saved products
  const filteredSaved = useMemo(() => {
    return savedProducts.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );

      let matchesFilter = true;
      if (filterNova === 'nova12') {
        matchesFilter = item.novaGroup === 1 || item.novaGroup === 2;
      } else if (filterNova === 'nova34') {
        matchesFilter = item.novaGroup === 3 || item.novaGroup === 4;
      } else if (filterNova === 'highScore') {
        matchesFilter = (item.consciousScore || 0) >= 80;
      }

      return matchesSearch && matchesFilter;
    });
  }, [savedProducts, searchQuery, filterNova]);

  const handleConfirmClear = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">

      {/* ========================================================================= */}
      {/* HEADER: "Your Conscious Journey."                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EFE4EB]">
        <div className="space-y-2">
          <Badge variant="vibrant" size="md">
            Personal Food History & Favourites
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-berry tracking-tight">
            Your Conscious Journey.
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl leading-relaxed">
            Review decoded groceries, reopen comprehensive analyses, remove individual entries, or curate your saved nutritional favorites.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button to="/scan" variant="primary" size="md" icon={ScanLine} className="shadow-vibrant-glow">
            Scan New Food
          </Button>
          <Button to="/compare" variant="secondary" size="md" icon={Scale}>
            Compare Foods
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS & SEARCH BAR                                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('scans')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 ${activeTab === 'scans'
                  ? 'bg-berry text-white shadow-soft'
                  : 'text-brand-text hover:text-berry hover:bg-soft-light'
                }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recently Scanned ({history.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all flex items-center gap-2 ${activeTab === 'saved'
                  ? 'bg-berry text-white shadow-soft'
                  : 'text-brand-text hover:text-berry hover:bg-soft-light'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Favourites ({savedProducts.length})</span>
            </button>
          </div>

          {/* Clear History Trigger (Only for Scans tab when history has items) */}
          {activeTab === 'scans' && history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-heading font-bold text-brand-muted hover:text-vibrant px-3 py-2 rounded-xl hover:bg-soft-light border border-transparent hover:border-[#EFE4EB] transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* Large Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'scans' ? 'scanned items' : 'saved favorites'} by product name, brand, or barcode...`}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-[#EFE4EB] focus:border-vibrant focus:ring-4 focus:ring-vibrant/10 outline-none text-xs sm:text-sm font-medium text-brand-text shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-muted hover:text-berry"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'nova12', label: 'NOVA 1-2' },
              { id: 'nova34', label: 'NOVA 3-4' },
              { id: 'highScore', label: 'Score 80+' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterNova(f.id)}
                className={`px-3 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${filterNova === f.id
                    ? 'bg-warm text-berry shadow-xs border border-warm/90'
                    : 'bg-white text-brand-muted hover:text-berry border border-[#EFE4EB]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CLEAR HISTORY CONFIRMATION MODAL                                          */}
      {/* ========================================================================= */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE4EB] shadow-soft-lg p-6 sm:p-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-warm-light border border-warm/80 text-berry flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-vibrant" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-heading font-black text-berry">
                Clear Entire Scan History?
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                This will delete all {history.length} logged products from your local device storage. Your saved favorites will remain intact.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmClear}
                variant="primary"
                size="md"
                className="flex-1 !bg-vibrant hover:!bg-vibrant/90 text-white"
              >
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: RECENTLY SCANNED PRODUCTS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'scans' && (
        <div className="space-y-4">

          {/* Empty State when no history exists */}
          {history.length === 0 ? (
            <div className="paper-card rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-soft-light text-berry flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-berry" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-black text-berry">
                  No Scanned Foods Yet
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Start your conscious journey by scanning your first grocery package barcode or choosing from our catalog benchmarks.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
                  Open Barcode Scanner
                </Button>
                <Button to="/explore" variant="secondary" size="md">
                  Explore Catalog
                </Button>
              </div>
            </div>
          ) : filteredHistory.length === 0 ? (
            /* Empty state when search/filter has no match */
            <div className="paper-card rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
              <Search className="w-10 h-10 text-brand-muted mx-auto opacity-50" />
              <h3 className="text-base font-heading font-bold text-berry">
                No Scans Match Your Filter
              </h3>
              <p className="text-xs text-brand-muted">
                No items match "{searchQuery}". Try clearing search or selecting "All Items".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilterNova('all'); }}
                className="text-xs font-heading font-bold text-vibrant underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* History List */
            <div className="space-y-3">
              {filteredHistory.map((item, index) => {
                const itemKey = item.barcode || item.id;
                const isItemSaved = isSaved(itemKey);

                return (
                  <div
                    key={`${itemKey}-${index}`}
                    className="paper-card paper-card-hover rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group"
                  >
                    {/* Left: Image & Details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-heading font-extrabold text-vibrant uppercase tracking-wider">
                            {item.brand || 'Verified Brand'}
                          </span>
                          <span className="text-xs text-brand-muted">•</span>
                          <span className="text-xs text-brand-muted font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-muted" />
                            {formatScanTime(item.scannedAt)}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-heading font-bold text-berry line-clamp-1">
                          {item.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          {item.novaGroup && <NovaBadge group={item.novaGroup} showLabel={false} />}
                          {item.nutritionPer100g?.calories && (
                            <span className="text-[11px] font-mono font-bold text-berry bg-warm-light px-2.5 py-0.5 rounded-full border border-warm/80">
                              {Math.round(item.nutritionPer100g.calories)} kcal / 100g
                            </span>
                          )}
                          {item.consciousScore && (
                            <span className="text-[11px] font-heading font-extrabold text-vibrant bg-soft-light px-2.5 py-0.5 rounded-full border border-soft">
                              Score {item.consciousScore}/100
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-brand-muted hidden sm:inline">
                            #{item.barcode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:self-center flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-[#EFE4EB]">

                      {/* Save / Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => toggleSaveProduct(item)}
                        title={isItemSaved ? 'Remove from Saved' : 'Save Product'}
                        className={`p-2.5 rounded-xl border transition-all ${isItemSaved
                            ? 'bg-berry text-white border-berry shadow-soft'
                            : 'bg-white text-brand-muted hover:text-berry border-[#EFE4EB] hover:bg-soft-light'
                          }`}
                      >
                        {isItemSaved ? <BookmarkCheck className="w-4 h-4 text-warm" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      {/* Compare Button */}
                      <Link
                        to={`/compare?b1=${encodeURIComponent(item.barcode || item.id)}`}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EFE4EB] text-berry hover:bg-soft-light text-xs font-heading font-bold transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Scale className="w-3.5 h-3.5 text-vibrant" />
                        <span>Compare</span>
                      </Link>

                      {/* Reopen Product Analysis Button */}
                      <Link
                        to={`/analysis/${encodeURIComponent(item.barcode || item.id)}`}
                        className="px-4 py-2.5 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry/95 transition-all flex items-center gap-1.5 shadow-soft"
                      >
                        <span>Re-examine</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* Delete Individual History Entry Button */}
                      <button
                        type="button"
                        onClick={() => removeFromHistory(itemKey)}
                        title="Delete from scan history"
                        className="p-2.5 rounded-xl text-brand-muted hover:text-vibrant hover:bg-soft-light border border-transparent hover:border-[#EFE4EB] transition-all"
                        aria-label={`Delete ${item.name} from history`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAVED FAVOURITES (Persisted in LocalStorage)                       */}
      {/* ========================================================================= */}
      {activeTab === 'saved' && (
        <div className="space-y-4">

          {/* Empty State when no saved products exist */}
          {savedProducts.length === 0 ? (
            <div className="paper-card rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-warm-light border border-warm/80 text-berry flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8 text-berry" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-black text-berry">
                  No Saved Favourites Yet
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Whenever you scan or explore a food product, tap "Save Product" to bookmark it here for quick everyday comparison.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Button to="/explore" variant="primary" size="md">
                  Explore Food Catalog
                </Button>
                <Button to="/scan" variant="secondary" size="md" icon={ScanLine}>
                  Scan a Product
                </Button>
              </div>
            </div>
          ) : filteredSaved.length === 0 ? (
            /* Empty state when search query doesn't match saved items */
            <div className="paper-card rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
              <Search className="w-10 h-10 text-brand-muted mx-auto opacity-50" />
              <h3 className="text-base font-heading font-bold text-berry">
                No Favourites Match Your Filter
              </h3>
              <p className="text-xs text-brand-muted">
                No saved items match "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilterNova('all'); }}
                className="text-xs font-heading font-bold text-vibrant underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Saved Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredSaved.map((item) => {
                const itemKey = item.barcode || item.id;

                return (
                  <div
                    key={itemKey}
                    className="paper-card paper-card-hover rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-vibrant block">
                              {item.brand || 'Verified Brand'}
                            </span>
                            <h4 className="text-sm sm:text-base font-heading font-bold text-berry line-clamp-2">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-mono text-brand-muted block">
                              Barcode: {item.barcode}
                            </span>
                          </div>
                        </div>

                        {/* Remove from Saved Button */}
                        <button
                          type="button"
                          onClick={() => removeSavedProduct(itemKey)}
                          title="Remove from saved products"
                          className="p-2 rounded-xl text-brand-muted hover:text-vibrant hover:bg-soft-light transition-colors flex-shrink-0"
                          aria-label={`Remove ${item.name} from saved`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Micro Nutrition Strip */}
                      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-brand-bg border border-[#EFE4EB] text-center text-xs">
                        <div>
                          <span className="block text-[10px] text-brand-muted">Energy</span>
                          <span className="font-heading font-bold text-berry">
                            {item.nutritionPer100g?.calories ? `${Math.round(item.nutritionPer100g.calories)}` : '--'}
                          </span>
                          <span className="block text-[9px] text-brand-muted font-mono">kcal/100g</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-brand-muted">Sugar</span>
                          <span className="font-heading font-bold text-berry">
                            {item.nutritionPer100g?.sugars !== null && item.nutritionPer100g?.sugars !== undefined
                              ? `${item.nutritionPer100g.sugars}g`
                              : '--'}
                          </span>
                          <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-brand-muted">Score</span>
                          <span className="font-heading font-extrabold text-vibrant">
                            {item.consciousScore ? `${item.consciousScore}/100` : '--'}
                          </span>
                          <span className="block text-[9px] text-brand-muted font-mono">Conscious</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#EFE4EB] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {item.novaGroup && <NovaBadge group={item.novaGroup} showLabel={false} />}
                        <span className="text-[11px] font-mono text-brand-muted">
                          {item.quantity || 'Packaged item'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/compare?b1=${encodeURIComponent(item.barcode || item.id)}`}
                          className="px-3 py-1.5 rounded-xl bg-white border border-[#EFE4EB] text-berry hover:bg-soft-light text-xs font-heading font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Scale className="w-3 h-3 text-vibrant" />
                          <span>Compare</span>
                        </Link>
                        <Link
                          to={`/analysis/${encodeURIComponent(item.barcode || item.id)}`}
                          className="px-3.5 py-1.5 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry/95 flex items-center gap-1 shadow-soft"
                        >
                          <span>Analysis</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
