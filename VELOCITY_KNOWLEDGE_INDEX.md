# VELOCITY KNOWLEDGE INDEX
> **Compressed Context Map** | Load this 200-line index instead of 9,500+ tokens across 5 files  
> Each symbol is a mental trigger → expand on-demand via targeted reads

---

## DESIGN LANGUAGE & VISUAL IDENTITY

**🔷 DESIGN_SYSTEM.md** - Automotive Precision Engineering  
Damascus steel aesthetic, metallic gradients, professional industrial design  
→ Color palette: `slate-400 → slate-200` gradients, 4px color-coded borders  
→ Spacing tokens: `8px/16px` base unit, `pb-3 pt-3` data density  
→ Typography: Uppercase tracking titles, professional letter-spacing

**🔶 UX_PATTERNS.md** - "Hovering is Intentional Action"  
Privacy-aware triage support, instant comprehension without scrolling  
→ Hover reveals full details (users actively seeking information)  
→ Default display minimal/safe (non-private viewing situations)  
→ No mystery click-throughs, zero forced navigation for basic triage

**🔸 TOOLTIP_ARCHITECTURE.md** - Site-Wide Intelligence Layer  
Universal TooltipWrapper, contextual data enrichment, lazy-loading  
→ Department hover: role breakdown charts, budget allocation  
→ Contractor hover: equipment inventory, tenure badges, performance  
→ Metrics hover: trend charts, variance analysis, forecasts

---

## SYSTEM ARCHITECTURE & TECHNICAL FOUNDATION

**⬢ Multi-Tenant Architecture** - Row-Level Security (RLS) isolation  
PostgreSQL with company-scoped data separation, tenant-aware queries

**⬡ Hybrid Search Engine** - pgvector + BM25 semantic + keyword  
Reciprocal Rank Fusion (RRF), 200K token Claude context window

**⬣ AI Agent Microservices** - 30 hot-swappable MCP endpoints  
Independent upgrades, A/B testing, vendor flexibility, modular intelligence

**⬢ Voice-First Differentiator** - ElevenLabs synthesis pipeline  
Email PDF → Claude analysis → 5-min voice callback workflow

**⬡ Dashboard Builder Module** - Drag-drop customization system  
41 widgets × 7 categories, 8 role templates, 3 themes, dual architecture

---

## CORE PHILOSOPHY & DESIGN PRINCIPLES

**▸ "Exclamations, Not Explanations"**  
Users exclaim: "Look how fast this works!" — Never require explanations  
Every feature must be instantly comprehensible, zero learning curve

**▸ Authenticity Pillar**  
Zero mock data in production paths, real data or clearly marked placeholders  
Defensible patterns, realistic variances, verifiable audit trails

**▸ "Every Page Solves 3+ Expert Pain Points"**  
Multi-dimensional value demonstration, deep job understanding  
Clickable elements anticipating needs, proactive alerts before critical actions

**▸ Privacy-Aware Triage Support**  
Users view dashboards in non-private situations (open floor plans, meetings)  
Default: safe/minimal → Hover: full details when user takes intentional action

**▸ Higher Data Density**  
Reduced padding (`pb-3 pt-3` vs default), compact spacing (`gap-3` vs `gap-4`)  
More visible information, automotive precision engineering aesthetic

---

## VISUAL DESIGN TOKENS (Damascus Steel Aesthetic)

**◆ Color-Coded Borders**  
4px left borders for instant category recognition  
→ Blue: Workforce metrics  
→ Green: Budget/financial  
→ Cyan/Orange: Utilization  
→ Red/Green: Alert severity

**◆ Gradient Backgrounds**  
Subtle `color/50 → white` gradients on cards  
Premium automotive feel, never "kindergarten" colors

**◆ Uppercase Tracking Titles**  
Professional industrial aesthetic with `letter-spacing`  
Damascus steel embossed effect on "VELOCITY" branding

**◆ Contextual Messaging**  
Dynamic text based on state:  
→ "deployed" vs "spent"  
→ "Healthy utilization" vs "Monitor closely"  
→ "All systems nominal" vs specific issue callouts

---

## ALERT SYSTEM ARCHITECTURE

**◇ Compact Alert Cubes** - 64×64px multi-dimensional visual language  
→ Color-coded severity: Red=critical, Orange=warning, Green=success  
→ Category icon (center), severity icon (top-right badge)  
→ Action indicator (top-left lightning), count badge (bottom-right)

**◇ Enhanced Tooltips** - Up to 3 alerts with full context  
→ Alert titles, messages, values, recommended actions  
→ Count of additional alerts beyond first 3

**◇ Quick Action Grid** - 2×2 buttons in tooltip footer  
→ ✓ Acknowledge (green) - Mark as seen  
→ 🕐 Snooze 1hr (blue) - Pause notification 1 hour  
→ 📅 Next Login (purple) - Snooze until next session  
→ 📋 Add To-Do (amber) - Create task item

---

## MENU SYSTEM CONVENTIONS

**◈ ≤18 Character Limit** - All labels fit without truncation  
Display: "Voice Intel", "Voice Agents", "Data Analyzer"  
Metadata: `fullLabel` stores complete names for tooltips

**◈ Hover Tooltips** - Show full names on hover for abbreviated items  
Responsive sidebar: `clamp(240px, 20vw, 288px)` → reducing to `clamp(220px, 18vw, 260px)`

**◈ Role-Based Filtering** - Menu items adapt to user permissions  
CPO sees strategic oversight, Hiring Managers see recruiting ops

---

## ROI QUANTIFICATION & VALUE DELIVERY

