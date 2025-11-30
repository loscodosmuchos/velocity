import { useState } from "react";
import { 
  Database, Table2, AlertTriangle, CheckCircle2, XCircle, 
  FileText, ChevronDown, ChevronRight, Columns, Code2,
  Shield, RefreshCw, Search, Filter, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
}

interface TableSchema {
  name: string;
  columns: TableColumn[];
}

interface TypeScriptField {
  name: string;
  type: string;
  optional: boolean;
}

interface TypeScriptInterface {
  name: string;
  fields: TypeScriptField[];
}

interface PageInfo {
  path: string;
  name: string;
  status: "verified" | "warning" | "error";
  notes?: string;
}

interface MenuSection {
  name: string;
  icon: string;
  pages: PageInfo[];
}

const DATABASE_TABLES: TableSchema[] = [
  {
    name: "statements_of_work",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "sow_number", type: "varchar", nullable: false },
      { name: "title", type: "varchar", nullable: true },
      { name: "contractor_id", type: "integer", nullable: true },
      { name: "total_value", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "status", type: "varchar", nullable: true, defaultValue: "'active'" },
      { name: "start_date", type: "date", nullable: true },
      { name: "end_date", type: "date", nullable: true },
      { name: "department", type: "varchar", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true, defaultValue: "now()" },
      { name: "invoiced_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "remaining_value", type: "numeric", nullable: true, defaultValue: "0" },
    ]
  },
  {
    name: "contractors",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "contractor_id", type: "varchar", nullable: false },
      { name: "first_name", type: "varchar", nullable: false },
      { name: "last_name", type: "varchar", nullable: false },
      { name: "email", type: "varchar", nullable: false },
      { name: "phone", type: "varchar", nullable: true },
      { name: "company_name", type: "varchar", nullable: true },
      { name: "address", type: "text", nullable: true },
      { name: "service_type", type: "jsonb", nullable: true },
      { name: "annual_volume", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "payment_terms", type: "varchar", nullable: true },
      { name: "certification", type: "jsonb", nullable: true },
      { name: "lead_time_days", type: "integer", nullable: true },
      { name: "status", type: "varchar", nullable: false, defaultValue: "'Active'" },
      { name: "contract_expiry", type: "date", nullable: true },
      { name: "account_manager", type: "varchar", nullable: true },
      { name: "notes", type: "text", nullable: true },
      { name: "hiring_manager_id", type: "integer", nullable: true },
      { name: "assigned_manager_id", type: "integer", nullable: true },
      { name: "department_id", type: "integer", nullable: true },
      { name: "location", type: "varchar", nullable: true },
      { name: "job_description", type: "text", nullable: true },
      { name: "pay_rate", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "start_date", type: "date", nullable: true },
      { name: "po_funds_remaining", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
      { name: "search_text", type: "text", nullable: true },
      { name: "fts", type: "tsvector", nullable: true },
      { name: "embedding", type: "vector", nullable: true },
      { name: "defect_rate", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "quality_score", type: "integer", nullable: true, defaultValue: "0" },
      { name: "compliance_rate", type: "numeric", nullable: true, defaultValue: "100" },
      { name: "on_time_delivery_rate", type: "numeric", nullable: true, defaultValue: "100" },
    ]
  },
  {
    name: "purchase_orders",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "po_number", type: "varchar", nullable: false },
      { name: "contractor_id", type: "integer", nullable: true },
      { name: "description", type: "text", nullable: true },
      { name: "total_amount", type: "numeric", nullable: false },
      { name: "amount_spent", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "amount_remaining", type: "numeric", nullable: true },
      { name: "percent_used", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "status", type: "varchar", nullable: false, defaultValue: "'Draft'" },
      { name: "start_date", type: "date", nullable: true },
      { name: "end_date", type: "date", nullable: true },
      { name: "department", type: "varchar", nullable: true },
      { name: "project_name", type: "varchar", nullable: true },
      { name: "created_by", type: "integer", nullable: true },
      { name: "approved_by", type: "integer", nullable: true },
      { name: "approval_date", type: "timestamp", nullable: true },
      { name: "notes", type: "text", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
      { name: "confirmed_at", type: "timestamp", nullable: true },
      { name: "dispatched_at", type: "timestamp", nullable: true },
      { name: "delivered_at", type: "timestamp", nullable: true },
      { name: "is_maverick_spend", type: "boolean", nullable: true, defaultValue: "false" },
      { name: "buyer_id", type: "integer", nullable: true },
    ]
  },
  {
    name: "invoices",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "invoice_number", type: "varchar", nullable: false },
      { name: "contractor_id", type: "integer", nullable: true },
      { name: "purchase_order_id", type: "integer", nullable: true },
      { name: "invoice_date", type: "date", nullable: false },
      { name: "due_date", type: "date", nullable: true },
      { name: "amount", type: "numeric", nullable: false },
      { name: "tax_amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "total_amount", type: "numeric", nullable: true },
      { name: "status", type: "varchar", nullable: false, defaultValue: "'Draft'" },
      { name: "payment_date", type: "date", nullable: true },
      { name: "payment_method", type: "varchar", nullable: true },
      { name: "notes", type: "text", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
    ]
  },
  {
    name: "timecards",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "timecard_number", type: "varchar", nullable: false },
      { name: "contractor_id", type: "integer", nullable: true },
      { name: "purchase_order_id", type: "integer", nullable: true },
      { name: "week_ending", type: "date", nullable: false },
      { name: "regular_hours", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "overtime_hours", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "total_hours", type: "numeric", nullable: true },
      { name: "hourly_rate", type: "numeric", nullable: false },
      { name: "total_amount", type: "numeric", nullable: true },
      { name: "status", type: "varchar", nullable: false, defaultValue: "'Pending'" },
      { name: "submitted_date", type: "timestamp", nullable: true },
      { name: "approved_by", type: "integer", nullable: true },
      { name: "approval_date", type: "timestamp", nullable: true },
      { name: "rejection_reason", type: "text", nullable: true },
      { name: "notes", type: "text", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
    ]
  },
  {
    name: "expenses",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "expense_number", type: "varchar", nullable: false },
      { name: "contractor_id", type: "integer", nullable: true },
      { name: "purchase_order_id", type: "integer", nullable: true },
      { name: "category", type: "varchar", nullable: false },
      { name: "description", type: "text", nullable: true },
      { name: "amount", type: "numeric", nullable: false },
      { name: "expense_date", type: "date", nullable: false },
      { name: "status", type: "varchar", nullable: true, defaultValue: "'Pending'" },
      { name: "receipt_url", type: "text", nullable: true },
      { name: "approved_by", type: "integer", nullable: true },
      { name: "approval_date", type: "timestamp", nullable: true },
      { name: "notes", type: "text", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
    ]
  },
  {
    name: "change_orders",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "co_number", type: "varchar", nullable: false },
      { name: "purchase_order_id", type: "integer", nullable: true },
      { name: "description", type: "text", nullable: true },
      { name: "amount", type: "numeric", nullable: true, defaultValue: "0" },
      { name: "status", type: "varchar", nullable: true, defaultValue: "'pending'" },
      { name: "requested_date", type: "date", nullable: true },
      { name: "approved_date", type: "date", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true, defaultValue: "now()" },
    ]
  },
  {
    name: "sow_tranches",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "sow_id", type: "integer", nullable: false },
      { name: "name", type: "varchar", nullable: false },
      { name: "description", type: "text", nullable: true },
      { name: "amount", type: "numeric", nullable: false },
      { name: "percentage", type: "numeric", nullable: true },
      { name: "due_date", type: "date", nullable: true },
      { name: "sequence_order", type: "integer", nullable: false, defaultValue: "1" },
      { name: "status", type: "varchar", nullable: true, defaultValue: "'pending'" },
      { name: "invoice_id", type: "integer", nullable: true },
      { name: "paid_date", type: "date", nullable: true },
      { name: "created_at", type: "timestamp", nullable: true },
      { name: "updated_at", type: "timestamp", nullable: true },
    ]
  },
  {
    name: "sow_stakeholders",
    columns: [
      { name: "id", type: "integer", nullable: false, defaultValue: "auto-increment" },
      { name: "sow_id", type: "integer", nullable: false },
      { name: "user_id", type: "integer", nullable: false },
      { name: "role", type: "varchar", nullable: false },
      { name: "notification_preferences", type: "jsonb", nullable: true },
      { name: "added_by", type: "integer", nullable: true },
      { name: "added_at", type: "timestamptz", nullable: true, defaultValue: "now()" },
      { name: "is_active", type: "boolean", nullable: true, defaultValue: "true" },
    ]
  },
];

