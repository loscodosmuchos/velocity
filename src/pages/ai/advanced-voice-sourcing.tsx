import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  ExternalLink,
  Code,
  Bot,
  Loader2,
  AlertCircle,
  Headphones,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Briefcase,
} from "lucide-react";
import { fetchAllElevenLabsAgents, type AgentWithLinks } from "@/utils/fetch-elevenlabs-agents";
import { cn } from "@/lib/utils";

type PersonaView = "hiring-manager" | "recruiter" | "finance";

interface MetricCard {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export default function AdvancedVoiceSourcing() {
  const [agents, setAgents] = useState<AgentWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [personaView, setPersonaView] = useState<PersonaView>("hiring-manager");

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAgents = await fetchAllElevenLabsAgents();
      setAgents(fetchedAgents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, agentId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(agentId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400/60 mx-auto" />
            <Headphones className="h-6 w-6 text-cyan-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-300 text-sm font-medium">Loading voice sourcing intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-red-500/20">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-5 w-5" />
              <CardTitle className="text-sm">Error Loading Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-xs mb-4">{error}</p>
            <Button onClick={loadAgents} className="h-7 text-xs bg-cyan-600 hover:bg-cyan-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock business metrics (would connect to real data)
  const metrics = {
    "hiring-manager": {
      title: "Pipeline Velocity",
      subtitle: "Time-to-fill acceleration",
      cards: [
        { label: "Roles Filled (This Week)", value: "8", change: 12, icon: <Briefcase className="h-4 w-4" />, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
        { label: "Avg Time-to-Fill", value: "3.2 days", change: -18, icon: <Clock className="h-4 w-4" />, color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30" },
        { label: "Active Requisitions", value: "24", change: 5, icon: <Target className="h-4 w-4" />, color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
        { label: "Placement Rate", value: "87%", change: 8, icon: <TrendingUp className="h-4 w-4" />, color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
      ] as MetricCard[],
    },
    recruiter: {
      title: "Sourcing Performance",
      subtitle: "Candidate quality & conversion",
      cards: [
        { label: "Candidates Screened", value: "284", change: 24, icon: <Users className="h-4 w-4" />, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
        { label: "Placement Conversion", value: "32%", change: 6, icon: <BarChart3 className="h-4 w-4" />, color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30" },
        { label: "Time Saved (Hours)", value: "156", change: 42, icon: <Zap className="h-4 w-4" />, color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
        { label: "Candidate Quality Score", value: "4.6/5", change: 3, icon: <CheckCircle2 className="h-4 w-4" />, color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
      ] as MetricCard[],
    },
    finance: {
      title: "Cost Per Hire Analysis",
      subtitle: "ROI & budget optimization",
      cards: [
        { label: "Cost Per Hire (Voice)", value: "$150", change: -22, icon: <DollarSign className="h-4 w-4" />, color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
        { label: "ROI vs Traditional", value: "$2.8M", change: 35, icon: <TrendingUp className="h-4 w-4" />, color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30" },
        { label: "Budget Utilization", value: "64%", change: 8, icon: <BarChart3 className="h-4 w-4" />, color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
        { label: "Cost Savings (YTD)", value: "$1.2M", change: 41, icon: <Zap className="h-4 w-4" />, color: "from-violet-500/20 to-purple-500/20 border-violet-500/30" },
      ] as MetricCard[],
    },
  };

  const currentMetrics = metrics[personaView];

  return (
    <div className="space-y-6">
      {/* Premium Header - Clean Corporate */}
      <div className="border-b border-slate-700/20 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <Headphones className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Advanced Voice Sourcing</h1>
              <p className="text-slate-400 text-xs mt-2">{currentMetrics.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{agents.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Active Agents</div>
          </div>
        </div>
      </div>

      {/* Persona Selector - Clean & Modern */}
      <div className="flex flex-wrap gap-3">
        {(["hiring-manager", "recruiter", "finance"] as PersonaView[]).map((view) => {
          const labels = {
            "hiring-manager": "Hiring Manager",
            recruiter: "Recruiter",
            finance: "Finance & Procurement",
          };
          const icons = {
            "hiring-manager": <Briefcase className="h-3.5 w-3.5" />,
            recruiter: <Users className="h-3.5 w-3.5" />,
            finance: <DollarSign className="h-3.5 w-3.5" />,
          };

          return (
            <button
              key={view}
              onClick={() => setPersonaView(view)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 border",
                personaView === view
                  ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200"
                  : "bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600/50"
              )}
            >
              {icons[view]}
              {labels[view]}
            </button>
          );
        })}
      </div>

      {/* Business Metrics Grid - Clean Professional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentMetrics.cards.map((metric, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-lg border p-4 transition-all duration-200 hover:border-slate-600/50",
              `${metric.color}`
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded text-slate-400">{metric.icon}</div>
                <span className="text-xs font-medium text-slate-400">{metric.label}</span>
              </div>
              {metric.change !== undefined && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    metric.change >= 0 ? "text-emerald-400" : "text-amber-400"
                  )}
                >
                  {metric.change >= 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                </span>
              )}
            </div>
            <div className="text-2xl font-semibold text-white">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* AI Disclaimer - Professional Notice */}
      <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3.5">
        <div className="flex gap-3 items-start">
          <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-medium text-slate-300">AI-Generated Data:</span> Voice sourcing metrics leverage intelligent algorithms. Verify all recommendations against actual candidate data and recruitment performance metrics before making business decisions.
          </p>
        </div>
      </div>

      {/* Agent Configuration Section */}
      <div className="space-y-4 pt-4 border-t border-slate-700/20">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bot className="h-4 w-4 text-slate-400" />
            Agent Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">Technical access for development and integration</p>
        </div>

        {agents.length === 0 ? (
          <Card className="bg-slate-800/40 border-slate-700/30">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-5 w-5 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No voice agents configured</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.agent_id}
                className="rounded-lg border border-slate-700/30 bg-slate-800/20 hover:border-slate-600/40 transition-colors p-3"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{agent.name}</h3>
                    <code className="text-xs text-slate-400 font-mono mt-1 block truncate">
                      {agent.agent_id}
                    </code>
                  </div>
                  <Badge className="flex-shrink-0 bg-emerald-500/15 text-emerald-300 border-emerald-500/20">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                    Active
                  </Badge>
                </div>

                <Tabs defaultValue="links" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-7 bg-slate-800/40 border border-slate-700/30 p-0.5">
                    <TabsTrigger
                      value="links"
                      className="text-xs data-[state=active]:bg-slate-700/50 h-6"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Links
                    </TabsTrigger>
                    <TabsTrigger
                      value="embed"
                      className="text-xs data-[state=active]:bg-slate-700/50 h-6"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Embed
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="links" className="space-y-2 mt-3">
                    {agent.widgetLink && (
                      <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <label className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                            Widget URL
                          </label>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 px-2 text-[10px]"
                            onClick={() => copyToClipboard(agent.widgetLink, `widget-${agent.agent_id}`)}
                          >
                            {copiedId === `widget-${agent.agent_id}` ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <code className="text-[10px] bg-slate-950/50 px-2 py-1 rounded block font-mono text-slate-400 border border-slate-700/30 break-all">
                          {agent.widgetLink}
                        </code>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="embed" className="space-y-2 mt-3">
                    <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/30">
                      <label className="text-[10px] font-medium text-slate-300 uppercase tracking-wider block mb-1.5">
                        Embed Code
                      </label>
                      <code className="text-[10px] bg-slate-950/50 px-2 py-1 rounded block font-mono text-slate-400 border border-slate-700/30 break-all max-h-16 overflow-y-auto">
                        {`<iframe src="${agent.widgetLink}" style="width:100%;height:600px;border:none;border-radius:8px;" />`}
                      </code>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="rounded-lg border border-slate-700/20 bg-slate-900/30 p-3 text-center">
        <p className="text-[11px] text-slate-500">
          Voice sourcing powered by advanced intelligent agents. Metrics update in real-time.
        </p>
      </div>
    </div>
  );
}
