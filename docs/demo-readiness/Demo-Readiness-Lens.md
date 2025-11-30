# Demo Readiness Lens (DRL)

**Version:** 1.0  
**Created:** November 25, 2025  
**Purpose:** Systematic validation protocol ensuring demo presentations are flawless

---

## Core Philosophy

> "No login = not a real application"  
> "Exclamations, Not Explanations"  
> "Authenticity Pillar: Zero tolerance for mock data"

This document establishes the **First Chair Experience Lens** - the perspective of a stakeholder sitting down at their desk to evaluate Velocity for the first time.

---

## 1. Pre-Demo Gate Requirements

### 1.1 Authentication Gate (CRITICAL)
| Check | Status | Evidence Required |
|-------|--------|-------------------|
| Login page accessible at `/login` | ☐ | Screenshot |
| Demo credentials work | ☐ | Video/screenshot of successful login |
| Password field properly masked | ☐ | Screenshot |
| Error handling for invalid credentials | ☐ | Screenshot of error state |
| Redirect to dashboard after login | ☐ | Screenshot of dashboard |
| Logout functionality works | ☐ | Screenshot of logged-out state |
| Session persistence (refresh page) | ☐ | Test after page refresh |

### 1.2 Environment Configuration Gate
| Check | Status | Verification |
|-------|--------|--------------|
| `VITE_DEMO_MODE=false` | ☐ | `env | grep VITE_DEMO_MODE` |
| API server running | ☐ | Console shows "API Server running" |
| Database connected | ☐ | Console shows "Database connected" |
| JWT Secret configured | ☐ | Console shows "JWT Secret: Yes" |

### 1.3 Data Authenticity Gate
| Check | Status | Evidence |
|-------|--------|----------|
| Dashboard shows real database metrics | ☐ | Query verification |
| No "mock", "demo", "sample" text visible | ☐ | Visual scan |
| Calculations traceable to real formulas | ☐ | Hover/click shows formula |
| Charts reflect actual data | ☐ | Compare to database |

---

## 2. User Journey Validation Matrix

### Stage 1: Pre-Login (Seconds 0-10)
- [ ] User lands on login page (not dashboard)
- [ ] Branding/logo visible and professional
- [ ] Login form immediately accessible
- [ ] No loading spinners or errors
- [ ] Mobile-responsive layout

### Stage 2: Authentication (Seconds 10-30)
- [ ] Email field accepts input
- [ ] Password field masks characters
- [ ] "Sign In" button is prominent
- [ ] Invalid credentials show clear error
- [ ] Valid credentials redirect to dashboard

### Stage 3: First Dashboard View (Seconds 30-60)
- [ ] Dashboard loads within 2 seconds
- [ ] User name/avatar visible in header
- [ ] Role-appropriate menu items shown
- [ ] Key metrics displayed immediately
- [ ] No console errors visible

### Stage 4: Navigation Experience (Minutes 1-5)
- [ ] Sidebar navigation responsive
- [ ] All clicked links work
- [ ] Breadcrumbs accurate
- [ ] Back button behavior correct
- [ ] Search functionality works

### Stage 5: Feature Demonstration (Minutes 5-10)
- [ ] AI features respond correctly
- [ ] Forms submit successfully
- [ ] Data creates/updates properly
- [ ] Export functions work
- [ ] Voice features active

### Stage 6: Session End (Final)
- [ ] Logout button accessible
- [ ] Logout redirects to login
- [ ] Session properly cleared
- [ ] Re-login works immediately

---

## 3. Persona-Specific Validations

### CPO (Chief Procurement Officer)
**Priority View:** Executive Dashboard, ROI metrics, Budget alerts
- [ ] $1.3M-$1.4M ROI visible
- [ ] Budget health indicators work
- [ ] AI insights cards populated
- [ ] Variance alerts functional

### Finance Controller
**Priority View:** Invoices, Variance Detection, Budget Forecasting
- [ ] Invoice variance badges show
- [ ] Anomaly detection highlights
- [ ] Budget charts accurate
- [ ] Export to Excel works

### VMS Director
**Priority View:** Contractor Management, Compliance, Workflows
- [ ] Contractor list loads
- [ ] Compliance status accurate
- [ ] Workflow builder accessible
- [ ] Bulk actions work

### Field Supervisor
**Priority View:** Timecards, Assignments, Quick Actions
- [ ] Timecard submission works
- [ ] Assignment visibility correct
- [ ] Mobile-friendly interface
- [ ] Approval flow functions

---

## 4. Pre-Demo Checklist (24 Hours Before)

### Technical Verification
```bash
# 1. Environment check
env | grep VITE_DEMO_MODE  # Must be "false" or unset

# 2. API health
curl http://localhost:3001/api/health

# 3. Database users exist
psql -c "SELECT email, role FROM users LIMIT 5;"

# 4. Frontend builds
pnpm build
```

### Demo Credentials
| Email | Password | Role | Test Status |
|-------|----------|------|-------------|
| admin@velocity.io | velocity2025! | Admin | ☐ |
| manager@velocity.io | velocity2025! | Manager | ☐ |
| demo@velocity.com | demodemo | Admin | ☐ |

### Critical Path Walkthrough
1. ☐ Login as CPO persona
2. ☐ View Executive Dashboard
3. ☐ Check AI Insights
4. ☐ Navigate to Invoices
5. ☐ Show Variance Detection
6. ☐ Open Contract Gap Analysis
7. ☐ Demo Vendor Extraction
8. ☐ Trigger Voice Callback
9. ☐ Export a report
10. ☐ Logout and re-login

---

## 5. Failure Protocol

### Blocking Issues (Demo Cannot Proceed)
- Login does not work
- Dashboard crashes
- No data displays
- API returns 500 errors

### Non-Blocking Issues (Note and Continue)
- Minor styling issues
- Non-critical feature incomplete
- Performance slower than ideal

### Escalation Path
1. Developer identifies issue
2. Document in `/docs/demo-readiness/Authenticity-Gate-Logs/`
3. Fix or document workaround
4. Re-run validation checklist
5. Sign-off required before demo

---

## 6. Configuration Guardrails

### Watched Configuration Values
These values must be verified before any demo:

```env
VITE_DEMO_MODE=false      # MUST be false for real auth
VITE_API_URL=/api         # Must point to real API
DATABASE_URL=<real_url>   # Must connect to real database
JWT_SECRET=<set>          # Must be configured
```

### Diff Watch Protocol
Before any demo, run:
```bash
git diff --name-only | grep -E '\.env|providers/index'
```
Any changes to auth-related files require re-validation.

---

## 7. Evidence Collection

For each demo, capture and store:
- `/docs/demo-readiness/Authenticity-Gate-Logs/YYYY-MM-DD-demo.md`
  - Screenshots of login flow
  - Console log export (no errors)
  - Database query results
  - Sign-off from demo lead

---

## RACI Matrix

| Activity | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Pre-demo checklist | Developer | Demo Lead | - | Stakeholder |
| Auth validation | Developer | Developer | - | Demo Lead |
| Data verification | Developer | Demo Lead | - | - |
| Persona journey test | Demo Lead | Demo Lead | Developer | - |
| Final sign-off | Demo Lead | Demo Lead | - | All |

---

**Remember:** The stakeholder's first impression is formed in the first 30 seconds. A login that doesn't work destroys all credibility instantly. This lens ensures that never happens.
