
import { BadgeTier } from './types';

export const COLORS = {
  primary: '#000080', // Navy
  accent: '#FFD700',  // Gold
  secondary: '#808080', // Gray
  light: '#F3F4F6',
  white: '#FFFFFF',
};

export const BADGE_THRESHOLDS: Record<BadgeTier, number> = {
  [BadgeTier.Platinum]: 10,
  [BadgeTier.Gold]: 5,
  [BadgeTier.Silver]: 3,
  [BadgeTier.Bronze]: 1,
  [BadgeTier.None]: 0,
};

export const BADGE_STYLES: Record<BadgeTier, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  [BadgeTier.Platinum]: { bg: 'bg-gray-800', text: 'text-yellow-300', label: 'Platin', icon: '🏆' },
  [BadgeTier.Gold]: { bg: 'bg-yellow-500', text: 'text-white', label: 'Gold', icon: '🥇' },
  [BadgeTier.Silver]: { bg: 'bg-slate-500', text: 'text-white', label: 'Silber', icon: '🥈' },
  [BadgeTier.Bronze]: { bg: 'bg-orange-600', text: 'text-white', label: 'Bronze', icon: '🥉' },
  [BadgeTier.None]: { bg: 'bg-gray-200', text: 'text-gray-600', label: 'Einsteiger', icon: '' },
};
