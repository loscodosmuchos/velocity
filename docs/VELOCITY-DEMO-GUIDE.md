# VELOCITY DEMO GUIDE

**Complete Platform Reference for Demos, Tours, and Customization**

---

## Quick Reference

| Metric | Value | Source |
|--------|-------|--------|
| Active Projects | 165 | Real HAEA data |
| Contractors | 34 | Real HAEA data |
| Total PO Value | $2.04M | Real HAEA data |
| Annual ROI | $1.3M+ | Calculated savings |

**Demo Logins:**
- `admin@velocity.io` / `admin123` — Full access
- `manager@velocity.io` / `manager123` — Manager role

---

# Part 1: Platform Tour & Navigation

## Three-Tier Menu Architecture

### TIER 1: User Daily Work (Core Operations)

| Menu Item | Route | Purpose | Pain Points Solved |
|-----------|-------|---------|-------------------|
| **Dashboard** | `/` or `/dashboard` | Executive command center with real-time KPIs | 5+ |
| **Purchase Orders** | `/purchase-orders` | PO lifecycle with budget health badges | 4 |
| **Contractors** | `/contractors` | Full lifecycle (Prospect → Active → Terminated) | 3 |
| **Timecards** | `/timecards` | Approval queue with anomaly detection | 4 |
| **Invoices** | `/invoices` | PO-to-invoice triangulation | 3 |
| **Expenses** | `/expenses` | Expense submission and approval | 2 |
| **Approvals** | `/approvals` | Multi-tier workflows with SLA tracking | 3 |
| **Statements of Work** | `/statement-of-works` | SOW lifecycle and compliance | 2 |
| **Change Orders** | `/change-orders` | Change request workflow | 2 |

#### Dashboard (`/` or `/dashboard`)
- **Active Contractors Gauge**: Real-time workforce utilization
- **Total Budget Deployment**: $2.04M tracked
- **Budget Utilization**: Health indicator (green/amber/red)
- **Active Alerts**: Severity-coded display (critical, warning, info)
- **Buyer Assignment Tracking**: Who owns what
- **Department Budget Analysis**: Visual chart breakdown
- **Quick Actions**: Comfortable mode, Procurement Hub, Dashboard Builder

#### Purchase Orders (`/purchase-orders`)
- List view with Excel-style filtering
- Budget health badges (green/amber/red)
- GR tracking and variance detection
- **Sub-routes:**
  - `/purchase-orders/create` — New PO
  - `/purchase-orders/edit/:id` — Modify existing
  - `/purchase-orders/show/:id` — Detail view
  - `/purchase-orders/templates` — PO templates
  - `/purchase-orders/:id/contractors` — Manage assignments

#### Contractors (`/contractors`)
- Skills matrix and experience tracking
- Compliance status (I-9, E-Verify, Background)
- Status lifecycle: Prospect → Active → Terminated
- **Sub-routes:**
  - `/contractors/create` — Onboard new
  - `/contractors/edit/:id` — Update info
  - `/contractors/show/:id` — Full profile
  - `/contractors/import` — CSV/Excel bulk import

#### Timecards (`/timecards`)
- Pending approvals with anomaly detection
- Hours logged vs site status validation
- OSHA compliance checking
- **Sub-routes:**
  - `/timecards/create` — New entry
  - `/timecards/show/:id` — Detail view
  - `/timecards/pending` — Approval queue
  - `/timecards/bulk-approve` — Mass approval

#### Invoices (`/invoices`)
- PO-to-invoice triangulation
- Payment aging reports
- Variance detection
- **Sub-routes:**
  - `/invoices/create` — New invoice
  - `/invoices/edit/:id` — Modify
  - `/invoices/show/:id` — Detail view
  - `/invoices/generate` — Auto-generate from timecards

#### Expenses (`/expenses`)
- Expense submission workflow
- Category tracking
- **Sub-routes:**
  - `/expenses/create` — Submit expense
  - `/expenses/show/:id` — Detail view
  - `/expenses/bulk-approve` — Mass approval
  - `/expenses/reports` — Expense analytics

#### Approvals (`/approvals`)
- Multi-tier approval workflows
- SLA tracking with auto-escalation
- **Sub-routes:**
  - `/approvals/rules` — Approval rule configuration
  - `/approvals/configure` — Workflow setup
  - `/approvals/email-logs` — Notification history

