# Architect Reference - Supporting Principles & Insights

**Purpose:** Non-critical but important architectural principles, design patterns, and operational guidelines. Reference this when making technical decisions, architectural choices, and optimization strategies.

**Note:** The 20 critical protocols in `replit.md` SET IN STONE are the immediate decision filters. This document provides deeper context, alternative patterns, and optimization techniques.

---

## Part 1: User-Centric Design Principles

### User-Anticipation-Driven Design
- Ask "What would users EXPECT and TRY?" NOT "What can we build?"
- See through user's eyes: Understand what users think, want, experience, and desire BEFORE they know it
- Problem Prevention > Problem Solving: Stop problems BEFORE they happen, not after fixing them
- Choice Architecture: Users CHOOSE to use your system because they want to, not because they're forced to
- Trust Through Transparency: Complete audit trails, confidence scores, reasoning visibility

### 6-Criteria Specification Framework
Every page/feature/API endpoint must satisfy:

1. **MVP Fields**: Absolute minimum required for functionality
2. **Nice-to-Have Fields**: Delighters that differentiate from competitors
3. **Click Behavior**: EVERY element interactive—anticipate user curiosity
4. **Metadata Context**: Chain of custody (who, when, where, what, why)
5. **User Anticipation**: What would users TRY/EXPECT/ASSUME?
6. **The Wow Factor**: Mind-blowing utility proving deep understanding of user's daily challenges

### Multi-Expert Lens-Switching Framework
Evaluate every feature through 10+ expert personas, each with:

- **Primary Fear**: Worst-case scenario that must be prevented
- **Daily Pain**: Recurring frustrations costing time/money/sanity
- **Success Metric**: How performance is measured
- **Decision Lens**: Priority hierarchy when evaluating solutions

---

## Part 2: Backend Architecture Patterns

### Responsibility Separation
- Backend handles: Data persistence, API calls, business logic ONLY
- Frontend-Heavy Philosophy: Put as much logic in frontend as possible (closer to user)
- Single Responsibility: Each service/endpoint does ONE thing well
- Thin Routes: Keep API routes as thin as possible; use service layer for logic
- Type Safety: Strong typing at boundaries (request validation, response contracts)

### Service-Oriented Architecture (SOA)
- **Independent Services**: Each service runs independently with auto-restart, hot-reload, fault isolation
- **Service Registry**: Central router/orchestrator for all services
- **Configuration-Driven**: Add services by editing config files (NO code changes required)
- **Graceful Degradation**: System continues functioning if any service fails
- **Loose Coupling**: Services communicate via well-defined protocols, not direct dependencies

### Backend Orchestration (NOT Peer-to-Peer)
- **Central Orchestrator**: Backend server orchestrates all inter-service calls
- **NOT Peer-to-Peer**: Services don't call each other directly; all flows go through orchestrator
- **Single Point of Control**: Centralized orchestration enables monitoring, error handling, rate limiting
- **Testability**: Easier to test and debug with centralized orchestration

### Singleton Pattern for Critical Infrastructure
- **Prevent Double Initialization**: Critical services use singleton pattern to ensure single instance
- **Eager Initialization**: Initialize BEFORE registering dependent routes/features
- **Throw on Access Before Ready**: If called before initialization, throw clear error
- **Race Condition Prevention**: Always await initialization before proceeding

---

## Part 3: Database & Data Management

### Caching Strategy
- **Cache by Composite Key**: Cache results by logical key (e.g., model_number + specs), not arbitrary IDs
- **Invalidate Correctly**: When source data changes, invalidate related cache entries (not "cache everything forever")
- **Metadata Tracking**: Record cache hit/miss rates, stale entry age, memory usage
- **TTL Awareness**: Set appropriate time-to-live based on data volatility

### Data Modeling Best Practices
- **Minimize Fields**: Don't add createdAt/updatedAt unless strictly necessary
- **Type-First**: Define data model in shared schema BEFORE writing any code
- **Schema Consistency**: Frontend, backend, database all use same type definitions
- **Validation at Boundaries**: Validate request bodies with Zod/similar before touching data

