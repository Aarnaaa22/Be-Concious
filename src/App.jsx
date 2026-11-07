import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ScanFoodPage } from './pages/ScanFoodPage';
import { ProductAnalysisPage } from './pages/ProductAnalysisPage';
import { ExploreProductsPage } from './pages/ExploreProductsPage';
import { CompareProductsPage } from './pages/CompareProductsPage';
import { MyHistoryPage } from './pages/MyHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col ${isHome ? 'bg-[#F62477]' : 'bg-brand-bg'} text-brand-text`}>
      <ScrollToTop />
      <Navbar />
      <main className={`flex-grow ${isHome ? 'pb-0' : 'pb-24 md:pb-0'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanFoodPage />} />
          <Route path="/analysis" element={<ProductAnalysisPage />} />
          <Route path="/analysis/:productId" element={<ProductAnalysisPage />} />
          <Route path="/compare" element={<CompareProductsPage />} />
          <Route path="/explore" element={<ExploreProductsPage />} />
          <Route path="/history" element={<MyHistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Authentication & User Account Routes */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
    </div>
  );
}

export default App;
