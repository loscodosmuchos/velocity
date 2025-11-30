import React, { useState, useMemo } from "react";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Mail,
  Bell,
  UserPlus,
  FileText,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  ArrowRight,
  Flame,
  Shield,
  Activity,
  BarChart3,
  LineChart,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { StatementOfWork } from "@/types";

export type QuickActionType = "draft-email" | "set-alert" | "add-stakeholder" | "export-brief";

export interface AIDecisionCockpitProps {
  sowData: StatementOfWork[];
  onAction: (actionType: QuickActionType, context?: Record<string, unknown>) => void;
  className?: string;
}

interface BudgetAnomaly {
  sowId: number;
  sowNumber: string;
  type: "burning-fast" | "burning-slow" | "at-risk" | "opportunity";
  severity: "critical" | "warning" | "info";
  message: string;
  currentBurnRate: number;
  expectedBurnRate: number;
  projectedEndDate: string;
  daysRemaining: number;
  utilizationPercent: number;
}

interface RiskFlag {
  id: string;
  sowId: number;
  sowNumber: string;
  category: "budget" | "timeline" | "utilization" | "compliance";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
}

interface NextBestMove {
  id: string;
  priority: number;
  actionType: QuickActionType | "review" | "escalate";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  sowIds?: number[];
  context?: Record<string, unknown>;
}

interface ForecastData {
  totalBudget: number;
  currentSpend: number;
  projectedSpend: number;
  variance: number;
  confidenceLevel: number;
  trend: "under" | "on-track" | "over";
}

const severityConfig = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300 border-red-500/40",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.2)]",
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    glow: "shadow-[0_0_12px_rgba(249,115,22,0.2)]",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.2)]",
  },
  medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glow: "",
  },
  info: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    glow: "",
  },
  low: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    glow: "",
  },
};

const impactConfig = {
  high: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/40" },
  medium: { bg: "bg-cyan-500/20", text: "text-cyan-300", border: "border-cyan-500/40" },
  low: { bg: "bg-slate-500/20", text: "text-slate-300", border: "border-slate-500/40" },
};

