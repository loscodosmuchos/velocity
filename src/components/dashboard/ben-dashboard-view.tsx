import { useGo } from "@refinedev/core";
import { 
  Users, 
  DollarSign, 
  Clock, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  Target,
  Activity
} from "lucide-react";
import { PremiumKPICard, PremiumMetricRow, PremiumKPIGrid, PremiumSecondaryGrid } from "@/components/premium-kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isStatus, asCurrencyNumber, safePercent } from "@/lib/utils";
import type { Contractor, PurchaseOrder, Timecard, StatementOfWork, ChangeOrder } from "@/types";

interface BenDashboardViewProps {
  contractors: Contractor[];
  purchaseOrders: PurchaseOrder[];
  timecards: Timecard[];
  sows: StatementOfWork[];
  changeOrders: ChangeOrder[];
}

export function BenDashboardView({ 
  contractors, 
  purchaseOrders, 
  timecards, 
  sows,
  changeOrders 
}: BenDashboardViewProps) {
  const go = useGo();

  const activeContractors = contractors.filter((c) => isStatus(c.status, "active")).length;
  const pendingTimecards = timecards.filter((t) => isStatus(t.status, "pending")).length;
  const approvedTimecards = timecards.filter((t) => isStatus(t.status, "approved")).length;
  const pendingChangeOrders = changeOrders.filter((co) => isStatus(co.status, "pending")).length;

  const totalBudget = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.totalAmount), 0);
  const totalSpent = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.amountSpent), 0);
  const budgetUtilization = safePercent(totalSpent, totalBudget);

  const activeSows = sows.filter(s => isStatus(s.status, "active"));
  const sowsAtRisk = activeSows.filter(s => {
    const burnRate = safePercent(s.invoicedAmount, s.totalValue);
    return burnRate > 85;
  });

  const recentTimecards = timecards
    .filter(t => isStatus(t.status, "pending"))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-cyan-500 pl-4 py-2">
        <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Ben's View: Hiring Manager / Project Lead
        </h3>
        <p className="text-sm text-slate-400">
          Focus on project budgets, pending approvals, and contractor utilization
        </p>
      </div>

      <PremiumKPIGrid>
        <PremiumKPICard
          title="Active Contractors"
          value={activeContractors}
          subtitle={`of ${contractors.length} total`}
          icon={Users}
          accentColor="sapphire"
          utilization={contractors.length > 0 ? Math.round((activeContractors / contractors.length) * 100) : 0}
          trend={activeContractors > contractors.length * 0.6 ? "up" : "neutral"}
          trendValue={activeContractors > contractors.length * 0.6 ? "+8%" : ""}
          onClick={() => go({ to: "/contractors" })}
        />
        
        <PremiumKPICard
          title="Pending Timecards"
          value={pendingTimecards}
          subtitle={pendingTimecards > 5 ? "Needs immediate attention" : "Within normal range"}
          icon={Clock}
          accentColor={pendingTimecards > 5 ? "amber" : "sapphire"}
          miniBarData={[approvedTimecards, pendingTimecards, Math.max(1, pendingTimecards - 2)]}
          trend={pendingTimecards > 5 ? "up" : "down"}
          trendValue={pendingTimecards > 5 ? `+${pendingTimecards - 3}` : "-2"}
          onClick={() => go({ to: "/timecards" })}
        />
        
        <PremiumKPICard
          title="Budget vs Actual"
          value={`${budgetUtilization.toFixed(0)}%`}
          subtitle={`$${(totalSpent / 1000).toFixed(0)}k of $${(totalBudget / 1000).toFixed(0)}k`}
          icon={DollarSign}
          accentColor={budgetUtilization > 85 ? "ruby" : budgetUtilization > 70 ? "amber" : "emerald"}
          utilization={Math.min(budgetUtilization, 100)}
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumKPICard
          title="SOW Burn Rate"
          value={`${sowsAtRisk.length} at Risk`}
          subtitle={`of ${activeSows.length} active SOWs`}
          icon={TrendingUp}
          accentColor={sowsAtRisk.length > 0 ? "ruby" : "emerald"}
          sparklineData={activeSows.slice(0, 6).map(s => s.totalValue > 0 ? (s.invoicedAmount / s.totalValue) * 100 : 0)}
          trend={sowsAtRisk.length > 0 ? "up" : "down"}
          trendValue={sowsAtRisk.length > 0 ? `+${sowsAtRisk.length}` : "0"}
          onClick={() => go({ to: "/statementofworks" })}
        />
      </PremiumKPIGrid>

      <PremiumSecondaryGrid>
        <PremiumMetricRow
          title="Approved Timecards"
          value={approvedTimecards}
          subtitle="this period"
          icon={CheckCircle}
          accentColor="emerald"
          status="healthy"
          trend="up"
          trendValue="+15%"
          sparklineData={[12, 15, 18, 14, 20, approvedTimecards]}
          onClick={() => go({ to: "/timecards" })}
        />
        
        <PremiumMetricRow
          title="Pending Change Orders"
          value={pendingChangeOrders}
          subtitle={pendingChangeOrders > 0 ? "awaiting review" : "none pending"}
          icon={FileText}
          accentColor={pendingChangeOrders > 0 ? "amber" : "platinum"}
          status={pendingChangeOrders > 3 ? "warning" : "healthy"}
          progress={pendingChangeOrders > 0 ? Math.min(pendingChangeOrders * 20, 100) : 0}
          showSegments={true}
          segments={5}
          onClick={() => go({ to: "/changeorders" })}
        />

        <PremiumMetricRow
          title="Contractor Utilization"
          value={`${activeContractors > 0 ? Math.round((activeContractors / Math.max(contractors.length, 1)) * 100) : 0}%`}
          icon={Activity}
          accentColor="sapphire"
          progress={activeContractors > 0 ? (activeContractors / Math.max(contractors.length, 1)) * 100 : 0}
          trend="up"
          trendValue="+5%"
          onClick={() => go({ to: "/contractors" })}
        />

        <PremiumMetricRow
          title="Active SOWs"
          value={activeSows.length}
          subtitle="in progress"
          icon={Target}
          accentColor="platinum"
          sparklineData={[3, 4, 5, 4, 6, activeSows.length]}
          onClick={() => go({ to: "/statementofworks" })}
        />
      </PremiumSecondaryGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-cyan-400" />
              Approvals Queue
            </CardTitle>
            <CardDescription className="text-slate-400">
              Timecards awaiting your approval
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {recentTimecards.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">All caught up!</p>
                <p className="text-slate-500 text-sm">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTimecards.map((tc, idx) => (
                  <div 
                    key={tc.id || idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer"
                    onClick={() => go({ to: `/timecards/show/${tc.id}` })}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {(tc as any).contractorName || `Timecard #${tc.id}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(tc as any).weekEnding ? new Date((tc as any).weekEnding).toLocaleDateString() : 'Week ending TBD'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">
                        {(tc as any).totalHours || 0} hrs
                      </p>
                      <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  onClick={() => go({ to: "/timecards?status=Pending" })}
                >
                  View All Pending ({pendingTimecards})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Budget Alerts
            </CardTitle>
            <CardDescription className="text-slate-400">
              Projects approaching budget limits
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {purchaseOrders.filter(po => {
              const spent = Number(po.amountSpent) || 0;
              const total = Number(po.totalAmount) || 1;
              return (spent / total) * 100 > 75;
            }).slice(0, 4).map((po, idx) => {
              const spent = Number(po.amountSpent) || 0;
              const total = Number(po.totalAmount) || 1;
              const utilization = (spent / total) * 100;
              
              return (
                <div 
                  key={po.id || idx}
                  className="mb-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors cursor-pointer"
                  onClick={() => go({ to: `/purchaseorders/show/${po.id}` })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{po.poNumber}</p>
                    <Badge 
                      className={utilization > 90 
                        ? "bg-red-500/20 text-red-400 border-red-500/30" 
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }
                    >
                      {utilization.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(utilization, 100)} 
                    className="h-2 bg-slate-700"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    ${(spent/1000).toFixed(1)}k of ${(total/1000).toFixed(1)}k
                  </p>
                </div>
              );
            })}
            {purchaseOrders.filter(po => {
              const spent = Number(po.amountSpent) || 0;
              const total = Number(po.totalAmount) || 1;
              return (spent / total) * 100 > 75;
            }).length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">All budgets healthy</p>
                <p className="text-slate-500 text-sm">No alerts at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button 
          className="h-auto py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          onClick={() => go({ to: "/timecards?status=Pending" })}
        >
          <Clock className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Approve Timecards</div>
            <div className="text-xs opacity-80">{pendingTimecards} pending</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-cyan-500/30 hover:bg-cyan-500/10"
          onClick={() => go({ to: "/contractors" })}
        >
          <Users className="h-5 w-5 mr-2 text-cyan-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Manage Contractors</div>
            <div className="text-xs text-slate-400">{activeContractors} active</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-cyan-500/30 hover:bg-cyan-500/10"
          onClick={() => go({ to: "/statementofworks" })}
        >
          <FileText className="h-5 w-5 mr-2 text-cyan-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Review SOWs</div>
            <div className="text-xs text-slate-400">{activeSows.length} active</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
