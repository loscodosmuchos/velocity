import { useGo } from "@refinedev/core";
import { 
  Package, 
  DollarSign, 
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
  Clock,
  Star,
  AlertOctagon,
  RefreshCw
} from "lucide-react";
import { PremiumKPICard, PremiumMetricRow, PremiumKPIGrid, PremiumSecondaryGrid } from "@/components/premium-kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isStatus, asCurrencyNumber, safePercent } from "@/lib/utils";
import type { PurchaseOrder, Contractor, StatementOfWork, Invoice } from "@/types";

interface WesDashboardViewProps {
  purchaseOrders: PurchaseOrder[];
  contractors: Contractor[];
  sows: StatementOfWork[];
  invoices: Invoice[];
}

export function WesDashboardView({ 
  purchaseOrders, 
  contractors,
  sows,
  invoices
}: WesDashboardViewProps) {
  const go = useGo();

  const activePOs = purchaseOrders.filter((po) => isStatus(po.status, "active")).length;
  const pendingPOs = purchaseOrders.filter((po) => isStatus(po.status, "pending")).length;
  const totalPOValue = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.totalAmount), 0);
  const totalSpent = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.amountSpent), 0);
  const spendRate = safePercent(totalSpent, totalPOValue);

  const posWithoutBuyer = purchaseOrders.filter((po) => isStatus(po.status, "active") && !po.buyerId).length;

  const activeContractors = contractors.filter(c => isStatus(c.status, "active")).length;
  const vendorPerformance = {
    excellent: activeContractors,
    total: contractors.length,
    score: contractors.length > 0 ? Math.round((activeContractors / contractors.length) * 100) : 0
  };

  const activeSows = sows.filter(s => isStatus(s.status, "active"));
  const expiringSows = activeSows.filter(s => {
    if (s.endDate) {
      const daysUntilExpiry = Math.ceil((new Date(s.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }
    return false;
  });

  const maverickSpend = invoices.filter(inv => !(inv as any).poId && !(inv as any).purchaseOrderId).reduce((sum, inv) => sum + asCurrencyNumber((inv as any).actualAmount, inv.requestedAmount, (inv as any).amount), 0);
  const maverickCount = invoices.filter(inv => !(inv as any).poId && !(inv as any).purchaseOrderId).length;

  const posAtRisk = purchaseOrders.filter(po => {
    const spent = asCurrencyNumber(po.amountSpent);
    const total = asCurrencyNumber(po.totalAmount);
    return safePercent(spent, total) > 85 && isStatus(po.status, "active");
  });

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-purple-500 pl-4 py-2">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Wes's View: Procurement
        </h3>
        <p className="text-sm text-slate-400">
          Focus on PO management, vendor performance, and contract compliance
        </p>
      </div>

      <PremiumKPIGrid>
        <PremiumKPICard
          title="Active POs"
          value={activePOs}
          subtitle={`${pendingPOs} pending approval`}
          icon={Package}
          accentColor="sapphire"
          utilization={purchaseOrders.length > 0 ? (activePOs / purchaseOrders.length) * 100 : 0}
          trend={activePOs > 5 ? "up" : "neutral"}
          trendValue={activePOs > 5 ? "+3" : ""}
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumKPICard
          title="Spend Rate"
          value={`${spendRate.toFixed(0)}%`}
          subtitle={`$${(totalSpent / 1000).toFixed(0)}k of $${(totalPOValue / 1000).toFixed(0)}k`}
          icon={TrendingUp}
          accentColor={spendRate > 85 ? "ruby" : spendRate > 70 ? "amber" : "emerald"}
          sparklineData={[45, 52, 58, 62, 68, Math.min(spendRate, 100)]}
          trend={spendRate > 50 ? "up" : "neutral"}
          trendValue={spendRate > 50 ? "+5.2%" : ""}
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumKPICard
          title="Vendor Performance"
          value={`${vendorPerformance.score}%`}
          subtitle={`${vendorPerformance.excellent} of ${vendorPerformance.total} active`}
          icon={Star}
          accentColor={vendorPerformance.score > 80 ? "emerald" : vendorPerformance.score > 60 ? "amber" : "ruby"}
          utilization={vendorPerformance.score}
          onClick={() => go({ to: "/contractors" })}
        />
        
        <PremiumKPICard
          title="Compliance Status"
          value={posWithoutBuyer === 0 ? "100%" : `${Math.round(((activePOs - posWithoutBuyer) / Math.max(activePOs, 1)) * 100)}%`}
          subtitle={posWithoutBuyer > 0 ? `${posWithoutBuyer} POs need buyer` : "All compliant"}
          icon={Shield}
          accentColor={posWithoutBuyer === 0 ? "emerald" : "amber"}
          miniBarData={[activePOs - posWithoutBuyer, posWithoutBuyer, pendingPOs]}
          trend={posWithoutBuyer === 0 ? "up" : "down"}
          trendValue={posWithoutBuyer === 0 ? "100%" : `-${posWithoutBuyer}`}
          onClick={() => go({ to: "/purchaseorders" })}
        />
      </PremiumKPIGrid>

      <PremiumSecondaryGrid>
        <PremiumMetricRow
          title="Total PO Value"
          value={`$${(totalPOValue / 1000000).toFixed(1)}M`}
          subtitle="across all POs"
          icon={DollarSign}
          accentColor="sapphire"
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumMetricRow
          title="Expiring Contracts"
          value={expiringSows.length}
          subtitle="within 30 days"
          icon={Clock}
          accentColor={expiringSows.length > 0 ? "amber" : "emerald"}
          status={expiringSows.length > 3 ? "warning" : "healthy"}
          onClick={() => go({ to: "/statementofworks" })}
        />

        <PremiumMetricRow
          title="Maverick Spend"
          value={`$${(maverickSpend / 1000).toFixed(0)}k`}
          subtitle={`${maverickCount} invoices without PO`}
          icon={AlertOctagon}
          accentColor={maverickSpend > 0 ? "ruby" : "emerald"}
          status={maverickSpend > 10000 ? "critical" : maverickSpend > 0 ? "warning" : "healthy"}
          onClick={() => go({ to: "/invoices" })}
        />

        <PremiumMetricRow
          title="Active Vendors"
          value={vendorPerformance.excellent}
          subtitle="performing well"
          icon={Users}
          accentColor="platinum"
          onClick={() => go({ to: "/contractors" })}
        />
      </PremiumSecondaryGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-400" />
              PO Pipeline
            </CardTitle>
            <CardDescription className="text-slate-400">
              Purchase orders by status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Active</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {activePOs}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-sm font-medium text-white">Pending</span>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {pendingPOs}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-medium text-white">At Risk (85%+)</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {posAtRisk.length}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                onClick={() => go({ to: "/purchaseorders" })}
              >
                View All POs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-400" />
              Vendor Scorecard
            </CardTitle>
            <CardDescription className="text-slate-400">
              Top performing vendors
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {contractors.filter(c => c.status === "Active").slice(0, 5).map((contractor, idx) => (
              <div 
                key={contractor.id || idx}
                className="flex items-center justify-between p-3 mb-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-colors cursor-pointer"
                onClick={() => go({ to: `/contractors/show/${contractor.id}` })}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {contractor.firstName} {contractor.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{(contractor as any).jobTitle || (contractor as any).title || 'Contractor'}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Active
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-amber-400" />
              Contract Renewals
            </CardTitle>
            <CardDescription className="text-slate-400">
              SOWs expiring within 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {expiringSows.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">No urgent renewals</p>
                <p className="text-slate-500 text-sm">All contracts on schedule</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expiringSows.slice(0, 4).map((sow, idx) => {
                  const daysLeft = sow.endDate 
                    ? Math.ceil((new Date(sow.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : 0;
                  return (
                    <div 
                      key={sow.id || idx}
                      className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-colors"
                      onClick={() => go({ to: `/statementofworks/show/${sow.id}` })}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{sow.sowNumber}</p>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          {daysLeft} days
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        Expires: {sow.endDate ? new Date(sow.endDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-400" />
              Maverick Spend
            </CardTitle>
            <CardDescription className="text-slate-400">
              Invoices without associated POs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {maverickCount === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">No maverick spend</p>
                <p className="text-slate-500 text-sm">All invoices have POs</p>
              </div>
            ) : (
              <div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Total Maverick Spend</span>
                    <span className="text-xl font-bold text-red-400">${(maverickSpend / 1000).toFixed(1)}k</span>
                  </div>
                  <p className="text-xs text-slate-400">{maverickCount} invoices require attention</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => go({ to: "/invoices" })}
                >
                  Review Maverick Spend
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button 
          className="h-auto py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          onClick={() => go({ to: "/purchaseorders" })}
        >
          <Package className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Manage POs</div>
            <div className="text-xs opacity-80">{activePOs} active</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-purple-500/30 hover:bg-purple-500/10"
          onClick={() => go({ to: "/contractors" })}
        >
          <Users className="h-5 w-5 mr-2 text-purple-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Vendor Management</div>
            <div className="text-xs text-slate-400">{vendorPerformance.total} vendors</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-purple-500/30 hover:bg-purple-500/10"
          onClick={() => go({ to: "/statementofworks" })}
        >
          <FileText className="h-5 w-5 mr-2 text-purple-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Contract Review</div>
            <div className="text-xs text-slate-400">{activeSows.length} active</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
