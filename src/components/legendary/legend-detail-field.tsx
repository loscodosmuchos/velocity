import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LegendDetailFieldProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  color?: "cyan" | "emerald" | "amber" | "red" | "purple" | "blue" | "pink" | "teal";
  action?: ReactNode;
  highlight?: boolean;
  variant?: "default" | "compact" | "emphasized";
}

const colorSchemes = {
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: "text-emerald-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "text-amber-400" },
  red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "text-red-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "text-purple-400" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: "text-blue-400" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", icon: "text-pink-400" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", icon: "text-teal-400" },
};

export function LegendDetailField({
  label,
  value,
  icon,
  color = "cyan",
  action,
  highlight = false,
  variant = "default",
}: LegendDetailFieldProps) {
  const scheme = colorSchemes[color];

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        scheme.bg,
        scheme.border,
        highlight && "ring-2 ring-offset-2 ring-offset-slate-900 " + scheme.text.replace("text-", "ring-")
      )}
    >
      {variant === "compact" ? (
        // Compact inline version
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <div className={cn("flex-shrink-0", scheme.icon)}>{icon}</div>}
            <div className="min-w-0">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">{label}</label>
              <p className="text-sm font-bold text-white truncate">{value}</p>
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      ) : variant === "emphasized" ? (
        // Large emphasized version
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            {icon && <div className={cn("flex-shrink-0", scheme.icon)}>{icon}</div>}
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-2xl font-bold text-white">{value}</p>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
      ) : (
        // Default version
        <div className="p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            {icon && <div className={cn("flex-shrink-0", scheme.icon)}>{icon}</div>}
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
            {action && <div className="ml-auto flex-shrink-0">{action}</div>}
          </div>
          <p className="text-sm font-semibold text-white pl-6">{value}</p>
        </div>
      )}
    </div>
  );
}

interface LegendDetailGroupProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "compact";
}

export function LegendDetailGroup({ title, icon, children, columns = 2, variant = "default" }: LegendDetailGroupProps) {
  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center gap-2 px-1">
          {icon && <div className="text-cyan-400">{icon}</div>}
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
        </div>
      )}
      <div
        className={cn(
          "grid gap-2",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
