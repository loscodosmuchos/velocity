import { LucideIcon, Heart, Shield, Eye, Workflow, Brain, Clock, CheckCircle2, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type HealingStatus = "healed" | "healing" | "monitoring" | "needs_attention";

interface PainPoint {
  id: string;
  category: string;
  painDescription: string;
  healingSolution: string;
  status: HealingStatus;
  healingPercent: number;
  beforeState: string;
  afterState: string;
  impactAreas: string[];
  department?: string;
}

interface PainPointHealingProps {
  painPoints: PainPoint[];
  title?: string;
  showAll?: boolean;
}

const statusConfig: Record<HealingStatus, {
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
  label: string;
  pulseColor: string;
}> = {
  healed: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    label: "RESOLVED",
    pulseColor: "bg-emerald-500"
  },
  healing: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Heart,
    label: "IN PROGRESS",
    pulseColor: "bg-blue-500"
  },
  monitoring: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Eye,
    label: "MONITORING",
    pulseColor: "bg-amber-500"
  },
  needs_attention: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: AlertTriangle,
    label: "NEEDS ATTENTION",
    pulseColor: "bg-red-500"
  }
};

const categoryIcons: Record<string, LucideIcon> = {
  process: Workflow,
  visibility: Eye,
  risk: Shield,
  planning: Brain,
  efficiency: Clock
};

export function PainPointHealing({
  painPoints,
  title = "ORGANIZATIONAL HEALING",
  showAll = false
}: PainPointHealingProps) {
  const displayPoints = showAll ? painPoints : painPoints.slice(0, 6);
  const healedCount = painPoints.filter(p => p.status === "healed").length;
  const healingCount = painPoints.filter(p => p.status === "healing").length;
  const overallHealth = Math.round((painPoints.reduce((sum, p) => sum + p.healingPercent, 0) / painPoints.length));

  return (
    <TooltipProvider>
      <div className="relative overflow-hidden rounded-xl border-2 border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Healing pulse background effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500 blur-3xl animate-pulse" />
        </div>

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

        {/* Progress bar at top showing overall healing */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${overallHealth}%` }}
          />
        </div>

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 flex items-center justify-center border border-emerald-500/30">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-[0.15em] uppercase">
                  {title}
                </h3>
                <p className="text-xs text-slate-400">
                  Active solutions addressing organizational pain points
                </p>
              </div>
            </div>

            {/* Health summary */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{overallHealth}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Overall Health</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-emerald-500/20"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${overallHealth * 1.256} 125.6`}
                    className="text-emerald-500 transition-all duration-1000"
                  />
                </svg>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-lg font-bold text-emerald-400">{healedCount}</div>
              <div className="text-[10px] text-emerald-400/70 uppercase">Resolved</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <div className="text-lg font-bold text-blue-400">{healingCount}</div>
              <div className="text-[10px] text-blue-400/70 uppercase">In Progress</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-lg font-bold text-amber-400">
                {painPoints.filter(p => p.status === "monitoring").length}
              </div>
              <div className="text-[10px] text-amber-400/70 uppercase">Monitoring</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <div className="text-lg font-bold text-red-400">
                {painPoints.filter(p => p.status === "needs_attention").length}
              </div>
              <div className="text-[10px] text-red-400/70 uppercase">Attention</div>
            </div>
          </div>

          {/* Pain points grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayPoints.map((point) => {
              const config = statusConfig[point.status];
              const StatusIcon = config.icon;
              const CategoryIcon = categoryIcons[point.category] || Workflow;

              return (
                <Tooltip key={point.id}>
                  <TooltipTrigger asChild>
                    <div className={`
                      relative overflow-hidden rounded-lg ${config.bg} border ${config.border}
                      p-3 cursor-pointer transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg group
                    `}>
                      {/* Healing progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            point.status === "healed" ? "bg-emerald-500" :
                            point.status === "healing" ? "bg-blue-500" :
                            point.status === "monitoring" ? "bg-amber-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${point.healingPercent}%` }}
                        />
                      </div>

                      <div className="flex items-start gap-2.5">
                        {/* Category icon */}
                        <div className={`w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center ${config.color}`}>
                          <CategoryIcon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold ${config.color} tracking-wider`}>
                              {config.label}
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full ${config.pulseColor} ${
                              point.status === "healing" || point.status === "needs_attention" ? "animate-pulse" : ""
                            }`} />
                          </div>
                          <h4 className="text-xs font-semibold text-white truncate mb-1">
                            {point.painDescription}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {point.healingSolution}
                          </p>
                        </div>

                        {/* Healing percentage */}
                        <div className="text-right">
                          <div className={`text-sm font-bold ${config.color}`}>
                            {point.healingPercent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-sm bg-slate-900 border-slate-700 p-4"
                  >
                    <div className="space-y-3">
                      {/* Pain point header */}
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                        <span className="text-sm font-semibold text-white">
                          {point.painDescription}
                        </span>
                      </div>

                      {/* Before/After transformation */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-16 text-[10px] font-bold text-red-400 uppercase tracking-wider pt-0.5">
                            BEFORE
                          </div>
                          <p className="text-xs text-slate-400 flex-1">{point.beforeState}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-16 text-[10px] font-bold text-emerald-400 uppercase tracking-wider pt-0.5">
                            AFTER
                          </div>
                          <p className="text-xs text-slate-300 flex-1">{point.afterState}</p>
                        </div>
                      </div>

                      {/* Solution */}
                      <div className="pt-2 border-t border-slate-700">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                          HEALING SOLUTION
                        </div>
                        <p className="text-xs text-slate-300">{point.healingSolution}</p>
                      </div>

                      {/* Impact areas */}
                      {point.impactAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-700">
                          {point.impactAreas.map((area, idx) => (
                            <span 
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] bg-slate-700/50 text-slate-400 rounded"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Bottom insight */}
          <div className="mt-5 p-3 rounded-lg bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <p className="text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Velocity</span> is actively healing {healingCount} organizational pain points.
              Your workflow efficiency has improved by <span className="text-emerald-400 font-semibold">{overallHealth - 20}%</span> since implementation.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export type { PainPoint, HealingStatus };
