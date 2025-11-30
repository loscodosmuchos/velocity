const express = require('express');
const router = express.Router({ mergeParams: true });

module.exports = function createSOWTranchesRouter(pool, authMiddleware) {
  // GET /api/statementofworks/:sowId/tranches - List all tranches for a SOW
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const { sowId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          id, sow_id, name, description, amount, percentage, 
          due_date, sequence_order, status, invoice_id, paid_date,
          created_at, updated_at
         FROM sow_tranches 
         WHERE sow_id = $1 
         ORDER BY sequence_order ASC`,
        [sowId]
      );
      
      res.json(result.rows.map(row => ({
        id: row.id,
        sowId: row.sow_id,
        name: row.name,
        description: row.description,
        amount: parseFloat(row.amount),
        percentage: row.percentage ? parseFloat(row.percentage) : null,
        dueDate: row.due_date,
        sequenceOrder: row.sequence_order,
        status: row.status,
        invoiceId: row.invoice_id,
        paidDate: row.paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })));
    } catch (error) {
      console.error('Get SOW tranches error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/statementofworks/:sowId/tranches/:id - Get a single tranche
  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const { sowId, id } = req.params;
      
      const result = await pool.query(
        `SELECT 
          id, sow_id, name, description, amount, percentage, 
          due_date, sequence_order, status, invoice_id, paid_date,
          created_at, updated_at
         FROM sow_tranches 
         WHERE id = $1 AND sow_id = $2`,
        [id, sowId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tranche not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        sowId: row.sow_id,
        name: row.name,
        description: row.description,
        amount: parseFloat(row.amount),
        percentage: row.percentage ? parseFloat(row.percentage) : null,
        dueDate: row.due_date,
        sequenceOrder: row.sequence_order,
        status: row.status,
        invoiceId: row.invoice_id,
        paidDate: row.paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Get SOW tranche error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/statementofworks/:sowId/tranches - Create a new tranche
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { sowId } = req.params;
      const { name, description, amount, percentage, dueDate, sequenceOrder, status } = req.body;
      
      if (!name || amount === undefined) {
        return res.status(400).json({ error: 'Name and amount are required' });
      }
      
      // Get the next sequence order if not provided
      let nextSequence = sequenceOrder;
      if (!nextSequence) {
        const maxSeq = await pool.query(
          'SELECT COALESCE(MAX(sequence_order), 0) + 1 as next_seq FROM sow_tranches WHERE sow_id = $1',
          [sowId]
        );
        nextSequence = maxSeq.rows[0].next_seq;
      }
      
      const result = await pool.query(
        `INSERT INTO sow_tranches 
         (sow_id, name, description, amount, percentage, due_date, sequence_order, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [sowId, name, description || null, amount, percentage || null, dueDate || null, nextSequence, status || 'pending']
      );
      
      const row = result.rows[0];
      res.status(201).json({
        id: row.id,
        sowId: row.sow_id,
        name: row.name,
        description: row.description,
        amount: parseFloat(row.amount),
        percentage: row.percentage ? parseFloat(row.percentage) : null,
        dueDate: row.due_date,
        sequenceOrder: row.sequence_order,
        status: row.status,
        invoiceId: row.invoice_id,
        paidDate: row.paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Create SOW tranche error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/statementofworks/:sowId/tranches/:id - Update a tranche
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { sowId, id } = req.params;
      const { name, description, amount, percentage, dueDate, sequenceOrder, status, invoiceId, paidDate } = req.body;
      
      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramIndex = 1;
      
      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(description);
      }
      if (amount !== undefined) {
        updates.push(`amount = $${paramIndex++}`);
        values.push(amount);
      }
      if (percentage !== undefined) {
        updates.push(`percentage = $${paramIndex++}`);
        values.push(percentage);
      }
      if (dueDate !== undefined) {
        updates.push(`due_date = $${paramIndex++}`);
        values.push(dueDate);
      }
      if (sequenceOrder !== undefined) {
        updates.push(`sequence_order = $${paramIndex++}`);
        values.push(sequenceOrder);
      }
      if (status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        values.push(status);
        
        // Auto-set paid_date when status changes to paid
        if (status === 'paid' && paidDate === undefined) {
          updates.push(`paid_date = $${paramIndex++}`);
          values.push(new Date().toISOString().split('T')[0]);
        }
      }
      if (invoiceId !== undefined) {
        updates.push(`invoice_id = $${paramIndex++}`);
        values.push(invoiceId);
      }
      if (paidDate !== undefined) {
        updates.push(`paid_date = $${paramIndex++}`);
        values.push(paidDate);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      values.push(id, sowId);
      
      const result = await pool.query(
        `UPDATE sow_tranches 
         SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramIndex++} AND sow_id = $${paramIndex}
         RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tranche not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        sowId: row.sow_id,
        name: row.name,
        description: row.description,
        amount: parseFloat(row.amount),
        percentage: row.percentage ? parseFloat(row.percentage) : null,
        dueDate: row.due_date,
        sequenceOrder: row.sequence_order,
        status: row.status,
        invoiceId: row.invoice_id,
        paidDate: row.paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Update SOW tranche error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /api/statementofworks/:sowId/tranches/:id/status - Quick status update
  router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
      const { sowId, id } = req.params;
      const { status } = req.body;
      
      if (!status || !['pending', 'invoiced', 'paid', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Valid status is required (pending, invoiced, paid, cancelled)' });
      }
      
      let paidDate = null;
      if (status === 'paid') {
        paidDate = new Date().toISOString().split('T')[0];
      }
      
      const result = await pool.query(
        `UPDATE sow_tranches 
         SET status = $1, paid_date = COALESCE($2, paid_date), updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 AND sow_id = $4
         RETURNING *`,
        [status, paidDate, id, sowId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tranche not found' });
      }
      
      const row = result.rows[0];
      res.json({
        id: row.id,
        sowId: row.sow_id,
        name: row.name,
        description: row.description,
        amount: parseFloat(row.amount),
        percentage: row.percentage ? parseFloat(row.percentage) : null,
        dueDate: row.due_date,
        sequenceOrder: row.sequence_order,
        status: row.status,
        invoiceId: row.invoice_id,
        paidDate: row.paid_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Update SOW tranche status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/statementofworks/:sowId/tranches/:id - Delete a tranche
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const { sowId, id } = req.params;
      
      const result = await pool.query(
        'DELETE FROM sow_tranches WHERE id = $1 AND sow_id = $2 RETURNING id',
        [id, sowId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tranche not found' });
      }
      
      res.json({ message: 'Tranche deleted successfully', id: result.rows[0].id });
    } catch (error) {
      console.error('Delete SOW tranche error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/statementofworks/:sowId/tranches/summary - Get summary statistics
  router.get('/summary', authMiddleware, async (req, res) => {
    try {
      const { sowId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_tranches,
          COUNT(*) FILTER (WHERE status = 'paid') as paid_count,
          COUNT(*) FILTER (WHERE status = 'invoiced') as invoiced_count,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
          COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
          COALESCE(SUM(amount), 0) as total_amount,
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as paid_amount,
          COALESCE(SUM(amount) FILTER (WHERE status = 'invoiced'), 0) as invoiced_amount,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as pending_amount
         FROM sow_tranches 
         WHERE sow_id = $1`,
        [sowId]
      );
      
      const row = result.rows[0];
      const totalAmount = parseFloat(row.total_amount);
      const paidAmount = parseFloat(row.paid_amount);
      
      res.json({
        totalTranches: parseInt(row.total_tranches),
        paidCount: parseInt(row.paid_count),
        invoicedCount: parseInt(row.invoiced_count),
        pendingCount: parseInt(row.pending_count),
        cancelledCount: parseInt(row.cancelled_count),
        totalAmount,
        paidAmount,
        invoicedAmount: parseFloat(row.invoiced_amount),
        pendingAmount: parseFloat(row.pending_amount),
        completionPercentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
      });
    } catch (error) {
      console.error('Get SOW tranches summary error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
