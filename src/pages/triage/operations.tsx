import { useList, useGo } from "@refinedev/core";
import { useState } from "react";
import { 
  FileText, AlertTriangle, Clock, TrendingUp, 
  CheckCircle2, Zap, Target,
  ArrowLeft, Play, Mail, Calendar,
  Users, Brain, Sparkles, Award, 
  BarChart3, RefreshCw, Flag, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import type { PurchaseOrder, StatementOfWork } from "@/types";

type ActionStatus = "pending" | "in_progress" | "completed" | "skipped";

interface TriageAction {
  id: string;
  label: string;
  description: string;
  icon: typeof FileText;
  category: "immediate" | "investigate" | "communicate" | "escalate";
  status: ActionStatus;
  impact: string;
  estimatedTime: string;
}

export default function OperationsTriage() {
  const go = useGo();
  
  const [actions, setActions] = useState<TriageAction[]>([
    {
      id: "update-status",
      label: "Update Project Status",
      description: "Review and update delayed project milestones",
      icon: RefreshCw,
      category: "immediate",
      status: "pending",
      impact: "Ensures accurate project tracking",
      estimatedTime: "2 min"
    },
    {
      id: "flag-blockers",
      label: "Flag Critical Blockers",
      description: "Identify and tag resource/scope blockers",
      icon: Flag,
      category: "immediate",
      status: "pending",
      impact: "Highlights bottlenecks for resolution",
      estimatedTime: "1 min"
    },
    {
      id: "resource-analysis",
      label: "Analyze Resource Allocation",
      description: "AI-powered resource utilization analysis",
      icon: Brain,
      category: "investigate",
      status: "pending",
      impact: "Identifies underutilized or overloaded resources",
      estimatedTime: "Instant"
    },
    {
      id: "review-milestones",
      label: "Review Upcoming Milestones",
      description: "Examine milestones due in next 14 days",
      icon: Calendar,
      category: "investigate",
      status: "pending",
      impact: "Prevents missed deliverables",
      estimatedTime: "3 min"
    },
    {
      id: "notify-stakeholders",
      label: "Notify Stakeholders",
      description: "Send project status update to leadership",
      icon: Mail,
      category: "communicate",
      status: "pending",
      impact: "Maintains stakeholder alignment",
      estimatedTime: "1 min"
    },
    {
      id: "escalate-delays",
      label: "Escalate Critical Delays",
      description: "Submit delay exception for executive review",
      icon: AlertTriangle,
      category: "escalate",
      status: "pending",
      impact: "Triggers executive intervention",
      estimatedTime: "3 min"
    }
  ]);

  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [triageComplete, setTriageComplete] = useState(false);

  const { data: posData } = useList<PurchaseOrder>({
    resource: "purchase_orders",
    pagination: { mode: "off" },
  });

  const { data: sowsData } = useList<StatementOfWork>({
    resource: "statements-of-work",
    pagination: { mode: "off" },
  });

  const purchaseOrders = posData?.data || [];
  const sows = sowsData?.data || [];
  const activeProjects = purchaseOrders.filter(po => po.status === "Active");
  const pendingUpdates = 3;
  const delayedProjects = 2;
  const onTrackRate = activeProjects.length > 0 
    ? Math.round(((activeProjects.length - delayedProjects) / activeProjects.length) * 100) 
    : 100;
  const upcomingMilestones = 5;
  const criticalBlockers = 2;

  const completedActions = actions.filter(a => a.status === "completed").length;
  const progressPercent = Math.round((completedActions / actions.length) * 100);

  const handleAction = (actionId: string) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, status: "completed" as ActionStatus } : a
    ));

    if (actionId === "notify-stakeholders") {
      setShowEmailDraft(true);
    }
    if (actionId === "resource-analysis") {
      setShowAnalysis(true);
    }

    const newCompleted = actions.filter(a => a.id === actionId || a.status === "completed").length;
    if (newCompleted === actions.length) {
      setTriageComplete(true);
    }
  };

  const handleSkip = (actionId: string) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, status: "skipped" as ActionStatus } : a
    ));
  };

  const categoryColors = {
    immediate: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", label: "IMMEDIATE" },
    investigate: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", label: "INVESTIGATE" },
    communicate: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", label: "COMMUNICATE" },
    escalate: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", label: "ESCALATE" }
  };

  if (triageComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-lg">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center animate-pulse">
            <Award className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Operations Review Complete!</h1>
          <p className="text-slate-400 text-lg">
            You've successfully triaged all operations alerts. 
            <span className="text-emerald-400 font-semibold"> {pendingUpdates} projects</span> have been updated and stakeholders notified.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              onClick={() => go({ to: "/" })}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => go({ to: "/purchase-orders" })}
              className="border-slate-600 text-slate-300"
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => go({ to: "/" })}
                  className="text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit
                </Button>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white tracking-wide">
                      OPERATIONS TRIAGE
                    </h1>
                    <p className="text-xs text-slate-400">
                      {pendingUpdates} Projects Pending • Warning Alert
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Progress</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {completedActions}/{actions.length} Actions
                  </div>
                </div>
                <div className="w-32">
                  <Progress value={progressPercent} className="h-2 bg-slate-700" />
                </div>
                <div className="flex items-center gap-1">
                  {actions.map((action) => (
                    <div 
                      key={action.id}
                      className={`w-3 h-3 rounded-full transition-all ${
                        action.status === "completed" ? "bg-emerald-500" :
                        action.status === "skipped" ? "bg-slate-600" :
                        "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-4">
              <div className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-slate-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold text-amber-400 tracking-[0.1em] uppercase">
                    OPERATIONS SIGNALS
                  </h2>
                </div>

                <div className="relative mb-6">
                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50" cy="50" r="45"
                          fill="none" stroke="currentColor" strokeWidth="8"
                          className="text-slate-800"
                        />
                        <circle
                          cx="50" cy="50" r="45"
                          fill="none" stroke="currentColor" strokeWidth="8"
                          strokeDasharray={`${onTrackRate * 2.83} 283`}
                          className={onTrackRate < 70 ? "text-red-500" : onTrackRate < 90 ? "text-amber-500" : "text-emerald-500"}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${onTrackRate < 70 ? "text-red-400" : "text-white"}`}>
                          {onTrackRate}%
                        </span>
                        <span className="text-xs text-slate-500 uppercase">On Track</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-xs text-slate-400">Active Projects</span>
                    <span className="text-sm font-bold text-white">{activeProjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs text-amber-400">Pending Updates</span>
                    <span className="text-sm font-bold text-amber-400">{pendingUpdates}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-xs text-red-400">Delayed Projects</span>
                    <span className="text-sm font-bold text-red-400">{delayedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-xs text-slate-400">Upcoming Milestones</span>
                    <span className="text-sm font-bold text-white">{upcomingMilestones}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                    PROJECTS NEEDING ATTENTION
                  </h3>
                </div>
                <div className="space-y-2">
                  {purchaseOrders.slice(0, 5).map((po, idx) => {
                    const updateReasons = [
                      { reason: "Milestone review pending", daysOverdue: 3 },
                      { reason: "Budget variance detected", daysOverdue: 5 },
                      { reason: "Scope change request", daysOverdue: 2 },
                      { reason: "Resource reallocation needed", daysOverdue: 7 },
                      { reason: "Contractor feedback pending", daysOverdue: 4 },
                    ];
                    const update = updateReasons[idx % updateReasons.length];
                    return (
                      <div 
                        key={po.id}
                        onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {po.poNumber}
                          </div>
                          <div className="text-xs text-amber-400 mt-0.5">
                            {update.reason}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {po.department} • ${((po.amountSpent || 0) / 1000).toFixed(0)}K spent
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs flex-shrink-0 ${
                          update.daysOverdue > 5 
                            ? "border-red-500/40 text-red-400" 
                            : "border-amber-500/40 text-amber-400"
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {update.daysOverdue}d overdue
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-5 space-y-4">
              <div className="rounded-xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-slate-900 p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <h2 className="text-sm font-bold text-blue-400 tracking-[0.1em] uppercase">
                      ACTION DECK
                    </h2>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                    {actions.filter(a => a.status === "pending").length} Remaining
                  </Badge>
                </div>

                <div className="space-y-3">
                  {actions.map((action, idx) => {
                    const Icon = action.icon;
                    const colors = categoryColors[action.category];
                    const isCompleted = action.status === "completed";
                    const isSkipped = action.status === "skipped";

                    return (
                      <div 
                        key={action.id}
                        className={`
                          relative overflow-hidden rounded-lg border transition-all duration-300
                          ${isCompleted 
                            ? "bg-emerald-500/10 border-emerald-500/30 opacity-60" 
                            : isSkipped
                            ? "bg-slate-800/30 border-slate-700/30 opacity-40"
                            : `${colors.bg} ${colors.border} hover:scale-[1.01]`
                          }
                        `}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                              ${isCompleted 
                                ? "bg-emerald-500 text-white" 
                                : isSkipped
                                ? "bg-slate-700 text-slate-500"
                                : `${colors.bg} ${colors.text} border ${colors.border}`
                              }
                            `}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold tracking-wider ${colors.text}`}>
                                  {colors.label}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  ~{action.estimatedTime}
                                </span>
                              </div>
                              <h3 className={`text-sm font-semibold mb-1 ${isCompleted || isSkipped ? "text-slate-500" : "text-white"}`}>
                                {action.label}
                              </h3>
                              <p className="text-xs text-slate-400 mb-3">
                                {action.description}
                              </p>

                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <TrendingUp className="w-3 h-3" />
                                <span>{action.impact}</span>
                              </div>
                            </div>

                            {!isCompleted && !isSkipped && (
                              <div className="flex flex-col gap-2">
                                <Button 
                                  size="sm"
                                  onClick={() => handleAction(action.id)}
                                  className={`${colors.bg} ${colors.text} border ${colors.border} hover:opacity-80`}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  Execute
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSkip(action.id)}
                                  className="text-slate-500 hover:text-slate-300"
                                >
                                  Skip
                                </Button>
                              </div>
                            )}

                            {isCompleted && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                                Done
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {completedActions >= 3 && (
                  <div className="mt-5 pt-5 border-t border-slate-700/50">
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
                      onClick={() => setTriageComplete(true)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Triage ({completedActions}/{actions.length} actions)
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-3 space-y-4">
              {showAnalysis && (
                <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-900 p-5 animate-in slide-in-from-right">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xs font-bold text-purple-400 tracking-[0.1em] uppercase">
                      AI ANALYSIS
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>
                      <span className="text-purple-400 font-semibold">Resource Insight:</span> Engineering team is at 115% capacity - consider redistributing 2 contractors.
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Delay Pattern:</span> 70% of delays correlate with scope changes in past 30 days.
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Recommendation:</span> Implement change request freeze until Q4 milestones complete.
                    </p>
                  </div>
                </div>
              )}

              {showEmailDraft && (
                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-slate-900 p-5 animate-in slide-in-from-right">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold text-amber-400 tracking-[0.1em] uppercase">
                        DRAFT EMAIL
                      </h3>
                    </div>
                    <Button size="sm" className="bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      Send
                    </Button>
                  </div>
                  <Textarea 
                    className="bg-slate-800/50 border-slate-700 text-xs text-slate-300 min-h-[100px]"
                    defaultValue={`Subject: Weekly Operations Status Update

Hi Leadership Team,

Operations Summary:
- ${activeProjects.length} Active Projects
- ${onTrackRate}% On Track Rate
- ${delayedProjects} Projects with Delays

Key Actions Taken:
- Updated project milestones
- Flagged critical blockers
- Resource reallocation in progress

Best regards,
Velocity Operations Team`}
                  />
                </div>
              )}

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                    UPCOMING MILESTONES
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Q4 Deliverable Review", days: 3 },
                    { name: "Budget Reconciliation", days: 7 },
                    { name: "Contractor Evaluation", days: 10 },
                    { name: "Quarterly Report", days: 14 },
                  ].map(milestone => (
                    <div 
                      key={milestone.name}
                      className="flex items-center justify-between p-2 rounded bg-slate-800/50"
                    >
                      <span className="text-xs text-slate-300">{milestone.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${
                        milestone.days <= 3 ? "border-red-500/40 text-red-400" : 
                        milestone.days <= 7 ? "border-amber-500/40 text-amber-400" : 
                        "border-slate-500/40 text-slate-400"
                      }`}>
                        {milestone.days}d
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                    QUICK INTEL
                  </h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Critical Blockers</span>
                    <span className="text-red-400 font-semibold">{criticalBlockers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SOWs Active</span>
                    <span className="text-white font-semibold">{sows.filter(s => s.status === "Active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Completion</span>
                    <span className="text-emerald-400 font-semibold">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
