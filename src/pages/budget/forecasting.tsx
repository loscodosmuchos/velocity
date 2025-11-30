import { useList } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { BudgetForecast, Department } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function BudgetForecastingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q1");

  const { data: forecastData } = useList<BudgetForecast>({
    resource: "budgetforecasts",
  });
  const { data: departmentsData } = useList<Department>({
    resource: "departments",
  });

  const forecasts = forecastData?.data || [];
  const departments = departmentsData?.data || [];

  const getDepartmentName = (departmentId: number) => {
    return departments.find((d) => d.id === departmentId)?.name || "Unknown Department";
  };

  const getVarianceStatus = (variance: number) => {
    if (variance > 0) return { label: "Under Budget", color: "text-green-600", icon: TrendingDown };
    if (variance < -10000) return { label: "Over Budget", color: "text-red-600", icon: AlertCircle };
    return { label: "On Track", color: "text-yellow-600", icon: TrendingUp };
  };

  const totalBudgetAllocated = forecasts.reduce((sum, f) => sum + f.budgetAllocated, 0);
  const totalBudgetSpent = forecasts.reduce((sum, f) => sum + f.budgetSpent, 0);
  const totalBudgetCommitted = forecasts.reduce((sum, f) => sum + f.budgetCommitted, 0);
  const totalProjectedSpend = forecasts.reduce((sum, f) => sum + f.projectedSpend, 0);
  const totalVariance = totalBudgetAllocated - totalProjectedSpend;

  const utilizationPercentage = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0;

  return (
    <ListView>
      <ListViewHeader canCreate={false}>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-Q1">2024 Q1</SelectItem>
              <SelectItem value="2024-Q2">2024 Q2</SelectItem>
              <SelectItem value="2024-Q3">2024 Q3</SelectItem>
              <SelectItem value="2024-Q4">2024 Q4</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {
            const csv = forecasts.map(f => 
              `${getDepartmentName(f.departmentId)},${f.budgetAllocated},${f.budgetSpent},${f.budgetCommitted},${f.projectedSpend}`
            ).join('\n');
            const blob = new Blob([`Department,Allocated,Spent,Committed,Projected\n${csv}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `forecast-${selectedPeriod}.csv`;
            a.click();
          }}>Export Forecast</Button>
        </div>
      </ListViewHeader>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Budget</CardDescription>
              <CardTitle className="text-2xl">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBudgetAllocated)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Allocated for {selectedPeriod}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Budget Spent</CardDescription>
              <CardTitle className="text-2xl">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBudgetSpent)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={utilizationPercentage} className="h-2" />
              <div className="text-sm text-muted-foreground mt-2">{utilizationPercentage.toFixed(1)}% utilized</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Committed Budget</CardDescription>
              <CardTitle className="text-2xl">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBudgetCommitted)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Outstanding obligations</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Projected Spend</CardDescription>
              <CardTitle className="text-2xl">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalProjectedSpend)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {totalVariance >= 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
                <span className={totalVariance >= 0 ? "text-green-600" : "text-red-600"}>
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                    Math.abs(totalVariance),
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variance Alerts */}
        {forecasts.some((f) => f.variance < -10000) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Budget Overrun Detected</AlertTitle>
            <AlertDescription>
              {forecasts.filter((f) => f.variance < -10000).length} department(s) are projected to exceed budget. Review
              department forecasts below for details.
            </AlertDescription>
          </Alert>
        )}

        {/* Department Forecasts */}
        <div className="grid gap-4">
          {forecasts.map((forecast) => {
            const varianceStatus = getVarianceStatus(forecast.variance);
            const VarianceIcon = varianceStatus.icon;
            const utilizationPct = (forecast.budgetSpent / forecast.budgetAllocated) * 100;
            const projectedPct = (forecast.projectedSpend / forecast.budgetAllocated) * 100;

            return (
              <Card key={forecast.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{getDepartmentName(forecast.departmentId)}</CardTitle>
                      <CardDescription>
                        Fiscal Period: {forecast.fiscalYear} - {forecast.fiscalPeriod}
                      </CardDescription>
                    </div>
                    <Badge variant={forecast.variance >= 0 ? "default" : "destructive"} className="gap-1">
                      <VarianceIcon className="h-3 w-3" />
                      {varianceStatus.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Allocated</div>
                      <div className="text-lg font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(forecast.budgetAllocated)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Spent</div>
                      <div className="text-lg font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(forecast.budgetSpent)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Committed</div>
                      <div className="text-lg font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(forecast.budgetCommitted)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Available</div>
                      <div className="text-lg font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                        }).format(forecast.budgetAvailable)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span className="font-medium">{utilizationPct.toFixed(1)}%</span>
                    </div>
                    <Progress value={utilizationPct} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projected Spend</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                          forecast.projectedSpend,
                        )}
                        {" ("}
                        {projectedPct.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={projectedPct} className={`h-2 ${projectedPct > 100 ? "bg-red-200" : ""}`} />
                  </div>

                  <div
                    className={`flex items-center gap-2 p-3 rounded-md ${forecast.variance >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <DollarSign className={`h-5 w-5 ${forecast.variance >= 0 ? "text-green-600" : "text-red-600"}`} />
                    <div>
                      <div className="text-sm font-medium">Variance</div>
                      <div
                        className={`text-lg font-semibold ${forecast.variance >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {forecast.variance >= 0 ? "+" : ""}
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                          forecast.variance,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(forecast.lastUpdated).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ListView>
  );
}
