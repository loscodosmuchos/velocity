import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemException, AuditLog, DataQualityMetric, Contractor, PurchaseOrder, Timecard, Invoice } from "@/types";
import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  Clock,
  Receipt,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { generateComplianceReport } from "@/utils/export-audit";

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const { data: exceptionsData } = useList<SystemException>({
    resource: "systemexceptions",
    filters: [{ field: "status", operator: "ne", value: "Resolved" }],
    pagination: { pageSize: 100 },
  });

  const { data: allExceptionsData } = useList<SystemException>({
    resource: "systemexceptions",
    pagination: { pageSize: 1000 },
  });

  const { data: auditLogsData } = useList<AuditLog>({
    resource: "audit_log",
    sorters: [{ field: "timestamp", order: "desc" }],
    pagination: { pageSize: 10 },
  });

  const { data: allAuditLogsData } = useList<AuditLog>({
    resource: "audit_log",
    pagination: { pageSize: 1000 },
  });

  const { data: metricsData } = useList<DataQualityMetric>({
    resource: "dataqualitymetrics",
    pagination: { pageSize: 100 },
  });

  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
    pagination: { pageSize: 1 },
  });

  const { data: posData } = useList<PurchaseOrder>({
    resource: "purchase_orders",
    pagination: { pageSize: 1 },
  });

  const { data: timecardsData } = useList<Timecard>({
    resource: "timecards",
    filters: [{ field: "status", operator: "eq", value: "Pending" }],
    pagination: { pageSize: 1 },
  });

  const { data: invoicesData } = useList<Invoice>({
    resource: "invoices",
    filters: [{ field: "hasVariance", operator: "eq", value: true }],
    pagination: { pageSize: 1 },
  });

  const exceptions = exceptionsData?.data || [];
  const recentAuditLogs = auditLogsData?.data || [];
  const metrics = metricsData?.data || [];

  const criticalExceptions = exceptions.filter((e) => e.severity === "Critical").length;
  const highExceptions = exceptions.filter((e) => e.severity === "High").length;
  const openExceptions = exceptions.filter((e) => e.status === "Open").length;

  const calculateOverallHealth = () => {
    if (metrics.length === 0) return 0;
    const totalScore = metrics.reduce((acc, metric) => {
      const percentage = (metric.currentValue / metric.targetValue) * 100;
      return acc + Math.min(percentage, 100);
    }, 0);
    return Math.round(totalScore / metrics.length);
  };

  const overallHealth = calculateOverallHealth();
  const criticalMetrics = metrics.filter((m) => m.status === "Critical").length;
  const warningMetrics = metrics.filter((m) => m.status === "Warning").length;

  const todayActivity = recentAuditLogs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;

  const handleExportCompliance = () => {
    if (allAuditLogsData?.data && allExceptionsData?.data && metricsData?.data) {
      generateComplianceReport(allAuditLogsData.data, allExceptionsData.data, metricsData.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Monitoring & Audit</h2>
          <p className="text-muted-foreground">Comprehensive system health, exceptions, and operational visibility</p>
        </div>
        <Button onClick={handleExportCompliance} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Generate Compliance Report
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallHealth >= 80 ? "Excellent" : overallHealth >= 60 ? "Good" : "Needs Attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Open Exceptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openExceptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalExceptions} critical, {highExceptions} high
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length - criticalMetrics - warningMetrics}
              <span className="text-sm text-muted-foreground">/{metrics.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {criticalMetrics} critical, {warningMetrics} warnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivity}</div>
            <p className="text-xs text-muted-foreground mt-1">System changes and actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Metrics</CardTitle>
          <CardDescription>Real-time system operational statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{contractorsData?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Total Contractors</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{posData?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Purchase Orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{timecardsData?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Timecards</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Receipt className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{invoicesData?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Invoice Variances</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Exceptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Exceptions</CardTitle>
                <CardDescription>Latest system exceptions requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/exceptions")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exceptions.slice(0, 5).map((exception) => (
                <div
                  key={exception.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate("/admin/exceptions")}>
                  {exception.severity === "Critical" ? (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={exception.severity === "Critical" ? "destructive" : "default"}>
                        {exception.severity}
                      </Badge>
                      <Badge variant="outline">{exception.exceptionType}</Badge>
                    </div>
                    <p className="text-sm font-medium">{exception.entityName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exception.description}</p>
                  </div>
                </div>
              ))}
              {exceptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No open exceptions</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system changes and actions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/audit-logs")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                  <Activity className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{log.action}</Badge>
                      <Badge variant="outline">{log.entityType}</Badge>
                    </div>
                    <p className="text-sm">
                      {log.performedByName} • {log.entityType} #{log.entityId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to monitoring and audit features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col items-start"
              onClick={() => navigate("/admin/audit-logs")}>
              <Activity className="h-5 w-5 mb-2" />
              <div className="text-left">
                <p className="font-semibold">Audit Logs</p>
                <p className="text-xs text-muted-foreground">View complete activity history</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col items-start"
              onClick={() => navigate("/admin/exceptions")}>
              <AlertTriangle className="h-5 w-5 mb-2" />
              <div className="text-left">
                <p className="font-semibold">System Exceptions</p>
                <p className="text-xs text-muted-foreground">Monitor and resolve issues</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col items-start"
              onClick={() => navigate("/admin/data-quality")}>
              <CheckCircle2 className="h-5 w-5 mb-2" />
              <div className="text-left">
                <p className="font-semibold">Data Quality</p>
                <p className="text-xs text-muted-foreground">Review data health metrics</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
