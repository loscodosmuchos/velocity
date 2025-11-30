import { useNavigate } from 'react-router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Sparkles,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface AIInsight {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  category: 'pattern' | 'prediction' | 'recommendation' | 'anomaly' | 'optimization';
  title: string;
  summary: string;
  confidence: number;
  impact?: string;
  actionable: boolean;
  timestamp: string;
}

const AIInsightCube = ({ insight }: { insight: AIInsight }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ai-insights/${insight.id}`);
  };

  // Severity colors - amber/gold theme (complementary to cyan dashboard)
  const severityConfig = {
    high: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      border: 'border-amber-600',
      hover: 'hover:from-amber-600 hover:to-orange-700',
      glow: 'shadow-amber-500/50',
      text: 'text-amber-50'
    },
    medium: {
      bg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      border: 'border-yellow-600',
      hover: 'hover:from-yellow-600 hover:to-amber-700',
      glow: 'shadow-yellow-500/50',
      text: 'text-yellow-50'
    },
    low: {
      bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      border: 'border-emerald-600',
      hover: 'hover:from-emerald-600 hover:to-teal-700',
      glow: 'shadow-emerald-500/50',
      text: 'text-emerald-50'
    },
    info: {
      bg: 'bg-gradient-to-br from-slate-600 to-slate-700',
      border: 'border-slate-500',
      hover: 'hover:from-slate-700 hover:to-slate-800',
      glow: 'shadow-slate-500/50',
      text: 'text-slate-50'
    }
  };

  const categoryConfig = {
    pattern: {
      icon: <Target className="h-5 w-5" />,
      label: 'Pattern Detection',
      color: 'text-amber-100'
    },
    prediction: {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Predictive Analytics',
      color: 'text-yellow-100'
    },
    recommendation: {
      icon: <Lightbulb className="h-5 w-5" />,
      label: 'AI Recommendation',
      color: 'text-amber-100'
    },
    anomaly: {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'Anomaly Detected',
      color: 'text-orange-100'
    },
    optimization: {
      icon: <Zap className="h-5 w-5" />,
      label: 'Process Optimization',
      color: 'text-emerald-100'
    }
  };

  const config = severityConfig[insight.severity];
  const catConfig = categoryConfig[insight.category];

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={handleClick}
            className={`
              relative w-16 h-16 rounded-xl border-2 shadow-lg cursor-pointer
              transition-all duration-200 hover:scale-110 hover:shadow-2xl
              ${config.bg} ${config.border} ${config.hover} ${config.glow}
            `}
          >
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${config.text}`}>
              <div className={`mb-0.5 ${catConfig.color}`}>
                {catConfig.icon}
              </div>
              
              <div className="absolute top-1 right-1 bg-slate-900/90 rounded-full p-0.5">
                <Brain className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              </div>
              
              {insight.actionable && (
                <div className="absolute top-1 left-1 bg-slate-900/90 text-amber-400 rounded-full p-0.5 shadow-lg shadow-amber-500/30">
                  <Lightbulb className="h-3 w-3" />
                </div>
              )}
              
              <div className="text-[9px] font-bold truncate max-w-full px-1 bg-black/20 rounded px-1.5 py-0.5">
                {insight.confidence}%
              </div>
            </div>

            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-0.5 shadow-lg">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-md p-0 bg-slate-900 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 rounded-lg overflow-hidden cursor-pointer hover:border-amber-400 transition-colors"
          sideOffset={8}
          onClick={handleClick}
        >
          {/* Premium Gold Header */}
          <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-3 text-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mini Confidence Gauge */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
                  <circle 
                    cx="18" cy="18" r="15" fill="none" 
                    stroke="white" strokeWidth="3"
                    strokeDasharray={`${insight.confidence * 0.94} 94`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{insight.confidence}%</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm drop-shadow-sm">{insight.title}</h4>
                <p className="text-xs text-amber-100 flex items-center gap-1">
                  <span className="[&>svg]:h-3 [&>svg]:w-3">{catConfig.icon}</span>
                  {catConfig.label}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI
              </div>
              <div className="text-xs bg-white/20 px-2 py-0.5 rounded uppercase tracking-wide font-semibold">
                {insight.severity}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3 bg-slate-800">
            <div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {insight.summary}
              </p>
            </div>

            {insight.impact && (
              <div className="bg-gradient-to-r from-amber-900/50 to-slate-800 border border-amber-500/40 p-2.5 rounded-lg">
                <div className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Projected Impact
                </div>
                {/* Mini Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center bg-emerald-900/50 rounded p-1">
                    <div className="text-sm font-bold text-emerald-300">624h</div>
                    <div className="text-[8px] text-emerald-400">SAVED</div>
                  </div>
                  <div className="text-center bg-amber-900/50 rounded p-1">
                    <div className="text-sm font-bold text-amber-300">$31K</div>
                    <div className="text-[8px] text-amber-400">VALUE</div>
                  </div>
                  <div className="text-center bg-cyan-900/50 rounded p-1">
                    <div className="text-sm font-bold text-cyan-300">73%</div>
                    <div className="text-[8px] text-cyan-400">AUTO</div>
                  </div>
                </div>
                <p className="text-xs text-amber-100/80 line-clamp-2">
                  {insight.impact}
                </p>
              </div>
            )}

            {insight.actionable ? (
              <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-2 border-amber-500/50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
                      Actionable Insight
                    </div>
                    <p className="text-xs font-medium text-amber-100">
                      Click to view AI-generated recommendations and implementation steps
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700/50 border border-slate-600 p-2.5 rounded-lg">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <p className="text-xs font-medium">
                    Informational insight - for awareness and planning
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700 pt-2 mt-2">
              <span className="font-medium">
                {new Date(insight.timestamp).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-Generated
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function AIInsightCubes({ insights }: { insights: AIInsight[] }) {
  if (insights.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2.5 flex-wrap bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-2 rounded-lg border border-amber-500/20">
      {insights.map(insight => (
        <AIInsightCube key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

export type { AIInsight };
