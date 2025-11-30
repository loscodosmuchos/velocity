# Risk Assessment Template - Feature Risk Scoring
**The Architect's Third Foundation: Quantify Decision Quality**

**Purpose:** Before implementing a feature, assess its risk level. This guides effort investment and testing intensity.

**Duration:** 10 minutes per feature  
**Formula:** Risk Score = Base Risk + Risk Factors + Vendor Dependencies

---

## RISK SCORING FORMULA

```
RISK SCORE = BASE RISK + RISK FACTORS + VENDOR RISK - MITIGATIONS

Base Risk (Starting Point):
  Complexity Level × Impact Level

Complexity Factors (Add +10-30% each):
  [ ] Type system changes needed? +10%
  [ ] Database schema change? +15%
  [ ] New vendor integration? +20%
  [ ] Affects payment/approval flow? +25%
  [ ] Affects multiple user types? +5% per type

Impact Factors (Add +5-20% each):
  [ ] Affects <10 users? +0%
  [ ] Affects 10-100 users? +5%
  [ ] Affects 100+ users? +10%
  [ ] Financial data touched? +15%
  [ ] Compliance-related? +20%

Vendor Risk (Add +5-15%):
  Per dependency on external service that could fail

Mitigations (Subtract -5-25%):
  [ ] Has comprehensive test coverage? -5%
  [ ] Pre-deployment checklist passes? -10%
  [ ] Rollback strategy clear? -5%
  [ ] Monitoring/alerts in place? -5%
  [ ] Feature flag for gradual rollout? -5%

Final Score:
  0-20: 🟢 LOW - Ship it
  21-50: 🟡 MEDIUM - Ship with caution
  51-75: 🔴 HIGH - Extra review needed
  76-100: 🔴🔴 CRITICAL - Extensive testing required
```

---

## EXAMPLE: TIMECARD APPROVAL WITH FK VALIDATION

**Feature:** Add FK validation before timecard approval (prevent approvals for non-existent contractors)

**Step 1: Base Risk**
```
Complexity Level: MEDIUM (1-2 hour feature)
Impact Level: MEDIUM (affects approval admins + contractors)
Base = 2 × 2 = 4
```

**Step 2: Complexity Factors**
```
[ ] Type system changes? NO → +0%
[✓] Database query added? YES → +10% (checking FK)
[ ] New vendor integration? NO → +0%
[✓] Affects approval flow? YES → +25% (core flow)
[ ] Affects multiple user types? YES - Admin + Contractor → +10%
Total Complexity: 4 + 10 + 25 + 10 = 49
```

**Step 3: Impact Factors**
```
[ ] Affects <10 users? NO
[✓] Affects 10-100 users? YES → +5%
[ ] Affects 100+ users? NO
[✓] Financial data touched? YES (approve invoices/timecards) → +15%
[✓] Compliance-related? YES (audit trail) → +20%
Total Impact: 5 + 15 + 20 = 40
```

**Step 4: Vendor Risk**
```
Depends on: PostgreSQL
Risk: If DB is down, approvals blocked anyway → +0%
(Doesn't add NEW vendor risk)
Total Vendor Risk: 0
```

**Step 5: Mitigations**
```
[✓] Comprehensive tests? YES → -5%
[✓] Pre-deploy checklist? YES → -10%
[✓] Rollback clear? YES (remove WHERE clause) → -5%
[✓] Monitoring in place? YES (approval success rate) → -5%
[ ] Feature flag? NO → +0%
Total Mitigations: -25%
```

**FINAL SCORE:**
```
49 + 40 + 0 - 25 = 64 🔴 HIGH RISK

Wait, that seems high for a simple query...
```

**Step 6: Risk Factors Deep Dive (Why HIGH?)**
```
Why 64 and not lower?

1. CORE FLOW RISK: This is in the approval path. If broken, nothing works.
2. DATA INTEGRITY: Prevents data corruption. If we miss bugs, costly.
3. MULTIPLE PERSONAS: Affects admin (relies on feature), contractor (payment).
4. FINANCIAL IMPACT: Wrong approvals = wrong payments = audit failures.

Realistic Assessment:
  - Probability bug occurs: 20% (FK query is simple)
  - Impact if bug occurs: CRITICAL (data corruption)
  - Detection time: 1-3 days (caught in testing or early production)
  - Recovery time: 2-4 hours (manual correction + re-approval)

High score is JUSTIFIED. This needs:
  - Thorough testing ✓
  - Pre-deploy review ✓
  - Monitoring in production ✓
```

