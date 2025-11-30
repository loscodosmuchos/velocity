# Velocity Platform - Site Map & Workflow Diagrams

Generated: November 27, 2025

---

## SITE MAP - TREE VIEW

```
📍 VELOCITY PLATFORM ROOT
│
├── 🔓 PUBLIC ROUTES
│   ├── /login
│   ├── /register
│   └── /forgot-password
│
└── 🔐 AUTHENTICATED ROUTES (Protected by JWT)
    │
    ├── 📊 DASHBOARDS & OVERVIEW (Tier 1 - Home)
    │   ├── / (default dashboard)
    │   ├── /dashboard (executive view)
    │   ├── /dashboard/builder (AI-customizer)
    │   ├── /dashboard/procurement (procurement KPIs)
    │   ├── /dashboard/automotive-demo (presentation mode)
    │   ├── /analytics-hub (analytics platform)
    │   └── /platform-capabilities (feature showcase)
    │
    ├── 👥 WORKFORCE MANAGEMENT
    │   ├── 🧑‍💼 CONTRACTORS (Complete Lifecycle)
    │   │   ├── /contractors (list - paginated)
    │   │   ├── /contractors/create (onboarding flow)
    │   │   ├── /contractors/edit/:id (profile editing)
    │   │   ├── /contractors/show/:id ⭐ (legendary detail)
    │   │   └── /contractors/import (bulk CSV import)
    │   │
    │   └── 👨‍💼 EMPLOYEES (Internal Workforce)
    │       ├── /employees (list)
    │       ├── /employees/create (add employee)
    │       └── /employees/show/:id (detail)
    │
    ├── 💰 FINANCIAL & CONTRACTS
    │   ├── 📄 PURCHASE ORDERS (Procurement)
    │   │   ├── /purchaseorders (list - active POs)
    │   │   ├── /purchaseorders/create (new PO)
    │   │   ├── /purchaseorders/edit/:id (modify)
    │   │   ├── /purchaseorders/show/:id ⭐ (legendary detail)
    │   │   ├── /purchaseorders/:id/manage-contractors (assign team)
    │   │   └── /purchaseorders/templates (saved templates)
    │   │
    │   ├── 📋 STATEMENTS OF WORK (Contracts)
    │   │   ├── /statementofworks (list - all SOWs)
    │   │   ├── /statementofworks/create (draft new)
    │   │   ├── /statementofworks/edit/:id (modify)
    │   │   ├── /statementofworks/show/:id ⭐ (legendary detail)
    │   │   │   ├── 🗺️ SOW Journey Map (visual stages)
    │   │   │   ├── 👥 Stakeholder Panel (team roles)
    │   │   │   ├── 💬 AI Message Composer (auto-draft)
    │   │   │   ├── 📊 Financial Summary (budget metrics)
    │   │   │   └── 🔄 Change Orders (modifications)
    │   │   │
    │   │   └── 🔀 CHANGE ORDERS (Modifications)
    │   │       ├── /change-orders (list all)
    │   │       └── /change-orders/create?sowId=X (linked to SOW)
    │   │
    │   └── 💵 TIMECARDS & INVOICING
    │       ├── ⏱️ TIMECARDS (Hours & Billing)
    │       │   ├── /timecards (list - all submitted)
    │       │   ├── /timecards/create (submit new)
    │       │   └── /timecards/show/:id (detail/approval)
    │       │
    │       └── 📧 INVOICES (Payment)
    │           └── Managed through Triage system
    │
    ├── 🚨 TRIAGE SYSTEM (Smart Alert Management)
    │   ├── 💰 /triage/budget (spending alerts)
    │   ├── 📈 /triage/budget-overrun/:entityId (specific overruns)
    │   ├── ⚖️ /triage/compliance (policy violations)
    │   ├── 🔧 /triage/operations (bottlenecks)
    │   ├── ⏰ /triage/timecards (discrepancies)
    │   ├── 👤 /triage/contractors (status alerts)
    │   ├── 📄 /triage/invoices (billing issues)
    │   └── 🔔 /alerts/:alertId (detail view)
    │
    ├── 🤖 AI & INTELLIGENCE
    │   ├── 💡 AI INSIGHTS
    │   │   ├── /ai/insights (recommendations engine)
    │   │   └── /ai-insights/:insightId (detail analysis)
    │   │
    │   ├── 💬 CONVERSATIONAL AI
    │   │   ├── /ai/chatbots (configuration)
    │   │   ├── /ai/chatbots-display (test chat)
    │   │   ├── /ai/voice-contract (voice analysis)
    │   │   └── /ai/elevenlabs-agents (voice agents)
    │   │
    │   └── 📑 DOCUMENT INTELLIGENCE
    │       ├── /ai/contract-gap-analysis (missing clauses)
    │       ├── /ai/vendor-extraction (vendor data)
    │       └── /projects/documents (library)
    │
    ├── 🏢 CONTRACTOR SELF-SERVICE PORTAL
    │   ├── /contractor-portal (dashboard)
    │   ├── /contractor-portal/profile (edit profile)
    │   ├── /contractor-portal/requirements (onboarding)
    │   ├── ⏱️ /contractor-portal/timecards (submit hours)
    │   │   └── /contractor-portal/timecards/create (new submission)
    │   ├── 📧 /contractor-portal/invoices (view invoices)
    │   ├── 💸 /contractor-portal/expenses (expenses)
    │   │   └── /contractor-portal/expenses/create (submit)
    │   ├── 📄 /contractor-portal/documents (files)
    │   │   └── /contractor-portal/documents/upload (new file)
    │   └── 💬 /contractor-portal/messages (messaging)
    │
    ├── ✅ APPROVAL WORKFLOWS
    │   ├── /approvals (queue - pending approvals)
    │   ├── /approvals/rules (rule management)
    │   ├── /approvals/configure (workflow setup)
    │   └── /approvals/email-logs (communication log)
    │
    ├── 🏭 ASSET MANAGEMENT
    │   ├── /assets (inventory)
    │   ├── /assets/create (add asset)
    │   ├── /assets/show/:id (detail)
    │   ├── /assets/scan (QR/barcode scanning)
    │   ├── /assets/kits (asset bundles)
    │   ├── /assets/transfer/:id (transfer)
    │   └── /assets/maintenance (service log)
    │
    ├── 🔍 SEARCH & DISCOVERY
    │   ├── /search/global (unified search)
    │   ├── /filters/presets (saved filters)
    │   ├── /notifications/center (message hub)
    │   └── /budget/forecasting (predictive analytics)
    │
    ├── 🌐 SPECIALIZED HUBS
    │   ├── /pc2-purchase-orders (procurement view)
    │   ├── /pc3-workforce-home (workforce view)
    │   ├── /procurement-hub (procurement variants)
    │   └── /hubs/communication-hub (messaging)
    │
    └── ⚙️ ADMIN PANEL (Password Protected)
        │
        ├── 🎛️ ADMIN HUB
        │   └── /admin (hub - 19 tools listed)
        │
        ├── 📊 CORE ADMINISTRATION
        │   ├── /admin/dashboard (admin overview)
        │   ├── /admin/platform-definition (core config)
        │   ├── /admin/users (user CRUD + /admin/users/create)
        │   ├── /admin/audit-logs (activity log)
        │   ├── /admin/data-quality (health metrics)
        │   └── /admin/exceptions (error management)
        │
        ├── 🎨 CUSTOMIZATION & SETTINGS
        │   ├── /admin/logic-studio (business rules)
        │   ├── /admin/chatbots-customize (tuning)
        │   └── /admin/texture-selector (themes)
        │
        ├── 📈 QUALITY & ANALYTICS
        │   ├── /admin/change-log-dashboard (version history)
        │   ├── /admin/bug-pattern-detector (pattern analysis)
        │   ├── /admin/feature-risk-dashboard (risk scoring)
        │   └── /admin/implementation-status (roadmap)
        │
        ├── 🎬 DEMO & PRESENTATION
        │   ├── /admin/demo-command-center (presentation control)
        │   ├── /admin/demo-presentation (slides)
        │   ├── /admin/demo-data-generator (sample data)
        │   └── /admin/visual-change-gallery (showcases)
        │
        ├── 🛠️ DEVELOPMENT TOOLS
        │   ├── /admin/error-tracking (error logs)
        │   ├── /admin/validation-studio (form testing)
        │   ├── /admin/journey-builder (workflow designer)
        │   ├── /admin/xlsx-import (bulk import)
        │   └── /admin/ai-qa-lab (test automation)
        │
        └── 📚 CONTENT & RESOURCES
            ├── /admin/knowledge-hub (documentation)
            ├── /admin/youtube-capture (video integration)
            ├── /admin/voice-panel (voice settings)
            ├── /admin/system-architecture-map (tech diagram)
            └── /admin/persona-reference (user guide)
```

