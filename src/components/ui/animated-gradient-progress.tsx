import * as React from "react";
import { cn } from "@/lib/utils";

export type ProgressVariant = 
  | "standard"
  | "pulse"
  | "flow"
  | "shimmer"
  | "arrows"
  | "neon"
  | "glass"
  | "metallic"
  | "carbon"
  | "holographic"
  | "plasma"
  | "circuit";

export type ProgressTheme = "utilization" | "health" | "warning" | "info" | "success";

interface AnimatedGradientProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  theme?: ProgressTheme;
  height?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const themeGradients: Record<ProgressTheme, string> = {
  utilization: "linear-gradient(90deg, #10b981 0%, #10b981 50%, #f59e0b 75%, #ef4444 90%, #b91c1c 100%)",
  health: "linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)",
  warning: "linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)",
  info: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
  success: "linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
};

const heightClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
  xl: "h-6",
};

export function AnimatedGradientProgress({
  value,
  max = 100,
  variant = "standard",
  theme = "utilization",
  height = "md",
  showLabel = false,
  label,
  className,
}: AnimatedGradientProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const baseGradient = themeGradients[theme];

  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: `${percentage}%`,
      background: baseGradient,
    };

    switch (variant) {
      case "glass":
        return {
          ...base,
          background: `${baseGradient}`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)",
        };
      case "metallic":
        return {
          ...base,
          background: `linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.25) 100%), ${baseGradient}`,
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)",
        };
      case "carbon":
        return {
          ...base,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px), ${baseGradient}`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
        };
      case "neon":
        return {
          ...base,
          boxShadow: percentage > 85 
            ? "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(255,255,255,0.2)"
            : percentage > 70
              ? "0 0 20px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(255,255,255,0.2)"
              : "0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(255,255,255,0.2)",
        };
      case "holographic":
        return {
          ...base,
          background: `linear-gradient(90deg, 
            #10b981 0%, #06b6d4 20%, #8b5cf6 40%, #ec4899 60%, #f59e0b 80%, #10b981 100%)`,
          backgroundSize: "200% 100%",
          animation: "holographic-shift 3s ease-in-out infinite",
        };
      case "plasma":
        return {
          ...base,
          background: `radial-gradient(ellipse at 30% 50%, rgba(139, 92, 246, 0.8) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.8) 0%, transparent 50%),
                       ${baseGradient}`,
          animation: "plasma-flow 2s ease-in-out infinite alternate",
        };
      default:
        return base;
    }
  };

  const getOverlayElement = () => {
    switch (variant) {
      case "pulse":
        return (
          <div 
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{ 
              width: `${percentage}%`,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
        );
      case "flow":
        return (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div 
              className="absolute inset-0 animate-flow-packets"
              style={{
                background: "repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 30px, transparent 30px, transparent 50px)",
                backgroundSize: "50px 100%",
              }}
            />
          </div>
        );
      case "shimmer":
        return (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div 
              className="absolute inset-0 animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        );
      case "arrows":
        return (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div 
              className="absolute inset-0 animate-arrows-flow"
              style={{
                background: `repeating-linear-gradient(
                  -60deg,
                  transparent 0px,
                  transparent 8px,
                  rgba(255,255,255,0.15) 8px,
                  rgba(255,255,255,0.15) 16px
                )`,
                backgroundSize: "24px 100%",
              }}
            />
          </div>
        );
      case "circuit":
        return (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div 
              className="absolute inset-0 animate-circuit-pulse"
              style={{
                background: `
                  radial-gradient(circle at 10% 50%, rgba(255,255,255,0.6) 0%, transparent 8%),
                  radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 6%),
                  radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 8%),
                  radial-gradient(circle at 70% 50%, rgba(255,255,255,0.4) 0%, transparent 6%),
                  radial-gradient(circle at 90% 50%, rgba(255,255,255,0.6) 0%, transparent 8%)
                `,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-mono text-slate-300">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn(
        "relative w-full rounded-full overflow-hidden",
        heightClasses[height],
        "bg-slate-800/80 shadow-inner"
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variant === "holographic" && "animate-holographic",
          )}
          style={getVariantStyles()}
        />
        {getOverlayElement()}
        {/* Premium gloss overlay */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default AnimatedGradientProgress;
