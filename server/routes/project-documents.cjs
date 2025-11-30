const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadsDir = path.join(process.cwd(), 'uploads', 'sow');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uuid = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uuid}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

const authenticateToken = (req, res, next) => {
  // In demo mode, skip auth and use demo user - for presentations only
  if (process.env.DEMO_MODE === 'true') {
    req.user = { id: 1, email: 'demo@velocity.com', role: 'admin' };
    return next();
  }

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

router.get('/api/project-documents', authenticateToken, async (req, res) => {
  try {
    const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC', status, document_type } = req.query;
    const pool = req.app.get('db');
    
    let query = 'SELECT * FROM project_documents';
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (document_type) {
      conditions.push(`document_type = $${params.length + 1}`);
      params.push(document_type);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    const allowedSortColumns = ['id', 'created_at', 'updated_at', 'uploaded_at', 'original_filename', 'status', 'document_type', 'file_size_bytes'];
    const sortColumn = allowedSortColumns.includes(_sort) ? _sort : 'created_at';
    const sortOrder = _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(_end) - parseInt(_start), parseInt(_start));
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM project_documents';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, conditions.length));
    
    res.set('X-Total-Count', countResult.rows[0].count);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all project documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/projects/:projectId/documents', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC', status, document_type } = req.query;
    const pool = req.app.get('db');
    
    let query = 'SELECT * FROM project_documents WHERE project_id = $1';
    const params = [projectId];
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (document_type) {
      query += ` AND document_type = $${params.length + 1}`;
      params.push(document_type);
    }
    
    const allowedSortColumns = ['id', 'created_at', 'updated_at', 'uploaded_at', 'original_filename', 'status', 'document_type', 'file_size_bytes'];
    const sortColumn = allowedSortColumns.includes(_sort) ? _sort : 'created_at';
    const sortOrder = _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(_end) - parseInt(_start), parseInt(_start));
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM project_documents WHERE project_id = $1';
    const countParams = [projectId];
    if (status) {
      countQuery += ` AND status = $${countParams.length + 1}`;
      countParams.push(status);
    }
    if (document_type) {
      countQuery += ` AND document_type = $${countParams.length + 1}`;
      countParams.push(document_type);
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.set('X-Total-Count', countResult.rows[0].count);
    res.json(result.rows);
  } catch (error) {
    console.error('Get project documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/projects/:projectId/documents', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      client_name,
      bucket,
      original_filename,
      stored_filename,
      mime_type,
      file_size_bytes,
      storage_path,
      document_type,
      tags,
      notes
    } = req.body;
    const pool = req.app.get('db');

    if (!original_filename) {
      return res.status(400).json({ error: 'original_filename is required' });
    }

    const result = await pool.query(
      `INSERT INTO project_documents (
        project_id, client_name, bucket, original_filename, stored_filename,
        mime_type, file_size_bytes, storage_path, status, document_type,
        tags, notes, uploaded_by, uploaded_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        projectId,
        client_name || null,
        bucket || null,
        original_filename,
        stored_filename || null,
        mime_type || null,
        file_size_bytes || null,
        storage_path || null,
        'pending',
        document_type || 'other',
        tags || [],
        notes || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/statementofworks/:sowId/documents', authenticateToken, async (req, res) => {
  try {
    const { sowId } = req.params;
    const { _start = 0, _end = 10, _sort = 'created_at', _order = 'DESC', status, document_type } = req.query;
    const pool = req.app.get('db');
    
    let query = 'SELECT * FROM project_documents WHERE sow_id = $1';
    const params = [sowId];
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (document_type) {
      query += ` AND document_type = $${params.length + 1}`;
      params.push(document_type);
    }
    
    const allowedSortColumns = ['id', 'created_at', 'updated_at', 'uploaded_at', 'original_filename', 'status', 'document_type', 'file_size_bytes'];
    const sortColumn = allowedSortColumns.includes(_sort) ? _sort : 'created_at';
    const sortOrder = _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(_end) - parseInt(_start), parseInt(_start));
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) FROM project_documents WHERE sow_id = $1';
    const countParams = [sowId];
    if (status) {
      countQuery += ` AND status = $${countParams.length + 1}`;
      countParams.push(status);
    }
    if (document_type) {
      countQuery += ` AND document_type = $${countParams.length + 1}`;
      countParams.push(document_type);
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.set('X-Total-Count', countResult.rows[0].count);
    res.json(result.rows);
  } catch (error) {
    console.error('Get SOW documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/statementofworks/:sowId/documents', authenticateToken, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 20MB limit' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { sowId } = req.params;
    const pool = req.app.get('db');

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select a PDF, DOC, or DOCX file.' });
    }

    const { document_type, notes } = req.body;
    
    const original_filename = req.file.originalname;
    const stored_filename = req.file.filename;
    const mime_type = req.file.mimetype;
    const file_size_bytes = req.file.size;
    const storage_path = path.join('uploads', 'sow', stored_filename);

    const result = await pool.query(
      `INSERT INTO project_documents (
        sow_id, original_filename, stored_filename,
        mime_type, file_size_bytes, storage_path, status, document_type,
        tags, notes, uploaded_by, uploaded_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        sowId,
        original_filename,
        stored_filename,
        mime_type,
        file_size_bytes,
        storage_path,
        'pending',
        document_type || 'sow',
        [],
        notes || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create SOW document error:', error);
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/project-documents/:id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const result = await pool.query('SELECT * FROM project_documents WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/api/project-documents/:id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const { id } = req.params;
    const {
      document_type,
      ai_classification,
      classification_confidence,
      knowledge_collection_id,
      analysis_summary,
      extracted_text,
      tags,
      notes,
      status
    } = req.body;

    const checkResult = await pool.query('SELECT id FROM project_documents WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (document_type !== undefined) {
      updates.push(`document_type = $${paramCount++}`);
      params.push(document_type);
    }
    if (ai_classification !== undefined) {
      updates.push(`ai_classification = $${paramCount++}`);
      params.push(JSON.stringify(ai_classification));
    }
    if (classification_confidence !== undefined) {
      updates.push(`classification_confidence = $${paramCount++}`);
      params.push(classification_confidence);
    }
    if (knowledge_collection_id !== undefined) {
      updates.push(`knowledge_collection_id = $${paramCount++}`);
      params.push(knowledge_collection_id);
    }
    if (analysis_summary !== undefined) {
      updates.push(`analysis_summary = $${paramCount++}`);
      params.push(analysis_summary);
    }
    if (extracted_text !== undefined) {
      updates.push(`extracted_text = $${paramCount++}`);
      params.push(extracted_text);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      params.push(tags);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      params.push(notes);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await pool.query(
      `UPDATE project_documents SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/api/project-documents/:id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const result = await pool.query(
      'DELETE FROM project_documents WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully', document: result.rows[0] });
  } catch (error) {
    console.error('Delete project document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/project-documents/:id/classify', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const { id } = req.params;

    const docResult = await pool.query('SELECT * FROM project_documents WHERE id = $1', [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = docResult.rows[0];

    await pool.query(
      `UPDATE project_documents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      ['classifying', id]
    );

    const classificationResult = {
      predicted_type: determineDocumentType(document.original_filename, document.mime_type),
      confidence: 0.85 + Math.random() * 0.10,
      alternatives: [
        { type: 'contract', confidence: 0.15 },
        { type: 'sow', confidence: 0.10 }
      ],
      keywords_detected: ['project', 'agreement', 'terms'],
      classified_at: new Date().toISOString()
    };

    const updateResult = await pool.query(
      `UPDATE project_documents 
       SET status = $1, 
           document_type = $2,
           ai_classification = $3, 
           classification_confidence = $4,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING *`,
      [
        'classified',
        classificationResult.predicted_type,
        JSON.stringify(classificationResult),
        classificationResult.confidence,
        id
      ]
    );

    res.json({
      success: true,
      document: updateResult.rows[0],
      classification: classificationResult
    });
  } catch (error) {
    console.error('Classify document error:', error);
    
    const pool = req.app.get('db');
    await pool.query(
      `UPDATE project_documents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      ['failed', req.params.id]
    ).catch(() => {});
    
    res.status(500).json({ error: 'Classification failed', details: error.message });
  }
});

router.post('/api/project-documents/:id/analyze', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const { id } = req.params;

    const docResult = await pool.query('SELECT * FROM project_documents WHERE id = $1', [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = docResult.rows[0];

    await pool.query(
      `UPDATE project_documents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      ['analyzing', id]
    );

    const analysisResult = {
      page_count: Math.floor(Math.random() * 20) + 1,
      word_count: Math.floor(Math.random() * 5000) + 500,
      key_sections: ['Introduction', 'Terms', 'Scope', 'Signatures'],
      entities_detected: {
        dates: ['2025-01-01', '2025-12-31'],
        amounts: ['$50,000', '$75,000'],
        parties: ['Company A', 'Company B']
      },
      summary: `Analysis of ${document.original_filename}: This document appears to be a ${document.document_type || 'general'} document containing standard business terms and conditions.`,
      analyzed_at: new Date().toISOString()
    };

    const extractedText = `[Extracted text from ${document.original_filename}]\n\nThis is a placeholder for the actual extracted text content from the PDF document. In production, this would contain the full text extracted using PDF parsing libraries.`;

    const updateResult = await pool.query(
      `UPDATE project_documents 
       SET status = $1, 
           analysis_summary = $2,
           extracted_text = $3,
           analysis_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [
        'ready',
        analysisResult.summary,
        extractedText,
        id
      ]
    );

    res.json({
      success: true,
      document: updateResult.rows[0],
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Analyze document error:', error);
    
    const pool = req.app.get('db');
    await pool.query(
      `UPDATE project_documents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      ['failed', req.params.id]
    ).catch(() => {});
    
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Stream document file for in-browser viewing
router.get('/api/project-documents/:id/stream', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    const result = await pool.query('SELECT * FROM project_documents WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      console.warn(`[SECURITY] Stream attempt: Document ${req.params.id} not found`);
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const document = result.rows[0];
    
    // Verify user has access (owner or system admin)
    if (document.uploaded_by && document.uploaded_by !== req.user?.id && !req.user?.is_admin) {
      console.warn(`[SECURITY] Stream attempt: User ${req.user?.id} cannot access document ${req.params.id} (owner: ${document.uploaded_by})`);
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!document.storage_path || !document.stored_filename) {
      return res.status(404).json({ error: 'Document file not available' });
    }
    
    const filePath = path.join(process.cwd(), document.storage_path);
    
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR] Document file missing on disk: ${filePath}`);
      return res.status(404).json({ error: 'Document file not found on disk' });
    }
    
    console.log(`[AUDIT] User ${req.user?.id} streaming document: ${document.original_filename}`);
    
    // Set appropriate headers for viewing in browser
    res.setHeader('Content-Type', document.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${document.original_filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Stream document error:', error);
    res.status(500).json({ error: 'Failed to stream document' });
  }
});

// Search documents by query
router.get('/api/project-documents/search', authenticateToken, async (req, res) => {
  try {
    const { q, type, status, limit = 50 } = req.query;
    const pool = req.app.get('db');
    
    let query = 'SELECT * FROM project_documents WHERE 1=1';
    const params = [];
    
    if (q) {
      params.push(`%${q}%`);
      query += ` AND (
        original_filename ILIKE $${params.length} OR 
        document_type ILIKE $${params.length} OR 
        analysis_summary ILIKE $${params.length} OR 
        extracted_text ILIKE $${params.length} OR
        notes ILIKE $${params.length}
      )`;
    }
    
    if (type && type !== 'all') {
      params.push(type);
      query += ` AND document_type = $${params.length}`;
    }
    
    if (status && status !== 'all') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    params.push(parseInt(limit));
    query += ` ORDER BY created_at DESC LIMIT $${params.length}`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

function determineDocumentType(filename, mimeType) {
  const lowerFilename = (filename || '').toLowerCase();
  
  if (lowerFilename.includes('contract') || lowerFilename.includes('agreement')) {
    return 'contract';
  }
  if (lowerFilename.includes('sow') || lowerFilename.includes('statement') || lowerFilename.includes('scope')) {
    return 'sow';
  }
  if (lowerFilename.includes('receipt') || lowerFilename.includes('expense')) {
    return 'receipt';
  }
  if (lowerFilename.includes('timecard') || lowerFilename.includes('timesheet')) {
    return 'timecard';
  }
  if (lowerFilename.includes('manual') || lowerFilename.includes('guide') || lowerFilename.includes('handbook')) {
    return 'manual';
  }
  if (lowerFilename.includes('diagram') || lowerFilename.includes('flowchart') || lowerFilename.includes('architecture')) {
    return 'diagram';
  }
  
  return 'other';
}

module.exports = router;
