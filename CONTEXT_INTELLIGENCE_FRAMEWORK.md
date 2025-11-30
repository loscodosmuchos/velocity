# Context Intelligence Framework for Velocity Platform

## Overview

Every feature, page, workflow, and piece of content in Velocity Platform automatically answers **15 critical questions** across 5 dimensions to provide context-aware intelligence that anticipates user needs before they ask.

## The 15 Mandatory Questions

### **DIMENSION 1: AUDIENCE (4 Questions)**

1. **Who is the primary audience?** (CPO, PM, VMS Director, Finance, HR, IT, Operations, CISO, Legal, Field Supervisor)
2. **Who are secondary audiences?** (Stakeholders who also benefit)
3. **What expertise level is required?** (Beginner / Intermediate / Expert)
4. **Which departments are affected?** (Procurement, IT, Finance, HR, Legal, Operations)

### **DIMENSION 2: ACCESS CONTEXT (4 Questions)**

5. **Why would someone access this?** (Daily work, crisis response, planning/forecasting, compliance)
6. **What keywords would they search?** (Search terms they'd use to find this)
7. **How do they typically discover this?** (Dashboard widget, global search, notification link, direct navigation)
8. **What were they doing before accessing this?** (User journey - previous page/task)

### **DIMENSION 3: VALUE PROPOSITION (3 Questions)**

9. **What immediate value does this provide?** (Answer question, unblock work, prevent crisis)
10. **What downstream value exists?** (Future benefits: audit compliance, risk prevention, strategic decisions)
11. **Can we assign a dollar amount?** (Quantified ROI: time saved × hourly rate, cost avoided, revenue enabled)

### **DIMENSION 4: URGENCY PROFILE (3 Questions)**

12. **Is this time-sensitive?** (Real-time, daily, weekly, monthly, reference/evergreen)
13. **Are there hard deadlines?** (Contract renewal, audit, project deadline, regulatory filing)
14. **Who is blocked waiting for this?** (Stakeholders waiting on decisions/data/approvals)

### **DIMENSION 5: COMPLEXITY ASSESSMENT (1 Question)**

15. **How long to consume and apply?** (30 sec scan, 5 min read, 30 min study; instant apply vs hours/days/weeks)

---

## Applied Example: AI Contract Gap Analysis

### **AUDIENCE**
- **Primary:** Legal Counsel (Expert level - 5+ years contract law experience)
- **Secondary:** CPO (contract risk oversight), Procurement Team (vendor negotiation)
- **Departments:** Legal, Procurement, Finance (budget implications), Executive (liability exposure)

### **ACCESS CONTEXT**
- **Access Triggers:**
  - ⚡ **Crisis (60% likelihood):** Vendor sent contract with 48-hour signature deadline
  - 📅 **Planning (30%):** Quarterly contract review cycle
  - 🔍 **Compliance (10%):** Audit prep - verify all contracts have required clauses
  
- **Search Keywords:** "contract review", "contract risk", "missing clauses", "legal compliance", "indemnification", "liability"

- **Entry Points:**
  - Dashboard widget: "Contracts Awaiting Legal Review" (70%)
  - Global search: "analyze contract" (20%)
  - Notification link: "New vendor contract needs review" (10%)

- **Typical Journey:**
  - **Before:** Reviewing vendor proposal in email or Salesforce
  - **After:** Drafting amendment with recommended clauses, or approving contract, or escalating to General Counsel

### **VALUE PROPOSITION**

**Immediate Value:**
- ⏱️ **Time Saved:** 70 minutes → 2 minutes (97% reduction)
- 💰 **Dollar Value:** $87,500/year in attorney labor savings
  - Calculation: 68 min saved × 50 contracts/year × $125/hr attorney rate = $87,500
- 🎯 **Unblocks:** CPO waiting for legal review to sign vendor contract

**Downstream Value:**
- 🛡️ **Risk Prevention:** Identifies missing indemnification clauses that could cost $200K+ in litigation
- ✅ **Audit Compliance:** Zero legal findings vs 3-5 findings historically
- 🚀 **Strategic:** Frees 57 hours/year of attorney time for high-value strategic work (M&A, IP strategy)

**Total Annual Value:** $87,500 + $200,000 (avoided litigation) = **$287,500/year**

### **URGENCY PROFILE**

**Time Sensitivity:** ⚡ **CRITICAL - Real-time to 48 hours**
- Vendor contracts often have 2-3 day signature deadlines
- Missing deadline = lose preferred vendor or accept unfavorable auto-renewal

**Hard Deadlines:**
- 📅 **Contract Signature:** 48 hours (vendor deadline)
- 📅 **Quarterly Review Cycle:** 14 days before end of quarter
- 📅 **Audit Request:** 24-48 hours (auditor needs all contracts reviewed)

**Waiting Stakeholders:**
| Stakeholder | Waiting For | Urgency | Deadline | Impact if Delayed |
|------------|-------------|---------|----------|-------------------|
| **CPO** | Legal approval to sign vendor contract | CRITICAL | 2 days | Lose preferred vendor, 30% premium on emergency procurement |
| **PM** | Contract terms to start project staffing | HIGH | 5 days | Project delayed 2-3 weeks, cascading delays to dependent projects |
| **CFO** | Contract review for budget approval | MEDIUM | 7 days | Budget variance, unplanned spend |

**Degradation Cost:**
- Per Day: **$5,000** (opportunity cost of delayed vendor onboarding)
- Per Week: **$25,000** (project delays cascade, team idle time)
- Per Month: **$100,000+** (miss contract renewal window, auto-renew at unfavorable rates)

### **COMPLEXITY**

**Consumption Time:**
- 🔹 **Quick Scan (30 sec):** Understand purpose, see severity summary (7 critical, 12 high, 3 medium)
- 🔹 **Functional Read (5 min):** Review all critical/high findings, understand recommendations
- 🔹 **Comprehensive Study (30 min):** Read full analysis, draft amendment with legal language

**Implementation Time:**
- ✅ **Instant Apply:** Copy recommended clause language into contract amendment
- ⏱️ **Same Day:** Draft amendment, send to vendor for negotiation
- 📅 **2-3 Days:** Negotiate terms, finalize contract, execute

**Prerequisites:**
- Basic understanding of contract law terminology (indemnification, liability, force majeure)
- Authority to request contract amendments or escalate to General Counsel

---

## Applied Example: Budget Threshold Alerts (25%/50%/90%)

### **AUDIENCE**
- **Primary:** CFO / Finance Controller (Expert level - CPA, 10+ years finance)
- **Secondary:** PM (budget accountability), CPO (vendor spend oversight), Executive (fiduciary oversight)

### **ACCESS CONTEXT**
- **Access Triggers:**
  - ⚡ **Crisis (70%):** Alert notification "PO #12345 hit 90% budget - URGENT"
  - 📊 **Daily Operations (20%):** Morning budget review routine
  - 📅 **Planning (10%):** Monthly budget variance analysis

### **VALUE PROPOSITION**

**Immediate Value:**
- 🚨 **Early Warning:** Budget overruns detected **in real-time** vs 30 days later
- 💰 **Cost Avoidance:** $117K-$140K/year (prevents vendor cost escalations caught early)
- ⏱️ **Time Saved:** No manual budget tracking - alerts fire automatically

**Total Annual Value:** $117,000 - $140,000 in cost avoidance

### **URGENCY PROFILE**

**Time Sensitivity:** ⚡ **CRITICAL - Real-time**
- Budget variance must be caught **before spending completes**, not after

**Waiting Stakeholders:**
| Alert Threshold | Stakeholder | Action Required | Urgency | Deadline |
|----------------|-------------|-----------------|---------|----------|
| **25%** | PM | Awareness, monitor spending rate | INFO | 30 days |
| **50%** | PM + CFO | Review spending, adjust if needed | WARNING | 7 days |
| **90%** | CFO + Executive | **STOP new expenses**, request budget increase | CRITICAL | 24 hours |

**Degradation Cost:**
- **90% threshold missed:** $10,000/day in unauthorized overspend
- **Budget overrun undetected:** $50,000-$100,000 cascading impact to other projects

---

## Applied Example: Hybrid Search (Semantic + Keyword)

### **AUDIENCE**
- **Primary:** All users (CPO, PM, VMS, Finance, Operations - everyone searches)
- **Secondary:** Executive (answers in 10 sec vs 10 hours)

### **ACCESS CONTEXT**
- **Access Triggers:**
  - 🔍 **Daily Operations (60%):** "Find contractor with Python skills in San Francisco"
  - ⚡ **Crisis (30%):** "Which vendors are behind on deliverables?"
  - 📊 **Reporting (10%):** "Show all POs for Project Phoenix"

### **VALUE PROPOSITION**

**Immediate Value:**
- ⏱️ **Time Saved:** 10 seconds vs 10 minutes of manual filtering
- 💰 **Dollar Value:** $50,000/year in PM labor savings (2 hrs/day × $125/hr × 200 days)
- 🎯 **Accuracy:** Finds semantic matches ("Python expert" = contractor with Python skills) that keyword search misses

**Total Annual Value:** $50,000/year

### **URGENCY PROFILE**
- **Time Sensitivity:** Real-time (operational decisions require instant answers)
- **Waiting Stakeholders:** PM needs contractor for project starting tomorrow

---

## ROI Calculation Framework

### **Formula for Feature ROI**

```python
annual_roi = (
  (time_saved_per_use × hourly_rate × uses_per_year) +  # Labor savings
  (cost_avoided_per_year) +                             # Prevented losses
  (opportunity_cost_recovered)                          # Strategic value
)
```

### **Velocity Platform Total Annual Value**

| Feature | Labor Savings | Cost Avoidance | Total Annual ROI |
|---------|--------------|----------------|------------------|
| **Hybrid Search** | $50,000 | $0 | $50,000 |
| **Budget Threshold Alerts** | $0 | $117,000 - $140,000 | $117,000 - $140,000 |
| **Contract Gap Analysis** | $87,500 | $200,000 | $287,500 |
| **Vendor Data Extraction** | $125,000 | $0 | $125,000 |
| **SOW Generation** | $162,500 | $0 | $162,500 |
| **Asset Tracking** | $40,000 | $80,000 | $120,000 |
| **Proactive Alerts** | $25,000 | $150,000 | $175,000 |
| **Portfolio Dashboard** | $100,000 | $200,000 | $300,000 |

**TOTAL PLATFORM ROI:** **$1,337,000 - $1,360,000/year**

**ROI Multiple:** 5-10x for mid-market companies with $5M annual contractor spend

---

## Expert Cognitive Frameworks (Decision Lenses)

Each expert has a unique way of evaluating features and making decisions:

### **CPO - Chief Procurement Officer**
**Decision Lens:** Risk Mitigation → Cost Optimization → Speed

**When evaluating any feature, asks:**
1. How does this prevent vendor lock-in or liability exposure?
2. Can I see comparative pricing from 3+ vendors instantly?
3. Does this flag unfavorable contract terms automatically?
4. Will this eliminate emergency procurement scenarios (30-50% premium)?
5. Can I track vendor performance across all projects?

**Success Metrics:** Cost avoidance, contract compliance, vendor performance scores

---

### **PM - Senior Project Manager (165-project portfolio)**
**Decision Lens:** Dependencies → Resources → Timeline

**When evaluating any feature, asks:**
1. Can I instantly answer "What are my top 5 at-risk projects?"
2. Does this show resource conflicts before they cause delays?
3. Can I see which projects depend on which other projects/vendors?
4. Will this alert me when Project A blocking Project B creates cascading failures?
5. Can executives get answers without me being in the room?

**Success Metrics:** On-time delivery rate, resource utilization, stakeholder satisfaction

---

### **CFO - Finance Controller**
**Decision Lens:** Compliance → Cost Control → Efficiency

**When evaluating any feature, asks:**
1. Can this auto-flag invoices exceeding contracted rates before payment?
2. Will this show budget variance trends in real-time, not 30 days later?
3. Does this enforce approval workflows based on spend authority?
4. Can I see total vendor spend YTD vs budget instantly?
5. Will this create audit trails automatically (SOX, GAAP compliance)?

**Success Metrics:** Budget variance < 5%, invoice processing time, audit findings = 0

---

### **CISO - Chief Information Security Officer**
**Decision Lens:** Security → Compliance → Usability

**When evaluating any feature, asks:**
1. Does this enforce role-based access control (RBAC) automatically?
2. Will this track who accessed what data, when, and why (audit trail)?
3. Can this auto-flag vendors who don't meet security requirements?
4. Does this encrypt data at rest and in transit?
5. Will this integrate with SSO (Okta, Azure AD) and support MFA?

**Success Metrics:** Zero security incidents, 100% compliance, audit findings = 0

---

### **Legal Counsel**
**Decision Lens:** Legal Risk Mitigation → Compliance → Business Enablement

**When evaluating any feature, asks:**
1. Can this flag high-risk contract terms automatically?
2. Will this enforce legal review workflows based on contract value?
3. Does this maintain centralized contract repository with version control?
4. Can I search across all contracts for specific clauses?
5. Will this alert me before renewal deadlines so I can renegotiate?

**Success Metrics:** Zero litigation, zero regulatory fines, contract risk score

---

## Urgency Scoring Algorithm

```python
def calculate_urgency_score(feature_access):
    """
    Auto-calculate urgency score for any feature/page/workflow access
    Returns: 0-100 urgency score
    """
    
    # Factor 1: Deadline Proximity (40% weight)
    days_until_deadline = get_nearest_deadline(feature_access.context)
    deadline_score = max(0, 100 - (days_until_deadline * 10))  # 0 days = 100, 10 days = 0
    
    # Factor 2: Waiting Stakeholders (30% weight)
    stakeholder_count = len(feature_access.waiting_stakeholders)
    stakeholder_score = min(100, stakeholder_count * 33)  # 3+ stakeholders = 100
    
    # Factor 3: Degradation Cost (30% weight)
    cost_per_day = feature_access.degradation_cost_per_day
    cost_score = min(100, (cost_per_day / 1000) * 10)  # $10K/day = 100
    
    urgency_score = (
        deadline_score * 0.4 +
        stakeholder_score * 0.3 +
        cost_score * 0.3
    )
    
    return {
        "urgency_score": urgency_score,
        "urgency_level": get_urgency_level(urgency_score),
        "breakdown": {
            "deadline_proximity": deadline_score,
            "waiting_stakeholders": stakeholder_score,
            "degradation_cost": cost_score
        }
    }

def get_urgency_level(score):
    if score >= 90: return "CRITICAL"
    elif score >= 70: return "HIGH"
    elif score >= 40: return "MEDIUM"
    else: return "LOW"
```

---

## Implementation Checklist

For every new feature/page/workflow in Velocity, complete this checklist:

### ✅ **AUDIENCE (4 Questions)**
- [ ] Identified primary audience persona
- [ ] Listed all secondary audiences
- [ ] Defined required expertise level
- [ ] Mapped affected departments

### ✅ **ACCESS CONTEXT (4 Questions)**
- [ ] Documented access triggers (daily ops, crisis, planning)
- [ ] Listed search keywords users would use
- [ ] Mapped entry points (dashboard, search, notification)
- [ ] Defined typical user journey (before → this page → after)

### ✅ **VALUE PROPOSITION (3 Questions)**
- [ ] Quantified immediate value (time saved, problem solved)
- [ ] Identified downstream benefits (future value, risk prevention)
- [ ] Calculated dollar ROI (annual value in $)

### ✅ **URGENCY PROFILE (3 Questions)**
- [ ] Defined time sensitivity (real-time, daily, weekly, reference)
- [ ] Listed hard deadlines (if any)
- [ ] Identified waiting stakeholders and degradation cost

### ✅ **COMPLEXITY (1 Question)**
- [ ] Estimated consumption time (30 sec, 5 min, 30 min)
- [ ] Estimated implementation time (instant, hours, days)
- [ ] Listed prerequisites (skills, access, dependencies)

---

## Future: Context Intelligence API

Transform Velocity into a **universal context intelligence layer** that other apps can query:

```
POST /api/intelligence/classify-content
  → Classify any content through 15-question framework

POST /api/intelligence/recommend-next-action
  → Based on user role + current context, suggest next best action

POST /api/intelligence/calculate-roi
  → Quantify dollar value of any action/feature

POST /api/intelligence/urgency-score
  → Auto-calculate urgency based on deadlines, stakeholders, costs

POST /api/intelligence/expert-evaluation
  → Run content through all 10 expert cognitive frameworks
```

This makes Velocity's intelligence **reusable** across other applications in the enterprise ecosystem.
