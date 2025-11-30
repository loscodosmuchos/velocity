# VMS Specialist Agent - Full Specification

## MCP Server Definition for Vendor Management System Domain

**Version**: 1.0.0  
**Domain**: Vendor Management System (VMS)  
**Purpose**: Handle all vendor relationships, contractor lifecycle, purchase orders, timecards, and invoicing through the VMS lens.

---

## System Prompt (The Expertise Lens)

```markdown
# VMS SPECIALIST AGENT

You are a Vendor Management System (VMS) expert. Everything you analyze, recommend, 
and calculate is viewed through the lens of vendor relationships and contingent 
workforce management.

## YOUR DOMAIN LENS

In your world:
- A "person" is a CONTRACTOR or RESOURCE on assignment
- "Time" is BILLABLE HOURS or UNITS to be invoiced
- "Payment" is INVOICE PROCESSING through AP
- A "contract" is a STATEMENT OF WORK or WORK ORDER
- "Budget" lives in PURCHASE ORDERS
- "Relationships" are VENDOR partnerships managed through MSAs

## YOUR EXPERTISE AREAS

You are the authority on:
- Vendor relationships and performance
- Purchase Order lifecycle (creation → approval → consumption → closeout)
- Contractor assignments (requisition → onboarding → assignment → extension → offboarding)
- Rate card management and markup calculations
- Timecard capture, approval, and processing
- Invoice generation and reconciliation
- Compliance (1099 vs W2 classification, tenure limits, co-employment)
- Budget tracking and burn rate forecasting

## YOUR FORMULAS (from FormulaRegistry)

You use these calculations with full step-by-step proof:
- budget-utilization: (amount_spent / total_budget) × 100
- budget-remaining-cents: po_amount - total_invoices_paid
- burn-rate: (amount_spent / days_elapsed) × 30
- projected-overrun: current_spent + (burn_rate × remaining_days) - total_budget
- contractor-cost: (regular_hours × rate) + (overtime_hours × rate × OT_MULTIPLIER)
- contractor-margin: ((billing - cost) / billing) × 100
- invoice-variance-percent: ((invoice - expected) / expected) × 100
- vendor-performance-score: Rating based on on-time rate and rejection rate
- alert-severity-threshold: 80%/90%/100% decision tree

## YOUR CONFIGURABLE VARIABLES

These can vary by company, vendor, or contract:
- OVERTIME_MULTIPLIER (default: 1.5, can be 1.5-2.0+)
- OVERTIME_SURCHARGE (additional percentage on top of multiplier)
- PAYMENT_TERMS_DAYS (NET 30, NET 45, etc.)
- TENURE_LIMIT_MONTHS (12, 18, 24 months)
- MARKUP_RATE (varies by vendor, skill, volume tier)
- WORK_WEEK_HOURS (40, 37.5, etc.)
- HOLIDAY_LIST (varies by location, company)

## WHAT YOU DO NOT HANDLE

Explicitly redirect these to other specialists:
- Employee benefits, payroll, W2 matters → "Route to HRIS Specialist"
- Recruiting pipeline, candidate interviews → "Route to ATS Specialist"  
- Project tasks, milestones, deliverables → "Route to PM Specialist"
- General ledger, accruals, financial reporting → "Route to Finance Specialist"

When asked about non-VMS topics, respond:
"That falls outside my VMS specialty. I'll route this to the [appropriate] Specialist 
who can help you with [topic]."

## YOUR INTERACTION STYLE

1. Always ground responses in vendor/contractor/PO context
2. Show your work - every calculation includes step-by-step proof
3. Cite the formula used and variables applied
4. Note any modifiers that affected the calculation
5. Flag compliance concerns proactively (tenure, classification, budget)
6. Anticipate next questions (if budget is low, proactively mention extension needs)

## THE "NO WORK, NO CREDIT" PRINCIPLE

Every number you provide must be provable on demand:
- Input values clearly stated
- Formula clearly shown
- Steps clearly documented
- Modifiers clearly noted
- Result clearly derived

The proof is always computed alongside the value, ready to reveal.
```

---

## MCP Tools (Actions)

### Tool: calculate_budget_remaining

```typescript
{
  name: "calculate_budget_remaining",
  description: "Calculate remaining budget on a Purchase Order after all approved invoices",
  inputSchema: {
    type: "object",
    properties: {
      po_id: {
        type: "string",
        description: "Purchase Order ID or PO Number"
      },
      include_pending: {
        type: "boolean",
        default: false,
        description: "Include pending (unapproved) invoices in calculation"
      }
    },
    required: ["po_id"]
  },
  async execute(params) {
    // 1. Fetch PO details
    // 2. Sum approved (and optionally pending) invoices
    // 3. Calculate remaining using formula-registry
    // 4. Return with full calculation trace
    const trace = executeFormula('budget-remaining-cents', {
      po_amount: po.amount,
      total_invoices_paid: sumInvoices
    });
    
    return {
      result: trace.finalResult / 100, // Convert cents to dollars
      trace: trace,
      modifiersApplied: getApplicableModifiers(po),
      alerts: checkBudgetThresholds(trace.finalResult, po.amount)
    };
  }
}
```

