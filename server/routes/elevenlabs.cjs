const express = require('express');
const router = express.Router();

router.get('/agents', async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'ELEVENLABS_API_KEY not configured' 
    });
  }

  try {
    console.log('🔵 REAL API CALL: Fetching ElevenLabs agents...');
    console.log('📊 Request params:', {
      endpoint: 'https://api.elevenlabs.io/v1/convai/agents',
      pageSize: 100,
      timestamp: new Date().toISOString()
    });

    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents?page_size=100', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ ElevenLabs API error:', response.status, response.statusText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Agents fetched successfully');
    console.log('📊 Response summary:', {
      totalAgents: data.agents?.length || 0,
      timestamp: new Date().toISOString()
    });
    const agents = data.agents || [];

    const agentsWithLinks = agents.map(agent => ({
      ...agent,
      widgetLink: `https://elevenlabs.io/app/conversational-ai/${agent.agent_id}`,
      testLink: `https://elevenlabs.io/app/conversational-ai/${agent.agent_id}/test`,
      apiLink: `https://api.elevenlabs.io/v1/convai/agents/${agent.agent_id}`,
      embedCode: `<elevenlabs-convai agent-id="${agent.agent_id}"></elevenlabs-convai>\n<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`
    }));

    console.log(`✅ Agent data enriched with ${agentsWithLinks.length} agents`);
    res.json({ agents: agentsWithLinks });
  } catch (error) {
    console.error('❌ Error fetching ElevenLabs agents:', error.message);
    console.error('📊 Error details:', {
      type: error.constructor.name,
      message: error.message
    });
    res.status(500).json({ 
      error: 'Failed to fetch agents',
      message: error.message 
    });
  }
});

module.exports = router;
