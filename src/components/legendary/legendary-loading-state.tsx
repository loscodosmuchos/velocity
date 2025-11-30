import { Loader2, type LucideIcon } from "lucide-react";

interface LegendaryLoadingStateProps {
  icon?: LucideIcon;
  iconGradient?: string;
  title?: string;
  description?: string;
}

export function LegendaryLoadingState({
  icon: Icon,
  iconGradient = "from-blue-600/20 to-cyan-600/20",
  title = "Loading",
  description = "Fetching your data...",
}: LegendaryLoadingStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-xl border border-slate-700/50 p-12 w-full max-w-md">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center mb-6 border border-blue-500/30 relative`}>
            {Icon ? (
              <Icon className="h-10 w-10 text-blue-400 animate-pulse" />
            ) : (
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
            )}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/20 animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-4">{description}</p>
          
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegendaryLoadingState;