---

## WORKFLOW DIAGRAM 1: SOW LIFECYCLE

```
┌─────────────────────────────────────────────────────────┐
│              STATEMENT OF WORK (SOW) LIFECYCLE          │
└─────────────────────────────────────────────────────────┘

  1️⃣ DRAFT PHASE
  ─────────────
  └─→ /statementofworks/create
      ├─ Fill basic info (scope, timeline, budget)
      ├─ Add stakeholders (Legal, Finance, Operations)
      ├─ Set notification thresholds (50% budget, 7 days remaining)
      └─ Save as Draft

  2️⃣ REVIEW PHASE
  ──────────────
  ├─→ /statementofworks/show/:id (SOW Journey Map shows "Review" stage)
  ├─→ AI Message Composer: Auto-draft "Request Review" template
  ├─→ Stakeholders receive email/in-app notification
  └─→ Set to "Pending Approval"

  3️⃣ ACTIVE PHASE
  ───────────────
  ├─→ Status changes to "Active"
  ├─→ Tranches begin (milestone-based funding)
  ├─→ Budget tracking: /triage/budget monitors spend
  ├─→ Change Orders can be created: /change-orders/create?sowId=X
  └─→ AI Message Composer: Status updates + Budget alerts

  4️⃣ FINANCIAL TRACKING
  ────────────────────
  ├─→ /timecards: Contractors submit hours
  ├─→ /timecards/show/:id: Manager approves
  ├─→ Financial Summary updates in real-time
  ├─→ Invoice generated when tranche complete
  └─→ /triage/invoices: Payment queue

  5️⃣ INVOICED PHASE
  ─────────────────
  ├─→ SOW Journey Map: "Invoiced" indicator
  ├─→ /approvals: Approval queue (if configured)
  └─→ Finance team approves payment

  6️⃣ PAID PHASE
  ────────────
  ├─→ Payment processed
  ├─→ SOW Journey Map: "Paid" indicator
  └─→ Final tranche disbursed (if applicable)

  7️⃣ COMPLETED PHASE
  ──────────────────
  ├─→ All tranches paid
  ├─→ AI Message Composer: "Completion" template
  ├─→ Contractor marked as inactive on this SOW
  └─→ Historical record maintained
```

