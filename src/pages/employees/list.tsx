import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import {
  DataTableFilterDropdownText,
  DataTableFilterDropdownNumeric,
} from "@/components/refine-ui/data-table/data-table-filter";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ListViewHeader, ListView } from "@/components/refine-ui/views/list-view";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { cn } from "@/lib/utils";
import type { Employee } from "../../types";

export function EmployeesListPage() {
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 96,
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
        id: "avatar",
        header: "Avatar",
        size: 64,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <Avatar className="size-10">
              <AvatarImage src={employee.avatarUrl} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback>
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        id: "firstName",
        accessorKey: "firstName",
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>First Name</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownText
                  defaultOperator="contains"
                  column={column}
                  table={table}
                  placeholder="Filter by first name"
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "lastName",
        accessorKey: "lastName",
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Last Name</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownText
                  defaultOperator="contains"
                  column={column}
                  table={table}
                  placeholder="Filter by last name"
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "jobTitle",
        accessorKey: "jobTitle",
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Job Title</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownText
                  defaultOperator="contains"
                  column={column}
                  table={table}
                  placeholder="Filter by job title"
                />
              </div>
            </div>
          );
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-1">
              <span>Email</span>
              <div>
                <DataTableSorter column={column} />
                <DataTableFilterDropdownText
                  defaultOperator="contains"
                  column={column}
                  table={table}
                  placeholder="Filter by email"
                />
              </div>
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
          const employee = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex",
                    "size-8",
                    "border",
                    "rounded-full",
                    "text-muted-foreground",
                    "data-[state=open]:bg-muted",
                    "data-[state=open]:text-foreground",
                    "mx-auto",
                  )}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-2 p-2">
                <ShowButton
                  variant="ghost"
                  size="sm"
                  className="w-full items-center justify-start"
                  resource="employees"
                  recordItemId={employee.id}
                />
                <EditButton
                  variant="ghost"
                  size="sm"
                  className="w-full items-center justify-start"
                  resource="employees"
                  recordItemId={employee.id}
                />
                <DeleteButton
                  key={employee.id}
                  size="sm"
                  className="w-full items-center justify-start"
                  resource="employees"
                  recordItemId={employee.id}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useTable<Employee>({
    columns,
    refineCoreProps: {
      resource: "employees",
    },
    initialState: {
      columnPinning: {
        left: ["id", "avatar"],
        right: ["actions"],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader canCreate={true} />
      <DataTable table={table} />
    </ListView>
  );
}
