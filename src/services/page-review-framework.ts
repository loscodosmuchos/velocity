/**
 * PAGE REVIEW FRAMEWORK
 * =====================
 * 
 * "A systematic process for evaluating every page through agreed-upon lenses"
 * 
 * This framework provides a standardized, repeatable process for reviewing
 * any page in the Velocity platform. It combines multiple evaluation lenses
 * to ensure pages meet the highest standards of design, functionality, and
 * user empowerment.
 * 
 * THE SACRED REVIEW PROCESS:
 * 1. CAPTURE - Take screenshot, identify page purpose
 * 2. ANALYZE - Apply each lens systematically
 * 3. SCORE - Calculate worthiness across all dimensions
 * 4. PRESCRIBE - Generate specific improvement recommendations
 * 5. TRANSFORM - Implement fixes in priority order
 */

import type { PageAnalysis, WorthinessScore, VisualAnalysis } from './daisy-worthiness-validator';

// =============================================================================
// LENS 1: ARCHITECT DESIGN LENS
// =============================================================================
/**
 * THE ARCHITECT'S EYE
 * 
 * Evaluates from a senior engineer/designer perspective:
 * - Is this production-ready?
 * - Would I be proud to show this?
 * - Does it follow best practices?
 * - Is the code/structure maintainable?
 */
export interface ArchitectLensAnalysis {
  // Structure & Organization
  hasLogicalLayout: boolean;           // Grid system, visual hierarchy
  hasConsistentSpacing: boolean;       // Uniform margins/padding
  hasComponentReuse: boolean;          // Uses design system properly
  hasResponsiveDesign: boolean;        // Works at all viewport sizes
  
  // Quality & Polish
  hasNoOrphanedElements: boolean;      // Everything serves a purpose
  hasNoDeadEnds: boolean;              // Every action leads somewhere
  hasErrorHandling: boolean;           // Graceful failure states
  hasLoadingStates: boolean;           // Skeleton/spinner for async
  
  // Maintainability
  hasCleanDataFlow: boolean;           // Props/state well organized
  hasSeparationOfConcerns: boolean;    // Logic/view/data separated
  isTestable: boolean;                 // Can be unit/integration tested
}

export const ARCHITECT_CRITERIA = {
  logicalLayout: {
    name: 'Logical Layout',
    question: 'Does the page follow a clear visual hierarchy?',
    check: 'Most important information at top, actions clearly grouped, logical flow',
    weight: 1.3
  },
  consistentSpacing: {
    name: 'Consistent Spacing',
    question: 'Is spacing uniform and intentional?',
    check: 'No random gaps, consistent margins, breathing room without waste',
    weight: 1.0
  },
  componentReuse: {
    name: 'Component Reuse',
    question: 'Does it use the design system properly?',
    check: 'Uses PremiumKPICard, AlertBanner, etc. - not custom one-offs',
    weight: 1.2
  },
  noDeadEnds: {
    name: 'No Dead Ends',
    question: 'Does every element lead somewhere?',
    check: 'All buttons work, all links navigate, no orphaned UI',
    weight: 1.4
  },
  errorHandling: {
    name: 'Error Handling',
    question: 'Does it fail gracefully?',
    check: 'Empty states, error messages, fallback content',
    weight: 1.1
  }
};

// =============================================================================
// LENS 2: VISUAL DESIGN LENS  
// =============================================================================
/**
 * THE DESIGNER'S EYE
 * 
 * Evaluates pure visual quality:
 * - Balance, contrast, hierarchy
 * - Color meaning and consistency
 * - Icon usage and clarity
 * - Modern/sleek/premium aesthetic
 */
export interface VisualDesignLensAnalysis {
  // Core Visual Principles
  balance: 'excellent' | 'good' | 'poor';         // Visual weight distribution
  contrast: 'excellent' | 'good' | 'poor';        // Text/bg distinguishability
  hierarchy: 'excellent' | 'good' | 'poor';       // Size/weight/color priority
  whitespace: 'excellent' | 'good' | 'poor';      // Breathing room, not cluttered
  