### Tool: calculate_contractor_cost

```typescript
{
  name: "calculate_contractor_cost",
  description: "Calculate total cost for a contractor including overtime and modifiers",
  inputSchema: {
    type: "object",
    properties: {
      contractor_id: { type: "string" },
      period_start: { type: "string", format: "date" },
      period_end: { type: "string", format: "date" },
      include_modifiers: { type: "boolean", default: true }
    },
    required: ["contractor_id"]
  },
  async execute(params) {
    // 1. Fetch contractor rate info
    // 2. Sum timecards for period
    // 3. Apply overtime calculation
    // 4. Apply any modifiers (surcharges, discounts)
    // 5. Return with full trace
    
    const baseTrace = executeFormula('contractor-cost', {
      hourly_rate: contractor.rate,
      hours_worked: totalHours,
      overtime_hours: overtimeHours
    });
    
    // Apply modifier stack
    const modifiedResult = applyModifierStack(baseTrace.finalResult, [
      getOvertimeSurcharge(contractor.vendor),
      getVolumeDiscount(po),
      getHolidayPremium(timecards)
    ]);
    
    return {
      baseCost: baseTrace.finalResult,
      finalCost: modifiedResult.value,
      modifiers: modifiedResult.modifiersApplied,
      trace: baseTrace,
      modifierTrace: modifiedResult.trace
    };
  }
}
```

### Tool: analyze_vendor_performance

```typescript
{
  name: "analyze_vendor_performance",
  description: "Analyze vendor performance metrics and rating",
  inputSchema: {
    type: "object",
    properties: {
      vendor_id: { type: "string" },
      period: { 
        type: "string", 
        enum: ["ytd", "last_quarter", "last_year", "all_time"] 
      }
    },
    required: ["vendor_id"]
  },
  async execute(params) {
    // Calculate performance using formula registry
    const trace = executeFormula('vendor-performance-score', {
      on_time_invoices: metrics.onTimeCount,
      rejected_invoices: metrics.rejectedCount,
      total_invoices: metrics.totalCount
    });
    
    return {
      rating: trace.finalResult, // 'excellent' | 'good' | 'fair' | 'needs_improvement'
      metrics: {
        onTimeRate: metrics.onTimeRate,
        rejectionRate: metrics.rejectionRate,
        avgApprovalDays: metrics.avgApprovalDays,
        totalSpend: metrics.totalSpend,
        activeContractors: metrics.activeContractors
      },
      trace: trace,
      recommendations: generateRecommendations(trace.finalResult)
    };
  }
}
```

### Tool: check_contract_compliance

```typescript
{
  name: "check_contract_compliance",
  description: "Check contractor/assignment for compliance issues",
  inputSchema: {
    type: "object",
    properties: {
      contractor_id: { type: "string" },
      check_types: {
        type: "array",
        items: {
          type: "string",
          enum: ["tenure", "classification", "rate", "budget", "documentation"]
        }
      }
    },
    required: ["contractor_id"]
  },
  async execute(params) {
    const issues = [];
    
    // Tenure check
    if (params.check_types.includes("tenure")) {
      const tenureLimit = getConfig('tenure_limit_months', contractor.context);
      const monthsOnAssignment = calculateTenure(contractor);
      if (monthsOnAssignment >= tenureLimit * 0.9) {
        issues.push({
          type: 'tenure',
          severity: monthsOnAssignment >= tenureLimit ? 'critical' : 'warning',
          message: `Contractor at ${monthsOnAssignment}/${tenureLimit} months`,
          recommendation: 'Initiate extension or conversion discussion'
        });
      }
    }
    
    // Classification check (1099 vs W2)
    // Rate card check
    // Budget check
    // Documentation check
    
    return { issues, compliant: issues.length === 0 };
  }
}
```

### Tool: forecast_burn_rate

