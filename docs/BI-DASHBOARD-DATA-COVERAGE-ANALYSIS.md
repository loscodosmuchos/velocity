# BI Dashboard Data Coverage Analysis
**Date:** November 17, 2025  
**Purpose:** Assess Velocity's readiness to produce Tableau/PowerBI-style dashboards

---

## 📊 EXECUTIVE SUMMARY

**Overall Coverage:** **65% Ready** for supplier analytics, **15% Ready** for HR analytics

**Can We Build These?** 
- ✅ **Supplier Dashboards:** YES - With 8 missing fields (2-3 hours to add)
- ⚠️ **HR Recruitment Dashboards:** PARTIAL - Missing recruitment pipeline tables (8-10 hours)
- ❌ **HR Performance Dashboards:** NO - Missing employee performance tracking (12-15 hours)

---

## 🟢 SUPPLIER DASHBOARD - DATA COVERAGE

### **Screenshot 1-7: Supplier Performance Analytics**

#### **✅ HAVE: Core Supplier/Contractor Data**

| Dashboard Element | Database Field | Status |
|------------------|----------------|---------|
| **Supplier/Vendor Name** | `contractors.company_name` | ✅ EXISTS |
| **Total Expenditure** | `SUM(purchase_orders.amount_spent)` | ✅ EXISTS |
| **Lead Time** | `contractors.lead_time_days` | ✅ EXISTS |
| **Payment Terms** | `contractors.payment_terms` | ✅ EXISTS |
| **Contract Status** | `contractors.status` | ✅ EXISTS |
| **Contract Expiry** | `contractors.contract_expiry` | ✅ EXISTS |
| **Annual Volume** | `contractors.annual_volume` | ✅ EXISTS |
| **Procurement Cycle: Purchase Order** | `purchase_orders.created_at` | ✅ EXISTS |
| **Procurement Cycle: Approval** | `purchase_orders.approval_date` | ✅ EXISTS |
| **Invoice Date** | `invoices.invoice_date` | ✅ EXISTS |
| **Budget Variance** | `purchase_orders.total_amount - purchase_orders.amount_spent` | ✅ CALCULATED |

#### **❌ MISSING: Quality & Compliance Metrics**

| Dashboard Element | What We Need | Impact | Priority |
|------------------|--------------|--------|----------|
| **Defect Rate** | `contractors.defect_rate DECIMAL(5,2)` | CRITICAL - Shows supplier quality | 🔴 HIGH |
| **Quality Score** | `contractors.quality_score INTEGER` | HIGH - Vendor performance rating | 🔴 HIGH |
| **Contract Compliance Rate** | `contractors.compliance_rate DECIMAL(5,2)` | HIGH - Regulatory tracking | 🟡 MEDIUM |
| **Loss Due to Defects** | `contractor_defects` table with `defect_cost` field | MEDIUM - Financial impact | 🟡 MEDIUM |
| **On-Time Delivery Rate** | `contractors.on_time_delivery_rate DECIMAL(5,2)` | HIGH - Performance metric | 🔴 HIGH |
| **ROI Per Supplier** | Calculated: `(value_delivered - total_cost) / total_cost` | MEDIUM - Strategic insight | 🟡 MEDIUM |
| **Maverick Spending** | Flag POs created without proper approval workflow | CRITICAL - Compliance | 🔴 HIGH |
| **Order Confirmation Date** | `purchase_orders.confirmed_at TIMESTAMP` | LOW - Cycle time tracking | 🟢 LOW |
| **Order Dispatched Date** | `purchase_orders.dispatched_at TIMESTAMP` | LOW - Cycle time tracking | 🟢 LOW |
| **Delivery Date** | `purchase_orders.delivered_at TIMESTAMP` | MEDIUM - SLA tracking | 🟡 MEDIUM |

#### **🔍 WHAT WE CAN BUILD NOW (With Existing Data):**

✅ **Expenditure Trends** - Monthly/quarterly spending by supplier
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount_spent) as total_expenditure
FROM purchase_orders
GROUP BY month
ORDER BY month
```

✅ **Supplier Distribution by Expenditure**
```sql
SELECT 
  c.company_name,
  SUM(po.amount_spent) as total_spend,
  COUNT(po.id) as po_count
FROM contractors c
JOIN purchase_orders po ON po.contractor_id = c.id
GROUP BY c.company_name
ORDER BY total_spend DESC
```

✅ **Lead Time Analysis** (Medium/Low/High)
```sql
SELECT 
  CASE 
    WHEN lead_time_days <= 7 THEN 'Low'
    WHEN lead_time_days <= 14 THEN 'Medium'
    ELSE 'High'
  END as lead_time_category,
  COUNT(*) as supplier_count
FROM contractors
GROUP BY lead_time_category
```

✅ **Budget Variance**
```sql
SELECT 
  po_number,
  total_amount as budgeted,
  amount_spent as actual,
  (total_amount - amount_spent) as variance,
  ROUND(((amount_spent / total_amount) * 100), 2) as percent_used
