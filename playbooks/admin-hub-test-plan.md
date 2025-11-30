# Admin Hub Navigation Test Plan
**Date**: November 27, 2025  
**Feature**: Admin Hub - 28 Tools Expansion  
**Scope**: Navigation link validation across 5 categorized sections  
**Architect Review**: Completed - Three-Phase Validation Recommended

---

## Executive Summary

The Admin Hub expansion links 28 administrative tools (was 6) organized into 5 strategic categories. This test plan follows the **Architect-recommended three-phase validation sequence** to ensure demo-ready confidence for the December 2025 Hyundai presentation.

---

## Three-Phase Validation Sequence

### Phase 0: Pre-Flight (FOUNDATION)
**Objective**: Establish automated baseline before manual testing

| Test | Acceptance Criteria | Status |
|------|---------------------|--------|
| ES Module Script | `node scripts/validate-admin-hub-routes.js` runs without errors | ⬜ |
| Route Baseline | All 27 routes validated against App.tsx | ⬜ |
| CI Hook Ready | Script wired to npm test (optional) | ⬜ |

**Command**: 
```bash
node scripts/validate-admin-hub-routes.js
```

**Pass Threshold**: 100% route validation, 0 errors

---

### Phase 1: Navigation Integrity (AUTOMATED + MANUAL)
**Objective**: Verify all links work and pages load

#### 1.1 Automated Route Validation
- [ ] Run validation script
- [ ] All 27 routes resolve
- [ ] No 404 errors in console

#### 1.2 Manual Smoke Test (28 Tiles)
Navigate to `/admin` and click each button:

**Core Administration (6 tools)**
- [ ] User Management → `/admin/users`
- [ ] System Exceptions → `/admin/exceptions`
- [ ] Data Quality → `/admin/data-quality`
- [ ] Audit Logs → `/admin/audit-logs`
- [ ] AI Chatbot Manager → `/admin/chatbots-customize`
- [ ] Email Logs → `/approvals/email-logs`

**Customization & Settings (3 tools)**
- [ ] Texture Selector → `/admin/texture-selector` ⚠️ HARD GATE
- [ ] Platform Definition → `/admin/platform-definition`
- [ ] Validation Studio → `/admin/validation-studio`

**Quality Assurance & Analytics (4 tools)**
- [ ] Feature Risk Dashboard → `/admin/feature-risk-dashboard` ⚠️ HARD GATE
- [ ] Change Log Dashboard → `/admin/change-log-dashboard` ⚠️ HARD GATE
- [ ] Bug Pattern Detector → `/admin/bug-pattern-detector`
- [ ] Visual Change Gallery → `/admin/visual-change-gallery`

**Demo & Presentation (4 tools)**
- [ ] Demo Command Center → `/admin/demo-command-center`
- [ ] Demo Presentation → `/admin/demo-presentation`
- [ ] Persona Reference → `/admin/persona-reference`
- [ ] Implementation Status → `/admin/implementation-status`

**Development Tools (5 tools)**
- [ ] Logic Studio → `/admin/logic-studio`
- [ ] Journey Builder → `/admin/journey-builder`
- [ ] System Architecture → `/admin/system-architecture-map`
- [ ] AI QA Lab → `/admin/ai-qa-lab`
- [ ] Error Tracking → `/admin/error-tracking`

**Data & Content (5 tools)**
- [ ] Knowledge Hub → `/admin/knowledge-hub`
- [ ] Demo Data Generator → `/admin/demo-data-generator`
- [ ] YouTube Capture → `/admin/youtube-capture`
- [ ] XLSX Import → `/admin/xlsx-import`
- [ ] Voice Panel → `/admin/voice-panel`

#### 1.3 Console/Performance Spot-Check
- [ ] Open DevTools Console during navigation
- [ ] No JavaScript errors
- [ ] No failed network requests (except auth on unauthenticated)
- [ ] Page load < 2 seconds

**Pass Threshold**: All 28 tiles navigate successfully, no console errors

---

### 🚦 HARD GATES (Must Pass Before Phase 2)

These three tools are critical for Hyundai demo positioning and must pass before proceeding:

| Hard Gate | Route | Why Critical | Status |
|-----------|-------|--------------|--------|
| Feature Risk Dashboard | `/admin/feature-risk-dashboard` | Competitive positioning vs FieldGlass | ⬜ |
| Change Log Dashboard | `/admin/change-log-dashboard` | Demo narrative tool | ⬜ |
| Texture Selector | `/admin/texture-selector` | Luxury brand experience (carbon fiber) | ⬜ |

**Acceptance Criteria**:
1. Page loads without error
2. Core functionality works (texture applies, features display, log renders)
3. Visual design matches luxury automotive aesthetic

**BLOCKING**: If any hard gate fails, do NOT proceed to Phase 2

---