  // Color & Iconography
  colorMeaning: boolean;              // Colors communicate status/meaning
  colorConsistency: boolean;          // Same colors = same meanings
  iconClarity: boolean;               // Icons are obvious, not cryptic
  iconConsistency: boolean;           // Icon style matches throughout
  
  // Premium Aesthetic
  hasGradients: boolean;              // Premium gradient usage
  hasDepth: boolean;                  // Shadows, layers, dimension
  hasTexture: boolean;                // Subtle texture/pattern
  hasMicroInteractions: boolean;      // Hover states, transitions
  
  // Modern/Innovative
  isModern: boolean;                  // Current design trends
  isSleek: boolean;                   // Streamlined, not cluttered
  isInnovative: boolean;              // Unique approach, not generic
}

export const VISUAL_CRITERIA = {
  balance: {
    name: 'Visual Balance',
    question: 'Is the visual weight evenly distributed?',
    excellent: 'Elements feel stable, no lopsided sections',
    good: 'Mostly balanced with minor asymmetry',
    poor: 'Heavy on one side, feels unstable',
    weight: 1.2
  },
  contrast: {
    name: 'Contrast',
    question: 'Is text readable against backgrounds?',
    excellent: 'All text crisp and clear, elements distinguishable',
    good: 'Most text readable, some low-contrast areas',
    poor: 'Hard to read, elements blend together',
    weight: 1.4
  },
  hierarchy: {
    name: 'Visual Hierarchy',
    question: 'Do important things stand out?',
    excellent: 'Clear 3-level hierarchy, eye knows where to go',
    good: 'Primary/secondary clear, tertiary muddy',
    poor: 'Everything same weight, no focal points',
    weight: 1.5
  },
  colorMeaning: {
    name: 'Color Semantics',
    question: 'Do colors communicate meaning?',
    check: 'Green=good, Red=alert, Amber=warning, Blue=info',
    weight: 1.3
  },
  iconClarity: {
    name: 'Icon Clarity',
    question: 'Are icons immediately understood?',
    check: 'No guessing what icons mean, universal symbols used',
    weight: 1.1
  },
  premiumFeel: {
    name: 'Premium Aesthetic',
    question: 'Does it feel like a luxury product?',
    check: 'Gradients, depth, texture, micro-interactions present',
    weight: 1.4
  }
};

// =============================================================================
// LENS 3: ROLE-BASED RELEVANCE LENS
// =============================================================================
/**
 * THE USER'S EYE
 * 
 * What does THIS user need to see FIRST based on their role?
 * The page should immediately show what the user likely most wants to know.
 */
export type UserRole = 
  | 'CPO'           // Chief People Officer - strategic overview
  | 'PM'            // Program Manager - project health, timelines
  | 'HIRING_MGR'    // Hiring Manager - team capacity, hiring pipeline
  | 'FINANCE'       // Finance - budget, spend, invoices
  | 'COMPLIANCE'    // Compliance - policy adherence, risks
  | 'CONTRACTOR'    // Contractor - their own info, timecards
  | 'RECRUITER'     // Recruiter - candidates, requisitions
  | 'ADMIN'         // Admin - system health, configurations
  | 'ANALYST'       // Analyst - data, trends, reports
  | 'EXECUTIVE';    // Executive - high-level metrics, ROI

export interface RoleContext {
  role: UserRole;
  primaryConcerns: string[];
  keyMetrics: string[];
  criticalActions: string[];
  timeHorizon: 'immediate' | 'weekly' | 'monthly' | 'quarterly';
  detailLevel: 'summary' | 'detailed' | 'granular';
}

