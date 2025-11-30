# VELOCITY Intelligence Network - Business Logic & Formula Map

## 🎯 Expert Data Analyst Perspective

**Purpose:** Reverse-engineer the BUSINESS LOGIC from mockups to understand:
- **What data needs to know what** (dependencies)
- **How calculations work** (formulas)
- **Where data flows** (data pipeline)
- **Why relationships exist** (business rules)

Once we understand the REAL relationships, we can implement them consistently everywhere.

---

## 💰 PROCUREMENT FORMULAS & CALCULATIONS

### Purchase Order Budget Tracking

#### **Core Formula:**
```
Budget Remaining = PO Total Amount - Total Invoices Paid
Budget Used % = (Total Invoices Paid / PO Total Amount) × 100
```

#### **Data Dependencies:**
```
purchase_orders.amount (source)
    ↓
invoices.total_amount WHERE status = 'paid' (aggregate)
    ↓
SUM(invoices.total_amount) = Total Spent
    ↓
amount - Total Spent = Budget Remaining
```

#### **Detailed Calculation Chain:**
```sql
-- What PO needs to know:
SELECT 
  po.po_number,
  po.amount AS budget_total,
  
  -- Calculate total spent (from paid invoices)
  COALESCE(SUM(inv.total_amount), 0) AS budget_spent,
  
  -- Calculate remaining
  po.amount - COALESCE(SUM(inv.total_amount), 0) AS budget_remaining,
  
  -- Calculate percentage used
  ROUND(
    (COALESCE(SUM(inv.total_amount), 0) / po.amount * 100), 
    2
  ) AS percent_used,
  
  -- Determine status based on threshold
  CASE 
    WHEN (COALESCE(SUM(inv.total_amount), 0) / po.amount * 100) >= 100 THEN 'exhausted'
    WHEN (COALESCE(SUM(inv.total_amount), 0) / po.amount * 100) >= 90 THEN 'critical'
    WHEN (COALESCE(SUM(inv.total_amount), 0) / po.amount * 100) >= 80 THEN 'warning'
    ELSE 'healthy'
  END AS budget_status

FROM purchase_orders po
LEFT JOIN invoices inv ON po.po_number = inv.po_number 
  AND inv.payment_status = 'paid'
GROUP BY po.po_number, po.amount;
```

#### **Business Rules:**
- ⚠️ Alert when budget hits 80% (warning)
- 🚨 Alert when budget hits 90% (critical)
- 🛑 Block new invoices when budget hits 100% (exhausted)
- 📧 Notify stakeholders at each threshold

---

## 👷 WORKFORCE COST CALCULATIONS

### Contractor Cost Tracking

#### **Core Formulas:**
```
Total Cost = Regular Hours × Hourly Rate + Overtime Hours × (Hourly Rate × 1.5)
Billing Amount = Hours × Billing Rate (what client pays)
Margin = Billing Amount - Total Cost
Margin % = (Margin / Billing Amount) × 100
```

#### **Data Dependencies:**
```
contractors.hourly_rate (source)
contractors.billing_rate (source)
    ↓
timesheets.regular_hours (transaction)
timesheets.overtime_hours (transaction)
    ↓
CALCULATION: Cost & Billing per Timesheet
    ↓
AGGREGATE: Total Cost per Contractor, per Project, per PO
```

