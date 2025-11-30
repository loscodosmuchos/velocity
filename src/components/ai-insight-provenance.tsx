import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Zap,
  Database,
  Brain,
  Sparkles,
  Layout,
  Bell,
  ChevronRight,
  Clock,
  Code,
  Eye,
  FileText,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Terminal,
  Table,
  BarChart3,
  GitBranch,
  Cpu
} from 'lucide-react';

interface ProvenanceStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  timestamp: string;
  duration: string;
  status: 'completed' | 'running' | 'pending';
  userSummary: string;
  developerDetails: {
    description: string;
    inputs?: string[];
    outputs?: string[];
    queries?: string[];
    logic?: string;
    metrics?: { label: string; value: string }[];
  };
}

interface InsightProvenanceProps {
  insightId: string;
  insightTitle: string;
}

export function InsightProvenance({ insightId, insightTitle }: InsightProvenanceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const provenanceStages: ProvenanceStage[] = [
    {
      id: 'trigger',
      name: 'Trigger',
      icon: <Zap className="h-5 w-5" />,
      color: 'amber',
      timestamp: '2024-11-25 02:00:00 UTC',
      duration: '0ms',
      status: 'completed',
      userSummary: 'Scheduled daily analysis detected invoice patterns worth investigating',
      developerDetails: {
        description: 'Cron job triggered the invoice pattern analyzer at 02:00 UTC',
        inputs: [
          'Trigger type: SCHEDULED_SCAN',
          'Schedule: Daily at 02:00 UTC',
          'Scan scope: invoices, timecards, contractors',
          'Lookback period: 6 months'
        ],
        logic: `// Trigger configuration
{
  "trigger_type": "SCHEDULED_SCAN",
  "cron": "0 2 * * *",
  "enabled": true,
  "priority": "normal",
  "scan_modules": ["invoice_patterns", "timecard_anomalies", "contractor_performance"]
}`,
        metrics: [
          { label: 'Trigger ID', value: 'TRG-2024-1125-0200' },
          { label: 'Previous Run', value: '2024-11-24 02:00:00' },
          { label: 'Run Frequency', value: 'Daily' }
        ]
      }
    },
    {
      id: 'data-collection',
      name: 'Data Collection',
      icon: <Database className="h-5 w-5" />,
      color: 'cyan',
      timestamp: '2024-11-25 02:00:01 UTC',
      duration: '2.3s',
      status: 'completed',
      userSummary: 'Gathered 847 invoices from the past 6 months along with related timecards and contractor records',
      developerDetails: {
        description: 'Queried PostgreSQL database for invoice data with related entities',
        inputs: [
          'Date range: 2024-05-25 to 2024-11-25',
          'Invoice status: All',
          'Include related: timecards, contractors, POs, SOWs'
        ],
        outputs: [
          '847 invoices retrieved',
          '1,203 timecard records',
          '34 unique contractors',
          '28 active purchase orders'
        ],
        queries: [
          `SELECT i.*, c.name as contractor_name, 
  po.po_number, po.total_budget,
  t.hours_worked, t.status as timecard_status
FROM invoices i
JOIN contractors c ON i.contractor_id = c.id
JOIN purchase_orders po ON i.po_id = po.id
LEFT JOIN timecards t ON i.timecard_id = t.id
WHERE i.created_at >= NOW() - INTERVAL '6 months'
ORDER BY i.created_at DESC;`,
          `SELECT contractor_id, 
  COUNT(*) as invoice_count,
  AVG(amount) as avg_amount,
  STDDEV(amount) as amount_stddev
FROM invoices
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY contractor_id;`
        ],
        metrics: [
          { label: 'Query Time', value: '2.3s' },
          { label: 'Rows Scanned', value: '12,847' },
          { label: 'Data Size', value: '4.2 MB' },
          { label: 'Cache Hit', value: '23%' }
        ]
      }
    },
    {
      id: 'analysis',
      name: 'Analysis',
      icon: <Brain className="h-5 w-5" />,
      color: 'purple',
      timestamp: '2024-11-25 02:00:04 UTC',
      duration: '8.7s',
      status: 'completed',
      userSummary: 'AI analyzed patterns in invoice approvals and identified 73% follow predictable rules',
      developerDetails: {
        description: 'Multi-stage analysis: statistical patterns, ML classification, rule matching',
        inputs: [
          'Invoice dataset: 847 records',
          'Analysis modules: [pattern_detection, anomaly_detection, automation_scoring]',
          'ML Model: invoice_classifier_v2.3'
        ],
        outputs: [
          'Pattern confidence: 0.94',
          'Automatable invoices: 619 (73%)',
          'Anomalies detected: 12',
          'Rule matches: 5 patterns'
        ],
        logic: `// Analysis Pipeline
const analysisResult = await pipeline([
  // Stage 1: Statistical Pattern Detection
  async (data) => {
    const patterns = detectApprovalPatterns(data);
    // Found: same contractor + amount < $5K + matching SOW = 94% auto-approved
    return { patterns, confidence: 0.94 };
  },
  
  // Stage 2: ML Classification
  async (data) => {
    const predictions = await invoiceClassifier.predict(data);
    // Classified 847 invoices into: auto-approve, review, escalate
    return { predictions, accuracy: 0.91 };
  },
  
  // Stage 3: Automation Scoring
  async (data) => {
    const scores = calculateAutomationPotential(data);
    // Scored each invoice 0-100 on automation readiness
    return { scores, avgScore: 73 };
  }
]);`,
        metrics: [
          { label: 'Pattern Confidence', value: '94%' },
          { label: 'ML Model Version', value: 'v2.3' },
          { label: 'Processing Time', value: '8.7s' },
          { label: 'CPU Utilization', value: '67%' }
        ]
      }
    },
    {
      id: 'synthesis',
      name: 'Synthesis',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'emerald',
      timestamp: '2024-11-25 02:00:13 UTC',
      duration: '1.2s',
      status: 'completed',
      userSummary: 'Combined analysis results into actionable insight with specific recommendations',
      developerDetails: {
        description: 'Aggregated analysis results, calculated impact metrics, generated recommendations',
        inputs: [
          'Pattern analysis results',
          'ML classification output',
          'Automation scores',
          'Historical baseline data'
        ],
        outputs: [
          'Insight type: OPTIMIZATION_OPPORTUNITY',
          'Severity: INFO',
          'Confidence: 85%',
          'Action items: 4'
        ],
        logic: `// Synthesis Logic
const insight = synthesizeInsight({
  // Calculate time savings
  hoursSaved: automatableInvoices * avgProcessingTime * (1 - autoProcessingTime),
  // 619 * 18min * 0.89 = 624 hours/year
  
  // Calculate cost savings
  costSavings: hoursSaved * loadedLaborRate,
  // 624 * $50 = $31,200/year
  
  // Generate recommendations
  recommendations: generateRecommendations(patterns, automationScore),
  
  // Set severity based on impact
  severity: costSavings > 25000 ? 'HIGH' : costSavings > 10000 ? 'MEDIUM' : 'INFO'
});`,
        metrics: [
          { label: 'Hours Saved', value: '624/year' },
          { label: 'Cost Savings', value: '$31,200' },
          { label: 'Recommendations', value: '4' },
          { label: 'Confidence', value: '85%' }
        ]
      }
    },
    {
      id: 'presentation',
      name: 'Presentation',
      icon: <Layout className="h-5 w-5" />,
      color: 'blue',
      timestamp: '2024-11-25 02:00:14 UTC',
      duration: '0.3s',
      status: 'completed',
      userSummary: 'Formatted insight for display with priority ranking and visual elements',
      developerDetails: {
        description: 'Applied presentation rules, assigned priority, created visual metadata',
        inputs: [
          'Raw insight object',
          'User preferences (role: admin)',
          'Display context: dashboard'
        ],
        outputs: [
          'Priority rank: 2 of 5 active insights',
          'Display format: cube + detail page',
          'Category: Process Optimization',
          'Visual severity: INFO (cyan border)'
        ],
        logic: `// Presentation Configuration
const presentation = {
  title: "Invoice Automation Opportunity Identified",
  category: "optimization",
  severity: "info",
  cube: {
    icon: "zap",
    color: "amber",
    position: calculateGridPosition(priority)
  },
  detailPage: {
    showImpactMetrics: true,
    showRecommendations: true,
    showProvenance: true,
    allowActions: ["implement", "export", "remind", "configure"]
  }
};`,
        metrics: [
          { label: 'Priority Rank', value: '#2 of 5' },
          { label: 'Display Type', value: 'Cube + Detail' },
          { label: 'Format Time', value: '0.3s' }
        ]
      }
    },
    {
      id: 'notification',
      name: 'Notification',
      icon: <Bell className="h-5 w-5" />,
      color: 'rose',
      timestamp: '2024-11-25 02:00:15 UTC',
      duration: '0.1s',
      status: 'completed',
      userSummary: 'Added to your dashboard feed and marked for your next login',
      developerDetails: {
        description: 'Pushed to notification queue, updated dashboard, scheduled digest',
        inputs: [
          'Notification channels: [dashboard, digest]',
          'Recipients: [admin users]',
          'Urgency: normal'
        ],
        outputs: [
          'Dashboard widget updated',
          'Added to weekly digest queue',
          'Triage counter incremented'
        ],
        logic: `// Notification Dispatch
await notificationService.dispatch({
  insight_id: "${insightId}",
  channels: ["dashboard", "digest"],
  recipients: await getSubscribers("optimization_alerts"),
  urgency: insight.severity === "high" ? "immediate" : "normal",
  actions: {
    dashboard: () => updateDashboardWidget(insight),
    digest: () => queueForDigest(insight, "weekly"),
    triage: () => incrementTriageCounter()
  }
});`,
        metrics: [
          { label: 'Channels', value: '2' },
          { label: 'Recipients', value: '3 admins' },
          { label: 'Delivery', value: 'Success' }
        ]
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      amber: { bg: 'bg-amber-900/30', border: 'border-amber-500/50', text: 'text-amber-400', icon: 'text-amber-400' },
      cyan: { bg: 'bg-cyan-900/30', border: 'border-cyan-500/50', text: 'text-cyan-400', icon: 'text-cyan-400' },
      purple: { bg: 'bg-purple-900/30', border: 'border-purple-500/50', text: 'text-purple-400', icon: 'text-purple-400' },
      emerald: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/50', text: 'text-emerald-400', icon: 'text-emerald-400' },
      blue: { bg: 'bg-blue-900/30', border: 'border-blue-500/50', text: 'text-blue-400', icon: 'text-blue-400' },
      rose: { bg: 'bg-rose-900/30', border: 'border-rose-500/50', text: 'text-rose-400', icon: 'text-rose-400' }
    };
    return colors[color] || colors.amber;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 gap-2"
        >
          <GitBranch className="h-4 w-4" />
          How Was This Generated?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                AI Insight Provenance
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                Complete pipeline showing how this insight was generated
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
              <Eye className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Dev Mode</span>
              <Switch 
                checked={devMode} 
                onCheckedChange={setDevMode}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          {/* Insight Reference */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Insight Being Traced</div>
            <div className="text-white font-medium">{insightTitle}</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">ID: {insightId}</div>
          </div>

          {/* Visual Pipeline */}
          <div className="relative mb-6">
            <div className="flex items-center justify-between">
              {provenanceStages.map((stage, index) => {
                const colors = getColorClasses(stage.color);
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${colors.icon}`}>
                      {stage.icon}
                    </div>
                    {index < provenanceStages.length - 1 && (
                      <div className="w-8 h-0.5 bg-gradient-to-r from-slate-600 to-slate-700 mx-1">
                        <ChevronRight className="h-3 w-3 text-slate-500 -mt-1 ml-2" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 px-1">
              {provenanceStages.map((stage) => (
                <div key={stage.id} className="text-[10px] text-slate-500 text-center w-10">
                  {stage.name}
                </div>
              ))}
            </div>
          </div>

          {/* Stage Details Accordion */}
          <Accordion type="multiple" className="space-y-2">
            {provenanceStages.map((stage, index) => {
              const colors = getColorClasses(stage.color);
              return (
                <AccordionItem 
                  key={stage.id} 
                  value={stage.id}
                  className={`border ${colors.border} rounded-lg overflow-hidden`}
                >
                  <AccordionTrigger className={`px-4 py-3 hover:no-underline ${colors.bg}`}>
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full bg-slate-800 border ${colors.border} flex items-center justify-center text-xs font-bold ${colors.text}`}>
                          {index + 1}
                        </div>
                        <div className={colors.icon}>{stage.icon}</div>
                        <span className={`font-semibold ${colors.text}`}>{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-4 ml-auto mr-4">
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {stage.status}
                        </Badge>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stage.duration}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-slate-800/30">
                    {/* User-Friendly Summary */}
                    <div className="flex items-start gap-2 mb-4">
                      <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{stage.userSummary}</p>
                    </div>

                    {devMode && (
                      <>
                        <Separator className="my-3 bg-slate-700" />
                        
                        {/* Developer Details */}
                        <div className="space-y-4">
                          {/* Description */}
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <Terminal className="h-3 w-3" />
                              Technical Description
                            </div>
                            <p className="text-slate-400 text-sm">{stage.developerDetails.description}</p>
                          </div>

                          {/* Inputs/Outputs Grid */}
                          {(stage.developerDetails.inputs || stage.developerDetails.outputs) && (
                            <div className="grid grid-cols-2 gap-3">
                              {stage.developerDetails.inputs && (
                                <div className="bg-slate-900/50 border border-slate-700 rounded p-2">
                                  <div className="text-xs text-cyan-400 font-semibold mb-1">INPUTS</div>
                                  <ul className="text-xs text-slate-400 space-y-0.5">
                                    {stage.developerDetails.inputs.map((input, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <ArrowRight className="h-3 w-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                                        {input}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {stage.developerDetails.outputs && (
                                <div className="bg-slate-900/50 border border-slate-700 rounded p-2">
                                  <div className="text-xs text-emerald-400 font-semibold mb-1">OUTPUTS</div>
                                  <ul className="text-xs text-slate-400 space-y-0.5">
                                    {stage.developerDetails.outputs.map((output, i) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        {output}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* SQL Queries */}
                          {stage.developerDetails.queries && (
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Table className="h-3 w-3" />
                                SQL Queries Executed
                              </div>
                              {stage.developerDetails.queries.map((query, i) => (
                                <pre key={i} className="bg-slate-950 border border-slate-700 rounded p-2 text-xs text-cyan-300 overflow-x-auto mb-2 font-mono">
                                  {query}
                                </pre>
                              ))}
                            </div>
                          )}

                          {/* Logic/Code */}
                          {stage.developerDetails.logic && (
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Code className="h-3 w-3" />
                                Processing Logic
                              </div>
                              <pre className="bg-slate-950 border border-slate-700 rounded p-2 text-xs text-amber-300 overflow-x-auto font-mono">
                                {stage.developerDetails.logic}
                              </pre>
                            </div>
                          )}

                          {/* Metrics */}
                          {stage.developerDetails.metrics && (
                            <div>
                              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                Performance Metrics
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {stage.developerDetails.metrics.map((metric, i) => (
                                  <div key={i} className="bg-slate-900 border border-slate-700 rounded px-2 py-1">
                                    <div className="text-[10px] text-slate-500">{metric.label}</div>
                                    <div className="text-sm font-mono text-white">{metric.value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Timestamp */}
                    <div className="mt-3 pt-2 border-t border-slate-700 flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-mono">
                        {stage.timestamp}
                      </div>
                      <div className="text-xs text-slate-500">
                        Stage {index + 1} of {provenanceStages.length}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Total Pipeline Summary */}
          <div className="mt-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                <span className="font-semibold text-purple-300">Total Pipeline Execution</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-500">Total Time</div>
                  <div className="text-lg font-bold text-purple-300">12.6s</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Stages</div>
                  <div className="text-lg font-bold text-purple-300">6/6</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-500">Status</div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-0">
                    Complete
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default InsightProvenance;
