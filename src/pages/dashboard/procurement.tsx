import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Users,
  ArrowRight,
  Zap,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  AlertCircle,
  Gauge,
  Activity,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router";
import type {
  PurchaseOrder,
  StatementOfWork,
  Invoice,
  Contractor,
} from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Area, AreaChart } from "recharts";
import { DensityToggle } from "@/components/density-toggle";
import { PremiumKPICard, PremiumMetricRow, PremiumKPIGrid, PremiumSecondaryGrid } from "@/components/premium-kpi-card";
import { PremiumActionRequired, type ActionItem } from "@/components/premium-action-required";

export default function ProcurementDashboard() {
  const navigate = useNavigate();

  const { data: posData, isLoading: posLoading } = useList<PurchaseOrder>({
    resource: "purchase_orders",
    pagination: { mode: "off" },
  });

  const { data: sowsData, isLoading: sowsLoading } = useList<StatementOfWork>({
    resource: "statements_of_work",
    pagination: { mode: "off" },
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useList<Invoice>({
    resource: "invoices",
    pagination: { mode: "off" },
  });

  const { data: contractorsData, isLoading: contractorsLoading } = useList<Contractor>({
    resource: "contractors",
    pagination: { mode: "off" },
  });

  const pos = posData?.data || [];
  const sows = sowsData?.data || [];
  const invoices = invoicesData?.data || [];
  const contractors = contractorsData?.data || [];

  const isLoading = posLoading || sowsLoading || invoicesLoading || contractorsLoading;

  const activePOs = pos.filter((po) => po.status === "Active");
  const activeSows = sows.filter((sow) => sow.status === "Active");

  const totalBudget = activePOs.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = activePOs.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
  const totalRemaining = activePOs.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);
  const budgetVariance = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const today = new Date();
  const thirtyDaysOut = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysOut = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysOut = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const expiringContracts30 = activeSows.filter((sow) => {
    const endDate = new Date(sow.endDate);
    return endDate <= thirtyDaysOut && endDate >= today;
  });

  const expiringContracts60 = activeSows.filter((sow) => {
    const endDate = new Date(sow.endDate);
    return endDate <= sixtyDaysOut && endDate > thirtyDaysOut;
  });

  const expiringContracts90 = activeSows.filter((sow) => {
    const endDate = new Date(sow.endDate);
    return endDate <= ninetyDaysOut && endDate > sixtyDaysOut;
  });

  const riskExposure30 = expiringContracts30.reduce((sum, sow) => sum + sow.remainingValue, 0);
  const riskExposure60 = expiringContracts60.reduce((sum, sow) => sum + sow.remainingValue, 0);
  const riskExposure90 = expiringContracts90.reduce((sum, sow) => sum + sow.remainingValue, 0);
  const totalRiskExposure = riskExposure30 + riskExposure60 + riskExposure90;

  const lowFundsPOs = activePOs.filter((po) => {
    const utilizationPct = (Number(po.totalAmount) || 0) > 0 ? ((Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1)) * 100 : 0;
    return utilizationPct >= 80;
  });

  const criticalPOs = activePOs.filter((po) => {
    const utilizationPct = (Number(po.totalAmount) || 0) > 0 ? ((Number(po.amountSpent) || 0) / (Number(po.totalAmount) || 1)) * 100 : 0;
    return utilizationPct >= 90;
  });

  const posNeedingBuyer = activePOs.filter((po) => !po.buyerId);

  const disputedInvoices = invoices.filter((inv) => inv.status === "Disputed");
  const varianceInvoices = invoices.filter((inv) => inv.hasVariance && inv.status !== "Paid");
  const totalVarianceAmount = varianceInvoices.reduce((sum, inv) => sum + Math.abs(inv.varianceAmount), 0);

  const overBudgetSows = activeSows.filter((sow) => sow.invoicedAmount > sow.totalValue);
  const overBudgetAmount = overBudgetSows.reduce((sum, sow) => sum + (sow.invoicedAmount - sow.totalValue), 0);

  const complianceScore = activeSows.length > 0
    ? Math.round(((activeSows.length - overBudgetSows.length) / activeSows.length) * 100)
    : 100;

  // PO Expiration tracking (more impactful than SOW since we have real data)
  const expiringPOs30 = activePOs.filter((po) => {
    if (!po.endDate) return false;
    const endDate = new Date(po.endDate);
    return endDate <= thirtyDaysOut && endDate >= today;
  });

  const expiringPOs60 = activePOs.filter((po) => {
    if (!po.endDate) return false;
    const endDate = new Date(po.endDate);
    return endDate <= sixtyDaysOut && endDate > thirtyDaysOut;
  });

  const expiringPOs90 = activePOs.filter((po) => {
    if (!po.endDate) return false;
    const endDate = new Date(po.endDate);
    return endDate <= ninetyDaysOut && endDate > sixtyDaysOut;
  });

  const poRiskValue30 = expiringPOs30.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);
  const poRiskValue60 = expiringPOs60.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);
  const poRiskValue90 = expiringPOs90.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);

  // Pending invoices requiring action
  const pendingInvoices = invoices.filter((inv) => 
    inv.status === "Draft" || (inv as any).status === "Submitted" || (inv as any).status === "Pending"
  );
  const pendingInvoiceValue = pendingInvoices.reduce((sum, inv) => sum + (Number((inv as any).total_amount) || Number((inv as any).totalAmount) || 0), 0);

  const burndownData = activePOs.slice(0, 6).map((po) => {
    const spent = Number(po.amountSpent) || 0;
    const total = Number(po.totalAmount) || 0;
    const remaining = Number(po.amountRemaining) || 0;
    const utilizationPct = total > 0 ? Math.round((spent / total) * 100) : 0;
    const daysRemaining = Math.ceil((new Date(po.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dailyBurnRate = spent > 0 && daysRemaining > 0 
      ? spent / Math.max(1, Math.ceil((today.getTime() - new Date(po.startDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
    const projectedExhaustion = dailyBurnRate > 0 ? Math.ceil(remaining / dailyBurnRate) : null;
    
    return {
      po: po.poNumber.replace("PO-", ""),
      spent,
      remaining,
      total,
      utilization: utilizationPct,
      daysRemaining,
      projectedExhaustion,
      status: utilizationPct >= 90 ? "critical" : utilizationPct >= 80 ? "warning" : "healthy",
    };
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getUrgencyColor = (level: "critical" | "warning" | "healthy") => {
    switch (level) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "warning": return "text-amber-600 bg-amber-50 border-amber-200";
      case "healthy": return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const actionItems: ActionItem[] = [
    ...(expiringContracts30.length > 0 ? [{
      urgency: "critical" as const,
      icon: Clock,
      label: `${expiringContracts30.length} contract${expiringContracts30.length > 1 ? 's' : ''} expire in 30 days`,
      value: formatCurrency(riskExposure30),
      tooltip: `${expiringContracts30.length} active contract${expiringContracts30.length > 1 ? 's' : ''} will expire within 30 days, representing ${formatCurrency(riskExposure30)} in remaining contract value at risk. Immediate renewal action required to prevent service disruption.`,
      action: () => navigate("/statementofworks"),
    }] : []),
    ...(criticalPOs.length > 0 ? [{
      urgency: "critical" as const,
      icon: AlertTriangle,
      label: `${criticalPOs.length} PO${criticalPOs.length > 1 ? 's' : ''} >90% exhausted`,
      value: formatCurrency(criticalPOs.reduce((s, p) => s + (Number(p.amountRemaining) || 0), 0)),
      tooltip: `${criticalPOs.length} purchase order${criticalPOs.length > 1 ? 's have' : ' has'} consumed over 90% of allocated funds. Only ${formatCurrency(criticalPOs.reduce((s, p) => s + (Number(p.amountRemaining) || 0), 0))} remains. Review spending velocity and initiate change orders if needed.`,
      action: () => navigate("/purchaseorders"),
    }] : []),
    ...(disputedInvoices.length > 0 ? [{
      urgency: "critical" as const,
      icon: XCircle,
      label: `${disputedInvoices.length} disputed invoice${disputedInvoices.length > 1 ? 's' : ''}`,
      value: formatCurrency(disputedInvoices.reduce((s, i) => s + i.requestedAmount, 0)),
      tooltip: `${disputedInvoices.length} invoice${disputedInvoices.length > 1 ? 's are' : ' is'} currently in disputed status totaling ${formatCurrency(disputedInvoices.reduce((s, i) => s + i.requestedAmount, 0))}. Resolution required to maintain vendor relationships and avoid payment delays.`,
      action: () => navigate("/invoices"),
    }] : []),
    ...(overBudgetSows.length > 0 ? [{
      urgency: "critical" as const,
      icon: TrendingUp,
      label: `${overBudgetSows.length} SOW${overBudgetSows.length > 1 ? 's' : ''} over budget`,
      value: formatCurrency(overBudgetAmount),
      tooltip: `${overBudgetSows.length} Statement${overBudgetSows.length > 1 ? 's' : ''} of Work ${overBudgetSows.length > 1 ? 'have' : 'has'} exceeded budget by ${formatCurrency(overBudgetAmount)}. Review scope creep and billing accuracy. Change order may be required.`,
      action: () => navigate("/statementofworks/compliance-report"),
    }] : []),
    ...(lowFundsPOs.filter(p => !criticalPOs.includes(p)).length > 0 ? [{
      urgency: "warning" as const,
      icon: DollarSign,
      label: `${lowFundsPOs.filter(p => !criticalPOs.includes(p)).length} PO${lowFundsPOs.filter(p => !criticalPOs.includes(p)).length > 1 ? 's' : ''} 80-90% spent`,
      value: "Monitor",
      tooltip: `${lowFundsPOs.filter(p => !criticalPOs.includes(p)).length} purchase order${lowFundsPOs.filter(p => !criticalPOs.includes(p)).length > 1 ? 's are' : ' is'} approaching budget threshold (80-90% consumed). Monitor spending trajectory and plan for potential amendments.`,
      action: () => navigate("/purchaseorders"),
    }] : []),
    ...(expiringContracts60.length > 0 ? [{
      urgency: "warning" as const,
      icon: Calendar,
      label: `${expiringContracts60.length} contract${expiringContracts60.length > 1 ? 's' : ''} expire in 60 days`,
      value: formatCurrency(riskExposure60),
      tooltip: `${expiringContracts60.length} contract${expiringContracts60.length > 1 ? 's' : ''} expiring in 31-60 days with ${formatCurrency(riskExposure60)} remaining value. Begin renewal discussions and scope negotiations now.`,
      action: () => navigate("/statementofworks"),
    }] : []),
    ...(posNeedingBuyer.length > 0 ? [{
      urgency: "warning" as const,
      icon: Users,
      label: `${posNeedingBuyer.length} PO${posNeedingBuyer.length > 1 ? 's' : ''} missing buyer`,
      value: "Assign",
      tooltip: `${posNeedingBuyer.length} active purchase order${posNeedingBuyer.length > 1 ? 's lack' : ' lacks'} an assigned buyer. Unassigned POs may experience delayed approvals and reduced oversight.`,
      action: () => navigate("/purchaseorders"),
    }] : []),
    ...(varianceInvoices.length > 0 ? [{
      urgency: "warning" as const,
      icon: FileText,
      label: `${varianceInvoices.length} invoice${varianceInvoices.length > 1 ? 's' : ''} with variance`,
      value: formatCurrency(totalVarianceAmount),
      tooltip: `${varianceInvoices.length} invoice${varianceInvoices.length > 1 ? 's show' : ' shows'} variance between requested and approved amounts totaling ${formatCurrency(totalVarianceAmount)}. Review for billing discrepancies or rate mismatches.`,
      action: () => navigate("/invoices"),
    }] : []),
  ];

  const criticalCount = actionItems.filter(a => a.urgency === "critical").length;
  const warningCount = actionItems.filter(a => a.urgency === "warning").length;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-4" style={{ gap: 'var(--density-gap, 0.75rem)' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-[1400px] mx-auto" style={{ padding: 'var(--density-card-px, 1rem)', display: 'flex', flexDirection: 'column', gap: 'var(--density-gap, 1rem)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold tracking-tight bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent" style={{ fontSize: 'var(--text-3xl, 1.5rem)' }}>
              Procurement Command Center
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm, 0.8125rem)' }}>
              Real-time spend intelligence • Contract risk monitoring • Proactive alerts
            </p>
          </div>
          <div className="flex items-center" style={{ gap: 'var(--density-gap, 0.5rem)' }}>
            <DensityToggle />
            {criticalCount > 0 && (
              <Badge variant="destructive" className="px-3 py-1" style={{ fontSize: 'var(--text-sm, 0.8125rem)' }}>
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="px-3 py-1 border-amber-300 text-amber-700 bg-amber-50" style={{ fontSize: 'var(--text-sm, 0.8125rem)' }}>
                {warningCount} Warning
              </Badge>
            )}
            {criticalCount === 0 && warningCount === 0 && (
              <Badge variant="outline" className="px-3 py-1 border-green-300 text-green-700 bg-green-50" style={{ fontSize: 'var(--text-sm, 0.8125rem)' }}>
                All Systems Healthy
              </Badge>
            )}
          </div>
        </div>

        {/* PREMIUM COMMAND METRICS - Automotive Instrument Cluster (Top Position) */}
        <PremiumKPIGrid>
          <PremiumKPICard
            title="Spend vs Budget"
            value={`${formatCurrency(totalSpent)} / ${formatCurrency(totalBudget)}`}
            subtitle={`${formatCurrency(totalRemaining)} remaining`}
            icon={DollarSign}
            accentColor={budgetUtilization > 90 ? "ruby" : budgetUtilization > 75 ? "amber" : "sapphire"}
            utilization={Math.round(budgetUtilization)}
            onClick={() => navigate("/purchase-orders")}
          />

          <PremiumKPICard
            title="Contract Compliance"
            value={`${complianceScore}%`}
            subtitle={`${activeSows.length - overBudgetSows.length} on budget • ${activeSows.length} SOWs tracked`}
            icon={complianceScore >= 90 ? ShieldCheck : ShieldAlert}
            accentColor={complianceScore >= 90 ? "emerald" : "amber"}
            utilization={complianceScore}
            onClick={() => navigate("/statementofworks")}
          />

          <PremiumKPICard
            title="Risk Exposure"
            value={formatCurrency(totalRiskExposure)}
            subtitle={totalRiskExposure > 0 
              ? `${expiringContracts30.length} @ 30d • ${expiringContracts60.length} @ 60d`
              : "No contracts at risk"}
            icon={AlertTriangle}
            accentColor={totalRiskExposure > 0 ? "ruby" : "emerald"}
            onClick={() => navigate("/statementofworks")}
          />

          <PremiumKPICard
            title="Active Portfolio"
            value={`${activePOs.length} / ${activeSows.length}`}
            subtitle={`POs / SOWs • ${contractors.filter(c => c.status === "Active").length} contractors`}
            icon={Briefcase}
            accentColor="sapphire"
            utilization={activePOs.length > 0 ? Math.round((activePOs.length / (activePOs.length + activeSows.length)) * 100) : 0}
            onClick={() => navigate("/contractors")}
          />
        </PremiumKPIGrid>

        {/* Premium F1 Telemetry Action Required Panel */}
        <PremiumActionRequired items={actionItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--density-gap, 1rem)' }}>
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                  PO Burndown Status
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate("/purchaseorders")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {burndownData.length > 0 ? (
                <div className="space-y-2">
                  {burndownData.map((po, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded-md border ${
                        po.status === "critical" ? "border-red-200 bg-red-50/50" :
                        po.status === "warning" ? "border-amber-200 bg-amber-50/50" :
                        "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">PO-{po.po}</span>
                        <div className="flex items-center gap-2">
                          {po.projectedExhaustion !== null && po.projectedExhaustion < po.daysRemaining && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">
                                  Exhausts in {po.projectedExhaustion}d
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                At current burn rate, funds exhaust before contract ends
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <span className={`text-xs font-medium ${
                            po.status === "critical" ? "text-red-600" :
                            po.status === "warning" ? "text-amber-600" :
                            "text-green-600"
                          }`}>
                            {po.utilization}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={po.utilization} 
                        className="h-2"
                      />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Spent: {formatCurrency(po.spent)}</span>
                        <span>Remaining: {formatCurrency(po.remaining)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active POs to display</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  Expiring Purchase Orders
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate("/purchaseorders")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              {[...expiringPOs30, ...expiringPOs60, ...expiringPOs90].length > 0 ? (
                <div className="space-y-2">
                  {[...expiringPOs30.map(p => ({...p, urgency: "critical" as const})),
                    ...expiringPOs60.map(p => ({...p, urgency: "warning" as const})),
                    ...expiringPOs90.map(p => ({...p, urgency: "healthy" as const}))]
                    .slice(0, 6)
                    .map((po, idx) => {
                      const daysLeft = Math.ceil((new Date(po.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div 
                          key={idx}
                          className={`p-2 rounded-md border flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors ${
                            po.urgency === "critical" ? "border-red-200 bg-red-50/50" :
                            po.urgency === "warning" ? "border-amber-200 bg-amber-50/50" :
                            "border-gray-200"
                          }`}
                          onClick={() => navigate(`/purchaseorders/${po.id}`)}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{po.poNumber}</span>
                              <Badge variant={po.urgency === "critical" ? "destructive" : po.urgency === "warning" ? "outline" : "secondary"} className="text-xs">
                                {daysLeft} days
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {po.department}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(Number(po.amountRemaining) || 0)}</div>
                            <div className="text-xs text-muted-foreground">remaining</div>
                          </div>
                        </div>
                      );
                    })}
                  {[...expiringPOs30, ...expiringPOs60, ...expiringPOs90].length > 0 && (
                    <div className="pt-2 border-t mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total at risk:</span>
                      <span className="font-semibold text-amber-600">
                        {formatCurrency(poRiskValue30 + poRiskValue60 + poRiskValue90)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">All POs have runway</p>
                  <p className="text-xs text-muted-foreground">No expirations within 90 days</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoices Pending Approval - Real Actionable Insight */}
        <Card className={`${pendingInvoices.length > 0 ? "bg-gradient-to-r from-amber-50 to-white border-amber-200" : "bg-gradient-to-r from-green-50 to-white border-green-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${pendingInvoices.length > 0 ? "bg-amber-100" : "bg-green-100"}`}>
                  <FileText className={`h-5 w-5 ${pendingInvoices.length > 0 ? "text-amber-600" : "text-green-600"}`} />
                </div>
                <div>
                  <h3 className={`font-semibold ${pendingInvoices.length > 0 ? "text-amber-900" : "text-green-900"}`}>
                    {pendingInvoices.length > 0 ? "Invoices Awaiting Approval" : "Invoice Queue Clear"}
                  </h3>
                  <p className={`text-sm ${pendingInvoices.length > 0 ? "text-amber-700" : "text-green-700"}`}>
                    {pendingInvoices.length > 0 
                      ? `${pendingInvoices.length} invoice${pendingInvoices.length > 1 ? 's' : ''} pending review`
                      : "All invoices processed"}
                  </p>
                </div>
              </div>
              {pendingInvoices.length > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">{formatCurrency(pendingInvoiceValue)}</div>
                  <Button variant="ghost" size="sm" className="text-amber-600 p-0 h-auto" onClick={() => navigate("/invoices")}>
                    Review Now <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget Health Summary - Real Data */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-cyan-500/20">
                  <Gauge className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Fiscal Health Summary</h3>
                  <p className="text-sm text-slate-400">Real-time budget status across all POs</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{Math.round(budgetUtilization)}%</div>
                <div className="text-xs text-slate-400">utilized</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-700">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-400">{formatCurrency(totalBudget)}</div>
                <div className="text-xs text-slate-400">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-amber-400">{formatCurrency(totalSpent)}</div>
                <div className="text-xs text-slate-400">Spent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-cyan-400">{formatCurrency(totalRemaining)}</div>
                <div className="text-xs text-slate-400">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