#### **Detailed Calculation Chain:**
```sql
-- Timesheet Level Calculation
WITH timesheet_costs AS (
  SELECT 
    t.id,
    t.contractor_id,
    t.project_id,
    t.po_number,
    
    -- Hours
    t.regular_hours,
    t.overtime_hours,
    t.regular_hours + t.overtime_hours AS total_hours,
    
    -- Cost (what vendor charges us)
    c.hourly_rate,
    (t.regular_hours * c.hourly_rate) AS regular_cost,
    (t.overtime_hours * c.hourly_rate * 1.5) AS overtime_cost,
    (t.regular_hours * c.hourly_rate) + 
    (t.overtime_hours * c.hourly_rate * 1.5) AS total_cost,
    
    -- Billing (what we charge client)
    c.billing_rate,
    (t.regular_hours + t.overtime_hours) * c.billing_rate AS billing_amount,
    
    -- Margin
    ((t.regular_hours + t.overtime_hours) * c.billing_rate) - 
    ((t.regular_hours * c.hourly_rate) + (t.overtime_hours * c.hourly_rate * 1.5)) AS margin,
    
    -- Margin %
    ROUND(
      (((t.regular_hours + t.overtime_hours) * c.billing_rate) - 
       ((t.regular_hours * c.hourly_rate) + (t.overtime_hours * c.hourly_rate * 1.5))) /
      ((t.regular_hours + t.overtime_hours) * c.billing_rate) * 100,
      2
    ) AS margin_percentage
    
  FROM timesheets t
  JOIN contractors c ON t.contractor_id = c.id
  WHERE t.status = 'approved'
)

-- Contractor Summary
SELECT 
  contractor_id,
  COUNT(*) AS timesheet_count,
  SUM(total_hours) AS total_hours_worked,
  SUM(total_cost) AS total_cost_to_company,
  SUM(billing_amount) AS total_billed_to_client,
  SUM(margin) AS total_margin,
  ROUND(AVG(margin_percentage), 2) AS avg_margin_percentage
FROM timesheet_costs
GROUP BY contractor_id;
```

#### **Business Rules:**
- 🎯 Target margin: 20-30%
- ⚠️ Alert if margin < 15%
- 💰 Overtime must be pre-approved
- 📊 Track margin by contractor, project, vendor

---

## 📊 TIME & MATERIALS INVOICING

### Invoice Generation from Timesheets

#### **Core Formula:**
```
Invoice Amount = SUM(Approved Timesheets for Period)
Invoice Due Date = Invoice Date + Payment Terms (NET 30)
```

#### **Data Flow:**
```
1. Contractor submits Timesheet
   ↓
2. Manager approves Timesheet
   ↓
3. System aggregates approved timesheets for billing period
   ↓
4. Creates Invoice Line Items (one per timesheet)
   ↓
5. Generates Invoice (groups by vendor + billing period)
   ↓
6. Sends to Vendor for submission
   ↓
7. Accounting approves Invoice
   ↓
8. Payment processed
   ↓
9. Updates PO budget_spent
```

#### **Invoice Generation Logic:**
```sql
-- Generate Invoice for a Vendor + Billing Period
INSERT INTO invoices (
  invoice_number,
  vendor_id,
  invoice_date,
  due_date,
  subtotal,
  total_amount,
  status
)
SELECT 
  'INV-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || v.id,
  v.id AS vendor_id,
  CURRENT_DATE AS invoice_date,
  CURRENT_DATE + INTERVAL '30 days' AS due_date,
  SUM(
    (t.regular_hours * c.hourly_rate) + 
    (t.overtime_hours * c.hourly_rate * 1.5)
  ) AS subtotal,
  SUM(
    (t.regular_hours * c.hourly_rate) + 
    (t.overtime_hours * c.hourly_rate * 1.5)
  ) AS total_amount,
  'draft' AS status
FROM timesheets t
JOIN contractors c ON t.contractor_id = c.id
JOIN vendors v ON c.vendor_id = v.id
WHERE 
  t.status = 'approved'
  AND t.week_end_date BETWEEN '2025-01-01' AND '2025-01-31'
  AND v.id = 123 -- specific vendor
GROUP BY v.id;

-- Then create line items
INSERT INTO invoice_line_items (
  invoice_id,
  timesheet_id,
  contractor_id,
  description,
  quantity,
  unit_price,
  line_total
)
SELECT 
  (SELECT id FROM invoices WHERE invoice_number = 'INV-...' LIMIT 1),
  t.id,
  c.id,
  c.first_name || ' ' || c.last_name || ' - Week of ' || t.week_start_date,
  t.regular_hours + t.overtime_hours,
  c.hourly_rate,
  (t.regular_hours * c.hourly_rate) + (t.overtime_hours * c.hourly_rate * 1.5)
FROM timesheets t
JOIN contractors c ON t.contractor_id = c.id
WHERE t.status = 'approved'
  AND t.week_end_date BETWEEN '2025-01-01' AND '2025-01-31';
```

#### **Business Rules:**
- 📅 Invoices generated weekly/monthly (configurable)
- ✅ Only approved timesheets can be invoiced
- 🚫 Can't invoice same timesheet twice
- 💵 Payment terms: NET 30 (30 days from invoice date)
- 📧 Auto-notify vendor when invoice is ready

