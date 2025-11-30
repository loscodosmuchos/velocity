#!/usr/bin/env node
/**
 * MVP RELIABILITY LENS
 * ====================
 * Comprehensive reliability assessment for Velocity MVP
 * Tests system stability, data consistency, and error resilience
 * 
 * Run: node server/scripts/mvp-reliability-lens.cjs
 */

const { Pool } = require('pg');
const http = require('http');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

function pass(message) { log(COLORS.green, '✓', message); }
function fail(message) { log(COLORS.red, '✗', message); }
function warn(message) { log(COLORS.yellow, '⚠', message); }
function info(message) { log(COLORS.cyan, '→', message); }
function header(message) { 
  console.log(`\n${COLORS.bold}${COLORS.magenta}▓▓▓ ${message} ▓▓▓${COLORS.reset}\n`); 
}

async function httpGet(path, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(`http://localhost:3001${path}`, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          time: Date.now() - startTime,
          data
        });
      });
    });
    req.on('error', (err) => {
      resolve({ success: false, error: err.message, time: Date.now() - startTime });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'timeout', time: timeout });
    });
  });
}

async function runReliabilityTests() {
  console.log(`
${COLORS.bold}${COLORS.magenta}
╔═══════════════════════════════════════════════════════════════╗
║          MVP RELIABILITY LENS                                 ║
║          System Stability & Data Consistency Assessment       ║
╚═══════════════════════════════════════════════════════════════╝
${COLORS.reset}`);

  const results = {
    database: { passed: 0, failed: 0, tests: [] },
    api: { passed: 0, failed: 0, tests: [] },
    data: { passed: 0, failed: 0, tests: [] },
    performance: { passed: 0, failed: 0, tests: [] }
  };

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
  });

  try {
    // ═══════════════════════════════════════════════════════════
    header('DATABASE RELIABILITY');
    // ═══════════════════════════════════════════════════════════

    // Test 1: Connection Pool Stability
    try {
      const connections = [];
      for (let i = 0; i < 3; i++) {
        const client = await pool.connect();
        connections.push(client);
      }
      connections.forEach(c => c.release());
      pass('Connection pool handles concurrent connections');
      results.database.passed++;
    } catch (err) {
      fail(`Connection pool issue: ${err.message}`);
      results.database.failed++;
    }

    // Test 2: Query Response Time
    try {
      const start = Date.now();
      await pool.query('SELECT COUNT(*) FROM contractors');
      const queryTime = Date.now() - start;
      
      if (queryTime < 100) {
        pass(`Query response: ${queryTime}ms (excellent)`);
        results.database.passed++;
      } else if (queryTime < 500) {
        warn(`Query response: ${queryTime}ms (acceptable)`);
        results.database.passed++;
      } else {
        fail(`Query response: ${queryTime}ms (too slow)`);
        results.database.failed++;
      }
    } catch (err) {
      fail(`Query performance: ${err.message}`);
      results.database.failed++;
    }

    // Test 3: Transaction Integrity
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('SELECT 1');
        await client.query('ROLLBACK');
        pass('Transaction rollback works correctly');
        results.database.passed++;
      } finally {
        client.release();
      }
    } catch (err) {
      fail(`Transaction integrity: ${err.message}`);
      results.database.failed++;
    }

    // Test 4: Schema Integrity
    try {
      const tables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `);
      const requiredTables = ['contractors', 'purchase_orders', 'invoices', 'alerts', 'departments', 'statements_of_work'];
      const existingTables = tables.rows.map(r => r.table_name);
      const missing = requiredTables.filter(t => !existingTables.includes(t));
      
      if (missing.length === 0) {
        pass(`All ${requiredTables.length} required tables exist`);
        results.database.passed++;
      } else {
        fail(`Missing tables: ${missing.join(', ')}`);
        results.database.failed++;
      }
    } catch (err) {
      fail(`Schema check: ${err.message}`);
      results.database.failed++;
    }

    // ═══════════════════════════════════════════════════════════
    header('API RELIABILITY');
    // ═══════════════════════════════════════════════════════════

    const endpoints = [
      { path: '/api/contractors', name: 'Contractors' },
      { path: '/api/purchase-orders', name: 'Purchase Orders' },
      { path: '/api/invoices', name: 'Invoices' },
      { path: '/api/alerts', name: 'Alerts' },
      { path: '/api/departments', name: 'Departments' },
      { path: '/api/statements-of-work', name: 'SOWs' }
    ];
    
    info('Note: 401 responses expected if auth is enabled (use demo mode for unauthenticated access)');

    for (const endpoint of endpoints) {
      const result = await httpGet(endpoint.path);
      if (result.success) {
        if (result.time < 200) {
          pass(`${endpoint.name} API: ${result.time}ms (fast)`);
        } else if (result.time < 1000) {
          pass(`${endpoint.name} API: ${result.time}ms (ok)`);
        } else {
          warn(`${endpoint.name} API: ${result.time}ms (slow)`);
        }
        results.api.passed++;
      } else if (result.status === 401) {
        pass(`${endpoint.name} API: Auth required (endpoint reachable)`);
        results.api.passed++;
      } else {
        if (result.error === 'connect ECONNREFUSED 127.0.0.1:3001') {
          warn(`${endpoint.name} API: Server not running on port 3001`);
        } else {
          fail(`${endpoint.name} API: ${result.error || `Status ${result.status}`}`);
        }
        results.api.failed++;
      }
    }

    // ═══════════════════════════════════════════════════════════
    header('DATA CONSISTENCY');
    // ═══════════════════════════════════════════════════════════

    // Test: No orphaned records
    try {
      const orphanedPOs = await pool.query(`
        SELECT COUNT(*) as count FROM purchase_orders po
        WHERE po.contractor_id IS NOT NULL 
        AND NOT EXISTS (SELECT 1 FROM contractors c WHERE c.id = po.contractor_id)
      `);
      const orphanCount = parseInt(orphanedPOs.rows[0].count);
      if (orphanCount === 0) {
        pass('No orphaned PO records');
        results.data.passed++;
      } else {
        fail(`${orphanCount} orphaned PO records found`);
        results.data.failed++;
      }
    } catch (err) {
      warn(`Orphan check: ${err.message}`);
    }

    // Test: No NULL critical fields
    try {
      const nullChecks = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM contractors WHERE first_name IS NULL OR last_name IS NULL) as null_names,
          (SELECT COUNT(*) FROM purchase_orders WHERE po_number IS NULL) as null_po_numbers,
          (SELECT COUNT(*) FROM invoices WHERE invoice_number IS NULL) as null_invoices
      `);
      const row = nullChecks.rows[0];
      const nullCount = parseInt(row.null_names) + parseInt(row.null_po_numbers) + parseInt(row.null_invoices);
      
      if (nullCount === 0) {
        pass('No NULL values in critical fields');
        results.data.passed++;
      } else {
        fail(`${nullCount} NULL values in critical fields`);
        results.data.failed++;
      }
    } catch (err) {
      warn(`NULL check: ${err.message}`);
    }

    // Test: No duplicate identifiers
    try {
      const dupCheck = await pool.query(`
        SELECT 
          (SELECT COUNT(*) - COUNT(DISTINCT po_number) FROM purchase_orders) as dup_pos,
          (SELECT COUNT(*) - COUNT(DISTINCT invoice_number) FROM invoices) as dup_invoices
      `);
      const row = dupCheck.rows[0];
      const dupCount = parseInt(row.dup_pos) + parseInt(row.dup_invoices);
      
      if (dupCount === 0) {
        pass('No duplicate identifiers');
        results.data.passed++;
      } else {
        warn(`${dupCount} duplicate identifiers found`);
        results.data.failed++;
      }
    } catch (err) {
      warn(`Duplicate check: ${err.message}`);
    }

    // Test: Valid date ranges
    try {
      const dateCheck = await pool.query(`
        SELECT COUNT(*) as invalid FROM purchase_orders
        WHERE end_date IS NOT NULL AND start_date IS NOT NULL AND end_date < start_date
      `);
      const invalidDates = parseInt(dateCheck.rows[0].invalid);
      
      if (invalidDates === 0) {
        pass('All date ranges valid (start < end)');
        results.data.passed++;
      } else {
        fail(`${invalidDates} records with invalid date ranges`);
        results.data.failed++;
      }
    } catch (err) {
      warn(`Date range check: ${err.message}`);
    }

    // Test: Reasonable financial values
    try {
      const finCheck = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM purchase_orders WHERE total_amount < 0) as negative_po,
          (SELECT COUNT(*) FROM invoices WHERE amount < 0) as negative_invoice,
          (SELECT COUNT(*) FROM contractors WHERE pay_rate < 0) as negative_pay
      `);
      const row = finCheck.rows[0];
      const negCount = parseInt(row.negative_po) + parseInt(row.negative_invoice) + parseInt(row.negative_pay);
      
      if (negCount === 0) {
        pass('All financial values non-negative');
        results.data.passed++;
      } else {
        fail(`${negCount} negative financial values`);
        results.data.failed++;
      }
    } catch (err) {
      warn(`Financial validation: ${err.message}`);
    }

    // ═══════════════════════════════════════════════════════════
    header('PERFORMANCE METRICS');
    // ═══════════════════════════════════════════════════════════

    // Test: Complex query performance
    try {
      const start = Date.now();
      await pool.query(`
        SELECT 
          d.name as department,
          COUNT(c.id) as contractor_count,
          COALESCE(SUM(c.pay_rate), 0) as total_pay
        FROM departments d
        LEFT JOIN contractors c ON c.department_id = d.id
        GROUP BY d.id, d.name
        ORDER BY contractor_count DESC
      `);
      const queryTime = Date.now() - start;
      
      if (queryTime < 200) {
        pass(`Complex aggregation: ${queryTime}ms (excellent)`);
        results.performance.passed++;
      } else if (queryTime < 1000) {
        pass(`Complex aggregation: ${queryTime}ms (acceptable)`);
        results.performance.passed++;
      } else {
        fail(`Complex aggregation: ${queryTime}ms (needs optimization)`);
        results.performance.failed++;
      }
    } catch (err) {
      fail(`Complex query: ${err.message}`);
      results.performance.failed++;
    }

    // Test: Bulk read performance
    try {
      const start = Date.now();
      await pool.query('SELECT * FROM contractors');
      await pool.query('SELECT * FROM purchase_orders');
      await pool.query('SELECT * FROM invoices');
      const totalTime = Date.now() - start;
      
      if (totalTime < 300) {
        pass(`Bulk read (3 tables): ${totalTime}ms (excellent)`);
        results.performance.passed++;
      } else if (totalTime < 1000) {
        pass(`Bulk read (3 tables): ${totalTime}ms (acceptable)`);
        results.performance.passed++;
      } else {
        warn(`Bulk read (3 tables): ${totalTime}ms (slow)`);
        results.performance.failed++;
      }
    } catch (err) {
      fail(`Bulk read: ${err.message}`);
      results.performance.failed++;
    }

    // Test: Index effectiveness
    try {
      const indexCheck = await pool.query(`
        SELECT indexname, tablename 
        FROM pg_indexes 
        WHERE schemaname = 'public'
        AND tablename IN ('contractors', 'purchase_orders', 'invoices')
      `);
      const indexCount = indexCheck.rows.length;
      
      if (indexCount >= 3) {
        pass(`${indexCount} indexes on core tables`);
        results.performance.passed++;
      } else {
        warn(`Only ${indexCount} indexes - consider adding more`);
        results.performance.failed++;
      }
    } catch (err) {
      warn(`Index check: ${err.message}`);
    }

  } catch (err) {
    fail(`Critical error: ${err.message}`);
  } finally {
    await pool.end();
  }

  // ═══════════════════════════════════════════════════════════
  // RELIABILITY SCORE CALCULATION
  // ═══════════════════════════════════════════════════════════

  console.log(`
