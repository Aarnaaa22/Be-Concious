import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, ShieldCheck, Heart, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-border mt-20 pt-16 pb-24 md:pb-16 text-brand-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-brand-border">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-berry flex items-center justify-center text-white shadow-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5v14" />
                  <path d="M7 5v14" />
                  <path d="M11 5v14" />
                  <path d="M15 7v10" stroke="#FFE185" />
                  <path d="M19 5v14" />
                  <circle cx="15" cy="5" r="2" fill="#FFE185" stroke="none" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-2xl text-berry tracking-tight">
                Be Conscious
              </span>
            </Link>
            
            <p className="text-sm text-brand-muted leading-relaxed">
              Know what you eat. Choose what matters. Empowering every eater with instant ingredient clarity, allergen alerts, and honest food processing transparency.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-light border border-soft-border/50 text-xs font-semibold text-berry">
              <Sparkles className="w-3.5 h-3.5 text-vibrant" />
              <span>Independent & 100% Unbiased</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-berry mb-4">
              Explore App
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-brand-muted hover:text-vibrant transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-brand-muted hover:text-vibrant transition-colors font-medium">
                  Scan Food Barcode
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-brand-muted hover:text-vibrant transition-colors">
                  Explore Food Catalog
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-brand-muted hover:text-vibrant transition-colors">
                  My Scan History
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-muted hover:text-vibrant transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Transparency Topics */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-berry mb-4">
              Transparency Focus
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li>
                <Link to="/about#nova" className="hover:text-vibrant transition-colors flex items-center gap-1.5">
                  <span>NOVA Ultra-Processed Index</span>
                </Link>
              </li>
              <li>
                <Link to="/about#allergens" className="hover:text-vibrant transition-colors">
                  Allergen Detection
                </Link>
              </li>
              <li>
                <Link to="/about#macros" className="hover:text-vibrant transition-colors">
                  Honest Macronutrient Split
                </Link>
              </li>
              <li>
                <Link to="/about#additives" className="hover:text-vibrant transition-colors">
                  Hidden Additives & E-Numbers
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-vibrant transition-colors">
                  Wholesome Alternatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Open Science */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-berry mb-2">
              Our Food Philosophy
            </h4>
            <div className="p-4 rounded-2xl bg-warm-light border border-warm/80">
              <p className="text-xs text-brand-text leading-relaxed font-medium">
                "We believe nutrition is personal, not dogmatic. We don't judge your choices—we give you truthful facts so you decide what fuels you."
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-berry">
                <ShieldCheck className="w-4 h-4 text-vibrant" />
                <span>Evidence-based metrics</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} Be Conscious. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-berry transition-colors">Privacy & Data Ethics</Link>
            <Link to="/about" className="hover:text-berry transition-colors">Methodology</Link>
            <Link to="/about" className="hover:text-berry transition-colors">Terms of Awareness</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

