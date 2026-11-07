import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScanLine, 
  Search, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge, NovaBadge } from '../components/common/Badge';
import { mockProducts, getProductByBarcode } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';

export const ScanFoodPage = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { addToHistory } = useHistory();

  const handleLookup = (codeToLookup) => {
    const code = (codeToLookup || barcodeInput).trim();
    if (!code) {
      setErrorMsg('Please enter a barcode number.');
      return;
    }

    const found = getProductByBarcode(code);
    if (found) {
      setErrorMsg('');
      addToHistory(found);
      navigate(`/analysis/${found.id}`);
    } else {
      setErrorMsg(`Barcode "${code}" was not found in the sample conscious database. Please click one of the verified sample barcodes below to test.`);
    }
  };

  const handleSelectSample = (sample) => {
    setBarcodeInput(sample.barcode);
    setErrorMsg('');
    handleLookup(sample.barcode);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="soft" size="md">
          Food Scanner Interface
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-berry">
          Scan Packaged Food Barcode
        </h1>
        <p className="text-base text-brand-muted">
          Decode ingredients, calories, additives, and NOVA processing group from any packaged food product.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Simulated Camera Viewfinder */}
        <div className="lg:col-span-7">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6 shadow-soft-lg">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-warm animate-ping" />
                <span className="text-xs font-heading font-bold text-berry uppercase tracking-wider">
                  Scanner Viewfinder
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warm-light border border-warm/80 text-berry">
                Camera Simulator Ready
              </span>
            </div>

            {/* Viewfinder Graphic */}
            <div className="relative aspect-video rounded-3xl bg-berry-dark/95 text-white flex flex-col items-center justify-center overflow-hidden p-6 border-2 border-dashed border-soft-border/40">
              
              {/* Background scanning grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFE185_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Viewfinder Target Brackets */}
              <div className="relative w-64 h-36 border-2 border-white/60 rounded-2xl flex items-center justify-center shadow-inner">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-vibrant -mt-1 -ml-1 rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-vibrant -mt-1 -mr-1 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-vibrant -mb-1 -ml-1 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-vibrant -mb-1 -mr-1 rounded-br" />

                {/* Animated scan beam */}
                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-vibrant to-transparent animate-pulse shadow-vibrant-glow" />

                {/* Barcode icon center */}
                <div className="text-center space-y-2 opacity-80">
                  <ScanLine className="w-10 h-10 mx-auto text-warm animate-pulse" />
                  <span className="text-xs font-mono text-white/80 block">Point at barcode</span>
                </div>
              </div>

              <div className="mt-4 text-center z-10">
                <p className="text-xs text-white/90 font-medium">
                  Position any packaged food barcode within the guide brackets
                </p>
              </div>

            </div>

            {/* Hardware Status Note */}
            <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-berry flex-shrink-0 mt-0.5" />
              <div className="text-xs text-brand-text leading-relaxed">
                <span className="font-bold text-berry">Scanner Simulation Active:</span> Hardware camera barcode stream is set to test mode. You can instantly select any of the verified sample foods below or manually enter a test code to see the full analysis.
              </div>
            </div>

            {/* Manual Barcode Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup();
              }}
              className="space-y-3"
            >
              <label htmlFor="barcode-input" className="block text-xs font-heading font-bold text-berry uppercase tracking-wider">
                Or Enter Barcode Digits Manually
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="barcode-input"
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => {
                      setBarcodeInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. 8901234567890"
                    className="w-full px-4 py-3 rounded-2xl bg-brand-bg border border-brand-border focus:border-vibrant focus:ring-4 focus:ring-vibrant/20 outline-none text-sm font-mono text-brand-text transition-all"
                  />
                  {barcodeInput && (
                    <button
                      type="button"
                      onClick={() => setBarcodeInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted hover:text-berry"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Search}
                >
                  Lookup
                </Button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-berry-50 border border-berry/30 text-xs text-berry flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>

          </Card>
        </div>

        {/* Right Column: Verified Sample Barcodes To Try */}
        <div className="lg:col-span-5 space-y-6">
          
          <Card className="bg-white border border-brand-border p-6 space-y-4 shadow-soft">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h2 className="text-base font-heading font-bold text-berry">
                Click Sample Barcodes To Test
              </h2>
              <span className="text-[11px] font-bold text-vibrant">
                6 Verified Items
              </span>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              Tap any food item below to simulate a real scan and view its nutritional breakdown, ingredients, and processing level:
            </p>

            <div className="space-y-2.5">
              {mockProducts.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectSample(prod)}
                  className="w-full text-left p-3.5 rounded-2xl bg-brand-bg hover:bg-soft-light border border-brand-border hover:border-vibrant/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-vibrant block">
                        {prod.brand}
                      </span>
                      <h4 className="text-xs font-heading font-bold text-brand-text group-hover:text-berry line-clamp-1">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-brand-muted">
                          {prod.barcode}
                        </span>
                        <span className="text-[10px] font-semibold text-berry bg-white px-1.5 py-0.2 rounded border border-brand-border">
                          {prod.caloriesPerServing} kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-berry flex-shrink-0 ml-2">
                    <span className="text-xs font-bold hidden sm:inline text-vibrant">Scan</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-vibrant" />
                  </div>
                </button>
              ))}
            </div>

          </Card>

          {/* Tips Card */}
          <Card className="bg-soft-light border border-soft-border/60 p-5 space-y-3">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-vibrant" />
              <span>How To Scan In Real Life</span>
            </h3>
            <ul className="text-xs text-brand-muted space-y-2 leading-relaxed">
              <li>• Hold the barcode flat and avoid heavy glare or reflections.</li>
              <li>• Keep the food packaging about 4–8 inches away from the lens.</li>
              <li>• Works on standard UPC, EAN-13, and JAN grocery barcodes worldwide.</li>
            </ul>
          </Card>

        </div>

      </div>

    </div>
  );
};

