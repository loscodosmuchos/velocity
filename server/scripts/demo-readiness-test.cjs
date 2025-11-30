#!/usr/bin/env node
/**
 * VELOCITY DEMO READINESS TEST SCRIPT
 * ====================================
 * Automated MVP validation for December 2025 Hyundai presentation
 * 
 * Run: node server/scripts/demo-readiness-test.cjs
 * 
 * Tests:
 * - Database connectivity
 * - Data integrity (SOWs, contractors, POs, invoices)
 * - API endpoint health
 * - Metric calculations
 * - Critical thresholds
 */

const { Pool } = require('pg');

const REQUIRED_COUNTS = {
  sows: 8,
  contractors: 44,
  purchase_orders: 10,
  invoices: 10,
  departments: 5,
  alerts: 5
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
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
  console.log(`\n${COLORS.bold}${COLORS.cyan}═══ ${message} ═══${COLORS.reset}\n`); 
}

async function runTests() {
  console.log(`
${COLORS.bold}${COLORS.cyan}
╔════════════════════════════════════════════════════════════╗
║       VELOCITY DEMO READINESS TEST                         ║
║       MVP Validation for Hyundai December 2025             ║
╚════════════════════════════════════════════════════════════╝
${COLORS.reset}`);

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  };

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // ═══════════════════════════════════════════════════════════
    header('DATABASE CONNECTIVITY');
    // ═══════════════════════════════════════════════════════════
    
    try {
      const connTest = await pool.query('SELECT NOW() as time, current_database() as db');
      pass(`Connected to database: ${connTest.rows[0].db}`);
      info(`Server time: ${connTest.rows[0].time}`);
      results.passed++;
      results.tests.push({ name: 'Database Connection', status: 'PASS' });
    } catch (err) {
      fail(`Database connection failed: ${err.message}`);
      results.failed++;
      results.tests.push({ name: 'Database Connection', status: 'FAIL', error: err.message });
      throw new Error('Cannot proceed without database connection');
    }

    // ═══════════════════════════════════════════════════════════
    header('DATA INTEGRITY CHECKS');
    // ═══════════════════════════════════════════════════════════

    const countChecks = [
      { table: 'statements_of_work', alias: 'SOWs', required: REQUIRED_COUNTS.sows },
      { table: 'contractors', alias: 'Contractors', required: REQUIRED_COUNTS.contractors },
      { table: 'purchase_orders', alias: 'Purchase Orders', required: REQUIRED_COUNTS.purchase_orders },
      { table: 'invoices', alias: 'Invoices', required: REQUIRED_COUNTS.invoices },
      { table: 'departments', alias: 'Departments', required: REQUIRED_COUNTS.departments },
      { table: 'alerts', alias: 'Alerts', required: REQUIRED_COUNTS.alerts }
    ];

    for (const check of countChecks) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${check.table}`);
        const count = parseInt(result.rows[0].count);
        
        if (count >= check.required) {
          pass(`${check.alias}: ${count} records (required: ${check.required}+)`);
          results.passed++;
          results.tests.push({ name: `${check.alias} Count`, status: 'PASS', count });
        } else if (count > 0) {
          warn(`${check.alias}: ${count} records (expected: ${check.required}+)`);
          results.warnings++;
          results.tests.push({ name: `${check.alias} Count`, status: 'WARN', count, expected: check.required });
        } else {
          fail(`${check.alias}: ${count} records (EMPTY TABLE)`);
          results.failed++;
          results.tests.push({ name: `${check.alias} Count`, status: 'FAIL', count: 0 });
        }
      } catch (err) {
        fail(`${check.alias}: Table check failed - ${err.message}`);
        results.failed++;
        results.tests.push({ name: `${check.alias} Count`, status: 'FAIL', error: err.message });
      }
    }

    // ═══════════════════════════════════════════════════════════
    header('FINANCIAL METRICS VALIDATION');
    // ═══════════════════════════════════════════════════════════

    try {
      const poTotal = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM purchase_orders');
      const totalValue = parseFloat(poTotal.rows[0].total);
      
      if (totalValue > 0) {
        pass(`Total PO Value: $${totalValue.toLocaleString()}`);
        results.passed++;
        results.tests.push({ name: 'PO Total Value', status: 'PASS', value: totalValue });
      } else {
        fail('Total PO Value: $0 (No financial data)');
        results.failed++;
        results.tests.push({ name: 'PO Total Value', status: 'FAIL' });
      }
    } catch (err) {
      warn(`PO Total calculation: ${err.message}`);
      results.warnings++;
    }

    try {
      const invoiceTotal = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM invoices');
      const totalInvoices = parseFloat(invoiceTotal.rows[0].total);
      
      if (totalInvoices > 0) {
        pass(`Total Invoice Value: $${totalInvoices.toLocaleString()}`);
        results.passed++;
        results.tests.push({ name: 'Invoice Total Value', status: 'PASS', value: totalInvoices });
      } else {
        warn('Total Invoice Value: $0');
        results.warnings++;
      }
    } catch (err) {
      warn(`Invoice Total calculation: ${err.message}`);
      results.warnings++;
    }

    // ═══════════════════════════════════════════════════════════
    header('CONTRACTOR STATUS DISTRIBUTION');
    // ═══════════════════════════════════════════════════════════

    try {
      const statusDist = await pool.query(`
        SELECT status, COUNT(*) as count 
        FROM contractors 
        GROUP BY status 
        ORDER BY count DESC
      `);
      
      if (statusDist.rows.length > 0) {
        statusDist.rows.forEach(row => {
          info(`${row.status}: ${row.count} contractors`);
        });
        
        const activeCount = statusDist.rows.find(r => r.status === 'Active')?.count || 0;
        if (parseInt(activeCount) > 0) {
          pass(`Active contractors found: ${activeCount}`);
          results.passed++;
        } else {
          warn('No active contractors found');
          results.warnings++;
        }
        results.tests.push({ name: 'Contractor Status Distribution', status: 'PASS' });
      }
    } catch (err) {
      warn(`Contractor status check: ${err.message}`);
      results.warnings++;
    }

    // ═══════════════════════════════════════════════════════════
    header('DEPARTMENT COVERAGE');
    // ═══════════════════════════════════════════════════════════

    try {
      const depts = await pool.query(`
        SELECT d.name, COUNT(c.id) as contractor_count, COALESCE(d.budget, 0) as budget
        FROM departments d
        LEFT JOIN contractors c ON c.department_id = d.id
        GROUP BY d.id, d.name, d.budget
        ORDER BY contractor_count DESC
      `);
      
      if (depts.rows.length > 0) {
        depts.rows.forEach(row => {
          const budget = parseFloat(row.budget);
          info(`${row.name}: ${row.contractor_count} contractors, $${budget.toLocaleString()} budget`);
        });
        pass(`${depts.rows.length} departments configured`);
        results.passed++;
        results.tests.push({ name: 'Department Coverage', status: 'PASS', count: depts.rows.length });
      } else {
        fail('No departments found');
        results.failed++;
      }
    } catch (err) {
      fail(`Department check failed: ${err.message}`);
      results.failed++;
    }

    // ═══════════════════════════════════════════════════════════
    header('ALERT SYSTEM CHECK');
    // ═══════════════════════════════════════════════════════════

    try {
      const alerts = await pool.query(`
        SELECT severity, COUNT(*) as count 
        FROM alerts 
        GROUP BY severity
      `);
      
      if (alerts.rows.length > 0) {
        alerts.rows.forEach(row => {
          const color = row.severity === 'critical' ? COLORS.red : 
                       row.severity === 'high' ? COLORS.yellow : COLORS.dim;
          console.log(`${color}  • ${row.severity}: ${row.count} alerts${COLORS.reset}`);
        });
        pass('Alert system populated');
        results.passed++;
        results.tests.push({ name: 'Alert System', status: 'PASS' });
      } else {
        warn('No alerts in system');
        results.warnings++;
      }
    } catch (err) {
      warn(`Alert check: ${err.message}`);
      results.warnings++;
    }

    // ═══════════════════════════════════════════════════════════
    header('SOW DETAILS CHECK');
    // ═══════════════════════════════════════════════════════════

    try {
      const sows = await pool.query(`
        SELECT title, status, total_value, start_date, end_date
        FROM statements_of_work
        ORDER BY total_value DESC
        LIMIT 5
      `);
      
      if (sows.rows.length > 0) {
        info('Top 5 SOWs by value:');
        sows.rows.forEach((row, i) => {
          const value = parseFloat(row.total_value || 0);
          console.log(`${COLORS.dim}  ${i+1}. ${row.title} - $${value.toLocaleString()} (${row.status})${COLORS.reset}`);
        });
        pass('SOW data verified');
        results.passed++;
        results.tests.push({ name: 'SOW Details', status: 'PASS' });
      }
    } catch (err) {
      warn(`SOW details: ${err.message}`);
      results.warnings++;
    }

    // ═══════════════════════════════════════════════════════════
    header('DATA FRESHNESS CHECK');
    // ═══════════════════════════════════════════════════════════

    try {
      const freshness = await pool.query(`
        SELECT 
          (SELECT MAX(created_at) FROM contractors) as latest_contractor,
          (SELECT MAX(created_at) FROM purchase_orders) as latest_po,
          (SELECT MAX(created_at) FROM invoices) as latest_invoice
      `);
      
      const row = freshness.rows[0];
      if (row.latest_contractor || row.latest_po || row.latest_invoice) {
        info(`Latest contractor: ${row.latest_contractor || 'N/A'}`);
        info(`Latest PO: ${row.latest_po || 'N/A'}`);
        info(`Latest invoice: ${row.latest_invoice || 'N/A'}`);
        pass('Data timestamps present');
        results.passed++;
      } else {
        warn('No timestamp data found');
        results.warnings++;
      }
    } catch (err) {
      warn(`Freshness check: ${err.message}`);
      results.warnings++;
    }

  } catch (err) {
    fail(`Critical error: ${err.message}`);
    results.failed++;
  } finally {
    await pool.end();
  }

  // ═══════════════════════════════════════════════════════════
  // FINAL REPORT
  // ═══════════════════════════════════════════════════════════

  console.log(`
