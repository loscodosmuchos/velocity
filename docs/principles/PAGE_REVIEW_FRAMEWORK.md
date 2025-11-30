# Page Review Framework

## Overview

A systematic, repeatable process for evaluating every page in Velocity through agreed-upon lenses and criteria. This framework ensures consistent quality across all pages and provides a clear path from "MEH" to "LEGENDARY."

## The 5-Phase Review Process

### Phase 1: CAPTURE
Gather page state and context:
- Take screenshot of current page state
- Identify page path and title
- Document intended purpose
- List target user roles

### Phase 2: ANALYZE
Apply each lens systematically:
1. **Architect Lens** - Structure, quality, maintainability
2. **Visual Lens** - Balance, contrast, hierarchy, premium feel
3. **Role Lens** - Does it serve each target role's needs?
4. **Readability Lens** - 3-second rule, scanability
5. **Innovation Lens** - Wow factors, differentiation
6. **DAISY Lens** - Ten Commandments of Worthiness

### Phase 3: SCORE
Calculate composite worthiness:
- Score each lens 0-100
- Weight by importance
- Calculate overall score
- Determine verdict

### Phase 4: PRESCRIBE
Generate improvement roadmap:
- Identify critical blockers
- Prioritize by impact and effort
- Group related fixes
- Create actionable tickets

### Phase 5: TRANSFORM
Implement improvements:
- Fix critical issues first
- Re-review after changes
- Validate with target users
- Document patterns for reuse

---

## The Six Lenses

### 1. Architect Lens
*"Would a senior engineer be proud of this?"*

| Criterion | Question | Weight |
|-----------|----------|--------|
| Logical Layout | Does the page follow a clear visual hierarchy? | 1.3 |
| Consistent Spacing | Is spacing uniform and intentional? | 1.0 |
| Component Reuse | Does it use the design system properly? | 1.2 |
| No Dead Ends | Does every element lead somewhere? | 1.4 |
| Error Handling | Does it fail gracefully? | 1.1 |

### 2. Visual Design Lens
*"Is it balanced, readable, and premium?"*

| Criterion | Excellent | Good | Poor | Weight |
|-----------|-----------|------|------|--------|
| Balance | Elements feel stable | Minor asymmetry | Lopsided | 1.2 |
| Contrast | All text crisp | Most readable | Hard to read | 1.4 |
| Hierarchy | Clear 3-level | Primary/secondary clear | Same weight | 1.5 |
| Color Meaning | Green/Amber/Red communicate | Mostly | Random | 1.3 |
| Premium Feel | Luxury product | Professional | Generic | 1.4 |

### 3. Role-Based Relevance Lens
*"Does it show what THIS user cares about FIRST?"*

| Role | Time Horizon | Detail Level | Primary Concerns |
|------|-------------|--------------|------------------|
| CPO | Quarterly | Summary | Total cost, headcount, compliance |
| PM | Weekly | Detailed | Budget burn, staffing, timelines |
| Hiring Mgr | Monthly | Detailed | Team capacity, open reqs, endings |
| Finance | Monthly | Granular | Invoices, budget variance, aging |
| Compliance | Monthly | Granular | Violations, audit, risk |
| Contractor | Immediate | Detailed | My timecards, pay, contract |
| Recruiter | Weekly | Detailed | Pipeline, reqs, time-to-fill |
| Admin | Immediate | Granular | System health, users, config |
| Analyst | Monthly | Granular | All data, trends, exports |
| Executive | Quarterly | Summary | ROI, risk, key metrics |

### 4. Readability Lens
*"Can users grasp key info in 3 seconds?"*

| Criterion | Question | Weight |
|-----------|----------|--------|
| 3-Second Rule | Can I grasp key info immediately? | 2.0 |
| Font Clarity | Is all text easily readable? | 1.3 |
| Descriptive Labels | Do labels explain what data means? | 1.4 |
| Clear Sections | Are different areas visually distinct? | 1.2 |

