import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, Target, TrendingUp, Zap, DollarSign, Clock, 
  Shield, Brain, FileText, BarChart3, Users, ArrowRight,
  Sparkles, AlertTriangle, Calendar, Package
} from "lucide-react";
import { cn } from "@/lib/utils";

const mvpFeatures = {
  expected: [
    {
      name: "Purchase Order Management",
      description: "Track and manage all purchase orders with real-time budget visibility",
      location: "/purchase-orders",
      icon: FileText,
      benefit: "Single source of truth for all PO data across vendors"
    },
    {
      name: "Contractor Directory",
      description: "Centralized database of all contractors with performance history",
      location: "/contractors",
      icon: Users,
      benefit: "Instant access to contractor skills, rates, and availability"
    },
    {
      name: "Statement of Work Library",
      description: "Template-driven SOW creation with clause management",
      location: "/statement-of-works",
      icon: FileText,
      benefit: "Consistent contract language across all engagements"
    },
    {
      name: "Timecard Approval Workflow",
      description: "Digital timecard submission and multi-level approval routing",
      location: "/timecards",
      icon: Clock,
      benefit: "Eliminate paper timesheets and approval bottlenecks"
    },
    {
      name: "Invoice Processing",
      description: "Invoice submission, validation, and payment tracking",
      location: "/invoices",
      icon: DollarSign,
      benefit: "Streamlined payment cycles with audit trails"
    },
    {
      name: "Expense Management",
      description: "Contractor expense submission and reimbursement tracking",
      location: "/expenses",
      icon: DollarSign,
      benefit: "Policy compliance and budget control for all expenses"
    }
  ],
  innovative: [
    {
      name: "AI Contract Analysis",
      description: "Claude-powered contract review identifying missing clauses, risks, and unfavorable terms",
      location: "/ai/contract-gap-analysis",
      icon: Brain,
      benefit: "Catch liability gaps and indemnification issues before signing",
      painSolved: "Manual review time significantly reduced with AI assistance"
    },
    {
      name: "Voice-First Intelligence",
      description: "Upload contracts via voice or PDF, get callback with key findings via ElevenLabs",
      location: "/ai/voice-contract-intelligence",
      icon: Sparkles,
      benefit: "Review contracts hands-free while commuting or multitasking",
      painSolved: "Lengthy contract documents → audio summaries"
    },
    {
      name: "Proactive Alerts Dashboard",
      description: "AI-powered triage system flags issues requiring attention",
      location: "/dashboard",
      icon: AlertTriangle,
      benefit: "Proactive intervention before issues escalate",
      painSolved: "Reactive crisis management → proactive risk visibility"
    },
    {
      name: "Budget Threshold Alerts",
      description: "Automatic notifications at 25%, 50%, and 90% PO consumption",
      location: "/purchase-orders",
      icon: BarChart3,
      benefit: "No more end-of-month budget surprises",
      painSolved: "Month-end variance discovery → real-time spend visibility"
    },
    {
      name: "Contract Renewal Calendar",
      description: "60/90/120-day advance warnings with automated renewal reminders",
      location: "/statement-of-works",
      icon: Calendar,
      benefit: "Never get forced into unfavorable terms by surprise deadlines",
      painSolved: "Contract deadlines sneak up → proactive renewal planning"
    },
    {
      name: "Procurement Command Center",
      description: "Executive dashboard with ROI tracking and workflow automation metrics",
      location: "/procurement-hub",
      icon: Package,
      benefit: "Strategic vendor spend visibility and optimization opportunities",
      painSolved: "Fragmented data → unified procurement intelligence"
    }
  ]
};

