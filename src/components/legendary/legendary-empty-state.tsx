import { LucideIcon, Plus, Upload, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
}

interface LegendaryEmptyStateProps {
  icon?: LucideIcon;
  iconGradient?: string;
  title: string;
  description: string;
  teachingPoints?: string[];
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  importAction?: {
    label: string;
    onClick?: () => void;
  };
  children?: ReactNode;
}

export function LegendaryEmptyState({
  icon: Icon = FileText,
  iconGradient = "from-blue-600/20 to-cyan-600/20",
  title,
  description,
  teachingPoints,
  primaryAction,
  secondaryAction,
  importAction,
  children,
}: LegendaryEmptyStateProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-xl border border-slate-700/50 p-12">
      <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center mb-6 border border-blue-500/30`}>
          <Icon className="h-10 w-10 text-blue-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{description}</p>
        
        {teachingPoints && teachingPoints.length > 0 && (
          <div className="w-full bg-slate-800/30 rounded-lg p-4 mb-6 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">What you'll be able to do:</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-2 text-left">
              {teachingPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {primaryAction && (
            <Button 
              onClick={primaryAction.onClick}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {primaryAction.icon ? (
                <primaryAction.icon className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              onClick={secondaryAction.onClick}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {secondaryAction.icon && <secondaryAction.icon className="h-4 w-4 mr-2" />}
              {secondaryAction.label}
            </Button>
          )}
        </div>
        
        {importAction && (
          <button 
            onClick={importAction.onClick}
            className="mt-4 text-sm text-slate-500 hover:text-blue-400 flex items-center gap-2 transition-colors"
          >
            <Upload className="h-4 w-4" />
            {importAction.label}
          </button>
        )}
        
        {children}
      </div>
    </div>
  );
}

export default LegendaryEmptyState;
