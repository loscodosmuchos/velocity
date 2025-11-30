"use client";

import * as React from "react";
import { useNavigate } from "react-router";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Users,
  ShoppingCart,
  Clock,
  Receipt,
  Wallet,
  CheckCircle,
  FolderOpen,
  Settings,
  BarChart3,
  Brain,
  Zap,
  Shield,
  History,
  Upload,
  Sparkles,
  Bell,
  AlertTriangle,
  HeadphonesIcon,
  LayoutDashboard,
  Building2,
  Briefcase,
  UserCog,
  Database,
  Workflow,
  BookOpen,
  Target,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  keywords?: string[];
  shortcut?: string;
}

const commandItems: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard, category: "Navigation", keywords: ["home", "main", "overview"] },
  
  { id: "sow-list", label: "Statements of Work", path: "/statement-of-works", icon: FileText, category: "SOWs", keywords: ["sow", "contracts", "agreements"] },
  { id: "sow-templates", label: "SOW Templates", path: "/statement-of-works/templates", icon: BookOpen, category: "SOWs", keywords: ["template", "pattern"] },
  { id: "sow-command", label: "SOW Command Center", path: "/statement-of-works/command-center", icon: Zap, category: "SOWs", keywords: ["workflow", "manage"] },
  
  { id: "po-list", label: "Purchase Orders", path: "/purchase-orders", icon: ShoppingCart, category: "Procurement", keywords: ["po", "orders", "purchasing"] },
  { id: "po-templates", label: "PO Templates", path: "/purchase-orders/templates", icon: BookOpen, category: "Procurement" },
  { id: "buyers", label: "Buyers", path: "/buyers", icon: Briefcase, category: "Procurement", keywords: ["purchasing", "procurement team"] },
  
  { id: "contractors", label: "Contractors", path: "/contractors", icon: Users, category: "People", keywords: ["workers", "staff", "consultants"] },
  { id: "contractors-onboard", label: "Onboard Contractor", path: "/contractors/onboard", icon: UserCog, category: "People", keywords: ["new hire", "add"] },
  
  { id: "timecards", label: "Timecards", path: "/timecards", icon: Clock, category: "Time & Expenses", keywords: ["time", "hours", "timesheet"] },
  { id: "timecards-pending", label: "Pending Timecards", path: "/timecards/pending", icon: Clock, category: "Time & Expenses" },
  
  { id: "invoices", label: "Invoices", path: "/invoices", icon: Receipt, category: "Financials", keywords: ["bills", "payments", "billing"] },
  { id: "expenses", label: "Expenses", path: "/expenses", icon: Wallet, category: "Financials", keywords: ["costs", "reimbursement"] },
  
  { id: "approvals", label: "Approvals", path: "/approvals", icon: CheckCircle, category: "Workflow", keywords: ["approve", "pending", "review"], shortcut: "⌘A" },
  { id: "approvals-rules", label: "Approval Rules", path: "/approvals/rules", icon: Shield, category: "Workflow" },
  { id: "change-orders", label: "Change Orders", path: "/change-orders", icon: FolderOpen, category: "Workflow" },
  
  { id: "docs-command", label: "Documents Command Center", path: "/documents/command-center", icon: Zap, category: "Documents", keywords: ["ai", "analysis"], shortcut: "⌘D" },
  { id: "docs-search", label: "Document Search", path: "/documents/search", icon: Search, category: "Documents", keywords: ["find", "lookup"] },
  { id: "docs-upload", label: "Upload Document", path: "/documents/upload", icon: Upload, category: "Documents" },
  { id: "docs-audit", label: "Document Audit Trail", path: "/documents/audit", icon: History, category: "Documents" },
  
  { id: "ai-insights", label: "AI Insights", path: "/ai/insights", icon: Sparkles, category: "Intelligence", keywords: ["analysis", "predictions"], shortcut: "⌘I" },
  { id: "ai-agents", label: "AI Voice Agents", path: "/ai/elevenlabs-agents", icon: HeadphonesIcon, category: "Intelligence" },
  
  { id: "analytics", label: "Analytics Hub", path: "/analytics-hub", icon: BarChart3, category: "Reports", keywords: ["reports", "metrics", "charts"] },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: Bell, category: "System", shortcut: "⌘N" },
  { id: "alerts", label: "Alerts", path: "/notifications?filter=alerts", icon: AlertTriangle, category: "System" },
  
  { id: "admin-claims", label: "Claims Audit", path: "/admin/claims-audit", icon: Crown, category: "Admin", keywords: ["quality", "legendary"] },
  { id: "admin-users", label: "User Management", path: "/admin/user-management", icon: UserCog, category: "Admin" },
  { id: "admin-data", label: "Data Quality", path: "/admin/data-quality", icon: Database, category: "Admin" },
  { id: "admin-workflow", label: "Workflow Studio", path: "/admin/journey-builder", icon: Workflow, category: "Admin" },
  { id: "admin-demo", label: "Demo Command Center", path: "/demo-command-center", icon: Target, category: "Admin" },
  { id: "admin-settings", label: "Settings", path: "/settings", icon: Settings, category: "Admin" },
];

const categories = [
  "Navigation",
  "SOWs", 
  "Procurement",
  "People",
  "Time & Expenses",
  "Financials",
  "Workflow",
  "Documents",
  "Intelligence",
  "Reports",
  "System",
  "Admin",
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          "h-8 px-2.5 gap-2",
          "bg-slate-800/60 hover:bg-slate-700/80",
          "border border-slate-600/50 hover:border-slate-500/70",
          "text-slate-400 hover:text-slate-200",
          "rounded-lg",
          "transition-all duration-200",
          "group"
        )}
      >
        <Search className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        <span className="text-xs font-medium hidden sm:inline">Search...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-slate-600/60 bg-slate-700/50 px-1.5 font-mono text-[10px] font-medium text-slate-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        title="Command Palette"
        description="Search pages, commands, and actions"
      >
        <CommandInput 
          placeholder="Search pages, commands..." 
          className="border-none focus:ring-0"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="py-6 text-center text-sm text-slate-400">
            No results found.
          </CommandEmpty>
          
          {categories.map((category) => {
            const items = commandItems.filter(item => item.category === category);
            if (items.length === 0) return null;
            
            return (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.keywords?.join(" ") || ""}`}
                      onSelect={() => runCommand(() => navigate(item.path))}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-slate-600/60 bg-slate-700/50 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                          {item.shortcut}
                        </kbd>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="bg-slate-700/30" />
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
