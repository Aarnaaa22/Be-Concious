import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

/**
 * ============================================================================
 * BE CONSCIOUS — REAL SUPABASE AUTHENTICATION & DATABASE SERVICE
 * ============================================================================
 * Handles user authentication, Google OAuth, Row-Level-Security queries,
 * scan history persistence, saved favourites, and user food preferences.
 * ============================================================================
 */

export const supabaseService = {
  // Check if real Supabase environment variables are connected
  isConfigured: () => isSupabaseConfigured(),

  // ==========================================================================
  // 1. AUTHENTICATION SERVICES
  // ==========================================================================

  /**
   * Register a new user with email and password
   */
  async signUpWithEmail({ email, password, fullName }) {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: new Error('Supabase is not yet configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.') 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase signUp error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Sign in existing user with email and password
   */
  async signInWithEmail({ email, password }) {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: new Error('Supabase is not configured. Please add your credentials in .env.') 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase signIn error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Initiate Google OAuth sign in
   */
  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: new Error('Supabase is not configured. Connect your Supabase project with Google OAuth enabled.') 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase Google OAuth error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Sign out user and clear authenticated session
   */
  async signOut() {
    if (!isSupabaseConfigured()) return { error: null };
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Supabase signOut error:', err.message);
      return { error: err };
    }
  },

  /**
   * Send password reset email
   */
  async resetPasswordForEmail(email) {
    if (!isSupabaseConfigured()) {
      return { 
        data: null, 
        error: new Error('Supabase is not configured.') 
      };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase resetPassword error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Update password for an authenticated session (e.g. after password reset link clicked)
   */
  async updatePassword(newPassword) {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase updatePassword error:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Get current active session
   */
  async getSession() {
    if (!isSupabaseConfigured()) return { data: { session: null }, error: null };
    return await supabase.auth.getSession();
  },

  /**
   * Get current authenticated user
   */
  async getUser() {
    if (!isSupabaseConfigured()) return { data: { user: null }, error: null };
    return await supabase.auth.getUser();
  },

  // ==========================================================================
  // 2. USER PROFILES & PREFERENCES
  // ==========================================================================

  /**
   * Fetch user profile from public.profiles
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured() || !userId) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching profile:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, { fullName, avatarUrl }) {
    if (!isSupabaseConfigured() || !userId) return { data: null, error: null };

    try {
      const updates = {
        updated_at: new Date().toISOString()
      };
      if (fullName !== undefined) updates.full_name = fullName;
      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch dietary and allergen preferences from public.user_preferences
   */
  async getPreferences(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return { data: { dietary_preferences: [], allergen_preferences: [] }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return { 
        data: data || { dietary_preferences: [], allergen_preferences: [] }, 
        error: null 
      };
    } catch (err) {
      console.error('Error fetching preferences:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Upsert user preferences
   */
  async savePreferences(userId, { dietaryPreferences, allergenPreferences }) {
    if (!isSupabaseConfigured() || !userId) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dietary_preferences: dietaryPreferences || [],
          allergen_preferences: allergenPreferences || [],
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error saving preferences:', err.message);
      return { data: null, error: err };
    }
  },

  // ==========================================================================
  // 3. PERSISTENT SCAN HISTORY
  // ==========================================================================

  /**
   * Fetch scan history for the authenticated user
   */
  async getScanHistory(userId) {
    if (!isSupabaseConfigured() || !userId) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false });

      if (error) throw error;

      // Normalize into client product object with scannedAt timestamp
      const normalized = (data || []).map(row => ({
        ...row.product_data,
        id: row.id,
        barcode: row.barcode,
        productName: row.product_name,
        name: row.product_name,
        brand: row.brand,
        image: row.product_image,
        scannedAt: row.scanned_at
      }));

      return { data: normalized, error: null };
    } catch (err) {
      console.error('Error fetching scan history:', err.message);
      return { data: [], error: err };
    }
  },

  /**
   * Record a new scan into public.scan_history
   */
  async recordScan(userId, product) {
    if (!isSupabaseConfigured() || !userId || !product) return { data: null, error: null };

    try {
      const barcode = product.barcode || product.id || String(Date.now());
      const productName = product.name || product.productName || 'Unknown Product';
      const brand = product.brand || 'Unbranded';
      const productImage = product.image || product.productImage || '';

      const { data, error } = await supabase
        .from('scan_history')
        .insert({
          user_id: userId,
          barcode,
          product_name: productName,
          brand,
          product_image: productImage,
          product_data: product,
          scanned_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error recording scan in Supabase:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Delete single scan from history
   */
  async deleteScan(userId, scanIdOrBarcode) {
    if (!isSupabaseConfigured() || !userId) return { error: null };

    try {
      // Try deleting by ID first, then fallback to barcode
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', userId)
        .or(`id.eq.${scanIdOrBarcode},barcode.eq.${scanIdOrBarcode}`);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error deleting scan record:', err.message);
      return { error: err };
    }
  },

  /**
   * Clear all scan history for the user
   */
  async clearScanHistory(userId) {
    if (!isSupabaseConfigured() || !userId) return { error: null };

    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error clearing scan history:', err.message);
      return { error: err };
    }
  },

  // ==========================================================================
  // 4. SAVED PRODUCTS (FAVORITES)
  // ==========================================================================

  /**
   * Fetch saved products for the user
   */
  async getSavedProducts(userId) {
    if (!isSupabaseConfigured() || !userId) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from('saved_products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map(row => ({
        ...row.product_data,
        id: row.barcode,
        barcode: row.barcode,
        savedAt: row.created_at
      }));

      return { data: normalized, error: null };
    } catch (err) {
      console.error('Error fetching saved products:', err.message);
      return { data: [], error: err };
    }
  },

  /**
   * Save product to public.saved_products
   */
  async saveProduct(userId, product) {
    if (!isSupabaseConfigured() || !userId || !product) return { data: null, error: null };

    try {
      const barcode = product.barcode || product.id;
      const { data, error } = await supabase
        .from('saved_products')
        .upsert({
          user_id: userId,
          barcode,
          product_data: product,
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id,barcode' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error saving product:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Remove saved product from favorites
   */
  async removeSavedProduct(userId, barcode) {
    if (!isSupabaseConfigured() || !userId || !barcode) return { error: null };

    try {
      const { error } = await supabase
        .from('saved_products')
        .delete()
        .eq('user_id', userId)
        .eq('barcode', barcode);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error removing saved product:', err.message);
      return { error: err };
    }
  },

  // ==========================================================================
  // 5. COMMUNITY PRODUCT DATABASE & CACHING
  // ==========================================================================

  /**
   * Lookup product in public.products by barcode
   */
  async getProductByBarcode(barcode) {
    if (!isSupabaseConfigured() || !barcode) return { data: null, error: null };

    try {
      const clean = String(barcode).trim();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', clean)
        .maybeSingle();

      if (error) throw error;
      if (!data) return { data: null, error: null };

      // Normalize into client product structure
      const normalized = {
        id: data.id,
        barcode: data.barcode,
        name: data.product_name,
        brand: data.brand || 'Unbranded',
        category: data.category || 'Packaged Grocery',
        image: data.product_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        hasRealImage: !!data.product_image,
        consciousScore: data.conscious_score || 65,
        novaGroup: data.nova_group,
        nutriGrade: data.nutri_grade,
        servingSize: data.serving_size,
        summary: data.summary || `${data.product_name} (${data.brand})`,
        nutritionPer100g: data.nutritional_values?.per100g || data.nutritional_values || {},
        nutritionPerServing: data.nutritional_values?.perServing || { hasServingData: false },
        ingredients: data.ingredients || [],
        dataSource: data.data_source || 'community',
        verificationStatus: data.verification_status || 'unverified',
        isUserSubmitted: data.verification_status !== 'verified',
        lastUpdated: data.last_updated
      };

      return { data: normalized, error: null };
    } catch (err) {
      console.warn('Supabase product lookup failed:', err.message);
      return { data: null, error: err };
    }
  },

  /**
   * Submit community or OCR-extracted product to public.products
   */
  async submitCommunityProduct(product, userId = null) {
    if (!isSupabaseConfigured() || !product || !product.barcode) {
      return { data: null, error: new Error('Supabase not configured or missing barcode') };
    }

    try {
      const clean = String(product.barcode).trim();
      const id = product.id || `custom-${clean}-${Date.now()}`;
      const record = {
        id,
        barcode: clean,
        product_name: product.name || product.product_name || `Product ${clean}`,
        brand: product.brand || 'Unbranded',
        category: product.category || 'Packaged Grocery',
        product_image: product.image || null,
        ingredients: product.ingredients || [],
        nutritional_values: {
          per100g: product.nutritionPer100g || {},
          perServing: product.nutritionPerServing || {}
        },
        serving_size: product.servingSize || null,
        conscious_score: product.consciousScore || 65,
        nova_group: product.novaGroup || null,
        nutri_grade: product.nutriGrade || null,
        summary: product.summary || `Community submitted product for ${product.name}`,
        data_source: product.dataSource || 'community',
        verification_status: product.verificationStatus || 'unverified',
        submitted_by: userId || null,
        last_updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .upsert(record, { onConflict: 'barcode' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error submitting community product:', err.message);
      return { data: null, error: err };
    }
  }
};

export default supabaseService;
