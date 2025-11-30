const express = require('express');
const router = express.Router();

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

router.post('/hybrid', authenticateToken, async (req, res) => {
  try {
    const { query, limit = 20, embedding = null } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const pool = req.app.get('db');

    if (embedding && Array.isArray(embedding)) {
      const queryText = `
        WITH keyword_results AS (
          SELECT 
            id, contractor_id, first_name, last_name, email, company_name, location, job_description,
            ts_rank(fts, websearch_to_tsquery('english', $1)) AS score,
            ROW_NUMBER() OVER (ORDER BY ts_rank(fts, websearch_to_tsquery('english', $1)) DESC) AS rank
          FROM contractors
          WHERE fts @@ websearch_to_tsquery('english', $1) AND status = 'Active'
          LIMIT 50
        ),
        vector_results AS (
          SELECT 
            id, contractor_id, first_name, last_name, email, company_name, location, job_description,
            1 - (embedding <=> $2::vector) AS score,
            ROW_NUMBER() OVER (ORDER BY embedding <=> $2::vector) AS rank
          FROM contractors
          WHERE status = 'Active' AND embedding IS NOT NULL
          LIMIT 50
        )
        SELECT 
          COALESCE(k.id, v.id) as id,
          COALESCE(k.contractor_id, v.contractor_id) as contractor_id,
          COALESCE(k.first_name, v.first_name) as first_name,
          COALESCE(k.last_name, v.last_name) as last_name,
          COALESCE(k.email, v.email) as email,
          COALESCE(k.company_name, v.company_name) as company_name,
          COALESCE(k.location, v.location) as location,
          COALESCE(k.job_description, v.job_description) as job_description,
          (COALESCE(1.0 / (60 + k.rank), 0) * 0.4) + 
          (COALESCE(1.0 / (60 + v.rank), 0) * 0.6) AS rrf_score
        FROM keyword_results k
        FULL OUTER JOIN vector_results v ON k.id = v.id
        ORDER BY rrf_score DESC
        LIMIT $3
      `;

      const result = await pool.query(queryText, [query, JSON.stringify(embedding), limit]);
      return res.json({ results: result.rows, method: 'hybrid_rrf' });
    }

    const keywordQuery = `
      SELECT 
        id, contractor_id, first_name, last_name, email, company_name, location, job_description, status,
        ts_rank(fts, websearch_to_tsquery('english', $1)) AS score
      FROM contractors
      WHERE fts @@ websearch_to_tsquery('english', $1) AND status = 'Active'
      ORDER BY score DESC
      LIMIT $2
    `;

    const result = await pool.query(keywordQuery, [query, limit]);
    res.json({ results: result.rows, method: 'keyword_only' });

  } catch (error) {
    console.error('Hybrid search error:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

router.post('/semantic', authenticateToken, async (req, res) => {
  try {
    const { embedding, limit = 20 } = req.body;

    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ error: 'Embedding array is required' });
    }

    const pool = req.app.get('db');

    const query = `
      SELECT 
        id, contractor_id, first_name, last_name, email, company_name, location, job_description,
        1 - (embedding <=> $1::vector) AS similarity
      FROM contractors
      WHERE status = 'Active' AND embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;

    const result = await pool.query(query, [JSON.stringify(embedding), limit]);
    res.json({ results: result.rows, method: 'semantic' });

  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ error: 'Semantic search failed', details: error.message });
  }
});

router.get('/test', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.get('db');
    
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_contractors,
        COUNT(fts) as has_fts,
        COUNT(embedding) as has_embedding
      FROM contractors
      WHERE status = 'Active'
    `);

    res.json({ 
      message: 'Hybrid search system status',
      stats: result.rows[0],
      capabilities: {
        keyword_search: true,
        semantic_search: result.rows[0].has_embedding > 0,
        hybrid_rrf: result.rows[0].has_embedding > 0
      }
    });
  } catch (error) {
    console.error('Search status error:', error);
    res.status(500).json({ error: 'Failed to check search status' });
  }
});

module.exports = router;
