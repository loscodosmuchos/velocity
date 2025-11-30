# Customization Philosophy: Variables, Modifiers, and Anticipation

## Foundational Principle: "SET IN STONE"

This document establishes critical principles for how the Velocity platform handles variability, configuration, and user interaction. These principles are non-negotiable and apply to ALL specialist domains (VMS, HRIS, ATS, PM, Finance).

---

## The Core Insight: Nothing Is Standard

### The Reality of Business Variables

In the real world, almost nothing is truly universal:

| What Seems Standard | Reality |
|---------------------|---------|
| Overtime = 1.5× | Some states require 2×, some companies add surcharges |
| Work Week = 40 hours | Some companies use 37.5, some use 45 |
| Payment Terms = NET 30 | MSAs vary: NET 15, NET 45, NET 60 |
| Holiday List | Varies by state, country, company culture |
| Markup Rate | Varies by skill, vendor, MSA, volume |
| Tenure Limit | 12 months? 18? 24? Depends on classification |

**Principle**: Any variable that *can* vary across companies, industries, or contexts *MUST* be configurable, not hardcoded.

---

## The Modifier Stack

### Base Value + Modifiers = Final Value

Every calculation should support a modifier stack:

```
┌─────────────────────────────────────────────────────────────┐
│                      FINAL VALUE                            │
│                         $127.50                             │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Modifier 4: Volume Discount              -5%    │ -$6.38   │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Modifier 3: Holiday Premium             +10%    │ +$12.75  │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Modifier 2: Overtime Surcharge           +5%    │ +$6.38   │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Modifier 1: Base Overtime               ×1.5    │ $114.75  │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ BASE VALUE: Hourly Rate                          │ $76.50   │
└─────────────────────────────────────────────────────────────┘
```

### Modifier Types

```typescript
type ModifierType = 
  | 'multiplier'      // ×1.5 (overtime)
  | 'percentage_add'  // +5% (surcharge)
  | 'percentage_sub'  // -5% (discount)
  | 'flat_add'        // +$50 (fee)
  | 'flat_sub'        // -$50 (credit)
  | 'replacement';    // Override entirely

interface Modifier {
  id: string;
  name: string;
  description: string;
  type: ModifierType;
  value: number;
  applicableWhen: ModifierCondition; // When does this apply?
  priority: number; // Order of application
  source: 'system' | 'company' | 'vendor' | 'contract' | 'manual';
  note?: string; // Why was this applied?
}

interface ModifierCondition {
  field: string;      // 'hours_type', 'day_type', 'vendor_tier'
  operator: 'equals' | 'greater_than' | 'in_list' | 'date_range';
  value: any;
}
```

### Example: Overtime with Modifiers

```typescript
// Base overtime rate from business config
const baseOvertimeMultiplier = 1.5;

// Company-specific modifier: Extra 5% for overnight shifts
const overnightSurcharge = {
  type: 'percentage_add',
  value: 0.05,
  applicableWhen: { field: 'shift', operator: 'equals', value: 'overnight' },
  note: 'Company policy: overnight overtime gets additional 5%'
};

// Vendor-specific modifier: Premium vendor rates
const vendorPremium = {
  type: 'percentage_add',
  value: 0.03,
  applicableWhen: { field: 'vendor_tier', operator: 'equals', value: 'premium' },
  note: 'MSA with Acme Staffing includes 3% premium for priority support'
};

// California-specific modifier: Double time after 12 hours
const californiaDoubleTime = {
  type: 'multiplier',
  value: 2.0, // Replaces 1.5 with 2.0
  applicableWhen: { 
    field: 'state', 
    operator: 'equals', 
    value: 'CA',
    and: { field: 'daily_hours', operator: 'greater_than', value: 12 }
  },
  note: 'California Labor Code: Double time after 12 hours in a day'
};
```

---

## The Anticipation Principle: Tandem Whiteboard

### The Problem with On-Demand Calculation