export const ROLE_CONTEXTS: Record<UserRole, RoleContext> = {
  CPO: {
    role: 'CPO',
    primaryConcerns: ['Total workforce cost', 'Headcount trends', 'Compliance risk', 'Vendor performance'],
    keyMetrics: ['Total spend', 'Contractor count', 'Cost per hire', 'Tenure distribution'],
    criticalActions: ['Approve large POs', 'Review policy exceptions', 'Strategic planning'],
    timeHorizon: 'quarterly',
    detailLevel: 'summary'
  },
  PM: {
    role: 'PM',
    primaryConcerns: ['Project staffing', 'Budget burn rate', 'Timeline adherence', 'Resource gaps'],
    keyMetrics: ['Hours this week', 'Budget remaining', 'Open positions', 'Utilization rate'],
    criticalActions: ['Approve timecards', 'Extend contracts', 'Request resources'],
    timeHorizon: 'weekly',
    detailLevel: 'detailed'
  },
  HIRING_MGR: {
    role: 'HIRING_MGR',
    primaryConcerns: ['Team capacity', 'Open reqs', 'Contractor performance', 'Upcoming ends'],
    keyMetrics: ['Team size', 'Open requisitions', 'Avg performance score', 'Contract end dates'],
    criticalActions: ['Extend contracts', 'Submit requisitions', 'Performance reviews'],
    timeHorizon: 'monthly',
    detailLevel: 'detailed'
  },
  FINANCE: {
    role: 'FINANCE',
    primaryConcerns: ['Invoice accuracy', 'Budget variance', 'Payment status', 'Cost trends'],
    keyMetrics: ['Outstanding invoices', 'Budget vs actual', 'Payment aging', 'Cost trends'],
    criticalActions: ['Approve invoices', 'Adjust budgets', 'Generate reports'],
    timeHorizon: 'monthly',
    detailLevel: 'granular'
  },
  COMPLIANCE: {
    role: 'COMPLIANCE',
    primaryConcerns: ['Policy violations', 'Audit readiness', 'Risk exposure', 'Documentation gaps'],
    keyMetrics: ['Compliance score', 'Outstanding violations', 'Documentation rate', 'Risk items'],
    criticalActions: ['Review violations', 'Update policies', 'Audit preparation'],
    timeHorizon: 'monthly',
    detailLevel: 'granular'
  },
  CONTRACTOR: {
    role: 'CONTRACTOR',
    primaryConcerns: ['My timecards', 'My pay', 'Contract status', 'Upcoming deadlines'],
    keyMetrics: ['Hours this period', 'Pay rate', 'Contract end date', 'PTO balance'],
    criticalActions: ['Submit timecard', 'View payslip', 'Update profile'],
    timeHorizon: 'immediate',
    detailLevel: 'detailed'
  },
  RECRUITER: {
    role: 'RECRUITER',
    primaryConcerns: ['Open requisitions', 'Candidate pipeline', 'Time to fill', 'Offer status'],
    keyMetrics: ['Open reqs', 'Candidates in pipeline', 'Avg days to fill', 'Offer acceptance rate'],
    criticalActions: ['Submit candidates', 'Schedule interviews', 'Extend offers'],
    timeHorizon: 'weekly',
    detailLevel: 'detailed'
  },
  ADMIN: {
    role: 'ADMIN',
    primaryConcerns: ['System health', 'User issues', 'Configuration', 'Integrations'],
    keyMetrics: ['Active users', 'Error rate', 'Integration status', 'Pending approvals'],
    criticalActions: ['Manage users', 'Configure settings', 'Troubleshoot issues'],
    timeHorizon: 'immediate',
    detailLevel: 'granular'
  },
  ANALYST: {
    role: 'ANALYST',
    primaryConcerns: ['Data accuracy', 'Trend analysis', 'Reporting', 'Insights discovery'],
    keyMetrics: ['All metrics accessible', 'Historical trends', 'Variance analysis'],
    criticalActions: ['Generate reports', 'Export data', 'Build dashboards'],
    timeHorizon: 'monthly',
    detailLevel: 'granular'
  },
  EXECUTIVE: {
    role: 'EXECUTIVE',
    primaryConcerns: ['ROI', 'Strategic metrics', 'Risk overview', 'Performance summary'],
    keyMetrics: ['Total cost savings', 'Productivity gains', 'Risk score', 'Key initiatives'],
    criticalActions: ['Review dashboards', 'Approve strategy', 'Board reporting'],
    timeHorizon: 'quarterly',
    detailLevel: 'summary'
  }
};

