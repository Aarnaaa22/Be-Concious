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
  Upload,
  Image as ImageIcon,
  Info,
  Sparkles
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
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
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
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
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

  // Audio & Haptic Feedback
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
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

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

  // Dispatch detected barcode with cooldown
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
        source: 'BARCODE_SCANNER',
        status: 'SUCCESS',
        message: `Successfully decoded barcode ${clean}`
      });

      stopCamera();
      onBarcodeDetected(clean);

      setTimeout(() => {
        isScanningLocked.current = false;
      }, 2500);
    },
    [isProcessing, onBarcodeDetected, stopCamera, triggerSuccessFeedback]
  );

  // Live camera stream startup (Never auto-stopped by lifecycle re-renders!)
  const startCamera = useCallback(
    async (deviceIdToUse = null) => {
      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError({
          title: 'Camera Access Unavailable Over Plain HTTP',
          message: 'Browsers block live video camera streaming over insecure Wi-Fi IP addresses. On mobile, please use the "Snap Photo to Scan" button below, or test via localhost on your computer.'
        });
        return;
      }

      setCameraLoading(true);
      setCameraError(null);
      isScanningLocked.current = false;

      let stream = null;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Primary Attempt: Environment facingMode or generic video
      try {
        const constraints = deviceIdToUse
          ? { video: { deviceId: { exact: deviceIdToUse } } }
          : isMobile
          ? { video: { facingMode: { ideal: 'environment' } } }
          : { video: true };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err1) {
        console.warn('Initial camera constraint failed, attempting generic video fallback:', err1);

        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err2) {
          console.error('All camera requests failed:', err2);
          let title = 'Camera Access Blocked';
          let message = 'Please grant camera access to scan barcodes.';

          if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
            title = 'Permission Denied';
            message = 'Click the lock or camera icon in your browser address bar at the top, switch Camera to "Allow", and then refresh the page.';
          } else if (err2.name === 'NotFoundError' || err2.name === 'DevicesNotFoundError') {
            title = 'No Camera Hardware Detected';
            message = 'No webcam was detected on this device. You can enter the barcode numbers manually below.';
          } else if (err2.name === 'NotReadableError' || err2.name === 'TrackStartError') {
            title = 'Camera In Use';
            message = 'Another application (such as Zoom, Meet, Teams) is using your webcam. Please close other camera tabs and try again.';
          } else {
            message = `${err2.name}: ${err2.message}`;
          }

          setCameraError({ title, message });
          setIsCameraActive(false);
          setCameraLoading(false);
          return;
        }
      }

      const video = videoRef.current;
      if (!stream || !video) {
        setCameraLoading(false);
        return;
      }

      streamRef.current = stream;

      try {
        // Enumerate video devices
        try {
          const all = await navigator.mediaDevices.enumerateDevices();
          const vInputs = all.filter((d) => d.kind === 'videoinput');
          setVideoDevices(vInputs);
        } catch {
          // ignore enumeration error
        }

        // Attach stream directly to video element
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.muted = true;

        // Display video immediately
        setIsCameraActive(true);
        setCameraLoading(false);

        try {
          await video.play();
        } catch (playErr) {
          console.warn('Video auto-play interrupted:', playErr);
        }

        // Check torch capabilities
        const track = stream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities ? track.getCapabilities() : {};
          if (capabilities.torch) {
            setHasTorch(true);
          }
          if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
            track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
          }
        }

        // Check for native BarcodeDetector API (fastest, hardware accelerated)
        let nativeDetector = null;
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            nativeDetector = new window.BarcodeDetector({
              formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf']
            });
          } catch {
            nativeDetector = null;
          }
        }

        // Fallback ZXing reader
        const zxingReader = new BrowserMultiFormatReader(getHints());
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // High-performance decoding interval
        scanIntervalRef.current = setInterval(async () => {
          if (
            video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
            !isScanningLocked.current
          ) {
            // 1. Try Native BarcodeDetector if available
            if (nativeDetector) {
              try {
                const barcodes = await nativeDetector.detect(video);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  handleDetectedCode(barcodes[0].rawValue);
                  return;
                }
              } catch {
                // fall through to zxing
              }
            }

            // 2. ZXing Canvas Fallback
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
              const result = zxingReader.decodeFromCanvas(canvas);
              if (result && result.getText()) {
                handleDetectedCode(result.getText());
              }
            } catch {
              // Frame without barcode
            }
          }
        }, 180);
      } catch (streamInitErr) {
        console.error('Video stream error:', streamInitErr);
        setCameraError({
          title: 'Video Stream Error',
          message: streamInitErr?.message || 'Failed to start video playback.'
        });
        setIsCameraActive(false);
        setCameraLoading(false);
      }
    },
    [getHints, handleDetectedCode]
  );

  // Decode Barcode from Photo Snapshot or File Upload
  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraLoading(true);
    setCameraError(null);

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      // Scale down image to optimal dimension (1280px max)
      const maxDim = 1280;
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      // 1. Try Native BarcodeDetector first
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf']
          });
          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleDetectedCode(barcodes[0].rawValue);
            return;
          }
        } catch {
          // fall through
        }
      }

      // 2. Try ZXing
      const reader = new BrowserMultiFormatReader(getHints());
      try {
        const result = reader.decodeFromCanvas(canvas);
        if (result && result.getText()) {
          handleDetectedCode(result.getText());
          return;
        }
      } catch {
        // Continue
      }

      setCameraError({
        title: 'No Barcode Found In Photo',
        message: 'Could not read a barcode in that photo. Please take a closer photo with the barcode centered and well-lit, or type the numbers manually below.'
      });
    } catch (err) {
      console.warn('Photo barcode decode error:', err);
      setCameraError({
        title: 'Photo Decode Error',
        message: 'Could not read barcode from this image. Please ensure good lighting or enter the numbers manually below.'
      });
    } finally {
      setCameraLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    try {
      const stream = streamRef.current || videoRef.current?.srcObject;
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

  // ONLY cleanup when the entire component unmounts from page!
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
      {/* Hidden File / Camera Capture Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        className="hidden"
      />

      {/* Live Video Viewfinder Card */}
      <Card className="relative overflow-hidden bg-berry-900 border-2 border-brand-border p-0 shadow-soft-xl rounded-3xl">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
          {/* Native HTML5 Video Element (ALWAYS RENDERED IN DOM) */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Idle Screen (Sits on top when camera is off) */}
          {!isCameraActive && !cameraLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-berry-900/95 to-berry/95 text-white space-y-5 z-10">
              <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-warm shadow-soft">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-heading font-extrabold text-xl text-white">
                  High-Precision Barcode Scanner
                </h3>
                <p className="text-xs text-soft-pink leading-relaxed">
                  Supports Indian EAN-13, EAN-8, UPC, and FMCG retail packages with automatic focus and multi-angle recognition.
                </p>
              </div>

              {/* Action Buttons: Live Camera or Camera Snap */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={Camera}
                  onClick={() => startCamera()}
                  className="w-full sm:flex-1 shadow-vibrant-glow text-sm font-bold"
                >
                  Start Live Camera
                </Button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-heading font-bold text-sm backdrop-blur-sm transition-all"
                >
                  <Upload className="w-4 h-4 text-warm" />
                  <span>Snap Photo to Scan</span>
                </button>
              </div>

              {/* Error Notice if camera was blocked */}
              {cameraError && (
                <div className="max-w-md p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-left text-xs space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{cameraError.title}</span>
                  </div>
                  <p className="text-rose-100/90 leading-relaxed pl-6">{cameraError.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading Camera State */}
          {cameraLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-berry-900 text-white space-y-3 z-20">
              <RefreshCw className="w-8 h-8 text-vibrant animate-spin" />
              <span className="text-sm font-heading font-bold text-soft-pink">
                Connecting to camera...
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
              <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
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
