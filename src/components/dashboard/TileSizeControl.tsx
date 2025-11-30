import { Button } from "@/components/ui/button";
import { LayoutGrid, Maximize2, Square } from "lucide-react";
import type { LayoutItem } from "../../types/dashboard";
import { cn } from "@/lib/utils";

interface TileSizeControlProps {
  itemId: string;
  currentSize: { w: number; h: number };
  onResize: (itemId: string, size: { w: number; h: number }) => void;
}

export function TileSizeControl({
  itemId,
  currentSize,
  onResize,
}: TileSizeControlProps) {
  const presets = [
    { name: "Small", w: 3, h: 2, icon: LayoutGrid },
    { name: "Medium", w: 6, h: 3, icon: Square },
    { name: "Large", w: 12, h: 4, icon: Maximize2 },
  ];

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {presets.map((preset) => {
        const Icon = preset.icon;
        const isActive = currentSize.w === preset.w && currentSize.h === preset.h;
        
        return (
          <Button
            key={preset.name}
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "h-6 px-2 text-[10px] font-medium",
              isActive && "bg-primary text-primary-foreground"
            )}
            onClick={() => onResize(itemId, { w: preset.w, h: preset.h })}
            title={`Set to ${preset.name}`}
          >
            <Icon className="h-3 w-3" />
          </Button>
        );
      })}
    </div>
  );
}
