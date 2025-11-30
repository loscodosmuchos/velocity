import { cn } from "@/lib/utils";
import { Check, Circle, ArrowRight, Lock, Clock, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type StepStatus = "completed" | "current" | "upcoming" | "locked" | "warning";

export interface WorkflowStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  timestamp?: string;
  action?: string;
}

interface WorkflowStepIndicatorProps {
  steps: WorkflowStep[];
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showConnectors?: boolean;
  className?: string;
}

const stepStatusConfig: Record<StepStatus, { 
  icon: typeof Check; 
  bgClass: string; 
  borderClass: string; 
  textClass: string;
  connectorClass: string;
  pulseClass?: string;
}> = {
  completed: {
    icon: Check,
    bgClass: "bg-emerald-500/20",
    borderClass: "border-emerald-500/60",
    textClass: "text-emerald-400",
    connectorClass: "bg-gradient-to-r from-emerald-500/60 to-emerald-500/60",
  },
  current: {
    icon: Circle,
    bgClass: "bg-blue-500/20",
    borderClass: "border-blue-400",
    textClass: "text-blue-400",
    connectorClass: "bg-gradient-to-r from-emerald-500/60 to-slate-600/40",
    pulseClass: "animate-pulse",
  },
  upcoming: {
    icon: Circle,
    bgClass: "bg-slate-700/30",
    borderClass: "border-slate-600/50",
    textClass: "text-slate-400",
    connectorClass: "bg-slate-700/40",
  },
  locked: {
    icon: Lock,
    bgClass: "bg-slate-800/30",
    borderClass: "border-slate-700/50",
    textClass: "text-slate-500",
    connectorClass: "bg-slate-800/40",
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-amber-500/20",
    borderClass: "border-amber-500/60",
    textClass: "text-amber-400",
    connectorClass: "bg-gradient-to-r from-amber-500/40 to-slate-600/40",
    pulseClass: "animate-pulse",
  },
};

const sizeConfig = {
  sm: { icon: 16, node: "w-8 h-8", connector: "h-0.5", text: "text-xs" },
  md: { icon: 20, node: "w-10 h-10", connector: "h-1", text: "text-sm" },
  lg: { icon: 24, node: "w-12 h-12", connector: "h-1.5", text: "text-base" },
};

export function WorkflowStepIndicator({
  steps,
  orientation = "horizontal",
  size = "md",
  showConnectors = true,
  className,
}: WorkflowStepIndicatorProps) {
  const isHorizontal = orientation === "horizontal";
  const sizeStyles = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex",
        isHorizontal ? "flex-row items-center" : "flex-col items-start",
        className
      )}
    >
      {steps.map((step, index) => {
        const config = stepStatusConfig[step.status];
        const Icon = config.icon;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={cn(
              "flex",
              isHorizontal ? "flex-row items-center" : "flex-col items-start"
            )}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center",
                      isHorizontal ? "flex-col" : "flex-row gap-3"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full border-2 flex items-center justify-center transition-all",
                        sizeStyles.node,
                        config.bgClass,
                        config.borderClass,
                        config.pulseClass,
                        step.status === "current" && "ring-2 ring-blue-400/30 ring-offset-2 ring-offset-slate-900"
                      )}
                    >
                      <Icon
                        size={sizeStyles.icon}
                        className={cn(config.textClass)}
                        strokeWidth={step.status === "completed" ? 3 : 2}
                      />
                    </div>
                    <div
                      className={cn(
                        isHorizontal ? "mt-2 text-center" : "",
                        "max-w-[120px]"
                      )}
                    >
                      <p
                        className={cn(
                          "font-medium truncate",
                          sizeStyles.text,
                          step.status === "current"
                            ? "text-blue-300"
                            : step.status === "completed"
                            ? "text-emerald-300/80"
                            : "text-slate-400"
                        )}
                      >
                        {step.label}
                      </p>
                      {step.timestamp && (
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock size={10} />
                          {step.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side={isHorizontal ? "bottom" : "right"}
                  className="bg-slate-800 border-slate-700 max-w-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{step.label}</p>
                    {step.description && (
                      <p className="text-slate-300 text-xs">{step.description}</p>
                    )}
                    {step.action && (
                      <p className="text-blue-400 text-xs font-medium">
                        Action: {step.action}
                      </p>
                    )}
                    {step.timestamp && (
                      <p className="text-slate-500 text-xs">{step.timestamp}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showConnectors && !isLast && (
              <div
                className={cn(
                  "flex items-center justify-center",
                  isHorizontal ? "mx-2" : "ml-4 my-1"
                )}
              >
                {isHorizontal ? (
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "w-8 rounded-full transition-all",
                        sizeStyles.connector,
                        config.connectorClass
                      )}
                    />
                    <ArrowRight
                      size={14}
                      className={cn(
                        step.status === "completed"
                          ? "text-emerald-500/60"
                          : "text-slate-600/40"
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-0.5 h-6 rounded-full transition-all",
                      config.connectorClass
                    )}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function EntityWorkflowBadge({
  currentStep,
  totalSteps,
  status,
  className,
}: {
  currentStep: number;
  totalSteps: number;
  status: "on_track" | "at_risk" | "blocked" | "completed";
  className?: string;
}) {
  const statusConfig = {
    on_track: { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" },
    at_risk: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
    blocked: { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400" },
    completed: { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400" },
  };

  const config = statusConfig[status];
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-2 py-1 rounded-md border",
              config.bg,
              config.border,
              className
            )}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-3 rounded-sm transition-all",
                    i < currentStep
                      ? config.bg.replace("/20", "/60")
                      : "bg-slate-700/50"
                  )}
                />
              ))}
            </div>
            <span className={cn("text-xs font-medium", config.text)}>
              {currentStep}/{totalSteps}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 border-slate-700">
          <p className="text-sm">
            Step {currentStep} of {totalSteps} ({percentage.toFixed(0)}% complete)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MiniWorkflowProgress({
  steps,
  className,
}: {
  steps: { status: StepStatus }[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {steps.map((step, i) => {
        const config = stepStatusConfig[step.status];
        return (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              config.bgClass,
              step.status === "current" && "ring-1 ring-blue-400/50"
            )}
          />
        );
      })}
    </div>
  );
}
