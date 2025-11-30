import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Bug, 
  Calendar, 
  FileCode, 
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface RiskFactors {
  complexity: number;
  impact: number;
  vendor_dependencies: number;
}

interface FeatureRisk {
  id: number;
  feature_name: string;
  description: string;
  file_path: string;
  risk_score: number;
  risk_level: string;
  risk_factors: RiskFactors;
  mitigations: string[];
  deploy_date: string | null;
  bugs_found: number;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes: string;
}

const riskLevelConfig = {
  low: { 
    emoji: "🟢", 
    label: "LOW", 
    range: "0-20",
    bgColor: "bg-emerald-900/30", 
    borderColor: "border-emerald-500", 
    textColor: "text-emerald-400" 
  },
  medium: { 
    emoji: "🟡", 
    label: "MEDIUM", 
    range: "21-50",
    bgColor: "bg-yellow-900/30", 
    borderColor: "border-yellow-500", 
    textColor: "text-yellow-400" 
  },
  high: { 
    emoji: "🔴", 
    label: "HIGH", 
    range: "51-75",
    bgColor: "bg-orange-900/30", 
    borderColor: "border-orange-500", 
    textColor: "text-orange-400" 
  },
  critical: { 
    emoji: "🔴🔴", 
    label: "CRITICAL", 
    range: "76-100",
    bgColor: "bg-red-900/30", 
    borderColor: "border-red-500", 
    textColor: "text-red-400" 
  },
};

const statusColors = {
  pending: "bg-slate-700 text-slate-300",
  deployed: "bg-cyan-900 text-cyan-400",
  monitoring: "bg-amber-900 text-amber-400",
  stable: "bg-emerald-900 text-emerald-400",
  problematic: "bg-red-900 text-red-400",
};

