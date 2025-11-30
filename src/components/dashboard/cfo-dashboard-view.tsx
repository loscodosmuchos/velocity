import { useGo } from "@refinedev/core";
import { 
  Crown, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Shield,
  Zap,
  PiggyBank,
  LineChart,
  AlertOctagon,
  Sparkles
} from "lucide-react";
import { PremiumKPICard, PremiumMetricRow, PremiumKPIGrid, PremiumSecondaryGrid } from "@/components/premium-kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isStatus, asCurrencyNumber, safePercent } from "@/lib/utils";
import type { PurchaseOrder, Invoice, Department, StatementOfWork, Contractor } from "@/types";

interface CFODashboardViewProps {
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  departments: Department[];
  sows: StatementOfWork[];
  contractors: Contractor[];
}

export function CFODashboardView({ 
  purchaseOrders, 
  invoices,
  departments,
  sows,
  contractors
}: CFODashboardViewProps) {
  const go = useGo();

  const totalBudget = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.totalAmount), 0);
  const totalSpent = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.amountSpent), 0);
  const budgetVariance = totalBudget - totalSpent;
  // Use safePercent for NaN defense - variance can be positive or negative
  const rawVariancePercent = totalBudget > 0 ? ((budgetVariance) / totalBudget) * 100 : 0;
  const budgetVariancePercent = isNaN(rawVariancePercent) ? 0 : rawVariancePercent;

  const invoicesWithVariance = invoices.filter((i) => i.hasVariance).length;
  const sowsWithOverrun = sows.filter(s => asCurrencyNumber(s.invoicedAmount) > asCurrencyNumber(s.totalValue));
  
  const estimatedCostSavings = Math.round(totalSpent * 0.08);

  const riskIndicators = {
    highRiskPOs: purchaseOrders.filter(po => {
      const spent = asCurrencyNumber(po.amountSpent);
      const total = asCurrencyNumber(po.totalAmount);
      return safePercent(spent, total) > 90;
    }).length,
    overdueInvoices: invoices.filter(inv => {
      if (isStatus(inv.status, 'submitted') && inv.dueDate) {
        return new Date(inv.dueDate) < new Date();
      }
      return false;
    }).length,
    expiringSows: sows.filter(s => {
      if (s.endDate) {
        const daysUntilExpiry = Math.ceil((new Date(s.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 14 && daysUntilExpiry > 0;
      }
      return false;
    }).length
  };

  const totalRiskScore = riskIndicators.highRiskPOs + riskIndicators.overdueInvoices + riskIndicators.expiringSows;
  const riskLevel = totalRiskScore === 0 ? "Low" : totalRiskScore <= 3 ? "Medium" : "High";

  const topDepartments = departments
    .map((dept) => {
      const deptPOs = purchaseOrders.filter((po) => po.department === dept.name);
      const spent = deptPOs.reduce((sum, po) => sum + asCurrencyNumber(po.amountSpent), 0);
      const budget = asCurrencyNumber(dept.budget);
      return { ...dept, spent, budget, utilization: budget > 0 ? (spent / budget) * 100 : 0 };
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const activeContractors = contractors.filter(c => isStatus(c.status, "active")).length;

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-r-lg">
        <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          CFO Executive View
        </h3>
        <p className="text-sm text-slate-400">
          High-level strategy, budget oversight, and cost avoidance
        </p>
      </div>

      <PremiumKPIGrid className="gap-5">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-amber-500/20 to-yellow-500/30 rounded-2xl blur-sm" />
          <PremiumKPICard
            title="Total Spend"
            value={`$${(totalSpent / 1000000).toFixed(2)}M`}
            subtitle={`of $${(totalBudget / 1000000).toFixed(2)}M budget`}
            icon={DollarSign}
            accentColor="amber"
            utilization={totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}
            onClick={() => go({ to: "/analytics-hub" })}
            className="relative"
          />
        </div>
        
        <PremiumKPICard
          title="Budget Variance"
          value={`${budgetVariancePercent >= 0 ? '+' : ''}${budgetVariancePercent.toFixed(1)}%`}
          subtitle={`$${(Math.abs(budgetVariance) / 1000).toFixed(0)}k ${budgetVariance >= 0 ? 'under' : 'over'}`}
          icon={budgetVariance >= 0 ? TrendingDown : TrendingUp}
          accentColor={budgetVariance >= 0 ? "emerald" : "ruby"}
          sparklineData={[12, 8, 15, 10, 18, Math.abs(budgetVariancePercent)]}
          trend={budgetVariance >= 0 ? "up" : "down"}
          trendValue={budgetVariance >= 0 ? "+2.3%" : "-1.5%"}
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumKPICard
          title="Est. Cost Savings"
          value={`$${(estimatedCostSavings / 1000).toFixed(0)}k`}
          subtitle="YTD optimization"
          icon={PiggyBank}
          accentColor="emerald"
          sparklineData={[20, 35, 42, 55, 68, estimatedCostSavings / 1000]}
          trend="up"
          trendValue="+18%"
          onClick={() => go({ to: "/analytics-hub" })}
        />
        
        <PremiumKPICard
          title="Risk Indicators"
          value={totalRiskScore}
          subtitle={`${riskLevel} risk level`}
          icon={totalRiskScore === 0 ? Shield : AlertTriangle}
          accentColor={totalRiskScore === 0 ? "emerald" : totalRiskScore <= 3 ? "amber" : "ruby"}
          miniBarData={[riskIndicators.highRiskPOs, riskIndicators.overdueInvoices, riskIndicators.expiringSows]}
          trend={totalRiskScore > 0 ? "up" : "down"}
          trendValue={totalRiskScore > 0 ? `+${totalRiskScore}` : "0"}
          onClick={() => go({ to: "/alerts" })}
        />
      </PremiumKPIGrid>

      <Card className="border-yellow-500/30 bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Executive Summary
          </CardTitle>
          <CardDescription className="text-slate-400">
            Key performance indicators at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Budget</span>
              </div>
              <p className="text-2xl font-bold text-white">${(totalBudget / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-slate-500 mt-1">Across {purchaseOrders.length} POs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deployed</span>
              </div>
              <p className="text-2xl font-bold text-white">${(totalSpent / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-slate-500 mt-1">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilization</p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Workforce</span>
              </div>
              <p className="text-2xl font-bold text-white">{activeContractors}</p>
              <p className="text-xs text-slate-500 mt-1">of {contractors.length} total</p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active SOWs</span>
              </div>
              <p className="text-2xl font-bold text-white">{sows.filter(s => s.status === "Active").length}</p>
              <p className="text-xs text-slate-500 mt-1">{sowsWithOverrun.length} with overruns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-yellow-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <LineChart className="h-5 w-5 text-yellow-400" />
              Strategic Projections
            </CardTitle>
            <CardDescription className="text-slate-400">
              Budget trajectory and forecasting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Current Spend Rate</span>
                  <Badge className={totalBudget > 0 && (totalSpent / totalBudget) > 0.8 
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }>
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                  </Badge>
                </div>
                <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-3 bg-slate-700" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>$0</span>
                  <span>${(totalBudget / 1000000).toFixed(1)}M</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-xs text-emerald-400 font-semibold mb-1">Remaining Budget</p>
                  <p className="text-lg font-bold text-white">${((totalBudget - totalSpent) / 1000).toFixed(0)}k</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-xs text-yellow-400 font-semibold mb-1">Projected EOY</p>
                  <p className="text-lg font-bold text-white">${(totalSpent * 1.2 / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-emerald-400" />
              ROI Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              Cost optimization opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Estimated Savings</span>
                  <span className="text-xl font-bold text-emerald-400">${(estimatedCostSavings / 1000).toFixed(0)}k</span>
                </div>
                <p className="text-xs text-slate-400">From process automation & vendor optimization</p>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Invoice Processing Efficiency</span>
                  <span className="text-sm font-semibold text-cyan-400">+23%</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Timecard Automation Rate</span>
                  <span className="text-sm font-semibold text-cyan-400">78%</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Vendor Consolidation Savings</span>
                  <span className="text-sm font-semibold text-emerald-400">$42k YTD</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            Critical Alerts
          </CardTitle>
          <CardDescription className="text-slate-400">
            Items requiring executive attention
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {totalRiskScore === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-white">All Systems Nominal</p>
              <p className="text-slate-400">No critical alerts at this time</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {riskIndicators.highRiskPOs > 0 && (
                <div 
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 cursor-pointer hover:bg-red-500/20 transition-colors"
                  onClick={() => go({ to: "/purchaseorders" })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="text-sm font-semibold text-red-400">High-Risk POs</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{riskIndicators.highRiskPOs}</p>
                  <p className="text-xs text-slate-400">Over 90% utilized</p>
                </div>
              )}
              
              {riskIndicators.overdueInvoices > 0 && (
                <div 
                  className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-colors"
                  onClick={() => go({ to: "/invoices" })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Overdue Invoices</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{riskIndicators.overdueInvoices}</p>
                  <p className="text-xs text-slate-400">Past due date</p>
                </div>
              )}
              
              {riskIndicators.expiringSows > 0 && (
                <div 
                  className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-colors"
                  onClick={() => go({ to: "/statementofworks" })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Expiring SOWs</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{riskIndicators.expiringSows}</p>
                  <p className="text-xs text-slate-400">Within 14 days</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Button 
          className="h-auto py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500"
          onClick={() => go({ to: "/analytics-hub" })}
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Full Analytics</div>
            <div className="text-xs opacity-80">View all reports</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-yellow-500/30 hover:bg-yellow-500/10"
          onClick={() => go({ to: "/purchaseorders" })}
        >
          <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Budget Overview</div>
            <div className="text-xs text-slate-400">${(totalBudget / 1000000).toFixed(1)}M total</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-yellow-500/30 hover:bg-yellow-500/10"
          onClick={() => go({ to: "/alerts" })}
        >
          <Shield className="h-5 w-5 mr-2 text-yellow-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Risk Management</div>
            <div className="text-xs text-slate-400">{riskLevel} risk level</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
