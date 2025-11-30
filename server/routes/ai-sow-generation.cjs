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

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { contractorId, projectDescription, sowType, duration, budget } = req.body;
    const db = req.app.get('db');

    if (!contractorId) {
      return res.status(400).json({ error: 'Contractor ID is required' });
    }

    console.log(`🔵 AI SOW Generation starting for contractor ${contractorId}...`);

    const contractorResult = await db.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM timecards t WHERE t.contractor_id = c.id) as timecard_count,
        (SELECT COALESCE(SUM(t.total_amount), 0) FROM timecards t WHERE t.contractor_id = c.id) as total_billed,
        (SELECT COUNT(*) FROM statement_of_works s WHERE s.contractor_id = c.id) as previous_sows
      FROM contractors c WHERE c.id = $1`,
      [contractorId]
    );

    if (contractorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    const contractor = contractorResult.rows[0];

    const previousSowsResult = await db.query(
      `SELECT sow_number, type, total_value, terms, deliverables, status, start_date, end_date
       FROM statement_of_works 
       WHERE contractor_id = $1 
       ORDER BY created_at DESC 
       LIMIT 3`,
      [contractorId]
    );

    const previousSows = previousSowsResult.rows;

    const prompt = `You are an expert Statement of Work (SOW) generator for workforce management.

CONTRACTOR PROFILE:
- Name: ${contractor.first_name} ${contractor.last_name}
- Company: ${contractor.company_name || 'Independent Contractor'}
- Rate: $${contractor.hourly_rate || contractor.bill_rate || 150}/hour
- Skills: ${contractor.skills || 'General consulting'}
- Previous Timecards: ${contractor.timecard_count || 0}
- Total Previously Billed: $${contractor.total_billed || 0}
- Previous SOWs: ${contractor.previous_sows || 0}

${previousSows.length > 0 ? `PREVIOUS SOW HISTORY:
${previousSows.map(s => `- ${s.sow_number}: ${s.type} - $${s.total_value} (${s.status})`).join('\n')}
` : ''}

PROJECT CONTEXT:
- Type: ${sowType || 'Fixed Fee'}
- Duration: ${duration || '3 months'}
- Budget Range: ${budget || 'To be determined based on scope'}
- Description: ${projectDescription || 'Professional services engagement'}

Generate a complete Statement of Work with the following structure:

{
  "sowNumber": "SOW-${new Date().getFullYear()}-XXXX",
  "type": "${sowType || 'Fixed Fee'}",
  "totalValue": <calculated based on rate and duration>,
  "terms": "<professional payment terms, 3-4 sentences>",
  "deliverables": "<specific deliverables based on contractor skills and project, 4-6 bullet points>",
  "paymentSchedule": "<milestone-based or time-based payment schedule>",
  "startDate": "${new Date().toISOString().split('T')[0]}",
  "endDate": "<calculated end date based on duration>",
  "scopeOfWork": "<detailed scope description, 2-3 paragraphs>",
  "assumptions": "<key assumptions, 3-4 bullet points>",
  "successCriteria": "<measurable success criteria, 3-4 bullet points>",
  "riskMitigation": "<identified risks and mitigation strategies>",
  "estimatedHours": <total estimated hours>,
  "confidence": 0.95,
  "generationNotes": "<brief notes about how this was generated>"
}

Return ONLY valid JSON, no markdown or explanatory text.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    
    let generatedSow;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedSow = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    generatedSow.sowNumber = `SOW-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    generatedSow.contractorId = contractorId;
    generatedSow.contractorName = `${contractor.first_name} ${contractor.last_name}`;
    generatedSow.contractorCompany = contractor.company_name || 'Independent';
    generatedSow.hourlyRate = contractor.hourly_rate || contractor.bill_rate || 150;

    console.log(`✅ AI SOW generated successfully for ${generatedSow.contractorName}`);

    res.json({
      success: true,
      sow: generatedSow,
      contractor: {
        id: contractor.id,
        name: `${contractor.first_name} ${contractor.last_name}`,
        company: contractor.company_name,
        rate: contractor.hourly_rate || contractor.bill_rate,
        previousSows: previousSows.length,
        totalBilled: contractor.total_billed
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'claude-sonnet-4-5',
        processingTime: 'real-time'
      }
    });

  } catch (error) {
    console.error('AI SOW generation error:', error);
    res.status(500).json({ error: 'Failed to generate SOW: ' + error.message });
  }
});

router.get('/templates', authenticateToken, async (req, res) => {
  const templates = [
    {
      id: 'fixed-fee',
      name: 'Fixed Fee Engagement',
      description: 'Standard fixed-price project with defined deliverables',
      defaultDuration: '3 months',
      paymentStructure: 'Milestone-based (30/30/40)'
    },
    {
      id: 'time-materials',
      name: 'Time & Materials',
      description: 'Hourly billing with weekly invoicing',
      defaultDuration: '6 months',
      paymentStructure: 'Weekly timecard submission'
    },
    {
      id: 'retainer',
      name: 'Monthly Retainer',
      description: 'Ongoing support with guaranteed availability',
      defaultDuration: '12 months',
      paymentStructure: 'Monthly fixed fee + overage billing'
    }
  ];
  
  res.json({ templates });
});

module.exports = router;