const TYPESCRIPT_INTERFACES: TypeScriptInterface[] = [
  {
    name: "StatementOfWork",
    fields: [
      { name: "id", type: "number", optional: false },
      { name: "sowNumber", type: "string", optional: false },
      { name: "contractorId", type: "number", optional: false },
      { name: "purchaseOrderId", type: "number", optional: true },
      { name: "type", type: "\"Fixed Fee\" | \"Deliverables Based\"", optional: false },
      { name: "totalValue", type: "number", optional: false },
      { name: "invoicedAmount", type: "number", optional: false },
      { name: "remainingValue", type: "number", optional: false },
      { name: "status", type: "string", optional: false },
      { name: "startDate", type: "string", optional: false },
      { name: "endDate", type: "string", optional: false },
      { name: "terms", type: "string", optional: false },
      { name: "deliverables", type: "string", optional: true },
      { name: "paymentSchedule", type: "string", optional: true },
      { name: "createdAt", type: "string", optional: false },
      { name: "updatedAt", type: "string", optional: false },
    ]
  },
  {
    name: "Contractor",
    fields: [
      { name: "id", type: "number", optional: false },
      { name: "firstName", type: "string", optional: false },
      { name: "lastName", type: "string", optional: false },
      { name: "email", type: "string", optional: false },
      { name: "phone", type: "string", optional: false },
      { name: "payRate", type: "number", optional: false },
      { name: "location", type: "string", optional: false },
      { name: "jobDescription", type: "string", optional: false },
      { name: "hiringManagerId", type: "number", optional: false },
      { name: "assignedManagerId", type: "number", optional: false },
      { name: "departmentId", type: "number", optional: false },
      { name: "status", type: "string", optional: false },
      { name: "startDate", type: "string", optional: false },
      { name: "poFundsRemaining", type: "number", optional: false },
      { name: "createdAt", type: "string", optional: false },
      { name: "updatedAt", type: "string", optional: false },
    ]
  },
  {
    name: "PurchaseOrder",
    fields: [
      { name: "id", type: "number", optional: false },
      { name: "poNumber", type: "string", optional: false },
      { name: "totalAmount", type: "number", optional: false },
      { name: "amountSpent", type: "number", optional: false },
      { name: "amountRemaining", type: "number", optional: false },
      { name: "percentUsed", type: "number", optional: false },
      { name: "department", type: "string", optional: false },
      { name: "startDate", type: "string", optional: false },
      { name: "endDate", type: "string", optional: false },
      { name: "status", type: "string", optional: false },
      { name: "type", type: "string", optional: false },
      { name: "departmentId", type: "number", optional: true },
      { name: "contractorId", type: "number", optional: true },
      { name: "buyerId", type: "number", optional: true },
      { name: "tpscStatus", type: "string", optional: false },
      { name: "fiscalYear", type: "string", optional: false },
      { name: "fiscalPeriod", type: "string", optional: false },
      { name: "description", type: "string", optional: false },
      { name: "projectName", type: "string", optional: true },
      { name: "notes", type: "string", optional: true },
      { name: "isMaverickSpend", type: "boolean", optional: true },
      { name: "createdAt", type: "string", optional: false },
      { name: "updatedAt", type: "string", optional: false },
    ]
  },
];

