import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Target, TrendingUp, Zap, Users, Shield, Brain, FileText, Clock } from "lucide-react";

const expertPersonas = [
  {
    id: "cpo",
    role: "Chief Procurement Officer (CPO)",
    icon: <Target className="h-5 w-5" />,
    color: "blue",
    painPoints: [
      "Vendor crises escalate unexpectedly (E-Plus cost spike from $380K → $450K)",
      "SOW automation takes 30 days → loses competitive agility",
      "Contract renewals sneak up → forced into unfavorable terms",
      "No visibility into vendor performance across 165+ projects",
      "Emergency procurement at 30-50% premium rates due to lack of planning"
    ],
    careAbout: [
      "Cost avoidance and vendor consolidation savings",
      "Contract compliance and risk mitigation",
      "Vendor performance scorecards",
      "Procurement cycle time reduction"
    ],
    solutions: [
      {
        feature: "Vendor Performance Scorecard",
        location: "/vendors",
        impact: "Predicts vendor crises 3+ months ahead with risk scoring (1-100)"
      },
      {
        feature: "AI Contract Gap Analysis",
        location: "/ai/contract-analysis",
        impact: "Identifies missing clauses (indemnification, liability caps) in 2 minutes vs 70 minutes manual"
      },
      {
        feature: "Purchase Order Budget Tracking",
        location: "/purchaseorders",
        impact: "Real-time spend visibility with 25%/50%/90% threshold alerts"
      },
      {
        feature: "SOW Template Automation",
        location: "/statementofworks",
        impact: "Reduces 30-day SOW cycles to 3-5 days with AI-powered generation"
      }
    ],
    overdelivery: [
      "🎯 Vendor cost escalation prediction (flags E-Plus scenarios 90 days early)",
      "🎯 AI-powered contract risk scoring before signature",
      "🎯 Automated vendor consolidation recommendations (save 15-25% annually)",
      "🎯 Integration with finance data shows real-time budget impact"
    ]
  },
  {
    id: "pm",
    role: "Senior Project Manager (165-Project Portfolio)",
    icon: <Users className="h-5 w-5" />,
    color: "green",
    painPoints: [
      "Managing 165+ active projects on whiteboard with zero visibility tools",
      "Can't answer 'What are my top 5 at-risk projects?' without 2 hours of PowerPoint work",
      "Resource conflicts (Emily assigned to 3 critical projects simultaneously) discovered too late",
      "Dependency blindness: Active Directory upgrade blocking 6 downstream projects worth $2.3M",
      "Executive asks 'What's at risk?' and PM can't answer instantly"
    ],
    careAbout: [
      "On-time delivery rate across portfolio",
      "Resource utilization and conflict prevention",
      "Dependency visualization and critical path",
      "Stakeholder confidence and executive dashboards"
    ],
    solutions: [
      {
        feature: "Portfolio Health Dashboard",
        location: "/dashboard",
        impact: "Real-time visibility into all 165 projects with automated health scoring"
      },
      {
        feature: "Resource Conflict Detection",
        location: "/contractors",
        impact: "Alerts when contractor assigned to multiple critical projects"
      },
      {
        feature: "Dependency Visualization",
        location: "/purchaseorders",
        impact: "Shows project interdependencies and cascade failure scenarios"
      },
      {
        feature: "Executive Self-Service KPIs",
        location: "/dashboard",
        impact: "CEO/CFO can answer 'What's at risk?' without PM in room (saves 80% reporting time)"
      }
    ],
    overdelivery: [
      "🎯 AI-powered critical path optimizer suggests highest-leverage interventions",
      "🎯 What-if scenario planning shows cascade impact of delays",
      "🎯 Predictive timeline estimates with confidence intervals",
      "🎯 Slack/Teams integration for proactive conflict alerts"
    ]
  },
  {
    id: "vms",
    role: "VMS Director / Contingent Workforce Manager",
    icon: <Users className="h-5 w-5" />,
    color: "purple",
    painPoints: [
      "Bad contractor hire costs 3 months + project delays + reputation damage",
      "Can't quickly see contractor performance across multiple projects",
      "Contractors approaching end-of-engagement discovered at last minute (60-90 day backfill scramble)",
      "Skill gaps identified reactively during crisis vs proactively 60-90 days ahead",
      "No market rate benchmarking → overpaying contractors by 15-30%"
    ],
    careAbout: [
      "Contractor quality scores and performance history",
      "Time-to-fill and cost-per-hire metrics",
      "Skills gap prediction and workforce planning",
      "Retention rate and contractor satisfaction"
    ],
    solutions: [
      {
        feature: "Contractor Performance History",
        location: "/contractors",
        impact: "Unified view of contractor performance across all past projects"
      },
      {
        feature: "AI Resume Parsing",
        location: "/contractors/create",
        impact: "80% time savings vs manual screening with semantic skill matching"
      },
      {
        feature: "End-of-Engagement Alerts",
        location: "/dashboard",
        impact: "60-90 day advance warning for backfill planning"
      },
      {
        feature: "Compliance Tracking",
        location: "/contractors",
        impact: "Auto-alerts for I-9, E-Verify, certification expirations"
      }
    ],
    overdelivery: [
      "🎯 Predictive skills gap analysis (flags IoT security specialist need 60 days ahead)",
      "🎯 Contractor rate benchmarking against market data",
      "🎯 'Batting average' scoring weighted for recent performance",
      "🎯 Pre-vetted talent pool marketplace integration"
    ]
  },
  {
    id: "finance",
    role: "Finance Controller / CFO",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "yellow",
    painPoints: [
      "Budget surprises discovered at month-end instead of real-time",
      "Invoice errors caught after payment (too late to recover funds)",
      "Vendor cost creep undetected until annual budget review",
      "No visibility into labor cost variance until payroll runs",
      "Timecard-to-invoice reconciliation takes 40+ hours per cycle"
    ],
    careAbout: [
      "Budget variance early warning (catch overruns before crisis)",
      "Invoice accuracy and payment approval confidence",
      "Spend visibility by vendor/project/department",
      "Compliance with procurement policies and thresholds"
    ],
    solutions: [
      {
        feature: "Real-Time Budget Tracking",
        location: "/purchaseorders",
        impact: "Budget variance alerts trigger at 25%/50%/90% thresholds (not month-end)"
      },
      {
        feature: "Invoice Variance Detection",
        location: "/invoices",
        impact: "Flags invoices 18%+ higher than contract rate before approval"
      },
      {
        feature: "Automated Timecard Reconciliation",
        location: "/timecards",
        impact: "Reduces 40-hour reconciliation cycle to 2 hours with auto-matching"
      },
      {
        feature: "Spend Analytics Dashboard",
        location: "/budget/forecasting",
        impact: "Real-time spend trends by vendor, project, contractor"
      }
    ],
    overdelivery: [
      "🎯 Predictive budget overrun warnings (3 months ahead)",
      "🎯 Vendor cost escalation trend analysis",
      "🎯 AI-powered invoice anomaly detection",
      "🎯 Cost optimization recommendations (save $67K-$90K annually per vendor)"
    ]
  },
  {
    id: "it",
    role: "IT Director / Systems Architect",
    icon: <Shield className="h-5 w-5" />,
    color: "red",
    painPoints: [
      "Integration hell: 15-20 fragmented HR/staffing tools with no interoperability",
      "Custom code maintenance burden consuming 60% of dev team capacity",
      "EOL surprises: 2 network switches discovered past end-of-life during audit",
      "Every department wants different tool → data silos multiply",
      "Token conflicts and authentication nightmares across systems"
    ],
    careAbout: [
      "System uptime (99.99% SLA) and reliability",
      "Integration coverage (reduce 15 tools to 1 unified platform)",
      "Tech debt reduction and maintainability",
      "SSO and unified authentication"
    ],
    solutions: [
      {
        feature: "Multi-Tenant Architecture with RLS",
        location: "Backend infrastructure",
        impact: "Single codebase supports multiple companies with data isolation"
      },
      {
        feature: "API Marketplace & iPaaS Layer",
        location: "/admin/integrations",
        impact: "Pre-built connectors for Workday, SAP, Oracle, ADP, Salesforce, Jira, AD"
      },
      {
        feature: "Unified Authentication (JWT + SSO)",
        location: "Auth provider",
        impact: "One login system eliminates token conflicts"
      },
      {
        feature: "Asset EOL Monitoring",
        location: "/assets",
        impact: "Tracks end-of-life dates with 90/60/30-day advance warnings"
      }
    ],
    overdelivery: [
      "🎯 Hybrid deployment (cloud, on-premise, edge) flexibility",
      "🎯 Webhook/API support for bidirectional data flow",
      "🎯 Database triggers for automated business logic (no custom code)",
      "🎯 99.99% uptime SLA with PostgreSQL replication"
    ]
  }
];

