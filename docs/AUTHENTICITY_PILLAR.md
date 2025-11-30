# Authenticity Pillar

> **Document Type:** Core Architectural Principle  
> **Created:** 2025-11-20  
> **Status:** MANDATORY - Zero Tolerance  
> **Priority:** CRITICAL - Non-Negotiable  

---

## The Principle

**Velocity must be the single source of truth.**

Every data point, every calculation, every formula, every metric, every chart, every indicator must be:

- ✅ **REAL** - Based on actual data from the database
- ✅ **AUTHENTIC** - Computed using validated algorithms
- ✅ **VERIFIABLE** - Can be cross-checked and proven
- ✅ **TRACEABLE** - Source data can be identified
- ✅ **CONSISTENT** - Same inputs always produce same outputs

---

## Zero Tolerance List

The following are **NEVER ACCEPTABLE** in production paths:

| Category | Examples | Why Unacceptable |
|----------|----------|------------------|
| **Mock Data** | `const mockContractors = [{...}]` | Fake numbers mislead decisions |
| **Sample Data** | `sampleAlerts`, `demoNotifications` | Creates false impressions |
| **Hardcoded Values** | `unreadCount = 3` | Static when reality is dynamic |
| **Placeholder Text** | `"Lorem ipsum"`, `"TODO"` | Signals incompleteness |
| **Fake Calculations** | `Math.random() * 100` | Not based on real formulas |
| **Assumed Values** | `estimatedSavings = 50000` | Speculation, not calculation |
| **Stubbed Functions** | `return { status: "ok" }` | Bypasses real logic |
| **Magic Numbers** | Unexplained constants | Unverifiable, untraceable |

---

## Why This Matters

### Trust Chain

```
Real Data → Real Calculations → Real Insights → Real Decisions → Real ROI
     ↑                                                              ↓
     └──────────────── Trust is maintained ──────────────────────────┘
```

**One fake element breaks the entire chain:**

```
Real Data → FAKE Calculation → Wrong Insights → Bad Decisions → Lost ROI
                   ↑
            Trust destroyed here
```

### Business Impact

| Scenario | Consequence |
|----------|-------------|
| Executive sees "$1.4M budget" that's hardcoded | Presents wrong number to board |
| Alert badge shows "3" but there are 0 real alerts | User ignores future real alerts |
| Chart shows fabricated trend | Budget decisions based on fiction |
| KPI displays random percentage | Performance reviews use wrong data |

**Result:** Exponentially harder to achieve goals. Instant loss of credibility.

---

## Verification Requirements

### Before Any Data Display

```
┌─────────────────────────────────────────────────────────────┐
│ AUTHENTICITY CHECKLIST                                      │
├─────────────────────────────────────────────────────────────┤
│ □ Where does this data come from? (source identified)       │
│ □ What formula produces this number? (calculation defined)  │
│ □ Can I trace back to source records? (audit trail exists)  │
│ □ Is this the same formula the client expects? (validated)  │
│ □ What happens when source data is empty? (edge case)       │
│ □ Is there any hardcoded fallback? (remove it)              │
└─────────────────────────────────────────────────────────────┘
```

### Data Display Rules

1. **If data doesn't exist → Show "No data" or empty state**
   - NOT a fake placeholder
   - NOT a zero that implies calculation

2. **If calculation fails → Show error state**
   - NOT a default value
   - NOT hiding the failure

3. **If API is loading → Show loading state**
   - NOT cached mock data
   - NOT previous stale values

---

## Current Violations (To Fix)

### 1. Alert Context - Hardcoded Demo Alerts

**File:** `src/contexts/AlertContext.tsx`

**Violation:**
```typescript
const [items, setItems] = useState<Alert[]>([
  {
    id: "demo-alert-1",  // ← FAKE
    title: "Budget Overrun Detected",  // ← FABRICATED
    ...
  },
  // 3 more hardcoded items
]);
```

**Fix Required:**
```typescript
const [items, setItems] = useState<Alert[]>([]);  // Start empty
// Only add alerts when REAL conditions trigger them
```

### 2. Dashboard Charts - Static/Hardcoded Data

**Issue:** Some charts use sample data arrays instead of querying real data.

**Fix Required:** All charts must derive from `useList()` queries to real database tables.

### 3. TopNav Badge Counts

**Issue:** Badge shows counts from hardcoded demo alerts.

