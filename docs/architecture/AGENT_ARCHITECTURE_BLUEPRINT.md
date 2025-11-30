# Velocity Agent Architecture Blueprint

## Domain-Specialist Agent Architecture with MCP Protocol

**Purpose**: Define the foundational architecture for domain-specialist AI agents that operate through MCP (Model Context Protocol), providing focused expertise rails that prevent expertise creep while enabling deep domain intelligence.

---

## Core Philosophy: Expertise Rails

### The Problem: Expertise Creep
When a generalist agent handles all domains:
- Drifts outside competency boundaries
- Applies wrong mental models to domain-specific problems
- Misses nuances that specialists catch
- Conflates terminology across domains ("onboarding" means different things in HRIS vs ATS)
- Provides shallow coverage instead of deep expertise

### The Solution: Focused Lenses
Each specialist agent views everything through its domain lens:
- VMS Agent: Sees contractors as resources on work orders, time as billable units
- HRIS Agent: Sees employees as people with benefits, compliance as protection
- ATS Agent: Sees candidates as potential hires, interviews as evaluation stages
- PM Agent: Sees resources as allocated capacity, time as project burn

**Key Insight**: The same data point (a person's hours) means different things to different specialists. VMS sees billable revenue; HRIS sees payroll cost; PM sees resource utilization.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     VELOCITY PLATFORM (Light Client)                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    USER INTERFACE LAYER                             │  │
│  │    Dashboards | Triage Pages | Forms | Voice Interface              │  │
│  └─────────────────────────────┬──────────────────────────────────────┘  │
│                                │                                          │
│  ┌─────────────────────────────▼──────────────────────────────────────┐  │
│  │              ORCHESTRATOR / CONDUCTOR AGENT                         │  │
│  │                                                                      │  │
│  │  • Intent Classification (what domain is this?)                     │  │
│  │  • Specialist Routing (who handles this?)                           │  │
│  │  • Context Preparation (what do they need to know?)                 │  │
│  │  • Response Synthesis (combine multiple specialist outputs)         │  │
│  │  • Conflict Resolution (when specialists disagree)                  │  │
│  └─────────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │
                    ═════════════╪═════════════  MCP Protocol Layer
                                 │
     ┌───────────────┬───────────┼───────────┬───────────────┐
     │               │           │           │               │
     ▼               ▼           ▼           ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│   VMS   │   │  HRIS   │   │   ATS   │   │   PM    │   │ FINANCE │
│  Agent  │   │  Agent  │   │  Agent  │   │  Agent  │   │  Agent  │
│         │   │         │   │         │   │         │   │         │
│ MCP Srv │   │ MCP Srv │   │ MCP Srv │   │ MCP Srv │   │ MCP Srv │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │             │             │             │             │
     └─────────────┴─────────────┴─────────────┴─────────────┘
                                 │
                    ═════════════╪═════════════  Shared Data Layer
                                 │
     ┌───────────────────────────▼───────────────────────────────┐
     │                    SHARED KNOWLEDGE BASE                   │
     │                                                            │
     │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
     │  │   Formula    │  │   Business   │  │  Company     │     │
     │  │   Registry   │  │   Logic      │  │  Config      │     │
     │  │              │  │   Config     │  │  (Variables) │     │
     │  └──────────────┘  └──────────────┘  └──────────────┘     │
     │                                                            │
     │  ┌──────────────────────────────────────────────────┐     │
     │  │               PostgreSQL Database                 │     │
     │  │   (Single source of truth for all specialists)   │     │
     │  └──────────────────────────────────────────────────┘     │
     └────────────────────────────────────────────────────────────┘
```

---

## Specialist Agent Catalog

### 1. VMS Specialist Agent (Vendor Management System)

**Domain Lens**: Everything is viewed through vendor relationships and contractor lifecycle

**Owns**:
- Vendors (staffing agencies, suppliers)
- Purchase Orders (budget containers)
- Contractors (contingent workers)
- Statements of Work (work definitions)
- Timecards (time capture)
- Invoices (billing)
- Rate Cards (pricing)

**Core Formulas**:
- Budget Remaining = PO Amount - Sum(Approved Invoices)
- Contractor Cost = (Regular Hours × Rate) + (OT Hours × Rate × OT Multiplier)
- Vendor Performance Score = f(on-time rate, rejection rate, quality score)

**Unique Perspective**:
- A "person" is a "contractor" or "resource"
- "Time" is "billable hours" or "units"
- "Payment" is "invoice processing"
- "End date" is "assignment end" requiring extension or offboarding

---

### 2. HRIS Specialist Agent (Human Resource Information System)

**Domain Lens**: Everything is viewed through employee lifecycle and compliance

**Owns**:
- Employees (W2 workers)
- Benefits (health, 401k, PTO)
- Payroll (compensation processing)
- Compliance (labor law, tenure limits)
- Performance Reviews
- Organizational Structure

**Core Formulas**:
- Total Compensation = Salary + Benefits Cost + Bonus
- PTO Accrual = Hours Worked × Accrual Rate
- Compliance Score = f(training completion, policy acknowledgments)

**Unique Perspective**:
- A "person" is an "employee" with rights and benefits
- "Time" is "work-life balance" and "PTO tracking"
- "Payment" is "payroll" with taxes and withholdings
- "End date" is "termination" with legal implications

---

### 3. ATS Specialist Agent (Applicant Tracking System)

**Domain Lens**: Everything is viewed through talent acquisition pipeline

**Owns**:
- Requisitions (job openings)
- Candidates (applicants)
- Interviews (evaluation events)
- Offers (employment proposals)
- Hiring Pipeline Stages
- Sourcing Channels

**Core Formulas**:
- Time to Fill = Offer Accept Date - Requisition Open Date
- Cost per Hire = Total Recruiting Cost / Hires Made
- Pipeline Conversion = Stage N Count / Stage N-1 Count

**Unique Perspective**:
- A "person" is a "candidate" with potential
- "Time" is "time-to-fill" and "interview scheduling"
- "Payment" is "offer negotiation" and "signing bonus"
- "End date" is "offer expiration" requiring urgency

---

### 4. PM Specialist Agent (Project Management)

**Domain Lens**: Everything is viewed through project delivery and resource allocation

**Owns**:
- Projects (work containers)
- Tasks (work units)
- Milestones (delivery points)
- Resource Allocation
- Risk Register
- Dependencies

**Core Formulas**:
- Project Burn Rate = Spend to Date / Days Elapsed
- Resource Utilization = Allocated Hours / Available Hours
- Schedule Variance = Planned Completion - Projected Completion

**Unique Perspective**:
- A "person" is a "resource" with capacity
- "Time" is "schedule" and "milestones"
- "Payment" is "project budget" and "cost tracking"
- "End date" is "delivery deadline" with scope implications

---

### 5. Finance Specialist Agent

**Domain Lens**: Everything is viewed through financial controls and reporting

**Owns**:
- General Ledger mapping
- Cost Centers
- Accruals
- Forecasting
- Audit Trail
- Financial Reporting

**Core Formulas**:
- Accrual Amount = Unbilled Work × Expected Rate
- Budget Variance = Actual - Planned
- Forecast = Current + (Burn Rate × Remaining Days)

**Unique Perspective**:
- A "person" is a "cost" on a line item
- "Time" is "period" and "fiscal year"
- "Payment" is "disbursement" with GL coding
- "End date" is "period close" requiring accruals

---

## Cross-Domain Terminology Translation

| Concept | VMS | HRIS | ATS | PM | Finance |
|---------|-----|------|-----|-----|---------|
| Person | Contractor | Employee | Candidate | Resource | Cost Center |
| Time Unit | Billable Hour | Work Hour | Interview Slot | Allocated Hour | Period |
| Money Flow | Invoice | Payroll | Offer | Budget | Disbursement |
| Container | Purchase Order | Position | Requisition | Project | Cost Center |
| End Event | Assignment End | Termination | Offer Decline | Delivery | Period Close |
| Status Good | On Assignment | Active | Hired | On Track | Under Budget |
| Status Bad | Off Contract | Terminated | Rejected | At Risk | Over Budget |

---

## MCP Server Structure (Per Specialist)

Each specialist agent runs as an MCP server with:

```typescript
interface MCPSpecialistServer {
  // Identity
  name: string;           // "VMS Specialist"
  version: string;        // "1.0.0"
  
  // Expertise Definition
  systemPrompt: string;   // Domain lens and boundaries
  domainKeywords: string[]; // For intent routing
  
  // Capabilities
  tools: MCPTool[];       // Actions the specialist can perform
  resources: MCPResource[]; // Data the specialist can provide
  prompts: MCPPrompt[];   // Pre-built domain-specific prompts
  
  // Configuration
  companyConfig: CompanyVariables; // Industry-specific settings
  formulaRegistry: FormulaReference[]; // Which formulas this agent uses
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  execute: (params: any) => Promise<ToolResult>;
}

interface MCPResource {
  uri: string;            // "vms://purchase-orders/{id}"
  name: string;
  description: string;
  mimeType: string;
}
```

---

## Routing Rules

The Orchestrator uses these rules to route requests:

### Intent Classification Keywords

```typescript
const ROUTING_KEYWORDS = {
  vms: [
    'vendor', 'supplier', 'contractor', 'contingent', 'staffing',
    'purchase order', 'po', 'invoice', 'timecard', 'timesheet',
    'rate card', 'bill rate', 'markup', 'sow', 'work order',
    'assignment', 'extension', 'offboarding', 'tenure'
  ],
  
  hris: [
    'employee', 'benefits', 'payroll', 'pto', 'vacation',
    'performance review', '401k', 'health insurance', 'onboarding',
    'termination', 'salary', 'compensation', 'org chart',
    'compliance training', 'w2', 'direct hire'
  ],
  
  ats: [
    'candidate', 'applicant', 'requisition', 'job opening',
    'interview', 'offer', 'hiring', 'recruiting', 'sourcing',
    'resume', 'pipeline', 'job posting', 'talent acquisition'
  ],
  
  pm: [
    'project', 'task', 'milestone', 'deliverable', 'sprint',
    'resource allocation', 'gantt', 'dependency', 'risk',
    'scope', 'timeline', 'deadline', 'burndown'
  ],
  
  finance: [
    'budget', 'forecast', 'accrual', 'gl', 'general ledger',
    'cost center', 'audit', 'fiscal', 'period close',
    'variance', 'reconciliation', 'financial report'
  ]
};
```

### Multi-Domain Detection

Some requests span multiple domains:
```typescript
// "How much is contractor John Smith costing the ABC Project?"
// VMS: Contractor cost calculation
// PM: Project budget impact
// Finance: Cost center allocation

const multiDomainRequest = {
  primary: 'vms',      // Who leads the response
  secondary: ['pm', 'finance'], // Who contributes
  synthesis: 'orchestrator' // Who combines
};
```

---

## Shared Knowledge Base

All specialists share:

### 1. Formula Registry
- Central repository of all calculations
- Each specialist references the formulas it uses
- "No Work, No Credit" - every calculation shows its work

### 2. Business Logic Config
- Thresholds (alert levels, margins, compliance)
- Constants (overtime multiplier, payment terms)
- Decision trees (severity levels, rating scales)

### 3. Company Configuration (Variables)
- Industry-specific settings
- Company-specific overrides
- Modifiers and adjustments
- See: `/docs/principles/CUSTOMIZATION_PHILOSOPHY.md`

### 4. PostgreSQL Database
- Single source of truth
- All specialists read from same data
- Prevents data silos and inconsistencies

---

## Implementation Phases

### Phase 1: Foundation (Current)
- [x] Formula Registry with step-by-step traces
- [x] Business Logic Config with thresholds
- [x] Validation Studio for testing
- [ ] Company Configuration system

### Phase 2: VMS Specialist (Next)
- [ ] VMS Agent system prompt and boundaries
- [ ] VMS-specific tools (MCP)
- [ ] VMS resources (data access)
- [ ] Integration with Formula Registry

### Phase 3: Orchestrator
- [ ] Intent classification
- [ ] Specialist routing
- [ ] Context preparation
- [ ] Response synthesis

### Phase 4: Additional Specialists
- [ ] HRIS Specialist
- [ ] ATS Specialist
- [ ] PM Specialist
- [ ] Finance Specialist

### Phase 5: Advanced Features
- [ ] Cross-domain queries
- [ ] Conflict resolution
- [ ] Learning from corrections
- [ ] Specialist collaboration

---

## Benefits Summary

| Benefit | Description |
|---------|-------------|
| **Expertise Rails** | Each agent stays in its lane, preventing expertise creep |
| **Deep Knowledge** | Specialists have domain-specific understanding |
| **Light Client** | Platform orchestrates; specialists hold expertise |
| **Composability** | Add new specialists without affecting others |
| **Maintainability** | Update one domain in isolation |
| **Testability** | Verify each specialist independently |
| **Configurability** | Industry/company variables per specialist |
| **Transparency** | Each specialist shows its work (Ride-Along) |

---

## Related Documents

- `/docs/architecture/VMS_SPECIALIST_AGENT.md` - VMS Agent full specification
- `/docs/architecture/ORCHESTRATOR_PATTERN.md` - Conductor logic
- `/docs/principles/CUSTOMIZATION_PHILOSOPHY.md` - Variable modifiers
- `/docs/AUTHENTICITY_PILLAR.md` - No mock data principle
- `src/lib/formula-registry.ts` - Calculation registry
- `src/lib/business-logic-config.ts` - Threshold constants
