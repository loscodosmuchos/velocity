# Release Readiness Checklist

> **Purpose:** GUARANTEE code quality before claiming "ready". No exceptions.  
> **Enforcement:** Automated 4-Layer Protocol System (see `docs/PROTOCOL_ENFORCEMENT_SYSTEM.md`)

## 🚨 NEW: Automated Enforcement (November 2025)

The manual checklist below has been **replaced** with an automated protocol system.

### Quick Start

**Before claiming "ready":**

```bash
# Step 1: Review checklist
npm run ready:prompt

# Step 2: Create evidence file
cp evidence/TEMPLATE.yml evidence/ready-[feature]-$(date +%Y%m%d).yml
# Fill in all sections

# Step 3: Run gate (blocks if evidence missing)
npm run ready:gate

# Step 4: Only if gate passes → claim "ready"
```

### Intention Beacon (Always Remember)

```
✅ READY PROTOCOL: LSP • GUI • CONSOLE • NETWORK • E2E • ARCHITECT
```

**Token cost:** 12 tokens (always keep top-of-mind)

---

## System Components

1. **Intention Beacon** (`docs/INTENTION_BEACON.md`) - 12-token reminder
2. **Gating Script** (`scripts/ready_gate.cjs`) - Automated blocker
3. **Evidence Schema** (`evidence/TEMPLATE.yml`) - Proof template
4. **Checkpoint Script** (`scripts/ready_prompt.cjs`) - Pre-message reminder

**Full docs:** `docs/PROTOCOL_ENFORCEMENT_SYSTEM.md`

---

## Original Manual Checklist (Reference Only)

> **Deprecated:** Use automated system above. This is kept for reference.

## **Pre-Implementation**

- [ ] User requirements clearly understood
- [ ] Architect consulted for complex features (plan mode)
- [ ] Approach validated with user if ambiguous

## **Implementation Phase**

- [ ] Code written following project conventions
- [ ] No LSP errors (run `get_latest_lsp_diagnostics`)
- [ ] Environment variables documented in `.env.example`
- [ ] Dependencies added to package.json/requirements.txt

## **Backend Testing** (if backend changes made)

- [ ] API endpoint tested with curl/Postman
  - Evidence: `curl` command output pasted below
- [ ] Database queries verified
  - Evidence: SQL query + result pasted below
- [ ] Server logs checked (no errors)
  - Evidence: Log file path + grep for errors
- [ ] Response format matches types.ts
  - Evidence: API response JSON

**Backend Evidence:**
```bash
# Paste curl commands and responses here
```

## **Frontend Testing** (if frontend changes made)

- [ ] Screenshot tool used - UI loads without errors
  - Evidence: Screenshot path(s)
- [ ] Browser console checked - zero errors
  - Evidence: Console log analysis
- [ ] Network tab verified - API calls succeed
  - Evidence: Network request/response status codes
- [ ] Workflows restarted and running
  - Evidence: Workflow status output

**Frontend Evidence:**
```
# Paste screenshot paths here
# Paste console log summary here
```

## **Integration Testing** (end-to-end flow)

- [ ] Happy path tested with screenshots at each step
  - Step 1: [Description] - Screenshot: [path]
  - Step 2: [Description] - Screenshot: [path]
  - Step 3: [Description] - Screenshot: [path]
- [ ] Edge cases tested:
  - [ ] Invalid input (validation errors)
  - [ ] Duplicate data (409 conflicts)
  - [ ] Missing required fields (400 bad request)
  - [ ] Unauthorized access (401/403)
- [ ] Error handling verified:
  - [ ] Toast messages appear
  - [ ] Form validation shows errors
  - [ ] Graceful failure (no crashes)

**Integration Evidence:**
```
# List all test scenarios executed
# Include screenshot paths for each
```

## **Automated Testing**

- [ ] Playwright test written for critical path
  - Test file: `tests/[feature].spec.ts`
- [ ] Test passes locally: `npm run test:e2e`
  - Evidence: Test output
- [ ] Test covers:
  - [ ] Login flow
  - [ ] Create operation
  - [ ] Read/list operation
  - [ ] Update operation (if applicable)
  - [ ] Delete operation (if applicable)

**Test Evidence:**
```bash
# Paste test run output here
```

## **Code Quality**

- [ ] No console.log() in production code (or justified)
- [ ] Error handling implemented (try/catch)
- [ ] Loading states shown to user
- [ ] Success/error toast messages
- [ ] TypeScript types defined (no `any`)
- [ ] Security best practices followed:
  - [ ] No secrets in code
  - [ ] Input validation
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] CSRF protection (if applicable)

## **Architect Review**

- [ ] Architect called with `include_git_diff: true`
- [ ] All critical issues addressed
- [ ] Minor issues documented as follow-up tasks
- [ ] Architect approval received

**Architect Review Notes:**
```
# Paste architect feedback here
# Document what was fixed
# Note any deferred items
```

## **Documentation**

- [ ] README updated (if user-facing features)
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Known limitations noted
- [ ] Migration guide (if breaking changes)

## **Deployment Readiness**

- [ ] Demo mode works (if applicable)
- [ ] Production mode works (if applicable)
- [ ] Environment variables set correctly
- [ ] Database migrations tested
- [ ] Rollback plan documented

## **Final Verification**

- [ ] All checklist items completed
- [ ] Evidence provided for each test
- [ ] No outstanding errors/warnings
- [ ] User flow tested end-to-end
- [ ] Confident in quality

---

## **Sign-Off**

**Agent:** [Your name]  
**Date:** [ISO date]  
**Feature:** [Feature name]  
**Confidence Level:** [ ] 100% - Guaranteed working  

**Statement:** I certify that all checklist items have been completed, all tests pass, and I have personally verified this feature works through the GUI. Evidence is provided above.

---

## **Enforcement**

This checklist MUST be completed before claiming "ready". Violations result in:
1. ⚠️ First violation: Document lesson learned
2. ⛔ Second violation: Mandatory pair review
3. 🚫 Third violation: Feature rollback

**Zero tolerance for untested code reaching users.**
