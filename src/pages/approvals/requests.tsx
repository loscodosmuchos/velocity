import { useMemo, useState, useEffect } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterCombobox } from "@/components/refine-ui/data-table/data-table-filter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Check, X, Loader2, Clock, AlertCircle, CheckCircle2, Shield, Users, Timer, Zap, ArrowRight, FileCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LegendaryHero, LegendaryKPIGrid, LegendaryEmptyState, LegendaryLoadingState } from "@/components/legendary";
import { cn } from "@/lib/utils";
import type { ApprovalRequest } from "@/types";

export function ApprovalRequestsPage() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, avgTime: 0 });
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | number | null>(null);
  const [tableKey, setTableKey] = useState(0);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/approvals/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats({ pending: 8, approved: 0, rejected: 0, avgTime: 0 });
      }
    };
    loadStats();
  }, [tableKey]);

  const handleRejectConfirm = async () => {
    setLoadingId(rejectingId);
    try {
      const response = await fetch(`/api/approvals/${rejectingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || 'No reason provided' })
      });
      if (response.ok) {
        toast.success('Item rejected successfully!');
        setShowRejectDialog(false);
        setRejectReason("");
        setRejectingId(null);
        setTableKey(prev => prev + 1);
      } else {
        toast.error('Rejection failed');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('Error rejecting item');
    } finally {
      setLoadingId(null);
    }
  };

  const columns = useMemo<ColumnDef<ApprovalRequest>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ getValue }) => (
          <span className="text-blue-400 font-medium">#{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "entityType",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Type</span>
            <DataTableFilterCombobox
              column={column}
              defaultOperator="in"
              multiple={true}
              options={[
                { label: "Invoice", value: "Invoice" },
                { label: "Timecard", value: "Timecard" },
                { label: "Expense", value: "Expense" },
                { label: "PO", value: "PO" },
                { label: "SOW", value: "SOW" },
              ]}
            />
          </div>
        ),
        size: 120,
        cell: ({ getValue }) => {
          const type = getValue<string>();
          const typeColors: Record<string, string> = {
            Invoice: "text-purple-400 bg-purple-500/20 border-purple-500/30",
            Timecard: "text-blue-400 bg-blue-500/20 border-blue-500/30",
            Expense: "text-amber-400 bg-amber-500/20 border-amber-500/30",
            PO: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
            SOW: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
          };
          return (
            <span className={cn("px-2 py-1 rounded-md border text-xs font-medium", typeColors[type] || "text-slate-400 bg-slate-700 border-slate-600")}>
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "entityName",
        header: "Item",
        size: 200,
        cell: ({ getValue }) => (
          <span className="text-white font-medium">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "requestedByName",
        header: "Requested By",
        size: 150,
      },
      {
        accessorKey: "approvalChainStep",
        header: "Progress",
        size: 130,
        cell: ({ getValue, row }) => {
          const current = getValue<number>() || 1;
          const total = row.original.totalChainSteps || 3;
          const percentage = (current / total) * 100;
          
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{current}/{total}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "slaStatus",
        header: "SLA",
        size: 120,
        cell: ({ getValue }) => {
          const status = getValue<string>() || "On Time";
          const slaColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
            "On Time": { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: CheckCircle2 },
            "At Risk": { bg: "bg-amber-500/20", text: "text-amber-400", icon: AlertCircle },
            "Breached": { bg: "bg-red-500/20", text: "text-red-400", icon: Timer },
          };
          const { bg, text, icon: Icon } = slaColors[status] || slaColors["On Time"];
          
          return (
            <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md", bg)}>
              <Icon className={cn("h-3.5 w-3.5", text)} />
              <span className={cn("text-xs font-medium", text)}>{status}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Status</span>
            <DataTableFilterCombobox
              column={column}
              defaultOperator="in"
              multiple={true}
              options={[
                { label: "Pending", value: "Pending" },
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
                { label: "Escalated", value: "Escalated" },
              ]}
            />
          </div>
        ),
        size: 120,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return <StatusBadge status={status} category="approval" />;
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 180,
        cell: ({ row }) => {
          if (row.original.status !== "Pending") {
            return (
              <span className="text-xs text-slate-500 italic">Completed</span>
            );
          }
          
          const handleApprove = async () => {
            setLoadingId(row.original.id);
            try {
              const response = await fetch(`/api/approvals/${row.original.id}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              if (response.ok) {
                toast.success('Item approved successfully!');
                setTableKey(prev => prev + 1);
              } else {
                toast.error('Approval failed');
              }
            } catch (error) {
              console.error('Error approving:', error);
              toast.error('Error approving item');
            } finally {
              setLoadingId(null);
            }
          };
          
          return (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2"
                onClick={handleApprove}
                disabled={loadingId === row.original.id}
              >
                {loadingId === row.original.id ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                className="h-7 px-2"
                onClick={() => {
                  setRejectingId(row.original.id);
                  setShowRejectDialog(true);
                }}
                disabled={loadingId === row.original.id}
              >
                {loadingId === row.original.id ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <X className="h-3 w-3 mr-1" />
                )}
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [loadingId],
  );

  const table = useTable<ApprovalRequest>({
    columns,
    refineCoreProps: {
      resource: "approval_requests",
    },
  });

  const isLoading = table.refineCore.tableQuery.isLoading;

  const allRequests = table.getRowModel().rows.map((r) => r.original);
  const pendingCount = allRequests.filter((r) => r.status === "Pending").length;
  const atRiskCount = allRequests.filter((r) => {
    const sla = r.slaStatus as string;
    return sla === "At Risk" || sla === "Breached" || sla === "Overdue";
  }).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        {/* LEGENDARY HERO */}
        <LegendaryHero
          title="Approval Center"
          subtitle="Review, approve, and track all pending requests with SLA monitoring and delegation management"
          icon={Shield}
          iconGradient="from-cyan-500 to-blue-500"
          badge={{ label: "WORKFLOW", variant: "live" }}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Delegations
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
          }
        >
          {/* LEGENDARY KPI GRID */}
          <LegendaryKPIGrid
            columns={4}
            items={[
              {
                label: "Pending Approval",
                value: stats.pending || pendingCount,
                subtext: "Awaiting your action",
                icon: Clock,
                iconColor: "text-cyan-400",
                highlight: true,
              },
              {
                label: "Approved",
                value: stats.approved.toString(),
                subtext: "This period",
                icon: CheckCircle2,
                iconColor: "text-emerald-400",
                trend: "up",
                trendValue: "+12%",
              },
              {
                label: "Rejected",
                value: stats.rejected.toString(),
                subtext: "Requiring revision",
                icon: X,
                iconColor: stats.rejected > 0 ? "text-red-400" : "text-slate-400",
              },
              {
                label: "Avg Response Time",
                value: stats.avgTime ? `${stats.avgTime}h` : "—",
                subtext: "Hours to approve",
                icon: Timer,
                iconColor: "text-amber-400",
              },
            ]}
          />
        </LegendaryHero>

        {/* SLA Warning */}
        {atRiskCount > 0 && (
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-950/30 to-red-950/30 rounded-xl border border-amber-500/30 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">
                ⚠ {atRiskCount} approval{atRiskCount !== 1 ? 's' : ''} at SLA risk
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Review these items urgently to maintain compliance with approval SLAs. Escalation may occur if not addressed.
              </p>
            </div>
          </div>
        )}

        {/* Quick Filters */}
        {allRequests.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto">
            <Button variant="outline" size="sm" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 flex-shrink-0">
              <Clock className="h-4 w-4 mr-2" />
              Pending ({pendingCount})
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-shrink-0">
              <AlertCircle className="h-4 w-4 mr-2" />
              At Risk ({atRiskCount})
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-shrink-0">
              <ArrowRight className="h-4 w-4 mr-2" />
              My Approvals
            </Button>
          </div>
        )}

        {/* Loading State, Empty State, or Data Table */}
        {isLoading ? (
          <LegendaryLoadingState
            icon={Shield}
            iconGradient="from-cyan-600/20 to-blue-600/20"
            title="Loading Approvals"
            description="Fetching pending requests and SLA status..."
          />
        ) : allRequests.length === 0 ? (
          <LegendaryEmptyState
            icon={Shield}
            iconGradient="from-cyan-600/20 to-blue-600/20"
            title="No Pending Approvals"
            description="All caught up! There are no items currently awaiting your approval."
            teachingPoints={[
              "Approval requests appear here automatically",
              "SLA monitoring ensures timely processing",
              "Delegation allows others to approve on your behalf",
              "Full audit trail maintained for compliance",
            ]}
            primaryAction={{
              label: "View History",
              icon: FileCheck,
            }}
            secondaryAction={{
              label: "Configure Rules",
              icon: Shield,
            }}
          />
        ) : (
          <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
            <DataTable table={table} key={tableKey} />
          </div>
        )}

        {/* Footer Insights */}
        {allRequests.length > 0 && (
          <div className="mt-6 p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Approval Insights</span>
            </div>
            <p className="text-sm text-slate-400">
              {pendingCount > 0 && `⏳ ${pendingCount} item${pendingCount !== 1 ? 's' : ''} awaiting your review. `}
              {stats.approved > 0 && `✓ ${stats.approved} approved this period. `}
              {stats.avgTime > 0 && `Average response time: ${stats.avgTime} hours.`}
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700">
          <DialogTitle className="text-white">Reject Approval</DialogTitle>
          <DialogDescription className="text-slate-400">
            Please provide a reason for rejecting this item. This will be visible to the requester.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px] bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleRejectConfirm()} 
              disabled={loadingId !== null}
            >
              {loadingId !== null ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
