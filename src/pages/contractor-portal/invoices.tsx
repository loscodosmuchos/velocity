import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { useGetIdentity } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import type { Invoice } from "@/types";

export function ContractorInvoicesPage() {
  const { data: identity } = useGetIdentity<{ id: number }>();

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice #",
      },
      {
        accessorKey: "invoiceDate",
        header: "Date",
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: "actualAmount",
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
            <Badge
              variant={
                status === "Paid"
                  ? "default"
                  : status === "GR Approved"
                    ? "secondary"
                    : status === "Disputed"
                      ? "destructive"
                      : "outline"
              }>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "paidDate",
        header: "Paid Date",
        cell: ({ getValue }) => {
          const date = getValue<string | undefined>();
          return date ? new Date(date).toLocaleDateString() : "Pending";
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ShowButton resource="invoices" recordItemId={row.original.id} />,
      },
    ],
    [],
  );

  const table = useTable<Invoice>({
    columns,
    refineCoreProps: {
      resource: "invoices",
      filters: {
        permanent: identity?.id ? [{ field: "contractorId", operator: "eq", value: identity.id }] : [],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="My Invoices" />
      <DataTable table={table} />
    </ListView>
  );
}