---

## 📈 DASHBOARD KPI CALCULATIONS

### Total Spend

#### **Formula:**
```
Total Spend = SUM(All Paid Invoices for Current Fiscal Year)
Spend Change = (Current Month Spend - Previous Month Spend) / Previous Month Spend × 100
```

#### **Calculation:**
```sql
SELECT 
  -- Current month spend
  COALESCE(SUM(total_amount) FILTER (
    WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE)
  ), 0) AS current_month_spend,
  
  -- Previous month spend
  COALESCE(SUM(total_amount) FILTER (
    WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND invoice_date < DATE_TRUNC('month', CURRENT_DATE)
  ), 0) AS previous_month_spend,
  
  -- YTD Total
  COALESCE(SUM(total_amount) FILTER (
    WHERE EXTRACT(YEAR FROM invoice_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  ), 0) AS ytd_total_spend,
  
  -- Calculate change %
  ROUND(
    ((COALESCE(SUM(total_amount) FILTER (
        WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE)
      ), 0) - 
      COALESCE(SUM(total_amount) FILTER (
        WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
          AND invoice_date < DATE_TRUNC('month', CURRENT_DATE)
      ), 0)) / 
      NULLIF(COALESCE(SUM(total_amount) FILTER (
        WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
          AND invoice_date < DATE_TRUNC('month', CURRENT_DATE)
      ), 0), 0) * 100),
    2
  ) AS spend_change_percentage

FROM invoices
WHERE payment_status = 'paid';
```

### Active Contractors

#### **Formula:**
```
Active Contractors = COUNT(contractors WHERE status = 'active')
Change = Current Month Active - Previous Month Active
```

#### **Calculation:**
```sql
WITH monthly_counts AS (
  SELECT 
    DATE_TRUNC('month', CURRENT_DATE) AS current_month,
    COUNT(*) FILTER (WHERE status = 'active') AS current_active,
    COUNT(*) FILTER (
      WHERE status = 'active' 
      AND start_date < DATE_TRUNC('month', CURRENT_DATE)
    ) AS previous_active
  FROM contractors
)
SELECT 
  current_active,
  previous_active,
  current_active - previous_active AS change,
  ROUND(
    ((current_active - previous_active)::DECIMAL / NULLIF(previous_active, 0) * 100),
    2
  ) AS change_percentage
FROM monthly_counts;
```

### Budget Utilization

#### **Formula:**
```
Budget Used % = (Total PO Spend / Total PO Budgets) × 100
```

#### **Calculation:**
```sql
SELECT 
  SUM(po.amount) AS total_budget,
  SUM(COALESCE(inv_totals.spent, 0)) AS total_spent,
  SUM(po.amount) - SUM(COALESCE(inv_totals.spent, 0)) AS total_remaining,
  ROUND(
    (SUM(COALESCE(inv_totals.spent, 0)) / NULLIF(SUM(po.amount), 0) * 100),
    2
  ) AS percent_used
FROM purchase_orders po
LEFT JOIN (
  SELECT 
    po_number,
    SUM(total_amount) AS spent
  FROM invoices
  WHERE payment_status = 'paid'
  GROUP BY po_number
) inv_totals ON po.po_number = inv_totals.po_number
WHERE po.status IN ('approved', 'active');
```

---

## 🚨 ALERT TRIGGER LOGIC

### Budget Threshold Alerts

#### **Trigger Conditions:**
```sql
-- Check all POs for budget thresholds
WITH po_status AS (
  SELECT 
    po.po_number,
    po.vendor,
    po.amount AS budget,
    COALESCE(SUM(inv.total_amount), 0) AS spent,
    ROUND((COALESCE(SUM(inv.total_amount), 0) / po.amount * 100), 2) AS percent_used
  FROM purchase_orders po
  LEFT JOIN invoices inv ON po.po_number = inv.po_number 
    AND inv.payment_status = 'paid'
  GROUP BY po.po_number, po.vendor, po.amount
)
SELECT 
  po_number,
  vendor,
  budget,
  spent,
  percent_used,
  CASE 
    WHEN percent_used >= 100 THEN 'CRITICAL: Budget Exhausted'
    WHEN percent_used >= 90 THEN 'URGENT: 90% Budget Used'
    WHEN percent_used >= 80 THEN 'WARNING: 80% Budget Used'
    ELSE 'OK'
  END AS alert_type,
  CASE 
    WHEN percent_used >= 100 THEN 'Block new charges, request budget extension'
    WHEN percent_used >= 90 THEN 'Freeze non-essential spending, notify stakeholders'
    WHEN percent_used >= 80 THEN 'Review remaining work, plan for extension if needed'
    ELSE NULL
  END AS recommended_action
FROM po_status
WHERE percent_used >= 80
ORDER BY percent_used DESC;
```

