import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Shield,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Clock,
  Briefcase,
  Users,
  DollarSign,
  CheckCircle2,
  Brain,
  Eye,
  Target,
  ArrowRight,
  Scale,
  Crown,
  BarChart3,
  Map,
  MessageCircle,
  Radio,
  Play,
} from "lucide-react";

interface PersonaProfile {
  id: string;
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  stressors: string[];
  exclamationMoments: string[];
  morningRitual: string[];
  completePictureElements: string[];
  decisionLanguage: Record<string, string>;
  systemPrompt: string;
}

const personas: PersonaProfile[] = [
  {
    id: "hiring-manager",
    name: "Hiring Manager (Ben)",
    title: "Project Lead / Overwhelmed Department Manager",
    icon: <Users className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    stressors: [
      "Budget overruns discovered mid-week",
      "Timecard approvals stuck, contractors unpaid",
      "SOW consumption creeping up invisibly",
      "Contractor assignments scattered across systems",
      "Change orders approved without visibility",
    ],
    exclamationMoments: [
      "One-click approval of all pending timecards (30 sec vs 2 hours)",
      "Real-time budget burn rate that ACTUALLY matches reality",
      "SOW milestone tracker showing exactly how much runway left",
      "Contractor availability matrix updated automatically",
      "Alert 3 days BEFORE budget threshold, not after",
    ],
    morningRitual: [
      "Check pending approvals (anxious: how many can I clear today?)",
      "Scan project budget vs actual (terrified of surprises)",
      "Review contractor utilization (is anyone sitting idle?)",
      "Look for alerts (dread the red ones)",
      "Check if any SOWs are nearing end (scramble to extend or offboard)",
    ],
    completePictureElements: [
      "Total committed spend (SOWs + POs + known changes)",
      "Actual spend to date vs committed",
      "Days of runway remaining at current burn",
      "All pending approvals count by type",
      "Contractors at risk of non-renewal or expiration",
      "Open change requests waiting for decision",
      "Compliance status of active contractors",
    ],
    decisionLanguage: {
      Speed: "How fast can I get this done and stop thinking about it?",
      Cost: "Will this overrun my budget? By how much?",
      Quality: "Will this person actually deliver what I need?",
      Risk: "What's going to blow up in my face?",
      Visibility: "Can I see this at a glance or will I spend an hour digging?",
    },
    systemPrompt: `You are VINessa Legendary, the expert advisor for overwhelmed Hiring Managers. Your persona:
- You understand Ben is drowning in decisions and needs ONE clear answer, not five options
- You speak in urgency/cost/quality/risk language, not technical jargon
- You compile complete pictures from scattered data: sooner data = prevented panic
- You predict problems 3 days out, not report them when crisis hits
- You know Ben's morning anxiety is about hidden surprises, so you surface them proactively
- You celebrate wins (like clearing 30 timecards at once) as if they're real accomplishments
- You understand Ben will make different decisions based on "money left this month" vs "money left total"

When Ben asks about a contractor or project:
1. Immediately show: Status | Days to decision | Budget impact | Compliance risk
2. Flag any approaching threshold (budget, compliance, time to renewal)
3. Suggest one clear action with business impact
4. Never make Ben guess what something means`,
  },
  {
    id: "finance-manager",
    name: "Finance/AP Manager",
    title: "Accounts Payable / Accuracy Guardian",
    icon: <DollarSign className="h-6 w-6" />,
    color: "from-amber-500 to-orange-500",
    stressors: [
      "Invoice mismatches creating reconciliation nightmares",
      "Duplicate payments discovered weeks later",
      "Timecard-invoice discrepancies hiding non-compliant work",
      "Budget overages found during close, too late to prevent",
      "Late payment penalties destroying relationships",
      "Audit trail gaps when questioned",
    ],
    exclamationMoments: [
      "Timecard perfectly matches invoice on first check",
      "All invoices auto-matched to approved SOWs/POs",
      "Budget forecasting shows cash flow 60 days out",
      "Variance reports identify discrepancies automatically",
      "One-click payment run with full audit trail",
    ],
    morningRitual: [
      "Check yesterday's invoice arrivals (hunt for anomalies)",
      "Run reconciliation: timecard vs invoice vs SOW (manual torture)",
      "Scan aging reports (worry about late payments)",
      "Look for budget overages (dread the audit prep)",
      "Check approval queue (hope nothing's stuck)",
    ],
    completePictureElements: [
      "All invoices with matching status (approved/flagged/discrepancy)",
      "Timecard hours vs invoiced hours variance per contractor",
      "Budget committed vs spent vs remaining per project",
      "Payment aging by vendor with penalty risk",
      "Cash flow forecast based on actual payment schedules",
      "All pending approvals by budget authority",
      "Audit trail completeness score",
    ],
    decisionLanguage: {
      Accuracy: "Does this match what was approved? Exactly?",
      Authority: "Who approved this? Is their budget intact?",
      Compliance: "Are all required approvals documented?",
      Budget: "Do we have remaining budget and authority?",
      Timing: "Will this create a cash flow problem?",
    },
    systemPrompt: `You are VINessa Legendary, the expert advisor for Finance/AP Managers. Your persona:
- You speak in ACCURACY first, speed second (opposite of hiring managers)
- You understand finance's nightmare: finding the problem AFTER money was sent
- You compile complete audit trails so Finance can answer "how did this happen?"
- You surface discrepancies as flagged items, never approve mismatches
- You know Finance wins by preventing problems, not discovering them later
- You celebrate reconciliation speed AND accuracy, not just speed
- You understand cash flow anxiety: late payments hurt vendor relationships

When Finance asks about invoices/payments:
1. Show: Match status | Discrepancy (if any) | Budget authority | Payment schedule
2. Flag any variance over threshold with root cause
3. Show audit trail completeness
4. Only approve when all checks pass
5. Predict cash flow impact`,
  },
  {
    id: "operations-manager",
    name: "Operations Manager",
    title: "Workforce Operations / Day-to-Day Smooth",
    icon: <Clock className="h-6 w-6" />,
    color: "from-slate-500 to-zinc-500",
    stressors: [
      "Timecard submission chaos on deadline",
      "Compliance documents expiring without warning",
      "Contractor no-shows creating coverage gaps",
      "Onboarding bottlenecks delaying starts",
      "Multiple client requirements creating confusion",
      "Escalations piling up unsolved",
    ],
    exclamationMoments: [
      "95%+ timecard submission rate without chasing",
      "All compliance expirations visible 30 days out",
      "Contractor availability heat map showing coverage",
      "Onboarding checklist auto-triggering next steps",
      "Escalation SLA met consistently",
    ],
    morningRitual: [
      "Check overnight issues (contractors no-show?)",
      "Scan timecard submission status (who's missing?)",
      "Review compliance expiration alerts (any fires?)",
      "Check onboarding pipeline (anyone stuck?)",
      "Look at escalation queue (what needs attention today?)",
    ],
    completePictureElements: [
      "Real-time timecard submission status by contractor",
      "Compliance document expiration calendar (30/14/7 day warnings)",
      "Contractor utilization and availability status",
      "Onboarding checklist completion by stage",
      "Escalation queue with SLA status",
      "Contractor attendance patterns",
      "Client requirement checklist per contractor",
    ],
    decisionLanguage: {
      Compliance: "Is this within our policy and client requirements?",
      Efficiency: "Can we streamline this and save time?",
      Risk: "What could go wrong if we skip this?",
      ClientImpact: "How does this affect the client experience?",
      Scalability: "Can we handle more volume if this works?",
    },
    systemPrompt: `You are VINessa Legendary, the expert advisor for Operations Managers. Your persona:
- You understand Ops runs on reliability: same process, same result, every time
- You speak in prevention, not firefighting
- You compile real-time operational views that change moment-to-moment
- You surface issues early enough to prevent escalation
- You celebrate consistency and scalability, not speed
- You know Operations wins by smooth day-to-day execution, not heroics

When Operations asks about timecards/compliance/onboarding:
1. Show: Status | On-track or at-risk | Days to deadline | Required action
2. Flag approaching deadlines with escalation prevention
3. Show pattern trends (improving or declining?)
4. Suggest process optimization
5. Enable bulk actions (bulk approve, bulk reminders)`,
  },
  {
    id: "compliance-officer",
    name: "Compliance Officer",
    title: "Regulatory / Risk Protector",
    icon: <Shield className="h-6 w-6" />,
    color: "from-red-500 to-rose-500",
    stressors: [
      "Expired certifications going unnoticed until audit",
      "Inconsistent compliance across contractors",
      "Policy changes not communicated or enforced",
      "Audit preparation scrambling at last minute",
      "Non-compliant work happening invisibly",
      "Regulatory reporting gaps discovered too late",
    ],
    exclamationMoments: [
      "100% compliance status visible in one view",
      "All certifications tracked with renewal alerts",
      "Policy violations flagged automatically",
      "Audit file ready anytime, not emergency prep",
      "Regulatory requirements checklist auto-updated",
    ],
    morningRitual: [
      "Check compliance status dashboard (are we clean?)",
      "Scan expiration calendar (what's expiring soon?)",
      "Review new violations flagged overnight",
      "Check policy acknowledgments (are they current?)",
      "Look at audit readiness score",
    ],
    completePictureElements: [
      "Compliance status dashboard per contractor/project",
      "Certification expiration calendar with alerts",
      "Policy violation log with root cause",
      "Audit trail completeness by requirement",
      "Regulatory requirement checklist status",
      "Training completion status",
      "Non-compliance risk score by contractor",
    ],
    decisionLanguage: {
      Compliance: "Does this meet regulatory requirements?",
      Risk: "What's the exposure if this isn't compliant?",
      Documentation: "Is there a complete audit trail?",
      Policy: "Does this align with organizational policy?",
      Enforcement: "Can we consistently apply and verify this?",
    },
    systemPrompt: `You are VINessa Legendary, the expert advisor for Compliance Officers. Your persona:
- You understand Compliance is about ZERO tolerance and complete documentation
- You speak in risk exposure and regulatory requirements
- You compile complete compliance pictures to enable confident audits
- You surface violations immediately, not during audit
- You celebrate zero-incident records, not speed
- You know Compliance wins by preventing violations, not discovering them

When Compliance asks about certifications/violations/audit readiness:
1. Show: Compliance status | Violations (if any) | Expiration dates | Audit readiness
2. Flag any non-compliance with regulatory impact
3. Show documentation completeness
4. Suggest remediation action with timeline
5. Never sign off on incomplete documentation`,
  },
  {
    id: "head-of-procurement",
    name: "Head of Procurement",
    title: "Strategic Procurement / Command Center",
    icon: <Crown className="h-6 w-6" />,
    color: "from-purple-500 to-indigo-500",
    stressors: [
      "Vendor performance hidden until problems emerge",
      "SOW consumption unclear until near end",
      "Contract negotiations happening without insights",
      "Budget commitments scattered across silos",
      "Strategic decisions made without complete data",
      "Stakeholders demanding visibility they don't have",
    ],
    exclamationMoments: [
      "Strategic vendor dashboard with performance trends",
      "SOW portfolio view showing health across all agreements",
      "Negotiation insights backed by historical data",
      "Budget forecast consolidated across all commitments",
      "Executive brief auto-generated with key metrics",
    ],
    morningRitual: [
      "Review vendor performance overnight",
      "Check SOW portfolio health (anything at risk?)",
      "Scan budget consumption across commitments",
      "Review new opportunities for leverage",
      "Check stakeholder alerts/escalations",
    ],
    completePictureElements: [
      "Vendor performance scorecard (cost/quality/delivery/risk)",
      "SOW portfolio view (committed/consumed/remaining)",
      "Contract milestone tracking across agreements",
      "Budget commitments vs actual spend trend",
      "Risk exposure by vendor and contract",
      "Negotiation opportunity analysis",
      "Stakeholder satisfaction metrics",
    ],
    decisionLanguage: {
      Strategy: "Does this advance our procurement goals?",
      Value: "What's the total economic impact?",
      Risk: "What are the market and performance risks?",
      Relationships: "How does this affect vendor relationships?",
      Leverage: "What's our negotiating position?",
    },
    systemPrompt: `You are VINessa Legendary, the expert advisor for Heads of Procurement. Your persona:
- You understand Procurement thinks STRATEGICALLY: total cost of ownership, market trends, leverage
- You speak in business value and strategic positioning
- You compile comprehensive vendor/SOW/budget pictures for strategic decisions
- You surface opportunities for cost optimization and risk mitigation
- You celebrate strategic wins (better terms, consolidated spend, reduced risk)
- You know Procurement wins by proactive strategy, not reactive firefighting

When Procurement asks about vendors/SOWs/contracts:
1. Show: Performance | Spend trend | Risk profile | Strategic opportunity
2. Flag optimization opportunities with business impact
3. Show negotiating position data
4. Suggest proactive action (renegotiate, consolidate, exit)
5. Prepare executive brief automatically`,
  },
];

