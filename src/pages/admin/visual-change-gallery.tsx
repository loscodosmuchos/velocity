import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Camera, RefreshCw, Grid, List } from "lucide-react";
import { toast } from "sonner";

interface Screenshot {
  id: number;
  page_path: string;
  screenshot_hash: string;
  captured_at: string;
  is_current: boolean;
  description: string;
  dimensions: { width: number; height: number };
  git_commit: string;
}

interface VisualChange {
  id: number;
  page_path: string;
  change_type: string;
  severity: string;
  description: string;
  detected_at: string;
  resolved: boolean;
}

const severityColors = {
  critical: "bg-red-900/30 border-red-500 text-red-400",
  high: "bg-orange-900/30 border-orange-500 text-orange-400",
  medium: "bg-yellow-900/30 border-yellow-500 text-yellow-400",
  low: "bg-blue-900/30 border-blue-500 text-blue-400",
};

export function VisualChangeGallery() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [changes, setChanges] = useState<VisualChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadScreenshots();
    loadChanges();
  }, []);

  const loadScreenshots = async () => {
    try {
      const response = await fetch("/api/page-screenshots", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setScreenshots(data);
      }
    } catch (error) {
      console.error("Error loading screenshots:", error);
      toast.error("Failed to load screenshots");
    } finally {
      setLoading(false);
    }
  };

  const loadChanges = async () => {
    try {
      const response = await fetch("/api/visual-changes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChanges(data);
      }
    } catch (error) {
      console.error("Error loading changes:", error);
    }
  };

  const triggerCapture = async () => {
    try {
      const response = await fetch("/api/capture-screenshots", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success("Screenshot capture started");
        setTimeout(() => loadScreenshots(), 3000);
      }
    } catch (error) {
      toast.error("Failed to trigger capture");
    }
  };

  const groupedScreenshots = screenshots.reduce((acc, ss) => {
    if (!acc[ss.page_path]) acc[ss.page_path] = [];
    acc[ss.page_path].push(ss);
    return acc;
  }, {} as Record<string, Screenshot[]>);

  const unresolved = changes.filter(c => !c.resolved);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎨 Visual Change Gallery</h1>
          <p className="text-slate-400 mt-2">Screenshot tracking and visual regression detection</p>
        </div>
        <Button onClick={triggerCapture} className="gap-2">
          <Camera className="h-4 w-4" />
          Capture All Pages
        </Button>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="gallery">Gallery ({screenshots.length})</TabsTrigger>
          <TabsTrigger value="changes">Changes ({unresolved.length})</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className="gap-1"
            >
              <Grid className="h-3 w-3" />
              Grid
            </Button>
            <Button 
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="gap-1"
            >
              <List className="h-3 w-3" />
              List
            </Button>
          </div>

          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedScreenshots).map(([pagePath, pageScreenshots]) => {
                const current = pageScreenshots.find(s => s.is_current);
                const changeCount = changes.filter(c => c.page_path === pagePath && !c.resolved).length;
                
                return (
                  <Card 
                    key={pagePath}
                    className="bg-slate-900 border-slate-700 cursor-pointer hover:border-cyan-500 transition"
                    onClick={() => setSelectedPage(pagePath)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{pagePath}</CardTitle>
                      <CardDescription className="text-xs">
                        {pageScreenshots.length} versions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="bg-slate-800 rounded h-32 flex items-center justify-center text-slate-400 text-xs">
                        Screenshot Preview
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">
                          Last: {current ? new Date(current.captured_at).toLocaleDateString() : "Never"}
                        </span>
                        {changeCount > 0 && (
                          <Badge className="bg-yellow-900 text-yellow-400">
                            {changeCount} changes
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {Object.entries(groupedScreenshots).map(([pagePath, pageScreenshots]) => {
                const current = pageScreenshots.find(s => s.is_current);
                const changeCount = changes.filter(c => c.page_path === pagePath && !c.resolved).length;
                
                return (
                  <Card key={pagePath} className="bg-slate-900 border-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-mono text-sm text-cyan-400">{pagePath}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {pageScreenshots.length} versions • Last: {current ? new Date(current.captured_at).toLocaleDateString() : "Never"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {changeCount > 0 && (
                            <Badge className="bg-yellow-900 text-yellow-400">
                              {changeCount} changes
                            </Badge>
                          )}
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Changes Tab */}
        <TabsContent value="changes" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Detected Visual Changes</h2>
          
          {unresolved.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                ✅ No visual changes detected
              </CardContent>
            </Card>
          ) : (
            unresolved.map((change) => (
              <Card key={change.id} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{change.page_path}</CardTitle>
                      <CardDescription>{change.description}</CardDescription>
                    </div>
                    <Badge className={severityColors[change.severity as keyof typeof severityColors]}>
                      {change.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{change.change_type}</span>
                    <span>{new Date(change.detected_at).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Screenshot Coverage</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-emerald-400 mb-1">
                  {Object.keys(groupedScreenshots).length}
                </p>
                <p className="text-sm text-slate-400">Pages Tracked</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-cyan-400 mb-1">
                  {screenshots.filter(s => s.is_current).length}
                </p>
                <p className="text-sm text-slate-400">Current Versions</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-yellow-400 mb-1">
                  {unresolved.length}
                </p>
                <p className="text-sm text-slate-400">Unresolved Changes</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Coverage Status by Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                <span className="text-sm">Critical Pages</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                <span className="text-sm">High Priority</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded">
                <span className="text-sm">Medium Priority</span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