const painPointSolutions = [
  {
    painPoint: "Vendor crises escalate unexpectedly",
    example: "Cost spikes and delivery issues appear without warning",
    solution: "Vendor Performance Scorecard with AI-powered risk prediction",
    howItWorks: "Machine learning analyzes delivery patterns, invoice trends, and communication signals to flag at-risk vendors in advance",
    outcome: "Intervene before crisis, negotiate from strength, maintain business continuity"
  },
  {
    painPoint: "SOW creation is slow and manual",
    example: "Legal review bottleneck delays project starts",
    solution: "AI-Powered SOW Generator with pre-approved clause library",
    howItWorks: "Select contractor, project type, and terms → generate compliant SOW with auto-inserted standard clauses",
    outcome: "Faster SOW creation, reduced review cycles, quicker contractor onboarding"
  },
  {
    painPoint: "Contract renewals sneak up",
    example: "Forced into unfavorable terms due to missed deadline",
    solution: "Renewal Calendar with advance alerts",
    howItWorks: "System tracks all contract end dates and triggers multi-channel notifications (email, SMS, dashboard) at configured intervals",
    outcome: "Full visibility into renewal deadlines, negotiate from prepared position"
  },
  {
    painPoint: "No visibility into vendor performance",
    example: "Multiple projects, no way to compare vendor delivery quality",
    solution: "Vendor Performance Dashboard with cross-project scoring",
    howItWorks: "Aggregates on-time delivery, budget adherence, quality metrics, and PM satisfaction scores into weighted vendor rankings",
    outcome: "Data-driven vendor selection, poor performers identified and replaced"
  },
  {
    painPoint: "Emergency procurement at premium rates",
    example: "Premium markups when scrambling for urgent resources",
    solution: "Skills Gap Predictor with forecasting",
    howItWorks: "AI analyzes project timelines, resource utilization, and skill requirements to predict upcoming gaps before they become emergencies",
    outcome: "Plan ahead, negotiate standard rates, avoid panic hiring"
  }
];

const roiMetrics = [
  { category: "Time Savings", metric: "Contract Review", before: "Manual process", after: "AI-assisted", savings: "Significant reduction" },
  { category: "Time Savings", metric: "SOW Generation", before: "Multi-day cycle", after: "Same-day", savings: "Days saved" },
  { category: "Time Savings", metric: "Data Entry", before: "Manual input", after: "Automated", savings: "Hours saved" },
  { category: "Cost Avoidance", metric: "Budget Overruns", before: "End-of-month discovery", after: "Real-time alerts", savings: "Early intervention" },
  { category: "Cost Avoidance", metric: "Emergency Procurement", before: "Premium rates", after: "Planned sourcing", savings: "Standard rates" },
  { category: "Risk Reduction", metric: "Contract Compliance", before: "Partial visibility", after: "Full tracking", savings: "Audit-ready" }
];