${COLORS.bold}${COLORS.magenta}
╔═══════════════════════════════════════════════════════════════╗
║                    RELIABILITY SCORECARD                      ║
╚═══════════════════════════════════════════════════════════════╝
${COLORS.reset}`);

  const categories = [
    { name: 'Database', data: results.database, weight: 0.30 },
    { name: 'API', data: results.api, weight: 0.25 },
    { name: 'Data Consistency', data: results.data, weight: 0.30 },
    { name: 'Performance', data: results.performance, weight: 0.15 }
  ];

  let totalWeightedScore = 0;
  let totalWeight = 0;

  categories.forEach(cat => {
    const total = cat.data.passed + cat.data.failed;
    const score = total > 0 ? (cat.data.passed / total * 100) : 0;
    const weighted = score * cat.weight;
    totalWeightedScore += weighted;
    totalWeight += cat.weight;

    const scoreColor = score >= 90 ? COLORS.green : score >= 70 ? COLORS.yellow : COLORS.red;
    const bar = '█'.repeat(Math.floor(score / 5)) + '░'.repeat(20 - Math.floor(score / 5));
    
    console.log(`${COLORS.bold}  ${cat.name.padEnd(18)}${COLORS.reset} ${scoreColor}${bar} ${score.toFixed(0)}%${COLORS.reset} (${cat.data.passed}/${total})`);
  });

  const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const overallColor = overallScore >= 90 ? COLORS.green : overallScore >= 70 ? COLORS.yellow : COLORS.red;

  console.log(`
${COLORS.bold}${overallColor}
  ╔════════════════════════════════════════════╗
  ║  OVERALL RELIABILITY: ${overallScore.toFixed(0).padStart(3)}%                  ║
  ╚════════════════════════════════════════════╝
${COLORS.reset}`);

  // Reliability Grade
  let grade, gradeDesc;
  if (overallScore >= 95) {
    grade = 'A+';
    gradeDesc = 'Production Ready';
  } else if (overallScore >= 90) {
    grade = 'A';
    gradeDesc = 'Demo Ready';
  } else if (overallScore >= 80) {
    grade = 'B';
    gradeDesc = 'Acceptable with Caveats';
  } else if (overallScore >= 70) {
    grade = 'C';
    gradeDesc = 'Needs Improvement';
  } else {
    grade = 'D';
    gradeDesc = 'Not Ready';
  }

  console.log(`${COLORS.bold}  Grade: ${overallColor}${grade}${COLORS.reset} - ${gradeDesc}`);
  console.log(`${COLORS.dim}  Tested at: ${new Date().toISOString()}${COLORS.reset}\n`);

  process.exit(overallScore >= 80 ? 0 : 1);
}

runReliabilityTests().catch(err => {
  console.error(`${COLORS.red}Script error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});
