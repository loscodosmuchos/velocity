import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useCreate, useDelete, useNotification } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Filter, Globe, Lock, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterPreset } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterPresetsPage() {
  const { open } = useNotification();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPreset, setNewPreset] = useState({
    name: "",
    description: "",
    resource: "",
    isPublic: false,
  });

  const { mutate: createPreset } = useCreate();
  const { mutate: deletePreset } = useDelete();

  const columns = useMemo<ColumnDef<FilterPreset>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        size: 80,
        header: "ID",
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        id: "resource",
        accessorKey: "resource",
        size: 150,
        header: "Resource",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.resource}
          </Badge>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: "Description",
        enableSorting: false,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || "—"}</span>,
      },
      {
        id: "filters",
        accessorKey: "filters",
        size: 100,
        header: "Filters",
        cell: ({ row }) => (
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            {row.original.filters.length}
          </Badge>
        ),
      },
      {
        id: "isPublic",
        accessorKey: "isPublic",
        size: 100,
        header: "Visibility",
        cell: ({ row }) =>
          row.original.isPublic ? (
            <Badge variant="default" className="gap-1">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        size: 150,
        header: "Created",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        size: 150,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <div className={cn("flex", "w-full", "items-center", "justify-center")}>Actions</div>,
        cell: ({ row }) => {
          const preset = row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  open?.({
                    type: "success",
                    message: "Filter applied",
                    description: `Applied preset: ${preset.name}`,
                  });
                }}>
                <Copy className="h-3 w-3" />
                Apply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  deletePreset(
                    {
                      resource: "filterpresets",
                      id: preset.id,
                    },
                    {
                      onSuccess: () => {
                        open?.({
                          type: "success",
                          message: "Preset deleted",
                          description: `Deleted filter preset: ${preset.name}`,
                        });
                      },
                    },
                  );
                }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deletePreset, open],
  );

  const table = useTable<FilterPreset>({
    columns,
    refineCoreProps: {
      resource: "filterpresets",
    },
  });

  const handleCreatePreset = () => {
    if (!newPreset.name || !newPreset.resource) {
      open?.({
        type: "error",
        message: "Missing information",
        description: "Please provide a name and select a resource",
      });
      return;
    }

    createPreset(
      {
        resource: "filterpresets",
        values: {
          ...newPreset,
          userId: 1, // Mock user ID
          filters: [],
          sorters: [],
          createdAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Preset created",
            description: `Created filter preset: ${newPreset.name}`,
          });
          setShowCreateDialog(false);
          setNewPreset({ name: "", description: "", resource: "", isPublic: false });
          table.refineCore.tableQuery.refetch();
        },
      },
    );
  };

  return (
    <ListView>
      <ListViewHeader canCreate={false}>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Filter className="h-4 w-4" />
          Create Preset
        </Button>
      </ListViewHeader>
      <DataTable table={table} />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Filter Preset</DialogTitle>
            <DialogDescription>
              Save your filter settings to reuse later. Public presets can be used by your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Name *</Label>
              <Input
                id="preset-name"
                value={newPreset.name}
                onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                placeholder="e.g., My Active Contractors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-resource">Resource *</Label>
              <Select
                value={newPreset.resource}
                onValueChange={(value) => setNewPreset({ ...newPreset, resource: value })}>
                <SelectTrigger id="preset-resource">
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractors">Contractors</SelectItem>
                  <SelectItem value="purchaseorders">Purchase Orders</SelectItem>
                  <SelectItem value="timecards">Timecards</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="statementofworks">Statement of Works</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-description">Description</Label>
              <Textarea
                id="preset-description"
                value={newPreset.description}
                onChange={(e) => setNewPreset({ ...newPreset, description: e.target.value })}
                placeholder="Optional description of this filter preset"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="preset-public"
                checked={newPreset.isPublic}
                onCheckedChange={(checked) => setNewPreset({ ...newPreset, isPublic: checked })}
              />
              <Label htmlFor="preset-public" className="cursor-pointer">
                Make this preset public (visible to all team members)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePreset}>Create Preset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ListView>
  );
}