export function PlatformCapabilitiesPage() {
  return (
    <div 
      className="min-h-screen p-8 space-y-8"
      style={{
        background: 'linear-gradient(135deg, #05070d 0%, #0a0f18 50%, #0d1420 100%)'
      }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Platform Capabilities</h1>
          <p className="text-slate-300 text-lg">
            How Velocity solves procurement pain points and delivers measurable ROI
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300 whitespace-nowrap"
        >
          <Brain className="h-5 w-5 mr-2 text-cyan-400" />
          <span className="font-semibold">AI-Powered</span>
        </Badge>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="bg-slate-800/40 border border-slate-700/50 p-2 h-auto">
          <TabsTrigger 
            value="features" 
            className="text-base py-2.5 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-blue-500/30 data-[state=active]:text-cyan-300 text-slate-400 font-semibold"
          >
            MVP Features
          </TabsTrigger>
          <TabsTrigger 
            value="solutions" 
            className="text-base py-2.5 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:text-purple-300 text-slate-400 font-semibold"
          >
            Pain Point Solutions
          </TabsTrigger>
          <TabsTrigger 
            value="roi" 
            className="text-base py-2.5 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/30 data-[state=active]:to-teal-500/30 data-[state=active]:text-emerald-300 text-slate-400 font-semibold"
          >
            ROI & Savings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-2 border-cyan-500/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle2 className="h-7 w-7 text-cyan-400" />
                </div>
                Expected Features (Table Stakes)
              </CardTitle>
              <p className="text-sm text-slate-300 mt-2">
                Core VMS functionality you'd expect from any workforce management platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {mvpFeatures.expected.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-white">{feature.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
                        <div className="flex items-center gap-1.5 mt-3">
                          <ArrowRight className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs text-emerald-300/90">{feature.benefit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border-2 border-purple-500/30 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50" />
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl text-white flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="h-7 w-7 text-purple-400" />
                </div>
                Innovative Features (Differentiators)
              </CardTitle>
              <p className="text-sm text-slate-300 mt-2">
                AI-powered capabilities that go beyond traditional VMS
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mvpFeatures.innovative.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-slate-800/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-white">{feature.name}</p>
                          <Badge className="text-xs px-2 py-1 bg-purple-500/30 text-purple-300 border-purple-500/40 font-semibold">
                            AI
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mt-2">{feature.description}</p>
                        
                        <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Pain Solved</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1.5">{feature.painSolved}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-emerald-300/90">{feature.benefit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solutions" className="space-y-4">
          <Card className="bg-slate-900/70 border-slate-600/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-400" />
                Pain Points & How We Solve Them
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {painPointSolutions.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/25"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-400/70" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{item.painPoint}</p>
                      <p className="text-[11px] text-red-400/60 italic mt-0.5">Example: {item.example}</p>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-2.5 rounded-md bg-slate-900/50 border border-slate-700/20">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Zap className="h-3 w-3 text-cyan-400/70" />
                            <span className="text-[10px] font-semibold text-cyan-300/80 uppercase tracking-wide">Solution</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{item.solution}</p>
                        </div>
                        
                        <div className="p-2.5 rounded-md bg-slate-900/50 border border-slate-700/20">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Brain className="h-3 w-3 text-purple-400/70" />
                            <span className="text-[10px] font-semibold text-purple-300/80 uppercase tracking-wide">How It Works</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{item.howItWorks}</p>
                        </div>
                        
                        <div className="p-2.5 rounded-md bg-emerald-500/5 border border-emerald-500/15">
                          <div className="flex items-center gap-1.5 mb-1">
                            <TrendingUp className="h-3 w-3 text-emerald-400/70" />
                            <span className="text-[10px] font-semibold text-emerald-300/80 uppercase tracking-wide">Outcome</span>
                          </div>
                          <p className="text-[11px] text-emerald-300/90">{item.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card className="bg-slate-900/70 border-slate-600/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-slate-400" />
                Quantifiable ROI
              </CardTitle>
              <p className="text-xs text-slate-500">
                Before vs After: Measurable improvements for your procurement operations
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/40">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Metric</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Before</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">After</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiMetrics.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={cn(
                          "border-b border-slate-700/20",
                          idx % 2 === 0 ? "bg-slate-800/20" : "bg-transparent"
                        )}
                      >
                        <td className="py-2.5 px-3 text-xs text-slate-400">{row.category}</td>
                        <td className="py-2.5 px-3 text-xs text-white font-medium">{row.metric}</td>
                        <td className="py-2.5 px-3 text-xs text-red-400/70">{row.before}</td>
                        <td className="py-2.5 px-3 text-xs text-emerald-400/70">{row.after}</td>
                        <td className="py-2.5 px-3">
                          <Badge className="text-[10px] bg-emerald-500/10 text-emerald-300/80 border-emerald-500/20">
                            {row.savings}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-slate-900/70 border-slate-600/30 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Clock className="h-5 w-5 text-emerald-400/70" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Automation</p>
                  <p className="text-xs text-slate-400">Time Savings</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-slate-900/70 border-slate-600/30 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <DollarSign className="h-5 w-5 text-blue-400/70" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Optimization</p>
                  <p className="text-xs text-slate-400">Cost Control</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-slate-900/70 border-slate-600/30 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Shield className="h-5 w-5 text-purple-400/70" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">Full Coverage</p>
                  <p className="text-xs text-slate-400">Compliance Visibility</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-slate-900/70 border-2 border-emerald-500/20 p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-8 w-8 text-emerald-400/70" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Measurable ROI</p>
                <p className="text-sm text-slate-400 mt-1">
                  Platform delivers value through automated workflows, real-time budget visibility,
                  proactive alerts, and centralized data management. Track your actual savings in the Procurement Hub.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
