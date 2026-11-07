import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('be_conscious_history');
      if (saved) {
        return JSON.parse(saved);
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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [mockProducts[0].id, mockProducts[2].id];
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
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [{ ...product, scannedAt: new Date().toISOString() }, ...filtered];
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleSaveProduct = (id) => {
    setSavedProducts((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        savedProducts,
        addToHistory,
        clearHistory,
        toggleSaveProduct,
        isSaved: (id) => savedProducts.includes(id)
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