---

## WORKFLOW DIAGRAM 2: PURCHASE ORDER (PO) TO CONTRACTOR ASSIGNMENT

```
┌─────────────────────────────────────────────────────────┐
│           PURCHASE ORDER TO CONTRACTOR FLOW             │
└─────────────────────────────────────────────────────────┘

  1️⃣ CREATE PO
  ───────────
  └─→ /purchaseorders/create
      ├─ Budget + Duration
      ├─ Department (IT/Data Science/Cloud/QA/Security)
      └─ Skills required

  2️⃣ PO DETAIL LEGENDARY PAGE
  ──────────────────────────
  └─→ /purchaseorders/show/:id
      ├─ Color-coded by department ✨
      ├─ Financial Summary (Spent / Budget)
      ├─ Timeline (Days remaining)
      ├─ Status indicators
      └─ Quick actions panel

  3️⃣ ASSIGN CONTRACTORS
  ────────────────────
  └─→ /purchaseorders/:id/manage-contractors
      ├─ Search contractors by skill
      ├─ Drag-drop to assign
      ├─ Set rate + hours allocation
      ├─ Role assignment (Lead/Support/etc)
      └─ Auto-notify contractors

  4️⃣ CONTRACTOR SEES ASSIGNMENT
  ──────────────────────────────
  └─→ /contractor-portal
      ├─ New PO appears in requirements
      ├─ Can accept or decline
      ├─ Contract terms reviewed
      └─ Signed acknowledgment

  5️⃣ CONTRACTOR WORKING
  ─────────────────────
  └─→ /contractor-portal/timecards/create
      ├─ Submit weekly/bi-weekly hours
      ├─ Allocate time to specific PO
      ├─ Add notes/deliverables
      └─ Send for approval

  6️⃣ MANAGER APPROVES
  ──────────────────
  └─→ /triage/timecards (or direct link)
      ├─ Review hours submitted
      ├─ Check against PO allocation
      ├─ Budget validation
      └─ Approve or request revision

  7️⃣ INVOICE GENERATION
  ────────────────────
  └─→ /triage/invoices
      ├─ Auto-calculate: Hours × Rate
      ├─ Deduct from PO budget
      ├─ Queue for payment approval
      └─ Send to contractor

  8️⃣ PAYMENT PROCESSING
  ────────────────────
  └─→ /approvals (if configured)
      ├─ Finance approves
      └─ Payment sent (external system)

  9️⃣ PO BUDGET TRACKING (REAL-TIME)
  ─────────────────────────────────
  └─→ /triage/budget-overrun/:entityId
      ├─ 🔴 RED: >90% spent
      ├─ 🟠 YELLOW: 70-90% spent
      ├─ 🟢 GREEN: <70% spent
      └─ AI recommendations for reallocation
```

