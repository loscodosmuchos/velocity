/**
 * Motion Presets for Velocity Cards
 * Admin-controlled animation effects with automotive speed aesthetic
 */

export type MotionPreset = "none" | "subtle-glow" | "pulse-energy" | "speed-lines" | "tach-sweep" | "turbo-boost" | "neon-drift";

export interface MotionConfig {
  cardId: string;
  preset: MotionPreset;
  enabled: boolean;
  intensity: "subtle" | "moderate" | "aggressive"; // 0.3x, 1x, 1.5x speed
  color?: "auto" | "cyan" | "amber" | "emerald" | "ruby"; // Color accent
  duration?: number; // ms per animation cycle
  clickThrough: "none" | "detail" | "category" | "section";
  targetPath?: string; // Where to navigate on click
}

export interface MotionGlobalSettings {
  enabled: boolean;
  defaultPreset: MotionPreset;
  defaultIntensity: "subtle" | "moderate" | "aggressive";
  allowUserToggle: boolean;
}

/**
 * MOTION PRESETS - Automotive Inspired
 * Each preset includes CSS class, animation duration, and visual description
 */
export const MOTION_PRESETS: Record<MotionPreset, {
  name: string;
  description: string;
  className: string;
  duration: number;
  visualEffect: string;
}> = {
  none: {
    name: "No Motion",
    description: "Static card, no animation",
    className: "",
    duration: 0,
    visualEffect: "None",
  },
  "subtle-glow": {
    name: "Subtle Glow",
    description: "Ambient glow pulse - luxurious & refined",
    className: "animate-velocity-glow",
    duration: 3000,
    visualEffect: "Pulsing outer glow with accent color",
  },
  "pulse-energy": {
    name: "Pulse Energy",
    description: "Energy pulse from center - attention drawing",
    className: "animate-velocity-pulse-energy",
    duration: 2000,
    visualEffect: "Ripple wave emanating from center",
  },
  "speed-lines": {
    name: "Speed Lines",
    description: "Motion lines suggest velocity - dynamic",
    className: "animate-velocity-speed-lines",
    duration: 1500,
    visualEffect: "Animated speed lines across card edge",
  },
  "tach-sweep": {
    name: "Tach Sweep",
    description: "Speedometer needle sweep - precision gauge",
    className: "animate-velocity-tach-sweep",
    duration: 2500,
    visualEffect: "Arc sweep animation (top-right corner)",
  },
  "turbo-boost": {
    name: "Turbo Boost",
    description: "Fast pulsing with intensity spike - urgent",
    className: "animate-velocity-turbo-boost",
    duration: 1200,
    visualEffect: "Quick pulse with intensity bursts",
  },
  "neon-drift": {
    name: "Neon Drift",
    description: "Edge glow shift - cyberpunk aesthetic",
    className: "animate-velocity-neon-drift",
    duration: 3500,
    visualEffect: "Glowing edge travels around perimeter",
  },
};

/**
 * Click-through behaviors
 */
export const CLICK_THROUGH_TARGETS = {
  none: "No navigation",
  detail: "Navigate to detail page",
  category: "Navigate to category/list view",
  section: "Navigate to section overview",
} as const;

/**
 * Intensity levels - affect animation speed
 */
export const INTENSITY_MULTIPLIERS = {
  subtle: 0.7,    // 70% speed
  moderate: 1.0,  // 100% speed (default)
  aggressive: 1.5, // 150% speed (faster, more urgent)
} as const;

/**
 * Color presets for animations
 */
export const MOTION_COLORS = {
  auto: "rgb(6, 182, 212)",      // Cyan (default)
  cyan: "rgb(6, 182, 212)",      // Cyan
  amber: "rgb(245, 158, 11)",    // Amber/Gold
  emerald: "rgb(16, 185, 129)",  // Emerald
  ruby: "rgb(239, 68, 68)",      // Red
} as const;

/**
 * Default configurations by card type/category
 */
export const CARD_TYPE_DEFAULTS: Record<string, Partial<MotionConfig>> = {
  kpi: {
    preset: "subtle-glow",
    intensity: "subtle",
    color: "auto",
    clickThrough: "detail",
  },
  budget: {
    preset: "pulse-energy",
    intensity: "moderate",
    color: "amber",
    clickThrough: "category",
  },
  alert: {
    preset: "turbo-boost",
    intensity: "aggressive",
    color: "ruby",
    clickThrough: "detail",
  },
  contractor: {
    preset: "neon-drift",
    intensity: "moderate",
    color: "cyan",
    clickThrough: "detail",
  },
  sow: {
    preset: "tach-sweep",
    intensity: "moderate",
    color: "emerald",
    clickThrough: "detail",
  },
  po: {
    preset: "speed-lines",
    intensity: "subtle",
    color: "cyan",
    clickThrough: "detail",
  },
};

export const DEFAULT_GLOBAL_SETTINGS: MotionGlobalSettings = {
  enabled: true,
  defaultPreset: "subtle-glow",
  defaultIntensity: "moderate",
  allowUserToggle: true,
};
