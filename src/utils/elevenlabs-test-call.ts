/**
 * ElevenLabs Test Call Integration
 * Initiates test voice calls with ElevenLabs chatbots
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";
const ELEVENLABS_AGENT_ID = "default-velocity-agent";

interface TestCallResponse {
  success: boolean;
  message: string;
  callId?: string;
  error?: string;
}

/**
 * Initiates a test call with an ElevenLabs chatbot
 * Falls back to demo mode if API key is not configured
 */
export async function initiateTestCall(
  chatbotName: string,
  botId: number
): Promise<TestCallResponse> {
  try {
    // Check if we're in demo mode (no API key configured)
    if (!ELEVENLABS_API_KEY) {
      return demoModeTestCall(chatbotName, botId);
    }

    // Real ElevenLabs API call
    const response = await fetch("https://api.elevenlabs.io/v1/convai/conversation", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: ELEVENLABS_AGENT_ID,
        conversation_config: {
          agent: {
            prompt: {
              prompt: `You are ${chatbotName}. Greet the user and ask them how you can help with their workforce management task.`,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs API error:", error);
      return {
        success: false,
        message: `Failed to initiate call with ${chatbotName}`,
        error: error,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: `Test call initiated with ${chatbotName}. Audio stream ready.`,
      callId: data.conversation_id,
    };
  } catch (error) {
    console.error("Test call error:", error);
    // Fall back to demo mode on error
    return demoModeTestCall(chatbotName, botId);
  }
}

/**
 * Demo mode test call - simulates call initiation for presentation purposes
 */
function demoModeTestCall(chatbotName: string, botId: number): TestCallResponse {
  const greetings = [
    "Hi! I'll help you submit your timecard quickly.",
    "Hello! Let's check out some equipment for you.",
    "Hey there! What's the project status?",
    "Hi! Do you have any pending approvals to review?",
    "Welcome! How can I assist you today?",
  ];

  const greeting = greetings[botId % greetings.length];

  // In demo mode, we'll simulate playing the greeting
  simulateAudioPlayback(greeting);

  return {
    success: true,
    message: `Test call initiated with ${chatbotName}. Demo mode active.`,
    callId: `demo-call-${Date.now()}`,
  };
}

/**
 * Simulates audio playback in demo mode
 * Could be replaced with actual Web Audio API or ElevenLabs streaming
 */
function simulateAudioPlayback(text: string): void {
  // Use Web Speech API for demo purposes if available
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Stream audio from ElevenLabs real-time API
 * Used for actual voice call streaming
 */
export async function streamElevenLabsAudio(
  text: string,
  voiceId: string = "Rachel"
): Promise<Blob | null> {
  try {
    if (!ELEVENLABS_API_KEY) {
      console.log("Demo mode: Skipping audio generation");
      return null;
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_flash_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      console.error("ElevenLabs TTS error:", response.statusText);
      return null;
    }

    return await response.blob();
  } catch (error) {
    console.error("Audio streaming error:", error);
    return null;
  }
}
