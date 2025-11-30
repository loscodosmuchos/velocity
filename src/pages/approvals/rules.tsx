import { useMemo } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ApprovalRule } from "@/types";

export function ApprovalRulesPage() {
  const columns = useMemo<ColumnDef<ApprovalRule>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Rule Name",
      },
      {
        accessorKey: "entityType",
        header: "Applies To",
        cell: ({ getValue }) => {
          const type = getValue<string>();
          return <Badge variant="outline">{type}</Badge>;
        },
      },
      {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ getValue, row }) => {
          const condition = getValue<string>();
          const threshold = row.original.thresholdAmount;
          if (condition === "amount_threshold" && threshold) {
            return `Amount > $${threshold.toLocaleString()}`;
          }
          return condition.replace(/_/g, " ");
        },
      },
      {
        accessorKey: "approvalChain",
        header: "Approval Chain",
        cell: ({ getValue }) => {
          const chain = getValue<ApprovalRule["approvalChain"]>();
          return (
            <div className="text-sm">
              {chain.map((step, idx) => (
                <div key={idx}>
                  {step.order}. {step.roleName} ({step.slaHours}h SLA)
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ getValue }) => {
          const isActive = getValue<boolean>();
          return <Switch checked={isActive} disabled />;
        },
      },
    ],
    [],
  );

  const table = useTable<ApprovalRule>({
    columns,
    refineCoreProps: {
      resource: "approval_rules",
    },
  });

  const navigate = useNavigate();
  
  return (
    <ListView>
      <ListViewHeader title="Approval Rules">
        <Button onClick={() => navigate('/approvals/rules/create')}>Create Rule</Button>
      </ListViewHeader>
      <DataTable table={table} />
    </ListView>
  );
}
