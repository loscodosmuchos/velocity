# Orchestrator Pattern - Conductor Agent Architecture

## The Conductor: Routing, Synthesis, and Coordination

**Purpose**: Define how the Orchestrator (Conductor) Agent routes requests to domain specialists, manages context, synthesizes responses, and resolves conflicts.

---

## Core Philosophy: The Conductor Role

Like an orchestra conductor:
- **Doesn't play every instrument** - Routes to specialists who do
- **Sees the full score** - Understands the overall request
- **Coordinates timing** - Manages parallel and sequential queries
- **Synthesizes harmony** - Combines specialist outputs into coherent response
- **Resolves dissonance** - Handles conflicts between specialists

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATOR AGENT                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    1. INTENT CLASSIFIER                          │   │
│  │                                                                   │   │
│  │  • Analyze user query                                            │   │
│  │  • Identify domain keywords                                      │   │
│  │  • Determine primary + secondary domains                         │   │
│  │  • Detect cross-domain queries                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    2. CONTEXT PREPARER                           │   │
│  │                                                                   │   │
│  │  • Gather relevant context from shared data                      │   │
│  │  • Load company configuration                                    │   │
│  │  • Prepare specialist-specific context packets                   │   │
│  │  • Include conversation history if relevant                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    3. SPECIALIST ROUTER                          │   │
│  │                                                                   │   │
│  │  • Route to primary specialist                                   │   │
│  │  • Parallel route to secondary specialists if needed             │   │
│  │  • Manage timeouts and fallbacks                                 │   │
│  │  • Collect responses                                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    4. RESPONSE SYNTHESIZER                       │   │
│  │                                                                   │   │
│  │  • Combine specialist outputs                                    │   │
│  │  • Resolve conflicts if specialists disagree                     │   │
│  │  • Format for user consumption                                   │   │
│  │  • Preserve calculation traces from all specialists              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    5. ANTICIPATION ENGINE                        │   │
│  │                                                                   │   │
│  │  • Predict follow-up questions                                   │   │
│  │  • Pre-compute likely next queries                               │   │
│  │  • Prepare "ready to reveal" information                         │   │
│  │  • Suggest related insights                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Intent Classification

### Domain Keyword Mapping

```typescript
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  vms: [
    'vendor', 'supplier', 'staffing', 'agency',
    'contractor', 'contingent', 'temp', 'resource',
    'purchase order', 'po', 'po number',
    'invoice', 'billing', 'payment terms',
    'timecard', 'timesheet', 'hours worked',
    'rate card', 'bill rate', 'pay rate', 'markup',
    'sow', 'statement of work', 'work order',
    'assignment', 'extension', 'offboarding',
    'tenure', 'co-employment', '1099', 'classification'
  ],
  
  hris: [
    'employee', 'staff', 'team member',
    'benefits', 'health insurance', '401k', 'pto', 'vacation',
    'payroll', 'salary', 'compensation', 'bonus',
    'performance review', 'annual review',
    'onboarding', 'offboarding', 'termination',
    'org chart', 'organization', 'reporting structure',
    'w2', 'direct hire', 'full-time', 'part-time',
    'compliance training', 'certifications'
  ],
  
  ats: [
    'candidate', 'applicant', 'talent',
    'requisition', 'job opening', 'job posting',
    'interview', 'screening', 'assessment',
    'offer', 'offer letter', 'negotiation',
    'hiring', 'recruiting', 'sourcing',
    'resume', 'cv', 'application',
    'pipeline', 'funnel', 'conversion rate',
    'time to fill', 'time to hire'
  ],
  
  pm: [
    'project', 'program', 'portfolio',
    'task', 'subtask', 'work item',
    'milestone', 'deliverable', 'deadline',
    'sprint', 'iteration', 'release',
    'resource allocation', 'capacity',
    'gantt', 'timeline', 'schedule',
    'dependency', 'blocker', 'risk',
    'scope', 'burndown', 'velocity'
  ],
  
  finance: [
    'budget', 'forecast', 'projection',
    'accrual', 'prepaid', 'amortization',
    'gl', 'general ledger', 'chart of accounts',
    'cost center', 'department code',
    'audit', 'audit trail', 'sox',
    'fiscal year', 'quarter', 'period close',
    'variance', 'variance analysis',
    'reconciliation', 'financial report'
  ]
};
```

