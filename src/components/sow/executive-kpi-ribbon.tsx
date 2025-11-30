import React from "react";
import { 
  Briefcase, 
  FileCheck, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export interface KPITrendData {
  value: number;
  timestamp?: string;
}

export interface ExecutiveKPIData {
  totalPortfolioValue: number;
  activeContractsCount: number;
  budgetBurnRate: number;
  riskScore: number;
  pendingApprovalsCount: number;
  avgDaysToClose: number;
  portfolioTrend?: KPITrendData[];
  burnRateTrend?: KPITrendData[];
  riskTrend?: KPITrendData[];
  closingTrend?: KPITrendData[];
  previousPeriod?: {
    totalPortfolioValue?: number;
    activeContractsCount?: number;
    budgetBurnRate?: number;
    riskScore?: number;
    pendingApprovalsCount?: number;
    avgDaysToClose?: number;
  };
}

export interface ExecutiveKPIRibbonProps {
  data?: ExecutiveKPIData;
  isLoading?: boolean;
  className?: string;
}

type TrendDirection = "up" | "down" | "neutral";
type StatusLevel = "healthy" | "caution" | "critical";

interface KPICardConfig {
  id: string;
  title: string;
  icon: React.ElementType;
  format: (value: number) => string;
  getStatus: (value: number) => StatusLevel;
  getTrend: (current: number, previous?: number) => TrendDirection;
  trendPositive: "up" | "down";
  subtitle?: string;
  showSparkline?: boolean;
}

const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "$0";
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatPercentage = (value: number): string => {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString();
};

const formatDays = (value: number): string => {
  if (!Number.isFinite(value)) return "0d";
  return `${value.toFixed(0)}d`;
};

const KPI_CONFIGS: KPICardConfig[] = [
  {
    id: "portfolio",
    title: "Total Portfolio Value",
    icon: Briefcase,
    format: formatCurrency,
    getStatus: () => "healthy",
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "up",
    subtitle: "All SOW contracts",
    showSparkline: true,
  },
  {
    id: "active",
    title: "Active Contracts",
    icon: FileCheck,
    format: formatNumber,
    getStatus: (value) => {
      if (value === 0) return "caution";
      return "healthy";
    },
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "up",
    subtitle: "In progress",
  },
  {
    id: "burnRate",
    title: "Budget Burn Rate",
    icon: Flame,
    format: formatPercentage,
    getStatus: (value) => {
      if (value >= 90) return "critical";
      if (value >= 75) return "caution";
      return "healthy";
    },
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "down",
    subtitle: "Invoiced / Total",
    showSparkline: true,
  },
  {
    id: "risk",
    title: "Risk Score",
    icon: AlertTriangle,
    format: formatNumber,
    getStatus: (value) => {
      if (value >= 5) return "critical";
      if (value >= 2) return "caution";
      return "healthy";
    },
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "down",
    subtitle: ">80% utilized or expiring soon",
    showSparkline: true,
  },
  {
    id: "approvals",
    title: "Pending Approvals",
    icon: Clock,
    format: formatNumber,
    getStatus: (value) => {
      if (value >= 10) return "critical";
      if (value >= 5) return "caution";
      return "healthy";
    },
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "down",
    subtitle: "Awaiting action",
  },
  {
    id: "daysToClose",
    title: "Avg Days to Close",
    icon: CalendarCheck,
    format: formatDays,
    getStatus: (value) => {
      if (value >= 60) return "critical";
      if (value >= 30) return "caution";
      return "healthy";
    },
    getTrend: (current, previous) => {
      if (!previous) return "neutral";
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "neutral";
    },
    trendPositive: "down",
    subtitle: "Contract lifecycle",
    showSparkline: true,
  },
];

const statusColors = {
  healthy: {
    bg: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    border: "border-emerald-500/30",
    accent: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    text: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    gauge: "stroke-emerald-500",
    sparkline: "#10b981",
  },
  caution: {
    bg: "from-amber-500/10 via-amber-500/5 to-transparent",
    border: "border-amber-500/30",
    accent: "bg-gradient-to-r from-amber-400 to-amber-500",
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    gauge: "stroke-amber-500",
    sparkline: "#f59e0b",
  },
  critical: {
    bg: "from-red-500/10 via-red-500/5 to-transparent",
    border: "border-red-500/30",
    accent: "bg-gradient-to-r from-red-400 to-red-500",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    gauge: "stroke-red-500",
    sparkline: "#ef4444",
  },
};

function TrendArrow({ 
  direction, 
  isPositive 
}: { 
  direction: TrendDirection; 
  isPositive: boolean;
}) {
  if (direction === "neutral") {
    return <Minus className="h-3 w-3 text-slate-500" />;
  }
  
  const isGood = (direction === "up" && isPositive) || (direction === "down" && !isPositive);
  
  if (direction === "up") {
    return (
      <TrendingUp 
        className={cn(
          "h-3.5 w-3.5",
          isGood ? "text-emerald-400" : "text-red-400"
        )} 
      />
    );
  }
  
  return (
    <TrendingDown 
      className={cn(
        "h-3.5 w-3.5",
        isGood ? "text-emerald-400" : "text-red-400"
      )} 
    />
  );
}

function MiniSparkline({ 
  data, 
  color,
  height = 32
}: { 
  data: KPITrendData[]; 
  color: string;
  height?: number;
}) {
  if (!data || data.length < 2) return null;
  
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#gradient-${color.replace('#', '')})`}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CircularGauge({ 
  value, 
  status,
  size = 40 
}: { 
  value: number; 
  status: StatusLevel;
  size?: number;
}) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  const colors = statusColors[status];
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-slate-700/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", colors.gauge)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
    </div>
  );
}

function KPICardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900 border border-slate-700/50 p-4">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-700/50" />
          <div className="h-3 w-24 rounded bg-slate-700/50" />
        </div>
        <div className="h-8 w-20 rounded bg-slate-700/50" />
        <div className="h-2 w-16 rounded bg-slate-700/30" />
      </div>
    </div>
  );
}

function KPICard({
  config,
  value,
  previousValue,
  trendData,
  isLoading,
}: {
  config: KPICardConfig;
  value?: number;
  previousValue?: number;
  trendData?: KPITrendData[];
  isLoading?: boolean;
}) {
  if (isLoading || value === undefined) {
    return <KPICardSkeleton />;
  }

  const Icon = config.icon;
  const status = config.getStatus(value);
  const trend = config.getTrend(value, previousValue);
  const colors = statusColors[status];
  const isPositiveTrend = config.trendPositive === "up";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-500",
        "bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900",
        "border border-slate-700/50 hover:border-slate-600/70",
        colors.glow,
        "hover:scale-[1.02]"
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        colors.bg
      )} />
      
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px]",
        colors.accent
      )} />
      
      <div 
        className="absolute inset-0 opacity-[0.02]"
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
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "p-2 rounded-lg bg-gradient-to-br from-slate-700/60 to-slate-800/60",
              "border border-slate-600/30"
            )}>
              <Icon className={cn("h-4 w-4", colors.text)} />
            </div>
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.1em] leading-tight max-w-[100px]",
              colors.text
            )}>
              {config.title}
            </span>
          </div>
          
          {config.id === "burnRate" && (
            <CircularGauge value={value} status={status} size={36} />
          )}
          
          {config.showSparkline && trendData && trendData.length >= 2 && config.id !== "burnRate" && (
            <MiniSparkline data={trendData} color={colors.sparkline} />
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-white tracking-tight">
            {config.format(value)}
          </span>
          <div className="flex items-center gap-1">
            <TrendArrow direction={trend} isPositive={isPositiveTrend} />
          </div>
        </div>
        
        {config.subtitle && (
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">
            {config.subtitle}
          </p>
        )}
        
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[1px]",
          "bg-gradient-to-r from-transparent via-slate-600/30 to-transparent"
        )} />
      </div>
    </div>
  );
}

