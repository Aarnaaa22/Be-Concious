import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue,
  AnimatePresence 
} from 'framer-motion';
import { 
  ScanLine, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Zap, 
  Droplet, 
  Wheat, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Scale, 
  Eye, 
  ChevronDown, 
  ArrowUpRight,
  Info,
  Maximize2,
  Atom,
  Clock,
  Compass,
  Package,
  Layers3
} from 'lucide-react';

/* =========================================================================
   CANVAS PARTICLE EXPLOSION ENGINE (The Deconstruction)
   High-performance HTML5 Canvas rendering 160+ active particles:
   faceted sugar crystals, viscous amber oil droplets, diamond salt crystals,
   and chemical additive glow markers.
   ========================================================================= */
const ExplosionCanvas = ({ stage = 'burst' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    // Generate 160 deterministic particles with distinct physical behaviors
    const types = ['sugar', 'salt', 'oil', 'crumb', 'additive'];
    const p = [];
    for (let i = 0; i < 160; i++) {
      const angle = (Math.PI * 2 * i) / 160 + (Math.sin(i * 3.7) * 0.4);
      const speed = 190 + (i % 17) * 38; // Expansion radius
      const type = types[i % types.length];
      const size = type === 'oil' ? 10 + (i % 8) * 3 : (type === 'sugar' ? 7 + (i % 5) * 3 : 5 + (i % 4) * 2);
      const rotSpeed = ((i % 11) - 5) * 0.9;
      p.push({ angle, speed, type, size, rotSpeed, id: i, phase: (i * 0.13) });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const particles = particlesRef.current;

      // Burst multiplier based on interactive stage
      const expansion = stage === 'packaged' ? 0.18 : (stage === 'burst' ? 0.72 : 1.05);

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        // Floating organic drift
        const driftX = Math.cos(time + pt.phase) * 8;
        const driftY = Math.sin(time + pt.phase * 1.2) * 8;
        const dist = pt.speed * expansion * (Math.min(width, height) / 400);
        const px = cx + Math.cos(pt.angle) * dist + driftX;
        const py = cy + Math.sin(pt.angle) * dist + driftY;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(pt.angle + time * pt.rotSpeed);
        ctx.globalAlpha = stage === 'packaged' ? 0.4 : 0.92;

        if (pt.type === 'sugar') {
          // Refracted glowing white/yellow sugar cube
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.shadowColor = '#FFE185';
          ctx.shadowBlur = 12;
          ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
          ctx.strokeStyle = '#FFE185';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
        } else if (pt.type === 'oil') {
          // Golden amber viscous droplet
          const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, pt.size);
          grad.addColorStop(0, '#FFE185');
          grad.addColorStop(0.7, '#F62477');
          grad.addColorStop(1, 'rgba(146, 0, 58, 0.9)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, pt.size, 0, Math.PI * 2);
          ctx.fill();
          // Highlight shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(-pt.size * 0.3, -pt.size * 0.3, pt.size * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (pt.type === 'salt') {
          // Prismatic diamond salt crystal
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFADEE';
          ctx.shadowBlur = 9;
          ctx.beginPath();
          ctx.moveTo(0, -pt.size);
          ctx.lineTo(pt.size, 0);
          ctx.lineTo(0, pt.size);
          ctx.lineTo(-pt.size, 0);
          ctx.closePath();
          ctx.fill();
        } else if (pt.type === 'crumb') {
          // Crisp cocoa / biscuit grain
          ctx.fillStyle = '#FFE185';
          ctx.beginPath();
          ctx.arc(0, 0, pt.size * 0.75, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Chemical additive marker (E-number glow)
          ctx.fillStyle = '#FFADEE';
          ctx.shadowColor = '#F62477';
          ctx.shadowBlur = 14;
          ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10" 
    />
  );
};

export const HomePage = () => {
  const navigate = useNavigate();

  // Global Page Scroll Progress for top bar
  const { scrollYProgress: globalScroll } = useScroll();
  const smoothProgress = useSpring(globalScroll, { stiffness: 90, damping: 28, restDelta: 0.001 });

  // Desktop Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;
    mouseX.set(normX * 24);
    mouseY.set(normY * 24);
  };

  // Section 2: Product Explosion Interactive State
  // Default is 'burst' so the section is immediately spectacular and populated!
  const [explosionStage, setExplosionStage] = useState('burst'); // 'packaged' | 'burst' | 'deconstructed'
  const explosionSectionRef = useRef(null);

  // Section 4 Nutrition Toggle State
  const [nutritionMode, setNutritionMode] = useState('100g'); // '100g' or 'daily'

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#F62477] text-white selection:bg-[#FFE185] selection:text-[#92003A] overflow-x-hidden font-sans"
    >
      {/* =========================================================================
          PERSISTENT KINETIC HUD: Reading Progress & Instant "SKIP INTRO →"
          (Note: All "1/6, 2/6... 6/6" scene indicators removed as requested)
          ========================================================================= */}
      <div className="fixed top-20 inset-x-0 z-40 pointer-events-none">
        {/* Progress Bar */}
        <motion.div 
          style={{ scaleX: smoothProgress, transformOrigin: '0%' }}
          className="h-1 bg-gradient-to-r from-[#FFE185] via-white to-[#FFE185] shadow-[0_0_12px_#FFE185]"
        />

        {/* Clean Skip Intro Bar aligned to right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-end">
          <Link
            to="/scan"
            className="pointer-events-auto group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-[#92003A] font-black text-xs sm:text-sm tracking-wider uppercase hover:bg-[#FFE185] hover:text-[#92003A] hover:scale-105 active:scale-95 transition-all shadow-[0_8px_25px_rgba(0,0,0,0.35)] border border-white/30"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SCENE 01 — THE HERO (Full-Viewport Vibrant Pink #F62477 Spectacular)
          ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-gradient-to-b from-[#F62477] via-[#F62477] to-[#C90050] overflow-hidden">
        
        {/* Ambient 3D Glow Blobs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#FFE185]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-48 w-[32rem] h-[32rem] rounded-full bg-[#92003A]/40 blur-3xl pointer-events-none" />
        
        {/* Subtle Geometric Laser Grid Lines in Background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />

        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#92003A]/40 backdrop-blur-md border border-[#FFE185]/40 text-[#FFE185] font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-[#FFE185]" />
          <span>The Next Generation Food Intelligence Platform</span>
        </motion.div>

        {/* OVERSIZED EDITORIAL HERO TYPOGRAPHY */}
        <div className="w-full max-w-7xl mx-auto my-auto text-center relative z-20 flex flex-col items-center">
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black text-[13vw] sm:text-[11.5vw] md:text-[10vw] leading-[0.84] tracking-tighter uppercase text-white drop-shadow-[0_20px_50px_rgba(146,0,58,0.6)] select-none"
          >
            <span className="block text-white hover:text-[#FFE185] transition-colors duration-300">
              YOU EAT IT.
            </span>
            <span className="block text-[#FFE185] drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
              BUT DO YOU
            </span>
            <span className="block text-white hover:text-[#FFADEE] transition-colors duration-300">
              KNOW IT?
            </span>
          </motion.h1>

          {/* Subheading with editorial weight */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-2xl text-base sm:text-xl md:text-2xl font-bold text-white/95 leading-relaxed tracking-tight"
          >
            Behind the glossy packaging lies an engineered universe of sugar spikes, emulsifier blends, and artificial preservation. <span className="text-[#FFE185]">Unwrap the facts before you chew.</span>
          </motion.p>

          {/* Primary Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Link
              to="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#92003A] text-white font-black text-base sm:text-lg uppercase tracking-wider hover:bg-white hover:text-[#92003A] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(146,0,58,0.5)] border-2 border-[#FFE185]"
            >
              <ScanLine className="w-5 h-5 text-[#FFE185]" />
              <span>Start Live Barcode Scan</span>
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black text-base uppercase tracking-wider border border-white/30 hover:border-white transition-all"
            >
              <Search className="w-5 h-5 text-[#FFE185]" />
              <span>Browse 3M+ Database</span>
            </Link>
          </motion.div>
        </div>

        {/* 3D FLOATING PARTICLES & FOOD PRODUCTS (Layered Parallax) */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        >
          {/* Floating Snack Pack Left */}
          <motion.div 
            animate={{ y: [0, -22, 0], rotateZ: [-6, 2, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 sm:left-6 top-1/4 w-36 sm:w-56 p-4 rounded-3xl bg-gradient-to-br from-[#92003A] to-[#4A001D] border-2 border-[#FFE185]/50 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transform -rotate-12 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start text-[10px] font-black text-[#FFE185] uppercase tracking-widest">
              <span>ULTRA SNACK</span>
              <span>NOVA 4</span>
            </div>
            <div className="my-4 h-20 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#F62477] to-[#FFE185] flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-inner">
              CRISP
            </div>
            <div className="flex items-center justify-between text-[11px] font-extrabold text-white">
              <span>58g SUGAR</span>
              <span className="text-[#FFE185]">NUTRI-SCORE E</span>
            </div>
          </motion.div>

          {/* Floating Energy Can Right */}
          <motion.div 
            animate={{ y: [0, 24, 0], rotateZ: [8, -4, 8] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -right-8 sm:right-10 top-1/3 w-32 sm:w-48 p-4 rounded-3xl bg-gradient-to-bl from-[#FFE185] via-white to-[#FFADEE] text-[#92003A] border-2 border-white shadow-[0_25px_60px_rgba(0,0,0,0.4)] transform rotate-12"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-[#F62477]">
              SPARK SODA
            </div>
            <div className="my-3 h-16 sm:h-24 rounded-2xl bg-[#92003A] text-white flex flex-col items-center justify-center font-black">
              <Zap className="w-6 h-6 text-[#FFE185] animate-bounce" />
              <span className="text-sm sm:text-base">ENERGY</span>
            </div>
            <div className="text-[10px] font-black text-[#92003A] text-center">
              12 CUBES EQUIVALENT
            </div>
          </motion.div>

          {/* Floating Giant Sugar Crystal */}
          <motion.div 
            animate={{ rotateY: [0, 360], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="hidden lg:block absolute left-1/4 bottom-24 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.6)] transform rotate-45"
          >
            <div className="w-full h-full flex items-center justify-center text-[#FFE185] font-black text-xs uppercase text-center transform -rotate-45">
              SUGAR<br />CUBE
            </div>
          </motion.div>

          {/* Floating Barcode Tag Right Bottom */}
          <motion.div 
            animate={{ y: [0, -18, 0], rotateZ: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="hidden sm:block absolute right-1/4 bottom-20 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-[#FFE185]/60 text-white shadow-2xl"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFE185]">
              <ScanLine className="w-4 h-4 text-[#F62477]" />
              <span>8901030829141</span>
            </div>
            <div className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-0.5">
              EAN-13 VERIFIED
            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM SCROLL INDICATOR */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 flex flex-col items-center gap-2 text-[#FFE185] font-black text-xs sm:text-sm tracking-widest uppercase cursor-pointer"
          onClick={() => {
            explosionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>SCROLL TO UNCOVER THE TRUTH</span>
          <ChevronDown className="w-6 h-6 text-[#FFE185] animate-bounce" />
        </motion.div>
      </section>

      {/* =========================================================================
          SCENE 02 — THE PRODUCT EXPLOSION (Fully Populated Cinematic Stage)
          ========================================================================= */}
      <section 
        ref={explosionSectionRef}
        className="relative w-full min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#C90050] via-[#92003A] to-[#4A001D] overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Dynamic Background Noise & Laser Beams */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />

        {/* Canvas Radial Particle Explosion (renders 160+ sugar, oil, salt particles) */}
        <ExplosionCanvas stage={explosionStage} />

        {/* Section Heading & Subtitle */}
        <div className="relative text-center z-30 max-w-4xl mx-auto mb-10 px-4">
          <span className="text-[#FFE185] font-black text-xs sm:text-sm tracking-widest uppercase block mb-3">
            THE DECONSTRUCTION
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-7xl md:text-8xl uppercase text-white tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] leading-none">
            LET'S UNWRAP THE TRUTH.
          </h2>
          <p className="mt-4 text-base sm:text-xl font-bold text-white/90 max-w-2xl mx-auto">
            Peel back the glossy marketing wrapper to expose the ultra-processed industrial components engineered inside.
          </p>

          {/* Interactive Stage Scrub Controls */}
          <div className="mt-6 inline-flex items-center gap-2 p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setExplosionStage('packaged')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all ${
                explosionStage === 'packaged'
                  ? 'bg-[#FFE185] text-[#92003A] shadow-lg scale-105'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Packaged</span>
            </button>
            <button
              onClick={() => setExplosionStage('burst')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all ${
                explosionStage === 'burst'
                  ? 'bg-[#F62477] text-white shadow-lg scale-105'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE185]" />
              <span>Active Burst</span>
            </button>
            <button
              onClick={() => setExplosionStage('deconstructed')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all ${
                explosionStage === 'deconstructed'
                  ? 'bg-white text-[#92003A] shadow-lg scale-105'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Layers3 className="w-3.5 h-3.5 text-[#92003A]" />
              <span>Full Anatomy</span>
            </button>
          </div>
        </div>

        {/* 3D PRODUCT PACKAGING CONTAINER (Splits Open In Center) */}
        <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center my-6 z-20">
          
          <div className="relative w-72 sm:w-88 h-[24rem] sm:h-[28rem] flex items-center justify-center perspective-[1200px]">
            
            {/* Left Wrapper Flap */}
            <motion.div 
              animate={{ 
                x: explosionStage === 'packaged' ? 0 : (explosionStage === 'burst' ? -110 : -160),
                rotateY: explosionStage === 'packaged' ? 0 : (explosionStage === 'burst' ? -35 : -55),
                rotateZ: explosionStage === 'packaged' ? 0 : -6
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              className="absolute left-0 w-1/2 h-full rounded-l-3xl bg-gradient-to-r from-[#92003A] to-[#F62477] border-y-4 border-l-4 border-[#FFE185] shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col justify-between p-6 overflow-hidden origin-right z-20 cursor-pointer"
              onClick={() => setExplosionStage(explosionStage === 'packaged' ? 'burst' : 'packaged')}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30 pointer-events-none" />
              <div className="text-[11px] font-black text-[#FFE185] tracking-widest uppercase">
                HYPER-SNACK
              </div>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tighter leading-none">
                CHRONIC<br />CRUNCH
              </div>
              <div className="font-mono text-[10px] text-white/70">
                LOT: 8901030
              </div>
            </motion.div>

            {/* Right Wrapper Flap */}
            <motion.div 
              animate={{ 
                x: explosionStage === 'packaged' ? 0 : (explosionStage === 'burst' ? 110 : 160),
                rotateY: explosionStage === 'packaged' ? 0 : (explosionStage === 'burst' ? 35 : 55),
                rotateZ: explosionStage === 'packaged' ? 0 : 6
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              className="absolute right-0 w-1/2 h-full rounded-r-3xl bg-gradient-to-l from-[#92003A] to-[#F62477] border-y-4 border-r-4 border-[#FFE185] shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col justify-between p-6 items-end overflow-hidden origin-left z-20 cursor-pointer"
              onClick={() => setExplosionStage(explosionStage === 'packaged' ? 'burst' : 'packaged')}
            >
              <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-black/30 pointer-events-none" />
              <div className="px-2 py-1 rounded-md bg-[#FFE185] text-[#92003A] text-[10px] font-black uppercase">
                NOVA 4
              </div>
              <div className="w-12 h-12 rounded-full bg-white text-[#92003A] flex items-center justify-center font-black text-xl shadow-lg">
                E
              </div>
              <div className="font-mono text-[10px] text-white/70">
                100G NET WT
              </div>
            </motion.div>

            {/* Center Exposed Product Core (The ultra-processed interior) */}
            <motion.div 
              animate={{ 
                scale: explosionStage === 'packaged' ? 0.9 : 1.05,
                opacity: explosionStage === 'packaged' ? 0.2 : 1
              }}
              transition={{ duration: 0.5 }}
              className="w-48 sm:w-56 h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#3D1A00] to-[#120500] border-2 border-[#FFE185]/60 shadow-[0_0_50px_rgba(255,225,133,0.3)] flex flex-col items-center justify-center p-4 text-center z-10"
            >
              <Flame className="w-14 h-14 text-[#FFE185] animate-pulse mb-2" />
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#FFE185] uppercase">
                540 KCAL
              </span>
              <span className="text-xs font-bold text-white/90 mt-1">
                Refined Sugar & Fat Matrix
              </span>
              <span className="text-[10px] font-mono text-[#FFADEE] mt-2 bg-black/50 px-2 py-1 rounded">
                E322 • E471 • E150d
              </span>
            </motion.div>
          </div>
        </div>

        {/* 6 RADIAL INGREDIENT EXPLOSION CALLOUT CARDS (Always Rich & Visible) */}
        <div className="relative w-full max-w-7xl mx-auto z-30 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Refined Sugar */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-[#FFE185] text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#FFE185] uppercase">
                <span>58% REFINED SUGAR</span>
                <Flame className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-2xl text-white mt-2">
                14 Sugar Cubes
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Stripped of natural fibre. Rapidly spikes blood glucose, forcing excessive insulin release followed by acute fatigue.
              </p>
            </motion.div>

            {/* Card 2: Palm Oil */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-[#FFADEE] text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#FFADEE] uppercase">
                <span>HYDROGENATED PALM OIL</span>
                <Droplet className="w-5 h-5 text-[#FFADEE]" />
              </div>
              <div className="font-heading font-black text-2xl text-white mt-2">
                32% Saturated Lipids
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Chemically stabilized for a 2-year shelf life. Resists oxidation and creates an artificial melt-in-mouth mouthfeel.
              </p>
            </motion.div>

            {/* Card 3: Maltodextrin */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-white/30 text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#FFE185] transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#FFE185] uppercase">
                <span>MALTODEXTRIN BULK</span>
                <Wheat className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-2xl text-white mt-2">
                GI Index 110
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Hydrolyzed corn starch with a glycemic index higher than pure table sugar. Used as inexpensive volume padding.
              </p>
            </motion.div>

            {/* Card 4: Emulsifiers */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-[#FFADEE] text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#FFADEE] uppercase">
                <span>SYNTHETIC EMULSIFIERS</span>
                <Atom className="w-5 h-5 text-[#FFADEE]" />
              </div>
              <div className="font-heading font-black text-2xl text-white mt-2">
                E322 & E471 Matrix
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Engineered to bind oil and water together into an inseparable paste that bypasses normal gastrointestinal fullness cues.
              </p>
            </motion.div>

            {/* Card 5: Sodium Metabisulfite */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-[#FFE185] text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-[#FFE185] uppercase">
                <span>PRESERVATIVE E223</span>
                <ShieldAlert className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-2xl text-white mt-2">
                Sodium Metabisulfite
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Industrial antioxidant bleaching agent applied during manufacturing to prevent discoloration on store shelves.
              </p>
            </motion.div>

            {/* Card 6: Bliss Point */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-[#F62477] text-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-white transition-all"
            >
              <div className="flex items-center justify-between text-xs font-black text-white uppercase">
                <span className="px-2 py-0.5 rounded bg-[#F62477] text-white">ENGINEERED CRAVING</span>
                <Zap className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-2xl text-[#FFE185] mt-2">
                Laboratory Bliss Point
              </div>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                Synthetic vanillin and sodium precisely calibrated to activate hedonic hunger circuits and keep hands reaching into the bag.
              </p>
            </motion.div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          SCENE 03 — INGREDIENT REVEAL (Massive Kinetic Editorial Showcase)
          ========================================================================= */}
      <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#4A001D] via-[#92003A] to-[#92003A] overflow-hidden">
        
        {/* Glow Halos */}
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-[#F62477]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-[#FFE185]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="text-[#FFE185] font-black text-xs sm:text-sm tracking-widest uppercase block mb-3">
              EDITORIAL SPOTLIGHT
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-7xl md:text-8xl uppercase text-white tracking-tight leading-none drop-shadow-xl">
              EVERY INGREDIENT HAS A STORY.
            </h2>
            <p className="mt-6 text-base sm:text-xl font-bold text-white/85 max-w-2xl mx-auto">
              Food labels aren't written for human beings; they are written for regulatory compliance. Here is what they actually mean.
            </p>
          </div>

          {/* 4 Full-Bleed Kinetic Ingredient Showcase Panels */}
          <div className="space-y-16">
            
            {/* 01: SUGAR */}
            <div className="relative rounded-3xl bg-gradient-to-r from-black/60 to-[#92003A]/80 border-2 border-[#FFE185] p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <span className="px-3.5 py-1 rounded-full bg-[#FFE185] text-[#92003A] font-black text-xs uppercase tracking-wider">
                    THE SWEET TRAP
                  </span>
                  <div className="font-heading font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase mt-4">
                    58 GRAMS
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFE185] mt-2">
                    Refined Sugars & Concentrated Syrups
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                    More than half the entire weight of commercial confectionery is pure sugar. It bypasses normal digestion, triggers an immediate dopamine surge in your brain, and stresses pancreatic insulin production.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FFE185] text-[#92003A] text-center shadow-2xl">
                  <Flame className="w-16 h-16 text-[#F62477] mb-2 animate-bounce" />
                  <span className="font-heading font-black text-4xl sm:text-5xl">14 CUBES</span>
                  <span className="font-bold text-xs uppercase tracking-wider mt-1">In a Single 100g Serving</span>
                </div>
              </div>
            </div>

            {/* 02: PALM OIL & LIPIDS */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#92003A]/80 to-black/60 border-2 border-[#FFADEE] p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <span className="px-3.5 py-1 rounded-full bg-[#FFADEE] text-[#92003A] font-black text-xs uppercase tracking-wider">
                    THE TEXTURE MASK
                  </span>
                  <div className="font-heading font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase mt-4">
                    32% LIPIDS
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFADEE] mt-2">
                    Fractionated & Hydrogenated Oils
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                    Industrial manufacturers replace traditional cocoa butter or dairy fats with chemically fractionated palm oil to guarantee a 24-month warehouse shelf life without rancidity.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FFADEE] text-[#92003A] text-center shadow-2xl">
                  <Droplet className="w-16 h-16 text-[#92003A] mb-2" />
                  <span className="font-heading font-black text-4xl sm:text-5xl">18g SAT</span>
                  <span className="font-bold text-xs uppercase tracking-wider mt-1">90% of Daily Reference Value</span>
                </div>
              </div>
            </div>

            {/* 03: EMULSIFIERS & ADDITIVES */}
            <div className="relative rounded-3xl bg-gradient-to-r from-black/60 to-[#92003A]/80 border-2 border-[#FFE185] p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <span className="px-3.5 py-1 rounded-full bg-[#FFE185] text-[#92003A] font-black text-xs uppercase tracking-wider">
                    THE BLISS ENGINE
                  </span>
                  <div className="font-heading font-black text-5xl sm:text-7xl md:text-8xl text-white tracking-tighter uppercase mt-4">
                    E322 • E471
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFE185] mt-2">
                    Engineered Emulsifiers & Flavour Stabilizers
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                    Emulsifiers prevent fat and sugar from separating, creating an unnaturally smooth mouthfeel. Emerging microbiome research links heavy consumption to disrupted intestinal mucosal barriers.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-[#92003A] text-center shadow-2xl">
                  <Atom className="w-16 h-16 text-[#F62477] mb-2 animate-spin" />
                  <span className="font-heading font-black text-4xl sm:text-5xl">NOVA 4</span>
                  <span className="font-bold text-xs uppercase tracking-wider mt-1">Ultra-Processed Food Class</span>
                </div>
              </div>
            </div>

            {/* 04: HIDDEN SODIUM */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#92003A]/80 to-black/60 border-2 border-[#FFE185] p-8 sm:p-14 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <span className="px-3.5 py-1 rounded-full bg-[#FFE185] text-[#92003A] font-black text-xs uppercase tracking-wider">
                    THE STEALTH SHIELD
                  </span>
                  <div className="font-heading font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase mt-4">
                    780 MG
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#FFE185] mt-2">
                    Concealed Sodium in Sweet Formulations
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                    Sodium isn't just in salted crisps. Industrial formulators load huge doses of salt into sweet treats to blunt chemical bitterness, stimulate salivation, and trigger subconscious overeating.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FFE185] text-[#92003A] text-center shadow-2xl">
                  <ShieldAlert className="w-16 h-16 text-[#92003A] mb-2" />
                  <span className="font-heading font-black text-4xl sm:text-5xl">34% RDA</span>
                  <span className="font-bold text-xs uppercase tracking-wider mt-1">Hidden in "Sweet" Desserts</span>
                </div>
              </div>
            </div>

          </div>

          {/* Educational Disclaimer Callout */}
          <div className="mt-14 p-6 rounded-2xl bg-black/40 border border-white/20 text-center text-xs sm:text-sm font-medium text-white/70 max-w-3xl mx-auto">
            * All figures represent typical laboratory demonstration profiles of commercial ultra-processed snack foods for educational illustration. Specific product values depend on authentic product barcodes.
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 04 — NUTRITION DECODE (Massive Interactive Macro Visualization)
          ========================================================================= */}
      <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#92003A] overflow-hidden">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] rounded-full bg-[#F62477]/25 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[#FFE185] font-black text-xs sm:text-sm tracking-widest uppercase block mb-3">
                NUTRITION DECODE
              </span>
              <h2 className="font-heading font-black text-5xl sm:text-7xl md:text-8xl uppercase text-white tracking-tight leading-none">
                WHAT'S REALLY INSIDE?
              </h2>
            </div>

            {/* Interactive Toggle: Per 100g vs Daily Reference % */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/20">
              <button
                onClick={() => setNutritionMode('100g')}
                className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all ${
                  nutritionMode === '100g'
                    ? 'bg-[#FFE185] text-[#92003A] shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Per 100g Standard
              </button>
              <button
                onClick={() => setNutritionMode('daily')}
                className={`px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all ${
                  nutritionMode === 'daily'
                    ? 'bg-[#FFE185] text-[#92003A] shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                % Daily Reference
              </button>
            </div>
          </div>

          {/* 6 Striking Oversized Macro Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Calories Card */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-[#FFE185] transition-all group">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#FFE185]">
                <span>ENERGY PAYLOAD</span>
                <Flame className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-white tracking-tighter mt-4">
                {nutritionMode === '100g' ? '540' : '27%'}
                <span className="text-2xl text-[#FFE185] ml-2 font-bold">{nutritionMode === '100g' ? 'KCAL' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-[#FFE185] rounded-full w-[65%]" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/80">
                Dense caloric load concentrated primarily in simple sugars and saturated fats.
              </p>
            </div>

            {/* Sugar Card (HIGH ALERT) */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#F62477]/40 to-black/60 backdrop-blur-md border-2 border-[#F62477] shadow-[0_10px_35px_rgba(246,36,119,0.3)]">
              <div className="flex items-center justify-between text-xs font-black uppercase text-white">
                <span className="px-2 py-0.5 rounded bg-[#F62477] text-white">HIGH ALERT</span>
                <Sparkles className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-[#FFE185] tracking-tighter mt-4">
                {nutritionMode === '100g' ? '58.5' : '117%'}
                <span className="text-2xl text-white ml-2 font-bold">{nutritionMode === '100g' ? 'g' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-[#F62477] rounded-full w-full animate-pulse" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/90">
                Exceeds the WHO recommended daily added sugar ceiling in a single pocket snack.
              </p>
            </div>

            {/* Total Fat Card */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-[#FFADEE] transition-all">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#FFADEE]">
                <span>TOTAL LIPIDS</span>
                <Droplet className="w-5 h-5 text-[#FFADEE]" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-white tracking-tighter mt-4">
                {nutritionMode === '100g' ? '31.2' : '45%'}
                <span className="text-2xl text-[#FFADEE] ml-2 font-bold">{nutritionMode === '100g' ? 'g' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-[#FFADEE] rounded-full w-[75%]" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/80">
                Includes 17.5g saturated fat fraction derived from industrial palm kernel extracts.
              </p>
            </div>

            {/* Protein Card */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-white transition-all">
              <div className="flex items-center justify-between text-xs font-black uppercase text-white/80">
                <span>PROTEIN PAYLOAD</span>
                <Wheat className="w-5 h-5 text-white/80" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-white tracking-tighter mt-4">
                {nutritionMode === '100g' ? '3.4' : '7%'}
                <span className="text-2xl text-white/60 ml-2 font-bold">{nutritionMode === '100g' ? 'g' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white/40 rounded-full w-[15%]" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/80">
                Minimal bioavailable protein payload; primarily filler starch and sweeteners.
              </p>
            </div>

            {/* Dietary Fibre Card */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-white transition-all">
              <div className="flex items-center justify-between text-xs font-black uppercase text-white/80">
                <span>DIETARY FIBRE</span>
                <Layers className="w-5 h-5 text-white/80" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-white tracking-tighter mt-4">
                {nutritionMode === '100g' ? '1.2' : '5%'}
                <span className="text-2xl text-white/60 ml-2 font-bold">{nutritionMode === '100g' ? 'g' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-white/30 rounded-full w-[10%]" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/80">
                Stripped of natural intact cellular grain fibres during high-temperature extrusion.
              </p>
            </div>

            {/* Sodium Card */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-[#FFE185] transition-all">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#FFE185]">
                <span>CONCEALED SODIUM</span>
                <ShieldAlert className="w-5 h-5 text-[#FFE185]" />
              </div>
              <div className="font-heading font-black text-6xl sm:text-7xl text-white tracking-tighter mt-4">
                {nutritionMode === '100g' ? '680' : '34%'}
                <span className="text-2xl text-[#FFE185] ml-2 font-bold">{nutritionMode === '100g' ? 'mg' : 'RDA'}</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-[#FFE185] rounded-full w-[55%]" />
              </div>
              <p className="mt-3 text-xs font-bold text-white/80">
                High hidden salt content used to amplify perceived sweetness and mask preservative notes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 05 — THE BARCODE MOMENT (Cinematic Laser Scanner Showcase)
          ========================================================================= */}
      <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#92003A] via-[#F62477] to-[#92003A] overflow-hidden">
        
        {/* Animated Background Laser Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#FFE185 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-[#FFE185] font-black text-xs sm:text-sm tracking-widest uppercase block mb-3">
              THE BARCODE MOMENT
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-7xl md:text-8xl uppercase text-white tracking-tight leading-none drop-shadow-2xl">
              ONE SCAN. A WHOLE NEW PERSPECTIVE.
            </h2>
            <p className="mt-6 text-base sm:text-xl font-bold text-white/90 max-w-2xl mx-auto">
              Aim your camera at any packaged food in the grocery aisle. In under 200 milliseconds, Be Conscious decodes the full chemical profile.
            </p>
          </div>

          {/* Interactive Cinematic Scanner HUD Display */}
          <div className="relative max-w-5xl mx-auto rounded-3xl bg-black/60 backdrop-blur-2xl border-4 border-white/20 p-6 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden">
            
            {/* Animated Laser Scanning Beam */}
            <motion.div 
              animate={{ y: ['-20%', '520%', '-20%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FFE185] to-transparent shadow-[0_0_25px_#FFE185,0_0_50px_#F62477] z-30 pointer-events-none"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFE185]/30 blur-md mx-auto -mt-5" />
            </motion.div>

            {/* Target Reticle Crosshairs */}
            <div className="absolute top-6 left-6 text-white/40 font-mono text-sm">[ + 00.24 ]</div>
            <div className="absolute top-6 right-6 text-white/40 font-mono text-sm">[ + LIVE ]</div>
            <div className="absolute bottom-6 left-6 text-white/40 font-mono text-sm">[ 8901030829141 ]</div>
            <div className="absolute bottom-6 right-6 text-[#FFE185] font-mono text-sm font-bold">[ LOCKED ]</div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
              
              {/* Left Column: Stylized Barcode Graphic */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-white text-black shadow-2xl relative overflow-hidden group">
                <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-widest uppercase text-black/80 mb-4">
                  <span>EAN-13 BARCODE</span>
                  <span>VERIFIED</span>
                </div>
                
                {/* SVG Barcode Representation */}
                <svg className="w-full h-32" viewBox="0 0 280 100" fill="currentColor">
                  {/* Dense authentic barcode stripes */}
                  {[
                    2,0,2,1,0,3,1,0,2,0,1,3,0,2,1,0,1,2,0,3,1,0,2,1,0,2,0,1,3,1,0,2,1,0,1,
                    3,0,2,1,0,1,2,0,3,1,0,2,1,0,2,0,1,3,1,0,2,1,0,1,2,0,3,1,0,2,1,0,2,0,1
                  ].map((w, idx) => (
                    <rect 
                      key={idx} 
                      x={idx * 3.8 + 8} 
                      y="5" 
                      width={w === 0 ? 1.5 : (w === 1 ? 2.8 : (w === 2 ? 4.2 : 5.8))} 
                      height="80" 
                      className="text-black"
                    />
                  ))}
                </svg>

                <div className="font-mono font-bold text-lg tracking-[0.3em] text-black mt-3">
                  8901 0308 29141
                </div>
              </div>

              {/* Right Column: Holographic HUD Analysis Reveal */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Top Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#FFE185] font-black text-xs uppercase tracking-widest">
                      PRODUCT MATCH CONFIRMED
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                      Hazelnut Cocoa Ultra Crunch
                    </h3>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-[#FFE185] text-[#92003A] font-black text-xs uppercase">
                    100% MATCH
                  </div>
                </div>

                {/* Score & Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center">
                    <span className="text-[10px] font-bold text-white/70 uppercase block">Conscious Score</span>
                    <span className="font-heading font-black text-2xl text-[#FFE185]">38/100</span>
                    <span className="text-[10px] font-bold text-[#F62477] block mt-0.5">ALERT</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center">
                    <span className="text-[10px] font-bold text-white/70 uppercase block">Nutri-Score</span>
                    <span className="font-heading font-black text-2xl text-white">GRADE E</span>
                    <span className="text-[10px] font-bold text-[#FFE185] block mt-0.5">LOWEST</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center">
                    <span className="text-[10px] font-bold text-white/70 uppercase block">NOVA Group</span>
                    <span className="font-heading font-black text-2xl text-white">GROUP 4</span>
                    <span className="text-[10px] font-bold text-[#FFADEE] block mt-0.5">ULTRA</span>
                  </div>
                </div>

                {/* Detected Flags */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F62477]/30 border border-[#F62477] text-white text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-[#FFE185]" />
                    <span>Contains 58.5g Added Sugars per 100g (Severe Glycemic Load)</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold">
                    <Atom className="w-4 h-4 text-[#FFADEE]" />
                    <span>Identified 4 Industrial Additives (E322, E471, E500ii, E503ii)</span>
                  </div>
                </div>

                {/* Action Link to Live Scanner */}
                <div className="pt-2">
                  <Link
                    to="/scan"
                    className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#FFE185] text-[#92003A] font-heading font-black text-sm uppercase tracking-wider hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  >
                    <ScanLine className="w-5 h-5 text-[#92003A]" />
                    <span>LAUNCH LIVE CAMERA SCANNER →</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 06 — FINAL CTA (Overwhelmingly Vibrant Pink #F62477 Climax)
          ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-[#92003A] via-[#F62477] to-[#F62477] overflow-hidden">
        
        {/* Ambient Glow Bursts */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-[#FFE185]/20 blur-3xl pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto my-auto text-center relative z-20 flex flex-col items-center">
          
          <span className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-[#FFE185] font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl mb-8">
            JOIN OVER 100,000+ CONSCIOUS CONSUMERS
          </span>

          <h2 className="font-heading font-black text-[12vw] sm:text-[10vw] md:text-[8.5vw] leading-[0.86] tracking-tighter uppercase text-white drop-shadow-[0_20px_50px_rgba(146,0,58,0.7)] select-none">
            MAKE EVERY BITE COUNT.
          </h2>

          <p className="mt-8 max-w-2xl text-lg sm:text-2xl md:text-3xl font-extrabold text-white/95 leading-relaxed tracking-tight">
            Know what you eat. Understand what goes inside. Choose consciously.
          </p>

          {/* HUGE VISUALLY PROMINENT MAIN BUTTON */}
          <div className="mt-12 flex flex-col items-center">
            <Link
              to="/scan"
              className="group inline-flex items-center justify-center gap-4 py-7 px-12 sm:px-16 rounded-full bg-[#92003A] text-white hover:bg-white hover:text-[#92003A] font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_70px_rgba(146,0,58,0.6)] border-4 border-[#FFE185]"
            >
              <ScanLine className="w-8 h-8 text-[#FFE185] group-hover:text-[#92003A] transition-colors" />
              <span>SCAN YOUR FOOD →</span>
            </Link>

            <span className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-widest mt-4">
              Instant Results • 100% Free • No Account Required
            </span>
          </div>

          {/* Secondary Quick Jump Navigation Pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Scale className="w-4 h-4 text-[#FFE185]" />
              <span>Compare Two Products</span>
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Compass className="w-4 h-4 text-[#FFE185]" />
              <span>Explore Food Catalog</span>
            </Link>

            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Clock className="w-4 h-4 text-[#FFE185]" />
              <span>Your Scan History</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            POLISHED HIGH-FASHION EDITORIAL FOOTER (Full-Bleed Deep Berry #92003A)
            ========================================================================= */}
        <footer className="w-full max-w-7xl mx-auto mt-20 pt-12 border-t border-white/20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
            
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#92003A] border-2 border-[#FFE185] flex items-center justify-center font-black text-xl text-[#FFE185]">
                  BC
                </div>
                <span className="font-heading font-black text-2xl text-white tracking-tight">
                  Be Conscious
                </span>
              </div>
              <p className="text-sm font-medium text-white/80 max-w-md leading-relaxed">
                Empowering every eater with instant nutritional truth, verified allergen warnings, and honest ultra-processing transparency.
              </p>
              <div className="text-xs font-bold text-[#FFE185]">
                Powered by Open Food Facts Global Open Database.
              </div>
            </div>

            {/* Platform Navigation */}
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[#FFE185] mb-4">
                PLATFORM
              </div>
              <ul className="space-y-2 text-sm font-bold text-white/80">
                <li><Link to="/scan" className="hover:text-white transition-colors">Barcode Camera Scanner</Link></li>
                <li><Link to="/compare" className="hover:text-white transition-colors">Side-by-Side Product Comparison</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Global Product Directory</Link></li>
                <li><Link to="/history" className="hover:text-white transition-colors">My Scan Log & Saved Favorites</Link></li>
              </ul>
            </div>

            {/* Mission & Transparency */}
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[#FFE185] mb-4">
                INTELLIGENCE
              </div>
              <ul className="space-y-2 text-sm font-bold text-white/80">
                <li><Link to="/about" className="hover:text-white transition-colors">Transparent Scoring Formula</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">NOVA Processing Guide</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Nutri-Score Explained</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Consumer Independence Policy</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-white/60">
            <span>© {new Date().getFullYear()} Be Conscious. All rights reserved. Zero sponsored recommendations.</span>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link to="/about" className="hover:text-white transition-colors">Privacy & Terms</Link>
              <span>•</span>
              <Link to="/about" className="hover:text-white transition-colors">Scientific References</Link>
            </div>
          </div>
        </footer>

      </section>
    </div>
  );
};

export default HomePage;
