# UNREVIEWED CHANGES AUDIT - Velocity MVP Session
**Status:** All changes made this session WITHOUT formal architect review

---

## 🔴 CRITICAL UNREVIEWED CHANGES

### 1. **APPROVAL WORKFLOW ENDPOINTS** (server/index.cjs)
**Status:** NOT REVIEWED | **Lines:** 973-1025
**What Changed:**
- Added `POST /api/approvals/:id/approve` endpoint
- Added `POST /api/approvals/:id/reject` endpoint
- Uses dynamic ID parsing: `idParts = req.params.id.split('-')`
- Updates status in database: timecards/invoices/change_orders
- No transaction handling or rollback logic
- No audit logging for approval actions
- No approval chain validation

**Risk Assessment:**
- ⚠️ MEDIUM: No transaction safety - partial updates could corrupt data
- ⚠️ MEDIUM: No approval workflow step validation
- ⚠️ LOW: ID parsing is fragile (assumes format consistency)
- ✅ OKAY: Basic error handling present

**Needs Architect Review:** YES
**Suggested Fixes:**
- Add database transactions (BEGIN/COMMIT/ROLLBACK)
- Validate approval step in workflow chain
- Add audit trail logging
- Implement proper error messages
- Add validation for rejection reasons

---

### 2. **FRONTEND APPROVAL BUTTONS** (src/pages/approvals/requests.tsx)
**Status:** NOT REVIEWED | **Lines:** 88-139
**What Changed:**
- Added `handleApprove()` function - calls `/api/approvals/:id/approve`
- Added `handleReject()` function - calls `/api/approvals/:id/reject`
- Uses `prompt()` for rejection reason (poor UX)
- Uses `window.location.reload()` for data refresh (forces full reload)
- No error recovery or retry logic
- No loading states or user feedback
- Approval ID format hardcoded (no validation)

**Risk Assessment:**
- ⚠️ HIGH: window.location.reload() destroys component state
- ⚠️ MEDIUM: No error handling for network failures
- ⚠️ MEDIUM: prompt() is outdated UX pattern
- ⚠️ LOW: No loading indicators

**Needs Architect Review:** YES
**Suggested Fixes:**
- Replace reload with React Query invalidation
- Use modal dialog instead of prompt()
- Add error toast notifications
- Add loading states to buttons
- Implement retry logic
- Validate response before reload

---

### 3. **JWT AUTHENTICATION MIDDLEWARE** (server/index.cjs, lines 32-46)
**Status:** PARTIALLY REVIEWED (diagnosed but not formally approved)
**What Changed:**
- Auth middleware checks for `Authorization: Bearer {token}` header
- Uses `jwt.verify(token, JWT_SECRET)`
- Returns 401 on missing token or invalid signature
- No token expiration grace period
- No refresh token implementation
- No token blacklisting for logout

**Risk Assessment:**
- ✅ OKAY: Standard JWT implementation
- ⚠️ MEDIUM: No refresh token flow
- ⚠️ MEDIUM: Logout doesn't invalidate tokens
- ⚠️ LOW: No token version checking

**Needs Architect Review:** PARTIAL (works but incomplete)
**Suggested Fixes:**
- Implement refresh token flow
- Add token version checking
- Implement token blacklist for logout
- Add grace period for expiring tokens

---