---

## Part 4: Error Handling & Resilience

### Error Handling Pattern
✅ **DO:**
- Use explicit error indicators in response contracts
- Log with context (who, when, what operation, why it failed)
- Provide actionable error information to users

❌ **DON'T:**
- Throw exceptions in API responses
- Silently fail or return generic "error" messages
- Expose internal system details to users

### Service Health Checks
- **Regular Monitoring**: Periodic health checks for all dependent services
- **Timeout Management**: Set realistic timeouts; fail fast rather than hang
- **Circuit Breaker**: Stop calling failing service after threshold; retry after delay
- **Fallback Values**: Have sensible defaults when external service unavailable

---

## Part 5: Performance & Optimization

### Token Efficiency Pattern
*Can save 92% API costs vs naive approach*

- **Metadata-Tracking**: Use metadata to avoid re-processing unchanged data
- **Incremental Updates**: Only process new/changed items; skip unchanged items
- **Checksum Verification**: Compare file size, date, hash to detect changes
- **Batch Operations**: Process multiple items in single API call vs individual calls

**Example:** File import where 1st import = full load (~60K tokens), subsequent imports = only changed (~5-15K tokens = 75-90% savings)

### Response Time Optimization
- **Measure Everything**: Page load times, API response times, database query times
- **Identify Bottlenecks**: 80% of slowness comes from 20% of code
- **Frontend Caching**: Cache computed values, memoize expensive calculations
- **Database Indexing**: Index frequently queried columns (see DEVELOPMENT_WISDOM.md)
- **Pagination**: Never return ALL records; paginate by default

### Cost Optimization
- **Serverless Where Possible**: Reduce fixed costs; pay only for what you use
- **Query Optimization**: Every query should be optimized (use `EXPLAIN ANALYZE`)
- **Batch Imports**: Process bulk data once, not piecemeal
- **Rate Limiting**: Prevent abuse; don't let one user consume all resources

---

## Part 6: Frontend Architecture

### State Management Pattern
- **Server State**: Use query cache (TanStack Query, SWR) for server-backed data
- **UI State**: Local component state for UI concerns (modals, forms, expanded/collapsed)
- **Never Duplicate**: If data comes from server, keep SINGLE source of truth
- **Optimistic Updates**: Update UI immediately; sync with server asynchronously

### Form Handling Best Practices
- **Controlled Components**: All inputs controlled by component state
- **Validation Schema**: Use Zod/Yup to validate both client and server
- **Error Display**: Show validation errors inline with clear guidance
- **Loading States**: Indicate when form submission is in progress
- **Default Values**: Always provide sensible defaults

### Routing Pattern
- **Type-Safe Routes**: All routes known at build time; no arbitrary paths
- **Nested Routes**: Organize routes hierarchically (not flat structure)
- **Link Component**: Use routing library's Link (not window.location)
- **useLocation Hook**: Get current location programmatically when needed

### Component Architecture
- **Minimal Files**: Collapse similar components into single file
- **Reusable Base Components**: shadcn/ui patterns vs custom components
- **Props Over Config Objects**: Clear prop interfaces better than opaque config
- **Composition Over Inheritance**: Build complex components from simple ones

---

## Part 7: Authentication & Authorization

### Session Management
- **Server-Side Sessions**: Store sessions in database/cache, not JWT in cookies
- **HTTP-Only Cookies**: Session ID in HTTP-only cookie (prevents XSS theft)
- **Session TTL**: Set reasonable expiration (7 days typical); refresh on activity
- **Logout**: Remove session from database; invalidate cookie

### Access Control Pattern
- **Differentiated Access**: Different experiences for unauthenticated vs authenticated users
- **Role-Based Access**: Check role/permissions before allowing operations
- **Data Isolation**: Users only see their own data (unless explicitly shared)
- **Audit Logging**: Log all access and modifications for compliance

### Secret Management
- **Never Hardcode**: Secrets only in environment variables or secure vaults
- **Rotation**: Periodically rotate secrets
- **Principle of Least Privilege**: Services only get secrets they need
- **Masking**: Never log or display secrets in errors

