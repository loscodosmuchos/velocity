import { Responsive, WidthProvider } from "react-grid-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DashboardWidget } from "./DashboardWidget";
import type { LayoutItem, DashboardModule } from "@shared/schema";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  layout: LayoutItem[];
  modules: DashboardModule[];
  activeModules: Map<string, number>;
  onLayoutChange: (layout: LayoutItem[]) => void;
  onRemoveModule: (itemId: string) => void;
}

export function GridLayout({
  layout,
  modules,
  activeModules,
  onLayoutChange,
  onRemoveModule,
}: GridLayoutProps) {
  const handleLayoutChange = (newLayout: any[]) => {
    const updatedLayout: LayoutItem[] = newLayout.map((item) => {
      // Preserve moduleId from existing layout item, don't rely on activeModules map
      const existingItem = layout.find(l => l.i === item.i);
      return {
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        moduleId: existingItem?.moduleId || null,
      };
    });
    onLayoutChange(updatedLayout);
  };

  const getModuleById = (moduleId: number | null | undefined): DashboardModule | undefined => {
    if (!moduleId) return undefined;
    return modules.find(m => m.id === moduleId);
  };

  if (layout.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-lg text-muted-foreground">
            Your dashboard is empty
          </p>
          <p className="text-sm text-muted-foreground">
            Add modules from the palette or apply a template to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        preventCollision={false}
      >
        {layout.map((item) => {
          const module = getModuleById(item.moduleId);
          
          return (
            <div key={item.i} data-grid={item}>
              <Card className="h-full flex flex-col overflow-hidden group border-2 shadow-md bg-gradient-to-br from-card via-card to-primary/5">
                {/* Widget Header */}
                <div className="drag-handle flex items-center justify-between px-3 py-2 border-b-2 cursor-move bg-primary/10">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <span className="font-semibold text-sm truncate text-foreground">
                      {module?.name || "Unknown Module"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveModule(item.i)}
                    data-testid={`button-remove-${item.i}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Widget Content */}
                <div className="flex-1 overflow-auto p-3">
                  <DashboardWidget module={module} />
                </div>
              </Card>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
