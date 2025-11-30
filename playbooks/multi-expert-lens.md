# Multi-Expert Lens - 5 Persona Stress Test
**The Architect's Second Foundation: Catch Edge Cases Before Users Do**

**Purpose:** Before deploying ANY feature, simulate how 5 expert personas will experience it. This catches blind spots single-perspective decision-making misses.

**Duration:** 20 minutes per feature  
**Authority:** Required for features affecting 2+ user types  
**Philosophy:** "One perspective sees problems. Five perspectives see solutions."

---

## THE FIVE EXPERT PERSONAS

### PERSONA 1: The Approval Admin (Sarah)
**Primary Fear:** "Duplicate approvals. A contractor gets paid twice and we find out 3 months later."  
**Daily Pain:** "I manually chase approvers. I fix broken approvals. I audit exceptions."  
**Success Metric:** "Zero approval failures. Two-second response time. Clear audit trail."

**Decision Lens (Priority Order):**
1. Safety (no data loss)
2. Speed (approval time)
3. Auditability (compliance)
4. Simplicity (fewer clicks)

**Questions to Ask (Before Deploy):**
- [ ] Can approvals be duplicated if network glitches during submit?
- [ ] Can an approval be "undone" if it was a mistake?
- [ ] Is every approval logged with timestamp, approver ID, reason?
- [ ] Can Sarah see what's pending without scrolling?
- [ ] If a contractor is deleted, what happens to their approvals?

**Red Flags That Would Stop Deploy:**
- ✗ No audit log
- ✗ No way to undo
- ✗ Takes >3 clicks to approve
- ✗ Response time >2 seconds
- ✗ Manual follow-ups still needed

---

### PERSONA 2: The Finance Manager (David)
**Primary Fear:** "Budget overruns. We commit $X but spend $X+50%. It's my neck on the line."  
**Daily Pain:** "I manually reconcile invoices against POs. I hunt for missing receipts. I negotiate vendor refunds."  
**Success Metric:** "Real-time budget visibility. Automatic alerts at 80%/100%. Zero variance."

**Decision Lens (Priority Order):**
1. Accuracy (correct calculations)
2. Real-time (not batch updates)
3. Alerting (proactive warnings)
4. Auditability (forensic trail)

**Questions to Ask (Before Deploy):**
- [ ] Does the KPI card show ACTUAL spend vs budget, not estimates?
- [ ] Does it alert David at 80% and 100%?
- [ ] Can David drill down to see invoice-level detail?
- [ ] If a contractor amount changes, does budget recalculate instantly?
- [ ] Can David export a "year-end reconciliation" report?

**Red Flags That Would Stop Deploy:**
- ✗ Metrics show "pending" amounts, not actual approved spend
- ✗ No alerts
- ✗ Reports lag by a day
- ✗ Can't see which invoices comprise the total
- ✗ Contractor changes don't update budget immediately

---

### PERSONA 3: The Vendor Manager (Maria)
**Primary Fear:** "Compliance violations. We didn't renew contractor's insurance. Now we're liable."  
**Daily Pain:** "I track contracts in Excel. I get surprised by expiring dates. I chase vendors for docs."  
**Success Metric:** "Auto-tracking of contract terms. 30-day pre-expiration alerts. Single source of truth."

**Decision Lens (Priority Order):**
1. Compliance (no violations)
2. Visibility (see all contracts at a glance)
3. Automation (alerts, renewals)
4. Integration (connects to vendor data)

**Questions to Ask (Before Deploy):**
- [ ] Does the system auto-track contract end dates?
- [ ] Does it alert Maria 30 days before expiration?
- [ ] Can Maria see compliance status (insurance, background check, agreement) for each vendor?
- [ ] If a contractor is not compliant, can we block new approvals?
- [ ] Can Maria run a "compliance report" for auditors?

**Red Flags That Would Stop Deploy:**
- ✗ No expiration date tracking
- ✗ No alerts
- ✗ Can't distinguish compliant vs non-compliant contractors
- ✗ No audit trail for "when compliance changed"
- ✗ Still requires Excel tracking

---

### PERSONA 4: The Contractor (Alex)
**Primary Fear:** "Non-payment. I worked for 2 weeks and haven't been paid. My rent is due."  
**Daily Pain:** "I chase on invoice status. I don't know if my invoice was submitted. I wonder if I'm forgotten."  
**Success Metric:** "Clear payment timeline. Know when I'll be paid. Clear communication if issues."

**Decision Lens (Priority Order):**
1. Clarity (status is obvious)
2. Speed (quick payments)
3. Communication (proactive updates)
4. Control (can resubmit if needed)

**Questions to Ask (Before Deploy):**
- [ ] Can contractor see invoice status (submitted/approved/paid) in portal?
- [ ] Does it show estimated payment date?
- [ ] If approval is delayed, does contractor get notified?
- [ ] Can contractor resubmit if invoice is rejected?
- [ ] Is there a message thread for communication?

**Red Flags That Would Stop Deploy:**
- ✗ Contractor sees blank "Processing..." for days
- ✗ No indication when invoice will be approved/paid
- ✗ No notification if approval is held up
- ✗ Rejection reason is unclear or missing
- ✗ Can't resubmit without contacting support

