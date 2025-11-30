import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMany } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import { Shield, Users, Eye, Edit, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, Department } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserManagementPage() {
  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Manager":
        return "default";
      case "Contractor":
        return "secondary";
      case "Viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 80,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>ID</span>
            <DataTableSorter column={column} />
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "firstName",
        size: 200,
        header: "Name",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        id: "email",
        accessorKey: "email",
        size: 250,
        header: "Email",
      },
      {
        id: "role",
        accessorKey: "role",
        size: 120,
        header: "Role",
        cell: ({ row }) => <Badge variant={getRoleBadgeVariant(row.original.role)}>{row.original.role}</Badge>,
      },
      {
        id: "departmentId",
        accessorKey: "departmentId",
        size: 150,
        header: "Department",
        cell: ({ row, table }) => {
          const departmentId = row.original.departmentId;
          if (!departmentId) return <span className="text-muted-foreground">—</span>;
          const departments = (table.options.meta as any)?.departments || [];
          const department = departments.find((d: Department) => d.id === departmentId);
          return department ? department.name : `Dept #${departmentId}`;
        },
      },
      {
        id: "permissions",
        accessorKey: "permissions",
        size: 150,
        header: "Permissions",
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            {row.original.permissions.length} permissions
          </Badge>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        size: 150,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Created</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <div className={cn("flex", "w-full", "items-center", "justify-center")}>Actions</div>,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Lock className="h-4 w-4 mr-2" />
                    Deactivate User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: "admin/users",
    },
    initialState: {
      columnPinning: {
        left: [],
        right: ["actions"],
      },
    },
  });

  const departmentIds = table
    .getRowModel()
    .rows.map((row) => row.original.departmentId)
    .filter((id): id is number => id !== undefined);
  const { data: departmentsData } = useMany<Department>({
    resource: "departments",
    ids: departmentIds,
    queryOptions: {
      enabled: departmentIds.length > 0,
    },
  });

  table.options.meta = {
    ...table.options.meta,
    departments: departmentsData?.data || [],
  };

  const roleStats = {
    Admin: table.getRowModel().rows.filter((r) => r.original.role === "Admin").length,
    Manager: table.getRowModel().rows.filter((r) => r.original.role === "Manager").length,
    Contractor: table.getRowModel().rows.filter((r) => r.original.role === "Contractor").length,
    Viewer: table.getRowModel().rows.filter((r) => r.original.role === "Viewer").length,
  };

  return (
    <ListView>
      <ListViewHeader 
        canCreate={true}
        resource="admin/users"
      />

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Shield className="h-4 w-4 text-red-600" />
            <span>Admins</span>
          </div>
          <div className="text-2xl font-bold">{roleStats.Admin}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Managers</span>
          </div>
          <div className="text-2xl font-bold">{roleStats.Manager}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4 text-green-600" />
            <span>Contractors</span>
          </div>
          <div className="text-2xl font-bold">{roleStats.Contractor}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Eye className="h-4 w-4 text-gray-600" />
            <span>Viewers</span>
          </div>
          <div className="text-2xl font-bold">{roleStats.Viewer}</div>
        </div>
      </div>

      <DataTable table={table} />
    </ListView>
  );
}
