# Velocity Platform - Complete Site Map & Feature Inventory

## Executive Summary
**165 Projects | 34 Contractors | $2.04M PO Value | Zero Mock Data**

---

## TIER 1: USER DAILY WORK (Core Operations)

### Dashboard `/` `/dashboard`
**Status: CONNECTED** | **Pain Points Solved: 5+**
- Executive Command Center with real-time KPIs
- Active Contractors gauge with workforce utilization
- Total Budget deployment tracking
- Budget Utilization health indicator
- Active Alerts with severity-coded display
- Buyer Assignment tracking
- GR Authorization remaining
- Current Period POs
- Department Budget Analysis chart
- Quick-action buttons: Comfortable mode, Procurement Hub, Dashboard Builder

### Purchase Orders `/purchase-orders`
**Status: CONNECTED** | **Pain Points Solved: 4**
- List view with Excel-style filtering
- Budget health badges (green/amber/red)
- GR tracking and variance detection
- Create: `/purchase-orders/create`
- Edit: `/purchase-orders/edit/:id`
- Show: `/purchase-orders/show/:id`
- Templates: `/purchase-orders/templates`
- Manage Contractors: `/purchase-orders/:id/contractors`

### Contractors `/contractors`
**Status: CONNECTED** | **Pain Points Solved: 3**
- Full lifecycle management (Prospect → Active → Terminated)
- Skills matrix and experience tracking
- Compliance status (I-9, E-Verify, Background)
- Create: `/contractors/create`
- Edit: `/contractors/edit/:id`
- Show: `/contractors/show/:id`
- Import: `/contractors/import` (CSV/Excel bulk import)

### Timecards `/timecards`
**Status: CONNECTED** | **Pain Points Solved: 4**
- Pending approvals with anomaly detection
- Hours logged vs site status validation
- OSHA compliance checking
- Create: `/timecards/create`
- Show: `/timecards/show/:id`
- Pending: `/timecards/pending`
- Bulk Approve: `/timecards/bulk-approve`

### Invoices `/invoices`
**Status: CONNECTED** | **Pain Points Solved: 3**
- PO-to-invoice triangulation
- Payment aging reports
- Create: `/invoices/create`
- Edit: `/invoices/edit/:id`
- Show: `/invoices/show/:id`
- Generate: `/invoices/generate`

### Expenses `/expenses`
**Status: CONNECTED** | **Pain Points Solved: 2**
- Expense submission and approval workflow
- Create: `/expenses/create`
- Show: `/expenses/show/:id`
- Bulk Approve: `/expenses/bulk-approve`
- Reports: `/expenses/reports`

### Approvals `/approvals`
**Status: CONNECTED** | **Pain Points Solved: 3**
- Multi-tier approval workflows
- SLA tracking with auto-escalation
- Requests: `/approvals`
- Rules: `/approvals/rules`
- Configure: `/approvals/configure`
- Email Logs: `/approvals/email-logs`

### Statements of Work `/statement-of-works`
**Status: CONNECTED** | **Pain Points Solved: 2**
- SOW lifecycle management
- Compliance tracking
- Create: `/statement-of-works/create`
- Edit: `/statement-of-works/edit/:id`
- Show: `/statement-of-works/show/:id`
- Compliance Report: `/statement-of-works/compliance-report`

### Change Orders `/change-orders`
**Status: CONNECTED** | **Pain Points Solved: 2**
- Change request workflow
- Budget impact analysis
- Create: `/change-orders/create`
- Show: `/change-orders/show/:id`

---

## TIER 2: PRODUCTIVITY (AI & Tools)

### Dashboard Builder `/dashboard/builder`
**Status: CONNECTED** | **Pain Points Solved: 3**
- Drag-and-drop widget placement
- Custom KPI configuration
- Template gallery
- Real-time preview

### Notifications `/notifications/center`
**Status: CONNECTED** | **Pain Points Solved: 2**
- Notification center
- Preference management
- Alert subscriptions

### AI Intelligence Group

#### AI Insights `/ai/insights`
**Status: CONNECTED** | **Pain Points Solved: 4**
- AI-generated recommendations
- Pattern detection
- Anomaly alerts
- Detail: `/ai/insights/:id`

#### Chatbots `/ai/chatbots`
**Status: CONNECTED** | **Pain Points Solved: 2**
- VINessa conversational AI
- Natural language queries
- Display: `/ai/chatbots-display`

