const express = require('express');
const router = express.Router();
const pool = require('../config/database.cjs');

// 1x1 transparent PNG pixel (base64)
const TRACKING_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Tracking pixel endpoint - logs successful page load
router.get('/pixel.png', async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    const ip = req.ip || req.connection.remoteAddress;
    const page = req.query.page || 'unknown';

    // Log the successful load to database
    await pool.query(`
      INSERT INTO page_load_tracking (
        page, user_agent, referer, ip_address, loaded_at
      ) VALUES ($1, $2, $3, $4, NOW())
    `, [page, userAgent, referer, ip]);

    // Return 1x1 transparent PNG
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': TRACKING_PIXEL.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.send(TRACKING_PIXEL);
  } catch (error) {
    console.error('❌ Tracking pixel error:', error.message);
    // Still return pixel even if logging fails
    res.set('Content-Type', 'image/png');
    res.send(TRACKING_PIXEL);
  }
});

// Get last validated load for a specific page
router.get('/last-load/:page', async (req, res) => {
  try {
    const { page } = req.params;
    
    const result = await pool.query(`
      SELECT 
        page,
        loaded_at,
        user_agent,
        referer,
        EXTRACT(EPOCH FROM (NOW() - loaded_at)) AS seconds_ago
      FROM page_load_tracking
      WHERE page = $1
      ORDER BY loaded_at DESC
      LIMIT 1
    `, [page]);

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: `No load history for page: ${page}`
      });
    }

    const load = result.rows[0];
    res.json({
      success: true,
      page: load.page,
      lastValidatedLoad: load.loaded_at,
      secondsAgo: Math.floor(load.seconds_ago),
      userAgent: load.user_agent,
      referer: load.referer,
      status: load.seconds_ago < 300 ? 'recent' : 'stale' // Fresh if < 5 min
    });
  } catch (error) {
    console.error('❌ Last load check failed:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get load history for all pages (last 24 hours)
router.get('/history', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        page,
        COUNT(*) as load_count,
        MAX(loaded_at) as last_load,
        MIN(loaded_at) as first_load,
        EXTRACT(EPOCH FROM (NOW() - MAX(loaded_at))) AS seconds_since_last_load
      FROM page_load_tracking
      WHERE loaded_at > NOW() - INTERVAL '24 hours'
      GROUP BY page
      ORDER BY last_load DESC
    `);

    res.json({
      success: true,
      period: 'last_24_hours',
      pages: result.rows.map(row => ({
        page: row.page,
        loadCount: parseInt(row.load_count),
        lastLoad: row.last_load,
        firstLoad: row.first_load,
        secondsSinceLastLoad: Math.floor(row.seconds_since_last_load),
        status: row.seconds_since_last_load < 300 ? 'active' : 'inactive'
      }))
    });
  } catch (error) {
    console.error('❌ Load history failed:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
