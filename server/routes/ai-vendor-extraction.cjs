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

// AI Vendor Data Extraction Endpoint
router.post('/extract', authenticateToken, async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for vendor extraction' });
    }

    console.log(`🔵 REAL API CALL: Claude vendor extraction starting...`);
    console.log(`📊 Request params:`, {
      textLength: rawText.length,
      model: 'claude-sonnet-4-5',
      timestamp: new Date().toISOString()
    });

    const prompt = `You are an expert data extraction specialist for workforce management and vendor onboarding.

Extract vendor/contractor information from the following unstructured text. This could be from emails, PDFs, spreadsheets, or any other format.

TEXT TO ANALYZE:
${rawText}

Extract the following fields if present:
- Vendor Company Name
- Contact Person Name
- Email Address
- Phone Number
- Physical Address (street, city, state, zip)
- Tax ID / EIN
- Rate (hourly/daily/project)
- Skills / Specializations
- Start Date / Availability
- Certifications
- Years of Experience
- Industry
- Website
- LinkedIn Profile
- Additional Notes

Return your extraction as a JSON object with this structure:
{
  "vendorName": "Company name",
  "contactName": "Full name",
  "email": "email@example.com",
  "phone": "+1-555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  },
  "taxId": "12-3456789",
  "rate": {
    "amount": 150,
    "currency": "USD",
    "period": "hourly"
  },
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "availability": "2025-02-01",
  "certifications": ["Cert 1", "Cert 2"],
  "experience": 8,
  "industry": "Technology",
  "website": "https://example.com",
  "linkedin": "https://linkedin.com/in/profile",
  "notes": "Any additional relevant information",
  "confidence": 0.95,
  "extractedFields": ["vendorName", "email", "phone", "rate", "skills"]
}

IMPORTANT:
- Only include fields you can confidently extract from the text
- Use null for fields not found in the text
- Include a "confidence" score (0-1) for extraction accuracy
- List all fields you successfully extracted in "extractedFields" array
- Return ONLY valid JSON, no markdown or explanatory text`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;
    console.log('✅ Claude extraction response received successfully');
    console.log('📊 Response metadata:', {
      tokens_used: message.usage?.input_tokens + message.usage?.output_tokens,
      input_tokens: message.usage?.input_tokens,
      output_tokens: message.usage?.output_tokens,
      response_length: responseText.length
    });

    // Parse JSON from response
    let vendorData;
    try {
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      vendorData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('📊 Raw response preview:', responseText.substring(0, 200) + '...');
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        rawResponse: responseText 
      });
    }

    // Calculate extraction stats
    const stats = {
      totalFields: 14,
      extractedFields: vendorData.extractedFields?.length || 0,
      completeness: ((vendorData.extractedFields?.length || 0) / 14) * 100,
      confidence: vendorData.confidence || 0,
      timeSaved: '2.5 hours vs manual entry',
    };

    console.log(`✅ Extraction complete successfully`);
    console.log(`📊 Results summary:`, {
      extractedFields: `${stats.extractedFields}/${stats.totalFields}`,
      completeness: `${stats.completeness.toFixed(1)}%`,
      confidence: vendorData.confidence || 0,
      vendorName: vendorData.vendorName || 'N/A'
    });

    res.json({
      success: true,
      vendor: vendorData,
      stats,
      metadata: {
        analyzedAt: new Date().toISOString(),
        model: 'claude-sonnet-4-5',
        textLength: rawText.length,
      },
    });

  } catch (error) {
    console.error('❌ Vendor extraction failed:', error.message);
    console.error('📊 Error details:', {
      status: error.status,
      type: error.constructor.name
    });
    
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid Anthropic API key. Please check your API key configuration.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Vendor extraction failed',
      details: error.message 
    });
  }
});

// Import extracted vendor data to database
router.post('/import', authenticateToken, async (req, res) => {
  try {
    const { vendor } = req.body;

    if (!vendor || !vendor.vendorName || !vendor.email) {
      return res.status(400).json({ error: 'Vendor name and email are required' });
    }

    console.log(`🔵 Importing vendor to database: ${vendor.vendorName}...`);
    console.log(`📊 Import params:`, {
      vendorName: vendor.vendorName,
      email: vendor.email,
      phone: vendor.phone || 'N/A',
      skills: vendor.skills?.length || 0
    });

    const pool = require('../config/database.cjs');
    
    // Generate contractor ID
    const contractorId = `CTR-${Date.now()}`;
    
    // Map vendor data to contractor schema
    const insertQuery = `
      INSERT INTO contractors (
        contractor_id, first_name, last_name, email, phone, company_name,
        address, service_type, payment_terms, pay_rate, status, notes,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;
    
    // Parse name (assume last word is last name)
    const nameParts = (vendor.contactName || vendor.vendorName || '').trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : nameParts[0];
    const firstName = nameParts.join(' ') || vendor.vendorName;
    
    // Format address
    const address = vendor.address 
      ? `${vendor.address.street || ''}, ${vendor.address.city || ''}, ${vendor.address.state || ''} ${vendor.address.zip || ''}`.trim()
      : null;
    
    // Format skills as service types
    const serviceType = vendor.skills ? JSON.stringify(vendor.skills) : null;
    
    const result = await pool.query(insertQuery, [
      contractorId,
      firstName,
      lastName || 'N/A',
      vendor.email,
      vendor.phone || null,
      vendor.vendorName || null,
      address,
      serviceType,
      vendor.rate?.period === 'hourly' ? 'Net-30' : 'Custom',
      vendor.rate?.amount || 0,
      'Active',
      vendor.notes || `Imported from AI extraction. Experience: ${vendor.experience || 'N/A'} years. Industry: ${vendor.industry || 'N/A'}.`
    ]);

    const newContractor = result.rows[0];
    console.log(`✅ Vendor imported successfully`);
    console.log(`📊 Import result:`, {
      contractorId: newContractor.contractor_id,
      databaseId: newContractor.id,
      name: `${newContractor.first_name} ${newContractor.last_name}`,
      company: newContractor.company_name
    });

    res.json({
      success: true,
      contractor: newContractor,
      message: `Vendor ${vendor.vendorName} imported successfully as contractor #${newContractor.id}`,
    });

  } catch (error) {
    console.error('❌ Vendor import failed:', error.message);
    console.error('📊 Error details:', {
      code: error.code,
      constraint: error.constraint,
      table: error.table
    });
    res.status(500).json({ 
      error: 'Failed to import vendor',
      details: error.message 
    });
  }
});

module.exports = router;
