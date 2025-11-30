# Pre-Deployment Quality Gates Checklist
**MUST PASS all checks before deploying to production**

**Strategic Foundation:** These gates enforce the Architect's 3 Frameworks:
1. **Master Review List** - Forces strategic thinking (10 points)
2. **Multi-Expert Lens** - Stress-tests through 5 personas (20 minutes)
3. **Risk Assessment** - Quantifies decision quality (10 minutes)

**Total Time:** 60 minutes per deployment → Prevents 90% of regressions

---

## 🎯 TIER 1: STRATEGIC FRAMEWORK GATES (Required for ALL deployments)

### Framework Gate 1: Master Review List Signed Off
**Time:** 15 minutes | **File:** `/playbooks/master-review-list.md`

Complete all 10 strategic questions:
```
1. [ ] INTENT: Real value, not shortcut?
2. [ ] AUDIENCE: All affected users considered?
3. [ ] JOURNEY: Moving from uncertainty to agency?
4. [ ] CONTEXT: "Why" attached to "What"?
5. [ ] FOCUS: Strategic or tactical (and sized appropriately)?
6. [ ] OPTIONALITY: Creates or constrains future options?
7. [ ] SYSTEM INTEGRITY: Quality systems running?
8. [ ] SOURCE VALIDATION: No fake/mock data?
9. [ ] HUMAN VARIANCE: Works for all capability levels?
10. [ ] DRIFT CHECK: Still aligned with mission?
```

**Sign-off:** Release Manager initials: _____ Date: _____

**Rule:** If ANY question is ❌, DO NOT DEPLOY until resolved.

---

### Framework Gate 2: Multi-Expert Lens Passed
**Time:** 20 minutes | **File:** `/playbooks/multi-expert-lens.md`

Stress-test through 5 expert personas:

| Persona | Status | Primary Fear | Notes |
|---------|--------|--------------|-------|
| Approval Admin (Sarah) | ✅/⏭️/❌ | Duplicate approvals | |
| Finance Manager (David) | ✅/⏭️/❌ | Budget overruns | |
| Vendor Manager (Maria) | ✅/⏭️/❌ | Compliance violations | |
| Contractor (Alex) | ✅/⏭️/❌ | Non-payment | |
| Executive (CEO/CFO) | ✅/⏭️/❌ | Hidden costs | |

**Conflicts Found:** (List any + resolution)

**Verdict:** ✅ = Passed | ⏭️ = Not Applicable | ❌ = Failed

**Rule:** If fewer than 3 personas pass (excluding N/A), DO NOT DEPLOY.

---

### Framework Gate 3: Risk Assessment Completed
**Time:** 10 minutes | **File:** `/playbooks/risk-assessment-template.md`

**Risk Score Calculation:**
```
Base Risk:        _____
+ Complexity:     _____
+ Impact:         _____
+ Vendor Risk:    _____
- Mitigations:    _____
= TOTAL SCORE:    _____
```

**Risk Level & Required Actions:**
- 🟢 LOW (0-20): Standard deploy, monitor 1 hour
- 🟡 MEDIUM (21-50): Extra testing, monitor 2 hours, on-call ready
- 🔴 HIGH (51-75): Staged rollout, monitor 4 hours, rollback tested
- 🔴🔴 CRITICAL (76-100): Executive sign-off, canary deploy, 8-hour watch

**This Feature's Risk Level:** _____ (🟢/🟡/🔴/🔴🔴)

**Rule:** HIGH/CRITICAL features require extra gates below + executive sign-off.

---

## 🚫 TIER 2: AUTOMATION GATES (Cannot Deploy Without)

### 1. Bug Pattern Detection
```bash
# Command: Check for unresolved critical patterns
curl -s http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | select(.likelihood_score >= 75 and .resolved == false)'

# Expected: Empty array
# If failures: Cannot deploy. Fix all critical patterns first.
```

**Critical patterns for Velocity:**
- ❌ Missing FK validation before approval (85% likelihood)
- ❌ window.reload() anywhere in approval flow (72% likelihood)
- ❌ Hardcoded test IDs in production (68% likelihood)

