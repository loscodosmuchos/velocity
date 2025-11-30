import { useList, useGo } from "@refinedev/core";
import { useState } from "react";
import { 
  Shield, AlertTriangle, Clock, TrendingUp, 
  FileText, CheckCircle2, XCircle, Zap, Target,
  ArrowLeft, Play, Mail, Calendar,
  Users, Brain, Sparkles, Award, FileCheck,
  Upload, AlertCircle, ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import type { Contractor, ContractorDocument } from "@/types";

type ActionStatus = "pending" | "in_progress" | "completed" | "skipped";

interface TriageAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Shield;
  category: "immediate" | "investigate" | "communicate" | "escalate";
  status: ActionStatus;
  impact: string;
  estimatedTime: string;
}

export default function ComplianceTriage() {
  const go = useGo();
  
  const [actions, setActions] = useState<TriageAction[]>([
    {
      id: "flag-non-compliant",
      label: "Flag Non-Compliant",
      description: "Mark contractors with missing certifications",
      icon: AlertCircle,
      category: "immediate",
      status: "pending",
      impact: "Identifies immediate compliance gaps",
      estimatedTime: "30 sec"
    },
    {
      id: "request-documents",
      label: "Request Missing Documents",
      description: "Send automated document request to contractors",
      icon: Upload,
      category: "immediate",
      status: "pending",
      impact: "Initiates document collection process",
      estimatedTime: "1 min"
    },
    {
      id: "audit-analysis",
      label: "Run Compliance Audit",
      description: "AI-powered compliance gap analysis",
      icon: Brain,
      category: "investigate",
      status: "pending",
      impact: "Identifies patterns and risk areas",
      estimatedTime: "Instant"
    },
    {
      id: "review-expiring",
      label: "Review Expiring Certs",
      description: "Examine certifications expiring in 30 days",
      icon: Clock,
      category: "investigate",
      status: "pending",
      impact: "Prevents future compliance lapses",
      estimatedTime: "2 min"
    },
    {
      id: "notify-managers",
      label: "Alert Hiring Managers",
      description: "Notify managers of non-compliant team members",
      icon: Mail,
      category: "communicate",
      status: "pending",
      impact: "Ensures stakeholder awareness",
      estimatedTime: "30 sec"
    },
    {
      id: "escalate-hr",
      label: "Escalate to HR/Legal",
      description: "Submit compliance exception report",
      icon: Shield,
      category: "escalate",
      status: "pending",
      impact: "Ensures regulatory compliance",
      estimatedTime: "3 min"
    }
  ]);

  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [triageComplete, setTriageComplete] = useState(false);

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
    pagination: { mode: "off" },
  });

  const contractors = contractorsData?.data || [];
  const activeContractors = contractors.filter(c => c.status === "Active");
  const nonCompliantCount = 5;
  const expiringCount = 3;
  const complianceRate = activeContractors.length > 0 
    ? Math.round(((activeContractors.length - nonCompliantCount) / activeContractors.length) * 100) 
    : 100;
  const criticalIssues = 2;
  const pendingDocuments = 8;

  const completedActions = actions.filter(a => a.status === "completed").length;
  const progressPercent = Math.round((completedActions / actions.length) * 100);

  const handleAction = (actionId: string) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, status: "completed" as ActionStatus } : a
    ));

    if (actionId === "notify-managers") {
      setShowEmailDraft(true);
    }
    if (actionId === "audit-analysis") {
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
          <h1 className="text-4xl font-bold text-white">Compliance Review Complete!</h1>
          <p className="text-slate-400 text-lg">
            You've successfully triaged all compliance alerts. 
            <span className="text-emerald-400 font-semibold"> {nonCompliantCount} contractors</span> have been flagged and notifications sent.
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
              onClick={() => go({ to: "/contractors" })}
              className="border-slate-600 text-slate-300"
            >
              View Contractors
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
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white tracking-wide">
                      COMPLIANCE TRIAGE
                    </h1>
                    <p className="text-xs text-slate-400">
                      {nonCompliantCount} Non-Compliant • Critical Alert
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
              <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-950/40 to-slate-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-red-400" />
                  <h2 className="text-sm font-bold text-red-400 tracking-[0.1em] uppercase">
                    COMPLIANCE SIGNALS
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
                          strokeDasharray={`${complianceRate * 2.83} 283`}
                          className={complianceRate < 80 ? "text-red-500" : complianceRate < 95 ? "text-amber-500" : "text-emerald-500"}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${complianceRate < 80 ? "text-red-400" : "text-white"}`}>
                          {complianceRate}%
                        </span>
                        <span className="text-xs text-slate-500 uppercase">Compliance Rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-xs text-slate-400">Active Contractors</span>
                    <span className="text-sm font-bold text-white">{activeContractors.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-xs text-red-400">Non-Compliant</span>
                    <span className="text-sm font-bold text-red-400">{nonCompliantCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs text-amber-400">Expiring Soon</span>
                    <span className="text-sm font-bold text-amber-400">{expiringCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-xs text-slate-400">Pending Documents</span>
                    <span className="text-sm font-bold text-white">{pendingDocuments}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                    NON-COMPLIANT CONTRACTORS
                  </h3>
                </div>
                <div className="space-y-2">
                  {contractors.slice(0, 5).map((contractor, idx) => {
                    const complianceIssues = [
                      { missing: "W9 Form, Liability Insurance", severity: "critical" },
                      { missing: "Background Check (expired)", severity: "critical" },
                      { missing: "NDA Agreement", severity: "warning" },
                      { missing: "Professional Certification", severity: "warning" },
                      { missing: "I-9 Verification", severity: "critical" },
                    ];
                    const issue = complianceIssues[idx % complianceIssues.length];
                    return (
                      <div 
                        key={contractor.id}
                        onClick={() => go({ to: `/contractors/show/${contractor.id}` })}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {contractor.firstName} {contractor.lastName}
                          </div>
                          <div className="text-xs text-red-400 mt-0.5">
                            <span className="font-semibold">Missing:</span> {issue.missing}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {contractor.location || 'Remote'} • {contractor.email}
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs flex-shrink-0 ${
                          issue.severity === "critical" 
                            ? "border-red-500/40 text-red-400" 
                            : "border-amber-500/40 text-amber-400"
                        }`}>
                          <XCircle className="w-3 h-3 mr-1" />
                          {issue.severity === "critical" ? "Critical" : "Warning"}
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
                      <span className="text-purple-400 font-semibold">Pattern Detected:</span> 60% of non-compliant contractors are from Engineering department - may indicate onboarding process gap.
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Risk Assessment:</span> 2 contractors with expired insurance pose immediate liability risk.
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Recommendation:</span> Implement automated document reminders 30 days before expiration.
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
                    defaultValue={`Subject: Action Required: Contractor Compliance Issue

Hi Team,

This is an automated alert regarding contractor compliance.

${nonCompliantCount} contractors are currently non-compliant:
- Missing required certifications
- Expired documentation

Please review and take action within 48 hours.

Best regards,
Velocity Compliance Team`}
                  />
                </div>
              )}

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">
                    DOCUMENT TYPES NEEDED
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    { type: "W9 Forms", count: 3 },
                    { type: "Insurance Certs", count: 2 },
                    { type: "Background Checks", count: 2 },
                    { type: "Certifications", count: 1 },
                  ].map(doc => (
                    <div 
                      key={doc.type}
                      className="flex items-center justify-between p-2 rounded bg-slate-800/50"
                    >
                      <span className="text-xs text-slate-300">{doc.type}</span>
                      <Badge className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {doc.count} missing
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
                    <span className="text-slate-500">Critical Issues</span>
                    <span className="text-red-400 font-semibold">{criticalIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Days to Next Audit</span>
                    <span className="text-white font-semibold">14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Compliance Trend</span>
                    <span className="text-amber-400 font-semibold">↓ 3%</span>
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
