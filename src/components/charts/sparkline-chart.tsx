import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple" | "blue";
  showArea?: boolean;
  showDots?: boolean;
  animated?: boolean;
  className?: string;
}

const colorPalette = {
  cyan: { stroke: "#22d3ee", fill: "rgba(34, 211, 238, 0.15)", glow: "drop-shadow(0 0 4px #22d3ee)" },
  emerald: { stroke: "#34d399", fill: "rgba(52, 211, 153, 0.15)", glow: "drop-shadow(0 0 4px #34d399)" },
  amber: { stroke: "#fbbf24", fill: "rgba(251, 191, 36, 0.15)", glow: "drop-shadow(0 0 4px #fbbf24)" },
  ruby: { stroke: "#f87171", fill: "rgba(248, 113, 113, 0.15)", glow: "drop-shadow(0 0 4px #f87171)" },
  purple: { stroke: "#a78bfa", fill: "rgba(167, 139, 250, 0.15)", glow: "drop-shadow(0 0 4px #a78bfa)" },
  blue: { stroke: "#60a5fa", fill: "rgba(96, 165, 250, 0.15)", glow: "drop-shadow(0 0 4px #60a5fa)" },
};

export function SparklineChart({
  data,
  width = 80,
  height = 32,
  color = "cyan",
  showArea = true,
  showDots = false,
  animated = true,
  className,
}: SparklineChartProps) {
  const colors = colorPalette[color];
  
  const { path, areaPath, points } = useMemo(() => {
    if (!data || data.length < 2) {
      return { path: "", areaPath: "", points: [] };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const pts = data.map((value, index) => ({
      x: padding + (index / (data.length - 1)) * effectiveWidth,
      y: padding + effectiveHeight - ((value - min) / range) * effectiveHeight,
    }));

    const pathD = pts.map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(" ");
    
    const areaD = pts.length > 0
      ? `${pathD} L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${height - padding} Z`
      : "";

    return { path: pathD, areaPath: areaD, points: pts };
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return (
      <div 
        className={cn("flex items-center justify-center text-slate-600 text-xs", className)}
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const trend = data[data.length - 1] > data[0] ? "up" : data[data.length - 1] < data[0] ? "down" : "flat";

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        {showArea && (
          <path
            d={areaPath}
            fill={colors.fill}
            className={animated ? "animate-fade-in" : ""}
          />
        )}
        <path
          d={path}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: colors.glow }}
          className={animated ? "animate-draw-line" : ""}
        />
        {showDots && points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={i === points.length - 1 ? 3 : 2}
            fill={i === points.length - 1 ? colors.stroke : "transparent"}
            stroke={colors.stroke}
            strokeWidth={1}
            className={animated ? "animate-scale-in" : ""}
            style={{ 
              animationDelay: `${i * 50}ms`,
              filter: i === points.length - 1 ? colors.glow : undefined
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface MiniBarChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple" | "blue";
  className?: string;
}

export function MiniBarChart({
  data,
  width = 60,
  height = 24,
  color = "cyan",
  className,
}: MiniBarChartProps) {
  const colors = colorPalette[color];
  
  const bars = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const max = Math.max(...data);
    const barWidth = (width - (data.length - 1) * 2) / data.length;
    
    return data.map((value, index) => ({
      x: index * (barWidth + 2),
      height: max > 0 ? (value / max) * (height - 4) : 0,
      value,
    }));
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <div className={cn("text-slate-600 text-xs", className)}>No data</div>;
  }

  return (
    <svg width={width} height={height} className={cn("overflow-visible", className)}>
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={height - bar.height - 2}
          width={(width - (data.length - 1) * 2) / data.length}
          height={bar.height}
          rx={1}
          fill={colors.stroke}
          opacity={0.3 + (i / data.length) * 0.7}
          style={{ filter: i === bars.length - 1 ? colors.glow : undefined }}
        />
      ))}
    </svg>
  );
}

interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export function TrendIndicator({
  value,
  previousValue,
  size = "sm",
  showPercentage = true,
  className,
}: TrendIndicatorProps) {
  const change = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 0.1;
  
  const sizes = {
    sm: { text: "text-[10px]", icon: "w-3 h-3" },
    md: { text: "text-xs", icon: "w-4 h-4" },
    lg: { text: "text-sm", icon: "w-5 h-5" },
  };

  const color = isNeutral ? "text-slate-400" : isPositive ? "text-emerald-400" : "text-red-400";

  return (
    <div className={cn("flex items-center gap-0.5", sizes[size].text, color, className)}>
      <svg 
        className={sizes[size].icon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2}
      >
        {isNeutral ? (
          <path d="M5 12h14" />
        ) : isPositive ? (
          <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
        ) : (
          <path d="M12 5v14m0 0l7-7m-7 7l-7-7" />
        )}
      </svg>
      {showPercentage && (
        <span className="font-medium tabular-nums">
          {isNeutral ? "0%" : `${isPositive ? "+" : ""}${change.toFixed(1)}%`}
        </span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "cyan" | "emerald" | "amber" | "ruby" | "purple";
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 40,
  strokeWidth = 3,
  color = "cyan",
  showValue = true,
  className,
}: CircularProgressProps) {
  const colors = colorPalette[color];
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ 
            filter: colors.glow,
            transition: "stroke-dashoffset 1s ease-out"
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white tabular-nums">
            {Math.round(percentage)}
          </span>
        </div>
      )}
    </div>
  );
}

interface ProgressRingProps {
  segments: { value: number; color: string; label?: string }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  segments,
  size = 60,
  strokeWidth = 6,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  
  let currentOffset = 0;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
        {segments.map((segment, i) => {
          const segmentLength = (segment.value / total) * circumference;
          const segmentOffset = currentOffset;
          currentOffset += segmentLength;
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-segmentOffset}
              strokeLinecap="round"
              style={{ transition: "all 1s ease-out" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
