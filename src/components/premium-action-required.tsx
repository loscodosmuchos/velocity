import { LucideIcon, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type UrgencyLevel = "critical" | "warning" | "info";

interface ActionItem {
  urgency: UrgencyLevel;
  icon: LucideIcon;
  label: string;
  value: string;
  tooltip: string;
  action: () => void;
}

interface PremiumActionRequiredProps {
  items: ActionItem[];
  maxItems?: number;
}

const urgencyConfig: Record<UrgencyLevel, {
  gradient: string;
  glow: string;
  pulse: string;
  text: string;
  bar: string;
  ring: string;
}> = {
  critical: {
    gradient: "from-red-600 via-red-500 to-orange-500",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
    pulse: "animate-pulse",
    text: "text-red-100",
    bar: "bg-gradient-to-r from-red-500 to-orange-500",
    ring: "ring-red-500/50",
  },
  warning: {
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
    pulse: "",
    text: "text-amber-100",
    bar: "bg-gradient-to-r from-amber-500 to-yellow-400",
    ring: "ring-amber-500/40",
  },
  info: {
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]",
    pulse: "",
    text: "text-blue-100",
    bar: "bg-gradient-to-r from-blue-500 to-cyan-400",
    ring: "ring-blue-500/30",
  },
};

function TelemetryGauge({ urgency, value }: { urgency: UrgencyLevel; value: number }) {
  const config = urgencyConfig[urgency];
  const segments = 8;
  const activeSegments = Math.ceil((value / 100) * segments);
  
  return (
    <div className="flex gap-0.5 h-2">
      {[...Array(segments)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1.5 rounded-sm transition-all duration-300
            ${i < activeSegments 
              ? `${config.bar} ${i >= segments - 2 ? 'animate-pulse' : ''}` 
              : 'bg-slate-700/50'}
          `}
        />
      ))}
    </div>
  );
}

function RacingActionCard({ item, index }: { item: ActionItem; index: number }) {
  const config = urgencyConfig[item.urgency];
  const Icon = item.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={item.action}
          className={`
            group relative overflow-hidden rounded-lg
            bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
            border border-slate-700/50
            ${config.glow}
            transition-all duration-300 ease-out
            hover:scale-[1.03] hover:border-slate-600
            active:scale-[0.98]
            text-left w-full
          `}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Top racing stripe - LED indicator */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${config.bar}`} />
          
          {/* Carbon fiber weave texture */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px),
                repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)
              `
            }}
          />
          
          {/* Diagonal speed lines */}
          <div 
            className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 11px
              )`
            }}
          />

          <div className="relative p-3 pt-4">
            {/* Header row with icon and telemetry */}
            <div className="flex items-start justify-between mb-2">
              {/* Icon pod */}
              <div className={`
                relative w-10 h-10 rounded-lg overflow-hidden
                bg-gradient-to-br from-slate-800 to-slate-900
                border border-slate-600/50
                flex items-center justify-center
                group-hover:border-slate-500/50 transition-colors
              `}>
                <Icon className={`h-5 w-5 ${config.text} relative z-10`} />
                {/* Inner glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20`} />
                {/* Critical indicator dot */}
                {item.urgency === "critical" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                )}
                {item.urgency === "critical" && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </div>
              
              {/* Telemetry gauge */}
              <TelemetryGauge urgency={item.urgency} value={item.urgency === "critical" ? 90 : item.urgency === "warning" ? 65 : 40} />
            </div>
            
            {/* Label with tracking */}
            <div className={`text-[10px] font-semibold ${config.text} opacity-70 uppercase tracking-[0.15em] mb-1 truncate`}>
              {item.label}
            </div>
            
            {/* Value display - big and confident */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white tracking-tight truncate pr-2">
                {item.value}
              </span>
              <ChevronRight className={`
                h-4 w-4 ${config.text} opacity-40 flex-shrink-0
                group-hover:opacity-100 group-hover:translate-x-1
                transition-all duration-200
              `} />
            </div>
          </div>
          
          {/* Bottom reflection line */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="max-w-xs bg-slate-900/95 backdrop-blur-sm border-slate-700 text-white p-3"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${config.bar}`} />
            <p className="font-semibold text-sm">{item.label}</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{item.tooltip}</p>
          <div className="flex items-center gap-1 pt-1 text-xs text-blue-400">
            <ArrowRight className="h-3 w-3" />
            <span>Click to take action</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function PremiumActionRequired({ items, maxItems = 8 }: PremiumActionRequiredProps) {
  const displayItems = items.slice(0, maxItems);
  const criticalCount = items.filter(i => i.urgency === "critical").length;
  const warningCount = items.filter(i => i.urgency === "warning").length;

  if (items.length === 0) return null;

  const headerGradient = criticalCount > 0 
    ? "from-red-500 via-orange-500 to-amber-500"
    : warningCount > 0
    ? "from-amber-500 via-yellow-500 to-orange-400"
    : "from-blue-500 via-cyan-500 to-teal-400";

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Deep premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Brushed metal texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)
          `
        }}
      />
      
      {/* Racing stripe accent - top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${headerGradient}`} />
      
      {/* Ambient glow from top */}
      <div className={`
        absolute top-0 left-1/4 right-1/4 h-32 opacity-20 blur-3xl
        bg-gradient-to-b ${headerGradient}
      `} />

      <div className="relative p-5">
        {/* Header - F1 pit wall style */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Status beacon */}
            <div className={`
              relative w-12 h-12 rounded-xl overflow-hidden
              bg-gradient-to-br from-slate-800 to-slate-900
              border border-slate-700/50
              flex items-center justify-center
              shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
            `}>
              <Zap className={`h-6 w-6 text-white relative z-10 ${criticalCount > 0 ? 'animate-pulse' : ''}`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${headerGradient} opacity-30`} />
              {/* LED ring */}
              <div className={`absolute inset-0.5 rounded-[10px] border-2 border-dashed ${criticalCount > 0 ? 'border-red-500/50 animate-spin' : 'border-slate-600/30'}`} style={{ animationDuration: '8s' }} />
            </div>
            
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
                Action Required
                {criticalCount > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </h3>
              <p className="text-xs text-slate-400 tracking-wide">
                {items.length} item{items.length !== 1 ? 's' : ''} requiring attention
              </p>
            </div>
          </div>
          
          {/* Status indicators - racing flag style */}
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  {criticalCount} Critical
                </span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {warningCount} Monitor
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action cards grid - telemetry panel layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayItems.map((item, idx) => (
            <RacingActionCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Overflow indicator */}
        {items.length > maxItems && (
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">
              +{items.length - maxItems} additional items
            </span>
          </div>
        )}
      </div>
      
    </div>
  );
}

export type { ActionItem, UrgencyLevel };
