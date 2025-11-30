/**
 * VOICE DEMO SESSION MANAGER
 * Two-way navigation sync between ElevenLabs and Velocity platform
 * 
 * Features:
 * - Unique session IDs for demo tracking
 * - Screen code system (A1, B2, etc.) for voice-addressable navigation
 * - Real-time page awareness sent to ElevenLabs
 * - Incoming navigation commands from chatbot
 * - Session recording for demo playback
 */

export interface VoiceDemoSession {
  sessionId: string;
  startedAt: string;
  userId?: number;
  userName?: string;
  agentId: string;
  currentScreenCode: string;
  currentPath: string;
  navigationHistory: NavigationEvent[];
  isActive: boolean;
  mode: 'guided' | 'freeform';
}

export interface NavigationEvent {
  timestamp: string;
  screenCode: string;
  path: string;
  source: 'user' | 'chatbot';
  action?: string;
}

export interface ScreenCodeMapping {
  code: string;
  path: string;
  label: string;
  category: string;
  talkingPoints?: string[];
  keyFeatures?: string[];
}

const VOICE_DEMO_SESSION_KEY = 'velocity_voice_demo_session';
const SCREEN_CODE_LISTENERS: Set<(code: string) => void> = new Set();
const NAVIGATION_LISTENERS: Set<(path: string, source: 'user' | 'chatbot') => void> = new Set();

/**
 * Complete screen code mapping for all demo-ready pages
 * These become voice-addressable: "Take me to A3" or "Show me the SOW Command Center"
 */