---

## RISK SCORE INTERPRETATION

### 🟢 LOW RISK (0-20)
**Examples:** UI color change, text update, non-critical feature flag

**Action:**
- Standard pre-deploy checklist
- Ship quickly
- Monitor for first 24 hours

### 🟡 MEDIUM RISK (21-50)
**Examples:** New approval type, vendor integration, dashboard widget

**Action:**
- Multi-Expert Lens review required
- Extra manual testing on staging
- 30-minute production monitoring window
- On-call engineer available first hour

### 🔴 HIGH RISK (51-75)
**Examples:** Payment flow changes, database schema changes, new AI feature

**Action:**
- Full Master Review List + Multi-Expert Lens
- Staged rollout (5% → 25% → 100% of users)
- A/B testing if possible
- 2-hour production monitoring window
- Rollback plan pre-tested and documented
- On-call engineer available first 4 hours

### 🔴🔴 CRITICAL (76-100)
**Examples:** Authentication changes, security patches, compliance fixes, major refactors

**Action:**
- Executive sign-off required
- 3+ engineers review
- Full test suite required (>90% coverage)
- Staging environment must replicate production exactly
- Canary deployment (0.1% → 1% → 10% → 100%)
- 8+ hours production monitoring
- Incident commander assigned
- Pre-coordinated rollback procedure

---

## RISK ASSESSMENT MATRIX BY FEATURE TYPE

| Feature Type | Base Risk | Why | Typical Score |
|---|---|---|---|
| UI cosmetics | 10 | Low impact, easy revert | 10-20 🟢 |
| Bug fix | 30 | Medium complexity, high impact | 25-45 🟡 |
| New dashboard | 25 | Medium complexity, low impact | 20-40 🟡 |
| Approval flow change | 60 | High complexity, critical impact | 50-70 🔴 |
| Payment integration | 80 | Very high complexity, financial data | 70-90 🔴🔴 |
| Auth system change | 90 | Highest complexity, security critical | 80-100 🔴🔴 |
| Data migration | 85 | High risk of data loss | 75-95 🔴🔴 |

---

## MITIGATIONS THAT REDUCE RISK

**Each of these typically reduces risk by 5-15%:**

```
Testing:
  [ ] Unit tests for new code? -5%
  [ ] Integration tests? -5%
  [ ] E2E test on staging? -5%
  [ ] Manual QA checklist? -3%

Process:
  [ ] Pre-deploy checklist passes? -10%
  [ ] Multi-Expert Lens review? -5%
  [ ] Code review (2+ people)? -5%
  [ ] Change Log entry created? -3%

Deployment:
  [ ] Feature flag ready? -5% (easy rollback)
  [ ] Canary/staged rollout? -10% (catch issues early)
  [ ] Blue-green deployment? -10% (instant rollback)
  [ ] Monitoring/alerts configured? -5%

Communications:
  [ ] Stakeholders notified? -3%
  [ ] Rollback plan documented? -3%
  [ ] On-call engineer ready? -3%

Maximum Mitigations: -75% (can't go below 25% base risk due to unknown unknowns)
```

---

## HOW TO USE THIS TEMPLATE

**Before Implementing:**

1. Estimate complexity (5 min)
2. Calculate base risk (2 min)
3. Add risk factors (3 min)
4. Plan mitigations (2 min)
5. Calculate final score (1 min)
6. Match to action plan (1 min)

**Total Time:** 15 minutes → Prevents 80% of problems

**Example Entry:**

```
FEATURE: Bulk Timecard Import

Base Risk: 55 (complex + high impact)
Risk Factors:
  [ ] DB schema? YES → +15%
  [ ] New vendor? NO → +0%
  [ ] Affects 100+? YES → +10%
  [ ] Financial? YES → +15%
  Total: 55 + 40 = 95

Vendor Risk: +5% (new CSV parser library)

Mitigations:
  [✓] Comprehensive tests → -5%
  [✓] Feature flag → -5%
  [✓] Staging test → -5%
  [✓] Rollback ready → -5%
  [✓] Monitoring → -5%
  Total: -25%

FINAL SCORE: 95 + 5 - 25 = 75 🔴 HIGH

ACTION PLAN:
  1. Staged rollout (5% → 25% → 100%)
  2. On-call for first 2 hours
  3. Rollback tested and documented
  4. Multi-Expert Lens review required
```

