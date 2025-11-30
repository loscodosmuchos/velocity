# Velocity Platform - Complete Menu Classification Guide

Generated: November 27, 2025
Total Routes: 95+
Total Admin Tools: 19
Total Menu Sections: 8

---

## 1. PRIMARY NAVIGATION (Main Sidebar - Tier 1)

### 1.1 Dashboard & Overview
- **Dashboard** (`/dashboard`) - Executive overview, KPIs, alerts
- **Dashboard Builder** (`/dashboard/builder`) - AI-powered custom dashboards
- **Procurement Dashboard** (`/dashboard/procurement`) - Procurement-specific metrics
- **Automotive Demo** (`/dashboard/automotive-demo`) - Demo/presentation dashboard
- **Analytics Hub** (`/analytics-hub`) - Comprehensive analytics platform
- **Platform Capabilities** (`/platform-capabilities`) - Feature showcase

### 1.2 Core Workforce Management
- **Contractors** - Workforce directory & lifecycle
  - `/contractors` - List view
  - `/contractors/create` - Onboarding
  - `/contractors/edit/:id` - Profile management
  - `/contractors/show/:id` - Detail page (LEGENDARY)
  - `/contractors/import` - Bulk import

- **Employees** - Internal workforce
  - `/employees` - List view
  - `/employees/create` - Add employee
  - `/employees/show/:id` - Detail page

### 1.3 Financial Management
- **Purchase Orders** - PO lifecycle management
  - `/purchaseorders` - List view
  - `/purchaseorders/create` - Create PO
  - `/purchaseorders/edit/:id` - Edit
  - `/purchaseorders/show/:id` - Detail page (LEGENDARY)
  - `/purchaseorders/:id/manage-contractors` - Assign contractors
  - `/purchaseorders/templates` - Template library

- **Statements of Work (SOWs)** - Contract management
  - `/statementofworks` - List view
  - `/statementofworks/create` - Create SOW
  - `/statementofworks/edit/:id` - Edit
  - `/statementofworks/show/:id` - Detail page with:
    - **SOW Journey Map** - Visual workflow stages
    - **Stakeholder Panel** - Role-based team management
    - **AI Message Composer** - Template-driven communications
    - **Change Orders** - Modification tracking
    - **Financial Summary** - Budget utilization

- **Change Orders** - SOW modifications
  - `/change-orders` - List view
  - `/change-orders/create?sowId=X` - Create with SOW context

### 1.4 Time & Expense Tracking
- **Timecards** - Hours & billing
  - `/timecards` - List view
  - `/timecards/create` - Submit timecard
  - `/timecards/show/:id` - Detail page

- **Invoice Management**
  - Handled through Triage system

### 1.5 Contractor Portal (Multi-section)
Self-service hub at `/contractor-portal/`
- Profile Management - `/contractor-portal/profile`
- Requirements - `/contractor-portal/requirements`
- Timecards Submission - `/contractor-portal/timecards/create`
- Invoices - `/contractor-portal/invoices`
- Expenses - `/contractor-portal/expenses/create`
- Document Upload - `/contractor-portal/documents/upload`
- Messaging - `/contractor-portal/messages`

### 1.6 Approval Workflows
- **Approval Requests** (`/approvals`) - Queue of pending approvals
- **Approval Rules** (`/approvals/rules`) - Rule configuration
- **Approval Configuration** (`/approvals/configure`) - Workflow setup
- **Email Logs** (`/approvals/email-logs`) - Communication tracking

---

## 2. TRIAGE SYSTEM (Alert & Issue Management - Tier 1)

Real-time issue categorization dashboard at `/triage/[type]`

### 2.1 Triage Categories (8 types)
1. **Budget Triage** (`/triage/budget`)
   - Budget threshold alerts
   - Spending forecasts
   - Overrun prevention

2. **Budget Overrun** (`/triage/budget-overrun/:entityId`)
   - Specific entity overruns
   - Remediation options

3. **Compliance Triage** (`/triage/compliance`)
   - Policy violations
   - Contract compliance gaps
   - Audit flags

4. **Operations Triage** (`/triage/operations`)
   - Operational bottlenecks
   - Resource allocation issues
   - Process exceptions

5. **Timecards Triage** (`/triage/timecards`)
   - Timecard discrepancies
   - Missing submissions
   - Billing issues

6. **Contractors Triage** (`/triage/contractors`)
   - Contractor status alerts
   - Rate/term violations
   - Availability issues

7. **Invoices Triage** (`/triage/invoices`)
   - Invoice discrepancies
   - Payment holds
   - Approval delays

