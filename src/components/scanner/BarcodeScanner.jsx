import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  SwitchCamera,
  AlertCircle,
  ScanLine,
  CheckCircle2,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import {
  validateEanUpcChecksum,
  identifyBarcodeFormat,
  getGS1CountryPrefix,
  normalizeBarcode
} from '../../utils/barcodeValidator';
import { scanLogger } from '../../utils/scanLogger';

export const BarcodeScanner = ({ onBarcodeDetected, isProcessing = false }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readerRef = useRef(null);
  const isScanningLocked = useRef(false);

  // Camera Hardware States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  // Manual Input States
  const [manualCode, setManualCode] = useState('');
  const [manualValidation, setManualValidation] = useState(null);

  // Setup ZXing hints for retail formats with TRY_HARDER
  const getHints = useCallback(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);
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
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn('Camera stop error:', e);
    } finally {
      setIsCameraActive(false);
      setCameraLoading(false);
      setIsTorchOn(false);
      setHasTorch(false);
    }
  }, []);

  // Audio & Haptic Chime
  const triggerSuccessFeedback = useCallback(() => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate([40, 30, 40]);
      }
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
      // Audio or vibration unavailable; silent fallback
    }
  }, []);

  // Dispatch detected barcode with debounce
  const handleDetectedCode = useCallback(
    (codeText) => {
      if (isScanningLocked.current || isProcessing) return;
      const clean = normalizeBarcode(codeText);
      if (!clean) return;

      isScanningLocked.current = true;
      triggerSuccessFeedback();

      scanLogger.log({
        barcode: clean,
        format: identifyBarcodeFormat(clean),
        action: 'BARCODE_DECODED',
        source: 'ZXING_CAMERA_SCANNER',
        status: 'SUCCESS',
        message: `Successfully read barcode ${clean}`
      });

      // Stop camera stream cleanly
      stopCamera();

      onBarcodeDetected(clean);

      // Unlock after cooldown
      setTimeout(() => {
        isScanningLocked.current = false;
      }, 2500);
    },
    [isProcessing, onBarcodeDetected, stopCamera, triggerSuccessFeedback]
  );

  // Start live camera stream with universal mobile & desktop fallback
  const startCamera = useCallback(
    async (deviceIdToUse = null) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError({
          type: 'UNSUPPORTED',
          message: 'Camera API is not supported in this browser. Please ensure HTTPS or localhost is active, or use manual input below.'
        });
        return;
      }

      stopCamera();
      setCameraLoading(true);
      setCameraError(null);
      isScanningLocked.current = false;

      let stream = null;

      // 1. Primary Attempt: Environment facingMode with HD constraints (great for mobile)
      try {
        const constraints = deviceIdToUse
          ? { video: { deviceId: { exact: deviceIdToUse } } }
          : {
              video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err1) {
        console.warn('Initial camera constraints failed, attempting generic webcam fallback:', err1);

        // 2. Secondary Fallback: Universal generic video constraint (laptop webcams, desktop USB cameras)
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err2) {
          console.error('All camera access attempts failed:', err2);
          let errorMsg = 'Could not access camera. Please allow camera permissions in your browser address bar.';
          let errorType = 'UNKNOWN';

          if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
            errorType = 'PERMISSION_DENIED';
            errorMsg = 'Camera access is blocked. Click the camera/lock icon in your browser address bar to allow camera access, then click Start Camera again.';
          } else if (err2.name === 'NotFoundError' || err2.name === 'DevicesNotFoundError') {
            errorType = 'NOT_FOUND';
            errorMsg = 'No camera device was detected on your computer. You can look up products using the manual barcode box below.';
          } else if (err2.name === 'NotReadableError' || err2.name === 'TrackStartError') {
            errorType = 'IN_USE';
            errorMsg = 'Your camera is already in use by another tab or app (e.g. Zoom, Meet, Teams). Please close other camera apps and try again.';
          }

          setCameraError({ type: errorType, message: errorMsg });
          setIsCameraActive(false);
          setCameraLoading(false);
          return;
        }
      }

      if (!stream || !videoRef.current) {
        setCameraLoading(false);
        return;
      }

      try {
        // Enumerate video devices now that user has granted camera permissions
        try {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
          setVideoDevices(videoInputs);
        } catch (e) {
          console.warn('Device enumeration failed:', e);
        }

        // Attach stream to video element
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video play interrupted:', playErr);
        }

        const reader = new BrowserMultiFormatReader(getHints());
        readerRef.current = reader;

        const controls = await reader.decodeFromStream(
          stream,
          videoRef.current,
          (result, error) => {
            if (result && !isScanningLocked.current) {
              const text = result.getText();
              if (text) {
                handleDetectedCode(text);
              }
            }
          }
        );

        controlsRef.current = controls;
        setIsCameraActive(true);
        setCameraLoading(false);

        // Check torch capabilities
        const track = stream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities ? track.getCapabilities() : {};
          if (capabilities.torch) {
            setHasTorch(true);
          }
        }
      } catch (decodeErr) {
        console.error('ZXing decoder stream attachment failed:', decodeErr);
        // Keep video element active so user at least sees video preview
        setIsCameraActive(true);
        setCameraLoading(false);
      }
    },
    [getHints, handleDetectedCode, stopCamera]
  );

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    try {
      const stream = videoRef.current?.srcObject;
      if (!stream) return;
      const track = stream.getVideoTracks()[0];
      if (track && hasTorch) {
        const nextState = !isTorchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setIsTorchOn(nextState);
      }
    } catch (e) {
      console.warn('Torch toggle error:', e);
    }
  };

  // Switch between cameras
  const handleSwitchCamera = () => {
    if (videoDevices.length < 2) return;
    const currentIndex = videoDevices.findIndex((d) => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex];
    setSelectedDeviceId(nextDevice.deviceId);
    startCamera(nextDevice.deviceId);
  };

  // Cleanup on unmount or tab hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isCameraActive) {
        stopCamera();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
    };
  }, [isCameraActive, stopCamera]);

  // Real-time manual barcode validator
  const handleManualInputChange = (val) => {
    setManualCode(val);
    const clean = normalizeBarcode(val);
    if (!clean) {
      setManualValidation(null);
      return;
    }

    const format = identifyBarcodeFormat(clean);
    const checksumValid = validateEanUpcChecksum(clean);
    const gs1 = getGS1CountryPrefix(clean);

    setManualValidation({
      clean,
      format,
      checksumValid,
      gs1,
      isValidLength: clean.length >= 6 && clean.length <= 14
    });
  };

  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (!manualCode.trim()) return;
    handleDetectedCode(manualCode);
  };

  return (
    <div className="w-full space-y-6">
      {/* Live Video Viewfinder Card */}
      <Card className="relative overflow-hidden bg-berry-900 border-2 border-brand-border p-0 shadow-soft-xl rounded-3xl">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isCameraActive ? 'opacity-100' : 'opacity-0'
            }`}
            playsInline
            muted
            autoPlay
          />

          {/* Idle / Off Screen */}
          {!isCameraActive && !cameraLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-berry-900/90 to-berry/95 text-white space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-warm">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  High-Precision Barcode Scanner
                </h3>
                <p className="text-xs text-soft-pink leading-relaxed">
                  Supports Indian EAN-13, EAN-8, UPC, and FMCG retail packages with automatic focus and multi-angle recognition.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={Camera}
                onClick={() => startCamera()}
                className="shadow-vibrant-glow"
              >
                Start Camera
              </Button>
            </div>
          )}

          {/* Loading Camera State */}
          {cameraLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-berry-900 text-white space-y-3">
              <RefreshCw className="w-8 h-8 text-vibrant animate-spin" />
              <span className="text-xs font-heading font-bold text-soft-pink">
                Initializing camera optics...
              </span>
            </div>
          )}

          {/* Active Viewfinder Overlays */}
          {isCameraActive && (
            <>
              {/* Reticle / Target Box */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="relative w-64 sm:w-80 h-40 sm:h-48 rounded-2xl border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  {/* Glowing Reticle Corners */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-warm rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-warm rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-warm rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-warm rounded-br-lg" />

                  {/* Animated Horizontal Laser Scanner Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-vibrant to-transparent shadow-[0_0_8px_#F62477] animate-bounce" />

                  <div className="absolute -bottom-7 inset-x-0 text-center">
                    <span className="text-[11px] font-heading font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Align barcode within frame
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware Controls Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                      isTorchOn
                        ? 'bg-warm text-berry border-warm shadow-[0_0_12px_#FFE185]'
                        : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                    }`}
                    title={isTorchOn ? 'Turn Off Flashlight' : 'Turn On Flashlight'}
                  >
                    {isTorchOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
                  </button>
                )}

                {videoDevices.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="p-2.5 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md hover:bg-black/60 transition-all"
                    title="Switch Camera Device"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopCamera}
                  className="p-2.5 rounded-full bg-rose-500/80 text-white border border-rose-400 backdrop-blur-md hover:bg-rose-600 transition-all"
                  title="Stop Camera"
                >
                  <CameraOff className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Camera Permission or Hardware Error */}
        {cameraError && (
          <div className="p-4 bg-rose-900/90 text-rose-100 flex items-start gap-3 border-t border-rose-700 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">{cameraError.message}</span>
              <p className="text-rose-200">
                You can still look up any product immediately using the manual barcode box below.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Manual Barcode Input & Instant Validator Card */}
      <Card className="bg-white border-2 border-brand-border p-6 shadow-soft-lg space-y-4 rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-vibrant" />
            <h3 className="font-heading font-bold text-berry text-base">
              Manual Barcode Entry
            </h3>
          </div>
          <span className="text-xs text-brand-muted">
            EAN-13, EAN-8, UPC-A, Code-128
          </span>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 8901030383707 (Parle-G) or 8901058852441 (Maggi)"
              value={manualCode}
              onChange={(e) => handleManualInputChange(e.target.value)}
              className="w-full pl-4 pr-32 py-3 text-sm sm:text-base font-mono bg-brand-surface rounded-2xl border-2 border-brand-border focus:outline-none focus:ring-2 focus:ring-vibrant text-berry transition-all placeholder:text-brand-muted/70"
            />
            <div className="absolute right-2 top-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Search}
                disabled={!manualCode.trim() || isProcessing}
                className="shadow-vibrant-glow"
              >
                Look Up
              </Button>
            </div>
          </div>

          {/* Real-time Barcode Format & GS1 Country Intelligence Banner */}
          {manualValidation && (
            <div className="p-3 rounded-xl bg-warm/30 border border-warm/60 flex items-center justify-between text-xs text-berry flex-wrap gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{manualValidation.format}</span>
                {manualValidation.gs1?.country && (
                  <span className="text-brand-muted">
                    • GS1 Registry: <strong className="text-berry">{manualValidation.gs1.country}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {manualValidation.checksumValid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid Checksum
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                    <Info className="w-3.5 h-3.5" /> Checksum Mismatch
                  </span>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Quick-Test Buttons for Top Indian FMCG Items */}
        <div className="pt-2 border-t border-brand-border/60">
          <div className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
            Quick-Test Top Indian FMCG Barcodes:
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {[
              { name: 'Parle-G Biscuits', code: '8901030383707' },
              { name: 'Maggi Masala Noodles', code: '8901058852441' },
              { name: 'Amul Salted Butter', code: '8901262010010' },
              { name: 'Lay’s Magic Masala', code: '8901491101837' },
              { name: 'Frooti Mango Drink', code: '8901030491020' },
              { name: 'Cadbury Dairy Milk', code: '7622201416189' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setManualCode(item.code);
                  handleManualInputChange(item.code);
                  handleDetectedCode(item.code);
                }}
                className="px-2.5 py-1 rounded-lg bg-brand-surface hover:bg-warm text-berry border border-brand-border transition-colors text-xs font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

