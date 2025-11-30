const express = require('express');

module.exports = function createMessagesRouter(pool, authMiddleware) {
  const templatesRouter = express.Router();
  const messagesRouter = express.Router();

  // GET /api/message-templates - List all active templates
  templatesRouter.get('/', authMiddleware, async (req, res) => {
    try {
      const { category } = req.query;
      
      let query = `
        SELECT id, name, category, subject, body, variables, is_active, created_at, updated_at
        FROM message_templates 
        WHERE is_active = true
      `;
      const params = [];
      
      if (category) {
        query += ' AND category = $1';
        params.push(category);
      }
      
      query += ' ORDER BY category, name';
      
      const result = await pool.query(query, params);
      
      res.json(result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        subject: row.subject,
        body: row.body,
        variables: row.variables || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })));
    } catch (error) {
      console.error('Get message templates error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/message-templates/:id - Get template by ID
  templatesRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `SELECT id, name, category, subject, body, variables, is_active, created_at, updated_at
         FROM message_templates 
         WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        name: row.name,
        category: row.category,
        subject: row.subject,
        body: row.body,
        variables: row.variables || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Get message template error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/messages - Send a message (with template variable substitution)
  messagesRouter.post('/', authMiddleware, async (req, res) => {
    try {
      const { 
        templateId, 
        subject, 
        body, 
        receiverId, 
        receiverType,
        relatedSowId, 
        relatedInvoiceId, 
        relatedPoId,
        variables 
      } = req.body;
      
      let finalSubject = subject;
      let finalBody = body;
      
      // If using a template, fetch it and substitute variables
      if (templateId) {
        const templateResult = await pool.query(
          'SELECT subject, body FROM message_templates WHERE id = $1',
          [templateId]
        );
        
        if (templateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Template not found' });
        }
        
        const template = templateResult.rows[0];
        finalSubject = template.subject;
        finalBody = template.body;
        
        // Substitute variables
        if (variables && typeof variables === 'object') {
          for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            finalSubject = finalSubject.replace(new RegExp(placeholder, 'g'), String(value));
            finalBody = finalBody.replace(new RegExp(placeholder, 'g'), String(value));
          }
        }
      }
      
      if (!finalSubject || !finalBody) {
        return res.status(400).json({ error: 'Subject and body are required' });
      }
      
      const result = await pool.query(
        `INSERT INTO messages 
         (subject, body, sender_id, receiver_id, receiver_type, related_sow_id, related_invoice_id, related_po_id, template_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'sent')
         RETURNING *`,
        [
          finalSubject, 
          finalBody, 
          req.user.id, 
          receiverId || null, 
          receiverType || null,
          relatedSowId || null, 
          relatedInvoiceId || null, 
          relatedPoId || null,
          templateId || null
        ]
      );
      
      const row = result.rows[0];
      res.status(201).json({
        id: row.id,
        subject: row.subject,
        body: row.body,
        senderId: row.sender_id,
        receiverId: row.receiver_id,
        receiverType: row.receiver_type,
        relatedSowId: row.related_sow_id,
        relatedInvoiceId: row.related_invoice_id,
        relatedPoId: row.related_po_id,
        templateId: row.template_id,
        status: row.status,
        readAt: row.read_at,
        createdAt: row.created_at
      });
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/messages - List messages (with filters for related entities)
  messagesRouter.get('/', authMiddleware, async (req, res) => {
    try {
      const { 
        relatedSowId, 
        relatedInvoiceId, 
        relatedPoId, 
        status,
        _start = 0, 
        _end = 50, 
        _sort = 'created_at', 
        _order = 'DESC' 
      } = req.query;
      
      let query = `
        SELECT m.*, 
               mt.name as template_name, 
               mt.category as template_category,
               u.first_name as sender_first_name,
               u.last_name as sender_last_name
        FROM messages m
        LEFT JOIN message_templates mt ON m.template_id = mt.id
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;
      
      if (relatedSowId) {
        query += ` AND m.related_sow_id = $${paramIndex++}`;
        params.push(relatedSowId);
      }
      
      if (relatedInvoiceId) {
        query += ` AND m.related_invoice_id = $${paramIndex++}`;
        params.push(relatedInvoiceId);
      }
      
      if (relatedPoId) {
        query += ` AND m.related_po_id = $${paramIndex++}`;
        params.push(relatedPoId);
      }
      
      if (status) {
        query += ` AND m.status = $${paramIndex++}`;
        params.push(status);
      }
      
      // Allow sorting by valid columns
      const validSortColumns = ['created_at', 'subject', 'status', 'id'];
      const sortColumn = validSortColumns.includes(_sort) ? _sort : 'created_at';
      const sortOrder = _order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY m.${sortColumn} ${sortOrder}`;
      query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(parseInt(_end) - parseInt(_start), parseInt(_start));
      
      const result = await pool.query(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM messages m WHERE 1=1';
      const countParams = [];
      let countParamIndex = 1;
      
      if (relatedSowId) {
        countQuery += ` AND m.related_sow_id = $${countParamIndex++}`;
        countParams.push(relatedSowId);
      }
      if (relatedInvoiceId) {
        countQuery += ` AND m.related_invoice_id = $${countParamIndex++}`;
        countParams.push(relatedInvoiceId);
      }
      if (relatedPoId) {
        countQuery += ` AND m.related_po_id = $${countParamIndex++}`;
        countParams.push(relatedPoId);
      }
      if (status) {
        countQuery += ` AND m.status = $${countParamIndex++}`;
        countParams.push(status);
      }
      
      const countResult = await pool.query(countQuery, countParams);
      
      res.set('X-Total-Count', countResult.rows[0].count);
      res.json(result.rows.map(row => ({
        id: row.id,
        subject: row.subject,
        body: row.body,
        senderId: row.sender_id,
        senderName: row.sender_first_name && row.sender_last_name 
          ? `${row.sender_first_name} ${row.sender_last_name}` 
          : null,
        receiverId: row.receiver_id,
        receiverType: row.receiver_type,
        relatedSowId: row.related_sow_id,
        relatedInvoiceId: row.related_invoice_id,
        relatedPoId: row.related_po_id,
        templateId: row.template_id,
        templateName: row.template_name,
        templateCategory: row.template_category,
        status: row.status,
        readAt: row.read_at,
        createdAt: row.created_at
      })));
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/messages/:id - Get message details
  messagesRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `SELECT m.*, 
                mt.name as template_name, 
                mt.category as template_category,
                u.first_name as sender_first_name,
                u.last_name as sender_last_name
         FROM messages m
         LEFT JOIN message_templates mt ON m.template_id = mt.id
         LEFT JOIN users u ON m.sender_id = u.id
         WHERE m.id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        subject: row.subject,
        body: row.body,
        senderId: row.sender_id,
        senderName: row.sender_first_name && row.sender_last_name 
          ? `${row.sender_first_name} ${row.sender_last_name}` 
          : null,
        receiverId: row.receiver_id,
        receiverType: row.receiver_type,
        relatedSowId: row.related_sow_id,
        relatedInvoiceId: row.related_invoice_id,
        relatedPoId: row.related_po_id,
        templateId: row.template_id,
        templateName: row.template_name,
        templateCategory: row.template_category,
        status: row.status,
        readAt: row.read_at,
        createdAt: row.created_at
      });
    } catch (error) {
      console.error('Get message error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /api/messages/:id/read - Mark as read
  messagesRouter.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `UPDATE messages 
         SET status = 'read', read_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        subject: row.subject,
        body: row.body,
        senderId: row.sender_id,
        receiverId: row.receiver_id,
        receiverType: row.receiver_type,
        relatedSowId: row.related_sow_id,
        relatedInvoiceId: row.related_invoice_id,
        relatedPoId: row.related_po_id,
        templateId: row.template_id,
        status: row.status,
        readAt: row.read_at,
        createdAt: row.created_at
      });
    } catch (error) {
      console.error('Mark message as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return {
    templates: templatesRouter,
    messages: messagesRouter
  };
};
