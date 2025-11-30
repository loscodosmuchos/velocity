# Dashboard Builder Module

A comprehensive, production-ready dashboard builder system with drag-and-drop functionality, role-based templates, and theming support. Built for recruitment and operations platforms with 37 specialized widgets across 7 categories.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Components](#components)
- [Customization](#customization)
- [Migration Guide](#migration-guide)
- [Dependencies](#dependencies)
- [License](#license)

## 🎯 Overview

The Dashboard Builder Module provides a complete solution for creating customizable, role-based analytics dashboards. It features:

- **37 Pre-built Modules** across 7 categories (Recruitment, Procurement, Project Management, IT, VMS, Finance, Productivity)
- **8 Role-Based Templates** (Recruiter, CPO, Senior PM, IT Director, VMS Specialist, C-Suite, HR Director, Vendor Manager)
- **Drag-and-Drop Interface** powered by react-grid-layout
- **Theme Engine** with CSS custom properties
- **PostgreSQL Backend** with Drizzle ORM
- **Type-Safe API** with Zod validation

## ✨ Features

### Core Capabilities

- **Widget Catalog**: 37 specialized modules for different business functions
- **Template System**: Pre-configured layouts for different user roles
- **Customization**: Full drag-and-drop layout editor
- **Persistence**: Save and load custom dashboard configurations
- **Theming**: Dynamic theme switching with 3 pre-built themes
- **Responsive**: Mobile-friendly grid system
- **Type-Safe**: Full TypeScript support with Zod schemas

### Widget Categories

1. **Recruitment** (7 widgets): Candidate metrics, hiring funnels, interview tracking
2. **Procurement & Vendors** (9 widgets): Vendor performance, contract compliance, cost analysis
3. **Project Management** (7 widgets): Portfolio health, resource tracking, risk analysis
4. **IT & Systems** (6 widgets): Uptime monitoring, integration health, tech debt
5. **VMS & Contractors** (4 widgets): Compliance tracking, skills gap analysis
6. **Finance** (3 widgets): Budget tracking, cost analysis, spend trends
7. **Productivity** (1 widget): Quick actions panel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- React 18+
- TypeScript 5+

### Basic Setup

1. **Install Dependencies**:
```bash
npm install react-grid-layout @tanstack/react-query drizzle-orm zod
npm install @radix-ui/react-dialog @radix-ui/react-select lucide-react
```

2. **Copy Module Files**:
```bash
# Frontend components
cp -r client/src/components/dashboard ./your-project/src/components/
cp client/src/pages/DashboardBuilder.tsx ./your-project/src/pages/

# Backend services
cp -r server/services/DashboardService.ts ./your-project/server/services/
cp -r server/services/ThemeService.ts ./your-project/server/services/

# Shared schemas
cp shared/schema.ts ./your-project/shared/
```

3. **Setup Database**:
```bash
# Run migrations
npm run db:push

# Seed initial data
tsx server/seed.ts
```

4. **Add Routes**:
```typescript
// In your App.tsx
import { Route } from "wouter";
import DashboardBuilder from "./pages/DashboardBuilder";

<Route path="/dashboard" component={DashboardBuilder} />
```

## 🏗️ Architecture

### Three-Tier System

```
┌─────────────────────────────────────────┐
│         Module Catalog Layer            │
│  (37 pre-defined widget definitions)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Template Layer                   │
│  (8 role-based pre-configured layouts)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         User Override Layer              │
│  (Personal customizations & saved layouts)│
└──────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → TanStack Query → API Endpoint
                                                       ↓
                                                  Service Layer
                                                       ↓
                                              Database (PostgreSQL)
```

### Component Hierarchy

```
DashboardBuilder (Main Container)
├── ModulePalette (Sidebar)
│   └── Module Cards (grouped by category)
├── TemplateSelector (Dropdown)
│   └── Template Options (8 templates + saved layouts)
├── ThemeSelector (Dropdown)
│   └── Theme Options (3 themes)
├── GridLayout (Main Grid)
│   └── DashboardWidget[] (Individual widgets)
└── SaveLayoutDialog (Modal)
    └── Form (name, default checkbox)
```

## 📦 Installation

### Complete Installation

```bash
# 1. Install NPM dependencies
npm install react-grid-layout@1.4.4 \
  @tanstack/react-query@5.0.0 \
  drizzle-orm@0.33.0 \
  drizzle-zod@0.5.1 \
  zod@3.23.8 \
  @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-label \
  lucide-react \
  class-variance-authority \
  clsx \
  tailwind-merge

# 2. Install development dependencies
npm install -D drizzle-kit@0.24.0

# 3. Copy module files (see file structure below)

# 4. Update database schema
npm run db:push

# 5. Seed initial data
tsx server/seed.ts
```

### File Structure to Copy

```
your-project/
├── client/src/
│   ├── components/dashboard/
│   │   ├── DashboardWidget.tsx       ✓ Copy this
│   │   ├── GridLayout.tsx            ✓ Copy this
│   │   ├── ModulePalette.tsx         ✓ Copy this
│   │   ├── TemplateSelector.tsx      ✓ Copy this
│   │   ├── ThemeSelector.tsx         ✓ Copy this
│   │   └── SaveLayoutDialog.tsx      ✓ Copy this
│   └── pages/
│       └── DashboardBuilder.tsx      ✓ Copy this
├── server/
│   ├── services/
│   │   ├── DashboardService.ts       ✓ Copy this
│   │   └── ThemeService.ts           ✓ Copy this
│   ├── routes.ts                     ✓ Add routes from here
│   └── seed.ts                       ✓ Copy dashboard seed code
└── shared/
    └── schema.ts                     ✓ Copy dashboard schema
```

## ⚙️ Configuration

### Database Schema

The module requires 4 PostgreSQL tables:

```typescript
// From shared/schema.ts
- dashboard_modules          // Widget catalog
- dashboard_templates        // Role-based templates
- user_dashboard_layouts     // User customizations
- theme_tokens              // Theme configurations
```

### Environment Setup

No additional environment variables required. Uses existing database connection:

```bash
DATABASE_URL=your-postgres-connection-string
```

### TypeScript Configuration

Ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

## 📖 Usage

### Basic Example

```typescript
import DashboardBuilder from "./pages/DashboardBuilder";

function App() {
  return (
    <div className="min-h-screen">
      <DashboardBuilder />
    </div>
  );
}
```

### With Custom User ID

```typescript
// Modify in DashboardBuilder.tsx
const userId = useCurrentUser(); // Your auth hook

const { data: modules } = useQuery({
  queryKey: ['/api/dashboard/modules'],
});

const saveLayoutMutation = useMutation({
  mutationFn: async (layoutData) => {
    return apiRequest('/api/dashboard/layouts', {
      method: 'POST',
      body: JSON.stringify({ ...layoutData, userId }),
    });
  },
});
```

### Custom Module Renderer

```typescript
// In DashboardWidget.tsx, add custom renderer:

const renderCustomWidget = (module: DashboardModule) => {
  switch(module.name) {
    case 'My Custom Widget':
      return <MyCustomComponent />;
    default:
      return renderDefaultWidget(module);
  }
};
```

## 🔌 API Reference

### Endpoints

#### GET `/api/dashboard/modules`
Fetch available dashboard modules.

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": 1,
    "type": "kpi",
    "name": "Total Candidates",
    "description": "Total candidates in pipeline",
    "icon": "Users",
    "category": "recruitment",
    "defaultSize": { "w": 3, "h": 2, "minW": 2, "minH": 2 },
    "isEnabled": true
  }
]
```

#### GET `/api/dashboard/templates`
Fetch dashboard templates.

**Query Parameters:**
- `role` (optional): Filter by role (e.g., 'recruiter', 'executive')

**Response:**
```json
[
  {
    "id": 1,
    "name": "Recruiter Dashboard",
    "description": "Essential metrics for recruitment teams",
    "role": "recruiter",
    "layout": [
      { "i": "1", "x": 0, "y": 0, "w": 3, "h": 2, "moduleId": 1 }
    ],
    "isPublic": true,
    "isDefault": false
  }
]
```

#### POST `/api/dashboard/layouts`
Save a custom dashboard layout.

**Request Body:**
```json
{
  "name": "My Custom Dashboard",
  "layout": [
    { "i": "1", "x": 0, "y": 0, "w": 3, "h": 2, "moduleId": 1 }
  ],
  "isDefault": false,
  "themeId": 1
}
```

**Response:**
```json
{
  "id": 10,
  "userId": "user-123",
  "name": "My Custom Dashboard",
  "layout": [...],
  "isDefault": false,
  "themeId": 1,
  "createdAt": "2025-11-13T10:00:00Z"
}
```

#### GET `/api/dashboard/themes`
Fetch available themes.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Modern Professional",
    "description": "Clean, modern design",
    "tokens": {
      "colors": {
        "primary": { "h": 221, "s": 83, "l": 53 }
      },
      "spacing": { "base": 4, "scale": 1.5 },
      "typography": { "fontFamily": "Inter", "baseSize": 14 }
    },
    "isPublic": true
  }
]
```

### Full API Documentation

See [API_REFERENCE.md](./API_REFERENCE.md) for complete endpoint documentation.

## 🧩 Components

### DashboardBuilder

Main container component that orchestrates all dashboard functionality.

**Props:** None (self-contained)

**Features:**
- Loads modules, templates, and themes
- Manages grid layout state
- Handles save/load operations
- Coordinates child components

**Usage:**
```tsx
<DashboardBuilder />
```

### ModulePalette

Sidebar component displaying available modules grouped by category.

**Props:** 
```typescript
{
  modules: DashboardModule[];
  onAddModule: (module: DashboardModule) => void;
}
```

**Features:**
- Categorized module display
- Add module to grid functionality
- Collapsible category sections

### GridLayout

React-grid-layout wrapper with custom behavior.

**Props:**
```typescript
{
  layout: LayoutItem[];
  modules: DashboardModule[];
  onLayoutChange: (newLayout: LayoutItem[]) => void;
  onRemoveModule: (moduleId: number) => void;
}
```

**Features:**
- Drag-and-drop interface
- Module ID persistence
- Responsive breakpoints
- Auto-save on layout change

### DashboardWidget

Individual widget renderer with demo data.

**Props:**
```typescript
{
  module: DashboardModule;
  onRemove: () => void;
}
```

**Features:**
- Renders KPIs, charts, tables, and custom widgets
- Demo data for all 37 modules
- Remove button
- Fallback for unknown modules

## 🎨 Customization

### Adding Custom Modules

1. **Insert into database:**
```typescript
await db.insert(dashboardModules).values({
  type: 'kpi',
  name: 'My Custom Metric',
  description: 'Custom business metric',
  icon: 'TrendingUp',
  category: 'custom',
  defaultSize: { w: 3, h: 2 },
  isEnabled: true,
});
```

2. **Add renderer in DashboardWidget.tsx:**
```typescript
case 'My Custom Metric':
  return (
    <Card>
      <CardHeader>
        <CardTitle>{module.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">$1.2M</div>
        <p className="text-sm text-muted-foreground">Custom data</p>
      </CardContent>
    </Card>
  );
```

### Creating Custom Templates

```typescript
await db.insert(dashboardTemplates).values({
  name: 'Custom Role Dashboard',
  description: 'Dashboard for custom role',
  role: 'custom_role',
  layout: [
    { i: '1', x: 0, y: 0, w: 6, h: 4, moduleId: 1 },
    { i: '2', x: 6, y: 0, w: 6, h: 4, moduleId: 5 },
  ],
  isPublic: true,
  isDefault: false,
});
```

### Custom Themes

```typescript
await db.insert(themeTokens).values({
  name: 'My Custom Theme',
  description: 'Corporate branding theme',
  tokens: {
    colors: {
      primary: { h: 210, s: 100, l: 50 },
      background: { h: 0, s: 0, l: 100 },
      foreground: { h: 0, s: 0, l: 0 },
    },
    spacing: { base: 4, scale: 1.5 },
    typography: { fontFamily: 'Inter', baseSize: 14 },
    borderRadius: { sm: 4, md: 8, lg: 12 },
  },
  isPublic: true,
});
```

## 🔄 Migration Guide

### From Version 1.0 to 2.0

If you were using the initial 12-module version:

```bash
# 1. Backup existing data
pg_dump your_database > backup.sql

# 2. Update schema
npm run db:push

# 3. Re-seed with expanded data
tsx server/seed.ts

# 4. Migrate user layouts (if needed)
# Layouts are preserved, new modules available in palette
```

### Integrating into Existing App

1. **Install dependencies** (see Installation section)
2. **Copy files** to your project structure
3. **Add database tables** via `npm run db:push`
4. **Add API routes** to your Express app
5. **Seed initial data** with `tsx server/seed.ts`
6. **Add route** to your React router
7. **Test** dashboard functionality

## 📚 Dependencies

### Required

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-grid-layout": "^1.4.4",
  "@tanstack/react-query": "^5.0.0",
  "drizzle-orm": "^0.33.0",
  "drizzle-zod": "^0.5.1",
  "zod": "^3.23.8",
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-select": "^2.0.0",
  "lucide-react": "latest",
  "tailwindcss": "^3.4.0"
}
```

### Development

```json
{
  "typescript": "^5.0.0",
  "drizzle-kit": "^0.24.0",
  "@types/react": "^18.0.0",
  "@types/react-grid-layout": "^1.3.5"
}
```

### Peer Dependencies

- PostgreSQL 14+
- Node.js 18+

## 📝 License

This module is part of the RecruitOps Platform. See project LICENSE for details.

## 🤝 Support

For issues, questions, or contributions:
- Review the [API Reference](./API_REFERENCE.md)
- Check the [Integration Guide](./INTEGRATION_GUIDE.md)
- See the [Component Documentation](./COMPONENT_DOCS.md)

## 🎯 Next Steps

1. Review the [Integration Guide](./INTEGRATION_GUIDE.md) for detailed setup
2. Explore the [API Reference](./API_REFERENCE.md) for endpoint details
3. Check [Component Documentation](./COMPONENT_DOCS.md) for props and usage
4. See [Customization Examples](./CUSTOMIZATION_GUIDE.md) for advanced use cases
