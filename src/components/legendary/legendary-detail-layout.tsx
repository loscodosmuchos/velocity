import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  Edit, 
  ExternalLink,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

// ═══════════════════════════════════════════════════════════════
// LEGENDARY TREATMENT FRAMEWORK
// Reusable components for detail pages with premium automotive styling
// Every element is clickable, every metric is actionable
// ═══════════════════════════════════════════════════════════════

export interface LegendaryBreadcrumb {
  label: string;
  path?: string;
}

export interface LegendaryAction {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  variant?: "default" | "success" | "warning" | "danger";
  disabled?: boolean;
}

export interface LegendaryHeaderProps {
  title: string;
  subtitle?: string;
  badge?: { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" };
  breadcrumbs?: LegendaryBreadcrumb[];
  actions?: LegendaryAction[];
  backPath?: string;
  aiInsight?: string;
}

export function LegendaryHeader({ 
  title, 
  subtitle, 
  badge, 
  breadcrumbs = [], 
  actions = [],
  backPath,
  aiInsight
}: LegendaryHeaderProps) {
  const navigate = useNavigate();
  
  const badgeStyles = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30"
  };

  const actionStyles = {
    default: "bg-slate-700 hover:bg-slate-600 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4">
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          {backPath && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(backPath)}
              className="text-slate-400 hover:text-white -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />Back
            </Button>
          )}
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
              {crumb.path ? (
                <button 
                  onClick={() => navigate(crumb.path!)}
                  className="hover:text-white transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {badge && (
              <Badge className={badgeStyles[badge.variant]}>
                {badge.label}
              </Badge>
            )}
          </div>
          {subtitle && <p className="text-slate-400">{subtitle}</p>}
          
          {aiInsight && (
            <div className="flex items-center gap-2 mt-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-200">{aiInsight}</span>
            </div>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={actionStyles[action.variant || "default"]}
                >
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY KPI RIBBON - Premium stats with click-through actions
// ═══════════════════════════════════════════════════════════════

export interface LegendaryKPI {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ElementType;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
  tooltip?: string;
}

export function LegendaryKPIRibbon({ kpis }: { kpis: LegendaryKPI[] }) {
  const variantStyles = {
    default: "border-slate-700/50 bg-slate-800/30",
    success: "border-emerald-500/30 bg-emerald-900/20",
    warning: "border-amber-500/30 bg-amber-900/20",
    danger: "border-red-500/30 bg-red-900/20"
  };

  const iconColors = {
    default: "text-slate-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400"
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        const variant = kpi.variant || "default";
        
        const content = (
          <Card 
            className={cn(
              "border transition-all",
              variantStyles[variant],
              kpi.onClick && "cursor-pointer hover:border-white/30 hover:scale-[1.02]"
            )}
            onClick={kpi.onClick}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white">{kpi.value}</span>
                    {kpi.subValue && (
                      <span className="text-sm text-slate-500">{kpi.subValue}</span>
                    )}
                  </div>
                  {kpi.trend && kpi.trendValue && (
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs",
                      kpi.trend === "up" && "text-emerald-400",
                      kpi.trend === "down" && "text-red-400",
                      kpi.trend === "stable" && "text-slate-400"
                    )}>
                      <TrendingUp className={cn(
                        "h-3 w-3",
                        kpi.trend === "down" && "rotate-180"
                      )} />
                      {kpi.trendValue}
                    </div>
                  )}
                </div>
                {Icon && (
                  <div className={cn("p-2 rounded-lg bg-slate-900/50", iconColors[variant])}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

        if (kpi.tooltip) {
          return (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                  {kpi.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return <div key={idx}>{content}</div>;
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY INFO GRID - Organized field display with hover actions
// ═══════════════════════════════════════════════════════════════

export interface LegendaryField {
  label: string;
  value: string | number | null;
  icon?: React.ElementType;
  onClick?: () => void;
  copyable?: boolean;
  link?: string;
  badge?: { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" };
  format?: "currency" | "date" | "number" | "percentage";
}

export function LegendaryInfoGrid({ fields, columns = 3 }: { fields: LegendaryField[]; columns?: number }) {
  const navigate = useNavigate();

  const formatValue = (field: LegendaryField): string => {
    if (field.value === null || field.value === undefined) return "—";
    
    switch (field.format) {
      case "currency":
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(field.value));
      case "date":
        return new Date(field.value as string).toLocaleDateString();
      case "number":
        return new Intl.NumberFormat("en-US").format(Number(field.value));
      case "percentage":
        return `${field.value}%`;
      default:
        return String(field.value);
    }
  };

  const badgeStyles = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30"
  };

  return (
    <div className={cn("grid gap-4", `grid-cols-${columns}`)}>
      {fields.map((field, idx) => {
        const Icon = field.icon;
        const isClickable = field.onClick || field.link;
        
        return (
          <div 
            key={idx}
            className={cn(
              "bg-slate-800/30 border border-slate-700/50 rounded-lg p-3",
              isClickable && "cursor-pointer hover:border-white/30 transition-colors"
            )}
            onClick={() => {
              if (field.onClick) field.onClick();
              if (field.link) navigate(field.link);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  {Icon && <Icon className="h-3 w-3" />}
                  {field.label}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-white font-medium">{formatValue(field)}</span>
                  {field.badge && (
                    <Badge className={cn("text-xs", badgeStyles[field.badge.variant])}>
                      {field.badge.label}
                    </Badge>
                  )}
                </div>
              </div>
              {field.link && <ExternalLink className="h-3 w-3 text-slate-500" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY TIMELINE - Visual journey with status indicators
// ═══════════════════════════════════════════════════════════════

export interface LegendaryTimelineEvent {
  label: string;
  date?: string;
  status: "completed" | "current" | "pending" | "error";
  description?: string;
  actor?: string;
}

export function LegendaryTimeline({ events }: { events: LegendaryTimelineEvent[] }) {
  const statusIcons = {
    completed: CheckCircle2,
    current: Timer,
    pending: Clock,
    error: XCircle
  };

  const statusColors = {
    completed: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
    current: "text-blue-400 bg-blue-500/20 border-blue-500/30",
    pending: "text-slate-400 bg-slate-500/20 border-slate-500/30",
    error: "text-red-400 bg-red-500/20 border-red-500/30"
  };

  return (
    <div className="relative">
      {events.map((event, idx) => {
        const Icon = statusIcons[event.status];
        const isLast = idx === events.length - 1;
        
        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center",
                statusColors[event.status]
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className={cn(
                  "w-0.5 flex-1 my-1",
                  event.status === "completed" ? "bg-emerald-500/50" : "bg-slate-700"
                )} />
              )}
            </div>
            <div className="pb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{event.label}</span>
                {event.date && (
                  <span className="text-xs text-slate-500">{event.date}</span>
                )}
              </div>
              {event.description && (
                <p className="text-sm text-slate-400 mt-0.5">{event.description}</p>
              )}
              {event.actor && (
                <p className="text-xs text-slate-500 mt-1">by {event.actor}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY QUICK ACTIONS - One-click operations bar
// ═══════════════════════════════════════════════════════════════

export interface LegendaryQuickAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: "default" | "success" | "warning" | "danger";
  disabled?: boolean;
  badge?: string;
}

export function LegendaryQuickActions({ actions }: { actions: LegendaryQuickAction[] }) {
  const variantStyles = {
    default: "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white",
    success: "bg-emerald-900/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-800/30",
    warning: "bg-amber-900/20 border-amber-500/30 text-amber-400 hover:bg-amber-800/30",
    danger: "bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-800/30"
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-slate-900/50 border-y border-slate-700/50">
      <span className="text-xs text-slate-500 uppercase tracking-wider mr-2">Quick Actions:</span>
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                    variantStyles[action.variant || "default"],
                    action.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                  {action.badge && (
                    <Badge className="bg-slate-700 text-xs absolute -top-2 -right-2">
                      {action.badge}
                    </Badge>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                {action.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY SECTION - Consistent content sections
// ═══════════════════════════════════════════════════════════════

export interface LegendarySectionProps {
  title: string;
  icon?: React.ElementType;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function LegendarySection({ 
  title, 
  icon: Icon, 
  description, 
  children, 
  actions 
}: LegendarySectionProps) {
  return (
    <Card className="bg-slate-800/30 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2 text-base">
              {Icon && <Icon className="h-5 w-5 text-blue-400" />}
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-slate-400 mt-1">{description}</CardDescription>
            )}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEGENDARY RELATED ITEMS - Connected data with navigation
// ═══════════════════════════════════════════════════════════════

export interface LegendaryRelatedItem {
  type: string;
  label: string;
  value: string;
  path: string;
  status?: { label: string; variant: "success" | "warning" | "danger" | "neutral" };
  meta?: string;
}

export function LegendaryRelatedItems({ items, title = "Related" }: { items: LegendaryRelatedItem[]; title?: string }) {
  const navigate = useNavigate();

  const badgeStyles = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border-red-500/30",
    neutral: "bg-slate-500/20 text-slate-300 border-slate-500/30"
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-white/30 transition-colors text-left"
          >
            <div>
              <span className="text-xs text-slate-500 uppercase">{item.type}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white font-medium">{item.label}</span>
                {item.status && (
                  <Badge className={cn("text-xs", badgeStyles[item.status.variant])}>
                    {item.status.label}
                  </Badge>
                )}
              </div>
              {item.meta && <span className="text-xs text-slate-500">{item.meta}</span>}
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