---

## WORKFLOW DIAGRAM 3: ALERT & ISSUE TRIAGE

```
┌─────────────────────────────────────────────────────────┐
│            REAL-TIME ALERT & TRIAGE WORKFLOW            │
└─────────────────────────────────────────────────────────┘

ALERT GENERATED (Background job)
        ↓
    ┌───────────────────────────┐
    │ Categorize by Type        │
    └───────────────────────────┘
        ↓
    ┌────────────┬────────────┬────────────┬────────────┐
    ↓            ↓            ↓            ↓            ↓
 BUDGET      COMPLIANCE  OPERATIONS  TIMECARDS    CONTRACTORS
    ↓            ↓            ↓            ↓            ↓
 /triage/     /triage/     /triage/     /triage/     /triage/
 budget      compliance   operations   timecards    contractors
    ↓            ↓            ↓            ↓            ↓
┌──────────────────────────────────────────────────────────┐
│         TOP NAV: TRIAGE ICON WITH RED BADGE              │
│  Shows count of unresolved issues by type                │
└──────────────────────────────────────────────────────────┘
    ↓
CLICK TRIAGE SECTION
    ↓
┌──────────────────────────────────────────────────────────┐
│  /triage/[type] - Filtered Issue Queue                  │
│  ├─ Issue cards with color coding                       │
│  ├─ Animated alert icons (strobe/beacon for critical)   │
│  ├─ Quick action buttons                                │
│  └─ Sort/Filter by severity                             │
└──────────────────────────────────────────────────────────┘
    ↓
CLICK ISSUE CARD
    ↓
┌──────────────────────────────────────────────────────────┐
│  /alerts/:alertId - Detail View                         │
│  ├─ Full context (amount, entity, date)                 │
│  ├─ Root cause analysis (AI-powered)                    │
│  ├─ Action recommendations                              │
│  ├─ Quick resolve/dismiss buttons                       │
│  └─ Related alerts panel                                │
└──────────────────────────────────────────────────────────┘
    ↓
RESOLVE ACTION
    ├─→ Budget overrun? → Reallocate from /purchaseorders
    ├─→ Compliance? → Review /statementofworks/show/:id
    ├─→ Timecard? → Edit /timecards/show/:id
    ├─→ Contractor? → Update /contractors/show/:id
    └─→ Invoice? → Pay through /approvals

NOTIFICATION FLOW (Parallel)
    ├─→ Email alert (immediate)
    ├─→ In-app notification (/notifications/center)
    ├─→ SMS (if configured)
    └─→ Stakeholder notification (from AI Message Composer)
```

---

## WORKFLOW DIAGRAM 4: APPROVAL WORKFLOW

