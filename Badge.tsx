
import React from 'react';
import { BadgeTier } from './types';
import { BADGE_STYLES } from './constants';

interface BadgeProps {
  tier: BadgeTier;
}

export const Badge: React.FC<BadgeProps> = ({ tier }) => {
  const style = BADGE_STYLES[tier];
  
  return (
    <span className={`px-3 py-1 text-sm font-bold rounded-full inline-flex items-center gap-1 ${style.bg} ${style.text}`}>
      {style.icon} {style.label}
    </span>
  );
};
