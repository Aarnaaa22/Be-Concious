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
  ArrowUpRight,
  Sparkles,
  Scale
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Scan Food', path: '/scan' },
    { name: 'Compare', path: '/compare' },
    { name: 'Explore Catalog', path: '/explore' },
    { name: 'My History', path: '/history' },
    { name: 'About Mission', path: '/about' },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isHome 
          ? 'bg-[#F62477]/95 backdrop-blur-md border-b border-white/15 text-white shadow-[0_4px_30px_rgba(146,0,58,0.3)]' 
          : 'bg-[#FFFAFC]/90 backdrop-blur-md border-b border-[#EFE4EB] text-brand-text'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Identity / Wordmark */}
          <Link 
            to="/" 
            className="flex items-center gap-3.5 group focus:outline-none"
            aria-label="Be Conscious Home"
          >
            {/* Custom Monogram Emblem */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group-hover:scale-105 ${
              isHome 
                ? 'bg-[#92003A] text-white border border-[#FFE185]/40 shadow-[0_4px_16px_rgba(0,0,0,0.3)]' 
                : 'bg-berry text-white shadow-[0_2px_10px_rgba(146,0,58,0.25)]'
            }`}>
              <span className="font-heading font-black text-xl tracking-tighter text-[#FFE185]">B</span>
              <span className="font-heading font-black text-xs text-[#FFADEE] -ml-0.5">C</span>
              {/* Subtle barcode accent bar at bottom */}
              <div className="absolute bottom-1 inset-x-2 h-0.5 bg-gradient-to-r from-[#FFE185] via-[#FFADEE] to-white opacity-80" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`font-heading font-black text-xl sm:text-2xl tracking-tight ${
                  isHome ? 'text-white' : 'text-berry'
                }`}>
                  Be Conscious
                </span>
                <span className={`hidden lg:inline-block px-2 py-0.5 rounded-full font-heading text-[10px] font-extrabold tracking-wider uppercase border ${
                  isHome 
                    ? 'bg-white/20 text-[#FFE185] border-white/30' 
                    : 'bg-soft/30 text-berry border-soft/50'
                }`}>
                  Transparency
                </span>
              </div>
              <span className={`hidden sm:block text-[11px] font-medium tracking-normal -mt-0.5 ${
                isHome ? 'text-white/80' : 'text-brand-muted'
              }`}>
                Know what you eat. Choose what matters.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-2xl border shadow-xs ${
            isHome 
              ? 'bg-black/20 backdrop-blur-md border-white/15' 
              : 'bg-white/70 border-[#EFE4EB]'
          }`}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (isHome) {
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-[#92003A] border border-[#FFE185]/40 shadow-md'
                        : 'text-white/85 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                );
              }
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-berry shadow-soft'
                      : 'text-brand-text hover:text-berry hover:bg-soft-light'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/scan"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs sm:text-sm active:scale-95 transition-all ${
                isHome
                  ? 'bg-[#FFE185] text-[#92003A] hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:scale-105'
                  : 'bg-vibrant text-white hover:bg-vibrant-hover shadow-[0_4px_16px_rgba(246,36,119,0.3)] hover:shadow-lg'
              }`}
            >
              <ScanLine className={`w-4 h-4 ${isHome ? 'text-[#92003A]' : 'text-warm'}`} />
              <span>Scan Barcode</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-2xl focus:outline-none ${
              isHome ? 'text-white hover:bg-white/10' : 'text-berry hover:bg-soft-light'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden px-5 py-6 space-y-3 animate-fadeIn border-b shadow-soft-lg ${
            isHome ? 'bg-[#92003A] border-white/20 text-white' : 'bg-white border-[#EFE4EB] text-brand-text'
          }`}>
            <div className={`text-[11px] font-heading font-bold uppercase tracking-wider pb-1 ${
              isHome ? 'text-[#FFE185]' : 'text-brand-muted'
            }`}>
              Navigate
            </div>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-heading font-bold transition-all ${
                    isActive
                      ? 'bg-berry text-white'
                      : 'text-brand-text hover:bg-soft-light'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                to="/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-vibrant text-white font-heading font-bold text-sm shadow-vibrant-glow"
              >
                <ScanLine className="w-5 h-5 text-warm" />
                <span>Open Barcode Scanner</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Dock for Mobile */}
      <nav 
        className="fixed md:hidden bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-3xl border border-[#EFE4EB] p-2 shadow-[0_8px_32px_rgba(48,35,42,0.12)]"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around relative">
          
          <Link
            to="/"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              location.pathname === '/' ? 'text-berry font-extrabold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-heading mt-0.5">Home</span>
          </Link>

          <Link
            to="/explore"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              location.pathname === '/explore' ? 'text-berry font-extrabold' : 'text-brand-muted hover:text-berry'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-heading mt-0.5">Explore</span>
          </Link>

          {/* Elevated Center Scan Button */}
          <Link
            to="/scan"
            className="flex flex-col items-center -mt-6 group"
            aria-label="Scan Food Barcode"
          >
            <div className="w-14 h-14 rounded-full bg-vibrant text-white flex items-center justify-center shadow-[0_8px_24px_rgba(246,36,119,0.45)] border-4 border-[#FFFAFC] group-active:scale-90 transition-transform">
              <ScanLine className="w-6 h-6 text-warm" />
            </div>
            <span className="text-[10px] font-heading font-extrabold text-vibrant mt-0.5">Scan</span>
          </Link>

          <Link
            to="/compare"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              location.pathname === '/compare' ? 'text-berry font-extrabold' : 'text-brand-muted hover:text-berry'
            }`}
            aria-label="Compare Foods"
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px] font-heading mt-0.5">Compare</span>
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              location.pathname === '/history' ? 'text-berry font-extrabold' : 'text-brand-muted hover:text-berry'
            }`}
            aria-label="My Scan History"
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-heading mt-0.5">History</span>
          </Link>

        </div>
      </nav>
    </>
  );
};