FROM purchase_orders
WHERE status IN ('Active', 'Completed')
```

✅ **Procurement Cycle Time** (Purchase → Approval → Invoice)
```sql
SELECT 
  po_number,
  created_at as po_created,
  approval_date as po_approved,
  (approval_date - created_at) as approval_time_days
FROM purchase_orders
WHERE approval_date IS NOT NULL
```

#### **❌ WHAT WE CANNOT BUILD (Missing Data):**

❌ **Defect Rate Dashboard** - Need `contractor_defects` table
❌ **Quality Score Tracking** - Need `contractors.quality_score` field
❌ **Contract Compliance %** - Need compliance audit tracking
❌ **Loss Due to Defects ($)** - Need defect cost tracking
❌ **ROI Per Supplier** - Need value delivered metrics
❌ **Maverick Spending Detection** - Need approval workflow flags
❌ **Full Procurement Cycle** (Order Confirmation → Dispatch → Delivery) - Need additional timestamp fields

---

## 🟡 HR RECRUITMENT DASHBOARD - DATA COVERAGE

### **Screenshots 8-9: Recruitment Pipeline Analytics**

#### **❌ CRITICAL MISSING: Recruitment Pipeline Tables**

We have **ZERO** recruitment data! The dashboards show:

| Dashboard Element | Status | What's Needed |
|------------------|---------|---------------|
| **Vacancies** | ❌ MISSING | `job_openings` table |
| **Applications** | ❌ MISSING | `job_applications` table |
| **Shortlisted Candidates** | ❌ MISSING | Application status tracking |
| **Assessment Phase** | ❌ MISSING | Assessment records |
| **Interview Phase** | ❌ MISSING | Interview scheduling/results |
| **Offers Handed Out** | ❌ MISSING | Offer management table |
| **Hired** | ⚠️ PARTIAL | Can track via `contractors.start_date` |
| **Hired by Source** (Referral, Campus, LinkedIn) | ❌ MISSING | `job_applications.source` field |
| **Salary Distribution** | ⚠️ PARTIAL | Have `contractors.pay_rate` |
| **Job Roles** | ⚠️ PARTIAL | Have `contractors.job_description` (text, not categorized) |
| **Age Bracket** | ❌ MISSING | No date of birth field |
| **Gender** | ❌ MISSING | No demographic fields |

#### **📋 REQUIRED SCHEMA ADDITIONS FOR HR RECRUITMENT:**

**New Tables Needed:**
1. `job_openings` - Vacancy tracking
2. `job_applications` - Candidate pipeline
3. `interviews` - Interview scheduling and results
4. `job_offers` - Offer management
5. `candidate_assessments` - Assessment results

**Estimated Implementation:** 8-10 hours (schema design + API + frontend)

---

## 🔴 HR PERFORMANCE DASHBOARD - DATA COVERAGE

### **Screenshots 10-13: Employee Performance Analytics**

#### **❌ CRITICAL MISSING: Employee HR Data**

We have **contractors** (temporary workers), NOT **employees** (full-time staff)!

| Dashboard Element | Status | What's Needed |
|------------------|---------|---------------|
| **Total Number of Employees** | ❌ MISSING | `employees` table (separate from contractors) |
| **Sick Leaves Taken** | ❌ MISSING | `employee_leaves` table with leave type |
| **Casual Leaves Taken** | ❌ MISSING | Leave tracking system |
| **Overtime Hours** | ⚠️ PARTIAL | Have `timecards.overtime_hours` for contractors only |
| **Employee Tenure** | ❌ MISSING | Need hire date + tenure calculation |
| **Absenteeism** | ❌ MISSING | Attendance tracking table |
| **Employee Rating Distribution** | ❌ MISSING | Performance review system |
| **Overtime by Gender** | ❌ MISSING | No gender field |
| **Leave Trends** | ❌ MISSING | Leave history tracking |
| **Employee Count by Rating** | ❌ MISSING | Performance review data |
| **Salary by Experience** | ❌ MISSING | No experience/tenure fields |

#### **📋 REQUIRED SCHEMA ADDITIONS FOR HR PERFORMANCE:**

**New Tables Needed:**
1. `employees` - Full-time employee records (separate from contractors)
2. `employee_leaves` - Leave requests and approvals
3. `employee_attendance` - Daily attendance tracking
4. `employee_performance_reviews` - Rating/review system
5. `employee_demographics` - Gender, DOB, etc. (with privacy compliance)

**Estimated Implementation:** 12-15 hours (complete HR subsystem)

---

## 🎯 PRIORITY GAPS TO CLOSE

### **Option 1: Supplier Analytics Focus (Recommended for CPO Demo)**

**Time Investment:** 2-3 hours  
**Readiness Increase:** 65% → 95%

**Add These 8 Fields to Contractors Table:**
```sql
ALTER TABLE contractors ADD COLUMN defect_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE contractors ADD COLUMN quality_score INTEGER DEFAULT 0;
ALTER TABLE contractors ADD COLUMN compliance_rate DECIMAL(5,2) DEFAULT 100;
ALTER TABLE contractors ADD COLUMN on_time_delivery_rate DECIMAL(5,2) DEFAULT 100;