### Intent Classification Algorithm

```typescript
interface IntentClassification {
  primaryDomain: string | null;
  secondaryDomains: string[];
  confidence: number;
  isCrossDomain: boolean;
  keywordsFound: Record<string, string[]>;
}

function classifyIntent(query: string): IntentClassification {
  const normalizedQuery = query.toLowerCase();
  const keywordsFound: Record<string, string[]> = {};
  const domainScores: Record<string, number> = {};
  
  // Score each domain based on keyword matches
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    keywordsFound[domain] = [];
    domainScores[domain] = 0;
    
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword)) {
        keywordsFound[domain].push(keyword);
        // Weight multi-word keywords higher (more specific)
        domainScores[domain] += keyword.includes(' ') ? 2 : 1;
      }
    }
  }
  
  // Sort domains by score
  const sortedDomains = Object.entries(domainScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedDomains.length === 0) {
    return {
      primaryDomain: null,
      secondaryDomains: [],
      confidence: 0,
      isCrossDomain: false,
      keywordsFound
    };
  }
  
  const primaryDomain = sortedDomains[0][0];
  const primaryScore = sortedDomains[0][1];
  const secondaryDomains = sortedDomains.slice(1)
    .filter(([_, score]) => score >= primaryScore * 0.5) // At least 50% of primary
    .map(([domain]) => domain);
  
  // Calculate confidence (normalize score)
  const maxPossibleScore = DOMAIN_KEYWORDS[primaryDomain].length * 2;
  const confidence = Math.min(primaryScore / 5, 1); // Cap at 1.0
  
  return {
    primaryDomain,
    secondaryDomains,
    confidence,
    isCrossDomain: secondaryDomains.length > 0,
    keywordsFound
  };
}
```

### Example Classifications

```typescript
// Single domain - high confidence
classifyIntent("What's the budget remaining on PO-2025-0042?")
// → { primaryDomain: 'vms', secondaryDomains: [], confidence: 0.9 }

// Cross-domain - VMS + PM
classifyIntent("How much is contractor John costing the Alpha Project?")
// → { primaryDomain: 'vms', secondaryDomains: ['pm'], confidence: 0.8 }

// Cross-domain - VMS + Finance
classifyIntent("What's the accrual for pending invoices on this PO?")
// → { primaryDomain: 'finance', secondaryDomains: ['vms'], confidence: 0.75 }

// Ambiguous - needs clarification
classifyIntent("What's the status?")
// → { primaryDomain: null, confidence: 0, needsClarification: true }
```

---

## 2. Context Preparation

### Context Packet Structure

```typescript
interface ContextPacket {
  // User context
  user: {
    id: string;
    role: string;
    permissions: string[];
    recentQueries: string[];
  };
  
  // Query context
  query: {
    original: string;
    normalized: string;
    intent: IntentClassification;
    entities: ExtractedEntities; // PO numbers, contractor names, etc.
  };
  
  // Company context
  company: {
    id: string;
    industry: string;
    config: CompanyConfig;
    activeModifiers: Modifier[];
  };
  
  // Specialist-specific context
  specialistContext: {
    relevantData: any; // Pre-fetched data the specialist might need
    previousInteractions: any[]; // Conversation history
    relatedAlerts: Alert[]; // Active alerts in this domain
  };
}
```

### Pre-fetching Strategy

```typescript
async function prepareContext(intent: IntentClassification, query: string): Promise<ContextPacket> {
  const entities = extractEntities(query);
  
  // Pre-fetch data the specialist will likely need
  const prefetchPromises = [];
  
  if (entities.poNumber) {
    prefetchPromises.push(fetchPO(entities.poNumber));
    prefetchPromises.push(fetchPOInvoices(entities.poNumber));
    prefetchPromises.push(fetchPOTimecards(entities.poNumber));
  }
  
  if (entities.contractorName) {
    prefetchPromises.push(fetchContractor(entities.contractorName));
    prefetchPromises.push(fetchContractorTimecards(entities.contractorName));
  }
  
  if (entities.vendorName) {
    prefetchPromises.push(fetchVendor(entities.vendorName));
    prefetchPromises.push(fetchVendorPerformance(entities.vendorName));
  }
  
  // Fetch in parallel
  const prefetchedData = await Promise.all(prefetchPromises);
  
  return {
    // ... assemble context packet
  };
}
```

