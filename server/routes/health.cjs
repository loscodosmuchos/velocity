const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const pool = req.app.get('db');
    
    const dbStatus = await pool.query('SELECT 1 as healthy')
      .then(() => ({ status: 'healthy', connected: true }))
      .catch((err) => ({ status: 'unhealthy', connected: false, error: err.message }));

    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: { status: 'healthy', uptime: process.uptime() },
        database: dbStatus,
      },
      environment: {
        mode: process.env.VITE_DEMO_MODE === 'true' ? 'demo' : 'production',
        nodeVersion: process.version,
      }
    };

    const httpStatus = dbStatus.connected ? 200 : 503;
    res.status(httpStatus).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

router.get('/ready', async (req, res) => {
  try {
    const pool = req.app.get('db');
    
    await pool.query('SELECT 1');
    
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
});

module.exports = router;
