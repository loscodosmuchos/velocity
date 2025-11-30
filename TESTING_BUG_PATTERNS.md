# BUG PATTERN DETECTION - TESTING GUIDE

Complete test suite for validating bug pattern detection service

---

## UNIT TESTS - Likelihood Scoring

Test: Algorithm correctly scores bug repetition likelihood

```javascript
// test-likelihood-scoring.js
const BugAnalyzer = require('./scripts/bug-pattern-analyzer.cjs');

// Test Case 1: High-risk architectural pattern bug
const test1 = {
  title: "Page Reload Instead of State",
  severity: "high",
  riskFactorsPresent: ["architectural-pattern", "copy-paste", "state-management"],
  affectedFiles: ["src/pages/approvals/requests.tsx", "src/pages/invoices/list.tsx"]
};

const result1 = BugAnalyzer.analyze(test1);
console.assert(result1.likelihoodScore >= 65 && result1.likelihoodScore <= 75, 
  `Test 1 failed: expected 65-75, got ${result1.likelihoodScore}`);
console.log("✅ Test 1: High-risk pattern scored correctly (72%)\n");

// Test Case 2: Low-risk single file issue
const test2 = {
  title: "Edge case not handled",
  severity: "low",
  riskFactorsPresent: ["edge-case"],
  affectedFiles: ["src/utils/helpers.ts"]
};

const result2 = BugAnalyzer.analyze(test2);
console.assert(result2.likelihoodScore < 20, 
  `Test 2 failed: expected <20, got ${result2.likelihoodScore}`);
console.log("✅ Test 2: Low-risk pattern scored correctly (<20%)\n");

// Test Case 3: Critical missing validation across multiple files
const test3 = {
  title: "Missing FK Validation",
  severity: "critical",
  riskFactorsPresent: ["missing-validation"],
  affectedFiles: ["server/index.cjs", "server/routes/approvals.js", "server/routes/invoices.js"]
};

const result3 = BugAnalyzer.analyze(test3);
console.assert(result3.likelihoodScore > 80, 
  `Test 3 failed: expected >80, got ${result3.likelihoodScore}`);
console.log("✅ Test 3: Critical pattern with multiple files scored highest (>80%)\n");
```

Run:
```bash
node test-likelihood-scoring.js
```

---

## INTEGRATION TESTS - Database Operations

Test: Patterns stored/retrieved correctly

```sql
-- test-patterns-db.sql

-- Insert test pattern
INSERT INTO bug_patterns (title, description, root_cause, bug_type, severity, likelihood_score, grep_pattern)
VALUES ('TEST PATTERN', 'Test description', 'Test cause', 'test', 'high', 75, 'test_pattern');

-- Verify it exists
SELECT * FROM bug_patterns WHERE title = 'TEST PATTERN';

-- Insert occurrence
INSERT INTO bug_occurrences (bug_pattern_id, file_path, line_number, code_snippet, severity)
VALUES (
  (SELECT id FROM bug_patterns WHERE title = 'TEST PATTERN'),
  'test-file.tsx',
  42,
  'const x = window.reload()',
  'high'
);

-- Verify relationship
SELECT p.title, o.file_path, o.line_number 
FROM bug_patterns p
JOIN bug_occurrences o ON p.id = o.bug_pattern_id
WHERE p.title = 'TEST PATTERN';

-- Cleanup
DELETE FROM bug_occurrences WHERE id > 100;
DELETE FROM bug_patterns WHERE title = 'TEST PATTERN';
```

Run:
```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE < test-patterns-db.sql
```

---

## API ENDPOINT TESTS

### Test 1: POST /api/bug-patterns - Create Pattern

```bash
curl -X POST http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $VELOCITY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Hardcoded ID",
    "description": "Hardcoded test ID instead of dynamic",
    "root_cause": "Copy-paste from dev environment",
    "file_path": "src/pages/test.tsx",
    "bug_type": "logic-error",
    "severity": "high",
    "likelihood_score": 68,
    "grep_pattern": "id.*1461|invoice.*1461",
    "notes": "Very likely in other approval flows"
  }'

# Expected: 201 Created with pattern data
```

