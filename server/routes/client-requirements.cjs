const express = require('express');
const router = express.Router();

/**
 * Convert database snake_case to frontend camelCase
 */
function toCamelCase(dbRow) {
  return {
    id: dbRow.id,
    clientName: dbRow.client_name,
    contractTitle: dbRow.contract_title,
    contractId: dbRow.contract_id,
    categories: dbRow.categories,
    dueDate: dbRow.due_date,
    requestedBy: dbRow.requested_by,
    priority: dbRow.priority,
    status: dbRow.status,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
    completedAt: dbRow.completed_at,
    responses: dbRow.responses
  };
}

/**
 * Client Requirements Router Factory
 * Handles missing data requirements sent to clients/contractors
 * 
 * @param {Pool} pool - PostgreSQL connection pool
 * @param {Function} authMiddleware - JWT authentication middleware
 * @param {Object} options - Configuration options
 * @param {boolean} options.isDemoMode - Whether to return mock data
 * @returns {Router} Express router
 */
function createClientRequirementsRouter(pool, authMiddleware, { isDemoMode = false } = {}) {
  
  const demoRequirements = [
    {
      id: 'demo-req-001',
      client_name: 'TechFlow Industries',
      contract_title: 'Enterprise Integration Platform Contract',
      contract_id: 'TECH-INTEGRATION-2024',
      categories: [
        {
          id: 'financial',
          name: 'Financial Data',
          priority: 'Critical',
          fields: [
            { id: 'total_contract_value', label: 'Total Contract Value', type: 'currency', required: true },
            { id: 'payment_schedule', label: 'Payment Schedule', type: 'text', required: true }
          ]
        }
      ],
      due_date: '2025-12-31',
      requested_by: 'System Admin',
      priority: 'High',
      status: 'pending',
      created_at: '2025-11-01T10:00:00Z',
      updated_at: '2025-11-01T10:00:00Z',
      responses: {}
    },
    {
      id: 'demo-req-002',
      client_name: 'DataStream Solutions',
      contract_title: 'Cloud Migration Services Agreement',
      contract_id: 'CLOUD-SERVICES-2024',
      categories: [
        {
          id: 'technical',
          name: 'Technical Requirements',
          priority: 'High',
          fields: [
            { id: 'system_requirements', label: 'System Requirements', type: 'textarea', required: true },
            { id: 'integration_points', label: 'Integration Points', type: 'textarea', required: true }
          ]
        }
      ],
      due_date: '2025-11-30',
      requested_by: 'Technical Lead',
      priority: 'Critical',
      status: 'in-progress',
      created_at: '2025-10-15T14:30:00Z',
      updated_at: '2025-11-10T09:15:00Z',
      responses: { system_requirements: 'Ubuntu 22.04 LTS, 16GB RAM minimum' }
    }
  ];

  router.post('/', authMiddleware, async (req, res) => {
    try {
      if (isDemoMode) {
        const newRequirement = {
          id: `demo-req-${Date.now()}`,
          client_name: req.body.clientName,
          contract_title: req.body.contractTitle,
          contract_id: req.body.contractId,
          categories: req.body.categories,
          due_date: req.body.dueDate,
          requested_by: req.body.requestedBy,
          priority: req.body.priority || 'Medium',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null,
          responses: {}
        };
        
        return res.status(201).json({
          success: true,
          requirement: toCamelCase(newRequirement),
          message: 'Client requirement created successfully (DEMO MODE)'
        });
      }

      const {
        clientName,
        contractTitle,
        contractId,
        categories,
        dueDate,
        requestedBy,
        priority = 'Medium'
      } = req.body;

      if (!clientName || !contractTitle || !contractId || !categories) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: clientName, contractTitle, contractId, categories' 
        });
      }

      const result = await pool.query(
        `INSERT INTO client_requirements 
        (client_name, contract_title, contract_id, categories, due_date, requested_by, priority, status)
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
        RETURNING *`,
        [clientName, contractTitle, contractId, JSON.stringify(categories), dueDate, requestedBy, priority, 'pending']
      );

      const newRequirement = result.rows[0];
      
      await pool.query(
        `INSERT INTO client_notifications 
        (client_name, title, message, type, requirement_id, is_read)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          clientName,
          `New requirement: ${contractTitle}`,
          `You have a new data requirement for contract ${contractId}. Please review and complete by ${dueDate || 'as soon as possible'}.`,
          'new-requirement',
          newRequirement.id,
          false
        ]
      );

      res.status(201).json({
        success: true,
        requirement: toCamelCase(newRequirement),
        message: 'Client requirement created successfully'
      });
    } catch (error) {
      console.error('Create client requirement error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    try {
      let { 
        _start = '0', 
        _end = '10', 
        _sort = 'created_at', 
        _order = 'DESC',
        clientName,
        status,
        priority
      } = req.query;

      // Validate pagination parameters
      let startInt = parseInt(_start, 10);
      let endInt = parseInt(_end, 10);
      if (isNaN(startInt) || isNaN(endInt) || startInt < 0 || endInt < 0 || endInt > 1000) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }
      // Ensure endInt > startInt
      if (endInt <= startInt) {
        endInt = startInt + 10;
      }

      if (isDemoMode) {
        let filteredData = [...demoRequirements];
        
        if (clientName) {
          filteredData = filteredData.filter(r => 
            r.client_name.toLowerCase().includes(clientName.toLowerCase())
          );
        }
        if (status) {
          filteredData = filteredData.filter(r => r.status === status);
        }
        if (priority) {
          filteredData = filteredData.filter(r => r.priority === priority);
        }

        const paginatedData = filteredData.slice(startInt, endInt);
        
        res.set('X-Total-Count', filteredData.length.toString());
        return res.json(paginatedData.map(toCamelCase));
      }

      let query = 'SELECT * FROM client_requirements';
      const conditions = [];
      const params = [];
      let paramCount = 0;

      if (clientName) {
        paramCount++;
        conditions.push(`client_name ILIKE $${paramCount}`);
        params.push(`%${clientName}%`);
      }
      if (status) {
        paramCount++;
        conditions.push(`status = $${paramCount}`);
        params.push(status);
      }
      if (priority) {
        paramCount++;
        conditions.push(`priority = $${paramCount}`);
        params.push(priority);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM client_requirements${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`,
        params
      );

      const allowedSortColumns = ['created_at', 'updated_at', 'client_name', 'contract_title', 'priority', 'status', 'due_date'];
      const sortColumn = allowedSortColumns.includes(_sort) ? _sort : 'created_at';
      const sortOrder = _order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortColumn} ${sortOrder}`;
      query += ` LIMIT ${endInt - startInt} OFFSET ${startInt}`;

      const result = await pool.query(query, params);

      res.set('X-Total-Count', countResult.rows[0].count);
      res.json(result.rows.map(toCamelCase));
    } catch (error) {
      console.error('Get client requirements error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, responses, completedAt } = req.body;

      if (isDemoMode) {
        const updated = {
          id,
          status,
          updated_at: new Date().toISOString()
        };
        return res.json({
          success: true,
          message: 'Requirement updated successfully (DEMO MODE)',
          requirement: { id, status, updatedAt: updated.updated_at }
        });
      }

      const updates = [];
      const params = [];
      let paramCount = 0;

      if (status) {
        paramCount++;
        updates.push(`status = $${paramCount}`);
        params.push(status);
      }
      if (responses) {
        paramCount++;
        updates.push(`responses = $${paramCount}`);
        params.push(JSON.stringify(responses));
      }
      if (completedAt) {
        paramCount++;
        updates.push(`completed_at = $${paramCount}`);
        params.push(completedAt);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      paramCount++;
      params.push(id);

      const result = await pool.query(
        `UPDATE client_requirements 
        SET ${updates.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *`,
        params
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Requirement not found' });
      }

      res.json({
        success: true,
        requirement: toCamelCase(result.rows[0]),
        message: 'Requirement updated successfully'
      });
    } catch (error) {
      console.error('Update client requirement error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = createClientRequirementsRouter;
