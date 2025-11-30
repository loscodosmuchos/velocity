/**
 * Legendary SOW List - Complete Redesign
 * - Proper contrast for dark mode
 * - Search functionality
 * - Column visibility controls
 * - Aggregate charts/KPIs
 * - Print/export capabilities
 */

import React, { useState, useMemo } from "react";
import { Search, Download, Printer, Eye, EyeOff, Plus } from "lucide-react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { StatementOfWork } from "@/types";

interface SOWListRedesignProps {
  sows: StatementOfWork[];
  isLoading: boolean;
  onSearch: (term: string) => void;
  onSort: (field: string, order: "asc" | "desc") => void;
  onExport: () => void;
  onPrint: () => void;
}

export function SOWListRedesign({
  sows,
  isLoading,
  onSearch,
  onSort,
  onExport,
  onPrint,
}: SOWListRedesignProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    sowNumber: true,
    contractor: true,
    totalValue: true,
    invoicedAmount: true,
    status: true,
    daysRemaining: true,
    utilization: true,
  });

  // Filter and search
  const filteredSOWs = useMemo(
    () =>
      sows.filter(
        (sow) =>
          sow.sowNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sow as any).contractor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sow as any).contractor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sows, searchTerm]
  );

  // Aggregate calculations
  const aggregates = useMemo(() => {
    const totalSOWs = filteredSOWs.length;
    const totalBudget = filteredSOWs.reduce((sum, s) => sum + (s.totalValue || 0), 0);
    const totalInvoiced = filteredSOWs.reduce((sum, s) => sum + (s.invoicedAmount || 0), 0);
    const avgUtilization = totalSOWs > 0 ? (totalInvoiced / totalBudget) * 100 : 0;

    const statuses = {
      Active: filteredSOWs.filter((s) => s.status === "Active").length,
      Draft: filteredSOWs.filter((s) => s.status === "Draft").length,
      Completed: filteredSOWs.filter((s) => s.status === "Completed").length,
      Other: filteredSOWs.filter((s) => !["Active", "Draft", "Completed"].includes(s.status || "")).length,
    };

    return {
      totalSOWs,
      totalBudget,
      totalInvoiced,
      avgUtilization,
      statuses,
    };
  }, [filteredSOWs]);

  const statusChartData = [
    { name: "Active", value: aggregates.statuses.Active, fill: "#10b981" },
    { name: "Draft", value: aggregates.statuses.Draft, fill: "#6b7280" },
    { name: "Completed", value: aggregates.statuses.Completed, fill: "#3b82f6" },
    { name: "Other", value: aggregates.statuses.Other, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

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
    <div className="space-y-6">
      {/* Header with Search & Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Statements of Work</h1>
            <p className="text-slate-400 mt-1">Manage all SOWs with contract tracking and budget oversight</p>
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
          <Button variant="ghost" size="sm" onClick={onExport} className="text-slate-300 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onPrint} className="text-slate-300 hover:text-white">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Aggregate KPIs */}
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
              <p className="text-3xl font-bold text-blue-400">
                {aggregates.avgUtilization.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500">Budget utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="border-slate-700 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 SOWs by Budget */}
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
      </div>

      {/* Table Section - Legendary Design */}
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
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">SOW Number</th>
                    )}
                    {visibleColumns.contractor && (
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">Contractor</th>
                    )}
                    {visibleColumns.status && (
                      <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-sm">Status</th>
                    )}
                    {visibleColumns.totalValue && (
                      <th className="px-4 py-3 text-right text-cyan-400 font-semibold text-sm">Budget</th>
                    )}
                    {visibleColumns.invoicedAmount && (
                      <th className="px-4 py-3 text-right text-cyan-400 font-semibold text-sm">Invoiced</th>
                    )}
                    {visibleColumns.utilization && (
                      <th className="px-4 py-3 text-center text-cyan-400 font-semibold text-sm">Utilization</th>
                    )}
                    {visibleColumns.daysRemaining && (
                      <th className="px-4 py-3 text-center text-cyan-400 font-semibold text-sm">Time Left</th>
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
                          {(sow as any).contractor ? `${(sow as any).contractor.firstName} ${(sow as any).contractor.lastName}` : "Unassigned"}
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
                            {(((sow.invoicedAmount || 0) / (sow.totalValue || 1)) * 100).toFixed(0)}%
                          </span>
                        </td>
                      )}
                      {visibleColumns.daysRemaining && (
                        <td className="px-4 py-3 text-center text-slate-300">
                          {sow.endDate ? new Date(sow.endDate).toLocaleDateString() : "N/A"}
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

export default SOWListRedesign;
