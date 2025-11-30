const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// AI Contract Gap Analysis Endpoint
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { contractText, contractType = 'general' } = req.body;

    if (!contractText || contractText.trim().length === 0) {
      return res.status(400).json({ error: 'Contract text is required' });
    }

    console.log(`🔵 REAL API CALL: Claude contract analysis starting...`);
    console.log(`📊 Request params:`, {
      contractType,
      contractLength: contractText.length,
      model: 'claude-sonnet-4-5',
      timestamp: new Date().toISOString()
    });

    const prompt = `You are an expert legal contract analyst specializing in workforce management and vendor agreements. 

Analyze the following contract and identify MISSING or INADEQUATE clauses that pose legal or business risk.

CONTRACT TYPE: ${contractType}
CONTRACT TEXT:
${contractText}

Analyze for these critical clauses:
1. Indemnification - Protection from third-party claims
2. Limitation of Liability - Caps on damages
3. Termination Rights - Exit conditions and notice periods
4. Data Privacy & Security - GDPR/CCPA compliance, data handling
5. Intellectual Property - IP ownership and licensing
6. Insurance Requirements - Required coverage levels
7. Confidentiality - NDA and trade secret protection
8. Force Majeure - Unforeseeable circumstance provisions
9. Dispute Resolution - Arbitration, mediation, jurisdiction
10. Payment Terms - Invoicing, late fees, early termination costs
11. Compliance & Audit Rights - SOC2, regulatory compliance
12. Subcontracting Restrictions - Prior approval requirements
13. Service Level Agreements - Performance guarantees, penalties
14. Background Checks - Contractor vetting requirements
15. Change Order Process - Scope change procedures

For each MISSING or INADEQUATE clause, provide:
- Clause name
- Severity: CRITICAL, HIGH, MEDIUM, or LOW
- Risk description (what could go wrong)
- Recommendation (specific language to add)

Return your analysis as a JSON array with this exact structure:
[
  {
    "clause": "Clause Name",
    "severity": "CRITICAL|HIGH|MEDIUM|LOW",
    "status": "missing|inadequate",
    "risk": "Description of the risk",
    "recommendation": "Specific contract language to add",
    "priority": 1-10
  }
]

Focus only on MISSING or INADEQUATE clauses. If a clause is present and adequate, do not include it.
Return ONLY valid JSON, no markdown formatting or explanatory text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log('✅ Claude response received successfully');
    console.log('📊 Response metadata:', {
      tokens_used: message.usage?.input_tokens + message.usage?.output_tokens,
      input_tokens: message.usage?.input_tokens,
      output_tokens: message.usage?.output_tokens,
      model: message.model,
      response_length: responseText.length
    });

    // Parse JSON from response
    let gapAnalysis;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      gapAnalysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('📊 Raw response preview:', responseText.substring(0, 200) + '...');
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawResponse: responseText 
      });
    }

    // Calculate summary statistics
    const summary = {
      totalGaps: gapAnalysis.length,
      critical: gapAnalysis.filter(g => g.severity === 'CRITICAL').length,
      high: gapAnalysis.filter(g => g.severity === 'HIGH').length,
      medium: gapAnalysis.filter(g => g.severity === 'MEDIUM').length,
      low: gapAnalysis.filter(g => g.severity === 'LOW').length,
      missing: gapAnalysis.filter(g => g.status === 'missing').length,
      inadequate: gapAnalysis.filter(g => g.status === 'inadequate').length,
    };

    console.log(`✅ Analysis complete successfully`);
    console.log(`📊 Results summary:`, {
      totalGaps: summary.totalGaps,
      breakdown: `${summary.critical} critical, ${summary.high} high, ${summary.medium} medium, ${summary.low} low`,
      missing: summary.missing,
      inadequate: summary.inadequate,
      processingTime: `${Date.now() - new Date().getTime()}ms`
    });

    res.json({
      success: true,
      analysis: gapAnalysis,
      summary,
      metadata: {
        contractType,
        analyzedAt: new Date().toISOString(),
        model: 'claude-sonnet-4-5',
        contractLength: contractText.length,
      },
    });

  } catch (error) {
    console.error('❌ Contract analysis failed:', error.message);
    console.error('📊 Error details:', {
      status: error.status,
      type: error.constructor.name,
      stack: error.stack?.split('\n')[0]
    });
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Anthropic API key. Please check your API key configuration.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Contract analysis failed',
      details: error.message 
    });
  }
});

// Test endpoint to verify API key
router.get('/test', authenticateToken, async (req, res) => {
  try {
    console.log('🔵 REAL API CALL: Testing Claude API connection...');
    
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    
    if (!hasApiKey) {
      console.error('❌ API key not configured');
      return res.json({
        status: 'not_configured',
        message: 'ANTHROPIC_API_KEY not found in environment variables',
      });
    }

    // Test with a simple message
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Reply with just "OK" if you can read this.',
        },
      ],
    });

    console.log('✅ Claude API test successful');
    console.log('📊 Test response:', { 
      model: 'claude-sonnet-4-5',
      response: message.content[0].text,
      tokens: message.usage
    });

    res.json({
      status: 'configured',
      message: 'Anthropic API is properly configured',
      model: 'claude-sonnet-4-5',
      testResponse: message.content[0].text,
    });

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

module.exports = router;
