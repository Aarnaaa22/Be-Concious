import React from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, Info } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  icon: Icon,
  className = '',
  size = 'md'
}) => {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-semibold gap-1",
    md: "px-3 py-1 text-xs font-semibold gap-1.5",
    lg: "px-4 py-1.5 text-sm font-bold gap-2",
  };

  const variants = {
    // Deep Berry
    berry: "bg-berry text-white border border-berry-light",
    berryLight: "bg-berry-50 text-berry border border-berry-200",
    
    // Vibrant Pink
    vibrant: "bg-vibrant text-white shadow-sm",
    vibrantLight: "bg-vibrant-50 text-vibrant border border-vibrant-100",

    // Soft Pink
    soft: "bg-soft text-berry border border-soft-border",
    softLight: "bg-soft-light text-berry border border-soft-border/50",

    // Warm Yellow
    warm: "bg-warm text-brand-text border border-warm-accent font-bold",
    warmLight: "bg-warm-light text-brand-text border border-warm/60",

    // Neutral Card
    outline: "bg-white text-brand-text border border-brand-border",
    default: "bg-brand-bg text-brand-text border border-brand-border",
    
    // Alert / Notice without generic green/red
    notice: "bg-warm-light text-brand-text border border-warm-accent",
    caution: "bg-berry-50 text-berry border border-berry/40",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-heading transition-colors ${sizeStyles[size]} ${variants[variant] || variants.default} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      {children}
    </span>
  );
};

export const NovaBadge = ({ group, showLabel = true }) => {
  const config = {
    1: { label: "NOVA 1: Minimally Processed", desc: "Whole or natural foods", variant: "warm" },
    2: { label: "NOVA 2: Culinary Ingredients", desc: "Oils, butter, sugar, salt", variant: "soft" },
    3: { label: "NOVA 3: Processed Foods", desc: "Simple processing", variant: "berryLight" },
    4: { label: "NOVA 4: Ultra-Processed", desc: "Industrial formulation", variant: "berry" },
  };

  const data = config[group] || { label: `NOVA ${group}`, desc: "Processing index", variant: "default" };

  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant={data.variant} size="md">
        <span className="font-extrabold tracking-wider">GROUP {group}</span>
      </Badge>
      {showLabel && (
        <span className="text-xs font-medium text-brand-muted">
          {data.label.replace(`NOVA ${group}: `, '')}
        </span>
      )}
    </div>
  );
};

export const ConsciousScoreBadge = ({ score, size = "md" }) => {
  // Brand conscious scoring: High (80+), Moderate (60-79), Caution (<60)
  // No generic green/red reliance; we use brand palette with clear icon + numeral
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-heading font-bold border ${
      score >= 80 
        ? "bg-warm-light text-berry border-warm" 
        : score >= 60 
        ? "bg-soft-light text-berry border-soft-border"
        : "bg-berry-50 text-berry border-berry/30"
    } ${size === 'lg' ? 'text-base px-4 py-1.5' : 'text-xs'}`}>
      <Sparkles className="w-3.5 h-3.5 text-vibrant" />
      <span>{score} / 100 Conscious Score</span>
    </div>
  );
};

