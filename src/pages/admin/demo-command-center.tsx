import { useState } from "react";
import { useGo } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  Target,
  ChevronRight,
  ChevronDown,
  DollarSign,
  Users,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  Zap,
  AlertTriangle,
  FileText,
  BarChart3,
  Brain,
  Shield,
  Sparkles,
  Play,
  CircleDot,
  MousePointer,
  Download,
} from "lucide-react";
import { DemoModeToggle } from "@/components/admin/demo-mode-toggle";
import { cn } from "@/lib/utils";

interface DemoStep {
  id: number;
  title: string;
  duration: string;
  route: string;
  action: string;
  roiValue?: string;
  keyMessage: string;
  icon: React.ElementType;
  color: string;
  painPoints: string[];
  personas: string[];
}

// CLIENT PAIN POINTS ADDRESSED BY DEMO - Validated Against HAEA/Wes Stakeholder Analysis
const CLIENT_PAIN_POINTS = {
  pm: {
    role: "Project Manager (Ben/Mark - HAEA)",
    color: "green",
    pains: [
      { pain: "Managing 165+ projects on whiteboard with zero visibility", flow: "Dashboard → Overview → See all projects at once" },
      { pain: "Can't answer 'top 5 at-risk' without 2-hour PowerPoint", flow: "Dashboard → AI Insights → Risk flags auto-surfaced" },
      { pain: "Resource conflicts discovered too late (Emily on 3 simultaneous projects)", flow: "Contractors → Detail → See all assignments" },
      { pain: "Dependency blindness: AD upgrade blocks 6 downstream projects worth $2.3M+", flow: "SOW Command Center → Relations tab → Dependency map" },
      { pain: "15+ hours/week administrative burden on manual status reporting", flow: "Dashboard → Export → One-click executive report" }
    ]
  },
  cpo: {
    role: "Chief Procurement Officer (Wesley - HAEA)",
    color: "blue",
    pains: [
      { pain: "Vendor crises escalate unexpectedly (E-Plus $500K for 3-week project)", flow: "AI Insights → Proactive Alerts → Vendor risk flags" },
      { pain: "Reactive procurement eliminates negotiation power - no competitive bidding", flow: "SOW Command Center → Renewal Timeline → 90-day warning" },
      { pain: "SOW automation takes 30+ days → loses competitive agility", flow: "Documents → AI Analysis → Contract extraction in minutes" },
      { pain: "Contract renewals sneak up → forced into unfavorable terms", flow: "Dashboard → Alerts → Expiring contracts widget" },
      { pain: "No visibility into vendor performance across 165+ projects", flow: "SOW Command Center → Vendor scorecard view" }
    ]
  },
  vms: {
    role: "VMS Director",
    color: "purple",
    pains: [
      { pain: "Bad contractor hire = 3+ months wasted + project delays + reputation damage", flow: "Contractors → Performance metrics → Historical ratings" },
      { pain: "Can't track contractor performance across projects", flow: "Contractor Detail → All SOWs/timecards in one view" },
      { pain: "End-of-engagement discovered at last minute (forces 60-90 day scramble)", flow: "Dashboard → Ending Contracts → 60-day advance notice" },
      { pain: "Overpaying contractors 15-30% with no rate benchmarking", flow: "Contractors → Rate Analysis → Market comparison" },
      { pain: "Last-minute 'need someone now' requests drive premium pricing", flow: "AI Insights → Resource planning recommendations" }
    ]
  },
  finance: {
    role: "Finance Controller",
    color: "yellow",
    pains: [
      { pain: "Budget surprises at month-end instead of real-time alerts", flow: "Dashboard → Budget Health → Real-time burn rate" },
      { pain: "Invoice errors caught AFTER payment (no recovery process)", flow: "Invoices → AI Validation → Pre-payment verification" },
      { pain: "Vendor cost creep undetected until annual review", flow: "Purchase Orders → Trend Analysis → Cost monitoring" },
      { pain: "Manual reconciliation: 15+ hours/week per PM across org", flow: "Timecards → Bulk Approve → Automated matching" },
      { pain: "No forecasting capability - always reactive", flow: "Budget → Forecasting → Predictive spend models" }
    ]
  },
  it: {
    role: "IT Director",
    color: "red",
    pains: [
      { pain: "Integration hell: 15-20 fragmented tools with no single source of truth", flow: "Dashboard → Unified view → All data in one place" },
      { pain: "EOL surprises during crises (HQ switches purchased on eBay during power outage)", flow: "Assets → Lifecycle → EOL tracking & alerts" },
      { pain: "Change impact blindness: Single switch upgrade affects 19 sites without warning", flow: "SOW → Relations → Impact analysis" },
      { pain: "No network documentation - every outage is a 'learning experience'", flow: "Knowledge Hub → Searchable documentation" },
      { pain: "Custom integrations consume 60%+ of dev capacity (estimated)", flow: "Admin → API Testing → Pre-built connectors" }
    ]
  },
  exec: {
    role: "Executive Leadership (CEO Paul - HAEA)",
    color: "cyan",
    pains: [
      { pain: "Can't answer board questions about portfolio health", flow: "Dashboard → Executive view → Portfolio KPIs" },
      { pain: "'What's our next critical project?' → No answer available", flow: "AI Insights → Priority recommendations" },
      { pain: "Strategic decisions made on gut feel, not data", flow: "Reports → Data-driven analysis → Export to board" },
      { pain: "Recurring embarrassment at leadership meetings", flow: "Dashboard → Real-time metrics → Always prepared" },
      { pain: "No visibility into $3.1M+ annual waste from reactive operations", flow: "Budget → Cost avoidance tracking → ROI proof" }
    ]
  }
};