8. **General Alerts** (`/alerts/:alertId`)
   - Detail view for any alert type

---

## 3. INTELLIGENT SYSTEMS (AI & Automation - Tier 2)

### 3.1 AI Insights & Analysis
- **AI Insights** (`/ai/insights`) - Smart recommendations
- **AI Insight Detail** (`/ai-insights/:insightId`) - Deep dive analysis
- **Contract Gap Analysis** (`/ai/contract-gap-analysis`) - Missing clause detection
- **Vendor Extraction** (`/ai/vendor-extraction`) - Vendor data intelligence

### 3.2 Conversational AI
- **Chatbots** (`/ai/chatbots`) - Chat configuration
- **Chatbots Display** (`/ai/chatbots-display`) - Test interface
- **Voice Contract Intelligence** (`/ai/voice-contract`) - Voice analysis
- **ElevenLabs Agents** (`/ai/elevenlabs-agents`) - Voice agent dashboard

### 3.3 Document Processing
- **Project Documents** (`/projects/documents`) - Document library
- **Missing Data Analyzer** (`/contracts/missing-data-analyzer`) - Schema validation
- **OCR Timecard Processing** - Built-in (part of timecard creation)

---

## 4. ASSET MANAGEMENT (Tier 2)

All routes under `/assets/`

- `/assets` - Asset inventory
- `/assets/create` - Add asset
- `/assets/show/:id` - Asset detail
- `/assets/scan` - Barcode/QR scanning
- `/assets/kits` - Asset bundles
- `/assets/transfer/:id` - Transfer ownership
- `/assets/maintenance` - Maintenance log

---

## 5. PLATFORM CONFIGURATION (Admin Panel - Tier 3)

Password-gated hub at `/admin/` (19 tools)

### 5.1 Core Administration (6 tools)
1. **Admin Dashboard** (`/admin/dashboard`) - Admin overview
2. **Platform Definition** (`/admin/platform-definition`) - Core config
3. **User Management** (`/admin/users`) - User CRUD
4. **Audit Logs** (`/admin/audit-logs`) - Activity tracking
5. **Data Quality** (`/admin/data-quality`) - Data health metrics
6. **System Exceptions** (`/admin/exceptions`) - Error management

### 5.2 Customization & Settings (3 tools)
1. **Logic Studio** (`/admin/logic-studio`) - Business rules
2. **Chatbot Config** (`/admin/chatbots-customize`) - Conversation tuning
3. **Texture Selector** (`/admin/texture-selector`) - Theme customization

### 5.3 Quality Assurance & Analytics (4 tools)
1. **Change Log Dashboard** (`/admin/change-log-dashboard`) - Version tracking
2. **Bug Pattern Detector** (`/admin/bug-pattern-detector`) - Pattern analysis
3. **Feature Risk Dashboard** (`/admin/feature-risk-dashboard`) - Risk scoring
4. **Implementation Status** (`/admin/implementation-status`) - Roadmap

### 5.4 Demo & Presentation (4 tools)
1. **Demo Command Center** (`/admin/demo-command-center`) - Presentation control
2. **Demo Presentation** (`/admin/demo-presentation`) - Demo slides
3. **Demo Data Generator** (`/admin/demo-data-generator`) - Sample data creation
4. **Visual Change Gallery** (`/admin/visual-change-gallery`) - Before/after showcase

### 5.5 Development Tools (5 tools)
1. **Error Tracking** (`/admin/error-tracking`) - Error logs & analysis
2. **Validation Studio** (`/admin/validation-studio`) - Form validation testing
3. **Journey Builder** (`/admin/journey-builder`) - Workflow designer
4. **XLSX Import** (`/admin/xlsx-import`) - Bulk data import
5. **AI QA Lab** (`/admin/ai-qa-lab`) - Test automation lab

### 5.6 Content Management (2 tools)
1. **Knowledge Hub** (`/admin/knowledge-hub`) - Documentation
2. **YouTube Capture** (`/admin/youtube-capture`) - Video integration

### 5.7 Voice & Communication (2 tools)
1. **Voice Panel** (`/admin/voice-panel`) - Voice settings
2. **System Architecture Map** (`/admin/system-architecture-map`) - Tech diagram

---

## 6. SPECIALIZED HUBS (Tier 2)

- **PC2 Purchase Orders Hub** (`/pc2-purchase-orders`) - Procurement view
- **PC3 Workforce Hub** (`/pc3-workforce-home`) - Workforce analytics
- **Procurement Hub** (`/procurement-hub`) - Variants view
- **Communication Hub** (`/hubs/communication-hub`) - Internal messaging

