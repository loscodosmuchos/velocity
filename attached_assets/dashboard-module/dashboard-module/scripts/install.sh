#!/bin/bash
# Dashboard Builder Module - Installation Script
# This script copies module files to your project with safety checks

set -e

echo "🎨 Dashboard Builder Module Installer"
echo "======================================"
echo ""

# Check if project root is provided
if [ -z "$1" ]; then
  echo "❌ Error: Please provide your project root directory"
  echo "Usage: ./install.sh /path/to/your/project"
  exit 1
fi

PROJECT_ROOT="$1"
MODULE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "📁 Project root: $PROJECT_ROOT"
echo "📦 Module directory: $MODULE_DIR"
echo ""

# Verify project structure
if [ ! -d "$PROJECT_ROOT" ]; then
  echo "❌ Error: Project directory does not exist: $PROJECT_ROOT"
  exit 1
fi

# Safety check - warn if files already exist
if [ -f "$PROJECT_ROOT/client/src/pages/DashboardBuilder.tsx" ]; then
  echo "⚠️  Warning: DashboardBuilder.tsx already exists"
  read -p "Overwrite existing files? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Installation cancelled"
    exit 1
  fi
fi

# Create necessary directories
echo "📂 Creating directory structure..."
mkdir -p "$PROJECT_ROOT/client/src/components/dashboard"
mkdir -p "$PROJECT_ROOT/client/src/pages"
mkdir -p "$PROJECT_ROOT/server/services"
mkdir -p "$PROJECT_ROOT/server/routes"
mkdir -p "$PROJECT_ROOT/shared"
mkdir -p "$PROJECT_ROOT/docs/dashboard-module"

# Copy frontend components
echo "⚛️  Copying frontend components..."
cp -r "$MODULE_DIR/frontend/dashboard/"* "$PROJECT_ROOT/client/src/components/dashboard/"
cp "$MODULE_DIR/frontend/DashboardBuilder.tsx" "$PROJECT_ROOT/client/src/pages/"
cp "$MODULE_DIR/frontend/index.ts" "$PROJECT_ROOT/client/src/components/dashboard/index.ts"

# Copy backend services
echo "🔧 Copying backend services..."
cp "$MODULE_DIR/backend/DashboardService.ts" "$PROJECT_ROOT/server/services/"
cp "$MODULE_DIR/backend/ThemeService.ts" "$PROJECT_ROOT/server/services/"
cp "$MODULE_DIR/backend/index.ts" "$PROJECT_ROOT/server/services/dashboard-services.ts"

# Copy schema extract
echo "🗄️  Copying schema definitions..."
cp "$MODULE_DIR/shared/schema-extract.ts" "$PROJECT_ROOT/shared/"

# Copy seed script
echo "🌱 Copying seed script..."
cp "$MODULE_DIR/seeds/seed-dashboard.ts" "$PROJECT_ROOT/server/"

# Copy documentation
echo "📚 Copying documentation..."
cp "$MODULE_DIR/"*.md "$PROJECT_ROOT/docs/dashboard-module/"

# Create API routes template
echo "📝 Creating API routes template..."
cat > "$PROJECT_ROOT/server/routes/dashboard-routes-template.ts" << 'EOF'
// Dashboard Builder API Routes Template
// Copy these routes into your main server/routes.ts file

import type { Express } from 'express';
import { dashboardService } from '../services/DashboardService';
import { themeService } from '../services/ThemeService';
import { seedDatabase } from '../seed-dashboard';

export function registerDashboardRoutes(app: Express) {
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
      // TODO: Replace this hardcoded value with actual user ID from your auth system
      // Example: const userId = (req as any).user?.id || req.session?.userId || "guest";
      const userId = "REPLACE_WITH_USER_ID";
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
      // TODO: Replace this hardcoded value with actual user ID from your auth system
      // Example: const userId = (req as any).user?.id || req.session?.userId || "guest";
      const userId = "REPLACE_WITH_USER_ID";
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
      // TODO: Replace this hardcoded value with actual user ID from your auth system
      // Example: const userId = (req as any).user?.id || req.session?.userId || "guest";
      const userId = "REPLACE_WITH_USER_ID";
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

  // Seed database (development only)
  app.post("/api/dashboard/seed", async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: "Seeding not allowed in production" });
    }
    
    try {
      await seedDatabase();
      res.json({ success: true, message: "Database seeded successfully" });
    } catch (error: any) {
      console.error("Seed error:", error);
      res.status(500).json({ error: error.message || "Failed to seed database" });
    }
  });
}
EOF

echo ""
echo "✅ Files copied successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Install dependencies:"
echo "   npm install react-grid-layout @tanstack/react-query drizzle-orm drizzle-zod zod"
echo "   npm install @radix-ui/react-dialog @radix-ui/react-select lucide-react"
echo ""
echo "2. Merge database schema:"
echo "   - Open shared/schema-extract.ts"
echo "   - Copy the table definitions into your shared/schema.ts"
echo "   - Merge with any existing tables"
echo ""
echo "3. Add API routes:"
echo "   - See server/routes/dashboard-routes-template.ts"
echo "   - Copy routes into your server/routes.ts"
echo "   - Update user ID retrieval for your auth system"
echo ""
echo "4. Run database migration:"
echo "   npm run db:push"
echo ""
echo "5. Seed initial data:"
echo "   tsx server/seed-dashboard.ts"
echo ""
echo "6. Add route to your React router:"
echo "   import DashboardBuilder from './pages/DashboardBuilder';"
echo "   <Route path=\"/dashboard\" component={DashboardBuilder} />"
echo ""
echo "📚 Complete documentation:"
echo "   - docs/dashboard-module/README.md (Quick start)"
echo "   - docs/dashboard-module/INTEGRATION_GUIDE.md (Detailed setup)"
echo "   - docs/dashboard-module/API_REFERENCE.md (API docs)"
echo "   - docs/dashboard-module/COMPONENT_DOCS.md (Component usage)"
echo ""
