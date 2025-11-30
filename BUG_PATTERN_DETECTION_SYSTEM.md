# BUG PATTERN DETECTION SYSTEM
**Evaluates repetition likelihood & generates grep patterns to find similar bugs**

---

## ARCHITECTURE

### 3 Layers:

**1. Database Schema** (`server/database/bug-patterns-schema.sql`)
- `bug_patterns` - Each bug's profile with likelihood score
- `bug_occurrences` - Found instances of the pattern in codebase
- `bug_analysis` - Detailed analysis and prevention strategies

**2. Admin UI** (`src/pages/admin/bug-pattern-detector.tsx`)
- View patterns ranked by likelihood
- Scan codebase for pattern matches
- Risk analysis dashboard
- Copy grep commands

**3. Analyzer Tool** (`scripts/bug-pattern-analyzer.cjs`)
- Calculates likelihood of repetition (0-100)
- Explains why bug will repeat
- Generates grep patterns
- Outputs prevention strategies

---

## WORKFLOW: When You Find a Bug

### Step 1: Analyze the Bug
```bash
node scripts/bug-pattern-analyzer.cjs
```
This shows:
```
📊 REPETITION LIKELIHOOD: 67/100
   LIKELY - Add linting rule

📈 Risk Factors:
   ✓ architectural-pattern (+15 points)
   ✓ copy-paste (+20 points)
   ✓ state-management (+16 points)
   ✓ 2 files affected (+10 points)
```

### Step 2: Store the Pattern
Post to `/api/bug-patterns`:
```json
{
  "title": "Page Reload Instead of State Update",
  "description": "Using window.reload() as shortcut",
  "root_cause": "Architectural misunderstanding",
  "file_path": "src/pages/approvals/requests.tsx",
  "bug_type": "state-sync",
  "severity": "high",
  "likelihood_score": 67,
  "grep_pattern": "window\\.location\\.reload\\(\\)|window\\.reload\\(\\)",
  "notes": "Seen in approval flows - likely repeated elsewhere"
}
```

### Step 3: Scan for Similar Bugs
In Admin Dashboard `/admin/bug-pattern-detector`:
1. Click "Scan for This Pattern"
2. See all occurrences found by grep
3. Verify each finding
4. Mark as fixed when resolved

### Step 4: Prevent Repetition
Based on likelihood score:
- **75+%**: Add ESLint rule + create test case + update code review checklist
- **50-74%**: Add linting rule + test case
- **25-49%**: Add test case + add to grep scanning
- **<25%**: Monitor with grep scanning

---

## LIKELIHOOD SCORING ALGORITHM

```
Base Score = Sum of Risk Factors

Risk Factors (points added):
- architectural-pattern: 15
- copy-paste: 20
- type-unsafety: 18
- missing-validation: 22
- async-race: 25
- state-management: 16
- hardcoded-values: 20
- api-mismatch: 14
- edge-case: 12
- performance: 8

Additional Factors:
+ (number of affected files × 5)
× severity multiplier (1.0-1.5)
```

**Result:** Final likelihood score (0-100) with label:
- 75+: VERY LIKELY - Prevent immediately
- 50-74: LIKELY - Add linting rule
- 25-49: POSSIBLE - Add test case
- <25: UNLIKELY - Monitor

---

## GREP PATTERN GENERATION

Each bug type has a standard pattern:

| Bug Type | Pattern | Search |
|----------|---------|--------|
| Hardcoded IDs | `id:\s*\d{4}\|invoice-\d{4}` | grep for mock IDs |
| Page Reload | `window\.reload\(\)` | grep for reload calls |
| Type Issues | `:\s*any[\s,;]` | grep for `any` types |
| Missing Checks | `UPDATE.*WHERE id=` | grep for unvalidated updates |
| State Mismatch | `useState<string\|number\|null>` | grep for loose unions |

---

## DATABASE SCHEMA

