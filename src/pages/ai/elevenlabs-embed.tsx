import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Phone, Brain, Shield } from "lucide-react";
import { LIVE_AGENT_IDS } from "@/utils/elevenlabs-integration";

// ElevenLabs widget embed component

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  embedId: string;
  color: string;
  icon: React.ReactNode;
}

const AGENTS: AgentConfig[] = [
  {
    id: "general-help",
    name: "General Help & Support",
    description: "Get instant answers about Velocity features, navigation help, and general support",
    embedId: LIVE_AGENT_IDS.GENERAL_HELP,
    color: "blue",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "project-capture",
    name: "Project Capture Agent",
    description: "Report project status, flag risks, and provide updates through guided conversation",
    embedId: LIVE_AGENT_IDS.PROJECT_CAPTURE,
    color: "purple",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "asset-inventory",
    name: "Asset & Inventory Manager",
    description: "Check out equipment, manage inventory, and handle new hire kit assignments",
    embedId: LIVE_AGENT_IDS.ASSET_INVENTORY,
    color: "green",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: "contract-specialist",
    name: "Contract Specialist",
    description: "Get help with specific agreements, SOW terms, and contract compliance questions",
    embedId: LIVE_AGENT_IDS.CONTRACT_SPECIALIST,
    color: "orange",
    icon: <Phone className="h-5 w-5" />,
  },
];

export default function ElevenLabsEmbed() {
  const [activeAgent, setActiveAgent] = useState<string>("general-help");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load ElevenLabs script once
  if (!scriptLoaded && typeof window !== 'undefined') {
    const existingScript = document.querySelector('script[src*="elevenlabs"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }

  const currentAgent = AGENTS.find(a => a.id === activeAgent) || AGENTS[0];

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
          VINessa AI Agents - Live Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Click an agent below to start a conversation. These are LIVE ElevenLabs agents connected to Velocity.
        </p>
      </div>

      <Tabs value={activeAgent} onValueChange={setActiveAgent} className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-2 h-auto p-1 bg-gray-100">
          {AGENTS.map((agent) => (
            <TabsTrigger
              key={agent.id}
              value={agent.id}
              className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-white data-[state=active]:shadow-lg"
            >
              <div className={`p-2 rounded-full bg-${agent.color}-100`}>
                {agent.icon}
              </div>
              <span className="text-xs font-medium text-center">{agent.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {AGENTS.map((agent) => (
          <TabsContent key={agent.id} value={agent.id} className="space-y-4">
            <Card className="border-2 border-blue-300 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-blue-100 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      {agent.icon}
                      {agent.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {agent.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 mb-4">
                  <h3 className="font-semibold mb-2">How to use:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Click the chat bubble in the bottom right corner</li>
                    <li>Allow microphone access when prompted</li>
                    <li>Start speaking naturally - the agent will respond</li>
                    <li>Ask questions or give commands related to this agent's specialty</li>
                  </ol>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <h3 className="font-semibold mb-2">Agent ID:</h3>
                  <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                    {agent.embedId}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* ElevenLabs Widget Embed - Using HTML directly */}
            <div className="fixed bottom-4 right-4 z-50">
              <div dangerouslySetInnerHTML={{ 
                __html: `<elevenlabs-convai agent-id="${agent.embedId}"></elevenlabs-convai>` 
              }} />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Instructions Card */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-yellow-50 to-white">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b-2 border-yellow-200">
          <CardTitle>Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Sample Questions for Each Agent:</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-blue-600">General Help:</span>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    <li>"How do I create a new purchase order?"</li>
                    <li>"Show me how to approve timecards"</li>
                    <li>"What reports are available?"</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-purple-600">Project Capture:</span>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    <li>"I need to report project status"</li>
                    <li>"The Building B project is at risk"</li>
                    <li>"We have a budget crisis"</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-green-600">Asset Manager:</span>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    <li>"Check out a laptop for John Smith"</li>
                    <li>"New hire engineer kit for Sarah"</li>
                    <li>"Return equipment from Mike Johnson"</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-orange-600">Contract Specialist:</span>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    <li>"What's the scope of SOW-2024-0042?"</li>
                    <li>"Are change orders allowed?"</li>
                    <li>"Check compliance for Building B contract"</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Technical Notes:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>Agents use ElevenLabs Conversational AI technology</li>
                <li>Voice recognition works in multiple languages</li>
                <li>Responses are generated in real-time</li>
                <li>Each agent has specialized knowledge domains</li>
                <li>Conversations are not recorded in demo mode</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}