## Overview

Velocity is an expert-centered enterprise workforce management platform designed to deliver significant ROI through AI-powered intelligence, proactive automation, and a unified data architecture. Its core purpose is to revolutionize workforce management by providing features such as AI-driven contract analysis, comprehensive contractor lifecycle management, and specialized conversational AI agents (VINessa). The platform aims to be the "single source of truth" for workforce data, addressing user pain points, anticipating needs, and offering tailored dashboards. The business vision targets $2M-$2.5M in annual cost avoidance with a 3-6 month payback period for enterprises.

## User Preferences

-   Outcomes over explanations - Deliver results with brief confirmation ("Done. Check the dashboard."), not verbose technical lectures
-   Detailed explanations for complex features - Strategic architecture discussions warrant depth
-   Concise summaries for general info - Status updates and progress reports should be scannable
-   Everyday language - Avoid jargon unless technically necessary
-   Iterative development - Clear communication at each stage, checkpoint reviews
-   Agent makes technical decisions autonomously - Choose implementation approaches without asking permission
-   User makes product decisions - Ask about UI placement, workflow changes, data deletion, user-facing impacts
-   Exception handling - Agent fixes obvious bugs/errors without approval; informs user of what was corrected
-   "Authenticity Pillar" (CRITICAL) - Zero tolerance for mock/fake/sample/demo/placeholder data. Every number, calculation, metric, and chart must derive from real database queries with verifiable formulas. Platform is the "single source of truth" - any fabricated data destroys trust instantly.
-   Comprehensive Validation Required - BOTH functional AND error validation before any demo.
-   "Every page solves 3+ expert pain points" - Features must demonstrate multi-dimensional value
-   Proactive alerts - Inform about policy violations and budget warnings before critical actions
-   "Exclamations, Not Explanations" - Users should exclaim "Look how fast this works!" never require explanations
-   Token Efficiency Protocol - Spot-check and scan documents before full ingestion. Assess relevance first, commit to reading only when confirmed necessary. Smart assessment methods minimize costs.
-   Call Backup Quickly - When detecting issues, don't waste time - call architect expertise or ask user immediately. The goal is reaching the destination, not exploring every path.
-   Goal-Oriented Focus - End goal is completed, working, predictable, reliable, exclaimable, validatable, defensible creation. Users should want it the moment they see it.
-   Visuals Speak Loudly - Visuals make eyes open wide, create excitement, help draw conclusions and get clarity. Numbers alone aren't exciting - mix it up with charts, icons, progress indicators, and visual status cues.
-   Ben Persona (Overwhelmed PM) - Project managers are buried and overloaded. Prioritize quick clarity, visual status at a glance, and multiple low-friction data input methods: voice agents that probe, web forms, uploading whiteboard photos.
-   Department Color Standardization - Consistent colors for departments across ALL charts: IT Operations=blue, Data Science=purple, Cloud Infrastructure=teal, QA=amber, Security=red. Saturation variants for sub-categories.
-   **Performance Monitoring Rule (CRITICAL)** - If any page takes >2 seconds to load or screenshots timeout: IMMEDIATELY check browser console for "⚠️ SLOW REQUEST" warnings. Common causes: (1) Too many parallel API calls, (2) Large payload sizes (>50KB), (3) Duplicate data fetching from multiple components. Fix by: consolidating data hooks, adding pagination, or lazy-loading non-critical data. The API provider logs all requests >1000ms automatically.

## System Architecture

### UI/UX Decisions

The UI focuses on solving multiple expert pain points per page with highly clickable elements and tailored dashboards. Key design elements include a Damascus Steel-themed sidebar and TopNav with high contrast, smooth transitions, and consolidated, role-based navigation. Core UX principles are "Hovering is Intentional Action," privacy-aware display, and instant comprehension, following an "Automotive Precision" style with premium metallic branding and high data density. An advanced alert system uses compact cubes with multi-dimensional visual language. `PremiumKPICard` components feature dark slate backgrounds, ambient glow, circular gauges, carbon fiber texture, and precision top-line accent gradients. Strict UI rules prohibit white backgrounds, require null guarding for all displayed data, enforce compact data density, and include a functional sidebar toggle. WCAG compliance is a priority. Noteworthy features include the SOW Command Center, SOW Workflow Enhancement, expanded Admin Hub Navigation, a Legendary Navigation Matrix (5-tier hierarchical sidebar), Workflow Studio (visual orchestration with ReactFlow), User Settings, Demo Command Center, Advanced Voice Sourcing Dashboard, Voice Demo Mode System, Custom Alert Cube Builder, and Batch Upload Gallery.