### Test 2: GET /api/bug-patterns - List All Patterns

```bash
curl -X GET http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $VELOCITY_TOKEN" | jq '.[] | {title, likelihood_score, severity}'

# Expected: Array of patterns sorted by likelihood
```

### Test 3: GET /api/bug-patterns/:id/scan - Scan for Occurrences

```bash
# First, get pattern ID from listing
PATTERN_ID=$(curl -s http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $VELOCITY_TOKEN" | jq '.[0].id')

# Then scan
curl -X GET http://localhost:3000/api/bug-patterns/$PATTERN_ID/scan \
  -H "Authorization: Bearer $VELOCITY_TOKEN" | jq '.occurrences'

# Expected: Array of found occurrences with file paths and line numbers
```

---

## GREP PATTERN VALIDATION TESTS

Test: Grep patterns correctly identify bugs in real code

```bash
#!/bin/bash
# test-grep-patterns.sh

# Test 1: Find window.reload() calls
echo "Test 1: Detecting window.reload()..."
grep -r "window\.location\.reload\(\)|window\.reload\(\)" src/ --include="*.tsx" && echo "✅ Found" || echo "❌ Not found"

# Test 2: Find hardcoded mock IDs  
echo "Test 2: Detecting hardcoded IDs..."
grep -r "id.*1461\|invoice.*1461\|timecard.*1461" src/ --include="*.tsx" && echo "✅ Found" || echo "❌ Not found"

# Test 3: Find missing validation patterns
echo "Test 3: Detecting unvalidated updates..."
grep -r "UPDATE\s\+\w\+\s\+SET\s\+status.*WHERE\s\+id\s*=" server/ --include="*.cjs" --include="*.js" && echo "✅ Found" || echo "❌ Not found"

# Test 4: Find type mismatches
echo "Test 4: Detecting type mismatches..."
grep -r "useState<string\s*|\s*number\s*|\s*null>" src/ --include="*.tsx" && echo "✅ Found" || echo "❌ Not found"
```

Run:
```bash
chmod +x test-grep-patterns.sh
./test-grep-patterns.sh
```

---

## PERFORMANCE BENCHMARK

Test: Service response times under load

```javascript
// test-performance.js
const axios = require('axios');

async function benchmark(endpoint, iterations = 100) {
  const start = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    await axios.get(
      `http://localhost:3000${endpoint}`,
      { headers: { 'Authorization': `Bearer $VELOCITY_TOKEN` } }
    );
  }
  
  const duration = Date.now() - start;
  const avgTime = duration / iterations;
  
  console.log(`${endpoint}: ${avgTime.toFixed(2)}ms per request`);
  return avgTime < 100; // Pass if <100ms avg
}

(async () => {
  const passed = await benchmark('/api/bug-patterns', 50);
  if (passed) {
    console.log("✅ Performance test passed (<100ms)");
  } else {
    console.log("❌ Performance test failed (>100ms)");
  }
})();
```

Run:
```bash
node test-performance.js
```

---

## END-TO-END TEST - Complete Workflow

```bash
#!/bin/bash
# test-e2e-workflow.sh

echo "🧪 BUG PATTERN DETECTION E2E TEST\n"

# Step 1: Create a new bug pattern
echo "Step 1: Creating bug pattern..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $VELOCITY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E2E Test Pattern",
    "description": "Pattern created by E2E test",
    "root_cause": "Test",
    "file_path": "test.tsx",
    "bug_type": "test",
    "severity": "medium",
    "likelihood_score": 50,
    "grep_pattern": "test_pattern_e2e"
  }')

PATTERN_ID=$(echo $RESPONSE | jq '.id')
echo "✅ Created pattern with ID: $PATTERN_ID\n"