---

## 7. UTILITIES & SEARCH (Tier 1)

- **Global Search** (`/search/global`) - Unified search
- **Filter Presets** (`/filters/presets`) - Saved filters
- **Budget Forecasting** (`/budget/forecasting`) - Predictive analytics
- **Notification Center** (`/notifications/center`) - Message hub
- **Persona Reference** (`/admin/persona-reference`) - User type guide

---

## 8. PUBLIC/MARKETING (Tier 0)

- **Why Velocity** (`/why-velocity`) - Value proposition
- **Login** (`/login`)
- **Register** (`/register`)
- **Forgot Password** (`/forgot-password`)

---

## MENU ITEM STATISTICS

| Category | Count | Status |
|----------|-------|--------|
| Core Workforce | 12 | ✅ Production |
| Financial Mgmt | 18 | ✅ Production |
| Triage System | 8 | ✅ Production |
| AI/Automation | 8 | ✅ Production |
| Admin Tools | 19 | ✅ Production |
| Contractor Portal | 7 | ✅ Production |
| Approvals | 4 | ✅ Production |
| Assets | 7 | ✅ Production |
| Utilities | 4 | ✅ Production |
| Hubs & Variants | 4 | ✅ Production |
| **TOTAL** | **91** | **✅ Complete** |

---

## NAVIGATION HIERARCHY

```
Velocity Platform
├── 🎯 Dashboard (Main landing)
│   ├── Executive Dashboard
│   ├── Custom Builder
│   └── Analytics Hub
├── 👥 Workforce
│   ├── Contractors (List/Detail/Import)
│   └── Employees (List/Detail)
├── 💰 Financial
│   ├── Purchase Orders (List/Detail/Manage)
│   ├── Statements of Work (List/Detail/Journey)
│   └── Timecards (List/Create/Detail)
├── 📋 Approvals (Workflow Queue)
├── 🚨 Triage (Issue Management - 8 categories)
├── 🤖 AI Systems
│   ├── Insights
│   ├── Chatbots
│   ├── Voice
│   └── Contract Analysis
├── 🏢 Contractor Portal (Self-service)
├── ⚙️ Admin (19 tools)
└── 🔍 Search & Utilities
```

---

## KEY FEATURES BY ROUTE

### "Legendary Detail Pages" ✨
Routes with premium UI treatment (colors, icons, organized fields):
- `/purchaseorders/show/:id` - PO detail with financial summary
- `/statementofworks/show/:id` - SOW detail with journey map & stakeholders
- `/contractors/show/:id` - Contractor profile with complete history

### "Real-time Alerting" 🚨
Routes that handle proactive notifications:
- `/triage/*` - All triage endpoints push real-time updates
- `/notifications/center` - Centralized notification hub
- `/alerts/:alertId` - Individual alert detail

### "AI-Powered" 🧠
Routes using Claude/AI backend:
- `/ai-insights/:insightId` - Intelligent analysis
- `/dashboard/builder` - AI customization
- `/sow/ai-message-composer` - Template-driven drafting
- `/ai/contract-gap-analysis` - ML-based analysis

### "Multi-tenant Ready" 🔒
All routes support:
- Row-Level Security (RLS) at database
- Role-based access control (RBAC)
- Organization/workspace isolation

---

## ACCESS CONTROL BY ROLE

### Admin Role
- Full access to all 91 routes
- `/admin/*` unrestricted
- All triage categories
- All AI features

### Manager Role
- Core workforce routes (full)
- Financial routes (full)
- Triage (operations/budget)
- Contractor portal (read-only)
- Limited admin (dashboard only)

### Contractor Role
- `/contractor-portal/*` (all)
- `/purchase-orders` (read-only, assigned POs only)
- `/statementofworks` (read-only, assigned SOWs only)
- Own `/timecards` only

### Finance Role
- Financial routes (full)
- Triage (budget/invoices)
- Approvals (full)
- Analytics (limited)

---

## QUICK NAVIGATION REFERENCE

| Task | Route |
|------|-------|
| View all contractors | `/contractors` |
| Create new SOW | `/statementofworks/create` |
| Check budget alerts | `/triage/budget` |
| Approve pending items | `/approvals` |
| Submit timecard | `/contractor-portal/timecards/create` |
| Configure workflow | `/admin/logic-studio` |
| Run tests | `/admin/ai-qa-lab` |
| Generate demo data | `/admin/demo-data-generator` |
| Search anything | `/search/global` |
| Customize dashboard | `/dashboard/builder` |
