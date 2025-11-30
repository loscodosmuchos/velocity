import { useState } from "react";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Scale,
  DollarSign,
  Cog,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  ChevronRight,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  analyzeContractMultiLens,
  type MultiLensAnalysisResult,
  type LegalLensResult,
  type FinancialLensResult,
  type OperationalLensResult,
  type VendorLensResult,
  type ComplianceLensResult,
} from "@/utils/multi-lens-analyzer";
import {
  type StakeholderRole,
  getLensAccessForRole,
  filterRecommendationsByRole,
  getRoleSummary,
  canViewLens,
} from "@/utils/stakeholder-filter";
import {
  requiresApproval,
  createApprovalRequest,
  shouldAutoEscalate,
  generateEscalationMessage,
  type ApprovalWorkflowConfig,
} from "@/utils/approval-integration";

interface MultiLensAnalyzerProps {
  contractContent: string;
  contractName: string;
  contractId: string;
  documentType: "SOW" | "PO" | "Agreement";
  vendorId?: number;
  userRole?: StakeholderRole; // Optional: filter by user role
  onApprovalCreated?: (approvalId: number) => void;
}

export function MultiLensAnalyzer({
  contractContent,
  contractName,
  contractId,
  documentType,
  vendorId,
  userRole,
  onApprovalCreated,
}: MultiLensAnalyzerProps) {
  const [analysisResult, setAnalysisResult] = useState<MultiLensAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLens, setSelectedLens] = useState<
    "overview" | "legal" | "financial" | "operational" | "vendor" | "compliance"
  >("overview");
  const [filterByRole, setFilterByRole] = useState<StakeholderRole | "all">(userRole || "all");

  const { data: identity } = useGetIdentity<{ id: number; name: string; email: string; role: string }>();
  const { mutate: createApproval } = useCreate();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeContractMultiLens(contractContent, documentType, contractId, contractName, vendorId);
      setAnalysisResult(result);
      setSelectedLens("overview");

      // Auto-create approval request if needed
      if (requiresApproval(result)) {
        handleCreateApproval(result);
      }

      // Auto-escalate if critical - notify stakeholders immediately
      if (shouldAutoEscalate(result)) {
        const escalationMessage = generateEscalationMessage(result);
        toast.error("Critical Risk Detected - Escalation Required", {
          description: escalationMessage,
          duration: 10000,
        });
      }
    } catch (error) {
      toast.error("Analysis failed", { description: error instanceof Error ? error.message : "Please try again" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateApproval = (result: MultiLensAnalysisResult) => {
    const config: ApprovalWorkflowConfig = {
      entityType: documentType,
      entityId: parseInt(contractId.split("-").pop() || "0"),
      entityName: contractName,
      requestedBy: identity?.id ?? 1,
      requestedByName: identity?.name ?? "System AI Analysis",
    };

    const approvalRequest = createApprovalRequest(result, config);

    createApproval(
      {
        resource: "approval_requests",
        values: approvalRequest,
      },
      {
        onSuccess: (data) => {
          if (onApprovalCreated && data.data?.id) {
            onApprovalCreated(Number(data.data.id));
          }
        },
      },
    );
  };

  const getRiskColor = (level: string) => {
    const colors = {
      LOW: "#22c55e",
      MEDIUM: "#f97316",
      HIGH: "#ef4444",
      CRITICAL: "#dc2626",
    };
    return colors[level as keyof typeof colors] || "#6b7280";
  };

  const getLensIcon = (lens: string) => {
    const icons = {
      legal: <Scale className="h-5 w-5" />,
      financial: <DollarSign className="h-5 w-5" />,
      operational: <Cog className="h-5 w-5" />,
      vendor: <Users className="h-5 w-5" />,
      compliance: <Shield className="h-5 w-5" />,
    };
    return icons[lens as keyof typeof icons];
  };

  // Get filtered recommendations based on role
  const getFilteredRecommendations = () => {
    if (!analysisResult || filterByRole === "all") return analysisResult?.topRecommendations || [];
    return filterRecommendationsByRole(analysisResult.topRecommendations, filterByRole);
  };

  // Get role-specific summary
  const getRoleSummaryText = () => {
    if (!analysisResult || filterByRole === "all") return null;
    return getRoleSummary(filterByRole, analysisResult.overallRiskLevel);
  };

  // Check if user can view specific lens
  const canUserViewLens = (lensName: string) => {
    if (filterByRole === "all") return true;
    return canViewLens(filterByRole, lensName);
  };

  if (!analysisResult && !isAnalyzing) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary/50" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Multi-Lens Contract Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  5 perspectives: Legal, Financial, Operational, Vendor, Compliance
                </p>
              </div>
            </div>
            <Button 
              onClick={handleAnalyze} 
              size="lg" 
              className="gap-2 whitespace-nowrap bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
            >
              <Sparkles className="h-5 w-5" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Contract...</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Running 5 parallel analyses: Legal, Financial, Operational, Vendor, Compliance
          </p>
          <Progress value={66} className="w-64" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) return null;

  const filteredRecommendations = getFilteredRecommendations();
  const roleSummary = getRoleSummaryText();

  return (
    <div className="space-y-6">
      {/* Role Filter */}
      {!userRole && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by Stakeholder Role:</span>
            </div>
            <Select value={filterByRole} onValueChange={(val) => setFilterByRole(val as StakeholderRole | "all")}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lenses</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Role-Specific Summary */}
      {roleSummary && (
        <Alert>
          <AlertDescription className="font-medium">{roleSummary}</AlertDescription>
        </Alert>
      )}

      {/* Overall Risk Score */}
      <Card className="border-2" style={{ borderColor: getRiskColor(analysisResult.overallRiskLevel) }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Multi-Lens Analysis Complete
              </CardTitle>
              <CardDescription>Analyzed {contractName} from 5 stakeholder perspectives</CardDescription>
            </div>
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-2"
                style={{ backgroundColor: `${getRiskColor(analysisResult.overallRiskLevel)}15` }}>
                <span className="text-3xl font-bold" style={{ color: getRiskColor(analysisResult.overallRiskLevel) }}>
                  {analysisResult.overallRiskScore}
                </span>
              </div>
              <Badge
                variant={analysisResult.overallRiskLevel === "CRITICAL" ? "destructive" : "secondary"}
                className="text-xs">
                {analysisResult.overallRiskLevel} RISK
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top Recommendations */}
      {analysisResult.topRecommendations.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <TrendingUp className="h-5 w-5" />
              Top Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysisResult.topRecommendations.map((rec, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-4 border">
                <div className="flex items-start gap-3">
                  <Badge variant={rec.priority === "Critical" ? "destructive" : "secondary"} className="mt-0.5">
                    {rec.priority}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{rec.lens} Lens</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{rec.action}</p>
                    <p className="text-xs text-muted-foreground">{rec.impact}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {analysisResult.quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysisResult.quickActions.map((action, idx) => (
            <Button key={idx} variant="outline" size="sm" className="gap-2">
              {action.action === "approve" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {action.action === "escalate" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* 5-Lens Dashboard */}
      <div className="grid gap-4 md:grid-cols-5">
        <LensCard
          icon={<Scale className="h-5 w-5" />}
          title="Legal"
          riskLevel={analysisResult.legalLens.riskLevel}
          onClick={() => setSelectedLens("legal")}
          isSelected={selectedLens === "legal"}
        />
        <LensCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Financial"
          riskLevel={analysisResult.financialLens.riskLevel}
          onClick={() => setSelectedLens("financial")}
          isSelected={selectedLens === "financial"}
        />
        <LensCard
          icon={<Cog className="h-5 w-5" />}
          title="Operational"
          riskLevel={analysisResult.operationalLens.riskLevel}
          onClick={() => setSelectedLens("operational")}
          isSelected={selectedLens === "operational"}
        />
        <LensCard
          icon={<Users className="h-5 w-5" />}
          title="Vendor"
          riskLevel={analysisResult.vendorLens.riskLevel}
          onClick={() => setSelectedLens("vendor")}
          isSelected={selectedLens === "vendor"}
        />
        <LensCard
          icon={<Shield className="h-5 w-5" />}
          title="Compliance"
          riskLevel={analysisResult.complianceLens.riskLevel}
          onClick={() => setSelectedLens("compliance")}
          isSelected={selectedLens === "compliance"}
        />
      </div>

      {/* Detailed Lens View */}
      <Card>
        <CardContent className="pt-6">
          {selectedLens === "legal" && <LegalLensDetail data={analysisResult.legalLens} />}
          {selectedLens === "financial" && <FinancialLensDetail data={analysisResult.financialLens} />}
          {selectedLens === "operational" && <OperationalLensDetail data={analysisResult.operationalLens} />}
          {selectedLens === "vendor" && <VendorLensDetail data={analysisResult.vendorLens} />}
          {selectedLens === "compliance" && <ComplianceLensDetail data={analysisResult.complianceLens} />}
        </CardContent>
      </Card>

      {/* Show approval status if created */}
      {analysisResult && requiresApproval(analysisResult) && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <strong>Approval Required</strong>
            <p className="text-sm mt-1">
              This contract requires multi-level approval due to {analysisResult.overallRiskLevel.toLowerCase()} risk
              level. Approval request has been created automatically.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface LensCardProps {
  icon: React.ReactNode;
  title: string;
  riskLevel: { score: number; level: string; color: string };
  onClick: () => void;
  isSelected: boolean;
}

function LensCard({ icon, title, riskLevel, onClick, isSelected }: LensCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-2 border-primary" : ""}`}
      onClick={onClick}>
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2" style={{ color: riskLevel.color }}>
          {icon}
        </div>
        <h4 className="text-sm font-semibold mb-2">{title}</h4>
        <div className="text-2xl font-bold mb-1" style={{ color: riskLevel.color }}>
          {riskLevel.score}
        </div>
        <Badge variant={riskLevel.level === "CRITICAL" ? "destructive" : "secondary"} className="text-xs">
          {riskLevel.level}
        </Badge>
      </CardContent>
    </Card>
  );
}

function LegalLensDetail({ data }: { data: LegalLensResult }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Scale className="h-5 w-5" />
        Legal Analysis
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Clauses Present ({data.clausesPresent.length})
          </h4>
          <div className="space-y-1">
            {data.clausesPresent.map((clause, idx) => (
              <div key={idx} className="text-sm text-muted-foreground">
                • {clause}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Missing Clauses ({data.clausesMissing.length})
          </h4>
          <div className="space-y-1">
            {data.clausesMissing.map((clause, idx) => (
              <div key={idx} className="text-sm text-destructive">
                • {clause}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Liability Exposure: {data.liabilityExposure.level}</strong>
          <p className="text-sm mt-1">{data.liabilityExposure.description}</p>
          {data.liabilityExposure.estimatedExposure && (
            <p className="text-sm mt-1">
              Estimated exposure: ${new Intl.NumberFormat("en-US").format(data.liabilityExposure.estimatedExposure)}
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div>
        <h4 className="text-sm font-medium mb-2">Compliance Gaps ({data.complianceGaps.length})</h4>
        <div className="space-y-2">
          {data.complianceGaps.map((gap, idx) => (
            <Card
              key={idx}
              className="border-l-4"
              style={{ borderLeftColor: gap.severity === "Critical" ? "#dc2626" : "#f97316" }}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Badge variant={gap.severity === "Critical" ? "destructive" : "secondary"} className="text-xs">
                    {gap.severity}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{gap.gap}</p>
                    <p className="text-xs text-muted-foreground mt-1">{gap.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FinancialLensDetail({ data }: { data: FinancialLensResult }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Financial Analysis
      </h3>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Payment Terms Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Terms:</span>
            <span className="font-medium">{data.paymentTermsAnalysis.terms}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Clarity:</span>
            <Badge variant={data.paymentTermsAnalysis.clarity === "Clear" ? "default" : "secondary"}>
              {data.paymentTermsAnalysis.clarity}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Favorability:</span>
            <Badge>{data.paymentTermsAnalysis.favorability}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{data.paymentTermsAnalysis.cashFlowImpact}</p>
        </CardContent>
      </Card>

      {data.costOutliers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Cost Outliers</h4>
          {data.costOutliers.map((outlier, idx) => (
            <Card key={idx} className="mb-2">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{outlier.item}</p>
                    <p className="text-xs text-muted-foreground">
                      ${new Intl.NumberFormat("en-US").format(outlier.amount)} vs benchmark $
                      {new Intl.NumberFormat("en-US").format(outlier.benchmark)}
                    </p>
                  </div>
                  <Badge variant={outlier.severity === "High" ? "destructive" : "secondary"}>
                    +{outlier.variance.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Budget Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium">
              ${new Intl.NumberFormat("en-US").format(data.budgetImpact.estimatedTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span>{data.budgetImpact.budgetCategory}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">% of Budget:</span>
            <span>{data.budgetImpact.percentOfBudget}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overrun Risk:</span>
            <Badge variant={data.budgetImpact.overrunRisk === "High" ? "destructive" : "secondary"}>
              {data.budgetImpact.overrunRisk}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OperationalLensDetail({ data }: { data: OperationalLensResult }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Cog className="h-5 w-5" />
        Operational Analysis
      </h3>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Delivery Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{data.deliveryTimeline.duration} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Feasibility:</span>
            <Badge variant={data.deliveryTimeline.feasibility === "Feasible" ? "default" : "destructive"}>
              {data.deliveryTimeline.feasibility}
            </Badge>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Critical Path:</p>
            {data.deliveryTimeline.criticalPath.map((item, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                • {item}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Availability:</span>
            <Badge variant={data.resourceAllocation.availability === "Available" ? "default" : "secondary"}>
              {data.resourceAllocation.availability}
            </Badge>
          </div>
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Required Resources:</p>
            {data.resourceAllocation.requiredResources.map((resource, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                • {resource}
              </p>
            ))}
          </div>
          {data.resourceAllocation.conflicts.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {data.resourceAllocation.conflicts.map((conflict, idx) => (
                  <p key={idx} className="text-xs">
                    {conflict}
                  </p>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {data.dependencyAnalysis.dependencies.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Dependencies</h4>
          {data.dependencyAnalysis.dependencies.map((dep, idx) => (
            <Card key={idx} className="mb-2">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{dep.type}</p>
                    <p className="text-xs text-muted-foreground">{dep.description}</p>
                  </div>
                  <Badge variant={dep.risk === "High" ? "destructive" : "secondary"}>{dep.risk} Risk</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VendorLensDetail({ data }: { data: VendorLensResult }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Vendor Analysis
      </h3>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Historical Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contracts Completed:</span>
            <span className="font-medium">{data.historicalPerformance.contractsCompleted}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">On-Time Delivery:</span>
            <span className="font-medium">{data.historicalPerformance.onTimeDelivery}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quality Score:</span>
            <span className="font-medium">{data.historicalPerformance.qualityScore}/5.0</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Relationship Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant={
                data.relationshipHealth.status === "Strong"
                  ? "default"
                  : data.relationshipHealth.status === "Poor"
                    ? "destructive"
                    : "secondary"
              }>
              {data.relationshipHealth.status}
            </Badge>
          </div>
          <Progress value={data.relationshipHealth.score} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{data.relationshipHealth.factors.join(" • ")}</p>
        </CardContent>
      </Card>

      {data.similarContracts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Similar Contracts</h4>
          {data.similarContracts.map((contract, idx) => (
            <Card key={idx} className="mb-2">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">{contract.contractId}</p>
                    <p className="text-xs text-muted-foreground">{contract.similarity}% similar</p>
                  </div>
                  <Badge
                    variant={
                      contract.outcome === "Success"
                        ? "default"
                        : contract.outcome === "Failed"
                          ? "destructive"
                          : "secondary"
                    }>
                    {contract.outcome}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">💡 {contract.lessons}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ComplianceLensDetail({ data }: { data: ComplianceLensResult }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Compliance Analysis
      </h3>

      <Alert variant={data.regulatoryAlignment.compliant ? "default" : "destructive"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Regulatory Alignment: {data.regulatoryAlignment.compliant ? "Compliant" : "Non-Compliant"}</strong>
          {data.regulatoryAlignment.gaps.length > 0 && (
            <p className="text-sm mt-2">{data.regulatoryAlignment.gaps.length} compliance gap(s) detected</p>
          )}
        </AlertDescription>
      </Alert>

      {data.regulatoryAlignment.gaps.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Regulatory Gaps</h4>
          {data.regulatoryAlignment.gaps.map((gap, idx) => (
            <Card key={idx} className="mb-2 border-l-4 border-l-destructive">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{gap.regulation}</p>
                    <p className="text-xs text-muted-foreground">{gap.requirement}</p>
                  </div>
                  <Badge variant="destructive">{gap.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Audit Trail Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Present:</span>
            <Badge variant={data.auditTrailRequirements.present ? "default" : "destructive"}>
              {data.auditTrailRequirements.present ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Adequacy:</span>
            <Badge variant={data.auditTrailRequirements.adequacy === "Adequate" ? "default" : "secondary"}>
              {data.auditTrailRequirements.adequacy}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Insurance & Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Insurance:</span>
            <Badge variant={data.insuranceAndCertifications.insurancePresent ? "default" : "destructive"}>
              {data.insuranceAndCertifications.insurancePresent ? "Present" : "Missing"}
            </Badge>
          </div>
          {data.insuranceAndCertifications.gaps.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Missing Certifications:</p>
              {data.insuranceAndCertifications.gaps.map((gap, idx) => (
                <p key={idx} className="text-xs text-destructive">
                  • {gap}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
        <ul className="space-y-1">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
