import { useState, useEffect } from "react";
import { useBatches } from "@/hooks/useBatches";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BeakerIcon,
  PlayCircle,
  Search,
  Plus,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

/**
 * AI QA Lab - Batch Quality Assurance Testing
 * 
 * User Personas Served:
 * - CPO: Validate contract analysis accuracy
 * - Finance Controller: Test invoice/budget validation
 * - VMS Director: Verify compliance detection
 * - Legal Counsel: Audit risk flagging accuracy
 * 
 * Three-Phase Philosophy:
 * 1. Get It In Cleanly: Template-based batch creation with clear configs
 * 2. Process Reliably: Parallel processing with progress tracking
 * 3. Output Beautifully: Executive reports with actionable insights
 */

interface BatchTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultConfig: {
    itemCount: number;
    lenses: string[];
    analysisDepth: "quick" | "standard" | "comprehensive";
  };
  roiMetric: string;
}

const BATCH_TEMPLATES: BatchTemplate[] = [
  {
    id: "contract-analysis",
    name: "Contract Analysis Validation",
    type: "contract-analysis",
    description: "Validate AI contract gap detection against intentional deficiency patterns",
    icon: FileText,
    defaultConfig: {
      itemCount: 5,
      lenses: ["legal", "financial", "technical", "risk"],
      analysisDepth: "comprehensive",
    },
    roiMetric: "97% reduction in manual review time (70 min → 2 min)",
  },
  {
    id: "invoice-validation",
    name: "Invoice Validation Testing",
    type: "invoice-validation",
    description: "Test budget variance detection, PO matching accuracy, and duplicate detection",
    icon: TrendingUp,
    defaultConfig: {
      itemCount: 10,
      lenses: ["financial", "technical"],
      analysisDepth: "standard",
    },
    roiMetric: "Pre-payment error detection prevents $50K-$200K annual losses",
  },
  {
    id: "compliance-check",
    name: "Compliance Gap Detection",
    type: "compliance-check",
    description: "Verify missing certification detection, document verification accuracy",
    icon: AlertTriangle,
    defaultConfig: {
      itemCount: 8,
      lenses: ["legal", "risk"],
      analysisDepth: "comprehensive",
    },
    roiMetric: "Prevents $100K-$500K in compliance penalties",
  },
  {
    id: "budget-analysis",
    name: "Budget Alert Validation",
    type: "budget-analysis",
    description: "Test 25%/50%/90% threshold accuracy, spending prediction reliability",
    icon: Zap,
    defaultConfig: {
      itemCount: 5,
      lenses: ["financial", "technical"],
      analysisDepth: "quick",
    },
    roiMetric: "3-month early detection prevents emergency procurement (30-50% premium)",
  },
];

