import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LUXURY_THEMES, loadSavedTheme, applyTheme, type LuxuryTheme } from "@/themes/luxury-themes";

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<LuxuryTheme>(loadSavedTheme());

  useEffect(() => {
    // Apply saved theme on mount
    applyTheme(currentTheme);
  }, []);

  const handleThemeChange = (theme: LuxuryTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    
    // Force page reload to apply new styles
    window.location.reload();
  };

  // Group themes by category
  const themesByCategory = LUXURY_THEMES.reduce((acc, theme) => {
    if (!acc[theme.category]) {
      acc[theme.category] = [];
    }
    acc[theme.category].push(theme);
    return acc;
  }, {} as Record<string, LuxuryTheme[]>);

  const categoryLabels = {
    classic: 'Classic',
    modern: 'Modern',
    luxury: 'Luxury',
    futuristic: 'Futuristic'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            "hover:bg-slate-700/40",
            "transition-colors"
          )}
          title={`Current: ${currentTheme.name}`}
        >
          <Palette className="h-4 w-4 text-purple-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          Luxury Themes
          <div className="text-xs font-normal text-muted-foreground">
            {currentTheme.name}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(themesByCategory).map(([category, themes]) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </DropdownMenuLabel>
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                className={cn(
                  "cursor-pointer",
                  theme.id === currentTheme.id && "bg-accent"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <div 
                    className="w-4 h-4 rounded-sm border border-slate-600"
                    style={{ backgroundColor: theme.cssVariables.accentPrimary }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {theme.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
