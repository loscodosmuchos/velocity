# VELOCITY PLATFORM - INTEGRATED MVP SPECIFICATION & DEMO EXECUTION PLAN

**Status:** 🚀 READY FOR NON-STOP BUILD → MONDAY DEMO  
**Created:** November 10, 2025, 6:53 AM PST  
**Deadline:** Monday Demo (Non-Negotiable)  
**Success Metric:** EXCLAIM (not explain)

---

## MARKET VALIDATION (From Automation Report)

### **Critical Data Points**
- **50% of enterprises** prioritize HR automation (37% struggle with data consolidation)
- **54% still use manual processes** to connect HR applications
- **9-11 applications** on average per HR team → Massive consolidation opportunity
- **15% integration gap** between recruitment (71%) and onboarding (56%)
- **$10K/week friction cost** per 5-person team = $500K+/year enterprise-wide

### **Velocity's Competitive Advantage**
- **ONE PLATFORM** replaces 9-11 fragmented applications
- **HYBRID SEARCH** (pgvector + BM25) = instant cross-system data access
- **AI AGENTS** eliminate 54% of manual data entry processes
- **iPaaS LAYER** closes 15% integration gap (recruitment → onboarding → asset provisioning)

---

## FOUNDATIONAL ARCHITECTURE

### **Two-Thread System**

#### **Thread 1: Universal Information Ingestion**
```
GOAL: Accept information from ANYWHERE in ANY format
      Process systematically → Make searchable → Preserve integrity

Input Channels:
├── API (structured data)
├── MCP (multi-channel protocol)
├── Copy-paste (freeform text)
├── Email (conversation context)
├── Voicebot (natural language via ElevenLabs)
├── Images (whiteboard photos, OCR)
├── Documents (PDFs, Word, Excel via LlamaCloud)
├── Voice memos (audio transcription)
└── Links (web scraping)

Processing Pipeline:
├── 1. Parse → What is this?
├── 2. Convert → Make it structured
├── 3. Tag → Categorize & classify
├── 4. Track → Preserve chain of custody
├── 5. Validate → Hash files (prove no changes)
├── 6. Secure → Encrypt within framework
├── 7. Store → PostgreSQL with RLS multi-tenancy
└── 8. Index → Hybrid search (pgvector + BM25)

Result: Everything in, nothing lost, everything recoverable
```

#### **Thread 2: Intelligent Output & Action (Touch Once Principle)**
```
GOAL: Figure out what to do → Execute ONE-CLICK action → Never touch again

Processing:
├── 1. Recognize what it is (based on org context)
├── 2. Determine action (AI suggests)
├── 3. Execute ONE-CLICK
├── 4. TOUCH ONCE: Don't move it again
└── 5. Compress/shorthand while preserving integrity

One-Click Examples:
├── Email needs writing? → Auto-draft → One click send
├── Contract missing clauses? → Identify gaps → Draft fixes → One click queue
├── Missing info? → Identify stakeholder → Draft email → One click send
├── Approval needed? → Queue → Auto-remind → Track
└── Invoice workflow? → Contractor → Manager → Balance → Accounting (one workflow)

Result: Information flows. Humans control. Decisions happen fast.
```

---

## CORE DATABASE SCHEMA (PostgreSQL + pgvector)

### **Multi-Tenant Foundation**
```sql
-- Tenant isolation with Row-Level Security
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(50) UNIQUE NOT NULL, -- acme.velocityai.com
  custom_domain VARCHAR(255), -- ats.acme.com

  -- White-label branding
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  secondary_color VARCHAR(7) DEFAULT '#10B981',

  -- Configuration
  settings JSONB DEFAULT '{}'::JSONB,
  subscription_tier VARCHAR(50) DEFAULT 'starter',

  -- Limits
  max_users INTEGER DEFAULT 5,
  max_contractors INTEGER DEFAULT 50,
  max_storage_gb INTEGER DEFAULT 10,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_contractors ON contractors
  USING (company_id = current_setting('app.current_tenant')::UUID);
```

