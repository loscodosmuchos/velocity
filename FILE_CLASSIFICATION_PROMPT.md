# File Classification & Code Content Analysis Prompt

**Purpose:** Efficiently classify and categorize all project files by code type and functionality, generating comprehensive documentation for onboarding and architectural reference.

**Time Estimate:** 5-10 minutes of agent execution  
**Output:** `FILE_CLASSIFICATION.md` with complete file inventory

---

## Execution Instructions

### Phase 1: Gather Project Metadata (Parallel Execution)

Execute these commands in parallel to collect file structure and statistics:

```bash
# FILE COUNTS & STRUCTURE
find ./src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | wc -l
find ./server -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.ts" \) | wc -l

# COMPLETE FILE LISTINGS (sorted)
find ./src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | sort
find ./server -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.ts" \) | sort

# DIRECTORY STRUCTURE
find ./src -type d -maxdepth 2 | sort
find ./server -type d -maxdepth 1 | sort

# LINES OF CODE (CRITICAL METADATA)
find ./src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec wc -l {} + | tail -1
find ./server -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.ts" \) -exec wc -l {} + | tail -1

# LINES PER FILE (Identify complexity hotspots)
find ./src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec wc -l {} + | sort -rn | head -30
find ./server -type f \( -name "*.js" -o -name "*.cjs" \) -exec wc -l {} + | sort -rn | head -20

# DIRECTORY SIZES (Storage/complexity breakdown)
du -sh ./src ./server ./src/components ./src/pages ./src/utils 2>/dev/null

# GIT METADATA (Commit frequency, last modified)
git log --follow --format="%h|%ai|%an|%s" -- ./src | head -100
git log --follow --format="%h|%ai|%an|%s" -- ./server | head -50

# DEPENDENCY IMPORTS (External integrations - per file)
grep -r "^import\|^require" ./src --include="*.tsx" --include="*.ts" | head -50
grep -r "^const.*=.*require\|^import" ./server --include="*.cjs" --include="*.js" | head -30

# FILE TYPES & COUNTS
find ./src -type f | sed 's/.*\.//' | sort | uniq -c
find ./server -type f | sed 's/.*\.//' | sort | uniq -c

# TEST COVERAGE (if exists)
find ./src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" | wc -l
find ./server -name "*.test.js" -o -name "*.spec.js" | wc -l

# CONFIG FILES
ls -la ./ | grep -E "vite|tailwind|tsconfig|eslint|package\.json"

# TOTAL PROJECT SIZE
du -sh . 2>/dev/null
```

### Phase 2: Analyze by Category

Group files by their purpose and functionality:

**Frontend Categories:**
1. **UI Components** (`src/components/ui/`) - Foundational reusable components
2. **Refine-UI Framework** (`src/components/refine-ui/`) - Admin framework components
3. **Alert System** (`src/components/alert-icons/`) - Alert visualization
4. **Dashboard System** (`src/components/dashboard/`) - Dashboard builder
5. **Admin Components** (`src/components/admin/`) - Admin control panels
6. **Premium/Custom** (`src/components/`) - Velocity-specific high-value components
7. **Page Components** (`src/pages/`) - Full-page feature views
8. **Utilities** (`src/utils/`) - Business logic, API integration
9. **Services** (`src/services/`) - Core service implementations
10. **Contexts/Providers** (`src/contexts/`, `src/providers/`) - State management
11. **Type Definitions** (`src/types/`) - TypeScript interfaces
12. **Theme/Design** (`src/themes/`, `src/lib/`, `src/config/`) - Design system
13. **Hooks** (`src/hooks/`) - Custom React hooks

**Backend Categories:**
1. **Main Server** (`server/index.cjs`) - Express app entry point
2. **Configuration** (`server/config/`) - Database and app config
3. **Routes** (`server/routes/`) - API endpoint definitions
4. **Services** (`server/services/`) - Business logic
5. **Database** (`server/database/`) - Schema and seeds
6. **Parsers** (`server/parsers/`) - Document parsing
7. **Scripts** (`server/scripts/`) - Database utilities

### Phase 3: For Each File Category, Document COMPREHENSIVE METADATA:

For each file, capture in a standardized format:

**Core Identity:**
- **File name** and relative path
- **File size** - Lines of code (LOC)
- **File type** - tsx/ts/js/cjs/etc
- **Code type** - React Component, Service, Utility, TypeScript type, Hook, Config, etc.

**Functionality:**
- **Purpose** - 1-2 line summary of what it does
- **Feature area** - Which domain (contractors, invoices, AI, etc.)
- **Pain points solved** - How many and which ones

**Technical Details:**
- **Key features** - Notable patterns or implementations
- **Dependencies** - Major imports/external services
- **External integrations** - Claude, ElevenLabs, Twilio, pgvector, etc. (if applicable)
- **State management** - How data flows (context, hooks, providers, etc.)
- **Complexity indicators** - Critical file (high traffic/importance), complex logic, hotspot (>500 LOC)

**Evolution Metadata:**
- **Last modified** - Date from git logs
- **Commit frequency** - How often changed (from git log count)
- **Author/maintainer** - Who last touched it (from git)
- **Related files** - What other files it imports/depends on