Traditional approach:
1. User asks a question
2. System runs analysis
3. User waits
4. System returns answer
5. User asks "how did you get that?"
6. System runs trace
7. User waits again

**This is exhausting.** Every piece of knowledge requires user effort.

### The Solution: Always Be Computing

**The Tandem Whiteboard**:
- The whiteboard (calculation) is always being written
- A piece of paper covers it (not visible by default)
- When user wants to see, just lift the paper
- The work was already done—just reveal it

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Budget Remaining: $125,450                    [?]  │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│         ↓ Click [?] or hover                               │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  CALCULATION PROOF (pre-computed, just revealed)    │  │
│   │                                                      │  │
│   │  Step 1: PO Amount = $500,000                       │  │
│   │  Step 2: Total Invoices = $374,550                  │  │
│   │  Step 3: Remaining = $500,000 - $374,550            │  │
│   │  Result: $125,450                                    │  │
│   │                                                      │  │
│   │  Modifiers Applied:                                  │  │
│   │  • Overtime surcharge: +$12,340                     │  │
│   │  • Volume discount: -$8,200                         │  │
│   │                                                      │  │
│   │  Last calculated: 2 seconds ago                     │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Strategy

```typescript
interface PreComputedMetric {
  value: number;
  calculatedAt: Date;
  trace: CalculationTrace; // Already computed, just waiting
  modifiersApplied: Modifier[];
  staleAfter: number; // Recompute if older than X seconds
}

// Every metric carries its proof alongside
const budgetMetric: PreComputedMetric = {
  value: 125450,
  calculatedAt: new Date(),
  trace: {
    formulaId: 'budget-remaining-cents',
    steps: [...], // All steps pre-computed
    // ...
  },
  modifiersApplied: [
    { name: 'Overnight Surcharge', value: 12340 },
    { name: 'Volume Discount', value: -8200 }
  ],
  staleAfter: 60 // Recompute every 60 seconds
};
```

---

## The Energy Equation

### Minimize User Effort to Gain Knowledge

Traditional: **High Effort → Knowledge**
```
User thinks of question
  → User formulates query
    → User submits request
      → System processes
        → User waits
          → User reads response
            → User asks follow-up
              → Repeat...
```

Velocity: **Near-Zero Effort → Knowledge**
```
User sees metric
  → Hovers/clicks for proof (already ready)
    → Done. Knowledge acquired.
```

### The Ride-Along Parallel

Just like a police ride-along:
- The sergeant doesn't wait for the recruit to ask questions
- Context and wisdom are provided as situations unfold
- After each interaction: "How could that have gone better?"
- Lessons are ready before they're needed

**The system anticipates and prepares.**

---

## Company Configuration Structure

### Hierarchical Override System

```typescript
interface ConfigurationHierarchy {
  // Level 1: Platform defaults (we set these)
  platform: PlatformDefaults;
  
  // Level 2: Industry templates (we provide, they select)
  industry: IndustryConfig; // 'technology', 'healthcare', 'finance'
  
  // Level 3: Company overrides (they customize)
  company: CompanyConfig;
  
  // Level 4: Vendor-specific (per relationship)
  vendor: VendorConfig[];
  
  // Level 5: Contract-specific (per agreement)
  contract: ContractConfig[];
  
  // Level 6: One-off adjustments (manual overrides)
  manual: ManualAdjustment[];
}

// Resolution: Later levels override earlier levels
function resolveConfig(key: string, context: Context): ConfigValue {
  return manual[key] 
    ?? contract[context.contractId]?.[key]
    ?? vendor[context.vendorId]?.[key]
    ?? company[key]
    ?? industry[key]
    ?? platform[key];
}
```

### Example: Overtime Rate Resolution