export interface RoleLensAnalysis {
  targetRole: UserRole;
  meetsRoleNeeds: boolean;
  primaryConcernsAddressed: string[];
  primaryConcernsMissing: string[];
  keyMetricsVisible: string[];
  keyMetricsMissing: string[];
  criticalActionsAvailable: string[];
  criticalActionsMissing: string[];
  informationDensityMatch: boolean;  // Right level of detail for role
  timeHorizonMatch: boolean;         // Shows right timeframe
}

// =============================================================================
// LENS 4: READABILITY & SCANABILITY LENS
// =============================================================================
/**
 * THE READER'S EYE
 * 
 * Can users instantly understand what they're seeing?
 * "3-second rule" - grasp key info in 3 seconds
 */
export interface ReadabilityLensAnalysis {
  // Text Readability
  fontSizeAppropriate: boolean;       // Not too small, not too large
  fontContrastSufficient: boolean;    // WCAG AA contrast minimum
  lineHeightComfortable: boolean;     // Not cramped, not too spread
  textAlignmentLogical: boolean;      // Left-aligned body, centered headers OK
  
  // Information Scanability
  hasVisualAnchors: boolean;          // Headers, dividers, groupings
  hasClearSections: boolean;          // Distinct areas for distinct info
  hasProgressiveDisclosure: boolean;  // Details on demand, not upfront
  hasConsistentPatterns: boolean;     // Similar info formatted similarly
  
  // Label Clarity
  labelsDescriptive: boolean;         // "Total Spend" not "TS"
  labelsConsistent: boolean;          // Same term for same concept
  hasUnits: boolean;                  // "$500K" not "500"
  hasContext: boolean;                // "vs last month" or "of $1M budget"
  
  // The 3-Second Test
  canGraspIn3Seconds: boolean;        // The ultimate test
  primaryMessageClear: boolean;       // What's this page about?
  callToActionObvious: boolean;       // What should I do here?
}

export const READABILITY_CRITERIA = {
  threeSecondRule: {
    name: '3-Second Rule',
    question: 'Can a user grasp the key info in 3 seconds?',
    check: 'Primary message visible, no scrolling needed, clear hierarchy',
    weight: 2.0
  },
  fontClarity: {
    name: 'Font Clarity',
    question: 'Is all text easily readable?',
    check: 'Min 14px body, 12px minimum labels, proper contrast',
    weight: 1.3
  },
  labelDescriptiveness: {
    name: 'Descriptive Labels',
    question: 'Do labels explain what data means?',
    check: 'Full words, units included, context provided',
    weight: 1.4
  },
  sectionClarity: {
    name: 'Clear Sections',
    question: 'Are different areas visually distinct?',
    check: 'Headers, dividers, consistent grouping patterns',
    weight: 1.2
  }
};

// =============================================================================
// LENS 5: INNOVATION & DIFFERENTIATION LENS
// =============================================================================
/**
 * THE INNOVATOR'S EYE
 * 
 * What makes this different from every other admin panel?
 * Where's the "wow" factor?
 */
export interface InnovationLensAnalysis {
  // Unique Features
  hasUniqueCapability: boolean;       // Something no other tool does
  hasSmartDefaults: boolean;          // AI/ML-driven suggestions
  hasProactiveBehavior: boolean;      // Acts before asked
  hasPredictiveFeatures: boolean;     // Shows what will happen
  
  // Wow Moments
  wowMoments: string[];               // List of "wow" features
  delightMoments: string[];           // Subtle pleasures
  timeSaverMoments: string[];         // "That saved me 10 minutes!"
  
