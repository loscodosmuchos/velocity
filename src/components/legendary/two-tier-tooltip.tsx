import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface TwoTierTooltipProps {
  trigger: ReactNode;
  briefLabel: string;
  briefDescription: string;
  detailTitle: string;
  detailIcon?: ReactNode;
  detailDescription: string;
  detailMetric?: string;
  onViewDetails?: () => void;
  detailsUrl?: string;
}

export function TwoTierTooltip({
  trigger,
  briefLabel,
  briefDescription,
  detailTitle,
  detailIcon,
  detailDescription,
  detailMetric,
  onViewDetails,
  detailsUrl,
}: TwoTierTooltipProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{trigger}</div>
        </TooltipTrigger>
        <TooltipContent
          className="w-72 bg-slate-900 border-slate-700 p-0 rounded-lg shadow-2xl"
          onMouseEnter={() => setShowDetail(true)}
          onMouseLeave={() => setShowDetail(false)}
        >
          {!showDetail ? (
            // Brief tooltip
            <div className="p-3 space-y-1">
              <p className="font-semibold text-white text-sm">{briefLabel}</p>
              <p className="text-xs text-slate-300">{briefDescription}</p>
            </div>
          ) : (
            // Detailed tooltip
            <div className="p-4 space-y-3 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                {detailIcon && <div className="text-xl flex-shrink-0 mt-1">{detailIcon}</div>}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm mb-1">{detailTitle}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{detailDescription}</p>
                </div>
              </div>

              {detailMetric && (
                <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50">
                  <p className="text-xs font-mono text-amber-300 font-semibold">{detailMetric}</p>
                </div>
              )}

              {(onViewDetails || detailsUrl) && (
                <Button
                  onClick={() => {
                    onViewDetails?.();
                    if (detailsUrl) window.location.href = detailsUrl;
                  }}
                  className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 gap-1"
                  size="sm"
                >
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}

              <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-700">
                Hover tooltip to see more
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TwoTierTriageIcon({
  icon: Icon,
  label: label,
  briefDescription,
  detailTitle,
  detailDescription,
  detailMetric,
  detailsUrl,
  onViewDetails,
  colorClass = "text-amber-400",
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  briefDescription: string;
  detailTitle: string;
  detailDescription: string;
  detailMetric?: string;
  detailsUrl?: string;
  onViewDetails?: () => void;
  colorClass?: string;
}) {
  return (
    <TwoTierTooltip
      trigger={<Icon className={`${colorClass} h-8 w-8 cursor-help hover:scale-110 transition-transform`} />}
      briefLabel={label}
      briefDescription={briefDescription}
      detailTitle={detailTitle}
      detailIcon={<Icon className={`${colorClass} h-6 w-6`} />}
      detailDescription={detailDescription}
      detailMetric={detailMetric}
      onViewDetails={onViewDetails}
      detailsUrl={detailsUrl}
    />
  );
}
