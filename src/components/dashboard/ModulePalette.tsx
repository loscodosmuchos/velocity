import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { DashboardModule } from "../../types/dashboard";

interface ModulePaletteProps {
  modules: DashboardModule[];
  isLoading: boolean;
  onAddModule: (module: DashboardModule) => void;
}

export function ModulePalette({ modules, isLoading, onAddModule }: ModulePaletteProps) {
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Box;
    return Icon;
  };

  const groupedModules = modules.reduce((acc, module) => {
    const category = module.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {} as Record<string, DashboardModule[]>);

  const categoryNames: Record<string, string> = {
    recruitment: "Recruitment",
    procurement: "Procurement & Vendors",
    project_mgmt: "Project Management",
    it_systems: "IT & Systems",
    vms: "VMS & Contractors",
    finance: "Finance",
    productivity: "Productivity",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading modules...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {Object.entries(groupedModules).map(([category, categoryModules]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/80">
              {categoryNames[category] || category}
            </h3>
            
            <div className="space-y-2">
              {categoryModules.map((module) => {
                const Icon = getIcon(module.icon || "Box");
                
                return (
                  <Card 
                    key={module.id} 
                    className="p-3 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium truncate">
                            {module.name}
                          </h4>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {module.type}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {module.defaultSize?.w || 4}×{module.defaultSize?.h || 4} grid
                          </span>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAddModule(module)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