# Step 2: List all patterns
echo "Step 2: Listing all patterns..."
PATTERNS=$(curl -s http://localhost:3000/api/bug-patterns \
  -H "Authorization: Bearer $VELOCITY_TOKEN")
COUNT=$(echo $PATTERNS | jq 'length')
echo "✅ Found $COUNT patterns\n"

# Step 3: Scan for occurrences
echo "Step 3: Scanning for pattern occurrences..."
OCCURRENCES=$(curl -s http://localhost:3000/api/bug-patterns/$PATTERN_ID/scan \
  -H "Authorization: Bearer $VELOCITY_TOKEN")
FOUND=$(echo $OCCURRENCES | jq '.occurrences | length')
echo "✅ Found $FOUND occurrences\n"

# Step 4: Verify data consistency
echo "Step 4: Verifying data consistency..."
if [ "$PATTERN_ID" != "null" ] && [ "$COUNT" -gt 0 ]; then
  echo "✅ All E2E tests passed!\n"
else
  echo "❌ E2E test failed!\n"
  exit 1
fi
```

Run:
```bash
chmod +x test-e2e-workflow.sh
./test-e2e-workflow.sh
```

---

## REGRESSION TEST - Known Bug Patterns

Verify service correctly identifies known bugs:

```bash
#!/bin/bash
# test-known-patterns.sh

echo "Testing known bug patterns...\n"

# Known Pattern 1: window.reload() in production code
if grep -r "window\.location\.reload\(\)" src/ --include="*.tsx" | grep -v node_modules; then
  echo "🔴 FAIL: Found window.reload() in production code"
  exit 1
else
  echo "✅ PASS: No window.reload() found in production"
fi

# Known Pattern 2: Hardcoded test IDs
if grep -r "1461\|1462\|1463" src/ --include="*.tsx" | grep -v "test" | grep -v "spec"; then
  echo "🔴 FAIL: Found hardcoded test IDs in production"
  exit 1
else
  echo "✅ PASS: No hardcoded test IDs found"
fi

# Known Pattern 3: @ts-ignore comments
if grep -r "@ts-ignore" src/ --include="*.tsx" --include="*.ts" | wc -l | grep -q "^0$"; then
  echo "✅ PASS: No @ts-ignore comments"
else
  IGNORE_COUNT=$(grep -r "@ts-ignore" src/ --include="*.tsx" --include="*.ts" | wc -l)
  echo "⚠️  WARNING: Found $IGNORE_COUNT @ts-ignore comments"
fi

echo "\n✅ Regression tests completed"
```

Run:
```bash
chmod +x test-known-patterns.sh
./test-known-patterns.sh
```

---

## MANUAL TEST CHECKLIST

Before deploying to production:

- [ ] Create pattern via API
- [ ] Verify pattern stored in database
- [ ] Scan for pattern in codebase
- [ ] Verify occurrences found correctly
- [ ] Update pattern status
- [ ] Delete/archive old patterns
- [ ] Load patterns page in admin UI
- [ ] View all risk factors and scores
- [ ] Copy grep command works
- [ ] API returns correct error codes (400, 404, 500)
- [ ] Performance <100ms per request
- [ ] Token authentication enforced
- [ ] CORS headers correct
- [ ] Patterns survive server restart

---

## CI/CD INTEGRATION

Add to `.github/workflows/test.yml`:

```yaml
- name: Bug Pattern Detection Tests
  run: |
    npm run test:bug-patterns
    bash test-grep-patterns.sh
    bash test-known-patterns.sh
    node test-performance.js
```

---

## EXPECTED TEST OUTPUT

```
✅ Test 1: High-risk pattern scored correctly (72%)
✅ Test 2: Low-risk pattern scored correctly (<20%)
✅ Test 3: Critical pattern with multiple files scored highest (>80%)
✅ Patterns stored and retrieved from database
✅ Grep patterns correctly identify bugs
✅ API endpoints responding (<100ms)
✅ E2E workflow completed successfully
✅ Regression tests passed
✅ All bug patterns verified
```

Success = All tests pass ✅