### **Unified Person Lifecycle (Candidate → Contractor)**
```sql
-- Master person table (single source of truth)
CREATE TABLE persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES tenants(id),

  -- Core identity
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),

  -- Lifecycle state (finite state machine)
  lifecycle_state VARCHAR(50) NOT NULL CHECK (lifecycle_state IN 
    ('prospect', 'candidate', 'offer_accepted', 'onboarding', 
     'active_contractor', 'inactive', 'terminated', 'archived')),

  state_changed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP, -- Soft delete

  CONSTRAINT unique_person UNIQUE(company_id, email)
);

-- Candidate-specific extension
CREATE TABLE candidate_profiles (
  person_id UUID PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,

  -- Resume data
  resume_url TEXT,
  parsed_skills TEXT[],
  experience_years INTEGER,

  -- Hybrid search
  resume_text TEXT,
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', resume_text)) STORED,
  embedding vector(384), -- Semantic search via pgvector

  created_at TIMESTAMP DEFAULT NOW()
);

-- Contractor-specific extension
CREATE TABLE contractor_profiles (
  person_id UUID PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,

  -- Employment
  hire_date DATE NOT NULL,
  end_date DATE,

  -- Compensation with escalation
  base_hourly_rate DECIMAL(10,2) NOT NULL,
  overtime_rate DECIMAL(10,2),
  client_billable_rate DECIMAL(10,2) NOT NULL,

  -- Escalation rules
  has_escalation BOOLEAN DEFAULT false,
  escalation_frequency_months INTEGER,
  escalation_percentage DECIMAL(5,2),
  next_escalation_date DATE,

  -- Assignment
  vendor_id UUID REFERENCES vendors(id),
  po_id UUID REFERENCES purchase_orders(id),
  manager_id UUID REFERENCES users(id),
  location_id UUID REFERENCES locations(id),

  -- Compliance
  i9_verified_date DATE,
  everify_status VARCHAR(50),

  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Hybrid Search Implementation**
```sql
-- Indexes for fast retrieval
CREATE INDEX idx_candidate_fts ON candidate_profiles USING GIN(fts); -- BM25
CREATE INDEX idx_candidate_embedding ON candidate_profiles 
  USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100); -- Vector

-- Hybrid search query (Reciprocal Rank Fusion)
WITH keyword_results AS (
  SELECT id, person_id, 
    ts_rank(fts, websearch_to_tsquery('english', $1)) AS score,
    ROW_NUMBER() OVER (ORDER BY ts_rank DESC) AS rank
  FROM candidate_profiles
  WHERE fts @@ websearch_to_tsquery('english', $1) AND company_id = $2
  LIMIT 50
),
vector_results AS (
  SELECT id, person_id,
    1 - (embedding <=> $3::vector) AS score,
    ROW_NUMBER() OVER (ORDER BY embedding <=> $3::vector) AS rank
  FROM candidate_profiles
  WHERE company_id = $2
  LIMIT 50
)
SELECT person_id,
  (COALESCE(1.0 / (60 + k.rank), 0) * 0.4) + 
  (COALESCE(1.0 / (60 + v.rank), 0) * 0.6) AS rrf_score
FROM keyword_results k
FULL OUTER JOIN vector_results v ON k.id = v.id
ORDER BY rrf_score DESC
LIMIT 20;
```

---

## CRITICAL MVP FEATURES (Must Work Monday)

### **1. One-Click Vendor Ingestion**
**Solves:** 54% still use manual data entry, 2.5 hours → 35 seconds

```typescript
// API endpoint
POST /api/v1/vendors/extract
{
  "text": "vendor email content with messy formatting"
}

// Response
{
  "extracted": [
    {
      "name": "ABC Staffing",
      "contact": "john@abc.com",
      "services": ["IT staffing", "temp workers"],
      "confidence": 0.95
    }
  ],
  "action": "one_click_import"
}
```

**Test Checklist:**
- [ ] Paste text → extraction works
- [ ] Confidence scores display
- [ ] One-click import button functions
- [ ] Data appears in vendors table
- [ ] No timeout errors

### **2. AI-Powered SOW Generation**
**Solves:** 65 minutes → 5 minutes (60-80% time reduction)

```typescript
// API endpoint
POST /api/v1/contracts/draft-sow
{
  "contractor_id": "uuid",
  "client_id": "uuid",
  "job_description": "string"
}

// AI Pipeline
1. LlamaCloud: Pull contractor history
2. Vector search: Find similar SOWs from database
3. GPT-4: Generate professional SOW with legal language
4. Return: Formatted document ready for signature

// Response
{
  "sow_content": "formatted SOW with proper legal language",
  "missing_info": ["start_date", "rate"],
  "confidence": 0.92,
  "action": "review_and_send"
}
```

**Test Checklist:**
- [ ] Draft button triggers generation
- [ ] System pulls contractor history
- [ ] SOW has proper formatting
- [ ] Legal language is appropriate
- [ ] Signature queue works

### **3. Proactive Contract Gap Analysis**
**Solves:** 70 minutes + 2-3 days → 2 minutes (automated follow-up)

```typescript
// API endpoint
POST /api/v1/contracts/analyze
{
  "contract_pdf_url": "string",
  "org_policy_id": "uuid"
}