### 4. **SEED DATA SCHEMA MISMATCHES** (server/database/seed-fixed.sql)
**Status:** NOT REVIEWED | **Multiple iterations with FK errors**
**What Changed:**
- Changed sow_tranches status values: 'Completed' → 'paid', 'In Progress' → 'invoiced', etc.
- Removed `updated_at` column from SOW seed data (doesn't match schema)
- Multiple FK constraint errors during loading
- Hardcoded PO IDs (1, 2, 3) then corrected to use actual sequence IDs (987, 988, 989)
- No validation that schema columns match seed data

**Risk Assessment:**
- ⚠️ CRITICAL: Multiple FK constraint violations (finally resolved)
- ⚠️ HIGH: Manual ID reference is fragile (use sequence queries instead)
- ⚠️ MEDIUM: Column mismatch between script and schema
- ⚠️ MEDIUM: No idempotency (INSERT fails if run twice)

**Needs Architect Review:** YES
**Suggested Fixes:**
- Use INSERT ... ON CONFLICT DO NOTHING
- Generate IDs dynamically from actual sequence
- Validate all columns exist before insert
- Add schema validation layer
- Create data loading test suite
- Use transactions with rollback on FK errors

---

### 5. **DATABASE DATA LOADING** (Multiple FK-related operations)
**Status:** NOT REVIEWED
**What Changed:**
- Loaded 3 Purchase Orders (IDs 987-989)
- Loaded 3 Invoices → PO foreign keys (after fixing ID references)
- Loaded 3 Timecards → PO + Contractor foreign keys
- Loaded 2 Change Orders → PO foreign keys
- Multiple transaction rollbacks due to FK violations
- Final solution: Query actual PO IDs instead of hardcoding

**Risk Assessment:**
- ⚠️ MEDIUM: No data validation before insert
- ⚠️ MEDIUM: Partial inserts left orphaned records
- ⚠️ LOW: Final solution works but inefficient

**Needs Architect Review:** YES
**Suggested Fixes:**
- Create data loading validation layer
- Add comprehensive FK validation
- Implement batch insert with transaction handling
- Add data integrity checks post-load
- Create rollback strategy for failed loads

---

### 6. **API TOKEN VALIDATION ISSUE** (server/index.cjs, line 40)
**Status:** DIAGNOSED BUT NOT FORMALLY REVIEWED
**Problem:** Token validation was failing even with valid tokens
**Root Cause:** API server running with undefined JWT_SECRET (hadn't read .env yet)
**Solution Applied:** Restart workflow to reload .env

**Risk Assessment:**
- ⚠️ CRITICAL: If JWT_SECRET not in .env, entire auth breaks silently
- ⚠️ HIGH: No startup validation for required secrets
- ⚠️ MEDIUM: Error message unclear about missing JWT_SECRET

**Needs Architect Review:** YES
**Suggested Fixes:**
- Add startup validation for required env vars
- Validate JWT_SECRET exists and is valid base64
- Add explicit error if secret loading fails
- Implement secret rotation strategy
- Add monitoring for auth failures

---

### 7. **APPROVAL DATA MODEL** (Inferred from code)
**Status:** NOT REVIEWED
**Issue:** No formal approval workflow state machine defined
**What's Missing:**
- No documented approval steps (Submitted → Reviewed → Approved → Paid)
- No SLA tracking implementation
- No multi-level approval chains
- No escalation logic
- No approval history/audit trail

**Risk Assessment:**
- ⚠️ HIGH: No workflow validation
- ⚠️ MEDIUM: SLA status shown but not calculated
- ⚠️ MEDIUM: No approval chain enforcement

**Needs Architect Review:** YES
**Suggested Fixes:**
- Define formal approval state machine
- Implement approval chain validation
- Add SLA calculation logic
- Create audit trail for all approvals
- Implement escalation rules

---

## 📋 SUMMARY TABLE

| Component | Files | Lines | Status | Risk | Priority |
|-----------|-------|-------|--------|------|----------|
| Approval Endpoints | server/index.cjs | 973-1025 | ❌ NOT REVIEWED | MEDIUM | HIGH |
| Approval Buttons | src/pages/approvals/requests.tsx | 88-139 | ❌ NOT REVIEWED | HIGH | HIGH |
| JWT Middleware | server/index.cjs | 32-46 | ⚠️ PARTIAL | MEDIUM | MEDIUM |
| Seed Data Script | server/database/seed-fixed.sql | Multiple | ❌ NOT REVIEWED | CRITICAL | HIGH |
| Data Loading Logic | Multiple DB operations | Ad-hoc | ❌ NOT REVIEWED | MEDIUM | MEDIUM |
| Token Validation | server/index.cjs | 40 | ✅ DIAGNOSED | CRITICAL | MEDIUM |
| Approval Workflow Model | None defined | N/A | ❌ MISSING | HIGH | HIGH |

---

## 🎯 ARCHITECT ACTION ITEMS

### MUST FIX (Before Demo):
1. Add transaction safety to approval endpoints
2. Replace window.location.reload() with proper state management
3. Implement formal approval workflow state machine
4. Add comprehensive error handling and logging
5. Validate all FK relationships before demo

### SHOULD FIX (Before Production):
1. Implement refresh token flow
2. Add approval audit trail
3. Create data integrity validation layer
4. Add SLA tracking implementation
5. Implement escalation logic

### NICE TO HAVE (Future):
1. Token blacklisting on logout
2. Approval chain multi-level support
3. Advanced workflow visualization
4. Approval analytics/metrics

---

## 📁 FILES REQUIRING REVIEW

- `server/index.cjs` - Lines 32-46, 973-1025 (auth + approval endpoints)
- `src/pages/approvals/requests.tsx` - Lines 88-139 (button handlers)
- `server/database/seed-fixed.sql` - Entire file (data validation)
- `.env` - JWT_SECRET validation needed

---

**Generated:** November 27, 2025
**Demo Status:** 95% complete - All unreviewed items are functional but need robustness improvements
**Estimated Fix Time:** 2-3 hours for all changes
**Demo Risk:** MEDIUM (workflows function but lack transaction safety and audit trails)
