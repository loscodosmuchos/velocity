import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SparklineChart, MiniBarChart } from "@/components/charts/sparkline-chart";
import { MiniGauge, LinearGauge, SegmentedGauge, StatusDot } from "@/components/charts/mini-gauge";

interface PremiumKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: "sapphire" | "emerald" | "amber" | "ruby" | "platinum";
  utilization?: number;
  sparklineData?: number[];
  miniBarData?: number[];
  onClick?: () => void;
  className?: string;
}

const accentColors = {
  sapphire: {
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    border: "border-blue-500/30",
    accent: "from-blue-500 to-blue-600",
    text: "text-blue-400",
    icon: "text-blue-400",
    gauge: "stroke-blue-500",
    bg: "from-blue-500/5 via-transparent to-transparent",
  },
  emerald: {
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    border: "border-emerald-500/30",
    accent: "from-emerald-500 to-emerald-600",
    text: "text-emerald-400",
    icon: "text-emerald-400",
    gauge: "stroke-emerald-500",
    bg: "from-emerald-500/5 via-transparent to-transparent",
  },
  amber: {
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    border: "border-amber-500/30",
    accent: "from-amber-500 to-amber-600",
    text: "text-amber-400",
    icon: "text-amber-400",
    gauge: "stroke-amber-500",
    bg: "from-amber-500/5 via-transparent to-transparent",
  },
  ruby: {
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    border: "border-red-500/30",
    accent: "from-red-500 to-red-600",
    text: "text-red-400",
    icon: "text-red-400",
    gauge: "stroke-red-500",
    bg: "from-red-500/5 via-transparent to-transparent",
  },
  platinum: {
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.1)]",
    border: "border-slate-400/20",
    accent: "from-slate-400 to-slate-500",
    text: "text-slate-300",
    icon: "text-slate-400",
    gauge: "stroke-slate-400",
    bg: "from-slate-400/5 via-transparent to-transparent",
  },
};

function CircularGauge({ value, color, size = 48 }: { value: number; color: string; size?: number }) {
  const safeValue = isNaN(value) ? 0 : Math.min(100, Math.max(0, value));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-slate-700/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", color)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white/90">{Math.round(safeValue)}%</span>
      </div>
    </div>
  );
}

const sparklineColorMap: Record<string, "cyan" | "emerald" | "amber" | "ruby" | "purple"> = {
  sapphire: "cyan",
  emerald: "emerald",
  amber: "amber",
  ruby: "ruby",
  platinum: "purple",
};

export function PremiumKPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accentColor = "sapphire",
  utilization,
  sparklineData,
  miniBarData,
  onClick,
  className,
}: PremiumKPICardProps) {
  const colors = accentColors[accentColor];
  const sparkColor = sparklineColorMap[accentColor] || "cyan";
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500",
        "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        "border border-slate-700/50",
        "hover:scale-[1.02] hover:border-slate-600/50",
        colors.glow,
        className
      )}
    >
      {/* Ambient glow effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        colors.bg
      )} />
      
      {/* Precision line accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r",
        colors.accent
      )} />
      
      {/* Carbon fiber texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
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
      
      <div className="relative p-5">
        {/* Header - Grid layout for proper spacing */}
        <div className="grid grid-cols-[1fr_auto] items-start gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 shrink-0",
              "border border-slate-600/30"
            )}>
              <Icon className={cn("h-4 w-4", colors.icon)} />
            </div>
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.12em] leading-tight",
              colors.text
            )} style={{ wordBreak: 'keep-all' }}>
              {title}
            </span>
          </div>
          
          {utilization !== undefined && (
            <CircularGauge value={utilization} color={colors.gauge} size={44} />
          )}
          
          {sparklineData && sparklineData.length > 1 && !utilization && (
            <SparklineChart 
              data={sparklineData} 
              color={sparkColor}
              width={70}
              height={32}
              showArea={true}
            />
          )}
          
          {miniBarData && miniBarData.length > 0 && !utilization && !sparklineData && (
            <MiniBarChart
              data={miniBarData}
              color={sparkColor}
              width={56}
              height={28}
            />
          )}
        </div>
        
        {/* Value with optional trend */}
        <div className="mb-1 flex items-end gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <div className={cn("flex items-center gap-0.5 pb-1", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trendValue && (
                <span className="text-xs font-medium">{trendValue}</span>
              )}
            </div>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
        
        {/* Bottom accent line */}
        <div className={cn(
          "absolute bottom-0 left-0 h-[1px] w-full",
          "bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"
        )} />
      </div>
    </div>
  );
}

interface PremiumMetricRowProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  progress?: number;
  sparklineData?: number[];
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  showSegments?: boolean;
  segments?: number;
  accentColor?: "sapphire" | "emerald" | "amber" | "ruby" | "platinum";
  status?: "healthy" | "warning" | "critical";
  onClick?: () => void;
}

export function PremiumMetricRow({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
  sparklineData,
  trend,
  trendValue,
  showSegments = false,
  segments = 5,
  accentColor = "platinum",
  status,
  onClick,
}: PremiumMetricRowProps) {
  const colors = accentColors[accentColor];
  const sparkColor = sparklineColorMap[accentColor] || "cyan";
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400";
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300",
        "bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95",
        "border border-slate-700/40 hover:border-slate-600/60",
        "hover:shadow-lg"
      )}
    >
      {/* Subtle top accent */}
      <div className={cn(
        "absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r",
        "from-transparent via-slate-500/20 to-transparent"
      )} />
      
      <div className="relative p-4 flex items-center gap-4">
        {/* Icon container with optional status indicator */}
        <div className="relative">
          <div className={cn(
            "p-2.5 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/60",
            "border border-slate-600/20"
          )}>
            <Icon className={cn("h-4 w-4", colors.icon)} />
          </div>
          {status && (
            <StatusDot 
              status={status} 
              size="sm" 
              className="absolute -top-0.5 -right-0.5"
            />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {title}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{value}</span>
            {subtitle && (
              <span className="text-xs text-slate-500">{subtitle}</span>
            )}
            {trend && (
              <div className={cn("flex items-center gap-0.5", trendColor)}>
                <TrendIcon className="h-3 w-3" />
                {trendValue && (
                  <span className="text-[10px] font-medium">{trendValue}</span>
                )}
              </div>
            )}
          </div>
          
          {/* Progress bar - enhanced with glow */}
          {progress !== undefined && !showSegments && (
            <div className="mt-2">
              <LinearGauge 
                value={progress} 
                height={4}
                color={progress > 90 ? "ruby" : progress > 75 ? "amber" : sparkColor}
              />
            </div>
          )}
          
          {/* Segmented gauge alternative */}
          {showSegments && progress !== undefined && (
            <div className="mt-2">
              <SegmentedGauge 
                value={progress} 
                segments={segments}
                color={progress > 90 ? "ruby" : progress > 75 ? "amber" : "auto"}
              />
            </div>
          )}
        </div>
        
        {/* Sparkline on right side */}
        {sparklineData && sparklineData.length > 1 && (
          <SparklineChart 
            data={sparklineData}
            color={sparkColor}
            width={60}
            height={28}
            showArea={true}
          />
        )}
      </div>
    </div>
  );
}

export function PremiumKPIGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full",
      className
    )} style={{ maxWidth: '100%' }}>
      {children}
    </div>
  );
}

export function PremiumSecondaryGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "grid md:grid-cols-2 lg:grid-cols-4 gap-3",
      className
    )}>
      {children}
    </div>
  );
}