const platformPhilosophy = [
  {
    principle: "Every Page Solves 3+ Expert Pain Points Simultaneously",
    explanation: "Purchase Orders page serves CPO (vendor costs), PM (project dependencies), and Finance (budget impact) from same data"
  },
  {
    principle: "Every Clickable Element Anticipated (Users Never Guess)",
    explanation: "Click PO# → detail view, Click Vendor → vendor page, Click Status → filter, Click Date → range select"
  },
  {
    principle: "Every Detail Page Shows Metadata Context",
    explanation: "Who created it, when, where it came from, what it relates to, full audit trail"
  },
  {
    principle: "Every Dashboard Tailored to Expert's Decision-Making",
    explanation: "CPO sees vendor risk scores, PM sees portfolio health, Finance sees budget variance"
  },
  {
    principle: "Every Feature Shows Deep Job Understanding",
    explanation: "Wow factors like vendor crisis prediction, skills gap analysis, budget overrun warnings prove we understand their challenges"
  }
];

const successMetrics = [
  {
    expert: "CPO",
    metrics: [
      { name: "Vendor crisis detection", before: "Reactive (during crisis)", after: "Proactive (3-month prediction)" },
      { name: "SOW cycle time", before: "30 days", after: "3-5 days" },
      { name: "Contract surprise prevention", before: "0% visibility", after: "100% renewal calendar" }
    ]
  },
  {
    expert: "PM",
    metrics: [
      { name: "Project visibility", before: "165 projects on whiteboard", after: "Real-time unified dashboard" },
      { name: "At-risk detection", before: "Manual PowerPoint", after: "Automated risk scoring" },
      { name: "Resource conflict resolution", before: "Hours of meetings", after: "Real-time availability view" }
    ]
  },
  {
    expert: "Finance",
    metrics: [
      { name: "Budget variance detection", before: "End of month", after: "When invoice created (real-time)" },
      { name: "Invoice error catch rate", before: "Post-payment", after: "Pre-payment approval" },
      { name: "Vendor cost creep visibility", before: "Annual budget surprise", after: "Monthly trend dashboard" }
    ]
  }
];

