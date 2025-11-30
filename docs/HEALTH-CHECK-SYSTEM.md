# Velocity Health Check & Validation System
**Created:** November 18, 2025  
**Purpose:** Automated platform health monitoring and UI integrity validation

---

## 🎯 OVERVIEW

This system provides automated validation to detect critical issues (like sidebar disappearing) without requiring persistent monitoring processes. It uses metadata from health endpoints and file system checks to validate platform integrity between runs.

---

## 📊 AVAILABLE COMMANDS

### `npm run health`
**Script:** `scripts/health-check.cjs`  
**Purpose:** Quick health check of API and frontend responsiveness

```bash
npm run health
```

**Output:**
```
🏥 Running Velocity Health Checks...

✅ API Server: healthy
   Status Code: 200

✅ Frontend: healthy
   Status Code: 200

✅ All systems healthy
```

---

### `npm run validate`
**Script:** `scripts/validate-platform.cjs`  
**Purpose:** Comprehensive platform validation with JSON logging

```bash
npm run validate
```

**Checks:**
- API Server health (`/api/health`)
- Frontend serving (`/`)
- Database connection (`/api/ready`)

**Output:** `.platform-validation.json` with detailed results

---

### `npm run validate:ui`
**Script:** `scripts/validate-ui-integrity.cjs`  
**Purpose:** UI-specific integrity validation (detects sidebar/menu issues)

```bash
npm run validate:ui
```

**Checks:**
1. ✅ **API Health** - Database connectivity, uptime
2. ✅ **Frontend Serving** - HTML contains App/Sidebar components
3. ✅ **Menu Resources** - Verifies all expected menu items in App.tsx
4. ✅ **Sidebar Component** - Validates sidebar file exists with proper export

**Expected Menu Items (from App.tsx resources):**
- dashboard
- contractors
- employees
- purchaseorders
- timecards
- invoices
- statementofworks
- changeorders
- expenses
- assets
- ai

**Note:** Resource names must match exactly as defined in `App.tsx` (no hyphens, camelCase)

**Output Example:**
```
🔍 Velocity UI Integrity Validation
====================================

Checking API Health... ✅
Checking Frontend Serving... ❌
Checking Menu Resources... ⚠️  (3 missing)
Checking Sidebar Component... ✅

====================================
❌ CRITICAL: UI integrity failure detected

📝 Validation log: .platform-validation.json
```

---

## 🔌 HEALTH ENDPOINTS