### Contract Expiration Alerts

#### **Trigger Conditions:**
```sql
SELECT 
  c.id,
  c.first_name || ' ' || c.last_name AS contractor_name,
  c.role,
  c.end_date,
  c.end_date - CURRENT_DATE AS days_until_end,
  CASE 
    WHEN c.end_date - CURRENT_DATE <= 7 THEN 'CRITICAL: Expires in 1 week'
    WHEN c.end_date - CURRENT_DATE <= 30 THEN 'WARNING: Expires in 30 days'
    WHEN c.end_date - CURRENT_DATE <= 60 THEN 'NOTICE: Expires in 60 days'
    ELSE 'OK'
  END AS alert_type,
  CASE 
    WHEN c.end_date - CURRENT_DATE <= 7 THEN 'Immediate action: Extend or offboard'
    WHEN c.end_date - CURRENT_DATE <= 30 THEN 'Start extension/replacement process'
    WHEN c.end_date - CURRENT_DATE <= 60 THEN 'Review need, plan for extension'
    ELSE NULL
  END AS recommended_action
FROM contractors c
WHERE 
  c.status = 'active'
  AND c.end_date IS NOT NULL
  AND c.end_date - CURRENT_DATE <= 60
ORDER BY days_until_end ASC;
```

---

## 🎯 PROJECT BUDGET TRACKING

### Project Cost Rollup

#### **Formula:**
```
Project Total Cost = SUM(All Approved Timesheets for Project)
Project Budget Remaining = Project Budget - Project Total Cost
```

#### **Calculation:**
```sql
WITH project_costs AS (
  SELECT 
    p.id,
    p.name,
    p.total_budget,
    
    -- Calculate actual costs from timesheets
    SUM(
      (t.regular_hours * c.hourly_rate) + 
      (t.overtime_hours * c.hourly_rate * 1.5)
    ) AS actual_cost,
    
    -- Count resources
    COUNT(DISTINCT pc.contractor_id) AS contractor_count,
    SUM(t.regular_hours + t.overtime_hours) AS total_hours
    
  FROM projects p
  LEFT JOIN project_contractors pc ON p.id = pc.project_id
  LEFT JOIN contractors c ON pc.contractor_id = c.id
  LEFT JOIN timesheets t ON c.id = t.contractor_id 
    AND t.project_id = p.id
    AND t.status = 'approved'
  GROUP BY p.id, p.name, p.total_budget
)
SELECT 
  id,
  name,
  total_budget,
  COALESCE(actual_cost, 0) AS actual_cost,
  total_budget - COALESCE(actual_cost, 0) AS budget_remaining,
  ROUND(
    (COALESCE(actual_cost, 0) / NULLIF(total_budget, 0) * 100),
    2
  ) AS percent_used,
  contractor_count,
  total_hours,
  CASE 
    WHEN COALESCE(actual_cost, 0) / NULLIF(total_budget, 0) >= 1.0 THEN 'over_budget'
    WHEN COALESCE(actual_cost, 0) / NULLIF(total_budget, 0) >= 0.9 THEN 'critical'
    WHEN COALESCE(actual_cost, 0) / NULLIF(total_budget, 0) >= 0.8 THEN 'warning'
    ELSE 'healthy'
  END AS budget_status
FROM project_costs;
```

---

## 🏢 VENDOR PERFORMANCE METRICS

### Vendor Spend & Performance

#### **Formulas:**
```
Total Vendor Spend = SUM(All Paid Invoices for Vendor)
Active Contractors = COUNT(Contractors WHERE vendor_id = X AND status = 'active')
Avg Cost Per Contractor = Total Vendor Spend / Active Contractors
On-Time Invoice Rate = (On-Time Invoices / Total Invoices) × 100
```

