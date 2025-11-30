import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import { useGetIdentity } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import type { ContractorExpense } from "@/types";
import { Link } from "react-router";

export function ContractorExpensesPage() {
  const { data: identity } = useGetIdentity<{ id: number }>();

  const columns = useMemo<ColumnDef<ContractorExpense>[]>(
    () => [
      {
        accessorKey: "expenseDate",
        header: "Date",
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return new Date(date).toLocaleDateString();
        },
      },
      {
        accessorKey: "expenseType",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue<string>();
          return <Badge variant="outline">{type}</Badge>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue, row }) => {
          const amount = getValue<number>();
          const currency = row.original.currency;
          return `${currency} ${amount.toFixed(2)}`;
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
                  : status === "Approved"
                    ? "secondary"
                    : status === "Rejected"
                      ? "destructive"
                      : "outline"
              }>
              {status}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  const table = useTable<ContractorExpense>({
    columns,
    refineCoreProps: {
      resource: "contractor_expenses",
      filters: {
        permanent: identity?.id ? [{ field: "contractorId", operator: "eq", value: identity.id }] : [],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="My Expenses">
        <Link to="/contractor-portal/expenses/create">
          <Button>
            <Receipt className="h-4 w-4 mr-2" />
            Submit Expense
          </Button>
        </Link>
      </ListViewHeader>
      <DataTable table={table} />
    </ListView>
  );
}