export default function AiQaLabPage() {
  const { batches, loading, error, fetchBatches, createBatch, runBatch } = useBatches();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<BatchTemplate | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [itemCount, setItemCount] = useState(5);
  const [selectedLenses, setSelectedLenses] = useState<string[]>([]);
  const [analysisDepth, setAnalysisDepth] = useState<"quick" | "standard" | "comprehensive">("standard");

  // Poll for updates on running batches
  useEffect(() => {
    const interval = setInterval(() => {
      const hasRunningBatches = batches.some(b => b.status === 'running');
      if (hasRunningBatches) {
        fetchBatches();
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [batches]);

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.batchType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBatch = (template: BatchTemplate) => {
    setSelectedTemplate(template);
    setBatchName(`${template.name} - ${new Date().toLocaleDateString()}`);
    setItemCount(template.defaultConfig.itemCount);
    setSelectedLenses(template.defaultConfig.lenses);
    setAnalysisDepth(template.defaultConfig.analysisDepth);
    setShowCreateDialog(true);
  };

  const handleSubmitBatch = async () => {
    if (!selectedTemplate) return;

    setCreating(true);
    try {
      // Generate items config based on template
      const items = Array.from({ length: itemCount }, (_, i) => ({
        lenses: selectedLenses,
        analysisDepth,
        itemOrder: i + 1,
      }));

      // Create batch
      const newBatch = await createBatch({
        batchName,
        batchType: selectedTemplate.type,
        description: selectedTemplate.description,
        config: {
          lenses: selectedLenses,
          analysisDepth,
          template: selectedTemplate.id,
        },
        items,
      });

      // Auto-run the batch
      await runBatch(newBatch.id, { maxParallel: 5 });

      // Close dialog and reset
      setShowCreateDialog(false);
      setSelectedTemplate(null);
    } catch (err: any) {
      console.error('Failed to create/run batch:', err);
      alert(err.message || 'Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  const toggleLens = (lens: string) => {
    setSelectedLenses(prev =>
      prev.includes(lens) ? prev.filter(l => l !== lens) : [...prev, lens]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "running":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Calculate insights from real data
  const completedBatches = batches.filter(b => b.status === 'completed');
  const avgSuccessRate = completedBatches.length > 0
    ? completedBatches.reduce((sum, b) => sum + b.successRate, 0) / completedBatches.length
    : 0;
  const totalItemsAnalyzed = batches.reduce((sum, b) => sum + b.totalItems, 0);
  const totalCompleted = batches.reduce((sum, b) => sum + b.completedItems, 0);
  const totalInProgress = batches.reduce((sum, b) => sum + (b.status === 'running' ? b.totalItems - b.completedItems : 0), 0);

  if (loading && batches.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading AI QA Lab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BeakerIcon className="h-8 w-8" />
          AI QA Lab
        </h1>
        <p className="text-muted-foreground mt-2">
          Systematic quality assurance testing for AI-powered analysis features
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Batch Templates</TabsTrigger>
          <TabsTrigger value="history">Batch History</TabsTrigger>
          <TabsTrigger value="insights">QA Insights</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BATCH_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">{template.type}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{template.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Items:</span>
                        <span className="font-medium">{template.defaultConfig.itemCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Lenses:</span>
                        <span className="font-medium">{template.defaultConfig.lenses.length} perspectives</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Depth:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {template.defaultConfig.analysisDepth}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-xs text-muted-foreground mb-2">Expected ROI:</div>
                      <div className="text-xs font-medium text-green-600">{template.roiMetric}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Config
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCreateBatch(template)}>
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Create Batch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Configuration</CardTitle>
              <CardDescription>Build custom batch with specific test parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Batch
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batches by name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredBatches.map((batch) => (
              <Card key={batch.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(batch.status)}
                        <h3 className="font-semibold">{batch.batchName}</h3>
                        <Badge variant={getStatusColor(batch.status)} className="text-xs capitalize">
                          {batch.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>Type: {batch.batchType}</span>
                        <span>•</span>
                        <span>
                          Items: {batch.completedItems}/{batch.totalItems}
                        </span>
                        <span>•</span>
                        <span>
                          Started: {new Date(batch.createdAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Progress</span>
                          <span className="font-medium">
                            {batch.status === "completed"
                              ? "100%"
                              : `${Math.round((batch.completedItems / batch.totalItems) * 100)}%`}
                          </span>
                        </div>
                        <Progress
                          value={batch.status === "completed" ? 100 : (batch.completedItems / batch.totalItems) * 100}
                        />
                      </div>

                      {batch.status === "completed" && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Success Rate
                            </span>
                            <span className="text-lg font-bold text-green-700 dark:text-green-400">
                              {batch.successRate}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      {batch.status === "completed" && (
                        <Button variant="default" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBatches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No batches match your search criteria</p>
            </div>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Batches Run</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{batches.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {avgSuccessRate > 0 ? `${avgSuccessRate.toFixed(1)}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Detection accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Items Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalItemsAnalyzed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCompleted} completed{totalInProgress > 0 ? `, ${totalInProgress} in progress` : ''}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Lens</CardTitle>
              <CardDescription>Analysis accuracy across different perspectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { lens: "Legal", accuracy: 98.5, issues: 12, color: "bg-blue-500" },
                  { lens: "Financial", accuracy: 97.2, issues: 8, color: "bg-green-500" },
                  { lens: "Technical", accuracy: 95.8, issues: 5, color: "bg-purple-500" },
                  { lens: "Risk", accuracy: 96.3, issues: 9, color: "bg-orange-500" },
                ].map((lens) => (
                  <div key={lens.lens} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{lens.lens}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">{lens.issues} issues detected</span>
                        <span className="font-semibold">{lens.accuracy}%</span>
                      </div>
                    </div>
                    <Progress value={lens.accuracy} className={lens.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Batch Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Configure and launch batch quality assurance testing
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Batch Name</label>
                <Input
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder={`${selectedTemplate.name} - ${new Date().toLocaleDateString()}`}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Number of Test Items</label>
                <Input
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
                  min={1}
                  max={20}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Depth</label>
                <div className="flex gap-2 mt-1">
                  {(["quick", "standard", "comprehensive"] as const).map((depth) => (
                    <Button
                      key={depth}
                      variant={analysisDepth === depth ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAnalysisDepth(depth)}
                      className="capitalize">
                      {depth}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Analysis Lenses</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["legal", "financial", "technical", "risk"].map((lens) => (
                    <Badge
                      key={lens}
                      variant={selectedLenses.includes(lens) ? "default" : "outline"}
                      className="capitalize cursor-pointer"
                      onClick={() => toggleLens(lens)}>
                      {lens}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowCreateDialog(false)}
                  disabled={creating}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmitBatch}
                  disabled={creating || !batchName || selectedLenses.length === 0}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {creating ? 'Creating...' : 'Launch Batch'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
