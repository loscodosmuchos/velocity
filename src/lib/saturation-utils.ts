/**
 * Saturation Adjustment Utilities
 * Dynamic saturation control for UI components
 */

export type SaturationLevel = 'subtle' | 'muted' | 'standard' | 'vibrant';

export const saturationLevels = {
  subtle: 0.3,
  muted: 0.5,
  standard: 0.7,
  vibrant: 1.0,
} as const;

/**
 * Apply saturation filter to an element
 * @param level - Saturation level (0-1, where 1 is 100% saturation)
 */
export const getSaturationFilter = (level: number): string => {
  const clampedLevel = Math.max(0, Math.min(1, level));
  return `saturate(${clampedLevel})`;
};

/**
 * Generate inline style with saturation adjustment
 */
export const withSaturation = (saturation: number) => ({
  filter: getSaturationFilter(saturation),
});

/**
 * Apply saturation to CSS custom properties
 */
export const applySaturationToDom = (saturation: number) => {
  const root = document.documentElement;
  root.style.setProperty('--ui-saturation', String(saturation));
  root.style.filter = getSaturationFilter(saturation);
};

/**
 * Convert saturation level name to numeric value
 */
export const levelToValue = (level: SaturationLevel): number => {
  return saturationLevels[level];
};

/**
 * Interpolate saturation between min and max
 */
export const interpolateSaturation = (value: number, min: number = 0.2, max: number = 1): number => {
  return Math.max(min, Math.min(max, value));
};