```sql
-- Bug pattern definition
bug_patterns:
  id, title, description, root_cause, file_path, 
  bug_type, severity, likelihood_score, 
  grep_pattern, files_affected[], notes, created_at

-- Found occurrences
bug_occurrences:
  id, bug_pattern_id, file_path, line_number, 
  code_snippet, detected_at, verified, severity

-- Analysis details
bug_analysis:
  id, bug_pattern_id, analysis_type, 
  analysis_result, confidence_score, created_at
```

---

## API ENDPOINTS

```
GET /api/bug-patterns
  Returns all patterns ranked by likelihood

GET /api/bug-patterns/{id}/scan
  Scans codebase for pattern occurrences
  Returns: array of bug_occurrences

POST /api/bug-patterns
  Create new bug pattern
  Body: { title, description, grep_pattern, ... }
```

---

## PRE-SEEDED PATTERNS

4 sample patterns loaded to demonstrate:

1. **Type Mismatch in useState** (45% likelihood)
   - Grep: `useState<string\s*\|\s*number\s*\|\s*null>`

2. **Page Reload Instead of State** (72% likelihood) ⚠️
   - Grep: `window\.location\.reload\(\)|window\.reload\(\)`
   - Very likely to repeat - add linting rule

3. **Missing FK Validation** (85% likelihood) 🔴 CRITICAL
   - Grep: `UPDATE\s+\w+\s+SET\s+status.*WHERE\s+id\s*=`
   - Every approval endpoint susceptible

4. **Hardcoded Mock IDs** (68% likelihood)
   - Grep: `invoice-1461|timecard-1461|id:\s*\d{4}`
   - Already found in approval page

---

## INTEGRATION POINTS

### With Change Log System
- Bug patterns created when issues found during change testing
- Stored in change_log.notes for context
- Linked to specific files/components

### With Metadata Database
- Metadata scanner auto-detects TODO/FIXME patterns
- Creates bug pattern entries for high-priority items
- Tracks files affected

### With CI/CD
Add to pre-commit hook:
```bash
#!/bin/bash
# Scan for known bug patterns before commit
for pattern in $(cat bug_patterns.txt); do
  grep -r "$pattern" src/ && echo "⚠️  Found pattern: $pattern"
done
```

---

## USAGE EXAMPLES

### Find All Page Reload Issues
```bash
grep -r "window\.location\.reload\(\)|window\.reload\(\)" src/ --include="*.tsx"
```

### View All High-Likelihood Patterns
Navigate to `/admin/bug-pattern-detector` → Risk Analysis tab

### Create New Pattern from CLI
```javascript
const pattern = {
  title: "Your Bug Title",
  grep_pattern: "regex_pattern_here",
  likelihood_score: calculateScore(riskFactors),
  notes: "Why this repeats..."
};

// POST to /api/bug-patterns
```

### Generate Prevention Checklist
```bash
node scripts/bug-pattern-analyzer.cjs > bug_prevention_plan.txt
```

---

## KEY BENEFITS

✅ **Proactive Detection** - Find bugs before they happen
✅ **Ranked Priority** - Focus on high-repetition patterns first
✅ **Automated Search** - Grep patterns find all occurrences instantly
✅ **Prevention Strategies** - Built-in recommendations per pattern
✅ **Regression Prevention** - Archive patterns after fix to block recurrence
✅ **Team Learning** - Pattern database teaches developers what to avoid

---

## NEXT STEPS

1. Run analyzer when bugs are found
2. Store patterns in database
3. Use admin UI to scan for occurrences
4. Implement prevention based on likelihood score
5. Archive fixed patterns
6. Integrate grep scanning into CI/CD pipeline

---

## Example: Complete Workflow

```
1. QA finds bug: "Page reload after approval"
2. Run: node scripts/bug-pattern-analyzer.cjs
3. Output: 72% likelihood (LIKELY)
4. Admin: Add linting rule to detect window.reload()
5. Admin: Create test case to prevent regression
6. Admin: Navigate to /admin/bug-pattern-detector
7. Admin: Click "Scan for This Pattern"
8. Result: Found 3 other files with same issue
9. Fix all 4 occurrences
10. Archive pattern - bug now prevented in future commits
```

This system transforms ad-hoc bug fixing into systematic prevention.