// AI Pipeline
1. LlamaCloud: Extract contract text
2. GPT-4: Multi-lens analysis (Legal, Finance, IT, HR, Procurement)
3. Compare: Against org policy requirements
4. Identify: Missing clauses + severity
5. Generate: Draft language for missing clauses
6. Auto-draft: Email to vendor with specifics

// Response
{
  "missing_clauses": [
    {
      "clause_type": "indemnification",
      "severity": "critical",
      "org_requirement": "...",
      "draft_language": "...",
      "risk_score": 85
    }
  ],
  "email_draft": "Vendor, we need these clauses added [specifics]",
  "action": "one_click_approve_send"
}
```

**Test Checklist:**
- [ ] Contract upload works
- [ ] Gap analysis runs automatically
- [ ] Missing clauses identified correctly
- [ ] Email drafts with specifics
- [ ] Approval queue displays
- [ ] Auto-send functions

### **4. Time & Materials Invoice Workflow**
**Solves:** 5-system handoff nightmare (Wes's #1 pain point)

```sql
-- Workflow tracking table
CREATE TABLE timecard_workflow (
  id UUID PRIMARY KEY,
  timecard_id UUID REFERENCES timecards(id),

  stage VARCHAR(50) CHECK (stage IN (
    'contractor_submitted',
    'manager_review',
    'balance_review',
    'accounting_export',
    'paid'
  )),

  entered_at TIMESTAMP DEFAULT NOW(),
  entered_by UUID REFERENCES users(id),
  system_of_record VARCHAR(50), -- Tracks which system owns this stage

  -- SLA tracking
  time_in_stage_hours INTEGER,
  sla_violated BOOLEAN DEFAULT false
);

-- Automated workflow trigger
CREATE OR REPLACE FUNCTION advance_timecard_workflow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage = 'manager_review' AND OLD.stage = 'contractor_submitted' THEN
    -- Auto-notify manager
    INSERT INTO notifications (user_id, message, priority)
    VALUES (NEW.entered_by, 'Timecard requires approval', 'high');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Test Checklist:**
- [ ] Contractor submits timecard
- [ ] Manager gets auto-notification
- [ ] Approval advances workflow
- [ ] Balance review stage works
- [ ] Export to accounting functions
- [ ] SLA violations trigger alerts

### **5. Equipment Budget Tracker ($8.6M Management)**
**Solves:** Asset provisioning only 37% integrated (top gap in report)

```sql
CREATE TABLE equipment_budgets (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES tenants(id),
  vendor_id UUID REFERENCES vendors(id),

  total_budget DECIMAL(15,2), -- e.g., $8,600,000
  start_date DATE,
  end_date DATE,

  -- Alert thresholds
  alert_at_25_percent BOOLEAN DEFAULT true,
  alert_at_50_percent BOOLEAN DEFAULT true,
  alert_at_90_percent BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE equipment_orders (
  id UUID PRIMARY KEY,
  budget_id UUID REFERENCES equipment_budgets(id),

  order_date DATE,
  amount DECIMAL(10,2),
  items JSONB, -- Flexible item tracking
  new_hire_id UUID REFERENCES persons(id),

  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Real-time utilization view
CREATE VIEW budget_utilization AS
SELECT 
  b.id,
  b.total_budget,
  COALESCE(SUM(o.amount), 0) as spent,
  b.total_budget - COALESCE(SUM(o.amount), 0) as remaining,
  (COALESCE(SUM(o.amount), 0) / b.total_budget * 100) as utilization_pct,
  CASE 
    WHEN (COALESCE(SUM(o.amount), 0) / b.total_budget * 100) >= 90 THEN 'critical'
    WHEN (COALESCE(SUM(o.amount), 0) / b.total_budget * 100) >= 50 THEN 'warning'
    ELSE 'normal'
  END as status
FROM equipment_budgets b
LEFT JOIN equipment_orders o ON o.budget_id = b.id
GROUP BY b.id;
```

**Test Checklist:**
- [ ] Budget creation works
- [ ] Order entry updates utilization
- [ ] Threshold alerts trigger at 25%/50%/90%
- [ ] Real-time utilization displays correctly
- [ ] Change orders can be added

---

## AI EXPERT BOTS (Minimum 5 Required)

