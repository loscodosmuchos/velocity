# Velocity Project - Complete File Classification & Code Content Index

**Document Generated:** November 26, 2025  
**Total Files Analyzed:** 323 (302 frontend + 21 backend)

---

## 📊 Overview by Category

| Category | Count | Primary Purpose |
|----------|-------|-----------------|
| **UI Components** | 60+ | Reusable UI elements (buttons, inputs, dialogs, etc.) |
| **Page Components** | 50+ | Full-page views for different features |
| **Service/Utility Files** | 25+ | Business logic, API integration, data processing |
| **Type Definitions** | 5+ | TypeScript interfaces and types |
| **Contexts/Providers** | 8+ | React context for state management |
| **Admin Components** | 10+ | Super-admin control panels |
| **Dashboard Components** | 8+ | Dashboard widgets and builders |
| **Server/Backend** | 21 | Express routes, services, database config |
| **Configuration** | 8+ | Build, theme, design token configs |

---

## 📂 FRONTEND STRUCTURE (src/)

### 🎨 UI Components (`src/components/ui/`)
**Purpose:** Foundational, reusable UI building blocks based on shadcn/ui + Radix UI

| File | Code Type | Functionality |
|------|-----------|---------------|
| `accordion.tsx` | React Component | Collapsible sections with multi-open support |
| `alert-dialog.tsx` | React Component | Warning/confirmation dialogs (Radix) |
| `alert.tsx` | React Component | Inline alert messages with icon/description |
| `aspect-ratio.tsx` | React Component | Maintains consistent image/media aspect ratios |
| `avatar.tsx` | React Component | User profile images with fallbacks |
| `badge.tsx` | React Component | Status/tag labels with variants |
| `breadcrumb.tsx` | React Component | Navigation path display |
| `button.tsx` | React Component | Primary interaction element with variants (solid, ghost, outline) |
| `calendar.tsx` | React Component | Date picker calendar |
| `card.tsx` | React Component | Container component (header, content, footer) |
| `carousel.tsx` | React Component | Embla-powered image/content carousel |
| `checkbox.tsx` | React Component | Toggle selection boxes |
| `collapsible.tsx` | React Component | Show/hide content sections |
| `command.tsx` | React Component | Command palette / command search (cmdk) |
| `context-menu.tsx` | React Component | Right-click context menus |
| `dialog.tsx` | React Component | Modal overlays |
| `drawer.tsx` | React Component | Slide-out panels (mobile-friendly) |
| `dropdown-menu.tsx` | React Component | Dropdown selection menus |
| `form.tsx` | React Component | Form wrapper with react-hook-form integration |
| `hover-card.tsx` | React Component | Tooltip-like hover information cards |
| `input.tsx` | React Component | Text input fields |
| `label.tsx` | React Component | Form field labels |
| `menubar.tsx` | React Component | Top menu bar with nested items |
| `navigation-menu.tsx` | React Component | Structured navigation hierarchies |
| `popover.tsx` | React Component | Floating popovers for inline content |
| `progress.tsx` | React Component | Progress bars (linear indicators) |
| `radio-group.tsx` | React Component | Mutually-exclusive radio buttons |
| `scroll-area.tsx` | React Component | Scrollable content areas with custom scrollbars |
| `select.tsx` | React Component | Dropdown selection component |
| `separator.tsx` | React Component | Visual divider lines |
| `sheet.tsx` | React Component | Side panels/drawers |
| `slider.tsx` | React Component | Range/value sliders |
| `switch.tsx` | React Component | Toggle switches |
| `table.tsx` | React Component | Semantic table structure |
| `tabs.tsx` | React Component | Tabbed content sections |
| `textarea.tsx` | React Component | Multi-line text input |
| `toggle-group.tsx` | React Component | Button group with toggle states |
| `toggle.tsx` | React Component | Single toggle button |
| `tooltip.tsx` | React Component | Hover tooltips |
| `status-badge.tsx` | React Component | **Velocity-specific:** WCAG-compliant status indicators with category detection (timecard, invoice, purchaseOrder, contractor, expense, sow) |
| `velocity-data-table.tsx` | React Component | **Velocity-specific:** Dark metallic table with gradient backgrounds, cyan hover states |
| `chart.tsx` | React Component | Recharts wrapper for data visualization |