export function LegendaryBuilderExpertPage() {
  const [selectedPersona, setSelectedPersona] = useState<string>(personas[0].id);
  const [activeTab, setActiveTab] = useState("complete-picture");

  const persona = personas.find((p) => p.id === selectedPersona)!;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-400" />
            Legendary Builder Expert
          </h1>
          <p className="text-slate-400">
            AI advisor that eliminates unpredictability. Each expert gets the COMPLETE picture they need to breathe in (inspired) not breathe down (expired).
          </p>
        </div>

        {/* Philosophy Alert */}
        <Alert className="border-emerald-500/30 bg-emerald-500/10">
          <Zap className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-emerald-200 ml-2">
            <strong>Security = Creativity:</strong> When you can predict what's coming, you stop panicking about surprises and start creating. This advisor prevents cascading chaos by showing you exactly what matters to YOUR role.
          </AlertDescription>
        </Alert>

        {/* Persona Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPersona === p.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${p.color}`}>{p.icon}</div>
                <div>
                  <p className="font-semibold text-white text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stressors & Exclamation Moments */}
          <div className="space-y-4">
            {/* Stressors */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  What Keeps {persona.name.split(" ")[0]} Up at Night
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {persona.stressors.map((stressor, i) => (
                  <div key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{stressor}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Exclamation Moments */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  When They Exclaim "Yes!"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {persona.exclamationMoments.map((moment, i) => (
                  <div key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>{moment}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center: Complete Picture & Morning Ritual */}
          <div className="space-y-4">
            {/* Morning Ritual */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5 text-amber-400" />
                  Morning Ritual (First 15 mins)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {persona.morningRitual.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-300 pt-0.5">{step}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Complete Picture */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Complete Picture Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {persona.completePictureElements.map((element, i) => (
                  <div key={i} className="text-sm text-slate-300 flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{element}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Decision Language & System Prompt */}
          <div className="space-y-4">
            {/* Decision Lens */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-5 w-5 text-purple-400" />
                  How They Make Decisions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(persona.decisionLanguage).map(([lens, language]) => (
                  <div key={lens}>
                    <p className="font-semibold text-purple-300 text-sm">{lens}:</p>
                    <p className="text-slate-400 text-xs mt-1 italic">"{language}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-teal-400" />
                  AI Advisor Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-slate-300">Decision Speed</p>
                    <span className="text-sm text-teal-400">3-5x faster</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-slate-300">Predictability</p>
                    <span className="text-sm text-teal-400">95% accurate</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-slate-300">Stress Reduction</p>
                    <span className="text-sm text-teal-400">80% less chaos</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Prompt Tab */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-blue-400" />
              System Prompt (How VINessa Legendary Advises {persona.name.split(" ")[0]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-lg border border-slate-700/50 p-4 bg-slate-900/50">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{persona.systemPrompt}</pre>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Integration Section */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              How to Use in Your Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-blue-300 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                  Ask Naturally
                </p>
                <p className="text-sm text-slate-300">Message VINessa Legendary like a colleague: "Are we over budget this week?"</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-blue-300 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                  Get Your Picture
                </p>
                <p className="text-sm text-slate-300">Receives complete answer compiled from all systems, in YOUR decision language</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-blue-300 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                  Stop Panicking
                </p>
                <p className="text-sm text-slate-300">No more unpredictability. You can breathe. Now create.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy Footer */}
        <Alert className="border-slate-700 bg-slate-800/50">
          <Brain className="h-4 w-4" />
          <AlertDescription className="text-slate-300 ml-2">
            <strong>The Core Philosophy:</strong> Unpredictability breeds unpredictability. When experts lack the complete picture, they operate in desperation (breathing down, expired). This advisor is the security blanket that enables predictability, so people can breathe in (inspired) and do their best creative work. No more cascading chaos. No more wondering what's coming. Just clarity.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default LegendaryBuilderExpertPage;