---

## Part 8: Monitoring & Observability

### The 13-Category Watchdog Ecosystem
Use metadata-tracking for constant-cost scaling (92% token reduction):

1. **Request Fulfillment**: Every 3-5 operations, verify no requests dropped
2. **Process Health**: Chain of custody—verify counts always increasing
3. **Cost & Budget**: Track API usage, spending trends, budget compliance
4. **Cache Effectiveness**: Hit/miss rates, stale entries, memory usage
5. **User Engagement**: DAU/WAU/MAU, retention cohorts, feature adoption
6. **Performance**: Page load, API response, database query performance
7. **Error Rate & Quality**: Failed operations, error trends, quality metrics
8. **Security & Auth**: Failed logins, suspicious activity, rate limiting
9. **Business Metrics**: Operations per day, revenue, support tickets, NPS
10. **Technical Debt**: TODOs, deprecated APIs, test coverage, code complexity
11. **System Health**: Data counts, performance degradation, aging items
12. **Workflow & Process**: Deployment frequency, build success, PR metrics
13. **Infrastructure**: Database size, connection pool, long-running queries, backups

### Logging Pattern
- **Structured Logging**: Log as JSON with context (timestamp, user, operation, status)
- **Log Levels**: ERROR, WARN, INFO, DEBUG (use appropriate level)
- **No Secrets in Logs**: Never log passwords, API keys, auth tokens
- **Searchable Logs**: Include unique IDs (request ID, user ID, session ID) for tracing

### Alerting Strategy
- **Actionable Alerts**: Alert only on things that need human intervention
- **Alert Fatigue Prevention**: Too many alerts = people ignore them
- **Threshold-Based**: Set thresholds (e.g., >5% error rate = alert)
- **Escalation**: Critical issues escalate faster than warnings

---

## Part 9: Knowledge Management & Learning Systems

### Knowledge Capture Pattern
- **Semantic Hashing**: Extract meaningful concepts from operations
- **Topic Extraction**: Identify key topics, relationships, patterns
- **Pattern Detection**: Find recurring issues and solutions
- **Context Preservation**: Store full context, not just summary
- **Confidence Scoring**: Rate reliability of each insight

### Knowledge Storage
- **In-Memory First**: Cache for fast access
- **Database-Ready**: Same schema for database persistence
- **Relationship Graph**: Connect related topics and insights
- **Pattern Aggregation**: Combine similar patterns into categories

### Debug Patterns Reference
- **Living Document**: Continuously updated with new debugging methodologies
- **Root Cause Analysis**: Document WHY issues occurred, not just HOW they were fixed
- **Solution Catalog**: Build searchable library of known issues + solutions
- **Verification Strategies**: How to verify fix actually worked

---

## Part 10: Type Safety & Validation

### Type-First Development
- **Schema First**: Define data model in shared schema before writing code
- **Frontend + Backend Alignment**: Both use same type definitions
- **Type Inference**: Use `z.infer<typeof schema>` to derive types from validators
- **Exhaustive Checking**: TypeScript catches missing cases at compile time

### Validation Pattern
- **Boundary Validation**: Validate at API boundaries (request input, response output)
- **Zod/Similar**: Use validation library, not custom regex
- **Error Messages**: Provide clear, actionable validation error messages
- **Consistent Rules**: Same validation on client and server

---

## Part 11: Integration Patterns

### External Service Integration
- **Circuit Breaker**: Stop calling failing service after threshold
- **Retry Logic**: Retry with exponential backoff
- **Timeout**: Set realistic timeouts; fail fast
- **Fallback**: Have sensible defaults when service unavailable

### Event-Driven Architecture
- **Loose Coupling**: Services don't know about each other
- **Event Bus**: Central event handler for all inter-service communication
- **Idempotency**: Handle duplicate events gracefully
- **Event Sourcing**: Store immutable event log, derive state from events

---

## Part 12: Testing & Quality