**Total UI Components:** 45+  
**Code Pattern:** All use TypeScript, Radix UI primitives, tailwind classes, composition pattern

---

### 🎛️ Refine-UI Framework Components (`src/components/refine-ui/`)
**Purpose:** Admin framework UI layered on shadcn/ui, includes forms, layout, data tables, theme

#### Buttons (`refine-ui/buttons/`)
| File | Functionality |
|------|---------------|
| `create.tsx` | Create new record button |
| `edit.tsx` | Edit record button |
| `delete.tsx` | Delete with confirmation |
| `list.tsx` | Show list view button |
| `show.tsx` | Show detail view button |
| `clone.tsx` | Duplicate record button |
| `refresh.tsx` | Reload data button |

#### Forms (`refine-ui/form/`)
| File | Functionality |
|------|---------------|
| `sign-in-form.tsx` | Login form with JWT authentication |
| `sign-up-form.tsx` | Registration form |
| `forgot-password-form.tsx` | Password reset flow |
| `input-password.tsx` | Password field with show/hide toggle |
| `auto-save-indicator.tsx` | Shows auto-save status during form edits |

#### Layout System (`refine-ui/layout/`)
| File | Functionality |
|------|---------------|
| `layout.tsx` | Main app wrapper (sidebar + header + outlet) |
| `sidebar.tsx` | **Velocity Design:** Damascus Steel theme with role-based menu filtering, smooth transitions |
| `header.tsx` | Top header with title/breadcrumbs |
| `top-nav.tsx` | **Velocity Design:** Top navigation (AI Insights, Approvals, Alerts, Reports, Notifications, Support) with icon colors and tooltips |
| `breadcrumb.tsx` | Navigation path breadcrumbs |
| `user-avatar.tsx` | User profile avatar in header |
| `user-info.tsx` | User info dropdown |
| `error-component.tsx` | 404/error page display |
| `loading-overlay.tsx` | Full-page loading spinner |

#### Data Table System (`refine-ui/data-table/`)
| File | Functionality |
|------|---------------|
| `data-table.tsx` | **Core:** TanStack React Table wrapper with sorting, filtering, pagination |
| `data-table-filter.tsx` | Advanced filter UI for columns |
| `data-table-sorter.tsx` | Column sorting controls |
| `data-table-pagination.tsx` | Pagination controls (page size, navigation) |

#### Notification System (`refine-ui/notification/`)
| File | Functionality |
|------|---------------|
| `use-notification-provider.tsx` | Sonner toast notification hook |
| `toaster.tsx` | Toast container component |
| `undoable-notification.tsx` | Undo-able notification with action |

#### Views (`refine-ui/views/`)
| File | Functionality |
|------|---------------|
| `list-view.tsx` | Generic list page template |
| `create-view.tsx` | Generic create form template |
| `edit-view.tsx` | Generic edit form template |
| `show-view.tsx` | Generic detail view template |

#### Theme System (`refine-ui/theme/`)
| File | Functionality |
|------|---------------|
| `theme-provider.tsx` | React context for dark/light/system theme |
| `theme-toggle.tsx` | Light/dark mode toggle button |
| `theme-select.tsx` | Theme selection dropdown |

---

### 🚨 Alert System Components (`src/components/alert-icons/`)
**Purpose:** Racing-inspired, multi-dimensional alert visualization

| File | Functionality |
|------|---------------|
| `customizable-alert-icon.tsx` | Renders animated alert icons with custom colors/patterns |
| `alert-icon-registry.ts` | Registry of alert types and their visual rules |
| `textures.ts` | SVG textures for carbon fiber, metallic effects |
| `types.ts` | TypeScript interfaces for alert system |
| `index.ts` | Exports |