function analyzeSOWData(sows: StatementOfWork[]): {
  anomalies: BudgetAnomaly[];
  riskFlags: RiskFlag[];
  nextBestMoves: NextBestMove[];
  forecast: ForecastData;
} {
  const anomalies: BudgetAnomaly[] = [];
  const riskFlags: RiskFlag[] = [];
  const nextBestMoves: NextBestMove[] = [];

  // Helper to safely get numeric values (handles snake_case from API)
  const getTotal = (s: StatementOfWork) => Number(s.totalValue) || Number((s as any).total_value) || 0;
  const getInvoiced = (s: StatementOfWork) => Number(s.invoicedAmount) || Number((s as any).invoiced_amount) || 0;
  const getStartDate = (s: StatementOfWork) => s.startDate || (s as any).start_date;
  const getEndDate = (s: StatementOfWork) => s.endDate || (s as any).end_date;
  const getSowNumber = (s: StatementOfWork) => s.sowNumber || (s as any).sow_number || `SOW-${s.id}`;

  const totalBudget = sows.reduce((sum, s) => sum + getTotal(s), 0);
  const totalInvoiced = sows.reduce((sum, s) => sum + getInvoiced(s), 0);

  sows.forEach((sow) => {
    const total = getTotal(sow);
    const invoiced = getInvoiced(sow);
    const utilizationPercent = total > 0 ? (invoiced / total) * 100 : 0;
    
    const startDate = new Date(getStartDate(sow));
    const endDate = new Date(getEndDate(sow));
    const today = new Date();
    const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    const expectedUtilization = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
    const burnRateDiff = utilizationPercent - expectedUtilization;

    const sowNum = getSowNumber(sow);
    
    if (burnRateDiff > 20 && utilizationPercent > 80) {
      anomalies.push({
        sowId: sow.id,
        sowNumber: sowNum,
        type: "burning-fast",
        severity: "critical",
        message: `Burning ${burnRateDiff.toFixed(0)}% faster than expected`,
        currentBurnRate: utilizationPercent,
        expectedBurnRate: expectedUtilization,
        projectedEndDate: new Date(today.getTime() + (daysRemaining * 0.7) * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining,
        utilizationPercent,
      });

      riskFlags.push({
        id: `risk-${sow.id}-budget`,
        sowId: sow.id,
        sowNumber: sowNum,
        category: "budget",
        severity: "critical",
        title: "Budget Overrun Imminent",
        description: `SOW ${sowNum} is at ${utilizationPercent.toFixed(0)}% utilization with ${daysRemaining} days remaining`,
        recommendation: "Consider requesting a change order or reallocating resources",
      });
    } else if (burnRateDiff > 15) {
      anomalies.push({
        sowId: sow.id,
        sowNumber: sowNum,
        type: "at-risk",
        severity: "warning",
        message: `Trending ${burnRateDiff.toFixed(0)}% over expected rate`,
        currentBurnRate: utilizationPercent,
        expectedBurnRate: expectedUtilization,
        projectedEndDate: new Date(today.getTime() + (daysRemaining * 0.85) * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining,
        utilizationPercent,
      });
    } else if (burnRateDiff < -25 && elapsedDays > 30) {
      anomalies.push({
        sowId: sow.id,
        sowNumber: sowNum,
        type: "burning-slow",
        severity: "info",
        message: `${Math.abs(burnRateDiff).toFixed(0)}% under expected utilization`,
        currentBurnRate: utilizationPercent,
        expectedBurnRate: expectedUtilization,
        projectedEndDate: endDate.toISOString(),
        daysRemaining,
        utilizationPercent,
      });

      riskFlags.push({
        id: `risk-${sow.id}-underutil`,
        sowId: sow.id,
        sowNumber: sowNum,
        category: "utilization",
        severity: "medium",
        title: "Under-Utilization Detected",
        description: `Only ${utilizationPercent.toFixed(0)}% utilized with ${((elapsedDays / totalDays) * 100).toFixed(0)}% of timeline elapsed`,
        recommendation: "Review scope delivery and consider reallocating unused budget",
      });
    }

    const sowStatus = (sow.status || "").toLowerCase();
    if (daysRemaining <= 14 && daysRemaining > 0 && sowStatus === "active") {
      riskFlags.push({
        id: `risk-${sow.id}-timeline`,
        sowId: sow.id,
        sowNumber: sowNum,
        category: "timeline",
        severity: daysRemaining <= 7 ? "high" : "medium",
        title: "Contract Expiring Soon",
        description: `SOW ${sowNum} expires in ${daysRemaining} days`,
        recommendation: "Initiate renewal discussions or close-out procedures",
      });
    }

    if (utilizationPercent >= 90 && sowStatus === "active") {
      riskFlags.push({
        id: `risk-${sow.id}-threshold`,
        sowId: sow.id,
        sowNumber: sowNum,
        category: "budget",
        severity: "high",
        title: "Budget Threshold Reached",
        description: `${utilizationPercent.toFixed(0)}% of budget consumed`,
        recommendation: "Evaluate remaining deliverables and prepare change order if needed",
      });
    }
  });

  const criticalSOWs = anomalies.filter(a => a.severity === "critical").length;
  const atRiskSOWs = anomalies.filter(a => a.severity === "warning").length;
  const underutilizedSOWs = anomalies.filter(a => a.type === "burning-slow").length;
  const expiringSOWs = riskFlags.filter(r => r.category === "timeline").length;

  if (criticalSOWs > 0) {
    nextBestMoves.push({
      id: "nbm-1",
      priority: 1,
      actionType: "draft-email",
      title: "Alert Stakeholders on Critical SOWs",
      description: `${criticalSOWs} SOW${criticalSOWs > 1 ? "s" : ""} require immediate attention due to budget overrun risk`,
      impact: "high",
      sowIds: anomalies.filter(a => a.severity === "critical").map(a => a.sowId),
    });
  }

  if (expiringSOWs > 0) {
    nextBestMoves.push({
      id: "nbm-2",
      priority: 2,
      actionType: "set-alert",
      title: "Set Renewal Reminders",
      description: `${expiringSOWs} contract${expiringSOWs > 1 ? "s" : ""} expiring within 14 days`,
      impact: "high",
    });
  }

  if (underutilizedSOWs > 0) {
    nextBestMoves.push({
      id: "nbm-3",
      priority: 3,
      actionType: "review",
      title: "Review Under-Utilized Contracts",
      description: `${underutilizedSOWs} SOW${underutilizedSOWs > 1 ? "s" : ""} significantly below expected utilization`,
      impact: "medium",
      sowIds: anomalies.filter(a => a.type === "burning-slow").map(a => a.sowId),
    });
  }

  if (atRiskSOWs > 0) {
    nextBestMoves.push({
      id: "nbm-4",
      priority: 4,
      actionType: "add-stakeholder",
      title: "Expand Visibility on At-Risk SOWs",
      description: `Add finance stakeholders to monitor ${atRiskSOWs} trending over budget`,
      impact: "medium",
    });
  }

  // Always add actionable next moves for better UX
  // Handle case-insensitive status comparisons for data consistency
  const activeSOWs = sows.filter(s => s.status?.toLowerCase() === "active");
  const draftSOWs = sows.filter(s => s.status?.toLowerCase() === "draft");
  
  // Add more context-aware next moves
  if (activeSOWs.length > 0 && nextBestMoves.length < 3) {
    const highValueSOWs = activeSOWs.filter(s => (s.totalValue || 0) > 200000);
    if (highValueSOWs.length > 0) {
      nextBestMoves.push({
        id: "nbm-hv",
        priority: nextBestMoves.length + 1,
        actionType: "review",
        title: `Monitor ${highValueSOWs.length} High-Value Contract${highValueSOWs.length > 1 ? 's' : ''}`,
        description: `${highValueSOWs.length} active SOW${highValueSOWs.length > 1 ? 's' : ''} with value > $200K require close tracking`,
        impact: "high",
        sowIds: highValueSOWs.map(s => s.id),
      });
    }
  }
  
  if (draftSOWs.length > 0) {
    nextBestMoves.push({
      id: "nbm-draft",
      priority: nextBestMoves.length + 1,
      actionType: "review",
      title: `Finalize ${draftSOWs.length} Draft SOW${draftSOWs.length > 1 ? 's' : ''}`,
      description: "Move draft contracts to review phase to begin work",
      impact: "medium",
      sowIds: draftSOWs.map(s => s.id),
    });
  }
  
  // Portfolio optimization suggestion
  if (activeSOWs.length >= 3) {
    nextBestMoves.push({
      id: "nbm-optimize",
      priority: nextBestMoves.length + 1,
      actionType: "add-stakeholder",
      title: "Optimize Resource Allocation",
      description: `Review contractor assignments across ${activeSOWs.length} active projects`,
      impact: "medium",
    });
  }

  nextBestMoves.push({
    id: "nbm-5",
    priority: nextBestMoves.length + 1,
    actionType: "export-brief",
    title: "Generate Executive Summary",
    description: "Create portfolio health report for leadership review",
    impact: "low",
  });

  const avgUtilization = sows.length > 0 
    ? sows.reduce((sum, s) => sum + (s.totalValue > 0 ? (s.invoicedAmount / s.totalValue) * 100 : 0), 0) / sows.length
    : 0;
    
  // Add informational risks for visibility even when healthy
  if (riskFlags.length === 0 && sows.length > 0) {
    // Show portfolio status as info
    riskFlags.push({
      id: "info-portfolio",
      sowId: 0,
      sowNumber: "Portfolio",
      category: "compliance",
      severity: "low",
      title: `${activeSOWs.length} Active / ${sows.length} Total SOWs`,
      description: `Portfolio utilization at ${avgUtilization.toFixed(0)}% average across all contracts`,
      recommendation: "Continue monitoring for optimal resource allocation",
    });
    
    // Highlight top performer
    const topSOW = [...sows].sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))[0];
    if (topSOW) {
      const topUtil = topSOW.totalValue > 0 ? ((topSOW.invoicedAmount || 0) / topSOW.totalValue) * 100 : 0;
      riskFlags.push({
        id: "info-top",
        sowId: topSOW.id,
        sowNumber: topSOW.sowNumber || `SOW-${topSOW.id}`,
        category: "budget",
        severity: "low",
        title: `Largest: $${((topSOW.totalValue || 0) / 1000).toFixed(0)}K`,
        description: `${topUtil.toFixed(0)}% utilized - ${topSOW.status} status`,
        recommendation: "Key contract - maintain close visibility",
      });
    }
  }

  const projectedSpend = totalInvoiced + (totalBudget - totalInvoiced) * 0.85;
  
  const forecast: ForecastData = {
    totalBudget,
    currentSpend: totalInvoiced,
    projectedSpend,
    variance: projectedSpend - totalBudget,
    confidenceLevel: 78,
    trend: projectedSpend > totalBudget * 1.05 ? "over" : projectedSpend < totalBudget * 0.95 ? "under" : "on-track",
  };

  return {
    anomalies: anomalies.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    riskFlags: riskFlags.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    nextBestMoves: nextBestMoves.sort((a, b) => a.priority - b.priority).slice(0, 5),
    forecast,
  };
}