**Quality Metrics:**
- **Test coverage** - If test files exist for this file
- **Performance impact** - Render-blocking, slow queries, expensive operations (if any)
- **Security considerations** - Auth required? API keys? Data sensitivity?
- **Deprecation status** - Active, legacy, pending removal?

**Documentation Cross-Reference:**
- **Referenced in docs** - If mentioned in PROJECT_ORIGIN_STORY, replit.md, etc.
- **Architectural decision** - If this file represents a key decision

**Metadata Table Format (for documentation):**
```
| File | LOC | Type | Purpose | Integrations | Last Modified | Commits | Criticality |
|------|-----|------|---------|--------------|---------------|---------|-------------|
| ... | ... | ... | ... | ... | ... | ... | ... |
```

### Phase 4: Generate Comprehensive Documentation

Create `FILE_CLASSIFICATION.md` with these sections:

1. **Executive Summary**
   - Total file counts by category
   - High-level organization overview
   - Key metrics (LOC, file sizes, etc.)

2. **Frontend Structure**
   - Each component directory with detailed file listings
   - Tables showing file name → functionality mapping
   - Code patterns and styling approach

3. **Page Components**
   - Organized by feature area (contractors, invoices, etc.)
   - Pain points solved per page
   - Relationships to other pages

4. **Utilities & Services**
   - AI integration files
   - Data processing utilities
   - API integration points

5. **Contexts & Providers**
   - State management structure
   - Provider hierarchy

6. **Type Definitions**
   - Core domain types
   - Dashboard types

7. **Theme & Design System**
   - Color system documentation
   - Design tokens

8. **Backend Structure**
   - Routes table with endpoints
   - Services and configuration
   - Database layer

9. **Key Architectural Decisions**
   - Authenticity Pillar
   - Multi-tenant approach
   - Component composition patterns
   - API-driven architecture

10. **Summary Statistics**
    - File counts by type
    - Lines of code totals
    - Project size breakdown

---

## Template Structure for FILE_CLASSIFICATION.md

```markdown
# [Project Name] - Complete File Classification & Code Content Index

**Document Generated:** [DATE]
**Total Files Analyzed:** [N] ([FRONTEND] frontend + [BACKEND] backend)

## Overview by Category
[Table with counts and purposes]

## Frontend Structure (src/)
[Subsections for each component directory]
- Category heading
- Purpose statement
- Table of files with descriptions
- Code patterns used

## Page Components (src/pages/)
[Subsections for each feature area]

## Utilities & Services

## Contexts & Providers

## Type Definitions

## Theme & Design System

## Backend Structure (server/)

## Code Organization Patterns

## Security & Authentication

## Data Flow Architecture

## Key Architectural Decisions

## Summary Statistics
[Table with metrics]

## Development Workflow
```

---

## Key Questions to Answer for Each Section

### For Component Directories:
- What UI framework/pattern is used (shadcn/ui, Radix, custom)?
- What design system is applied?
- How are components composed?
- What are common props patterns?

### For Page Components:
- What feature does this page enable?
- How many pain points does it solve?
- What data does it display?
- What actions can users take?

### For Utilities:
- What external services does it integrate with?
- What business logic does it implement?
- How is error handling done?

### For Backend:
- What endpoints are exposed?
- What authentication/authorization is required?
- What database operations occur?
- What external APIs are called?

---

## Documentation Best Practices

✅ **DO:**
- Use tables for file listings (easy scanning)
- Group related files together
- Show hierarchy (parent → children)
- Include code counts where relevant
- Link functionality to business value
- Document external integrations clearly
- Show data flow and architecture patterns

❌ **DON'T:**
- List every single function (too verbose)
- Use jargon without explanation
- Mix unrelated categories
- Leave code patterns undocumented
- Forget security/auth considerations
- Omit integration points

---

## Execution Checklist

- [ ] Phase 1: Gather metadata (bash commands)
- [ ] Phase 2: Analyze files by category
- [ ] Phase 3: Document each file with functionality
- [ ] Phase 4: Write comprehensive `FILE_CLASSIFICATION.md`
- [ ] Verify: All major files are categorized
- [ ] Verify: Code patterns are explained
- [ ] Verify: Architecture decisions are documented
- [ ] Verify: Metrics are accurate
- [ ] Commit document to repository

---

## Output Success Criteria

The resulting documentation should allow:

1. **Onboarding:** New team members understand project structure in 10 minutes
2. **Navigation:** Anyone can find a specific feature or component quickly
3. **Architecture:** How the system fits together is clear
4. **Dependencies:** External integrations are visible
5. **Patterns:** How to build new features is evident
6. **Maintenance:** Code organization rationale is explained
7. **Metrics:** Project scope is quantifiable

---

## Reuse Tips

- **For Different Projects:** Replace file paths (e.g., `./src/` → `./app/`) and adapt categories to match tech stack
- **For Incremental Updates:** Run Phase 1 quarterly to update metrics, regenerate tables
- **For Team Sharing:** Use this prompt in team documentation/wiki
- **For Code Reviews:** Reference FILE_CLASSIFICATION during PR reviews to ensure files are in right categories

---

## Integration with Project Documentation

This prompt complements:
- **PROJECT_ORIGIN_STORY.md** - Evolution and history
- **replit.md** - Current project state
- **Architecture docs** - System design details
- **README.md** - Quick start guide

Together they form comprehensive project knowledge base.