### 2. Visual Regression Testing
```bash
# Step 1: Capture current state
node scripts/capture-page-screenshots.cjs

# Step 2: Check for unresolved changes
# Navigate to: http://localhost:5000/admin/visual-change-gallery → Changes tab
# Expected: All changes marked "Resolved" OR section empty

# If unexpected changes found: Cannot deploy. Fix and recapture.
```

### 3. Change Log Verification
```sql
-- Check no changes stuck in "Pending"
SELECT COUNT(*) FROM change_log WHERE status = 'Pending';
-- Expected: 0

-- Check all changes have test plans
SELECT COUNT(*) FROM change_log WHERE test_plan IS NULL;
-- Expected: 0

-- Check all deployed changes marked "Tested"
SELECT COUNT(*) FROM change_log WHERE status IN ('Pending', 'Testing');
-- Expected: 0 (ready for deploy) or 1-2 (current work)
```

### 4. Code Quality
```bash
# TypeScript compilation (MUST pass)
pnpm build
# Expected: No errors (warnings OK)

# Check for @ts-ignore (should be zero)
grep -r "@ts-ignore" src/ --include="*.tsx" --include="*.ts"
# Expected: Empty (if any, must be documented in replit.md)

# Check for console.error left in code
grep -r "console.error" src/ --include="*.tsx" --include="*.ts" | grep -v "catch"
# Expected: Empty

# Check for hardcoded test IDs
grep -r "invoice-1461\|timecard-1461\|id.*1461\|id.*1462\|id.*1463" src/
# Expected: Empty (only in test files)
```

### 5. Database Integrity
```sql
-- Check no orphaned invoices
SELECT COUNT(*) FROM invoices WHERE contractor_id NOT IN (SELECT id FROM contractors);
-- Expected: 0

-- Check no orphaned timecards
SELECT COUNT(*) FROM timecards WHERE contractor_id NOT IN (SELECT id FROM contractors);
-- Expected: 0

-- Check approval transactions are all complete
SELECT COUNT(*) FROM invoices WHERE status IN ('Pending', 'Rejected');
-- Expected: Should be normal (>0 is fine, indicates workflow working)

-- Check no stuck transactions (created_at > 1 day ago and still "Pending")
SELECT COUNT(*) FROM invoices 
WHERE status = 'Pending' AND created_at < NOW() - INTERVAL '1 day';
-- Expected: 0 or very small
```

### 6. Performance Baselines
```bash
# Load time for approval list (should be <2s with 44 contractors)
curl -w "Total: %{time_total}s\n" http://localhost:3000/approvals

# KPI card calculation (should be <500ms)
# Monitored via browser DevTools → Performance tab
```

---

## ✅ STRONGLY RECOMMENDED (Dependent on time)

- [ ] Run full test suite: `pnpm test` (if exists)
- [ ] Load test: Simulate 10 concurrent approvals
- [ ] Accessibility: Navigate page with keyboard only (Tab, Enter)
- [ ] Cross-browser: Test in Chrome, Firefox, Safari
- [ ] Mobile: Test on 375px (mobile) viewport

---

## 📊 POST-DEPLOYMENT (First 30 minutes)

1. [ ] Monitor error logs: Any new exceptions?
   ```bash
   tail -f server/logs/errors.log
   ```

2. [ ] Check KPI metrics:
   - Approval success rate: Should be 99%+
   - Approval time: Should be <2 seconds
   - No spike in errors

3. [ ] Gather early user feedback:
   - "Is it working?"
   - "Did you notice any visual changes?"
   - "Any errors?"

4. [ ] If issues detected:
   - Rollback immediately (revert to previous commit)
   - Investigate in development
   - Fix & retry deployment

---

## 🎯 SUCCESS CRITERIA

All boxes checked ✓ = **Safe to Deploy**

```
BLOCKING GATES:
☑ No critical bug patterns unresolved (likelihood ≥75%)
☑ No critical/high visual changes unresolved
☑ All changes marked "Tested" in Change Log
☑ TypeScript build passes
☑ No FK constraint violations
☑ Performance baselines met

DEPLOYMENT CONFIDENCE:
0-50%: Many issues. Do NOT deploy.
50-80%: Some issues. Deploy with caution.
80-95%: Minor issues. Can deploy.
95-100%: All gates passed. Safe to deploy.

Expected for Velocity: 95-99% confidence
```