```typescript
{
  name: "forecast_burn_rate",
  description: "Forecast PO budget burn and projected end date",
  inputSchema: {
    type: "object",
    properties: {
      po_id: { type: "string" },
      projection_method: {
        type: "string",
        enum: ["linear", "weighted_recent", "seasonal"],
        default: "linear"
      }
    },
    required: ["po_id"]
  },
  async execute(params) {
    const burnTrace = executeFormula('burn-rate', {
      amount_spent: po.spent,
      days_elapsed: daysElapsed
    });
    
    const overrunTrace = executeFormula('projected-overrun', {
      current_spent: po.spent,
      burn_rate: burnTrace.finalResult,
      remaining_days: daysRemaining,
      total_budget: po.amount
    });
    
    return {
      currentBurnRate: burnTrace.finalResult,
      projectedEndDate: calculateEndDate(po, burnTrace.finalResult),
      projectedOverrun: overrunTrace.finalResult,
      daysUntilExhaustion: calculateDaysUntilExhaustion(po, burnTrace.finalResult),
      traces: { burn: burnTrace, overrun: overrunTrace },
      recommendations: overrunTrace.finalResult > 0 
        ? ['Consider budget extension', 'Review scope for reduction opportunities']
        : ['Budget on track']
    };
  }
}
```

### Tool: generate_invoice_preview

```typescript
{
  name: "generate_invoice_preview",
  description: "Generate invoice preview from approved timecards",
  inputSchema: {
    type: "object",
    properties: {
      vendor_id: { type: "string" },
      billing_period_start: { type: "string", format: "date" },
      billing_period_end: { type: "string", format: "date" }
    },
    required: ["vendor_id", "billing_period_start", "billing_period_end"]
  },
  async execute(params) {
    // Aggregate approved timecards
    // Calculate line items with full traces
    // Apply modifiers
    // Return preview with itemized costs
    
    return {
      vendor: vendorInfo,
      billingPeriod: { start, end },
      lineItems: timecards.map(tc => ({
        contractor: tc.contractor,
        regularHours: tc.regularHours,
        overtimeHours: tc.overtimeHours,
        regularCost: calculateRegular(tc),
        overtimeCost: calculateOvertime(tc),
        modifiers: getApplicableModifiers(tc),
        lineTotal: calculateLineTotal(tc),
        trace: getLineTrace(tc)
      })),
      subtotal: calculateSubtotal(timecards),
      modifiers: aggregateModifiers,
      total: calculateTotal(timecards, modifiers),
      dueDate: calculateDueDate(params.billing_period_end),
      traces: allTraces
    };
  }
}
```

---

## MCP Resources (Data Access)

### Resource: Purchase Orders

```typescript
{
  uri: "vms://purchase-orders",
  name: "Purchase Orders",
  description: "Access to Purchase Order data",
  mimeType: "application/json",
  
  // URI patterns
  patterns: [
    "vms://purchase-orders",           // List all
    "vms://purchase-orders/{id}",      // Single PO
    "vms://purchase-orders/{id}/budget", // PO budget details
    "vms://purchase-orders/{id}/invoices", // Invoices against PO
    "vms://purchase-orders/alerts"     // POs with budget alerts
  ]
}
```

### Resource: Contractors

```typescript
{
  uri: "vms://contractors",
  name: "Contractors",
  description: "Access to Contractor/Contingent Worker data",
  mimeType: "application/json",
  
  patterns: [
    "vms://contractors",
    "vms://contractors/{id}",
    "vms://contractors/{id}/timecards",
    "vms://contractors/{id}/compliance",
    "vms://contractors/expiring"  // Contracts expiring soon
  ]
}
```

### Resource: Vendors

```typescript
{
  uri: "vms://vendors",
  name: "Vendors",
  description: "Access to Vendor/Staffing Agency data",
  mimeType: "application/json",
  
  patterns: [
    "vms://vendors",
    "vms://vendors/{id}",
    "vms://vendors/{id}/contractors",
    "vms://vendors/{id}/performance",
    "vms://vendors/{id}/rate-cards"
  ]
}
```

### Resource: Timecards

```typescript
{
  uri: "vms://timecards",
  name: "Timecards",
  description: "Access to Timecard data",
  mimeType: "application/json",
  
  patterns: [
    "vms://timecards",
    "vms://timecards/{id}",
    "vms://timecards/pending-approval",
    "vms://timecards/ready-to-invoice"
  ]
}
```

### Resource: Invoices

```typescript
{
  uri: "vms://invoices",
  name: "Invoices",
  description: "Access to Invoice data",
  mimeType: "application/json",
  
  patterns: [
    "vms://invoices",
    "vms://invoices/{id}",
    "vms://invoices/{id}/line-items",
    "vms://invoices/pending-payment",
    "vms://invoices/variance-alerts"
  ]
}
```

---

## MCP Prompts (Pre-built Queries)

### Prompt: Budget Status Report

```typescript
{
  name: "budget_status_report",
  description: "Generate comprehensive budget status for a PO",
  arguments: [
    { name: "po_id", required: true }
  ],
  template: `
    Analyze Purchase Order {po_id} and provide:
    
    1. Current Budget Status
       - Total budget
       - Amount spent
       - Amount remaining
       - Utilization percentage
       - Alert level (if any)
    
    2. Burn Rate Analysis
       - Current burn rate ($/month)
       - Projected exhaustion date
       - Days remaining at current pace
    
    3. Invoices Summary
       - Invoices paid
       - Invoices pending
       - Next invoice expected
    
    4. Recommendations
       - If budget is at risk, suggest actions
       - If extension needed, timeline
    
    Show all calculations with step-by-step proof.
  `
}
```

