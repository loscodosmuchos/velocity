# Velocity Platform - Architecture Discovery & Inventory
**Phase 1, Turn 2 - Generated:** Nov 27, 2025

---

## 📦 COMPONENT INVENTORY (55+ Components)

### SOW (Statement of Work) System
- `sow-journey-map.tsx` - Visual workflow stages visualization
- `sow-stakeholders-panel.tsx` - Role-based stakeholder management
- `sow-workflow-diagram.tsx` - Mermaid workflow diagrams
- `ai-message-composer.tsx` - AI-powered message drafting

### Dashboard System  
- `ben-dashboard-view.tsx` - PM Command Center (scaffolded)
- `mark-dashboard-view.tsx` - Executive Control Tower (scaffolded)
- `cfo-dashboard-view.tsx` - Finance dashboard
- `wes-dashboard-view.tsx` - Ops dashboard
- `automotive-dash-demo.tsx` - Demo dashboard

### Legendary UI Components
- `legend-detail-field.tsx` - Colorized detail fields (8 color schemes)
- `legend-detail-group.tsx` - Semantic field grouping
- **Status:** Production-ready, applied to PO detail page

### AI & Smart Components
- `ai-dashboard-customizer.tsx` - Claude-powered dashboard builder
- `ocr-architecture-map.tsx` - Interactive OCR region mapping
- `ocr-timecard-processor.tsx` - Document image processing

### Alert System
- `top-nav-alerts.tsx` - Critical alert cube navigation
- `alert-icon-toggle.tsx` - Animation control UI
- `compact-alert-cubes.tsx` - Dense alert indicators
- `critical-alert-animations.tsx` - Keyframe definitions

### Admin Tools (28 Total)
- Admin Hub navigation
- Change log dashboard
- Bug pattern detector
- Texture selector
- Route validator

### UI Primitives (Radix/shadcn)
- Accordion, Alert Dialog, Avatar, Badge
- Button, Card, Checkbox, Dialog
- Dropdown, Form, Input, Label
- Progress, Select, Separator, Slider
- Table, Tabs, Textarea, Toggle
- Tooltip, PopoverProvider
- **Total:** 24 Radix UI components

---

## 🔧 CUSTOM HOOKS (12 Total)

| Hook | Purpose | Status |
|------|---------|--------|
| `useOCR` | Tesseract-based document processing | ✅ Complete |
| `useAIGeneration` | Claude API wrapper | ✅ Complete |
| `usePredictiveAlerts` | Alert generation | ✅ Working |
| `useContractorData` | Contractor queries | ✅ Working |
| `useSOWData` | SOW queries | ✅ Working |
| `useBudgetAnalysis` | Budget calculations | ✅ Working |
| `useDashboardState` | Dashboard persistence | ✅ Working |
| `useFormValidation` | Zod + React Hook Form | ✅ Working |
| `useLocalStorage` | localStorage wrapper | ✅ Working |
| `useWindowSize` | Responsive detection | ✅ Working |
| `useFetch` | Data fetching utility | ✅ Working |
| `useDebounce` | Debounce utility | ✅ Working |

---

## 🛣️ API ROUTES (45+ Endpoints)

### Route Files
```
server/routes/
├── contractors.ts         (8 endpoints)
├── purchaseorders.ts      (7 endpoints)
├── statements-of-work.ts  (8 endpoints)
├── timecards.ts          (6 endpoints)
├── invoices.ts           (5 endpoints)
├── approvals.ts          (4 endpoints)
├── audit-logs.ts         (3 endpoints)
├── ai.ts                 (1 endpoint - NOT WIRED)
└── [others]              (3 endpoints)
```

### Key Endpoints
- `GET /contractors` - List contractors
- `GET /contractors/:id` - Get contractor detail
- `POST /contractors` - Create contractor
- `GET /purchaseorders` - List POs
- `GET /purchaseorders/:id` - PO detail
- `GET /timecards` - List timecards
- `POST /timecards` - Create timecard
- `GET /invoices` - List invoices
- `POST /statements-of-work` - Create SOW
- `POST /ai/generate` - **⏳ NOT WIRED** (Created but not registered)

