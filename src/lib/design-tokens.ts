/**
 * Design Tokens System
 * Professional gradients, shadows, borders, and visual hierarchy
 * Based on template design requirements for clear element separation
 */

export const designTokens = {
  // Card shadows - professional layered look
  shadows: {
    card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    cardHover: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    cardElevated: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    alert: "0 4px 6px rgba(0, 0, 0, 0.07)",
    modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // Gradient backgrounds - professional look
  gradients: {
    primary: "linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)",
    alert: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
    success: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
    warning: "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
    neutral: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    dark: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
  },

  // Border colors - clear visual boundaries
  borders: {
    light: "1px solid #e5e7eb",
    medium: "1px solid #d1d5db",
    dark: "1px solid #9ca3af",
    accent: "1px solid #1e3a8a",
    error: "1px solid #ef4444",
    success: "1px solid #10b981",
  },

  // Border radius - consistent rounded corners
  radius: {
    sm: "0.375rem", // 6px
    md: "0.5rem",   // 8px
    lg: "0.75rem",  // 12px
    xl: "1rem",     // 16px
    "2xl": "1.5rem", // 24px
  },

  // Spacing scale
  spacing: {
    card: "1.5rem",     // 24px internal card padding
    section: "2rem",    // 32px between sections
    container: "3rem",  // 48px container padding
  },

  // Typography scales
  typography: {
    heading1: {
      size: "2.25rem", // 36px
      weight: "700",
      lineHeight: "2.5rem",
    },
    heading2: {
      size: "1.875rem", // 30px
      weight: "600",
      lineHeight: "2.25rem",
    },
    heading3: {
      size: "1.5rem", // 24px
      weight: "600",
      lineHeight: "2rem",
    },
    body: {
      size: "1rem", // 16px
      weight: "400",
      lineHeight: "1.5rem",
    },
    small: {
      size: "0.875rem", // 14px
      weight: "400",
      lineHeight: "1.25rem",
    },
  },

  // Color palette - professional and accessible
  colors: {
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#1e3a8a",
      600: "#1e40af",
      700: "#1d4ed8",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    success: {
      50: "#f0fdf4",
      500: "#10b981",
      600: "#059669",
    },
    error: {
      50: "#fef2f2",
      500: "#ef4444",
      600: "#dc2626",
    },
    warning: {
      50: "#fffbeb",
      500: "#f59e0b",
      600: "#d97706",
    },
  },
};

// CSS-in-JS helper for card styling
export const cardStyles = {
  base: `
    background: white;
    border: ${designTokens.borders.light};
    border-radius: ${designTokens.radius.lg};
    box-shadow: ${designTokens.shadows.card};
    padding: ${designTokens.spacing.card};
    transition: all 0.2s ease-in-out;
  `,
  hover: `
    box-shadow: ${designTokens.shadows.cardHover};
    transform: translateY(-2px);
  `,
  elevated: `
    box-shadow: ${designTokens.shadows.cardElevated};
  `,
};

// Tailwind CSS custom classes to add to config
export const tailwindExtensions = {
  boxShadow: {
    'card': designTokens.shadows.card,
    'card-hover': designTokens.shadows.cardHover,
    'card-elevated': designTokens.shadows.cardElevated,
    'alert': designTokens.shadows.alert,
    'modal': designTokens.shadows.modal,
  },
  backgroundImage: {
    'gradient-primary': designTokens.gradients.primary,
    'gradient-alert': designTokens.gradients.alert,
    'gradient-success': designTokens.gradients.success,
    'gradient-warning': designTokens.gradients.warning,
    'gradient-neutral': designTokens.gradients.neutral,
    'gradient-dark': designTokens.gradients.dark,
  },
};
