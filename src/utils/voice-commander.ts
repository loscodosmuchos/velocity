/**
 * Voice Commander - Chrome Speech API Integration
 * Handles voice recognition, command mapping, and ElevenLabs TTS
 */

export interface VoiceCommand {
  id: string;
  phrase: string;
  category: "navigation" | "workflow" | "query" | "action";
  action: () => void | Promise<void>;
  aliases?: string[];
}

export interface VoiceRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

/**
 * Voice Commander Class
 */
export class VoiceCommander {
  private recognition: any;
  private isListening: boolean = false;
  private commands: Map<string, VoiceCommand> = new Map();
  private onResultCallback?: (transcript: string, confidence: number) => void;
  private onErrorCallback?: (error: string) => void;
  private onStatusCallback?: (status: "listening" | "stopped" | "processing") => void;

  constructor(config: VoiceRecognitionConfig = {}) {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.lang = config.language || "en-US";
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? false;
    this.recognition.maxAlternatives = config.maxAlternatives || 1;

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusCallback?.("listening");
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.trim().toLowerCase();
      const confidence = result[0].confidence;

      this.onResultCallback?.(transcript, confidence);
      this.onStatusCallback?.("processing");

      // Match command
      this.matchCommand(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      this.onErrorCallback?.(event.error);
      this.isListening = false;
      this.onStatusCallback?.("stopped");
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onStatusCallback?.("stopped");
    };
  }

  /**
   * Register a voice command
   */
  registerCommand(command: VoiceCommand) {
    this.commands.set(command.phrase.toLowerCase(), command);
    command.aliases?.forEach((alias) => {
      this.commands.set(alias.toLowerCase(), command);
    });
  }

  /**
   * Register multiple commands
   */
  registerCommands(commands: VoiceCommand[]) {
    commands.forEach((cmd) => this.registerCommand(cmd));
  }

  /**
   * Match transcript to registered commands
   */
  private matchCommand(transcript: string) {
    // Exact match
    const exactMatch = this.commands.get(transcript);
    if (exactMatch) {
      exactMatch.action();
      return;
    }

    // Partial match (transcript contains command phrase)
    for (const [phrase, command] of this.commands.entries()) {
      if (transcript.includes(phrase)) {
        command.action();
        return;
      }
    }

    // No match found
    console.log("No matching command for:", transcript);
  }

  /**
   * Start listening
   */
  start() {
    if (!this.recognition) {
      console.warn("Speech recognition not available");
      return;
    }

    if (!this.isListening) {
      this.recognition.start();
    }
  }

  /**
   * Stop listening
   */
  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Set result callback
   */
  onResult(callback: (transcript: string, confidence: number) => void) {
    this.onResultCallback = callback;
  }

  /**
   * Set error callback
   */
  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  /**
   * Set status callback
   */
  onStatus(callback: (status: "listening" | "stopped" | "processing") => void) {
    this.onStatusCallback = callback;
  }

  /**
   * Get listening state
   */
  getIsListening() {
    return this.isListening;
  }

  /**
   * Clear all commands
   */
  clearCommands() {
    this.commands.clear();
  }
}

/**
 * Text-to-Speech using ElevenLabs API or Web Speech API
 */
export class VoiceNarrator {
  private apiKey?: string;
  private voiceId?: string;

  constructor(elevenLabsApiKey?: string, voiceId?: string) {
    this.apiKey = elevenLabsApiKey;
    this.voiceId = voiceId || "21m00Tcm4TlvDq8ikWAM";
  }

  /**
   * Speak text using Web Speech API (browser native)
   */
  async speakBrowser(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speak text using ElevenLabs API (higher quality)
   */
  async speakElevenLabs(text: string): Promise<void> {
    if (!this.apiKey) {
      console.warn("ElevenLabs API key not provided, falling back to browser TTS");
      return this.speakBrowser(text);
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });
    } catch (error) {
      console.error("ElevenLabs TTS error:", error);
      // Fallback to browser TTS
      return this.speakBrowser(text);
    }
  }

  /**
   * Stop current speech
   */
  stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * Predefined Voice Commands for Velocity
 */
export const VELOCITY_VOICE_COMMANDS = {
  // Navigation Commands
  navigation: [
    { phrase: "show dashboard", route: "/" },
    { phrase: "go to dashboard", route: "/" },
    { phrase: "go to contractors", route: "/contractors" },
    { phrase: "show contractors", route: "/contractors" },
    { phrase: "go to purchase orders", route: "/purchase-orders" },
    { phrase: "show purchase orders", route: "/purchase-orders" },
    { phrase: "go to timecards", route: "/timecards" },
    { phrase: "show timecards", route: "/timecards" },
    { phrase: "go to invoices", route: "/invoices" },
    { phrase: "show invoices", route: "/invoices" },
    { phrase: "go to assets", route: "/assets" },
    { phrase: "show assets", route: "/assets" },
    { phrase: "show admin panel", route: "/admin" },
    { phrase: "go to admin", route: "/admin" },
    { phrase: "show analytics", route: "/analytics-hub" },
  ],

  // Workflow Commands
  workflow: [
    { phrase: "create contractor", route: "/contractors/create" },
    { phrase: "new contractor", route: "/contractors/create" },
    { phrase: "add contractor", route: "/contractors/create" },
    { phrase: "create purchase order", route: "/purchase-orders/create" },
    { phrase: "new purchase order", route: "/purchase-orders/create" },
    { phrase: "create timecard", route: "/timecards/create" },
    { phrase: "submit timecard", route: "/timecards/create" },
    { phrase: "create invoice", route: "/invoices/create" },
    { phrase: "new invoice", route: "/invoices/create" },
    { phrase: "approve timecards", route: "/timecards/pending" },
    { phrase: "bulk approve", route: "/timecards/bulk-approve" },
    { phrase: "scan asset", route: "/assets/scan" },
  ],

  // Status Query Commands (these would trigger API calls)
  queries: [
    "what's my spending",
    "show critical alerts",
    "any pending approvals",
    "show budget status",
    "what's overdue",
    "show exceptions",
  ],
};

/**
 * Create voice commands from route map
 */
export function createNavigationCommands(navigate: (path: string) => void, narrator?: VoiceNarrator): VoiceCommand[] {
  return VELOCITY_VOICE_COMMANDS.navigation.map((cmd) => ({
    id: `nav_${cmd.phrase.replace(/\s+/g, "_")}`,
    phrase: cmd.phrase,
    category: "navigation" as const,
    action: () => {
      narrator?.speakBrowser(`Navigating to ${cmd.phrase.replace("show ", "").replace("go to ", "")}`);
      navigate(cmd.route);
    },
  }));
}

/**
 * Create workflow commands
 */
export function createWorkflowCommands(navigate: (path: string) => void, narrator?: VoiceNarrator): VoiceCommand[] {
  return VELOCITY_VOICE_COMMANDS.workflow.map((cmd) => ({
    id: `workflow_${cmd.phrase.replace(/\s+/g, "_")}`,
    phrase: cmd.phrase,
    category: "workflow" as const,
    action: () => {
      narrator?.speakBrowser(`Opening ${cmd.phrase}`);
      navigate(cmd.route);
    },
  }));
}

/**
 * Helper: Check if browser supports voice recognition
 */
export function isVoiceRecognitionSupported(): boolean {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

/**
 * Helper: Check if browser supports speech synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return "speechSynthesis" in window;
}
