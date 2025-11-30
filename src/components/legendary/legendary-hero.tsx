import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface LegendaryHeroProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconGradient?: string;
  badge?: {
    label: string;
    variant?: "live" | "beta" | "new" | "alert";
  };
  actions?: ReactNode;
  children?: ReactNode;
}

export function LegendaryHero({
  title,
  subtitle,
  icon: Icon,
  iconGradient = "from-blue-500 to-cyan-500",
  badge,
  actions,
  children,
}: LegendaryHeroProps) {
  const badgeColors = {
    live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    beta: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    alert: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-950 rounded-xl border border-blue-500/20 p-6 mb-6">
      <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                {badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${badgeColors[badge.variant || "live"]}`}>
                    {badge.label}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-slate-300 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default LegendaryHero;
