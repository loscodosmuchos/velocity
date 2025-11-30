import { cn } from "@/lib/utils";

interface MiniGaugeProps {
  value: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple" | "auto";
  showValue?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  xs: { size: 32, stroke: 3, text: "text-[8px]", label: "text-[6px]" },
  sm: { size: 44, stroke: 4, text: "text-[10px]", label: "text-[7px]" },
  md: { size: 56, stroke: 5, text: "text-xs", label: "text-[8px]" },
  lg: { size: 72, stroke: 6, text: "text-sm", label: "text-[10px]" },
};

const colorPalette = {
  cyan: { stroke: "#22d3ee", glow: "#22d3ee" },
  emerald: { stroke: "#34d399", glow: "#34d399" },
  amber: { stroke: "#fbbf24", glow: "#fbbf24" },
  ruby: { stroke: "#f87171", glow: "#f87171" },
  purple: { stroke: "#a78bfa", glow: "#a78bfa" },
};

function getAutoColor(percentage: number): keyof typeof colorPalette {
  if (percentage >= 90) return "ruby";
  if (percentage >= 75) return "amber";
  if (percentage >= 50) return "cyan";
  return "emerald";
}

export function MiniGauge({
  value,
  max = 100,
  size = "sm",
  color = "auto",
  showValue = true,
  showLabel = false,
  label,
  animated = true,
  className,
}: MiniGaugeProps) {
  const config = sizeConfig[size];
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (config.size - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI * 0.75;
  const offset = circumference - (percentage / 100) * circumference;
  
  const effectiveColor = color === "auto" ? getAutoColor(percentage) : color;
  const colors = colorPalette[effectiveColor];

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div style={{ width: config.size, height: config.size * 0.85 }}>
        <svg 
          width={config.size} 
          height={config.size} 
          className="overflow-visible"
          style={{ transform: "rotate(135deg)" }}
        >
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="text-slate-700/50"
          />
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              filter: `drop-shadow(0 0 4px ${colors.glow})`,
              transition: animated ? "stroke-dashoffset 1s ease-out" : "none"
            }}
          />
        </svg>
        {showValue && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ paddingTop: config.size * 0.1 }}
          >
            <span className={cn("font-bold text-white tabular-nums", config.text)}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {showLabel && label && (
        <span className={cn("text-slate-400 uppercase tracking-wider mt-1", config.label)}>
          {label}
        </span>
      )}
    </div>
  );
}

interface LinearGaugeProps {
  value: number;
  max?: number;
  height?: number;
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple" | "auto";
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function LinearGauge({
  value,
  max = 100,
  height = 6,
  color = "auto",
  showValue = false,
  animated = true,
  className,
}: LinearGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const effectiveColor = color === "auto" ? getAutoColor(percentage) : color;
  const colors = colorPalette[effectiveColor];

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="w-full rounded-full overflow-hidden bg-slate-700/50"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${colors.stroke}88, ${colors.stroke})`,
            boxShadow: `0 0 8px ${colors.glow}`,
            transition: animated ? "width 1s ease-out" : "none"
          }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-400">{Math.round(percentage)}%</span>
          <span className="text-[10px] text-slate-500">{value}/{max}</span>
        </div>
      )}
    </div>
  );
}

interface SegmentedGaugeProps {
  value: number;
  segments?: number;
  max?: number;
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple" | "auto";
  className?: string;
}

export function SegmentedGauge({
  value,
  segments = 5,
  max = 100,
  color = "auto",
  className,
}: SegmentedGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const filledSegments = Math.ceil((percentage / 100) * segments);
  const effectiveColor = color === "auto" ? getAutoColor(percentage) : color;
  const colors = colorPalette[effectiveColor];

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: segments }).map((_, i) => {
        const isFilled = i < filledSegments;
        const isLast = i === filledSegments - 1;
        
        return (
          <div
            key={i}
            className="h-3 flex-1 rounded-sm transition-all"
            style={{
              backgroundColor: isFilled ? colors.stroke : "rgb(51 65 85 / 0.5)",
              opacity: isFilled ? (isLast ? 1 : 0.7) : 1,
              boxShadow: isFilled && isLast ? `0 0 6px ${colors.glow}` : undefined
            }}
          />
        );
      })}
    </div>
  );
}

interface StatusDotsProps {
  status: "healthy" | "warning" | "critical" | "inactive";
  pulseOnCritical?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusDot({
  status,
  pulseOnCritical = true,
  size = "sm",
  className,
}: StatusDotsProps) {
  const statusColors = {
    healthy: { bg: "bg-emerald-500", shadow: "shadow-emerald-500/50" },
    warning: { bg: "bg-amber-500", shadow: "shadow-amber-500/50" },
    critical: { bg: "bg-red-500", shadow: "shadow-red-500/50" },
    inactive: { bg: "bg-slate-500", shadow: "" },
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
  };

  const colors = statusColors[status];
  const shouldPulse = pulseOnCritical && status === "critical";

  return (
    <div
      className={cn(
        "rounded-full",
        sizes[size],
        colors.bg,
        shouldPulse && "animate-pulse",
        colors.shadow && `shadow-md ${colors.shadow}`,
        className
      )}
    />
  );
}