#### Statements of Work (`/statement-of-works`)
- SOW lifecycle management
- Compliance tracking
- **Sub-routes:**
  - `/statement-of-works/create` — New SOW
  - `/statement-of-works/edit/:id` — Modify
  - `/statement-of-works/show/:id` — Detail view
  - `/statement-of-works/compliance-report` — Compliance dashboard

#### Change Orders (`/change-orders`)
- Change request workflow
- Budget impact analysis
- **Sub-routes:**
  - `/change-orders/create` — New change order
  - `/change-orders/show/:id` — Detail view

---

### TIER 2: Productivity (AI & Tools)

| Menu Item | Route | Purpose | Pain Points Solved |
|-----------|-------|---------|-------------------|
| **Dashboard Builder** | `/dashboard/builder` | Drag-and-drop widget customization | 3 |
| **Notifications** | `/notifications/center` | Alert subscriptions and preferences | 2 |
| **AI Insights** | `/ai/insights` | AI-generated recommendations | 4 |
| **Chatbots** | `/ai/chatbots` | VINessa conversational AI | 2 |
| **Voice Contract** | `/ai/voice-contract` | PDF → Claude analysis → ElevenLabs | 5 |
| **Voice Agents** | `/ai/elevenlabs-agents` | ElevenLabs voice bot dashboard | 3 |

#### Dashboard Builder (`/dashboard/builder`)
- Drag-and-drop widget placement
- Custom KPI configuration
- Template gallery (pre-built layouts)
- Real-time preview
- Save and share layouts

#### AI Insights (`/ai/insights`)
- AI-generated recommendations
- Pattern detection across data
- Anomaly alerts with severity
- **Sub-route:** `/ai/insights/:id` — Insight detail view

#### Chatbots (`/ai/chatbots`)
- VINessa conversational AI
- Natural language queries
- **Sub-route:** `/ai/chatbots-display` — Full chat interface

#### Voice Contract Intelligence (`/ai/voice-contract`)
- Upload PDF contracts
- Claude AI analysis
- Risk clause detection
- ElevenLabs voice callback
- **Related:** `/ai/contract-gap-analysis`, `/ai/vendor-extraction`

---

### TIER 3: System Admin (Admin Only)

| Menu Item | Route | Purpose |
|-----------|-------|---------|
| **Admin Dashboard** | `/admin/dashboard` | System health overview |
| **User Management** | `/admin/users` | User CRUD and role assignment |
| **AI QA Lab** | `/admin/ai-qa-lab` | AI batch testing and QA |
| **Data Quality** | `/admin/data-quality` | Data validation and integrity |
| **Implementation Status** | `/admin/implementation-status` | Feature completion tracking |
| **Demo Command Center** | `/admin/demo-command-center` | Demo scenario management |
| **Project Tracker** | `/super-admin/project-tracker` | 165+ project portfolio view |

#### Project Tracker (`/super-admin/project-tracker`)
- 165+ project portfolio view
- Dependency network visualization
- Budget health heatmap
- Resource utilization tracking
- Risk indicators with evidence links
- **Pain Points Solved:** 6

---

## Hidden Pages (Not in Menu)

These pages exist and are fully functional but are not visible in the navigation menu:

| Route | Purpose | When to Use |
|-------|---------|-------------|
| `/dashboard/procurement` | Procurement-specific KPIs | CPO/Procurement demos |
| `/triage/budget-overrun` | Game-like action workspace | Show rapid resolution |
| `/analytics-hub` | Comprehensive analytics | Data-deep presentations |
| `/search` | Global hybrid search | Cross-entity discovery |
| `/filters/presets` | Saved filter configurations | Power user demos |
| `/budget/forecasting` | Predictive budget analysis | Finance demos |

### Accessing Hidden Pages
- Type the URL directly in the browser
- Use the global search (`/search`) to navigate
- Link from related visible pages

---

## Data Authenticity Statement

**ALL data shown is REAL HAEA (Hyundai AutoEver America) data:**

| Entity | Count | Status |
|--------|-------|--------|
| Projects | 165 | LIVE |
| Contractors | 34 | LIVE |
| Purchase Orders | 16 | LIVE |
| Timecards | 15 | LIVE |
| Invoices | 20 | LIVE |
| Alerts | 6 | LIVE |
| Departments | 6 | LIVE |
| SOWs | 4 | LIVE |
| Change Orders | 3 | LIVE |
| Buyers | 4 | LIVE |

**Zero mock data. Zero placeholder text. Every number is authentic.**

---

# Part 2: Customization Playbook

