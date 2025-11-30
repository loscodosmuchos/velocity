import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════
// VELOCITY USER SETTINGS CONTEXT
// Unified settings persistence with export/import & sharing codes
// ═══════════════════════════════════════════════════════════════

export interface UserSettings {
  // ─── Display Settings ───
  theme: 'light' | 'dark' | 'system';
  layoutMode: 'expanded' | 'fixed';
  compactMode: boolean;
  showCardBorders: boolean;
  texturePreference: string;
  density: 'comfortable' | 'compact' | 'spacious';
  
  // ─── Typography & Icons ───
  fontFamily: string;
  menuFontSize: 'small' | 'medium' | 'large';
  iconSet: 'lucide' | 'heroicons' | 'phosphor' | 'custom';
  customIconPack?: string;
  
  // ─── Color Customization ───
  colorScheme: ColorScheme;
  savedColorSchemes: ColorSchemePreset[];
  
  // ─── Navigation & Dashboard ───
  dashboardLayout: 'grid' | 'list' | 'compact';
  defaultView: string;
  sidebarCollapsed: boolean;
  dashboardRole: string;
  sidebarMode: 'full' | 'simplified' | 'minimal';
  simplifiedMenuItems: string[];
  
  // ─── Notification Preferences ───
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  alertSounds: boolean;
  
  // ─── Accessibility ───
  language: string;
  showTips: boolean;
  
  // ─── Security ───
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  
  // ─── Custom Dashboard Configs ───
  dashboardConfigs: Record<string, DashboardConfig>;
  
  // ─── Saved Views ───
  savedViews: SavedView[];
  
  // ─── View Templates ───
  viewTemplates: ViewTemplate[];
  
  // ─── Metadata ───
  version: number;
  lastUpdated: string;
  createdBy?: string;
  
  // ─── Audit Trail (Compliance) ───
  auditLog: SettingsAuditEntry[];
}

export interface ColorScheme {
  // Alert colors
  alertCritical: string;
  alertHigh: string;
  alertMedium: string;
  alertLow: string;
  alertInfo: string;
  
  // Pipeline/Status colors
  statusActive: string;
  statusPending: string;
  statusCompleted: string;
  statusCancelled: string;
  statusDraft: string;
  
  // Card colors
  cardBackground: string;
  cardBorder: string;
  cardAccent: string;
  
  // Department colors (standardized)
  deptIT: string;
  deptDataScience: string;
  deptCloud: string;
  deptQA: string;
  deptSecurity: string;
}

export interface ColorSchemePreset {
  id: string;
  name: string;
  description?: string;
  scheme: ColorScheme;
  isDefault?: boolean;
  createdAt: string;
}

export interface ViewTemplate {
  id: string;
  name: string;
  description?: string;
  targetPage: string;
  columns: string[];
  filters: Record<string, unknown>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  groupBy?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  layout: 'grid' | 'list';
  createdAt: string;
  updatedAt: string;
}

export interface WidgetConfig {
  id: string;
  type: string;
  position: { x: number; y: number; w: number; h: number };
  settings: Record<string, unknown>;
}

export interface SavedView {
  id: string;
  name: string;
  path: string;
  filters: Record<string, unknown>;
  columns?: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  createdAt: string;
}

// ─── Audit Log Entry for Compliance ───
export interface SettingsAuditEntry {
  id: string;
  timestamp: string;
  action: 'update' | 'reset' | 'import' | 'apply_share_code' | 'apply_preset' | 'restore_backup';
  changes: {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];
  actor?: string;
  source?: string;
}

const SETTINGS_VERSION = 1;
const STORAGE_KEY = 'velocity_user_settings';

// ─── Default Color Scheme ───
const DEFAULT_COLOR_SCHEME: ColorScheme = {
  // Alert colors
  alertCritical: '#ef4444',
  alertHigh: '#f59e0b',
  alertMedium: '#3b82f6',
  alertLow: '#6b7280',
  alertInfo: '#06b6d4',
  
  // Pipeline/Status colors
  statusActive: '#22c55e',
  statusPending: '#f59e0b',
  statusCompleted: '#3b82f6',
  statusCancelled: '#ef4444',
  statusDraft: '#6b7280',
  
  // Card colors
  cardBackground: 'rgba(30, 41, 59, 0.5)',
  cardBorder: 'rgba(71, 85, 105, 0.5)',
  cardAccent: '#3b82f6',
  
  // Department colors (standardized per replit.md)
  deptIT: '#3b82f6',        // blue
  deptDataScience: '#8b5cf6', // purple
  deptCloud: '#14b8a6',      // teal
  deptQA: '#f59e0b',         // amber
  deptSecurity: '#ef4444',   // red
};

