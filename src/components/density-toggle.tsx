import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Maximize2, Minimize2, LayoutGrid } from "lucide-react";

type DensityMode = "comfortable" | "compact" | "ultra";

const densityConfig: Record<DensityMode, { label: string; description: string; icon: React.ReactNode }> = {
  comfortable: {
    label: "Comfortable",
    description: "Default spacing, easy scanning",
    icon: <Maximize2 className="h-4 w-4" />,
  },
  compact: {
    label: "Compact",
    description: "Higher data density",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  ultra: {
    label: "Ultra-Compact",
    description: "Maximum information density",
    icon: <Minimize2 className="h-4 w-4" />,
  },
};

export function DensityToggle() {
  const [density, setDensity] = useState<DensityMode>(() => {
    const saved = localStorage.getItem("velocity-density");
    return (saved as DensityMode) || "comfortable";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("density-compact", "density-ultra");
    
    if (density === "compact") {
      root.classList.add("density-compact");
    } else if (density === "ultra") {
      root.classList.add("density-ultra");
    }
    
    localStorage.setItem("velocity-density", density);
  }, [density]);

  const currentConfig = densityConfig[density];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          {currentConfig.icon}
          <span className="hidden sm:inline text-xs">{currentConfig.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Display Density</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as DensityMode)}>
          {(Object.keys(densityConfig) as DensityMode[]).map((mode) => (
            <DropdownMenuRadioItem key={mode} value={mode} className="flex items-start gap-2 py-2">
              <div className="flex flex-col">
                <span className="font-medium">{densityConfig[mode].label}</span>
                <span className="text-xs text-muted-foreground">{densityConfig[mode].description}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
