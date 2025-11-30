# Replit Integration Guide

**Purpose**: Instructions for integrating the knowledge system into existing Replit projects  
**Target**: Copy this content into your `replit.md` file

---

## Integration Options

### Option A: Full Integration (Recommended)
Copy the entire "Contributor Onboarding" section below into your `replit.md`, right after the "User Preferences" section.

### Option B: Minimal Integration
Just add a link to the knowledge system files in your `replit.md`:

```markdown
## Knowledge Management

This project uses an automated knowledge capture system. See:
- `post-it-notes.md` - Search for insights
- `watchdog-process.md` - How it works
- `debug-patterns.md` - Debugging methodologies
```

---

## Content to Copy (Option A)

Copy everything below this line into your `replit.md`:

```markdown
## Contributor Onboarding: How to Engage With Knowledge System

### Quick Start for New Contributors

**For Humans**:
1. **When stuck**: Search `post-it-notes.md` for keywords related to your problem
2. **After fixing bugs**: Add pattern to `debug-patterns.md` with multi-angle verification
3. **Manual post-it**: Add insight to `post-it-notes.md` anytime (don't wait for watchdog)
4. **Trust the watchdog**: It runs every 3-5 conversation turns to capture what you might miss

**For AI Agents**:
1. **Every 3-5 prompts**: Run watchdog check (see `watchdog-process.md`)
2. **Before completing tasks**: Check if insights should be captured
3. **After major features**: Update `replit.md` Recent Updates section
4. **Link code artifacts**: Always include file paths and line numbers in post-its

### Where to Log Insights

| Insight Type | Document | Format |
|-------------|----------|--------|
| Quick lesson learned | post-it-notes.md | ID, Date, Category, Insight, Code Artifacts |
| Debugging methodology | debug-patterns.md | Pattern #, Problem, Root Cause, Solution, Verification |
| System architecture change | replit.md | Recent Updates section with date |
| User preference/philosophy | replit.md | User Preferences section |

### How to Invoke the Watchdog

**Automatic**: Watchdog runs every 3-5 conversation turns (no action needed)

**Manual Trigger Points**:
- Before marking task as complete
- After fixing critical bug
- After implementing major feature
- User explicitly requests documentation update

**Watchdog Algorithm** (see `watchdog-process.md` for details):
1. Check: "Have any post-its been added in last 5 turns?"
2. If NO: Review conversation for patterns/insights
3. Extract 1-3 valuable lessons
4. Add to post-it-notes.md with code artifact links
5. Update debug-patterns.md if new methodology discovered

### How to Query Existing Knowledge

**Search Post-its**:
```bash
# Find database-related insights
grep -i "database" post-it-notes.md

# Find error handling patterns
grep -i "error" post-it-notes.md

# List all implemented post-its
grep "\[x\]" post-it-notes.md
```

**Search Debug Patterns**:
```bash
# Find patterns by keyword
grep -A 10 "Pattern #" debug-patterns.md | grep -i "null-safety"

# View all root causes
grep "Root Cause" debug-patterns.md
```

**Integration Example**:
```
You: "Database query returning null errors"
→ Search post-it-notes.md for "database" + "null"
→ Find Post-it #001: Database Null-Safety Pattern
→ Follow link to debug-patterns.md Pattern #1
→ Apply multi-layer defensive coding solution
→ Verify with multi-angle approach
→ Done! No need to re-learn this lesson.
```

### Knowledge Flywheel Effect

Each interaction adds momentum:
1. **Work on feature** → Discover insight
2. **Capture in post-it** → Knowledge base grows
3. **Watchdog verifies** → Nothing missed
4. **Future work** → Search knowledge base first
5. **Apply existing pattern** → Work faster
6. **Discover new edge case** → Capture → Flywheel accelerates

**The goal**: Never re-learn what we already know. Permanent elevation through disk stacking.
```

---

## Customization Tips

### 1. Add Project-Specific Examples

After the "Integration Example" section, add examples specific to your project:

```markdown
**Your Project Example**:
```
You: "How do we handle [YOUR SPECIFIC PROBLEM]?"
→ Search post-it-notes.md for "[YOUR DOMAIN]"
→ Find Post-it #XXX: [YOUR PATTERN NAME]
→ Apply solution
→ Works! Saved 2 hours of debugging.
```
```