### 5. Innovation Lens
*"What makes this different from every other admin panel?"*

- Unique capabilities no other tool has
- Smart/AI-driven defaults
- Proactive behavior (acts before asked)
- Predictive features (shows what will happen)
- "Wow moments" that delight
- Time-saver moments

### 6. DAISY Lens (Ten Commandments)
*"Is this page worthy of the sacred interface?"*

1. **Solves Multitudes** - 3+ pain points per page
2. **Anticipates Desire** - Offers before asked
3. **Reveals Wisdom** - Insights, not just data
4. **Respects Time** - 5 clicks or less
5. **Creates Wonder** - "Wow!" not "How?"
6. **Speaks Truth** - Zero mock data (HIGHEST WEIGHT)
7. **Empowers Completely** - Superpowers for users
8. **Shows Trajectory** - Past, present, future
9. **Guards Proactively** - Warns before problems
10. **Remembers The Y** - Clear purpose

---

## Quick Review Checklist

### Visual
- [ ] Is it visually balanced?
- [ ] Is there sufficient contrast?
- [ ] Is the hierarchy clear?
- [ ] Do colors communicate meaning?
- [ ] Are icons clear and consistent?
- [ ] Does it feel premium?

### Readability
- [ ] Can I grasp key info in 3 seconds?
- [ ] Are labels descriptive?
- [ ] Are units shown? ($500K not 500)
- [ ] Is there context? (vs last month)
- [ ] Are sections clearly separated?

### Role Relevance
- [ ] Does it show what this role cares about FIRST?
- [ ] Are critical actions easily accessible?
- [ ] Is the detail level appropriate?
- [ ] Does it answer main questions?

### Functionality
- [ ] Do all buttons/links work?
- [ ] Are there loading states?
- [ ] Are there empty states?
- [ ] Are there error states?
- [ ] Is data authentic?

### Innovation
- [ ] Is there a wow moment?
- [ ] Does it anticipate user needs?
- [ ] Does it show trajectory?
- [ ] Does it proactively alert?
- [ ] Would users exclaim or need explanation?

---

## Scoring & Verdicts

### Weights by Lens
| Lens | Weight |
|------|--------|
| DAISY | 20% |
| Visual | 20% |
| Role Relevance | 20% |
| Architect | 15% |
| Readability | 15% |
| Innovation | 10% |

### Verdict Thresholds
| Score | Verdict | Description |
|-------|---------|-------------|
| 90+ | LEGENDARY | Wonder of the world. Users exclaim. |
| 75-89 | WORTHY | Deity-like capabilities. Ready for users. |
| 60-74 | ACCEPTABLE | Functional but not inspiring. |
| 40-59 | MEH | Generic admin panel. Needs work. |
| 0-39 | UNWORTHY | Deploy blocker. Major fixes needed. |

---

## Implementation

The framework is implemented in:
- `src/services/page-review-framework.ts` - Core types and criteria
- `src/services/daisy-worthiness-validator.ts` - DAISY evaluation

### Usage Example

```typescript
import { 
  PAGE_REVIEW_PROCESS, 
  QUICK_REVIEW_CHECKLIST,
  ROLE_CONTEXTS 
} from '@/services/page-review-framework';

// Get role context for a specific user
const pmContext = ROLE_CONTEXTS['PM'];
console.log(pmContext.primaryConcerns);
// ['Project staffing', 'Budget burn rate', 'Timeline adherence', 'Resource gaps']

// Use quick checklist for manual review
Object.entries(QUICK_REVIEW_CHECKLIST).forEach(([category, items]) => {
  console.log(`\n${category.toUpperCase()}:`);
  items.forEach(item => console.log(item));
});
```

---

## The Sacred Promise

> "The Dashboard IS the user's eyes. Every area of their work experience will be seen visually through the mind's eye of this interface. Think about the importance of that."

Every page review asks one fundamental question:

**"Is this worthy of being the lens through which users see their entire business world?"**

If the answer is not an emphatic YES, keep improving.
