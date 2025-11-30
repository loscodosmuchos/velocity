import { LucideIcon, HelpCircle, Lightbulb } from "lucide-react";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LegendaryFormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  step?: number;
  totalSteps?: number;
  helpText?: string;
  tip?: string;
  children: ReactNode;
}

export function LegendaryFormSection({
  title,
  description,
  icon: Icon,
  step,
  totalSteps,
  helpText,
  tip,
  children,
}: LegendaryFormSectionProps) {
  return (
    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {step && totalSteps && (
            <div className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-400">{step}</span>
            </div>
          )}
          {Icon && !step && (
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Icon className="h-4 w-4 text-blue-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              {title}
              {helpText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-slate-500 hover:text-blue-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700 text-slate-200">
                      {helpText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </h3>
            {description && (
              <p className="text-sm text-slate-400">{description}</p>
            )}
          </div>
        </div>
        {step && totalSteps && (
          <span className="text-xs text-slate-500">Step {step} of {totalSteps}</span>
        )}
      </div>
      
      {tip && (
        <div className="flex items-start gap-2 p-3 bg-blue-950/30 rounded-lg border border-blue-500/20 mb-4">
          <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-200">{tip}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export default LegendaryFormSection;
