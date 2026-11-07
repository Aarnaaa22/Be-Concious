import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-vibrant/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm gap-1.5 min-h-[40px]",
    md: "px-6 py-3 text-base gap-2 min-h-[48px]",
    lg: "px-8 py-4 text-lg gap-2.5 min-h-[56px]",
  };

  const variantStyles = {
    // Primary CTA: Vibrant Pink #F62477
    primary: "bg-vibrant text-white hover:bg-vibrant-hover shadow-vibrant-glow hover:shadow-lg",
    // Secondary: Deep Berry #92003A
    secondary: "bg-berry text-white hover:bg-berry-dark shadow-soft hover:shadow-md",
    // Soft Pink #FFADEE decorative & friendly
    soft: "bg-soft text-berry hover:bg-[#F39BDD] shadow-sm",
    // Warm Yellow #FFE185 highlight
    warm: "bg-warm text-brand-text hover:bg-warm-accent shadow-warm-glow",
    // Clean Outline
    outline: "border-2 border-berry/20 text-berry hover:border-berry hover:bg-berry-50",
    // Light Card Button
    light: "bg-white text-brand-text border border-brand-border hover:border-berry/30 hover:bg-soft-light shadow-soft",
    // Ghost
    ghost: "text-berry hover:bg-berry-50 hover:text-berry-dark",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 flex-shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