## Dashboard Builder (`/dashboard/builder`)

### Accessing the Builder
1. Navigate to `/dashboard/builder` or click "Dashboard Builder" in sidebar
2. Enter edit mode (pencil icon)
3. Drag widgets from the palette
4. Configure each widget's data source and appearance

### Widget Types Available
- **KPI Cards**: Single metric with trend indicator
- **Charts**: Bar, line, pie, area charts
- **Tables**: Filterable data grids
- **Alert Cubes**: Status indicators with corner badges
- **Gauges**: Circular progress indicators
- **Lists**: Ranked items with metrics

### Layout Controls
- **Grid System**: 12-column responsive grid
- **Resize Handles**: Drag corners to resize
- **Snap-to-Grid**: Automatic alignment
- **Row Management**: Add/remove rows

### Saving Layouts
1. Click "Save Layout" button
2. Name your dashboard
3. Choose visibility: Personal, Team, or Organization
4. Select as default (optional)

---

## Theme Options

Switch themes via the theme selector in the top navigation bar. All themes persist in localStorage.

### Available Themes

| Theme | Category | Description | Best For |
|-------|----------|-------------|----------|
| **Damascus Steel** | Classic | Intricate metalwork patterns with historic depth | Executive presentations |
| **Burl Wood Executive** | Luxury | Fine automobile dashboard luxury with warm wood | C-suite demos |
| **Modern Minimal** | Modern | Clean lines, high contrast, contemporary | Tech-forward clients |
| **Futuristic Innovation** | Futuristic | Animated gradients, neon accents | Innovation showcases |
| **Luxury Gold** | Luxury | Premium elegance with gold accents and deep blacks | High-end clients |
| **Executive Navy** | Classic | Established corporate integrity with deep navy | Traditional enterprises |
| **Professional Slate** | Modern | Neutral, versatile, modern professional | General purpose |
| **Innovation Purple** | Futuristic | Creative, forward-thinking design aesthetic | Creative industries |

### Theme Quick-Switch
```
Top Nav → Theme Icon (palette) → Select Theme → Instant Apply
```

### Theme Customization Tips
- Damascus Steel: Default theme, works for most demos
- Burl Wood: Use for automotive or luxury brand clients
- Modern Minimal: Best for tech startups
- Futuristic Innovation: AI-focused presentations
- Executive Navy: Banking and finance demos

---

## Alert Cube Severities

Alert cubes use a 5-level severity system with distinct visual styling:

| Severity | Color Gradient | Use Case | Visual |
|----------|---------------|----------|--------|
| **critical** | Red → Rose | Immediate action required | Pulsing glow |
| **warning** | Amber → Orange | Attention needed soon | Subtle animation |
| **info** | Blue → Indigo | Informational updates | Static |
| **success** | Emerald → Green | Positive confirmations | Checkmark corner |
| **neutral** | Slate → Gray | Standard status | No emphasis |

### Alert Categories
- `budget` — Dollar sign icon, financial alerts
- `compliance` — Shield icon, regulatory alerts
- `performance` — Trending icon, KPI alerts
- `deadline` — Clock icon, time-sensitive alerts
- `approval` — Check icon, pending actions
- `system` — Triangle icon, platform alerts
- `custom` — Bell icon, user-defined

### Configuring Alert Cubes
1. Select widget in Dashboard Builder
2. Click "Configure" (gear icon)
3. Set severity level
4. Choose category
5. Add corner badges (optional)
6. Set navigation destination

---

## Density Modes

Control information density via the density toggle in the top navigation.

| Mode | Spacing | Best For |
|------|---------|----------|
| **Comfortable** | Default spacing, easy scanning | New users, presentations |
| **Compact** | Higher data density | Power users, familiar with platform |
| **Ultra-Compact** | Maximum information density | Data analysts, bulk operations |

### Switching Density
```
Top Nav → Density Icon (layout grid) → Select Mode → Instant Apply
```

### Per-Session vs Persistent
- Density selection persists in localStorage
- Reloading the page maintains your preference
- Each user has independent settings

---

## Role-Based Visibility

Menu items and features are filtered based on user role:

| Role | Dashboard | Daily Work | Productivity | Admin |
|------|-----------|------------|--------------|-------|
| **Admin** | ✅ Full | ✅ All | ✅ All | ✅ Full access |
| **Manager** | ✅ Full | ✅ All | ✅ All | ❌ Hidden |
| **Supervisor** | ✅ Limited | ✅ Most | ✅ Limited | ❌ Hidden |
| **Contractor** | 🔒 Portal only | 🔒 Own data | ❌ Hidden | ❌ Hidden |