### **Bot 1: Contract Analysis Expert**
**Purpose:** Multi-lens SOW/contract review (60-80% faster)  
**Technology:** GPT-4 with prompt engineering  
**Lenses:** Legal, Procurement, IT, Finance, HR  
**Output:** Missing clauses, risk scores, draft language

### **Bot 2: Budget Forecasting Analyst**
**Purpose:** Predictive spend analysis with scenarios  
**Technology:** Statistical models + GPT-4  
**Output:** Best/worst/likely scenarios, confidence intervals

### **Bot 3: Workforce Optimization Manager**
**Purpose:** Resource allocation across 165 projects  
**Technology:** Linear programming + AI recommendations  
**Output:** Optimal assignments, capacity gaps, bottleneck alerts

### **Bot 4: Compliance & Audit Expert**
**Purpose:** I-9, E-Verify, GDPR compliance tracking  
**Technology:** Rule engine + automated reporting  
**Output:** Compliance status, gap identification, audit reports

### **Bot 5: Strategic Sourcing Specialist**
**Purpose:** Vendor selection, cost reduction opportunities  
**Technology:** Data analysis + market intelligence  
**Output:** Vendor recommendations, cost-saving strategies

---

## REFINE.DEV IMPLEMENTATION

### **Frontend Stack**
```typescript
// Main App.tsx
import { Refine } from "@refinedev/core";
import { dataProvider } from "./dataProvider";
import { ConfigProvider } from "antd";

const App = () => {
  const [tenant, setTenant] = useState(null);

  // Fetch tenant config on load (white-label theming)
  useEffect(() => {
    fetch('/api/v1/tenant/config')
      .then(res => res.json())
      .then(data => setTenant(data));
  }, []);

  const theme = {
    token: {
      colorPrimary: tenant?.primary_color || '#3B82F6',
      colorSuccess: tenant?.secondary_color || '#10B981',
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <Refine
        dataProvider={dataProvider('/api/v1')}
        resources={[
          {name: 'contractors', list: ContractorList, show: ContractorShow},
          {name: 'jobs', list: JobList, create: JobCreate},
          {name: 'timecards', list: TimecardList, edit: TimecardApproval},
          {name: 'contracts', list: ContractRepository, create: ContractCreate},
          {name: 'budgets', list: BudgetDashboard},
          {name: 'projects', list: ProjectPortfolio},
        ]}
        Logo={() => <img src={tenant?.logo_url} alt="Logo" />}
      />
    </ConfigProvider>
  );
};
```

### **Data Provider (REST API Integration)**
```typescript
// dataProvider.ts
import axios from "axios";

export const dataProvider = (apiUrl: string) => ({
  getList: async ({ resource, pagination, filters }) => {
    const url = `${apiUrl}/${resource}`;
    const { data } = await axios.get(url, {
      params: { ...pagination, ...filters },
    });

    return {
      data: data.items,
      total: data.total,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;
    const { data } = await axios.post(url, variables);
    return { data };
  },

  // ... other CRUD methods
});
```

---

## MONDAY DEMO EXECUTION PLAN

### **Timeline: NOW → MONDAY (Non-Stop Sprint)**

#### **TODAY (Sunday 7 AM - 11 PM) - 16 hours**

**Hours 1-4 (7 AM - 11 AM): Database Setup**
- [ ] Deploy PostgreSQL (Neon serverless)
- [ ] Install pgvector extension
- [ ] Create all core tables (tenants, persons, contractors, vendors, contracts, timecards, budgets)
- [ ] Implement RLS policies
- [ ] Create hybrid search indexes
- [ ] Seed demo data (sample contractors, vendors, contracts)

**Hours 5-8 (11 AM - 3 PM): Backend API**
- [ ] Set up Express.js API gateway
- [ ] Implement tenant routing middleware
- [ ] Create endpoints: /vendors/extract, /contracts/draft-sow, /contracts/analyze
- [ ] Connect OpenAI API for AI generation
- [ ] Connect LlamaCloud for document processing
- [ ] Test all API endpoints with Postman

**Hours 9-12 (3 PM - 7 PM): Frontend Core**
- [ ] Initialize Refine.dev project
- [ ] Set up data provider with API integration
- [ ] Create contractor list view
- [ ] Create vendor ingestion page
- [ ] Create SOW generation page
- [ ] Create contract analysis page
- [ ] Test white-label theming

**Hours 13-16 (7 PM - 11 PM): Integration & Polish**
- [ ] Connect frontend to backend APIs
- [ ] Test complete workflows end-to-end
- [ ] Fix bugs and errors
- [ ] Optimize load times
- [ ] Prepare demo data