#### **Calculation:**
```sql
WITH vendor_metrics AS (
  SELECT 
    v.id,
    v.name,
    v.category,
    
    -- Financial metrics
    COUNT(DISTINCT inv.id) AS total_invoices,
    SUM(inv.total_amount) FILTER (WHERE inv.payment_status = 'paid') AS total_spend,
    AVG(inv.total_amount) AS avg_invoice_amount,
    
    -- Contractor metrics
    COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') AS active_contractors,
    COUNT(DISTINCT c.id) AS total_contractors,
    
    -- Performance metrics
    COUNT(*) FILTER (
      WHERE inv.submitted_date <= inv.due_date
    ) AS on_time_invoices,
    COUNT(*) FILTER (
      WHERE inv.status = 'rejected'
    ) AS rejected_invoices,
    
    -- Timesheet metrics
    AVG(EXTRACT(DAY FROM (t.approved_at - t.submitted_at))) AS avg_approval_days
    
  FROM vendors v
  LEFT JOIN contractors c ON v.id = c.vendor_id
  LEFT JOIN invoices inv ON v.id = inv.vendor_id
  LEFT JOIN timesheets t ON c.id = t.contractor_id AND t.status = 'approved'
  WHERE EXTRACT(YEAR FROM inv.invoice_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  GROUP BY v.id, v.name, v.category
)
SELECT 
  id,
  name,
  category,
  total_spend,
  active_contractors,
  ROUND(total_spend / NULLIF(active_contractors, 0), 2) AS cost_per_contractor,
  ROUND(
    (on_time_invoices::DECIMAL / NULLIF(total_invoices, 0) * 100),
    2
  ) AS on_time_rate,
  ROUND(
    (rejected_invoices::DECIMAL / NULLIF(total_invoices, 0) * 100),
    2
  ) AS rejection_rate,
  ROUND(avg_approval_days, 1) AS avg_approval_days,
  CASE 
    WHEN on_time_invoices::DECIMAL / NULLIF(total_invoices, 0) >= 0.95 
      AND rejected_invoices::DECIMAL / NULLIF(total_invoices, 0) < 0.05 
      THEN 'excellent'
    WHEN on_time_invoices::DECIMAL / NULLIF(total_invoices, 0) >= 0.85 
      AND rejected_invoices::DECIMAL / NULLIF(total_invoices, 0) < 0.10 
      THEN 'good'
    WHEN on_time_invoices::DECIMAL / NULLIF(total_invoices, 0) >= 0.70 
      THEN 'fair'
    ELSE 'needs_improvement'
  END AS performance_rating
FROM vendor_metrics
ORDER BY total_spend DESC;
```

---

## 📊 STANDARD CALCULATION PATTERNS

### Pattern 1: Budget Tracking
**Used in:** POs, Projects, Cost Centers
```sql
budget_total - SUM(actuals) = budget_remaining
(SUM(actuals) / budget_total × 100) = percent_used
```

### Pattern 2: Period-over-Period Change
**Used in:** Dashboard KPIs, Trend Analysis
```sql
((current_value - previous_value) / previous_value × 100) = change_percentage
```

### Pattern 3: Weighted Average
**Used in:** Rates, Margins, Performance Scores
```sql
SUM(value × weight) / SUM(weight) = weighted_average
```

### Pattern 4: Status Classification
**Used in:** Alerts, Health Indicators
```sql
CASE 
  WHEN metric >= threshold_critical THEN 'critical'
  WHEN metric >= threshold_warning THEN 'warning'
  ELSE 'healthy'
END
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Data Model
- [ ] All formulas have source data in database
- [ ] All calculations can be computed from available fields
- [ ] No circular dependencies in calculations
- [ ] Indexes on fields used in calculations

### Business Rules
- [ ] Thresholds defined as constants (80%, 90%, 100%)
- [ ] Alert triggers documented
- [ ] Workflow states clearly defined
- [ ] Validation rules specified

### Performance
- [ ] Complex calculations use materialized views
- [ ] Aggregations pre-computed where possible
- [ ] Indexes on GROUP BY and JOIN columns
- [ ] Query plans reviewed for expensive operations

---

**This is the REAL data model** - not just tables and foreign keys, but **business logic, formulas, and dependencies**. Once we implement this correctly, all UI formatting and calculations will be consistent everywhere!
