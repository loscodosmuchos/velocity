# Journey-Based UX Evaluation Framework
**Version:** 1.0  
**Date:** November 6, 2025  
**Authors:** Human + AI Collaboration  
**Status:** Active UX Standard  
**Purpose:** Define systematic approach to evaluate user experience from real user perspective

---

## The Core Principle

> **"Put yourself in the user's shoes: If I sat down to do this job function, what would I expect?"**

**Not:** What does the system technically do?  
**But:** What does the user expect to happen?

---

## Why Journey-Based Evaluation

### Traditional Testing Fails Users

**Traditional approach:**
```
Tester: "Does the button work?"
System: "Yes, it triggers the function."
Tester: "✓ Pass"

User experience:
User: "I clicked the button and nothing happened."
Reality: Button works, but no visual feedback
Result: User thinks it's broken
```

**Problem:** Testing functionality ≠ Testing user experience

### Journey-Based Approach

**Journey-based evaluation:**
```
Evaluator (as user): "I need to complete this shipment batch"
Step 1: "Where do I start a batch?"
Step 2: "How do I know my work is being tracked?"
Step 3: "Can I see my progress?"
Step 4: "How do I complete it?"
```

**Benefit:** Reveals gaps between user expectations and system reality

---

## The Evaluation Framework

### Five Critical Questions

For every step in a user journey, ask:

**1. ❓ Expectation**
- What does the user expect to see/happen?
- What would feel natural/obvious?
- What's the mental model?

**2. 👁️ Reality**
- What does the system actually show/do?
- Is there any feedback?
- Does it match expectations?

**3. 📏 Gap**
- How far apart are expectation vs reality?
- None / Minor / Major / Critical

**4. 😤 Sentiment**
- How would the user feel if this fails?
- Satisfied / Confused / Frustrated / Angry

**5. 🚨 Severity**
- ✓ PASS (works as expected)
- ⚠️ HIGH (frustrating but not blocking)
- 🚨 CRITICAL (blocks core workflow)

---

## Journey Structure

### Journey Template

```markdown
## User Journey: [Name]

**Scenario:** [Who is doing what and why]
**User Type:** [Role/persona]
**Goal:** [What they're trying to accomplish]
**Context:** [Situation/constraints]

### Step 1: [Action Name]
- **User Expectation:** "I expect..."
- **Actual Behavior:** [What happens]
- **Gap:** [None/Minor/Major/Critical]
- **Sentiment:** [How user feels]
- **Severity:** [✓/⚠️/🚨]

### Step 2: [Next Action]
...

### Journey Result
- ✓ PASS (smooth experience, meets expectations)
- ⚠️ PARTIAL (works but with friction)
- ❌ FAILS (blocks user from completing goal)
```

---

## Real-World Example: Batch Session Management

### Journey: Processing a New Shipment

