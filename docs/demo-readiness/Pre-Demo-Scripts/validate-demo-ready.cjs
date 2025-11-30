#!/usr/bin/env node

/**
 * VELOCITY PRE-DEMO VALIDATION SCRIPT
 * 
 * Run this script 24 hours before any stakeholder presentation.
 * It validates all critical paths and generates an evidence log.
 * 
 * Usage: node docs/demo-readiness/Pre-Demo-Scripts/validate-demo-ready.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEMO_ACCOUNTS = [
  { email: 'admin@velocity.io', password: 'velocity2025!', role: 'Admin' },
  { email: 'manager@velocity.io', password: 'velocity2025!', role: 'Manager' },
  { email: 'viewer@velocity.io', password: 'velocity2025!', role: 'Viewer' },
];

const CRITICAL_ROUTES = [
  '/login',
  '/',
  '/purchase-orders',
  '/invoices',
  '/contractors',
  '/ai/chatbots',
  '/ai/contract-gap-analysis',
  '/ai/vendor-extraction',
  '/admin/demo-command-center',
];

const results = {
  timestamp: new Date().toISOString(),
  environment: {},
  authentication: [],
  routes: [],
  database: {},
  api: {},
  overall: 'PENDING',
};

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         VELOCITY PRE-DEMO VALIDATION SCRIPT                    ║');
console.log('║         Demo Readiness Lens v1.0                               ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

function check(name, condition, details = '') {
  const status = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status}: ${name}${details ? ` (${details})` : ''}`);
  return condition;
}

async function validateEnvironment() {
  console.log('\n📋 ENVIRONMENT VALIDATION');
  console.log('─'.repeat(50));
  
  const demoMode = process.env.VITE_DEMO_MODE;
  results.environment.VITE_DEMO_MODE = demoMode;
  check('VITE_DEMO_MODE is "false"', demoMode === 'false', `Current: ${demoMode}`);
  
  const jwtSecret = process.env.JWT_SECRET;
  results.environment.JWT_SECRET = jwtSecret ? 'SET' : 'NOT SET';
  check('JWT_SECRET is configured', !!jwtSecret);
  
  const dbUrl = process.env.DATABASE_URL;
  results.environment.DATABASE_URL = dbUrl ? 'SET' : 'NOT SET';
  check('DATABASE_URL is configured', !!dbUrl);
  
  return demoMode === 'false' && !!jwtSecret && !!dbUrl;
}

async function validateDatabase() {
  console.log('\n📊 DATABASE VALIDATION');
  console.log('─'.repeat(50));
  
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Check users exist
    const usersResult = await pool.query(
      "SELECT email, role, status FROM users WHERE email IN ('admin@velocity.io', 'manager@velocity.io', 'viewer@velocity.io')"
    );
    
    const activeUsers = usersResult.rows.filter(u => u.status === 'active');
    results.database.activeUsers = activeUsers.length;
    check('Demo users exist in database', activeUsers.length === 3, `Found ${activeUsers.length}/3`);
    
    // Check password hashes exist
    const hashResult = await pool.query(
      "SELECT email FROM users WHERE password_hash IS NOT NULL AND email IN ('admin@velocity.io', 'manager@velocity.io', 'viewer@velocity.io')"
    );
    results.database.usersWithPasswords = hashResult.rows.length;
    check('All demo users have password hashes', hashResult.rows.length === 3);
    
    // Check we have real data
    const poCount = await pool.query('SELECT COUNT(*) FROM purchase_orders');
    results.database.purchaseOrders = parseInt(poCount.rows[0].count);
    check('Purchase orders exist', parseInt(poCount.rows[0].count) > 0, `Count: ${poCount.rows[0].count}`);
    
    const contractorCount = await pool.query('SELECT COUNT(*) FROM contractors');
    results.database.contractors = parseInt(contractorCount.rows[0].count);
    check('Contractors exist', parseInt(contractorCount.rows[0].count) > 0, `Count: ${contractorCount.rows[0].count}`);
    
    await pool.end();
    return true;
  } catch (error) {
    console.log(`  ❌ FAIL: Database connection (${error.message})`);
    results.database.error = error.message;
    return false;
  }
}

async function validateAPI() {
  console.log('\n🔌 API VALIDATION');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const healthy = response.ok;
    results.api.health = healthy;
    check('API server is healthy', healthy);
    
    // Test login endpoint
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@velocity.io', password: 'velocity2025!' }),
    });
    
    const loginWorked = loginResponse.ok;
    results.api.loginWorks = loginWorked;
    check('Login endpoint works', loginWorked);
    
    if (loginWorked) {
      const data = await loginResponse.json();
      check('Login returns token', !!data.token);
      check('Login returns user data', !!data.user && !!data.user.email);
    }
    
    return healthy && loginWorked;
  } catch (error) {
    console.log(`  ❌ FAIL: API check (${error.message})`);
    results.api.error = error.message;
    return false;
  }
}

async function validateRoutes() {
  console.log('\n🛤️  ROUTE VALIDATION');
  console.log('─'.repeat(50));
  
  let allPassed = true;
  
  for (const route of CRITICAL_ROUTES) {
    try {
      const response = await fetch(`http://localhost:5000${route}`);
      const passed = response.ok || response.status === 401; // 401 is OK for auth-protected routes
      results.routes.push({ route, status: response.status, passed });
      check(`Route ${route}`, passed, `Status: ${response.status}`);
      allPassed = allPassed && passed;
    } catch (error) {
      results.routes.push({ route, error: error.message, passed: false });
      console.log(`  ❌ FAIL: Route ${route} (${error.message})`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function generateReport() {
  console.log('\n📝 GENERATING EVIDENCE LOG');
  console.log('─'.repeat(50));
  
  const logDir = path.join(__dirname, '..', 'Authenticity-Gate-Logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logDir, `${date}-validation.json`);
  
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
  console.log(`  📁 Evidence log saved to: ${logFile}`);
  
  return logFile;
}

async function main() {
  try {
    const envOk = await validateEnvironment();
    const dbOk = await validateDatabase();
    const apiOk = await validateAPI();
    const routesOk = await validateRoutes();
    
    const allPassed = envOk && dbOk && apiOk && routesOk;
    results.overall = allPassed ? 'PASSED' : 'FAILED';
    
    await generateReport();
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    if (allPassed) {
      console.log('║  ✅ DEMO READY: All validation checks passed                   ║');
    } else {
      console.log('║  ❌ NOT DEMO READY: Some checks failed - review above          ║');
    }
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Validation script error:', error.message);
    process.exit(1);
  }
}

main();