### 2. Update bash Examples

Replace generic search terms with your actual categories:

```bash
# Instead of generic "database"
grep -i "stripe" post-it-notes.md  # If you use Stripe
grep -i "tensorflow" post-it-notes.md  # If you use TensorFlow
grep -i "checkout" post-it-notes.md  # If building e-commerce
```

### 3. Link to Your Architecture

If you have existing architecture documentation, cross-reference it:

```markdown
### Related Documentation

- `architecture.md` - System architecture overview
- `post-it-notes.md` - Lessons learned from implementation
- `debug-patterns.md` - Troubleshooting common issues
- `api-docs.md` - API endpoint documentation
```

---

## For Existing Replit Projects

If you already have a well-documented `replit.md`, you can:

1. **Keep your existing structure**
2. **Add "Knowledge Management" section** near the top
3. **Link to knowledge files** instead of duplicating content
4. **Update "Recent Updates" section** when major features are added

Example minimal addition:

```markdown
## Knowledge Management

This project uses automated knowledge capture. When stuck, search these files:

- **`post-it-notes.md`** - Lessons learned, patterns, bug fixes
- **`debug-patterns.md`** - Debugging methodologies with verification steps
- **`watchdog-process.md`** - How the automated capture works

The watchdog runs every 3-5 prompts and captures insights automatically.

Quick search:
```bash
grep -i "your problem keyword" post-it-notes.md
```
```

---

## Integration Checklist

Before you're done integrating:

- [ ] Copied contributor onboarding section to replit.md (or added minimal link)
- [ ] Customized bash examples with project-specific terms
- [ ] Added project-specific example to "Integration Example"
- [ ] Cross-referenced existing documentation (if applicable)
- [ ] Updated Recent Updates section with integration date
- [ ] Tested search commands to verify they work
- [ ] Informed team about new knowledge system

---

## Team Communication Template

Send this to your team after integration:

```
Subject: New Knowledge Management System

Hi team,

We've added an automated knowledge capture system to the project:

📝 Post-it Notes (post-it-notes.md) - Search here when stuck
🔍 Debug Patterns (debug-patterns.md) - Debugging methodologies
🤖 Watchdog (watchdog-process.md) - Runs automatically every 3-5 prompts

**How it helps you**:
- Searchable lessons learned from past bugs
- Debugging patterns with verification steps
- Never re-learn what we already know

**Quick search**:
```bash
grep -i "keyword" post-it-notes.md
```

**Manual post-its**:
When you fix a tricky bug or discover a pattern, add it to post-it-notes.md.
The watchdog will also capture insights automatically.

See replit.md for full guide.

Let me know if you have questions!
```

---

## Maintenance Responsibilities

### AI Agent Responsibilities
- Run watchdog every 3-5 prompts
- Extract and capture insights
- Update Code Artifacts Cross-Reference
- Link related post-its and patterns

### Human Developer Responsibilities
- Add manual post-its for important discoveries
- Review watchdog captures weekly
- Merge duplicates if semantic hash missed them
- Update taxonomy as project evolves

### Tech Lead Responsibilities
- Monitor knowledge base growth (aim for 10-20 post-its/month)
- Ensure team is searching before debugging
- Promote knowledge capture in code reviews
- Quarterly review of most-referenced patterns

---

## Success Metrics

Track these to measure effectiveness:

✅ **Post-its per month**: Aim for 10-20 steady accumulation  
✅ **Search-first rate**: % of times team searches before debugging  
✅ **Onboarding time**: New developers reference post-its during ramp-up  
✅ **Code review mentions**: "Did you add a post-it for this?" becomes standard  
✅ **Repeat issues**: Decreasing frequency of same bugs  

---

## Related Documentation

- **README.md** - Knowledge system overview
- **QUICKSTART.md** - 5-minute setup guide
- **EXAMPLES.md** - Real-world usage across domains
- **knowledge-config.yaml** - Configuration settings

---

**Integration is a one-time 15-minute task. The benefits compound forever.** 🚀
