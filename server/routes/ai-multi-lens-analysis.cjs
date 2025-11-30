const express = require('express');
const router = express.Router();
const { createMessage, parseJsonResponse, DEFAULT_MODEL } = require('../services/anthropic-client.cjs');

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

router.post('/multi-lens', authenticateToken, async (req, res) => {
  try {
    const { content, documentType = 'SOW', contractId, contractName, lenses } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    console.log(`🔵 MULTI-LENS AI ANALYSIS: Starting 5-lens contract analysis...`);
    console.log(`📊 Request params:`, {
      documentType,
      contentLength: content.length,
      contractName,
      activeLenses: lenses ? Object.entries(lenses).filter(([,v]) => v).map(([k]) => k) : 'all',
      timestamp: new Date().toISOString()
    });

    const prompt = `You are an expert contract analyst performing a comprehensive 5-lens analysis of this ${documentType} document.

DOCUMENT CONTENT:
${content}

Analyze this document from 5 distinct perspectives. For each lens, provide UNIQUE insights specific to THIS document's content.

Return a JSON object with this EXACT structure:

{
  "overallRiskScore": <number 0-100>,
  "overallRiskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "legalLens": {
    "score": <number 0-100>,
    "level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "findings": [
      {"title": "<finding>", "severity": "<Critical|High|Medium|Low>", "detail": "<specific detail from document>"}
    ],
    "recommendations": ["<specific action based on document>"]
  },
  "financialLens": {
    "score": <number 0-100>,
    "level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "findings": [
      {"title": "<finding>", "severity": "<Critical|High|Medium|Low>", "detail": "<specific detail from document>"}
    ],
    "recommendations": ["<specific action based on document>"]
  },
  "operationalLens": {
    "score": <number 0-100>,
    "level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "findings": [
      {"title": "<finding>", "severity": "<Critical|High|Medium|Low>", "detail": "<specific detail from document>"}
    ],
    "recommendations": ["<specific action based on document>"]
  },
  "vendorLens": {
    "score": <number 0-100>,
    "level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "findings": [
      {"title": "<finding>", "severity": "<Critical|High|Medium|Low>", "detail": "<specific detail from document>"}
    ],
    "recommendations": ["<specific action based on document>"]
  },
  "complianceLens": {
    "score": <number 0-100>,
    "level": "<LOW|MEDIUM|HIGH|CRITICAL>",
    "findings": [
      {"title": "<finding>", "severity": "<Critical|High|Medium|Low>", "detail": "<specific detail from document>"}
    ],
    "recommendations": ["<specific action based on document>"]
  },
  "topRecommendations": [
    {
      "priority": "<Critical|High|Medium>",
      "lens": "<Legal|Financial|Operational|Vendor|Compliance>",
      "action": "<specific action>",
      "impact": "<business impact>"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Each finding MUST reference specific text/terms from the document
2. Each lens MUST have 2-4 unique findings
3. Recommendations must be actionable and specific
4. topRecommendations should have 3-5 items prioritized by business impact
5. Scores should vary based on actual document quality - NOT always the same numbers

LENS FOCUS AREAS:
- Legal: Insurance, liability, IP, termination, indemnification, confidentiality
- Financial: Payment terms, pricing, budget impact, cost risks, rate competitiveness  
- Operational: Timeline, deliverables, resources, milestones, feasibility
- Vendor: Performance history, relationship, similar contracts, vendor stability
- Compliance: Regulatory (GDPR/SOX/HIPAA), audit trail, certifications, data handling

Return ONLY valid JSON, no markdown or explanation.`;

    // Use shared Anthropic client with Replit AI Integrations
    const responseText = await createMessage({
      prompt: prompt,
      model: DEFAULT_MODEL,
      maxTokens: 4000,
      temperature: 0.3,
    });

    console.log('✅ Multi-lens AI response received');

    let analysisResult;
    try {
      analysisResult = parseJsonResponse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('📊 Raw response preview:', responseText.substring(0, 500));
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawResponse: responseText.substring(0, 1000)
      });
    }

    const formatLensResult = (lens, lensName) => {
      const colorMap = {
        legal: '#ef4444',
        financial: '#10b981', 
        operational: '#0ea5e9',
        vendor: '#8b5cf6',
        compliance: '#f59e0b'
      };
      
      return {
        riskLevel: {
          score: lens.score || 50,
          level: lens.level || 'MEDIUM',
          color: colorMap[lensName.toLowerCase()] || '#6b7280'
        },
        findings: lens.findings || [],
        recommendations: lens.recommendations || [],
        clausesPresent: [],
        clausesMissing: [],
        liabilityExposure: { level: 'Medium', description: 'Based on AI analysis' },
        complianceGaps: lens.findings?.filter(f => f.severity === 'Critical' || f.severity === 'High').map(f => ({
          gap: f.title,
          severity: f.severity,
          recommendation: f.detail
        })) || []
      };
    };

    const fullResult = {
      contractId: contractId || `analysis-${Date.now()}`,
      contractName: contractName || 'Analyzed Document',
      documentType,
      analyzedAt: new Date().toISOString(),
      overallRiskScore: analysisResult.overallRiskScore || 50,
      overallRiskLevel: analysisResult.overallRiskLevel || 'MEDIUM',
      legalLens: formatLensResult(analysisResult.legalLens || {}, 'legal'),
      financialLens: formatLensResult(analysisResult.financialLens || {}, 'financial'),
      operationalLens: formatLensResult(analysisResult.operationalLens || {}, 'operational'),
      vendorLens: formatLensResult(analysisResult.vendorLens || {}, 'vendor'),
      complianceLens: formatLensResult(analysisResult.complianceLens || {}, 'compliance'),
      topRecommendations: (analysisResult.topRecommendations || []).map(rec => ({
        ...rec,
        lensColor: {
          Legal: '#ef4444',
          Financial: '#10b981',
          Operational: '#0ea5e9', 
          Vendor: '#8b5cf6',
          Compliance: '#f59e0b'
        }[rec.lens] || '#6b7280'
      })),
      quickActions: [
        { label: 'Request Legal Review', action: 'escalate', targetLens: ['Legal'] },
        { label: 'Approve with Notes', action: 'approve', targetLens: [] },
        { label: 'Request Revision', action: 'request_revision', targetLens: [] }
      ],
      aiGenerated: true,
      model: 'claude-sonnet-4-5'
    };

    console.log(`✅ Multi-lens analysis complete`);
    console.log(`📊 Results:`, {
      overallScore: fullResult.overallRiskScore,
      overallLevel: fullResult.overallRiskLevel,
      topRecommendations: fullResult.topRecommendations.length,
      lensScores: {
        legal: fullResult.legalLens.riskLevel.score,
        financial: fullResult.financialLens.riskLevel.score,
        operational: fullResult.operationalLens.riskLevel.score,
        vendor: fullResult.vendorLens.riskLevel.score,
        compliance: fullResult.complianceLens.riskLevel.score
      }
    });

    res.json(fullResult);

  } catch (error) {
    console.error('❌ Multi-lens analysis failed:', error.message);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Anthropic API key. Please check your API key configuration.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Multi-lens analysis failed',
      details: error.message 
    });
  }
});

module.exports = router;
