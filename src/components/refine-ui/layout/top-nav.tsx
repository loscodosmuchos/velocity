"use client";

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HeadphonesIcon,
  BarChart3,
  Bell,
} from "lucide-react";
import { useAlerts } from "@/contexts/AlertContext";
import { TopNavAlerts } from "@/components/top-nav-alerts";
import { DemoModeIndicator } from "@/components/admin/demo-mode-toggle";
import { CommandPalette } from "@/components/command-palette";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TopNav() {
  const { unreadAlertCount, unreadNotificationCount } = useAlerts();
  return (
    <TooltipProvider delayDuration={200}>
      <nav
        className={cn(
          "sticky",
          "top-0",
          "h-12",
          "flex",
          "items-center",
          "justify-between",
          "gap-1.5",
          "px-4",
          "border-b-2",
          "border-slate-700/70",
          "shadow-lg shadow-black/20",
          "z-50",
        )}
        style={{
          background: [
            'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(51, 65, 85, 0.06) 2px, rgba(51, 65, 85, 0.06) 4px)',
            'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(30, 41, 59, 0.06) 2px, rgba(30, 41, 59, 0.06) 4px)',
            'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 25%, rgba(51,65,85,0.95) 50%, rgba(30,41,59,0.95) 75%, rgba(15,23,42,0.95) 100%)'
          ].join(', ')
        } as React.CSSProperties}
      >
        <div className={cn("flex", "items-center", "gap-2")}>
          <CommandPalette />
          <div className="w-px h-6 bg-slate-600/50" />
          <NavButton
            to="/ai/insights"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            label="AI Insights"
            iconColor="text-amber-400"
            tooltip="Contract analysis, predictive alerts, and AI-powered document review"
          />
          <NavButton
            to="/approvals"
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="Approvals"
            iconColor="text-emerald-400"
            tooltip="Pending timecard, invoice, and expense approvals"
          />
          <NavButton
            to="/notifications?filter=alerts"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="Alerts"
            iconColor="text-red-400"
            badge={unreadAlertCount > 0 ? String(unreadAlertCount) : undefined}
            tooltip="Critical alerts, budget warnings, and compliance issues"
          />
          <NavButton
            to="/analytics-hub"
            icon={<BarChart3 className="h-3.5 w-3.5" />}
            label="Reports"
            iconColor="text-cyan-400"
            tooltip="Analytics dashboard, budget reports, and performance metrics"
          />
          <NavButton
            to="/notifications"
            icon={<Bell className="h-3.5 w-3.5" />}
            label="Notifications"
            iconColor="text-violet-400"
            badge={unreadNotificationCount > 0 ? String(unreadNotificationCount) : undefined}
            tooltip="All notifications, updates, and system messages"
          />
          <NavButton
            to="/ai/elevenlabs-agents"
            icon={<HeadphonesIcon className="h-3.5 w-3.5" />}
            label="Support"
            iconColor="text-pink-400"
            tooltip="AI Support Agents powered by ElevenLabs - voice-first assistance"
          />
        </div>
        <div className="flex items-center gap-2">
          <DemoModeIndicator />
          <TopNavAlerts />
        </div>
      </nav>
    </TooltipProvider>
  );
}

interface NavButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  iconColor?: string;
  tooltip?: string;
}

function NavButton({ to, icon, label, badge, iconColor = "text-slate-400", tooltip }: NavButtonProps) {
  const buttonContent = (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn(
        "h-9",
        "px-3",
        "gap-1.5",
        "text-xs",
        "text-slate-300",
        "hover:text-slate-50",
        "hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/30",
        "hover:border-l-2 hover:border-l-blue-400/60",
        "border-l-2 border-l-transparent",
        "transition-all duration-200",
        "rounded-md",
        "relative",
        "group",
      )}
    >
      <Link to={to} className={cn("flex", "items-center", "gap-1.5")}>
        <span className={cn(iconColor, "group-hover:scale-110 transition-transform")}>{icon}</span>
        <span className="font-medium">{label}</span>
        {badge && (
          <span
            className={cn(
              "ml-1",
              "px-1.5",
              "py-0.5",
              "text-[10px]",
              "font-bold",
              "rounded-full",
              "bg-red-500",
              "text-white",
              "animate-red-alert-glow",
            )}
          >
            {badge}
          </span>
        )}
      </Link>
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-slate-900 border-slate-700 text-slate-200 max-w-xs"
        >
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

TopNav.displayName = "TopNav";
