import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  AnimatePresence 
} from 'framer-motion';
import { 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Zap, 
  Droplet, 
  Wheat, 
  Heart, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  Scale, 
  Eye, 
  ChevronDown, 
  SlidersHorizontal,
  Compass,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';

export const HomePage = () => {
  const navigate = useNavigate();

  // Global page scroll progress for top progress bar
  const { scrollYProgress: globalScroll } = useScroll();
  const smoothProgress = useSpring(globalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Chapter tracking based on scroll
  const [currentChapter, setCurrentChapter] = useState('01 Intro');

  useEffect(() => {
    const unsubscribe = globalScroll.on('change', (v) => {
      if (v < 0.15) setCurrentChapter('01 Intro');
      else if (v < 0.32) setCurrentChapter('02 The Question');
      else if (v < 0.50) setCurrentChapter('03 Inside The Body');
      else if (v < 0.65) setCurrentChapter('04 The Scan');
      else if (v < 0.82) setCurrentChapter('05 Decoded');
      else if (v < 0.93) setCurrentChapter('06 Comparison');
      else setCurrentChapter('07 Conscious Choice');
    });
    return () => unsubscribe();
  }, [globalScroll]);

  // Section 2: Exploded Snack Storytelling scroll refs
  const section2Ref = useRef(null);
  const { scrollYProgress: s2Progress } = useScroll({
    target: section2Ref,
    offset: ['start start', 'end end']
  });

  // Section 2 scroll transformations
  const s2Heading1Opacity = useTransform(s2Progress, [0, 0.15, 0.35], [1, 1, 0]);
  const s2Heading1Scale = useTransform(s2Progress, [0, 0.25], [1, 0.95]);
  const s2Heading2Opacity = useTransform(s2Progress, [0.35, 0.45, 0.9], [0, 1, 1]);
  const s2Heading2Y = useTransform(s2Progress, [0.35, 0.5], [40, 0]);

  // Exploded ingredients parallax trajectories
  const packScale = useTransform(s2Progress, [0.2, 0.5, 0.8], [1, 0.85, 0.75]);
  const packRotate = useTransform(s2Progress, [0.2, 0.6], [0, -4]);

  // Radial dispersion of ingredient nodes
  const ing1X = useTransform(s2Progress, [0.3, 0.7], [0, -180]);
  const ing1Y = useTransform(s2Progress, [0.3, 0.7], [0, -140]);
  const ing1Opacity = useTransform(s2Progress, [0.3, 0.45], [0, 1]);

  const ing2X = useTransform(s2Progress, [0.3, 0.7], [0, 190]);
  const ing2Y = useTransform(s2Progress, [0.3, 0.7], [0, -120]);
  const ing2Opacity = useTransform(s2Progress, [0.32, 0.47], [0, 1]);

  const ing3X = useTransform(s2Progress, [0.3, 0.7], [0, -210]);
  const ing3Y = useTransform(s2Progress, [0.3, 0.7], [0, 70]);
  const ing3Opacity = useTransform(s2Progress, [0.35, 0.5], [0, 1]);

  const ing4X = useTransform(s2Progress, [0.3, 0.7], [0, 210]);
  const ing4Y = useTransform(s2Progress, [0.3, 0.7], [0, 80]);
  const ing4Opacity = useTransform(s2Progress, [0.38, 0.53], [0, 1]);

  const ing5X = useTransform(s2Progress, [0.3, 0.7], [0, -90]);
  const ing5Y = useTransform(s2Progress, [0.3, 0.7], [0, 180]);
  const ing5Opacity = useTransform(s2Progress, [0.4, 0.55], [0, 1]);

  const ing6X = useTransform(s2Progress, [0.3, 0.7], [0, 110]);
  const ing6Y = useTransform(s2Progress, [0.3, 0.7], [0, 180]);
  const ing6Opacity = useTransform(s2Progress, [0.42, 0.57], [0, 1]);

  // Section 3: Human Body Journey scroll refs
  const section3Ref = useRef(null);
  const { scrollYProgress: s3Progress } = useScroll({
    target: section3Ref,
    offset: ['start start', 'end end']
  });

  const bodyLineProgress = useTransform(s3Progress, [0.1, 0.8], [0, 1]);
  const bodyTextOpacity = useTransform(s3Progress, [0.05, 0.25], [0, 1]);
  const bodySubtextOpacity = useTransform(s3Progress, [0.3, 0.5], [0, 1]);

  // Section 4: Live Barcode Scan Demo scroll refs
  const section4Ref = useRef(null);
  const { scrollYProgress: s4Progress } = useScroll({
    target: section4Ref,
    offset: ['start start', 'end end']
  });

  const laserY = useTransform(s4Progress, [0.1, 0.45], ['0%', '100%']);
  const laserOpacity = useTransform(s4Progress, [0.05, 0.15, 0.45, 0.55], [0, 1, 1, 0]);
  const decodedCardOpacity = useTransform(s4Progress, [0.45, 0.65], [0, 1]);
  const decodedCardScale = useTransform(s4Progress, [0.45, 0.65], [0.92, 1]);
  const barcodeOpacity = useTransform(s4Progress, [0.45, 0.65], [1, 0.2]);

  // Section 6: Comparison demo toggle state
  const [activeCompareSnack, setActiveCompareSnack] = useState('ultra'); // 'ultra' | 'conscious'

  return (
    <div className="relative bg-brand-bg text-brand-text overflow-x-hidden selection:bg-vibrant selection:text-white">
      
      {/* ========================================================================= */}
      {/* GLOBAL SCROLL PROGRESS & SKIP INTRO CONTROLS                              */}
      {/* ========================================================================= */}
      {/* Thin elegant progress bar at very top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-berry via-vibrant to-warm z-50 origin-left"
        style={{ scaleX: smoothProgress }}
        aria-hidden="true"
      />

      {/* Persistent Skip Intro Button & Story Chapter Tracker (Fixed top corner) */}
      <div className="fixed top-24 right-4 sm:right-8 z-40 flex items-center gap-2 pointer-events-auto">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#EFE4EB] text-[11px] font-heading font-extrabold text-berry shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-vibrant animate-pulse" />
          <span>{currentChapter}</span>
        </div>

        <Link
          to="/scan"
          className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#EFE4EB] text-berry hover:text-vibrant hover:border-vibrant text-xs font-heading font-bold shadow-soft transition-all duration-200 flex items-center gap-1.5 active:scale-95 group focus-visible:ring-2 focus-visible:ring-vibrant"
          aria-label="Skip storytelling intro and open barcode scanner"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-vibrant group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>


      {/* ========================================================================= */}
      {/* SECTION 1 — THE FIRST IMPRESSION (DRAMATIC FULL-SCREEN HERO)              */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle decorative food-grain ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-soft-light/70 via-warm-light/40 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-10">
          
          {/* Top Brand Statement Badge */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-berry text-white text-xs font-heading font-extrabold tracking-wider uppercase shadow-soft"
            >
              <Sparkles className="w-3.5 h-3.5 text-warm" />
              <span>Know what you eat. Choose what matters.</span>
            </motion.div>
          </div>

          {/* Oversized Editorial Typography */}
          <div className="text-center max-w-5xl mx-auto space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-heading font-black tracking-[-0.04em] text-berry leading-[1.02] text-balance"
            >
              YOU KNOW WHAT YOU EAT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-berry via-vibrant to-berry inline-block">
                BUT DO YOU KNOW WHAT'S INSIDE?
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-xl text-brand-muted max-w-2xl mx-auto font-body leading-relaxed pt-2"
            >
              Every barcode has a story. Discover the ingredients, calories and nutritional information hiding behind the labels.
            </motion.p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              type="button"
              onClick={() => {
                section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-berry hover:bg-berry-dark text-white font-heading font-extrabold text-sm sm:text-base shadow-soft hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Discover What's Inside</span>
              <ChevronDown className="w-4 h-4 text-warm group-hover:translate-y-1 transition-transform" />
            </button>

            <Link
              to="/scan"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-vibrant hover:bg-vibrant/95 text-white font-heading font-extrabold text-sm sm:text-base shadow-[0_6px_24px_rgba(246,36,119,0.35)] hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 group"
            >
              <ScanLine className="w-5 h-5 text-warm" />
              <span>Start Scanning</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Central Hero Composition: Packaged Food + Large Barcode + Floating Nutritional Chips */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 max-w-4xl mx-auto relative"
          >
            <div className="relative rounded-3xl bg-white border border-[#EFE4EB] p-6 sm:p-10 shadow-[0_12px_48px_rgba(146,0,58,0.08)] overflow-hidden">
              
              {/* Internal food image background preview */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left: Food photography representation */}
                <div className="md:col-span-5 relative flex justify-center">
                  <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl bg-brand-bg p-4 border border-[#EFE4EB] shadow-xs relative overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80" 
                      alt="Packaged artisanal hazelnut spread" 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-center border border-[#EFE4EB]">
                      <span className="text-[10px] font-heading font-extrabold text-berry uppercase tracking-wider block">Retail Package</span>
                      <span className="text-xs font-bold text-brand-text truncate block">Hazelnut Cocoa Cream</span>
                    </div>
                  </div>
                </div>

                {/* Right: Graphic Barcode with animated pink laser scan */}
                <div className="md:col-span-7 space-y-5 text-center md:text-left">
                  <div>
                    <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider block">
                      Every Packaging Encodes A Story
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-1">
                      Ready to decode your snack?
                    </h3>
                  </div>

                  {/* Stylized Barcode Graphic */}
                  <div className="relative p-5 rounded-2xl bg-white border-2 border-dashed border-berry/30 space-y-2 overflow-hidden shadow-xs">
                    
                    {/* Pink animated scanning laser line */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vibrant to-transparent shadow-[0_0_12px_#F62477] animate-pulse top-1/2 -translate-y-1/2" />

                    {/* SVG barcode stripes */}
                    <div className="flex items-center justify-between h-14 px-2 opacity-85">
                      {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 5, 1, 3, 2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 5].map((w, i) => (
                        <div 
                          key={i} 
                          className="bg-berry h-full rounded-xs" 
                          style={{ width: `${w * 2.5}px` }} 
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-berry pt-1 tracking-widest px-2">
                      <span>3 017620 422003</span>
                      <span className="text-vibrant uppercase font-heading text-[10px]">Verified OFF v3</span>
                    </div>
                  </div>

                  {/* Floating Nutritional Data Pills */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded-xl bg-warm-light border border-warm/80 text-xs font-heading font-bold text-berry flex items-center gap-1.5 shadow-xs">
                      <Flame className="w-3.5 h-3.5 text-vibrant" />
                      <span>539 kcal / 100g</span>
                    </span>

                    <span className="px-3 py-1.5 rounded-xl bg-soft-light border border-soft text-xs font-heading font-bold text-berry flex items-center gap-1.5 shadow-xs">
                      <Droplet className="w-3.5 h-3.5 text-vibrant" />
                      <span>56.3g Sugar (78%)</span>
                    </span>

                    <span className="px-3 py-1.5 rounded-xl bg-berry text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-xs">
                      <Layers className="w-3.5 h-3.5 text-warm" />
                      <span>NOVA 4 Ultra-Processed</span>
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 2 — THE QUESTION (EXPLODED INGREDIENT STORYTELLING)               */}
      {/* ========================================================================= */}
      <section 
        ref={section2Ref} 
        className="relative min-h-[220vh] bg-gradient-to-b from-brand-bg via-[#FFF5FA] to-brand-bg"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Phase 1 Text: "THAT SNACK LOOKS INNOCENT." */}
          <motion.div 
            style={{ opacity: s2Heading1Opacity, scale: s2Heading1Scale }}
            className="absolute top-16 sm:top-24 text-center z-20 max-w-3xl pointer-events-none"
          >
            <span className="text-xs font-heading font-black text-vibrant uppercase tracking-widest block mb-1">
              Part 02 • Deconstructing The Label
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
              THAT SNACK LOOKS INNOCENT.
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2 font-medium">
              Crisp packaging, friendly promises, glossy illustrations. Scroll to reveal what happens inside.
            </p>
          </motion.div>

          {/* Phase 2 Text: "BUT WHAT'S ACTUALLY INSIDE?" */}
          <motion.div 
            style={{ opacity: s2Heading2Opacity, y: s2Heading2Y }}
            className="absolute top-14 sm:top-20 text-center z-20 max-w-3xl pointer-events-none"
          >
            <span className="text-xs font-heading font-black text-vibrant uppercase tracking-widest block mb-1">
              The Reality Check
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
              BUT WHAT'S ACTUALLY INSIDE?
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2 font-medium">
              When packaging opens, industrial food breaks down into real components.
            </p>
          </motion.div>

          {/* Central Exploded Snack Canvas */}
          <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center mt-12 sm:mt-16">
            
            {/* Central Package Box */}
            <motion.div
              style={{ scale: packScale, rotate: packRotate }}
              className="relative w-44 h-56 sm:w-48 sm:h-64 rounded-3xl bg-white border-2 border-berry/30 shadow-soft-lg p-3 z-10 flex flex-col items-center justify-between"
            >
              <div className="w-full h-32 rounded-2xl bg-brand-bg border border-[#EFE4EB] p-2 overflow-hidden flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&q=80" 
                  alt="Snack Package"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center w-full space-y-0.5">
                <span className="text-[10px] font-bold text-vibrant uppercase tracking-wider block">Commercial Formula</span>
                <span className="text-xs font-heading font-black text-berry block truncate">Ultra Snack Item</span>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-berry via-vibrant to-warm rounded-full" />
            </motion.div>

            {/* Ingredient Particle 1: Refined Sugar (Top Left) */}
            <motion.div
              style={{ x: ing1X, y: ing1Y, opacity: ing1Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EFE4EB] shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-vibrant">
                <Droplet className="w-3.5 h-3.5 text-vibrant" />
                <span>Refined Sugar</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                Up to 56% of total net weight. Pure sucrose offering instant energy spikes.
              </p>
              <span className="text-[10px] font-mono text-berry font-bold block pt-0.5">~12 Teaspoons</span>
            </motion.div>

            {/* Ingredient Particle 2: Industrial Oils (Top Right) */}
            <motion.div
              style={{ x: ing2X, y: ing2Y, opacity: ing2Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-warm/80 bg-warm-light/90 shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-berry">
                <Flame className="w-3.5 h-3.5 text-vibrant" />
                <span>Fractionated Palm Oil</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                High-temperature shelf stability providing uniform creamy mouthfeel.
              </p>
              <span className="text-[10px] font-mono text-berry font-bold block pt-0.5">31% Total Fat</span>
            </motion.div>

            {/* Ingredient Particle 3: Emulsifiers (Mid Left) */}
            <motion.div
              style={{ x: ing3X, y: ing3Y, opacity: ing3Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EFE4EB] shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-berry">
                <Layers className="w-3.5 h-3.5 text-berry" />
                <span>Lecithins (E322)</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                Plant emulsifier preventing oil and cocoa fractions from separating.
              </p>
              <span className="text-[10px] font-mono text-brand-muted block pt-0.5">Approved Food Additive</span>
            </motion.div>

            {/* Ingredient Particle 4: Sodium / Minerals (Mid Right) */}
            <motion.div
              style={{ x: ing4X, y: ing4Y, opacity: ing4Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EFE4EB] shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-berry">
                <Heart className="w-3.5 h-3.5 text-vibrant" />
                <span>Hidden Sodium</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                Added salt to intensify sweetness perception and preserve freshness.
              </p>
              <span className="text-[10px] font-mono text-brand-muted block pt-0.5">~110mg Sodium</span>
            </motion.div>

            {/* Ingredient Particle 5: Flavoring Agents (Bottom Left) */}
            <motion.div
              style={{ x: ing5X, y: ing5Y, opacity: ing5Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EFE4EB] shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-berry">
                <Sparkles className="w-3.5 h-3.5 text-warm" />
                <span>Vanillin & Aromas</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                Laboratory-synthesized aromatic compounds standardizing scent profile.
              </p>
            </motion.div>

            {/* Ingredient Particle 6: Actual Whole Food (Bottom Right) */}
            <motion.div
              style={{ x: ing6X, y: ing6Y, opacity: ing6Opacity }}
              className="absolute z-20 w-44 sm:w-52 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-soft text-berry shadow-soft space-y-1 text-left"
            >
              <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-berry">
                <Wheat className="w-3.5 h-3.5 text-berry" />
                <span>Whole Hazelnuts</span>
              </div>
              <p className="text-[11px] text-brand-text leading-tight font-medium">
                Only ~13% actual roasted nut content despite front-of-pack claims.
              </p>
              <span className="text-[10px] font-mono text-vibrant font-bold block pt-0.5">13% Real Nuts</span>
            </motion.div>

          </div>

          {/* Educational Disclaimer Bottom Note */}
          <div className="absolute bottom-6 inset-x-4 text-center z-20">
            <span className="text-[11px] text-brand-muted font-medium bg-white/80 px-3 py-1 rounded-full border border-[#EFE4EB]">
              Illustrative ingredient breakdown demonstrating packaged food decomposition.
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 3 — WHAT GOES INSIDE YOUR BODY? (NUTRITIONAL ANATOMY JOURNEY)     */}
      {/* ========================================================================= */}
      <section 
        ref={section3Ref} 
        className="relative min-h-[220vh] bg-white border-y border-[#EFE4EB]"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Main Chapter Text */}
          <motion.div 
            style={{ opacity: bodyTextOpacity }}
            className="text-center max-w-3xl space-y-2 mb-6"
          >
            <span className="text-xs font-heading font-black text-vibrant uppercase tracking-widest">
              Part 03 • Holistic Biological Connection
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
              EVERY BITE HAS A STORY.
            </h2>
            <motion.p 
              style={{ opacity: bodySubtextOpacity }}
              className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-xl mx-auto"
            >
              Understanding what's inside your food is the first step towards making informed choices.
            </motion.p>
          </motion.div>

          {/* Stylized Human Body Silhouette with Animated Physiological Pathways */}
          <div className="relative w-full max-w-3xl h-[420px] sm:h-[460px] flex items-center justify-center">
            
            {/* Elegant SVG Silhouette */}
            <svg 
              className="w-48 sm:w-60 h-full text-berry/15 drop-shadow-xs" 
              viewBox="0 0 200 400" 
              fill="none"
              aria-hidden="true"
            >
              {/* Head */}
              <circle cx="100" cy="45" r="28" stroke="currentColor" strokeWidth="2.5" fill="rgba(255,250,252,0.6)" />
              {/* Neck */}
              <path d="M94 73v14M106 73v14" stroke="currentColor" strokeWidth="2.5" />
              {/* Torso & Shoulders */}
              <path 
                d="M60 95 C 60 95, 80 88, 100 88 C 120 88, 140 95, 140 95 L 146 170 C 146 195, 138 235, 134 250 L 66 250 C 62 235, 54 195, 54 170 Z" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                fill="rgba(255,250,252,0.4)" 
              />
              {/* Arms */}
              <path d="M54 105 L 35 190 L 28 260" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M146 105 L 165 190 L 172 260" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              {/* Legs */}
              <path d="M78 250 L 72 380" stroke="currentColor" strokeWidth="2.5" />
              <path d="M122 250 L 128 380" stroke="currentColor" strokeWidth="2.5" />

              {/* Glowing animated digestive & metabolic center pathway */}
              <path 
                d="M100 87 L 100 135 L 94 165 L 106 185 L 98 210 L 100 235" 
                stroke="#F62477" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>

            {/* Connected Node 1: Brain & Glycemic Stability (Top Left) */}
            <div className="absolute top-6 left-4 sm:left-12 max-w-[190px] p-3 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-extrabold text-vibrant uppercase block">Metabolism</span>
              <h4 className="text-xs font-heading font-bold text-berry">Energy Curves</h4>
              <p className="text-[11px] text-brand-muted leading-tight">
                Complex carbs provide steady energy; refined sugars trigger rapid insulin spikes.
              </p>
            </div>

            {/* Connected Node 2: Heart & Cardiovascular Lipids (Mid Right) */}
            <div className="absolute top-28 right-4 sm:right-10 max-w-[190px] p-3 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-extrabold text-berry uppercase block">Cardiovascular</span>
              <h4 className="text-xs font-heading font-bold text-berry">Lipid Balance</h4>
              <p className="text-[11px] text-brand-muted leading-tight">
                Excess saturated fats and sodium impact arterial wellness over decades.
              </p>
            </div>

            {/* Connected Node 3: Gut Microbiome Diversity (Bottom Left) */}
            <div className="absolute bottom-16 left-4 sm:left-12 max-w-[190px] p-3 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-extrabold text-warm-dark uppercase block">Digestive</span>
              <h4 className="text-xs font-heading font-bold text-berry">Microbiome Diversity</h4>
              <p className="text-[11px] text-brand-muted leading-tight">
                Dietary plant fiber nourishes beneficial gut bacteria essential for immunity.
              </p>
            </div>

            {/* Connected Node 4: Cellular Recovery (Bottom Right) */}
            <div className="absolute bottom-16 right-4 sm:right-10 max-w-[190px] p-3 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs space-y-1">
              <span className="text-[10px] font-heading font-extrabold text-vibrant uppercase block">Cellular</span>
              <h4 className="text-xs font-heading font-bold text-berry">Tissue Satiety</h4>
              <p className="text-[11px] text-brand-muted leading-tight">
                Complete proteins supply amino acids required for daily cellular maintenance.
              </p>
            </div>

          </div>

          {/* Educational Notice */}
          <div className="pt-4 text-center">
            <span className="text-[11px] text-brand-muted font-medium bg-brand-bg px-3.5 py-1.5 rounded-full border border-[#EFE4EB]">
              Educational visualization of macronutrient balance. Be Conscious provides nutritional data, not medical advice.
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 4 — ONE SCAN. A WORLD OF INFORMATION. (SCANNING DEMO)             */}
      {/* ========================================================================= */}
      <section 
        ref={section4Ref} 
        className="relative min-h-[200vh] bg-brand-bg"
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-heading font-black text-vibrant uppercase tracking-widest block">
              Part 04 • Live Demonstration
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
              ONE SCAN. A WORLD OF INFORMATION.
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted font-medium">
              Point your camera at any packaged food barcode. The intelligence unlocks immediately.
            </p>
          </div>

          {/* Animated Barcode Scanner Canvas */}
          <div className="relative w-full max-w-2xl flex items-center justify-center">
            
            {/* Background Barcode Being Scanned */}
            <motion.div 
              style={{ opacity: barcodeOpacity }}
              className="w-72 sm:w-96 p-6 rounded-3xl bg-white border-2 border-[#EFE4EB] shadow-soft relative overflow-hidden"
            >
              {/* Pink Laser Sweep Line */}
              <motion.div 
                style={{ top: laserY, opacity: laserOpacity }}
                className="absolute inset-x-0 h-1.5 bg-vibrant shadow-[0_0_16px_#F62477] z-20 pointer-events-none"
              />

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-brand-muted block text-center">RETAIL EAN-13 BARCODE</span>
                <div className="flex items-center justify-between h-20 px-1 opacity-90">
                  {[2, 4, 1, 3, 2, 5, 1, 2, 4, 3, 1, 5, 2, 4, 1, 3, 2, 5, 1, 4, 3, 2, 5].map((w, i) => (
                    <div key={i} className="bg-berry h-full rounded-xs" style={{ width: `${w * 3}px` }} />
                  ))}
                </div>
                <div className="text-center font-mono font-bold text-xs text-berry tracking-widest">
                  8 901234 567890
                </div>
              </div>
            </motion.div>

            {/* Decoded Product Dashboard Overlay that surfaces from the scan */}
            <motion.div
              style={{ opacity: decodedCardOpacity, scale: decodedCardScale }}
              className="absolute inset-0 max-w-lg mx-auto rounded-3xl bg-white border-2 border-berry/20 shadow-soft-lg p-5 sm:p-6 space-y-4 z-30"
            >
              <div className="flex items-center justify-between border-b border-[#EFE4EB] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-berry text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-warm" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-extrabold text-vibrant uppercase block">Product Decoded</span>
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-berry">Wild Berry Ancient Grain Granola</h4>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-bg border border-[#EFE4EB] text-brand-muted">
                  350g
                </span>
              </div>

              {/* Real Nutrition Breakdown demo */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-warm-light border border-warm/80">
                  <span className="block text-[10px] text-brand-muted uppercase">Calories</span>
                  <span className="text-xs sm:text-sm font-heading font-extrabold text-berry">411</span>
                  <span className="block text-[9px] text-brand-muted font-mono">kcal/100g</span>
                </div>
                <div className="p-2 rounded-xl bg-soft-light border border-soft">
                  <span className="block text-[10px] text-brand-muted uppercase">Protein</span>
                  <span className="text-xs sm:text-sm font-heading font-extrabold text-berry">11.2g</span>
                  <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                </div>
                <div className="p-2 rounded-xl bg-brand-bg border border-[#EFE4EB]">
                  <span className="block text-[10px] text-brand-muted uppercase">Sugar</span>
                  <span className="text-xs sm:text-sm font-heading font-extrabold text-berry">8.5g</span>
                  <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                </div>
                <div className="p-2 rounded-xl bg-brand-bg border border-[#EFE4EB]">
                  <span className="block text-[10px] text-brand-muted uppercase">Fat</span>
                  <span className="text-xs sm:text-sm font-heading font-extrabold text-berry">14.2g</span>
                  <span className="block text-[9px] text-brand-muted font-mono">per 100g</span>
                </div>
              </div>

              {/* Ingredient List Preview */}
              <div className="space-y-1 text-xs">
                <span className="font-heading font-bold text-berry block">Verified Ingredients:</span>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  Whole Rolled Oats, Chia Seeds, Dried Blueberries, Date Paste, Cold-Pressed Sunflower Oil, Pink Salt.
                </p>
              </div>

              {/* Allergens & Nova */}
              <div className="pt-2 border-t border-[#EFE4EB] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-vibrant" />
                  <span className="text-[11px] text-brand-muted">May contain traces of Tree Nuts</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-berry bg-soft-light px-2 py-0.5 rounded-full border border-soft">
                  NOVA 2 (Culinary)
                </span>
              </div>
            </motion.div>

          </div>

          <div className="pt-6 text-center">
            <span className="text-[11px] text-brand-muted font-medium bg-white px-3 py-1 rounded-full border border-[#EFE4EB]">
              Illustrative demonstration using real Open Food Facts verified data.
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* SECTION 5 — YOUR FOOD, DECODED. (EDITORIAL VISUAL PANELS)                  */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="vibrant" size="md">
            Comprehensive Clarity
          </Badge>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
            YOUR FOOD, DECODED.
          </h2>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Four specialized intelligence modules designed to make nutritional science accessible for everyone.
          </p>
        </div>

        {/* 4 Large Editorial Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Panel 01: Nutrition Breakdown */}
          <div className="paper-card rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between group hover:border-vibrant/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-vibrant px-2.5 py-1 rounded-full bg-soft-light border border-soft">
                  01
                </span>
                <Flame className="w-5 h-5 text-berry" />
              </div>

              <div>
                <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider block">
                  Know your numbers.
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-0.5">
                  Nutrition Breakdown
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Clear horizontal meters comparing energy, carbohydrates, sugars, saturated fats, protein, fibre, and sodium against standard 100g baselines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-bg border border-[#EFE4EB] space-y-2">
              <div className="flex justify-between text-xs font-semibold text-berry">
                <span>Sugars per 100g</span>
                <span className="font-mono text-vibrant">8.5g (Low)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-[#EFE4EB]">
                <div className="h-full bg-vibrant rounded-full w-[25%]" />
              </div>
            </div>

            <Link
              to="/explore"
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Explore Nutrition Meters</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Panel 02: Ingredient Detective */}
          <div className="paper-card rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between group hover:border-vibrant/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-vibrant px-2.5 py-1 rounded-full bg-soft-light border border-soft">
                  02
                </span>
                <Search className="w-5 h-5 text-berry" />
              </div>

              <div>
                <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider block">
                  Understand every ingredient.
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-0.5">
                  Ingredient Detective
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Click any complicated ingredient or E-number to read verified plain-English culinary explanations. Separate confirmed allergens from factory cross-contamination traces.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-warm-light/60 border border-warm/80 text-xs text-berry space-y-1">
              <span className="font-heading font-bold block text-berry flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-vibrant" />
                E322 • Lecithins
              </span>
              <p className="text-[11px] text-brand-muted">
                Natural plant fat extracted from soybeans or sunflowers to smoothly blend cocoa and fats.
              </p>
            </div>

            <Link
              to="/scan"
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Test Ingredient Explainer</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Panel 03: Conscious Insights */}
          <div className="paper-card rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between group hover:border-vibrant/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-vibrant px-2.5 py-1 rounded-full bg-soft-light border border-soft">
                  03
                </span>
                <Layers className="w-5 h-5 text-berry" />
              </div>

              <div>
                <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider block">
                  Make sense of the label.
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-0.5">
                  Conscious Insights
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Scientifically benchmarked using NOVA classification (Groups 1–4) and European Nutri-Score to assess industrial ultra-processing and whole-food integrity.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="px-3 py-1.5 rounded-xl bg-warm text-berry font-heading font-bold text-xs">
                NOVA 1: Whole Food
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-soft text-berry font-heading font-bold text-xs">
                NOVA 2: Culinary
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-berry text-white font-heading font-bold text-xs">
                NOVA 4: Ultra-Processed
              </span>
            </div>

            <Link
              to="/about"
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Learn About NOVA Groups</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Panel 04: Better Alternatives */}
          <div className="paper-card rounded-3xl p-8 sm:p-10 space-y-6 flex flex-col justify-between group hover:border-vibrant/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-vibrant px-2.5 py-1 rounded-full bg-soft-light border border-soft">
                  04
                </span>
                <Scale className="w-5 h-5 text-berry" />
              </div>

              <div>
                <span className="text-xs font-heading font-bold text-brand-muted uppercase tracking-wider block">
                  Explore other choices.
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry mt-0.5">
                  Better Alternatives
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Discover verified products in the same category that fit specific dietary goals like lower sugar or higher protein — without shaming your cravings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-warm-light/60 border border-warm/80 text-xs text-berry">
              <strong className="font-heading font-bold text-berry">Goal-Driven Neutrality: </strong>
              We do not claim any food is universally healthy. We highlight tradeoffs so you choose what fits your lifestyle.
            </div>

            <Link
              to="/compare"
              className="text-xs font-heading font-bold text-berry hover:text-vibrant flex items-center gap-1.5 transition-colors pt-2"
            >
              <span>Explore Product Comparison</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 6 — THE COMPARISON (SIDE-BY-SIDE REALITY CHECK)                   */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="warm" size="md">
            Side-by-Side Transparency
          </Badge>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight">
            NOT ALL PACKAGED FOODS ARE THE SAME.
          </h2>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Two snacks with nearly identical supermarket packaging can represent completely different nutritional realities.
          </p>

          {/* Interactive Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-[#EFE4EB] shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setActiveCompareSnack('ultra')}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                  activeCompareSnack === 'ultra'
                    ? 'bg-berry text-white shadow-soft'
                    : 'text-brand-muted hover:text-berry'
                }`}
              >
                Commercial Hazelnut Spread
              </button>
              <button
                type="button"
                onClick={() => setActiveCompareSnack('conscious')}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                  activeCompareSnack === 'conscious'
                    ? 'bg-berry text-white shadow-soft'
                    : 'text-brand-muted hover:text-berry'
                }`}
              >
                Artisan Cacao & Nut Butter
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card A: Commercial Spread */}
          <div className={`paper-card rounded-3xl p-6 sm:p-8 space-y-5 transition-all ${
            activeCompareSnack === 'ultra' ? 'border-2 border-vibrant shadow-soft-lg' : 'opacity-85'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-extrabold text-vibrant uppercase tracking-wider">
                Ultra-Processed Benchmark
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-berry text-white font-bold">
                NOVA 4
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80" 
                alt="Commercial Spread" 
                className="w-16 h-16 rounded-2xl object-contain bg-brand-bg p-2 border border-[#EFE4EB]" 
              />
              <div>
                <h4 className="font-heading font-extrabold text-lg text-berry">Commercial Hazelnut Spread</h4>
                <span className="text-xs text-brand-muted">Standard Retail Brand</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#EFE4EB] text-xs">
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Sugars (100g)</span>
                <span className="font-mono font-bold text-vibrant text-sm">56.3 g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Protein (100g)</span>
                <span className="font-mono font-bold text-berry text-sm">6.3 g</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Saturated Fat</span>
                <span className="font-mono font-bold text-berry text-sm">10.6 g</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-muted">Detected Additives</span>
                <span className="font-mono font-bold text-vibrant text-sm">3 Synthetic Compounds</span>
              </div>
            </div>
          </div>

          {/* Card B: Conscious Butter */}
          <div className={`paper-card rounded-3xl p-6 sm:p-8 space-y-5 transition-all ${
            activeCompareSnack === 'conscious' ? 'border-2 border-vibrant shadow-soft-lg' : 'opacity-85'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-extrabold text-berry uppercase tracking-wider">
                Whole-Ingredient Alternative
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-soft text-berry font-bold border border-soft">
                NOVA 2
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" 
                alt="Conscious Nut Butter" 
                className="w-16 h-16 rounded-2xl object-contain bg-brand-bg p-2 border border-[#EFE4EB]" 
              />
              <div>
                <h4 className="font-heading font-extrabold text-lg text-berry">Raw Cacao Hazelnut Butter</h4>
                <span className="text-xs text-brand-muted">75% Stoneground Hazelnuts</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#EFE4EB] text-xs">
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Sugars (100g)</span>
                <span className="font-mono font-bold text-vibrant text-sm">12.0 g (-78%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Protein (100g)</span>
                <span className="font-mono font-bold text-vibrant text-sm">13.5 g (+114%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EFE4EB]/60">
                <span className="text-brand-muted">Saturated Fat</span>
                <span className="font-mono font-bold text-berry text-sm">5.5 g (-48%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-brand-muted">Detected Additives</span>
                <span className="font-mono font-bold text-berry text-sm">0 Chemical Additives</span>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center pt-2">
          <Link
            to="/compare?b1=8901122334455&b2=3017620422003"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-berry text-white font-heading font-bold text-xs sm:text-sm hover:bg-berry-dark shadow-soft transition-all"
          >
            <Scale className="w-4 h-4 text-warm" />
            <span>Open Full Product Comparison Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>


      {/* ========================================================================= */}
      {/* SECTION 7 — THE FINAL MESSAGE (CLOSING HERO & PRIMARY SCAN CONVERSION)    */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-bg to-soft-light/40 border-t border-[#EFE4EB] text-center relative overflow-hidden">
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="w-16 h-16 rounded-3xl bg-berry text-white flex items-center justify-center mx-auto shadow-soft mb-4">
            <ScanLine className="w-8 h-8 text-warm" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-berry tracking-tight leading-tight text-balance">
            THE NEXT TIME YOU EAT, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-berry via-vibrant to-berry">
              MAKE IT A CONSCIOUS CHOICE.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-brand-muted font-body max-w-xl mx-auto">
            Your food. Your choice. Your awareness.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-vibrant hover:bg-vibrant/95 text-white font-heading font-extrabold text-base shadow-[0_6px_28px_rgba(246,36,119,0.4)] hover:shadow-xl active:scale-95 transition-all"
            >
              <ScanLine className="w-5 h-5 text-warm" />
              <span>Scan Your First Product</span>
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-[#EFE4EB] text-berry font-heading font-bold text-base hover:bg-soft-light transition-all shadow-xs"
            >
              <Compass className="w-4 h-4 text-berry" />
              <span>Explore Food Catalog</span>
            </Link>
          </div>

          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-vibrant" />
              <span>100% Free & Open-Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-vibrant" />
              <span>No Account or Sign-up Required</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-vibrant" />
              <span>Powered by Open Food Facts v3</span>
            </span>
          </div>

        </div>

      </section>

    </div>
  );
};
