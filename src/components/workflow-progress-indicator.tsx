import { LucideIcon, FileInput, Cog, Calculator, CheckSquare, FileOutput, ChevronRight, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type WorkflowStage = "input" | "process" | "calculate" | "validate" | "output";
type StageStatus = "completed" | "current" | "pending" | "blocked";

interface WorkflowStageInfo {
  stage: WorkflowStage;
  status: StageStatus;
  label: string;
  description: string;
  itemCount?: number;
  completedCount?: number;
  action?: () => void;
}

interface WorkflowProgressIndicatorProps {
  stages: WorkflowStageInfo[];
  workflowName: string;
  workflowDescription?: string;
  compact?: boolean;
}

const stageIcons: Record<WorkflowStage, LucideIcon> = {
  input: FileInput,
  process: Cog,
  calculate: Calculator,
  validate: CheckSquare,
  output: FileOutput
};

const stageColors: Record<WorkflowStage, string> = {
  input: "cyan",
  process: "blue",
  calculate: "purple",
  validate: "amber",
  output: "emerald"
};

const statusStyles: Record<StageStatus, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  connector: string;
}> = {
  completed: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/50",
    text: "text-emerald-400",
    icon: "text-emerald-400",
    connector: "bg-emerald-500"
  },
  current: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/50",
    text: "text-blue-400",
    icon: "text-blue-400",
    connector: "bg-slate-600"
  },
  pending: {
    bg: "bg-slate-700/30",
    border: "border-slate-600/50",
    text: "text-slate-500",
    icon: "text-slate-500",
    connector: "bg-slate-700"
  },
  blocked: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: "text-red-400",
    connector: "bg-red-500/30"
  }
};

export function WorkflowProgressIndicator({
  stages,
  workflowName,
  workflowDescription,
  compact = false
}: WorkflowProgressIndicatorProps) {
  const completedStages = stages.filter(s => s.status === "completed").length;
  const currentStage = stages.find(s => s.status === "current");
  const progressPercent = (completedStages / stages.length) * 100;

  return (
    <TooltipProvider>
      <div className={`
        relative overflow-hidden rounded-xl border border-slate-700/50 
        bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90
        ${compact ? 'p-3' : 'p-5'}
      `}>
        {/* Carbon fiber texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`
          }}
        />

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="relative">
          {/* Header */}
          {!compact && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/50">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-[0.1em] uppercase">
                    {workflowName}
                  </h3>
                  {workflowDescription && (
                    <p className="text-[11px] text-slate-500">{workflowDescription}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {completedStages}/{stages.length} stages complete
              </div>
            </div>
          )}

          {/* Stages */}
          <div className="flex items-center justify-between gap-1">
            {stages.map((stage, idx) => {
              const Icon = stageIcons[stage.stage];
              const style = statusStyles[stage.status];
              const isLast = idx === stages.length - 1;

              return (
                <div key={stage.stage} className="flex items-center flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`
                          relative flex-shrink-0 transition-all duration-300
                          ${stage.action ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                        `}
                        onClick={stage.action}
                      >
                        {/* Stage node */}
                        <div className={`
                          ${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-lg ${style.bg} ${style.border} border
                          flex items-center justify-center relative
                          ${stage.status === 'current' ? 'ring-2 ring-blue-500/30 animate-pulse' : ''}
                        `}>
                          <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${style.icon}`} />
                          
                          {/* Item count badge */}
                          {stage.itemCount !== undefined && stage.itemCount > 0 && (
                            <div className={`
                              absolute -top-1 -right-1 w-4 h-4 rounded-full 
                              ${stage.status === 'current' ? 'bg-blue-500' : 'bg-slate-600'}
                              flex items-center justify-center
                            `}>
                              <span className="text-[9px] font-bold text-white">
                                {stage.itemCount > 9 ? '9+' : stage.itemCount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Stage label */}
                        {!compact && (
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${style.text}`}>
                              {stage.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      className="bg-slate-900 border-slate-700 p-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${style.icon}`} />
                          <span className="text-sm font-semibold text-white">
                            {stage.label}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.bg} ${style.text} font-bold`}>
                            {stage.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{stage.description}</p>
                        {stage.itemCount !== undefined && (
                          <div className="text-xs text-slate-500 pt-1 border-t border-slate-700">
                            {stage.completedCount !== undefined 
                              ? `${stage.completedCount}/${stage.itemCount} items processed`
                              : `${stage.itemCount} items in queue`
                            }
                          </div>
                        )}
                        {stage.action && (
                          <div className="text-[10px] text-cyan-400 italic">
                            Click to view details →
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {/* Connector line */}
                  {!isLast && (
                    <div className="flex-1 mx-1">
                      <div className={`h-0.5 ${style.connector} rounded-full`}>
                        {stage.status === 'current' && (
                          <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-transparent animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current stage highlight */}
          {currentStage && !compact && (
            <div className="mt-8 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 text-xs text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-bold uppercase tracking-wider">Currently at:</span>
                <span className="text-white font-semibold">{currentStage.label}</span>
                <span className="text-slate-400">— {currentStage.description}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export type { WorkflowStageInfo, WorkflowStage, StageStatus };
