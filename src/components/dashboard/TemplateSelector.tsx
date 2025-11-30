import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LayoutTemplate, Play, Loader2 } from "lucide-react";
import type { DashboardTemplate, UserDashboardLayout } from "../../types/dashboard";

interface TemplateSelectorProps {
  templates: DashboardTemplate[];
  savedLayouts: UserDashboardLayout[];
  onApplyTemplate: (templateId: number) => void;
  onLoadLayout: (layout: UserDashboardLayout) => void;
  isApplying: boolean;
}

export function TemplateSelector({
  templates,
  savedLayouts,
  onApplyTemplate,
  onLoadLayout,
  isApplying,
}: TemplateSelectorProps) {
  const roleNames: Record<string, string> = {
    recruiter: "Recruiter",
    executive: "Executive",
    vendor_manager: "Vendor Manager",
    cpo: "CPO",
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground/80">
            System Templates
          </h3>
          
          <div className="space-y-2">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-4 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                    <LayoutTemplate className="w-5 h-5 text-accent" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-medium">
                          {template.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {roleNames[template.role || ""] || template.role || "General"}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full"
                      onClick={() => template.id && onApplyTemplate(template.id)}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-2" />
                          Apply Template
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {savedLayouts.length > 0 && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/80">
                Your Saved Layouts
              </h3>
              
              <div className="space-y-2">
                {savedLayouts.map((layout) => (
                  <Card
                    key={layout.id}
                    className="p-4 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {layout.name}
                        </h4>
                        {layout.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {layout.layout?.length || 0} widgets
                        </span>
                        <span>•</span>
                        <span>
                          Updated {layout.updatedAt ? new Date(layout.updatedAt).toLocaleDateString() : "Unknown"}
                        </span>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onLoadLayout(layout)}
                      >
                        <Play className="w-3 h-3 mr-2" />
                        Load Layout
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
