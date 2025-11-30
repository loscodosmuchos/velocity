#!/usr/bin/env node
/**
 * VELOCITY PRE-DEMO WATCHDOG
 * Run before any demo to verify critical path functionality
 * 
 * Usage: node scripts/pre-demo-check.js
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.VELOCITY_URL || 'http://localhost:5000';

const CRITICAL_ROUTES = [
  { path: '/', name: 'Dashboard', required: true },
  { path: '/statementofworks', name: 'SOW List', required: true },
  { path: '/documents/upload', name: 'Document Upload/Analyzer', required: true },
  { path: '/purchaseorders', name: 'Purchase Orders', required: true },
  { path: '/contractors', name: 'Contractors', required: true },
  { path: '/invoices', name: 'Invoices', required: true },
  { path: '/timecards', name: 'Timecards', required: true },
  { path: '/approvals', name: 'Approvals', required: true },
  { path: '/sow-command-center', name: 'SOW Command Center', required: true },
  { path: '/ai/insights', name: 'AI Insights', required: true },
];

const API_ENDPOINTS = [
  { path: '/api/statements-of-work', name: 'SOWs API', minCount: 5 },
  { path: '/api/contractors', name: 'Contractors API', minCount: 10 },
  { path: '/api/purchase-orders', name: 'POs API', minCount: 5 },
  { path: '/api/invoices', name: 'Invoices API', minCount: 1 },
];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function success(msg) { log(colors.green, '✓', msg); }
function fail(msg) { log(colors.red, '✗', msg); }
function warn(msg) { log(colors.yellow, '⚠', msg); }
function info(msg) { log(colors.cyan, '→', msg); }

async function checkUrl(url, timeout = 5000) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = client.get(url, { timeout }, (res) => {
      const duration = Date.now() - startTime;
      resolve({ 
        status: res.statusCode, 
        ok: res.statusCode >= 200 && res.statusCode < 400,
        duration 
      });
    });
    
    req.on('error', (err) => {
      resolve({ status: 0, ok: false, error: err.message, duration: Date.now() - startTime });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false, error: 'Timeout', duration: timeout });
    });
  });
}

async function checkApiEndpoint(url, minCount = 0) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = Array.isArray(json) ? json.length : (json.data?.length || 0);
          resolve({ 
            ok: count >= minCount, 
            count,
            minCount,
            status: res.statusCode 
          });
        } catch (e) {
          resolve({ ok: false, error: 'Invalid JSON', status: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });
  });
}

async function runChecks() {
  console.log('\n' + colors.bold + colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bold + '  VELOCITY PRE-DEMO WATCHDOG' + colors.reset);
  console.log(colors.bold + colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Time: ${new Date().toISOString()}\n`);

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  // Check critical routes
  console.log(colors.bold + '\n📍 CRITICAL ROUTES\n' + colors.reset);
  
  for (const route of CRITICAL_ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    const result = await checkUrl(url);
    
    if (result.ok) {
      success(`${route.name} (${result.duration}ms)`);
      passed++;
    } else if (route.required) {
      fail(`${route.name} - ${result.error || `Status ${result.status}`}`);
      failed++;
    } else {
      warn(`${route.name} - ${result.error || `Status ${result.status}`}`);
      warnings++;
    }
  }

  // Check API endpoints
  console.log(colors.bold + '\n📊 API DATA THRESHOLDS\n' + colors.reset);
  
  for (const endpoint of API_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint.path}`;
    const result = await checkApiEndpoint(url, endpoint.minCount);
    
    if (result.ok) {
      success(`${endpoint.name}: ${result.count} records (min: ${endpoint.minCount})`);
      passed++;
    } else if (result.error) {
      fail(`${endpoint.name}: ${result.error}`);
      failed++;
    } else {
      fail(`${endpoint.name}: Only ${result.count} records (need ${endpoint.minCount}+)`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + colors.bold + colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bold + '  SUMMARY' + colors.reset);
  console.log(colors.bold + colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
  
  console.log(`  ${colors.green}Passed:${colors.reset}   ${passed}`);
  console.log(`  ${colors.red}Failed:${colors.reset}   ${failed}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset} ${warnings}`);
  
  if (failed === 0) {
    console.log('\n' + colors.bold + colors.green + '  ✓ DEMO READY - All checks passed!' + colors.reset + '\n');
    process.exit(0);
  } else {
    console.log('\n' + colors.bold + colors.red + '  ✗ NOT READY - Fix failures before demo!' + colors.reset + '\n');
    process.exit(1);
  }
}

// Run
runChecks().catch(err => {
  fail(`Watchdog error: ${err.message}`);
  process.exit(1);
});
