import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { 
  ScanLine, 
  Search, 
  Camera, 
  CameraOff, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  ShieldAlert, 
  Loader2, 
  ArrowRight,
  SwitchCamera
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { mockProducts, fetchProductByBarcode, getProductByBarcode } from '../data/mockProducts';
import { useHistory } from '../context/HistoryContext';

export const ScanFoodPage = () => {
  const navigate = useNavigate();
  const { addToHistory } = useHistory();

  // Video and scanner state
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readerRef = useRef(null);
  const isProcessingScan = useRef(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  
  // Barcode decoding & manual input states
  const [manualBarcode, setManualBarcode] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);

  // Setup hints for retail barcodes: EAN-13, EAN-8, UPC-A, UPC-E
  const getHints = useCallback(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.UPC_EAN_EXTENSION,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39
    ]);
    return hints;
  }, []);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn('Camera stop error:', e);
    } finally {
      setIsCameraActive(false);
      setCameraLoading(false);
    }
  }, []);

  // Audio chime feedback on successful barcode scan
  const playScanChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note A5
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1); // Note E6

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext not permitted or muted; ignore silently
    }
  }, []);

  // Handle successful barcode detection
  const handleBarcodeDetected = useCallback(async (barcodeText) => {
    if (isProcessingScan.current) return;
    const cleanCode = barcodeText.trim();
    if (!cleanCode) return;

    isProcessingScan.current = true;
    playScanChime();
    setLastScannedCode(cleanCode);
    setIsLookingUp(true);
    setValidationError('');

    // Stop scanning stream immediately after detection
    stopCamera();

    try {
      // Lookup product (local catalog + Open Food Facts API v3)
      const res = await fetchProductByBarcode(cleanCode);

      if (res && res.found && res.product) {
        addToHistory(res.product);
        navigate(`/analysis/${res.product.id}`);
      } else {
        // Navigate to missing product error page with required guidance
        navigate(`/analysis/${cleanCode}`);
      }
    } catch (err) {
      console.error('Error during product lookup:', err);
      navigate(`/analysis/${cleanCode}`);
    } finally {
      setIsLookingUp(false);
      isProcessingScan.current = false;
    }
  }, [addToHistory, navigate, stopCamera]);

  // Start the live barcode scanner
  const startCamera = useCallback(async (deviceIdToUse = null) => {
    // Check browser mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError({
        type: 'UNSUPPORTED',
        message: 'Your current browser or connection does not support live camera access. Please use HTTPS or localhost, or enter the barcode manually.'
      });
      return;
    }

    stopCamera();
    setCameraLoading(true);
    setCameraError(null);
    setValidationError('');
    isProcessingScan.current = false;

    try {
      // Discover available camera devices
      let devices = [];
      try {
        devices = await BrowserMultiFormatReader.listVideoInputDevices();
        setVideoDevices(devices);
      } catch (e) {
        console.warn('Could not enumerate video devices:', e);
      }

      // Pick preferred device (rear camera or chosen device)
      let targetDeviceId = deviceIdToUse || selectedDeviceId;
      if (!targetDeviceId && devices.length > 0) {
        // Look for rear/environment camera
        const backCamera = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear') || 
          d.label.toLowerCase().includes('environment')
        );
        targetDeviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;
        setSelectedDeviceId(targetDeviceId);
      }

      const reader = new BrowserMultiFormatReader(getHints(), {
        delayBetweenScanAttempts: 200
      });
      readerRef.current = reader;

      if (!videoRef.current) {
        setCameraLoading(false);
        return;
      }

      // Start decoding from video device
      const controls = await reader.decodeFromVideoDevice(
        targetDeviceId || undefined,
        videoRef.current,
        (result, error) => {
          if (result && !isProcessingScan.current) {
            const text = result.getText();
            if (text) {
              handleBarcodeDetected(text);
            }
          }
          // Note: error is continuously thrown on frames with no barcode, which is standard ZXing behavior
        }
      );

      controlsRef.current = controls;
      setIsCameraActive(true);
      setCameraLoading(false);
    } catch (err) {
      console.error('Camera initialization failed:', err);
      let errorType = 'UNKNOWN';
      let errorMsg = 'Could not access the camera. Please check camera permissions or enter barcode manually.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorType = 'PERMISSION_DENIED';
        errorMsg = 'Camera access was blocked. Please allow camera permissions in your browser address bar settings to scan barcodes.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorType = 'NOT_FOUND';
        errorMsg = 'No camera hardware found on this device. You can enter the barcode numbers below.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorType = 'IN_USE';
        errorMsg = 'Camera is currently in use by another application. Please close other camera tabs and try again.';
      }

      setCameraError({ type: errorType, message: errorMsg });
      setIsCameraActive(false);
      setCameraLoading(false);
    }
  }, [getHints, handleBarcodeDetected, selectedDeviceId, stopCamera]);

  // Switch to next available camera
  const handleSwitchCamera = () => {
    if (videoDevices.length < 2) return;
    const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex];
    setSelectedDeviceId(nextDevice.deviceId);
    startCamera(nextDevice.deviceId);
  };

  // Cleanup camera streams on page unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle Manual Barcode Entry with validation
  const handleManualSubmit = async (e) => {
    e?.preventDefault();
    const clean = manualBarcode.trim();

    if (!clean) {
      setValidationError('Please enter a barcode number.');
      return;
    }

    // Validate only digits
    if (!/^\d+$/.test(clean)) {
      setValidationError('Barcodes contain numbers only. Please remove letters or symbols.');
      return;
    }

    // Validate supported retail barcode lengths (EAN-8: 8, UPC-E: 8, UPC-A: 12, EAN-13: 13, ITF-14: 14)
    if (clean.length < 6 || clean.length > 14) {
      setValidationError('Retail barcodes (EAN/UPC) are typically 8, 12, or 13 digits long.');
      return;
    }

    setValidationError('');
    setIsLookingUp(true);

    try {
      const res = await fetchProductByBarcode(clean);
      if (res && res.found && res.product) {
        addToHistory(res.product);
        navigate(`/analysis/${res.product.id}`);
      } else {
        navigate(`/analysis/${clean}`);
      }
    } catch (err) {
      navigate(`/analysis/${clean}`);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleTestSample = (sample) => {
    setManualBarcode(sample.barcode);
    setValidationError('');
    addToHistory(sample);
    navigate(`/analysis/${sample.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header (Exact requested typography & copy) */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="soft" size="md">
          Live Food Barcode Scanner
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-berry tracking-tight">
          Scan Before You Snack!
        </h1>
        <p className="text-base sm:text-lg text-brand-muted font-body">
          One little scan. A whole lot of information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: LIVE SCANNER CARD                                            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7">
          <Card className="bg-white border border-brand-border p-6 sm:p-8 space-y-6 shadow-soft-lg">
            
            {/* Header & Controls Status */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-vibrant animate-ping' : 'bg-brand-muted/40'}`} />
                <span className="text-xs font-heading font-bold text-berry uppercase tracking-wider">
                  {isCameraActive ? 'Camera Live' : 'Camera Ready'}
                </span>
              </div>

              {/* Multi-camera switch button */}
              {videoDevices.length > 1 && isCameraActive && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="px-3 py-1 rounded-full bg-soft-light text-berry hover:bg-soft text-xs font-heading font-bold flex items-center gap-1.5 transition-colors"
                >
                  <SwitchCamera className="w-3.5 h-3.5 text-vibrant" />
                  <span>Switch Camera</span>
                </button>
              )}
            </div>

            {/* Live Camera Viewfinder Box */}
            <div className="relative aspect-[4/3] rounded-3xl bg-berry-dark overflow-hidden flex flex-col items-center justify-center border-2 border-brand-border">
              
              {/* Actual HTML5 Video Stream for ZXing */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraActive ? 'opacity-100' : 'opacity-0 absolute'}`}
              />

              {/* Viewfinder Overlay When Camera is Active */}
              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  
                  {/* Subtle dark vignette to guide focus */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Scanning Target Frame with Vibrant Pink border */}
                  <div className="relative w-72 h-44 border-2 border-vibrant/90 rounded-2xl flex items-center justify-center shadow-vibrant-glow overflow-hidden z-10">
                    
                    {/* Frame corner highlights */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white -mt-0.5 -ml-0.5 rounded-tl" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-white -mt-0.5 -mr-0.5 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-white -mb-0.5 -ml-0.5 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white -mb-0.5 -mr-0.5 rounded-br" />

                    {/* Subtle animated pink scanning line */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vibrant to-transparent animate-pulse shadow-vibrant-glow top-1/2 -translate-y-1/2" />

                    {/* Center guidance text */}
                    <span className="text-[11px] font-heading font-semibold text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Align barcode here
                    </span>
                  </div>

                  <div className="mt-4 z-10">
                    <span className="text-xs font-medium text-white/95 bg-berry/80 px-3 py-1 rounded-full backdrop-blur-xs">
                      Supports EAN-13, EAN-8, UPC-A & UPC-E
                    </span>
                  </div>

                </div>
              )}

              {/* Idle Placeholder when camera is inactive */}
              {!isCameraActive && !cameraLoading && (
                <div className="text-center p-6 space-y-4 max-w-sm z-10">
                  <div className="w-16 h-16 rounded-3xl bg-berry text-white flex items-center justify-center mx-auto shadow-soft">
                    <Camera className="w-8 h-8 text-warm" />
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-bold text-white">
                      Live Barcode Camera
                    </h3>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                      Tap Start Camera to detect retail barcodes in real-time using your phone or webcam.
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State Spinner */}
              {cameraLoading && (
                <div className="absolute inset-0 bg-berry-dark/90 flex flex-col items-center justify-center text-white space-y-3 z-20">
                  <Loader2 className="w-8 h-8 text-vibrant animate-spin" />
                  <span className="text-sm font-heading font-bold">Initializing camera...</span>
                </div>
              )}

              {/* Decoding overlay after detection */}
              {isLookingUp && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-berry space-y-3 z-30 p-6 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-warm-light border border-warm flex items-center justify-center text-berry">
                    <Loader2 className="w-6 h-6 text-vibrant animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-base font-heading font-bold text-berry">
                      Decoding Barcode: {lastScannedCode || manualBarcode}
                    </h4>
                    <p className="text-xs text-brand-muted mt-1">
                      Analyzing ingredients, allergens, and NOVA classification...
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Camera Error Alert & Permission Guidance */}
            {cameraError && (
              <div className="p-4 rounded-2xl bg-berry-50 border border-berry/30 space-y-2 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-berry flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-berry leading-relaxed">
                    <span className="font-bold block">Camera Notice:</span>
                    <span>{cameraError.message}</span>
                  </div>
                </div>
                <div className="pl-7 pt-1">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="text-xs font-bold text-vibrant hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Camera Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* Camera Control Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!isCameraActive ? (
                <Button
                  onClick={() => startCamera()}
                  variant="primary"
                  size="lg"
                  icon={Camera}
                  disabled={cameraLoading}
                  className="w-full sm:w-auto shadow-vibrant-glow text-base"
                >
                  {cameraLoading ? 'Starting Camera...' : 'Start Camera Scanner'}
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  size="md"
                  icon={CameraOff}
                  className="w-full sm:w-auto"
                >
                  Stop Camera
                </Button>
              )}

              {isCameraActive && (
                <Button
                  onClick={() => startCamera()}
                  variant="light"
                  size="md"
                  icon={RefreshCw}
                >
                  Restart Scanner
                </Button>
              )}
            </div>

            {/* Warm Yellow Information Tips */}
            <div className="p-4 rounded-2xl bg-warm-light border border-warm/80 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-berry flex-shrink-0 mt-0.5" />
              <div className="text-xs text-brand-text leading-relaxed">
                <span className="font-bold text-berry">Helpful Scanning Tip:</span> Hold the barcode 4–8 inches away in good lighting. If glare appears on plastic packaging, tilt the box slightly.
              </div>
            </div>

          </Card>
        </div>


        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MANUAL ENTRY FALLBACK & SAMPLES                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Manual Barcode Entry Card */}
          <Card className="bg-white border border-brand-border p-6 sm:p-7 space-y-4 shadow-soft">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-vibrant block">
                Permanent Fallback
              </span>
              <h2 className="text-xl font-heading font-bold text-berry">
                Enter Barcode Manually
              </h2>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                No camera or barcode scratched? Type the numbers printed directly beneath the barcode stripes.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label htmlFor="manual-code" className="block text-xs font-heading font-bold text-brand-text mb-1.5">
                  Barcode Digits (EAN-13, EAN-8, UPC-A)
                </label>
                <div className="relative">
                  <input
                    id="manual-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={manualBarcode}
                    onChange={(e) => {
                      setManualBarcode(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="e.g. 8901234567890"
                    className="w-full px-4 py-3 rounded-2xl bg-brand-bg border border-brand-border focus:border-vibrant focus:ring-4 focus:ring-vibrant/20 outline-none text-sm font-mono text-brand-text transition-all"
                  />
                  {manualBarcode && (
                    <button
                      type="button"
                      onClick={() => setManualBarcode('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted hover:text-berry"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-2xl bg-berry-50 border border-berry/30 text-xs text-berry flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{validationError}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Search}
                disabled={isLookingUp}
                className="w-full justify-center"
              >
                {isLookingUp ? 'Searching Database...' : 'Find Product'}
              </Button>
            </form>
          </Card>

          {/* Quick Click Verified Test Barcodes */}
          <Card className="bg-white border border-brand-border p-6 space-y-3.5 shadow-soft">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h3 className="text-sm font-heading font-bold text-berry">
                Test With Verified Samples
              </h3>
              <span className="text-[11px] font-bold text-vibrant">
                Instant Test
              </span>
            </div>

            <p className="text-xs text-brand-muted">
              Tap any food item to simulate an immediate scan or test live Open Food Facts barcodes:
            </p>

            <div className="space-y-2">
              {mockProducts.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTestSample(item)}
                  className="w-full text-left p-3 rounded-2xl bg-brand-bg hover:bg-soft-light border border-brand-border hover:border-vibrant/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-brand-border flex-shrink-0" 
                    />
                    <div>
                      <h4 className="text-xs font-heading font-bold text-brand-text group-hover:text-berry line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-brand-muted">
                        {item.barcode} • Benchmark Item
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-vibrant group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                </button>
              ))}

              {/* Real Open Food Facts Live Barcode Shortcuts */}
              <button
                type="button"
                onClick={() => {
                  setManualBarcode('5449000000996');
                  navigate('/analysis/5449000000996');
                }}
                className="w-full text-left p-3 rounded-2xl bg-warm-light/60 hover:bg-warm-light border border-warm/80 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-berry text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    OFF
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-brand-text group-hover:text-berry line-clamp-1">
                      Coca-Cola Original 330ml
                    </h4>
                    <span className="text-[10px] font-mono text-brand-muted">
                      5449000000996 • Real Open Food Facts v3
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-vibrant group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualBarcode('3017620422003');
                  navigate('/analysis/3017620422003');
                }}
                className="w-full text-left p-3 rounded-2xl bg-warm-light/60 hover:bg-warm-light border border-warm/80 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-berry text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    OFF
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-brand-text group-hover:text-berry line-clamp-1">
                      Nutella Hazelnut Spread (400g)
                    </h4>
                    <span className="text-[10px] font-mono text-brand-muted">
                      3017620422003 • Real Open Food Facts v3
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-vibrant group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
              </button>
            </div>
          </Card>

          {/* Browser Camera Permissions Guide Card */}
          <Card className="bg-soft-light/80 border border-soft-border/60 p-5 space-y-2.5">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-berry flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-vibrant" />
              <span>Camera Privacy & Permissions</span>
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Be Conscious processes video frames entirely inside your local browser. No video is ever recorded, uploaded, or transmitted to any external server.
            </p>
          </Card>

        </div>

      </div>

    </div>
  );
};