// ─── Available Font Families ───
export const AVAILABLE_FONTS = [
  { id: 'inter', name: 'Inter', family: '"Inter", system-ui, sans-serif' },
  { id: 'roboto', name: 'Roboto', family: '"Roboto", system-ui, sans-serif' },
  { id: 'poppins', name: 'Poppins', family: '"Poppins", system-ui, sans-serif' },
  { id: 'opensans', name: 'Open Sans', family: '"Open Sans", system-ui, sans-serif' },
  { id: 'lato', name: 'Lato', family: '"Lato", system-ui, sans-serif' },
  { id: 'montserrat', name: 'Montserrat', family: '"Montserrat", system-ui, sans-serif' },
  { id: 'sourcecode', name: 'Source Code Pro', family: '"Source Code Pro", monospace' },
  { id: 'jetbrains', name: 'JetBrains Mono', family: '"JetBrains Mono", monospace' },
];

// ─── Available Icon Sets ───
export const AVAILABLE_ICON_SETS = [
  { id: 'lucide', name: 'Lucide Icons', description: 'Clean, modern icons (default)' },
  { id: 'heroicons', name: 'Heroicons', description: 'Tailwind-style icons by Tailwind Labs' },
  { id: 'phosphor', name: 'Phosphor Icons', description: 'Flexible icon family with multiple weights' },
  { id: 'custom', name: 'Custom Pack', description: 'Upload your own icon pack' },
];

const DEFAULT_SETTINGS: UserSettings = {
  // Display
  theme: 'dark',
  layoutMode: 'expanded',
  compactMode: false,
  showCardBorders: true,
  texturePreference: 'carbon-fiber',
  density: 'comfortable',
  
  // Typography & Icons
  fontFamily: 'inter',
  menuFontSize: 'medium',
  iconSet: 'lucide',
  customIconPack: undefined,
  
  // Colors
  colorScheme: DEFAULT_COLOR_SCHEME,
  savedColorSchemes: [
    {
      id: 'velocity-default',
      name: 'Velocity Default',
      description: 'Standard Velocity color scheme',
      scheme: DEFAULT_COLOR_SCHEME,
      isDefault: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Enhanced visibility for accessibility',
      scheme: {
        ...DEFAULT_COLOR_SCHEME,
        alertCritical: '#ff0000',
        alertHigh: '#ff8800',
        alertMedium: '#0066ff',
        cardBackground: 'rgba(0, 0, 0, 0.8)',
        cardBorder: 'rgba(255, 255, 255, 0.3)',
      },
      isDefault: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hyundai-brand',
      name: 'Hyundai Brand',
      description: 'Aligned with Hyundai corporate colors',
      scheme: {
        ...DEFAULT_COLOR_SCHEME,
        cardAccent: '#002c5f',
        statusActive: '#00aad2',
        deptIT: '#002c5f',
      },
      isDefault: false,
      createdAt: new Date().toISOString(),
    },
  ],
  
  // Navigation
  dashboardLayout: 'grid',
  defaultView: 'dashboard',
  sidebarCollapsed: false,
  dashboardRole: 'admin',
  sidebarMode: 'full',
  simplifiedMenuItems: ['dashboard', 'statementofworks', 'documents'],
  
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  alertSounds: false,
  
  // Accessibility
  language: 'en',
  showTips: true,
  
  // Security
  twoFactorEnabled: false,
  sessionTimeout: '30',
  
  // Custom configs
  dashboardConfigs: {},
  savedViews: [],
  viewTemplates: [],
  
  // Metadata
  version: SETTINGS_VERSION,
  lastUpdated: new Date().toISOString(),
  
  // Audit trail
  auditLog: [],
};

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>, auditAction?: SettingsAuditEntry['action']) => void;
  resetSettings: () => void;
  
  // Export/Import
  exportSettings: () => string;
  importSettings: (data: string) => { success: boolean; error?: string };
  
  // Sharing
  generateShareCode: (subset?: (keyof UserSettings)[]) => string;
  applyShareCode: (code: string) => { success: boolean; error?: string };
  
  // Dashboard configs
  saveDashboardConfig: (config: DashboardConfig) => void;
  deleteDashboardConfig: (id: string) => void;
  
  // Saved views
  saveView: (view: SavedView) => void;
  deleteView: (id: string) => void;
  
  // Backup
  downloadBackup: () => void;
  restoreFromBackup: (file: File) => Promise<{ success: boolean; error?: string }>;
  
  // Audit trail (Compliance)
  getAuditLog: () => SettingsAuditEntry[];
  clearAuditLog: () => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

