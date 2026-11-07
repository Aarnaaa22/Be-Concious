import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseService } from '../services/supabaseService';
import { mockProducts } from '../data/mockProducts';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const { user, isConfigured } = useAuth();
  
  // Local storage state (used for anonymous users and offline fallback)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('be_conscious_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading history from localStorage', e);
    }
    // Default initial conscious demo scans
    return [
      {
        ...mockProducts[0],
        scannedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      },
      {
        ...mockProducts[1],
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        ...mockProducts[2],
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      }
    ];
  });

  const [savedProducts, setSavedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('be_conscious_saved');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            return mockProducts.filter(p => parsed.includes(p.id));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved products from localStorage', e);
    }
    return [mockProducts[0], mockProducts[2]];
  });

  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Sync with Supabase whenever authenticated user changes
  useEffect(() => {
    if (!user || !isConfigured) return;

    let isMounted = true;
    setIsLoadingSupabase(true);

    async function loadUserSupabaseData() {
      try {
        const [historyRes, savedRes] = await Promise.all([
          supabaseService.getScanHistory(user.id),
          supabaseService.getSavedProducts(user.id)
        ]);

        if (!isMounted) return;

        if (historyRes.data && historyRes.data.length > 0) {
          setHistory(historyRes.data);
        } else if (history.length > 0) {
          // If user has local anonymous scans, migrate them to Supabase!
          for (const item of history.slice(0, 5)) {
            await supabaseService.recordScan(user.id, item);
          }
        }

        if (savedRes.data && savedRes.data.length > 0) {
          setSavedProducts(savedRes.data);
        } else if (savedProducts.length > 0) {
          // Migrate local favorites to Supabase!
          for (const item of savedProducts.slice(0, 5)) {
            await supabaseService.saveProduct(user.id, item);
          }
        }
      } catch (err) {
        console.error('Error syncing data with Supabase:', err);
      } finally {
        if (isMounted) setIsLoadingSupabase(false);
      }
    }

    loadUserSupabaseData();

    return () => {
      isMounted = false;
    };
  }, [user, isConfigured]);

  // Persist to localStorage for offline cache
  useEffect(() => {
    try {
      localStorage.setItem('be_conscious_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('be_conscious_saved', JSON.stringify(savedProducts));
    } catch (e) {
      console.error(e);
    }
  }, [savedProducts]);

  // Add a product to scan history (both locally and to Supabase if authenticated)
  const addToHistory = async (product) => {
    if (!product) return;
    const nowIso = new Date().toISOString();
    const normalizedProduct = { ...product, scannedAt: nowIso };

    setHistory((prev) => {
      const key = product.barcode || product.id;
      const filtered = prev.filter((item) => (item.barcode || item.id) !== key);
      return [normalizedProduct, ...filtered];
    });

    // Save to Supabase if logged in
    if (user && isConfigured) {
      await supabaseService.recordScan(user.id, normalizedProduct);
    }
  };

  // Remove a scan entry from history
  const removeFromHistory = async (idOrBarcode) => {
    if (!idOrBarcode) return;
    setHistory((prev) => 
      prev.filter((item) => item.id !== idOrBarcode && item.barcode !== idOrBarcode)
    );

    if (user && isConfigured) {
      await supabaseService.deleteScan(user.id, idOrBarcode);
    }
  };

  // Clear entire history
  const clearHistory = async () => {
    setHistory([]);
    if (user && isConfigured) {
      await supabaseService.clearScanHistory(user.id);
    }
  };

  // Check if product is in favorites
  const isSaved = (idOrBarcode) => {
    if (!idOrBarcode) return false;
    return savedProducts.some(
      (p) => p.id === idOrBarcode || p.barcode === idOrBarcode
    );
  };

  // Toggle favorite status
  const toggleSaveProduct = async (productOrId) => {
    if (!productOrId) return;

    let targetObj = null;
    let targetKey = null;

    if (typeof productOrId === 'string') {
      targetKey = productOrId;
      targetObj = history.find(p => p.id === targetKey || p.barcode === targetKey) ||
                  mockProducts.find(p => p.id === targetKey || p.barcode === targetKey);
    } else {
      targetObj = productOrId;
      targetKey = productOrId.barcode || productOrId.id;
    }

    if (!targetKey) return;

    const exists = isSaved(targetKey);

    if (exists) {
      // Remove
      setSavedProducts(prev => prev.filter(p => p.id !== targetKey && p.barcode !== targetKey));
      if (user && isConfigured) {
        await supabaseService.removeSavedProduct(user.id, targetKey);
      }
    } else {
      // Add
      const itemToSave = targetObj || { id: targetKey, barcode: targetKey, name: 'Saved Product' };
      setSavedProducts(prev => [itemToSave, ...prev]);
      if (user && isConfigured) {
        await supabaseService.saveProduct(user.id, itemToSave);
      }
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        savedProducts,
        isLoadingSupabase,
        addToHistory,
        removeFromHistory,
        clearHistory,
        isSaved,
        toggleSaveProduct,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