**⧈ Time Savings Pillar**  
15-20 hours/week per executive eliminated from manual tracking  
→ Proactive alerts vs reactive discovery  
→ AI-powered contract analysis (15-25 sec vs 2-3 hours)  
→ Automated invoice variance detection

**⧈ Cost Avoidance Pillar**  
$1.3M-$1.4M annual ROI for enterprise deployment  
→ Budget overrun prevention (early warning system)  
→ SOW compliance monitoring (change order tracking)  
→ Timecard approval acceleration (penalty avoidance)

**⧈ Decision Velocity**  
CPO Command Center: instant comprehension without scrolling  
→ All critical KPIs above fold  
→ Triage workflow optimized (hover → assess → quick action)  
→ Zero "mystery clicks" to determine priority

---

## ARCHITECTURAL DECISIONS (Decision Coins 🪙)

🪙 **Damascus Steel Branding** - Premium metallic gradients, embossed depth  
🪙 **4px Color Borders** - Instant category recognition across all cards  
🪙 **Hover=Intentional Action** - Show full details when user actively seeks info  
🪙 **Privacy-Aware Display** - Safe defaults, hover reveals sensitive data  
🪙 **Alert Cubes 64px** - Compact multi-dimensional status indicators  
🪙 **≤18 Char Menu Labels** - Zero truncation, professional presentation  
🪙 **Architect Review Mandatory** - Second set of eyes before task completion  
🪙 **Authenticity Only** - Zero mock data in production code paths  
🪙 **3+ Pain Points/Page** - Every feature solves multiple expert problems  
🪙 **Exclamations>Explanations** - Users exclaim results, never require tutorials  
🪙 **Contextual Messaging** - Dynamic text reflects actual system state  
🪙 **Verifiable Audit Trails** - Chain of custody for all decisions  

---

## CURRENT IMPLEMENTATION STATUS

### ✓ Completed (Green Status)
- [x] Executive Command Center Dashboard w/ alert cubes  
- [x] Compact alert cube system w/ quick action tooltips  
- [x] Project Tracker (Damascus steel redesign, 50% height reduction)  
- [x] Sidebar user profile dropdown (theme controls integrated)  
- [x] Design documentation (DESIGN_SYSTEM, UX_PATTERNS, TOOLTIP_ARCHITECTURE)

### ◐ In Progress (Yellow Status)
- [ ] Dashboard Builder route investigation (route exists, testing API endpoints)  
- [ ] Sidebar width reduction (`clamp(220px, 18vw, 260px)`)  
- [ ] VELOCITY branding enlargement (sidebar header)

### ○ Planned (White Status)
- [ ] Universal TooltipWrapper component (3 exemplar tooltips: dept/contractor/metric)  
- [ ] Data density sweep (timecards, invoices, expenses, assets, employees)  
- [ ] Dynamic alerts/notifications (remove hardcoded red badges)  
- [ ] Sample data strategy (curated records → scale after schema stabilization)  
- [ ] Testing & validation plan (QA workflow with architect review)

---

## TOKEN OPTIMIZATION STRATEGIES

**Layered Context Loading Protocol:**

```
Level 1: THIS INDEX (300 tokens)
   ↓ User mentions "Damascus aesthetic"
   
Level 2: DESIGN_SYSTEM.md → Colors section (400 tokens)
   ↓ Need exact gradient code
   
Level 3: Targeted read at line 45-50 (50 tokens)
```

**Documentation Restructure (Future):**
```
replit.md → Split into:
  - FRONTMATTER.md (immutable principles, 50 lines)
  - STATUS.md (active work, 80 lines)
  - sessions/ (archived snapshots by date)
```

**Session Habits:**
- Refresh only deltas since last check-in  
- Stash WIP questions in STATUS.md briefly  
- Log decisions in DECISION_LOG.md (short reference list)  
- Use pointer links vs duplicating content

**Efficiency Gains:**
- Traditional: 9,500 tokens (full docs)  
- Symbolic: 1,500 tokens (index + targeted expansion)  
- **Savings: 84% token reduction**

---

## EXTERNAL DEPENDENCIES & API INTEGRATIONS

**ElevenLabs** - Voice Intelligence  
Models: `eleven_turbo_v2_5`, `eleven_flash_v2_5`  
Format: XML/SSML, Settings: `stability: 0.5, similarity_boost: 0.75`

**Claude API** - Contract Intelligence  
Model: `claude-4.5-sonnet`, Latency: 15-25 sec, Context: 200K tokens

**PostgreSQL (Neon)** - Primary Database  
Extensions: `pgvector`, `pg_trgm`, `uuid-ossp`  
RLS enabled on all tenant-scoped tables

**Twilio** - SMS Notifications  
Use cases: Timecard reminders, budget alerts

---

## USAGE INSTRUCTIONS

**For Agent Context Loading:**
1. Load this index first (300 tokens)  
2. Identify relevant symbols for current task  
3. Expand only needed sections via targeted reads  
4. Leave other knowledge dormant until required

**For Knowledge Updates:**
1. Update source files (DESIGN_SYSTEM.md, etc.)  
2. Sync symbol summaries in this index  
3. Maintain 1-2 line trigger phrases per concept  
4. Keep total index under 250 lines

**For Decision Tracking:**
1. New architectural decision → Add 🪙 coin to list  
2. Changed approach → Update existing coin  
3. Deprecated pattern → Archive to sessions/ folder

---

**Last Updated:** November 20, 2025  
**Index Version:** 1.0  
**Token Budget:** ~300 tokens (vs 9,500 for full documentation load)