const SCHEMA_GAPS = [
  {
    table: "statements_of_work",
    issue: "MISSING COLUMNS",
    severity: "critical",
    details: "TypeScript expects: type, terms, deliverables, paymentSchedule, purchaseOrderId, updatedAt - DB doesn't have these",
    resolution: "Add columns via migration OR update TypeScript interface to match DB"
  },
  {
    table: "purchase_orders",
    issue: "MISSING COLUMNS", 
    severity: "warning",
    details: "TypeScript expects: type, tpscStatus, fiscalYear, fiscalPeriod - DB doesn't have these",
    resolution: "Add columns if needed for business logic, or remove from interface"
  },
  {
    table: "change_orders",
    issue: "SCHEMA MISMATCH",
    severity: "warning",
    details: "TypeScript expects sowId but DB has purchase_order_id. Different entity relationships.",
    resolution: "Clarify business requirement: Are change orders for SOWs or POs?"
  },
  {
    table: "invoices",
    issue: "MISSING COLUMNS",
    severity: "warning",
    details: "TypeScript expects: requestedAmount, actualAmount, grAmount, grBalance, timecardIds, varianceAmount, hasVariance",
    resolution: "These are calculated fields - may be OK as virtual columns"
  },
];

const PAGE_HIERARCHY: MenuSection[] = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    pages: [
      { path: "/dashboard", name: "Main Dashboard", status: "verified" },
      { path: "/dashboard/builder", name: "Dashboard Builder", status: "verified" },
      { path: "/dashboard/templates", name: "Dashboard Templates", status: "verified" },
      { path: "/dashboard/customizer", name: "Dashboard Customizer", status: "verified" },
      { path: "/dashboard/procurement", name: "Procurement Dashboard", status: "verified" },
    ]
  },
  {
    name: "SOWs (Statements of Work)",
    icon: "FileText",
    pages: [
      { path: "/statement-of-works", name: "SOW List", status: "verified" },
      { path: "/statement-of-works/create", name: "Create SOW", status: "verified", notes: "Fixed API schema mismatch" },
      { path: "/statement-of-works/show/:id", name: "SOW Detail", status: "verified" },
      { path: "/statement-of-works/edit/:id", name: "Edit SOW", status: "warning", notes: "Check field alignment" },
      { path: "/statement-of-works/templates", name: "SOW Templates", status: "verified" },
      { path: "/statement-of-works/compliance-report", name: "Compliance Report", status: "verified" },
      { path: "/sow-command-center", name: "SOW Command Center", status: "verified" },
    ]
  },
  {
    name: "Purchase Orders",
    icon: "ShoppingCart",
    pages: [
      { path: "/purchase-orders", name: "PO List", status: "verified" },
      { path: "/purchase-orders/create", name: "Create PO", status: "warning", notes: "Missing type/fiscal fields in DB" },
      { path: "/purchase-orders/show/:id", name: "PO Detail", status: "verified" },
      { path: "/purchase-orders/edit/:id", name: "Edit PO", status: "warning" },
      { path: "/purchase-orders/reports", name: "PO Reports", status: "verified" },
      { path: "/purchase-orders/templates", name: "PO Templates", status: "verified" },
      { path: "/purchase-orders/manage-contractors", name: "Manage Contractors", status: "verified" },
    ]
  },
  {
    name: "Contractors",
    icon: "Users",
    pages: [
      { path: "/contractors", name: "Contractor List", status: "verified" },
      { path: "/contractors/create", name: "Create Contractor", status: "verified" },
      { path: "/contractors/show/:id", name: "Contractor Detail", status: "verified" },
      { path: "/contractors/edit/:id", name: "Edit Contractor", status: "verified" },
      { path: "/contractors/compliance", name: "Compliance", status: "verified" },
      { path: "/contractors/onboarding", name: "Onboarding", status: "verified" },
      { path: "/contractors/performance", name: "Performance", status: "verified" },
      { path: "/contractors/import", name: "Import Contractors", status: "verified" },
    ]
  },
  {
    name: "Timecards",
    icon: "Clock",
    pages: [
      { path: "/timecards", name: "Timecard List", status: "verified" },
      { path: "/timecards/create", name: "Create Timecard", status: "verified" },
      { path: "/timecards/show/:id", name: "Timecard Detail", status: "verified" },
      { path: "/timecards/pending", name: "Pending Approval", status: "verified" },
      { path: "/timecards/bulk-approve", name: "Bulk Approve", status: "verified" },
      { path: "/timecards/analytics", name: "Analytics", status: "verified" },
    ]
  },
  {
    name: "Invoices",
    icon: "Receipt",
    pages: [
      { path: "/invoices", name: "Invoice List", status: "verified" },
      { path: "/invoices/create", name: "Create Invoice", status: "warning", notes: "Check calculated fields" },
      { path: "/invoices/show/:id", name: "Invoice Detail", status: "verified" },
      { path: "/invoices/edit/:id", name: "Edit Invoice", status: "warning" },
      { path: "/invoices/aging", name: "Aging Report", status: "verified" },
      { path: "/invoices/generate", name: "Generate Invoice", status: "verified" },
    ]
  },
  {
    name: "Expenses",
    icon: "DollarSign",
    pages: [
      { path: "/expenses", name: "Expense List", status: "verified" },
      { path: "/expenses/create", name: "Create Expense", status: "verified" },
      { path: "/expenses/show/:id", name: "Expense Detail", status: "verified" },
      { path: "/expenses/bulk-approve", name: "Bulk Approve", status: "verified" },
      { path: "/expenses/reports", name: "Expense Reports", status: "verified" },
    ]
  },
  {
    name: "Approvals",
    icon: "CheckCircle",
    pages: [
      { path: "/approvals/requests", name: "Approval Requests", status: "verified" },
      { path: "/approvals/history", name: "Approval History", status: "verified" },
      { path: "/approvals/configure", name: "Configure Rules", status: "verified" },
      { path: "/approvals/delegations", name: "Delegations", status: "verified" },
      { path: "/approvals/rules", name: "Rules", status: "verified" },
      { path: "/approvals/email-logs", name: "Email Logs", status: "verified" },
    ]
  },
  {
    name: "Change Orders",
    icon: "GitBranch",
    pages: [
      { path: "/change-orders", name: "Change Order List", status: "warning", notes: "Schema mismatch: sowId vs purchase_order_id" },
      { path: "/change-orders/create", name: "Create Change Order", status: "warning" },
      { path: "/change-orders/show/:id", name: "Change Order Detail", status: "warning" },
    ]
  },
  {
    name: "Documents",
    icon: "FolderOpen",
    pages: [
      { path: "/documents/upload", name: "Upload Documents", status: "verified" },
      { path: "/documents/gallery", name: "Document Gallery", status: "verified" },
      { path: "/documents/search", name: "Search Documents", status: "verified" },
      { path: "/documents/analyze", name: "Analyze Documents", status: "verified" },
      { path: "/documents/audit", name: "Document Audit", status: "verified" },
      { path: "/documents/command-center", name: "Document Command Center", status: "verified" },
    ]
  },
  {
    name: "AI Intelligence",
    icon: "Sparkles",
    pages: [
      { path: "/ai/insights", name: "AI Insights", status: "verified" },
      { path: "/ai/chatbots", name: "Chatbots", status: "verified" },
      { path: "/ai/multi-lens-analyzer", name: "Multi-Lens Analyzer", status: "verified" },
      { path: "/ai/voice-contract-intelligence", name: "Voice Contract Intelligence", status: "verified" },
      { path: "/ai/advanced-voice-sourcing", name: "Advanced Voice Sourcing", status: "verified" },
      { path: "/ai/vendor-extraction", name: "Vendor Extraction", status: "verified" },
      { path: "/ai/contract-gap-analysis", name: "Contract Gap Analysis", status: "verified" },
      { path: "/ai/alert-cube-builder", name: "Alert Cube Builder", status: "verified" },
    ]
  },
  {
    name: "Alerts & Notifications",
    icon: "Bell",
    pages: [
      { path: "/alerts", name: "Alert Center", status: "verified" },
      { path: "/notifications/center", name: "Notification Center", status: "verified" },
    ]
  },
  {
    name: "Triage Center",
    icon: "AlertTriangle",
    pages: [
      { path: "/triage", name: "Triage Dashboard", status: "verified" },
      { path: "/triage/budget", name: "Budget Issues", status: "verified" },
      { path: "/triage/compliance", name: "Compliance Issues", status: "verified" },
      { path: "/triage/contractors", name: "Contractor Issues", status: "verified" },
      { path: "/triage/invoices", name: "Invoice Issues", status: "verified" },
      { path: "/triage/timecards", name: "Timecard Issues", status: "verified" },
      { path: "/triage/operations", name: "Operations Issues", status: "verified" },
    ]
  },
  {
    name: "Admin Hub",
    icon: "Settings",
    pages: [
      { path: "/admin/user-management", name: "User Management", status: "verified" },
      { path: "/admin/audit-logs", name: "Audit Logs", status: "verified" },
      { path: "/admin/security-settings", name: "Security Settings", status: "verified" },
      { path: "/admin/knowledge-hub", name: "Knowledge Hub", status: "verified" },
      { path: "/admin/demo-command-center", name: "Demo Command Center", status: "verified" },
      { path: "/admin/persona-reference", name: "Persona Reference", status: "verified" },
      { path: "/admin/dashboard", name: "Admin Dashboard", status: "verified" },
      { path: "/admin/database-schema-audit", name: "Database Schema Audit", status: "verified", notes: "This page" },
    ]
  },
];