### `GET /api/health`
**Purpose:** Comprehensive health status with database check

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T21:24:30.330Z",
  "services": {
    "api": {
      "status": "healthy",
      "uptime": 8.42
    },
    "database": {
      "status": "healthy",
      "connected": true
    }
  },
  "environment": {
    "mode": "demo",
    "nodeVersion": "v20.19.3"
  }
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "ok",
  "services": {
    "api": { "status": "healthy", "uptime": 10.5 },
    "database": {
      "status": "unhealthy",
      "connected": false,
      "error": "Connection refused"
    }
  }
}
```

---

### `GET /api/ready`
**Purpose:** Kubernetes-style readiness probe (simple database ping)

**Response (200 OK):**
```json
{ "ready": true }
```

**Response (503 Service Unavailable):**
```json
{
  "ready": false,
  "error": "Database connection failed"
}
```

---

## 📝 VALIDATION LOG FORMAT

**File:** `.platform-validation.json`

```json
{
  "timestamp": "2025-11-18T21:24:31.509Z",
  "checks": {
    "apiHealth": {
      "name": "API Health",
      "status": "healthy",
      "details": { /* full health response */ },
      "critical": true
    },
    "frontendServing": {
      "name": "Frontend Serving",
      "status": "unhealthy",
      "statusCode": 200,
      "hasSidebarComponent": false,
      "hasAppComponent": false,
      "critical": true
    },
    "menuResources": {
      "name": "Menu Resources",
      "status": "degraded",
      "expectedItems": 11,
      "missingItems": ["purchase-orders", "statement-of-works"],
      "critical": false
    },
    "sidebarComponent": {
      "name": "Sidebar Component",
      "status": "healthy",
      "fileExists": true,
      "hasExport": true,
      "critical": true
    }
  },
  "allHealthy": false,
  "criticalFailure": true,
  "summary": "Critical UI integrity failure"
}
```

---

## 🚨 STATUS LEVELS

| Status | Meaning | Action Required |
|--------|---------|----------------|
| **healthy** | All checks passed | None |
| **degraded** | Some non-critical issues | Investigate, not blocking |
| **unhealthy** | Critical component failing | **Immediate action required** |
| **error** | Check could not complete | Debug validation script |

---

## 🔍 TROUBLESHOOTING

### Sidebar Not Showing

**Run:**
```bash
npm run validate:ui
```

**Common Causes:**
1. **DefaultErrorComponent rendering** - Check browser console logs
2. **Missing menu resources** - Check App.tsx resources array
3. **Sidebar component deleted** - Check `src/components/refine-ui/layout/sidebar.tsx`
4. **Layout not wrapping routes** - Check App.tsx route structure

**Fix Steps:**
1. Run validation to identify specific issue
2. Check `.platform-validation.json` for detailed diagnostics
3. Review browser console logs (`/tmp/logs/browser_console_*.log`)
4. Verify routes are wrapped in `<Layout>` component

---

### Frontend Not Responding

**Run:**
```bash
npm run health
```

**Common Causes:**
1. Vite dev server not started
2. Port 5000 blocked
3. Build error preventing compilation

**Fix Steps:**
1. Check workflow status
2. Restart dev workflow: `restart_workflow('dev')`
3. Check Vite logs for compilation errors

---

### Database Connection Failed

**Run:**
```bash
curl http://localhost:3001/api/ready
```

**Common Causes:**
1. PostgreSQL not running
2. DATABASE_URL environment variable missing
3. Connection pool exhausted

**Fix Steps:**
1. Check `DATABASE_URL` secret exists
2. Verify database is accessible
3. Restart API server workflow

---

## 🛠️ INTEGRATION WITH WORKFLOWS

### Manual Validation
```bash
# After making code changes
npm run validate:ui

# Before committing
npm run validate
```

### Automated Validation (Future)
Add to workflow startup:
```json
{
  "name": "validate-on-start",
  "command": "npm run validate:ui && npm run dev"
}
```

---

## 📊 EXIT CODES

| Code | Meaning |
|------|---------|
| **0** | All checks passed |
| **1** | Critical failure detected |

Use in CI/CD:
```bash
npm run validate:ui && echo "Platform healthy" || echo "Platform unhealthy"
```

---

## 🔐 SECURITY CONSIDERATIONS

**Health Endpoint Data Exposure:**
- Node version: Low risk (publicly known)
- Uptime: Low risk (operational metric)
- Database status: Medium risk (indicates attack surface)

**Recommendations:**
- Keep health endpoints on internal network only in production
- Add authentication for `/api/health` in production
- Use `/api/ready` for external health checks (minimal info leakage)

---

## 📈 FUTURE ENHANCEMENTS

1. **Browser-Based Validation** - Use Playwright to actually render page and check DOM
2. **Performance Metrics** - Track API response times, database query latency
3. **Trend Analysis** - Store validation history, detect degradation over time
4. **Slack/Discord Alerts** - Notify on critical failures
5. **Auto-Recovery** - Automatically restart workflows on failure

---

## 🎓 BEST PRACTICES

### When to Run Validations

**Always:**
- After database schema changes
- After modifying App.tsx resources
- After updating sidebar/layout components
- Before CPO demo

**Optional:**
- After package updates
- After workflow restarts
- Daily during active development

### Reading Validation Logs

1. **Critical Failures First** - Address any `critical: true` failures immediately
2. **Check Details** - Expand `details` objects for root cause
3. **Compare Timestamps** - Ensure you're looking at latest validation
4. **Missing Items** - Review `missingItems` arrays for specific issues

---

**Last Updated:** November 18, 2025  
**Status:** ✅ Production-ready  
**Maintainer:** Velocity Platform Team
