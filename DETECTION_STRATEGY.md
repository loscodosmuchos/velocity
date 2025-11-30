# PROACTIVE ISSUE DETECTION STRATEGY
**Purpose:** How to find unknown issues BEFORE they break the demo

---

## THE DISCOVERY METHOD

### Root Cause of Invoice ID Bug
The screenshot showed "invoice-1461, invoice-1462, invoice-1463" but:
- **Actual invoices**: 269, 270, 271
- **Actual timecards**: 1461, 1462, 1463  
- **Frontend was mixing them up** - using hardcoded mock IDs

### How to Detect This Pattern Ahead of Time

**Step 1: Run ID Range Query**
```sql
SELECT table_name, MIN(id), MAX(id), COUNT(*) 
FROM (data tables)
```
This shows what IDs actually exist. Compare against UI.

**Step 2: Verify FK Integrity**
```sql
SELECT COUNT(*) FROM invoices i 
WHERE NOT EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = i.po_id)
```
If count > 0, you have broken foreign keys.

**Step 3: Check Status Enums**
```sql
SELECT DISTINCT status FROM invoices;
-- Compare against hardcoded enum values in TypeScript
```
Case sensitivity matters: "Pending" vs "pending"

**Step 4: End-to-End Integration Test**
1. Fetch real IDs from API
2. Display them in UI
3. Click approve
4. Verify audit_log table has entry
5. Check updated status matches

---

## HOW TO FIND OTHER UNKNOWN ISSUES

Apply the same audit pattern to find:

### Pattern 1: Type Mismatches
```sql
-- Find all unique values in each status column
SELECT DISTINCT status FROM invoices;
SELECT DISTINCT status FROM timecards;
SELECT DISTINCT status FROM change_orders;
-- Check if frontend code has all these values
```

### Pattern 2: Missing Resources
```sql
-- Any approval item referencing non-existent resource?
SELECT COUNT(*) FROM invoices WHERE po_id NOT IN (SELECT id FROM purchase_orders);
-- If count > 0, you have orphaned records
```

### Pattern 3: User/Permission Issues
```sql
-- All users referenced in audit logs exist?
SELECT DISTINCT actor_id FROM audit_log 
WHERE actor_id NOT IN (SELECT id FROM users);
-- If any results, you have missing users
```

### Pattern 4: Status Workflow Violations
```sql
-- Can statuses transition in the order shown?
-- Example: Can an invoice go Draft → GR Approved → Rejected?
-- Query the approval_history to verify legal transitions
SELECT old_status, new_status, COUNT(*) 
FROM audit_log 
GROUP BY old_status, new_status 
ORDER BY COUNT(*) DESC;
```

### Pattern 5: Approval SLA Violations
```sql
-- Are SLAs being exceeded?
SELECT al.id, al.created_at, NOW() - al.created_at as pending_time
FROM audit_log al
WHERE al.action = 'APPROVED'
ORDER BY pending_time DESC;
```

---

## AUTOMATION: Add to CI/CD Pipeline

Create `/scripts/pre-demo-audit.sh`:
```bash
#!/bin/bash
# Run before every demo to catch unknown issues

# 1. Check ID ranges match
# 2. Verify all FKs exist
# 3. Check status enums
# 4. Verify users exist
# 5. Test approval flow end-to-end
# 6. Check SLAs
```

---

## COMPREHENSIVE CHECKLIST

Before every deploy/demo, run:

✓ **ID Range Audit**: MIN/MAX IDs in each table
✓ **FK Integrity**: All foreign keys valid
✓ **Status Enums**: All status values exist in code
✓ **User Audit**: All actors exist
✓ **Approval Flow**: End-to-end test (fetch → approve → verify)
✓ **SLA Check**: All pending approvals within SLA
✓ **Permission Check**: Users can actually approve
✓ **Type Check**: TypeScript matches database schema

---

## RESULT: What We Found

| Issue | Detection Method | Status |
|-------|------------------|--------|
| Invoice IDs 1461-1463 don't exist | ID range query | ✓ FOUND |
| Timecards ARE 1461-1463 | ID range query | ✓ FOUND |
| Invoices ARE 269-271 | ID range query | ✓ FOUND |
| All FKs valid | FK integrity query | ✓ VERIFIED |
| Status enums consistent | Status distinct query | ✓ VERIFIED |
| Audit table empty | Audit count query | ✓ FOUND (ready to record) |

---

## KEY INSIGHT

**The invoice ID bug could have been caught by running this simple query:**
```sql
SELECT id, status FROM invoices ORDER BY id;
SELECT id, status FROM timecards ORDER BY id;
-- These show exactly what IDs to use in the approval page
```

**Instead, the frontend hardcoded mock IDs from development, breaking the demo flow.**

---

## FOR NEXT AGENT

Use `DETECTION_AUTOMATION_SCRIPT.sh` to audit any data changes:
```bash
bash DETECTION_AUTOMATION_SCRIPT.sh
```

This will catch ID mismatches, FK violations, status issues, and user problems **before they break the demo.**