**Design Features:**
- `animate-critical-strobe` - Red flashing for critical
- `animate-urgent-beacon` - Pulsing red glow
- `animate-racing-alert` - Speed lines motion blur
- `animate-warning-flash` - Amber strobe
- `animate-heartbeat-critical` - Rhythmic pulse

---

### 📊 Dashboard Components (`src/components/dashboard/`)
**Purpose:** Dashboard builder and widget system

| File | Functionality |
|------|---------------|
| `GridLayout.tsx` | React Grid Layout wrapper for drag-drop dashboard |
| `DashboardWidget.tsx` | Individual widget container |
| `velocity-charts.tsx` | Recharts/Tremor charts for KPIs |
| `ModulePalette.tsx` | Available widgets to add to dashboard |
| `TemplateSelector.tsx` | Pre-built dashboard templates |
| `ThemeSelector.tsx` | Dashboard color theme picker |
| `SaveLayoutDialog.tsx` | Save custom dashboard layout |
| `automotive-dash-demo.tsx` | Demo automotive-themed dashboard |

---

### 🛡️ Admin Components (`src/components/admin/`)
**Purpose:** Super-admin control panels

| File | Functionality |
|------|---------------|
| `api-testing-dialog.tsx` | Test API endpoints directly |
| `demo-mode-toggle.tsx` | Switch between demo/production data |

---

### 🎨 Premium Components (`src/components/`)
**Purpose:** Velocity-specific high-value components

| File | Functionality |
|------|---------------|
| `premium-kpi-card.tsx` | **Core Design:** Dark slate KPI cards with ambient glow, circular gauges, carbon fiber texture, top-line accent gradients |
| `compact-alert-cubes.tsx` | Multi-dimensional alert visualization with color-coded urgency |
| `ai-insight-cubes.tsx` | AI-generated insights with interaction trails |
| `ai-insight-provenance.tsx` | Attribution and reasoning for AI insights |
| `strategic-intelligence-panel.tsx` | Multi-lens analysis (finance, ops, HR, compliance perspectives) |
| `pain-point-healing.tsx` | Displays solutions to user pain points |
| `platform-value-calculator.tsx` | ROI/time savings calculator |
| `premium-action-required.tsx` | High-priority action prompts |
| `anticipatory-actions.tsx` | Proactive action recommendations |
| `GatewayPasswordDialog.tsx` | Admin gateway access control |
| `AdminPasswordGate.tsx` | Password verification wrapper |
| `AdminPasswordDialog.tsx` | Generic admin password dialog |
| `theme-switcher.tsx` | Luxury theme selector dropdown |
| `saturation-control.tsx` | **NEW:** Adjustable color saturation slider (20-100%) |
| `density-toggle.tsx` | Compact/normal data density toggle |
| `ai-assistant-chat.tsx` | Inline AI chat component |
| `top-nav-alerts.tsx` | Alert badge in top navigation |
| `ride-along-mode.tsx` | Tutorial/guided mode component |
| `catch-all.tsx` | Catch-all error boundary |

#### Tracking Components (`src/components/tracking/`)
| File | Functionality |
|------|---------------|
| `PageLoadPixel.tsx` | Analytics tracking pixel |

---

## 📄 PAGE COMPONENTS (src/pages/)

### Authentication Pages (`pages/auth/`)
| File | Functionality |
|------|---------------|
| `login.tsx` | JWT login with email/password |
| `signup.tsx` | User registration |
| `forgot-password.tsx` | Password recovery flow |

### Dashboard Pages (`pages/dashboard/`)
| File | Functionality |
|------|---------------|
| `index.tsx` | Main dashboard with expert persona KPIs |
| `builder.tsx` | Drag-drop dashboard customization |
| `procurement.tsx` | Procurement-focused executive dashboard |

