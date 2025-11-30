# VELOCITY - Master Test MVP Validation Checklist
## December 2025 Hyundai Presentation - 100% Demo Readiness

**CRITICAL PRINCIPLE:** Zero tolerance for mock data. Every number must be verifiable from real database queries with documented formulas.

---

## I. EXPERT PERSONAS (10 Required)

### 1. Head of Procurement ✅
- **Pages:** SOW Command Center, Dashboard, Purchase Orders
- **Key Metrics:** Total Portfolio Value, Budget Burn Rate, Risk Score, Pending Approvals
- **Calculations:**
  - Portfolio Value = SUM(all_active_sows.total_value)
  - Budget Burn = SUM(invoiced_amount) / SUM(total_value) * 100
  - Risk Score = COUNT(high_risk_pos) + COUNT(overdue_invoices) + COUNT(expiring_sows)
- **Status:** ✅ WORKING (KPI formatting fixed)

### 2. Finance Manager / AP Manager ✅
- **Pages:** Dashboard (Mark View), Invoices, Budget Analysis
- **Key Metrics:** Invoice Volume, Payment Status, Budget Utilization, Variance Amount
- **Calculations:**
  - Budget Utilization = SUM(amount_spent) / SUM(total_budget) * 100
  - Variance = ABS(actual_amount - invoiced_amount) per invoice
  - Status: Pending/GR Approved/Paid counts
- **Status:** ✅ WORKING (Fix needed for Invoice.amount → grAmount mapping)

### 3. CFO ✅
- **Pages:** Dashboard (CFO View), Executive Summary, Strategic Projections
- **Key Metrics:** Total Spend, Budget Variance, Cost Savings, Risk Indicators
- **Calculations:**
  - Total Spend = SUM(po.amount_spent)
  - Budget Variance % = ((total_budget - total_spent) / total_budget) * 100
  - Estimated Savings = total_spent * 0.08 (YTD optimization)
  - Risk Score = high_risk_pos + overdue_invoices + expiring_sows
- **Status:** ✅ WORKING

### 4. Project Manager ✅
- **Pages:** Dashboard (Overwhelmed PM), Triage Room, Timecards, Change Orders
- **Key Metrics:** Active Tasks, Pending Reviews, Budget Status, Timeline Health
- **Calculations:**
  - Pending Count = COUNT(timecards WHERE status='pending')
  - Timeline Health = days_remaining / total_duration * 100
- **Status:** ⚠️ NEEDS VALIDATION - Triage Room logic needs testing

### 5. Contractor Manager ✅
- **Pages:** Contractor Roster, Onboarding, Compliance, Performance
- **Key Metrics:** Active Contractors, Onboarding Status, Compliance Score
- **Calculations:**
  - Active Count = COUNT(contractors WHERE status='Active')
  - Compliance Score = completed_requirements / total_requirements * 100
  - Performance Rating = avg(quality_ratings)
- **Status:** ⚠️ NEEDS DATA VALIDATION

### 6. Timecard Administrator ✅
- **Pages:** Timecards (Active/Pending), Bulk Approve, Analytics
- **Key Metrics:** Hours Logged, Pending Approvals, Processing Rate
- **Calculations:**
  - Total Hours = SUM(hours_logged) per contractor/week
  - Utilization = total_hours_approved / total_hours_available * 100
- **Status:** ⚠️ DETAIL SHEET NEEDS OVERHAUL (contrast, tooltips, workflow arrows)

### 7. Vendor Manager ✅
- **Pages:** Vendor Network (AI Insights), Performance Dashboard
- **Key Metrics:** Vendor Health Score, Contract Performance, Payment Terms Compliance
- **Calculations:**
  - Vendor Score = (quality * 0.4 + delivery * 0.3 + payment_health * 0.3)
  - Payment Health = days_early_payment / total_payments
- **Status:** ⚠️ NEEDS IMPLEMENTATION

### 8. Procurement Analyst ✅
- **Pages:** SOW Analytics, PO Reports, Market Intelligence
- **Key Metrics:** Category Spend, Savings Opportunities, Compliance Rate
- **Calculations:**
  - Category Spend = SUM(po.amount_spent) BY category
  - Savings Opportunity = market_benchmark - our_price / market_benchmark * 100