// ─── Helper: Compress/Decompress for share codes ───
function compressToCode(data: Record<string, unknown>): string {
  try {
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    // Add checksum prefix for validation
    const checksum = base64.length.toString(36).padStart(3, '0');
    return `VEL${checksum}${base64}`;
  } catch {
    return '';
  }
}

function decompressFromCode(code: string): Record<string, unknown> | null {
  try {
    if (!code.startsWith('VEL')) return null;
    const checksumStr = code.slice(3, 6);
    const base64 = code.slice(6);
    const expectedLength = parseInt(checksumStr, 36);
    if (base64.length !== expectedLength) return null;
    
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all keys exist
        return { ...DEFAULT_SETTINGS, ...parsed, version: SETTINGS_VERSION };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return { ...DEFAULT_SETTINGS };
  });

  // Persist settings on change
  useEffect(() => {
    const updated = { ...settings, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Sync with individual legacy keys for backwards compatibility
    localStorage.setItem('layoutMode', settings.layoutMode);
    localStorage.setItem('showCardBorders', String(settings.showCardBorders));
    localStorage.setItem('velocity-density', settings.density);
    localStorage.setItem('dashboard-role', settings.dashboardRole);
    localStorage.setItem('velocity-theme', settings.theme);
  }, [settings]);

  // ─── Helper: Create audit entry ───
  const createAuditEntry = useCallback((
    action: SettingsAuditEntry['action'],
    prevSettings: UserSettings,
    changes: Partial<UserSettings>
  ): SettingsAuditEntry => {
    const changedFields: SettingsAuditEntry['changes'] = [];
    
    Object.keys(changes).forEach(key => {
      const field = key as keyof UserSettings;
      if (field !== 'auditLog' && field !== 'lastUpdated' && field !== 'version') {
        changedFields.push({
          field,
          oldValue: prevSettings[field],
          newValue: changes[field]
        });
      }
    });
    
    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      action,
      changes: changedFields,
      actor: 'current_user',
      source: 'ui'
    };
  }, []);

  const updateSettings = useCallback((partial: Partial<UserSettings>, auditAction: SettingsAuditEntry['action'] = 'update') => {
    setSettings(prev => {
      const auditEntry = createAuditEntry(auditAction, prev, partial);
      const newAuditLog = [...(prev.auditLog || []), auditEntry].slice(-100); // Keep last 100 entries
      return { ...prev, ...partial, auditLog: newAuditLog };
    });
  }, [createAuditEntry]);

  const resetSettings = useCallback(() => {
    setSettings(prev => {
      const auditEntry: SettingsAuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        action: 'reset',
        changes: [{ field: 'all', oldValue: 'previous_settings', newValue: 'default_settings' }],
        actor: 'current_user',
        source: 'ui'
      };
      return { ...DEFAULT_SETTINGS, lastUpdated: new Date().toISOString(), auditLog: [...(prev.auditLog || []), auditEntry].slice(-100) };
    });
  }, []);

  // ─── Export/Import ───
  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((data: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed !== 'object') {
        return { success: false, error: 'Invalid settings format' };
      }
      setSettings(prev => {
        const auditEntry: SettingsAuditEntry = {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          action: 'import',
          changes: [{ field: 'all', oldValue: 'previous_settings', newValue: 'imported_settings' }],
          actor: 'current_user',
          source: 'file_import'
        };
        return { ...DEFAULT_SETTINGS, ...parsed, version: SETTINGS_VERSION, auditLog: [...(prev.auditLog || []), auditEntry].slice(-100) };
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to parse settings JSON' };
    }
  }, []);

  // ─── Sharing Codes ───
  const generateShareCode = useCallback((subset?: (keyof UserSettings)[]): string => {
    let dataToShare: Record<string, unknown>;
    
    if (subset && subset.length > 0) {
      dataToShare = {};
      subset.forEach(key => {
        dataToShare[key] = settings[key];
      });
    } else {
      // Share display settings by default (not security settings)
      const { twoFactorEnabled, sessionTimeout, ...shareableSettings } = settings;
      dataToShare = shareableSettings;
    }
    
    return compressToCode(dataToShare);
  }, [settings]);

  const applyShareCode = useCallback((code: string): { success: boolean; error?: string } => {
    const data = decompressFromCode(code);
    if (!data) {
      return { success: false, error: 'Invalid share code' };
    }
    
    // Don't override security settings from share codes
    const { twoFactorEnabled, sessionTimeout, auditLog, ...safeData } = data as Partial<UserSettings>;
    setSettings(prev => {
      const auditEntry: SettingsAuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        action: 'apply_share_code',
        changes: Object.keys(safeData).map(key => ({ 
          field: key, 
          oldValue: prev[key as keyof UserSettings], 
          newValue: safeData[key as keyof typeof safeData] 
        })),
        actor: 'current_user',
        source: `share_code:${code.slice(0, 10)}...`
      };
      return { ...prev, ...safeData, auditLog: [...(prev.auditLog || []), auditEntry].slice(-100) };
    });
    return { success: true };
  }, []);

  // ─── Dashboard Configs ───
  const saveDashboardConfig = useCallback((config: DashboardConfig) => {
    setSettings(prev => ({
      ...prev,
      dashboardConfigs: {
        ...prev.dashboardConfigs,
        [config.id]: { ...config, updatedAt: new Date().toISOString() }
      }
    }));
  }, []);

  const deleteDashboardConfig = useCallback((id: string) => {
    setSettings(prev => {
      const { [id]: _, ...rest } = prev.dashboardConfigs;
      return { ...prev, dashboardConfigs: rest };
    });
  }, []);

  // ─── Saved Views ───
  const saveView = useCallback((view: SavedView) => {
    setSettings(prev => ({
      ...prev,
      savedViews: [
        ...prev.savedViews.filter(v => v.id !== view.id),
        { ...view, createdAt: view.createdAt || new Date().toISOString() }
      ]
    }));
  }, []);

  const deleteView = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      savedViews: prev.savedViews.filter(v => v.id !== id)
    }));
  }, []);

  // ─── Backup/Restore ───
  const downloadBackup = useCallback(() => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velocity-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings]);

  const restoreFromBackup = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object') {
        return { success: false, error: 'Invalid backup format' };
      }
      setSettings(prev => {
        const auditEntry: SettingsAuditEntry = {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          action: 'restore_backup',
          changes: [{ field: 'all', oldValue: 'previous_settings', newValue: `restored_from:${file.name}` }],
          actor: 'current_user',
          source: `backup:${file.name}`
        };
        return { ...DEFAULT_SETTINGS, ...parsed, version: SETTINGS_VERSION, auditLog: [...(prev.auditLog || []), auditEntry].slice(-100) };
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to read backup file' };
    }
  }, []);

  // ─── Audit Trail Functions ───
  const getAuditLog = useCallback((): SettingsAuditEntry[] => {
    return settings.auditLog || [];
  }, [settings.auditLog]);

  const clearAuditLog = useCallback(() => {
    setSettings(prev => ({ ...prev, auditLog: [] }));
  }, []);

  return (
    <UserSettingsContext.Provider value={{
      settings,
      updateSettings,
      resetSettings,
      exportSettings,
      importSettings,
      generateShareCode,
      applyShareCode,
      saveDashboardConfig,
      deleteDashboardConfig,
      saveView,
      deleteView,
      downloadBackup,
      restoreFromBackup,
      getAuditLog,
      clearAuditLog,
    }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  }
  return context;
}

// ─── Individual setting hooks for convenience ───
export function useThemeSetting() {
  const { settings, updateSettings } = useUserSettings();
  return {
    theme: settings.theme,
    setTheme: (theme: UserSettings['theme']) => updateSettings({ theme })
  };
}

export function useLayoutSetting() {
  const { settings, updateSettings } = useUserSettings();
  return {
    layoutMode: settings.layoutMode,
    setLayoutMode: (layoutMode: UserSettings['layoutMode']) => updateSettings({ layoutMode })
  };
}

export function useDensitySetting() {
  const { settings, updateSettings } = useUserSettings();
  return {
    density: settings.density,
    setDensity: (density: UserSettings['density']) => updateSettings({ density })
  };
}
