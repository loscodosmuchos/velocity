"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  DollarSign,
  Clock,
  FileText,
  Shield,
  Users,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TopNavAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'budget' | 'compliance' | 'operations' | 'timecards' | 'contractors' | 'invoices';
  title: string;
  message: string;
  value?: string;
  route: string;
}

const topNavAlerts: TopNavAlert[] = [
  {
    id: 'budget-1',
    type: 'critical',
    category: 'budget',
    title: 'Budget Overrun',
    message: 'Q4 Engineering budget exceeded by 12%',
    value: '$47,500 over',
    route: '/triage/budget'
  },
  {
    id: 'compliance-1',
    type: 'critical',
    category: 'compliance',
    title: 'Compliance Alert',
    message: '5 contractors missing required certifications',
    value: '5 non-compliant',
    route: '/triage/compliance'
  },
  {
    id: 'operations-1',
    type: 'warning',
    category: 'operations',
    title: 'Operations Review',
    message: '3 projects require status updates',
    value: '3 pending',
    route: '/triage/operations'
  },
  {
    id: 'timecards-1',
    type: 'warning',
    category: 'timecards',
    title: 'Pending Approvals',
    message: '23 timecards awaiting manager review',
    value: '23 pending',
    route: '/triage/timecards'
  },
  {
    id: 'contractors-1',
    type: 'success',
    category: 'contractors',
    title: 'Contractor Status',
    message: '8 contractors completed onboarding this week',
    value: '8 active',
    route: '/triage/contractors'
  },
  {
    id: 'invoices-1',
    type: 'info',
    category: 'invoices',
    title: 'Invoices Ready',
    message: '12 invoices ready for batch processing',
    value: '$156K total',
    route: '/triage/invoices'
  }
];

const typeConfig = {
  critical: {
    bg: 'bg-slate-800/60',
    border: 'border-red-500/60',
    glow: 'shadow-[inset_0_0_8px_rgba(239,68,68,0.15)]',
    cornerColor: 'bg-red-500',
    iconColor: 'text-red-400',
    textColor: 'text-red-300',
    icon: <XCircle className="h-2.5 w-2.5" />,
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    animation: 'animate-critical-strobe animate-racing-alert',
    pulseClass: 'animate-heartbeat-critical'
  },
  warning: {
    bg: 'bg-slate-800/60',
    border: 'border-amber-500/40',
    glow: 'shadow-[inset_0_0_8px_rgba(245,158,11,0.15)]',
    cornerColor: 'bg-amber-500',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-300',
    icon: <AlertTriangle className="h-2.5 w-2.5" />,
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    animation: 'animate-warning-flash',
    pulseClass: ''
  },
  info: {
    bg: 'bg-slate-800/60',
    border: 'border-cyan-500/40',
    glow: 'shadow-[inset_0_0_8px_rgba(6,182,212,0.15)]',
    cornerColor: 'bg-cyan-500',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-300',
    icon: <Clock className="h-2.5 w-2.5" />,
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    animation: '',
    pulseClass: ''
  },
  success: {
    bg: 'bg-slate-800/60',
    border: 'border-emerald-500/40',
    glow: 'shadow-[inset_0_0_8px_rgba(16,185,129,0.15)]',
    cornerColor: 'bg-emerald-500',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-300',
    icon: <CheckCircle className="h-2.5 w-2.5" />,
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    animation: '',
    pulseClass: ''
  }
};

const categoryIcons = {
  budget: <DollarSign className="h-3.5 w-3.5" />,
  compliance: <Shield className="h-3.5 w-3.5" />,
  operations: <FileText className="h-3.5 w-3.5" />,
  timecards: <Clock className="h-3.5 w-3.5" />,
  contractors: <Users className="h-3.5 w-3.5" />,
  invoices: <FileText className="h-3.5 w-3.5" />
};

