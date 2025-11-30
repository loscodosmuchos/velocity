import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMany, useGo } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { ListViewHeader, ListView } from "@/components/refine-ui/views/list-view";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Timecard, Contractor, PurchaseOrder } from "@/types";

export function PendingTimecardsPage() {
  const go = useGo();

  const columns = useMemo<ColumnDef<Timecard>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 80,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>ID</span>
              <DataTableSorter column={column} />
            </div>
          );
        },
      },
      {
        id: "contractorId",
        accessorKey: "contractorId",
        size: 200,
        header: "Contractor",
        cell: ({ row, table }) => {
          const contractorId = row.original.contractorId;
          const contractors = (table.options.meta as any)?.contractors || [];
          const contractor = contractors.find((c: Contractor) => c.id === contractorId);
          return contractor ? `${contractor.firstName} ${contractor.lastName}` : `Contractor #${contractorId}`;
        },
      },
      {
        id: "purchaseOrderId",
        accessorKey: "purchaseOrderId",
        size: 150,
        header: "PO",
        cell: ({ row, table }) => {
          const poId = row.original.purchaseOrderId;
          const purchaseOrders = (table.options.meta as any)?.purchaseOrders || [];
          const po = purchaseOrders.find((p: PurchaseOrder) => p.id === poId);
          return po ? po.poNumber : `PO #${poId}`;
        },
      },
      {
        id: "date",
        accessorKey: "date",
        size: 120,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Date</span>
              <DataTableSorter column={column} />
            </div>
          );
        },
      },
      {
        id: "hours",
        accessorKey: "hours",
        size: 100,
        header: "Hours",
        cell: ({ row }) => {
          return `${row.original.hours}h`;
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        size: 120,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Amount</span>
              <DataTableSorter column={column} />
            </div>
          );
        },
        cell: ({ row }) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.totalAmount);
        },
      },
      {
        id: "submittedDate",
        accessorKey: "submittedDate",
        size: 120,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Submitted</span>
              <DataTableSorter column={column} />
            </div>
          );
        },
      },
      {
        id: "taskDescription",
        accessorKey: "taskDescription",
        size: 300,
        header: "Task Description",
        enableSorting: false,
        cell: ({ row }) => {
          const desc = row.original.taskDescription;
          return desc.length > 60 ? `${desc.substring(0, 60)}...` : desc;
        },
      },
      {
        id: "actions",
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => {
          return <div className={cn("flex", "w-full", "items-center", "justify-center")}>Actions</div>;
        },
        cell: ({ row }) => {
          const timecard = row.original;
          return (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  go({
                    to: {
                      resource: "timecards",
                      action: "show",
                      id: timecard.id,
                    },
                  })
                }>
                <Eye className="h-4 w-4 mr-2" />
                Review
              </Button>
            </div>
          );
        },
      },
    ],
    [go],
  );

  const table = useTable<Timecard>({
    columns,
    refineCoreProps: {
      resource: "timecards",
      filters: {
        permanent: [
          {
            field: "status",
            operator: "eq",
            value: "Pending",
          },
        ],
      },
    },
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
  });

  // Fetch related contractors
  const contractorIds = table.getRowModel().rows.map((row) => row.original.contractorId);
  const { data: contractorsData } = useMany<Contractor>({
    resource: "contractors",
    ids: contractorIds,
    queryOptions: {
      enabled: contractorIds.length > 0,
    },
  });

  // Fetch related purchase orders
  const poIds = table.getRowModel().rows.map((row) => row.original.purchaseOrderId);
  const { data: purchaseOrdersData } = useMany<PurchaseOrder>({
    resource: "purchase_orders",
    ids: poIds,
    queryOptions: {
      enabled: poIds.length > 0,
    },
  });

  // Update table meta with related data
  table.options.meta = {
    ...table.options.meta,
    contractors: contractorsData?.data || [],
    purchaseOrders: purchaseOrdersData?.data || [],
  };

  const pendingCount = table.getRowModel().rows.length;

  return (
    <ListView>
      <ListViewHeader canCreate={false}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-base px-3 py-1">
            {pendingCount} Pending
          </Badge>
        </div>
      </ListViewHeader>
      {pendingCount === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Eye className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Pending Timecards</h3>
          <p className="text-muted-foreground max-w-md">
            All timecards have been reviewed. New submissions will appear here for approval.
          </p>
        </div>
      ) : (
        <DataTable table={table} />
      )}
    </ListView>
  );
}
