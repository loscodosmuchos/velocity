import { LucideIcon, Sparkles, ChevronRight, Clock, CheckCircle2, AlertCircle, Zap, Brain, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ActionPriority = "immediate" | "recommended" | "optional";
type ActionCategory = "approval" | "review" | "communication" | "compliance" | "optimization";

interface AnticipatoryAction {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  priority: ActionPriority;
  category: ActionCategory;
  estimatedTime: string;
  impactScore: number;
  reason: string;
  action: () => void;
}

interface AnticipatoryActionsProps {
  actions: AnticipatoryAction[];
  userName?: string;
  title?: string;
}

const priorityConfig: Record<ActionPriority, { 
  bg: string; 
  border: string; 
  text: string; 
  badge: string;
  label: string;
}> = {
  immediate: { 
    bg: "from-red-950/60 to-rose-900/40", 
    border: "border-red-500/50",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400 border-red-500/40",
    label: "DO NOW"
  },
  recommended: { 
    bg: "from-amber-950/60 to-yellow-900/40", 
    border: "border-amber-500/50",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    label: "SUGGESTED"
  },
  optional: { 
    bg: "from-slate-800/60 to-slate-700/40", 
    border: "border-slate-600/50",
    text: "text-slate-400",
    badge: "bg-slate-500/20 text-slate-400 border-slate-500/40",
    label: "WHEN TIME PERMITS"
  }
};

const categoryIcons: Record<ActionCategory, string> = {
  approval: "⚡",
  review: "🔍",
  communication: "💬",
  compliance: "🛡️",
  optimization: "📈"
};

export function AnticipatoryActions({ 
  actions, 
  userName = "User",
  title = "WHAT'S NEXT"
}: AnticipatoryActionsProps) {
  const immediateCount = actions.filter(a => a.priority === "immediate").length;
  const totalImpact = actions.reduce((sum, a) => sum + a.impactScore, 0);

  return (
    <TooltipProvider>
      <div className="relative overflow-hidden rounded-xl border-2 border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Carbon fiber texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
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

        {/* Racing stripe accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 flex items-center justify-center border border-cyan-500/30">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-[0.15em] uppercase">
                  {title}
                </h3>
                <p className="text-xs text-slate-400">
                  Personalized actions based on your workflow
                </p>
              </div>
            </div>

            {/* Impact score */}
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 cursor-help">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400">
                      {totalImpact} IMPACT POINTS
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700">
                  <p className="text-xs text-slate-300">
                    Total efficiency improvement potential from completing these actions
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Personalized greeting */}
          <div className="mb-5 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-slate-300">
                <span className="text-blue-400 font-semibold">{userName}</span>, based on your current workload and pending items, 
                {immediateCount > 0 
                  ? ` I've identified ${immediateCount} action${immediateCount > 1 ? 's' : ''} that need${immediateCount === 1 ? 's' : ''} immediate attention.`
                  : " here are the most impactful actions for your workflow today."
                }
              </p>
            </div>
          </div>

          {/* Actions list */}
          <div className="space-y-3">
            {actions.map((action, idx) => {
              const Icon = action.icon;
              const config = priorityConfig[action.priority];
              const categoryEmoji = categoryIcons[action.category];

              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`
                        relative overflow-hidden rounded-lg border ${config.border}
                        bg-gradient-to-r ${config.bg}
                        p-4 cursor-pointer transition-all duration-300
                        hover:scale-[1.01] hover:shadow-lg group
                      `}
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-4">
                        {/* Priority indicator */}
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg ${idx === 0 ? 'animate-bounce' : ''}`}>
                            {categoryEmoji}
                          </span>
                          <span className={`text-[10px] font-bold ${config.text} tracking-wider`}>
                            {idx + 1}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center border ${config.border}`}>
                          <Icon className={`w-5 h-5 ${config.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {action.title}
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${config.badge}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {action.description}
                          </p>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{action.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="text-cyan-400">+{action.impactScore}</span>
                          </div>
                        </div>

                        {/* Action arrow */}
                        <ChevronRight className={`w-5 h-5 ${config.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                      </div>

                      {/* Progress bar for immediate actions */}
                      {action.priority === "immediate" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5">
                          <div className="h-full bg-red-500/50 animate-pulse" style={{ width: '100%' }} />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="left" 
                    className="max-w-sm bg-slate-900 border-slate-700 p-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                          WHY THIS ACTION?
                        </div>
                        <p className="text-sm text-white">
                          {action.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                        <div className="flex items-center gap-1 text-xs text-cyan-400">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Impact: +{action.impactScore} efficiency points</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 italic flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        Click to take action
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Completion indicator */}
          {actions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No immediate actions required</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export type { AnticipatoryAction, ActionPriority, ActionCategory };
