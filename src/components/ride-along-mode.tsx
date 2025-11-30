/**
 * Ride-Along Mode - "No Work, No Credit" Transparency Layer
 * 
 * Shows calculation chain of custody in real-time.
 * Every metric can show exactly how it was calculated.
 * Like a police ride-along - a second set of eyes always watching.
 */

import { useState } from "react";
import { 
  Calculator, Eye, EyeOff, ChevronDown, ChevronRight, 
  CheckCircle2, Copy, Download, Sparkles, Shield,
  ArrowRight, FileText, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CalculationTrace, CalculationStep } from "@/lib/formula-registry";
import { exportTraceAsAudit } from "@/lib/formula-registry";

interface ShowMathButtonProps {
  trace: CalculationTrace;
  className?: string;
  variant?: "inline" | "icon" | "badge";
}

export function ShowMathButton({ trace, className, variant = "inline" }: ShowMathButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportTraceAsAudit(trace));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = exportTraceAsAudit(trace);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation-proof-${trace.formulaId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {variant === "icon" ? (
              <button className={cn(
                "p-1 rounded hover:bg-slate-700/50 transition-colors",
                "text-slate-400 hover:text-blue-400",
                className
              )}>
                <Calculator className="h-3.5 w-3.5" />
              </button>
            ) : variant === "badge" ? (
              <button className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]",
                "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors",
                "border border-blue-500/30",
                className
              )}>
                <Calculator className="h-3 w-3" />
                Show Math
              </button>
            ) : (
              <button className={cn(
                "inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300",
                "underline underline-offset-2 decoration-dotted",
                className
              )}>
                <Calculator className="h-3 w-3" />
                Show Math
              </button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">View calculation proof (chain of custody)</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Calculator className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <span className="block">{trace.formulaName}</span>
              <span className="text-xs font-normal text-slate-400">
                Chain of Custody Proof
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            "No work, no credit" - Here's exactly how this number was calculated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <CalculationProof trace={trace} />

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Calculated: {new Date(trace.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-slate-800 border-slate-600 hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Proof
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-slate-800 border-slate-600 hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CalculationProofProps {
  trace: CalculationTrace;
  compact?: boolean;
}

export function CalculationProof({ trace, compact = false }: CalculationProofProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]));

  const toggleStep = (stepNum: number) => {
    const newSet = new Set(expandedSteps);
    if (newSet.has(stepNum)) {
      newSet.delete(stepNum);
    } else {
      newSet.add(stepNum);
    }
    setExpandedSteps(newSet);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">INPUTS</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(trace.inputs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-2 rounded bg-slate-900/50">
              <span className="text-xs text-slate-400">{key.replace(/_/g, ' ')}</span>
              <span className="text-sm font-mono text-white">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-blue-500/50 to-emerald-500" />
        
        <div className="space-y-3 pl-10">
          <div className="flex items-center gap-2 -ml-6">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900 z-10" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Calculation Steps
            </span>
          </div>

          {trace.steps.map((step, idx) => (
            <StepCard
              key={step.stepNumber}
              step={step}
              isLast={idx === trace.steps.length - 1}
              isExpanded={expandedSteps.has(step.stepNumber)}
              onToggle={() => toggleStep(step.stepNumber)}
              compact={compact}
            />
          ))}

          <div className="flex items-center gap-2 -ml-6">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 z-10" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Result
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 uppercase tracking-wider">Final Result</span>
            <div className="text-2xl font-bold text-white">
              {typeof trace.finalResult === 'number' 
                ? trace.finalResult.toLocaleString() 
                : trace.finalResult}
              <span className="text-sm font-normal text-slate-400 ml-2">{trace.unit}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trace.verified && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {trace.passed !== undefined && (
              <Badge className={cn(
                trace.passed 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}>
                {trace.passed ? "PASSED" : "FAILED"}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepCardProps {
  step: CalculationStep;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}

function StepCard({ step, isLast, isExpanded, onToggle, compact }: StepCardProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn(
        "relative rounded-lg border transition-all",
        isExpanded 
          ? "bg-slate-800/70 border-slate-600" 
          : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
      )}>
        <CollapsibleTrigger asChild>
          <button className="w-full p-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                isExpanded 
                  ? "bg-blue-500 text-white" 
                  : "bg-slate-700 text-slate-300"
              )}>
                {step.stepNumber}
              </div>
              <span className="text-sm text-slate-200">{step.description}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-2">
            <div className="p-2 rounded bg-slate-900/50 font-mono text-xs">
              <div className="text-slate-400 mb-1">Formula:</div>
              <div className="text-blue-400">{step.formula}</div>
            </div>
            
            {step.stepNumber > 1 && (
              <div className="p-2 rounded bg-slate-900/50 font-mono text-xs">
                <div className="text-slate-400 mb-1">With values:</div>
                <div className="text-amber-400">{step.calculation}</div>
              </div>
            )}
            
            {step.stepNumber > 1 && step.result !== 0 && (
              <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                <ArrowRight className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-slate-400">Result:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {step.result.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface RideAlongPanelProps {
  traces: CalculationTrace[];
  title?: string;
  className?: string;
}

export function RideAlongPanel({ traces, title = "Calculation Audit Trail", className }: RideAlongPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (traces.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <Collapsible open={isVisible} onOpenChange={setIsVisible}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-between",
              "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50",
              "text-slate-300 hover:text-white"
            )}
          >
            <div className="flex items-center gap-2">
              {isVisible ? (
                <Eye className="h-4 w-4 text-blue-400" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              <span className="text-xs uppercase tracking-wider">{title}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {traces.length} calculations
              </Badge>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isVisible && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="italic">
                "No work, no credit" - Every number shows its proof
              </span>
            </div>

            <div className="space-y-3">
              {traces.map((trace, idx) => (
                <div 
                  key={`${trace.formulaId}-${idx}`}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-slate-200">
                        {trace.formulaName}
                      </span>
                    </div>
                    <ShowMathButton trace={trace} variant="badge" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Result: <span className="text-white font-mono">{trace.finalResult.toLocaleString()} {trace.unit}</span></span>
                    <span>Steps: <span className="text-white">{trace.steps.length}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function RideAlongModeToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEnabled(!enabled)}
          className={cn(
            "gap-2",
            enabled 
              ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
              : "bg-slate-800 border-slate-700 text-slate-400"
          )}
        >
          <Eye className="h-4 w-4" />
          <span className="text-xs">Ride-Along</span>
          {enabled && <span className="text-[10px] px-1 py-0.5 rounded bg-blue-500/30">ON</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">Toggle calculation transparency mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
