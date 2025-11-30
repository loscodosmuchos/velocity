# Architect Learnings Log
**Purpose**: Capture insights from architect reviews to prevent repeated mistakes

---

## November 18, 2025 - Duplicate ThemeProvider Bug

### **The Problem**
Sidebar not visible - browser showed `DefaultErrorComponent` instead of app

### **My Failure Mode**
- Got sidetracked building health check validation scripts
- Treated symptoms (validation metrics) instead of root cause
- Avoided confronting the actual UI failure
- Classic "make dashboards green" cognitive bias

### **What Architect Did (Fast)**
1. Checked browser console → saw React hook mismatch
2. Inspected component tree → found duplicate provider
3. Identified root cause: `layout.tsx` wrapped children in ThemeProvider when App.tsx already had one
4. Solution: Remove nested ThemeProvider

### **Root Cause**
```typescript
// App.tsx - OUTER provider
<ThemeProvider>
  <Refine>
    <RouterProvider />
  </Refine>
</ThemeProvider>

// layout.tsx - DUPLICATE INNER provider (WRONG)
export function Layout({ children }) {
  return (
    <ThemeProvider>  // ❌ Duplicate causes React hook errors
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}

// FIXED layout.tsx
export function Layout({ children }) {
  return (
    <SidebarProvider>  // ✅ No duplicate provider
      {children}
    </SidebarProvider>
  );
}
```

### **Key Lessons**

1. **DefaultErrorComponent = Check Browser Console FIRST**
   - Don't build validation tooling
   - Read actual runtime logs immediately
   - Look for React errors, hook mismatches, provider conflicts

2. **UI Failure Triage Sequence**
   ```
   1. Reproduce exact UI path
   2. Read browser console for errors
   3. Inspect failing component boundary
   4. Ask: "Does this fix the immediate bug?"
   5. Only build tooling if answer is YES
   ```

3. **Avoid "Make Dashboards Green" Bias**
   - Don't optimize what's easy to measure
   - Fix what's actually broken
   - User-visible failures > validation metrics

4. **Provider Nesting Rules**
   - One ThemeProvider per app (at root)
   - Child layouts should NOT re-wrap with same provider
   - Check for duplicate context providers when seeing hook errors

### **Preventative Guardrail**
Before building ANY tooling, answer:
> **"How does this directly unblock the current bug?"**

If answer is unclear → Go back to browser console/logs first

---

## Pattern: React Hook Errors / Context Mismatches

**Symptom**: "Rendered more hooks than during previous render" or similar

**Common Cause**: Duplicate context providers in component tree

**Debug Steps**:
1. Search for `<ThemeProvider>` or `<*Provider>` in codebase
2. Check if provider appears in both App.tsx AND layout/child components
3. Remove duplicate from child component
4. Keep provider at highest level only (usually App.tsx)

**Files to Check**:
- `src/App.tsx` - Root level providers
- `src/components/refine-ui/layout/layout.tsx` - Layout wrappers
- Any custom context providers

---

## November 18, 2025 - Health Check System Limitations

### **What Architect Flagged**

**Issue 1**: Hard-coded port (5000)
- Script assumes localhost:5000
- Won't work in different environments
- **Fix**: Make port configurable via env variable

**Issue 2**: Brittle string matching for menu validation
- Uses literal `name: "purchaseorders"` searches
- Will break if formatting changes or constants extracted
- **Fix**: Parse App.tsx AST or export resource list programmatically

**Issue 3**: Documentation drift
- Docs describe old implementation (hasSidebarComponent field removed)
- Sample JSON doesn't match actual script output
- **Fix**: Keep docs in sync with code changes

### **Key Lesson**
**Production-grade requires environment flexibility**
- Don't hard-code localhost, ports, or file paths
- Make validation resilient to refactoring
- Keep documentation synchronized with implementation

---

## Pattern: Validation Script Best Practices

**DO**:
- ✅ Make all URLs/ports/paths configurable
- ✅ Parse code structure (AST) instead of string matching
- ✅ Return structured JSON with clear status levels
- ✅ Update docs when changing script behavior

**DON'T**:
- ❌ Hard-code environment-specific values
- ❌ Use brittle string searches for code validation
- ❌ Let documentation drift from implementation
- ❌ Build validation that requires manual execution

---

## Meta-Learning: How to Use This Log

**Before Starting Work**:
1. Search this file for similar patterns
2. Check if architect already flagged this issue
3. Apply known fix patterns first

**After Architect Review**:
1. Add new lesson with date
2. Document the failure mode
3. Capture architect's diagnostic approach
4. Write preventative pattern

**Goal**: Make architect insights searchable and reusable
