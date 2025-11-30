import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useOCR } from "@/hooks/useOCR";

interface RegionHotspot {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface OCRArchitectureMapProps {
  imageUrl: string;
  regions?: RegionHotspot[];
}

export function OCRArchitectureMap({ imageUrl, regions = [] }: OCRArchitectureMapProps) {
  const [ocrText, setOcrText] = useState<string>("");
  const [showRegions, setShowRegions] = useState(true);
  const [extractedRegions, setExtractedRegions] = useState<RegionHotspot[]>(regions);
  const imageRef = useRef<HTMLImageElement>(null);
  const { performOCR, loading } = useOCR();

  const handleOCR = async () => {
    const result = await performOCR(imageUrl, 60);
    if (result) {
      setOcrText(result.fullText);
      const newRegions = result.words.map((w) => ({
        id: w.id,
        label: w.text,
        description: `Confidence: ${w.confidence.toFixed(0)}%`,
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        color: w.color,
      }));
      setExtractedRegions(newRegions);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={handleOCR}
          disabled={loading}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              OCR Processing...
            </>
          ) : (
            "Run OCR Analysis"
          )}
        </Button>

        <Button
          onClick={() => setShowRegions(!showRegions)}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          {showRegions ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Regions
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Regions
            </>
          )}
        </Button>
      </div>

      {/* Interactive Image with Hotspots */}
      <div className="relative inline-block bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="System Architecture"
          className="max-w-full h-auto"
        />

        {/* SVG Overlay for Hotspots */}
        {showRegions && extractedRegions.length > 0 && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
          >
            <TooltipProvider>
              {extractedRegions.map((region) => (
                <g key={region.id} className="group" style={{ pointerEvents: "auto" }}>
                  {/* Rectangular hotspot */}
                  <rect
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    fill={`var(--color-${region.color.split("-")[0]})`}
                    fillOpacity="0.1"
                    stroke={`rgb(var(--${region.color}))`}
                    strokeWidth="2"
                    rx="4"
                    className="hover:fill-opacity-20 transition-all cursor-pointer"
                  />

                  {/* Label badge */}
                  <rect
                    x={region.x}
                    y={region.y - 24}
                    width={Math.max(region.width, 80)}
                    height="20"
                    fill="rgb(15, 23, 42)"
                    stroke={`rgb(var(--${region.color}))`}
                    strokeWidth="1"
                    rx="3"
                  />

                  <text
                    x={region.x + region.width / 2}
                    y={region.y - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={`rgb(var(--${region.color}))`}
                    className="pointer-events-none"
                  >
                    {region.label.substring(0, 12)}
                  </text>

                  {/* Tooltip on hover */}
                  <foreignObject
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    className="opacity-0 hover:opacity-100"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 border-slate-700 max-w-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-cyan-300">{region.label}</p>
                          <p className="text-xs text-slate-400">{region.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </foreignObject>
                </g>
              ))}
            </TooltipProvider>
          </svg>
        )}
      </div>

      {/* OCR Results */}
      {ocrText && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-bold text-cyan-300 mb-2">OCR Extracted Text</h3>
          <p className="text-xs text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
            {ocrText.substring(0, 500)}...
          </p>
        </div>
      )}

      {/* Region Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
          <div className="text-xs text-slate-400">Regions Detected</div>
          <div className="text-lg font-bold text-cyan-300">{extractedRegions.length}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded p-3">
          <div className="text-xs text-slate-400">Average Confidence</div>
          <div className="text-lg font-bold text-emerald-300">
            {extractedRegions.length > 0
              ? (
                  extractedRegions.reduce((sum, r) => sum + parseInt(r.description), 0) /
                  extractedRegions.length
                ).toFixed(0)
              : "—"}
            %
          </div>
        </div>
      </div>
    </div>
  );
}
