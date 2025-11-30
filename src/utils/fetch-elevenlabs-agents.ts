export interface ElevenLabsAgent {
  agent_id: string;
  name: string;
  conversation_config?: {
    agent?: {
      prompt?: {
        prompt?: string;
      };
      first_message?: string;
    };
  };
  metadata?: Record<string, any>;
  platform_settings?: Record<string, any>;
  tags?: string[];
  created_at?: string;
}

export interface AgentWithLinks extends ElevenLabsAgent {
  widgetLink: string;
  testLink: string;
  embedCode: string;
  apiLink: string;
}

export async function fetchAllElevenLabsAgents(): Promise<AgentWithLinks[]> {
  try {
    const response = await fetch(`/api/elevenlabs/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.agents || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs agents:', error);
    throw error;
  }
}
