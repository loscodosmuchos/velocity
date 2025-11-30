import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Milestone,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  MoreHorizontal,
  FileText,
  XCircle,
  Loader2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import type { SOWTranche } from "@/types";

interface SOWTranchesProps {
  sowId: number | string;
  totalValue?: number;
}

interface TrancheSummary {
  totalTranches: number;
  paidCount: number;
  invoicedCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalAmount: number;
  paidAmount: number;
  invoicedAmount: number;
  pendingAmount: number;
  completionPercentage: number;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: Clock,
    dotColor: "bg-amber-400",
  },
  invoiced: {
    label: "Invoiced",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: FileText,
    dotColor: "bg-blue-400",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
    dotColor: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    icon: XCircle,
    dotColor: "bg-slate-400",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SOWTranches({ sowId, totalValue }: SOWTranchesProps) {
  const [tranches, setTranches] = useState<SOWTranche[]>([]);
  const [summary, setSummary] = useState<TrancheSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    percentage: "",
    dueDate: "",
    status: "pending",
  });

  const fetchTranches = useCallback(async () => {
    if (!sowId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [tranchesRes, summaryRes] = await Promise.all([
        fetch(`/api/statementofworks/${sowId}/tranches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/statementofworks/${sowId}/tranches/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (tranchesRes.ok) {
        const data = await tranchesRes.json();
        setTranches(data);
      }
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Failed to fetch tranches:", error);
      toast.error("Failed to load payment milestones");
    } finally {
      setLoading(false);
    }
  }, [sowId]);

  useEffect(() => {
    fetchTranches();
  }, [fetchTranches]);

  const handleAddTranche = async () => {
    if (!formData.name || !formData.amount) {
      toast.error("Name and amount are required");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/statementofworks/${sowId}/tranches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          amount: parseFloat(formData.amount),
          percentage: formData.percentage ? parseFloat(formData.percentage) : null,
          dueDate: formData.dueDate || null,
          status: formData.status,
        }),
      });

      if (response.ok) {
        toast.success("Payment milestone added successfully");
        setAddDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          amount: "",
          percentage: "",
          dueDate: "",
          status: "pending",
        });
        fetchTranches();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add milestone");
      }
    } catch (error) {
      console.error("Failed to add tranche:", error);
      toast.error("Failed to add payment milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (trancheId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/statementofworks/${sowId}/tranches/${trancheId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Milestone marked as ${newStatus}`);
        fetchTranches();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update milestone status");
    }
  };

  const handleDeleteTranche = async (trancheId: number) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/statementofworks/${sowId}/tranches/${trancheId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Milestone deleted");
        fetchTranches();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete milestone");
      }
    } catch (error) {
      console.error("Failed to delete tranche:", error);
      toast.error("Failed to delete milestone");
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-950/50 border-slate-800">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </CardContent>
      </Card>
    );
  }

  const completionPercent = summary?.completionPercentage ?? 0;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Milestone className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-100">Payment Milestones</CardTitle>
              <p className="text-sm text-slate-400">
                {tranches.length} milestone{tranches.length !== 1 ? "s" : ""} • {formatCurrency(summary?.totalAmount ?? 0)} total
              </p>
            </div>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Add Payment Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Milestone Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Phase 1: Discovery"
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-300">
                      Amount ($) *
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="25000"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-slate-300">
                      Percentage (%)
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      value={formData.percentage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, percentage: e.target.value }))}
                      placeholder="25"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-slate-300">
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-300">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="invoiced">Invoiced</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddTranche} disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-700">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Milestone
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pt-4">
          {summary && (
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Overall Completion</span>
                <span className="text-slate-200 font-medium">{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className="h-2 bg-slate-800" />
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">Paid: {formatCurrency(summary.paidAmount)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-slate-400">Invoiced: {formatCurrency(summary.invoicedAmount)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Pending: {formatCurrency(summary.pendingAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {tranches.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Milestone className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No payment milestones defined yet.</p>
              <p className="text-sm mt-1">Click "Add Milestone" to create one.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700" />
              <div className="space-y-4">
                {tranches.map((tranche, index) => {
                  const config = statusConfig[tranche.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const isLast = index === tranches.length - 1;

                  return (
                    <div key={tranche.id} className="relative pl-10">
                      <div
                        className={`absolute left-2.5 w-3 h-3 rounded-full ${config.dotColor} ring-4 ring-slate-950`}
                      />
                      <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono text-slate-500">#{tranche.sequenceOrder}</span>
                                <h4 className="font-medium text-slate-100 truncate">{tranche.name}</h4>
                                <Badge variant="outline" className={config.className}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </div>
                              {tranche.description && (
                                <p className="text-sm text-slate-400 mb-3">{tranche.description}</p>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-300">
                                  <DollarSign className="h-4 w-4 text-emerald-400" />
                                  <span className="font-medium">{formatCurrency(tranche.amount)}</span>
                                  {tranche.percentage && (
                                    <span className="text-slate-500">({tranche.percentage}%)</span>
                                  )}
                                </div>
                                {tranche.dueDate && (
                                  <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due: {formatDate(tranche.dueDate)}</span>
                                  </div>
                                )}
                                {tranche.paidDate && (
                                  <div className="flex items-center gap-1.5 text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Paid: {formatDate(tranche.paidDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                {tranche.status !== "pending" && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(tranche.id, "pending")}
                                    className="text-slate-200 focus:bg-slate-700">
                                    <Clock className="h-4 w-4 mr-2 text-amber-400" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                )}
                                {tranche.status !== "invoiced" && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(tranche.id, "invoiced")}
                                    className="text-slate-200 focus:bg-slate-700">
                                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                                    Mark as Invoiced
                                  </DropdownMenuItem>
                                )}
                                {tranche.status !== "paid" && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(tranche.id, "paid")}
                                    className="text-slate-200 focus:bg-slate-700">
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                {tranche.status !== "cancelled" && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(tranche.id, "cancelled")}
                                    className="text-slate-200 focus:bg-slate-700">
                                    <XCircle className="h-4 w-4 mr-2 text-slate-400" />
                                    Mark as Cancelled
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTranche(tranche.id)}
                                  className="text-red-400 focus:bg-red-500/20 focus:text-red-300">
                                  Delete Milestone
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {summary && summary.totalTranches > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{summary.paidCount}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Paid</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{summary.invoicedCount}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Invoiced</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{summary.pendingCount}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{completionPercent}%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Complete</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