export function PlatformDefinitionPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Definition & Research Insights</h1>
          <p className="text-muted-foreground mt-2">
            Expert-centered architecture proving deep understanding of workforce management pain points
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Brain className="h-4 w-4 mr-2" />
          10 Expert Personas
        </Badge>
      </div>

      <Tabs defaultValue="personas" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full h-12 bg-slate-900/50 p-1 gap-1">
          <TabsTrigger 
            value="personas" 
            className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 flex items-center gap-2 text-slate-400 hover:text-slate-200"
          >
            <Users className="h-4 w-4" />
            Expert Personas
          </TabsTrigger>
          <TabsTrigger 
            value="philosophy"
            className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-violet-300 data-[state=active]:border-b-2 data-[state=active]:border-violet-500 flex items-center gap-2 text-slate-400 hover:text-slate-200"
          >
            <Brain className="h-4 w-4" />
            Philosophy
          </TabsTrigger>
          <TabsTrigger 
            value="metrics"
            className="data-[state=active]:bg-emerald-600/30 data-[state=active]:text-emerald-300 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 flex items-center gap-2 text-slate-400 hover:text-slate-200"
          >
            <TrendingUp className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="architecture"
            className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 flex items-center gap-2 text-slate-400 hover:text-slate-200"
          >
            <Shield className="h-4 w-4" />
            Architecture
          </TabsTrigger>
          <TabsTrigger 
            value="roi"
            className="data-[state=active]:bg-amber-600/30 data-[state=active]:text-amber-300 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 flex items-center gap-2 text-slate-400 hover:text-slate-200"
          >
            <Zap className="h-4 w-4" />
            ROI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>The 10 Expert Personas We Serve</CardTitle>
              <CardDescription>
                Each role has unique pain points. Our platform solves them all simultaneously with unified data architecture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {expertPersonas.map((persona) => (
                  <AccordionItem key={persona.id} value={persona.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${persona.color}-100 text-${persona.color}-600`}>
                          {persona.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{persona.role}</div>
                          <div className="text-sm text-muted-foreground">
                            {persona.painPoints.length} pain points addressed
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Pain Points */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500" />
                          Pain Points
                        </h4>
                        <ul className="space-y-2">
                          {persona.painPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What They Care About */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          What They Care About
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.careAbout.map((item, idx) => (
                            <Badge key={idx} variant="secondary">{item}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* How We Solve It */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          How We Solve It
                        </h4>
                        <div className="space-y-3">
                          {persona.solutions.map((solution, idx) => (
                            <div key={idx} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{solution.feature}</div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {solution.impact}
                                  </div>
                                </div>
                                <Badge variant="outline">{solution.location}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Platform Overdelivery */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Platform Overdelivery (Wow Factors)
                        </h4>
                        <ul className="space-y-2">
                          {persona.overdelivery.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-yellow-500">🎯</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="philosophy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Design Philosophy</CardTitle>
              <CardDescription>
                Five principles guiding every decision, feature, and user interaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformPhilosophy.map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{idx + 1}. {item.principle}</h4>
                  <p className="text-sm text-muted-foreground">{item.explanation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Metrics by Expert</CardTitle>
              <CardDescription>
                Before vs After: Quantifiable improvements for each persona
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {successMetrics.map((expert, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold mb-3">{expert.expert}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-left py-2">Before Platform</th>
                          <th className="text-left py-2">After Platform</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expert.metrics.map((metric, midx) => (
                          <tr key={midx} className="border-b">
                            <td className="py-3">{metric.name}</td>
                            <td className="py-3 text-red-600">{metric.before}</td>
                            <td className="py-3 text-green-600 font-semibold">{metric.after}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Architecture Overview</CardTitle>
              <CardDescription>
                Unified backend serving 10 expert personas with role-based dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-4">Core Architecture</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>PostgreSQL Backend:</strong> Single source of truth for all data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Multi-Tenant RLS:</strong> Company-level data isolation with Row-Level Security</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>REST API:</strong> Express.js with JWT authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Hybrid Search:</strong> pgvector (semantic) + BM25 (keyword) with RRF scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>AI Integration:</strong> Claude API for contract analysis, SOW generation, data extraction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span><strong>Dual-Mode:</strong> Demo mode (mock data) + Production mode (live database)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-4">Integration Layer (iPaaS)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Active Directory", "Okta/Azure AD", "ADP/Workday", "NetSuite/SAP", "Jira/Asana", "Salesforce", "Stripe/ACH", "Slack/Teams", "DocuSign"].map((integration) => (
                      <Badge key={integration} variant="secondary" className="justify-center py-2">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return on Investment (ROI)</CardTitle>
              <CardDescription>
                Quantifiable savings and productivity gains across expert personas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/50 border border-emerald-700/50 rounded-lg">
                  <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Savings
                  </h4>
                  <ul className="space-y-1 text-sm text-emerald-200/90">
                    <li>• Contract review: 70 minutes → 2 minutes (97% reduction)</li>
                    <li>• SOW generation: 65 minutes → 5 minutes (92% reduction)</li>
                    <li>• Vendor data entry: 2.5 hours → 35 seconds (99% reduction)</li>
                    <li>• Portfolio reporting: 2 hours → 10 seconds (99.9% reduction)</li>
                    <li>• Invoice reconciliation: 40 hours → 2 hours (95% reduction)</li>
                  </ul>
                </div>

                <div className="p-4 bg-cyan-950/50 border border-cyan-700/50 rounded-lg">
                  <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Cost Avoidance
                  </h4>
                  <ul className="space-y-1 text-sm text-cyan-200/90">
                    <li>• Vendor consolidation: 15-25% annual savings ($200K-$500K for $2M spend)</li>
                    <li>• Emergency procurement prevention: 30-50% premium avoided</li>
                    <li>• Contractor rate optimization: 15-30% market benchmark savings</li>
                    <li>• Budget overrun prevention: 3-month early warning prevents crisis costs</li>
                  </ul>
                </div>

                <div className="p-4 bg-violet-950/50 border border-violet-700/50 rounded-lg">
                  <h4 className="font-semibold text-violet-300 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Risk Reduction
                  </h4>
                  <ul className="space-y-1 text-sm text-violet-200/90">
                    <li>• Vendor crisis prediction: 90-day advance warning prevents service disruptions</li>
                    <li>• Contract compliance: 100% visibility into renewal dates and unfavorable clauses</li>
                    <li>• Resource conflict prevention: Real-time detection prevents project delays</li>
                    <li>• Audit trail completeness: 100% compliance with SOC2, GDPR, HIPAA</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-2 border-amber-500/50 rounded-lg">
                  <h4 className="font-bold text-amber-300 text-lg mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Total Annual ROI Estimate
                  </h4>
                  <p className="text-4xl font-bold text-amber-200">5-10x</p>
                  <p className="text-sm text-amber-300/80 mt-2">
                    For a mid-market company with $5M annual contractor spend and 50+ projects,
                    platform saves $250K-$500K annually in time, cost avoidance, and risk mitigation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Research Documents
          </CardTitle>
          <CardDescription>
            Strategic documents and knowledge base artifacts informing platform design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a href="/VELOCITY_BUILD_ASSESSMENT.md" className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
              <div className="font-medium">VELOCITY Build Assessment</div>
              <div className="text-sm text-muted-foreground">Frontend demo vs full-stack intelligence network comparison</div>
            </a>
            <a href="/VELOCITY_GAP_ANALYSIS.md" className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
              <div className="font-medium">VELOCITY Gap Analysis</div>
              <div className="text-sm text-muted-foreground">Current state vs strategic specifications - what's missing and why</div>
            </a>
            <a href="/KNOWLEDGE_BASE_CATALOG.md" className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
              <div className="font-medium">Knowledge Base Catalog</div>
              <div className="text-sm text-muted-foreground">Complete research library and expert persona insights</div>
            </a>
            <a href="/TESTING_CHECKLIST.md" className="block p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
              <div className="font-medium">Testing Checklist</div>
              <div className="text-sm text-muted-foreground">Proof-of-work validation for all critical workflows</div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
