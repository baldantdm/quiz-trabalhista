import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-950 shadow-xs',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900',
    outline:
      'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  };

  const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm sm:text-base min-h-[42px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
