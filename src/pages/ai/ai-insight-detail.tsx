import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InsightProvenance } from '@/components/ai-insight-provenance';
import {
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Zap,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  Play,
  FileText,
  Bell,
  Settings,
  ArrowRight,
  Info,
  BarChart3,
  PieChart,
  Users,
  Timer,
  Calculator,
  Rocket,
  Eye,
  List,
  Activity
} from 'lucide-react';

interface AIInsightDetailData {
  id: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  category: 'pattern' | 'prediction' | 'recommendation' | 'anomaly' | 'optimization';
  title: string;
  summary: string;
  confidence: number;
  impact?: string;
  actionable: boolean;
  timestamp: string;
  detailedAnalysis: string;
  dataSources: string[];
  recommendations: {
    title: string;
    description: string;
    estimatedImpact: string;
    effort: 'low' | 'medium' | 'high';
  }[];
  relatedMetrics: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

export default function AIInsightDetailPage() {
  const { insightId } = useParams();
  const navigate = useNavigate();

  const mockInsightData: AIInsightDetailData = {
    id: insightId || 'insight-automation-opp',
    severity: 'info',
    category: 'optimization',
    title: 'Invoice Automation Opportunity Identified',
    summary: 'AI analysis suggests 73% of invoice processing tasks could be automated based on repeated patterns. Implementing auto-approval rules for invoices under $5,000 could save 12 hours/week.',
    confidence: 85,
    impact: 'Time savings: ~624 hours annually ($31,200 value at $50/hour loaded cost)',
    actionable: true,
    timestamp: new Date().toISOString(),
    detailedAnalysis: `Our machine learning model analyzed 847 invoices processed over the past 6 months and identified clear automation opportunities:

**Pattern Recognition Results:**
- 73% of invoices follow predictable approval patterns (same contractor, regular amounts, consistent SOW references)
- Average manual processing time: 18 minutes per invoice
- 89% of invoices under $5,000 are approved without modification
- Zero rejections for invoices matching pre-approved contractor profiles

**Automation Candidates:**
1. Regular contractor invoices (52% of volume) - Same contractor, predictable amounts, matching SOW
2. Timecard-matched invoices (21% of volume) - Invoice amounts match approved timecard hours exactly
3. Recurring service invoices (14% of volume) - Monthly services like software licenses, facilities

**Risk Assessment:**
- Low risk: Invoices from pre-approved contractors with matching SOW/timecard data
- Medium risk: First-time invoices from existing contractors (require human review)
- High risk: Invoices with variance >5% from SOW/timecard (always require approval)

**Implementation Strategy:**
Phase 1 (Weeks 1-2): Auto-approve invoices under $2,500 from top 10 contractors
Phase 2 (Weeks 3-4): Expand to invoices under $5,000 with timecard match
Phase 3 (Weeks 5-6): Add recurring service invoices regardless of amount`,
    dataSources: [
      'Invoice processing history (847 invoices, Jan-Jun 2024)',
      'Contractor approval patterns (32 active contractors)',
      'SOW compliance records (95% match rate)',
      'Timecard validation logs (99.2% accuracy)'
    ],
    recommendations: [
      {
        title: 'Implement Auto-Approval Rules for Low-Risk Invoices',
        description: 'Configure automated approval for invoices under $5,000 from pre-approved contractors with matching SOW/timecard data. Start with top 10 contractors to minimize risk.',
        estimatedImpact: '8-12 hours saved per week, 85% approval cycle time reduction',
        effort: 'medium'
      },
      {
        title: 'Create Smart Alerts for Variance Detection',
        description: 'Set up automated alerts when invoices deviate from expected patterns (amount variance >5%, missing SOW reference, new contractor).',
        estimatedImpact: 'Prevent 95% of invoice errors before they require rework',
        effort: 'low'
      },
      {
        title: 'Enable Batch Processing for Recurring Services',
        description: 'Group recurring monthly invoices (software licenses, facilities) into batch approval workflows to process 20-30 invoices simultaneously.',
        estimatedImpact: '4 hours saved monthly on routine invoice processing',
        effort: 'low'
      }
    ],
    relatedMetrics: [
      { label: 'Current Manual Processing Time', value: '18 min/invoice', trend: 'stable' },
      { label: 'Automation Candidate Volume', value: '73% of invoices' },
      { label: 'Estimated Annual Time Savings', value: '624 hours', trend: 'up' },
      { label: 'Projected Cost Savings', value: '$31,200/year', trend: 'up' },
      { label: 'Auto-Approval Accuracy Rate', value: '99.1%' },
      { label: 'Risk Level', value: 'Low', trend: 'stable' }
    ]
  };

  const insight = mockInsightData;

  const severityConfig = {
    high: {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-700',
      badge: 'bg-purple-500 text-white'
    },
    medium: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-500',
      text: 'text-indigo-700',
      badge: 'bg-indigo-500 text-white'
    },
    low: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-500',
      text: 'text-cyan-700',
      badge: 'bg-cyan-500 text-white'
    },
    info: {
      bg: 'bg-slate-50',
      border: 'border-slate-500',
      text: 'text-slate-700',
      badge: 'bg-slate-500 text-white'
    }
  };

  const categoryConfig = {
    pattern: { icon: <Target className="h-5 w-5" />, label: 'Pattern Detection' },
    prediction: { icon: <TrendingUp className="h-5 w-5" />, label: 'Predictive Analytics' },
    recommendation: { icon: <Lightbulb className="h-5 w-5" />, label: 'AI Recommendation' },
    anomaly: { icon: <AlertTriangle className="h-5 w-5" />, label: 'Anomaly Detected' },
    optimization: { icon: <Zap className="h-5 w-5" />, label: 'Process Optimization' }
  };

  const effortConfig = {
    low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low Effort' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium Effort' },
    high: { color: 'text-red-600', bg: 'bg-red-100', label: 'High Effort' }
  };

  const config = severityConfig[insight.severity];
  const catConfig = categoryConfig[insight.category];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <InsightProvenance 
            insightId={insight.id} 
            insightTitle={insight.title} 
          />
        </div>
        <Badge className="bg-purple-500 text-white">
          AI Insight ID: {insight.id}
        </Badge>
      </div>

      <Card className={`border-2 ${config.border}`}>
        <CardHeader className={config.bg}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{insight.title}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2 text-base">
                  {catConfig.icon}
                  <span>{catConfig.label}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className={config.text}>
                    {insight.severity.toUpperCase()}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <Sparkles className="h-4 w-4" />
                  <span>AI Confidence: {insight.confidence}%</span>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Generated</div>
              <div className="font-mono text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(insight.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Summary
            </h3>
            <p className="text-base leading-relaxed">{insight.summary}</p>
          </div>

          {/* LEGENDARY PROJECTED IMPACT SECTION */}
          {insight.impact && (
            <TooltipProvider>
              <div className="bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border-2 border-amber-500/50 rounded-xl overflow-hidden shadow-xl shadow-amber-500/10">
                {/* Gold Header Bar */}
                <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-lg tracking-wide">PROJECTED IMPACT</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-white/20 text-white border-0 font-bold cursor-help flex items-center gap-1">
                        AI VALIDATED
                        <Info className="h-3 w-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-amber-500/50 max-w-xs p-3">
                      <div className="text-amber-400 font-semibold mb-1">AI Validation Score: 94%</div>
                      <p className="text-slate-300 text-xs">
                        This projection was validated against 6 months of historical data, cross-referenced with 
                        industry benchmarks, and verified by pattern matching across 847 similar transactions.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Impact Metrics Grid with Tooltips */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {/* Time Savings - with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-lg p-3 text-center cursor-help hover:bg-emerald-900/60 transition-colors group">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock className="h-6 w-6 text-emerald-400" />
                            <Info className="h-3 w-3 text-emerald-400/50 group-hover:text-emerald-400" />
                          </div>
                          <div className="text-2xl font-bold text-emerald-300">624</div>
                          <div className="text-xs text-emerald-400 uppercase tracking-wide">Hours/Year</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 border-emerald-500/50 max-w-sm p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                            <Calculator className="h-4 w-4" />
                            How This Was Calculated
                          </div>
                          <div className="text-slate-300 text-xs space-y-1">
                            <div className="flex justify-between"><span>Invoices under $5K:</span><span className="text-white font-mono">847/year</span></div>
                            <div className="flex justify-between"><span>Avg processing time:</span><span className="text-white font-mono">18 min</span></div>
                            <div className="flex justify-between"><span>Automation rate:</span><span className="text-white font-mono">73%</span></div>
                            <div className="flex justify-between"><span>Time per auto-invoice:</span><span className="text-white font-mono">2 min</span></div>
                            <Separator className="my-2 bg-emerald-500/30" />
                            <div className="flex justify-between text-emerald-300 font-semibold">
                              <span>Net Time Saved:</span><span className="font-mono">624 hrs</span>
                            </div>
                          </div>
                          <div className="text-emerald-400/70 text-[10px] pt-1 border-t border-emerald-500/20">
                            Formula: (847 × 0.73 × 16min) ÷ 60 = 624 hours/year
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Cost Savings - with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-amber-900/40 border border-amber-500/40 rounded-lg p-3 text-center cursor-help hover:bg-amber-900/60 transition-colors group">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <DollarSign className="h-6 w-6 text-amber-400" />
                            <Info className="h-3 w-3 text-amber-400/50 group-hover:text-amber-400" />
                          </div>
                          <div className="text-2xl font-bold text-amber-300">$31.2K</div>
                          <div className="text-xs text-amber-400 uppercase tracking-wide">Annual Value</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 border-amber-500/50 max-w-sm p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 font-semibold">
                            <Calculator className="h-4 w-4" />
                            Value Breakdown
                          </div>
                          <div className="text-slate-300 text-xs space-y-1">
                            <div className="flex justify-between"><span>Hours saved:</span><span className="text-white font-mono">624 hrs</span></div>
                            <div className="flex justify-between"><span>Loaded labor rate:</span><span className="text-white font-mono">$50/hr</span></div>
                            <Separator className="my-2 bg-amber-500/30" />
                            <div className="flex justify-between text-amber-300 font-semibold">
                              <span>Direct Savings:</span><span className="font-mono">$31,200</span>
                            </div>
                          </div>
                          <div className="bg-amber-900/30 rounded p-2 mt-2">
                            <div className="text-amber-400 text-[10px] font-semibold">WHAT THIS MEANS FOR YOU:</div>
                            <div className="text-amber-100 text-xs mt-1">
                              Equivalent to 0.3 FTE that can be reallocated to strategic work instead of manual invoice processing.
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Efficiency Gain - with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-cyan-900/40 border border-cyan-500/40 rounded-lg p-3 text-center cursor-help hover:bg-cyan-900/60 transition-colors group">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="h-6 w-6 text-cyan-400" />
                            <Info className="h-3 w-3 text-cyan-400/50 group-hover:text-cyan-400" />
                          </div>
                          <div className="text-2xl font-bold text-cyan-300">73%</div>
                          <div className="text-xs text-cyan-400 uppercase tracking-wide">Automatable</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-slate-900 border-cyan-500/50 max-w-sm p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                            <PieChart className="h-4 w-4" />
                            Automation Eligibility
                          </div>
                          <div className="text-slate-300 text-xs space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                              <span>Auto-approvable (52%)</span>
                              <span className="text-cyan-300 font-mono ml-auto">441 invoices</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-cyan-700"></div>
                              <span>Timecard-matched (21%)</span>
                              <span className="text-cyan-300 font-mono ml-auto">178 invoices</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                              <span>Manual review needed (27%)</span>
                              <span className="text-slate-400 font-mono ml-auto">228 invoices</span>
                            </div>
                          </div>
                          <div className="text-cyan-400/70 text-[10px] pt-2 border-t border-cyan-500/20">
                            Based on pattern analysis of 847 invoices from past 6 months
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Full Impact Statement */}
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <p className="text-amber-100 font-medium">{insight.impact}</p>
                  </div>
                  
                  {/* Quick Actions - LEGENDARY STYLING */}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-3 font-semibold">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* LEGENDARY Start Implementation Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-700 hover:via-green-600 hover:to-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/30 border border-emerald-400/30 font-semibold"
                          >
                            <Rocket className="h-3.5 w-3.5" />
                            Start Implementation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-emerald-500/50 max-w-xs p-3">
                          <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-2">
                            <Rocket className="h-4 w-4" />
                            Launch Implementation Wizard
                          </div>
                          <p className="text-slate-300 text-xs">
                            Creates automation rules, sets up approval workflows, and configures thresholds based on this insight. Takes ~5 minutes.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 gap-2">
                            <FileText className="h-3.5 w-3.5" />
                            Export Report
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-amber-500/50 max-w-xs p-3">
                          <div className="text-amber-400 font-semibold mb-1">Export Full Analysis</div>
                          <p className="text-slate-300 text-xs">
                            Download PDF with methodology, data sources, calculations, and executive summary for stakeholder review.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2">
                            <Bell className="h-3.5 w-3.5" />
                            Set Reminder
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-slate-500/50 max-w-xs p-3">
                          <div className="text-slate-200 font-semibold mb-1">Schedule Follow-Up</div>
                          <p className="text-slate-400 text-xs">
                            Set a reminder to revisit this insight. Choose from 1 week, 1 month, or custom date.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2">
                            <Settings className="h-3.5 w-3.5" />
                            Configure Rules
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-slate-500/50 max-w-xs p-3">
                          <div className="text-slate-200 font-semibold mb-1">Customize Thresholds</div>
                          <p className="text-slate-400 text-xs">
                            Adjust automation parameters: approval thresholds, contractor whitelist, amount limits.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* LEGENDARY DETAILED AI ANALYSIS SECTION */}
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-purple-500/30">
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Brain className="h-5 w-5 text-purple-400" />
            Detailed AI Analysis
            <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Eye className="h-3 w-3 mr-1" />
              Deep Dive
            </Badge>
          </CardTitle>
          <CardDescription className="text-purple-300/70">
            Pattern recognition results and automation candidates identified by AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Key Findings Summary - Visual Cards */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-purple-300 font-semibold mb-3">
              <Activity className="h-4 w-4" />
              KEY FINDINGS AT A GLANCE
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">847</div>
                <div className="text-xs text-slate-400">Invoices Analyzed</div>
              </div>
              <div className="bg-slate-800/60 border border-emerald-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">73%</div>
                <div className="text-xs text-slate-400">Match Patterns</div>
              </div>
              <div className="bg-slate-800/60 border border-amber-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">18m</div>
                <div className="text-xs text-slate-400">Avg Process Time</div>
              </div>
              <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-xs text-slate-400">Rejections Found</div>
              </div>
            </div>
          </div>

          {/* Pattern Recognition Results */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold mb-3">
              <BarChart3 className="h-4 w-4" />
              PATTERN RECOGNITION RESULTS
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-emerald-100">73% of invoices follow predictable approval patterns</div>
                  <div className="text-xs text-emerald-400/70">Same contractor, regular amounts, consistent SOW references</div>
                </div>
                <div className="text-emerald-300 font-mono text-sm">619 invoices</div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-cyan-900/20 border border-cyan-500/20 rounded-lg">
                <Timer className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-cyan-100">Average manual processing time: 18 minutes per invoice</div>
                  <div className="text-xs text-cyan-400/70">Including review, verification, and approval steps</div>
                </div>
                <div className="text-cyan-300 font-mono text-sm">2,544 hrs/yr</div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-900/20 border border-amber-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-amber-100">89% of invoices under $5,000 are approved without modification</div>
                  <div className="text-xs text-amber-400/70">High confidence for auto-approval threshold</div>
                </div>
                <div className="text-amber-300 font-mono text-sm">754 invoices</div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-purple-100">Zero rejections for pre-approved contractor profiles</div>
                  <div className="text-xs text-purple-400/70">Perfect track record on trusted vendor list</div>
                </div>
                <div className="text-purple-300 font-mono text-sm">100% safe</div>
              </div>
            </div>
          </div>

          {/* Automation Candidates - Visual Breakdown */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold mb-3">
              <Zap className="h-4 w-4" />
              AUTOMATION CANDIDATES
            </div>
            <div className="space-y-3">
              {/* Candidate 1 */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs font-bold">1</div>
                    <span className="text-white font-medium">Regular Contractor Invoices</span>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-0">52% of volume</Badge>
                </div>
                <div className="text-sm text-slate-400">Same contractor, predictable amounts, matching SOW</div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FileText className="h-3 w-3" />
                    441 invoices
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Zap className="h-3 w-3" />
                    Full automation ready
                  </div>
                </div>
              </div>
              
              {/* Candidate 2 */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold">2</div>
                    <span className="text-white font-medium">Timecard-Matched Invoices</span>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300 border-0">21% of volume</Badge>
                </div>
                <div className="text-sm text-slate-400">Invoice amounts match approved timecard hours exactly</div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FileText className="h-3 w-3" />
                    178 invoices
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Auto-verify ready
                  </div>
                </div>
              </div>
              
              {/* Candidate 3 */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold">3</div>
                    <span className="text-white font-medium">Recurring Service Invoices</span>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-0">Monthly Subscriptions</Badge>
                </div>
                <div className="text-sm text-slate-400">Monthly services and software licenses with fixed amounts</div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <FileText className="h-3 w-3" />
                    48 invoices
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <Settings className="h-3 w-3" />
                    Schedule-based approval
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Visual */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 font-semibold mb-3">
              <AlertTriangle className="h-4 w-4" />
              RISK ASSESSMENT
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">LOW</div>
                <div className="text-xs text-emerald-300/70">Implementation Risk</div>
                <div className="mt-1 text-[10px] text-slate-500">Reversible with audit trail</div>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">HIGH</div>
                <div className="text-xs text-emerald-300/70">Confidence Level</div>
                <div className="mt-1 text-[10px] text-slate-500">Based on 6mo data</div>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-amber-400">2 WKS</div>
                <div className="text-xs text-amber-300/70">Time to Value</div>
                <div className="mt-1 text-[10px] text-slate-500">Setup + validation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {insight.actionable && insight.recommendations.length > 0 && (
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Actionable Recommendations
            </CardTitle>
            <CardDescription>
              AI-generated implementation steps with estimated impact and effort
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {insight.recommendations.map((rec, idx) => (
              <Card 
                key={idx} 
                className={`rounded-none first:rounded-t-lg last:rounded-b-lg border-x border-b first:border-t ${
                  idx % 2 === 0 
                    ? 'bg-white' 
                    : 'bg-gradient-to-r from-emerald-50/50 via-green-50/30 to-emerald-50/50'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          idx % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-200 text-emerald-800'
                        }`}>
                          {idx + 1}
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {rec.title}
                      </CardTitle>
                    </div>
                    <Badge className={`${effortConfig[rec.effort].bg} ${effortConfig[rec.effort].color} border-0`}>
                      {effortConfig[rec.effort].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-sm text-gray-700">{rec.description}</p>
                  <div className={`border p-2 rounded ${
                    idx % 2 === 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-emerald-100/50 border-emerald-300'
                  }`}>
                    <div className="text-xs font-semibold text-green-700 mb-1">Estimated Impact</div>
                    <p className="text-sm font-medium text-green-900">{rec.estimatedImpact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insight.dataSources.map((source, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Related Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insight.relatedMetrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{metric.value}</span>
                    {metric.trend && (
                      <Badge variant="outline" className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600 border-green-300' :
                        metric.trend === 'down' ? 'text-red-600 border-red-300' :
                        'text-gray-600 border-gray-300'
                      }`}>
                        {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-2">
              <Brain className="h-3 w-3" />
              <strong>AI-Generated Insight:</strong> This analysis was produced by machine learning models trained on historical workforce data patterns. Confidence score of {insight.confidence}% indicates high reliability based on data quality and pattern consistency.
            </p>
            <p className="mt-2">
              <strong>Non-Interrupting Design:</strong> This insight is informational and does not require immediate action. Review when ready and implement recommendations at your own pace. No forced context switches or anxiety-inducing alerts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
