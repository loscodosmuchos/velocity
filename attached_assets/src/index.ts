// Main module exports for Missing Data Generator
export { default as MissingDataGenerator } from './components/MissingDataGenerator';
export { default as ClientPortal } from './components/ClientPortal';
export { default as ClientNotifications } from './components/ClientNotifications';

// API utilities
export * from './api/clientRequirements';
export * from './api/notifications';

// Types and schemas
export * from './types/index';
export * from './schemas/index';

// Hooks
export { useClientRequirements } from './hooks/useClientRequirements';
export { useNotifications } from './hooks/useNotifications';

// Configuration
export { ModuleConfig, defaultConfig } from './config';

// Version info
export const MODULE_VERSION = '1.0.0';
export const MODULE_ID = '3n4ir3';