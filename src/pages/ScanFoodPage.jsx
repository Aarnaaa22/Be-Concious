import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ScanLine,
  Search,
  Sparkles,
  Scale,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Loader2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { BarcodeScanner } from '../components/scanner/BarcodeScanner';
import { ProductFallbackFlow } from '../components/scanner/ProductFallbackFlow';
import { mockProducts, fetchProductByBarcode } from '../data/mockProducts';
import { indianProductsCatalog } from '../data/indianProductsCatalog';
import { useHistory } from '../context/HistoryContext';

export const ScanFoodPage = () => {
  const navigate = useNavigate();
  const { addToHistory } = useHistory();

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState('');
  const [unresolvedBarcode, setUnresolvedBarcode] = useState(null);

  // Handle successful barcode detection from live camera or manual entry
  const handleBarcodeDetected = useCallback(
    async (rawCode) => {
      const cleanCode = (rawCode || '').trim();
      if (!cleanCode) return;

      setIsLookingUp(true);
      setLookupMessage(`Querying database for ${cleanCode}...`);
      setUnresolvedBarcode(null);

      try {
        const res = await fetchProductByBarcode(cleanCode);

        if (res && res.found && res.product) {
          addToHistory(res.product);
          navigate(`/analysis/${res.product.id}`);
        } else {
          // If product is not found in any database, trigger intelligent fallback flow
          setUnresolvedBarcode({
            barcode: cleanCode,
            format: res?.format || 'EAN-13',
            gs1Info: res?.gs1Info || null,
          });
        }
      } catch (err) {
        console.error('Error during product lookup:', err);
        setUnresolvedBarcode({
          barcode: cleanCode,
          format: 'EAN-13',
          gs1Info: null,
        });
      } finally {
        setIsLookingUp(false);
      }
    },
    [addToHistory, navigate]
  );

  const handleTestSample = (sample) => {
    addToHistory(sample);
    navigate(`/analysis/${sample.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
          Instant Detection
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-berry tracking-tight">
          Scan Before You Snack!
        </h1>
        <p className="text-sm sm:text-base text-brand-muted font-body leading-relaxed">
          One little scan. A whole lot of information.
        </p>
      </div>

      {/* Global Lookup Progress Overlay */}
      {isLookingUp && (
        <div className="p-4 rounded-2xl bg-white border-2 border-brand-border shadow-soft-lg flex items-center justify-center gap-3 text-berry animate-pulse">
          <Loader2 className="w-5 h-5 text-vibrant animate-spin" />
          <span className="text-sm font-heading font-bold">{lookupMessage}</span>
        </div>
      )}

      {/* If an unknown barcode was scanned, show the Intelligent Fallback & OCR Flow */}
      {unresolvedBarcode ? (
        <div className="space-y-4">
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setUnresolvedBarcode(null)}
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1.5 transition-colors"
            >
              ← Back to Scanner
            </button>
          </div>
          <ProductFallbackFlow
            barcode={unresolvedBarcode.barcode}
            format={unresolvedBarcode.format}
            gs1Info={unresolvedBarcode.gs1Info}
            onCancel={() => setUnresolvedBarcode(null)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: ENHANCED BARCODE SCANNER                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <BarcodeScanner
              onBarcodeDetected={handleBarcodeDetected}
              isProcessing={isLookingUp}
            />

            {/* Helpful Lighting & Focus Tips */}
            <div className="p-4 rounded-2xl bg-warm-light/60 border border-warm/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-berry shrink-0 mt-0.5" />
              <div className="text-xs text-brand-text leading-relaxed">
                <span className="font-bold text-berry">Pro-Tip for Indian FMCG Packages:</span> If scanning glossy plastic wrappers (Maggi, chips, biscuits), turn on the flashlight button or tilt the packaging slightly away from overhead light to eliminate specular glare.
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: VERIFIED BENCHMARK & INDIAN FMCG SAMPLES                    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Indian FMCG Staples Card */}
            <Card className="bg-white border-2 border-brand-border p-6 space-y-4 shadow-soft rounded-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-heading font-bold text-berry">
                    Indian Packaged Food Staples
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-vibrant">
                  Verified
                </span>
              </div>

              <p className="text-xs text-brand-muted">
                Tap any verified Indian pantry staple to immediately view its detailed nutrition analysis:
              </p>

              <div className="space-y-2.5">
                {indianProductsCatalog.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTestSample(item)}
                    className="w-full text-left p-3 rounded-2xl bg-brand-surface hover:bg-warm border border-brand-border hover:border-vibrant/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover border border-brand-border shrink-0 bg-white"
                      />
                      <div>
                        <h4 className="text-xs font-heading font-bold text-brand-text group-hover:text-berry line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-brand-muted">
                          {item.barcode} • {item.brand}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-vibrant group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Side-by-Side Comparison Feature */}
            <div className="p-5 rounded-3xl bg-warm-light/60 border border-warm/80 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-berry">
                <Scale className="w-5 h-5 text-berry shrink-0" />
                <h4 className="font-heading font-extrabold text-sm">Compare Before You Buy</h4>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Stuck between two products in the grocery aisle? Compare calories, sugar, protein, and NOVA processing side-by-side with verified per-100g values.
              </p>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-berry text-white font-heading font-bold text-xs hover:bg-berry/95 shadow-soft transition-all"
              >
                <span>Launch Product Comparison</span>
                <ArrowRight className="w-3.5 h-3.5 text-warm" />
              </Link>
            </div>

            {/* Privacy Promise */}
            <Card className="bg-soft-light/80 border border-soft-border/60 p-5 space-y-2 rounded-3xl">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-vibrant" />
                <span>On-Device Privacy</span>
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Video frames and OCR images are processed locally in your browser. Live video is never recorded or transmitted to external servers.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
