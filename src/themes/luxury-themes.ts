/**
 * Luxury Corporate Theme System
 * One-click theme switcher with 8 high-class presets
 * Inspired by: Damascus steel, burl wood, modern dashboards, futuristic innovation
 */

export interface LuxuryTheme {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'luxury' | 'futuristic';
  cssVariables: {
    // Sidebar colors
    sidebarBg: string;
    sidebarBorder: string;
    sidebarText: string;
    sidebarHover: string;
    sidebarActive: string;
    
    // TopNav colors
    topNavBg: string;
    topNavBorder: string;
    
    // Accent colors
    accentPrimary: string;
    accentSecondary: string;
    
    // Background patterns (CSS gradient)
    sidebarPattern?: string;
  };
}

export const LUXURY_THEMES: LuxuryTheme[] = [
  {
    id: 'damascus-steel',
    name: 'Damascus Steel',
    description: 'Intricate metalwork patterns with historic craftsmanship depth',
    category: 'classic',
    cssVariables: {
      sidebarBg: '#1a1f2e',
      sidebarBorder: '#4a5568',
      sidebarText: '#cbd5e0',
      sidebarHover: 'rgba(100, 116, 139, 0.4)',
      sidebarActive: 'rgba(59, 130, 246, 0.3)',
      topNavBg: '#0f172a',
      topNavBorder: '#334155',
      accentPrimary: '#60a5fa',
      accentSecondary: '#94a3b8',
      sidebarPattern: `
        repeating-linear-gradient(45deg, rgba(71, 85, 105, 0.3) 0px, rgba(71, 85, 105, 0.3) 2px, transparent 2px, transparent 10px),
        repeating-linear-gradient(-45deg, rgba(51, 65, 85, 0.4) 0px, rgba(51, 65, 85, 0.4) 2px, transparent 2px, transparent 10px),
        linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 25%, rgba(51,65,85,0.95) 50%, rgba(30,41,59,0.95) 75%, rgba(15,23,42,0.95) 100%)
      `.replace(/\n/g, '').trim()
    }
  },
  {
    id: 'burl-wood',
    name: 'Burl Wood Executive',
    description: 'Fine automobile dashboard luxury with warm wood tones',
    category: 'luxury',
    cssVariables: {
      sidebarBg: '#2d1f1a',
      sidebarBorder: '#6b4e3d',
      sidebarText: '#f5deb3',
      sidebarHover: 'rgba(139, 90, 60, 0.4)',
      sidebarActive: 'rgba(205, 133, 63, 0.3)',
      topNavBg: '#1a110f',
      topNavBorder: '#4a3428',
      accentPrimary: '#cd853f',
      accentSecondary: '#daa520',
      sidebarPattern: `
        radial-gradient(ellipse at 20% 30%, rgba(139, 90, 60, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(160, 82, 45, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(101, 67, 33, 0.10) 0%, transparent 60%),
        linear-gradient(135deg, rgba(45,31,26,0.98) 0%, rgba(52,38,30,0.95) 50%, rgba(45,31,26,0.98) 100%)
      `.replace(/\n/g, '').trim()
    }
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean lines, high contrast, contemporary corporate design',
    category: 'modern',
    cssVariables: {
      sidebarBg: '#18181b',
      sidebarBorder: '#3f3f46',
      sidebarText: '#e4e4e7',
      sidebarHover: 'rgba(82, 82, 91, 0.4)',
      sidebarActive: 'rgba(14, 165, 233, 0.3)',
      topNavBg: '#09090b',
      topNavBorder: '#27272a',
      accentPrimary: '#0ea5e9',
      accentSecondary: '#06b6d4',
      sidebarPattern: 'linear-gradient(180deg, #18181b 0%, #0a0a0c 100%)'
    }
  },
  {
    id: 'futuristic-cyan',
    name: 'Futuristic Innovation',
    description: 'Animated gradients, neon accents, tech-forward aesthetic',
    category: 'futuristic',
    cssVariables: {
      sidebarBg: '#0c1222',
      sidebarBorder: '#1e3a8a',
      sidebarText: '#a5f3fc',
      sidebarHover: 'rgba(6, 182, 212, 0.2)',
      sidebarActive: 'rgba(14, 165, 233, 0.4)',
      topNavBg: '#0a0f1e',
      topNavBorder: '#164e63',
      accentPrimary: '#22d3ee',
      accentSecondary: '#60a5fa',
      sidebarPattern: `
        linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, transparent 50%, rgba(14, 165, 233, 0.05) 100%),
        linear-gradient(180deg, #0c1222 0%, #0a0f1e 50%, #0c1222 100%)
      `.replace(/\n/g, '').trim()
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Premium elegance with gold accents and deep blacks',
    category: 'luxury',
    cssVariables: {
      sidebarBg: '#1c1410',
      sidebarBorder: '#78716c',
      sidebarText: '#fef3c7',
      sidebarHover: 'rgba(161, 98, 7, 0.3)',
      sidebarActive: 'rgba(217, 119, 6, 0.4)',
      topNavBg: '#0a0806',
      topNavBorder: '#44403c',
      accentPrimary: '#fbbf24',
      accentSecondary: '#f59e0b',
      sidebarPattern: `
        radial-gradient(circle at 30% 40%, rgba(217, 119, 6, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 70% 60%, rgba(161, 98, 7, 0.06) 0%, transparent 50%),
        linear-gradient(135deg, #1c1410 0%, #292522 50%, #1c1410 100%)
      `.replace(/\n/g, '').trim()
    }
  },
  {
    id: 'executive-navy',
    name: 'Executive Navy',
    description: 'Established corporate integrity with deep navy tones',
    category: 'classic',
    cssVariables: {
      sidebarBg: '#0f1729',
      sidebarBorder: '#1e3a8a',
      sidebarText: '#dbeafe',
      sidebarHover: 'rgba(30, 64, 175, 0.4)',
      sidebarActive: 'rgba(37, 99, 235, 0.4)',
      topNavBg: '#0a0f1c',
      topNavBorder: '#1e293b',
      accentPrimary: '#3b82f6',
      accentSecondary: '#60a5fa',
      sidebarPattern: 'linear-gradient(135deg, #0f1729 0%, #1e293b 50%, #0f1729 100%)'
    }
  },
  {
    id: 'professional-slate',
    name: 'Professional Slate',
    description: 'Neutral, versatile, modern professional workspace',
    category: 'modern',
    cssVariables: {
      sidebarBg: '#1e293b',
      sidebarBorder: '#475569',
      sidebarText: '#e2e8f0',
      sidebarHover: 'rgba(71, 85, 105, 0.5)',
      sidebarActive: 'rgba(100, 116, 139, 0.5)',
      topNavBg: '#0f172a',
      topNavBorder: '#334155',
      accentPrimary: '#64748b',
      accentSecondary: '#94a3b8',
      sidebarPattern: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
    }
  },
  {
    id: 'innovation-purple',
    name: 'Innovation Purple',
    description: 'Creative, modern, forward-thinking design aesthetic',
    category: 'futuristic',
    cssVariables: {
      sidebarBg: '#1e1b29',
      sidebarBorder: '#6366f1',
      sidebarText: '#e9d5ff',
      sidebarHover: 'rgba(139, 92, 246, 0.3)',
      sidebarActive: 'rgba(167, 139, 250, 0.4)',
      topNavBg: '#0f0d17',
      topNavBorder: '#4c1d95',
      accentPrimary: '#a78bfa',
      accentSecondary: '#c4b5fd',
      sidebarPattern: `
        radial-gradient(ellipse at 40% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
        linear-gradient(135deg, #1e1b29 0%, #27233a 50%, #1e1b29 100%)
      `.replace(/\n/g, '').trim()
    }
  }
];

// Default theme (Damascus Steel)
export const DEFAULT_THEME = LUXURY_THEMES[0];

// Get theme by ID
export function getThemeById(id: string): LuxuryTheme | undefined {
  return LUXURY_THEMES.find(theme => theme.id === id);
}

// Apply theme to document
export function applyTheme(theme: LuxuryTheme) {
  const root = document.documentElement;
  const vars = theme.cssVariables;
  
  root.style.setProperty('--sidebar-bg', vars.sidebarBg);
  root.style.setProperty('--sidebar-border', vars.sidebarBorder);
  root.style.setProperty('--sidebar-text', vars.sidebarText);
  root.style.setProperty('--sidebar-hover', vars.sidebarHover);
  root.style.setProperty('--sidebar-active', vars.sidebarActive);
  root.style.setProperty('--topnav-bg', vars.topNavBg);
  root.style.setProperty('--topnav-border', vars.topNavBorder);
  root.style.setProperty('--accent-primary', vars.accentPrimary);
  root.style.setProperty('--accent-secondary', vars.accentSecondary);
  
  if (vars.sidebarPattern) {
    root.style.setProperty('--sidebar-pattern', vars.sidebarPattern);
  }
  
  // Store in localStorage
  localStorage.setItem('velocity-theme', theme.id);
}

// Load theme from localStorage
export function loadSavedTheme(): LuxuryTheme {
  const savedId = localStorage.getItem('velocity-theme');
  return savedId ? getThemeById(savedId) || DEFAULT_THEME : DEFAULT_THEME;
}
