import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { 
  ScanLine, 
  Sparkles, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Layers, 
  User, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Trash2, 
  Scale, 
  Search, 
  Settings, 
  Sliders, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, profile, preferences, updatePreferences, updateProfile, signOut } = useAuth();
  const { history, savedProducts, removeFromHistory, toggleSaveProduct } = useHistory();

  // Active Tab: 'scans' | 'saved' | 'preferences' | 'profile'
  const [activeTab, setActiveTab] = useState('scans');

  // Preferences local state
  const [dietaryPrefs, setDietaryPrefs] = useState([]);
  const [allergenPrefs, setAllergenPrefs] = useState([]);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState(false);

  // Profile edit local state
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync initial preferences
  useEffect(() => {
    if (preferences) {
      setDietaryPrefs(preferences.dietary_preferences || []);
      setAllergenPrefs(preferences.allergen_preferences || []);
    }
  }, [preferences]);

  // Sync initial display name
  useEffect(() => {
    if (profile?.full_name) {
      setDisplayName(profile.full_name);
    } else if (user?.user_metadata?.full_name) {
      setDisplayName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  // Available options
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, poultry, or fish' },
    { id: 'vegan', label: '100% Vegan', desc: 'No animal-derived ingredients' },
    { id: 'gluten-free', label: 'Gluten-Free', desc: 'Avoid wheat, barley, rye' },
    { id: 'palm-oil-free', label: 'Palm-Oil-Free', desc: 'Avoid industrial palm fat fractions' },
    { id: 'low-sugar', label: 'Low-Sugar Priority', desc: 'Flag products with >15g added sugars' },
    { id: 'low-sodium', label: 'Low-Sodium Priority', desc: 'Flag products with >400mg sodium' },
    { id: 'organic', label: 'Certified Organic', desc: 'Prioritize non-GMO ingredients' },
    { id: 'additive-free', label: 'Minimal Additives', desc: 'Avoid NOVA Group 4 ultra-processing' },
  ];

  const allergenOptions = [
    { id: 'gluten', label: 'Gluten / Wheat' },
    { id: 'milk', label: 'Milk / Dairy (Lactose)' },
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'nuts', label: 'Tree Nuts (Hazelnuts, Almonds, Cashews)' },
    { id: 'soybeans', label: 'Soybeans & Soy Lecithin' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'fish', label: 'Fish' },
    { id: 'crustaceans', label: 'Crustaceans & Shellfish' },
    { id: 'sulphites', label: 'Sulphites & Preservatives' },
    { id: 'sesame', label: 'Sesame Seeds' },
  ];

  const toggleDietary = (id) => {
    setDietaryPrefs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAllergen = (id) => {
    setAllergenPrefs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefsSuccess(false);

    try {
      await updatePreferences({
        dietaryPreferences: dietaryPrefs,
        allergenPreferences: allergenPrefs
      });
      setPrefsSuccess(true);
      setTimeout(() => setPrefsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    try {
      await updateProfile({ fullName: displayName });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // User details
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Conscious Eater';
  const userEmail = user?.email || '';

  return (
    <div className="min-h-screen bg-[#FFFAFC] text-brand-text pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* =====================================================================
            TOP WELCOME HERO & STATS HEADER
            ===================================================================== */}
        <div className="bg-gradient-to-br from-[#92003A] via-[#B30046] to-[#F62477] text-white rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(146,0,58,0.2)] relative overflow-hidden">
          
          {/* Subtle Background Glow Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-warm/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 sm:gap-5">
              {/* User Avatar Badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-warm text-berry flex items-center justify-center font-heading font-black text-2xl sm:text-3xl shadow-xl shrink-0 border-2 border-white/40">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-warm text-[11px] font-heading font-black uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-warm" />
                  <span>Authenticated Member</span>
                </div>
                <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                  Welcome, {userName}!
                </h1>
                <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">
                  {userEmail} • Connected to Real-time Cloud Sync
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-warm text-berry font-heading font-black text-sm uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <ScanLine className="w-4 h-4 text-berry" />
                <span>Quick Scan Now</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white font-heading font-bold text-sm transition-all border border-white/20"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/15 relative z-10">
            
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-warm">Total Scanned</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                {history.length}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Cloud Synced Products</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-warm">Saved Favourites</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                {savedProducts.length}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Bookmarked Foods</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-warm">Dietary Shields</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                {dietaryPrefs.length}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Active Diet Filters</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[11px] font-bold uppercase tracking-wider text-warm">Allergen Guards</div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                {allergenPrefs.length}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Strict Alert Rules</div>
            </div>

          </div>

        </div>

        {/* =====================================================================
            NAVIGATION TABS
            ===================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EAE0E6]">
          <button
            onClick={() => setActiveTab('scans')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'scans'
                ? 'bg-berry text-white shadow-soft'
                : 'text-brand-muted hover:text-berry hover:bg-soft-light'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent Scans ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'saved'
                ? 'bg-berry text-white shadow-soft'
                : 'text-brand-muted hover:text-berry hover:bg-soft-light'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favourites ({savedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'preferences'
                ? 'bg-berry text-white shadow-soft'
                : 'text-brand-muted hover:text-berry hover:bg-soft-light'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Food Preferences & Allergens</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-berry text-white shadow-soft'
                : 'text-brand-muted hover:text-berry hover:bg-soft-light'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* =====================================================================
            TAB 1: RECENT SCANS
            ===================================================================== */}
        {activeTab === 'scans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-black text-2xl text-berry">
                  Recently Scanned Products
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                  Every product you scan is automatically saved and synchronized to your Supabase profile.
                </p>
              </div>

              <Link
                to="/scan"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-berry text-white text-xs font-bold hover:bg-berry/90 transition-all shadow-xs"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan New</span>
              </Link>
            </div>

            {history.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EFE4EB] shadow-xs">
                <ScanLine className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-60" />
                <h3 className="font-heading font-bold text-lg text-berry">No scans recorded yet</h3>
                <p className="text-sm text-brand-muted max-w-sm mx-auto mt-1 mb-6">
                  Scan any packaged snack or food item in your pantry to see its verified laboratory nutrition breakdown.
                </p>
                <Link
                  to="/scan"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-vibrant text-white font-heading font-bold text-sm shadow-soft"
                >
                  <ScanLine className="w-4 h-4 text-warm" />
                  <span>Start Scanning</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {history.map((product) => (
                  <div
                    key={product.id || product.barcode}
                    className="p-5 rounded-3xl bg-white border border-[#EFE4EB] shadow-xs hover:border-soft transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || product.productName}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <ScanLine className="w-8 h-8 text-brand-muted" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block truncate">
                            {product.brand || 'Unbranded'}
                          </span>
                          <h4 className="font-heading font-bold text-base text-berry leading-tight mt-0.5 truncate">
                            {product.name || product.productName || 'Unnamed Product'}
                          </h4>
                          <span className="text-[11px] font-mono text-brand-muted block mt-1">
                            {product.barcode || product.id}
                          </span>
                        </div>
                      </div>

                      {/* Nutritional Micro Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#F5EDF2]">
                        {product.nutriScore && (
                          <span className="px-2.5 py-1 rounded-lg bg-soft/30 text-berry font-heading font-black text-xs uppercase">
                            Nutri {product.nutriScore.toUpperCase()}
                          </span>
                        )}
                        {product.novaGroup && (
                          <span className="px-2.5 py-1 rounded-lg bg-warm/50 text-berry font-heading font-bold text-xs uppercase">
                            NOVA {product.novaGroup}
                          </span>
                        )}
                        {product.consciousScore && (
                          <span className="px-2.5 py-1 rounded-lg bg-berry text-white font-heading font-bold text-xs">
                            {product.consciousScore}/100
                          </span>
                        )}
                        {product.scannedAt && (
                          <span className="text-[10px] text-brand-muted ml-auto">
                            {new Date(product.scannedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-[#F5EDF2]">
                      <Link
                        to={`/analysis/${product.barcode || product.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-berry hover:text-vibrant transition-colors"
                      >
                        <span>View Analysis</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleSaveProduct(product)}
                          className="p-2 rounded-xl hover:bg-soft-light text-brand-muted hover:text-vibrant transition-all"
                          title="Bookmark product"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromHistory(product.id || product.barcode)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-brand-muted hover:text-rose-600 transition-all"
                          title="Delete from scan history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 2: SAVED FAVOURITES
            ===================================================================== */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading font-black text-2xl text-berry">
                Your Saved Favourites
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                Quick access to conscious food choices you've bookmarked for your weekly grocery shopping.
              </p>
            </div>

            {savedProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#EFE4EB] shadow-xs">
                <Heart className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-60" />
                <h3 className="font-heading font-bold text-lg text-berry">No saved favourites yet</h3>
                <p className="text-sm text-brand-muted max-w-sm mx-auto mt-1 mb-6">
                  Click the heart icon on any product analysis or explore card to keep it here permanently.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-berry text-white font-heading font-bold text-sm shadow-soft"
                >
                  <Search className="w-4 h-4 text-warm" />
                  <span>Explore Food Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedProducts.map((product) => (
                  <div
                    key={product.id || product.barcode}
                    className="p-5 rounded-3xl bg-white border border-[#EFE4EB] shadow-xs hover:border-vibrant transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || product.productName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Heart className="w-8 h-8 text-vibrant" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block truncate">
                            {product.brand || 'Unbranded'}
                          </span>
                          <h4 className="font-heading font-bold text-base text-berry leading-tight mt-0.5 truncate">
                            {product.name || product.productName || 'Saved Item'}
                          </h4>
                          <span className="text-[11px] font-mono text-brand-muted block mt-1">
                            {product.barcode || product.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-[#F5EDF2]">
                      <Link
                        to={`/analysis/${product.barcode || product.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-berry hover:text-vibrant transition-colors"
                      >
                        <span>Inspect Nutrition</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => toggleSaveProduct(product)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: FOOD PREFERENCES & ALLERGEN SHIELDS
            ===================================================================== */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl border border-[#EFE4EB] p-6 sm:p-10 shadow-xs space-y-8">
            <div>
              <h2 className="font-heading font-black text-2xl text-berry">
                Dietary Preferences & Allergen Safeguards
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
                Configure your dietary values and allergy sensitivities. When you scan any food product, Be Conscious will automatically check ingredients and warn you if it conflicts with your rules.
              </p>
            </div>

            {prefsSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your food preferences and allergen guards have been saved to your Supabase profile!</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-8">
              
              {/* Dietary Values */}
              <div>
                <h3 className="text-sm font-heading font-extrabold uppercase tracking-wider text-berry mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-vibrant" />
                  <span>Dietary Values & Nutritional Priorities</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dietaryOptions.map((opt) => {
                    const isSelected = dietaryPrefs.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietary(opt.id)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-soft/20 border-vibrant shadow-xs'
                            : 'bg-[#FFFAFC] border-[#EAE0E6] hover:border-berry'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-heading font-bold text-sm text-berry">
                            {opt.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-vibrant shrink-0" />}
                        </div>
                        <span className="text-[11px] text-brand-muted block leading-snug">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergen Shields */}
              <div className="pt-6 border-t border-[#EAE0E6]">
                <h3 className="text-sm font-heading font-extrabold uppercase tracking-wider text-berry mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Allergen Shields (High Priority Warning Triggers)</span>
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {allergenOptions.map((opt) => {
                    const isSelected = allergenPrefs.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleAllergen(opt.id)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-heading font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#92003A] text-white border-berry shadow-soft scale-105'
                            : 'bg-white text-brand-text border-[#EAE0E6] hover:border-berry'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingPrefs}
                  className="px-8 py-4 rounded-2xl bg-berry text-white font-heading font-bold text-sm sm:text-base hover:bg-berry/95 active:scale-[0.99] transition-all shadow-soft flex items-center gap-2 disabled:opacity-50"
                >
                  {savingPrefs ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-warm" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-warm" />
                      <span>Save Preferences to Profile</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* =====================================================================
            TAB 4: ACCOUNT SETTINGS
            ===================================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-[#EFE4EB] p-6 sm:p-10 shadow-xs space-y-8 max-w-3xl">
            <div>
              <h2 className="font-heading font-black text-2xl text-berry">
                Account Settings
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Manage your profile identity, security credentials and active sessions.
              </p>
            </div>

            {profileSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your display name has been updated!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FFFAFC] border border-[#EAE0E6] focus:border-berry text-brand-text text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-berry mb-1.5">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium cursor-not-allowed"
                />
                <span className="text-[11px] text-brand-muted block mt-1">
                  Email change requires verification with Supabase authentication provider.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3.5 rounded-2xl bg-berry text-white font-heading font-bold text-sm hover:bg-berry/95 active:scale-[0.99] transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {savingProfile ? 'Updating Profile...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

            <div className="pt-8 border-t border-[#EAE0E6] space-y-4">
              <h3 className="font-heading font-bold text-base text-berry">
                Security & Password Management
              </h3>
              <p className="text-xs text-brand-muted">
                Need to change or reset your password? We will send instructions to your registered email address.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#EAE0E6] text-xs font-bold text-berry hover:bg-[#FFFAFC] transition-colors"
              >
                <span>Trigger Password Reset</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-8 border-t border-[#EAE0E6] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-700">Sign Out of All Sessions</h4>
                <p className="text-xs text-brand-muted mt-0.5">
                  End your session on this browser device.
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-5 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-heading font-bold transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