### Phase 2: Persona Choreography (UX REVIEW)
**Objective**: Validate from each stakeholder's perspective

#### 2.1 Ben Clarity Sweep (Overwhelmed PM)
**Persona**: Head of Project Management, Innovation Division, 150+ projects

| Check | Criteria | Evidence Required |
|-------|----------|-------------------|
| Visual Scan | Can Ben identify needed tools in < 5 seconds? | Screenshot |
| Demo Tools | Demo Command Center, Implementation Status visible? | Screenshot |
| Change Tracking | Change Log Dashboard accessible from Admin Hub? | Screenshot |
| Overwhelm Factor | Does layout feel manageable, not overwhelming? | Subjective rating 1-5 |

**Photographic Proof Required**: Capture Ben's dashboard view

#### 2.2 Mark Consultant Trace (Staffing Agency Consultant)
**Persona**: Helping Ben bring clarity to chaos, supporting 700-person site move

| Check | Criteria | Evidence Required |
|-------|----------|-------------------|
| Support Tools | Can Mark find tools to help Ben? | Screenshot |
| Data Import | XLSX Import, Demo Data Generator accessible? | Screenshot |
| Knowledge Base | Knowledge Hub discoverable for documentation? | Screenshot |
| Consultant Workflow | Can trace from Admin Hub → relevant tools → back? | Flow trace |

**Photographic Proof Required**: Capture Mark's workflow trace

#### 2.3 Admin Validation
- [ ] All system admin tools easily discoverable
- [ ] Security-related tools accessible
- [ ] Audit trail visible

#### 2.4 QA Engineer Validation
- [ ] Quality Assurance section prominent
- [ ] Bug Pattern Detector, Feature Risk accessible
- [ ] Visual Change Gallery for regression testing

#### 2.5 Data Manager Validation
- [ ] Data & Content section clear
- [ ] Import tools (XLSX, YouTube, Demo Data) discoverable
- [ ] Knowledge Hub for documentation

**Pass Threshold**: All 5 personas can complete their primary tasks, photographic evidence captured

---

### Phase 3: Regression & Guardrails (SAFETY)
**Objective**: Ensure no existing functionality broken

#### 3.1 Auth/Role Smoke Test
- [ ] Admin pages require authentication
- [ ] Role-based access still enforced
- [ ] Unauthorized users blocked appropriately

#### 3.2 Data Quality Metrics
- [ ] Admin Hub metrics still calculate correctly
- [ ] Recent Exceptions section displays
- [ ] Recent Activity section loads
- [ ] Data Quality percentages accurate

#### 3.3 Texture Persistence Check
- [ ] Select texture in Texture Selector
- [ ] Navigate away from page
- [ ] Return - texture still applied
- [ ] Refresh browser - texture persists
- [ ] Close/reopen browser - texture persists (localStorage)

#### 3.4 Responsive + Load Testing
- [ ] Admin Hub renders on mobile (1 column)
- [ ] Admin Hub renders on tablet (2 columns)
- [ ] Admin Hub renders on desktop (3 columns)
- [ ] All buttons/icons properly sized at each breakpoint
- [ ] Page load < 2 seconds on 3G throttle

**Pass Threshold**: All regression tests pass, no functionality broken

---

## Evidence Requirements (Per Architect)

| Phase | Evidence Type | Storage Location |
|-------|---------------|------------------|
| Phase 0 | Script output log | Console / CI log |
| Phase 1 | Manual test checklist | This document |
| Phase 2 | Screenshots (Ben, Mark dashboards) | Change Log Dashboard |
| Phase 3 | Regression test results | This document |

---

## Sign-Off Checklist

| Gate | Owner | Date | Signature |
|------|-------|------|-----------|
| Phase 0 Complete | Dev | _____ | _____ |
| Phase 1 Complete | Dev | _____ | _____ |
| Hard Gates Passed | QA | _____ | _____ |
| Phase 2 Complete | Product | _____ | _____ |
| Phase 3 Complete | QA | _____ | _____ |
| Demo Ready | Stakeholder | _____ | _____ |

---

## Risk Matrix

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|-----------|
| Route typos causing 404 | High | Low | Automated validation script |
| Hard gate failure blocking demo | Critical | Low | Test hard gates first |
| Texture not persisting | Medium | Low | localStorage verification |
| Mobile layout broken | Medium | Low | Responsive breakpoint testing |
| Performance degradation | Low | Low | Load time monitoring |

---

## Quick Reference

**Run Validation**:
```bash
node scripts/validate-admin-hub-routes.js
```

**Hard Gates** (Test First):
1. `/admin/feature-risk-dashboard`
2. `/admin/change-log-dashboard`
3. `/admin/texture-selector`

**Total Routes**: 27 unique  
**Total Tools**: 28 (one route duplicated in header)  
**Categories**: 5  

---

*Test plan created following Architect-recommended three-phase validation sequence*
