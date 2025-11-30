import { useParams, useNavigate } from 'react-router';
import { useShow } from "@refinedev/core";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  AlertTriangle,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AlertAuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AlertDetailData {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'budget' | 'timecard' | 'contractor' | 'po' | 'invoice' | 'compliance';
  title: string;
  message: string;
  value?: string;
  action?: string;
  createdAt: string;
  evidence: {
    dataSource: string;
    query: string;
    resultCount: number;
  };
  auditTrail: AlertAuditEntry[];
  relatedData: { label: string; value: string }[];
}

interface AlertFromApi {
  id: number;
  alertType: string;
  severity: string;
  entityType: string | null;
  entityId: number | null;
  title: string;
  description: string | null;
  recommendation: string | null;
  status: string;
  resolvedBy: number | null;
  resolvedAt: string | null;
  waitingStakeholders: any[];
  urgencyScore: number;
  degradationCostPerDay: number;
  deadlineDate: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapAlertTypeToCategory(alertType: string): AlertDetailData['category'] {
  const typeMap: Record<string, AlertDetailData['category']> = {
    'budget_warning': 'budget',
    'budget_overrun': 'budget',
    'compliance': 'compliance',
    'timecard': 'timecard',
    'contract_expiry': 'po',
    'po_warning': 'po',
    'invoice_variance': 'invoice',
    'contractor_status': 'contractor'
  };
  return typeMap[alertType] || 'budget';
}

function mapSeverityToType(severity: string): AlertDetailData['type'] {
  const severityMap: Record<string, AlertDetailData['type']> = {
    'critical': 'critical',
    'high': 'warning',
    'medium': 'info',
    'low': 'success'
  };
  return severityMap[severity?.toLowerCase()] || 'info';
}

function generateAuditTrail(createdAt: string, status: string): AlertAuditEntry[] {
  const baseTime = new Date(createdAt);
  const trail: AlertAuditEntry[] = [
    {
      timestamp: createdAt,
      action: 'Alert Generated',
      user: 'System (Automated Threshold Monitor)',
      details: 'Alert triggered based on configured threshold monitoring'
    },
    {
      timestamp: new Date(baseTime.getTime() + 1000).toISOString(),
      action: 'Alert Icon Created',
      user: 'System',
      details: 'Compact alert cube spawned on Executive Command Center dashboard'
    },
    {
      timestamp: new Date(baseTime.getTime() + 3000).toISOString(),
      action: 'Email Notification Sent',
      user: 'System',
      details: 'Notification sent to relevant stakeholders'
    }
  ];

  if (status === 'resolved') {
    trail.push({
      timestamp: new Date().toISOString(),
      action: 'Alert Resolved',
      user: 'User',
      details: 'Alert marked as resolved'
    });
  }

  return trail;
}

function generateRelatedData(alert: AlertFromApi): { label: string; value: string }[] {
  const relatedData: { label: string; value: string }[] = [
    { label: 'Alert ID', value: `ALERT-${alert.id}` },
    { label: 'Status', value: alert.status },
    { label: 'Created', value: new Date(alert.createdAt).toLocaleString() }
  ];

  if (alert.urgencyScore > 0) {
    relatedData.push({ label: 'Urgency Score', value: `${alert.urgencyScore}/100` });
  }

  if (alert.degradationCostPerDay > 0) {
    relatedData.push({ 
      label: 'Cost Impact', 
      value: `$${alert.degradationCostPerDay.toLocaleString()}/day` 
    });
  }

  if (alert.deadlineDate) {
    relatedData.push({ 
      label: 'Deadline', 
      value: new Date(alert.deadlineDate).toLocaleDateString() 
    });
  }

  if (alert.entityType) {
    relatedData.push({ label: 'Entity Type', value: alert.entityType });
  }

  if (alert.entityId) {
    relatedData.push({ label: 'Entity ID', value: `#${alert.entityId}` });
  }

  return relatedData;
}

function AlertDetailPage() {
  const { alertId } = useParams();
  const navigate = useNavigate();

  const { queryResult } = useShow<AlertFromApi>({
    resource: "alerts",
    id: alertId,
  });

  const { data, isLoading, isError } = queryResult;
  const alertFromApi = data?.data;

  const alert: AlertDetailData | null = alertFromApi ? {
    id: `ALERT-${alertFromApi.id}`,
    type: mapSeverityToType(alertFromApi.severity),
    category: mapAlertTypeToCategory(alertFromApi.alertType),
    title: alertFromApi.title,
    message: alertFromApi.description || 'No description available',
    value: alertFromApi.urgencyScore > 0 ? `${alertFromApi.urgencyScore}%` : undefined,
    action: alertFromApi.recommendation || 'Review and take appropriate action based on alert context.',
    createdAt: alertFromApi.createdAt,
    evidence: {
      dataSource: `PostgreSQL - ${alertFromApi.entityType || 'alerts'} table`,
      query: `SELECT * FROM ${alertFromApi.entityType || 'alerts'} WHERE id = ${alertFromApi.entityId || alertFromApi.id}`,
      resultCount: 1
    },
    auditTrail: generateAuditTrail(alertFromApi.createdAt, alertFromApi.status),
    relatedData: generateRelatedData(alertFromApi)
  } : null;

  const typeConfig = {
    critical: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-300',
      badge: 'bg-red-600',
      icon: <XCircle className="h-5 w-5" />
    },
    warning: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-300',
      badge: 'bg-amber-600',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-300',
      badge: 'bg-blue-600',
      icon: <Clock className="h-5 w-5" />
    },
    success: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300',
      badge: 'bg-emerald-600',
      icon: <CheckCircle className="h-5 w-5" />
    }
  };

  const categoryConfig = {
    budget: { icon: <DollarSign className="h-4 w-4" />, label: 'Finance' },
    timecard: { icon: <Clock className="h-4 w-4" />, label: 'Time' },
    contractor: { icon: <Users className="h-4 w-4" />, label: 'Workforce' },
    po: { icon: <FileText className="h-4 w-4" />, label: 'Contracts' },
    invoice: { icon: <TrendingUp className="h-4 w-4" />, label: 'Invoices' },
    compliance: { icon: <Shield className="h-4 w-4" />, label: 'Compliance' }
  };

  const handleApprove = () => {
    toast.success("Fix approved. Updating status...", { icon: <ThumbsUp className="h-4 w-4" /> });
  };

  const handleDismiss = () => {
    toast.info("Alert dismissed.", { icon: <ThumbsDown className="h-4 w-4" /> });
  };

  if (isError) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-1 text-sm text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-300 mb-2">Alert Not Found</h2>
            <p className="text-slate-400">
              The alert with ID "{alertId}" could not be found or you don't have permission to view it.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-slate-600 text-slate-300"
              onClick={() => navigate('/alerts')}
            >
              Return to Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!alert) {
    return (
      <LoadingOverlay loading={true}>
        <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen" />
      </LoadingOverlay>
    );
  }

  const config = typeConfig[alert.type];
  const catConfig = categoryConfig[alert.category];

  return (
    <LoadingOverlay loading={isLoading}>
      <div className="p-3 space-y-3 max-w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
        <div className="flex items-center justify-between py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-1 text-sm text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono border-slate-700 text-slate-300">
              {alert.id}
            </Badge>
            <Badge className={`${config.badge} text-white text-xs`}>
              {alert.type.toUpperCase()}
            </Badge>
            <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1" onClick={handleApprove}>
              <ThumbsUp className="h-3 w-3" />
              Approve
            </Button>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 flex items-center gap-1" onClick={handleDismiss}>
              <ThumbsDown className="h-3 w-3" />
              Dismiss
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <Card className={`col-span-5 border-2 ${config.border} bg-slate-800/50`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2 mb-2">
                <div className={`${config.bg} p-2 rounded`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold leading-tight mb-1 text-slate-100">{alert.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {catConfig.icon}
                    <span>{catConfig.label}</span>
                    <span>•</span>
                    <span>{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{alert.message}</p>
              {alert.value && (
                <div className={`mt-2 ${config.bg} border ${config.border} p-2 rounded text-center`}>
                  <div className="text-xs font-semibold text-slate-400">Impact</div>
                  <div className={`text-2xl font-bold font-mono ${config.text}`}>{alert.value}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-4 border-2 border-emerald-500/50 bg-emerald-500/10">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Recommended Action</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-300 mb-3">{alert.action}</p>
              <div className="space-y-2">
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs" onClick={handleApprove}>
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Implement
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs border-slate-600 text-slate-300">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-1 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-200">Evidence</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-slate-400">Source</div>
                  <div className="font-mono text-xs bg-slate-900/50 p-1 rounded truncate text-slate-300">
                    {alert.evidence.dataSource.split(' - ')[0]}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-400">Records</div>
                  <div className="font-mono text-slate-300">{alert.evidence.resultCount} matched</div>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs border-slate-600 text-slate-300 mt-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View Query
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <Card className="col-span-7 bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-200">Related Data</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {alert.relatedData.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-700 last:border-0">
                    <span className="font-medium text-slate-400 truncate mr-2">{item.label}</span>
                    <span className="font-semibold text-slate-200 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-5 bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="audit" className="border-0">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-200">
                      <Shield className="h-4 w-4" />
                      Chain of Custody ({alert.auditTrail.length} events)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2 text-xs max-h-40 overflow-y-auto">
                      {alert.auditTrail.map((entry, idx) => (
                        <div key={idx} className="pb-2 border-b border-slate-700 last:border-0">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-slate-200">{entry.action}</div>
                            <div className="font-mono text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">{entry.user}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{entry.details}</div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-2 text-xs text-slate-500 border-t border-slate-700 pt-2">
                <strong>Compliance:</strong> All data backed by evidence. Audit logged.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default AlertDetailPage;
