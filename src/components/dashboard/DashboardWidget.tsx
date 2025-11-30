import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { DashboardModule } from "../../types/dashboard";
import { ArrowUp, ArrowDown, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { useList } from "@refinedev/core";

interface DashboardWidgetProps {
  module: DashboardModule | undefined;
}

interface MetricData {
  value: string;
  trend?: "up" | "down" | "neutral";
  change?: number;
  loading?: boolean;
  error?: boolean;
  source?: string;
}

const useRealMetrics = (moduleName: string): MetricData => {
  const { data: contractorsData, isLoading: contractorsLoading, error: contractorsError } = useList({
    resource: "contractors",
    pagination: { mode: "off" },
    queryOptions: { enabled: moduleName === "Active Contractors" },
  });

  const { data: purchaseOrdersData, isLoading: posLoading, error: posError } = useList({
    resource: "purchase-orders",
    pagination: { mode: "off" },
    queryOptions: { enabled: moduleName === "Vendor Spend" || moduleName === "Portfolio Health" },
  });

  const { data: timecardsData, isLoading: timecardsLoading, error: timecardsError } = useList({
    resource: "timecards",
    pagination: { mode: "off" },
    queryOptions: { enabled: moduleName === "Resource Utilization" },
  });

  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useList({
    resource: "invoices",
    pagination: { mode: "off" },
    queryOptions: { enabled: moduleName === "Cost Savings" || moduleName === "Spend Trends" },
  });

  switch (moduleName) {
    case "Active Contractors":
      if (contractorsLoading) return { value: "—", loading: true };
      if (contractorsError) return { value: "—", error: true, source: "contractors API error" };
      const activeCount = contractorsData?.data?.filter((c: any) => c.status === "Active").length || 0;
      return { 
        value: activeCount.toString(), 
        trend: "neutral",
        source: "contractors table"
      };

    case "Vendor Spend":
      if (posLoading) return { value: "—", loading: true };
      if (posError) return { value: "—", error: true, source: "purchase-orders API error" };
      const totalSpend = purchaseOrdersData?.data?.reduce((sum: number, po: any) => 
        sum + (parseFloat(po.spent_amount || po.spentAmount) || 0), 0) || 0;
      return { 
        value: totalSpend > 0 ? `$${(totalSpend / 1000).toFixed(0)}K` : "$0", 
        trend: "neutral",
        source: "purchase_orders.spent_amount"
      };

    case "Contract Compliance":
      return { value: "N/A", trend: "neutral", source: "SOW endpoint not implemented" };

    case "Resource Utilization":
      if (timecardsLoading) return { value: "—", loading: true };
      if (timecardsError) return { value: "—", error: true, source: "timecards API error" };
      const approvedTimecards = timecardsData?.data?.filter((t: any) => t.status === "Approved").length || 0;
      const totalTimecards = timecardsData?.data?.length || 1;
      const utilizationRate = Math.round((approvedTimecards / totalTimecards) * 100);
      return { 
        value: `${utilizationRate}%`, 
        trend: "neutral",
        source: "timecards.status"
      };

    case "Portfolio Health":
      if (posLoading) return { value: "—", loading: true };
      if (posError) return { value: "—", error: true, source: "purchase-orders API error" };
      const totalBudget = purchaseOrdersData?.data?.reduce((sum: number, po: any) => 
        sum + (parseFloat(po.total_amount || po.totalBudget) || 0), 0) || 0;
      const totalSpentPH = purchaseOrdersData?.data?.reduce((sum: number, po: any) => 
        sum + (parseFloat(po.spent_amount || po.spentAmount) || 0), 0) || 0;
      const healthScore = totalBudget > 0 ? Math.round((1 - totalSpentPH / totalBudget) * 100) : 0;
      return { 
        value: `${Math.min(100, Math.max(0, healthScore))}/100`, 
        trend: "neutral",
        source: "purchase_orders budget calculation"
      };

    case "Cost Savings":
      if (invoicesLoading) return { value: "—", loading: true };
      if (invoicesError) return { value: "—", error: true, source: "invoices API error" };
      const totalVariance = invoicesData?.data?.reduce((sum: number, inv: any) => {
        const variance = (parseFloat(inv.requested_amount || inv.requestedAmount) || 0) - 
                        (parseFloat(inv.actual_amount || inv.actualAmount || inv.amount) || 0);
        return sum + (variance > 0 ? variance : 0);
      }, 0) || 0;
      return { 
        value: totalVariance > 0 ? `$${(totalVariance / 1000).toFixed(0)}K` : "$0", 
        trend: "neutral",
        source: "invoices.requested_amount - actual_amount"
      };

    default:
      return { value: "—", trend: "neutral", source: "no data source configured" };
  }
};

export function DashboardWidget({ module }: DashboardWidgetProps) {
  if (!module) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Module not found</p>
      </div>
    );
  }

  const getIcon = (iconName: string | null | undefined) => {
    if (!iconName) return LucideIcons.Box;
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return Icon;
  };

  const Icon = getIcon(module.icon);
  const metricData = useRealMetrics(module.name);

  const renderTrendBadge = () => {
    if (!metricData.trend || metricData.trend === "neutral") return null;
    
    const isPositive = metricData.trend === "up";
    const TrendIcon = isPositive ? ArrowUp : ArrowDown;
    
    return (
      <Badge 
        variant={isPositive ? "default" : "destructive"} 
        className="gap-1 font-semibold text-xs shadow-sm"
      >
        <TrendIcon className="w-3 h-3" />
        {metricData.change}%
      </Badge>
    );
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <AlertCircle className="w-6 h-6 text-destructive" />
      <p className="text-xs text-muted-foreground">Data unavailable</p>
    </div>
  );

  switch (module.type) {
    case "kpi":
      if (metricData.loading) return renderLoadingState();
      if (metricData.error) return renderErrorState();
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            {renderTrendBadge()}
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {metricData.value}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {module.description}
            </div>
          </div>

          {metricData.source && (
            <div className="text-[10px] text-muted-foreground/60 mt-2 truncate" title={metricData.source}>
              Source: {metricData.source}
            </div>
          )}
        </div>
      );

    case "chart":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{module.name}</span>
            </div>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="p-3 rounded-xl bg-muted/50 inline-block">
                <LucideIcons.BarChart3 className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Chart data source not configured
              </p>
              <p className="text-xs text-muted-foreground/60">
                Connect a time-series endpoint to display trends
              </p>
            </div>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Connect data source to view list
            </p>
          </div>
        </div>
      );

    case "widget":
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{module.name}</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="p-3 rounded-xl bg-muted/50 inline-block">
                <LucideIcons.Settings2 className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Widget actions not configured
              </p>
              <p className="text-xs text-muted-foreground/60">
                Configure widget to display interactive controls
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="p-3 rounded-xl bg-primary/5 inline-block">
              <Icon className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {module.description}
            </p>
          </div>
        </div>
      );
  }
}
