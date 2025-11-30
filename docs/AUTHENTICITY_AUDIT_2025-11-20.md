# Authenticity Audit Report

> **Date:** 2025-11-20  
> **Status:** VIOLATIONS IDENTIFIED  
> **Action Required:** Fix before production  

---

## Summary

Audit of codebase for fake/mock/sample/demo/placeholder data that violates the Authenticity Pillar.

---

## Critical Violations

### 1. AlertContext - Hardcoded Demo Alerts

**File:** `src/contexts/AlertContext.tsx`  
**Lines:** 28-69 (FIXED)  
**Status:** ✅ RESOLVED

**Issue:** Context initialized with 4 hardcoded demo alerts:
- "Budget Overrun Detected" 
- "Timecard Submitted"
- "Invoice Processed"
- "Contract Expiring Soon"

**Fix Applied:** Changed to empty array initialization:
```typescript
const [items, setItems] = useState<Alert[]>([]);
```

Also removed `simulateSampleAlerts()` function entirely.

---

### 2. DashboardWidget - Fake KPI Data

**File:** `src/components/dashboard/DashboardWidget.tsx`  
**Lines:** 11-53  
**Status:** ❌ NEEDS FIX

**Issue:** Massive hardcoded data map with fabricated values:
```typescript
const getDemoData = (moduleName: string) => {
  const dataMap = {
    "Total Candidates": { value: "1,247", trend: "up", change: 12 },
    "Vendor Spend": { value: "$284K", trend: "up", change: 18 },
    // ... 30+ more fake values
  };
  // Fallback uses Math.random()!
  return dataMap[moduleName] || { value: Math.floor(Math.random() * 1000).toString() };
};
```

**Additional Issues:**
- Line 111: Hardcoded sparkline heights `[0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 1.0]`
- Line 135: Hardcoded bar heights `[65, 45, 80, 55, 70, 50, 85]`
- Line 150: Random percentage `Math.floor(Math.random() * 20 + 5)}%`
- Line 166: Fake names `['Sarah Chen', 'Mike Rodriguez', 'Emily Park', 'James Wilson']`
- Line 180: Fake job titles `['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst']`

**Required Fix:**
- Remove `getDemoData()` function
- Pass real data as props from parent components
- Connect to actual database queries
- Show empty states when no data available

---

### 3. SignInForm - Pre-filled Demo Credentials

**File:** `src/components/refine-ui/form/sign-in-form.tsx`  
**Lines:** 19-20  
**Status:** ⚠️ ACCEPTABLE FOR DEMO

**Issue:**
```typescript
const [email, setEmail] = useState("michael.scott@dundermifflin.com");
const [password, setPassword] = useState("demodemo");
```

**Notes:**
- This is for demo login convenience
- Should be removed or made configurable for production
- Consider: Empty by default, with "demo login" button that fills in values

---

### 4. SignUpForm - Lorem Ipsum Placeholder

**File:** `src/components/refine-ui/form/sign-up-form.tsx`  
**Line:** 108  
**Status:** ❌ NEEDS FIX

**Issue:**
```typescript
<CardDescription>
  Welcome to lorem ipsum dolor.
</CardDescription>
```

**Required Fix:**
```typescript
<CardDescription>
  Create your Velocity account
</CardDescription>
```

---

### 5. Compact Alert Cubes - Stubbed Actions

**File:** `src/components/compact-alert-cubes.tsx`  
**Line:** 61  
**Status:** ⚠️ ACKNOWLEDGED

**Issue:**
```typescript
// TODO: Implement actual action handling (backend integration)
console.log(`Action: ${action} for category: ${category}`);
```

**Notes:**
- This is a stub awaiting backend integration
- The console.log is appropriate for development
- Marked with TODO for tracking

---

## Medium Priority

### 6. Logic Studio - Sample Data Claims

**File:** `src/pages/admin/logic-studio.tsx`  
**Lines:** 340-349  
**Status:** ⚠️ VERIFY

**Text claims:**
```
"All formulas shown are actively used in production"
"The sample data loaded represents real client scenarios"
"All metrics are derived from actual data processing, not hardcoded values"
```

**Action:** Verify these claims are accurate. If formulas use hardcoded data, update the messaging.

---

## Low Priority (Acceptable)

### UI Input Placeholders

Files with `placeholder="..."` in form inputs - these are UX guidance, not data:
- `src/components/ai-assistant-chat.tsx` - "Ask a question..."
- `src/components/dashboard/SaveLayoutDialog.tsx` - "My Custom Dashboard"
- Various filter inputs - "Filter by...", "Search..."

**Status:** ✅ ACCEPTABLE - These are UI hints, not fake data.

---

## Fix Priority Order

| Priority | File | Issue | Effort |
|----------|------|-------|--------|
| 1 | AlertContext.tsx | Demo alerts | ✅ DONE |
| 2 | DashboardWidget.tsx | Fake KPI data | High - requires data hookup |
| 3 | sign-up-form.tsx | Lorem ipsum | Low - text change |
| 4 | sign-in-form.tsx | Demo credentials | Low - optional |
| 5 | compact-alert-cubes.tsx | Stubbed actions | Medium - backend work |

---

## Verification Commands

```bash
# Find remaining mock/demo/fake data
grep -rn "mock\|sample\|demo\|fake\|lorem\|hardcoded" src/ --include="*.tsx" --include="*.ts"

# Find Math.random() usage (often indicates fake data)
grep -rn "Math.random" src/ --include="*.tsx" --include="*.ts"

# Find hardcoded arrays that should be dynamic
grep -rn "\[{" src/pages/ --include="*.tsx" | head -20
```

---

## Next Steps

1. ✅ Remove demo alerts from AlertContext
2. ❌ Refactor DashboardWidget to accept real data props
3. ❌ Fix lorem ipsum in sign-up form
4. ⚠️ Consider demo credentials approach
5. ❌ Implement real backend for alert actions

---

## Related Documents

- `docs/AUTHENTICITY_PILLAR.md` - Core principle documentation
- `docs/CHART_CUSTOMIZATION_PROCESS.md` - Real data in charts