### Prompt: Contractor Cost Analysis

```typescript
{
  name: "contractor_cost_analysis",
  description: "Analyze contractor costs with modifier breakdown",
  arguments: [
    { name: "contractor_id", required: true },
    { name: "period", required: false, default: "current_month" }
  ],
  template: `
    Analyze costs for contractor {contractor_id} during {period}:
    
    1. Base Cost Calculation
       - Regular hours × rate
       - Overtime hours × rate × OT multiplier
       - Base total
    
    2. Modifiers Applied
       - List each modifier (surcharges, premiums, discounts)
       - Show how each affects the total
       - Final adjusted cost
    
    3. Margin Analysis (if billing rate available)
       - Cost vs billing
       - Margin percentage
       - Comparison to target margin
    
    4. Compliance Check
       - Tenure status
       - Classification status
       - Any flags
    
    Show complete calculation traces for verification.
  `
}
```

### Prompt: Vendor Performance Review

```typescript
{
  name: "vendor_performance_review",
  description: "Comprehensive vendor performance analysis",
  arguments: [
    { name: "vendor_id", required: true }
  ],
  template: `
    Review performance for vendor {vendor_id}:
    
    1. Performance Score
       - Overall rating
       - On-time invoice rate
       - Rejection rate
       - Quality indicators
    
    2. Financial Summary
       - Total spend YTD
       - Active contractors
       - Cost per contractor
       - Rate trends
    
    3. Operational Metrics
       - Average approval time
       - Timecard submission timeliness
       - Issue resolution speed
    
    4. Recommendations
       - Performance improvement areas
       - Rate renegotiation opportunities
       - Relationship health assessment
  `
}
```

---

## Integration with Formula Registry

The VMS Specialist uses these formulas from `src/lib/formula-registry.ts`:

| Formula ID | VMS Context |
|------------|-------------|
| budget-utilization | PO consumption tracking |
| budget-remaining-cents | PO balance calculation |
| burn-rate | PO spend velocity |
| projected-overrun | Budget risk forecasting |
| contractor-cost | Timecard cost calculation |
| contractor-margin | Billing vs cost analysis |
| invoice-variance-percent | Invoice validation |
| vendor-performance-score | Vendor rating |
| alert-severity-threshold | Budget alert levels |
| days-until-expiration | Contract expiry alerts |

---

## Configuration Variables

These are resolved hierarchically per the Customization Philosophy:

```typescript
interface VMSConfig {
  // Rate calculations
  overtime_multiplier: number;      // 1.5 default
  overtime_surcharges: Modifier[];  // Additional OT charges
  double_time_threshold: number;    // Hours before double time
  
  // Payment terms
  payment_terms_days: number;       // NET 30 default
  early_payment_discount: number;   // % for early payment
  late_payment_penalty: number;     // % for late payment
  
  // Compliance
  tenure_limit_months: number;      // 18 default
  tenure_warning_days: number;      // Days before limit to warn
  classification_rules: ClassificationRule[];
  
  // Budget thresholds
  budget_alert_info: number;        // 0.80 default
  budget_alert_warning: number;     // 0.90 default
  budget_alert_critical: number;    // 1.00 default
  
  // Work schedule
  work_week_hours: number;          // 40 default
  holiday_list: Holiday[];          // Company holidays
  
  // Markup and margins
  default_markup_rate: number;      // Varies
  target_margin_min: number;        // 0.20 default
  target_margin_max: number;        // 0.30 default
  margin_alert_threshold: number;   // 0.15 default
}
```

---

## Error Handling

When the VMS Specialist encounters issues:

```typescript
interface VMSError {
  type: 'data_missing' | 'calculation_error' | 'compliance_violation' | 'out_of_domain';
  message: string;
  context: any;
  suggestions: string[];
}

// Out of domain example
if (isHRISQuestion(query)) {
  return {
    type: 'out_of_domain',
    message: 'This question relates to employee benefits/payroll',
    context: { detectedDomain: 'hris', query },
    suggestions: ['Route to HRIS Specialist for benefits questions']
  };
}
```

---

## Related Documents

- `/docs/architecture/AGENT_ARCHITECTURE_BLUEPRINT.md` - Overall architecture
- `/docs/architecture/ORCHESTRATOR_PATTERN.md` - How agents are coordinated
- `/docs/principles/CUSTOMIZATION_PHILOSOPHY.md` - Variable modifiers
- `src/lib/formula-registry.ts` - Calculation definitions
- `src/lib/business-logic-config.ts` - Threshold constants
