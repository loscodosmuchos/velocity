import { useGo } from "@refinedev/core";
import { 
  Receipt, 
  DollarSign, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  BarChart3,
  Calculator,
  Banknote
} from "lucide-react";
import { PremiumKPICard, PremiumMetricRow, PremiumKPIGrid, PremiumSecondaryGrid } from "@/components/premium-kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isStatus, asCurrencyNumber, safePercent } from "@/lib/utils";
import type { Invoice, PurchaseOrder, Timecard, Department } from "@/types";

interface MarkDashboardViewProps {
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  timecards: Timecard[];
  departments: Department[];
}

export function MarkDashboardView({ 
  invoices, 
  purchaseOrders, 
  timecards,
  departments
}: MarkDashboardViewProps) {
  const go = useGo();

  const pendingInvoices = invoices.filter((i) => isStatus(i.status, "submitted")).length;
  const grApprovedInvoices = invoices.filter((i) => isStatus(i.status, "gr approved")).length;
  const paidInvoices = invoices.filter((i) => isStatus(i.status, "paid")).length;
  const invoicesWithVariance = invoices.filter((i) => i.hasVariance).length;
  const totalInvoiceValue = invoices.reduce((sum, i) => sum + asCurrencyNumber(i.actualAmount, i.requestedAmount, (i as any).amount), 0);

  const totalBudget = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.totalAmount), 0);
  const totalSpent = purchaseOrders.reduce((sum, po) => sum + asCurrencyNumber(po.amountSpent), 0);
  const budgetUtilization = safePercent(totalSpent, totalBudget);
  const budgetRemaining = totalBudget - totalSpent;

  const varianceAmount = invoices
    .filter(i => i.hasVariance)
    .reduce((sum, i) => {
      const actual = asCurrencyNumber(i.actualAmount, i.requestedAmount);
      const requested = asCurrencyNumber(i.requestedAmount, i.actualAmount);
      return sum + Math.abs(actual - requested);
    }, 0);

  const recentInvoices = invoices
    .filter(i => isStatus(i.status, "submitted"))
    .slice(0, 5);

  const overdueInvoices = invoices.filter(inv => {
    if (isStatus(inv.status, 'submitted') && inv.dueDate) {
      return new Date(inv.dueDate) < new Date();
    }
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-amber-500 pl-4 py-2">
        <h3 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Mark's View: PM Support Specialist
        </h3>
        <p className="text-sm text-slate-400">
          Assisting Ben with PM tasks - invoices, payments, budget tracking, and spend visibility
        </p>
      </div>

      <PremiumKPIGrid>
        <PremiumKPICard
          title="Invoice Volume"
          value={invoices.length}
          subtitle={`${pendingInvoices} pending • ${paidInvoices} paid`}
          icon={Receipt}
          accentColor="amber"
          onClick={() => go({ to: "/invoices" })}
        />
        
        <PremiumKPICard
          title="Payment Status"
          value={`${paidInvoices}/${invoices.length}`}
          subtitle={overdueInvoices.length > 0 ? `${overdueInvoices.length} overdue` : "All on schedule"}
          icon={CreditCard}
          accentColor={overdueInvoices.length > 0 ? "ruby" : "emerald"}
          utilization={invoices.length > 0 ? (paidInvoices / invoices.length) * 100 : 0}
          onClick={() => go({ to: "/invoices" })}
        />
        
        <PremiumKPICard
          title="Budget Utilization"
          value={`${budgetUtilization.toFixed(0)}%`}
          subtitle={`$${(budgetRemaining / 1000).toFixed(0)}k remaining`}
          icon={DollarSign}
          accentColor={budgetUtilization > 85 ? "ruby" : budgetUtilization > 70 ? "amber" : "emerald"}
          utilization={Math.min(budgetUtilization, 100)}
          onClick={() => go({ to: "/purchaseorders" })}
        />
        
        <PremiumKPICard
          title="Variance Amount"
          value={`$${(varianceAmount / 1000).toFixed(1)}k`}
          subtitle={`${invoicesWithVariance} invoices with variance`}
          icon={AlertTriangle}
          accentColor={invoicesWithVariance > 0 ? "amber" : "emerald"}
          onClick={() => go({ to: "/invoices?hasVariance=true" })}
        />
      </PremiumKPIGrid>

      <PremiumSecondaryGrid>
        <PremiumMetricRow
          title="GR Approved"
          value={grApprovedInvoices}
          subtitle="ready for payment"
          icon={CheckCircle}
          accentColor="emerald"
          status="healthy"
          onClick={() => go({ to: "/invoices?status=GR Approved" })}
        />
        
        <PremiumMetricRow
          title="Pending Review"
          value={pendingInvoices}
          subtitle={pendingInvoices > 10 ? "high volume" : "normal volume"}
          icon={Clock}
          accentColor={pendingInvoices > 10 ? "amber" : "platinum"}
          status={pendingInvoices > 10 ? "warning" : "healthy"}
          onClick={() => go({ to: "/invoices?status=Submitted" })}
        />

        <PremiumMetricRow
          title="Total Invoice Value"
          value={`$${(totalInvoiceValue / 1000).toFixed(0)}k`}
          icon={Banknote}
          accentColor="amber"
          onClick={() => go({ to: "/invoices" })}
        />

        <PremiumMetricRow
          title="Overdue Invoices"
          value={overdueInvoices.length}
          subtitle={overdueInvoices.length > 0 ? "action required" : "all current"}
          icon={AlertTriangle}
          accentColor={overdueInvoices.length > 0 ? "ruby" : "emerald"}
          status={overdueInvoices.length > 0 ? "critical" : "healthy"}
          onClick={() => go({ to: "/invoices" })}
        />
      </PremiumSecondaryGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <Receipt className="h-5 w-5 text-amber-400" />
              Invoice Queue
            </CardTitle>
            <CardDescription className="text-slate-400">
              Invoices awaiting processing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">All processed!</p>
                <p className="text-slate-500 text-sm">No pending invoices</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInvoices.map((inv, idx) => (
                  <div 
                    key={inv.id || idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors cursor-pointer"
                    onClick={() => go({ to: `/invoices/show/${inv.id}` })}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {inv.invoiceNumber || `Invoice #${inv.id}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(inv as any).vendorName || 'Vendor TBD'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-400">
                        ${(asCurrencyNumber(inv.actualAmount, inv.requestedAmount, (inv as any).amount) / 1000).toFixed(1)}k
                      </p>
                      {inv.hasVariance && (
                        <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                          Variance
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => go({ to: "/invoices?status=Submitted" })}
                >
                  View All Pending ({pendingInvoices})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-400" />
              Budget Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              Department spend overview
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {departments.slice(0, 4).map((dept, idx) => {
              const deptPOs = purchaseOrders.filter((po) => po.department === dept.name);
              const spent = deptPOs.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
              const budget = Number(dept.budget) || 0;
              const utilization = budget > 0 ? (spent / budget) * 100 : 0;
              
              return (
                <div 
                  key={dept.id || idx}
                  className="mb-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{dept.name}</p>
                    <Badge 
                      className={utilization > 90 
                        ? "bg-red-500/20 text-red-400 border-red-500/30" 
                        : utilization > 75
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {utilization.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(utilization, 100)} 
                    className="h-2 bg-slate-700"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>${(spent/1000).toFixed(1)}k spent</span>
                    <span>${(budget/1000).toFixed(1)}k budget</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Reconciliation Alerts
          </CardTitle>
          <CardDescription className="text-slate-400">
            Invoices with variances requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {invoicesWithVariance === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">All reconciled</p>
              <p className="text-slate-500 text-sm">No variance issues detected</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {invoices.filter(i => i.hasVariance).slice(0, 6).map((inv, idx) => {
                const variance = (inv.actualAmount || 0) - (inv.requestedAmount || 0);
                return (
                  <div 
                    key={inv.id || idx}
                    className="p-3 rounded-lg bg-slate-800/50 border border-red-500/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => go({ to: `/invoices/show/${inv.id}` })}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">{inv.invoiceNumber}</p>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {variance > 0 ? '+' : ''}{((variance) / 1000).toFixed(1)}k
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{(inv as any).vendorName || 'Vendor TBD'}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Button 
          className="h-auto py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
          onClick={() => go({ to: "/invoices?status=Submitted" })}
        >
          <Receipt className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Process Invoices</div>
            <div className="text-xs opacity-80">{pendingInvoices} pending</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-amber-500/30 hover:bg-amber-500/10"
          onClick={() => go({ to: "/invoices?status=GR Approved" })}
        >
          <CreditCard className="h-5 w-5 mr-2 text-amber-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Schedule Payments</div>
            <div className="text-xs text-slate-400">{grApprovedInvoices} ready</div>
          </div>
        </Button>
        
        <Button 
          variant="outline"
          className="h-auto py-4 border-amber-500/30 hover:bg-amber-500/10"
          onClick={() => go({ to: "/analytics-hub" })}
        >
          <Calculator className="h-5 w-5 mr-2 text-amber-400" />
          <div className="text-left">
            <div className="font-semibold text-white">Budget Reports</div>
            <div className="text-xs text-slate-400">View analytics</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
