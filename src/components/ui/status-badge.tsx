import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Info,
  Zap,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Ban,
  Circle
} from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 border",
  {
    variants: {
      variant: {
        positive: [
          "bg-emerald-950/60",
          "text-emerald-300",
          "border-emerald-500/40",
          "shadow-sm shadow-emerald-500/10"
        ].join(" "),
        warning: [
          "bg-amber-950/60",
          "text-amber-300",
          "border-amber-500/40",
          "shadow-sm shadow-amber-500/10"
        ].join(" "),
        critical: [
          "bg-red-950/60",
          "text-red-300",
          "border-red-500/40",
          "shadow-sm shadow-red-500/10"
        ].join(" "),
        info: [
          "bg-cyan-950/60",
          "text-cyan-300",
          "border-cyan-500/40",
          "shadow-sm shadow-cyan-500/10"
        ].join(" "),
        neutral: [
          "bg-slate-800/60",
          "text-slate-300",
          "border-slate-600/40",
          "shadow-sm shadow-slate-500/10"
        ].join(" "),
        pending: [
          "bg-purple-950/60",
          "text-purple-300",
          "border-purple-500/40",
          "shadow-sm shadow-purple-500/10"
        ].join(" "),
        active: [
          "bg-blue-950/60",
          "text-blue-300",
          "border-blue-500/40",
          "shadow-sm shadow-blue-500/10"
        ].join(" "),
        inactive: [
          "bg-slate-900/60",
          "text-slate-400",
          "border-slate-700/40",
        ].join(" "),
      },
      size: {
        sm: "text-[10px] px-2 py-0.5 gap-1",
        default: "text-xs px-2.5 py-1 gap-1.5",
        lg: "text-sm px-3 py-1.5 gap-2",
      },
      glow: {
        true: "",
        false: "",
      }
    },
    compoundVariants: [
      {
        variant: "positive",
        glow: true,
        className: "shadow-emerald-500/20 shadow-md",
      },
      {
        variant: "warning",
        glow: true,
        className: "shadow-amber-500/20 shadow-md",
      },
      {
        variant: "critical",
        glow: true,
        className: "shadow-red-500/20 shadow-md animate-pulse",
      },
      {
        variant: "info",
        glow: true,
        className: "shadow-cyan-500/20 shadow-md",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "default",
      glow: false,
    },
  }
);

const statusIcons: Record<string, React.ElementType> = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
  info: Info,
  neutral: Circle,
  pending: Clock,
  active: PlayCircle,
  inactive: PauseCircle,
};

const statusLabels: Record<string, Record<string, string>> = {
  contractor: {
    Active: "positive",
    Inactive: "inactive",
    Pending: "pending",
    Terminated: "critical",
    "On Leave": "warning",
  },
  invoice: {
    Paid: "positive",
    "GR Approved": "info",
    Submitted: "pending",
    Rejected: "critical",
    Pending: "warning",
    Draft: "neutral",
  },
  timecard: {
    Approved: "positive",
    Pending: "pending",
    Rejected: "critical",
    Submitted: "info",
    Draft: "neutral",
  },
  purchaseOrder: {
    Active: "positive",
    Closed: "neutral",
    Pending: "pending",
    Cancelled: "critical",
    "On Hold": "warning",
  },
  sow: {
    Active: "positive",
    Draft: "neutral",
    Expired: "warning",
    Terminated: "critical",
    Pending: "pending",
  },
  expense: {
    Approved: "positive",
    Pending: "pending",
    Rejected: "critical",
    Submitted: "info",
    "Under Review": "warning",
  },
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean;
  status?: string;
  category?: keyof typeof statusLabels;
  pulse?: boolean;
}

function StatusBadge({
  className,
  variant,
  size,
  glow,
  showIcon = true,
  status,
  category,
  pulse,
  children,
  ...props
}: StatusBadgeProps) {
  let resolvedVariant = variant;
  
  if (status && category && statusLabels[category]) {
    const mappedVariant = statusLabels[category][status];
    if (mappedVariant) {
      resolvedVariant = mappedVariant as typeof variant;
    }
  }
  
  if (!resolvedVariant && status) {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('active') || lowerStatus.includes('approved') || lowerStatus.includes('paid')) {
      resolvedVariant = 'positive';
    } else if (lowerStatus.includes('pending') || lowerStatus.includes('submitted')) {
      resolvedVariant = 'pending';
    } else if (lowerStatus.includes('reject') || lowerStatus.includes('cancel') || lowerStatus.includes('terminat')) {
      resolvedVariant = 'critical';
    } else if (lowerStatus.includes('warning') || lowerStatus.includes('hold') || lowerStatus.includes('expire')) {
      resolvedVariant = 'warning';
    } else if (lowerStatus.includes('inactive') || lowerStatus.includes('draft') || lowerStatus.includes('closed')) {
      resolvedVariant = 'neutral';
    }
  }

  const effectiveVariant = resolvedVariant || 'neutral';
  const IconComponent = statusIcons[effectiveVariant] || Circle;
  
  return (
    <div
      className={cn(
        statusBadgeVariants({ variant: effectiveVariant, size, glow }),
        pulse && "animate-pulse",
        className
      )}
      {...props}
    >
      {showIcon && <IconComponent className="h-3 w-3 flex-shrink-0" />}
      <span className="truncate">{children || status}</span>
    </div>
  );
}

export interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "positive" | "warning" | "critical" | "info" | "neutral" | "pending" | "active" | "inactive";
  pulse?: boolean;
  size?: "sm" | "default" | "lg";
}

function StatusDot({
  variant = "neutral",
  pulse = false,
  size = "default",
  className,
  ...props
}: StatusDotProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    default: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const colorClasses = {
    positive: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
    info: "bg-cyan-400",
    neutral: "bg-slate-400",
    pending: "bg-purple-400",
    active: "bg-blue-400",
    inactive: "bg-slate-500",
  };

  return (
    <div className="relative flex items-center justify-center" {...props}>
      {pulse && (
        <div
          className={cn(
            "absolute rounded-full animate-ping",
            sizeClasses[size],
            colorClasses[variant],
            "opacity-75"
          )}
        />
      )}
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          colorClasses[variant],
          className
        )}
      />
    </div>
  );
}

export { StatusBadge, StatusDot, statusBadgeVariants };
