# Dashboard Builder Integration Guide

Step-by-step guide to integrate the Dashboard Builder Module into your existing application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Database Setup](#database-setup)
- [Backend Integration](#backend-integration)
- [Frontend Integration](#frontend-integration)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before integrating the Dashboard Builder, ensure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL 14+ database
- ✅ React 18+ application
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Existing authentication system (optional but recommended)

## Installation Steps

### Step 1: Install Dependencies

```bash
# Core dependencies
npm install react-grid-layout@1.4.4 \
  @tanstack/react-query@5.0.0 \
  drizzle-orm@0.33.0 \
  drizzle-zod@0.5.1 \
  zod@3.23.8

# UI dependencies
npm install @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-label \
  @radix-ui/react-toast \
  lucide-react

# Utility dependencies
npm install class-variance-authority \
  clsx \
  tailwind-merge

# Development dependencies
npm install -D drizzle-kit@0.24.0 \
  @types/react-grid-layout
```

### Step 2: Copy Module Files

Create the following directory structure and copy files:

```bash
# Create directory structure
mkdir -p client/src/components/dashboard
mkdir -p client/src/pages
mkdir -p server/services
mkdir -p shared

# Copy frontend components
cp source/client/src/components/dashboard/*.tsx your-app/client/src/components/dashboard/
cp source/client/src/pages/DashboardBuilder.tsx your-app/client/src/pages/

# Copy backend services
cp source/server/services/DashboardService.ts your-app/server/services/
cp source/server/services/ThemeService.ts your-app/server/services/

# Copy shared schema
cp source/shared/schema.ts your-app/shared/
# Note: Merge dashboard schema sections into your existing schema file

# Copy seed script
cp source/server/seed.ts your-app/server/
# Note: Extract dashboard seeding sections if you have existing seed logic
```

### File Checklist

- [ ] `client/src/components/dashboard/DashboardWidget.tsx`
- [ ] `client/src/components/dashboard/GridLayout.tsx`
- [ ] `client/src/components/dashboard/ModulePalette.tsx`
- [ ] `client/src/components/dashboard/TemplateSelector.tsx`
- [ ] `client/src/components/dashboard/ThemeSelector.tsx`
- [ ] `client/src/components/dashboard/SaveLayoutDialog.tsx`
- [ ] `client/src/pages/DashboardBuilder.tsx`
- [ ] `server/services/DashboardService.ts`
- [ ] `server/services/ThemeService.ts`
- [ ] `shared/schema.ts` (dashboard sections)
- [ ] `server/seed.ts` (dashboard sections)

## Database Setup

### Step 1: Update Database Schema

Add the dashboard tables to your `shared/schema.ts`:

```typescript
import { pgTable, serial, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Dashboard Modules
export const dashboardModules = pgTable('dashboard_modules', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  category: text('category'),
  defaultSize: jsonb('default_size').$type<{ w: number; h: number; minW?: number; minH?: number }>(),
  configSchema: jsonb('config_schema'),
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type DashboardModule = typeof dashboardModules.$inferSelect;
export type InsertDashboardModule = typeof dashboardModules.$inferInsert;
export const insertDashboardModuleSchema = createInsertSchema(dashboardModules);

// Dashboard Templates
export const dashboardTemplates = pgTable('dashboard_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  role: text('role'),
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

// User Dashboard Layouts
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

// Theme Tokens
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

// LayoutItem type
export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  moduleId: number;
}

// ThemeTokens type
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
```

### Step 2: Run Database Migration

```bash
# Push schema changes to database
npm run db:push

# If there are conflicts:
npm run db:push --force
```

### Step 3: Seed Initial Data

```bash
# Run the seed script
tsx server/seed.ts
```

This will create:
- 37 dashboard modules across 7 categories
- 8 role-based templates
- 3 pre-configured themes

## Backend Integration

### Step 1: Import Services

In your `server/routes.ts` or main API file:

```typescript
import { dashboardService } from './services/DashboardService';
import { themeService } from './services/ThemeService';
import { seedDatabase } from './seed';
```

### Step 2: Add API Routes

Add these routes to your Express application:

```typescript
// Get available dashboard modules
app.get("/api/dashboard/modules", async (req, res) => {
  try {
    const { category } = req.query;
    const modules = await dashboardService.getAvailableModules(category as string);
    res.json(modules);
  } catch (error: any) {
    console.error("Get modules error:", error);
    res.status(500).json({ error: error.message || "Failed to get modules" });
  }
});

// Get dashboard templates
app.get("/api/dashboard/templates", async (req, res) => {
  try {
    const { role } = req.query;
    const templates = role 
      ? await dashboardService.getTemplatesForRole(role as string)
      : await dashboardService.getAllTemplates();
    res.json(templates);
  } catch (error: any) {
    console.error("Get templates error:", error);
    res.status(500).json({ error: error.message || "Failed to get templates" });
  }
});

// Get user's saved layouts
app.get("/api/dashboard/layouts", async (req, res) => {
  try {
    const userId = req.user?.id || "default-user"; // Replace with your auth
    const layouts = await dashboardService.getUserLayouts(userId);
    res.json(layouts);
  } catch (error: any) {
    console.error("Get layouts error:", error);
    res.status(500).json({ error: error.message || "Failed to get layouts" });
  }
});

// Save user layout
app.post("/api/dashboard/layouts", async (req, res) => {
  try {
    const userId = req.user?.id || "default-user"; // Replace with your auth
    const { name, layout, isDefault, themeId } = req.body;
    
    const savedLayout = await dashboardService.saveUserLayout(
      userId,
      name,
      layout,
      isDefault,
      themeId
    );
    
    res.status(201).json(savedLayout);
  } catch (error: any) {
    console.error("Save layout error:", error);
    res.status(500).json({ error: error.message || "Failed to save layout" });
  }
});

// Update layout
app.put("/api/dashboard/layouts/:id", async (req, res) => {
  try {
    const layoutId = parseInt(req.params.id);
    const { themeId, name, layout, isDefault } = req.body;
    
    const updated = await dashboardService.updateLayout(
      layoutId,
      { themeId, name, layout, isDefault }
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Layout not found" });
    }
    
    res.json(updated);
  } catch (error: any) {
    console.error("Update layout error:", error);
    res.status(500).json({ error: error.message || "Failed to update layout" });
  }
});

// Delete layout
app.delete("/api/dashboard/layouts/:id", async (req, res) => {
  try {
    const layoutId = parseInt(req.params.id);
    const success = await dashboardService.deleteLayout(layoutId);
    
    if (!success) {
      return res.status(404).json({ error: "Layout not found" });
    }
    
    res.json({ success: true, message: "Layout deleted successfully" });
  } catch (error: any) {
    console.error("Delete layout error:", error);
    res.status(500).json({ error: error.message || "Failed to delete layout" });
  }
});

// Apply template
app.post("/api/dashboard/templates/apply", async (req, res) => {
  try {
    const userId = req.user?.id || "default-user"; // Replace with your auth
    const { templateId } = req.body;
    
    const layout = await dashboardService.applyTemplate(userId, templateId);
    
    if (!layout) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    res.status(201).json(layout);
  } catch (error: any) {
    console.error("Apply template error:", error);
    res.status(500).json({ error: error.message || "Failed to apply template" });
  }
});

// Get themes
app.get("/api/dashboard/themes", async (req, res) => {
  try {
    const themes = await themeService.getThemes();
    res.json(themes);
  } catch (error: any) {
    console.error("Get themes error:", error);
    res.status(500).json({ error: error.message || "Failed to get themes" });
  }
});

// Get theme by ID
app.get("/api/dashboard/themes/:id", async (req, res) => {
  try {
    const themeId = parseInt(req.params.id);
    const theme = await themeService.getTheme(themeId);
    
    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }
    
    res.json(theme);
  } catch (error: any) {
    console.error("Get theme error:", error);
    res.status(500).json({ error: error.message || "Failed to get theme" });
  }
});
```

### Step 3: Authentication Integration

Replace `"default-user"` with your actual user ID from session/auth:

```typescript
// Example with Passport.js
const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new Error('Unauthorized');
  }
  return req.user.id;
};

// Example usage
app.get("/api/dashboard/layouts", requireAuth, async (req, res) => {
  const userId = getUserId(req);
  const layouts = await dashboardService.getUserLayouts(userId);
  res.json(layouts);
});
```

## Frontend Integration

### Step 1: Setup React Query

In your root `App.tsx` or `main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```

### Step 2: Add Dashboard Route

Using Wouter (or adapt for your router):

```typescript
import { Route } from "wouter";
import DashboardBuilder from "./pages/DashboardBuilder";

function Router() {
  return (
    <>
      <Route path="/dashboard" component={DashboardBuilder} />
      {/* Other routes */}
    </>
  );
}
```

Using React Router:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardBuilder from "./pages/DashboardBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardBuilder />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 3: Configure API Client

If using a custom API client, update `client/src/lib/queryClient.ts`:

```typescript
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add your auth headers here
      'Authorization': `Bearer ${getAuthToken()}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}
```

### Step 4: Add Tailwind Configuration

Ensure `tailwind.config.ts` includes dashboard components:

```typescript
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/src/components/dashboard/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your theme extensions
    },
  },
};
```

## Configuration

### Custom Module Renderers

To add custom widget content, edit `DashboardWidget.tsx`:

```typescript
const renderCustomModule = (module: DashboardModule) => {
  switch (module.name) {
    case 'My Custom Widget':
      return <MyCustomComponent data={myData} />;
    default:
      return renderDefaultModule(module);
  }
};
```

### User Context

To use actual user data instead of "default-user":

```typescript
// Create a UserContext
import { createContext, useContext } from 'react';