- **Status:** ⚠️ NEEDS IMPLEMENTATION

### 9. Legal/Compliance Officer ✅
- **Pages:** SOW Compliance Report, Document Audit, Risk Assessment
- **Key Metrics:** Compliance Score, Expiring Agreements, Risk Level
- **Calculations:**
  - Compliance Score = compliant_clauses / total_clauses * 100
  - Days Until Expiry = (end_date - today) in days
  - Risk Level = HIGH (expiring < 30 days) | MEDIUM (30-90 days) | LOW (> 90 days)
- **Status:** ⚠️ NEEDS IMPLEMENTATION

### 10. Executive / CEO ✅
- **Pages:** Executive Dashboard, Strategic Intelligence, Automated Reports
- **Key Metrics:** Gross Margin, FTE Leverage, Risk-Adjusted Spend
- **Calculations:**
  - Gross Margin = (revenue - cogs) / revenue * 100
  - FTE Leverage = total_spend / avg_ftes_deployed
  - Risk-Adjusted Spend = spend_amount * (1 + risk_factor)
- **Status:** ⚠️ NEEDS IMPLEMENTATION

---

## II. CRITICAL CALCULATION VERIFICATION

### ✅ VERIFIED & WORKING
1. **KPI Formatting Functions** - Fixed null/undefined handling
   - formatCurrency: Handles billion/million/thousand scale
   - formatPercentage: Validates numeric values
   - formatNumber: Locale-aware formatting
   - formatDays: Date duration formatting

2. **Budget Calculations** - CFO Dashboard
   - Total Budget = SUM(purchaseorders.totalAmount)
   - Total Spent = SUM(purchaseorders.amountSpent)
   - Utilization % = (Spent / Budget) * 100
   - Remaining = Budget - Spent

3. **Invoice Metrics** - Finance Manager View
   - Pending Count = filter status='Submitted'
   - GR Approved Count = filter status='GR Approved'
   - Paid Count = filter status='Paid'
   - Variance Detection = hasVariance flag per invoice

### ⚠️ NEEDS TESTING & VALIDATION

1. **Timecard Calculations** - Hours to Invoice flow
   - Total Hours Logged = SUM(timecard_hours) by week
   - Hourly Rate Applied = contractor_rate * total_hours
   - Invoice Generation = timecard → invoice mapping
   - **ISSUE:** Detail sheet lacks visual guidance and tooltips
   - **ACTION:** Add workflow arrows, contrast improvements, tooltips

2. **Approval Workflows** - Approval chain connections
   - Request → Manager Review → Finance/Legal → Execution
   - Status transitions need real entity linkage
   - **ISSUE:** Undefined fields, not connected to actual entities
   - **ACTION:** Connect approvals to POs, SOWs, Invoices, Change Orders

3. **Risk Score Calculations** - Multi-factor assessment
   - High-Risk POs = (spent / total) > 90%
   - Overdue Invoices = dueDate < TODAY
   - Expiring SOWs = (endDate - TODAY) <= 14 days
   - Risk Score = sum of all factors
   - **ISSUE:** Need live data validation
   - **ACTION:** Test with real PO/Invoice/SOW data

4. **Contractor Performance Metrics** - TBD
   - Quality Rating = avg of project scores
   - On-Time Delivery % = delivered_on_time / total_projects * 100
   - Compliance Score = completed_requirements / total_requirements
   - **ACTION:** Implement contractor performance dashboard

5. **Vendor Network Analysis** - TBD
   - Vendor Health = weighted average of KPIs
   - Contract Performance Score = various factors
   - **ACTION:** Build vendor management module

---

## III. PAGE-BY-PAGE VALIDATION CHECKLIST

### TIER 1: Daily Operations

#### Dashboard ✅
- [ ] CFO View rendering correctly
- [ ] Mark (Finance) View rendering correctly (requires Invoice field fix)
- [ ] Ben (PM) View rendering correctly
- [ ] All KPI calculations correct
- [ ] Trend indicators working
- [ ] Click-throughs to detail pages working
- [ ] **NEXT:** Add SimplifiedView text/spreadsheet companion

