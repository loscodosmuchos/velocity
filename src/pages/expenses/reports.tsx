import { useMemo } from "react";
import { useList, useMany } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, PieChart, Download, FileText } from "lucide-react";
import type { ContractorExpense, Contractor, Department } from "@/types";

export function ExpenseReportsPage() {
  const { data: expensesData } = useList<ContractorExpense>({
    resource: "contractor_expenses",
    filters: [{ field: "status", operator: "in", value: ["Approved", "Paid"] }],
  });

  const { data: contractorsData } = useMany<Contractor>({
    resource: "contractors",
    ids: expensesData?.data.map((e) => e.contractorId) || [],
    queryOptions: { enabled: (expensesData?.data.length || 0) > 0 },
  });

  const { data: departmentsData } = useList<Department>({
    resource: "departments",
  });

  const expenses = expensesData?.data || [];

  // Calculate totals by type
  const expensesByType = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((expense) => {
      totals[expense.expenseType] = (totals[expense.expenseType] || 0) + expense.amount;
    });
    return Object.entries(totals).map(([type, amount]) => ({ type, amount }));
  }, [expenses]);

  // Calculate totals by contractor
  const expensesByContractor = useMemo(() => {
    const totals: Record<number, { name: string; amount: number; count: number }> = {};
    expenses.forEach((expense) => {
      const contractor = contractorsData?.data.find((c) => c.id === expense.contractorId);
      const name = contractor ? `${contractor.firstName} ${contractor.lastName}` : `Contractor ${expense.contractorId}`;

      if (!totals[expense.contractorId]) {
        totals[expense.contractorId] = { name, amount: 0, count: 0 };
      }
      totals[expense.contractorId].amount += expense.amount;
      totals[expense.contractorId].count += 1;
    });
    return Object.values(totals)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [expenses, contractorsData]);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpenseAmount = totalExpenseAmount / (expenses.length || 1);
  const expensesByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    expenses.forEach((expense) => {
      counts[expense.status] = (counts[expense.status] || 0) + 1;
    });
    return counts;
  }, [expenses]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and insights on contractor expenses</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenseAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} total expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageExpenseAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per expense claim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expensesByStatus.Approved || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expensesByStatus.Paid || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Type</CardTitle>
            <CardDescription>Breakdown of expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByType.map(({ type, amount }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{((amount / totalExpenseAmount) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Contractors by Expense</CardTitle>
            <CardDescription>Contractors with highest expense totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByContractor.map((contractor) => (
                <div key={contractor.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{contractor.name}</p>
                    <p className="text-sm text-muted-foreground">{contractor.count} expenses</p>
                  </div>
                  <p className="font-medium">${contractor.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
          <CardDescription>Monthly expense trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Chart visualization would be displayed here using recharts or similar library</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