**Fix Required:** Badges should only show counts when connected to:
- Real database-driven alerts
- Real calculation triggers (budget > 90%, contract expiring < 30 days, etc.)

---

## Implementation Pattern

### Correct Pattern: Alert Generation

```typescript
// 1. Define real trigger conditions
const ALERT_RULES = {
  budgetOverrun: (po: PurchaseOrder) => 
    po.remainingFunds / po.totalAmount < 0.1,  // Real formula
  
  contractExpiring: (contractor: Contractor) => 
    daysBetween(new Date(), contractor.endDate) < 30,  // Real calculation
  
  invoiceVariance: (invoice: Invoice) => 
    Math.abs(invoice.amount - invoice.poAmount) / invoice.poAmount > 0.1,
};

// 2. Generate alerts from real data
function generateAlerts(data: DashboardData): Alert[] {
  const alerts: Alert[] = [];
  
  // Check each PO for budget issues
  data.purchaseOrders.forEach(po => {
    if (ALERT_RULES.budgetOverrun(po)) {
      alerts.push({
        type: "alert",
        severity: "critical",
        title: `Budget Alert: PO #${po.poNumber}`,
        message: `Only ${formatCurrency(po.remainingFunds)} remaining`,
        source: { table: "purchase_orders", id: po.id },  // Traceable
      });
    }
  });
  
  return alerts;
}

// 3. Display only what's real
const realAlerts = generateAlerts(dashboardData);
const unreadCount = realAlerts.filter(a => !a.read).length;
// If no real alerts → badge shows nothing (not 0)
```

### Correct Pattern: Chart Data

```typescript
// ❌ WRONG - Hardcoded data
const chartData = [
  { name: "Engineering", value: 635000 },
  { name: "Finance", value: 167000 },
];

// ✅ CORRECT - Derived from real data
const chartData = useMemo(() => {
  return departments.map(dept => {
    const deptContractors = contractors.filter(c => c.departmentId === dept.id);
    const totalSpend = deptContractors.reduce((sum, c) => {
      const contractorTimecards = timecards.filter(t => t.contractorId === c.id);
      return sum + contractorTimecards.reduce((s, t) => s + t.totalHours * c.payRate, 0);
    }, 0);
    
    return {
      name: dept.name,
      value: totalSpend,  // Real calculation
      source: `SUM(timecards.hours * contractors.payRate) WHERE department_id = ${dept.id}`,
    };
  });
}, [departments, contractors, timecards]);
```

---

## Empty State Handling

When no data exists, show authentic empty states:

```typescript
// For metrics
{contractors.length === 0 ? (
  <EmptyState message="No contractors in system" />
) : (
  <MetricCard value={activeContractors} />
)}

// For charts
{chartData.length === 0 ? (
  <EmptyChart message="No data available for selected period" />
) : (
  <BarChart data={chartData} />
)}

// For alerts
{alerts.length === 0 ? (
  // Show nothing - no badge, no indicator
  null
) : (
  <AlertBadge count={alerts.length} />
)}
```

---

## Enforcement

### Code Review Checklist

Before approving any PR:

1. **Search for mock/sample/demo/fake/placeholder** in changed files
2. **Verify all numbers trace to database queries**
3. **Check for hardcoded arrays that should be fetched**
4. **Confirm empty states handle no-data scenarios**
5. **Validate formulas match business requirements**

### Automated Checks

```bash
# Find potential violations
grep -r "mock\|sample\|demo\|fake\|placeholder\|lorem" src/
grep -r "Math.random\|hardcoded\|TODO" src/
```

---

## Consequences

| Violation | Impact | Action |
|-----------|--------|--------|
| Hardcoded demo data found | User sees fake information | Immediate removal |
| Calculation without formula docs | Unverifiable results | Must document |
| Magic number without explanation | Untraceable | Must trace to source |
| Empty state shows placeholder | Misleading | Must show authentic empty |

---

## Summary

> **"If it's not based on real data with real calculations, it doesn't belong in Velocity."**

The platform's value is in being the **authoritative source of truth**. Every fake element undermines that authority. There are no exceptions.

---

## Related Documents

- `docs/PROTOCOL_ENFORCEMENT_SYSTEM.md` - Testing verification
- `docs/CHART_CUSTOMIZATION_PROCESS.md` - Chart implementation guidelines
- `replit.md` - User preferences including authenticity requirements
