import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
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
    // Default initial conscious scans
    return [
      {
        ...mockProducts[0],
        scannedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
      },
      {
        ...mockProducts[1],
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
      {
        ...mockProducts[2],
        scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
      }
    ];
  });

  const [savedProducts, setSavedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('be_conscious_saved');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If legacy format of string IDs, hydrate from mockProducts
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

  const addToHistory = (product) => {
    if (!product) return;
    setHistory((prev) => {
      const key = product.barcode || product.id;
      const filtered = prev.filter((item) => (item.barcode || item.id) !== key);
      return [{ ...product, scannedAt: new Date().toISOString() }, ...filtered];
    });
  };

  const removeFromHistory = (idOrBarcode) => {
    if (!idOrBarcode) return;
    setHistory((prev) => 
      prev.filter((item) => item.id !== idOrBarcode && item.barcode !== idOrBarcode)
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const isSaved = (idOrBarcode) => {
    if (!idOrBarcode) return false;
    return savedProducts.some(
      (p) => p.id === idOrBarcode || p.barcode === idOrBarcode
    );
  };

  const toggleSaveProduct = (productOrId) => {
    if (!productOrId) return;
    setSavedProducts((prev) => {
      let targetObj = null;
      let targetKey = null;

      if (typeof productOrId === 'object' && productOrId !== null) {
        targetObj = productOrId;
        targetKey = productOrId.barcode || productOrId.id;
      } else {
        targetKey = productOrId;
        targetObj = mockProducts.find(p => p.id === targetKey || p.barcode === targetKey) ||
                    history.find(p => p.id === targetKey || p.barcode === targetKey);
      }

      const exists = prev.some(p => p.id === targetKey || p.barcode === targetKey);
      if (exists) {
        return prev.filter(p => p.id !== targetKey && p.barcode !== targetKey);
      } else {
        if (targetObj) {
          return [targetObj, ...prev];
        }
        return prev;
      }
    });
  };

  const removeSavedProduct = (idOrBarcode) => {
    if (!idOrBarcode) return;
    setSavedProducts((prev) =>
      prev.filter((p) => p.id !== idOrBarcode && p.barcode !== idOrBarcode)
    );
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        savedProducts,
        addToHistory,
        removeFromHistory,
        clearHistory,
        toggleSaveProduct,
        removeSavedProduct,
        isSaved
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