```
┌─────────────────────────────────────────────────────────┐
│              APPROVAL ROUTING & WORKFLOW                │
└─────────────────────────────────────────────────────────┘

  REQUEST INITIATED
  ─────────────────
  ├─ Create PO → /purchaseorders/create
  ├─ Create SOW → /statementofworks/create
  ├─ Submit Timecard → /timecards/create
  ├─ Generate Invoice → Auto
  └─ Request Change Order → /change-orders/create

  ROUTE TO APPROVERS
  ──────────────────
  └─→ /approvals/configure (Rules engine)
      ├─ If amount > $50K → Finance Director
      ├─ If SOW affects schedule → Project Manager
      ├─ If compliance risk → Legal
      └─ If routine (amount <$10K) → Auto-approve

  APPROVER NOTIFICATION
  ────────────────────
  ├─ Email notification (immediate)
  ├─ In-app badge (/approvals)
  ├─ Dashboard widget highlights
  └─ Escalation if no response (24/48 hrs)

  APPROVAL DASHBOARD
  ──────────────────
  └─→ /approvals (Queue view)
      ├─ Prioritized by urgency/amount
      ├─ Detailed preview on hover
      ├─ Quick approve/deny buttons
      ├─ Bulk actions (approve multiple)
      └─ Delegation (assign to colleague)

  APPROVAL DECISION
  ────────────────
  ├─→ APPROVE
  │   ├─ Update status in system
  │   ├─ Notify requestor + stakeholders
  │   ├─ Proceed with next workflow step
  │   ├─ Send email confirmation
  │   └─ Log audit trail
  │
  ├─→ DENY
  │   ├─ Require reason (dropdown options)
  │   ├─ Return to requestor
  │   ├─ Allow revision or cancel
  │   ├─ Log reason in audit
  │   └─ Notify requestor
  │
  └─→ REQUEST INFO
      ├─ Add comments/questions
      ├─ Suspend for response
      ├─ Requestor can reply
      └─ Resume approval flow

  AUDIT TRAIL
  ───────────
  └─→ /admin/audit-logs
      ├─ Who approved / Denied
      ├─ When (timestamp)
      ├─ Reason/Notes
      ├─ IP Address
      └─ Full decision history

  EMAIL LOG
  ────────
  └─→ /approvals/email-logs
      ├─ Timestamp of notifications sent
      ├─ Email addresses
      ├─ Opens/clicks tracked
      └─ Failed delivery alerts
```

---

## WORKFLOW DIAGRAM 5: CONTRACTOR SELF-SERVICE PORTAL

```
┌─────────────────────────────────────────────────────────┐
│      CONTRACTOR SELF-SERVICE PORTAL (Multi-step)        │
└─────────────────────────────────────────────────────────┘

  CONTRACTOR LOGIN
  ────────────────
  └─→ /login (email + password)
      └─ JWT token stored in localStorage
         └─ Redirects to /contractor-portal

  CONTRACTOR DASHBOARD
  ─────────────────────
  └─→ /contractor-portal
      ├─ Active assignments (POs)
      ├─ Pending timecards (due soon)
      ├─ Invoices due for payment
      ├─ Unread messages
      ├─ Documents requiring signature
      └─ Quick action buttons

  1️⃣ PROFILE MANAGEMENT
  ────────────────────
  └─→ /contractor-portal/profile
      ├─ Edit personal info
      ├─ Update bank details (for payment)
      ├─ Add certifications
      ├─ Upload portfolio
      └─ Notification preferences

  2️⃣ REQUIREMENTS (Onboarding)
  ───────────────────────────
  └─→ /contractor-portal/requirements
      ├─ Checklist of required docs
      ├─ Background check status
      ├─ Tax form (W9/W2)
      ├─ Insurance verification
      ├─ NDA acknowledgment
      └─ Complete % shown

  3️⃣ TIMECARD SUBMISSION
  ──────────────────────
  └─→ /contractor-portal/timecards
      ├─ View past timecards + status
      └─→ /contractor-portal/timecards/create
          ├─ Select week/period
          ├─ Add daily hours per project
          ├─ Use OCR to upload timesheet (auto-fill)
          ├─ Add notes/accomplishments
          ├─ Mark as "Ready for Review"
          └─ Submit

  4️⃣ INVOICE TRACKING
  ───────────────────
  └─→ /contractor-portal/invoices
      ├─ View issued invoices
      ├─ Status: Draft/Pending/Paid
      ├─ Download/print
      ├─ Track payment date
      └─ Dispute (if issue)

  5️⃣ EXPENSE REIMBURSEMENT
  ────────────────────────
  └─→ /contractor-portal/expenses
      ├─ View past expenses
      └─→ /contractor-portal/expenses/create
          ├─ Category selection
          ├─ Amount + date
          ├─ Receipt upload (OCR scans)
          ├─ Project assignment
          ├─ Add description
          └─ Submit for approval

  6️⃣ DOCUMENT MANAGEMENT
  ──────────────────────
  └─→ /contractor-portal/documents
      ├─ View all assigned docs
      ├─ Required vs Optional
      └─→ /contractor-portal/documents/upload
          ├─ Drag-drop file upload
          ├─ File type validation
          ├─ Digital signature (if required)
          └─ Submit

  7️⃣ MESSAGING & SUPPORT
  ──────────────────────
  └─→ /contractor-portal/messages
      ├─ Direct messages from manager
      ├─ Group chat (project team)
      ├─ Support ticketing system
      ├─ Reply + attachments
      └─ Search previous conversations

  NOTIFICATIONS (Throughout Portal)
  ──────────────────────────────────
  ├─ Timecard due (3 days before)
  ├─ Invoice ready
  ├─ New assignment
  ├─ Message from manager
  ├─ Document signature request
  └─ Payment confirmation
```

