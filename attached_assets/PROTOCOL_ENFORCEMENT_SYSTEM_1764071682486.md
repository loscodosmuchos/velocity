# Protocol Enforcement System

> **Purpose:** Million-dollar winning solution to ensure agents NEVER skip testing protocols.

## **Overview**

4-layer system that makes it IMPOSSIBLE to claim "ready" without evidence:

1. **Intention Beacon** - Always visible reminder (<15 tokens)
2. **Enforced Gating Script** - Automated blocker
3. **Evidence File + Audit Trail** - Traceability
4. **Pre-Message Checkpoint** - Intention reset

---

## **Layer 1: Intention Beacon**

**Location:** Always visible in system prompt/task context

**Format:**
```
✅ READY PROTOCOL: LSP • GUI • CONSOLE • NETWORK • E2E • ARCHITECT
```

**Token Cost:** 12 tokens  
**Effect:** Top-of-mind awareness at all times

---

## **Layer 2: Enforced Gating Script**

**File:** `scripts/ready_gate.cjs`

**Usage:**
```bash
npm run ready:gate
```

**What it does:**
- Checks for required evidence files
- Verifies screenshots exist
- Validates console logs captured
- Ensures test results present
- **REFUSES completion if missing**

**Output:**
- ✅ "Ready gate PASSED - all evidence present"
- ⛔ "Ready gate FAILED - missing: screenshots, tests"

---

## **Layer 3: Evidence File Schema**

**File:** `evidence/ready-[feature]-[date].yml`

**Example:**
```yaml
feature: user-management-crud
date: 2025-11-20T05:15:00Z
agent: claude-4.5-sonnet
status: ready

# Required Evidence
screenshots:
  - evidence/screenshots/user-create-form-loaded.png
  - evidence/screenshots/user-create-success-toast.png
  - evidence/screenshots/user-list-updated.png

console_logs:
  - evidence/logs/console-zero-errors.log
  - evidence/logs/network-api-success.log

tests:
  - evidence/tests/user-crud-passing.log

workflow_status:
  - api-server: RUNNING
  - dev: RUNNING

architect_review:
  status: approved
  timestamp: 2025-11-20T05:10:00Z
  file: evidence/architect-review-user-mgmt.md

checklist_items:
  - item: "LSP diagnostics clean"
    status: passed
    evidence: "No LSP errors found"
  - item: "GUI tested with screenshot"
    status: passed
    evidence: "3 screenshots captured"
  - item: "Console errors checked"
    status: passed
    evidence: "console-zero-errors.log"
  - item: "Network calls verified"
    status: passed
    evidence: "network-api-success.log"
  - item: "E2E flow tested"
    status: passed
    evidence: "Manual test completed"
  - item: "Architect review"
    status: passed
    evidence: "Review approved"

notes: |
  Implemented user CRUD with secure random passwords.
  Fixed demo mode to use mock auth.
  All tests passing.
```

**Audit Log:** `logs/protocol/audit-2025-11.md`

Appends entry:
```markdown
### 2025-11-20 05:15 - user-management-crud - READY ✅
- Agent: claude-4.5-sonnet
- Evidence: evidence/ready-user-management-crud-20251120.yml
- Gate Status: PASSED
- Architect Review: APPROVED
- Notes: Implemented CRUD with security fixes
```

---

## **Layer 4: Pre-Message Checkpoint**

**Command:** `npm run ready:prompt`

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  READY PROTOCOL VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before claiming "ready", verify ALL items:

□ LSP diagnostics clean (no errors)
□ GUI tested with screenshot tool
□ Browser console checked (zero errors)
□ Network tab verified (successful calls)
□ End-to-end user flow tested
□ Architect review completed
□ Evidence file created
□ Audit log updated

Evidence required: evidence/ready-[feature]-[date].yml

Run: npm run ready:gate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**When to run:** Before saying "ready" in any message to user

---

## **Workflow Integration**

### **Step 1: Implement Feature**
```bash
# Normal development work
# Write code, fix bugs, etc.
```

### **Step 2: Collect Evidence**
```bash
# Screenshot GUI
npm run screenshot:capture

# Check console logs
npm run logs:check

# Run tests
npm test
```

### **Step 3: Create Evidence File**
```bash
# Manual or automated
touch evidence/ready-[feature]-[date].yml
# Fill in template
```

### **Step 4: Run Ready Gate**
```bash
npm run ready:gate
# ✅ PASSED - proceed
# ⛔ FAILED - fix missing evidence
```

### **Step 5: Review Checkpoint**
```bash
npm run ready:prompt
# Read checklist
# Verify all items checked
```

### **Step 6: Claim Ready**
Only after gate passes + checklist verified.

**Message format:**
```
✅ READY - Evidence verified

Feature: [name]
Evidence: evidence/ready-[feature]-[date].yml
Gate Status: PASSED
Architect Review: APPROVED

[Brief description]
```

---

## **Enforcement Rules**

### **Zero Tolerance**
- Claiming "ready" without running gate = **Protocol Violation**
- Missing evidence = **Gate blocks completion**
- Skipping architect review = **Automatic rejection**

### **Consequences**
1. First violation: Document in audit log
2. Second violation: Mandatory peer review
3. Third violation: Feature rollback

### **Audit Trail**
Every "ready" claim logged permanently:
- `logs/protocol/audit-[YYYY-MM].md`
- Pattern analysis monthly
- Continuous improvement

---

## **Benefits**

✅ **Impossible to forget** - Intention beacon always visible  
✅ **Automated enforcement** - Gate script blocks completion  
✅ **Objective verification** - Evidence files are proof  
✅ **Traceable** - Audit trail for accountability  
✅ **Token efficient** - Beacon costs <15 tokens  
✅ **No willpower required** - System prevents shortcuts  

---

## **Future Enhancements**

- **CI Integration** - GitHub Actions runs ready:gate
- **Slack Notifications** - Alert on gate failures
- **Dashboard** - Visual protocol compliance metrics
- **AI Analysis** - Pattern detection in violations