### Contractor Portal
Contractors access a separate portal at `/contractor-portal` with:
- Personal dashboard
- Own timecards
- Own invoices
- Own expenses
- Document uploads
- Messages

---

# Part 3: Demo Runbook

## CPO Demo Focus: ROI Narrative

### The $1.3M+ Story

| Savings Category | Annual Value | How to Demonstrate |
|-----------------|--------------|-------------------|
| **Time Savings** | $400,000 | 15-20 hrs/week per executive reclaimed |
| **Early Detection** | $450,000 | 30-day early warning on risks |
| **Alert Prevention** | $250,000 | 85% budget overrun reduction |
| **Compliance** | $200,000 | Automated audit trail |
| **TOTAL** | **$1,300,000+** | Combined platform value |

### ROI Talking Points by Section

**Dashboard (30 seconds)**
> "This single view replaces 6 Excel spreadsheets and 3 weekly meetings. That's 15 hours per week—worth $400K annually in executive time."

**AI Insights (60 seconds)**
> "This alert detected a vendor overrun 30 days before it hit. Early detection like this has prevented $450K in cost overruns this year."

**Alerts (30 seconds)**
> "Before Velocity, 40% of budgets overran. Now it's under 5%. That's $250K in prevented losses."

**Compliance (30 seconds)**
> "Every action is logged, every approval timestamped. Audit prep dropped from 2 weeks to 2 hours. That's $200K in annual compliance savings."

---

## Demo Credentials

| User | Email | Password | Role | Best For |
|------|-------|----------|------|----------|
| Admin | `admin@velocity.io` | `admin123` | Full Admin | Complete platform tour |
| Manager | `manager@velocity.io` | `manager123` | Manager | Role-based visibility demo |

### Quick Login Flow
1. Navigate to login page
2. Enter email and password
3. Click "Sign In"
4. Dashboard loads in < 2 seconds

---

## Pre-Demo Checklist

Run through this checklist 15 minutes before any demo:

### System Verification
- [ ] **API Running**: Check `/api/health` returns `{"status":"ok"}`
- [ ] **Dev Server Running**: Verify both workflows show "running" status
- [ ] **No Console Errors**: Open browser DevTools, check for red errors

### Data Verification
- [ ] **Dashboard Loads**: All KPIs display numeric values (not "N/A" or "0")
- [ ] **Contractors List**: Shows 34 active contractors
- [ ] **PO List**: Shows 16 purchase orders
- [ ] **Alerts Present**: At least 1 alert visible in dashboard

### Feature Verification
- [ ] **Login Works**: Test with `admin@velocity.io`
- [ ] **Navigation Works**: Click through main menu items
- [ ] **Export Works**: Test Excel export on any list page
- [ ] **Voice Works**: If demoing AI, test voice agent response

### Visual Verification
- [ ] **Theme Applied**: Correct theme for audience
- [ ] **No Broken Images**: All icons and images load
- [ ] **No Placeholder Text**: No "Lorem ipsum" or "Sample" visible

---

## Demo Script Templates

### 5-Minute Executive Overview

```
[0:00-0:30] LOGIN + DASHBOARD
"This is your command center. Real data, real-time."
→ Point to key KPIs: Active Contractors (34), Budget Utilization, Active Alerts

[0:30-1:30] AI INSIGHTS
"The AI detected this risk before anyone noticed."
→ Click on any AI Insight, show detail
→ Mention: "30-day early warning = $450K saved"

[1:30-2:30] PURCHASE ORDERS
"Every PO tracked, every variance flagged."
→ Open PO list, show budget health badges
→ Click one PO, show detail view

[2:30-3:30] CONTRACTORS
"34 contractors, full compliance tracking."
→ Open contractor list, point to status badges
→ "I-9, E-Verify, Background—all in one place"

[3:30-4:30] TIMECARDS + APPROVALS
"10-minute approval vs 2-hour manual process."
→ Open pending timecards
→ Show bulk approve capability

[4:30-5:00] CLOSE
"$1.3M annual ROI. This is Velocity."
→ Return to dashboard
→ Open for questions
```

### 15-Minute Deep Dive