export function FeatureRiskDashboard() {
  const [features, setFeatures] = useState<FeatureRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadFeatureRisks();
  }, []);

  const loadFeatureRisks = async () => {
    try {
      const response = await fetch("/api/feature-risks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
      }
    } catch (error) {
      console.error("Error loading feature risks:", error);
      toast.error("Failed to load feature risks");
    } finally {
      setLoading(false);
    }
  };

  const filteredFeatures = useMemo(() => {
    if (filterLevel === "all") return features;
    return features.filter(f => f.risk_level === filterLevel);
  }, [features, filterLevel]);

  const stats = useMemo(() => {
    const total = features.length;
    const avgRisk = total > 0 
      ? Math.round(features.reduce((sum, f) => sum + f.risk_score, 0) / total) 
      : 0;
    const distribution = {
      low: features.filter(f => f.risk_level === "low").length,
      medium: features.filter(f => f.risk_level === "medium").length,
      high: features.filter(f => f.risk_level === "high").length,
      critical: features.filter(f => f.risk_level === "critical").length,
    };
    const totalBugs = features.reduce((sum, f) => sum + f.bugs_found, 0);
    return { total, avgRisk, distribution, totalBugs };
  }, [features]);

  const getRiskIndicator = (level: string) => {
    const config = riskLevelConfig[level as keyof typeof riskLevelConfig];
    return config || riskLevelConfig.low;
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 20) return "text-emerald-400";
    if (score <= 50) return "text-yellow-400";
    if (score <= 75) return "text-orange-400";
    return "text-red-400";
  };

  const getRiskScoreBar = (score: number) => {
    let gradient = "from-emerald-500 to-emerald-400";
    if (score > 20 && score <= 50) gradient = "from-yellow-500 to-yellow-400";
    if (score > 50 && score <= 75) gradient = "from-orange-500 to-orange-400";
    if (score > 75) gradient = "from-red-600 to-red-400";
    
    return (
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not deployed";
    return new Date(dateString).toLocaleDateString();
  };

  const downloadRiskReport = () => {
    const report = features.map(f => 
      `${f.feature_name} | Risk: ${f.risk_score} (${f.risk_level.toUpperCase()}) | Bugs: ${f.bugs_found} | Status: ${f.status}`
    ).join("\n");
    
    const header = `FEATURE RISK REPORT - ${new Date().toLocaleDateString()}\n${"=".repeat(60)}\n\n`;
    const summary = `SUMMARY\nTotal Features: ${stats.total}\nAverage Risk Score: ${stats.avgRisk}\nTotal Bugs Found: ${stats.totalBugs}\n\nDISTRIBUTION\n🟢 Low: ${stats.distribution.low}\n🟡 Medium: ${stats.distribution.medium}\n🔴 High: ${stats.distribution.high}\n🔴🔴 Critical: ${stats.distribution.critical}\n\nDETAILS\n${"=".repeat(60)}\n`;
    
    const fullReport = header + summary + report;
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(fullReport));
    element.setAttribute("download", `feature-risk-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Risk report downloaded");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">⚠️ Feature Risk Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Track feature risk scores, mitigations, and post-deploy outcomes
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-900/50 rounded-lg">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">{stats.total}</p>
                <p className="text-xs text-slate-400">Total Features</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-900/50 rounded-lg">
                <Activity className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${getRiskScoreColor(stats.avgRisk)}`}>
                  {stats.avgRisk}%
                </p>
                <p className="text-xs text-slate-400">Avg Risk Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-900/50 rounded-lg">
                <Bug className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.totalBugs}</p>
                <p className="text-xs text-slate-400">Bugs Post-Deploy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-1">
              <Badge className="bg-emerald-900 text-emerald-400 text-xs">
                🟢 {stats.distribution.low}
              </Badge>
              <Badge className="bg-yellow-900 text-yellow-400 text-xs">
                🟡 {stats.distribution.medium}
              </Badge>
              <Badge className="bg-orange-900 text-orange-400 text-xs">
                🔴 {stats.distribution.high}
              </Badge>
              <Badge className="bg-red-900 text-red-400 text-xs">
                🔴🔴 {stats.distribution.critical}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-2">Risk Distribution</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="features">Features ({filteredFeatures.length})</TabsTrigger>
          <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">🟢 Low (0-20)</SelectItem>
                  <SelectItem value="medium">🟡 Medium (21-50)</SelectItem>
                  <SelectItem value="high">🔴 High (51-75)</SelectItem>
                  <SelectItem value="critical">🔴🔴 Critical (76-100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={downloadRiskReport} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>

          {loading ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                Loading feature risks...
              </CardContent>
            </Card>
          ) : filteredFeatures.length === 0 ? (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                No features found for selected filter
              </CardContent>
            </Card>
          ) : (
            filteredFeatures
              .sort((a, b) => b.risk_score - a.risk_score)
              .map((feature) => {
                const riskConfig = getRiskIndicator(feature.risk_level);
                return (
                  <Card 
                    key={feature.id} 
                    className={`bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 ${riskConfig.borderColor} border-slate-700`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{feature.feature_name}</CardTitle>
                            <Badge className={`${riskConfig.bgColor} ${riskConfig.borderColor} ${riskConfig.textColor}`}>
                              {riskConfig.emoji} {riskConfig.label}
                            </Badge>
                            <Badge className={statusColors[feature.status as keyof typeof statusColors]}>
                              {feature.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-300">
                            {feature.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${getRiskScoreColor(feature.risk_score)}`}>
                            {feature.risk_score}
                          </p>
                          <p className="text-xs text-slate-500">Risk Score</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Risk Score Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Risk Level</span>
                          <span>{feature.risk_score}%</span>
                        </div>
                        {getRiskScoreBar(feature.risk_score)}
                      </div>

                      {/* Risk Factors */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-slate-950 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Complexity</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(i => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-4 mx-0.5 rounded-sm ${
                                    i <= feature.risk_factors.complexity 
                                      ? 'bg-cyan-500' 
                                      : 'bg-slate-700'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-300">{feature.risk_factors.complexity}/5</span>
                          </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Business Impact</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(i => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-4 mx-0.5 rounded-sm ${
                                    i <= feature.risk_factors.impact 
                                      ? 'bg-amber-500' 
                                      : 'bg-slate-700'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-300">{feature.risk_factors.impact}/5</span>
                          </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-400 mb-1">Vendor Dependencies</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(i => (
                                <div 
                                  key={i} 
                                  className={`w-2 h-4 mx-0.5 rounded-sm ${
                                    i <= feature.risk_factors.vendor_dependencies 
                                      ? 'bg-purple-500' 
                                      : 'bg-slate-700'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-slate-300">{feature.risk_factors.vendor_dependencies}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Mitigations */}
                      {feature.mitigations && feature.mitigations.length > 0 && (
                        <div className="bg-slate-950 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-400 mb-2">Mitigations Applied</p>
                          <div className="flex flex-wrap gap-2">
                            {feature.mitigations.map((mitigation, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-emerald-900/20 border-emerald-700 text-emerald-300"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {mitigation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="grid md:grid-cols-4 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <FileCode className="h-4 w-4" />
                          <span className="truncate font-mono text-xs text-cyan-400">
                            {feature.file_path}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(feature.deploy_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Bug className={`h-4 w-4 ${feature.bugs_found > 0 ? 'text-red-400' : 'text-slate-400'}`} />
                          <span className={feature.bugs_found > 0 ? 'text-red-400' : 'text-slate-400'}>
                            {feature.bugs_found} bugs post-deploy
                          </span>
                        </div>
                        {feature.notes && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <AlertCircle className="h-4 w-4" />
                            <span className="truncate">{feature.notes}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        {/* Risk Matrix Tab */}
        <TabsContent value="matrix" className="space-y-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment Matrix</CardTitle>
              <CardDescription>Features plotted by impact vs complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-1 p-4">
                {/* Y-axis label */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-xs text-slate-400 transform -rotate-90 whitespace-nowrap">
                    Impact →
                  </span>
                </div>
                
                {/* Matrix cells */}
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  {[5,4,3,2,1].map(impact => (
                    [1,2,3,4,5].map(complexity => {
                      const cellFeatures = features.filter(
                        f => f.risk_factors.impact === impact && 
                             f.risk_factors.complexity === complexity
                      );
                      const riskLevel = impact * complexity;
                      let bgColor = "bg-emerald-900/30";
                      if (riskLevel > 8) bgColor = "bg-yellow-900/30";
                      if (riskLevel > 15) bgColor = "bg-orange-900/30";
                      if (riskLevel > 20) bgColor = "bg-red-900/30";
                      
                      return (
                        <div 
                          key={`${impact}-${complexity}`}
                          className={`${bgColor} p-2 rounded min-h-[60px] flex flex-col items-center justify-center text-xs`}
                        >
                          {cellFeatures.length > 0 && (
                            <>
                              <span className="font-bold">{cellFeatures.length}</span>
                              <span className="text-[10px] text-slate-400">
                                {cellFeatures.length === 1 ? 'feature' : 'features'}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
                
                {/* X-axis label */}
                <div className="col-span-1"></div>
                <div className="col-span-5 flex justify-center mt-2">
                  <span className="text-xs text-slate-400">Complexity →</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Legend */}
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(riskLevelConfig).map(([level, config]) => (
              <Card key={level} className={`${config.bgColor} border-slate-700`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.emoji}</span>
                    <div>
                      <p className={`font-bold ${config.textColor}`}>{config.label}</p>
                      <p className="text-xs text-slate-400">Score: {config.range}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2 text-white">
                    {stats.distribution[level as keyof typeof stats.distribution]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Risk Reduction Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-950 rounded border border-slate-700">
                  <p className="text-sm font-medium text-emerald-400">✓ Implement Feature Flags</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Enable gradual rollouts and quick rollbacks
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-700">
                  <p className="text-sm font-medium text-emerald-400">✓ Add Monitoring & Alerts</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time error tracking and performance monitoring
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-700">
                  <p className="text-sm font-medium text-emerald-400">✓ Vendor Fallback Plans</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Alternative paths when third-party services fail
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-700">
                  <p className="text-sm font-medium text-emerald-400">✓ Load Testing</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Stress test before deployment to production
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  High-Risk Features to Watch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {features
                    .filter(f => f.risk_score >= 50)
                    .sort((a, b) => b.risk_score - a.risk_score)
                    .slice(0, 5)
                    .map(feature => (
                      <div key={feature.id} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                        <span className="text-sm truncate flex-1">{feature.feature_name}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                feature.risk_score > 75 ? 'bg-red-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${feature.risk_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono w-8 text-right">
                            {feature.risk_score}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                Deployment Safety Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">Pre-Deploy</p>
                  {["Code review completed", "Unit tests passing", "Integration tests passing", "Security scan passed"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">Deploy</p>
                  {["Feature flag enabled", "Canary deployment", "Rollback plan ready", "Monitoring active"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">Post-Deploy</p>
                  {["Error rates normal", "Performance metrics OK", "User feedback positive", "Documentation updated"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
