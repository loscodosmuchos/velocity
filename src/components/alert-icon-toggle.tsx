import { useState, ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AlertIconToggleProps {
  icon: ReactNode;
  alertId: string;
  onAnimationChange?: (enabled: boolean) => void;
  animationClass?: string;
}

export function AlertIconToggle({ icon, alertId, onAnimationChange, animationClass }: AlertIconToggleProps) {
  const [isAnimating, setIsAnimating] = useState(() => {
    const saved = localStorage.getItem(`alert-animate-${alertId}`);
    return saved === null ? true : saved === "true";
  });
  const [showToggle, setShowToggle] = useState(false);

  const handleToggle = () => {
    const newState = !isAnimating;
    setIsAnimating(newState);
    localStorage.setItem(`alert-animate-${alertId}`, String(newState));
    onAnimationChange?.(newState);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowToggle(true)}
            onMouseLeave={() => setShowToggle(false)}
          >
            {/* Main Icon */}
            <div className={isAnimating ? animationClass : ""}>{icon}</div>

            {/* Toggle in lower right corner - appears on hover */}
            {showToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                className="absolute -bottom-1 -right-1 bg-slate-800 border border-slate-600 rounded-full p-0.5 hover:bg-slate-700 transition-all cursor-pointer group"
                title={isAnimating ? "Click to stop animation" : "Click to resume animation"}
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  {isAnimating ? (
                    <div className="w-2 h-2 bg-emerald-400 rounded-sm" />
                  ) : (
                    <div className="w-2 h-2 bg-slate-500 rounded-sm" />
                  )}
                </div>
              </button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-xs bg-slate-800 border-slate-700">
          {isAnimating ? "Animation ON - hover to toggle" : "Animation OFF - hover to toggle"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
