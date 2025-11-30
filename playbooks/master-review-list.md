# Master Review List - 10-Point Pre-Deploy Checklist
**The Architect's Foundation: Front-Load Intelligence**

**Purpose:** Force strategic thinking before ANY deployment. This checklist prevents 90% of regressions by catching decisions that should never have been made.

**Duration:** 15 minutes per deployment  
**Authority:** Required sign-off by Release Manager  
**Philosophy:** "A 10-minute review prevents a 10-hour post-deployment panic"

---

## THE 10 POINTS (Must Answer YES to All)

### 1. INTENT: Are We Adding Value or Cutting Corners?
**What we're checking:** Is this change genuinely solving a user problem, or just "finishing fast"?

```
Questions:
  ✓ Does this feature solve a real, documented pain point?
  ✓ Have we validated this solves the pain (not just our assumption)?
  ✓ Will users notice and appreciate this change?
  ✓ Or is this "technical debt" masquerading as progress?

For Velocity:
  Approval workflow optimization:
    ✓ YES - Reduces approval time from 5 minutes to 2 minutes (documented)
    ✓ YES - Approval admin asked for faster workflows
    ✓ YES - Visible in dashboard KPI cards
    ✓ NOT a shortcut
```

**Red Flag:** "We built it, might as well ship it" → STOP, rethink this feature

---

### 2. AUDIENCE: Who Feels This Change? What's Their Cognitive Load?
**What we're checking:** Will this help the people it affects, or add confusion?

```
For each user type affected:
  Approval Admin:
    ✓ Does this make their job easier or harder?
    ✓ Is there a learning curve?
    ✓ Can they undo mistakes?
  
  Finance Manager:
    ✓ Do they see the benefit in their metrics?
    ✓ Does this reduce their manual work?
    ✓ Any new compliance burden?
  
  Contractor:
    ✓ Does this make their experience better?
    ✓ Or are we adding friction they don't need?
  
  Executive:
    ✓ Do they see ROI (time saved, cost reduced, risk mitigated)?

Decision: If ANY audience says "this makes my job harder", ask why before deploying.
```

---

### 3. JOURNEY: Are We Moving Users from Uncertainty to Agency?
**What we're checking:** Does this feature reduce confusion and increase control?

```
Before State (User Uncertainty):
  "Is my timecard approved?"
  "How long will it take?"
  "What happens next?"
  "Why was it rejected?"

After State (User Agency):
  ✓ Clear status (approved/pending/rejected)
  ✓ Timeline visible (approved in 2 hours)
  ✓ Next steps clear (invoice processing, payment next)
  ✓ Reason shown (missing documentation, budget exceeded)

If After state doesn't reduce uncertainty, this change isn't ready.
```

---

### 4. CONTEXT: Is the "Why" Attached to the "What"?
**What we're checking:** Do we understand the actual problem, not just the symptom?

```
Bad:
  "We added FK validation"
  Why? Unknown. Probably cargo-cult programming.

Good:
  "We added FK validation because approvals were succeeding for non-existent contractors,
   causing data corruption and orphaned invoices. This fix ensures every approval is
   validated against live data, preventing 85% of recurring bugs."
  Why? Clear problem + root cause + why this solution.

Before Deploy:
  [ ] Can we explain WHY this change exists in 1 sentence?
  [ ] If we say "because X", can we defend X?
```

---

### 5. FOCUS: Are We "Gordon Moore" (Vision) or "Admin" (Execution)?
**What we're checking:** Is this strategically important, or just operationally convenient?

```
Gordon Moore (Strategic/CEO):
  "Reduce approval time by 70% to become fastest VMS in market"
  → Aligns with platform vision
  → Differentiates against FieldGlass/FlexFactor
  → Multi-year ROI
  → Worth 40 hours of work

Admin (Tactical/Operations):
  "Fix the Excel import so it doesn't lose blank rows"
  → Solves immediate pain
  → Doesn't move business forward
  → Nice to have
  → Worth 2 hours of work

Decision:
  - Strategic features: Deploy quickly, invest deeply
  - Tactical features: Deploy carefully, don't over-engineer
  - Know which you're doing, and size the effort accordingly
```

---

### 6. OPTIONALITY: Does This Create "Stored Energy" (Options)?
**What we're checking:** Does this change make future work easier or harder?

```
Stored Energy (Good):
  ✓ Modular plugin system → easier to add new approval types later
  ✓ Clear API contract → easier to integrate new vendors
  ✓ Documented decision → easier for next developer to understand

Locked In (Bad):
  ✗ Hard-coded contractor IDs → can't scale to other clients
  ✗ One-off special case → sets precedent for infinite special cases
  ✗ Undocumented magic → next developer has to reverse-engineer it

Before Deploy:
  [ ] Does this make the codebase more flexible or more rigid?
  [ ] Could we extract a pattern that benefits future features?
  [ ] Are we creating technical debt or paying it down?
```

