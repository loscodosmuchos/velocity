import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import type { EmailLog } from "@/types";

export function EmailLogsPage() {
  const columns = useMemo<ColumnDef<EmailLog>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "recipient",
        header: "Recipient",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "templateType",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue<string>();
          return <Badge variant="outline">{type.replace(/_/g, " ")}</Badge>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "Sent" ? "default" : status === "Failed" ? "destructive" : "secondary"}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "sentAt",
        header: "Sent At",
        cell: ({ getValue }) => {
          const date = getValue<string | undefined>();
          return date ? new Date(date).toLocaleString() : "Not sent";
        },
      },
      {
        accessorKey: "errorMessage",
        header: "Error",
        cell: ({ getValue }) => {
          const error = getValue<string | undefined>();
          return error ? <span className="text-red-600 text-sm">{error}</span> : null;
        },
      },
    ],
    [],
  );

  const table = useTable<EmailLog>({
    columns,
    refineCoreProps: {
      resource: "email_logs",
    },
  });

  return (
    <ListView>
      <ListViewHeader title="Email Notification Logs" />
      <DataTable table={table} />
    </ListView>
  );
}