const DEMO_FLOW: DemoStep[] = [
  {
    id: 1,
    title: "Dashboard Overview",
    duration: "90 sec",
    route: "/",
    action: "Show KPIs, role switcher, AI insights",
    keyMessage: "Single source of truth - everything at a glance",
    icon: BarChart3,
    color: "cyan",
    painPoints: [
      "Can't answer 'top 5 at-risk' without 2hr work",
      "Managing 165+ projects with zero visibility",
      "Budget surprises at month-end"
    ],
    personas: ["PM", "Finance", "CPO"]
  },
  {
    id: 2,
    title: "AI Intelligence",
    duration: "2 min",
    route: "/ai/insights",
    action: "Click AI predictions, show proactive alerts",
    keyMessage: "AI catches issues BEFORE they become problems",
    icon: Brain,
    color: "purple",
    painPoints: [
      "Vendor crises escalate unexpectedly",
      "End-of-engagement discovered at last minute",
      "Resource conflicts discovered too late"
    ],
    personas: ["CPO", "VMS", "PM"]
  },
  {
    id: 3,
    title: "SOW Command Center",
    duration: "3 min",
    route: "/sow-command-center",
    action: "Show contract lifecycle, multi-lens analysis",
    keyMessage: "Complete visibility across all contracts",
    icon: FileText,
    color: "blue",
    painPoints: [
      "SOW automation takes 30 days",
      "Contract renewals sneak up → unfavorable terms",
      "No visibility into vendor performance"
    ],
    personas: ["CPO", "PM", "Finance"]
  },
  {
    id: 4,
    title: "Purchase Orders",
    duration: "2 min",
    route: "/purchase-orders",
    action: "Budget badges, table controls, drill-through",
    keyMessage: "Every element anticipates your next question",
    icon: DollarSign,
    color: "emerald",
    painPoints: [
      "Budget surprises at month-end",
      "Vendor cost creep undetected",
      "No real-time spend visibility"
    ],
    personas: ["Finance", "CPO", "PM"]
  },
  {
    id: 5,
    title: "Contractors",
    duration: "2 min",
    route: "/contractors",
    action: "Click contractor → SOW → PO → Timecards chain",
    keyMessage: "Full lifecycle visibility - no tab switching",
    icon: Users,
    color: "amber",
    painPoints: [
      "Bad hire = 3 months + delays + reputation",
      "Can't see contractor performance across projects",
      "Overpaying contractors 15-30%"
    ],
    personas: ["VMS", "PM", "Finance"]
  },
  {
    id: 6,
    title: "Invoices & Alerts",
    duration: "90 sec",
    route: "/invoices",
    action: "Variance badges, TopNav alerts, protection",
    keyMessage: "Protection, not reaction - errors caught BEFORE payment",
    icon: AlertTriangle,
    color: "pink",
    painPoints: [
      "Invoice errors caught AFTER payment",
      "Timecard reconciliation takes 40+ hours",
      "Vendor cost creep undetected"
    ],
    personas: ["Finance", "CPO"]
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500", text: "text-cyan-400", glow: "shadow-cyan-500/30" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-400", glow: "shadow-purple-500/30" },
  blue: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-400", glow: "shadow-blue-500/30" },
  emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/30" },
  amber: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-400", glow: "shadow-amber-500/30" },
  pink: { bg: "bg-pink-500/20", border: "border-pink-500", text: "text-pink-400", glow: "shadow-pink-500/30" },
};

