import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGo } from "@refinedev/core";
import { Users, Clock, CheckCircle, AlertCircle, DollarSign, FileText, Plus, ExternalLink } from "lucide-react";
import type { Timecard, Invoice, Contractor } from "@/types";

export function PC3WorkforceHub() {
  const go = useGo();

  const { data: timecardsData } = useList<Timecard>({
    resource: "timecards",
  });

  const { data: invoicesData } = useList<Invoice>({
    resource: "invoices",
  });

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
  });

  const timecards = timecardsData?.data || [];
  const invoices = invoicesData?.data || [];
  const contractors = contractorsData?.data || [];

  // Timecard metrics
  const pendingTimecards = timecards.filter((tc) => tc.status === "Pending").length;
  const approvedTimecards = timecards.filter((tc) => tc.status === "Approved").length;
  const rejectedTimecards = timecards.filter((tc) => tc.status === "Rejected").length;
  const totalHours = timecards.reduce((sum, tc) => sum + tc.hours, 0);
  const totalTimecardValue = timecards.reduce((sum, tc) => sum + tc.totalAmount, 0);

  // Invoice metrics
  const submittedInvoices = invoices.filter((inv) => inv.status === "Submitted").length;
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid").length;
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + inv.actualAmount, 0);
  const totalGRBalance = invoices.reduce((sum, inv) => sum + inv.grBalance, 0);

  // Active contractors
  const activeContractors = contractors.filter((c) => c.status === "Active").length;

  // Contractors with pending actions
  const contractorsWithPendingTimecards = new Set(
    timecards.filter((tc) => tc.status === "Pending").map((tc) => tc.contractorId),
  ).size;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PC3 Workforce Hub</h1>
          <p className="text-muted-foreground mt-1">Manage timecards, invoices, and contractor activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go({ to: "/timecards/create" })}>
            <Plus className="h-4 w-4 mr-2" />
            New Timecard
          </Button>
          <Button onClick={() => go({ to: "/invoices/generate" })}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contractors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContractors}</div>
            <p className="text-xs text-muted-foreground">{contractors.length} total contractors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{timecards.length} timecards submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(totalInvoiceValue)}
            </div>
            <p className="text-xs text-muted-foreground">{invoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTimecards + submittedInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTimecards} timecards, {submittedInvoices} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Required */}
      {(pendingTimecards > 0 || submittedInvoices > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingTimecards > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  Pending Timecards ({pendingTimecards})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {contractorsWithPendingTimecards} contractors waiting for approval
                </p>
                <Button size="sm" onClick={() => go({ to: "/timecards/pending" })}>
                  Review Timecards
                </Button>
              </CardContent>
            </Card>
          )}

          {submittedInvoices > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <FileText className="h-5 w-5" />
                  Submitted Invoices ({submittedInvoices})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Awaiting goods receipt approval</p>
                <Button size="sm" variant="outline" onClick={() => go({ to: "/invoices" })}>
                  Review Invoices
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Timecard & Invoice Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Timecard Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Pending</span>
                </div>
                <Badge variant="secondary">{pendingTimecards}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Approved</span>
                </div>
                <Badge variant="default">{approvedTimecards}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Rejected</span>
                </div>
                <Badge variant="destructive">{rejectedTimecards}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Draft", "Submitted", "GR Approved", "Paid"].map((status) => {
                const count = invoices.filter((inv) => inv.status === status).length;
                const total = invoices
                  .filter((inv) => inv.status === status)
                  .reduce((sum, inv) => sum + inv.actualAmount, 0);
                return (
                  <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <span className="font-medium">{status}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(total)}
                      </p>
                    </div>
                    <Badge>{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Timecards</CardTitle>
          <Button variant="outline" size="sm" onClick={() => go({ to: "/timecards" })}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timecards
              .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
              .slice(0, 5)
              .map((tc) => {
                const contractor = contractors.find((c) => c.id === tc.contractorId);
                return (
                  <div
                    key={tc.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => go({ to: `/timecards/show/${tc.id}` })}>
                    <div className="flex-1">
                      <p className="font-medium">
                        {contractor
                          ? `${contractor.firstName} ${contractor.lastName}`
                          : `Contractor #${tc.contractorId}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tc.date} • {tc.hours}h •{" "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(tc.totalAmount)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        tc.status === "Approved" ? "default" : tc.status === "Rejected" ? "destructive" : "secondary"
                      }>
                      {tc.status}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
