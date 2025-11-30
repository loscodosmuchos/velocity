import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { DataTableFilterDropdownText, DataTableFilterDropdownDateRangePicker } from "@/components/refine-ui/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { AuditLog } from "@/types";
import { format } from "date-fns";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { exportAuditLogsToCSV } from "@/utils/export-audit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AuditLogsListPage = () => {
  const navigate = useNavigate();

  const { data: allLogsData } = useList<AuditLog>({
    resource: "audit_log",
    pagination: { pageSize: 1000 },
  });

  const handleExport = () => {
    if (allLogsData?.data) {
      exportAuditLogsToCSV(allLogsData.data);
    }
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      id: "timestamp",
      accessorKey: "timestamp",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <DataTableSorter column={column} title="Timestamp" />
          <DataTableFilterDropdownDateRangePicker column={column} />
        </div>
      ),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "MMM dd, yyyy HH:mm");
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
    },
    {
      id: "entityType",
      accessorKey: "entityType",
      header: ({ column }) => <DataTableSorter column={column} title="Entity Type" />,
      cell: ({ getValue }) => {
        const type = getValue<string>();
        return <Badge variant="outline">{type}</Badge>;
      },
      meta: {
        filterOperator: "eq",
      },
    },
    {
      id: "action",
      accessorKey: "action",
      header: ({ column }) => <DataTableSorter column={column} title="Action" />,
      cell: ({ getValue }) => {
        const action = getValue<string>();
        const variant =
          action === "Created"
            ? "default"
            : action === "Approved"
              ? "default"
              : action === "Rejected"
                ? "destructive"
                : action === "Deleted"
                  ? "destructive"
                  : "secondary";
        return <Badge variant={variant}>{action}</Badge>;
      },
      meta: {
        filterOperator: "eq",
      },
    },
    {
      id: "performedByName",
      accessorKey: "performedByName",
      header: ({ column }) => <DataTableSorter column={column} title="Performed By" />,
      meta: {
        filterOperator: "contains",
      },
    },
    {
      id: "entityId",
      accessorKey: "entityId",
      header: "Entity ID",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const auditLog = row.original;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Audit Log Details</DialogTitle>
                <DialogDescription>
                  {auditLog.entityType} #{auditLog.entityId} - {auditLog.action}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Performed By</p>
                    <p className="text-sm text-muted-foreground">{auditLog.performedByName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Timestamp</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(auditLog.timestamp), "PPpp")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Entity Type</p>
                    <p className="text-sm text-muted-foreground">{auditLog.entityType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Entity ID</p>
                    <p className="text-sm text-muted-foreground">{auditLog.entityId}</p>
                  </div>
                </div>
                {auditLog.changedFields && auditLog.changedFields.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Changed Fields</p>
                    <div className="border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="p-2 text-left">Field</th>
                            <th className="p-2 text-left">Old Value</th>
                            <th className="p-2 text-left">New Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditLog.changedFields.map((change, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-2 font-medium">{change.field}</td>
                              <td className="p-2 text-muted-foreground">{change.oldValue || "-"}</td>
                              <td className="p-2">{change.newValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {auditLog.ipAddress && (
                  <div>
                    <p className="text-sm font-medium">IP Address</p>
                    <p className="text-sm text-muted-foreground font-mono">{auditLog.ipAddress}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = useTable<AuditLog>({
    columns,
    refineCoreProps: {
      resource: "audit_log",
      pagination: {
        pageSize: 20,
      },
      sorters: {
        initial: [
          {
            field: "timestamp",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
            <p className="text-muted-foreground">Complete system activity history with change tracking</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Logs
          </Button>
        </div>
        <DataTable table={table} />
      </div>
    </ListView>
  );
};