### Missing Endpoints
- `/contractors/login` - Contractor authentication (blocked by user model issue)
- `/contractors/:id/timecards/upload-ocr` - OCR timecard submission
- `/contractors/:id/documents` - Document sharing

---

## 📊 DATA TYPES (22 Interfaces + Enums)

### Core Business Types
```typescript
interface Contractor {
  id: number
  firstName: string
  lastName: string
  email: string
  status: 'Active' | 'Inactive' | 'Onboarding'
  skillCategory: string
  hourlyRate: number
  // ...
}

interface PurchaseOrder {
  id: number
  poNumber: string
  totalAmount: number
  remainingFunds: number
  spentAmount: number
  status: 'Draft' | 'Pending' | 'Active' | 'Completed' | 'Cancelled'
  // ...
}

interface StatementOfWork {
  id: number
  sowNumber: string
  status: 'Draft' | 'Pending Approval' | 'Active' | 'Invoiced' | 'Paid' | 'Completed' | 'Cancelled'
  totalValue: number
  // ...
}

interface Timecard {
  id: number
  contractorId: number
  purchaseOrderId: number
  date: string
  hours: number
  // ...
}

interface Invoice {
  id: number
  status: 'Draft' | 'Submitted' | 'GR Approved' | 'Paid' | 'Disputed'
  requestedAmount: number
  actualAmount: number
  // ...
}

interface AuditLog {
  id: number
  entityType: string
  action: 'Created' | 'Updated' | 'Deleted' | 'Approved'
  performedBy: number
  // ...
}
```

### Other Types (16 more)
- Department, Buyer, Role, Permission
- SOWTranche, SOWStakeholder, ChangeOrder
- ApprovalRequest, Budget, AnalyticsEvent
- AlertConfig, DashboardTemplate, NotificationPreference

---

## 🌐 PAGES INVENTORY (131 Pages Across 28 Directories)

### Primary Page Directories
| Directory | Count | Key Pages |
|-----------|-------|-----------|
| `/dashboard` | 8 | index, customizer, builder, analytics |
| `/purchaseorders` | 5 | list, show, create, edit, contractors |
| `/statementofworks` | 6 | list, show, create, edit, compliance-report |
| `/timecards` | 4 | list, create, review, analytics |
| `/contractors` | 5 | list, show, create, edit, portal |
| `/invoices` | 4 | list, show, create, batch-process |
| `/approvals` | 4 | list, show, queue, analytics |
| `/triage` | 7 | index, budget, compliance, operations, timecards, contractors, invoices |
| `/admin` | 8 | hub, customizer, audit-logs, change-log, analytics, users |
| `/contractor-portal` | 5 | dashboard, timecards, documents, profile, settings |
| Other | 75 | Settings, Reports, Search, Help, etc. |

---

## 🔐 DATABASE SCHEMA OVERVIEW

### Core Tables
```
contractors
├── id (serial)
├── firstName, lastName, email
├── hourlyRate, status
├── skillCategory, department
└── [10+ other fields]

purchase_orders
├── id (serial)
├── poNumber, totalAmount
├── remainingFunds, spentAmount
├── status, departmentId, buyerId
└── [15+ other fields]

statements_of_work
├── id (serial)
├── sowNumber, contractorId
├── totalValue, invoicedAmount
├── status, startDate, endDate
└── [8+ other fields]

sow_stakeholders
├── id (serial)
├── sowId, userId
├── role (Legal, Finance, Operations, Procurement, Executive, Compliance, ProjectManager, Approver)
└── notificationPreferences (JSON)

timecards
├── id (serial)
├── contractorId, purchaseOrderId
├── date, hours, taskDescription
├── status, hourlyRate, totalAmount
└── [audit fields]

invoices
├── id (serial)
├── invoiceNumber, status
├── requestedAmount, actualAmount
├── grAmount, grBalance
└── [variance & audit fields]

audit_logs
├── id (serial)
├── entityType, entityId, action
├── performedBy, performedByName
├── changedFields (JSON), timestamp
└── [audit trail]
```

### Extensions Required
- `pgvector` - Vector similarity search
- `pg_trgm` - Full-text search
- `uuid-ossp` - UUID generation
- Row-Level Security (RLS) enabled

---

## 📦 DEPENDENCIES STATUS

