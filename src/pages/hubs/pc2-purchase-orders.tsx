import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGo } from "@refinedev/core";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertTriangle,
  Package,
  Plus,
  ExternalLink,
} from "lucide-react";
import type { PurchaseOrder, Contractor, POContractor } from "@/types";

export function PC2PurchaseOrdersHub() {
  const go = useGo();

  const { data: posData, isLoading: posLoading } = useList<PurchaseOrder>({
    resource: "purchase_orders",
  });

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
  });

  const { data: poContractorsData } = useList<POContractor>({
    resource: "pocontractors",
  });

  const pos = posData?.data || [];
  const contractors = contractorsData?.data || [];
  const poContractors = poContractorsData?.data || [];

  // Calculate metrics
  const totalPOs = pos.length;
  const activePOs = pos.filter((po) => po.status === "Active").length;
  const totalBudget = pos.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
  const totalRemaining = pos.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);
  const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Risk analysis
  const atRiskPOs = pos.filter((po) => {
    const total = Number(po.totalAmount) || 0;
    const spent = Number(po.amountSpent) || 0;
    const utilization = total > 0 ? (spent / total) * 100 : 0;
    return utilization > 90 && po.status === "Active";
  });

  const underUtilizedPOs = pos.filter((po) => {
    const total = Number(po.totalAmount) || 0;
    const spent = Number(po.amountSpent) || 0;
    const utilization = total > 0 ? (spent / total) * 100 : 0;
    return utilization < 20 && po.status === "Active";
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PC2 Procurement Hub</h1>
          <p className="text-muted-foreground mt-1">Centralized purchase order management and analytics</p>
        </div>
        <Button onClick={() => go({ to: "/purchase-orders/create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">{totalPOs} active purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">{utilizationRate.toFixed(1)}% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(totalRemaining)}
            </div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GR Balance</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(totalRemaining * 0.1)}
            </div>
            <p className="text-xs text-muted-foreground">Pending goods receipt</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      {(atRiskPOs.length > 0 || underUtilizedPOs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atRiskPOs.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  At-Risk POs ({atRiskPOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {atRiskPOs.slice(0, 3).map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {(Number(po.percentUsed) || 0).toFixed(0)}% utilized
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {underUtilizedPOs.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <FileText className="h-5 w-5" />
                  Under-Utilized POs ({underUtilizedPOs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {underUtilizedPOs.slice(0, 3).map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {(Number(po.percentUsed) || 0).toFixed(0)}% utilized
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Active POs by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Draft", "Pending", "Active", "Completed", "Cancelled"].map((status) => {
              const count = pos.filter((po) => po.status === status).length;
              const total = pos.filter((po) => po.status === status).reduce((sum, po) => sum + po.totalAmount, 0);
              return (
                <div key={status} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground mb-2">{status}</div>
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                    }).format(total)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent POs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Purchase Orders</CardTitle>
          <Button variant="outline" size="sm" onClick={() => go({ to: "/purchase-orders" })}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pos
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((po) => (
                <div
                  key={po.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => go({ to: `/purchase-orders/show/${po.id}` })}>
                  <div className="flex-1">
                    <p className="font-medium">{po.poNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(po.totalAmount) || 0)}{" "}
                      • {(Number(po.percentUsed) || 0).toFixed(0)}% utilized
                    </p>
                  </div>
                  <Badge
                    variant={
                      po.status === "Active"
                        ? "default"
                        : po.status === "Completed"
                          ? "secondary"
                          : po.status === "Cancelled"
                            ? "destructive"
                            : "outline"
                    }>
                    {po.status}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