---

### 7. SYSTEM INTEGRITY: Are Our Quality Systems Running?
**What we're checking:** Did we actually run our guardrails, or did we skip them?

```
Checklist (All Must Pass):
  [ ] Bug Pattern Detection: Ran, found 0 critical patterns
  [ ] Visual Change Gallery: Screenshots captured, reviewed
  [ ] Change Log: Documented with test plan
  [ ] TypeScript: pnpm build passes with 0 errors
  [ ] Pre-deploy gates: ALL 6 gates passing
  
  [ ] Change Log entry has test locations
  [ ] Test plan has actual steps, not "tested locally"
  [ ] Linting: pnpm lint passes
  [ ] FK constraints verified (if applicable)

If ANY check fails: DO NOT DEPLOY
```

---

### 8. SOURCE VALIDATION: Are We Avoiding "Packet Spoofing" (Fake Data)?
**What we're checking:** Is every number real, or did we sneakbomb mock data?

```
CRITICAL: Every metric, calculation, and display must derive from real database queries.

✗ BAD (Fake):
  const mockMetrics = {
    approvalsThisWeek: 47,      // Hardcoded
    costSavings: "$250,000",    // Made up
    vendors: 12                  // Placeholder
  }

✓ GOOD (Real):
  const metrics = await db
    .select(sql`COUNT(*) as count`)
    .from(approvals)
    .where(gte(approvals.created_at, oneDaysAgo))

Before Deploy:
  [ ] No hardcoded sample/test IDs in production code (invoice-1461, contractor-999, etc)
  [ ] No mock data in dashboards
  [ ] All calculations from real DB queries
  [ ] Search query tested against 44+ actual contractors
  [ ] Charts use real historical data, not projections
```

---

### 9. HUMAN VARIANCE: Are We Respecting Different Capabilities?
**What we're checking:** Does this work for everyone, or just power users?

```
Different User Types:
  Novice User (just hired):
    ✓ Can they use this without training?
    ✓ Are there helpful defaults?
    ✓ Does the UI explain what to do?
  
  Power User (has shortcuts memorized):
    ✓ Can they skip the wizard and go straight to action?
    ✓ Are there keyboard shortcuts?
    ✓ Does it respect their preferences?
  
  Accessibility Requirements:
    ✓ Screen reader compatible?
    ✓ Keyboard navigation only?
    ✓ Color not the only differentiator?
    ✓ High contrast mode works?

Before Deploy:
  [ ] Tested with 3+ different user skill levels
  [ ] Works with keyboard only (no mouse required)
  [ ] WCAG 2.1 AA contrast ratios met
```

---

### 10. DRIFT CHECK: Have We Forgotten Our Destination?
**What we're checking:** Is this still aligned with our mission, or did we get distracted?

```
Velocity's North Star:
  ✓ "Legendary UI" that makes users say "Look how fast this works!"
  ✓ Single source of truth for workforce data
  ✓ Proactive intelligence (prevents problems, not just reports them)
  ✓ 70% faster workflows (measurable, real-world proof)
  ✓ Competitive advantage against FieldGlass/FlexFactor

Before Deploy, Ask:
  [ ] Does this feature ladder up to Velocity's mission?
  [ ] Could we use this in Hyundai demo?
  [ ] Does it make us MORE differentiated or LESS?
  [ ] If we removed this 6 months from now, would anyone miss it?
  
  If more than 1 answer is NO: Reconsider this feature
```

---

## SCORING MATRIX

After checking all 10 points:

| Points | Confidence | Action |
|--------|-----------|--------|
| 10/10 | 99% | DEPLOY IMMEDIATELY |
| 9/10 | 95% | Deploy with monitoring |
| 8/10 | 85% | Deploy after extra review |
| 7/10 | 70% | Rework or hold |
| <7/10 | <70% | **DO NOT DEPLOY** |

**Velocity Target:** 9-10/10 on every deployment

---

## HOW TO USE THIS CHECKLIST

**Before Every Deploy:**
1. Grab this file
2. Answer all 10 questions honestly (not "yes because I hope so")
3. If you hesitate on ANY question, discuss with team
4. Get sign-off from Release Manager
5. Only then merge to main

**Time Estimate:** 15 minutes per deployment  
**Payoff:** Prevents 90% of regressions

**If You're Tempted to Skip:** Remember the last time a bad deploy happened. Was it worth the 15 minutes you saved?