export default function DemoCommandCenter() {
  const go = useGo();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markComplete = (stepId: number) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (stepId < 6) {
      setActiveStep(stepId + 1);
    }
  };

  const navigateToStep = (step: DemoStep) => {
    go({ to: step.route });
  };


  const exportDemoRoute = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    let content = `
================================================================================
                    VELOCITY WORKFORCE MANAGEMENT PLATFORM
                           DEMO ROUTE GUIDE
================================================================================

Date: ${today}
Client: Hyundai
Total Demo Duration: 12 minutes

================================================================================
                          CLIENT PAIN POINTS
================================================================================

`;

    Object.entries(CLIENT_PAIN_POINTS).forEach(([_, persona]) => {
      content += `${persona.role.toUpperCase()}\n`;
      content += `${'─'.repeat(40)}\n`;
      persona.pains.forEach(p => {
        content += `  • ${p.pain}\n`;
        content += `    → ${p.flow}\n`;
      });
      content += `\n`;
    });

    content += `
================================================================================
                           DEMO FLOW STEPS
================================================================================

`;

    DEMO_FLOW.forEach((step, index) => {
      content += `
┌${'─'.repeat(76)}┐
│  STEP ${step.id}: ${step.title.toUpperCase().padEnd(60)}│
└${'─'.repeat(76)}┘

  Duration:     ${step.duration}
  Route:        ${step.route}
  Action:       ${step.action}

  KEY MESSAGE
  ${'─'.repeat(40)}
  "${step.keyMessage}"

  PAIN POINTS ADDRESSED
  ${'─'.repeat(40)}
${step.painPoints.map(p => `  ✓ ${p}`).join('\n')}

  TARGET PERSONAS: ${step.personas.join(', ')}

`;
      if (index < DEMO_FLOW.length - 1) {
        content += `                              ↓\n`;
      }
    });

    content += `
================================================================================
                           QUICK REFERENCE
================================================================================

DEMO STEPS SUMMARY:
${'─'.repeat(76)}
${DEMO_FLOW.map(s => `  ${s.id}. ${s.title.padEnd(25)} | ${s.duration.padEnd(8)} | ${s.route}`).join('\n')}

VALUE DRIVERS:
${'─'.repeat(76)}
  • Early issue detection
  • Admin time reduction
  • Error prevention
  • Compliance visibility

================================================================================
                           PRESENTER NOTES
================================================================================

PRE-DEMO CHECKLIST:
  □ Demo Mode enabled (toggle in header)
  □ All sample data loaded
  □ AI insights populated
  □ Browser cache cleared

KEY TALKING POINTS:
  1. "Single source of truth" - Everything in one place
  2. "Proactive, not reactive" - AI catches issues BEFORE they become problems
  3. "Every click anticipated" - UI designed for your workflow
  4. "Real-time visibility" - No more month-end surprises

CLOSING STATEMENT:
  "With Velocity, you're not just managing workforce data - you're gaining
   strategic visibility that prevents problems before they occur."

================================================================================
                     Generated by Velocity Demo System
================================================================================
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velocity-demo-route-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* HEADER - Compact */}
      <div className="bg-gradient-to-r from-blue-900/50 via-slate-900 to-purple-900/50 border-b-2 border-blue-500/30 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Demo Command Center</h1>
              <p className="text-slate-400 text-xs">Hyundai • 12 min total</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exportDemoRoute}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Export Route
            </Button>
            <DemoModeToggle />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-3 px-4 py-2">
        {/* LEFT PANEL: PAIN POINTS REFERENCE */}
        <div className="w-80 flex-shrink-0 bg-slate-900/80 border border-amber-500/30 rounded-xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-slate-700/50 bg-gradient-to-r from-amber-900/30 to-orange-900/20">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-200">CLIENT PAIN POINTS</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {Object.entries(CLIENT_PAIN_POINTS).map(([key, persona]) => (
              <div key={key} className="space-y-2">
                <div className={cn(
                  "text-sm font-semibold uppercase tracking-wide px-2 py-1 rounded",
                  persona.color === "green" ? "text-green-300 bg-green-900/30" :
                  persona.color === "blue" ? "text-blue-300 bg-blue-900/30" :
                  persona.color === "purple" ? "text-purple-300 bg-purple-900/30" :
                  persona.color === "yellow" ? "text-yellow-300 bg-yellow-900/30" :
                  persona.color === "cyan" ? "text-cyan-300 bg-cyan-900/30" :
                  "text-orange-300 bg-orange-900/30"
                )}>
                  {persona.role}
                </div>
                <ul className="space-y-2 pl-1">
                  {persona.pains.map((p, i) => (
                    <li key={i} className="text-xs leading-relaxed">
                      <div className="flex gap-2 text-slate-200">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{p.pain}</span>
                      </div>
                      <div className="ml-4 text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
                        <span className="text-emerald-500">→</span> {p.flow}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-slate-700/50 bg-slate-800/50">
            <div className="text-xs text-slate-400 text-center">
              Each demo step addresses 3+ pain points
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: DEMO FLOW */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* START HERE BANNER - Compact */}
          <div className="mb-2 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 border border-green-500/50 rounded-xl p-2.5 relative flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-green-500/50">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-green-300">START HERE</h2>
                  <p className="text-green-200/70 text-[10px]">Each step solves 3+ pain points</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => navigateToStep(DEMO_FLOW[0])}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs shadow-lg shadow-green-500/30"
              >
                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                Begin
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

        {/* VISUAL FLOWCHART - Compact scrollable */}
        <div className="space-y-1.5 overflow-y-auto flex-1 pr-2">
          {DEMO_FLOW.map((step, index) => {
            const colors = colorClasses[step.color];
            const isActive = activeStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center gap-2">
                {/* Step Number */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                  isCompleted ? "bg-emerald-500 text-white" :
                  isActive ? "bg-blue-500 text-white" :
                  "bg-slate-700 text-slate-400"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>

                {/* STEP CARD - Compact single row */}
                <div
                  className={cn(
                    "flex-1 rounded-lg border transition-all duration-200 px-3 py-2",
                    isActive ? `${colors.border} ${colors.bg} shadow-lg` : 
                    isCompleted ? "border-emerald-500/40 bg-emerald-500/5" : 
                    "border-slate-700/40 bg-slate-900/40 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Icon + Title + Badges */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        isCompleted ? "bg-emerald-500/20" : colors.bg
                      )}>
                        <Icon className={cn("h-4 w-4", isCompleted ? "text-emerald-400" : colors.text)} />
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className={cn(
                          "text-sm font-semibold truncate",
                          isCompleted ? "text-emerald-300" : "text-white"
                        )}>
                          {step.title}
                        </h3>
                        <Badge className={cn(
                          "text-[10px] px-1.5 py-0 flex-shrink-0",
                          isCompleted ? "bg-emerald-500/30 text-emerald-300" : "bg-slate-700/80 text-slate-400"
                        )}>
                          {step.duration}
                        </Badge>
                        {step.roiValue && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-0 flex-shrink-0">
                            {step.roiValue}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Center: Pain Points Solved - Visible on large screens */}
                    <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
                      {step.painPoints.map((pain, i) => (
                        <Badge key={i} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 whitespace-nowrap flex-shrink-0">
                          {pain}
                        </Badge>
                      ))}
                    </div>

                    {/* Right: Personas + Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden md:flex items-center gap-0.5">
                        {step.personas.map((p, i) => (
                          <Badge key={i} className="text-[8px] px-1 py-0 bg-slate-800 text-slate-500 border-0">
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToStep(step)}
                        className={cn(
                          "h-7 px-2.5 text-xs",
                          isActive ? `${colors.border} ${colors.text}` : 
                          "border-slate-600 text-slate-400"
                        )}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Go
                      </Button>
                      
                      {!isCompleted && (
                        <Button
                          size="sm"
                          onClick={() => markComplete(step.id)}
                          className={cn(
                            "h-7 px-2.5 text-xs",
                            isActive ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-700 hover:bg-slate-600"
                          )}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FINISH BANNER - Compact */}
        <div className="mt-2 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 rounded-lg p-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-300">THE CLOSE</h2>
              <p className="text-amber-200/60 text-[10px]">Return to Dashboard, summarize value drivers</p>
            </div>
          </div>
        </div>
        </div>

        {/* RIGHT SIDEBAR - Quick Reference (NO SCROLLING - Ultra Compact) */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-1.5 overflow-hidden">
          {/* Progress Mini-Bar */}
          <div className="bg-slate-900/80 rounded-lg border border-slate-700 px-2 py-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400">Demo Progress</span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {completedSteps.size} of {DEMO_FLOW.length} complete
              </span>
            </div>
            <div className="flex gap-0.5">
              {DEMO_FLOW.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-all",
                    completedSteps.has(step.id) ? "bg-emerald-500" :
                    activeStep === step.id ? "bg-blue-500" :
                    "bg-slate-700"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ROI Value Drivers - No Specific Numbers */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-lg px-2 py-1.5 flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-300 uppercase">Value Drivers</span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">●</span><span className="text-slate-300">Early issue detection</span></div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">●</span><span className="text-slate-300">Admin time reduction</span></div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">●</span><span className="text-slate-300">Error prevention</span></div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">●</span><span className="text-slate-300">Compliance visibility</span></div>
            </div>
          </div>

          {/* Power Phrases - Ultra Compact */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg px-2 py-1.5 flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 uppercase">Power Phrases</span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div className="px-1.5 py-0.5 bg-amber-500/10 rounded text-amber-300">"Single source of truth"</div>
              <div className="px-1.5 py-0.5 bg-amber-500/10 rounded text-amber-300">"Protection, not reaction"</div>
              <div className="px-1.5 py-0.5 bg-amber-500/10 rounded text-amber-300">"AI catches it before you do"</div>
              <div className="px-1.5 py-0.5 bg-amber-500/10 rounded text-amber-300">"Every click was anticipated"</div>
            </div>
          </div>

          {/* If Something Breaks - Ultra Compact */}
          <div className="bg-slate-900/80 border border-red-500/30 rounded-lg px-2 py-1.5 flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              <Shield className="h-3 w-3 text-red-400" />
              <span className="text-[10px] font-bold text-red-300 uppercase">If Something Breaks</span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div><span className="text-red-300">Page won't load?</span> <span className="text-slate-400">→ Demo Mode ON</span></div>
              <div><span className="text-red-300">Data looks empty?</span> <span className="text-slate-400">→ Refresh</span></div>
              <div><span className="text-red-300">Lost your place?</span> <span className="text-slate-400">→ Dashboard</span></div>
            </div>
          </div>

          {/* NOTES - Presenter notes fills remaining space */}
          <div className="flex-1 bg-slate-900/80 border border-purple-500/30 rounded-lg px-2 py-1.5 flex flex-col min-h-0">
            <div className="flex items-center gap-1 mb-1 flex-shrink-0">
              <FileText className="h-3 w-3 text-purple-400" />
              <span className="text-[10px] font-bold text-purple-300 uppercase">Presenter Notes</span>
            </div>
            <div className="flex-1 overflow-y-auto text-[10px] text-slate-300 space-y-1 pr-1">
              <div className="text-purple-200/80 font-medium">Key Talking Points:</div>
              <ul className="space-y-0.5 pl-1.5">
                <li><span className="text-purple-400">1.</span> Show portfolio health first - instant credibility</li>
                <li><span className="text-purple-400">2.</span> Click through full lifecycle (SOW → PO → Contractor)</li>
                <li><span className="text-purple-400">3.</span> Highlight AI proactive alerts - "before you ask"</li>
                <li><span className="text-purple-400">4.</span> End with value drivers - quantify with their data</li>
              </ul>
              <div className="border-t border-slate-700/50 pt-1 mt-1">
                <div className="text-amber-300/80 font-medium">Closing:</div>
                <p className="text-slate-400 leading-snug">
                  "With Velocity, you gain strategic visibility that prevents problems before they occur."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
