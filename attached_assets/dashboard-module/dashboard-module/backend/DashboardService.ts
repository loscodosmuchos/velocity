import { db } from "../db";
import {
  dashboardModules,
  dashboardTemplates,
  userDashboardLayouts,
  type DashboardModule,
  type DashboardTemplate,
  type UserDashboardLayout,
  type InsertUserDashboardLayout,
  type LayoutItem,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class DashboardService {
  /**
   * Get all available dashboard modules (widgets)
   */
  async getAvailableModules(category?: string): Promise<DashboardModule[]> {
    if (category) {
      return await db
        .select()
        .from(dashboardModules)
        .where(and(
          eq(dashboardModules.category, category),
          eq(dashboardModules.isEnabled, true)
        ));
    }
    return await db
      .select()
      .from(dashboardModules)
      .where(eq(dashboardModules.isEnabled, true));
  }

  /**
   * Get dashboard templates for a specific role
   */
  async getTemplatesForRole(role?: string): Promise<DashboardTemplate[]> {
    if (role) {
      return await db
        .select()
        .from(dashboardTemplates)
        .where(and(
          eq(dashboardTemplates.role, role),
          eq(dashboardTemplates.isPublic, true)
        ));
    }
    return await db
      .select()
      .from(dashboardTemplates)
      .where(eq(dashboardTemplates.isPublic, true));
  }

  /**
   * Get all templates (public ones)
   */
  async getAllTemplates(): Promise<DashboardTemplate[]> {
    return await db
      .select()
      .from(dashboardTemplates)
      .where(eq(dashboardTemplates.isPublic, true));
  }

  /**
   * Get user's saved layouts
   */
  async getUserLayouts(userId: string): Promise<UserDashboardLayout[]> {
    return await db
      .select()
      .from(userDashboardLayouts)
      .where(eq(userDashboardLayouts.userId, userId));
  }

  /**
   * Get user's default layout
   */
  async getUserDefaultLayout(userId: string): Promise<UserDashboardLayout | null> {
    const layouts = await db
      .select()
      .from(userDashboardLayouts)
      .where(and(
        eq(userDashboardLayouts.userId, userId),
        eq(userDashboardLayouts.isDefault, true)
      ))
      .limit(1);
    
    return layouts[0] || null;
  }

  /**
   * Save a user's dashboard layout
   */
  async saveUserLayout(
    userId: string,
    name: string,
    layout: LayoutItem[],
    isDefault: boolean = false,
    themeId?: number
  ): Promise<UserDashboardLayout> {
    // If setting as default, unset other defaults
    if (isDefault) {
      await db
        .update(userDashboardLayouts)
        .set({ isDefault: false })
        .where(eq(userDashboardLayouts.userId, userId));
    }

    const [newLayout] = await db
      .insert(userDashboardLayouts)
      .values({
        userId,
        name,
        layout,
        isDefault,
        themeId,
      })
      .returning();

    return newLayout;
  }

  /**
   * Update an existing layout
   */
  async updateUserLayout(
    layoutId: number,
    userId: string,
    updates: Partial<InsertUserDashboardLayout>
  ): Promise<UserDashboardLayout | null> {
    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await db
        .update(userDashboardLayouts)
        .set({ isDefault: false })
        .where(eq(userDashboardLayouts.userId, userId));
    }

    const [updatedLayout] = await db
      .update(userDashboardLayouts)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(
        eq(userDashboardLayouts.id, layoutId),
        eq(userDashboardLayouts.userId, userId)
      ))
      .returning();

    return updatedLayout || null;
  }

  /**
   * Delete a user's layout
   */
  async deleteUserLayout(layoutId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(userDashboardLayouts)
      .where(and(
        eq(userDashboardLayouts.id, layoutId),
        eq(userDashboardLayouts.userId, userId)
      ))
      .returning();

    return result.length > 0;
  }

  /**
   * Apply a template to create a new user layout
   */
  async applyTemplate(
    templateId: number,
    userId: string,
    saveAs?: string
  ): Promise<UserDashboardLayout> {
    const [template] = await db
      .select()
      .from(dashboardTemplates)
      .where(eq(dashboardTemplates.id, templateId))
      .limit(1);

    if (!template) {
      throw new Error("Template not found");
    }

    const layoutName = saveAs || `${template.name} (Custom)`;
    
    return await this.saveUserLayout(
      userId,
      layoutName,
      template.layout || [],
      false
    );
  }

  /**
   * Load a specific user layout
   */
  async loadUserLayout(
    userId: string,
    layoutId: number
  ): Promise<UserDashboardLayout | null> {
    const [layout] = await db
      .select()
      .from(userDashboardLayouts)
      .where(and(
        eq(userDashboardLayouts.id, layoutId),
        eq(userDashboardLayouts.userId, userId)
      ))
      .limit(1);

    return layout || null;
  }
}

export const dashboardService = new DashboardService();
