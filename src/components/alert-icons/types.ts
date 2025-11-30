import { LucideIcon } from 'lucide-react';
import { TextureType } from './textures';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success' | 'neutral';
export type AlertCategory = 'budget' | 'compliance' | 'performance' | 'deadline' | 'approval' | 'system' | 'custom';
export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type AlertSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CornerBadgeConfig {
  enabled: boolean;
  icon?: LucideIcon;
  content?: string | number;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  animate?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

export interface IconStyleConfig {
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export interface AlertIconTheme {
  id: string;
  name: string;
  background: string;
  backgroundHover: string;
  border: string;
  text: string;
  glow: string;
}

export interface AlertIconConfig {
  id: string;
  name: string;
  description?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  theme: AlertIconTheme;
  centerIcon: LucideIcon;
  centerIconStyle?: IconStyleConfig;
  centerContent?: string | number;
  texture?: TextureType;
  corners: {
    'top-left'?: CornerBadgeConfig;
    'top-right'?: CornerBadgeConfig;
    'bottom-left'?: CornerBadgeConfig;
    'bottom-right'?: CornerBadgeConfig;
  };
  tooltip: {
    title: string;
    description: string;
    showTimestamp?: boolean;
    actionLabel?: string;
  };
  navigation?: {
    path: string;
    params?: Record<string, string>;
  };
  size?: AlertSize;
  clickable?: boolean;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlertIconRegistryEntry {
  config: AlertIconConfig;
  usageCount: number;
  lastUsed?: string;
  dashboards: string[];
}

export const SEVERITY_THEMES: Record<AlertSeverity, AlertIconTheme> = {
  critical: {
    id: 'critical',
    name: 'Critical',
    background: 'bg-gradient-to-br from-red-500 to-rose-600',
    backgroundHover: 'hover:from-red-600 hover:to-rose-700',
    border: 'border-red-700',
    text: 'text-red-50',
    glow: 'shadow-red-500/50'
  },
  warning: {
    id: 'warning',
    name: 'Warning',
    background: 'bg-gradient-to-br from-amber-500 to-orange-600',
    backgroundHover: 'hover:from-amber-600 hover:to-orange-700',
    border: 'border-amber-700',
    text: 'text-amber-50',
    glow: 'shadow-amber-500/50'
  },
  info: {
    id: 'info',
    name: 'Info',
    background: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    backgroundHover: 'hover:from-blue-600 hover:to-indigo-700',
    border: 'border-blue-700',
    text: 'text-blue-50',
    glow: 'shadow-blue-500/50'
  },
  success: {
    id: 'success',
    name: 'Success',
    background: 'bg-gradient-to-br from-emerald-500 to-green-600',
    backgroundHover: 'hover:from-emerald-600 hover:to-green-700',
    border: 'border-emerald-700',
    text: 'text-emerald-50',
    glow: 'shadow-emerald-500/50'
  },
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    background: 'bg-gradient-to-br from-slate-500 to-gray-600',
    backgroundHover: 'hover:from-slate-600 hover:to-gray-700',
    border: 'border-slate-700',
    text: 'text-slate-50',
    glow: 'shadow-slate-500/50'
  }
};

export const CATEGORY_ICONS: Record<AlertCategory, { label: string; defaultIcon: string }> = {
  budget: { label: 'Budget Alert', defaultIcon: 'DollarSign' },
  compliance: { label: 'Compliance Alert', defaultIcon: 'Shield' },
  performance: { label: 'Performance Alert', defaultIcon: 'TrendingUp' },
  deadline: { label: 'Deadline Alert', defaultIcon: 'Clock' },
  approval: { label: 'Approval Required', defaultIcon: 'CheckCircle' },
  system: { label: 'System Alert', defaultIcon: 'AlertTriangle' },
  custom: { label: 'Custom Alert', defaultIcon: 'Bell' }
};

export const SIZE_CONFIG: Record<AlertSize, { cube: string; icon: string; badge: string; text: string }> = {
  xs: { cube: 'w-10 h-10', icon: 'h-4 w-4', badge: 'h-2.5 w-2.5', text: 'text-[7px]' },
  sm: { cube: 'w-12 h-12', icon: 'h-4.5 w-4.5', badge: 'h-3 w-3', text: 'text-[8px]' },
  md: { cube: 'w-16 h-16', icon: 'h-5 w-5', badge: 'h-3.5 w-3.5', text: 'text-[9px]' },
  lg: { cube: 'w-20 h-20', icon: 'h-6 w-6', badge: 'h-4 w-4', text: 'text-[10px]' },
  xl: { cube: 'w-24 h-24', icon: 'h-7 w-7', badge: 'h-5 w-5', text: 'text-[11px]' }
};