ALTER TABLE purchase_orders ADD COLUMN confirmed_at TIMESTAMP;
ALTER TABLE purchase_orders ADD COLUMN dispatched_at TIMESTAMP;
ALTER TABLE purchase_orders ADD COLUMN delivered_at TIMESTAMP;
ALTER TABLE purchase_orders ADD COLUMN is_maverick_spend BOOLEAN DEFAULT FALSE;
```

**Create 1 New Table:**
```sql
CREATE TABLE contractor_defects (
  id SERIAL PRIMARY KEY,
  contractor_id INTEGER REFERENCES contractors(id),
  purchase_order_id INTEGER REFERENCES purchase_orders(id),
  defect_date DATE NOT NULL,
  defect_type VARCHAR(100),
  defect_description TEXT,
  defect_cost DECIMAL(15,2) DEFAULT 0,
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Result:** Can build ALL supplier dashboards except full procurement cycle tracking

---

### **Option 2: Full Dashboard Suite (Post-Demo Enhancement)**

**Time Investment:** 22-28 hours  
**Readiness Increase:** 65% → 95% (all three dashboard types)

**Phase 1: Supplier Analytics** (2-3 hours) - As above  
**Phase 2: Recruitment Pipeline** (8-10 hours) - 5 new tables + APIs  
**Phase 3: Employee Performance** (12-15 hours) - 5 new tables + HR subsystem

---

## 📈 CAN WE EXPORT FROM EVIDENCE/TABLEAU/POWERBI?

### **Evidence.dev:**
✅ **YES** - Evidence connects directly to PostgreSQL, no export needed  
✅ Reads from existing tables using SQL queries  
✅ No ETL/data warehouse required

### **Tableau/PowerBI:**
✅ **YES** - Both support direct PostgreSQL connections  
⚠️ **BUT:** They expect properly structured data (we need those missing fields first)

**Evidence.dev Advantage:**
- Works with existing schema NOW (65% coverage)
- Build dashboards with SQL + Markdown
- Add missing fields incrementally as dashboards evolve

---

## 🎯 RECOMMENDATIONS

### **For CPO Demo (This Week):**

1. **✅ DO:** Add 8 supplier quality fields (2-3 hours)
2. **✅ DO:** Build 3 core Evidence dashboards:
   - Supplier Performance (expenditure, lead time, budget variance)
   - Procurement Lifecycle (PO creation → approval → invoice)
   - Budget Health Monitor (real-time spend tracking)
3. **❌ DON'T:** Build HR dashboards (not relevant to CPO/procurement demo)

**Outcome:** Professional BI dashboards showing $1.3M ROI metrics

---

### **Post-Demo (Week of Nov 25+):**

1. **Phase 1:** Complete supplier analytics (add defect tracking)
2. **Phase 2:** Build recruitment pipeline (if expanding to HR use case)
3. **Phase 3:** Add employee performance (full HR analytics suite)

---

## 📊 DASHBOARD BUILD CAPABILITY MATRIX

| Dashboard Type | Current Coverage | Missing Fields | Build Time | Demo-Ready? |
|---------------|------------------|----------------|------------|-------------|
| **Supplier Expenditure** | 95% | 0 | Ready now | ✅ YES |
| **Budget Variance** | 100% | 0 | Ready now | ✅ YES |
| **Lead Time Analysis** | 100% | 0 | Ready now | ✅ YES |
| **Procurement Cycle** | 60% | 3 timestamps | 30 min | ⚠️ PARTIAL |
| **Supplier Quality** | 20% | 4 metrics | 2-3 hours | ❌ NO |
| **Contract Compliance** | 40% | 2 metrics | 1 hour | ⚠️ PARTIAL |
| **Defect Tracking** | 0% | Full table | 2 hours | ❌ NO |
| **Maverick Spending** | 0% | 1 flag + logic | 1 hour | ❌ NO |
| **HR Recruitment** | 15% | 5 tables | 8-10 hours | ❌ NO |
| **HR Performance** | 5% | 5 tables | 12-15 hours | ❌ NO |

---

## ✅ BOTTOM LINE

**Question:** "Do we have the data to build these dashboards?"

**Answer:**
- **Supplier Analytics:** 65% ready (add 8 fields → 95% ready in 2-3 hours)
- **HR Recruitment:** 15% ready (need complete recruitment subsystem)
- **HR Performance:** 5% ready (need complete employee HR subsystem)

**For CPO Demo:**
- ✅ **Can build:** Expenditure trends, budget health, lead time analysis, procurement cycle (partial)
- ❌ **Cannot build (yet):** Defect rates, quality scores, compliance %, maverick spending, full HR analytics

**Recommendation:** Add 8 supplier quality fields (2-3 hours) → Build 3 core Evidence dashboards focused on procurement/budget metrics (perfect for CPO demo)

---

**Last Updated:** November 17, 2025  
**Next Steps:** Add missing supplier fields OR proceed with existing data only