function StatusBadge({ status }: { status: "verified" | "warning" | "error" }) {
  const config = {
    verified: { label: "Verified", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    warning: { label: "Warning", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    error: { label: "Error", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const Icon = status === "verified" ? CheckCircle2 : status === "warning" ? AlertTriangle : XCircle;
  return (
    <Badge variant="outline" className={config[status].className}>
      <Icon className="h-3 w-3 mr-1" />
      {config[status].label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <Badge variant="outline" className={config[severity] || config.info}>
      {severity.toUpperCase()}
    </Badge>
  );
}

export default function DatabaseSchemaAuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const totalPages = PAGE_HIERARCHY.reduce((acc, section) => acc + section.pages.length, 0);
  const verifiedPages = PAGE_HIERARCHY.reduce((acc, section) => 
    acc + section.pages.filter(p => p.status === "verified").length, 0);
  const warningPages = PAGE_HIERARCHY.reduce((acc, section) => 
    acc + section.pages.filter(p => p.status === "warning").length, 0);
  const errorPages = PAGE_HIERARCHY.reduce((acc, section) => 
    acc + section.pages.filter(p => p.status === "error").length, 0);

  const criticalGaps = SCHEMA_GAPS.filter(g => g.severity === "critical").length;
  const warningGaps = SCHEMA_GAPS.filter(g => g.severity === "warning").length;
  const totalColumns = DATABASE_TABLES.reduce((acc, t) => acc + t.columns.length, 0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      
      {/* HEADER */}
      <div className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/20">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                  Database Schema Audit
                  {criticalGaps > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                      <XCircle className="h-3 w-3 mr-1" />
                      {criticalGaps} Critical
                    </Badge>
                  )}
                </h1>
                <p className="text-sm text-slate-400">Master reference for all tables, interfaces, and page mappings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/30 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT BANNER FOR CRITICAL ISSUES */}
      {criticalGaps > 0 && (
        <div className="mx-6 mt-4 p-4 rounded-lg bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 border border-red-500/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center animate-pulse">
            <XCircle className="h-6 w-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-300 text-lg">Critical Schema Mismatches Detected</h3>
            <p className="text-sm text-red-200/70">
              {criticalGaps} critical and {warningGaps} warning issues require attention. 
              Frontend expects columns that don't exist in the database.
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            View Issues
          </Button>
        </div>
      )}

      {/* SUMMARY CARDS - Enhanced with 6 cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Table2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{DATABASE_TABLES.length}</p>
                  <p className="text-xs text-slate-400 font-medium">Core Tables</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/50 transition-colors group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Columns className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{totalColumns}</p>
                  <p className="text-xs text-slate-400 font-medium">Total Columns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 hover:border-purple-500/50 transition-colors group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{totalPages}</p>
                  <p className="text-xs text-slate-400 font-medium">Total Pages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 hover:border-emerald-500/50 transition-colors group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-400">{verifiedPages}</p>
                  <p className="text-xs text-slate-400 font-medium">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-red-500/30 hover:border-red-500/60 transition-colors group ring-1 ring-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/40 to-red-600/30 flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-red-400">{criticalGaps}</p>
                  <p className="text-xs text-red-300/70 font-medium">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-amber-500/30 hover:border-amber-500/60 transition-colors group ring-1 ring-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/40 to-amber-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-400">{warningGaps}</p>
                  <p className="text-xs text-amber-300/70 font-medium">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <Tabs defaultValue="pages" className="space-y-4">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="pages" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Page Hierarchy
            </TabsTrigger>
            <TabsTrigger value="tables" className="data-[state=active]:bg-slate-700">
              <Table2 className="h-4 w-4 mr-2" />
              Database Tables
            </TabsTrigger>
            <TabsTrigger value="interfaces" className="data-[state=active]:bg-slate-700">
              <Code2 className="h-4 w-4 mr-2" />
              TypeScript Interfaces
            </TabsTrigger>
            <TabsTrigger value="gaps" className="data-[state=active]:bg-slate-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Schema Gaps
            </TabsTrigger>
          </TabsList>

          {/* PAGE HIERARCHY TAB */}
          <TabsContent value="pages">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Complete Page Hierarchy with Verification Status
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      placeholder="Search pages..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-slate-800/50 border-slate-700 text-white w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-4">
                    {PAGE_HIERARCHY.map((section) => {
                      const filteredPages = section.pages.filter(p => 
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.path.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      if (searchTerm && filteredPages.length === 0) return null;
                      
                      return (
                        <div key={section.name} className="border border-slate-700/50 rounded-lg overflow-hidden">
                          <div className="bg-slate-800/30 px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-white">{section.name}</h3>
                            <Badge variant="outline" className="ml-auto text-slate-400 border-slate-600">
                              {section.pages.length} pages
                            </Badge>
                          </div>
                          <div className="divide-y divide-slate-700/30">
                            {(searchTerm ? filteredPages : section.pages).map((page) => (
                              <div key={page.path} className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                  <input type="checkbox" checked={page.status === "verified"} readOnly className="rounded border-slate-600 bg-slate-800" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{page.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{page.path}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {page.notes && (
                                    <span className="text-xs text-slate-400 max-w-[200px] truncate">{page.notes}</span>
                                  )}
                                  <StatusBadge status={page.status} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DATABASE TABLES TAB */}
          <TabsContent value="tables">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  PostgreSQL Database Tables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-3">
                    {DATABASE_TABLES.map((table) => (
                      <Collapsible key={table.name} open={expandedTables.includes(table.name)}>
                        <CollapsibleTrigger 
                          onClick={() => toggleTable(table.name)}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                              {expandedTables.includes(table.name) ? (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              )}
                              <Table2 className="h-5 w-5 text-blue-400" />
                              <span className="font-mono font-semibold text-white">{table.name}</span>
                            </div>
                            <Badge variant="outline" className="text-slate-400 border-slate-600">
                              {table.columns.length} columns
                            </Badge>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-2 ml-6 border-l-2 border-slate-700 pl-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-slate-400 text-xs uppercase">
                                  <th className="text-left py-2">Column</th>
                                  <th className="text-left py-2">Type</th>
                                  <th className="text-left py-2">Nullable</th>
                                  <th className="text-left py-2">Default</th>
                                </tr>
                              </thead>
                              <tbody>
                                {table.columns.map((col) => (
                                  <tr key={col.name} className="border-t border-slate-700/30">
                                    <td className="py-2 font-mono text-cyan-400">{col.name}</td>
                                    <td className="py-2 text-slate-300">{col.type}</td>
                                    <td className="py-2">
                                      {col.nullable ? (
                                        <span className="text-amber-400">YES</span>
                                      ) : (
                                        <span className="text-emerald-400">NO</span>
                                      )}
                                    </td>
                                    <td className="py-2 text-slate-500 font-mono text-xs">{col.defaultValue || "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TYPESCRIPT INTERFACES TAB */}
          <TabsContent value="interfaces">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-purple-400" />
                  TypeScript Interface Definitions (src/types.ts)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-4">
                    {TYPESCRIPT_INTERFACES.map((iface) => (
                      <div key={iface.name} className="border border-slate-700/50 rounded-lg overflow-hidden">
                        <div className="bg-slate-800/30 px-4 py-3 flex items-center gap-3">
                          <Code2 className="h-5 w-5 text-purple-400" />
                          <span className="font-mono font-semibold text-white">interface {iface.name}</span>
                          <Badge variant="outline" className="ml-auto text-slate-400 border-slate-600">
                            {iface.fields.length} fields
                          </Badge>
                        </div>
                        <div className="p-4 bg-slate-950/50 font-mono text-sm">
                          <pre className="text-slate-300">
                            {iface.fields.map((field) => (
                              <div key={field.name} className="py-0.5">
                                <span className="text-cyan-400">{field.name}</span>
                                <span className="text-slate-500">{field.optional ? "?" : ""}: </span>
                                <span className="text-amber-400">{field.type}</span>
                                <span className="text-slate-500">;</span>
                              </div>
                            ))}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SCHEMA GAPS TAB */}
          <TabsContent value="gaps">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Schema Gaps & Resolutions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {SCHEMA_GAPS.map((gap, idx) => (
                    <div key={idx} className="border border-slate-700/50 rounded-lg overflow-hidden">
                      <div className="bg-slate-800/30 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Table2 className="h-5 w-5 text-blue-400" />
                          <span className="font-mono font-semibold text-white">{gap.table}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-slate-300 border-slate-600">{gap.issue}</Badge>
                          <SeverityBadge severity={gap.severity} />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 uppercase mb-1">Details</p>
                          <p className="text-sm text-slate-300">{gap.details}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase mb-1">Recommended Resolution</p>
                          <p className="text-sm text-emerald-400">{gap.resolution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-cyan-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Action Required</p>
                      <p className="text-sm text-slate-300 mt-1">
                        To resolve schema gaps, either add the missing columns to PostgreSQL via migrations, 
                        or update the TypeScript interfaces to match the actual database structure. 
                        The recommended approach is to align the database with the TypeScript contracts 
                        since the UI expects these fields.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
