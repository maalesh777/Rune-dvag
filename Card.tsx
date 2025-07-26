import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/40 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};