**Scenario:** Sarah receives 50 Dell servers from Client ABC (PO# 12345). She needs to analyze all equipment and generate a report.

#### Step 1: Starting Work
```
❓ Expectation: "I need to tell the system I'm starting a batch"
👁️ Reality: Dashboard has "Start Batch Session" button
📏 Gap: None
😤 Sentiment: Satisfied
🚨 Severity: ✓ PASS
```

#### Step 2: Scanning First Equipment
```
❓ Expectation: "Now I'll scan equipment and it will automatically be part of my batch"
👁️ Reality: Goes to Analyze page, NO batch indicator visible
📏 Gap: CRITICAL - User has no idea if batch is active
😤 Sentiment: "Wait... is this going into my batch? Did I lose it?"
🚨 Severity: 🚨 CRITICAL FAILURE
```

**Journey Result:** ❌ FAILS - User cannot complete core job function

---

## Identifying UX Gaps

### Gap Classification

**No Gap (✓ PASS)**
- Expectation matches reality perfectly
- User achieves goal smoothly
- No confusion or friction

**Minor Gap (Low Priority)**
- Slight deviation from expectation
- User figures it out quickly
- Cosmetic or polish issue

**Major Gap (⚠️ HIGH)**
- Significant deviation
- User confused but can eventually succeed
- Frustrating but not blocking

**Critical Gap (🚨 CRITICAL)**
- Complete mismatch
- User cannot achieve goal
- Blocks core workflow

### Severity Assessment Matrix

| Gap Size | User Impact | Severity |
|----------|-------------|----------|
| None | Works perfectly | ✓ PASS |
| Minor | Slight confusion | Low |
| Major | Frustration | ⚠️ HIGH |
| Critical | Workflow blocked | 🚨 CRITICAL |

---

## User Sentiment Prediction

### Why Sentiment Matters

**Technical success ≠ User satisfaction**

**Example:**
- Feature technically works: ✓
- But user feels confused: ❌
- Result: Feature is abandoned

**User sentiment directly impacts:**
- Feature adoption
- User retention
- Trust in system
- Willingness to recommend

### Sentiment Scale

**😊 Satisfied**
- Everything works as expected
- Smooth, intuitive flow
- User feels productive

**😐 Neutral**
- Works but not ideal
- Minor confusion cleared up quickly
- Neither delighted nor frustrated

**😕 Confused**
- Unclear what to do next
- Multiple attempts needed
- Questions system reliability

**😤 Frustrated**
- Can't achieve goal
- Wasted time
- Considering alternatives

**😡 Angry**
- Lost work/data
- Multiple failures
- Ready to abandon system

---

## Journey Types

### Primary Journeys (Must Work Perfectly)

**Definition:** Core job functions users MUST complete

**Examples:**
- Processing a shipment batch
- Analyzing equipment value
- Generating reports
- Managing inventory

**Severity threshold:** Any critical gap = Complete failure

### Secondary Journeys (Should Work Well)

**Definition:** Important but not core workflows

**Examples:**
- Reviewing past analyses
- Editing batch metadata
- Searching history
- Customizing preferences

**Severity threshold:** High-priority gaps need fixing

### Tertiary Journeys (Nice to Have)

**Definition:** Enhancement features, power-user tools

**Examples:**
- Advanced filtering
- Bulk operations
- Export customization
- Integration settings

**Severity threshold:** Address when time permits

---

## Evaluation Process

### Step 1: Define User Personas

**Who are your users?**
- Role/job title
- Technical expertise
- Primary goals
- Pain points
- Context/constraints

**Example:**
```markdown
**Persona:** Sarah - ITAD Operations Manager
- **Role:** Processes 200+ equipment items per week
- **Tech Level:** Moderate (comfortable with apps, not a developer)
- **Goals:** Fast analysis, accurate reports, client satisfaction
- **Pain Points:** Manual data entry, tracking across multiple sources
- **Context:** Standing in warehouse with phone, time pressure
```

### Step 2: Map Core Journeys

**For each persona, identify:**
1. Most frequent tasks (daily/weekly)
2. Most critical tasks (business impact)
3. Most painful tasks (current friction)

**Prioritize:** Frequent + Critical = Highest priority

### Step 3: Walk Through Each Journey

**Become the user:**
- Start from their entry point
- Follow natural thought process
- Note every expectation
- Compare to reality
- Document gaps

**Don't skip steps.** Users experience the full journey.

### Step 4: Assess Severity

**For each gap, determine:**
- Does it block the workflow? → 🚨 CRITICAL
- Is it frustrating but workaround exists? → ⚠️ HIGH  
- Is it confusing but minor? → Low
- No gap? → ✓ PASS

### Step 5: Predict Sentiment

**Ask:**
- How would I feel if this happened to me?
- Would I trust this system?
- Would I recommend it to colleagues?

### Step 6: Prioritize Fixes

**Priority order:**
1. 🚨 CRITICAL gaps in primary journeys
2. ⚠️ HIGH gaps in primary journeys
3. 🚨 CRITICAL gaps in secondary journeys
4. ⚠️ HIGH gaps in secondary journeys
5. Everything else

---

## Documentation Standards

### Evaluation Document Structure

```markdown
# UX Evaluation - [Feature Name]

**Date:** YYYY-MM-DD
**Evaluator:** [Name/Role]
**Feature:** [What's being evaluated]

## Evaluation Framework
[Describe the 5 critical questions]

---

## User Journey 1: [Name]
### Scenario
[Who, what, why, context]

### Step-by-Step Analysis
[Each step with 5 questions]

### Journey Result
[✓ PASS / ⚠️ PARTIAL / ❌ FAILS]

---

## Summary of Critical Issues
### 🚨 Critical Failures
[List blocking issues]

### ⚠️ High Priority
[List frustrating issues]

---

## Recommended Fixes (Priority Order)
### Phase 1: Critical Fixes (Must Have)
[List with checkboxes]

### Phase 2: High Priority (Should Have)
[List with checkboxes]

---

## User Sentiment Prediction
**If NOT Fixed:** [Describe frustrated user experience]
**If Fixed:** [Describe satisfied user experience]
```

---

## Common UX Gaps

### Gap 1: Missing Visual Feedback

**Pattern:**
- User performs action
- System processes in background
- No indication action is happening
- User thinks it failed

**Example:**
- Click "Save" button
- No spinner, no toast, no confirmation
- User clicks again (duplicate submission)

**Fix:** Always provide immediate feedback

### Gap 2: State Invisibility

**Pattern:**
- System has internal state (batch active, filter applied)
- User can't see current state
- User loses context

**Example:**
- Start batch session
- Navigate to different page
- No indication batch is still active
- User forgets and starts new work

**Fix:** Make state visible and persistent

### Gap 3: Destructive Actions Without Confirmation

**Pattern:**
- User accidentally clicks dangerous button
- No "Are you sure?" dialog
- Work/data lost instantly

**Example:**
- "Delete All" button next to "Delete Selected"
- Accidental click
- All data gone, no undo

**Fix:** Confirm destructive actions, show impact

### Gap 4: Clickability Confusion

**Pattern:**
- Element is clickable but doesn't look clickable
- OR element looks clickable but isn't

**Example:**
- List items can be clicked for details
- No underline, no hover state, no cursor change
- User doesn't discover feature

**Fix:** Visual affordances (hover, cursor, underline)

### Gap 5: Incomplete Workflows

**Pattern:**
- User completes task
- System provides no summary or next steps
- User left wondering "what now?"

**Example:**
- Complete batch processing
- Toast: "Batch completed"
- User: "Where's my report? What was the total value?"

**Fix:** Completion summaries with metrics and next actions

---

## Integration with Development

### Before Building a Feature

**Run journey evaluation:**
1. Map expected user journey
2. Identify potential gaps
3. Design to prevent gaps
4. Build with gaps already addressed

**Benefit:** Fix UX issues before they're coded

### During Development

**Continuous evaluation:**
- After each feature increment
- Test from user perspective
- Identify new gaps
- Iterate immediately

**Benefit:** Catch issues early when cheap to fix

### Before Release

**Final evaluation:**
- Complete journey walk-throughs
- All critical gaps fixed
- High-priority gaps addressed or planned
- User sentiment predicted as positive

**Benefit:** Confident releases, happy users

---

## Real-World Application

### Case Study: Batch Session Management

**Initial State (Before Evaluation):**
- Feature technically worked
- Backend logic correct
- API endpoints functional

**Journey Evaluation Revealed:**
- 🚨 4 critical failures
- ⚠️ 3 high-priority gaps
- User cannot complete core workflow

**After Fixes:**
- All critical failures resolved
- Smooth user experience
- Positive sentiment predicted

**Outcome:** Feature went from "technically works" to "users love it"

---

## Success Metrics

### Leading Indicators
- ✅ All primary journeys rated ✓ PASS or ⚠️ PARTIAL
- ✅ Zero 🚨 CRITICAL gaps in primary journeys
- ✅ User sentiment predicted as satisfied
- ✅ Evaluation done before and after building

### Lagging Indicators
- ✅ Feature adoption rate (users actually use it)
- ✅ Support tickets decrease (fewer UX confusions)
- ✅ Completion rate (users finish workflows)
- ✅ User satisfaction scores increase

---

## Evaluation Checklist

### Before Building
```
□ User personas defined
□ Primary journeys mapped
□ Expected behaviors documented
□ Potential gaps identified
□ Design addresses gaps proactively
```

### During Development
```
□ Journey walk-through after each increment
□ Gaps documented immediately
□ Fixes applied before moving forward
□ User sentiment continuously assessed
```

### Before Release
```
□ All primary journeys evaluated
□ Critical gaps = 0
□ High-priority gaps addressed or planned
□ User sentiment predicted as positive
□ Documentation updated
```

---

## Common Pitfalls

### Pitfall 1: Testing Features, Not Journeys

**Wrong:** "Does the batch button work?" → Yes → Ship it  
**Right:** "Can a user successfully process a shipment batch?" → Walk through complete journey

### Pitfall 2: Developer Perspective Only

**Wrong:** "I know where the batch indicator is, it's obvious"  
**Right:** "Would a first-time user know there's an active batch?"

### Pitfall 3: Ignoring User Sentiment

**Wrong:** "Feature works, sentiment doesn't matter"  
**Right:** "Feature works but users are confused, needs improvement"

### Pitfall 4: Skipping Edge Cases

**Wrong:** "Works for happy path, ship it"  
**Right:** "Works for happy path, but what about new users? Errors? Edge cases?"

### Pitfall 5: No Severity Assessment

**Wrong:** "Found 20 issues, all need fixing"  
**Right:** "Found 2 critical, 5 high, 13 low - fix critical first"

---

## Templates and Tools

### Quick Journey Template

```markdown
## Journey: [Name]
**User:** [Who]
**Goal:** [What they want to accomplish]

1. [Step 1] - Expected: ... | Reality: ... | Gap: ... | Severity: ...
2. [Step 2] - Expected: ... | Reality: ... | Gap: ... | Severity: ...
3. [Step 3] - Expected: ... | Reality: ... | Gap: ... | Severity: ...

Result: [✓/⚠️/❌]
```

### Gap Analysis Spreadsheet

| Step | Expectation | Reality | Gap | Sentiment | Severity | Fix |
|------|-------------|---------|-----|-----------|----------|-----|
| 1 | ... | ... | Critical | Frustrated | 🚨 | ... |
| 2 | ... | ... | None | Satisfied | ✓ | N/A |

---

## Conclusion

**Journey-based evaluation is not optional.**

It's the difference between:
- Features that technically work
- vs Features that users actually use and love

**The framework is simple:**
1. Walk through user journeys
2. Compare expectations vs reality
3. Identify gaps
4. Assess severity
5. Fix critical gaps
6. Iterate

**The outcome is profound:**
- Users accomplish their goals smoothly
- Sentiment is positive
- Adoption is high
- Support burden is low

**"If I sat down to do this job function, what would I expect?"**

Answer that question honestly, and UX gaps become obvious.

---

## Document Changelog

**v1.0** (November 6, 2025)
- Initial creation extracting framework from ux-evaluation.md
- Defined 5 critical questions
- Provided real-world batch management example
- Created journey templates and checklists

---

## License & Usage

**License:** Open Framework - freely shareable  
**Attribution:** AssetGenius Project  
**Usage:** Apply to any UX evaluation workflow
