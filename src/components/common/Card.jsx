import React from 'react';

export const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  padding = 'default',
  onClick,
  ...props
}) => {
  const base = "rounded-3xl transition-all duration-300 relative overflow-hidden";

  const paddingStyles = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    default: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  const variants = {
    // White background with subtle border and soft shadow
    default: "bg-white border border-brand-border shadow-soft",
    // Elevated white card
    elevated: "bg-white border border-brand-border/60 shadow-soft-md hover:shadow-soft-lg",
    // Secondary card with Soft Pink #FFADEE subtle tone
    soft: "bg-soft-light border border-soft-border/60 text-brand-text shadow-soft",
    // Friendly Warm Yellow highlight card #FFE185
    warm: "bg-warm-light border border-warm/80 text-brand-text shadow-soft",
    // Deep Berry feature card #92003A
    berry: "bg-berry text-white shadow-soft-md",
    // Subtle transparent outline
    outline: "bg-transparent border-2 border-brand-border",
  };

  const hoverClass = hoverable
    ? "hover:-translate-y-1 hover:border-vibrant/30 cursor-pointer"
    : "";

  return (
    <div
      className={`${base} ${variants[variant]} ${paddingStyles[padding]} ${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

