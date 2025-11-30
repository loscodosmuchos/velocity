import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetIdentity } from "@refinedev/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface ClientRequirement {
  id: string;
  clientName: string;
  contractTitle: string;
  contractId: string;
  categories: string[];
  dueDate: string;
  requestedBy: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  responses: Record<string, any>;
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export function ContractorPortalRequirementsPage() {
  const { data: identity } = useGetIdentity<{ id: number; email: string }>();
  const [requirements, setRequirements] = useState<ClientRequirement[]>([]);
  const [loading, setLoading] = useState(false);

  const contractorName = identity?.email?.split("@")[0] || "Contractor";

  const columns = useMemo<ColumnDef<ClientRequirement>[]>(
    () => [
      {
        id: "contractTitle",
        accessorKey: "contractTitle",
        header: "Contract",
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">{row.original.contractTitle}</div>
              <div className="text-sm text-muted-foreground">{row.original.contractId}</div>
            </div>
          );
        },
      },
      {
        id: "categories",
        accessorKey: "categories",
        header: "Missing Documents",
        cell: ({ row }) => {
          return (
            <div className="flex flex-wrap gap-1">
              {row.original.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {row.original.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{row.original.categories.length - 3} more
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const priority = row.original.priority;
          const variant = priority === "High" ? "destructive" : priority === "Medium" ? "default" : "secondary";
          return <Badge variant={variant}>{priority}</Badge>;
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
          const dueDate = new Date(row.original.dueDate);
          const today = new Date();
          const daysUntil = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          const isOverdue = daysUntil < 0;
          const isUrgent = daysUntil <= 3 && daysUntil >= 0;

          return (
            <div className="flex items-center gap-2">
              <span className={isOverdue ? "text-red-600 font-semibold" : isUrgent ? "text-amber-600 font-semibold" : ""}>
                {dueDate.toLocaleDateString()}
              </span>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
              {isUrgent && !isOverdue && (
                <Badge variant="default" className="text-xs bg-amber-500">
                  Urgent
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const variant = status === "completed" ? "default" : status === "in_progress" ? "secondary" : "outline";
          const icon = status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : status === "in_progress" ? <Clock className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />;

          return (
            <Badge variant={variant} className="flex items-center gap-1 w-fit">
              {icon}
              {status.replace("_", " ")}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isCompleted = row.original.status === "completed";
          return (
            <Button
              size="sm"
              variant={isCompleted ? "outline" : "default"}
              disabled={isCompleted}
              onClick={() => {
                if (!isCompleted) {
                  toast.info("Document upload feature coming soon!");
                }
              }}>
              {isCompleted ? "Completed" : "Upload Documents"}
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useTable<ClientRequirement>({
    columns,
    refineCoreProps: {
      resource: "client_requirements",
      filters: {
        permanent: [{ field: "clientName", operator: "eq", value: contractorName }],
      },
    },
  });

  // Calculate summary stats
  const allRequirements = table.getRowModel().rows.map((r) => r.original);
  const pendingCount = allRequirements.filter((r) => r.status === "pending").length;
  const inProgressCount = allRequirements.filter((r) => r.status === "in_progress").length;
  const completedCount = allRequirements.filter((r) => r.status === "completed").length;
  const overdueCount = allRequirements.filter((r) => {
    const daysUntil = Math.floor((new Date(r.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil < 0 && r.status !== "completed";
  }).length;

  return (
    <ListView>
      <ListViewHeader title="Document Requests">
        <div className="text-sm text-muted-foreground">Upload missing documents for your contracts</div>
      </ListViewHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allRequirements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Overdue
              {overdueCount > 0 && <AlertCircle className="h-4 w-4 text-red-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {pendingCount > 0 && (
        <Card className="mb-6 mx-4 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
              <FileText className="h-4 w-4" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p>
              You have <span className="font-bold">{pendingCount}</span> pending document request{pendingCount > 1 ? "s" : ""}. Please upload the
              required documents to ensure compliance and avoid delays in your contract processing.
            </p>
            {overdueCount > 0 && (
              <p className="mt-2 text-red-700 font-semibold">
                ⚠️ {overdueCount} request{overdueCount > 1 ? "s are" : " is"} overdue! Please prioritize these immediately.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <DataTable table={table} />
    </ListView>
  );
}
