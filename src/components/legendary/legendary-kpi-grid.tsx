import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type AccentColor = "emerald" | "amber" | "ruby" | "cyan" | "blue" | "slate";

interface KPIItem {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  highlight?: boolean;
  onClick?: () => void;
  accentColor?: AccentColor;
  clickable?: boolean;
}

interface LegendaryKPIGridProps {
  items: KPIItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

const accentStyles: Record<AccentColor, { bg: string; border: string; glow: string }> = {
  emerald: {
    bg: "bg-gradient-to-br from-emerald-600/20 to-emerald-800/10",
    border: "border-emerald-500/40 hover:border-emerald-400/60",
    glow: "shadow-emerald-500/10",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-600/20 to-amber-800/10",
    border: "border-amber-500/40 hover:border-amber-400/60",
    glow: "shadow-amber-500/10",
  },
  ruby: {
    bg: "bg-gradient-to-br from-red-600/20 to-red-800/10",
    border: "border-red-500/40 hover:border-red-400/60",
    glow: "shadow-red-500/10",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-600/20 to-cyan-800/10",
    border: "border-cyan-500/40 hover:border-cyan-400/60",
    glow: "shadow-cyan-500/10",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-600/20 to-blue-800/10",
    border: "border-blue-500/40 hover:border-blue-400/60",
    glow: "shadow-blue-500/10",
  },
  slate: {
    bg: "bg-slate-800/50",
    border: "border-slate-700/50 hover:border-slate-600/60",
    glow: "",
  },
};

export function LegendaryKPIGrid({ items, columns = 4 }: LegendaryKPIGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const Trend = item.trend ? TrendIcon[item.trend] : null;
        const accent = item.accentColor ? accentStyles[item.accentColor] : null;
        const isClickable = item.onClick || item.clickable;
        
        return (
          <div
            key={index}
            onClick={item.onClick}
            className={cn(
              "relative overflow-hidden rounded-lg p-4 transition-all",
              isClickable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
              !isClickable && "hover:scale-[1.01]",
              accent ? cn(accent.bg, accent.border, accent.glow, "border shadow-lg") :
              item.highlight
                ? "bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/40"
                : "bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {Icon && (
                    <Icon className={`h-4 w-4 ${item.iconColor || "text-blue-400"}`} />
                  )}
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {item.value}
                </div>
                {item.subtext && (
                  <div className="text-xs text-slate-500 mt-1">{item.subtext}</div>
                )}
              </div>
              {item.trend && Trend && (
                <div className={`flex items-center gap-1 ${trendColors[item.trend]}`}>
                  <Trend className="h-4 w-4" />
                  {item.trendValue && (
                    <span className="text-xs font-medium">{item.trendValue}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LegendaryKPIGrid;
