// Module configuration and defaults

export interface ModuleConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableNotifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  defaultPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  theme: {
    primaryColor: string;
    accentColor: string;
    borderRadius: string;
  };
}

export const defaultConfig: ModuleConfig = {
  apiBaseUrl: '/api',
  apiTimeout: 10000,
  enableNotifications: true,
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  defaultPriority: 'Medium',
  theme: {
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    borderRadius: '0.5rem'
  }
};

let currentConfig: ModuleConfig = { ...defaultConfig };

export const setModuleConfig = (config: Partial<ModuleConfig>): void => {
  currentConfig = { ...currentConfig, ...config };
};

export const getModuleConfig = (): ModuleConfig => currentConfig;

export const resetConfig = (): void => {
  currentConfig = { ...defaultConfig };
};