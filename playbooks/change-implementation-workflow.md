# Change Implementation Workflow
**Complete lifecycle for ANY code change to ensure quality and prevent bugs**

## Phase 1: PLAN (5 minutes)

- [ ] Open Change Log Dashboard at `/admin/change-log-dashboard`
- [ ] Click "Add New Change"
- [ ] Fill in:
  - Title: "What changed"
  - Description: "Why it changed"
  - File path: "Which file(s) changed"
  - Test location: "URL where to test" (e.g., `/approvals`)
  - Test plan: "Steps to verify it works" (auto-generate)
  - Priority: critical/high/medium/low
- [ ] Status: "Pending"

## Phase 2: IMPLEMENT (variable)

- [ ] Write code
- [ ] TypeScript check: `pnpm build` (no errors)
- [ ] Lint check: `pnpm lint` (no warnings)
- [ ] Scan for known bad patterns:
  - Hardcoded test IDs: `grep -r "invoice-1461\|timecard-1461" src/`
  - Page reloads: `grep -r "window.reload\|location.reload" src/`
  - @ts-ignore: `grep -r "@ts-ignore" src/`
  - console.error: `grep -r "console.error" src/`
- [ ] If any found: FIX BEFORE PROCEEDING

## Phase 3: VERIFY (10 minutes)

- [ ] Navigate to test location URL (from Change Log)
- [ ] Run test plan steps manually
- [ ] Verify:
  - No page reload happens (check browser console)
  - No red error messages
  - React state updates (not stale)
  - Functionality works as expected
- [ ] Check browser console: No errors/warnings

## Phase 4: CAPTURE & TRACK (5 minutes)

- [ ] Run screenshot capture: `node scripts/capture-page-screenshots.cjs`
- [ ] Wait for completion (~2 minutes)
- [ ] Go to `/admin/visual-change-gallery`
- [ ] Review "Changes" tab:
  - Are visual changes expected? YES → Continue
  - Are visual changes unexpected? NO → Fix code, recapture
- [ ] Mark change as "Testing" in Change Log Dashboard

## Phase 5: QUALITY GATES (5 minutes)

**PRE-DEPLOYMENT CHECKLIST:**

- [ ] Bug patterns: Run `curl /api/bug-patterns?severity=critical` → Should be empty
- [ ] Visual changes: Go to `/admin/visual-change-gallery` → Changes tab → Should be empty OR all marked resolved
- [ ] Change Log: Mark status "Tested"
- [ ] No TypeScript errors: `pnpm build` ✅
- [ ] Change Log entry has test plan: ✅

If any ❌: Fix and restart from Phase 2

## Phase 6: DEPLOY

- [ ] All quality gates passed ✓
- [ ] Confidence level: 99%+ (screenshot verified, tested, bug pattern scanned)
- [ ] Merge to main branch
- [ ] Wait ~5 minutes for production update

---

## Time Estimate Per Change
- Simple fix: 20 minutes total
- Medium feature: 45 minutes total
- Complex change: 90 minutes total

**Key:** Most time is in verification & capture. Code writing is often <10 minutes.