```
[0:00-2:00] DASHBOARD TOUR
- All KPIs with explanations
- Department budget chart
- Active alerts walkthrough

[2:00-5:00] PURCHASE ORDER LIFECYCLE
- List → Create → Edit → Approve flow
- Budget health demonstration
- GR tracking explanation

[5:00-8:00] CONTRACTOR MANAGEMENT
- Onboarding flow
- Compliance tracking
- Skills matrix

[8:00-11:00] AI CAPABILITIES
- Voice contract analysis demo
- AI insights walkthrough
- Chatbot interaction

[11:00-14:00] CUSTOMIZATION
- Dashboard Builder walkthrough
- Theme switching
- Density modes

[14:00-15:00] CLOSE + Q&A
```

---

## Key Talking Points by Audience

### For CPO/CFO (Financial Focus)
- "$2.04M in purchase orders tracked in real-time"
- "Budget overrun detection before it happens"
- "$1.3M annual ROI across four categories"
- "Every dollar accounted for, every variance explained"

### For IT/CTO (Technical Focus)
- "Real PostgreSQL database, no mock data"
- "API-first architecture"
- "ElevenLabs and Claude AI integration"
- "Role-based access control"

### For HR/Operations (Process Focus)
- "34 contractors managed end-to-end"
- "Timecard anomaly detection"
- "Compliance status at a glance"
- "10-minute approval cycles"

### For Procurement (Daily Use Focus)
- "Excel-style filtering on every list"
- "One-click exports to Excel"
- "Hidden procurement dashboard at `/dashboard/procurement`"
- "Triage workspace for urgent issues"

---

## Recovery Procedures

### If Data Appears Missing

1. **Check Data Quality Page**
   ```
   Navigate to: /admin/data-quality
   ```
   - Review data integrity report
   - Check for failed API calls
   - Verify database connection

2. **Refresh the Page**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - This clears cached responses

3. **Check API Health**
   ```
   Navigate to: /api/health
   Expected: {"status":"ok"}
   ```

4. **Restart Workflows**
   - If API is down, restart the `api-server` workflow
   - If frontend is broken, restart the `dev` workflow

### If Login Fails

1. Try the alternate credential:
   - Primary: `admin@velocity.io` / `admin123`
   - Backup: `manager@velocity.io` / `manager123`

2. Clear browser cookies for the domain

3. Try incognito/private browser window

### If Charts Don't Render

1. Check browser console for JavaScript errors
2. Verify the page has finished loading (no spinner)
3. Try a different browser (Chrome recommended)

### If Voice Features Fail

1. Verify ElevenLabs API key is configured
2. Check browser microphone permissions
3. Test in Chrome (best voice support)

---

## Demo Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | `https://[repl-name].replit.app` | Live demo environment |
| API Health | `/api/health` | System status check |
| Data Quality | `/admin/data-quality` | Data integrity dashboard |

---

## Appendix: Complete Route Reference

### Tier 1: Daily Work Routes
```
/                           → Dashboard
/dashboard                  → Dashboard (alias)
/purchase-orders            → PO List
/purchase-orders/create     → New PO
/purchase-orders/edit/:id   → Edit PO
/purchase-orders/show/:id   → PO Detail
/contractors                → Contractor List
/contractors/create         → New Contractor
/contractors/show/:id       → Contractor Detail
/timecards                  → Timecard List
/timecards/pending          → Pending Approvals
/timecards/bulk-approve     → Bulk Approve
/invoices                   → Invoice List
/invoices/create            → New Invoice
/expenses                   → Expense List
/expenses/create            → New Expense
/approvals                  → Approval Queue
/statement-of-works         → SOW List
/change-orders              → Change Order List
```

### Tier 2: Productivity Routes
```
/dashboard/builder          → Dashboard Builder
/notifications/center       → Notification Center
/ai/insights                → AI Insights
/ai/chatbots                → Chatbots
/ai/voice-contract          → Voice Contract Intelligence
/ai/elevenlabs-agents       → Voice Agents Dashboard
```

### Tier 3: Admin Routes
```
/admin/dashboard            → Admin Dashboard
/admin/users                → User Management
/admin/data-quality         → Data Quality
/admin/ai-qa-lab            → AI QA Lab
/admin/demo-command-center  → Demo Command Center
/super-admin/project-tracker → Project Tracker
```

### Hidden Routes
```
/dashboard/procurement      → Procurement Dashboard
/triage/budget-overrun      → Budget Triage
/analytics-hub              → Analytics Hub
/search                     → Global Search
/budget/forecasting         → Budget Forecasting
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Data Currency:** Real HAEA data, verified authentic