---

### PERSONA 5: The Executive (CEO/CFO)
**Primary Fear:** "Hidden costs. We're wasting money on inefficient processes. Competitors are faster/cheaper."  
**Daily Pain:** "I see reports that don't explain WHY. I can't spot trends. I make decisions on stale data."  
**Success Metric:** "Real-time KPIs. Clear ROI metrics. Competitive intelligence."

**Decision Lens (Priority Order):**
1. ROI (what's the business impact?)
2. Trends (where are we going?)
3. Benchmarks (how do we compare?)
4. Automation (is this reducing cost?)

**Questions to Ask (Before Deploy):**
- [ ] Does the dashboard show "time to payment" metric trending down?
- [ ] Can CEO see cost savings vs competitor baseline?
- [ ] Are we reducing manual work (# of hours saved)?
- [ ] Can we measure improvement in approval workflow?
- [ ] Is there a dashboard showing adoption + ROI?

**Red Flags That Would Stop Deploy:**
- ✗ Can't demonstrate measurable improvement
- ✗ No ROI metric
- ✗ Doesn't compare to competitors
- ✗ Doesn't show cost savings
- ✗ Executive can't see dashboard in 60 seconds

---

## HOW TO RUN THE MULTI-EXPERT LENS

**Before Deploy, Answer These Questions:**

**FEATURE:** [e.g., "FK Validation on Timecard Approval"]

**Approval Admin Lens:**
- [ ] Makes this approval safer? YES ✓
- [ ] Adds friction? NO ✓
- [ ] Audit trail clear? YES ✓
- VERDICT: ✅ PASS

**Finance Lens:**
- [ ] Prevents budget overruns? YES ✓
- [ ] Shows calculation accurately? YES ✓
- [ ] Real-time or batched? REAL-TIME ✓
- VERDICT: ✅ PASS

**Vendor Manager Lens:**
- [ ] Improves compliance tracking? NO - Doesn't affect vendor compliance
- VERDICT: ⏭️ NOT APPLICABLE (doesn't affect this persona)

**Contractor Lens:**
- [ ] Makes status clearer? NO - Contractor doesn't see this change
- VERDICT: ⏭️ NOT APPLICABLE (transparent to contractor)

**Executive Lens:**
- [ ] Shows measurable improvement? YES - Prevents $X in bad data
- [ ] Reduces manual work? YES - No more orphaned invoices
- [ ] ROI positive? YES - Prevents 1 data corruption event per week
- VERDICT: ✅ PASS

**FINAL DECISION:** ✅ SAFE TO DEPLOY

---

## CONFLICT RESOLUTION

Sometimes personas want opposite things:

```
EXAMPLE:

Feature: "Auto-approve invoices <$500 from repeat contractors"

Approval Admin Lens:
  "Reduces manual work! YES!" ✓

Finance Lens:
  "Removes human review! NO - risky!" ✗

Contractor Lens:
  "Faster payment! YES!" ✓

CONFLICT: Finance wants safety, Approval Admin wants speed

RESOLUTION:
  Compromise: Auto-approve <$500 BUT require daily reconciliation by Finance
  Result: Fast for contractor, safe for Finance, minimal extra work for Admin
```

**Conflict Resolution Matrix:**

| Conflict | Resolution Strategy |
|----------|-------------------|
| Safety vs Speed | Add safeguard (audit log, alerts, review queue) |
| Automation vs Control | Add manual override option |
| UX Simplicity vs Power Features | Add "advanced mode" toggle |
| Cost vs Compliance | Cost compliance, it's not optional |

---

## SCORING MATRIX

**How Many Personas Passed?**

| Personas | Confidence | Action |
|----------|-----------|--------|
| 5/5 | 100% | DEPLOY IMMEDIATELY |
| 4/5 + conflicts resolved | 95% | Deploy with monitoring |
| 3/5 | 60% | Major rework needed |
| <3/5 | <60% | **DO NOT DEPLOY** |

**Velocity Target:** 5/5 personas passing OR clear conflicts resolved with compromises

---

## TEMPLATE FOR FUTURE FEATURES

```
FEATURE: [Name]

┌─────────────────────┐
│ APPROVAL ADMIN      │ Status: ✅/⏭️/❌
│ Primary Fear: ___   │ 
│ Questions: [ ]      │
└─────────────────────┘

┌─────────────────────┐
│ FINANCE MANAGER     │ Status: ✅/⏭️/❌
│ Primary Fear: ___   │
│ Questions: [ ]      │
└─────────────────────┘

┌─────────────────────┐
│ VENDOR MANAGER      │ Status: ✅/⏭️/❌
│ Primary Fear: ___   │
│ Questions: [ ]      │
└─────────────────────┘

┌─────────────────────┐
│ CONTRACTOR          │ Status: ✅/⏭️/❌
│ Primary Fear: ___   │
│ Questions: [ ]      │
└─────────────────────┘

┌─────────────────────┐
│ EXECUTIVE           │ Status: ✅/⏭️/❌
│ Primary Fear: ___   │
│ Questions: [ ]      │
└─────────────────────┘

CONFLICTS: (None / [List + Resolution])

FINAL DECISION: ✅/⏭️/❌ DEPLOY
```

