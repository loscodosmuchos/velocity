# AI Insight Extraction System - Complete Technical Guide
**Version:** 1.0  
**Date:** November 6, 2025  
**Authors:** Human + AI Collaboration  
**Status:** Active Technical Standard  
**Purpose:** Complete guide for extracting, organizing, and documenting insights from conversations

---

## 🎯 Document Purpose

**This is a meta-guide** - it documents the system I used to create all the other insight documents you see in this project.

**Target audience:** New AI instances in other Repl projects who need to replicate this insight extraction and documentation system.

**What you'll learn:**
1. How to extract valuable insights from conversations
2. How to gauge importance and prioritize
3. How to structure and format insight documents
4. How to organize files and directories
5. How to preserve context and relationships
6. How to make insights actionable and searchable

---

## Table of Contents

1. [System Overview](#system-overview)
2. [The Extraction Process](#extraction-process)
3. [Value Assessment](#value-assessment)
4. [Document Creation](#document-creation)
5. [File Organization](#file-organization)
6. [Naming Conventions](#naming-conventions)
7. [Context Preservation](#context-preservation)
8. [Quality Standards](#quality-standards)
9. [Integration Features](#integration-features)
10. [Real-World Examples](#real-world-examples)

---

## System Overview

### The Problem This Solves

**Knowledge evaporation** - Valuable insights from conversations disappear unless systematically captured.

**Conversation flow:**
```
User: "Here's an interesting concept..."
AI: "Great analysis! Let me explore this..."
[10 messages of deep discussion]
Result: Insights lost in chat history
```

**With this system:**
```
User: "Here's an interesting concept..."
AI: "Great analysis! Let me explore this..."
[10 messages of deep discussion]
AI: Creates standalone document capturing insights
Result: Permanent, searchable, shareable knowledge
```

### Core Principles

**1. When In Doubt, Doc It Out**
- If it took >5 minutes to discuss, document it
- If it's reusable, document it
- If it matters, document it

**2. Harvest-Classify-Store-Retrieve-Deploy**
- Extract insights from conversations
- Classify by type and importance
- Store in organized structure
- Enable easy retrieval via search
- Make insights deployable/actionable

**3. Context Preservation > Raw Storage**
- Always capture WHY alongside WHAT
- Include decision history and iteration process
- Document what was rejected and why
- Preserve user quotes and rationale

**4. Progressive Enhancement**
- Start with quick capture
- Enhance with examples over time
- Link related insights
- Build knowledge graph

---

## The Extraction Process

### Step 1: Identify Extractable Insights

**During conversation, watch for:**

✅ **Patterns and methodologies**
- "Here's how we approach X"
- "The pattern is: A → B → C"
- "Always do X before Y"

✅ **Decisions with rationale**
- "We chose X over Y because..."
- "After trying A, B, C, we settled on D"
- "The reason we don't do X is..."

✅ **Problems and solutions**
- "The problem was X, we solved it with Y"
- "This bug happens because of Z"
- "The workaround is..."

✅ **Philosophies and principles**
- "Our core belief is..."
- "The fundamental approach is..."
- "We prioritize X over Y because..."

✅ **Processes and workflows**
- "Here's the step-by-step approach"
- "The evaluation framework is..."
- "The checklist includes..."

✅ **Iteration histories**
- "We tried 8 different naming conventions..."
- "The evolution was: V1 → V2 → V3"
- "We rejected X because..."

### Step 2: Assess Extractability

**Ask yourself:**

**Is it generalizable?**
- Can this apply to other situations?
- Is it reusable beyond this specific case?
- Would other projects benefit from this?

**Is it non-obvious?**
- Would someone else naturally know this?
- Does it contain nuance or gotchas?
- Is there expertise embedded in it?

**Is it complete enough?**
- Do we have enough context to explain it?
- Can we provide examples?
- Is the rationale clear?

**If YES to 2+ questions → Extract it**

### Step 3: Determine Document Type

**Standalone insight document:**
- Complex topic worth dedicated attention
- Multiple related concepts to explain
- Requires examples and deep explanation
- Universal/shareable across projects

**Post-it note entry:**
- Quick lesson or gotcha
- Specific code pattern
- Implementation detail
- Project-specific insight

**Update to existing doc:**
- Refinement of existing concept
- Additional example
- New related insight

---

## Value Assessment

### Quantifying Importance

**Use this scoring system (0-100):**

**High Value (80-100):**
- Solves recurring problems
- Saves significant time (30+ min per use)
- Broadly applicable across domains
- Contains non-obvious expertise
- Examples: Core philosophies, universal patterns, debugging methodologies

**Medium Value (50-79):**
- Solves specific problems well
- Saves moderate time (10-30 min)
- Applicable within domain
- Contains useful guidelines
- Examples: UX frameworks, code patterns, best practices

**Low Value (20-49):**
- Solves narrow problems
- Saves some time (5-10 min)
- Very specific use case
- Helpful but not critical
- Examples: Specific gotchas, config details, minor optimizations

**Minimal Value (0-19):**
- One-time solutions
- Obvious knowledge
- Temporary workarounds
- Limited applicability
- Examples: Specific bug fixes, deprecated approaches

**Threshold:** Extract if value score ≥ 40

### Time-Saved Calculation

**Formula:**
```
Value Score = (Time Saved per Reuse × Reuse Frequency) + (Breadth of Applicability × 10)

Where:
- Time Saved = Minutes saved each time insight is applied
- Reuse Frequency = Estimated times insight will be used (1-10 scale)
- Breadth = How many domains/projects it applies to (1-10 scale)
```

**Example:**
```
Multi-Angle Verification Methodology:
- Time Saved: 30 min per bug fix
- Reuse Frequency: 8/10 (used often)
- Breadth: 10/10 (applies to all debugging)

Score = (30 × 8) + (10 × 10) = 240 + 100 = 340
Normalized to 0-100 scale = 95/100 (Very High Value)
```

### Importance Indicators

**Critical importance signals:**
- 🚨 User explicitly says "this is important"
- 🚨 User says "make sure to document this"
- 🚨 Took multiple conversation turns to resolve
- 🚨 Applies to core workflows
- 🚨 Represents fundamental philosophy

**High importance signals:**
- ⚠️ Solves frustrating problem
- ⚠️ Contains nuanced decision-making
- ⚠️ Iteration history preserved
- ⚠️ User emphasized it multiple times

**Medium importance signals:**
- 📝 Useful pattern discovered
- 📝 Good example of principle
- 📝 Helpful for future reference

---

## Document Creation

### Document Structure Template

```markdown
# [Topic Name] - [Descriptive Subtitle]
**Version:** 1.0  
**Date:** YYYY-MM-DD  
**Authors:** Human + AI Collaboration  
**Status:** Active [Type]  
**Purpose:** [One sentence describing what this document does]

---

## 🎓 FOR NEW AI INSTANCES: Context & Decision History
[If naming/organizational decisions were made, explain them here]

---

## The Core Principle
> **"[Memorable quote capturing essence]"**

[Brief explanation of the core idea]

---

## [Main Content Sections]
[Well-organized content with clear headers]

---

## Real-World Examples
[Concrete examples demonstrating the concept]

---

## [Implementation/Application Section]
[How to actually use this insight]

---

## Common Pitfalls
[What NOT to do, common mistakes]

---

## Integration with Other Systems
[How this relates to other insights/documents]

---

## Success Metrics
[How to measure if this is working]

---

## Personal Reflections (AI Perspective)
[OPTIONAL: AI's thoughts, speculations, meta-insights]

---

## Document Changelog
**v1.0** (YYYY-MM-DD)
- Initial creation
- [Major sections included]

---

## License & Usage
**License:** Open [Type] - freely shareable  
**Attribution:** [Project Name]  
**Usage:** [How others can use this]
```

### Content Quality Standards

**Every insight document must include:**

✅ **Clear purpose statement**
- What problem does this solve?
- Who is this for?
- When should they use it?

✅ **Core principle or quote**
- Memorable distillation of the concept
- Quotable, shareable essence

✅ **Real-world examples**
- Concrete, not abstract
- Actual code or scenarios
- Before/after comparisons

✅ **Context and rationale**
- WHY this approach was chosen
- What alternatives were considered
- What was rejected and why

✅ **Actionable guidance**
- How to apply this insight
- Checklists or templates
- Step-by-step instructions

✅ **Integration notes**
- How this relates to other insights
- Cross-references to related documents
- Where this fits in the bigger picture

✅ **Changelog and versioning**
- When was this created
- What major changes have occurred
- Who contributed

### Writing Style Guidelines

**DO:**
- ✅ Use clear, everyday language
- ✅ Provide concrete examples
- ✅ Include code snippets
- ✅ Use visual formatting (tables, lists, code blocks)
- ✅ Tell stories (how we arrived at this)
- ✅ Be thorough - err on side of detail
- ✅ Include your perspective as AI
- ✅ Speculate and pontificate (mark as such)

**DON'T:**
- ❌ Use jargon without explanation
- ❌ Be vague or abstract
- ❌ Skip the WHY
- ❌ Assume reader knows context
- ❌ Rush - quality over speed
- ❌ Hide opinions - share them
- ❌ Delete - only append/enhance

---

## File Organization

### Directory Structure

```
/
├── AI-insights/                     # AI-generated insight documents
│   ├── [topic]__AI-INSIGHTS___[AppName].md
│   ├── ai-insight-extraction-system-complete-guide__AI-INSIGHTS___AssetGenius.md
│   ├── disk-stacking-knowledge-philosophy__AI-INSIGHTS___AssetGenius.md
│   ├── file-organization-policy__AI-INSIGHTS___AssetGenius.md
│   ├── journey-based-ux-evaluation__AI-INSIGHTS___AssetGenius.md
│   ├── knowledge-system-usability-patterns__AI-INSIGHTS___AssetGenius.md
│   ├── multi-angle-verification-debugging__AI-INSIGHTS___AssetGenius.md
│   ├── trust-but-verify-development-philosophy__AI-INSIGHTS___AssetGenius.md
│   ├── when-in-doubt-doc-it-out__AI-INSIGHTS___AssetGenius.md
│   └── ...
│
├── knowledge-base/                  # Optional subdirectory organization
│   ├── operations/                  # Living operational documents
│   │   ├── post-it-notes.md
│   │   ├── debug-patterns.md
│   │   ├── watchdog-process.md
│   │   └── replit.md
│   │
│   ├── evaluations/                 # UX evaluations, assessments
│   │   ├── [feature]-evaluation.md
│   │   └── ...
│   │
│   └── policies/                    # Rules, standards, conventions (if not in AI-insights/)
│       └── ...
│
├── client/                          # Frontend code
├── server/                          # Backend code
├── shared/                          # Shared types
├── attached_assets/                 # User-provided files
└── [config files]                   # package.json, tsconfig.json, etc.
```

### Directory Purposes

**`AI-insights/`** ⭐ **PRIMARY LOCATION FOR ALL AI-INSIGHTS DOCUMENTS**
- AI-generated analysis documents
- Consolidated insights from conversations
- Cross-domain learnings
- Universal patterns and philosophies
- Meta-insights (learning about learning)
- Policies and standards documents
- **Update frequency:** Created once, rarely modified (append-only)
- **Naming:** `topic__AI-INSIGHTS___AppName.md`
- **Why top-level:** Easy to find, clearly labeled, immediately visible
- **Easy identification:** All AI-generated insight documents in one place

**`knowledge-base/operations/`** (Optional subdirectory)
- Living documents updated frequently
- Post-it notes queue
- Debug patterns
- Watchdog process
- Project overview (replit.md)
- **Update frequency:** Multiple times per session
- **Naming:** Simple descriptive names (no special suffix)

**`knowledge-base/evaluations/`** (Optional subdirectory)
- UX evaluations
- Code reviews
- Architecture assessments
- Feature analyses
- **Update frequency:** Created for specific reviews
- **Naming:** `[topic]-evaluation.md` or `[feature]-assessment.md`

**Note:** The `AI-insights/` folder is the **required location** for all documents with the `__AI-INSIGHTS___` naming pattern. The `knowledge-base/` subdirectory structure is optional and can be used for organizing operational documents that don't follow the AI-INSIGHTS naming convention.

---

## Naming Conventions

### AI Insight Documents

**Pattern:** `topic-name__AI-INSIGHTS___AppName.md`

**Components:**
- **topic-name** - Descriptive topic with hyphens between words
- **`__`** - Double underscore separator
- **AI-INSIGHTS** - Identifies as AI-generated
- **`___`** - Triple underscore separator (unique, easy to strip)
- **AppName** - Project/application name (removable for sharing)

**Examples:**
```
knowledge-system-usability-patterns__AI-INSIGHTS___AssetGenius.md
multi-angle-verification-debugging__AI-INSIGHTS___AssetGenius.md
disk-stacking-knowledge-philosophy__AI-INSIGHTS___AssetGenius.md
```

**Evolution (how we got here):**

Iteration 1: `TOPIC-NAME.MD` (all caps)
- ❌ Hard to read, looks like screaming

Iteration 2: `topic-name-AI-INSIGHTS.md` (single dash)
- ❌ Conflicts with topic hyphens

Iteration 3: `AI-INSIGHTS--AppName--topic-name.md` (app in middle)
- ❌ Topic not immediately visible

Iteration 4: `topic-name__AI-INSIGHTS__AppName.md` (same separator)
- ❌ Can't distinguish app boundary

Iteration 5: `topic-name__AI-INSIGHTS___AppName.md` ✅ **FINAL**
- ✅ Topic first (most important)
- ✅ Double underscore before AI-INSIGHTS
- ✅ Triple underscore before app name (easy to strip)

**Why this matters:**
- Topic-first enables alphabetical browsing
- Different separators allow programmatic parsing
- App name removable for universal sharing

**Sharing across projects:**
```bash
# Original
knowledge-system-usability-patterns__AI-INSIGHTS___AssetGenius.md

# Strip app name for sharing
knowledge-system-usability-patterns__AI-INSIGHTS.md

# Add new app name
knowledge-system-usability-patterns__AI-INSIGHTS___NewProject.md
```

### Operational Documents

**Pattern:** `descriptive-name.md` (no special suffix)

**Examples:**
```
post-it-notes.md
debug-patterns.md
watchdog-process.md
replit.md
```

**Why no suffix:** These are living documents frequently updated, not standalone insights.

### User-Provided Files

**Pattern:** Keep original naming, store in `attached_assets/`

**Reason:** Preserve user's file organization and naming preferences.

---

## Context Preservation

### The WHY is More Important Than the WHAT

**Bad documentation:**
```markdown
# Naming Convention
Use `topic__AI-INSIGHTS___AppName.md`
```

**Good documentation:**
```markdown
# Naming Convention

**Pattern:** `topic__AI-INSIGHTS___AppName.md`

**Why this specific format:**
- Topic first: Most important, enables browsing
- Double underscore: Different from topic hyphens
- Triple underscore: Easy to strip app name programmatically
- App name at end: Removable for universal sharing

**Evolution:** We tried 8 iterations before this...
[Full iteration history with what was rejected and why]

**User quote:** "Keep separator different so it can be removed if needed later"
```

### Capturing Decision History

**Always document:**
1. **What was decided** - The final choice
2. **What alternatives were considered** - Options evaluated
3. **Why this was chosen** - Selection rationale
4. **What was rejected and why** - Failed approaches
5. **User feedback that guided decisions** - Actual quotes
6. **Iteration process** - How we got from V1 to final

**Example structure:**
```markdown
## Decision History

### The Problem
[What we were trying to solve]

### Iteration 1: [Approach]
- Tried: [What we did]
- Problem: [Why it failed]
- Rejected: [Why we moved on]

### Iteration 2: [Approach]
- Tried: [What we did]
- Problem: [Why it failed]
- User feedback: "[Actual quote]"
- Improved but not final

...

### Final Decision: [Approach]
- Tried: [What we did]
- Why it works: [Rationale]
- User confirmation: "[Actual quote]"
- ✅ This became our standard
```

### Preserving User Voice

**Include actual user quotes:**
- Provides authority and context
- Shows collaborative decision-making
- Captures user philosophy and values
- Makes documentation more authentic

**Format:**
```markdown
**User quote:** "When in doubt, doc it out!"
**User philosophy:** "Trust each other, verify firsthand with screenshots"
**User feedback:** "Make separator different so it can be removed later"
```

---

## Quality Standards

### Completeness Checklist

**Every insight document should have:**

```
□ Clear title and subtitle
□ Metadata (version, date, authors, status, purpose)
□ Context for new AI instances (if applicable)
□ Core principle or memorable quote
□ Main content with clear sections
□ Real-world examples (minimum 2)
□ Code snippets (if applicable)
□ Common pitfalls section
□ Integration with other systems
□ Success metrics
□ Personal reflections (optional but encouraged)
□ Document changelog
□ License and usage guidance
```

### Review Before Publishing

**Ask yourself:**

**Is it clear?**
- Can a new AI understand this without prior context?
- Are technical terms explained?
- Are examples concrete?

**Is it complete?**
- Does it cover the full topic?
- Are edge cases mentioned?
- Are alternatives discussed?

**Is it actionable?**
- Can someone apply this immediately?
- Are there templates or checklists?
- Is there step-by-step guidance?

**Is it connected?**
- Does it link to related insights?
- Does it reference source materials?
- Does it fit in the knowledge graph?

**If NO to any → Enhance before publishing**

---

## Integration Features

### Startup Health Check System

**Purpose:** Provide diagnostic context automatically at startup

**Implementation:**
```typescript
// On application startup
async function startupHealthCheck() {
  // Check last 5 execution logs
  const recentExecutions = await getLastNExecutions(5);
  
  // Assess health
  const allSuccessful = recentExecutions.every(e => e.status === 'success');
  const recentFailures = recentExecutions.filter(e => e.status === 'failed');
  
  // Set diagnostic context
  if (allSuccessful) {
    console.log('✅ Last 5 executions successful - system healthy');
    diagnosticContext.baseline = 'healthy';
  } else {
    console.log(`⚠️ ${recentFailures.length} recent failures detected`);
    console.log('Recent failure patterns:', recentFailures.map(f => f.error));
    diagnosticContext.baseline = 'degraded';
    diagnosticContext.knownIssues = recentFailures;
  }
  
  // Benefits:
  // - Don't waste time investigating non-issues
  // - Know upfront if system is degraded
  // - Pattern recognition across failures
}
```

**Why this matters:**
- Saves troubleshooting time
- Provides critical context immediately
- Prevents going down irrelevant diagnostic paths
- Shows patterns across multiple failures

### Admin Post-it Notes Dashboard

**Purpose:** Visibility into captured insights and their effectiveness

**Features to implement:**

**1. Post-it Notes Listing**
```typescript
interface PostItNote {
  id: number;
  title: string;
  category: string;
  insight: string;
  dateCreated: Date;
  status: 'pending' | 'implemented' | 'verified';
  prompt: string;              // What prompted this post-it
  context: string;             // Situation when created
  appliedCount: number;        // How many times used
  timesSaved: number;          // Minutes saved (estimated)
  effectiveness: number;       // 0-100 score
}
```

**2. Dashboard Views**
- All post-its with filters (category, status, date)
- Timeline view (when posted, what prompted)
- Effectiveness metrics (which ones helped most)
- Application tracking (where/when applied)
- Search and filtering

**3. Effectiveness Quantification**
```typescript
function calculateEffectiveness(postIt: PostItNote): number {
  // Factors:
  // - Times applied (usage frequency)
  // - Time saved per application
  // - User feedback (was it helpful?)
  // - Recency (recent applications weighted higher)
  
  const usageScore = Math.min(postIt.appliedCount * 10, 50);
  const timeScore = Math.min(postIt.timesSaved / 10, 30);
  const recencyScore = calculateRecencyBonus(postIt.lastApplied);
  
  return usageScore + timeScore + recencyScore;
}
```

**4. Admin Interface**
```typescript
// Route: /admin/post-it-notes
<PostItDashboard>
  <Filters>
    <CategoryFilter />
    <StatusFilter />
    <DateRangeFilter />
    <EffectivenessFilter />
  </Filters>
  
  <MetricsSummary>
    <Metric label="Total Post-its" value={count} />
    <Metric label="Implemented" value={implementedCount} />
    <Metric label="Total Time Saved" value={`${totalMinutes} min`} />
    <Metric label="Avg Effectiveness" value={avgScore} />
  </MetricsSummary>
  
  <PostItList>
    {postIts.map(p => (
      <PostItCard
        key={p.id}
        postIt={p}
        onView={() => showDetails(p)}
        onMarkApplied={() => incrementUsage(p)}
      />
    ))}
  </PostItList>
</PostItDashboard>
```

**Benefits:**
- Visibility into what's been captured
- Track which insights are most valuable
- Justify time spent documenting
- Identify gaps in coverage
- Measure ROI of knowledge system

### Request Fulfillment Watchdog System

**Purpose:** Ensure no user requests are dropped or forgotten during development

**Implementation:**

**Every 3-5 prompts (configurable), automatically:**
1. Review last N conversation turns
2. Extract all user requests/asks
3. Verify status: Completed / In Progress / Back Burner / Dropped
4. Log the check with results
5. Alert user if anything was dropped
6. Offer options (do now / defer to back burner / clarify)

**The Two Lists System:**

```typescript
// Priority List (Active Work)
interface PriorityList {
  tasks: Task[];
  currentlyWorking: Task | null;
  nextUp: Task[];
  status: 'active' | 'blocked' | 'completed';
}

// Back Burner List (Deferred Work) 
interface BackBurnerList {
  items: BackBurnerItem[];
  acknowledgedDate: Date;
  reason: string;              // Why deferred
  priority: 'high' | 'medium' | 'low';
  estimatedEffort: string;
}

interface BackBurnerItem {
  id: number;
  request: string;
  userQuote: string;
  acknowledgedDate: Date;
  reason: string;
  retrievedDate?: Date;        // When brought back to priority
  status: 'deferred' | 'retrieved' | 'cancelled';
}
```

**Watchdog Check Logging:**

```typescript
interface WatchdogCheck {
  id: number;
  timestamp: Date;
  promptRange: string;           // "Turns 45-50"
  totalRequests: number;
  completedCount: number;
  inProgressCount: number;
  backBurnerCount: number;
  droppedCount: number;
  droppedRequests: Request[];    // Details of what was missed
  actionTaken: string;
  status: 'clean' | 'found_issues';
}
```

**Admin Dashboard Views:**

- `/admin/watchdog-checks` - All watchdog check results
- `/admin/back-burner` - Items deferred for later
- Combined metrics and success rates
- Drill-down into dropped requests and actions taken

**Benefits:**
- Nothing gets forgotten or dropped
- User has confidence requests are tracked
- Transparent communication (proactive alerts)
- Back burner items preserved for later
- Audit trail of all checks and results

**See:** `AI-insights/request-fulfillment-watchdog-system__AI-INSIGHTS___AssetGenius.md` for complete documentation

---

## Real-World Examples

### Example Session: Today's Work

**Input:** User shared "Conversation Code Harvester" design document

**Extraction process:**

**Step 1: Initial read**
- Identified core patterns (Harvest-Classify-Store-Retrieve-Deploy)
- Recognized universal applicability
- Noted cross-domain insights

**Step 2: Value assessment**
- Scored: 95/100 (universal pattern, high reuse potential)
- Time saved: 30-60 min per application
- Breadth: Applies to any knowledge domain

**Step 3: Document creation**
- Created: `knowledge-system-usability-patterns__AI-INSIGHTS___AssetGenius.md`
- Included: Core patterns, quantified value, cross-domain applications
- Added: Personal AI perspective and speculations

**Step 4: Related extractions**
- User then discussed naming conventions
- Identified: This itself is an extractable insight
- Created: `file-organization-policy__AI-INSIGHTS___AssetGenius.md`
- Included: Full iteration history (8 attempts)
- Preserved: User quotes and decision rationale

**Step 5: Meta-insight**
- User said: "When in doubt, doc it out!"
- Recognized: This is the meta-principle itself
- Created: `when-in-doubt-doc-it-out__AI-INSIGHTS___AssetGenius.md`
- Documented: The documentation philosophy

**Step 6: Operational audit**
- Reviewed operational docs for valuable insights
- Extracted from post-it-notes.md:
  - Disk stacking philosophy
  - Trust but verify principle
- Extracted from debug-patterns.md:
  - Multi-angle verification methodology
- Extracted from ux-evaluation.md:
  - Journey-based evaluation framework

**Step 7: Meta-guide creation**
- User requested: "Document exactly what you're doing"
- Created: This document
- Purpose: Enable other AI instances to replicate process
- Included: Complete extraction workflow with examples

**Total output:**
- 7 standalone insight documents
- 1 comprehensive policy document
- 1 meta-guide (this document)
- All properly named and organized
- Full context preserved

**Time investment:** ~2 hours  
**Value created:** Permanent, reusable knowledge base  
**ROI:** Compound returns every time insights are applied  

---

## Workflow Summary

### Quick Reference: Extraction → Documentation

```
1. LISTEN during conversation
   ↓
2. IDENTIFY extractable insights
   ↓
3. ASSESS value (≥40/100 threshold)
   ↓
4. DETERMINE document type (standalone vs post-it)
   ↓
5. EXTRACT while context is fresh
   ↓
6. STRUCTURE using template
   ↓
7. PRESERVE context and rationale
   ↓
8. INCLUDE examples and code
   ↓
9. ADD personal reflections
   ↓
10. ORGANIZE in proper directory
    ↓
11. NAME using convention
    ↓
12. CROSS-REFERENCE related insights
    ↓
13. VERIFY completeness checklist
    ↓
14. PUBLISH (create file)
```

### Daily Practice

**Morning:**
- Review operational docs (post-it-notes.md, debug-patterns.md)
- Check for insights that should be extracted
- Plan any document creation

**During work:**
- Stay alert for extractable insights
- Note them immediately (don't rely on memory)
- Assess value in real-time

**End of day:**
- Extract any insights captured
- Create standalone documents while fresh
- Update cross-references
- Run completeness check

**Weekly:**
- Review all insights created
- Identify missing connections
- Enhance with additional examples
- Consider which insights should be shared universally

---

## Troubleshooting

### "How do I know if something should be extracted?"

**Ask:** Would I want to reference this 6 months from now?  
**Ask:** Could this help someone else?  
**Ask:** Did it take effort to figure out?

**If YES to any → Extract it**

### "The document feels incomplete"

**Check completeness checklist:**
- Missing examples? Add them
- Missing WHY? Explain rationale
- Missing context? Capture decision history
- Missing connections? Link related insights

**Remember:** Err on side of detail, not brevity

### "I'm not sure how to structure this"

**Use the template:**
1. Start with purpose and core principle
2. Add main content with clear sections
3. Include real-world examples
4. Document pitfalls and integration
5. Add personal reflections
6. Complete with changelog

**Don't overthink it - start writing, structure will emerge**

### "Should this be standalone or a post-it note?"

**Standalone if:**
- Complex topic requiring deep explanation
- Universal/shareable across projects
- Multiple related concepts to explain
- Deserves its own searchable document

**Post-it if:**
- Quick gotcha or specific pattern
- Project-specific detail
- Code-level implementation note
- Part of larger pattern (reference standalone)

---

## Success Metrics

### System Health Indicators

**Leading indicators:**
- Insights extracted per week (target: 2-5)
- Time from insight to documentation (target: <24 hours)
- Completeness score (target: 90%+)
- Cross-references added (target: 3+ per document)

**Lagging indicators:**
- Search success rate (can find insights when needed)
- Reuse rate (insights being applied)
- Time saved (measurable reduction in re-learning)
- Knowledge transfer (new team members learning from docs)

**Warning signs:**
- No insights extracted in a week
- Documents incomplete or rushed
- Context missing or unclear
- No cross-referencing happening
- Insights not being used

---

## Conclusion

**This system transforms ephemeral conversations into permanent knowledge.**

**The process:**
1. Extract insights while context is hot
2. Assess value objectively
3. Document thoroughly with context
4. Organize systematically
5. Make searchable and actionable
6. Build compound knowledge over time

**The outcome:**
- Never re-learn what you already know
- Knowledge compounds like interest
- Team becomes smarter than sum of individuals
- Onboarding is fast and effective
- Quality increases over time

**Remember:**
- **When in doubt, doc it out**
- **Context preservation > raw storage**
- **Quality over speed**
- **Err on side of detail**
- **Include your perspective**
- **Share liberally**

---

## Document Changelog

**v1.0** (November 6, 2025)
- Initial creation of meta-guide
- Documented complete extraction process
- Included real-world examples from today's session
- Added startup health check and admin dashboard features
- Provided templates and checklists

---

## License & Usage

**License:** Open System - freely adaptable  
**Attribution:** AssetGenius Project  
**Usage:** Replicate this system in any project, share improvements back