function InsightCard({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-slate-800 bg-slate-900/80 overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-800/50 transition-colors py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", iconColor)} />
                <span className="text-sm font-semibold text-slate-200">{title}</span>
                {badge}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 px-3 pb-2">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function ForecastCone({ forecast }: { forecast: ForecastData }) {
  const safeTotal = Number.isFinite(forecast.totalBudget) ? forecast.totalBudget : 0;
  const safeSpend = Number.isFinite(forecast.currentSpend) ? forecast.currentSpend : 0;
  const safeVariance = Number.isFinite(forecast.variance) ? forecast.variance : 0;
  
  const utilizationPercent = safeTotal > 0 ? (safeSpend / safeTotal) * 100 : 0;

  const trendConfig = {
    under: { color: "text-emerald-400", label: "Under" },
    "on-track": { color: "text-cyan-400", label: "Track" },
    over: { color: "text-amber-400", label: "Over" },
  };
  const config = trendConfig[forecast.trend] || trendConfig["on-track"];

  const formatMoney = (value: number) => {
    if (!Number.isFinite(value) || isNaN(value)) return "$0";
    const absValue = Math.abs(value);
    if (absValue >= 1000000) return `$${(absValue / 1000000).toFixed(1)}M`;
    if (absValue >= 1000) return `$${(absValue / 1000).toFixed(0)}K`;
    return `$${absValue.toFixed(0)}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className={cn("text-3xl font-black", config.color)}>{utilizationPercent.toFixed(0)}%</span>
        <span className="text-sm text-slate-400">{formatMoney(safeSpend)} / {formatMoney(safeTotal)}</span>
      </div>
      {/* Premium gradient progress bar - green to yellow to red based on utilization */}
      <div className="relative h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${Math.min(100, utilizationPercent)}%`,
            background: `linear-gradient(90deg, 
              #10b981 0%, 
              #10b981 50%, 
              #f59e0b 75%, 
              #ef4444 90%, 
              #b91c1c 100%
            )`,
            boxShadow: utilizationPercent > 85 
              ? '0 0 12px rgba(239, 68, 68, 0.5)' 
              : utilizationPercent > 70 
                ? '0 0 8px rgba(245, 158, 11, 0.4)' 
                : '0 0 6px rgba(16, 185, 129, 0.3)',
          }} 
        />
        {/* Gloss overlay for premium effect */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            width: `${Math.min(100, utilizationPercent)}%`,
          }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Rem: <span className="text-emerald-400 font-mono">{formatMoney(safeTotal - safeSpend)}</span></span>
        <span className="text-slate-400">Var: <span className={cn("font-mono", safeVariance > 0 ? "text-amber-400" : "text-emerald-400")}>{formatMoney(safeVariance)}</span></span>
      </div>
    </div>
  );
}