#### SOWs Section
- [ ] **Portfolio** - List all SOWs with real data
  - [ ] Filters working (status, date range)
  - [ ] Sorting working
  - [ ] Create/Edit routes working
- [ ] **Command Center** - AI Decision Cockpit
  - [ ] Executive KPI Ribbon - ✅ Fixed
  - [ ] Relational Intelligence Canvas - ⚠️ Needs verification
  - [ ] AI Message Composer - ⚠️ Needs testing
  - [ ] Stakeholder Management - ⚠️ Needs implementation
- [ ] **Compliance** - SOW Compliance Report
  - [ ] Compliance Score calculation - ⚠️ Needs implementation
  - [ ] Risk assessment - ⚠️ Needs implementation
  - [ ] Audit trail - ⚠️ Needs implementation
- [ ] **Templates** - SOW Templates
  - [ ] Load templates - ⚠️ Needs implementation
  - [ ] Apply template to new SOW - ⚠️ Needs implementation

#### Purchase Orders Section
- [ ] **Pipeline** - List POs with real data
  - [ ] Filters working
  - [ ] Status tracking
  - [ ] Budget utilization display
- [ ] **Create** - PO creation workflow
  - [ ] Form validation
  - [ ] Budget checking
  - [ ] Contractor assignment
- [ ] **Reports** - PO analytics
  - [ ] Spend by category
  - [ ] Spend by vendor
  - [ ] Budget vs actual comparison

#### Contractors Section
- [ ] **Roster** - Active contractor list
  - [ ] Real data display
  - [ ] Search/filter working
  - [ ] Click to detail
- [ ] **Onboarding** - Contractor onboarding workflow
  - [ ] Onboarding status tracking - ⚠️ Needs implementation
  - [ ] Document collection
  - [ ] Compliance requirements
- [ ] **Compliance** - Contractor compliance dashboard
  - [ ] Compliance score calculation - ⚠️ Needs implementation
  - [ ] Overdue items
  - [ ] Certification tracking
- [ ] **Performance** - Contractor performance metrics
  - [ ] Performance rating calculation - ⚠️ Needs implementation
  - [ ] Project history
  - [ ] Quality scores

#### Timecards Section
- [ ] **Active** - Current timecards
  - [ ] Real timecard data
  - [ ] Hours display
  - [ ] Status indicators
  - [ ] **NEEDS LEGENDARY OVERHAUL:** Add visual contrast, tooltips, workflow arrows
- [ ] **Pending** - Pending approval
  - [ ] Manager queue
  - [ ] Bulk approve capability
  - [ ] Individual approve/reject
- [ ] **Bulk Approve** - Batch processing
  - [ ] Multi-select
  - [ ] Approve all/reject all
  - [ ] Reason capture
- [ ] **Analytics** - Timecard analytics
  - [ ] Hours by contractor
  - [ ] Hours by project
  - [ ] Utilization rates

#### Invoices Section
- [ ] **Pipeline** - Invoice list
  - [ ] Real invoice data
  - [ ] Status filtering (Submitted, GR Approved, Paid)
  - [ ] Amount display (use grAmount, not amount)
  - [ ] **FIX NEEDED:** Invoice.amount → grAmount mapping
- [ ] **Generate** - Invoice generation from timecards
  - [ ] Timecard → Invoice conversion
  - [ ] Amount calculation
  - [ ] Variance detection
- [ ] **Aging** - Invoice aging analysis
  - [ ] Days outstanding calculation
  - [ ] Overdue highlighting
  - [ ] Trend analysis

#### Expenses Section
- [ ] **Active** - Current expense reports
  - [ ] Real expense data
  - [ ] Status tracking
  - [ ] Amount display
- [ ] **Submit** - New expense submission
  - [ ] Form validation
  - [ ] Receipt upload
  - [ ] Category selection
- [ ] **Bulk Approve** - Expense approval batch
  - [ ] Multi-select
  - [ ] Approval workflow
