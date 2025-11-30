import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, AlertCircle, CheckCircle2, Palette } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DesignLensMetrics {
  contrast: number; // 0-100
  accessibility: number; // 0-100
  colorCompliance: number; // 0-100
  typographyScore: number; // 0-100
  dataVisualization: number; // 0-100
  overallScore: number; // 0-100
}

interface DesignLensBadgeProps {
  metrics?: DesignLensMetrics;
  pageName: string;
}

export function DesignLensBadge({
  metrics,
  pageName,
}: DesignLensBadgeProps) {
  const defaultMetrics: DesignLensMetrics = {
    contrast: 92,
    accessibility: 88,
    colorCompliance: 95,
    typographyScore: 90,
    dataVisualization: 85,
    overallScore: 90,
  };

  const m = metrics || defaultMetrics;
  const scoreBg = m.overallScore >= 90 ? "bg-emerald-500/20" : 
                  m.overallScore >= 75 ? "bg-amber-500/20" : 
                  "bg-red-500/20";
  const scoreText = m.overallScore >= 90 ? "text-emerald-200" : 
                    m.overallScore >= 75 ? "text-amber-200" : 
                    "text-red-200";
  const scoreIcon = m.overallScore >= 90 ? <CheckCircle2 className="h-4 w-4" /> : 
                    m.overallScore >= 75 ? <AlertCircle className="h-4 w-4" /> : 
                    <AlertCircle className="h-4 w-4" />;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/50 ${scoreBg} cursor-help`}>
            <Palette className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-xs font-semibold text-slate-200">Design</span>
            <Badge variant="outline" className={`${scoreText} border-slate-700/50 text-xs`}>
              {scoreIcon}
              {m.overallScore}/100
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 p-4 max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-white text-sm">{pageName} - Design Compliance</p>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Contrast Ratio</span>
                <span className={m.contrast >= 90 ? "text-emerald-200" : "text-amber-200"}>{m.contrast}%</span>
              </div>
              <div className="flex justify-between">
                <span>WCAG Accessibility</span>
                <span className={m.accessibility >= 85 ? "text-emerald-200" : "text-amber-200"}>{m.accessibility}%</span>
              </div>
              <div className="flex justify-between">
                <span>Color Compliance</span>
                <span className={m.colorCompliance >= 90 ? "text-emerald-200" : "text-amber-200"}>{m.colorCompliance}%</span>
              </div>
              <div className="flex justify-between">
                <span>Typography</span>
                <span className={m.typographyScore >= 85 ? "text-emerald-200" : "text-amber-200"}>{m.typographyScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Data Visualization</span>
                <span className={m.dataVisualization >= 80 ? "text-emerald-200" : "text-amber-200"}>{m.dataVisualization}%</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