---

## 3. Specialist Routing

### Routing Strategy

```typescript
type RoutingStrategy = 'single' | 'parallel' | 'sequential' | 'consensus';

interface RoutingPlan {
  strategy: RoutingStrategy;
  specialists: SpecialistCall[];
  timeout: number;
  fallback: string;
}

interface SpecialistCall {
  specialist: string;
  isPrimary: boolean;
  context: ContextPacket;
  expectedResponseType: string;
  timeout: number;
}

function createRoutingPlan(intent: IntentClassification): RoutingPlan {
  if (!intent.isCrossDomain) {
    // Single specialist can handle
    return {
      strategy: 'single',
      specialists: [{
        specialist: intent.primaryDomain,
        isPrimary: true,
        context: prepareContext(intent),
        expectedResponseType: 'full',
        timeout: 30000
      }],
      timeout: 30000,
      fallback: 'general'
    };
  }
  
  // Cross-domain: query multiple specialists in parallel
  return {
    strategy: 'parallel',
    specialists: [
      {
        specialist: intent.primaryDomain,
        isPrimary: true,
        context: prepareContext(intent),
        expectedResponseType: 'full',
        timeout: 30000
      },
      ...intent.secondaryDomains.map(domain => ({
        specialist: domain,
        isPrimary: false,
        context: prepareContext(intent),
        expectedResponseType: 'supplementary',
        timeout: 20000
      }))
    ],
    timeout: 35000,
    fallback: intent.primaryDomain
  };
}
```

### MCP Communication

```typescript
async function routeToSpecialist(call: SpecialistCall): Promise<SpecialistResponse> {
  const mcpClient = getMCPClient(call.specialist);
  
  try {
    // Send query via MCP protocol
    const response = await mcpClient.callTool({
      name: 'process_query',
      arguments: {
        query: call.context.query.original,
        context: call.context,
        responseType: call.expectedResponseType
      }
    });
    
    return {
      specialist: call.specialist,
      success: true,
      response: response,
      traces: response.traces || [],
      confidence: response.confidence || 1.0
    };
    
  } catch (error) {
    return {
      specialist: call.specialist,
      success: false,
      error: error.message,
      fallbackSuggestion: call.fallback
    };
  }
}

async function executeRoutingPlan(plan: RoutingPlan): Promise<SpecialistResponse[]> {
  switch (plan.strategy) {
    case 'single':
      return [await routeToSpecialist(plan.specialists[0])];
      
    case 'parallel':
      return Promise.all(plan.specialists.map(routeToSpecialist));
      
    case 'sequential':
      const results = [];
      for (const specialist of plan.specialists) {
        const result = await routeToSpecialist(specialist);
        results.push(result);
        if (!result.success) break;
      }
      return results;
      
    case 'consensus':
      // All specialists must agree
      const allResponses = await Promise.all(plan.specialists.map(routeToSpecialist));
      return resolveConsensus(allResponses);
  }
}
```

---

## 4. Response Synthesis

### Synthesis Strategies

```typescript
type SynthesisStrategy = 'primary_with_supplements' | 'merge' | 'compare' | 'resolve_conflict';

interface SynthesizedResponse {
  answer: string;
  primarySource: string;
  contributingSources: string[];
  traces: CalculationTrace[];
  conflicts?: ConflictResolution[];
  relatedInsights?: string[];
}

function synthesizeResponses(
  responses: SpecialistResponse[],
  strategy: SynthesisStrategy
): SynthesizedResponse {
  
  switch (strategy) {
    case 'primary_with_supplements':
      // Use primary specialist's response, enrich with others
      const primary = responses.find(r => r.isPrimary && r.success);
      const supplements = responses.filter(r => !r.isPrimary && r.success);
      
      return {
        answer: primary.response.answer,
        primarySource: primary.specialist,
        contributingSources: supplements.map(s => s.specialist),
        traces: [
          ...primary.response.traces,
          ...supplements.flatMap(s => s.response.traces)
        ],
        relatedInsights: supplements.map(s => s.response.relatedInsight)
      };
      
    case 'merge':
      // Combine all responses into unified answer
      return mergeResponses(responses);
      
    case 'compare':
      // Present multiple viewpoints
      return compareResponses(responses);
      
    case 'resolve_conflict':
      // Specialists disagree - resolve
      return resolveConflict(responses);
  }
}
```