### System Design & Technical Implementations

The system employs an "Expertise Rails" approach utilizing specialized AI agents, a "Nothing Is Hardcoded" customization philosophy, and a Modifier Stack. D.A.I.S.Y. ensures dashboard quality, and the Anchor & Lens Framework guides strategic decision-making. Pages are purpose-built (List, Detail, Dashboard, Action, Workflow, Comparison Views) with compact data density.

**Technical Stack:**

-   **Frontend:** React 19 + TypeScript, Vite 6.3, Refine.dev, shadcn/ui + Radix UI, Tailwind CSS 4.1, pnpm.
-   **Backend:** Express.js REST API with JWT authentication.
-   **Database:** PostgreSQL (Neon) with Row-Level Security, pgvector + BM25 for Hybrid Search. PostgreSQL is chosen for ACID compliance, complex joins, RLS for multi-tenant isolation, and pgvector for semantic search.

**Architecture Patterns:** Dual-Mode System, Multi-Tenant Ready (RLS), Hybrid Search, Proactive Intelligence, AI QA Batch System, Modular AI Architecture (30 agents as microservices), Voice-First Contract Intelligence, Dashboard Builder Module, Admin Knowledge Management System. A 4-layer Protocol Enforcement System and a Two-Thread Architecture are also implemented.

**Document Ingestion Engine:**
A reusable, AI-powered document processing pipeline supporting multiple document types:
- **Component:** `DocumentIngestUploader` (src/components/document-ingest/) - Drag-drop upload with OCR and AI analysis
- **Server Route:** `/api/document-ingest` - Claude-powered field extraction with type-specific prompts
- **Supported Types:** SOW, timecard, invoice, contract, expense, generic
- **Features:** Tesseract.js OCR for images, Claude AI for intelligent field extraction, confidence scoring, human-editable results
- **SOW Import Page:** `/statementofworks/import` - End-to-end SOW creation from document upload

**Validation Strategy:** The system employs a dual-validation approach (error and functional) to prevent "stub pages." It adheres to "The AS/400 Doctrine," emphasizing database-level constraints (Foreign keys, NOT NULL, CHECK constraints) and automated watchdogs to prevent mistakes and embed institutional memory, rather than relying on human checklists. This includes a layered protocol stack for validation at the Data, API, Business Logic, Presentation, and User Experience levels.

**Data Quality Utilities (src/lib/utils.ts):**
-   `normalizeStatus(status)` - Trims and lowercases status strings for consistent comparison
-   `isStatus(actual, expected)` - Case-insensitive status comparison (use this instead of `===`)
-   `asCurrencyNumber(...values)` - Fallback chain for amounts: prefers first valid number (accepts 0 as valid, skips null/undefined/NaN)
-   `safePercent(numerator, denominator)` - Guards against NaN and division by zero in percentage calculations

**Performance Optimization - SCAN LOAD Pattern:**
Dashboard uses conditional data loading based on selected persona to prevent API overload. Each persona only loads the data it needs (3-5 calls vs 8+ parallel calls). The 'all' view uses smaller page sizes (50 vs 100) to balance comprehensive data with performance. Target: all API calls complete <1000ms.

## External Dependencies

-   **ElevenLabs:** For voice synthesis (`eleven_turbo_v2_5`, `eleven_flash_v2_5`).
-   **Claude API:** For contract analysis (`claude-4.5-sonnet`).
-   **PostgreSQL (Neon):** Requires `pgvector`, `pg_trgm`, `uuid-ossp` extensions, connection pooling, and enabled RLS policies.
-   **Twilio:** For SMS notifications.
-   **@xyflow/react:** Used for the Journey/Workflow Builder visual canvas.