import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'ghost' | 'outline';
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-interactive font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-200",
    outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
