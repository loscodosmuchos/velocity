/**
 * Voice Panel - Voice-First Admin Interface
 * Voice command center with Chrome Speech API + ElevenLabs integration
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Volume2, VolumeX, Zap, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  VoiceCommander,
  VoiceNarrator,
  createNavigationCommands,
  createWorkflowCommands,
  isVoiceRecognitionSupported,
  isSpeechSynthesisSupported,
  VELOCITY_VOICE_COMMANDS,
} from "@/utils/voice-commander";

export default function VoicePanelPage() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<Array<{ timestamp: string; command: string; success: boolean }>>(
    [],
  );
  const [error, setError] = useState<string>("");

  const commanderRef = useRef<VoiceCommander | null>(null);
  const narratorRef = useRef<VoiceNarrator | null>(null);

  useEffect(() => {
    // Initialize voice commander and narrator
    narratorRef.current = new VoiceNarrator();
    commanderRef.current = new VoiceCommander({
      language: "en-US",
      continuous: true,
      interimResults: false,
    });

    // Setup callbacks
    commanderRef.current.onResult((text, conf) => {
      setTranscript(text);
      setConfidence(conf);
      setLastCommand(text);

      // Add to history
      setCommandHistory((prev) => [
        { timestamp: new Date().toISOString(), command: text, success: true },
        ...prev.slice(0, 9),
      ]);
    });

    commanderRef.current.onError((err) => {
      setError(err);
      setTimeout(() => setError(""), 5000);
    });

    commanderRef.current.onStatus((status) => {
      setIsListening(status === "listening");
    });

    // Register commands
    const navCommands = createNavigationCommands(navigate, narratorRef.current);
    const workflowCommands = createWorkflowCommands(navigate, narratorRef.current);

    commanderRef.current.registerCommands([...navCommands, ...workflowCommands]);

    // Welcome message
    if (narrationEnabled && narratorRef.current) {
      narratorRef.current.speakBrowser("Voice command center ready. Press the microphone button to start.");
    }

    return () => {
      commanderRef.current?.stop();
      narratorRef.current?.stop();
    };
  }, [navigate]);

  const toggleListening = () => {
    if (!commanderRef.current) return;

    if (isListening) {
      commanderRef.current.stop();
      if (narrationEnabled) {
        narratorRef.current?.speakBrowser("Voice commands stopped");
      }
    } else {
      commanderRef.current.start();
      if (narrationEnabled) {
        narratorRef.current?.speakBrowser("Listening for voice commands");
      }
    }
  };

  const toggleNarration = (enabled: boolean) => {
    setNarrationEnabled(enabled);
    if (enabled) {
      narratorRef.current?.speakBrowser("Voice narration enabled");
    }
  };

  const speakText = (text: string) => {
    narratorRef.current?.speakBrowser(text);
  };

  if (!isVoiceRecognitionSupported()) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Voice Command Center</h1>
        <p className="text-muted-foreground">Hands-free navigation and control for Velocity</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Voice Control Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Voice Control</CardTitle>
            <CardDescription>Click the microphone to start listening for voice commands</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className="h-24 w-24 rounded-full"
                onClick={toggleListening}>
                {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
              </Button>
            </div>

            {/* Status */}
            <div className="text-center">
              <Badge variant={isListening ? "default" : "secondary"} className="text-lg px-4 py-2">
                {isListening ? "🎙️ Listening..." : "⏸️ Stopped"}
              </Badge>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Last Command:</p>
                <p className="text-lg font-medium">{transcript}</p>
                {confidence > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">Confidence: {(confidence * 100).toFixed(0)}%</p>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="narration">Voice Narration</Label>
              </div>
              <Switch id="narration" checked={narrationEnabled} onCheckedChange={toggleNarration} />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Commands */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Commands</CardTitle>
            <CardDescription>Say these phrases to navigate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {VELOCITY_VOICE_COMMANDS.navigation.slice(0, 8).map((cmd) => (
                <div key={cmd.phrase} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <span className="text-sm">"{cmd.phrase}"</span>
                  <Button variant="ghost" size="sm" onClick={() => speakText(cmd.phrase)}>
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Commands */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Commands</CardTitle>
            <CardDescription>Say these to trigger actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {VELOCITY_VOICE_COMMANDS.workflow.slice(0, 8).map((cmd) => (
                <div key={cmd.phrase} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <span className="text-sm">"{cmd.phrase}"</span>
                  <Button variant="ghost" size="sm" onClick={() => speakText(cmd.phrase)}>
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Command History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Command History</CardTitle>
            <CardDescription>Recent voice commands</CardDescription>
          </CardHeader>
          <CardContent>
            {commandHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No commands yet. Start speaking!</p>
            ) : (
              <div className="space-y-2">
                {commandHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.command}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <Badge variant={item.success ? "default" : "destructive"}>
                      {item.success ? "Executed" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <Zap className="inline h-5 w-5 mr-2" />
              Quick Access
            </CardTitle>
            <CardDescription>Voice-activated dashboards and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button variant="outline" onClick={() => navigate("/admin/voice-dashboards/recruiter")}>
                🎯 Recruiter Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/voice-dashboards/manager")}>
                👔 Manager Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/voice-dashboards/finance")}>
                💵 Finance Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/voice-dashboards/operations")}>
                ⚙️ Operations Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/voice-dashboards/admin")}>
                🔧 Admin Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/import-xlsx")}>
                📊 XLSX Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