const UserContext = createContext<{ userId: string } | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be within UserProvider');
  return context;
};

// In DashboardBuilder.tsx
const { userId } = useUser();

const saveLayoutMutation = useMutation({
  mutationFn: async (data) => {
    return apiRequest('/api/dashboard/layouts', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    });
  },
});
```

### Environment Variables

Add to your `.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Optional: API base URL for frontend
VITE_API_BASE_URL=http://localhost:5000
```

## Testing

### Step 1: Manual Testing

1. Start your application:
```bash
npm run dev
```

2. Navigate to `/dashboard`

3. Test functionality:
   - [ ] Modules load in palette
   - [ ] Templates dropdown works
   - [ ] Add module to grid
   - [ ] Drag and drop works
   - [ ] Save layout works
   - [ ] Load layout works
   - [ ] Theme switching works
   - [ ] Delete layout works

### Step 2: E2E Testing (Optional)

Using Playwright:

```typescript
import { test, expect } from '@playwright/test';

test('Dashboard builder loads modules', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for modules to load
  await expect(page.getByText('Total Candidates')).toBeVisible();
  
  // Add module to grid
  await page.getByTestId('add-module-1').click();
  
  // Verify module appears in grid
  await expect(page.getByTestId('widget-Total Candidates')).toBeVisible();
});
```

## Deployment

### Production Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] API routes secured with authentication
- [ ] CORS configured if needed
- [ ] Rate limiting implemented
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Build optimizations enabled
- [ ] Static assets optimized

### Build Command

```bash
npm run build
```

### Database Migration (Production)

```bash
# On production server
npm run db:push