### Frontend (React Stack)
```
react@19.0+
typescript@5.x
vite@6.3.0
tailwindcss@4.1
@refinedev/core@4.58.0
@refinedev/react-router@1.0.1
@refinedev/react-hook-form@4.10.2
@refinedev/react-table@5.6.17
shadcn-ui (full suite)
@radix-ui/* (24 components)
```

### AI & Document Processing
```
@anthropic-ai/sdk@latest
tesseract.js@6.0.1
```

### Backend
```
express@latest
pg@latest
jsonwebtoken@latest
bcryptjs@latest
cors@latest
dotenv@latest
```

### Missing/Needed
- `playwright` - Not installed yet (Phase 2)
- API route server registration - Not complete

---

## 🎯 ROUTING ARCHITECTURE

### Frontend Routes (React Router)
```
/dashboard
  /index
  /customizer
  /builder
  /analytics
/purchaseorders
  /list
  /show/:id
  /create
  /edit/:id
/statementofworks
  /list
  /show/:id
  /create
/timecards
  /list
  /create
  /review/:id
/contractors
  /list
  /show/:id
/contractor-portal
  /dashboard
  /timecards
  /documents
/triage
  /budget
  /compliance
  /operations
/admin
  /hub
  /change-log-dashboard
  /bug-pattern-detector
  /[24 more admin tools]
/search/global
/approvals/queue
[60+ more routes]
```

### Backend Routes (Express)
```
POST /api/contractors
GET /api/contractors
GET /api/contractors/:id
PUT /api/contractors/:id
DELETE /api/contractors/:id

POST /api/purchaseorders
GET /api/purchaseorders
GET /api/purchaseorders/:id
PUT /api/purchaseorders/:id

[40+ more endpoints]

⏳ POST /api/ai/generate (Not wired yet)
```

---

## ⚙️ CONFIGURATION FILES

### Environment
- `.env` - Local dev environment (git-ignored)
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Tailwind theming
- `.gitignore` - Version control exclusions

### Build & Deployment
- `package.json` - 100+ dependencies
- `pnpm-lock.yaml` - Locked versions
- `playwright.config.ts` - ⏳ Will be created in Phase 2

---

## 🧪 TEST STRATEGY (Phase 2 Placeholder)

### Planned Tests
1. **Authentication Flow**
   - User login
   - Token storage
   - Protected route access

2. **SOW Workflow**
   - Create SOW
   - Advance stages
   - Stakeholder notifications

3. **Budget Alerts**
   - Detect overrun
   - Trigger notifications
   - Prevent approval

4. **OCR Processing**
   - Upload timecard image
   - Extract data
   - Validate patterns

5. **Admin Hub**
   - Route validation
   - Tool accessibility
   - Permission checks

---

## 🚨 KNOWN ARCHITECTURE ISSUES

| Issue | Severity | Impact | Fix |
|-------|----------|--------|-----|
| Contractors vs Users separation | 🔴 High | Blocks login, portal access | Schema unification |
| AI route not wired | 🟡 Medium | Dashboard customizer blocked | Register route in Express |
| Detail page template not universal | 🟡 Medium | UI inconsistency | Apply to 4 pages |
| Ben/Mark dashboards skeletal | 🟡 Medium | Demo incomplete | Build 2 views (12h) |
| Contractor portal endpoints missing | 🟡 Medium | OCR submission blocked | Add 3 endpoints |

---

## 📈 SYSTEM HEALTH

| Aspect | Status | Notes |
|--------|--------|-------|
| Frontend Builds | ✅ Green | Vite compiling cleanly |
| Backend Server | ✅ Running | Express listening |
| Database | ✅ Connected | Neon PostgreSQL healthy |
| API Responses | ✅ Working | JWT auth functional |
| UI Components | ✅ Rendering | No console errors |
| Performance | ✅ Good | Page loads <2s |

---

## 🔄 INTEGRATION MATRIX

```
Frontend (React)
    ↓
Vite Dev Server (port 5000)
    ↓
Express Backend (port 3000)
    ↓
PostgreSQL (Neon)
    ↓
Claude AI API
Tesseract.js (OCR)
localStorage (persistence)
```

---

**Document Version:** 1.0
**Generated:** Phase 1, Turn 2
**Next:** Turn 3 - Test Plan & Quality Gates
