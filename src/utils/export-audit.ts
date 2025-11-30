import { AuditLog, SystemException, DataQualityMetric } from "@/types";

export const exportAuditLogsToCSV = (auditLogs: AuditLog[]) => {
  const headers = [
    "ID",
    "Timestamp",
    "Entity Type",
    "Entity ID",
    "Action",
    "Performed By",
    "IP Address",
    "Changed Fields",
  ];

  const rows = auditLogs.map((log) => [
    log.id,
    log.timestamp,
    log.entityType,
    log.entityId,
    log.action,
    log.performedByName,
    log.ipAddress || "",
    log.changedFields ? log.changedFields.map((cf) => `${cf.field}: ${cf.oldValue} → ${cf.newValue}`).join("; ") : "",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportExceptionsToCSV = (exceptions: SystemException[]) => {
  const headers = [
    "ID",
    "Exception Type",
    "Severity",
    "Entity Type",
    "Entity ID",
    "Entity Name",
    "Description",
    "Status",
    "Detected At",
    "Resolved At",
    "Resolution Notes",
    "Auto Fix Available",
  ];

  const rows = exceptions.map((exception) => [
    exception.id,
    exception.exceptionType,
    exception.severity,
    exception.entityType,
    exception.entityId,
    exception.entityName,
    exception.description,
    exception.status,
    exception.detectedAt,
    exception.resolvedAt || "",
    exception.resolutionNotes || "",
    exception.autoFixAvailable ? "Yes" : "No",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `system-exceptions-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const exportDataQualityToCSV = (metrics: DataQualityMetric[]) => {
  const headers = [
    "ID",
    "Metric Name",
    "Category",
    "Entity Type",
    "Current Value",
    "Target Value",
    "Unit",
    "Status",
    "Trend",
    "Last Calculated",
    "Performance %",
  ];

  const rows = metrics.map((metric) => {
    const performance = (metric.currentValue / metric.targetValue) * 100;
    return [
      metric.id,
      metric.metricName,
      metric.category,
      metric.entityType,
      metric.currentValue,
      metric.targetValue,
      metric.unit,
      metric.status,
      metric.trend,
      metric.lastCalculated,
      `${performance.toFixed(2)}%`,
    ];
  });

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `data-quality-report-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const generateComplianceReport = (
  auditLogs: AuditLog[],
  exceptions: SystemException[],
  metrics: DataQualityMetric[],
) => {
  const report = `
VELOCITY WORKFORCE MANAGEMENT SYSTEM
COMPLIANCE & AUDIT REPORT
Generated: ${new Date().toLocaleString()}

==============================================================================
EXECUTIVE SUMMARY
==============================================================================

Total Audit Log Entries: ${auditLogs.length}
Open Exceptions: ${exceptions.filter((e) => e.status !== "Resolved").length}
Critical Exceptions: ${exceptions.filter((e) => e.severity === "Critical").length}
Data Quality Metrics: ${metrics.length}
Critical Data Issues: ${metrics.filter((m) => m.status === "Critical").length}

==============================================================================
AUDIT LOG SUMMARY
==============================================================================

Recent Activity (Last 30 days):
- Total Changes: ${auditLogs.length}
- Creates: ${auditLogs.filter((l) => l.action === "Created").length}
- Updates: ${auditLogs.filter((l) => l.action === "Updated").length}
- Approvals: ${auditLogs.filter((l) => l.action === "Approved").length}
- Deletions: ${auditLogs.filter((l) => l.action === "Deleted").length}

By Entity Type:
${Object.entries(
  auditLogs.reduce(
    (acc, log) => {
      acc[log.entityType] = (acc[log.entityType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join("\n")}

==============================================================================
EXCEPTIONS SUMMARY
==============================================================================

Current Open Exceptions: ${exceptions.filter((e) => e.status !== "Resolved").length}

By Severity:
- Critical: ${exceptions.filter((e) => e.severity === "Critical").length}
- High: ${exceptions.filter((e) => e.severity === "High").length}
- Medium: ${exceptions.filter((e) => e.severity === "Medium").length}
- Low: ${exceptions.filter((e) => e.severity === "Low").length}

By Type:
${Object.entries(
  exceptions.reduce(
    (acc, exception) => {
      acc[exception.exceptionType] = (acc[exception.exceptionType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join("\n")}

Resolution Rate: ${((exceptions.filter((e) => e.status === "Resolved").length / exceptions.length) * 100).toFixed(1)}%

==============================================================================
DATA QUALITY METRICS
==============================================================================

Overall System Health: ${Math.round(
    metrics.reduce((acc, m) => acc + (m.currentValue / m.targetValue) * 100, 0) / metrics.length,
  )}%

By Category:
${Object.entries(
  metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.category]) acc[metric.category] = [];
      acc[metric.category].push(metric);
      return acc;
    },
    {} as Record<string, DataQualityMetric[]>,
  ),
)
  .map(([category, categoryMetrics]) => {
    const avgScore =
      categoryMetrics.reduce((acc, m) => acc + (m.currentValue / m.targetValue) * 100, 0) / categoryMetrics.length;
    return `- ${category}: ${avgScore.toFixed(1)}% (${categoryMetrics.filter((m) => m.status === "Good").length}/${categoryMetrics.length} metrics healthy)`;
  })
  .join("\n")}

Critical Issues Requiring Attention:
${
  metrics
    .filter((m) => m.status === "Critical")
    .map((m) => `- ${m.metricName} (${m.entityType}): ${m.currentValue}/${m.targetValue} ${m.unit}`)
    .join("\n") || "None"
}

==============================================================================
RECOMMENDATIONS
==============================================================================

${exceptions.filter((e) => e.status === "Open" && e.severity === "Critical").length > 0 ? "1. ADDRESS CRITICAL EXCEPTIONS IMMEDIATELY" : ""}
${metrics.filter((m) => m.status === "Critical").length > 0 ? "2. IMPROVE DATA QUALITY IN CRITICAL AREAS" : ""}
${exceptions.filter((e) => e.status === "Open").length > 10 ? "3. REVIEW AND RESOLVE PENDING EXCEPTIONS" : ""}

==============================================================================
COMPLIANCE CERTIFICATION
==============================================================================

This report certifies that the Velocity Workforce Management System maintains
comprehensive audit trails for all system changes, tracks operational exceptions,
and monitors data quality metrics as required for regulatory compliance.

Report Generated: ${new Date().toLocaleString()}
Report Valid Through: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString()}

==============================================================================
END OF REPORT
==============================================================================
`;

  const blob = new Blob([report], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `compliance-report-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
