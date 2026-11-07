import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  ScanLine, 
  Home, 
  Compass, 
  Clock, 
  Info, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Scan Food', path: '/scan', icon: ScanLine },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'My History', path: '/history', icon: Clock },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-brand-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-vibrant rounded-xl p-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-berry flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
              {/* Custom SVG Icon combining Barcode + Conscious Spark */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5v14" />
                <path d="M7 5v14" />
                <path d="M11 5v14" />
                <path d="M15 7v10" stroke="#FFE185" />
                <path d="M19 5v14" />
                <circle cx="15" cy="5" r="2" fill="#FFE185" stroke="none" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-berry tracking-tight block">
                Be Conscious
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-brand-muted tracking-wide -mt-1">
                Know what you eat. Choose what matters.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-heading font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-berry bg-berry-50 border border-berry-200/60 shadow-xs'
                        : 'text-brand-text hover:text-berry hover:bg-soft-light'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Prominent Scan Now CTA for Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              to="/scan"
              variant="primary"
              size="md"
              icon={ScanLine}
              className="shadow-vibrant-glow"
            >
              Scan Food Now
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl text-brand-text hover:bg-soft-light focus:outline-none focus:ring-2 focus:ring-vibrant"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-berry" /> : <Menu className="w-6 h-6 text-berry" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-brand-border px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
            <div className="p-3 mb-2 rounded-2xl bg-warm-light border border-warm/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-text">Know what you eat.</span>
              <span className="text-xs font-bold text-berry">100% Free Food Transparency</span>
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-heading font-semibold transition-colors ${
                    isActive
                      ? 'bg-berry-50 text-berry font-bold border border-berry-200'
                      : 'text-brand-text hover:bg-soft-light'
                  }`}
                >
                  <Icon className="w-5 h-5 text-berry" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3">
              <Button
                to="/scan"
                variant="primary"
                size="lg"
                icon={ScanLine}
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scan Food Barcode
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile - Highly visible Scan action */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-brand-border px-3 py-2 shadow-soft-lg pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          
          <Link
            to="/"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              location.pathname === '/' ? 'text-berry font-bold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-heading mt-0.5">Home</span>
          </Link>

          <Link
            to="/explore"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              location.pathname === '/explore' ? 'text-berry font-bold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11px] font-heading mt-0.5">Explore</span>
          </Link>

          {/* Center Prominent Scan Button for Mobile */}
          <Link
            to="/scan"
            className="flex flex-col items-center -mt-6 group"
            aria-label="Scan Food"
          >
            <div className="w-14 h-14 rounded-full bg-vibrant flex items-center justify-center text-white shadow-vibrant-glow border-4 border-white group-active:scale-95 transition-transform">
              <ScanLine className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-heading font-extrabold text-vibrant mt-0.5">Scan</span>
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              location.pathname === '/history' ? 'text-berry font-bold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[11px] font-heading mt-0.5">History</span>
          </Link>

          <Link
            to="/about"
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              location.pathname === '/about' ? 'text-berry font-bold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[11px] font-heading mt-0.5">About</span>
          </Link>

        </div>
      </div>
    </>
  );
};

