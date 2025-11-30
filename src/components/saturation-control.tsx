import { useSaturation } from "@/contexts/SaturationContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

export function SaturationControl() {
  const { saturation, setSaturation, resetSaturation } = useSaturation();

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-600/30">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Color Saturation: {Math.round(saturation * 100)}%
        </label>
        <Slider
          value={[saturation]}
          onValueChange={(value) => setSaturation(value[0])}
          min={0.2}
          max={1}
          step={0.05}
          className="w-full"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetSaturation}
        className="text-slate-400 hover:text-slate-300"
        title="Reset to default saturation"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