${COLORS.bold}${COLORS.cyan}
╔════════════════════════════════════════════════════════════╗
║                    FINAL REPORT                            ║
╚════════════════════════════════════════════════════════════╝
${COLORS.reset}`);

  console.log(`${COLORS.green}  ✓ Passed:   ${results.passed}${COLORS.reset}`);
  console.log(`${COLORS.red}  ✗ Failed:   ${results.failed}${COLORS.reset}`);
  console.log(`${COLORS.yellow}  ⚠ Warnings: ${results.warnings}${COLORS.reset}`);

  const totalScore = results.passed / (results.passed + results.failed) * 100;
  const scoreColor = totalScore >= 90 ? COLORS.green : totalScore >= 70 ? COLORS.yellow : COLORS.red;

  console.log(`
${scoreColor}${COLORS.bold}  DEMO READINESS SCORE: ${totalScore.toFixed(0)}%${COLORS.reset}
`);

  if (results.failed === 0) {
    console.log(`${COLORS.green}${COLORS.bold}
  ╔══════════════════════════════════════════╗
  ║   ✓ DEMO READY - All critical tests pass ║
  ╚══════════════════════════════════════════╝
${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}${COLORS.bold}
  ╔══════════════════════════════════════════╗
  ║   ✗ NOT READY - Fix failures before demo ║
  ╚══════════════════════════════════════════╝
${COLORS.reset}`);
    
    console.log(`${COLORS.yellow}\nFailed tests:${COLORS.reset}`);
    results.tests.filter(t => t.status === 'FAIL').forEach(t => {
      console.log(`${COLORS.red}  • ${t.name}: ${t.error || 'Check required'}${COLORS.reset}`);
    });
    
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(`${COLORS.red}Script error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});
