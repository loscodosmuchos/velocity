import { LucideIcon, TrendingUp, TrendingDown, Minus, Target, AlertTriangle, Clock, Zap, ArrowRight, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TrendDirection = "up" | "down" | "stable";
type ProjectionSeverity = "healthy" | "caution" | "critical";

interface StrategicProjection {
  metric: string;
  current: string | number;
  projected: string | number;
  projectionDate: string;
  trend: TrendDirection;
  severity: ProjectionSeverity;
  insight: string;
  recommendation: string;
  action?: () => void;
}

interface StrategicIntelligencePanelProps {
  projections: StrategicProjection[];
  focusAreas?: string[];
  title?: string;
}

const severityColors: Record<ProjectionSeverity, { bg: string; border: string; text: string; glow: string }> = {
  healthy: { 
    bg: "from-emerald-950/80 to-emerald-900/60", 
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20"
  },
  caution: { 
    bg: "from-amber-950/80 to-amber-900/60", 
    border: "border-amber-500/40",
    text: "text-amber-400",
    glow: "shadow-amber-500/20"
  },
  critical: { 
    bg: "from-red-950/80 to-red-900/60", 
    border: "border-red-500/40",
    text: "text-red-400",
    glow: "shadow-red-500/20"
  }
};

const trendIcons: Record<TrendDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export function StrategicIntelligencePanel({ 
  projections, 
  focusAreas = [],
  title = "STRATEGIC TRAJECTORY"
}: StrategicIntelligencePanelProps) {
  const criticalCount = projections.filter(p => p.severity === "critical").length;
  const cautionCount = projections.filter(p => p.severity === "caution").length;

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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center border border-purple-500/30">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-[0.15em] uppercase">
                  {title}
                </h3>
                <p className="text-xs text-slate-400">
                  Projected outcomes at current trajectory
                </p>
              </div>
            </div>

            {/* Summary badges */}
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 tracking-wide">
                    {criticalCount} INTERVENTION REQUIRED
                  </span>
                </div>
              )}
              {cautionCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-400 tracking-wide">
                    {cautionCount} MONITORING
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Focus Areas Bar */}
          {focusAreas.length > 0 && (
            <div className="mb-5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 tracking-[0.1em] uppercase">
                  FOCUS AREAS THIS PERIOD
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-700/50 rounded border border-slate-600/50"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projections.map((projection, idx) => {
              const TrendIcon = trendIcons[projection.trend];
              const colors = severityColors[projection.severity];

              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`
                        relative overflow-hidden rounded-lg border-2 ${colors.border}
                        bg-gradient-to-br ${colors.bg}
                        p-4 cursor-pointer transition-all duration-300
                        hover:scale-[1.02] hover:shadow-lg ${colors.glow}
                        group
                      `}
                      onClick={projection.action}
                    >
                      {/* Trajectory visualization */}
                      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <svg width="60" height="40" viewBox="0 0 60 40">
                          <path
                            d={projection.trend === "up" 
                              ? "M0,35 Q15,30 30,20 T60,5"
                              : projection.trend === "down"
                              ? "M0,5 Q15,10 30,20 T60,35"
                              : "M0,20 Q15,20 30,20 T60,20"
                            }
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={colors.text}
                            strokeDasharray="4,2"
                          />
                          <circle 
                            cx="60" 
                            cy={projection.trend === "up" ? 5 : projection.trend === "down" ? 35 : 20}
                            r="3"
                            className={`fill-current ${colors.text}`}
                          />
                        </svg>
                      </div>

                      {/* Metric label */}
                      <div className="text-xs font-bold text-slate-400 tracking-[0.1em] uppercase mb-2">
                        {projection.metric}
                      </div>

                      {/* Current vs Projected */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-bold text-white">
                          {projection.current}
                        </span>
                        <ArrowRight className={`w-4 h-4 ${colors.text}`} />
                        <span className={`text-lg font-bold ${colors.text}`}>
                          {projection.projected}
                        </span>
                      </div>

                      {/* Projection date */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>by {projection.projectionDate}</span>
                        <TrendIcon className={`w-3.5 h-3.5 ml-auto ${colors.text}`} />
                      </div>

                      {/* Action indicator */}
                      {projection.action && (
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-sm bg-slate-900 border-slate-700 p-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                          TRAJECTORY INSIGHT
                        </div>
                        <p className="text-sm text-white">
                          {projection.insight}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <div className="text-xs font-bold text-cyan-400 uppercase mb-1">
                          RECOMMENDED ACTION
                        </div>
                        <p className="text-sm text-slate-300">
                          {projection.recommendation}
                        </p>
                      </div>
                      {projection.action && (
                        <div className="text-xs text-slate-500 italic">
                          Click to take action →
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Bottom insight bar */}
          <div className="mt-5 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">
                <span className="text-blue-400 font-semibold">Strategic Guidance:</span>{" "}
                {criticalCount > 0 
                  ? `${criticalCount} metric${criticalCount > 1 ? 's' : ''} require${criticalCount === 1 ? 's' : ''} immediate intervention to prevent adverse outcomes.`
                  : cautionCount > 0
                  ? `Monitoring ${cautionCount} metric${cautionCount > 1 ? 's' : ''} trending toward threshold limits.`
                  : "All projections within healthy parameters. Continue current operational tempo."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export type { StrategicProjection, TrendDirection, ProjectionSeverity };
