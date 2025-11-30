import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Copy, 
  ExternalLink, 
  Code, 
  TestTube, 
  Bot, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Webhook,
  ArrowRight,
  MessageSquare,
  Database,
  Sparkles,
  Info,
  Headphones,
  Mic,
  Volume2,
  Play,
  Workflow,
  Tag,
  FileText
} from "lucide-react";
import { fetchAllElevenLabsAgents, type AgentWithLinks } from "@/utils/fetch-elevenlabs-agents";
import { cn } from "@/lib/utils";

export default function ElevenLabsAgentsDashboard() {
  const [agents, setAgents] = useState<AgentWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Failed to load agents');
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
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-pink-300 mx-auto mb-4" />
            <Headphones className="h-8 w-8 text-pink-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-300 text-lg">Connecting to ElevenLabs...</p>
          <p className="text-slate-300 text-sm mt-1">Fetching your voice AI agents</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-red-500/30">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-6 w-6" />
              <CardTitle className="text-red-200">Error Loading Agents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">{error}</p>
            <Button onClick={loadAgents} className="bg-pink-600 hover:bg-pink-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8 p-6 w-full max-w-none">
        {/* Legendary Header - Damascus Steel with Pink/Magenta Accent */}
        <div 
          className="relative rounded-xl overflow-hidden border-2 border-pink-500/30"
          style={{
            background: [
              'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(236, 72, 153, 0.03) 2px, rgba(236, 72, 153, 0.03) 4px)',
              'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(168, 85, 247, 0.03) 2px, rgba(168, 85, 247, 0.03) 4px)',
              'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 25%, rgba(51,65,85,0.9) 50%, rgba(30,41,59,0.95) 75%, rgba(15,23,42,0.98) 100%)'
            ].join(', ')
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-purple-500/5" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/30">
                  <Headphones className="h-10 w-10 text-pink-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    ElevenLabs Conversational Agents
                    <Badge className="bg-pink-500/20 text-pink-200 border-pink-400/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Voice AI
                    </Badge>
                  </h1>
                  <p className="text-slate-300 mt-1">
                    Complete directory of your AI agents with IDs, links, and embed codes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-slate-800/60 rounded-lg p-4 text-center border border-slate-700/50 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-pink-300">{agents.length}</div>
                  <div className="text-slate-300 text-xs uppercase tracking-wider">Total Agents</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Banner - Authentic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Mic className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-200">{agents.length}</div>
                    <div className="text-slate-300 text-xs">Active Agents</div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700">
              <p className="text-sm text-slate-200">Voice AI agents fetched from your ElevenLabs account ready to capture data through natural conversation.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Code className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-200">{agents.length}</div>
                    <div className="text-slate-300 text-xs">Widget Embeds</div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700">
              <p className="text-sm text-slate-200">Embeddable widgets for any webpage. Users can interact with voice agents directly on your site.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/30 hover:border-amber-400/50 transition-all cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <ExternalLink className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-200">{agents.length}</div>
                    <div className="text-slate-300 text-xs">ElevenLabs URLs</div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700">
              <p className="text-sm text-slate-200">Direct links to each agent's ElevenLabs dashboard, test interface, and external API.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-pink-500/30 hover:border-pink-400/50 transition-all cursor-help">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <Phone className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-pink-200">Coming Soon</div>
                    <div className="text-slate-300 text-xs">Batch Calls</div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-slate-700">
              <p className="text-sm text-slate-200">Schedule outbound voice calls for bulk data capture. Feature in development - contact admin to enable.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Voice-to-Database Capture Flow Section */}
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-violet-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Workflow className="h-5 w-5 text-violet-400" />
              Voice-to-Database Capture Flow
            </CardTitle>
            <CardDescription className="text-slate-300">
              Conceptual workflow for voice-to-database integration (planned feature)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 p-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
              <div className="flex flex-col items-center text-center w-32">
                <div className="p-3 rounded-full bg-pink-500/20 border border-pink-400/30 mb-2">
                  <Mic className="h-6 w-6 text-pink-300" />
                </div>
                <span className="text-xs font-medium text-slate-200">Voice Input</span>
                <span className="text-[10px] text-slate-300">User speaks</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-slate-500 flex-shrink-0" />
              
              <div className="flex flex-col items-center text-center w-32">
                <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-2">
                  <Bot className="h-6 w-6 text-cyan-300" />
                </div>
                <span className="text-xs font-medium text-slate-200">AI Processing</span>
                <span className="text-[10px] text-slate-300">ElevenLabs agent</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-slate-500 flex-shrink-0" />
              
              <div className="flex flex-col items-center text-center w-32">
                <div className="p-3 rounded-full bg-amber-500/20 border border-amber-400/30 mb-2">
                  <Webhook className="h-6 w-6 text-amber-300" />
                </div>
                <span className="text-xs font-medium text-slate-200">Webhook</span>
                <span className="text-[10px] text-slate-300">Data returned</span>
              </div>
              
              <ArrowRight className="h-5 w-5 text-slate-500 flex-shrink-0" />
              
              <div className="flex flex-col items-center text-center w-32">
                <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 mb-2">
                  <Database className="h-6 w-6 text-emerald-300" />
                </div>
                <span className="text-xs font-medium text-slate-200">Database</span>
                <span className="text-[10px] text-slate-300">Record created</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
              <p className="text-xs text-slate-300">
                <span className="text-amber-300 font-medium">Note:</span> Webhook integration for automatic data capture is planned for a future release. 
                Currently, agents can be tested directly via the ElevenLabs dashboard.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-pink-300" />
              Your Voice Agents
            </h2>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {agents.length} configured
            </Badge>
          </div>

          {agents.map((agent) => {
            const hasFirstMessage = agent.conversation_config?.agent?.first_message;
            const hasPrompt = agent.conversation_config?.agent?.prompt?.prompt;
            const hasTags = agent.tags && agent.tags.length > 0;
            
            return (
              <Card 
                key={agent.agent_id} 
                className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 border-slate-700/50 hover:border-pink-500/30 transition-all shadow-lg"
              >
                <CardHeader className="pb-4 border-b border-slate-700/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/20">
                        <Bot className="h-6 w-6 text-pink-300" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                        <CardDescription className="text-slate-300 mt-1">
                          <code className="bg-slate-800 px-2 py-0.5 rounded text-xs font-mono text-slate-300">{agent.agent_id}</code>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 border border-slate-700/80 mb-6 p-1 gap-1">
                      <TabsTrigger value="info" className="bg-slate-700/60 text-slate-300 data-[state=active]:bg-pink-600 data-[state=active]:text-white rounded-md transition-all">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="links" className="bg-slate-700/60 text-slate-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-md transition-all">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Links
                      </TabsTrigger>
                      <TabsTrigger value="embed" className="bg-slate-700/60 text-slate-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-md transition-all">
                        <Code className="h-3.5 w-3.5 mr-1.5" />
                        Embed
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="mt-6 space-y-4">
                      {hasFirstMessage && (
                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="h-4 w-4 text-pink-300" />
                            <span className="text-sm font-medium text-slate-200">First Message</span>
                          </div>
                          <p className="text-slate-300 text-sm italic">
                            "{agent.conversation_config?.agent?.first_message}"
                          </p>
                        </div>
                      )}
                      
                      {hasPrompt && (
                        <Accordion type="single" collapsible>
                          <AccordionItem value="prompt" className="bg-slate-800/40 rounded-lg border-slate-700/50 px-4">
                            <AccordionTrigger className="text-sm text-slate-200 hover:text-white py-3">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-cyan-300" />
                                Agent System Prompt
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30 max-h-48 overflow-y-auto">
                                <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                                  {agent.conversation_config?.agent?.prompt?.prompt}
                                </pre>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                      
                      {hasTags && (
                        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-amber-300" />
                            <span className="text-sm font-medium text-slate-200">Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {agent.tags?.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="bg-slate-800/50 text-slate-200 border-slate-600 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {agent.created_at && (
                        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-emerald-300" />
                            <span className="text-sm font-medium text-slate-200">Created</span>
                          </div>
                          <p className="text-slate-300 text-sm">{new Date(agent.created_at).toLocaleString()}</p>
                        </div>
                      )}
                      
                      {!hasFirstMessage && !hasPrompt && !hasTags && (
                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 text-center">
                          <Info className="h-5 w-5 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-300 text-sm">
                            No additional details available. Configure this agent in the ElevenLabs dashboard.
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="links" className="space-y-4 mt-6">
                      <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Bot className="h-3.5 w-3.5 text-pink-300" />
                            Agent ID
                          </label>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs hover:bg-pink-500/10"
                            onClick={() => copyToClipboard(agent.agent_id, `id-${agent.agent_id}`)}
                          >
                            {copiedId === `id-${agent.agent_id}` ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                        <code className="text-xs bg-slate-900/50 px-3 py-2 rounded block font-mono text-slate-200 border border-slate-700/30">
                          {agent.agent_id}
                        </code>
                      </div>

                      <div className="bg-cyan-950/30 rounded-lg p-3 border border-cyan-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-cyan-200 uppercase tracking-wider flex items-center gap-2">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Widget Dashboard
                          </label>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs hover:bg-cyan-500/10"
                              onClick={() => copyToClipboard(agent.widgetLink, `widget-${agent.agent_id}`)}
                            >
                              {copiedId === `widget-${agent.agent_id}` ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs hover:bg-cyan-500/10"
                              onClick={() => window.open(agent.widgetLink, '_blank')}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <code className="text-xs bg-slate-900/50 px-3 py-2 rounded block font-mono text-cyan-200 border border-cyan-700/30 break-all">
                          {agent.widgetLink}
                        </code>
                      </div>

                      <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                            <TestTube className="h-3.5 w-3.5" />
                            Test/Demo Link
                          </label>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs hover:bg-purple-500/10"
                              onClick={() => copyToClipboard(agent.testLink, `test-${agent.agent_id}`)}
                            >
                              {copiedId === `test-${agent.agent_id}` ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-purple-600 hover:bg-purple-700"
                              onClick={() => window.open(agent.testLink, '_blank')}
                            >
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Test
                            </Button>
                          </div>
                        </div>
                        <code className="text-xs bg-slate-900/50 px-3 py-2 rounded block font-mono text-purple-200 border border-purple-700/30 break-all">
                          {agent.testLink}
                        </code>
                      </div>

                      <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-emerald-200 uppercase tracking-wider flex items-center gap-2">
                            <Code className="h-3.5 w-3.5" />
                            ElevenLabs API
                          </label>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs hover:bg-emerald-500/10"
                            onClick={() => copyToClipboard(agent.apiLink, `api-${agent.agent_id}`)}
                          >
                            {copiedId === `api-${agent.agent_id}` ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                        <code className="text-xs bg-slate-900/50 px-3 py-2 rounded block font-mono text-emerald-200 border border-emerald-700/30 break-all">
                          {agent.apiLink}
                        </code>
                      </div>
                    </TabsContent>

                    <TabsContent value="embed" className="mt-6">
                      <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                            <Code className="h-4 w-4 text-amber-300" />
                            Widget Embed Code
                          </label>
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => copyToClipboard(agent.embedCode, `embed-${agent.agent_id}`)}
                          >
                            {copiedId === `embed-${agent.agent_id}` ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1.5 text-white" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1.5" />
                                Copy Code
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs bg-slate-900 text-emerald-300 px-4 py-3 rounded-lg overflow-x-auto font-mono border border-slate-700/50">
{agent.embedCode}
                        </pre>
                        <p className="text-xs text-slate-300 mt-3 flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" />
                          Paste this code into any HTML page to embed the conversational agent widget.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {agents.length === 0 && (
          <Card className="p-12 text-center bg-slate-800/50 border-slate-700">
            <Bot className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No Agents Found</h3>
            <p className="text-slate-300">
              You don't have any conversational agents yet. Create one in the ElevenLabs dashboard.
            </p>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