### Conflict Resolution

```typescript
interface ConflictResolution {
  topic: string;
  positions: {
    specialist: string;
    position: string;
    reasoning: string;
    confidence: number;
  }[];
  resolution: string;
  resolutionMethod: 'higher_confidence' | 'domain_authority' | 'user_decision' | 'policy';
}

function resolveConflict(responses: SpecialistResponse[]): SynthesizedResponse {
  // Identify conflicts
  const conflicts = findConflicts(responses);
  
  for (const conflict of conflicts) {
    // Resolution hierarchy:
    // 1. Domain authority (VMS is authority on invoices, PM on milestones)
    // 2. Higher confidence score
    // 3. Policy-based resolution
    // 4. Escalate to user
    
    if (hasDomainAuthority(conflict)) {
      conflict.resolution = conflict.positions.find(
        p => p.specialist === getDomainAuthority(conflict.topic)
      ).position;
      conflict.resolutionMethod = 'domain_authority';
    } else if (hasHighConfidence(conflict)) {
      conflict.resolution = conflict.positions.sort(
        (a, b) => b.confidence - a.confidence
      )[0].position;
      conflict.resolutionMethod = 'higher_confidence';
    } else {
      conflict.resolutionMethod = 'user_decision';
      conflict.resolution = 'Requires your input to resolve';
    }
  }
  
  return {
    // ... synthesized response with conflicts noted
    conflicts
  };
}
```

### Example Synthesis

```typescript
// Query: "How much is contractor John costing the ABC Project?"
// VMS responds: "$45,000 in contractor costs this month"
// PM responds: "Project ABC has $45,000 in resource costs, $38,000 remaining"

synthesizeResponses([vmsResponse, pmResponse], 'primary_with_supplements')
// → {
//   answer: "Contractor John's cost to ABC Project this month is $45,000.
//            The project has $38,000 budget remaining after this allocation.",
//   primarySource: 'vms',
//   contributingSources: ['pm'],
//   traces: [vmsCalcTrace, pmBudgetTrace],
//   relatedInsights: [
//     "At current burn rate, project budget will last 2.5 more months"
//   ]
// }
```

---

## 5. Anticipation Engine

### Predict Follow-Up Questions

```typescript
interface AnticipatedQuestion {
  question: string;
  likelihood: number; // 0-1
  precomputedAnswer?: any;
  specialist: string;
}

function anticipateFollowUps(
  originalQuery: string,
  response: SynthesizedResponse
): AnticipatedQuestion[] {
  const anticipated: AnticipatedQuestion[] = [];
  
  // Pattern: Budget query → anticipate burn rate, end date
  if (response.primarySource === 'vms' && originalQuery.includes('budget')) {
    anticipated.push({
      question: "What's the burn rate?",
      likelihood: 0.85,
      precomputedAnswer: precomputeBurnRate(response.context),
      specialist: 'vms'
    });
    anticipated.push({
      question: "When will the budget run out?",
      likelihood: 0.75,
      precomputedAnswer: precomputeExhaustionDate(response.context),
      specialist: 'vms'
    });
  }
  
  // Pattern: Contractor cost → anticipate comparison, margin
  if (originalQuery.includes('contractor') && originalQuery.includes('cost')) {
    anticipated.push({
      question: "How does this compare to other contractors?",
      likelihood: 0.60,
      specialist: 'vms'
    });
    anticipated.push({
      question: "What's the margin on this contractor?",
      likelihood: 0.70,
      precomputedAnswer: precomputeMargin(response.context),
      specialist: 'vms'
    });
  }
  
  // Pattern: Vendor performance → anticipate comparison, trends
  if (response.primarySource === 'vms' && originalQuery.includes('vendor')) {
    anticipated.push({
      question: "How do they compare to other vendors?",
      likelihood: 0.65,
      specialist: 'vms'
    });
  }
  
  return anticipated.filter(a => a.likelihood > 0.5);
}
```

