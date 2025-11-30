// Dashboard Builder Module - Frontend Components
// Export all dashboard components for easy importing

// Main page component
export { default as DashboardBuilder } from './DashboardBuilder';

// Dashboard components
export { DashboardWidget } from './dashboard/DashboardWidget';
export { GridLayout } from './dashboard/GridLayout';
export { ModulePalette } from './dashboard/ModulePalette';
export { TemplateSelector } from './dashboard/TemplateSelector';
export { ThemeSelector } from './dashboard/ThemeSelector';
export { SaveLayoutDialog } from './dashboard/SaveLayoutDialog';

// Note: Import types from your project's shared schema:
// import type { DashboardModule, LayoutItem, DashboardTemplate, ThemeToken } from '@shared/schema';
