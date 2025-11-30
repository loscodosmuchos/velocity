import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { useGetIdentity } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Timecard } from "@/types";
import { Link } from "react-router";

export function ContractorTimecardsPage() {
  const { data: identity } = useGetIdentity<{ id: number }>();

  const columns = useMemo<ColumnDef<Timecard>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: "hours",
        header: "Hours",
      },
      {
        accessorKey: "taskDescription",
        header: "Description",
      },
      {
        accessorKey: "totalAmount",
        header: "Amount",
        cell: ({ getValue }) => {
          const amount = getValue<number>();
          return `$${amount.toFixed(2)}`;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "submittedDate",
        header: "Submitted",
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return new Date(date).toLocaleDateString();
        },
      },
    ],
    [],
  );

  const table = useTable<Timecard>({
    columns,
    refineCoreProps: {
      resource: "timecards",
      filters: {
        permanent: identity?.id ? [{ field: "contractorId", operator: "eq", value: identity.id }] : [],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="My Timecards">
        <Link to="/contractor-portal/timecards/create">
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            Submit Timecard
          </Button>
        </Link>
      </ListViewHeader>
      <DataTable table={table} />
    </ListView>
  );
}