export function TopNavAlerts() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const criticalCount = topNavAlerts.filter(a => a.type === 'critical').length;
  const warningCount = topNavAlerts.filter(a => a.type === 'warning').length;
  const totalCount = topNavAlerts.length;

  const handleCubeClick = (alert: TopNavAlert) => {
    navigate(alert.route);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn("flex items-center gap-1.5 ml-2")}>
      <button
        onClick={toggleExpanded}
        className={cn(
          "flex items-center gap-1.5",
          "h-8 px-2.5",
          "rounded-md",
          "bg-gradient-to-r from-slate-700/50 to-slate-600/40",
          "border border-slate-600/50",
          "hover:from-slate-600/50 hover:to-slate-500/40",
          "transition-all duration-300",
          "shadow-md shadow-black/20",
          "group"
        )}
      >
        {isExpanded ? (
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-300 transition-colors" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-300 transition-colors" />
        )}
        <span className="text-xs font-medium text-slate-300 group-hover:text-slate-200 transition-colors">
          Triage
        </span>
        <div className="flex items-center gap-1">
          {criticalCount > 0 && (
            <span className={cn(
              "px-1.5 py-0.5",
              "text-[10px] font-bold",
              "rounded-full",
              "bg-red-500 text-white",
              "animate-red-alert-glow"
            )}>
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && !isExpanded && (
            <span className={cn(
              "px-1.5 py-0.5",
              "text-[10px] font-bold",
              "rounded-full",
              "bg-amber-500/80 text-white"
            )}>
              {warningCount}
            </span>
          )}
          {!criticalCount && !warningCount && (
            <span className={cn(
              "px-1.5 py-0.5",
              "text-[10px] font-bold",
              "rounded-full",
              "bg-slate-500/60 text-slate-200"
            )}>
              {totalCount}
            </span>
          )}
        </div>
      </button>

      <div
        className={cn(
          "flex items-center gap-1",
          "overflow-hidden",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "max-w-[300px] opacity-100" : "max-w-0 opacity-0"
        )}
      >
        {topNavAlerts.map((alert) => {
          const config = typeConfig[alert.type];
          const categoryIcon = categoryIcons[alert.category];

          return (
            <TooltipProvider key={alert.id} delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleCubeClick(alert)}
                    className={cn(
                      "relative",
                      "w-8 h-8",
                      "rounded-lg cursor-pointer",
                      config.bg,
                      "border",
                      config.border,
                      config.glow,
                      config.animation,
                      "hover:scale-110",
                      "transition-all duration-200",
                      "flex items-center justify-center",
                      "group/cube",
                      "overflow-hidden",
                      "flex-shrink-0"
                    )}
                  >
                    <div className={cn("absolute top-0 left-0 w-1 h-1 rounded-br", config.cornerColor, "opacity-80")} />
                    <div className={cn("absolute top-0 right-0 w-1 h-1 rounded-bl", config.cornerColor, "opacity-80")} />
                    <div className={cn("absolute bottom-0 left-0 w-1 h-1 rounded-tr", config.cornerColor, "opacity-80")} />
                    <div className={cn("absolute bottom-0 right-0 w-1 h-1 rounded-tl", config.cornerColor, "opacity-80")} />

                    <div className={cn(config.iconColor, "group-hover/cube:opacity-100 opacity-80 transition-opacity")}>
                      {categoryIcon}
                    </div>

                    <div className={cn("absolute top-0.5 right-0.5", config.iconColor, "opacity-70")}>
                      {config.icon}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-[200px] p-0 bg-slate-900 border-slate-700 overflow-hidden"
                  sideOffset={8}
                >
                  <div className={cn("px-3 py-2 border-b border-slate-700/50", config.bg)}>
                    <p className={cn("text-xs font-bold", config.textColor)}>{alert.title}</p>
                  </div>
                  <div className="p-2 space-y-1.5">
                    <p className="text-xs text-slate-400">{alert.message}</p>
                    {alert.value && (
                      <p className={cn("text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block border", config.badge)}>
                        {alert.value}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

TopNavAlerts.displayName = "TopNavAlerts";
