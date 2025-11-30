import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataQualityMetric } from "@/types";
import { TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportDataQualityToCSV } from "@/utils/export-audit";

export const DataQualityDashboardPage = () => {
  const { data: metricsData, isLoading } = useList<DataQualityMetric>({
    resource: "dataqualitymetrics",
    pagination: { pageSize: 100 },
  });

  const metrics = metricsData?.data || [];

  const handleExport = () => {
    if (metrics.length > 0) {
      exportDataQualityToCSV(metrics);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "default";
      case "Warning":
        return "default";
      case "Critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Good":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "Critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const categorizeMetrics = (category: string) => {
    return metrics.filter((m) => m.category === category);
  };

  const calculateOverallHealth = () => {
    if (metrics.length === 0) return 0;
    const totalScore = metrics.reduce((acc, metric) => {
      const percentage = (metric.currentValue / metric.targetValue) * 100;
      return acc + Math.min(percentage, 100);
    }, 0);
    return Math.round(totalScore / metrics.length);
  };

  const criticalCount = metrics.filter((m) => m.status === "Critical").length;
  const warningCount = metrics.filter((m) => m.status === "Warning").length;
  const goodCount = metrics.filter((m) => m.status === "Good").length;

  if (isLoading) {
    return <div>Loading data quality metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Quality Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor data completeness, accuracy, and consistency across the system
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallHealth()}%</div>
            <Progress value={calculateOverallHealth()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{criticalCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{warningCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Good Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{goodCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Metrics</TabsTrigger>
          <TabsTrigger value="completeness">Completeness</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="consistency">Consistency</TabsTrigger>
          <TabsTrigger value="timeliness">Timeliness</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <MetricsGrid metrics={metrics} />
        </TabsContent>

        <TabsContent value="completeness" className="space-y-4">
          <MetricsGrid metrics={categorizeMetrics("Completeness")} />
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <MetricsGrid metrics={categorizeMetrics("Accuracy")} />
        </TabsContent>

        <TabsContent value="consistency" className="space-y-4">
          <MetricsGrid metrics={categorizeMetrics("Consistency")} />
        </TabsContent>

        <TabsContent value="timeliness" className="space-y-4">
          <MetricsGrid metrics={categorizeMetrics("Timeliness")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MetricsGrid = ({ metrics }: { metrics: DataQualityMetric[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "default";
      case "Warning":
        return "default";
      case "Critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Good":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "Warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "Critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const percentage =
          metric.unit === "Percentage" ? metric.currentValue : (metric.currentValue / metric.targetValue) * 100;

        return (
          <Card key={metric.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{metric.metricName}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {metric.entityType} - {metric.category}
                  </CardDescription>
                </div>
                {getStatusIcon(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.currentValue}
                    {metric.unit === "Percentage" && "%"}
                  </span>
                  <Badge variant={getStatusColor(metric.status) as any}>{metric.status}</Badge>
                </div>

                <Progress value={percentage} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Target: {metric.targetValue}
                    {metric.unit === "Percentage" && "%"}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-muted-foreground">{metric.trend}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
