import { useState } from "react";
import { useList } from "@refinedev/core";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Shield,
  Sparkles,
  Clock,
  DollarSign,
  Download,
  ArrowRight,
  ChevronRight,
  ListChecks,
  Eye,
} from "lucide-react";
import type { PurchaseOrder, Timecard, Invoice, StatementOfWork } from "@/types";
import { analyzeContract, getRiskColor, getRiskVariant, type ContractAnalysisResult } from "@/utils/contract-analyzer";
import { generatePredictiveAlerts, getSeverityColor, type PredictiveAlert } from "@/utils/predictive-alerts";
import { getSampleContract, getAllSampleContracts } from "@/utils/sample-contracts";
import { getTestContract, getAllTestContracts } from "@/utils/test-contracts";
import { MultiLensAnalyzer } from "./multi-lens-analyzer";

export function AIInsightsPage() {
  const [analysisResult, setAnalysisResult] = useState<ContractAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [documentType, setDocumentType] = useState<"SOW" | "PO" | "Agreement">("SOW");
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [analysisMode, setAnalysisMode] = useState<"standard" | "multi-lens">("standard");

  // Fetch data for predictive alerts
  const { data: purchaseOrdersData } = useList<PurchaseOrder>({
    resource: "purchase_orders",
    pagination: { mode: "off" },
  });

  const { data: timecardsData } = useList<Timecard>({
    resource: "timecards",
    pagination: { mode: "off" },
  });

  const { data: invoicesData } = useList<Invoice>({
    resource: "invoices",
    pagination: { mode: "off" },
  });

  const { data: sowsData } = useList<StatementOfWork>({
    resource: "statements_of_work",
    pagination: { mode: "off" },
  });

  const purchaseOrders = purchaseOrdersData?.data || [];
  const timecards = timecardsData?.data || [];
  const invoices = invoicesData?.data || [];
  const sows = sowsData?.data || [];

  // Generate predictive alerts
  const predictiveAlerts = generatePredictiveAlerts({
    purchaseOrders,
    timecards,
    invoices,
    sows,
  });

  const topAlerts = predictiveAlerts.slice(0, 5);

  const handleAnalyzeContract = async () => {
    if (!documentContent.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeContract(documentContent, documentType);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setDocumentContent(text);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleKey: string) => {
    // Try test contracts first (for multi-lens)
    const testContracts = getAllTestContracts();
    const testContract = testContracts.find((c) => c.key === sampleKey);

    if (testContract) {
      setDocumentContent(testContract.content);
      setDocumentType(testContract.type);
      setSelectedSample(sampleKey);
      setAnalysisResult(null);
      return;
    }

    // Fall back to original sample contracts
    const sample = getSampleContract(sampleKey as any);
    if (sample) {
      setDocumentContent(sample.content);
      setDocumentType(sample.type);
      setSelectedSample(sampleKey);
      setAnalysisResult(null);
    }
  };

  const criticalCount = predictiveAlerts.filter((a) => a.severity === "Critical").length;
  const budgetAlertsCount = predictiveAlerts.filter((a) => a.type === "Budget Overrun").length;
  const timelineAlertsCount = predictiveAlerts.filter((a) => a.type === "Timeline Risk").length;

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)' }}>
      <div className="max-w-6xl mx-auto space-y-8">
      {/* Legendary Header */}
      <div className="space-y-4 border-b border-slate-700/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Intelligence Center
          </h1>
        </div>
        <p className="text-slate-300 text-lg">AI-powered predictive risks and contract intelligence</p>
      </div>

      <Tabs defaultValue="alerts" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-xs bg-slate-800/50 border border-slate-700/50 text-base">
          <TabsTrigger value="alerts">Predictive Alerts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Predictive Alerts Tab */}
        <TabsContent value="alerts" className="space-y-8">
          {/* Alert Stats - Compact Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="relative rounded-lg border border-slate-700/50 p-4" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total</p>
                  <p className="text-3xl font-bold text-white mt-2">{predictiveAlerts.length}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-slate-500" />
              </div>
            </div>

            <div className="relative rounded-lg border border-red-700/30 p-4" style={{ background: 'rgba(127, 29, 29, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-red-400 text-xs font-medium uppercase tracking-wider">Critical</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">{criticalCount}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>

            <div className="relative rounded-lg border border-amber-700/30 p-4" style={{ background: 'rgba(120, 53, 15, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">Budget</p>
                  <p className="text-3xl font-bold text-amber-400 mt-2">{budgetAlertsCount}</p>
                </div>
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            <div className="relative rounded-lg border border-cyan-700/30 p-4" style={{ background: 'rgba(6, 78, 100, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cyan-400 text-xs font-medium uppercase tracking-wider">Timeline</p>
                  <p className="text-3xl font-bold text-cyan-400 mt-2">{timelineAlertsCount}</p>
                </div>
                <Clock className="h-5 w-5 text-cyan-500" />
              </div>
            </div>
          </div>

          {/* Top AI-Generated Risks - Legendary Style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Top Risks
              </h3>
              <span className="text-xs text-slate-500">Ranked by impact</span>
            </div>

            {topAlerts.length === 0 ? (
              <div className="rounded-lg border border-green-700/30 p-6 text-center" style={{ background: 'rgba(6, 78, 50, 0.1)' }}>
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 text-sm font-medium">No risks detected</p>
                <p className="text-slate-500 text-xs mt-1">All systems nominal</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topAlerts.map((alert) => {
                  const borderColor = alert.severity === "Critical" ? "border-red-700/50" : "border-amber-700/30";
                  const bgColor = alert.severity === "Critical" ? "rgba(127, 29, 29, 0.08)" : "rgba(120, 53, 15, 0.08)";
                  const severityColor = alert.severity === "Critical" ? "text-red-400" : "text-amber-400";
                  
                  return (
                    <div
                      key={alert.id}
                      className={`rounded-lg border ${borderColor} p-4 hover:border-opacity-100 transition-all cursor-pointer group`}
                      style={{ background: bgColor }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold uppercase tracking-wider ${severityColor}`}>
                              {alert.severity}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-400">{alert.confidence}% confidence</span>
                          </div>
                          <h4 className="font-semibold text-white text-sm mb-1">{alert.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{alert.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {alert.estimatedCost && (
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Impact</p>
                              <p className={`text-sm font-bold ${severityColor}`}>
                                ${new Intl.NumberFormat("en-US", { notation: "compact" }).format(alert.estimatedCost)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expandable Details */}
                      <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 hidden group-hover:block">
                        <div className="text-xs space-y-1">
                          <p className="text-slate-500"><span className="text-slate-400 font-medium">Impact:</span> {alert.predictedImpact}</p>
                          <p className="text-slate-500"><span className="text-slate-400 font-medium">Action:</span> {alert.recommendedAction}</p>
                        </div>
                        {(alert.entityType === "PurchaseOrder" || alert.entityType === "SOW" || alert.entityType === "Contractor") && (
                          <Link
                            to={
                              alert.entityType === "PurchaseOrder"
                                ? `/purchase-orders/show/${alert.entityId}`
                                : alert.entityType === "SOW"
                                ? `/statements-of-work/show/${alert.entityId}`
                                : `/contractors/show/${alert.entityId}`
                            }
                            className="inline-flex text-xs text-cyan-400 hover:text-cyan-300 font-medium gap-1 mt-2">
                            View details <ArrowRight className="h-5 w-5 text-cyan-400" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Contract Analysis Tab - Legendary */}
        <TabsContent value="analysis" className="space-y-8">
          {/* Quick Steps */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700/30 text-xs text-slate-400" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <ListChecks className="h-3 w-3 text-cyan-400 flex-shrink-0" />
            <span>Select • Upload • Analyze • Review</span>
          </div>

          {/* Mode & Upload - Two Column */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Mode Selection */}
            <div className="rounded-lg border border-slate-700/50 p-6" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              <h3 className="text-sm font-semibold text-white mb-4">Analysis Type</h3>
              <div className="space-y-2">
                <Button
                  variant={analysisMode === "standard" ? "default" : "outline"}
                  onClick={() => setAnalysisMode("standard")}
                  className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Standard
                </Button>
                <Button
                  variant={analysisMode === "multi-lens" ? "default" : "outline"}
                  onClick={() => setAnalysisMode("multi-lens")}
                  className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Multi-Lens
                </Button>
              </div>
            </div>

            {/* Right: Document Type & Sample */}
            <div className="rounded-lg border border-slate-700/50 p-6" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
              <h3 className="text-sm font-semibold text-white mb-4">Contract Type</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['SOW', 'PO', 'Agreement'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={documentType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDocumentType(type)}
                      className="flex-1">
                      {type}
                    </Button>
                  ))}
                </div>
                <Select value={selectedSample} onValueChange={handleLoadSample}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Demo contract..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOW-0005">SOW-0005 (High Risk)</SelectItem>
                    <SelectItem value="SOW-0012">SOW-0012 (Medium Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Analysis Mode Selector - Step 1 */}
          <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-slate-900/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">1</span>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    Select Analysis Type
                  </CardTitle>
                  <CardDescription>Choose between standard analysis or comprehensive multi-lens analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button
                variant={analysisMode === "standard" ? "default" : "outline"}
                onClick={() => setAnalysisMode("standard")}
                className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Standard Analysis
              </Button>
              <Button
                variant={analysisMode === "multi-lens" ? "default" : "outline"}
                onClick={() => setAnalysisMode("multi-lens")}
                className="flex-1 gap-2">
                <Sparkles className="h-4 w-4" />
                Multi-Lens Analysis (v2.0)
                <Badge variant="secondary" className="text-xs">
                  NEW
                </Badge>
              </Button>
            </CardContent>
          </Card>

          {analysisMode === "multi-lens" && documentContent.trim() && (
            <MultiLensAnalyzer
              contractContent={documentContent}
              contractName={selectedSample || "Contract"}
              contractId="SOW-DEMO"
              documentType={documentType}
            />
          )}

          {analysisMode === "standard" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Upload/Input Section - Step 2 */}
              <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/10 to-slate-900/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-400">2</span>
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-amber-400" />
                        Upload Contract for Analysis
                      </CardTitle>
                      <CardDescription>AI will extract terms, identify risks, and provide recommendations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Document Type</label>
                    <div className="flex gap-2">
                      <Button
                        variant={documentType === "SOW" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDocumentType("SOW")}>
                        SOW
                      </Button>
                      <Button
                        variant={documentType === "PO" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDocumentType("PO")}>
                        Purchase Order
                      </Button>
                      <Button
                        variant={documentType === "Agreement" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDocumentType("Agreement")}>
                        Agreement
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload Document</label>
                    <label className="text-sm font-medium mb-2 block">Quick Demo Samples</label>
                    <Select value={selectedSample} onValueChange={handleLoadSample}>
                      <SelectTrigger>
                        <SelectValue placeholder="Load sample contract for demo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOW-0005">SOW-0005 (High Risk - Missing Clauses)</SelectItem>
                        <SelectItem value="SOW-SAMPLE-GOOD">Sample Good Contract (Medium Risk)</SelectItem>
                        <SelectItem value="SOW-SAMPLE-EXCELLENT">Sample Excellent Contract (Low Risk)</SelectItem>
                        <SelectItem value="SOW-HIGH-RISK">Critical Risk Contract (Timeline + Financial)</SelectItem>
                        {getAllSampleContracts().map((sample) => (
                          <SelectItem key={sample.key} value={sample.key}>
                            {sample.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select a pre-loaded contract to see instant AI analysis
                    </p>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium mb-2 block">Or upload your document</label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".txt,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">TXT, PDF, DOC up to 10MB</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Or paste contract text:</label>
                    <Textarea
                      placeholder="Paste your contract text here for instant AI analysis..."
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleAnalyzeContract}
                    disabled={isAnalyzing || !documentContent.trim()}
                    className="w-full"
                    size="lg">
                    {isAnalyzing ? (
                      <>
                        <span className="animate-spin mr-2">⚡</span>
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze Contract
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Results - Steps 3 & 4 */}
              <Card className={`border-2 ${analysisResult ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-slate-900/50' : 'border-slate-600/30 bg-gradient-to-br from-slate-800/20 to-slate-900/50'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${analysisResult ? 'bg-emerald-500/20 border border-emerald-400/50' : 'bg-slate-700/50 border border-slate-600'}`}>
                      {analysisResult ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span className="text-sm font-bold text-slate-400">3-4</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className={`flex items-center gap-2 ${analysisResult ? 'text-emerald-300' : ''}`}>
                        <Eye className={`h-5 w-5 ${analysisResult ? 'text-emerald-400' : 'text-slate-400'}`} />
                        Analysis Results
                      </CardTitle>
                      <CardDescription>AI-powered risk assessment and recommendations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!analysisResult ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-700/50 rounded-lg bg-slate-900/30">
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                        <Brain className="h-8 w-8 text-slate-600" />
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        Results will appear here
                      </p>
                      <p className="text-xs text-slate-500 max-w-[200px]">
                        Complete steps 1-3 to see AI analysis results
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Risk Score */}
                      <div
                        className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2"
                        style={{ borderColor: getRiskColor(analysisResult.riskLevel) }}>
                        <div
                          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-3"
                          style={{ backgroundColor: `${getRiskColor(analysisResult.riskLevel)}15` }}>
                          <span
                            className="text-3xl font-bold"
                            style={{ color: getRiskColor(analysisResult.riskLevel) }}>
                            {analysisResult.riskScore}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">Risk Score</p>
                        <Badge variant={getRiskVariant(analysisResult.riskLevel)} className="text-xs">
                          {analysisResult.riskLevel} Risk
                        </Badge>
                      </div>

                      {/* Summary */}
                      <Alert>
                        <AlertDescription className="text-sm">{analysisResult.summary}</AlertDescription>
                      </Alert>

                      {/* Extracted Terms */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Extracted Terms</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Schedule:</span>
                            <span className="font-medium">{analysisResult.extractedTerms.paymentSchedule}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract Period:</span>
                            <span className="font-medium">
                              {analysisResult.extractedTerms.startDate} to {analysisResult.extractedTerms.endDate}
                            </span>
                          </div>
                          {analysisResult.extractedTerms.totalValue && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Value:</span>
                              <span className="font-medium">
                                ${new Intl.NumberFormat("en-US").format(analysisResult.extractedTerms.totalValue)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span>Risk Level</span>
                          <span>{analysisResult.riskScore}/100</span>
                        </div>
                        <Progress value={analysisResult.riskScore} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
