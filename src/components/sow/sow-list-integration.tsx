/**
 * SOW List Integration - Combines workflow visualizer with data table
 * This is the complete SOW management interface with visual workflow at top
 */

import React, { useState, useMemo } from "react";
import { useList } from "@refinedev/core";
import { Search, Download, Printer, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SOWWorkflowVisualizer } from "./sow-workflow-visualizer";
import type { StatementOfWork, Contractor } from "@/types";

interface SOWListIntegrationProps {
  sows: StatementOfWork[];
  isLoading: boolean;
}

export function SOWListIntegration({ sows, isLoading }: SOWListIntegrationProps) {
  const { data: contractorsData } = useList<Contractor>({
    resource: "contractors",
  });
  const contractors = contractorsData?.data ?? [];
  const contractorMap = useMemo(() => {
    const map = new Map<number, Contractor>();
    contractors.forEach((c) => map.set(c.id, c));
    return map;
  }, [contractors]);
  const getContractor = (contractorId: number) => contractorMap.get(contractorId);

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    sowNumber: true,
    contractor: true,
    status: true,
    totalValue: true,
    invoicedAmount: true,
    utilization: true,
    daysRemaining: true,
  });

  // Calculate distribution by stage
  const distributionByStage = useMemo(() => {
    const distribution: Record<string, number> = {
      draft: 0,
      review: 0,
      active: 0,
      invoiced: 0,
      paid: 0,
      completed: 0,
    };

    sows.forEach((sow) => {
      const status = sow.status?.toLowerCase() || "draft";
      if (status === "draft") distribution.draft++;
      else if (status === "pending approval") distribution.review++;
      else if (status === "active") distribution.active++;
      else if (status === "invoiced") distribution.invoiced++;
      else if (status === "paid") distribution.paid++;
      else if (status === "completed") distribution.completed++;
    });

    return distribution;
  }, [sows]);

  // Filter and search
  const filteredSOWs = useMemo(
    () =>
      sows.filter((sow) => {
        const contractor = getContractor(sow.contractorId);
        return (
          sow.sowNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
    [sows, searchTerm, getContractor]
  );

  // Aggregate calculations
  const aggregates = useMemo(() => {
    const totalSOWs = filteredSOWs.length;
    const totalBudget = filteredSOWs.reduce((sum, s) => sum + (s.totalValue || 0), 0);
    const totalInvoiced = filteredSOWs.reduce((sum, s) => sum + (s.invoicedAmount || 0), 0);
    const avgUtilization = totalSOWs > 0 ? (totalInvoiced / totalBudget) * 100 : 0;

    return {
      totalSOWs,
      totalBudget,
      totalInvoiced,
      avgUtilization,
    };
  }, [filteredSOWs]);

  const budgetChartData = filteredSOWs
    .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
    .slice(0, 10)
    .map((s) => ({
      name: s.sowNumber || "Unknown",
      budget: s.totalValue || 0,
      invoiced: s.invoicedAmount || 0,
    }));

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Premium Workflow Visualizer - Centerpiece */}
      <SOWWorkflowVisualizer
        activeStageId="active"
        totalSOWs={sows.length}
        distributionByStage={distributionByStage}
      />

      {/* Header with Search & Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">SOW Management Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Complete contract tracking, budget oversight, and workflow intelligence
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            New SOW
          </Button>
        </div>

        {/* Search & Controls */}
        <div className="flex gap-2 items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search SOW number, contractor, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 text-white placeholder-slate-400 focus-visible:ring-0"
          />

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Eye className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
              <DropdownMenuLabel className="text-slate-300">Show/Hide Columns</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              {Object.entries(visibleColumns).map(([key, visible]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visible}
                  onCheckedChange={() => toggleColumn(key as keyof typeof visibleColumns)}
                  className="text-slate-300 capitalize"
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export/Print */}
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-700 bg-slate-900/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Total SOWs</p>
              <p className="text-3xl font-bold text-cyan-400">{aggregates.totalSOWs}</p>
              <p className="text-xs text-slate-500">Active contracts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-emerald-400">
                ${(aggregates.totalBudget / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-slate-500">Across all SOWs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Total Invoiced</p>
              <p className="text-3xl font-bold text-amber-400">
                ${(aggregates.totalInvoiced / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-slate-500">Billed to date</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Avg Utilization</p>
              <p className="text-3xl font-bold text-blue-400">{aggregates.avgUtilization.toFixed(0)}%</p>
              <p className="text-xs text-slate-500">Budget utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Top 10 SOWs by Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <ChartTooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                <Legend />
                <Bar dataKey="budget" fill="#10b981" name="Budget" />
                <Bar dataKey="invoiced" fill="#f59e0b" name="Invoiced" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Workflow Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Active", count: distributionByStage.active, color: "text-emerald-400" },
                { name: "Draft", count: distributionByStage.draft, color: "text-slate-400" },
                { name: "Invoiced", count: distributionByStage.invoiced, color: "text-blue-400" },
                { name: "Completed", count: distributionByStage.completed, color: "text-purple-400" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-slate-300">{item.name}</span>
                  <span className={`font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">SOW Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400">Loading SOWs...</div>
          ) : filteredSOWs.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No SOWs found matching your search</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    {visibleColumns.sowNumber && (
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">
                        SOW Number
                      </th>
                    )}
                    {visibleColumns.contractor && (
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">
                        Contractor
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">Status</th>
                    )}
                    {visibleColumns.totalValue && (
                      <th className="px-4 py-3 text-right text-cyan-400 font-semibold text-sm">Budget</th>
                    )}
                    {visibleColumns.invoicedAmount && (
                      <th className="px-4 py-3 text-right text-cyan-400 font-semibold text-sm">
                        Invoiced
                      </th>
                    )}
                    {visibleColumns.utilization && (
                      <th className="px-4 py-3 text-center text-cyan-400 font-semibold text-sm">
                        Utilization
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredSOWs.map((sow) => (
                    <tr key={sow.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      {visibleColumns.sowNumber && (
                        <td className="px-4 py-3 text-emerald-300 font-medium">{sow.sowNumber}</td>
                      )}
                      {visibleColumns.contractor && (
                        <td className="px-4 py-3 text-slate-200">
                          {(() => {
                            const contractor = getContractor(sow.contractorId);
                            return contractor
                              ? `${contractor.firstName} ${contractor.lastName}`
                              : "Unassigned";
                          })()}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`${
                              sow.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : sow.status === "Draft"
                                ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {sow.status}
                          </Badge>
                        </td>
                      )}
                      {visibleColumns.totalValue && (
                        <td className="px-4 py-3 text-right text-slate-200 font-mono">
                          ${(sow.totalValue || 0).toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.invoicedAmount && (
                        <td className="px-4 py-3 text-right text-amber-300 font-mono">
                          ${(sow.invoicedAmount || 0).toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.utilization && (
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`font-semibold ${
                              ((sow.invoicedAmount || 0) / (sow.totalValue || 1)) * 100 > 80
                                ? "text-red-400"
                                : ((sow.invoicedAmount || 0) / (sow.totalValue || 1)) * 100 > 50
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {(
                              (((sow.invoicedAmount || 0) / (sow.totalValue || 1)) * 100)
                            ).toFixed(0)}
                            %
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SOWListIntegration;
