/**
 * SOW Workflow Visualizer - Premium Workflow Stage Display
 * Shows progression stages with visual arrows, tooltips, and action insights
 * Designed as the premium centerpiece of the SOW management interface
 */

import React from "react";
import { 
  FileText, 
  CheckCircle, 
  Zap, 
  DollarSign, 
  CreditCard, 
  Trophy,
  ChevronRight,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkflowStage {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  textColor: string;
  borderColor: string;
  insights: string[];
  actions: string[];
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "draft",
    label: "Draft",
    description: "Initial SOW creation and setup",
    icon: FileText,
    color: "from-slate-400 to-slate-500",
    accentBg: "bg-slate-500/10",
    textColor: "text-slate-300",
    borderColor: "border-slate-600",
    insights: ["Define scope and deliverables", "Set budget and timeline", "Assign resources"],
    actions: ["Create SOW", "Add stakeholders", "Set milestones"]
  },
  {
    id: "review",
    label: "Review",
    description: "Stakeholder approval phase",
    icon: CheckCircle,
    color: "from-amber-400 to-amber-500",
    accentBg: "bg-amber-500/10",
    textColor: "text-amber-300",
    borderColor: "border-amber-600",
    insights: ["Await legal review", "Finance approval pending", "Exec sign-off required"],
    actions: ["Request review", "Review comments", "Track approvals"]
  },
  {
    id: "active",
    label: "Active",
    description: "Contract is live and running",
    icon: Zap,
    color: "from-emerald-400 to-emerald-500",
    accentBg: "bg-emerald-500/10",
    textColor: "text-emerald-300",
    borderColor: "border-emerald-600",
    insights: ["Work in progress", "Track deliverables", "Monitor budget burn"],
    actions: ["View progress", "Log hours", "Update milestones"]
  },
  {
    id: "invoiced",
    label: "Invoiced",
    description: "Invoice generated and sent",
    icon: DollarSign,
    color: "from-blue-400 to-blue-500",
    accentBg: "bg-blue-500/10",
    textColor: "text-blue-300",
    borderColor: "border-blue-600",
    insights: ["Payment terms: Net 30", "Invoice tracking active", "Reconciliation in progress"],
    actions: ["View invoice", "Track payment", "Send reminder"]
  },
  {
    id: "paid",
    label: "Paid",
    description: "Payment received and reconciled",
    icon: CreditCard,
    color: "from-cyan-400 to-cyan-500",
    accentBg: "bg-cyan-500/10",
    textColor: "text-cyan-300",
    borderColor: "border-cyan-600",
    insights: ["Funds received", "Budget finalized", "Close-out phase"],
    actions: ["View ledger", "Download receipt", "Archive"]
  },
  {
    id: "completed",
    label: "Completed",
    description: "SOW closed and archived",
    icon: Trophy,
    color: "from-purple-400 to-purple-500",
    accentBg: "bg-purple-500/10",
    textColor: "text-purple-300",
    borderColor: "border-purple-600",
    insights: ["Work completed", "Final payment received", "Lessons documented"],
    actions: ["View summary", "Export report", "Feedback"]
  }
];

interface SOWWorkflowVisualizerProps {
  activeStageId?: string;
  totalSOWs: number;
  distributionByStage: Record<string, number>;
}

