const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { parsePDF } = require('../parsers/pdf-parser.cjs');
const pool = require('../config/database.cjs');
const fs = require('fs').promises;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

router.post('/upload', async (req, res) => {
  try {
    const { email, subject, attachment, filename } = req.body;
    
    if (!email || !filename || !attachment) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, filename, and attachment are required' 
      });
    }

    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(422).json({ 
        error: 'Invalid file type',
        details: 'Only PDF files are accepted. Please upload a .pdf file.' 
      });
    }
    
    console.log('🔵 REAL API CALL: Processing voice contract upload...');
    console.log('📊 Upload params:', {
      from: email,
      filename,
      size: attachment?.length,
      timestamp: new Date().toISOString()
    });

    const pdfBuffer = Buffer.from(attachment, 'base64');

    if (pdfBuffer.length > 10 * 1024 * 1024) {
      return res.status(422).json({ 
        error: 'File too large',
        details: 'PDF files must be under 10MB. Please upload a smaller file.' 
      });
    }

    const contractText = await parsePDF(pdfBuffer);
    
    console.log('✅ PDF parsed successfully');
    console.log('📊 Extraction result:', {
      textLength: contractText.length,
      pages: Math.ceil(contractText.length / 3000)
    });

    const analysisPrompt = await fs.readFile('server/prompts/contract-qa.txt', 'utf-8');
    
    console.log('🔵 REAL API CALL: Claude contract analysis...');
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      temperature: 0,
      messages: [{
        role: 'user',
        content: analysisPrompt.replace('{{CONTRACT_TEXT}}', contractText)
      }]
    });

    const analysis = JSON.parse(message.content[0].text);
    
    console.log('✅ Claude analysis complete');
    console.log('📊 Analysis summary:', {
      contract_type: analysis.contract_type,
      total_value: analysis.total_value,
      parties: analysis.parties,
      key_terms_count: analysis.key_terms?.length
    });

    const result = await pool.query(`
      INSERT INTO voice_contract_uploads (
        email, filename, contract_text, analysis, uploaded_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `, [email, filename, contractText, JSON.stringify(analysis)]);

    const contractId = result.rows[0].id;

    console.log('✅ Contract saved to database');
    console.log('📊 Database result:', { contractId });

    res.json({
      success: true,
      contract_id: contractId,
      analysis: analysis,
      next_step: 'initiate_voice_callback'
    });

  } catch (error) {
    console.error('❌ Contract upload failed:', error.message);
    console.error('📊 Error details:', {
      type: error.constructor.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });

    if (error.message.includes('PDF parsing failed')) {
      return res.status(422).json({ 
        error: 'PDF processing failed', 
        details: error.message,
        suggestion: 'Please ensure the file is a valid PDF and not corrupted.' 
      });
    }

    if (error.message.includes('JSON')) {
      return res.status(500).json({ 
        error: 'Contract analysis failed', 
        details: 'AI analysis returned invalid data. Please try again or contact support.',
        technical: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message,
      suggestion: 'Please try again. If the problem persists, contact support.' 
    });
  }
});

router.post('/initiate-call', async (req, res) => {
  try {
    const { contract_id, phone_number } = req.body;

    console.log('🔵 REAL API CALL: Initiating ElevenLabs voice callback...');
    console.log('📊 Call params:', {
      contract_id,
      phone_number,
      timestamp: new Date().toISOString()
    });

    const result = await pool.query(
      'SELECT analysis FROM voice_contract_uploads WHERE id = $1',
      [contract_id]
    );
    
    if (!result.rows.length) {
      throw new Error(`Contract ${contract_id} not found`);
    }

    const analysis = result.rows[0].analysis;

    const firstMessage = `Hi, I've analyzed your ${analysis.contract_type} contract. It's worth ${analysis.total_value} between ${analysis.parties.client} and ${analysis.parties.vendor}. What would you like to know?`;

    console.log('🔵 REAL API CALL: ElevenLabs conversational AI...');
    const elevenlabsResponse = await fetch('https://api.elevenlabs.io/v1/convai/conversation', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: process.env.ELEVENLABS_AGENT_ID || 'default',
        override_agent_prompt: `You are VINessa, Velocity's AI contract intelligence assistant. You're analyzing contract #${contract_id}. Contract details: ${JSON.stringify(analysis)}. Answer user questions by citing specific contract clauses. Be professional and concise.`,
        first_message: firstMessage,
        phone_number: phone_number
      })
    });

    if (!elevenlabsResponse.ok) {
      const errorText = await elevenlabsResponse.text();
      console.error('❌ ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API failed: ${elevenlabsResponse.status}`);
    }

    const callData = await elevenlabsResponse.json();

    console.log('✅ Voice call initiated successfully');
    console.log('📊 Call result:', {
      conversation_id: callData.conversation_id,
      status: callData.status,
      cost_estimate: '$0.05'
    });

    await pool.query(`
      INSERT INTO voice_analysis_sessions (
        contract_id, phone_number, conversation_id, started_at
      ) VALUES ($1, $2, $3, NOW())
    `, [contract_id, phone_number, callData.conversation_id]);

    res.json({
      success: true,
      conversation_id: callData.conversation_id,
      message: `Voice callback initiated to ${phone_number}`
    });

  } catch (error) {
    console.error('❌ Voice callback failed:', error.message);
    res.status(500).json({ error: 'Call initiation failed', details: error.message });
  }
});

router.get('/contracts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        email,
        filename,
        analysis->>'contract_type' as contract_type,
        analysis->>'total_value' as total_value,
        uploaded_at
      FROM voice_contract_uploads
      ORDER BY uploaded_at DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      contracts: result.rows
    });

  } catch (error) {
    console.error('❌ Failed to fetch contracts:', error.message);
    res.status(500).json({ error: 'Fetch failed', details: error.message });
  }
});

router.get('/contracts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM voice_contract_uploads WHERE id = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json({
      success: true,
      contract: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Failed to fetch contract:', error.message);
    res.status(500).json({ error: 'Fetch failed', details: error.message });
  }
});

module.exports = router;