# Seed initial data (one-time)
tsx server/seed.ts
```

### Environment Variables (Production)

```bash
DATABASE_URL=postgresql://prod-user:password@prod-host:5432/prod-db
NODE_ENV=production
SESSION_SECRET=your-secret-key
```

## Troubleshooting

### Modules Not Loading

**Issue:** Empty module palette

**Solution:**
1. Check database connection
2. Verify seed script ran: `tsx server/seed.ts`
3. Check browser console for API errors
4. Verify API route is accessible

### Layout Not Saving

**Issue:** Save button doesn't work

**Solution:**
1. Check browser console for errors
2. Verify POST `/api/dashboard/layouts` endpoint works
3. Check authentication/user ID
4. Verify database permissions

### Drag and Drop Not Working

**Issue:** Cannot drag modules

**Solution:**
1. Verify `react-grid-layout` is installed
2. Check CSS imports in `index.css`:
```css
@import 'react-grid-layout/css/styles.css';
@import 'react-resizable/css/styles.css';
```
3. Clear browser cache

### TypeScript Errors

**Issue:** Type errors in components

**Solution:**
1. Ensure all type definitions are imported:
```typescript
import type { DashboardModule, LayoutItem } from '@shared/schema';
```
2. Run `npm install` to ensure all `@types/*` packages are installed

### Theme Not Applying

**Issue:** Theme changes don't reflect

**Solution:**
1. Check theme CSS is being injected
2. Verify theme ID is saved in layout
3. Check browser DevTools for CSS variables
4. Clear browser cache

## Next Steps

After successful integration:

1. ✅ Review [API Reference](./API_REFERENCE.md) for endpoint details
2. ✅ Check [Component Documentation](./COMPONENT_DOCS.md) for customization
3. ✅ See [Customization Guide](./CUSTOMIZATION_GUIDE.md) for advanced usage
4. ✅ Add custom modules specific to your application
5. ✅ Create additional templates for your user roles
6. ✅ Customize themes to match your brand

## Support

For issues or questions:
- Review this integration guide
- Check the [Troubleshooting](#troubleshooting) section
- Consult the [API Reference](./API_REFERENCE.md)
- Review component source code for implementation details
