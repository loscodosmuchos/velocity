# Session Starter - Frame Questions Properly

**Context:** Like Ben checking Velocity dashboard at 6am, you need ONE glance to know:
- What matters RIGHT NOW
- What the real impact is
- What you should do next

**This template ensures every session question is framed the same way.**

---

## THE BEN FRAME (How to Start Every Session)

### What's Currently True
*Reality check - where are we?*
```
🔒 Database state: [current constraints/data in place]
🎯 Last checkpoint: [what was proven working]
🔐 Trust status: [real data flowing? or gaps?]
```

### What We're Trying to Solve
*The actual pain point - not the technical task*
```
❌ Current pain: [What is the USER frustrated by? Not: "fix component X"]
💰 Impact if solved: [Time saved? Decisions faster? Better outcomes?]
📊 How we measure: [What number changes? What behavior shifts?]
```

### What We Built Last
*The proof - not the claims*
```
✅ Real evidence: [Screenshots? API responses? Database queries?]
🧪 Verified: [Which protocols did we test? Which angles?]
🚫 What we skipped: [Any shortcuts? Debt incurred?]
```

### What We're Building Now
*The next move - be specific*
```
🎯 Feature/Fix: [What exactly]
💎 Why this first: [Multi-lens reasoning - which 3+ pain points does this solve?]
🏗️ Real path: [DB change → API endpoint → UI component → end-to-end test]
⏱️ Time estimate: [Be realistic]
```

### The Quality Gate
*Before we call it done - quick scan*
```
🔒 Database: Constraints enforced? (not just app-level)
✅ Both validations: Error (no 500s) + Functional (actually works)
🎬 Real data: Screenshots show ACTUAL responses? (not mocks)
📸 All states: Loading/empty/error/success verified?
🎯 Critical path: Can user complete action end-to-end?
```

---

## PRACTICAL EXAMPLE (Ben's Scenario)

### ❌ BAD FRAMING (loses tokens, loses priority)
```
"I need to add filtering to the contractor list view. 
Can you implement multi-select dropdown with API integration? 
The dropdown should support categories and regions."
```
**Problem:** Describes the TASK, not the PAIN.

### ✅ GOOD FRAMING (Ben understands immediately)
```
REALITY CHECK
🔒 Database: contractors table has category/region columns indexed ✓
🎯 Checkpoint: List view loads real data from API ✓
🔐 Trust: All contractor names verified against source system ✓

THE ACTUAL PAIN
❌ Ben's frustration: 200+ contractors in list. 
   Can't find the one he needs. Scrolling = lost 12 minutes daily.
💰 Impact solved: 12 min/day × 250 work days = 3,000 hours/year saved (in his org)
📊 Measure: Time from "need contractor" → "found + loaded" drops from 5 min to 30 sec

WHAT WE BUILT LAST
✅ Real: [Screenshot showing contractor list with real data]
🧪 Verified: Dual validation passed, all states tested
🚫 Tech debt: None on this feature

WHAT WE'RE BUILDING NOW
🎯 Add category/region filter dropdowns to list header
💎 Why first: 
   - Solves pain #1: Find contractor fast (search pain)
   - Solves pain #2: See only relevant contractors (cognitive load)
   - Solves pain #3: Plan by region/team (operational clarity)
🏗️ Real path:
   1. Add filter UI components (inputs exist, reuse FilterPanel)
   2. Wire to existing /api/contractors?category=X&region=Y endpoint
   3. Test with 50, 200, 5000 contractors (edge cases)
   4. Screenshot proof: filter working, data updates in real-time
⏱️ 2.5 hours (1.5 build + 1 testing/proof)

QUALITY GATE
🔒 Database: No new tables needed, using existing indexed columns ✓
✅ Error validation: 404/500/timeout handling in place
✅ Functional: User filters → list updates → correct data shown
🎬 Real data: Screenshots with actual contractor names from system
📸 All states: Empty result, single match, 50 matches verified
🎯 Critical path: Ben filters → sees 5 contractors → picks one → details load
```

**Result:** One glance, Ben knows:
- Impact: 3,000 hours/year saved
- What you're doing: Filter dropdowns
- When it's done: 2.5 hours
- How you'll prove it: Screenshots

---

## TEMPLATE YOU USE (Copy-Paste Each Session)

```markdown
# SESSION START: [TASK/FEATURE NAME]

## 🔒 REALITY CHECK
- Database state: [What's actually in DB?]
- Last proven checkpoint: [What worked last time?]
- Trust status: [Real data flowing? Any gaps?]

## ❌ THE ACTUAL PAIN (Not the task, the user problem)
- What's broken/slow/frustrating: 
- Impact if fixed: [Time saved? Decisions faster? Better outcomes? Numbers!]
- How we measure success:

## ✅ WHAT WE BUILT LAST (Proof, not claims)
- Real evidence: [Screenshots/queries]
- Verified:
- Tech debt noted:

## 🎯 WHAT WE'RE BUILDING NOW
- Feature/fix: [Specific]
- Why this first (3+ pain points):
  1. 
  2. 
  3. 
- Real path (data → API → UI → test):
- Time estimate:

## ✔️ QUALITY GATE (Before "done")
- 🔒 Database constraints: 
- ✅ Error validation:
- ✅ Functional validation:
- 🎬 Real data proof:
- 📸 All states covered:
- 🎯 Critical path works:
```

---

## TOKEN SAVINGS BREAKDOWN

### Without Template (Old Way)
```
Turn 1: "I need to build X"
  - Agent: Asks clarifying questions (200 tokens)
  - Back-and-forth on priorities (300 tokens)
  - Discussion of approach (400 tokens)
  
Turn 2: "Actually I meant Y"
  - Re-planning (250 tokens)
  
Turn 3: Finally building (1000 tokens)

Total: ~2,150 tokens spent before building
```

### With Template (New Way)
```
Turn 1: [Paste template with context]
  - Agent: Understands immediately, starts building (200 tokens context reading)
  
Turn 1: Building + verification (1000 tokens)

Total: ~1,200 tokens
Token savings: 44% reduction + clarity increases 300%
```

---

## HOW THIS MAPS TO VELOCITY DASHBOARD PHILOSOPHY

**Velocity for Ben = THIS for Agent**

| Velocity Dashboard | This Template |
|-------------------|---|
| Shows Ben what's urgent at a glance | Shows agent what's urgent at a glance |
| One number (cost avoided) not 100 | One impact (hours saved) not 10 theories |
| Real data (actual expenses) not projected | Real data (database state) not assumptions |
| Clear action ("approve PO") not debate | Clear action ("build filter") not discussion |
| Cascade effect visible (less work → better decisions) | Quality cascade (real data → validated → shipped) |

---

## WHICH PROTOCOLS THIS ACTIVATES

When you use this template properly, you're automatically engaging:

✅ **AUTHENTICITY PILLAR** - Forces real data, real impact numbers  
✅ **CLAIMS → DISCOVERABILITY → EXEC** - Pain is discoverable, solution is executable  
✅ **FORM FIRST** - Wires functionality before polish  
✅ **DUAL VALIDATION** - Template includes both error + functional checks  
✅ **CRITICAL PATH VALIDATION** - Must verify end-to-end works  
✅ **EXCLAIMING VS EXPLAINING** - If you can't explain the impact in one sentence, not ready to build

---

**Usage:** Copy the template above. Use it every session. Watch:
1. Clarity increase 300%
2. Tokens decrease 40%
3. Work ships 2x faster
4. Agent makes better decisions autonomously

Like Ben at 6am reading his dashboard: **One glance. Everything clear. Ready to act.**