### Pre-Computation Strategy

```typescript
interface PreComputationCache {
  key: string;
  computed: any;
  computedAt: Date;
  staleAfter: number; // seconds
  specialist: string;
}

async function precomputeAnticipated(
  anticipated: AnticipatedQuestion[]
): Promise<PreComputationCache[]> {
  const cache: PreComputationCache[] = [];
  
  for (const question of anticipated) {
    if (question.likelihood > 0.7 && !question.precomputedAnswer) {
      // High likelihood, not yet computed - compute now
      const result = await routeToSpecialist({
        specialist: question.specialist,
        query: question.question,
        isPrecomputation: true
      });
      
      cache.push({
        key: hashQuestion(question.question),
        computed: result,
        computedAt: new Date(),
        staleAfter: 60, // seconds
        specialist: question.specialist
      });
    }
  }
  
  return cache;
}
```

---

## Orchestrator System Prompt

```markdown
# ORCHESTRATOR / CONDUCTOR AGENT

You are the Conductor of the Velocity Intelligence Network. Your role is to 
coordinate domain specialist agents to provide comprehensive, accurate responses.

## YOUR ROLE

You do NOT answer domain questions directly. Instead, you:
1. Analyze the user's query to understand intent
2. Identify which specialist(s) should handle it
3. Prepare context and route to specialists
4. Synthesize their responses
5. Present a unified answer with full transparency

## AVAILABLE SPECIALISTS

- VMS Specialist: Vendors, contractors, POs, invoices, timecards
- HRIS Specialist: Employees, benefits, payroll, compliance
- ATS Specialist: Candidates, requisitions, interviews, offers
- PM Specialist: Projects, tasks, milestones, resources
- Finance Specialist: Budget, accruals, GL, financial reports

## ROUTING RULES

1. Single-domain queries → Route to that specialist
2. Cross-domain queries → Route to all relevant specialists in parallel
3. Ambiguous queries → Ask for clarification before routing
4. Unknown domain → Attempt to classify, or ask user

## SYNTHESIS RULES

1. Always preserve calculation traces from all specialists
2. Cite which specialist provided each piece of information
3. If specialists disagree, note the conflict and resolution method
4. Include related insights from secondary specialists

## ANTICIPATION

After every response, predict likely follow-up questions and pre-compute answers.
The user should never wait for information that was predictable.

## TRANSPARENCY

Every synthesized response must include:
- Primary source specialist
- Contributing specialists
- Calculation traces (ready to reveal)
- Any conflicts and how they were resolved
```

---

## Error Handling

```typescript
interface OrchestratorError {
  type: 'classification_failure' | 'routing_failure' | 'synthesis_failure' | 'timeout';
  message: string;
  partialResult?: SynthesizedResponse;
  suggestedAction: string;
}

function handleOrchestratorError(error: OrchestratorError): Response {
  switch (error.type) {
    case 'classification_failure':
      return {
        message: "I couldn't determine which area this relates to. Could you clarify?",
        suggestedDomains: getAllDomains()
      };
      
    case 'routing_failure':
      return {
        message: `The ${error.failedSpecialist} specialist is unavailable. ` +
                 `Here's what I could gather from other specialists:`,
        partialResult: error.partialResult
      };
      
    case 'synthesis_failure':
      return {
        message: "I received conflicting information. Here are the different perspectives:",
        conflicts: error.conflicts
      };
      
    case 'timeout':
      return {
        message: "This is taking longer than expected. " +
                 "Here's what I have so far:",
        partialResult: error.partialResult
      };
  }
}
```

---

## Related Documents

- `/docs/architecture/AGENT_ARCHITECTURE_BLUEPRINT.md` - Overall architecture
- `/docs/architecture/VMS_SPECIALIST_AGENT.md` - VMS specialist details
- `/docs/principles/CUSTOMIZATION_PHILOSOPHY.md` - Variable modifiers
- `src/lib/formula-registry.ts` - Calculation definitions