const KPI_TOOLTIPS: Record<string, { title: string; description: string; action: string; persona: string }> = {
  portfolio: {
    title: "Total Portfolio Value",
    description: "Sum of all active SOW contract values. Tracks your overall procurement spend commitment.",
    action: "Click to view detailed SOW breakdown by vendor",
    persona: "CPO: Monitor total contractual exposure"
  },
  active: {
    title: "Active Contracts",
    description: "Number of SOWs currently in execution phase. Active contracts require ongoing management.",
    action: "Review contracts nearing expiration",
    persona: "VMS: Track contractor utilization"
  },
  burn: {
    title: "Budget Burn Rate",
    description: "Percentage of total portfolio value that has been invoiced. Higher rates indicate contracts nearing completion.",
    action: "Flag contracts >80% for renewal planning",
    persona: "Finance: Monitor cash flow projections"
  },
  risk: {
    title: "High Risk SOWs",
    description: "Count of contracts with >80% budget utilized OR expiring within 30 days. These need immediate attention.",
    action: "Prioritize risk mitigation actions",
    persona: "PM: Address blockers before escalation"
  },
  pending: {
    title: "Pending Approvals",
    description: "SOWs awaiting review or approval. Delays here slow down project velocity.",
    action: "Process approvals to unblock projects",
    persona: "PM: Clear bottlenecks quickly"
  },
  days: {
    title: "Avg Days to Close",
    description: "Average time from SOW draft to paid status. Shorter cycles = faster project delivery.",
    action: "Identify process improvements",
    persona: "Ops: Optimize procurement lifecycle"
  }
};

export function ExecutiveKPIRibbon({
  data,
  isLoading = false,
  className,
}: ExecutiveKPIRibbonProps) {
  const safeNum = (v: number | undefined): number => Number.isFinite(v) ? (v as number) : 0;
  
  const portfolioVal = safeNum(data?.totalPortfolioValue);
  const activeCount = safeNum(data?.activeContractsCount);
  const burnRate = safeNum(data?.budgetBurnRate);
  const riskScore = safeNum(data?.riskScore);
  const pendingCount = safeNum(data?.pendingApprovalsCount);
  const avgDays = safeNum(data?.avgDaysToClose);
  
  const metrics = [
    { id: "portfolio", label: "Portfolio", value: formatCurrency(portfolioVal), color: "text-cyan-400" },
    { id: "active", label: "Active", value: activeCount.toString(), color: "text-emerald-400" },
    { id: "burn", label: "Burn", value: formatPercentage(burnRate), color: burnRate > 75 ? "text-amber-400" : "text-emerald-400" },
    { id: "risk", label: "Risk", value: riskScore.toString(), color: riskScore > 3 ? "text-red-400" : "text-emerald-400" },
    { id: "pending", label: "Pending", value: pendingCount.toString(), color: "text-purple-400" },
    { id: "days", label: "Days", value: formatDays(avgDays), color: "text-slate-400" },
  ];

  return (
    <TooltipProvider>
      <div className={cn("w-full", className)}>
        <div className="flex items-center gap-4 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
          {metrics.map((m) => {
            const tooltip = KPI_TOOLTIPS[m.id];
            return (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 cursor-help hover:bg-slate-800/50 px-2 py-1 rounded transition-colors">
                    <span className="text-[10px] text-slate-500 uppercase">{m.label}</span>
                    <span className={cn("text-sm font-bold font-mono", m.color)}>{m.value}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700 p-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-cyan-400 text-sm">{tooltip.title}</p>
                    <p className="text-xs text-slate-300">{tooltip.description}</p>
                    <div className="pt-1 border-t border-slate-700">
                      <p className="text-[10px] text-emerald-400">→ {tooltip.action}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{tooltip.persona}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-slate-500 ml-auto" />}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default ExecutiveKPIRibbon;