export function SOWWorkflowVisualizer({
  activeStageId = "active",
  totalSOWs,
  distributionByStage = {},
}: SOWWorkflowVisualizerProps) {
  const getStageCount = (stageId: string) => distributionByStage[stageId] || 0;

  return (
    <Card className="border-slate-700 bg-gradient-to-br from-slate-900/50 to-slate-900/30 overflow-hidden mb-6">
      <div className="p-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            SOW Workflow Journey
          </h2>
          <p className="text-slate-400 text-sm">
            Track contract progression through {WORKFLOW_STAGES.length} stages • {totalSOWs} total SOWs
          </p>
        </div>

        {/* Workflow Stages - Horizontal Flow */}
        <div className="relative">
          {/* Connection Lines (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ height: "100%", top: 0 }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Flow arrows connecting stages */}
            <line
              x1="8%"
              y1="50%"
              x2="92%"
              y2="50%"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Stages Grid */}
          <div className="grid grid-cols-6 gap-4 relative z-10">
            {WORKFLOW_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = activeStageId === stage.id;
              const stageCount = getStageCount(stage.id);
              const isCompleted = WORKFLOW_STAGES.findIndex((s) => s.id === activeStageId) > index;

              return (
                <div key={stage.id} className="flex flex-col items-center">
                  {/* Stage Circle */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-help mb-4",
                            "border-2 backdrop-blur-sm",
                            isActive
                              ? cn(
                                  "bg-gradient-to-br",
                                  stage.accentBg,
                                  stage.borderColor,
                                  "shadow-lg shadow-cyan-500/50 scale-110"
                                )
                              : isCompleted
                              ? cn("bg-gradient-to-br", stage.accentBg, stage.borderColor, "opacity-80")
                              : "bg-slate-800/50 border-slate-600 opacity-60"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-8 w-8 transition-colors",
                              isActive || isCompleted ? stage.textColor : "text-slate-500"
                            )}
                          />
                          {isActive && (
                            <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-cyan-400" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-800 border-slate-700 max-w-xs">
                        <div className="space-y-2">
                          <p className="font-bold text-white">{stage.label}</p>
                          <p className="text-xs text-slate-300">{stage.description}</p>
                          <div className="pt-2 border-t border-slate-600">
                            <p className="text-xs font-semibold text-cyan-300 mb-1">Quick Insights:</p>
                            <ul className="text-xs text-slate-300 space-y-1">
                              {stage.insights.map((insight, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-emerald-400">•</span>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-slate-600">
                            <p className="text-xs font-semibold text-amber-300 mb-1">Common Actions:</p>
                            <ul className="text-xs text-slate-300 space-y-1">
                              {stage.actions.slice(0, 2).map((action, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-blue-400">→</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Stage Label & Count */}
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-sm font-bold transition-colors",
                        isActive ? "text-cyan-300" : isCompleted ? stage.textColor : "text-slate-400"
                      )}
                    >
                      {stage.label}
                    </p>
                    <div
                      className={cn(
                        "text-xs font-mono mt-1 px-2 py-1 rounded",
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300"
                          : isCompleted
                          ? cn(stage.accentBg, stage.textColor)
                          : "bg-slate-800 text-slate-500"
                      )}
                    >
                      {stageCount} SOW{stageCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Chevron Arrow (except last) */}
                  {index < WORKFLOW_STAGES.length - 1 && (
                    <div className="absolute left-1/2 top-1/2 transform translate-x-[72px] -translate-y-1/2 pointer-events-none">
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isCompleted || isActive ? "text-cyan-400" : "text-slate-600"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Insights Bar with Tooltips */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-6">
            {/* Total Pipeline */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2 cursor-help hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Pipeline Health</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">
                    {totalSOWs > 0
                      ? ((WORKFLOW_STAGES.reduce((sum, stage) => sum + getStageCount(stage.id), 0) / totalSOWs) * 100).toFixed(0)
                      : "100"}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {WORKFLOW_STAGES.reduce((sum, stage) => sum + getStageCount(stage.id), 0)} of {totalSOWs} SOWs active
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700 p-3">
                <div className="space-y-2">
                  <p className="font-semibold text-emerald-400 text-sm">Pipeline Health Score</p>
                  <p className="text-xs text-slate-300">Percentage of SOWs actively progressing through workflow stages. Higher is better.</p>
                  <div className="pt-1 border-t border-slate-700">
                    <p className="text-[10px] text-emerald-400">→ Target: Keep above 80% for healthy pipeline</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* Workflow Progress - Weighted average matching documented formula */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2 cursor-help hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Workflow Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-300">
                    {totalSOWs > 0 
                      ? Math.round((
                          (getStageCount("draft") * 0.25) + 
                          (getStageCount("review") * 0.35) + 
                          (getStageCount("active") * 0.50) + 
                          (getStageCount("invoiced") * 0.75) + 
                          ((getStageCount("paid") + getStageCount("completed")) * 1.0)
                        ) / totalSOWs * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {getStageCount("draft")} draft • {getStageCount("review")} review • {getStageCount("active")} active
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700 p-3">
                <div className="space-y-2">
                  <p className="font-semibold text-amber-400 text-sm">Workflow Progress Score</p>
                  <p className="text-xs text-slate-300">Weighted average of SOW progression: Draft=25%, Review=35%, Active=50%, Invoiced=75%, Completed=100%.</p>
                  <div className="pt-1 border-t border-slate-700">
                    <p className="text-[10px] text-amber-400">→ Target: Keep momentum above 40%</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            {/* Stage Distribution - Always shows explicit counts for all stages */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2 cursor-help hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Trophy className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Stage Distribution</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-300">
                    {totalSOWs > 0 ? Math.round(getStageCount("active") / totalSOWs * 100) : 0}% Active
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">{getStageCount("draft") + getStageCount("review")} queued</span>
                    <span className="text-cyan-400"> • {getStageCount("active")} active</span>
                    <span className="text-emerald-400"> • {getStageCount("invoiced") + getStageCount("paid") + getStageCount("completed")} post-active</span>
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700 p-3">
                <div className="space-y-2">
                  <p className="font-semibold text-purple-400 text-sm">Stage Distribution</p>
                  <p className="text-xs text-slate-300">
                    Shows how SOWs are distributed across workflow stages. 
                    Higher active % means more contracts delivering value.
                  </p>
                  <div className="pt-1 border-t border-slate-700">
                    <p className="text-[10px] text-purple-400">→ {getStageCount("draft")} draft, {getStageCount("review")} review, {getStageCount("active")} active, {getStageCount("invoiced")} invoiced</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SOWWorkflowVisualizer;