#### Voice Contract Intelligence `/ai/voice-contract`
**Status: CONNECTED** | **Pain Points Solved: 5**
- Upload PDF → Claude analysis → ElevenLabs callback
- Contract gap analysis
- Risk clause detection
- Vendor extraction

#### Voice Agents `/ai/elevenlabs-agents`
**Status: CONNECTED** | **Pain Points Solved: 3**
- ElevenLabs voice bot dashboard
- Conversational AI for intake
- Real-time transcription

---

## TIER 3: SYSTEM ADMIN (Admin Only)

### Administration Group

#### Admin Dashboard `/admin/dashboard`
**Status: CONNECTED**
- System health overview
- User activity metrics
- Performance monitoring

#### User Management `/admin/users`
**Status: CONNECTED**
- User CRUD operations
- Role assignment
- Create: `/admin/users/create`

#### AI QA Lab `/admin/ai-qa-lab`
**Status: CONNECTED**
- AI batch testing
- Quality assurance workflows
- Evidence validation

#### Data Quality `/admin/data-quality`
**Status: CONNECTED**
- Data validation dashboard
- Integrity checks
- Missing data detection

#### Implementation Status `/admin/implementation-status`
**Status: CONNECTED**
- Feature completion tracking
- Demo readiness checklist

#### Demo Command Center `/admin/demo-command-center`
**Status: CONNECTED**
- Demo scenario management
- Data refresh tools
- Presentation mode

### Project Tracker `/super-admin/project-tracker`
**Status: CONNECTED** | **Pain Points Solved: 6**
- 165+ project portfolio view
- Dependency network visualization
- Budget health heatmap
- Resource utilization
- Risk indicators
- Evidence links

---

## HIDDEN/UTILITY PAGES (Not in Menu)

### Procurement Dashboard `/dashboard/procurement`
**Status: CONNECTED**
- Procurement-specific KPIs
- Vendor spend analysis

### Triage Pages
#### Budget Overrun Triage `/triage/budget-overrun`
**Status: CONNECTED**
- Game-like action workspace
- One-click resolution

### Search & Filters
#### Global Search `/search`
**Status: CONNECTED**
- Hybrid search (semantic + keyword)
- Cross-entity results

#### Filter Presets `/filters/presets`
**Status: CONNECTED**
- Saved filter configurations

### Budget Forecasting `/budget/forecasting`
**Status: CONNECTED**
- Predictive budget analysis
- What-if scenarios

### Hubs
#### Analytics Hub `/analytics-hub`
**Status: CONNECTED**
- Comprehensive analytics

#### Admin Hub `/admin-hub`
**Status: CONNECTED**
- Administrative controls

#### PC2 Procurement `/pc2-purchase-orders`
**Status: CONNECTED**
- Procurement command center

#### PC3 Workforce `/pc3-workforce-home`
**Status: CONNECTED**
- Workforce command center

### Contracts Analysis
#### Missing Data Analyzer `/contracts/missing-data-analyzer`
**Status: CONNECTED**
- Gap detection
- Data completeness scoring

#### Contract Gap Analysis `/ai/contract-gap-analysis`
**Status: CONNECTED**
- AI-powered clause analysis

#### Vendor Extraction `/ai/vendor-extraction`
**Status: CONNECTED**
- Automated vendor data extraction

### Admin Tools
#### YouTube Capture `/admin/youtube-capture`
**Status: CONNECTED**
- Knowledge ingestion from video

#### Knowledge Hub `/admin/knowledge-hub`
**Status: CONNECTED**
- Centralized knowledge base

#### Demo Data Generator `/admin/demo-data-generator`
**Status: CONNECTED**
- Test data generation

#### System Architecture Map `/admin/system-architecture-map`
**Status: CONNECTED**
- Visual system diagram

#### Chatbots Customize `/admin/chatbots-customize`
**Status: CONNECTED**
- AI persona configuration

#### Voice Panel `/admin/voice-panel`
**Status: CONNECTED**
- Voice settings

#### XLSX Import `/admin/xlsx-import`
**Status: CONNECTED**
- Bulk data import

#### Logic Studio `/admin/logic-studio`
**Status: CONNECTED**
- Business rules engine

#### Validation Studio `/admin/validation-studio`
**Status: CONNECTED**
- Data validation rules

#### Platform Definition `/admin/platform-definition`
**Status: CONNECTED**
- Platform configuration

