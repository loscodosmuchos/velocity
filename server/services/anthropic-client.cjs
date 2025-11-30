/**
 * Shared Anthropic Client for Replit AI Integrations
 * 
 * Uses Replit's AI Integrations service which provides Anthropic-compatible API access
 * without requiring your own API key. Charges are billed to Replit credits.
 * 
 * Supported models:
 * - claude-opus-4-1: Most capable, best for complex reasoning
 * - claude-sonnet-4-5: Balanced performance and speed (recommended)
 * - claude-haiku-4-5: Fastest, ideal for simple tasks
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize client with Replit AI Integrations
const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

// Default model for most use cases
const DEFAULT_MODEL = 'claude-sonnet-4-5';

// Helper to check if error is rate limit
function isRateLimitError(error) {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes('429') ||
    errorMsg.includes('RATELIMIT_EXCEEDED') ||
    errorMsg.toLowerCase().includes('quota') ||
    errorMsg.toLowerCase().includes('rate limit')
  );
}

// Retry wrapper with exponential backoff
async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRateLimitError(error) || attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`⏳ Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

/**
 * Create a message with the Anthropic API
 * @param {Object} options - Message options
 * @param {string} options.prompt - User prompt
 * @param {string} [options.system] - System prompt
 * @param {string} [options.model] - Model to use (default: claude-sonnet-4-5)
 * @param {number} [options.maxTokens] - Max tokens (default: 4096)
 * @param {number} [options.temperature] - Temperature (default: 0.3)
 * @returns {Promise<string>} - Response text
 */
async function createMessage({ prompt, system, model = DEFAULT_MODEL, maxTokens = 4096, temperature = 0.3 }) {
  return withRetry(async () => {
    const startTime = Date.now();
    
    const params = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    };
    
    if (system) {
      params.system = system;
    }
    
    const message = await anthropic.messages.create(params);
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Anthropic response in ${elapsed}ms | Model: ${model} | Tokens: ${message.usage?.input_tokens}/${message.usage?.output_tokens}`);
    
    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    throw new Error('Unexpected response type from Anthropic');
  });
}

/**
 * Parse JSON from AI response, handling markdown code blocks
 * @param {string} text - Raw response text
 * @returns {Object} - Parsed JSON object
 */
function parseJsonResponse(text) {
  // Remove markdown code blocks if present
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // Try to extract JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return JSON.parse(cleaned);
}

/**
 * Sanitize text for PostgreSQL UTF8 encoding
 * Removes null bytes and other problematic characters
 * @param {string|Object} data - Data to sanitize
 * @returns {string|Object} - Sanitized data
 */
function sanitizeForDatabase(data) {
  if (typeof data === 'string') {
    // Remove null bytes and other control characters that break UTF8
    return data
      .replace(/\u0000/g, '') // Null bytes
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // Other control chars except \t \n \r
      .normalize('NFC'); // Normalize unicode
  }
  
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeForDatabase(item));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeForDatabase(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Validate and sanitize JSON for database storage
 * @param {Object} data - Data object to prepare
 * @returns {string} - Sanitized JSON string ready for DB
 */
function prepareJsonForDatabase(data) {
  const sanitized = sanitizeForDatabase(data);
  const jsonString = JSON.stringify(sanitized);
  
  // Double-check it's valid JSON
  JSON.parse(jsonString);
  
  return jsonString;
}

module.exports = {
  anthropic,
  DEFAULT_MODEL,
  createMessage,
  parseJsonResponse,
  sanitizeForDatabase,
  prepareJsonForDatabase,
  isRateLimitError,
  withRetry,
};