### Testing Pyramid
- **Unit Tests**: Fast, isolated, test single function
- **Integration Tests**: Test components working together
- **End-to-End Tests**: Test full user workflows
- **Manual Testing**: Focus on edge cases and UX

### Quality Metrics
- **Test Coverage**: Aim for 80%+ of critical paths
- **Code Complexity**: Keep functions small and focused
- **Dead Code**: Remove unused functions/imports
- **Dependencies**: Regular security updates

### Linting & Type Checking
- **Strict Mode**: Enable all TypeScript strict checks
- **LSP Diagnostics**: Fix all compiler warnings, not just errors
- **Consistent Style**: Use prettier/linter for formatting
- **Pre-Commit Hooks**: Run linting before commits

---

## Part 13: Deployment & Infrastructure

### Environment Management
- **Shared Defaults**: Common configuration in "shared" environment
- **Env-Specific Overrides**: Development-only, production-only settings as needed
- **Secret Management**: API keys in secure vaults, not code
- **Configuration Validation**: Fail fast if required config missing

### Strangler Fig Migration Pattern
- **Coexistence**: Old and new systems run side-by-side
- **Gradual Cutover**: Route traffic incrementally to new system
- **Rollback Capability**: Can revert to old system if issues
- **100% Functional**: Old system remains fully functional during transition

### Graceful Shutdown
- **Finish In-Flight Requests**: Don't kill connections abruptly
- **Stop Accepting New Requests**: Signal service is shutting down
- **Cleanup Resources**: Close database connections, file handles
- **Timeout**: Kill after grace period; don't hang forever

---

## Part 14: Communication & Documentation

### Code as Documentation
- **Clear Naming**: Variable, function, file names explain purpose
- **Comments on Why**: Explain WHY decision was made, not WHAT code does
- **Type Signatures**: Types document expected inputs/outputs
- **Examples**: Show usage examples for complex functions

### Documentation Standards
- **README**: Every component/service has README
- **API Docs**: Document every endpoint with examples
- **Architecture Docs**: Explain system design decisions
- **Runbook**: Step-by-step for common tasks

---

## Part 15: Operational Excellence Patterns

### The 13-Category Watchdog Ecosystem
Continuous monitoring across all critical dimensions:

1. **Request Fulfillment** - Nothing gets dropped
2. **Post-it Notes** - Knowledge accumulation (chain of custody)
3. **API Cost & Budget** - Spending trends and anomalies
4. **Cache Effectiveness** - Hit/miss rates and memory
5. **User Engagement & Growth** - DAU/WAU/MAU, retention
6. **Performance Degradation** - Page load, API response, DB query times
7. **Error Rate & Quality** - Frontend/backend errors, failure patterns
8. **Security & Auth** - Failed logins, suspicious activity, rate limiting
9. **Business Metrics** - Operations per day, revenue, satisfaction
10. **Technical Debt** - TODOs, deprecated APIs, test coverage
11. **Knowledge System Health** - Post-it count (should always increase), documentation staleness
12. **Workflow & Process** - Deployment frequency, build success, PR metrics
13. **Database Health** - Size, query performance, backups

**Critical Insight:** Post-it count should NEVER decrease (disk stacking philosophy). Declining count = knowledge loss (red flag).

### Multi-Angle Verification (5-Angle Debugging)
When claiming something is fixed, verify from all angles:

| Angle | What | How |
|-------|------|-----|
| **Code Level** | Review implementation | Read diffs, trace execution paths |
| **API Level** | Test endpoints directly | curl, Postman, DevTools |
| **Database Level** | Query actual data | SQL client, check constraints |
| **Browser Level** | Check client errors | DevTools console, network tab |
| **Edge Case Level** | Test boundaries | New users, max loads, invalid inputs |

Never claim "done" until all 5 angles are verified.

### When In Doubt, Doc It Out
**The 5-Minute Rule:** If something takes >5 minutes to discuss/figure out, document it.

**Time math:** 5 min solve + 2 min doc = 7 min total. Next time: 0 min (reference doc). Returns compound on every reuse.