export const SCREEN_CODES: ScreenCodeMapping[] = [
  // A Series - Dashboards & Overview
  { code: 'A1', path: '/', label: 'Main Dashboard', category: 'Overview', 
    talkingPoints: ['Executive summary', 'KPI ribbon', 'Alert cubes'],
    keyFeatures: ['Real-time metrics', 'Proactive alerts', 'Quick actions'] },
  { code: 'A2', path: '/dashboard', label: 'Analytics Dashboard', category: 'Overview' },
  { code: 'A3', path: '/sow-command-center', label: 'SOW Command Center', category: 'Overview',
    talkingPoints: ['$2M+ in active SOWs', 'AI-powered insights', 'Risk detection'],
    keyFeatures: ['Workflow journey', 'AI cockpit', 'Stakeholder canvas'] },
  
  // B Series - SOW Management
  { code: 'B1', path: '/sow/portfolio', label: 'SOW Portfolio', category: 'SOWs' },
  { code: 'B2', path: '/sow/templates', label: 'SOW Templates', category: 'SOWs' },
  { code: 'B3', path: '/sow/compliance', label: 'SOW Compliance', category: 'SOWs' },
  { code: 'B4', path: '/change-orders', label: 'Change Orders', category: 'SOWs' },
  
  // C Series - Contractors
  { code: 'C1', path: '/contractors', label: 'Contractor Roster', category: 'Contractors',
    talkingPoints: ['500+ contractors', 'Compliance tracking', 'Performance scores'],
    keyFeatures: ['Real-time status', 'Document vault', 'Assignment history'] },
  { code: 'C2', path: '/contractors/onboarding', label: 'Onboarding Pipeline', category: 'Contractors' },
  { code: 'C3', path: '/contractors/performance', label: 'Performance Metrics', category: 'Contractors' },
  { code: 'C4', path: '/contractors/compliance', label: 'Compliance Dashboard', category: 'Contractors' },
  
  // D Series - Finance
  { code: 'D1', path: '/purchase-orders', label: 'Purchase Orders', category: 'Finance',
    talkingPoints: ['$15M+ managed', 'Budget tracking', 'GR approval workflow'],
    keyFeatures: ['Real-time spend', 'Contractor allocation', 'Burn rate alerts'] },
  { code: 'D2', path: '/timecards', label: 'Timecards', category: 'Finance' },
  { code: 'D3', path: '/invoices', label: 'Invoices', category: 'Finance' },
  { code: 'D4', path: '/expenses', label: 'Expenses', category: 'Finance' },
  
  // E Series - AI & Intelligence
  { code: 'E1', path: '/ai/insights', label: 'AI Insights', category: 'Intelligence' },
  { code: 'E2', path: '/ai/chatbots', label: 'Voice Agents', category: 'Intelligence',
    talkingPoints: ['4 specialized agents', 'Real-time voice capture', 'Crisis detection'],
    keyFeatures: ['Timecard bot', 'Status collector', 'Approval assistant'] },
  { code: 'E3', path: '/ai/legendary-builder-expert', label: 'Legendary Builder', category: 'Intelligence' },
  { code: 'E4', path: '/ai/voice-agents', label: 'VINessa Voice', category: 'Intelligence' },
  
  // F Series - Documents & Knowledge
  { code: 'F1', path: '/documents', label: 'Document Gallery', category: 'Documents',
    talkingPoints: ['AI-powered analysis', '12 action buttons', 'Batch processing'],
    keyFeatures: ['Contract analysis', 'Policy compliance', 'Risk assessment'] },
  { code: 'F2', path: '/knowledge-vault', label: 'Knowledge Vault', category: 'Documents' },
  { code: 'F3', path: '/ai/contract-analysis', label: 'Contract Analysis', category: 'Documents' },
  
  // G Series - Admin & Demo
  { code: 'G1', path: '/demo-command-center', label: 'Demo Command Center', category: 'Admin' },
  { code: 'G2', path: '/admin/demo-package', label: 'Demo Package', category: 'Admin' },
  { code: 'G3', path: '/admin/mvp-workflow-stories', label: 'MVP Stories', category: 'Admin' },
  { code: 'G4', path: '/admin/system-architecture-map', label: 'Architecture Map', category: 'Admin' },
  
  // H Series - User Settings
  { code: 'H1', path: '/user/preferences', label: 'User Preferences', category: 'Settings' },
  { code: 'H2', path: '/user/capability-map', label: 'Capability Map', category: 'Settings' },
  { code: 'H3', path: '/workflows/builder', label: 'Workflow Studio', category: 'Settings' },
  
  // P Series - Portals
  { code: 'P1', path: '/contractor-portal', label: 'Contractor Portal', category: 'Portals' },
  { code: 'P2', path: '/contractor-portal/documents', label: 'Portal Documents', category: 'Portals' },
  { code: 'P3', path: '/vendor-portal', label: 'Vendor Portal', category: 'Portals' },
];

/**
 * Generate unique session ID (VDS = Voice Demo Session)
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VDS-${timestamp}-${random}`;
}

/**
 * Get screen code for current path
 */
export function getScreenCodeForPath(path: string): ScreenCodeMapping | null {
  const normalized = path.replace(/\/$/, '') || '/';
  return SCREEN_CODES.find(sc => sc.path === normalized) || null;
}

/**
 * Get path for screen code
 */
export function getPathForScreenCode(code: string): string | null {
  const mapping = SCREEN_CODES.find(sc => sc.code.toUpperCase() === code.toUpperCase());
  return mapping?.path || null;
}

/**
 * Start a new voice demo session
 */
export function startVoiceDemoSession(agentId: string, userName?: string): VoiceDemoSession {
  const session: VoiceDemoSession = {
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    userName,
    agentId,
    currentScreenCode: 'A1',
    currentPath: '/',
    navigationHistory: [],
    isActive: true,
    mode: 'guided',
  };
  
  localStorage.setItem(VOICE_DEMO_SESSION_KEY, JSON.stringify(session));
  console.log(`🎙️ Voice Demo Session Started: ${session.sessionId}`);
  
  return session;
}

/**
 * Get current voice demo session
 */
export function getVoiceDemoSession(): VoiceDemoSession | null {
  const stored = localStorage.getItem(VOICE_DEMO_SESSION_KEY);
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored) as VoiceDemoSession;
    return session.isActive ? session : null;
  } catch {
    return null;
  }
}