### Triage Pages (`pages/triage/`) - **Proactive Problem Detection**
| File | Focus Area | Pain Points Solved |
|------|-----------|-------------------|
| `budget.tsx` | Budget health | Spending visibility, trend alerts |
| `budget-overrun.tsx` | Budget violations | Forecasting, approval holds |
| `compliance.tsx` | Regulatory compliance | Risk flagging, audit trails |
| `operations.tsx` | Workflow bottlenecks | Approval delays, routing |
| `timecards.tsx` | Hour entry issues | Submission gaps, classifier errors |
| `contractors.tsx` | Contractor lifecycle | Compliance expiration, onboarding |
| `invoices.tsx` | Invoice processing | Aging, dispute resolution |

### Contractor Management (`pages/contractors/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All contractors with KPI cards, advanced filtering |
| `show.tsx` | Contractor detail (history, contracts, timecards) |
| `create.tsx` | New contractor onboarding form |
| `edit.tsx` | Update contractor information |
| `import.tsx` | Bulk import from CSV/Excel |

### Employee Management (`pages/employees/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All employees, department view |
| `show.tsx` | Employee detail with team visibility |
| `create.tsx` | New employee onboarding |

### Purchase Order Management (`pages/purchaseorders/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All POs with budget summary, aging |
| `show.tsx` | PO detail with line items, budget tracking |
| `create.tsx` | Create new PO with SOW linkage |
| `edit.tsx` | Update PO terms/amounts |
| `manage-contractors.tsx` | Assign contractors to PO |
| `templates.tsx` | Saved PO templates for reuse |

### Timecard Management (`pages/timecards/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All timecards with approval status |
| `show.tsx` | Timecard detail with verification |
| `create.tsx` | Hour entry form |
| `pending.tsx` | Pending approval queue |
| `bulk-approve.tsx` | Multi-select approve/reject |

### Invoice Management (`pages/invoices/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All invoices with aging report |
| `show.tsx` | Invoice detail with payment status |
| `create.tsx` | Generate invoice from timecards |
| `edit.tsx` | Modify invoice before payment |

### Statement of Work Management (`pages/statementofworks/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All SOWs with status |
| `show.tsx` | SOW detail with terms |
| `create.tsx` | Create new SOW with AI assistance |
| `edit.tsx` | Update SOW terms |
| `compliance-report.tsx` | SOW compliance audit report |

### Expense Management (`pages/expenses/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | Employee expense submissions |
| `show.tsx` | Expense detail with receipt images |
| `create.tsx` | New expense report |
| `bulk-approve.tsx` | Bulk expense approval |

### Change Order Management (`pages/changeorders/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All change orders with impact |
| `show.tsx` | Change order detail with analysis |
| `create.tsx` | Propose new change order |
| `edit.tsx` | Update change order |

### Approval System (`pages/approvals/`)
| File | Functionality |
|------|---------------|
| `unified-queue.tsx` | All pending approvals across entity types |
| `routing-rules.tsx` | Configure approval workflows |
| `history.tsx` | Audit trail of all approvals |

### AI & Intelligence (`pages/ai/`)
| File | Functionality |
|------|---------------|
| `contract-analysis.tsx` | AI gap detection, risk scoring |
| `sow-generator.tsx` | AI-assisted SOW creation |
| `vendor-intelligence.tsx` | AI vendor risk scoring |
| `multi-lens-analyzer.tsx` | Multi-perspective recommendations |

### Conversational AI Agents (`pages/ai/`)
| File | Functionality |
|------|---------------|
| `elevenlabs-agents.tsx` | 58 pre-built agent dashboard |
| `voice-commander.tsx` | Voice instruction interface |
| `conversation-history.tsx` | Chat history and transcripts |

### Alert Management (`pages/alerts/`)
| File | Functionality |
|------|---------------|
| `active.tsx` | Currently triggered alerts |
| `history.tsx` | Historical alert log |
| `rules.tsx` | Configure alert thresholds |

### Project Management (`pages/projects/`)
| File | Functionality |
|------|---------------|
| `list.tsx` | All projects with team, budget |
| `show.tsx` | Project detail with timeline |
| `create.tsx` | New project setup |