function AnomalyItem({ anomaly }: { anomaly: BudgetAnomaly }) {
  const config = severityConfig[anomaly.severity];
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all duration-200",
      config.bg,
      config.border,
      "hover:scale-[1.01]",
      config.glow
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-1.5 rounded-md mt-0.5",
            anomaly.type === "burning-fast" || anomaly.type === "at-risk" 
              ? "bg-red-500/20" 
              : anomaly.type === "opportunity" 
                ? "bg-emerald-500/20" 
                : "bg-cyan-500/20"
          )}>
            {anomaly.type === "burning-fast" || anomaly.type === "at-risk" ? (
              <Flame className={cn("h-3.5 w-3.5", config.text)} />
            ) : anomaly.type === "opportunity" ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-cyan-400" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200">
                {anomaly.sowNumber}
              </span>
              <Badge 
                variant="outline" 
                className={cn("text-[10px] px-1.5 py-0", config.badge)}
              >
                {anomaly.severity}
              </Badge>
            </div>
            <p className={cn("text-xs", config.text)}>
              {anomaly.message}
            </p>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {anomaly.utilizationPercent.toFixed(0)}% utilized
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {anomaly.daysRemaining}d remaining
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className={cn("text-lg font-bold", config.text)}>
              {Math.abs(anomaly.currentBurnRate - anomaly.expectedBurnRate).toFixed(0)}%
            </span>
            {anomaly.currentBurnRate > anomaly.expectedBurnRate ? (
              <TrendingUp className="h-4 w-4 text-red-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-cyan-400" />
            )}
          </div>
          <p className="text-[10px] text-slate-500">
            vs expected
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskFlagItem({ risk }: { risk: RiskFlag }) {
  const config = severityConfig[risk.severity];
  
  const categoryIcons = {
    budget: DollarSign,
    timeline: Clock,
    utilization: BarChart3,
    compliance: Shield,
  };
  
  const CategoryIcon = categoryIcons[risk.category];

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all duration-200",
      config.bg,
      config.border,
      "hover:bg-slate-800/30"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-md", config.bg)}>
          <CategoryIcon className={cn("h-4 w-4", config.text)} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-slate-200">
                {risk.title}
              </span>
              <Badge 
                variant="outline" 
                className={cn("text-xs px-2 py-0.5", config.badge)}
              >
                {risk.severity}
              </Badge>
            </div>
            <span className="text-sm text-slate-400">{risk.sowNumber}</span>
          </div>
          <p className="text-sm text-slate-400">
            {risk.description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <p className="text-sm text-amber-400/80 italic">
              {risk.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextBestMoveItem({ 
  move, 
  onAction 
}: { 
  move: NextBestMove; 
  onAction: (actionType: QuickActionType, context?: Record<string, unknown>) => void;
}) {
  const config = impactConfig[move.impact];
  
  const actionIcons: Record<string, React.ElementType> = {
    "draft-email": Mail,
    "set-alert": Bell,
    "add-stakeholder": UserPlus,
    "export-brief": FileText,
    "review": Target,
    "escalate": AlertCircle,
  };
  
  const ActionIcon = actionIcons[move.actionType] || Zap;
  
  const isClickable = ["draft-email", "set-alert", "add-stakeholder", "export-brief"].includes(move.actionType);

  return (
    <div 
      className={cn(
        "group relative p-4 rounded-lg border transition-all duration-300",
        "bg-gradient-to-r from-slate-800/50 to-slate-800/30",
        "border-slate-700/50 hover:border-cyan-500/30",
        "hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]",
        isClickable && "cursor-pointer"
      )}
      onClick={() => isClickable && onAction(move.actionType as QuickActionType, move.context)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-cyan-400/50 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className={cn(
            "p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10",
            "border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors"
          )}>
            <ActionIcon className="h-4 w-4 text-cyan-400" />
          </div>
          <div className={cn(
            "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            "bg-slate-900 border-2 border-cyan-500/50 text-cyan-400"
          )}>
            {move.priority}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
              {move.title}
            </h4>
            <Badge variant="outline" className={cn("text-xs px-2 py-0.5", config.bg, config.text, config.border)}>
              {move.impact}
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            {move.description}
          </p>
          {move.sowIds && move.sowIds.length > 0 && (
            <p className="text-[10px] text-slate-500">
              Affects {move.sowIds.length} SOW{move.sowIds.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        
        {isClickable && (
          <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-4 w-4 text-cyan-400" />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionsBar({ 
  onAction,
}: { 
  onAction: (actionType: QuickActionType) => void;
  hasAnomalies: boolean;
}) {
  const actions = [
    { type: "draft-email" as QuickActionType, icon: Send, label: "Email", description: "Draft email to stakeholders", color: "bg-cyan-500" },
    { type: "set-alert" as QuickActionType, icon: Bell, label: "Alert", description: "Set threshold alerts", color: "bg-amber-500" },
    { type: "add-stakeholder" as QuickActionType, icon: UserPlus, label: "Team", description: "Add team members", color: "bg-purple-500" },
    { type: "export-brief" as QuickActionType, icon: Download, label: "Export", description: "Download summary report", color: "bg-emerald-500" },
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Tooltip key={action.type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-slate-800 hover:scale-110 transition-all"
                  onClick={() => onAction(action.type)}
                >
                  <div className={cn("p-2 rounded-lg shadow-lg", action.color)}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-800 border-slate-700 p-2">
                <p className="font-medium text-white text-xs">{action.label}</p>
                <p className="text-xs text-slate-400">{action.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

const sectionHelp = {
  cockpit: {
    title: "AI Decision Cockpit",
    description: "Your AI-powered command center that analyzes all SOWs and surfaces what needs attention NOW.",
    howToUse: "Review alerts, check forecast trends, and click Next Moves to take action.",
  },
  forecast: {
    title: "Budget Forecast",
    description: "Shows total portfolio spend vs budget with trend prediction.",
    metrics: "Green = healthy, Yellow = watch, Red = action needed",
    howToUse: "Click to see detailed budget breakdown by SOW.",
  },
  risks: {
    title: "Risk Detection",
    description: "AI-identified issues requiring attention: expiring contracts, budget thresholds, compliance gaps.",
    howToUse: "Click any risk to see details and recommended actions.",
  },
  nextMoves: {
    title: "AI-Recommended Actions",
    description: "Prioritized list of what to do next based on portfolio analysis.",
    howToUse: "Click any action to execute it immediately or start an AI-assisted workflow.",
  },
  quickActions: {
    title: "Quick Actions",
    description: "One-click actions for common tasks.",
    actions: "Email stakeholders, Set alerts, Add team members, Export briefing",
  },
};

const moveActionConfig: Record<string, { 
  icon: React.ElementType; 
  actionLabel: string; 
  destination: string;
  color: string;
}> = {
  "set-alert": { 
    icon: Bell, 
    actionLabel: "Create Alert", 
    destination: "Opens alert configuration",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  "draft-email": { 
    icon: Mail, 
    actionLabel: "Draft Email", 
    destination: "Opens email composer",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  },
  "add-stakeholder": { 
    icon: UserPlus, 
    actionLabel: "Add Team", 
    destination: "Opens team management",
    color: "bg-violet-500/20 text-violet-400 border-violet-500/40",
  },
  "export-brief": { 
    icon: FileText, 
    actionLabel: "Export Brief", 
    destination: "Downloads summary report",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  "review": { 
    icon: Target, 
    actionLabel: "Start Review", 
    destination: "Opens detailed SOW review",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  "escalate": { 
    icon: AlertCircle, 
    actionLabel: "Escalate", 
    destination: "Creates escalation ticket",
    color: "bg-red-500/20 text-red-400 border-red-500/40",
  },
};

function HelpIcon({ section }: { section: keyof typeof sectionHelp }) {
  const help = sectionHelp[section];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="ml-1 p-1 rounded-full hover:bg-slate-700/50 transition-colors">
          <AlertCircle className="h-3.5 w-3.5 text-slate-500 hover:text-cyan-400" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-700 p-3">
        <div className="space-y-2">
          <p className="font-semibold text-white text-sm">{help.title}</p>
          <p className="text-xs text-slate-300">{help.description}</p>
          {(help as any).howToUse && (
            <p className="text-xs text-cyan-400 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              {(help as any).howToUse}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function AIDecisionCockpit({
  sowData,
  onAction,
  className,
}: AIDecisionCockpitProps) {
  const analysis = useMemo(() => analyzeSOWData(sowData), [sowData]);
  const { anomalies, riskFlags, nextBestMoves, forecast } = analysis;

  const handleMoveClick = (move: NextBestMove) => {
    const actionLabels: Record<string, string> = {
      "draft-email": "Opening Email Composer",
      "set-alert": "Opening Alert Configuration",
      "add-stakeholder": "Opening Stakeholder Manager",
      "export-brief": "Generating Executive Brief",
      "review": "Starting Contract Review",
      "escalate": "Creating Escalation Email",
    };
    
    toast.info(actionLabels[move.actionType] || "Processing Action", {
      description: move.title,
      duration: 2000,
    });
    
    switch (move.actionType) {
      case "draft-email":
      case "set-alert":
      case "add-stakeholder":
      case "export-brief":
        onAction(move.actionType, move.context);
        break;
      case "review":
        onAction("export-brief", { 
          reviewMode: true, 
          sowIds: move.sowIds,
          title: move.title,
        });
        break;
      case "escalate":
        onAction("draft-email", { 
          escalation: true, 
          urgent: true, 
          subject: `URGENT: ${move.title}`,
          context: move.context,
        });
        break;
      default:
        onAction("export-brief", { 
          genericAction: true, 
          actionType: move.actionType,
          title: move.title,
          context: move.context,
        });
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* HEADER with Help */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <span className="text-base font-semibold text-white">AI Decision Cockpit</span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-sm bg-slate-800 border-slate-700 p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-white">Your AI Command Center</p>
                  <p className="text-sm text-slate-300">{sectionHelp.cockpit.description}</p>
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-cyan-400 flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      {sectionHelp.cockpit.howToUse}
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            {anomalies.length === 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-emerald-400 flex items-center gap-1 cursor-help">
                    <CheckCircle2 className="h-4 w-4" /> All Clear
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700">
                  <p className="text-sm">No anomalies detected. Portfolio is healthy.</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-amber-400 cursor-help">{anomalies.length} alerts</span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700">
                  <p className="text-sm">{anomalies.length} items need your attention</p>
                </TooltipContent>
              </Tooltip>
            )}
            <QuickActionsBar onAction={onAction} hasAnomalies={anomalies.length > 0} />
          </div>
        </div>

        {/* 2-COLUMN GRID with Tooltips */}
        <div className="grid grid-cols-2 gap-3">
          {/* FORECAST */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <InsightCard 
                  title="Forecast" 
                  icon={LineChart} 
                  iconColor="text-emerald-400" 
                  badge={
                    <span className={cn("text-xs px-2 py-0.5 rounded font-medium", 
                      forecast.trend === "over" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                    )}>{forecast.trend === "over" ? "Over Budget" : "On Track"}</span>
                  }
                >
                  <ForecastCone forecast={forecast} />
                </InsightCard>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-slate-700 p-3">
              <p className="font-medium text-white text-sm mb-1">Budget Forecast</p>
              <p className="text-xs text-slate-300">{sectionHelp.forecast.description}</p>
              <p className="text-xs text-slate-400 mt-1">{sectionHelp.forecast.metrics}</p>
            </TooltipContent>
          </Tooltip>

          {/* RISK FLAGS */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <InsightCard 
                  title="Risks" 
                  icon={Shield} 
                  iconColor="text-amber-400" 
                  defaultOpen={riskFlags.length > 0}
                  badge={riskFlags.length > 0 && <span className="text-xs px-2 py-0.5 rounded font-medium bg-red-500/20 text-red-300">{riskFlags.length}</span>}
                >
                  {riskFlags.length === 0 ? (
                    <div className="py-3 text-center text-sm text-slate-500">No risks detected</div>
                  ) : (
                    <div className="space-y-2">
                      {riskFlags.slice(0, 3).map((r) => (
                        <div key={r.id} className="text-sm text-slate-300 hover:text-white cursor-pointer transition-colors">
                          {r.title}
                        </div>
                      ))}
                    </div>
                  )}
                </InsightCard>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-slate-700 p-3">
              <p className="font-medium text-white text-sm mb-1">Risk Detection</p>
              <p className="text-xs text-slate-300">{sectionHelp.risks.description}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* NEXT MOVES - LARGE, CLEARLY ACTIONABLE */}
        <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800/80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-400" />
                <span className="text-base font-semibold text-white">Next Moves</span>
                <HelpIcon section="nextMoves" />
              </div>
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 text-xs">
                AI Recommended
              </Badge>
            </div>
            
            <div className="space-y-3">
              {nextBestMoves.slice(0, 3).map((move) => {
                const config = moveActionConfig[move.actionType] || moveActionConfig["review"];
                const ActionIcon = config.icon;
                
                return (
                  <div
                    key={move.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleMoveClick(move)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMoveClick(move)}
                    className={cn(
                      "w-full group relative flex items-center gap-4 p-4 rounded-xl",
                      "bg-slate-800/60 hover:bg-slate-700/80",
                      "border border-slate-700 hover:border-cyan-500/50",
                      "transition-all duration-200 cursor-pointer",
                      "hover:shadow-lg hover:shadow-cyan-500/10",
                      "hover:translate-x-1",
                      "focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    )}
                  >
                    {/* Action Icon */}
                    <div className={cn(
                      "flex-shrink-0 p-3 rounded-lg border transition-transform",
                      config.color,
                      "group-hover:scale-110"
                    )}>
                      <ActionIcon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-left">
                      <p className="text-base font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {move.title}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {move.description || config.destination}
                      </p>
                    </div>
                    
                    {/* Impact + Arrow */}
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "text-xs font-semibold",
                        impactConfig[move.impact].bg, 
                        impactConfig[move.impact].text,
                        "border",
                        impactConfig[move.impact].border
                      )}>
                        {move.impact}
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    {/* Priority Indicator */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {move.priority}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Action Hint */}
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3 w-3" />
              <span>Click any action above to execute or start AI-assisted workflow</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

export default AIDecisionCockpit;