---

## WORKFLOW DIAGRAM 6: AI-POWERED SOW MESSAGE COMPOSER

```
┌─────────────────────────────────────────────────────────┐
│      AI MESSAGE COMPOSER (SOW Stakeholder Updates)      │
└─────────────────────────────────────────────────────────┘

INITIATE
  └─→ /statementofworks/show/:id
      └─ Click "Send Update" button

SELECT TEMPLATE
  ├─ Status Update (default)
  ├─ Milestone Achieved
  ├─ Action Required
  ├─ Budget Alert
  ├─ Schedule Change
  └─ Custom (blank)

SELECT TONE
  ├─ Professional/Formal
  ├─ Casual/Friendly
  └─ Urgent/Critical

SELECT RECIPIENTS
  ├─ Multi-select by role
  │  ├─ Legal (red badge)
  │  ├─ Finance (green badge)
  │  ├─ Operations (blue badge)
  │  ├─ Procurement (teal badge)
  │  ├─ Executive (purple badge)
  │  └─ Custom list
  ├─ Filter by notification preference
  └─ Count shown (e.g., "3 recipients")

GENERATE DRAFT (AI-POWERED)
  └─ Submits to Claude API:
      ├─ Template type
      ├─ SOW context (amount, timeline, status)
      ├─ Tone preference
      ├─ Recipient roles
      └─ Recent SOW changes/alerts
  
  Claude returns:
      ├─ Subject line
      ├─ Email body (formatted)
      └─ Alternative phrasings

DRAFT REVIEW & EDIT
  ├─ Preview formatted email
  ├─ Manual editing allowed
  ├─ Tone adjustment buttons:
  │  ├─ Make Formal (increase formality)
  │  ├─ Make Casual (reduce jargon)
  │  └─ Improve (Claude refines)
  ├─ Character count
  └─ Preview in mobile format

MESSAGE HISTORY
  └─ Panel shows last 3 messages sent:
      ├─ Date + template used
      ├─ Subject preview
      ├─ Recipients listed
      └─ Click to see full message

SEND
  ├─ Generate unique tracking ID
  ├─ Store in message history
  ├─ Send emails immediately
  ├─ Log to audit trail
  ├─ Record delivery timestamp
  └─ Display confirmation toast

NOTIFICATION TRACKING
  ├─ Open tracking (optional)
  ├─ Click tracking (optional)
  ├─ Per-recipient notification settings:
  │  ├─ Email + In-app notification
  │  ├─ Email only
  │  ├─ In-app only
  │  └─ Disabled
  ├─ Threshold alerts:
  │  ├─ Budget reached: Auto-send "Alert"
  │  ├─ Days remaining: Auto-send "Upcoming"
  │  └─ Status change: Auto-send "Update"
  └─ Suppression (don't send if already sent today)
```

---

## NAVIGATION FLOW DIAGRAM

