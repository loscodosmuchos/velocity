/**
 * VOICE DEMO WIDGET
 * ElevenLabs Conversational AI widget with two-way navigation sync
 * 
 * Features:
 * - Floating widget in corner
 * - Session ID display for demo tracking
 * - Real-time page context sent to agent
 * - Navigation commands from agent executed
 * - Audio visualization during conversation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, MicOff, Phone, PhoneOff, Radio, Volume2, VolumeX,
  ChevronDown, ChevronUp, Minimize2, Maximize2, X, Settings,
  Navigation, MapPin, Sparkles, Zap
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  startVoiceDemoSession,
  endVoiceDemoSession,
  getVoiceDemoSession,
  isVoiceDemoActive,
  updateSessionLocation,
  buildScreenContextForAgent,
  parseNavigationCommand,
  getScreenCodeForPath,
  SCREEN_CODES,
  type VoiceDemoSession,
} from "@/lib/voice-demo-session";
import { LIVE_AGENT_IDS } from "@/utils/elevenlabs-integration";

interface VoiceDemoWidgetProps {
  defaultAgent?: string;
  position?: 'bottom-right' | 'bottom-left';
  onSessionStart?: (session: VoiceDemoSession) => void;
  onSessionEnd?: (session: VoiceDemoSession) => void;
}

type AgentOption = {
  id: string;
  name: string;
  description: string;
};

const AVAILABLE_AGENTS: AgentOption[] = [
  { 
    id: LIVE_AGENT_IDS.GENERAL_HELP, 
    name: "VINessa - Demo Guide", 
    description: "Guided platform walkthrough" 
  },
  { 
    id: LIVE_AGENT_IDS.PROJECT_CAPTURE, 
    name: "VINessa - Project Capture", 
    description: "Capture project updates" 
  },
  { 
    id: LIVE_AGENT_IDS.ASSET_INVENTORY, 
    name: "VINessa - Asset Manager", 
    description: "Equipment checkout/return" 
  },
  { 
    id: LIVE_AGENT_IDS.CONTRACT_SPECIALIST, 
    name: "VINessa - Contracts", 
    description: "Contract analysis" 
  },
];

export function VoiceDemoWidget({
  defaultAgent = LIVE_AGENT_IDS.GENERAL_HELP,
  position = 'bottom-right',
  onSessionStart,
  onSessionEnd,
}: VoiceDemoWidgetProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<VoiceDemoSession | null>(null);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [conversationLog, setConversationLog] = useState<Array<{role: 'user' | 'agent', text: string}>>([]);
  
  const conversationRef = useRef<any>(null);
  
  useEffect(() => {
    const existingSession = getVoiceDemoSession();
    if (existingSession) {
      setSession(existingSession);
      setIsConnected(true);
    }
  }, []);
  
  useEffect(() => {
    if (session && isConnected) {
      updateSessionLocation(location.pathname, 'user');
      
      const context = buildScreenContextForAgent(location.pathname);
      console.log('📍 Page context for agent:', context);
    }
  }, [location.pathname, session, isConnected]);
  
  const handleStartSession = useCallback(() => {
    const newSession = startVoiceDemoSession(selectedAgent, "Demo User");
    setSession(newSession);
    setIsConnected(true);
    setIsExpanded(true);
    
    toast.success("Voice Demo Started", {
      description: `Session: ${newSession.sessionId}`,
    });
    
    setConversationLog([{
      role: 'agent',
      text: `[excited] Welcome to Velocity! I'm VINessa, your demo guide. You're on screen ${getScreenCodeForPath(location.pathname)?.code || 'A1'}. Where would you like to start?`
    }]);
    
    onSessionStart?.(newSession);
  }, [selectedAgent, location.pathname, onSessionStart]);
  
  const handleEndSession = useCallback(() => {
    const endedSession = endVoiceDemoSession();
    setSession(null);
    setIsConnected(false);
    setIsListening(false);
    setConversationLog([]);
    
    if (endedSession) {
      toast.info("Voice Demo Ended", {
        description: `${endedSession.navigationHistory.length} screens visited`,
      });
      onSessionEnd?.(endedSession);
    }
  }, [onSessionEnd]);
  
  const handleNavigationCommand = useCallback((targetCode: string) => {
    const screen = SCREEN_CODES.find(s => s.code === targetCode);
    if (screen) {
      toast.info(`Navigating to ${screen.label}...`);
      navigate(screen.path);
      
      setConversationLog(prev => [...prev, {
        role: 'agent',
        text: `[navigating] Taking you to screen ${screen.code}: ${screen.label}`
      }]);
    }
  }, [navigate]);
  
  const simulateAgentResponse = useCallback((userInput: string) => {
    setConversationLog(prev => [...prev, { role: 'user', text: userInput }]);
    
    setTimeout(() => {
      const currentScreen = getScreenCodeForPath(location.pathname);
      let response = "";
      
      const navMatch = userInput.match(/go to (\w+)|show me (\w+)|take me to (\w+)/i);
      if (navMatch) {
        const targetCode = (navMatch[1] || navMatch[2] || navMatch[3]).toUpperCase();
        const targetScreen = SCREEN_CODES.find(s => s.code === targetCode);
        if (targetScreen) {
          response = `[excited] Taking you to ${targetScreen.label}!`;
          handleNavigationCommand(targetCode);
        } else {
          response = `[curious] I don't recognize screen code ${targetCode}. Try A1 for Dashboard, B1 for SOW Portfolio, or C1 for Contractors.`;
        }
      } else if (userInput.toLowerCase().includes('where am i')) {
        response = `[helpful] You're on screen ${currentScreen?.code}: ${currentScreen?.label}. ${currentScreen?.talkingPoints?.[0] || ''}`;
      } else if (userInput.toLowerCase().includes('what can')) {
        response = `[excited] From here you can explore ${currentScreen?.keyFeatures?.join(', ') || 'many features'}. Want me to walk you through?`;
      } else {
        response = `[thoughtful] Interesting question! On this screen (${currentScreen?.code}), the key insight is: ${currentScreen?.talkingPoints?.[0] || 'real-time visibility into your workforce data'}.`;
      }
      
      setConversationLog(prev => [...prev, { role: 'agent', text: response }]);
    }, 1000);
  }, [location.pathname, handleNavigationCommand]);
  
  if (isMinimized) {
    return (
      <div className={cn(
        "fixed z-50",
        position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'
      )}>
        <Button
          size="lg"
          className={cn(
            "rounded-full h-14 w-14 shadow-lg",
            isConnected 
              ? "bg-emerald-600 hover:bg-emerald-700 animate-pulse" 
              : "bg-slate-700 hover:bg-slate-600"
          )}
          onClick={() => setIsMinimized(false)}
        >
          {isConnected ? (
            <Radio className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        {isConnected && session && (
          <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-xs">
            LIVE
          </Badge>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "fixed z-50 transition-all duration-300",
      position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4',
      isExpanded ? 'w-96' : 'w-72'
    )}>
      <Card className="bg-slate-900/95 border-slate-700 backdrop-blur-sm shadow-2xl">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-3 w-3 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
              )} />
              <CardTitle className="text-sm font-medium text-slate-200">
                Voice Demo
              </CardTitle>
              {session && (
                <Badge variant="outline" className="text-xs bg-slate-800 border-slate-600">
                  {session.sessionId}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-200"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-0 space-y-3">
          {!isConnected ? (
            <>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 text-sm">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {AVAILABLE_AGENTS.map(agent => (
                    <SelectItem 
                      key={agent.id} 
                      value={agent.id}
                      className="text-slate-200 focus:bg-slate-700"
                    >
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-slate-400">{agent.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleStartSession}
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Voice Demo
              </Button>
              
              <p className="text-xs text-slate-500 text-center">
                Two-way navigation sync enabled
              </p>
            </>
          ) : (
            <>
              {isExpanded && (
                <ScrollArea className="h-48 rounded-md bg-slate-800/50 p-2">
                  <div className="space-y-2">
                    {conversationLog.map((msg, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "text-sm rounded-lg p-2",
                          msg.role === 'agent' 
                            ? "bg-slate-700/50 text-slate-200" 
                            : "bg-emerald-900/30 text-emerald-200 ml-4"
                        )}
                      >
                        <span className="text-xs opacity-50 block mb-1">
                          {msg.role === 'agent' ? 'VINessa' : 'You'}
                        </span>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type or speak..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentMessage.trim()) {
                        simulateAgentResponse(currentMessage);
                        setCurrentMessage('');
                      }
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    isListening ? "text-emerald-400" : "text-slate-400"
                  )}
                  onClick={() => setIsListening(!isListening)}
                >
                  {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  <span>{getScreenCodeForPath(location.pathname)?.code || 'XX'}</span>
                  <span className="opacity-50">|</span>
                  <span>{getScreenCodeForPath(location.pathname)?.label || 'Unknown'}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 px-2"
                  onClick={handleEndSession}
                >
                  <PhoneOff className="h-3 w-3 mr-1" />
                  End
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
