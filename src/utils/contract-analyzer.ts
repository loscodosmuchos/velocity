/**
 * AI-Powered Contract Analysis Utility
 * Uses Claude API for document analysis, risk detection, and compliance checking
 */

export interface ContractAnalysisResult {
  riskScore: number; // 0-100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  extractedTerms: {
    paymentSchedule?: string;
    startDate?: string;
    endDate?: string;
    totalValue?: number;
    deliverables?: string[];
    keyMilestones?: Array<{ date: string; description: string }>;
  };
  identifiedRisks: Array<{
    type: "Missing Protection" | "Non-Standard Clause" | "Compliance Gap" | "Financial Risk";
    severity: "Low" | "Medium" | "High" | "Critical";
    description: string;
    recommendation: string;
  }>;
  complianceChecks: Array<{
    item: string;
    status: "Pass" | "Fail" | "Warning";
    details: string;
  }>;
  summary: string;
  analyzedAt: string;
}

/**
 * Mock contract analysis - simulates Claude API response
 * In production, replace with actual Claude API integration
 */
export async function analyzeContract(
  documentContent: string,
  documentType: "SOW" | "PO" | "Agreement",
): Promise<ContractAnalysisResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock analysis based on document content patterns
  const hasInsuranceClause = documentContent.toLowerCase().includes("insurance");
  const hasTerminationClause = documentContent.toLowerCase().includes("termination");
  const hasIPClause =
    documentContent.toLowerCase().includes("intellectual property") ||
    documentContent.toLowerCase().includes("ip rights");
  const hasPaymentTerms =
    documentContent.toLowerCase().includes("payment") || documentContent.toLowerCase().includes("invoice");

  const risks: ContractAnalysisResult["identifiedRisks"] = [];
  const complianceChecks: ContractAnalysisResult["complianceChecks"] = [];

  // Check for missing critical clauses
  if (!hasInsuranceClause) {
    risks.push({
      type: "Missing Protection",
      severity: "High",
      description: "No insurance requirements specified",
      recommendation: "Add requirement for contractor to maintain general liability insurance ($1M minimum coverage)",
    });
    complianceChecks.push({
      item: "Insurance Requirements",
      status: "Fail",
      details: "Contract does not specify insurance requirements",
    });
  } else {
    complianceChecks.push({
      item: "Insurance Requirements",
      status: "Pass",
      details: "Insurance requirements clearly specified",
    });
  }

  if (!hasTerminationClause) {
    risks.push({
      type: "Missing Protection",
      severity: "Medium",
      description: "No termination clause found",
      recommendation: "Include clear termination terms with notice period (30 days recommended)",
    });
  }

  if (!hasIPClause && documentType === "SOW") {
    risks.push({
      type: "Missing Protection",
      severity: "Critical",
      description: "Intellectual property rights not addressed",
      recommendation: "Define IP ownership - recommend work-for-hire clause to ensure company retains all IP rights",
    });
    complianceChecks.push({
      item: "Intellectual Property Rights",
      status: "Fail",
      details: "No IP ownership clause found in SOW",
    });
  } else if (hasIPClause) {
    complianceChecks.push({
      item: "Intellectual Property Rights",
      status: "Pass",
      details: "IP ownership clearly defined",
    });
  }

  // Check payment terms
  if (!hasPaymentTerms) {
    risks.push({
      type: "Financial Risk",
      severity: "High",
      description: "Payment terms unclear or missing",
      recommendation: "Specify payment schedule, invoice frequency, and payment due dates (Net 30 is standard)",
    });
  }

  // Extract mock terms from content
  const amountMatch = documentContent.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  const totalValue = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : undefined;

  // Calculate risk score
  let riskScore = 20; // Base score
  risks.forEach((risk) => {
    if (risk.severity === "Critical") riskScore += 25;
    if (risk.severity === "High") riskScore += 15;
    if (risk.severity === "Medium") riskScore += 8;
    if (risk.severity === "Low") riskScore += 3;
  });
  riskScore = Math.min(riskScore, 100);

  const riskLevel: ContractAnalysisResult["riskLevel"] =
    riskScore >= 70 ? "Critical" : riskScore >= 50 ? "High" : riskScore >= 30 ? "Medium" : "Low";

  // Add compliance warning if needed
  if (complianceChecks.some((c) => c.status === "Fail")) {
    complianceChecks.push({
      item: "Overall Compliance",
      status: "Warning",
      details: "Contract has compliance gaps that should be addressed before execution",
    });
  } else {
    complianceChecks.push({
      item: "Overall Compliance",
      status: "Pass",
      details: "Contract meets basic compliance requirements",
    });
  }

  return {
    riskScore,
    riskLevel,
    extractedTerms: {
      paymentSchedule: hasPaymentTerms ? "Net 30 days from invoice date" : "Not specified",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      totalValue,
      deliverables: ["Software Development", "System Integration", "Technical Documentation"],
      keyMilestones: [
        { date: "2024-03-31", description: "Phase 1 Completion" },
        { date: "2024-06-30", description: "Phase 2 Completion" },
        { date: "2024-12-31", description: "Final Delivery" },
      ],
    },
    identifiedRisks: risks,
    complianceChecks,
    summary: `This ${documentType} has been analyzed for risk and compliance. Risk Score: ${riskScore}/100 (${riskLevel}). ${risks.length > 0 ? `${risks.length} risk(s) identified requiring attention.` : "No significant risks identified."} ${complianceChecks.filter((c) => c.status === "Fail").length > 0 ? "Compliance gaps detected - review recommended before execution." : "Basic compliance requirements met."}`,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Batch analyze multiple contracts
 */
export async function batchAnalyzeContracts(
  documents: Array<{ content: string; type: "SOW" | "PO" | "Agreement"; name: string }>,
): Promise<
  Array<{
    name: string;
    analysis: ContractAnalysisResult;
  }>
> {
  const results = await Promise.all(
    documents.map(async (doc) => ({
      name: doc.name,
      analysis: await analyzeContract(doc.content, doc.type),
    })),
  );

  return results;
}

/**
 * Get risk color for UI display
 */
export function getRiskColor(riskLevel: ContractAnalysisResult["riskLevel"]): string {
  const colors = {
    Low: "#22c55e",
    Medium: "#f97316",
    High: "#ef4444",
    Critical: "#dc2626",
  };
  return colors[riskLevel];
}

/**
 * Get risk badge variant
 */
export function getRiskVariant(riskLevel: ContractAnalysisResult["riskLevel"]) {
  const variants = {
    Low: "default" as const,
    Medium: "secondary" as const,
    High: "destructive" as const,
    Critical: "destructive" as const,
  };
  return variants[riskLevel];
}