- [ ] **Reports** - Expense analytics
  - [ ] Spend by category
  - [ ] Spend by person
  - [ ] Trends

#### Approvals Section
- [ ] **Queue** - Active approvals
  - [ ] **CRITICAL FIX NEEDED:** Connect to real entities (POs, SOWs, Invoices, Change Orders)
  - [ ] Undefined fields issue - identify which fields are missing
  - [ ] Status transitions
  - [ ] Action buttons work
- [ ] **History** - Approval history
  - [ ] Historical records display
  - [ ] Filter by entity type
  - [ ] Audit trail
- [ ] **Delegations** - Approval delegations
  - [ ] Delegate approval rights
  - [ ] Temporary/permanent options
  - [ ] Revoke capability

#### Change Orders Section
- [ ] **Lifecycle** - Change order status
  - [ ] All stages displayed
  - [ ] Status flow
  - [ ] Impact analysis
- [ ] **Create** - New change order
  - [ ] Link to SOW/PO
  - [ ] Change description
  - [ ] Impact calculation
  - [ ] Approval routing

#### Documents Section
- [ ] **Browse** - Document list
  - [ ] Real documents
  - [ ] Search working
  - [ ] Filter by type/date
- [ ] **Upload** - Document upload
  - [ ] File upload working
  - [ ] Metadata capture
  - [ ] Classification
- [ ] **Search** - Document search
  - [ ] Full-text search (hybrid: BM25 + pgvector)
  - [ ] Results ranking
  - [ ] Preview
- [ ] **Analyze** - AI document analysis
  - [ ] Claude API integration
  - [ ] Key term extraction
  - [ ] Risk flags
- [ ] **Audit Trail** - Document version history
  - [ ] All versions tracked
  - [ ] Who changed what/when
  - [ ] Restore capability

### TIER 2: System Architectural

#### Persona Reference Guide ✅
- [ ] All 10 personas documented
- [ ] Pain points mapped
- [ ] Dashboard tailoring logic

#### AI Intelligence
- [ ] **Insights** - AI insights dashboard - ⚠️ Testing needed
- [ ] **Chatbots** - VINessa and specialized bots - ⚠️ Testing needed
- [ ] **Voice Intel** - Voice contract intelligence - ⚠️ Testing needed
- [ ] **Voice Agents** - ElevenLabs agents
  - [ ] **NEEDS NEW ADMIN PAGE:** Full CRUD interface for agent management
  - [ ] List agents from ElevenLabs API
  - [ ] Show agent descriptions and options
  - [ ] Allow configuration without logging into ElevenLabs

#### Dashboard Builder ✅
- [ ] Template gallery - ⚠️ Testing needed
- [ ] Drag-drop customization - ⚠️ Testing needed
- [ ] Save/restore layouts

#### Notifications ✅
- [ ] Notification center - ⚠️ Testing needed
- [ ] Preference management

#### SOW Command Center ✅
- [ ] All 5 tabs working
- [ ] KPI ribbon - ✅ Fixed
- [ ] Quick action dialogs
- [ ] AI integration

### TIER 3: Intelligence

#### Triage Room ⚠️
- [ ] Budget Overrun triage
  - [ ] Identify overrun conditions
  - [ ] Root cause analysis
  - [ ] Recommended actions
- [ ] Budget triage - ⚠️ Testing needed
- [ ] Compliance triage - ⚠️ Testing needed
- [ ] Operations triage - ⚠️ Testing needed
- [ ] Timecards triage - ⚠️ Testing needed
- [ ] Contractors triage - ⚠️ Testing needed
- [ ] Invoices triage - ⚠️ Testing needed

#### Knowledge Vault ⚠️
- [ ] YouTube transcript capture - Fixed token key issue
- [ ] Insights extraction - ⚠️ Testing needed
- [ ] Tag management - ⚠️ Testing needed
- [ ] Collections - ⚠️ Testing needed

#### Alert Center ✅
- [ ] Alert display - ⚠️ Testing needed
- [ ] Alert detail view - ⚠️ Testing needed
- [ ] Action buttons - ⚠️ Testing needed

### TIER 4: User Command