```
┌──────────────────────────┐
│   USER LOGS IN           │
│   /login                 │
└──────────┬───────────────┘
           ↓
      ┌────────────────────────────────────────┐
      │ JWT Token generated + stored           │
      │ Redirected to /dashboard               │
      └────────────────────────────────────────┘
           ↓
    ┌──────────────────────────┐
    │ MAIN DASHBOARD           │
    │ /dashboard               │
    │ (Sidebar + TopNav shown) │
    └──────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR (Left) - Main Navigation    │  TOP NAV - Quick Access
│  ├─ Dashboard (home icon)            │  ├─ AI Insights (amber)
│  ├─ Contractors (people icon)        │  ├─ Approvals (green)
│  ├─ Purchase Orders (doc icon)       │  ├─ Alerts (red w/ count)
│  ├─ SOWs (contract icon)             │  ├─ Triage (red indicator)
│  ├─ Timecards (clock icon)           │  ├─ Notifications (violet)
│  ├─ Approvals (checkmark)            │  ├─ Reports (cyan)
│  ├─ Triage (alert icon)              │  └─ Support (pink)
│  ├─ AI Systems (brain icon)          │
│  ├─ Admin (gear - if authorized)     │
│  └─ Contractor Portal (user icon)    │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  ROUTE SELECTION - Choose primary task                       │
│  ├─ /contractors → Workforce management                      │
│  ├─ /purchaseorders → PO tracking                            │
│  ├─ /statementofworks → Contract management                  │
│  ├─ /triage/* → Issue resolution                             │
│  ├─ /approvals → Approval queue                              │
│  ├─ /admin/* → Configuration (password-gated)                │
│  └─ /contractor-portal → Self-service                        │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  LIST VIEW (if applicable)                                   │
│  /contractors, /purchaseorders, /statementofworks, etc       │
│  ├─ Paginated table/grid                                     │
│  ├─ Filters + Sort                                           │
│  ├─ Search (global or entity-specific)                       │
│  ├─ Bulk actions                                             │
│  ├─ Create button                                            │
│  └─ Click row → Detail view                                  │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  DETAIL VIEW (LEGENDARY pages) ✨                            │
│  /contractors/show/:id                                       │
│  /purchaseorders/show/:id                                    │
│  /statementofworks/show/:id                                  │
│  ├─ Color-coded header (department or status)                │
│  ├─ Key metrics at top                                       │
│  ├─ Tabs: Overview, Activity, Documents, etc                 │
│  ├─ Organized field groups                                   │
│  ├─ Quick action buttons                                     │
│  └─ Edit / Delete buttons                                    │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│  MODAL / SUB-VIEWS                                           │
│  ├─ Create/Edit forms (modal)                                │
│  ├─ Triage issue detail                                      │
│  ├─ AI Message Composer (dialog)                             │
│  ├─ Approval decision form                                   │
│  └─ Stakeholder management (panel)                           │
└──────────────────────────────────────────────────────────────┘
           ↓
         DONE ✅
```

---

## COLOR CODING & VISUAL HIERARCHY

### Department Colors (Consistent Across Platform)
```
IT Operations        → 🔵 Blue (#3B82F6)
Data Science         → 🟣 Purple (#8B5CF6)
Cloud Infrastructure → 🔷 Teal (#14B8A6)
QA                   → 🟠 Amber (#F59E0B)
Security             → 🔴 Red (#EF4444)
```

### Status Indicators
```
Draft/Pending        → 🟠 Amber
Active/In Progress   → 🟢 Green
Approved             → 🟣 Purple
Completed            → 🟢 Emerald
Overdue/Critical     → 🔴 Red
Cancelled            → ⚫ Gray
```

### Alert Animation States
```
Critical/High         → 🔴 Red (strobe animation)
Urgent                → 🟠 Amber (beacon animation)
Warning               → 🟡 Yellow (pulse animation)
Info                  → 🔵 Blue (glow animation)
Success               → 🟢 Green (static)
```

---

## ROUTE ACCESS CONTROL

### Public Routes (No Auth)
```
/login
/register
/forgot-password
```

### Contractor-Only Routes
```
/contractor-portal/*
/timecards (self only)
/contractors/show/:id (self or assigned POs only)
```

### Manager-Only Routes
```
/approvals (see all assigned approvals)
/triage/* (see all triage)
/purchase-orders/manage-contractors
/timecards/show/:id (assigned team only)
```

### Admin-Only Routes
```
/admin/*
/admin/users
/admin/demo-data-generator
/admin/error-tracking
/admin/chatbots-customize
```

### All Authenticated Users
```
/dashboard
/search/global
/notifications/center
/filters/presets
/alerts/:alertId
/ai/insights
```

---

END OF SITE MAP & WORKFLOWS
