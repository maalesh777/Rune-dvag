import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-6 py-3 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out transform hover:scale-105';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50',
    secondary: 'bg-slate-100/70 border border-slate-400/50 text-slate-800 hover:bg-white/90 focus:ring-slate-400/50',
    accent: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 font-bold hover:shadow-yellow-400/50 focus:ring-yellow-400/50',
  };

  return (
    <button className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};