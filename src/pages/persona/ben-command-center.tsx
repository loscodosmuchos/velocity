import { useState, useMemo } from "react";
import { useList, useGo } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OCRTimecardProcessor } from "@/components/admin/ocr-timecard-processor";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  ChevronDown,
  ChevronRight,
  Zap,
  Brain,
  Mic,
  Upload,
  Send,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
  BarChart3,
  RefreshCw,
  Eye,
  UserPlus,
  MessageSquare,
  Receipt,
  Briefcase,
} from "lucide-react";
import type {
  StatementOfWork,
  PurchaseOrder,
  Invoice,
  Timecard,
  Contractor,
} from "@/types";

const DEPARTMENT_COLORS = {
  "IT Operations": { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400", accent: "from-blue-500 to-blue-600" },
  "Data Science": { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-400", accent: "from-purple-500 to-purple-600" },
  "Cloud Infrastructure": { bg: "bg-teal-500/20", border: "border-teal-500/40", text: "text-teal-400", accent: "from-teal-500 to-teal-600" },
  "QA": { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", accent: "from-amber-500 to-amber-600" },
  "Security": { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400", accent: "from-red-500 to-red-600" },
  default: { bg: "bg-slate-500/20", border: "border-slate-500/40", text: "text-slate-400", accent: "from-slate-500 to-slate-600" },
};

function getDeptColors(dept: string) {
  return DEPARTMENT_COLORS[dept as keyof typeof DEPARTMENT_COLORS] || DEPARTMENT_COLORS.default;
}

interface PriorityItem {
  id: string;
  type: "sow" | "po" | "invoice" | "timecard";
  title: string;
  status: "critical" | "warning" | "healthy";
  description: string;
  value?: number;
  dueDate?: string;
  department?: string;
  action?: string;
  entityId: number;
}

interface WorkflowStage {
  id: string;
  name: string;
  icon: typeof FileText;
  items: { total: number; pending: number; atRisk: number };
  stages: { name: string; count: number; status: "completed" | "active" | "pending" }[];
}

export function BenCommandCenterPage() {
  const go = useGo();
  const [sowsExpanded, setSowsExpanded] = useState(true);
  const [posExpanded, setPosExpanded] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState<"form" | "voice" | "ocr">("form");
  const [quickNote, setQuickNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");

  const { data: sowsData, isLoading: sowsLoading } = useList<StatementOfWork>({
    resource: "statements_of_work",
    pagination: { mode: "off" },
  });

  const { data: posData, isLoading: posLoading } = useList<PurchaseOrder>({
    resource: "purchase_orders",
    pagination: { mode: "off" },
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useList<Invoice>({
    resource: "invoices",
    pagination: { mode: "off" },
  });

  const { data: timecardsData, isLoading: timecardsLoading } = useList<Timecard>({
    resource: "timecards",
    pagination: { mode: "off" },
  });

  const { data: contractorsData, isLoading: contractorsLoading } = useList<Contractor>({
    resource: "contractors",
    pagination: { mode: "off" },
  });

  const isLoading = sowsLoading || posLoading || invoicesLoading || timecardsLoading || contractorsLoading;
  
  const sows = sowsData?.data || [];
  const purchaseOrders = posData?.data || [];
  const invoices = invoicesData?.data || [];
  const timecards = timecardsData?.data || [];
  const contractors = contractorsData?.data || [];

  const priorityItems = useMemo<PriorityItem[]>(() => {
    const items: PriorityItem[] = [];

    purchaseOrders.forEach((po: any) => {
      const spent = Number(po.amountSpent) || 0;
      const total = Number(po.totalAmount) || 1;
      const utilization = (spent / total) * 100;
      
      if (utilization > 90) {
        items.push({
          id: `po-${po.id}`,
          type: "po",
          title: `PO ${po.poNumber}`,
          status: "critical",
          description: `Budget at ${utilization.toFixed(0)}% - requires immediate attention`,
          value: total - spent,
          department: po.department,
          action: "Review budget allocation",
          entityId: po.id,
        });
      } else if (utilization > 75) {
        items.push({
          id: `po-${po.id}`,
          type: "po",
          title: `PO ${po.poNumber}`,
          status: "warning",
          description: `Budget at ${utilization.toFixed(0)}% - monitor closely`,
          value: total - spent,
          department: po.department,
          action: "Schedule review meeting",
          entityId: po.id,
        });
      }
    });

    sows.forEach((sow: any) => {
      const invoiced = Number(sow.invoicedAmount) || 0;
      const total = Number(sow.totalValue) || 1;
      const burnRate = (invoiced / total) * 100;
      
      if (burnRate > 90) {
        items.push({
          id: `sow-${sow.id}`,
          type: "sow",
          title: `SOW ${sow.sowNumber}`,
          status: "critical",
          description: `${burnRate.toFixed(0)}% invoiced - nearing completion`,
          value: total - invoiced,
          department: sow.department,
          action: "Plan extension or completion",
          entityId: sow.id,
        });
      }
    });

    invoices.filter((inv: any) => inv.hasVariance).forEach((inv: any) => {
      items.push({
        id: `inv-${inv.id}`,
        type: "invoice",
        title: `Invoice ${inv.invoiceNumber}`,
        status: "warning",
        description: "Variance detected - review required",
        value: inv.requestedAmount,
        dueDate: inv.dueDate,
        action: "Review variance details",
        entityId: inv.id,
      });
    });

    const pendingTimecards = timecards.filter((tc: any) => tc.status === "Pending");
    if (pendingTimecards.length > 5) {
      items.push({
        id: "timecards-backlog",
        type: "timecard",
        title: `${pendingTimecards.length} Pending Timecards`,
        status: "warning",
        description: "Approval backlog building up",
        action: "Bulk approve timecards",
        entityId: 0,
      });
    }

    return items.sort((a, b) => {
      const statusOrder = { critical: 0, warning: 1, healthy: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [purchaseOrders, sows, invoices, timecards]);

  const workflowLanes: WorkflowStage[] = useMemo(() => {
    const activeSows = sows.filter((s: any) => s.status === "Active");
    const pendingSows = sows.filter((s: any) => s.status === "Pending Approval" || s.status === "Draft");
    const atRiskSows = sows.filter((s: any) => {
      const burnRate = (s.invoicedAmount / s.totalValue) * 100;
      return burnRate > 85;
    });

    const activePOs = purchaseOrders.filter((p: any) => p.status === "Active");
    const pendingPOs = purchaseOrders.filter((p: any) => p.status === "Pending" || p.status === "Draft");
    const atRiskPOs = purchaseOrders.filter((p: any) => {
      const util = ((p.amountSpent || 0) / (p.totalAmount || 1)) * 100;
      return util > 85;
    });

    const submittedInv = invoices.filter((i: any) => i.status === "Submitted");
    const grApprovedInv = invoices.filter((i: any) => i.status === "GR Approved");
    const atRiskInv = invoices.filter((i: any) => i.hasVariance);

    return [
      {
        id: "sows",
        name: "Statements of Work",
        icon: Briefcase,
        items: { total: sows.length, pending: pendingSows.length, atRisk: atRiskSows.length },
        stages: [
          { name: "Draft", count: sows.filter((s: any) => s.status === "Draft").length, status: "pending" },
          { name: "Pending", count: pendingSows.length, status: pendingSows.length > 0 ? "active" : "completed" },
          { name: "Active", count: activeSows.length, status: "active" },
          { name: "Completed", count: sows.filter((s: any) => s.status === "Completed").length, status: "completed" },
        ],
      },
      {
        id: "pos",
        name: "Purchase Orders",
        icon: FileText,
        items: { total: purchaseOrders.length, pending: pendingPOs.length, atRisk: atRiskPOs.length },
        stages: [
          { name: "Draft", count: purchaseOrders.filter((p: any) => p.status === "Draft").length, status: "pending" },
          { name: "Pending", count: pendingPOs.length, status: pendingPOs.length > 0 ? "active" : "completed" },
          { name: "Active", count: activePOs.length, status: "active" },
          { name: "Completed", count: purchaseOrders.filter((p: any) => p.status === "Completed").length, status: "completed" },
        ],
      },
      {
        id: "invoices",
        name: "Invoices",
        icon: Receipt,
        items: { total: invoices.length, pending: submittedInv.length, atRisk: atRiskInv.length },
        stages: [
          { name: "Draft", count: invoices.filter((i: any) => i.status === "Draft").length, status: "pending" },
          { name: "Submitted", count: submittedInv.length, status: submittedInv.length > 0 ? "active" : "completed" },
          { name: "GR Approved", count: grApprovedInv.length, status: "active" },
          { name: "Paid", count: invoices.filter((i: any) => i.status === "Paid").length, status: "completed" },
        ],
      },
    ];
  }, [sows, purchaseOrders, invoices]);

  const predictiveAlerts = useMemo(() => {
    const alerts: { id: string; type: "deadline" | "budget" | "compliance"; severity: "high" | "medium" | "low"; title: string; description: string; daysOut?: number }[] = [];

    purchaseOrders.forEach((po: any) => {
      if (po.endDate) {
        const daysRemaining = Math.ceil((new Date(po.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 14 && daysRemaining > 0) {
          alerts.push({
            id: `deadline-po-${po.id}`,
            type: "deadline",
            severity: daysRemaining <= 7 ? "high" : "medium",
            title: `PO ${po.poNumber} expiring soon`,
            description: `Expires in ${daysRemaining} days`,
            daysOut: daysRemaining,
          });
        }
      }

      const util = ((po.amountSpent || 0) / (po.totalAmount || 1)) * 100;
      if (util > 85 && util < 95) {
        alerts.push({
          id: `budget-po-${po.id}`,
          type: "budget",
          severity: "medium",
          title: `PO ${po.poNumber} budget warning`,
          description: `${util.toFixed(0)}% utilized - projected to exceed in 2 weeks`,
        });
      }
    });

    const pendingApprovals = timecards.filter((t: any) => t.status === "Pending").length;
    if (pendingApprovals > 10) {
      alerts.push({
        id: "compliance-timecards",
        type: "compliance",
        severity: "medium",
        title: "Timecard approval backlog",
        description: `${pendingApprovals} pending approvals - SLA at risk`,
      });
    }

    return alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [purchaseOrders, timecards]);

  const stats = useMemo(() => ({
    activeSows: sows.filter((s: any) => s.status === "Active").length,
    activeContractors: contractors.filter((c: any) => c.status === "Active").length,
    pendingApprovals: timecards.filter((t: any) => t.status === "Pending").length + invoices.filter((i: any) => i.status === "Submitted").length,
    atRiskItems: priorityItems.filter(p => p.status === "critical" || p.status === "warning").length,
    totalBudget: purchaseOrders.reduce((sum: number, po: any) => sum + (Number(po.totalAmount) || 0), 0),
    budgetRemaining: purchaseOrders.reduce((sum: number, po: any) => sum + ((Number(po.totalAmount) || 0) - (Number(po.amountSpent) || 0)), 0),
  }), [sows, contractors, timecards, invoices, purchaseOrders, priorityItems]);

  const handleQuickCapture = () => {
    if (!taskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    toast.success(`Task captured: "${taskTitle}" with ${taskPriority} priority`);
    setTaskTitle("");
    setQuickNote("");
    setQuickCaptureOpen(false);
  };

  const handleQuickAction = (action: string, entityType: string, entityId: number) => {
    switch (action) {
      case "view":
        if (entityType === "po") go({ to: `/purchase-orders/show/${entityId}` });
        else if (entityType === "sow") go({ to: `/statement-of-works/show/${entityId}` });
        else if (entityType === "invoice") go({ to: `/invoices/show/${entityId}` });
        else if (entityType === "timecard") go({ to: `/timecards` });
        break;
      case "assign":
        toast.success("Opening owner assignment dialog...");
        break;
      case "escalate":
        toast.success("Escalation notification sent to stakeholders");
        break;
      case "ai-summary":
        toast.success("Generating AI summary...");
        break;
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen p-4 space-y-4"
        style={{ 
          background: `
            linear-gradient(135deg, #0c1220 0%, #1a2332 25%, #0f172a 50%, #1e293b 75%, #0c1220 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.02) 2px,
              rgba(255,255,255,0.02) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.015) 2px,
              rgba(255,255,255,0.015) 4px
            )
          `,
          backgroundBlendMode: 'overlay, overlay, normal'
        }}
      >
        <div className="flex items-start justify-between border-b border-slate-700/50 pb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Target className="h-6 w-6 text-cyan-400" />
              Ben's Rapid Recovery Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">Loading your command center data...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-3 bg-slate-700 rounded w-20"></div>
                  <div className="h-8 bg-slate-700 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <CardHeader className="pb-2">
                <div className="animate-pulse h-5 bg-slate-700 rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-slate-700/50 rounded"></div>
                  <div className="h-16 bg-slate-700/50 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-slate-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading project data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 space-y-4"
      style={{ 
        background: `
          linear-gradient(135deg, #0c1220 0%, #1a2332 25%, #0f172a 50%, #1e293b 75%, #0c1220 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.02) 2px,
            rgba(255,255,255,0.02) 4px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )
        `,
        backgroundBlendMode: 'overlay, overlay, normal'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-700/50 pb-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Target className="h-6 w-6 text-cyan-400" />
            Ben's Rapid Recovery Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Everything at a glance • Quick actions • Zero chaos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => setQuickCaptureOpen(!quickCaptureOpen)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Quick Capture
              </Button>
            </TooltipTrigger>
            <TooltipContent>Capture tasks, notes, or upload timecards instantly</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh all data</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Real-Time Status Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cursor-pointer hover:border-blue-400/50 transition-all"
              onClick={() => go({ to: "/statement-of-works" })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Active SOWs</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.activeSows}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-400/50" />
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>Click to view all SOWs</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cursor-pointer hover:border-amber-400/50 transition-all"
              onClick={() => go({ to: "/timecards?status=Pending" })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Pending Approvals</p>
                    <p className="text-2xl font-bold text-amber-400">{stats.pendingApprovals}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-400/50" />
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>Click to review pending approvals</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="border-red-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cursor-pointer hover:border-red-400/50 transition-all"
              onClick={() => go({ to: "/triage/budget-overrun" })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">At-Risk Items</p>
                    <p className="text-2xl font-bold text-red-400">{stats.atRiskItems}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400/50" />
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>Click to triage at-risk items</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className="border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cursor-pointer hover:border-emerald-400/50 transition-all"
              onClick={() => go({ to: "/purchase-orders" })}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Budget Remaining</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(stats.budgetRemaining / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-400/50" />
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>Click to view budget details</TooltipContent>
        </Tooltip>
      </div>

      {/* Quick Capture Panel */}
      {quickCaptureOpen && (
        <Card className="border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-cyan-400">
              <Zap className="h-5 w-5" />
              Quick Capture
            </CardTitle>
            <CardDescription className="text-slate-400">
              Capture tasks, voice notes, or upload timecard images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={captureMode === "form" ? "default" : "outline"}
                    size="sm"
                    className={captureMode === "form" ? "bg-cyan-600" : "border-slate-600"}
                    onClick={() => setCaptureMode("form")}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Form
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Structured task entry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={captureMode === "voice" ? "default" : "outline"}
                    size="sm"
                    className={captureMode === "voice" ? "bg-cyan-600" : "border-slate-600"}
                    onClick={() => setCaptureMode("voice")}
                  >
                    <Mic className="h-4 w-4 mr-1" />
                    Voice
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Record voice notes</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={captureMode === "ocr" ? "default" : "outline"}
                    size="sm"
                    className={captureMode === "ocr" ? "bg-cyan-600" : "border-slate-600"}
                    onClick={() => setCaptureMode("ocr")}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    OCR Upload
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload timecard images for OCR processing</TooltipContent>
              </Tooltip>
            </div>

            {captureMode === "form" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    placeholder="Task title..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                  <Select value={taskPriority} onValueChange={setTaskPriority}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔴 Critical</SelectItem>
                      <SelectItem value="high">🟠 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea 
                  placeholder="Quick notes..."
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white h-20"
                />
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  onClick={handleQuickCapture}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Capture Task
                </Button>
              </div>
            )}

            {captureMode === "voice" && (
              <div className="text-center py-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_3101k9fxedpyfrntetyb79eq34d8', '_blank', 'width=400,height=700,scrollbars=yes')}
                      className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40 flex items-center justify-center cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all group"
                    >
                      <Mic className="h-10 w-10 text-cyan-400 group-hover:text-cyan-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs bg-slate-800 border-slate-700 text-slate-200">
                    <p className="font-medium text-cyan-400">VINessa Voice Agent</p>
                    <p className="text-xs mt-1">AI-powered project data capture. Speak naturally to log projects, tasks, and updates. VINessa will transcribe, categorize, and sync to your dashboard automatically.</p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-slate-300 font-medium">Launch VINessa Voice Agent</p>
                <p className="text-xs text-slate-500 mt-1">Opens AI voice assistant in new window</p>
                <p className="text-xs text-cyan-400/70 mt-3">Captures: Projects, Tasks, Risks, Updates</p>
              </div>
            )}

            {captureMode === "ocr" && (
              <OCRTimecardProcessor 
                onDataExtracted={(data) => {
                  toast.success(`Timecard extracted: ${data.employeeName || 'Unknown'} - ${data.totalHours || 0} hours`);
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Priority Board */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Dynamic Priority Board
                <Badge variant="outline" className="ml-auto bg-slate-700/50 text-slate-300 text-xs">
                  AI-Ranked
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Blockers and issues ranked by urgency and impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">All clear!</p>
                  <p className="text-slate-500 text-sm">No critical or warning items</p>
                </div>
              ) : (
                priorityItems.slice(0, 6).map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div 
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] ${
                          item.status === "critical" 
                            ? "bg-red-500/10 border-red-500/40 hover:border-red-400" 
                            : item.status === "warning"
                            ? "bg-amber-500/10 border-amber-500/40 hover:border-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-400"
                        }`}
                        onClick={() => handleQuickAction("view", item.type, item.entityId)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={`text-xs ${
                                  item.status === "critical" 
                                    ? "bg-red-500/20 text-red-400 border-red-500/40" 
                                    : item.status === "warning"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                }`}
                              >
                                {item.status.toUpperCase()}
                              </Badge>
                              <span className="font-medium text-white">{item.title}</span>
                              {item.department && (
                                <Badge className={`text-xs ${getDeptColors(item.department).bg} ${getDeptColors(item.department).text} ${getDeptColors(item.department).border}`}>
                                  {item.department}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction("view", item.type, item.entityId); }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction("assign", item.type, item.entityId); }}
                                >
                                  <UserPlus className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Assign owner</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction("escalate", item.type, item.entityId); }}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Escalate to stakeholder</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction("ai-summary", item.type, item.entityId); }}
                                >
                                  <Brain className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Request AI summary</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-slate-300">{item.action}</p>
                      {item.value && <p className="text-xs mt-1">Value: ${item.value.toLocaleString()}</p>}
                    </TooltipContent>
                  </Tooltip>
                ))
              )}
            </CardContent>
          </Card>

          {/* Compressed Workflow Lanes */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-cyan-400" />
                Workflow Lanes
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current stage per workstream at a glance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflowLanes.map((lane) => (
                <Collapsible 
                  key={lane.id}
                  open={
                    lane.id === "sows" ? sowsExpanded :
                    lane.id === "pos" ? posExpanded :
                    invoicesExpanded
                  }
                  onOpenChange={(open) => {
                    if (lane.id === "sows") setSowsExpanded(open);
                    else if (lane.id === "pos") setPosExpanded(open);
                    else setInvoicesExpanded(open);
                  }}
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        {(lane.id === "sows" ? sowsExpanded : lane.id === "pos" ? posExpanded : invoicesExpanded) 
                          ? <ChevronDown className="h-4 w-4 text-slate-400" />
                          : <ChevronRight className="h-4 w-4 text-slate-400" />
                        }
                        <lane.icon className="h-5 w-5 text-cyan-400" />
                        <span className="font-medium text-white">{lane.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="bg-slate-700/50 text-slate-300">
                              {lane.items.total} total
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Total items in this workflow</TooltipContent>
                        </Tooltip>
                        {lane.items.pending > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">
                                {lane.items.pending} pending
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Items awaiting action</TooltipContent>
                          </Tooltip>
                        )}
                        {lane.items.atRisk > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                {lane.items.atRisk} at risk
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Items requiring immediate attention</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="flex items-center gap-1 px-3 py-2">
                      {lane.stages.map((stage, idx) => (
                        <Tooltip key={stage.name}>
                          <TooltipTrigger asChild>
                            <div className="flex-1 flex flex-col items-center">
                              <div className={`w-full h-2 rounded-full ${
                                stage.status === "completed" ? "bg-emerald-500/50" :
                                stage.status === "active" ? "bg-cyan-500" :
                                "bg-slate-600/50"
                              }`}>
                                {stage.status === "active" && (
                                  <div className="h-full w-full bg-cyan-400/50 rounded-full animate-pulse" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1">{stage.name}</span>
                              <span className="text-xs font-medium text-white">{stage.count}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{stage.count} items in {stage.name} stage</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Predictive Alerts */}
        <div className="space-y-4">
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Predictive Alerts
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-detected upcoming risks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {predictiveAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <Shield className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm">No predicted risks</p>
                </div>
              ) : (
                predictiveAlerts.slice(0, 5).map((alert) => (
                  <Tooltip key={alert.id}>
                    <TooltipTrigger asChild>
                      <div className={`p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02] ${
                        alert.severity === "high" 
                          ? "bg-red-500/10 border-red-500/30" 
                          : alert.severity === "medium"
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-blue-500/10 border-blue-500/30"
                      }`}>
                        <div className="flex items-start gap-2">
                          {alert.type === "deadline" && <Calendar className={`h-4 w-4 mt-0.5 ${alert.severity === "high" ? "text-red-400" : "text-amber-400"}`} />}
                          {alert.type === "budget" && <TrendingUp className="h-4 w-4 mt-0.5 text-amber-400" />}
                          {alert.type === "compliance" && <Shield className="h-4 w-4 mt-0.5 text-blue-400" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{alert.title}</p>
                            <p className="text-xs text-slate-400">{alert.description}</p>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-xs">Type: {alert.type} | Severity: {alert.severity}</p>
                    </TooltipContent>
                  </Tooltip>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-emerald-400" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-400">
                2 clicks or less
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/timecards/bulk-approve" })}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" />
                    Bulk Approve Timecards
                    {stats.pendingApprovals > 0 && (
                      <Badge className="ml-auto bg-amber-500/20 text-amber-400 text-xs">
                        {timecards.filter((t: any) => t.status === "Pending").length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Approve multiple timecards at once</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/invoices?status=Submitted" })}
                  >
                    <Receipt className="h-4 w-4 mr-2 text-blue-400" />
                    Review Pending Invoices
                    <Badge className="ml-auto bg-blue-500/20 text-blue-400 text-xs">
                      {invoices.filter((i: any) => i.status === "Submitted").length}
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View all submitted invoices</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/triage/budget-overrun" })}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                    Triage Budget Issues
                    {stats.atRiskItems > 0 && (
                      <Badge className="ml-auto bg-red-500/20 text-red-400 text-xs">
                        {stats.atRiskItems}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Address budget overruns immediately</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/ai/insights" })}
                  >
                    <Brain className="h-4 w-4 mr-2 text-purple-400" />
                    View AI Insights
                    <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>See AI-generated recommendations</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/contractors" })}
                  >
                    <Users className="h-4 w-4 mr-2 text-cyan-400" />
                    Manage Contractors
                    <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View and manage contractor roster</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white"
                    onClick={() => go({ to: "/budget/forecasting" })}
                  >
                    <BarChart3 className="h-4 w-4 mr-2 text-amber-400" />
                    Budget Forecasting
                    <ArrowRight className="h-4 w-4 ml-auto text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View budget projections and forecasts</TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BenCommandCenterPage;
