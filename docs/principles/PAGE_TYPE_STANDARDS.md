# Page Type Standards

## Philosophy

**"The visual is 1000x more impactful than words."**

Words require interpretation, compute, analysis, and aren't guaranteed to be interpreted correctly. An image communicates instantly across domains and contexts with a single glance.

**Core Principle:** Every page type is purpose-built for its function. A list page is optimized for scanning. A detail page is optimized for understanding. An action page is optimized for doing.

**Memory Master Technique:** Associate visuals with numbers, names, and concepts to lock them into memory AND understanding. Icons become mental shortcuts that specialists can rely on for rapid decision-making.

---

## Page Type Taxonomy

### 1. LIST VIEW (Data Scan)
**Purpose:** Display large datasets for rapid scanning and triage
**Optimized For:** Minimal cognitive energy to acquire, understand, and act

**Characteristics:**
- Purpose-built page (not a section within another page)
- High-contrast, high-density information display
- Visual status indicators replace text where possible
- Row actions visible on hover, not hidden in menus
- Workflow arrows show "what happens next"
- Smart defaults filter to "needs attention"
- Bulk actions for efficiency

**Visual Requirements:**
- Status icons (not just colored dots)
- Trend sparklines per row
- Risk/health gradient backgrounds
- Action buttons with outcome tooltips
- Row grouping with visual separators

**Example Pages:** Contractors List, Invoices List, Assets List, Timecards List

---

### 2. DETAIL VIEW (Deep Dive)
**Purpose:** Complete understanding of a single entity
**Optimized For:** Answering all questions about one thing

**Characteristics:**
- Hero section with identity and key stats
- Premium KPI cards for critical metrics
- Proactive alerts with actionable buttons
- Quick actions bar (1-click operations)
- Trend visualizations (trajectory)
- Related entities linked
- Full audit trail accessible

**Visual Requirements:**
- Avatar/icon for entity identity
- Circular gauges for utilization/health
- Timeline visualization for history
- AI insights panel
- Workflow diagram for next steps

**Example Pages:** Contractor Detail, PO Detail, SOW Detail

---

### 3. DASHBOARD VIEW (Strategic Overview)
**Purpose:** High-level situational awareness
**Optimized For:** Executive glance, trend spotting, exception identification

**Characteristics:**
- KPI cards dominate
- Charts and visualizations primary
- Minimal text, maximum graphics
- Drill-down on click
- Real-time or near-real-time data
- Personalized to role

**Visual Requirements:**
- Premium KPI cards with gauges
- Large trend charts
- Alert cubes for exceptions
- Sparklines for trends
- Heat maps for distributions

**Example Pages:** Main Dashboard, Financial Overview, Compliance Dashboard

---

### 4. ACTION VIEW (Task Completion)
**Purpose:** Complete a specific task efficiently
**Optimized For:** Minimum clicks, clear outcomes

**Characteristics:**
- Wizard/stepper pattern for multi-step
- Clear progress indication
- Validation feedback immediate
- Preview before confirm
- Outcome visualization before commit
- Success/failure clear

**Visual Requirements:**
- Step indicators
- Form with inline validation
- Preview panel
- Action buttons with consequences labeled
- Confirmation dialogs with outcomes

**Example Pages:** Create Contractor, Submit Timecard, Approve Invoice

---

### 5. WORKFLOW VIEW (Process Navigation)
**Purpose:** Understand and navigate a multi-step process
**Optimized For:** "Where am I? What's next?"

**Characteristics:**
- Visual workflow diagram
- Current step highlighted
- Completed steps checkmarked
- Upcoming steps previewed
- Branch points shown
- Time/effort estimates

**Visual Requirements:**
- Arrows connecting steps
- Status icons per step
- Progress bar overlay
- Decision diamonds for branches
- Timeline with dates

**Example Pages:** Onboarding Flow, Contract Renewal, Approval Chain

---

### 6. COMPARISON VIEW (Decision Support)
**Purpose:** Compare options to make a choice
**Optimized For:** Side-by-side evaluation

**Characteristics:**
- Parallel columns
- Highlight differences
- Recommendation indicated
- Pros/cons visible
- Score/rank if applicable

**Visual Requirements:**
- Color-coded better/worse
- Bar charts for numeric comparison
- Checkmarks/X marks for features
- "Recommended" badge

**Example Pages:** Vendor Comparison, Rate Comparison, Candidate Comparison

---

## The List View Standard (Deep Dive)

Since lists are the most common and most critical page type, here's the detailed standard:

### Row Anatomy
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [STATUS] [AVATAR] NAME + SUBTITLE    │ METRICS │ ALERTS │ [ACTIONS]    │
│  ICON     VISUAL  Identity + Context │ Numbers │ Flags  │ Hover reveal │
└─────────────────────────────────────────────────────────────────────────┘
```

### Status Icon Library
| Icon | Meaning | Color |
|------|---------|-------|
| ✓ | Active/Healthy | Green |
| ⚠ | Needs Attention | Amber |
| ✕ | Blocked/Critical | Red |
| ⏱ | Pending | Blue |
| ⏸ | On Hold | Gray |
| ↗ | Trending Up | Green |
| ↘ | Trending Down | Red |
| 🔔 | Alert Present | Amber |
| 📋 | Pending Approval | Blue |
| ⏰ | Due Soon | Amber |

### Metric Display Rules
1. Always include units ($, hrs, %)
2. Always include context (vs last period, of total)
3. Use trend arrows when data available
4. Color-code: Green (good), Amber (caution), Red (alert)

### Action Button Rules
1. Primary action always visible
2. Secondary actions on hover
3. Tooltip shows outcome ("Will navigate to detail view")
4. Destructive actions require confirmation

### Workflow Arrow Patterns
```
[Current State] ──→ [Action] ──→ [Resulting State]
     ↓
[What Happens If Nothing Done]
```

---

## Visual-First Principles

### 1. Icons Before Words
Instead of "Status: Active", use ✓ with green background

### 2. Colors Communicate
- Green = Good/Safe/Complete
- Amber = Attention/Warning/Pending
- Red = Alert/Blocked/Critical
- Blue = Info/Neutral/In Progress
- Gray = Inactive/Disabled

### 3. Size = Importance
Most important metrics are largest. Secondary info is smaller.

### 4. Position = Priority
Top-left is first seen (in LTR cultures). Put critical info there.

### 5. Density = Efficiency
Information-dense but not cluttered. Every pixel earns its place.

---

## Multi-Expert Lens Matrix

Each page must pass review through specialist lenses:

| Expert | Primary Question | Must See First |
|--------|------------------|----------------|
| CPO | "What's my risk exposure?" | Compliance issues, cost trends |
| CFO | "Where's the money?" | Spend, budget variance, forecasts |
| Procurement | "Are vendors performing?" | SLAs, delivery, rates |
| Legal | "Are we compliant?" | Contract terms, expirations, risks |
| IT | "Is the system healthy?" | Integrations, data quality, errors |
| HR | "Are workers productive?" | Utilization, tenure, satisfaction |
| Manager | "Is my team on track?" | Hours, deliverables, issues |

---

## Implementation Checklist

For any new list page:

- [ ] Is this purpose-built for scanning (not a section)?
- [ ] Can I understand a row in < 2 seconds?
- [ ] Are status icons replacing text?
- [ ] Are trend indicators visible?
- [ ] Are actions obvious with outcome tooltips?
- [ ] Is there a "needs attention" filter?
- [ ] Do rows have visual differentiation for status?
- [ ] Is the color scheme semantically meaningful?
- [ ] Would a specialist exclaim or need explanation?