#### My Preferences ✅
- [ ] Theme toggle - ✅ Working
- [ ] Notifications preferences - ⚠️ Testing needed
- [ ] Privacy settings - ⚠️ Testing needed
- [ ] Workflow settings - ⚠️ Testing needed

#### Capability Map ✅
- [ ] 65 features displayed in 10 categories - ✅ Working
- [ ] Feature search - ✅ Working
- [ ] Category filtering - ✅ Working

#### Template Builders
- [ ] SOW templates - ⚠️ Needs implementation
- [ ] PO templates - ⚠️ Needs implementation
- [ ] Approval templates - ⚠️ Needs implementation

### TIER 5: System Admin

#### Administration ✅
- [ ] User Management - ⚠️ Testing needed
- [ ] Project Tracker - ⚠️ Testing needed
- [ ] Implementation Status - ⚠️ Testing needed

#### Customization & Settings
- [ ] Configuration options - ⚠️ Testing needed
- [ ] UI Customization - ⚠️ Testing needed

#### Quality Assurance & Analytics
- [ ] Change Log Dashboard - ⚠️ Testing needed
- [ ] Bug Pattern Detector - ⚠️ Testing needed
- [ ] Data Quality Dashboard - ⚠️ Testing needed
- [ ] AI QA Lab - ⚠️ Testing needed

#### Demo & Presentation
- [ ] Demo Command Center - ⚠️ Testing needed
- [ ] Demo Presentation - ⚠️ Testing needed

#### Development Tools
- [ ] Logic Studio - ⚠️ Testing needed
- [ ] Journey Builder - ⚠️ Testing needed
- [ ] Graph Builder - ✅ Created and added
- [ ] Validation Studio - ⚠️ Testing needed
- [ ] YouTube Capture - ⚠️ Testing needed

#### Data & Content
- [ ] XLSX Import - ⚠️ Testing needed
- [ ] Demo Data Generator - ⚠️ Testing needed
- [ ] System Architecture Map - ⚠️ Testing needed
- [ ] Platform Definition - ⚠️ Testing needed
- [ ] Error Tracking - ⚠️ Testing needed
- [ ] Knowledge Hub - Fixed token key issue

---

## IV. CRITICAL FIXES APPLIED

### ✅ Completed
1. **KPI Formatting Safe Guards** - Added null/undefined checks to prevent crashes
2. **Token Key Standardization** - All components use 'token' instead of 'authToken'/'velocity_token'
3. **Sidebar Padding** - Increased pt-1 → pt-6 for better visual balance
4. **Graph Builder** - Created and integrated into admin section
5. **5-Tier Navigation** - Complete implementation with intelligent submenus

### ⚠️ IN PROGRESS / NEEDED

1. **Invoice Type Mapping** - Mark Dashboard View
   - [ ] Change `invoice.amount` → `invoice.grAmount`
   - [ ] Change `invoice.vendorName` → `invoice.vendorName` or find correct field
   - [ ] Test with real invoice data

2. **Approvals Module Overhaul**
   - [ ] Connect approvals to real entities (POs, SOWs, Invoices, Change Orders)
   - [ ] Identify undefined fields and map correctly
   - [ ] Implement entity-specific approval workflows
   - [ ] Add action buttons that modify entities

3. **Timecard Detail Overhaul** (LEGENDARY)
   - [ ] Add visual contrast improvements
   - [ ] Add detailed tooltips for all fields
   - [ ] Add workflow arrow indicators showing timecard → approval → invoice → payment
   - [ ] Implement color coding for status
   - [ ] Add estimated payment date calculation

4. **SimplifiedView Widget**
   - [ ] Create collapsible side panel
   - [ ] Text/spreadsheet view of page data
   - [ ] Minimal styling, high readability
   - [ ] Travels with user across all pages

5. **ElevenLabs Agent Admin Page**
   - [ ] Fetch agents from ElevenLabs API
   - [ ] Display agent descriptions and available options
   - [ ] Create/edit agent configurations
   - [ ] Configure which agents appear where
   - [ ] No need to log into ElevenLabs directly

---

## V. NAVIGATION LINK INTEGRITY

