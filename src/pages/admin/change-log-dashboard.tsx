import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Clock, FileText, Zap, Download } from "lucide-react";
import { toast } from "sonner";

interface Change {
  id: number;
  title: string;
  description: string;
  component_path: string;
  file_path: string;
  change_type: string;
  status: string;
  test_location: string;
  test_plan: string;
  priority: string;
  created_at: string;
  tested_at?: string;
  tested_by?: string;
  notes?: string;
}

interface PageInsight {
  id: number;
  page_path: string;
  insight_type: string;
  insight_text: string;
  severity: string;
  created_at: string;
}

const priorityColors = {
  critical: "bg-red-900/30 border-red-500 text-red-400",
  high: "bg-orange-900/30 border-orange-500 text-orange-400",
  medium: "bg-yellow-900/30 border-yellow-500 text-yellow-400",
  low: "bg-blue-900/30 border-blue-500 text-blue-400",
};

const statusColors = {
  pending: "bg-slate-900 text-slate-300",
  testing: "bg-amber-900 text-amber-400",
  tested: "bg-emerald-900 text-emerald-400",
  deployed: "bg-cyan-900 text-cyan-400",
};

export function ChangeLogDashboard() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [insights, setInsights] = useState<PageInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadChanges();
    loadInsights();
  }, []);

  const loadChanges = async () => {
    try {
      const response = await fetch("/api/change-log", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChanges(data);
      }
    } catch (error) {
      console.error("Error loading changes:", error);
      toast.error("Failed to load change log");
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const response = await fetch("/api/page-insights", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error("Error loading insights:", error);
    }
  };

  const updateChangeStatus = async (changeId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/change-log/${changeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`);
        loadChanges();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const generateTestPlan = (change: Change) => {
    const plan = `
TEST PLAN: ${change.title}
Priority: ${change.priority.toUpperCase()}
Type: ${change.change_type}

DESCRIPTION:
${change.description}

FILE: ${change.file_path}
COMPONENT: ${change.component_path}

TEST LOCATION:
${change.test_location}

STEPS:
${change.test_plan}

EXPECTED RESULTS:
- Changes are visible
- No console errors
- Functionality works as described
- Performance is acceptable

VERIFICATION:
[ ] Test passed
[ ] Test failed
[ ] Test blocked

NOTES:
${change.notes || "Add test findings here"}
    `.trim();
    
    // Copy to clipboard
    navigator.clipboard.writeText(plan);
    toast.success("Test plan copied to clipboard");
  };

  const downloadChangesSummary = () => {
    const summary = changes.map(c => 
      `${c.title} [${c.priority}] - ${c.status} - Test at: ${c.test_location}`
    ).join("\n");
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(summary));
    element.setAttribute("download", `changes-summary-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Changes summary downloaded");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">📋 Change Log Dashboard</h1>
        <p className="text-slate-400 mt-2">Track changes, test locations, and test plans sequentially</p>
      </div>

      <Tabs defaultValue="changes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="changes">Changes ({changes.length})</TabsTrigger>
          <TabsTrigger value="insights">Insights ({insights.length})</TabsTrigger>
          <TabsTrigger value="testing">Testing Status</TabsTrigger>
        </TabsList>

        {/* Changes Tab */}
        <TabsContent value="changes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Changes</h2>
            <Button onClick={downloadChangesSummary} className="gap-2">
              <Download className="h-4 w-4" />
              Download Summary
            </Button>
          </div>

          {changes.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                No changes recorded yet
              </CardContent>
            </Card>
          ) : (
            changes.map((change) => (
              <Card key={change.id} className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{change.title}</CardTitle>
                        <Badge className={priorityColors[change.priority as keyof typeof priorityColors]}>
                          {change.priority}
                        </Badge>
                        <Badge className={statusColors[change.status as keyof typeof statusColors]}>
                          {change.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-300">{change.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">File</label>
                      <p className="text-sm font-mono text-cyan-400">{change.file_path}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Test Location</label>
                      <p className="text-sm font-mono text-emerald-400">{change.test_location}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Test Plan</label>
                    <p className="text-sm bg-slate-950 p-3 rounded border border-slate-700 text-slate-300">
                      {change.test_plan}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {change.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateChangeStatus(change.id, "testing")}
                        >
                          Start Testing
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => generateTestPlan(change)}
                          className="gap-1"
                        >
                          <FileText className="h-3 w-3" />
                          Copy Test Plan
                        </Button>
                      </>
                    )}
                    {change.status === "testing" && (
                      <Button 
                        size="sm"
                        onClick={() => updateChangeStatus(change.id, "tested")}
                        className="gap-1 bg-emerald-900 hover:bg-emerald-800"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Mark Tested
                      </Button>
                    )}
                    {change.tested_at && (
                      <p className="text-xs text-slate-400">
                        Tested by {change.tested_by} on {new Date(change.tested_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Page Issues & Insights</h2>
          
          {insights.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                No insights recorded yet
              </CardContent>
            </Card>
          ) : (
            insights.map((insight) => (
              <Card key={insight.id} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {insight.severity === "critical" && <AlertCircle className="h-5 w-5 text-red-400" />}
                    {insight.severity === "high" && <AlertCircle className="h-5 w-5 text-orange-400" />}
                    <CardTitle className="text-base">{insight.page_path}</CardTitle>
                    <Badge variant="outline">{insight.insight_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">{insight.insight_text}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(insight.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Testing Status Tab */}
        <TabsContent value="testing" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Testing Progress</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(statusColors).map(([status]) => {
              const count = changes.filter(c => c.status === status).length;
              return (
                <Card key={status} className="bg-slate-900 border-slate-700">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{count}</div>
                    <p className="text-sm text-slate-400 capitalize">{status}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Testing Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {changes.filter(c => c.status === "pending" || c.status === "testing").map((change) => (
                <div key={change.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{change.title}</p>
                    <p className="text-xs text-slate-400">Test: {change.test_location}</p>
                  </div>
                  <Badge className={priorityColors[change.priority as keyof typeof priorityColors]}>
                    {change.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
