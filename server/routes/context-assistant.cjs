/**
 * Context-Aware AI Assistant API
 * Provides procurement-focused guidance based on current screen context
 */

const express = require('express');
const router = express.Router();
const { createMessage, sanitizeForDatabase, DEFAULT_MODEL } = require('../services/anthropic-client.cjs');

const ASSISTANT_SYSTEM_PROMPT = `You are VINessa, Velocity's expert AI procurement assistant. You help users navigate the workforce management platform and provide actionable insights.

PERSONALITY:
- Professional yet approachable
- Concise and action-oriented  
- Focus on procurement, contracts, SOWs, contractors, and budget management
- Provide specific recommendations based on the data shown

CAPABILITIES:
- Explain metrics and KPIs on the current screen
- Suggest next actions based on what's displayed
- Answer questions about procurement best practices
- Help interpret contract terms and risk scores
- Guide users through workflows

RESPONSE STYLE:
- Keep responses under 200 words unless asked for detail
- Use bullet points for lists
- Highlight critical items with "⚠️" 
- Use "✅" for positive observations
- Reference specific data from the context when available

When given screen context, analyze it and provide relevant insights. If no context is provided, ask clarifying questions.`;

const conversationHistory = new Map();

router.post('/message', async (req, res) => {
  try {
    const { message, contextSnapshot, conversationId } = req.body;
    const userId = req.user?.id || 'demo';
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sessionKey = conversationId || `${userId}-${Date.now()}`;
    
    let history = conversationHistory.get(sessionKey) || [];
    
    if (history.length > 20) {
      history = history.slice(-20);
    }

    let contextPrompt = '';
    if (contextSnapshot) {
      const ctx = contextSnapshot;
      contextPrompt = `
CURRENT SCREEN CONTEXT:
- Page: ${ctx.pageName || 'Unknown'}
- Route: ${ctx.route || '/'}
${ctx.userRole ? `- User Role: ${ctx.userRole}` : ''}
${ctx.summary ? `- Summary: ${ctx.summary}` : ''}

${ctx.visibleData ? `VISIBLE DATA:
${JSON.stringify(ctx.visibleData, null, 2).slice(0, 2000)}` : ''}

${ctx.availableActions?.length ? `AVAILABLE ACTIONS: ${ctx.availableActions.join(', ')}` : ''}
`;
    }

    const fullPrompt = contextPrompt 
      ? `${contextPrompt}\n\nUSER QUESTION: ${message}`
      : message;

    const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const messagesForAI = historyText ? `${historyText}\nUser: ${message}` : `User: ${message}`;

    console.log(`🤖 Context Assistant request from ${userId} on ${contextSnapshot?.pageName || 'unknown page'}`);

    const responseText = await createMessage({
      prompt: history.length > 0 
        ? `Previous conversation:\n${messagesForAI}\n\n${contextPrompt}\nRespond to the user's latest message.`
        : fullPrompt,
      system: ASSISTANT_SYSTEM_PROMPT,
      model: DEFAULT_MODEL,
      maxTokens: 1024,
      temperature: 0.7,
    });

    history.push({ role: 'user', content: message, timestamp: Date.now() });
    history.push({ role: 'assistant', content: responseText, timestamp: Date.now() });
    conversationHistory.set(sessionKey, history);

    if (conversationHistory.size > 100) {
      const oldestKey = conversationHistory.keys().next().value;
      conversationHistory.delete(oldestKey);
    }

    res.json({
      success: true,
      conversationId: sessionKey,
      response: responseText,
      contextReceived: !!contextSnapshot,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Context assistant error:', error.message);
    res.status(500).json({ 
      error: 'Assistant unavailable',
      details: error.message 
    });
  }
});

router.get('/history/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const history = conversationHistory.get(conversationId) || [];
  
  res.json({
    conversationId,
    messages: history,
    messageCount: history.length,
  });
});

router.delete('/history/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  conversationHistory.delete(conversationId);
  
  res.json({ success: true, message: 'Conversation cleared' });
});

module.exports = router;