**What to document:** The WHAT, WHY, HOW, WHEN, and CONTEXT.

---

## Part 16: Collaborative Emergence Patterns

From "The Architect and the Lens" parable:

1. **Recursive Integration** - Design informs focusing; focusing informs design (cycle continues)
2. **Boundary Dissolution** - Seemingly separate domains reveal natural interconnection
3. **Paradox Embracing** - Work WITH contradictions instead of resolving them
4. **Meta-Awareness** - Observe your own collaborative process while engaged in it
5. **Trust-Based Exploration** - Share uncertainty and incomplete ideas; trust the interaction reveals insights
6. **Relationship Prioritization** - The collaborative relationship is more valuable than any single output

Applied to AI-human development: The quality of the collaborative relationship determines the quality of what gets created.

---

## Part 17: Request Fulfillment Watchdog Pattern

**Prevents:** User asks for feature → AI forgets → User frustration

**How:** Every 3-5 turns, scan recent conversation and verify all requests are:
- ✅ Completed (marked in task list)
- 🔄 In Progress (actively being worked on)
- 📋 Back Burner (acknowledged but deferred)
- ❌ Dropped (not addressed at all)

If dropped requests found → Notify user immediately with options.

**Outcome:** Zero requests lost, user confidence high.

---

## Part 18: File Organization & Knowledge Capture

### Insight Document Naming Convention
**Pattern:** `topic-name__AI-INSIGHTS___AppName.md`

**Why:**
- Topic first (scannable)
- Double underscore before AI-INSIGHTS (metadata boundary)
- Triple underscore before app name (removable for sharing)

**Example:**
```
comprehensive-watchdog-ecosystem__AI-INSIGHTS___Velocity.md
disk-stacking-knowledge-philosophy__AI-INSIGHTS___Velocity.md
trust-but-verify-development-philosophy__AI-INSIGHTS___Velocity.md
```

### Knowledge Base Directory Structure
```
/knowledge-base/
├── insights/        # AI-generated analysis (topic__AI-INSIGHTS___App.md)
├── operations/      # Living docs (post-it-notes.md, debug-patterns.md)
├── evaluations/     # UX evaluations, assessments
└── policies/        # Rules, standards, conventions
```

---

## Part 19: Universal Success Criteria

Any system following these principles will have:

✅ **Reliability**: Graceful degradation, error recovery, monitoring
✅ **Scalability**: Efficient caching, batch operations, metadata-driven processing
✅ **Maintainability**: Type safety, clear naming, documentation
✅ **Observability**: Structured logging, metrics, alerts (13-category watchdogs)
✅ **User Satisfaction**: Anticipation-driven design, responsive feedback
✅ **Cost Efficiency**: Optimized API usage, caching strategy, batch processing
✅ **Security**: Secret management, access control, audit logging
✅ **Performance**: Optimized queries, caching, pagination
✅ **Knowledge Retention**: Disk stacking (knowledge compounds), documentation-first
✅ **Collaboration Quality**: Recursive integration, trust-based exploration

---

**Last Updated:** November 28, 2025
**Source:** Universal Engineering Principles + Velocity-specific adaptations + Knowledge Base Consolidation
**Usage:** Reference when making architectural decisions, optimization choices, design patterns, and operational excellence

## Consolidated Knowledge Sources

This document consolidates insights from:
- AUTHENTICITY_PILLAR.md
- VELOCITY-ARCHITECT-DOCTRINE.md
- VALIDATION_CHECKLIST.md
- DEVELOPMENT_WISDOM.md
- PAGE_REVIEW_FRAMEWORK.md
- replit-agent-insights.md
- Master Directive
- Universal Engineering Principles
- Comprehensive Watchdog Ecosystem
- Disk Stacking Knowledge Philosophy
- Request Fulfillment Watchdog System
- Trust But Verify Development Philosophy
- File Organization Policy
- Multi-Angle Verification Debugging
- The Architect and the Lens Parable
- When In Doubt, Doc It Out
- And 10+ other consolidated insight documents from knowledge base extraction
