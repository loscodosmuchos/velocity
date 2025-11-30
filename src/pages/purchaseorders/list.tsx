import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMany } from "@refinedev/core";
import { MoreHorizontal, Download, TrendingUp, AlertTriangle, CheckCircle2, Rows, Rows3, ShoppingCart, DollarSign, Clock, Target, Zap, Plus, FileText } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import {
  DataTableFilterDropdownText,
  DataTableFilterCombobox,
  DataTableFilterDropdownNumeric,
  DataTableFilterDropdownDateRangePicker,
} from "@/components/refine-ui/data-table/data-table-filter";
import { cn, formatCurrency, formatCurrencyCompact, formatNumber, formatPercent } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { exportToCSV, exportToJSON } from "@/utils/export";
import { LegendaryHero, LegendaryKPIGrid, LegendaryEmptyState, LegendaryLoadingState } from "@/components/legendary";
import type { PurchaseOrder, Department, Buyer, Contractor } from "../../types";

export function PurchaseOrdersListPage() {
  const navigate = useNavigate();
  const [tableStripped, setTableStripped] = useState(true);
  const [tableDensity, setTableDensity] = useState<'compact' | 'normal'>('compact');

  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 80,
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>ID</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownNumeric
                  defaultOperator="eq"
                  column={column}
                  table={table}
                  placeholder="Filter by ID"
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "poNumber",
        accessorKey: "poNumber",
        size: 150,
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>PO Number</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownText
                  defaultOperator="contains"
                  column={column}
                  table={table}
                  placeholder="Filter by PO number"
                />
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div
              className="font-medium cursor-pointer hover:underline text-blue-400"
              onClick={() => navigate(`/purchase-orders/show/${row.original.id}`)}>
              {row.original.poNumber}
            </div>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        size: 250,
        header: "Description",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="max-w-[250px] truncate text-slate-300" title={row.original.description}>
              {row.original.description}
            </div>
          );
        },
      },
      {
        id: "budgetHealth",
        accessorFn: (row) => {
          const remaining = Number(row.amountRemaining) || 0;
          const total = Number(row.totalAmount) || 0;
          const percentage = total > 0 ? ((total - remaining) / total) * 100 : 0;
          return percentage + (remaining / 1000000000);
        },
        size: 180,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Budget Health</span>
              <DataTableSorter column={column} />
            </div>
          );
        },
        cell: ({ row }) => {
          const remaining = Number(row.original.amountRemaining) || 0;
          const total = Number(row.original.totalAmount) || 0;
          const spent = Number(row.original.amountSpent) || 0;
          const percentage = total > 0 ? ((total - remaining) / total) * 100 : 0;
          
          const isAtRisk = percentage >= 90;
          const isWarning = percentage >= 75 && percentage < 90;
          const isHealthy = percentage < 75;
          
          return (
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {isAtRisk && (
                  <div title="Budget critically low!">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                )}
                {isWarning && (
                  <div title="Budget approaching limit">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                  </div>
                )}
                {isHealthy && (
                  <div title="Budget healthy">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className={cn(
                  "font-semibold text-sm tabular-nums",
                  isAtRisk && "text-red-300",
                  isWarning && "text-amber-300",
                  isHealthy && "text-emerald-300"
                )}>
                  {formatCurrency(remaining)} / {formatCurrency(total)}
                </div>
                <div className="text-xs text-slate-400 tabular-nums">
                  {formatPercent(percentage)} spent
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Status</span>
              <DataTableFilterCombobox
                column={column}
                defaultOperator="in"
                multiple={true}
                options={[
                  { label: "Draft", value: "Draft" },
                  { label: "Pending", value: "Pending" },
                  { label: "Active", value: "Active" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                ]}
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <StatusBadge status={status} category="purchaseOrder" />
          );
        },
      },
      {
        id: "renewal",
        accessorKey: "endDate",
        size: 150,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Renewal</span>
              <DataTableSorter column={column} />
              <DataTableFilterDropdownDateRangePicker column={column} />
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || !Array.isArray(filterValue)) return true;
          const cellValue = row.getValue(columnId) as string;
          if (!cellValue) return true;
          const cellDate = new Date(cellValue);
          if (isNaN(cellDate.getTime())) return true;
          const fromDate = filterValue[0] ? new Date(filterValue[0]) : null;
          const toDate = filterValue[1] ? new Date(filterValue[1]) : null;
          if (fromDate && isNaN(fromDate.getTime())) return true;
          if (toDate && isNaN(toDate.getTime())) return true;
          if (fromDate && toDate) return cellDate >= fromDate && cellDate <= toDate;
          if (fromDate) return cellDate >= fromDate;
          if (toDate) return cellDate <= toDate;
          return true;
        },
        cell: ({ row }) => {
          const endDate = row.original.endDate ? new Date(row.original.endDate) : null;
          if (!endDate) return <span className="text-slate-500">Open-ended</span>;
          const today = new Date();
          const daysUntil = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          const isExpiringSoon = daysUntil <= 30 && daysUntil >= 0;
          const isExpired = daysUntil < 0;
          
          return (
            <div className="flex flex-col gap-1">
              <span className={cn(
                "text-sm font-medium tabular-nums text-slate-200",
                isExpired && "text-red-300",
                isExpiringSoon && "text-amber-300"
              )}>
                {endDate.toLocaleDateString()}
              </span>
              {isExpiringSoon && (
                <StatusBadge variant="warning" size="sm" showIcon={false}>
                  {daysUntil}d
                </StatusBadge>
              )}
              {isExpired && (
                <StatusBadge variant="critical" size="sm">
                  Expired
                </StatusBadge>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        size: 84,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => {
          return <div className={cn("flex", "w-full", "items-center", "justify-center")}>Actions</div>;
        },
        cell: ({ row }) => {
          const po = row.original;
          return (
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/purchase-orders/show/${po.id}`);
                }}>
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/purchase-orders/edit/${po.id}`);
                }}>
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [navigate],
  );

  const table = useTable<PurchaseOrder>({
    columns,
    refineCoreProps: {
      resource: "purchase-orders",
      meta: {
        populate: ["department", "buyer"],
      },
    },
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
  });

  // Get loading state from table query
  const isLoading = table.refineCore.tableQuery.isLoading;

  // Fetch departments for filtering
  const departmentIds = table.getRowModel().rows.map((row) => row.original.departmentId).filter((id): id is number => !!id);
  const { data: departmentsData } = useMany<Department>({
    resource: "departments",
    ids: departmentIds,
    queryOptions: {
      enabled: departmentIds.length > 0,
    },
  });

  // Fetch buyers for display
  const buyerIds = table
    .getRowModel()
    .rows.map((row) => row.original.buyerId)
    .filter((id): id is number => !!id);
  const { data: buyersData } = useMany<Buyer>({
    resource: "buyers",
    ids: buyerIds,
    queryOptions: {
      enabled: buyerIds.length > 0,
    },
  });

  // Set data in table meta
  table.options.meta = {
    ...table.options.meta,
    departments: departmentsData?.data || [],
    buyers: buyersData?.data || [],
  };

  // Calculate summary intelligence (PAGE-SCOPED)
  const currentPageRows = table.getRowModel().rows;
  const allPOs = currentPageRows.map((r) => r.original);
  const totalBudget = allPOs.reduce((sum, po) => sum + (Number(po.totalAmount) || 0), 0);
  const totalSpent = allPOs.reduce((sum, po) => sum + (Number(po.amountSpent) || 0), 0);
  const totalRemaining = allPOs.reduce((sum, po) => sum + (Number(po.amountRemaining) || 0), 0);
  
  // Get at-risk POs (90%+ budget consumed) with their IDs
  const atRiskPOs = allPOs.filter((po) => {
    const total = Number(po.totalAmount) || 0;
    const remaining = Number(po.amountRemaining) || 0;
    const percentage = total > 0 ? ((total - remaining) / total) * 100 : 0;
    return percentage >= 90;
  });
  const atRiskCount = atRiskPOs.length;
  
  // Get expiring POs (within 30 days) with their IDs
  const expiringPOs = allPOs.filter((po) => {
    const daysUntil = Math.floor((new Date(po.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  });
  const expiringCount = expiringPOs.length;
  
  const activePOs = allPOs.filter((po) => po.status === "Active").length;
  const utilizationPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Use formatCurrencyCompact from utils for M/K formatting

  // Get accent color based on utilization
  const getUtilizationColor = (percent: number): "emerald" | "amber" | "ruby" => {
    if (percent >= 90) return "ruby";
    if (percent >= 75) return "amber";
    return "emerald";
  };

  // Navigate to at-risk PO - direct navigation for immediate action
  const handleViewAtRisk = () => {
    if (atRiskPOs.length === 1) {
      // Single at-risk PO: go directly to it
      navigate(`/purchase-orders/show/${atRiskPOs[0].id}`);
    } else if (atRiskPOs.length > 1) {
      // Multiple at-risk POs: navigate to first one with context
      navigate(`/purchase-orders/show/${atRiskPOs[0].id}?context=at-risk&total=${atRiskPOs.length}`);
    }
  };

  // Navigate to expiring PO - direct navigation for immediate action
  const handleViewExpiring = () => {
    if (expiringPOs.length === 1) {
      // Single expiring PO: go directly to it
      navigate(`/purchase-orders/show/${expiringPOs[0].id}`);
    } else if (expiringPOs.length > 1) {
      // Multiple expiring POs: navigate to first one with context
      navigate(`/purchase-orders/show/${expiringPOs[0].id}?context=expiring&total=${expiringPOs.length}`);
    }
  };

  const handleExportCSV = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const po = row.original;
      const departments = (table.options.meta as any)?.departments || [];
      const buyers = (table.options.meta as any)?.buyers || [];
      const department = departments.find((d: Department) => d.id === po.departmentId);
      const buyer = buyers.find((b: Buyer) => b.id === po.buyerId);

      return {
        id: po.id,
        poNumber: po.poNumber,
        description: po.description,
        status: po.status,
        type: po.type,
        buyer: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Not Assigned",
        department: po.department || department?.name || "",
        totalAmount: Number(po.totalAmount) || 0,
        spentAmount: Number(po.amountSpent) || 0,
        remainingFunds: Number(po.amountRemaining) || 0,
        percentUsed: Number(po.percentUsed) || 0,
        fiscalYear: po.fiscalYear,
        fiscalPeriod: po.fiscalPeriod,
        startDate: new Date(po.startDate).toLocaleDateString(),
        endDate: new Date(po.endDate).toLocaleDateString(),
        tpscStatus: po.tpscStatus,
      };
    });

    exportToCSV(rows, `purchase-orders-${new Date().toISOString().split("T")[0]}`, {
      id: "ID",
      poNumber: "PO Number",
      description: "Description",
      status: "Status",
      type: "Type",
      buyer: "Buyer",
      department: "Department",
      totalAmount: "Total Amount",
      spentAmount: "Spent Amount",
      remainingFunds: "Remaining Funds",
      percentUsed: "Percent Used",
      fiscalYear: "Fiscal Year",
      fiscalPeriod: "Fiscal Period",
      startDate: "Start Date",
      endDate: "End Date",
      tpscStatus: "TPSC Status",
    });
  };

  const handleExportJSON = () => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToJSON(rows, `purchase-orders-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* LEGENDARY HERO SECTION */}
      <LegendaryHero
        title="Purchase Order Pipeline"
        subtitle="Real-time procurement oversight with budget tracking, vendor management, and renewal alerts"
        icon={ShoppingCart}
        iconGradient="from-emerald-500 to-teal-500"
        badge={{ label: "LIVE", variant: "live" }}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/purchase-orders/create")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem onClick={handleExportCSV} className="text-slate-200 hover:bg-slate-700">Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON} className="text-slate-200 hover:bg-slate-700">Export as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      >
        {/* LEGENDARY KPI GRID */}
        <LegendaryKPIGrid
          columns={5}
          items={[
            {
              label: "Total Budget",
              value: formatCurrencyCompact(totalBudget),
              subtext: `${formatNumber(allPOs.length)} purchase orders`,
              icon: DollarSign,
              iconColor: "text-emerald-400",
              accentColor: "emerald",
            },
            {
              label: "Budget Spent",
              value: formatCurrencyCompact(totalSpent),
              subtext: `${formatPercent(utilizationPercent)} utilized`,
              icon: TrendingUp,
              iconColor: utilizationPercent > 85 ? "text-orange-400" : "text-blue-400",
              trend: utilizationPercent > 85 ? "up" : "neutral",
              trendValue: `${utilizationPercent}%`,
              accentColor: getUtilizationColor(utilizationPercent),
            },
            {
              label: "At Risk",
              value: atRiskCount.toString(),
              subtext: atRiskCount > 0 ? "Click to review" : "All POs healthy",
              icon: AlertTriangle,
              iconColor: atRiskCount > 0 ? "text-red-400" : "text-slate-400",
              accentColor: atRiskCount > 0 ? "ruby" : "slate",
              onClick: atRiskCount > 0 ? handleViewAtRisk : undefined,
            },
            {
              label: "Expiring Soon",
              value: expiringCount.toString(),
              subtext: expiringCount > 0 ? "Click to review" : "No renewals due",
              icon: Clock,
              iconColor: expiringCount > 0 ? "text-amber-400" : "text-slate-400",
              accentColor: expiringCount > 0 ? "amber" : "slate",
              onClick: expiringCount > 0 ? handleViewExpiring : undefined,
            },
            {
              label: "Active POs",
              value: activePOs.toString(),
              subtext: `of ${allPOs.length} total`,
              icon: Target,
              iconColor: "text-emerald-400",
              trend: "up",
              trendValue: `${allPOs.length > 0 ? Math.round((activePOs / allPOs.length) * 100) : 0}%`,
              accentColor: "cyan",
            },
          ]}
        />
      </LegendaryHero>

      {/* Quick Insight Bar - ACTIONABLE */}
      {allPOs.length > 0 && (atRiskCount > 0 || expiringCount > 0) && (
        <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-orange-950/30 to-red-950/30 rounded-xl border border-orange-500/30 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">
                {atRiskCount > 0 && `⚠ ${atRiskCount} PO${atRiskCount !== 1 ? 's' : ''} at budget risk. `}
                {expiringCount > 0 && `🕐 ${expiringCount} PO${expiringCount !== 1 ? 's' : ''} expiring within 30 days.`}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Take immediate action to prevent budget overruns and service interruptions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {atRiskCount > 0 && (
              <Button 
                onClick={handleViewAtRisk}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Review At-Risk
              </Button>
            )}
            {expiringCount > 0 && (
              <Button 
                onClick={handleViewExpiring}
                size="sm"
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              >
                <Clock className="h-4 w-4 mr-1" />
                View Expiring
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={tableStripped ? "default" : "outline"}
            size="sm"
            onClick={() => setTableStripped(!tableStripped)}
            title={tableStripped ? "Disable row striping" : "Enable row striping"}
            className="border-slate-600"
          >
            <Rows className="h-4 w-4 mr-2" />
            Striped
          </Button>
          <Button
            variant={tableDensity === 'compact' ? "default" : "outline"}
            size="sm"
            onClick={() => setTableDensity(tableDensity === 'compact' ? 'normal' : 'compact')}
            title={tableDensity === 'compact' ? "Normal spacing" : "Compact spacing"}
            className="border-slate-600"
          >
            <Rows3 className="h-4 w-4 mr-2" />
            {tableDensity === 'compact' ? 'Compact' : 'Normal'}
          </Button>
        </div>
      </div>

      {/* Loading State, Empty State, or Data Table */}
      {isLoading ? (
        <LegendaryLoadingState
          icon={ShoppingCart}
          iconGradient="from-emerald-600/20 to-teal-600/20"
          title="Loading Purchase Orders"
          description="Fetching procurement data and budget health..."
        />
      ) : allPOs.length === 0 ? (
        <LegendaryEmptyState
          icon={ShoppingCart}
          iconGradient="from-emerald-600/20 to-teal-600/20"
          title="No Purchase Orders Yet"
          description="Create your first purchase order to start tracking procurement spend, vendor relationships, and budget health."
          teachingPoints={[
            "Track budget utilization across all vendor contracts",
            "Get alerts when POs approach budget limits or expiration",
            "Link POs to SOWs and contractors for complete visibility",
            "Export reports for finance and compliance teams",
          ]}
          primaryAction={{
            label: "Create First PO",
            onClick: () => navigate("/purchase-orders/create"),
            icon: Plus,
          }}
          secondaryAction={{
            label: "Import from CSV",
            icon: FileText,
          }}
        />
      ) : (
        <div className={cn(
          "bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden",
          tableStripped && "[&_tbody_tr:nth-child(even)]:bg-slate-900/30",
          tableDensity === 'compact' && "[&_td]:py-2 [&_th]:py-2",
          tableDensity === 'normal' && "[&_td]:py-4 [&_th]:py-4"
        )}>
          <DataTable table={table} />
        </div>
      )}

      {/* Footer Insights */}
      {allPOs.length > 0 && (
        <div className="mt-6 p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              View Expiring POs
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              View At-Risk Budget
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Renewal Calendar
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Budget Forecast
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
