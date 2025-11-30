# Knowledge System - 5-Minute Quick Start

**Goal**: Get the automated knowledge capture system running in 5 minutes

---

## ✅ Setup (Already Done!)

You already have all 4 core files in your project:
- [x] watchdog-process.md (automation rules)
- [x] post-it-notes.md (insights queue)
- [x] debug-patterns.md (debugging methods)
- [x] universal-taxonomy.md (category system)
- [x] KNOWLEDGE-BOT.md (this reference guide)

**Status**: ✅ Watchdog Active & Capturing

---

## 🚀 How to Use (3 Steps)

### Step 1: Search When Stuck (10 seconds)
```bash
grep -i "your-problem" post-it-notes.md
```

**Example**: Fixing sidebar issue
```bash
grep -i "sidebar\|navigation" post-it-notes.md
# Found: Post-it #009 - Double navigation cleanup
# Solution: Remove old component imports
```

### Step 2: Code Normally (Let Watchdog Work)
- Write code as usual
- Every 3-5 prompts, watchdog auto-captures insights
- Zero overhead, no manual work needed

### Step 3: Review & Refine (Optional)
```bash
# View recent captures
tail -50 post-it-notes.md

# Mark as verified when battle-tested
# Status: [x] Implemented → [✓] Verified
```

---

## 📊 Current Status

**System Health**:
- ✅ 9 post-its captured
- ✅ 4 verified in production
- ✅ 7 active categories
- ✅ 9 code artifacts linked

**Recent Wins**:
- #006: Fixed wouter Link nested anchor bug
- #008: Dark mode persistence working
- #009: Double navigation cleanup method documented

---

## 💡 Pro Tips

### Tip 1: Search First, Code Second
Before implementing, search past solutions:
```bash
grep -i "integration" post-it-notes.md
grep -i "api" post-it-notes.md  
grep -i "auth" post-it-notes.md
```

### Tip 2: Category Filtering
```bash
# All UX insights
grep "Category: UX" post-it-notes.md

# All debugging patterns
grep "Category: DEBUGGING" post-it-notes.md
```

### Tip 3: Code Jump
Every post-it has exact file locations:
```
Applied: client/src/components/layout/AppHeader.tsx (12-23)
```
Jump straight to the solution code!

---

## 🎯 What Happens Next

### Automatically (No Action Required)
- ✅ Watchdog runs every 3-5 prompts
- ✅ Captures 1-3 insights per run
- ✅ Links to exact code locations
- ✅ Prevents duplicate insights

### Manually (Optional)
- 🔍 Search when stuck: `grep -i "topic" post-it-notes.md`
- ✓ Mark verified: Change `[x]` to `[✓]` after battle-testing
- 📝 Add manual: Rare cases where you want to force-capture

---

## 📚 Files Reference

| File | What It Does | When to Use |
|------|--------------|-------------|
| **KNOWLEDGE-BOT.md** | Quick reference guide | Right now! |
| **post-it-notes.md** | All captured insights | When stuck |
| **debug-patterns.md** | Debugging methodologies | Systematic debugging |
| **watchdog-process.md** | How automation works | Understanding system |

---

## 🚨 If Something's Wrong

### Watchdog Not Capturing?
Check: `cat watchdog-process.md`  
Expected: Trigger every 3-5 prompts

### Can't Find Old Insights?
Try: `grep -i "broader-search" post-it-notes.md`  
Or: `cat post-it-notes.md | less` (scroll through all)

### Want to Add Manually?
Format:
```markdown
### #XXX - Title
- **Date**: 2025-11-06
- **Category**: TECH/UX/etc
- **Insight**: What you learned
- **Applied**: file/path.ts
- **Status**: [ ] Pending
```

---

## ✨ The Promise

**After 1 Week**: 5-10 insights, search-first habit forming  
**After 1 Month**: 20-30 insights, debugging 50% faster  
**After 3 Months**: 60+ insights, exponential knowledge gain

**The Goal**: Never re-learn what you already know.

---

**You're all set! The system is running. Just code normally.** 🚀

**Next Time You're Stuck**: `grep -i "problem" post-it-notes.md`
