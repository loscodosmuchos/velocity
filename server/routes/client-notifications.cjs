const express = require('express');
const router = express.Router();

/**
 * Convert database snake_case to frontend camelCase
 */
function toCamelCase(dbRow) {
  return {
    id: dbRow.id,
    clientName: dbRow.client_name,
    title: dbRow.title,
    message: dbRow.message,
    type: dbRow.type,
    requirementId: dbRow.requirement_id,
    isRead: dbRow.is_read,
    createdAt: dbRow.created_at
  };
}

/**
 * Client Notifications Router Factory
 * Handles notifications sent to clients about missing data requirements
 * 
 * @param {Pool} pool - PostgreSQL connection pool
 * @param {Function} authMiddleware - JWT authentication middleware
 * @param {Object} options - Configuration options
 * @param {boolean} options.isDemoMode - Whether to return mock data
 * @returns {Router} Express router
 */
function createClientNotificationsRouter(pool, authMiddleware, { isDemoMode = false } = {}) {
  
  const demoNotifications = [
    {
      id: 'demo-notif-001',
      client_name: 'TechFlow Industries',
      title: 'New requirement: Enterprise Integration Platform Contract',
      message: 'You have a new data requirement for contract TECH-INTEGRATION-2024. Please review and complete by 2025-12-31.',
      type: 'new-requirement',
      requirement_id: 'demo-req-001',
      is_read: false,
      created_at: '2025-11-01T10:00:00Z'
    },
    {
      id: 'demo-notif-002',
      client_name: 'TechFlow Industries',
      title: 'Reminder: Technical Requirements Needed',
      message: 'This is a reminder to complete the technical requirements for TECH-INTEGRATION-2024. Due date approaching.',
      type: 'reminder',
      requirement_id: 'demo-req-001',
      is_read: false,
      created_at: '2025-11-10T14:00:00Z'
    },
    {
      id: 'demo-notif-003',
      client_name: 'DataStream Solutions',
      title: 'New requirement: Cloud Migration Services Agreement',
      message: 'You have a new data requirement for contract CLOUD-SERVICES-2024. Please review and complete by 2025-11-30.',
      type: 'new-requirement',
      requirement_id: 'demo-req-002',
      is_read: true,
      created_at: '2025-10-15T14:30:00Z'
    }
  ];

  router.get('/:clientName', authMiddleware, async (req, res) => {
    try {
      const { clientName } = req.params;
      const { unreadOnly = 'false' } = req.query;

      if (isDemoMode) {
        let filtered = demoNotifications.filter(n => 
          n.client_name.toLowerCase() === clientName.toLowerCase()
        );

        if (unreadOnly === 'true') {
          filtered = filtered.filter(n => !n.is_read);
        }

        const unreadCount = filtered.filter(n => !n.is_read).length;

        return res.json({
          notifications: filtered.map(toCamelCase),
          unreadCount
        });
      }

      let query = 'SELECT * FROM client_notifications WHERE client_name = $1';
      const params = [clientName];

      if (unreadOnly === 'true') {
        query += ' AND is_read = FALSE';
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      const unreadResult = await pool.query(
        'SELECT COUNT(*) FROM client_notifications WHERE client_name = $1 AND is_read = FALSE',
        [clientName]
      );

      res.json({
        notifications: result.rows.map(toCamelCase),
        unreadCount: parseInt(unreadResult.rows[0].count)
      });
    } catch (error) {
      console.error('Get client notifications error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      if (isDemoMode) {
        return res.json({
          success: true,
          message: 'Notification marked as read (DEMO MODE)'
        });
      }

      const result = await pool.query(
        'UPDATE client_notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({
        success: true,
        notification: toCamelCase(result.rows[0]),
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
        type,
        isRead
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
        let filteredData = [...demoNotifications];
        
        if (clientName) {
          filteredData = filteredData.filter(n => 
            n.client_name.toLowerCase().includes(clientName.toLowerCase())
          );
        }
        if (type) {
          filteredData = filteredData.filter(n => n.type === type);
        }
        if (isRead !== undefined) {
          const readValue = isRead === 'true';
          filteredData = filteredData.filter(n => n.is_read === readValue);
        }

        const paginatedData = filteredData.slice(startInt, endInt);
        
        res.set('X-Total-Count', filteredData.length.toString());
        return res.json(paginatedData.map(toCamelCase));
      }

      let query = 'SELECT * FROM client_notifications';
      const conditions = [];
      const params = [];
      let paramCount = 0;

      if (clientName) {
        paramCount++;
        conditions.push(`client_name ILIKE $${paramCount}`);
        params.push(`%${clientName}%`);
      }
      if (type) {
        paramCount++;
        conditions.push(`type = $${paramCount}`);
        params.push(type);
      }
      if (isRead !== undefined) {
        paramCount++;
        conditions.push(`is_read = $${paramCount}`);
        params.push(isRead === 'true');
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM client_notifications${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`,
        params
      );

      const allowedSortColumns = ['created_at', 'client_name', 'title', 'type', 'is_read'];
      const sortColumn = allowedSortColumns.includes(_sort) ? _sort : 'created_at';
      const sortOrder = _order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortColumn} ${sortOrder}`;
      query += ` LIMIT ${endInt - startInt} OFFSET ${startInt}`;

      const result = await pool.query(query, params);

      res.set('X-Total-Count', countResult.rows[0].count);
      res.json(result.rows.map(toCamelCase));
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = createClientNotificationsRouter;
