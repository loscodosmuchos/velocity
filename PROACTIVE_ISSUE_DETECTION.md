# PROACTIVE ISSUE DETECTION STRATEGY

## ROOT CAUSE: Frontend Used Hardcoded Mock IDs (1461-1463) Instead of Real Data

### How to Detect Ahead of Time:
1. **Schema Introspection Query** - Get actual data range before rendering
2. **API Contract Validation** - Compare response shape vs expected schema
3. **End-to-End Data Flow Test** - Real IDs → UI render → Approve → Audit log verify
4. **Status Enum Audit** - Verify all displayed statuses exist in database

---

## COMPREHENSIVE AUDIT SCRIPT - Find ALL Unknown Issues

### Phase 1: ID Range Validation
```sql
-- Get actual ID ranges in each table
SELECT 'invoices' as table_name, MIN(id) as min_id, MAX(id) as max_id, COUNT(*) as total FROM invoices
UNION ALL SELECT 'timecards', MIN(id), MAX(id), COUNT(*) FROM timecards
UNION ALL SELECT 'purchase_orders', MIN(id), MAX(id), COUNT(*) FROM purchase_orders
UNION ALL SELECT 'change_orders', MIN(id), MAX(id), COUNT(*) FROM change_orders;
```

### Phase 2: Status Enum Validation
```sql
-- Check all unique statuses used
SELECT 'invoices' as table_name, DISTINCT status FROM invoices
UNION ALL SELECT 'timecards', DISTINCT status FROM timecards
UNION ALL SELECT 'purchase_orders', DISTINCT status FROM purchase_orders
UNION ALL SELECT 'change_orders', DISTINCT status FROM change_orders;
```

### Phase 3: Foreign Key Audit
```sql
-- Verify all FKs exist
SELECT COUNT(*) as broken_invoice_fks FROM invoices i 
WHERE NOT EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = i.po_id);

SELECT COUNT(*) as broken_timecard_fks FROM timecards t 
WHERE NOT EXISTS (SELECT 1 FROM purchase_orders p WHERE p.id = t.po_id);
```

### Phase 4: User/Role Audit
```sql
-- Verify users exist for all approval actors
SELECT COUNT(*) as users_in_system FROM users WHERE status = 'active';
SELECT COUNT(*) as missing_approvers FROM audit_log 
WHERE actor_id NOT IN (SELECT id FROM users);
```

### Phase 5: Type Mismatch Detection
```sql
-- Check for case sensitivity issues
SELECT DISTINCT status FROM invoices;
SELECT DISTINCT status FROM timecards;
-- Compare against hardcoded enum values in code
```

---

## Discovery Method Summary:
1. **Run SQL audits BEFORE loading UI**
2. **Check API response against TypeScript interfaces**
3. **Validate every resource ID exists in database**
4. **Test end-to-end: fetch → render → mutate → verify**