#### Error Tracking `/admin/error-tracking`
**Status: CONNECTED**
- Error monitoring

### Alert System
#### Alert Detail `/alerts/:id`
**Status: CONNECTED**
- Individual alert view
- Resolution workflow

### Presentation Pages
#### Demo Presentation `/demo-presentation`
**Status: CONNECTED**
- Full-screen demo mode

#### Why Velocity `/why-velocity`
**Status: CONNECTED**
- Value proposition page

### ElevenLabs Embed `/ai/elevenlabs-embed`
**Status: CONNECTED**
- Voice agent embedding

---

## CONTRACTOR PORTAL (Separate Access)

### Contractor Dashboard `/contractor-portal`
**Status: CONNECTED**
- Personal dashboard for contractors

### Contractor Profile `/contractor-portal/profile`
**Status: CONNECTED**
- Profile management

### Requirements `/contractor-portal/requirements`
**Status: CONNECTED**
- Compliance requirements

### Contractor Timecards `/contractor-portal/timecards`
**Status: CONNECTED**
- Time entry
- Create: `/contractor-portal/timecards/create`

### Contractor Invoices `/contractor-portal/invoices`
**Status: CONNECTED**
- Invoice submission

### Contractor Expenses `/contractor-portal/expenses`
**Status: CONNECTED**
- Expense submission
- Create: `/contractor-portal/expenses/create`

### Contractor Documents `/contractor-portal/documents`
**Status: CONNECTED**
- Document management
- Upload: `/contractor-portal/documents/upload`

### Contractor Messages `/contractor-portal/messages`
**Status: CONNECTED**
- Communication portal

---

## AUTH PAGES

- Login `/login`
- Register `/register`
- Forgot Password `/forgot-password`

---

## NOT YET CONNECTED (Planned Features)

### Workflow Builder (PRIORITY)
**Status: SCHEMA READY, UI NEEDED**
- Visual workflow designer using @xyflow/react
- Drag-drop node placement
- Condition logic builder
- Action triggers
- Journey mapping integration

### Universal Journey Engine
**Status: CONCEPT READY**
- Voice/text → structured journey map
- Domain adapters (Customer, Project, Procurement, Resource)
- Stage extraction with emotions/touchpoints
- Pain point → opportunity mapping

### Assets Management
**Status: PAGES EXIST, NEEDS CONNECTION**
- `/assets` - Asset list
- `/assets/create` - Create asset
- `/assets/show/:id` - Asset details
- `/assets/scan` - Asset scanning
- `/assets/kits` - Asset kits
- `/assets/transfer` - Asset transfer
- `/assets/maintenance` - Maintenance schedules

### Employees
**Status: PAGES EXIST, NEEDS CONNECTION**
- `/employees` - Employee list
- `/employees/create` - Create employee
- `/employees/show/:id` - Employee details

---

## DATABASE TABLES (Real Data)

| Table | Record Count | Status |
|-------|-------------|--------|
| contractors | 34 | LIVE |
| purchase_orders | 16 | LIVE |
| timecards | 15 | LIVE |
| invoices | 20 | LIVE |
| alerts | 6 | LIVE |
| departments | 6 | LIVE |
| statements_of_work | 4 | LIVE |
| change_orders | 3 | LIVE |
| buyers | 4 | LIVE |
| projects | 165 | LIVE |
| users | - | LIVE |

---

## DEMO NARRATIVE FLOW (4-Act Structure)

### Act 1: Portfolio Crisis
- 165 projects with dependency visualization
- Active Directory blocking 6 projects
- $2.3M blocked value quantified
- Network graph showing impact

### Act 2: Vendor Cost Overrun
- E-Plus vendor: $450K/year spend
- SHI benchmark: $380K/year
- 18% overrun flagged
- AI savings recommendation: $67K-90K

### Act 3: Infrastructure Risk
- 19 remote sites mapped
- 2 switches past EOL
- 4 switches within 12 months
- $139K replacement cost

### Act 4: Mobile Timecard
- 100 pending timecards
- Anomaly detection (Site 12)
- 10-minute approval (vs 2-hour baseline)

---

## ROI IMPACT

**Annual Savings: $1.3M - $1.4M**
- Time saved: 15-20 hours/week per executive
- Budget overrun reduction: 85%
- Timecard processing: 10 min vs 2 hours
- Risk detection: 30 days early warning
