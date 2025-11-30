/**
 * VELOCITY UI THEME CONFIGURATION
 * Master key for all UI variables, colors, and component styling
 * 
 * LESSONS LEARNED (from Architect Reviews):
 * 1. Sorting computed columns requires accessorFn with deterministic tie-breakers
 * 2. Chart fixes need component-level props (fill="transparent") - CSS-only is fragile
 * 3. Authenticity Pillar: All metrics must derive from real database queries, no fake ROI numbers
 * 4. Color saturation should be capped for professional appearance (OKLCH chroma ≤0.12)
 * 5. Always use accessorFn when cell displays computed values different from sort key
 */

export const palette = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  navy: {
    50: '#f0f9ff',
    400: '#0ea5e9',
    500: '#0284c7',
    600: '#0369a1',
    700: '#075985',
  },
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
  },
} as const;

export const semanticColors = {
  positive: {
    default: 'text-emerald-400/70',
    muted: 'text-emerald-400/50',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  warning: {
    default: 'text-amber-400/70',
    muted: 'text-amber-400/50',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  critical: {
    default: 'text-red-400/70',
    muted: 'text-red-400/50',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  info: {
    default: 'text-cyan-400/70',
    muted: 'text-cyan-400/50',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  neutral: {
    default: 'text-slate-400',
    muted: 'text-slate-500',
    bg: 'bg-slate-800/50',
    border: 'border-slate-600/30',
  },
} as const;

export const saturationScale = {
  vibrant: 1.0,
  standard: 0.7,
  muted: 0.5,
  subtle: 0.3,
} as const;

export const typography = {
  pageTitle: 'text-2xl font-bold text-white tracking-tight',
  pageSubtitle: 'text-slate-400 text-sm',
  sectionTitle: 'text-xs font-semibold uppercase tracking-wide text-slate-300',
  cardTitle: 'text-lg font-semibold text-white',
  cardDescription: 'text-sm text-slate-400',
  label: 'text-xs font-medium text-slate-400',
  body: 'text-sm text-slate-300',
  caption: 'text-xs text-slate-500',
} as const;

export const spacing = {
  cardPadding: 'p-4',
  cardGap: 'gap-3',
  sectionGap: 'space-y-4',
  gridGap: 'gap-4',
  listItemPadding: 'py-1.5 px-2',
} as const;

export const componentVariants = {
  card: {
    default: 'bg-slate-900/70 border-slate-600/30',
    elevated: 'bg-slate-800/80 border-slate-600/40 shadow-lg',
    interactive: 'bg-slate-900/70 border-slate-600/30 hover:border-blue-500/30 transition-colors cursor-pointer',
  },
  badge: {
    positive: 'bg-emerald-500/15 text-emerald-400/80 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-400/80 border-amber-500/25',
    critical: 'bg-red-500/15 text-red-400/80 border-red-500/25',
    info: 'bg-blue-500/15 text-blue-400/80 border-blue-500/25',
    neutral: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
  },
  button: {
    primary: 'bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/30',
    secondary: 'bg-slate-700/60 hover:bg-slate-700 text-slate-200 border-slate-600/40',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300',
    danger: 'bg-red-600/80 hover:bg-red-600 text-white border-red-500/30',
  },
  table: {
    header: 'bg-slate-800/60 border-b border-slate-700/50',
    row: 'border-b border-slate-800/50 hover:bg-slate-800/30',
    cell: 'py-2 px-3 text-sm',
  },
} as const;

export const chartTheme = {
  background: 'transparent',
  gridStroke: '#334155',
  gridOpacity: 0.5,
  axisTickColor: '#94a3b8',
  tooltipBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  tooltipBorder: 'rgba(6, 182, 212, 0.3)',
  gradients: {
    positive: { start: '#10b981', end: '#059669' },
    warning: { start: '#fbbf24', end: '#d97706' },
    critical: { start: '#f87171', end: '#dc2626' },
    info: { start: '#06b6d4', end: '#0284c7' },
  },
} as const;

export const statusColors = {
  approved: semanticColors.positive,
  pending: semanticColors.warning,
  rejected: semanticColors.critical,
  draft: semanticColors.neutral,
  active: semanticColors.info,
  completed: semanticColors.positive,
  cancelled: semanticColors.critical,
} as const;

export const pageMetadata = {
  dashboard: { title: 'Executive Command Center', route: '/dashboard' },
  purchaseOrders: { title: 'Purchase Orders', route: '/purchase-orders' },
  contractors: { title: 'Contractors', route: '/contractors' },
  timecards: { title: 'Timecards', route: '/timecards' },
  invoices: { title: 'Invoices', route: '/invoices' },
  expenses: { title: 'Expenses', route: '/expenses' },
  approvals: { title: 'Approvals', route: '/approvals' },
  statementsOfWork: { title: 'Statements of Work', route: '/statement-of-works' },
  changeOrders: { title: 'Change Orders', route: '/change-orders' },
  notifications: { title: 'Notifications', route: '/notifications' },
  aiInsights: { title: 'AI Insights', route: '/ai/insights' },
} as const;

export type SemanticColorKey = keyof typeof semanticColors;
export type BadgeVariant = keyof typeof componentVariants.badge;
export type ButtonVariant = keyof typeof componentVariants.button;
