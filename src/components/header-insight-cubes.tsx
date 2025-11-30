import { useNavigate } from 'react-router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

export interface HeaderInsight {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  category: 'pattern' | 'prediction' | 'recommendation' | 'anomaly' | 'optimization';
  title: string;
  summary: string;
  confidence: number;
  actionable: boolean;
}

const severityConfig = {
  high: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    border: 'border-amber-500/60',
    glow: 'shadow-amber-500/40',
  },
  medium: {
    bg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    border: 'border-yellow-500/60',
    glow: 'shadow-yellow-500/40',
  },
  low: {
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    border: 'border-emerald-500/60',
    glow: 'shadow-emerald-500/40',
  },
  info: {
    bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    border: 'border-cyan-500/60',
    glow: 'shadow-cyan-500/40',
  }
};

const categoryIcons = {
  pattern: Target,
  prediction: TrendingUp,
  recommendation: Lightbulb,
  anomaly: AlertTriangle,
  optimization: Zap
};

function HeaderInsightCube({ insight }: { insight: HeaderInsight }) {
  const navigate = useNavigate();
  const config = severityConfig[insight.severity];
  const Icon = categoryIcons[insight.category];

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={() => navigate(`/ai/insights`)}
            className={`
              relative w-10 h-10 rounded-lg border shadow-lg cursor-pointer
              transition-all duration-200 hover:scale-110 hover:shadow-xl
              flex items-center justify-center
              ${config.bg} ${config.border} ${config.glow}
            `}
          >
            <Icon className="h-4 w-4 text-white" />
            <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-amber-500/50">
              <Brain className="h-2.5 w-2.5 text-amber-400" />
            </div>
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white/90 bg-slate-900/80 px-1 rounded">
              {insight.confidence}%
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-xs bg-slate-900 border-amber-500/50 text-white p-3"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-amber-300">{insight.title}</span>
            </div>
            <p className="text-xs text-slate-300">{insight.summary}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Confidence: {insight.confidence}%</span>
              {insight.actionable && (
                <span className="text-amber-400 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" /> Actionable
                </span>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function HeaderInsightCubes({ insights }: { insights: HeaderInsight[] }) {
  const topInsights = insights.slice(0, 4);
  
  if (topInsights.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 border border-amber-500/30">
        <Brain className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span className="text-xs text-amber-300 font-medium">AI</span>
      </div>
      <div className="flex items-center gap-1.5">
        {topInsights.map((insight) => (
          <HeaderInsightCube key={insight.id} insight={insight} />
        ))}
      </div>
      {insights.length > 4 && (
        <div className="text-xs text-slate-400 ml-1">
          +{insights.length - 4}
        </div>
      )}
    </div>
  );
}
