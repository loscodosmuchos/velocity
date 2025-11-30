# VELOCITY Assessment Prompt - For Evaluating Another Replit Build

## 🎯 Purpose
Use this prompt to assess another Replit Agent that is building VELOCITY Intelligence Network. This comprehensive evaluation ensures they haven't missed anything and provides actionable feedback.

---

## 📋 THE ASSESSMENT PROMPT

Copy and paste this to another Replit Agent building VELOCITY:

```
I need you to perform a comprehensive assessment of the VELOCITY Intelligence 
Network build in this Repl. This is a critical evaluation to ensure quality 
standards are met before demo/deployment.

Please analyze the following areas and provide detailed feedback:

═══════════════════════════════════════════════════════════════════════════

## 1️⃣ FUNCTIONAL COMPLETENESS AUDIT

### Database Schema
- [ ] Verify all 8 core tables exist (contractors, purchase_orders, timesheets, 
      invoices, projects, alerts, vendors, users)
- [ ] Check foreign key relationships are implemented
- [ ] Confirm indexes exist on frequently queried columns
- [ ] Validate data types match specification (DECIMAL for money, etc.)
- [ ] Test that migrations ran successfully

For each table, run these queries and report results:
```sql
-- Check table exists and structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contractors';

-- Check for sample data
SELECT COUNT(*) FROM contractors;
SELECT * FROM contractors LIMIT 3;
```

### API Endpoints
Test each endpoint from API_SPECIFICATION.md:

Authentication:
- [ ] POST /api/auth/login (test with valid and invalid credentials)
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me

Contractors:
- [ ] GET /api/contractors (list all)
- [ ] GET /api/contractors/:id (get one)
- [ ] POST /api/contractors (create new)
- [ ] PATCH /api/contractors/:id (update)
- [ ] DELETE /api/contractors/:id (soft delete)

Purchase Orders:
- [ ] GET /api/purchase-orders
- [ ] GET /api/purchase-orders/:po_number
- [ ] POST /api/purchase-orders
- [ ] Verify budget calculations are correct

Timesheets:
- [ ] GET /api/timesheets
- [ ] POST /api/timesheets
- [ ] PATCH /api/timesheets/:id/approve
- [ ] PATCH /api/timesheets/:id/reject
- [ ] Verify amount calculations match BUSINESS_LOGIC_MAP.md formulas

Alerts:
- [ ] GET /api/alerts
- [ ] PATCH /api/alerts/:id/resolve
- [ ] Verify alerts auto-generate at 80%, 90%, 100% budget thresholds

Dashboard:
- [ ] GET /api/dashboard/kpis
- [ ] GET /api/dashboard/spending-trends
- [ ] Verify calculations match specifications

For each endpoint, provide:
- HTTP status code returned
- Response body sample
- Any errors encountered
- Whether business logic is correctly implemented

═══════════════════════════════════════════════════════════════════════════

## 2️⃣ USER PERSPECTIVE TESTING

Navigate the application as these personas and document the experience:

### Persona 1: Procurement Manager
Goal: Create a new Purchase Order

Steps:
1. Start from dashboard
2. Navigate to Purchase Orders page
3. Look for "Create PO" button
4. Fill out PO creation form
5. Submit and verify PO appears in list
6. Navigate to PO detail page
7. Verify all data is correct

Document:
- Was every step intuitive?
- Did you encounter any errors?
- Were there any missing features?
- Did it feel professional or like a prototype?
- Screenshot each step

### Persona 2: HR Manager
Goal: Approve pending timesheets

Steps:
1. Navigate to Timesheets page
2. Filter to "Pending" status
3. Click a pending timesheet
4. Review details
5. Approve the timesheet
6. Verify status changes to "Approved"
7. Check that PO budget updated
8. Verify alert triggered if threshold crossed

Document the journey with screenshots.

### Persona 3: Executive
Goal: Review workforce analytics

Steps:
1. View Dashboard KPIs
2. Click on "Budget Utilization" card
3. Drill down to budget details
4. Click on a spending trend data point
5. Navigate to filtered view
6. Export a report

Document any broken drill-downs or missing interactions.

═══════════════════════════════════════════════════════════════════════════

## 3️⃣ COMPLETE CRUD VERIFICATION

For EACH of these entities, verify full CRUD operations work:

### Contractors
- [ ] CREATE: Can add new contractor with all required fields
- [ ] READ: List view shows all contractors
- [ ] UPDATE: Can edit contractor details
- [ ] DELETE: Can deactivate contractor
- [ ] IMPORT: Can upload CSV of contractors (if implemented)

### Purchase Orders
- [ ] CREATE: Multi-step wizard or form works
- [ ] READ: List shows accurate budget status
- [ ] UPDATE: Can edit PO details
- [ ] DELETE: Can close PO

### Timesheets
- [ ] CREATE: Submit timesheet form works
- [ ] READ: List filters by status
- [ ] APPROVE: Manager can approve
- [ ] REJECT: Manager can reject with reason

### Invoices
- [ ] CREATE: Can create invoice
- [ ] READ: List shows payment status
- [ ] UPDATE: Can edit pending invoice
- [ ] DELETE: Can cancel invoice

### SOWs (Statements of Work)
- [ ] CREATE: Can create new SOW
- [ ] READ: SOW library accessible
- [ ] UPDATE: Can amend SOW
- [ ] DELETE: Can archive SOW
- [ ] UPLOAD: Can import SOW document (if implemented)

For any entity missing CRUD operations, list what's missing.

═══════════════════════════════════════════════════════════════════════════

## 4️⃣ BUSINESS LOGIC VALIDATION

Test these critical calculations from BUSINESS_LOGIC_MAP.md:

### PO Budget Tracking
Create test scenario:
- New PO: $100,000 budget
- Submit timesheet: $40,000
- Approve timesheet
- Verify: budget_spent = $40,000, budget_remaining = $60,000, percent_used = 40%

### Alert Triggers
Test each threshold:
- [ ] 80% budget used → Warning alert appears
- [ ] 90% budget used → Critical alert appears
- [ ] 100% budget used → Exhausted alert + block new timesheets

### Timesheet Amount Calculation
Test formula: total_amount = (regular_hours × rate) + (overtime_hours × rate × 1.5)

Example:
- Regular: 40 hours @ $85/hr = $3,400
- Overtime: 5 hours @ $85/hr × 1.5 = $637.50
- Total: $4,037.50

Submit test timesheet and verify calculation matches.

### Vendor Performance Rating
Check if rating calculation follows specification:
- on_time_rate >= 95% AND rejection_rate < 5% → "excellent"
- on_time_rate >= 85% AND rejection_rate < 10% → "good"
- on_time_rate >= 70% → "fair"
- else → "needs_improvement"

═══════════════════════════════════════════════════════════════════════════

## 5️⃣ UI/UX STANDARDS COMPLIANCE

Check against UI_STANDARDIZATION_GUIDE.md:

### Page Layout
- [ ] All pages use StandardPageLayout wrapper OR manual PAGE.wrapper + 
      PAGE.container + PAGE.spacing
- [ ] Consistent max-w-7xl containers
- [ ] Consistent gap-6 spacing system
- [ ] Mobile responsive (test at 375px, 768px, 1024px, 1920px)

### Component Usage
- [ ] All UI components use Tremor (Card, Title, Text, Badge, Table)
- [ ] NOT shadcn components for new features
- [ ] KPI cards follow institutional style (p-6, border-l-4, text-4xl)
- [ ] Tables use proper structure (headers, hover states, dividers)

### Color System
- [ ] Using COLORS constants from standards.ts
- [ ] Automotive theme colors (blue, purple, cyan)
- [ ] Consistent color usage across pages

### Typography
- [ ] Proper hierarchy (text-4xl for metrics, text-xs for labels)
- [ ] Uppercase labels (text-xs uppercase tracking-wide)
- [ ] Font weights consistent

### Data Highlighting (PROCUREMENT-FIRST)
Check if these 5 data points are visually emphasized:
- [ ] WHO: Contractor names (font-medium)
- [ ] HOW MUCH: Rates/costs (text-blue-600 font-bold)
- [ ] WHICH: PO numbers (Badge component)
- [ ] WHAT: Projects/scope (visible)
- [ ] HOW MUCH LEFT: Budget remaining (text-green-600 font-semibold)

═══════════════════════════════════════════════════════════════════════════

## 6️⃣ INTERACTION FLOWS VERIFICATION

Test these key flows from INTERACTION_FLOWS.md:

### Dashboard → Drill-Down
- [ ] Click "Budget Utilization" KPI → Navigate to /insights
- [ ] Click "Active Contractors" KPI → Navigate to /contractor-management
- [ ] Click "Critical Alerts" KPI → Navigate to /critical-alerts
- [ ] Click "Total Spend" KPI → Navigate to /pc2-tm-spend-tracking

### Chart Interactions
- [ ] Click bar in spending chart → Filter to that vendor
- [ ] Click data point in trend line → Show month details
- [ ] Click location on map → Filter to that location

### Table Interactions
- [ ] Click contractor name → Navigate to detail page
- [ ] Click PO number → Navigate to PO detail
- [ ] Click column header → Sort table
- [ ] Use search box → Filter results
- [ ] Use status filter → Filter table

### Form Workflows
- [ ] Submit creates record
- [ ] Validation prevents invalid data
- [ ] Success message appears
- [ ] List refreshes automatically
- [ ] Navigate to detail page of new record

Document any broken interactions.

═══════════════════════════════════════════════════════════════════════════

## 7️⃣ EVIDENCE-BASED COMPLETION CHECK

For any feature claimed as "complete," verify evidence exists:

Required Evidence per Feature:
- [ ] Screenshot of working feature
- [ ] Test output or API response
- [ ] Database query showing data
- [ ] User flow documentation

Check recent task completions:
- Review task list (if exists)
- For each "completed" task, look for evidence
- Flag any completion without proof

═══════════════════════════════════════════════════════════════════════════

## 8️⃣ ERROR HANDLING & EDGE CASES

Test these failure scenarios:

### Form Validation
- [ ] Submit empty required field → Shows error
- [ ] Submit invalid email → Shows format error
- [ ] Submit duplicate employee_id → Shows conflict error
- [ ] Submit timesheet with >60 hours → Shows validation error

### Network Errors
- [ ] Disconnect internet, try to save → Shows retry option
- [ ] Slow API response → Shows loading state
- [ ] 500 server error → Shows user-friendly message

### Authorization
- [ ] Try to access admin page as viewer → Redirects or shows 403
- [ ] Try to edit another user's timesheet → Blocked

### Empty States
- [ ] New database with no data → Empty state with "Create First" CTA
- [ ] Filtered table with no results → "No results found" message

### Edge Cases
- [ ] PO with $0 budget → Handles gracefully
- [ ] Contractor with no assignments → Profile still loads
- [ ] Timesheet for non-existent PO → Validation error

═══════════════════════════════════════════════════════════════════════════

## 9️⃣ DEMO READINESS ASSESSMENT

Imagine demoing this to an executive managing $100M in procurement tomorrow.

### Pre-Demo Checklist
- [ ] All demo pages load without errors
- [ ] All buttons work as expected
- [ ] All data is realistic (not "Test Test")
- [ ] No console errors visible (check browser console)
- [ ] No Lorem Ipsum placeholder text
- [ ] No "TODO" or "Coming Soon" on visible screens
- [ ] Mobile responsive (if presenting on tablet)
- [ ] Professional styling throughout

### Demo Killers
Look for these issues:
- [ ] Button click → nothing happens
- [ ] Form submission → error
- [ ] Dashboard shows all zeros
- [ ] Slow loading (>5 seconds)
- [ ] Inconsistent styling
- [ ] Broken images/icons

Rate demo readiness: 1-10 scale
If < 8, list what needs fixing.

═══════════════════════════════════════════════════════════════════════════

## 🔟 GAP ANALYSIS

Compare current state vs. specifications:

### Missing Features
Cross-reference VELOCITY_MASTER_SITE_MAP.md:
- List all routes that should exist
- Identify which are missing or broken

Cross-reference MVP_SPEC.md:
- Check if all 7 core MVP features are implemented
- List any missing functionality

### Incomplete CRUD
List entities with incomplete CRUD:
- Missing CREATE operations
- Missing UPDATE operations
- Missing DELETE operations
- Missing IMPORT/EXPORT

### Missing Business Logic
From BUSINESS_LOGIC_MAP.md, check:
- [ ] Budget calculations implemented
- [ ] Alert triggers implemented
- [ ] Timesheet amount calculations
- [ ] Vendor performance ratings
- [ ] All formulas accurate

═══════════════════════════════════════════════════════════════════════════

## 📊 ASSESSMENT REPORT FORMAT

Please provide your findings in this structure:

### SUMMARY
- Overall completion percentage: ___%
- Demo readiness score (1-10): ___
- Critical blockers: ___
- Major issues: ___
- Minor issues: ___

### CRITICAL BLOCKERS (Must fix before demo)
1. [Issue description + screenshot/evidence]
2. [Issue description + screenshot/evidence]

### MAJOR ISSUES (Should fix soon)
1. [Issue description]
2. [Issue description]

### MINOR ISSUES (Nice to have)
1. [Issue description]
2. [Issue description]

### POSITIVE FINDINGS (What's working well)
1. [Feature/aspect working correctly]
2. [Feature/aspect working correctly]

### MISSING FEATURES (Per specification)
- [ ] Feature from spec not implemented
- [ ] Feature from spec not implemented

### RECOMMENDATIONS
1. Priority 1: [Action item]
2. Priority 2: [Action item]
3. Priority 3: [Action item]

### EVIDENCE ATTACHMENTS
- Screenshot 1: [Description]
- Screenshot 2: [Description]
- Test results: [Summary]

═══════════════════════════════════════════════════════════════════════════

## ⚡ EXECUTION INSTRUCTIONS

1. Start by examining the database schema
2. Test all API endpoints systematically
3. Navigate the UI as each persona
4. Verify CRUD operations for all entities
5. Test business logic calculations
6. Check UI standards compliance
7. Test interaction flows
8. Test error handling
9. Evaluate demo readiness
10. Compile comprehensive report

Take your time. Be thorough. Provide evidence (screenshots, query results, 
API responses) for all findings.

Remember: We're demoing to executives tomorrow. Every mistake costs credibility.
```

═══════════════════════════════════════════════════════════════════════════

## 📝 USAGE NOTES

**When to Use This Prompt:**
- After major development milestones
- Before demos/presentations
- When quality concerns arise
- Periodic health checks (weekly/biweekly)
- Before deployment/publishing

**Expected Output:**
- 30-50 page comprehensive report
- 10-20 screenshots of issues/successes
- Specific SQL queries and results
- API test results
- Prioritized action items

**How Another AI Will Use This:**
1. Copy entire prompt
2. Paste into Replit Agent chat
3. Agent will systematically test everything
4. Agent will compile detailed report
5. You'll get actionable feedback with evidence

**Benefits:**
- Catches issues before demos
- Validates against specifications
- Provides evidence-based feedback
- Identifies gaps in implementation
- Ensures quality standards met

---

*This assessment prompt ensures another Replit Agent provides the same rigorous 
quality evaluation we apply to our own work.*