  // Competitive Advantage
  differentiatorsFromCompetitors: string[];
  uniqueValueProposition: string;
}

// =============================================================================
// COMBINED PAGE REVIEW
// =============================================================================
export interface ComprehensivePageReview {
  // Page Identity
  path: string;
  title: string;
  purpose: string;
  targetRoles: UserRole[];
  
  // Individual Lens Results
  architectAnalysis: ArchitectLensAnalysis;
  visualAnalysis: VisualDesignLensAnalysis;
  roleAnalysis: RoleLensAnalysis[];
  readabilityAnalysis: ReadabilityLensAnalysis;
  innovationAnalysis: InnovationLensAnalysis;
  daisyAnalysis: PageAnalysis;
  
  // Composite Scores (0-100)
  scores: {
    architect: number;
    visual: number;
    roleRelevance: number;
    readability: number;
    innovation: number;
    daisy: number;
    overall: number;
  };
  
  // Verdict
  verdict: 'LEGENDARY' | 'WORTHY' | 'ACCEPTABLE' | 'MEH' | 'UNWORTHY';
  
  // Prescriptions
  criticalFixes: string[];      // Must fix before deploy
  highPriorityFixes: string[];  // Fix this week
  enhancements: string[];       // Nice to have
  
  // Evidence
  strengths: string[];
  weaknesses: string[];
}

// =============================================================================
// THE REVIEW PROCESS
// =============================================================================
export const PAGE_REVIEW_PROCESS = {
  name: 'Velocity Page Review Framework',
  version: '1.0',
  
  steps: [
    {
      phase: 1,
      name: 'CAPTURE',
      description: 'Gather page state and context',
      actions: [
        'Take screenshot of current page state',
        'Identify page path and title',
        'Document intended purpose',
        'List target user roles'
      ]
    },
    {
      phase: 2,
      name: 'ANALYZE',
      description: 'Apply each lens systematically',
      actions: [
        'Apply Architect Lens - structure, quality, maintainability',
        'Apply Visual Lens - balance, contrast, hierarchy, premium feel',
        'Apply Role Lens - does it serve each target role\'s needs?',
        'Apply Readability Lens - 3-second rule, scanability',
        'Apply Innovation Lens - wow factors, differentiation',
        'Apply DAISY Lens - ten commandments of worthiness'
      ]
    },
    {
      phase: 3,
      name: 'SCORE',
      description: 'Calculate composite worthiness',
      actions: [
        'Score each lens 0-100',
        'Weight by importance',
        'Calculate overall score',
        'Determine verdict'
      ]
    },
    {
      phase: 4,
      name: 'PRESCRIBE',
      description: 'Generate improvement roadmap',
      actions: [
        'Identify critical blockers',
        'Prioritize by impact and effort',
        'Group related fixes',
        'Create actionable tickets'
      ]
    },
    {
      phase: 5,
      name: 'TRANSFORM',
      description: 'Implement improvements',
      actions: [
        'Fix critical issues first',
        'Re-review after changes',
        'Validate with target users',
        'Document patterns for reuse'
      ]
    }
  ],
  
  scoringWeights: {
    architect: 0.15,
    visual: 0.20,
    roleRelevance: 0.20,
    readability: 0.15,
    innovation: 0.10,
    daisy: 0.20
  },
  
  verdictThresholds: {
    LEGENDARY: 90,
    WORTHY: 75,
    ACCEPTABLE: 60,
    MEH: 40,
    UNWORTHY: 0
  }
};