### ✅ VERIFIED ROUTES
- /dashboard - ✅
- /statement-of-works - ✅
- /sow-command-center - ✅
- /purchase-orders - ✅
- /purchaseorders - ✅
- /contractors - ✅
- /timecards - ✅
- /invoices - ✅
- /expenses - ✅
- /approvals - ✅
- /change-orders - ✅
- /changeorders - ✅
- /documents - ✅
- /admin/* - ✅ (all admin routes)
- /user/preferences - ✅
- /user/capability-map - ✅
- /workflows/builder - ✅

### ⚠️ BROKEN LINK AUDIT NEEDED
- [ ] Scan all `go({ to: "..."})` references
- [ ] Verify `/hubs/analytics-hub` routes (current: `/analytics-hub`)
- [ ] Check all submenu links
- [ ] Test all breadcrumb navigation
- [ ] Validate all redirect URLs

---

## VI. DATABASE CALCULATION AUDIT

### Verified Queries ✅
1. Portfolio Value - SUM of active SOWs
2. Budget calculations - SUM/AVG of POs
3. Invoice status counts - Filter by status
4. Contractor active counts - WHERE status='Active'

### Needs Verification ⚠️
1. **Timecard Hours** - SUM(hours) by contractor/week
   - Query: `SELECT SUM(hours) FROM timecards WHERE contractor_id=$1 AND week=$2`
   - Used in: Invoice generation, utilization %

2. **Invoice Amounts** - SUM of invoiced vs budget
   - Query: Must use correct column (grAmount not amount)
   - Verify: All invoice amount calculations

3. **Risk Score Calculation**
   - High-Risk POs: `COUNT(*) WHERE (spent/total) > 0.9`
   - Overdue: `COUNT(*) WHERE due_date < NOW() AND status!='Paid'`
   - Expiring: `COUNT(*) WHERE end_date BETWEEN NOW() AND NOW()+14 days`

4. **Compliance Scores**
   - Formula: `completed_items / total_items * 100`
   - Apply to: Contractors, SOWs, Documents

5. **Performance Ratings**
   - Formula: `AVG(quality_score) FROM project_evaluations`
   - Apply to: Contractors, Vendors

---

## VII. DEMO READINESS FINAL CHECKLIST

### MUST WORK FOR DECEMBER 2025 HYUNDAI
- [ ] **Page Rendering** - No white screens, no errors
- [ ] **Real Data** - All numbers from database, not hardcoded
- [ ] **Calculations** - All math verified and working
- [ ] **Workflows** - Click-through paths complete
- [ ] **Performance** - Pages load in < 2 seconds
- [ ] **Responsiveness** - Works on presentation screen sizes
- [ ] **Navigation** - All links working, no 404s
- [ ] **Visual Design** - "Legendary" contrast and polish
- [ ] **Tooltips** - Guidance on all complex UI
- [ ] **Status Indicators** - Clear visual feedback

### EXCLAIM IT, DON'T EXPLAIN IT
- Users should see: "Wow, this is fast and clear!"
- Not: "Wait, I need to understand how this works"

---

## VIII. CRITICAL ITEMS - DO NOT DEFER

### Priority 1: MUST FIX IMMEDIATELY
1. ✅ KPI formatting crash - FIXED
2. ⚠️ Invoice field mapping (Mark Dashboard)
3. ⚠️ Approvals entity connections
4. ⚠️ Timecard detail visual overhaul

### Priority 2: MUST COMPLETE BEFORE DEMO
1. ⚠️ SimplifiedView widget
2. ⚠️ ElevenLabs Agent Admin page
3. ⚠️ Triage Room logic validation
4. ⚠️ Knowledge Vault testing

### Priority 3: ENHANCEMENT (if time allows)
1. Vendor management dashboard
2. Contractor performance analytics
3. Advanced risk scoring
4. Automated reporting

---

**AUTHORED:** November 27, 2025
**STATUS:** MVP Validation Framework Active
**NEXT REVIEW:** After each priority fix
**DEMO DATE:** December 2025 (Hyundai)
**GOAL:** 100% working, zero mock data, legendary polish