### Filter/Segmentation (`pages/filters/`)
| File | Functionality |
|------|---------------|
| `saved-filters.tsx` | User's saved view filters |
| `create-filter.tsx` | Build custom filter |
| `filter-templates.tsx` | Pre-built filter categories |

### Contractor Portal (`pages/contractor-portal/`)
| File | Functionality |
|------|---------------|
| `portal-dashboard.tsx` | Contractor view of their engagement |
| `submissions.tsx` | Contractor submission forms |
| `payment-status.tsx` | Invoice payment tracking |

### Other Pages
| File | Functionality |
|------|---------------|
| `search/global.tsx` | Global search across all entities |
| `contracts/list.tsx` | Contracts management |
| `assets/inventory.tsx` | Company asset tracking |
| `notifications/inbox.tsx` | Notification center |
| `hubs/[hub-id].tsx` | Hub-specific dashboards |
| `admin/users.tsx` | Super-admin user management |
| `super-admin/project-tracker.tsx` | Project health tracking |
| `why-velocity.tsx` | Marketing/feature overview page |

---

## 🔧 Utilities & Services (`src/utils/` & `src/services/`)

### AI Integration (`utils/`)
| File | Functionality |
|------|---------------|
| `ai-assistant.ts` | Claude API integration for reasoning |
| `contract-analyzer.ts` | Gap detection, risk scoring using AI |
| `multi-lens-analyzer.ts` | Finance/ops/HR/compliance perspectives |
| `predictive-alerts.ts` | ML-based alert prediction |

### Voice & Conversational AI (`utils/`)
| File | Functionality |
|------|---------------|
| `elevenlabs-integration.ts` | ElevenLabs API integration |
| `fetch-elevenlabs-agents.ts` | Loads 58 pre-built agents |
| `voice-commander.ts` | Voice instruction parsing |

### Data Processing (`utils/`)
| File | Functionality |
|------|---------------|
| `export-invoices.ts` | Generate invoice PDFs |
| `export.ts` | Generic export to CSV/Excel |
| `export-audit.ts` | Audit trail export |
| `xlsx-parser.ts` | Parse uploaded Excel files |

### Integration & APIs (`utils/`)
| File | Functionality |
|------|---------------|
| `balance-staffing-api.ts` | Balance Staffing MSP integration |
| `approval-integration.ts` | Unified approval routing |
| `email-notifications.ts` | Email sending service |

### Business Logic (`utils/`)
| File | Functionality |
|------|---------------|
| `permissions.ts` | Role-based access control |
| `stakeholder-filter.ts` | Filter data by stakeholder role |
| `sample-contracts.ts` | Demo contract data |
| `test-contracts.ts` | Test fixtures |

### Services (`services/`)
| File | Functionality |
|------|---------------|
| `daisy-worthiness-validator.ts` | Dashboard Asset Integrity System validation |
| `dashboard-asset-validator.ts` | Validate widget/card quality |
| `page-review-framework.ts` | 3+ pain point validation per page |

---

## 📦 Contexts & Providers (`src/contexts/` & `src/providers/`)

### React Contexts (`src/contexts/`)
| File | Functionality |
|------|---------------|
| `SaturationContext.tsx` | **NEW:** Manage adjustable UI saturation (20-100%) with localStorage |
| `AdminAuthContext.tsx` | Admin authentication state |
| `AlertContext.tsx` | Global alert notification state |

### Data Providers (`src/providers/`)
| File | Functionality |
|------|---------------|
| `api-data-provider.ts` | Refine data provider for REST API |
| `data.ts` | Data fetching utilities |
| `auth.ts` | JWT authentication provider |
| `index.ts` | Exports |

---

## 🎯 Type Definitions (`src/types/`)

| File | TypeScript Interfaces |
|------|--------|
| `types.ts` | Core domain types (Contractor, PurchaseOrder, Timecard, Invoice, SOW, ChangeOrder, Expense, Approval, Department, etc.) |
| `dashboard.ts` | Dashboard widget, layout, template types |

