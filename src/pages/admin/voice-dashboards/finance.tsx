/**
 * Voice-Enabled Finance Dashboard
 * Voice-powered budget queries and financial tracking
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { VoiceNarrator } from "@/utils/voice-commander";
import { useList } from "@refinedev/core";
import type { PurchaseOrder, Invoice } from "@/types";

export default function FinanceVoiceDashboard() {
  const [narrator] = useState(() => new VoiceNarrator());
  const [isNarrating, setIsNarrating] = useState(false);

  const { data: posData } = useList<PurchaseOrder>({ resource: "purchase_orders", pagination: { pageSize: 100 } });
  const { data: invoicesData } = useList<Invoice>({ resource: "invoices", pagination: { pageSize: 100 } });

  const pos = posData?.data || [];
  const invoices = invoicesData?.data || [];

  const totalBudget = pos.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = pos.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const burnRate = ((totalSpent / totalBudget) * 100).toFixed(1);

  const pendingInvoices = invoices.filter((i) => i.status === "Submitted" || i.status === "GR Approved");
  const paidInvoices = invoices.filter((i) => i.status === "Paid");

  const narrateDashboard = async () => {
    setIsNarrating(true);
    await narrator.speakBrowser(
      `Finance Dashboard. Total budget: ${totalBudget.toLocaleString()} dollars. Spent: ${totalSpent.toLocaleString()} dollars. Remaining: ${remainingBudget.toLocaleString()} dollars. Burn rate: ${burnRate} percent. You have ${pendingInvoices.length} pending invoices.`,
    );
    setIsNarrating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">💵 Finance Voice Dashboard</h1>
          <p className="text-muted-foreground">Voice-powered budget queries and financial insights</p>
        </div>
        <Button onClick={narrateDashboard} disabled={isNarrating} size="lg">
          <Volume2 className="h-4 w-4 mr-2" />
          {isNarrating ? "Speaking..." : "Narrate Dashboard"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{burnRate}% burn rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${remainingBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingInvoices.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Financial Queries</CardTitle>
          <CardDescription>Ask questions about budgets and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"What's my spending?"</p>
              <p className="text-sm text-muted-foreground">Get budget summary</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show pending invoices"</p>
              <p className="text-sm text-muted-foreground">List unpaid invoices</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"What's the burn rate?"</p>
              <p className="text-sm text-muted-foreground">Budget usage percentage</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-medium">"Show top expenses"</p>
              <p className="text-sm text-muted-foreground">Highest spending areas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Active PO spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pos.slice(0, 5).map((po) => (
                <div key={po.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{po.poNumber}</p>
                    <p className="text-sm text-muted-foreground">{po.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${po.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">${(Number(po.amountRemaining) || 0).toLocaleString()} left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                  </div>
                  <p className="font-medium">${invoice.requestedAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
