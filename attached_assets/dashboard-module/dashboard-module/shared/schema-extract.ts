// Dashboard Builder Module - Database Schema
// Add these sections to your shared/schema.ts file

import { pgTable, serial, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// ============ DASHBOARD MODULE SCHEMA ============

// Dashboard Modules - Catalog of available widgets
export const dashboardModules = pgTable('dashboard_modules', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'kpi', 'chart', 'table', 'widget', 'custom'
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'), // Lucide icon name
  category: text('category'), // 'recruitment', 'procurement', 'project_mgmt', etc.
  defaultSize: jsonb('default_size').$type<{ w: number; h: number; minW?: number; minH?: number }>(),
  configSchema: jsonb('config_schema'), // Zod schema for widget-specific config
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type DashboardModule = typeof dashboardModules.$inferSelect;
export type InsertDashboardModule = typeof dashboardModules.$inferInsert;
export const insertDashboardModuleSchema = createInsertSchema(dashboardModules);

// Dashboard Templates - Pre-configured layouts for roles
export const dashboardTemplates = pgTable('dashboard_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  role: text('role'), // 'recruiter', 'executive', 'vendor_manager', etc.
  layout: jsonb('layout').$type<LayoutItem[]>(),
  isPublic: boolean('is_public').default(false),
  isDefault: boolean('is_default').default(false),
  thumbnailUrl: text('thumbnail_url'),
  createdBy: integer('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type DashboardTemplate = typeof dashboardTemplates.$inferSelect;
export type InsertDashboardTemplate = typeof dashboardTemplates.$inferInsert;
export const insertDashboardTemplateSchema = createInsertSchema(dashboardTemplates);

// User Dashboard Layouts - Personal customizations
export const userDashboardLayouts = pgTable('user_dashboard_layouts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  layout: jsonb('layout').$type<LayoutItem[]>(),
  isDefault: boolean('is_default').default(false),
  themeId: integer('theme_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type UserDashboardLayout = typeof userDashboardLayouts.$inferSelect;
export type InsertUserDashboardLayout = typeof userDashboardLayouts.$inferInsert;
export const insertUserDashboardLayoutSchema = createInsertSchema(userDashboardLayouts);

// Theme Tokens - Design system configurations
export const themeTokens = pgTable('theme_tokens', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  tokens: jsonb('tokens').$type<ThemeTokens>(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ThemeToken = typeof themeTokens.$inferSelect;
export type InsertThemeToken = typeof themeTokens.$inferInsert;
export const insertThemeTokenSchema = createInsertSchema(themeTokens);

// ============ TYPE DEFINITIONS ============

// Layout item for grid positioning
export interface LayoutItem {
  i: string;           // Unique identifier
  x: number;           // X position in grid
  y: number;           // Y position in grid
  w: number;           // Width in grid units
  h: number;           // Height in grid units
  moduleId: number;    // Foreign key to dashboard_modules
}

// Theme token structure
export interface ThemeTokens {
  colors?: {
    [key: string]: { h: number; s: number; l: number };
  };
  spacing?: {
    base: number;
    scale: number;
  };
  typography?: {
    fontFamily: string;
    baseSize: number;
  };
  borderRadius?: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Validation schemas for API requests
import { z } from 'zod';

export const saveLayoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  layout: z.array(z.object({
    i: z.string(),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
    moduleId: z.number(),
  })),
  isDefault: z.boolean().optional().default(false),
  themeId: z.number().optional(),
});

export const applyTemplateSchema = z.object({
  templateId: z.number(),
});