/**
 * Update session with current page location
 */
export function updateSessionLocation(path: string, source: 'user' | 'chatbot' = 'user'): void {
  const session = getVoiceDemoSession();
  if (!session) return;
  
  const screenCode = getScreenCodeForPath(path);
  const event: NavigationEvent = {
    timestamp: new Date().toISOString(),
    screenCode: screenCode?.code || 'XX',
    path,
    source,
  };
  
  session.currentPath = path;
  session.currentScreenCode = screenCode?.code || 'XX';
  session.navigationHistory.push(event);
  
  localStorage.setItem(VOICE_DEMO_SESSION_KEY, JSON.stringify(session));
  
  SCREEN_CODE_LISTENERS.forEach(cb => cb(session.currentScreenCode));
  NAVIGATION_LISTENERS.forEach(cb => cb(path, source));
}

/**
 * End voice demo session
 */
export function endVoiceDemoSession(): VoiceDemoSession | null {
  const session = getVoiceDemoSession();
  if (!session) return null;
  
  session.isActive = false;
  localStorage.setItem(VOICE_DEMO_SESSION_KEY, JSON.stringify(session));
  console.log(`🎙️ Voice Demo Session Ended: ${session.sessionId}`);
  
  return session;
}

/**
 * Subscribe to screen code changes
 */
export function onScreenCodeChange(callback: (code: string) => void): () => void {
  SCREEN_CODE_LISTENERS.add(callback);
  return () => SCREEN_CODE_LISTENERS.delete(callback);
}

/**
 * Subscribe to navigation events
 */
export function onNavigationEvent(callback: (path: string, source: 'user' | 'chatbot') => void): () => void {
  NAVIGATION_LISTENERS.add(callback);
  return () => NAVIGATION_LISTENERS.delete(callback);
}

/**
 * Check if voice demo mode is active
 */
export function isVoiceDemoActive(): boolean {
  return getVoiceDemoSession() !== null;
}

/**
 * Build context message for ElevenLabs about current screen
 */
export function buildScreenContextForAgent(path: string): string {
  const screen = getScreenCodeForPath(path);
  if (!screen) {
    return `User is on an unmapped page: ${path}`;
  }
  
  let context = `User is now on screen ${screen.code}: ${screen.label} (${screen.category})`;
  
  if (screen.talkingPoints?.length) {
    context += `\n\nKey talking points for this screen:\n${screen.talkingPoints.map(p => `- ${p}`).join('\n')}`;
  }
  
  if (screen.keyFeatures?.length) {
    context += `\n\nKey features to highlight:\n${screen.keyFeatures.map(f => `- ${f}`).join('\n')}`;
  }
  
  return context;
}

/**
 * Parse navigation command from chatbot response
 * Returns path if chatbot wants to navigate user somewhere
 */
export function parseNavigationCommand(response: string): string | null {
  const patterns = [
    /navigate to (\w+)/i,
    /go to (\w+)/i,
    /take you to (\w+)/i,
    /show you (\w+)/i,
    /let me show (\w+)/i,
    /screen (\w+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = response.match(pattern);
    if (match) {
      const code = match[1].toUpperCase();
      const path = getPathForScreenCode(code);
      if (path) return path;
    }
  }
  
  return null;
}

/**
 * Get demo session summary for export/sharing
 */
export function getSessionSummary(): object | null {
  const session = getVoiceDemoSession();
  if (!session) return null;
  
  const duration = new Date().getTime() - new Date(session.startedAt).getTime();
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  
  return {
    sessionId: session.sessionId,
    duration: `${minutes}m ${seconds}s`,
    screensVisited: session.navigationHistory.length,
    uniqueScreens: [...new Set(session.navigationHistory.map(n => n.screenCode))].length,
    path: session.navigationHistory.map(n => n.screenCode).join(' → '),
    mode: session.mode,
  };
}
