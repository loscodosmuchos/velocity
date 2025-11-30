import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GridLayout } from "@/components/dashboard/GridLayout";
import { ModulePalette } from "@/components/dashboard/ModulePalette";
import { TemplateSelector } from "@/components/dashboard/TemplateSelector";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";
import { SaveLayoutDialog } from "@/components/dashboard/SaveLayoutDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DashboardModule, LayoutItem, UserDashboardLayout, DashboardTemplate } from "@shared/schema";
import { Save, LayoutTemplate, Palette } from "lucide-react";

export default function DashboardBuilder() {
  const { toast } = useToast();
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [activeModules, setActiveModules] = useState<Map<string, number>>(new Map());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number | undefined>();
  const [currentLayoutId, setCurrentLayoutId] = useState<number | undefined>();

  // Fetch available modules
  const { data: modules = [], isLoading: modulesLoading } = useQuery<DashboardModule[]>({
    queryKey: ['/api/dashboard/modules'],
  });

  // Fetch user's saved layouts
  const { data: savedLayouts = [] } = useQuery<UserDashboardLayout[]>({
    queryKey: ['/api/dashboard/layouts'],
  });

  // Fetch templates
  const { data: templates = [] } = useQuery<DashboardTemplate[]>({
    queryKey: ['/api/dashboard/templates'],
  });

  // Apply template mutation
  const applyTemplate = useMutation<UserDashboardLayout, Error, number>({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest("POST", `/api/dashboard/templates/apply`, {
        templateId,
      });
      return await response.json();
    },
    onSuccess: (newLayout: UserDashboardLayout) => {
      if (newLayout.layout) {
        setLayout(newLayout.layout);
        setCurrentLayoutId(newLayout.id);
        
        // Build active modules map
        const modulesMap = new Map<string, number>();
        newLayout.layout.forEach(item => {
          if (item.moduleId) {
            modulesMap.set(item.i, item.moduleId);
          }
        });
        setActiveModules(modulesMap);
      }
      
      if (newLayout.themeId) {
        setSelectedThemeId(newLayout.themeId);
      }
      
      toast({
        title: "Template Applied",
        description: "Dashboard template has been applied successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/layouts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to apply template",
        variant: "destructive",
      });
    },
  });

  // Save layout mutation
  const saveLayout = useMutation<UserDashboardLayout, Error, { name: string; isDefault: boolean }>({
    mutationFn: async (data: { name: string; isDefault: boolean }) => {
      const response = await apiRequest("POST", `/api/dashboard/layouts`, {
        name: data.name,
        layout,
        isDefault: data.isDefault,
        themeId: selectedThemeId,
      });
      return await response.json();
    },
    onSuccess: (savedLayout: UserDashboardLayout) => {
      setCurrentLayoutId(savedLayout.id);
      toast({
        title: "Layout Saved",
        description: "Your dashboard layout has been saved successfully.",
      });
      setShowSaveDialog(false);
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/layouts'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save layout",
        variant: "destructive",
      });
    },
  });

  const handleAddModule = (module: DashboardModule) => {
    const newItemId = `module-${Date.now()}`;
    
    const defaultSize = module.defaultSize || { w: 4, h: 4, minW: 2, minH: 2 };
    
    const newItem: LayoutItem = {
      i: newItemId,
      x: 0,
      y: Infinity, // Place at bottom
      w: defaultSize.w,
      h: defaultSize.h,
      minW: defaultSize.minW,
      minH: defaultSize.minH,
      moduleId: module.id || null,
    };

    setLayout([...layout, newItem]);
    setActiveModules(new Map(activeModules).set(newItemId, module.id!));

    toast({
      title: "Module Added",
      description: `${module.name} has been added to your dashboard.`,
    });
  };

  const handleRemoveModule = (itemId: string) => {
    setLayout(layout.filter(item => item.i !== itemId));
    const newModules = new Map(activeModules);
    newModules.delete(itemId);
    setActiveModules(newModules);
  };

  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    // Preserve moduleId in layout items
    const updatedLayout = newLayout.map(item => {
      const existing = layout.find(l => l.i === item.i);
      return {
        ...item,
        moduleId: existing?.moduleId || activeModules.get(item.i),
      };
    });
    setLayout(updatedLayout);
  };

  const handleLoadLayout = (savedLayout: UserDashboardLayout) => {
    if (savedLayout.layout) {
      setLayout(savedLayout.layout);
      setCurrentLayoutId(savedLayout.id);
      
      // Rebuild active modules map
      const modulesMap = new Map<string, number>();
      savedLayout.layout.forEach(item => {
        if (item.moduleId) {
          modulesMap.set(item.i, item.moduleId);
        }
      });
      setActiveModules(modulesMap);
      
      if (savedLayout.themeId) {
        setSelectedThemeId(savedLayout.themeId);
      }

      toast({
        title: "Layout Loaded",
        description: `${savedLayout.name} layout has been loaded.`,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold">Dashboard Builder</h1>
            <p className="text-xs text-muted-foreground">
              Design your recruitment analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSelector 
            selectedThemeId={selectedThemeId}
            onThemeChange={setSelectedThemeId}
            currentLayoutId={currentLayoutId}
          />
          <Button 
            onClick={() => setShowSaveDialog(true)}
            disabled={layout.length === 0}
            data-testid="button-save-layout"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r flex flex-col overflow-hidden bg-card shadow-sm">
          <Tabs defaultValue="modules" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b px-4 h-10 bg-muted/50">
              <TabsTrigger value="modules" data-testid="tab-modules" className="gap-1.5 text-sm">
                <Palette className="w-4 h-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="templates" data-testid="tab-templates" className="gap-1.5 text-sm">
                <LayoutTemplate className="w-4 h-4" />
                Templates
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="flex-1 overflow-hidden m-0">
              <ModulePalette 
                modules={modules}
                isLoading={modulesLoading}
                onAddModule={handleAddModule}
              />
            </TabsContent>
            
            <TabsContent value="templates" className="flex-1 overflow-hidden m-0">
              <TemplateSelector
                templates={templates}
                savedLayouts={savedLayouts}
                onApplyTemplate={(templateId: number) => applyTemplate.mutate(templateId)}
                onLoadLayout={handleLoadLayout}
                isApplying={applyTemplate.isPending}
              />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Grid Canvas */}
        <main className="flex-1 overflow-auto p-4">
          {layout.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4 max-w-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                  <LayoutTemplate className="w-16 h-16 mx-auto text-primary relative" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Your canvas awaits</h3>
                  <p className="text-sm text-muted-foreground">
                    Add modules or apply a template to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <GridLayout
              layout={layout}
              modules={modules}
              activeModules={activeModules}
              onLayoutChange={handleLayoutChange}
              onRemoveModule={handleRemoveModule}
            />
          )}
        </main>
      </div>

      {/* Save Dialog */}
      <SaveLayoutDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={(name: string, isDefault: boolean) => saveLayout.mutate({ name, isDefault })}
        isSaving={saveLayout.isPending}
      />
    </div>
  );
}