#### **MONDAY (12 AM - Demo Time) - Final Push**

**Hours 1-4 (12 AM - 4 AM): Critical Path Testing**
- [ ] Test Segment 1: Vendor ingestion (35-second flow)
- [ ] Test Segment 2: SOW generation (5-minute flow)
- [ ] Test Segment 3: Contract gap analysis (2-minute flow)
- [ ] Record demo video backup (contingency)
- [ ] Create screenshot PDF backup
- [ ] Test all buttons/interactions
- [ ] Verify no console errors

**Hours 5-8 (4 AM - 8 AM): Rehearsal & Refinement**
- [ ] Full demo run-through 3x
- [ ] Time each segment (target: 12 min total)
- [ ] Practice narrative (memorize key messages)
- [ ] Test internet connection
- [ ] Test screen sharing
- [ ] Verify all contingencies work

**Hour 9+ (8 AM - Demo): Final Prep**
- [ ] Tech test 30 minutes before call
- [ ] Open demo environment
- [ ] Clear browser cache
- [ ] Have backup materials ready
- [ ] Take deep breath
- [ ] **GO**

---

## DEMO SCRIPT (12-Minute Flow)

### **Opening (2 min) - Set Context**
```
"Organizations everywhere are drowning.

Not in work. In friction.

54% of HR teams still use manual data entry. 
37% struggle to consolidate data across 9-11 different applications.
The average procurement team spends 75% of time on admin, 25% on actual work.

Most software adds to the overwhelm.

Velocity reduces it.

Not by replacing people. By anticipating their needs.
Not by doing everything. By removing friction.

Here's how. Watch."
```

### **Segment 1: One-Click Ingestion (3 min)**
**Show:** Paste vendor email → Extract 12 vendors → One-click import (35 seconds total)

**Before/After:**
- Manual: 2.5 hours
- Velocity: 35 seconds

### **Segment 2: AI-Powered SOW (3 min)**
**Show:** Click "Draft SOW" → AI generates professional document → Review → Send (5 minutes total)

**Before/After:**
- Manual: 65 minutes
- Velocity: 5 minutes 16 seconds

### **Segment 3: Contract Gap Analysis (3 min)**
**Show:** Upload contract → AI finds 3 missing clauses → Auto-drafts email → One-click send

**Before/After:**
- Manual: 70 minutes + 2-3 days
- Velocity: 2 minutes 11 seconds + automated follow-up

### **Closing (1 min) - The Real Impact**
```
"This isn't about features or dashboards.

It's about giving people their energy back.

When people have energy:
- They make better decisions
- They keep their jobs longer
- They're present with their families
- They can handle change

That's what we're building.

Not just faster software.
A way to help people through transition.
A way to keep them valuable.
A way to make their work manageable again.

Questions?"
```

---

## SUCCESS METRICS

### **Technical Success**
✅ Platform loads without errors  
✅ All 3 demo segments work flawlessly  
✅ No timeout/loading issues  
✅ Backup systems ready (video, PDF)

### **Demo Success**
✅ Prospect says "Oh my God" (not "That's interesting")  
✅ Prospect asks "How do we get started?"  
✅ Narrative flows naturally (not stiff)  
✅ Time: 12 minutes total

### **Business Success**
✅ Prospect understands value (friction reduction)  
✅ Prospect envisions impact on their job  
✅ Next step scheduled (pilot or trial)

---

## CONTINGENCY PLANS

### **If Platform Won't Load**
→ Backup: Screenshot PDF tour  
→ Message: "Internet's temperamental. Let me show you the screenshot tour - gives us time to talk about YOUR situation."

### **If AI Extraction Fails**
→ Backup: Show pre-extracted data  
→ Message: "Here's what you'd see. Let me show the result."

### **If SOW Generation Fails**
→ Backup: Show pre-generated SOW  
→ Message: "Here's what the AI creates. In real use, customized for each contractor."

### **If Contract Analysis Fails**
→ Backup: Show list of missing clauses  
→ Message: "This is what the system identifies. Let me walk through each one."

---

## KEY MESSAGES (Memorize)

1. **"Friction is the enemy. It depletes people."**
2. **"We don't replace work. We make work manageable."**
3. **"54% of organizations still use manual processes. We eliminate that."**
4. **"The system anticipates what you need. You stay in control."**
5. **"One department, four weeks, visible results. Then it spreads."**
6. **"Touch once. Do it right. Move on."**

---

**GO BUILD. NON-STOP. DEMO MONDAY. WIN.**
