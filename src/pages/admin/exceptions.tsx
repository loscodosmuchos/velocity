import { useTable } from "@refinedev/react-table";
import { useUpdate, useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemException } from "@/types";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Download } from "lucide-react";
import { exportExceptionsToCSV } from "@/utils/export-audit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router";

export const SystemExceptionsListPage = () => {
  const { mutate: updateException } = useUpdate();
  const navigate = useNavigate();
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedExceptionId, setSelectedExceptionId] = useState<number | null>(null);

  const { data: allExceptionsData } = useList<SystemException>({
    resource: "systemexceptions",
    pagination: { pageSize: 1000 },
  });

  const handleExport = () => {
    if (allExceptionsData?.data) {
      exportExceptionsToCSV(allExceptionsData.data);
    }
  };

  const handleStatusChange = (id: number, status: string, notes?: string) => {
    updateException(
      {
        resource: "systemexceptions",
        id,
        values: {
          status,
          ...(status === "Acknowledged" && { acknowledgedAt: new Date().toISOString() }),
          ...(status === "Resolved" && {
            resolvedAt: new Date().toISOString(),
            resolutionNotes: notes,
          }),
        },
      },
      {
        onSuccess: () => {
          setResolutionNotes("");
          setSelectedExceptionId(null);
        },
      },
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Acknowledged":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "Ignored":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const columns: ColumnDef<SystemException>[] = [
    {
      id: "severity",
      accessorKey: "severity",
      header: ({ column }) => <DataTableSorter column={column} title="Severity" />,
      cell: ({ getValue }) => {
        const severity = getValue<string>();
        return <Badge variant={getSeverityColor(severity) as any}>{severity}</Badge>;
      },
      meta: {
        filterOperator: "eq",
      },
    },
    {
      id: "exceptionType",
      accessorKey: "exceptionType",
      header: ({ column }) => <DataTableSorter column={column} title="Type" />,
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      meta: {
        filterOperator: "eq",
      },
    },
    {
      id: "entityType",
      accessorKey: "entityType",
      header: "Entity Type",
      cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
    },
    {
      id: "entityName",
      accessorKey: "entityName",
      header: "Entity",
      cell: ({ row }) => {
        const exception = row.original;
        return (
          <Button
            variant="link"
            className="h-auto p-0"
            onClick={() => {
              const entityTypeMap: Record<string, string> = {
                Contractor: "contractors",
                PurchaseOrder: "purchase-orders",
                Timecard: "timecards",
                Invoice: "invoices",
                SOW: "statement-of-works",
                Equipment: "contractors",
              };
              const resource = entityTypeMap[exception.entityType];
              if (resource) {
                navigate(`/${resource}/${exception.entityId}`);
              }
            }}>
            {exception.entityName}
          </Button>
        );
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className="text-sm">{status}</span>
          </div>
        );
      },
      meta: {
        filterOperator: "eq",
      },
    },
    {
      id: "detectedAt",
      accessorKey: "detectedAt",
      header: ({ column }) => <DataTableSorter column={column} title="Detected" />,
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return format(new Date(date), "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const exception = row.original;
        return (
          <div className="flex gap-2">
            {exception.autoFixAvailable && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Auto-Fix
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Auto-Fix Suggestion</DialogTitle>
                    <DialogDescription>
                      {exception.exceptionType} for {exception.entityName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm mb-2 font-medium">Suggested Fix:</p>
                    <p className="text-sm text-muted-foreground">
                      {exception.autoFixSuggestion || "No suggestion available"}
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={() => {
                        handleStatusChange(exception.id, "Resolved", "Applied auto-fix suggestion");
                      }}>
                      Apply Fix
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusChange(exception.id, "Acknowledged")}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Acknowledge
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedExceptionId(exception.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(exception.id, "Ignored")}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Ignore
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useTable<SystemException>({
    columns,
    refineCoreProps: {
      resource: "systemexceptions",
      pagination: {
        pageSize: 20,
      },
      sorters: {
        initial: [
          {
            field: "detectedAt",
            order: "desc",
          },
        ],
      },
      filters: {
        initial: [
          {
            field: "status",
            operator: "ne",
            value: "Resolved",
          },
        ],
      },
    },
  });

  return (
    <>
      <ListView>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">System Exceptions</h2>
              <p className="text-muted-foreground">
                Monitor and resolve data validation errors and operational exceptions
              </p>
            </div>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Exceptions
            </Button>
          </div>
          <DataTable table={table} />
        </div>
      </ListView>

      <Dialog open={selectedExceptionId !== null} onOpenChange={(open) => !open && setSelectedExceptionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Exception</DialogTitle>
            <DialogDescription>Add resolution notes for this exception</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter resolution notes..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedExceptionId(null);
                setResolutionNotes("");
              }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedExceptionId) {
                  handleStatusChange(selectedExceptionId, "Resolved", resolutionNotes);
                }
              }}>
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