// =============================================================================
// QUICK CHECKLIST FOR REVIEWS
// =============================================================================
export const QUICK_REVIEW_CHECKLIST = {
  visual: [
    '□ Is it visually balanced? (not lopsided)',
    '□ Is there sufficient contrast? (readable)',
    '□ Is the hierarchy clear? (important things stand out)',
    '□ Do colors communicate meaning? (green/amber/red)',
    '□ Are icons clear and consistent?',
    '□ Does it feel premium? (not generic admin)'
  ],
  
  readability: [
    '□ Can I grasp key info in 3 seconds?',
    '□ Are labels descriptive? (not abbreviations)',
    '□ Are units shown? ($500K not 500)',
    '□ Is there context? (vs last month, of total)',
    '□ Are sections clearly separated?'
  ],
  
  roleRelevance: [
    '□ Does it show what this role cares about FIRST?',
    '□ Are critical actions easily accessible?',
    '□ Is the detail level appropriate for the role?',
    '□ Does it answer the role\'s main questions?'
  ],
  
  functionality: [
    '□ Do all buttons/links work?',
    '□ Are there loading states?',
    '□ Are there empty states?',
    '□ Are there error states?',
    '□ Is data authentic? (not mock/placeholder)'
  ],
  
  innovation: [
    '□ Is there a wow moment?',
    '□ Does it anticipate user needs?',
    '□ Does it show trajectory/predictions?',
    '□ Does it proactively alert?',
    '□ Would users exclaim or need explanation?'
  ]
};

// =============================================================================
// UTILITY: Generate Review Report
// =============================================================================
export function generateReviewReport(review: ComprehensivePageReview): string {
  const divider = '═'.repeat(70);
  const thinDivider = '─'.repeat(70);
  
  let report = `
╔${divider}╗
║  VELOCITY PAGE REVIEW FRAMEWORK                                          ║
║  Comprehensive Multi-Lens Analysis                                        ║
╠${divider}╣
║  PAGE: ${review.title.padEnd(62)}║
║  PATH: ${review.path.padEnd(62)}║
║  PURPOSE: ${review.purpose.slice(0, 59).padEnd(59)}║
╠${divider}╣
║  SCORES BY LENS:                                                          ║
${thinDivider}
`;

  const lenses = [
    { name: 'Architect', score: review.scores.architect },
    { name: 'Visual', score: review.scores.visual },
    { name: 'Role Relevance', score: review.scores.roleRelevance },
    { name: 'Readability', score: review.scores.readability },
    { name: 'Innovation', score: review.scores.innovation },
    { name: 'DAISY', score: review.scores.daisy }
  ];
  
  for (const lens of lenses) {
    const barLength = Math.round(lens.score / 5);
    const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
    const color = lens.score >= 80 ? '🟢' : lens.score >= 60 ? '🟡' : '🔴';
    report += `║  ${color} ${lens.name.padEnd(16)} [${bar}] ${String(lens.score).padStart(3)}/100     ║\n`;
  }
  
  report += `${thinDivider}
║  OVERALL: ${String(review.scores.overall).padStart(3)}/100                                                      ║
║  VERDICT: ${review.verdict.padEnd(60)}║
╠${divider}╣
`;

  if (review.criticalFixes.length > 0) {
    report += `║  🔴 CRITICAL FIXES (Block Deploy):                                      ║\n`;
    for (const fix of review.criticalFixes.slice(0, 5)) {
      report += `║     • ${fix.slice(0, 60).padEnd(61)}║\n`;
    }
    report += `${thinDivider}\n`;
  }

  if (review.highPriorityFixes.length > 0) {
    report += `║  🟡 HIGH PRIORITY (This Week):                                          ║\n`;
    for (const fix of review.highPriorityFixes.slice(0, 5)) {
      report += `║     • ${fix.slice(0, 60).padEnd(61)}║\n`;
    }
    report += `${thinDivider}\n`;
  }

  if (review.strengths.length > 0) {
    report += `║  🟢 STRENGTHS:                                                          ║\n`;
    for (const strength of review.strengths.slice(0, 3)) {
      report += `║     ✓ ${strength.slice(0, 60).padEnd(61)}║\n`;
    }
  }

  report += `╚${divider}╝`;
  
  return report;
}

// Framework ready for use