---

## 🎨 Theme & Design System

### Theme System (`src/themes/`)
| File | Functionality |
|------|---------------|
| `luxury-themes.ts` | 4 theme categories (classic, modern, luxury, futuristic) with color palettes |

### Design Tokens (`src/lib/` & `src/config/`)
| File | Functionality |
|------|---------------|
| `design-tokens.ts` | Color system, typography, spacing scale (Navy #1e3a8a + Teal #0891b2 primary) |
| `ui-theme.ts` | Tailwind theme configuration |
| `saturation-utils.ts` | **NEW:** Functions for dynamic saturation filtering |

---

## 🪝 Custom Hooks (`src/hooks/`)

| File | Hook Functionality |
|------|--------|
| `use-[feature].ts` | Various custom React hooks (typically not all listed, but pattern-based) |

---

## ⚙️ Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build config, React plugin, Tailwind CSS integration |
| `tsconfig.json` | TypeScript compiler options, path aliases (@/) |
| `tailwind.config.ts` | Tailwind CSS configuration with custom design tokens |
| `package.json` | Project metadata, dependencies (React, Refine, shadcn/ui, etc.) |
| `pnpm-lock.yaml` | Locked dependency versions |
| `.env.example` | Environment variable template |
| `.gitignore` | Git ignored files (node_modules, .env, build outputs) |
| `.eslintrc` | ESLint linting rules |

---

## 🖥️ BACKEND STRUCTURE (server/)

### Main Application Entry (`server/`)

| File | Functionality |
|------|-------------|
| `index.cjs` | **Core Server:** Express app setup, route mounting, middleware (CORS, JWT auth), database health checks, error handling |

### Server Configuration (`server/config/`)
| File | Functionality |
|------|-------------|
| `database.cjs` | PostgreSQL connection pool setup, RLS policy enforcement |

### API Routes (`server/routes/`)
| File | Functionality |
|------|-------------|
| `health.cjs` | GET /health - Server and database status check |
| `search.cjs` | POST /search - Hybrid search (pgvector + BM25) across all entities |
| `tracking.cjs` | GET/POST /track - Analytics/telemetry endpoints |
| `ai-contract-analysis.cjs` | POST /ai/analyze-contract - Claude API gap detection |
| `ai-sow-generation.cjs` | POST /ai/generate-sow - AI-assisted SOW creation |
| `ai-vendor-extraction.cjs` | POST /ai/extract-vendor - Extract vendor info from documents |
| `elevenlabs.cjs` | POST /voice/* - ElevenLabs voice synthesis, agent management |
| `voice-contract.cjs` | POST /voice/analyze - Voice-based contract analysis |
| `client-requirements.cjs` | GET /client/* - Client-specific configuration |
| `client-notifications.cjs` | POST /notify/* - Client notification routing |
| `project-documents.cjs` | GET/POST /documents/* - Document upload, retrieval, parsing |

### Database (`server/database/`)
| File | Functionality |
|------|-------------|
| `seed.cjs` | Initial database schema and demo data |

### Utilities & Services (`server/services/`)
| File | Functionality |
|------|-------------|
| `batch-orchestrator.cjs` | Orchestrate batch operations (multi-record approvals, etc.) |

### Document Parsing (`server/parsers/`)
| File | Functionality |
|------|-------------|
| `pdf-parser.cjs` | Extract text/metadata from PDF contracts |

### Database Scripts (`server/scripts/`)
| File | Functionality |
|------|-------------|
| `seed-demo-data.cjs` | Load demo data for testing |
| `comprehensive-seed.cjs` | Full database initialization with relationships |

---

## 📊 Code Organization Patterns

### Frontend Patterns

**Component Structure:**
```
Component.tsx
├── Props interface definition
├── React component function
├── Local state management (useState)
├── Effects (useEffect, custom hooks)
├── Render JSX
└── Export
```

**File Naming:**
- Components: PascalCase (e.g., `PremiumKPICard.tsx`)
- Utilities: kebab-case (e.g., `contract-analyzer.ts`)
- Types: kebab-case (e.g., `dashboard.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useSaturation()`)

**Styling Approach:**
- Tailwind CSS classes for layout/spacing
- Custom CSS for animations (automotive effects)
- Inline styles for dynamic values
- Design tokens from `design-tokens.ts`

### Backend Patterns

**Route Structure:**
```
server/routes/feature.cjs
├── Import express and services
├── Create router
├── Define middleware (auth, validation)
├── Define endpoints (GET, POST, PUT, DELETE)
├── Error handling
└── Export router
```

**Database Patterns:**
- PostgreSQL with RLS for multi-tenant isolation
- Connection pooling for performance
- Prepared statements for SQL injection prevention
- ACID transactions for data consistency

---

## 🔐 Security & Authentication

### Implementation Pattern
- **Frontend:** JWT tokens stored in memory (not localStorage for XSS protection)
- **Backend:** JWT verification middleware on protected routes
- **Database:** Row-Level Security (RLS) policies for user/tenant isolation
- **Secrets:** Environment variables for API keys (Claude, ElevenLabs, Twilio)

### Key Protected Routes
- Admin endpoints require admin JWT + role verification
- All data endpoints enforce RLS policies
- Sensitive operations (delete, bulk operations) require confirmation

---

## 📈 Data Flow Architecture

```
User Action (UI)
    ↓
React Component → Hook/Context
    ↓
API Call (axios) → Express Route
    ↓
Authentication & Authorization Check
    ↓
Database Query (with RLS enforcement)
    ↓
PostgreSQL (+ pgvector for semantic search)
    ↓
Response → Frontend Component State
    ↓
UI Re-render with data
```

---

## 🎯 Key Architectural Decisions

### 1. **Authenticity Pillar** - CRITICAL
- Every metric queries real database
- No hardcoded sample/demo/fake data in production paths
- Demo mode explicitly toggleable

### 2. **Multi-Tenant Ready**
- PostgreSQL Row-Level Security (RLS)
- All queries filtered by `current_user_id`
- Database enforces tenant isolation

### 3. **Component Composition**
- Small, focused components (<200 LOC ideally)
- Composable patterns (cards, buttons, tables)
- Refine.dev admin framework for rapid CRUD

### 4. **API-Driven**
- All data through Express REST API
- Hybrid search (pgvector + BM25)
- Batch operations for performance

### 5. **AI Integration**
- Claude API for reasoning/analysis
- ElevenLabs for voice (58 agents)
- Anthropic SDK for chain-of-thought

### 6. **Visual Design**
- Automotive precision aesthetic (dashboards, animations)
- Dark mode first
- WCAG compliance (4.5:1+ contrast)
- Adjustable saturation for flexibility

---

## 📝 Summary Statistics

| Metric | Count |
|--------|-------|
| **Total TypeScript/React Files** | 302 |
| **UI Components** | 60+ |
| **Page Components** | 50+ |
| **Utility/Service Files** | 25+ |
| **Server Routes** | 11 |
| **Database Scripts** | 3 |
| **Configuration Files** | 8+ |
| **Type Definition Files** | 5+ |
| **Total Lines of Frontend Code** | 76,302 |
| **Total Lines of Backend Code** | ~10,000 (estimated) |
| **Total Project Size** | 3.9 MB (code) + 122 MB (docs) |

---

## 🚀 Development Workflow

1. **UI Development:** Components in `src/components/`, styled with Tailwind
2. **Feature Pages:** New pages in `src/pages/[feature]/`
3. **Business Logic:** Utilities in `src/utils/`, services in `src/services/`
4. **API Integration:** Routes in `server/routes/`
5. **Database:** Schema in seed files, migrations via ORM
6. **Deployment:** Build with Vite, run Express server, PostgreSQL backend

---

**End of Classification**
