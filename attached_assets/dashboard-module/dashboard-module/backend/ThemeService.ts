import { db } from "../db";
import {
  themeTokens,
  userDashboardLayouts,
  type ThemeToken,
  type ThemeTokenSet,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export class ThemeService {
  /**
   * Get all available themes
   */
  async getThemes(): Promise<ThemeToken[]> {
    return await db
      .select()
      .from(themeTokens)
      .where(eq(themeTokens.isPublic, true));
  }

  /**
   * Get a specific theme by ID
   */
  async getTheme(themeId: number): Promise<ThemeToken | null> {
    const [theme] = await db
      .select()
      .from(themeTokens)
      .where(eq(themeTokens.id, themeId))
      .limit(1);

    return theme || null;
  }

  /**
   * Generate CSS variables from theme tokens
   */
  generateCSSVariables(theme: ThemeToken): string {
    if (!theme.tokens) {
      return '';
    }

    const tokens = theme.tokens;
    const cssVars: string[] = [];

    // Color variables
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([name, hsl]) => {
        cssVars.push(`--color-${name}: ${hsl.h} ${hsl.s}% ${hsl.l}%;`);
      });
    }

    // Spacing variables
    if (tokens.spacing) {
      cssVars.push(`--spacing-base: ${tokens.spacing.base}px;`);
      cssVars.push(`--spacing-scale: ${tokens.spacing.scale};`);
    }

    // Typography variables
    if (tokens.typography) {
      cssVars.push(`--font-family: ${tokens.typography.fontFamily};`);
      cssVars.push(`--font-size-base: ${tokens.typography.baseSize}px;`);
    }

    // Border radius variables
    if (tokens.borderRadius) {
      cssVars.push(`--border-radius-sm: ${tokens.borderRadius.sm}px;`);
      cssVars.push(`--border-radius-md: ${tokens.borderRadius.md}px;`);
      cssVars.push(`--border-radius-lg: ${tokens.borderRadius.lg}px;`);
    }

    return cssVars.join('\n');
  }

  /**
   * Switch user's theme
   */
  async switchTheme(userId: string, layoutId: number, themeId: number): Promise<boolean> {
    const result = await db
      .update(userDashboardLayouts)
      .set({
        themeId,
        updatedAt: new Date(),
      })
      .where(eq(userDashboardLayouts.id, layoutId))
      .returning();

    return result.length > 0;
  }

  /**
   * Get default theme
   */
  async getDefaultTheme(): Promise<ThemeToken | null> {
    const themes = await this.getThemes();
    return themes[0] || null;
  }
}

export const themeService = new ThemeService();
