import { useMemo } from "react";
import {
  FileEdit,
  Search,
  PlayCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Percent,
  Receipt,
  UserPlus,
  Send,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { StatementOfWork, SOWTranche } from "@/types";

type SOWStage = "draft" | "review" | "active" | "invoiced" | "paid" | "completed";
type StageStatus = "completed" | "current" | "pending";

interface SOWJourneyMapProps {
  sow: StatementOfWork;
  tranches: SOWTranche[];
  onAction?: (action: string) => void;
}

interface StageInfo {
  id: SOWStage;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface RiskIndicator {
  type: "warning" | "critical" | "info";
  message: string;
  icon: React.ElementType;
}

const stages: StageInfo[] = [
  { id: "draft", label: "Draft", description: "SOW being drafted", icon: FileEdit },
  { id: "review", label: "Review", description: "Under stakeholder review", icon: Search },
  { id: "active", label: "Active", description: "Work in progress", icon: PlayCircle },
  { id: "invoiced", label: "Invoiced", description: "Invoices submitted", icon: FileText },
  { id: "paid", label: "Paid", description: "Payments received", icon: DollarSign },
  { id: "completed", label: "Completed", description: "SOW fulfilled", icon: CheckCircle2 },
];

const statusStyles: Record<StageStatus, { bg: string; border: string; text: string; icon: string; connector: string }> = {
  completed: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/50",
    text: "text-emerald-400",
    icon: "text-emerald-400",
    connector: "bg-emerald-500",
  },
  current: {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/50",
    text: "text-cyan-400",
    icon: "text-cyan-400",
    connector: "bg-slate-600",
  },
  pending: {
    bg: "bg-slate-700/30",
    border: "border-slate-600/50",
    text: "text-slate-500",
    icon: "text-slate-500",
    connector: "bg-slate-700",
  },
};

function formatCurrency(amount: number | null | undefined): string {
  const safeAmount = Number.isFinite(amount) ? (amount as number) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

function safeNum(value: number | null | undefined): number {
  return Number.isFinite(value) ? (value as number) : 0;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function mapSOWStatusToStage(status: StatementOfWork["status"], tranches: SOWTranche[]): SOWStage {
  if (status === "Draft") return "draft";
  if (status === "Cancelled") return "draft";
  if (status === "Pending Approval") return "review";

  const paidCount = tranches.filter((t) => t.status === "paid").length;
  const invoicedCount = tranches.filter((t) => t.status === "invoiced").length;
  const pendingCount = tranches.filter((t) => t.status === "pending").length;
  const totalTranches = tranches.filter((t) => t.status !== "cancelled").length;

  if (status === "Completed") {
    if (totalTranches === 0 || paidCount === totalTranches) return "completed";
    if (paidCount > 0) return "paid";
    if (invoicedCount > 0) return "invoiced";
    return "completed";
  }

  if (paidCount > 0 && paidCount === totalTranches) return "completed";
  if (paidCount > 0) return "paid";
  if (invoicedCount > 0) return "invoiced";

  return "active";
}

export function SOWJourneyMap({ sow, tranches, onAction }: SOWJourneyMapProps) {
  const currentStage = useMemo(() => mapSOWStatusToStage(sow.status, tranches), [sow.status, tranches]);

  const stageStatuses = useMemo(() => {
    const currentIndex = stages.findIndex((s) => s.id === currentStage);
    return stages.map((stage, idx) => {
      if (idx < currentIndex) return "completed";
      if (idx === currentIndex) return "current";
      return "pending";
    });
  }, [currentStage]);

  const totalValue = safeNum(sow.totalValue);
  const invoicedAmount = safeNum(sow.invoicedAmount);
  const utilizationPercent = totalValue > 0 ? (invoicedAmount / totalValue) * 100 : 0;
  const daysRemaining = getDaysRemaining(sow.endDate);

  const pendingTranches = tranches.filter((t) => t.status === "pending");
  const upcomingTranches = pendingTranches
    .filter((t) => t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const riskIndicators = useMemo<RiskIndicator[]>(() => {
    const risks: RiskIndicator[] = [];

    if (sow.status === "Pending Approval") {
      risks.push({
        type: "info",
        message: "Awaiting stakeholder approval",
        icon: Clock,
      });
    }

    if (utilizationPercent >= 90 && currentStage !== "completed") {
      risks.push({
        type: "critical",
        message: `SOW is ${utilizationPercent.toFixed(0)}% utilized`,
        icon: AlertTriangle,
      });
    } else if (utilizationPercent >= 75 && currentStage !== "completed") {
      risks.push({
        type: "warning",
        message: `SOW is ${utilizationPercent.toFixed(0)}% utilized`,
        icon: TrendingUp,
      });
    }

    if (currentStage !== "completed" && currentStage !== "draft" && currentStage !== "review") {
      if (daysRemaining <= 7 && daysRemaining > 0) {
        risks.push({
          type: "critical",
          message: `Only ${daysRemaining} days remaining`,
          icon: Clock,
        });
      } else if (daysRemaining <= 30 && daysRemaining > 0) {
        risks.push({
          type: "warning",
          message: `${daysRemaining} days remaining`,
          icon: Calendar,
        });
      } else if (daysRemaining <= 0) {
        risks.push({
          type: "critical",
          message: "SOW has expired",
          icon: AlertTriangle,
        });
      }
    }

    const overdueTranches = pendingTranches.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date()
    );
    if (overdueTranches.length > 0) {
      risks.push({
        type: "warning",
        message: `${overdueTranches.length} overdue milestone(s)`,
        icon: Receipt,
      });
    }

    return risks;
  }, [utilizationPercent, daysRemaining, pendingTranches, sow.status, currentStage]);

  const currentStageInfo = stages.find((s) => s.id === currentStage);
  const currentStageIndex = stages.findIndex((s) => s.id === currentStage);
  const progressPercent = ((currentStageIndex + 1) / stages.length) * 100;

  const stageDetails = useMemo(() => {
    switch (currentStage) {
      case "draft":
        return {
          whatNow: "SOW is being drafted and prepared for review",
          nextActions: ["Complete SOW details", "Add deliverables", "Set payment schedule"],
        };
      case "review":
        return {
          whatNow: "SOW is under stakeholder review for approval",
          nextActions: ["Await approval", "Address feedback", "Finalize terms"],
        };
      case "active":
        return {
          whatNow: "Work is actively being performed under this SOW",
          nextActions: ["Monitor progress", "Track milestones", "Process timecards"],
        };
      case "invoiced":
        return {
          whatNow: "Invoices have been submitted for payment",
          nextActions: ["Track payment status", "Follow up on pending", "Reconcile amounts"],
        };
      case "paid":
        return {
          whatNow: "Payments are being received for completed work",
          nextActions: ["Verify payments", "Update records", "Close pending invoices"],
        };
      case "completed":
        return {
          whatNow: "All work and payments have been completed",
          nextActions: ["Archive documents", "Review performance", "Close out SOW"],
        };
      default:
        return { whatNow: "", nextActions: [] };
    }
  }, [currentStage]);

  const quickActions = useMemo(() => {
    const actions: { id: string; label: string; icon: React.ElementType; primary?: boolean }[] = [];

    if (currentStage === "draft") {
      actions.push({ id: "request-review", label: "Request Review", icon: Search, primary: true });
    }

    if (currentStage === "review") {
      actions.push({ id: "approve-sow", label: "Approve SOW", icon: CheckCircle2, primary: true });
      actions.push({ id: "request-changes", label: "Request Changes", icon: FileEdit });
    }

    if ((currentStage === "active" || currentStage === "invoiced") && pendingTranches.length > 0) {
      actions.push({ id: "create-invoice", label: "Create Invoice", icon: Receipt, primary: true });
    }

    if (currentStage === "paid") {
      actions.push({ id: "verify-payment", label: "Verify Payment", icon: DollarSign, primary: true });
    }

    if (currentStage !== "completed" && currentStage !== "draft" && currentStage !== "review") {
      actions.push({ id: "add-stakeholder", label: "Add Stakeholder", icon: UserPlus });
    }
    actions.push({ id: "send-update", label: "Send Update", icon: Send });

    return actions;
  }, [currentStage, pendingTranches.length]);

  const handleAction = (actionId: string) => {
    onAction?.(actionId);
  };

  return (
    <TooltipProvider>
      <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`,
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="relative p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">SOW Journey</h3>
                <p className="text-xs text-slate-400">{sow.sowNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${statusStyles.current.bg} ${statusStyles.current.border} ${statusStyles.current.text} text-[10px] font-bold uppercase tracking-wider`}>
                {currentStageInfo?.label}
              </Badge>
              <span className="text-xs text-slate-500">
                Stage {currentStageIndex + 1}/{stages.length}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-6">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const status = stageStatuses[idx];
              const style = statusStyles[status];
              const isLast = idx === stages.length - 1;

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex-shrink-0 cursor-default">
                        <div
                          className={`
                            w-12 h-12 rounded-lg ${style.bg} ${style.border} border
                            flex items-center justify-center relative transition-all duration-300
                            ${status === "current" ? "ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10" : ""}
                          `}>
                          {status === "current" ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full rounded-lg bg-cyan-500/10 animate-pulse" />
                            </div>
                          ) : null}
                          <Icon className={`w-5 h-5 ${style.icon} relative z-10`} />
                          {status === "completed" && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${style.text}`}>
                            {stage.label}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${style.icon}`} />
                          <span className="text-sm font-semibold text-white">{stage.label}</span>
                        </div>
                        <p className="text-xs text-slate-400">{stage.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {!isLast && (
                    <div className="flex-1 mx-2 flex items-center">
                      <div className={`h-0.5 flex-1 ${style.connector} rounded-full relative overflow-hidden`}>
                        {status === "current" && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-transparent animate-pulse" />
                        )}
                      </div>
                      <ChevronRight className={`w-3 h-3 ${style.icon} -ml-1`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Current Stage</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">What's happening now</p>
                  <p className="text-sm text-slate-200">{stageDetails.whatNow}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">Next actions available</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stageDetails.nextActions.map((action, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600/50 text-slate-300 text-[10px]">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
                {riskIndicators.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Alerts</p>
                    <div className="space-y-1.5">
                      {riskIndicators.map((risk, idx) => {
                        const RiskIcon = risk.icon;
                        const colorClass =
                          risk.type === "critical"
                            ? "text-red-400 bg-red-500/10 border-red-500/30"
                            : risk.type === "warning"
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                              : "text-blue-400 bg-blue-500/10 border-blue-500/30";
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded border ${colorClass}`}>
                            <RiskIcon className="w-3 h-3" />
                            <span className="text-xs">{risk.message}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Insights</h4>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Percent className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{utilizationPercent.toFixed(0)}%</div>
                    <div className="text-[10px] text-slate-400 uppercase">Utilized</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{formatCurrency(safeNum(sow.remainingValue))}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className={`text-lg font-bold ${daysRemaining <= 7 ? "text-red-400" : daysRemaining <= 30 ? "text-amber-400" : "text-white"}`}>
                      {daysRemaining > 0 ? daysRemaining : 0}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">Days Left</div>
                  </div>
                </div>

                {upcomingTranches.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Upcoming Milestones</p>
                    <div className="space-y-1.5">
                      {upcomingTranches.map((tranche) => (
                        <div
                          key={tranche.id}
                          className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-700/30 border border-slate-600/30">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-300 truncate max-w-[120px]">{tranche.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-200">{formatCurrency(tranche.amount)}</span>
                            <Badge variant="outline" className="text-[9px] bg-slate-700/50 border-slate-600/50 text-slate-400">
                              {formatDate(tranche.dueDate)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-400 mb-2">Overall Progress</p>
                  <Progress value={utilizationPercent} className="h-2 bg-slate-700" />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-500">{formatCurrency(invoicedAmount)} invoiced</span>
                    <span className="text-[10px] text-slate-500">{formatCurrency(totalValue)} total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Quick Actions</p>
              <div className="flex items-center gap-2">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      size="sm"
                      variant={action.primary ? "default" : "outline"}
                      className={`gap-1.5 text-xs ${
                        action.primary
                          ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => handleAction(action.id)}>
                      <ActionIcon className="w-3 h-3" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export type { SOWJourneyMapProps };
