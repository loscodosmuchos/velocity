import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Zap, Brain, Clock, Shield, Users, FileText } from "lucide-react";

export const PlatformValueCalculator = () => {
  const features = [
    {
      name: "AI Contract Gap Analysis",
      icon: Shield,
      roi: 287500,
      timeSavings: 97,
      description: "Legal counsel contract review automation"
    },
    {
      name: "AI Vendor Data Extraction",
      icon: Brain,
      roi: 125000,
      timeSavings: 99,
      description: "One-click vendor onboarding"
    },
    {
      name: "Coordination Intelligence",
      icon: Zap,
      roi: 250000,
      timeSavings: 80,
      description: "Cross-departmental coordination overhead eliminated"
    },
    {
      name: "Context Intelligence Engine",
      icon: Brain,
      roi: 175000,
      timeSavings: 92,
      description: "500K+ data points learning from enterprise workflows"
    },
    {
      name: "Hidden Productivity Recovery",
      icon: Users,
      roi: 150000,
      timeSavings: 85,
      description: "165 projects managed with 1 fewer PM required"
    },
    {
      name: "Finance Reconciliation Automation",
      icon: DollarSign,
      roi: 100000,
      timeSavings: 88,
      description: "Automated invoice matching and variance detection"
    },
    {
      name: "Contractor Onboarding Optimization",
      icon: Users,
      roi: 100000,
      timeSavings: 90,
      description: "Streamlined hiring, compliance, and assignment workflows"
    },
    {
      name: "Budget Alert System",
      icon: DollarSign,
      roi: 87500,
      timeSavings: 90,
      description: "Proactive budget overrun prevention (25/50/90% thresholds)"
    },
    {
      name: "Infrastructure Risk Management",
      icon: Shield,
      roi: 100000,
      timeSavings: 85,
      description: "EOL tracking and dependency cascade analysis"
    },
    {
      name: "Hybrid AI Search",
      icon: Brain,
      roi: 50000,
      timeSavings: 85,
      description: "Semantic + keyword search with pgvector + BM25"
    },
  ];

  const totalROI = features.reduce((sum, feature) => sum + feature.roi, 0);
  const avgTimeSavings = Math.round(
    features.reduce((sum, feature) => sum + feature.timeSavings, 0) / features.length
  );

  return (
    <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Platform Value Calculator
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Quantified ROI from AI-powered features demonstrating "EXCLAIM vs EXPLAIN" success
            </CardDescription>
          </div>
          <Badge className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700">
            {avgTimeSavings}% Avg Time Savings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Annual ROI */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border-2 border-green-500 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">Total Annual ROI</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${(totalROI / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ${totalROI.toLocaleString()}/year saved across 10 expert perspectives
              </p>
            </div>
            <DollarSign className="h-20 w-20 text-green-500/30" />
          </div>
        </div>

        {/* Feature Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI-Powered Features Breakdown
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm">{feature.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {feature.timeSavings}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {feature.description}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${(feature.roi / 1000).toFixed(0)}K/year
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-3 md:grid-cols-3 pt-4 border-t">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{avgTimeSavings}%</p>
            <p className="text-xs text-muted-foreground">Average Time Savings</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Brain className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{features.length}</p>
            <p className="text-xs text-muted-foreground">AI-Powered Features</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">10</p>
            <p className="text-xs text-muted-foreground">Expert Perspectives</p>
          </div>
        </div>

        {/* ROI Note */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <strong>💡 "EXCLAIM vs EXPLAIN" Success:</strong> Each feature delivers measurable
            wow moments with quantified ROI. After 500K+ data points, Velocity's Context Intelligence
            Engine creates an unreplicable competitive advantage that gets smarter with every deployment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