```typescript
const overtimeRate = resolveConfig('overtime_multiplier', {
  vendorId: 'acme-staffing',
  contractId: 'acme-2025-msa'
});

// Resolution path:
// 1. Check manual overrides: none
// 2. Check contract 'acme-2025-msa': 1.55 ← FOUND
// 3. Would have checked vendor 'acme-staffing': 1.5
// 4. Would have checked company config: 1.5
// 5. Would have checked industry 'technology': 1.5
// 6. Would have checked platform default: 1.5

// Result: 1.55 (from contract-specific MSA)
// Note: "Acme MSA includes 5% OT premium per negotiation"
```

---

## Required Variables by Domain

### VMS Variables
| Variable | Default | Why It Varies |
|----------|---------|---------------|
| overtime_multiplier | 1.5 | State laws, company policy |
| overtime_surcharge | 0% | Vendor premiums, shift differentials |
| payment_terms_days | 30 | MSA negotiations |
| tenure_limit_months | 18 | Classification rules, state laws |
| markup_rate | varies | Vendor, skill, volume |
| holiday_list | US Federal | Country, state, company |
| work_week_hours | 40 | Company policy, role type |

### HRIS Variables
| Variable | Default | Why It Varies |
|----------|---------|---------------|
| pto_accrual_rate | varies | Tenure, level, policy |
| benefits_eligibility_days | 30 | ACA, company policy |
| performance_review_cycle | annual | Company culture |
| probation_period_days | 90 | State law, policy |

### ATS Variables
| Variable | Default | Why It Varies |
|----------|---------|---------------|
| offer_expiration_days | 7 | Role urgency, market |
| interview_rounds | varies | Role complexity |
| background_check_required | true | Role, industry |
| reference_count | 3 | Company policy |

---

## Modifier Notes: The "Why" Layer

Every modifier should carry a note explaining:
- **Why** it was applied
- **Who** authorized it
- **When** it takes effect
- **Source** of the rule

```typescript
const modifier: Modifier = {
  name: 'California Double Time',
  type: 'multiplier',
  value: 2.0,
  note: 'California Labor Code Section 510: Work in excess of 12 hours in one day shall be compensated at double the regular rate.',
  source: 'system', // Auto-applied based on state
  authorizedBy: 'State Law',
  effectiveDate: new Date('2000-01-01') // Been law for decades
};
```

---

## The Reveal Pattern

### Every Number Has a Story Behind It

When displaying any calculated value:

1. **Primary Display**: The number itself
2. **Hover/Click**: Reveal the calculation trace
3. **Expand**: Show modifiers applied
4. **Deep Dive**: Full audit trail with timestamps

```typescript
interface RevealableMetric {
  // What user sees
  displayValue: string; // "$125,450"
  
  // Level 1: Quick proof (hover)
  quickProof: string; // "PO $500K - Invoices $374.5K"
  
  // Level 2: Full calculation (click)
  fullTrace: CalculationTrace;
  
  // Level 3: Modifiers (expand)
  modifiers: Modifier[];
  
  // Level 4: Audit trail (deep dive)
  auditTrail: AuditEntry[];
}
```

---

## Principles Summary (SET IN STONE)

### 1. Nothing Is Hardcoded
Every variable that *can* vary *must* be configurable.

### 2. Modifiers Stack
Base value + modifiers + notes = transparent final value.

### 3. Anticipate, Don't React
Compute proofs alongside values. Ready to reveal instantly.

### 4. Minimize Energy
User effort to gain knowledge should approach zero.

### 5. Everything Has a "Why"
Every modifier carries its justification and source.

### 6. Hierarchical Resolution
Platform → Industry → Company → Vendor → Contract → Manual

### 7. The Tandem Whiteboard
Always computing in background. Just lift the paper to see.

---

## Related Documents

- `/docs/architecture/AGENT_ARCHITECTURE_BLUEPRINT.md` - Specialist agents
- `/docs/AUTHENTICITY_PILLAR.md` - No mock data
- `src/lib/business-logic-config.ts` - Current threshold constants
- `src/lib/formula-registry.ts` - Calculation registry
- `replit.md` - Platform philosophy
