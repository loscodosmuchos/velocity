#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const VALIDATION_LOG = path.join(__dirname, '../.platform-validation.json');

const EXPECTED_MENU_ITEMS = [
  'dashboard',
  'contractors',
  'employees',
  'purchaseorders',
  'timecards',
  'invoices',
  'statementofworks',
  'changeorders',
  'expenses',
  'assets',
  'ai'
];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function validateUIIntegrity() {
  console.log('🔍 Velocity UI Integrity Validation');
  console.log('====================================\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    allHealthy: true,
    criticalFailure: false
  };
  
  // Check 1: API Health
  process.stdout.write('Checking API Health... ');
  try {
    const health = await httpGet('http://localhost:3001/api/health');
    const healthData = JSON.parse(health.body);
    
    const apiHealthy = health.statusCode === 200 && healthData.services.database.connected;
    results.checks.apiHealth = {
      name: 'API Health',
      status: apiHealthy ? 'healthy' : 'unhealthy',
      details: healthData,
      critical: true
    };
    
    if (apiHealthy) {
      console.log('✅');
    } else {
      console.log('❌');
      results.allHealthy = false;
      results.criticalFailure = true;
    }
  } catch (error) {
    console.log(`❌ (${error.message})`);
    results.checks.apiHealth = {
      name: 'API Health',
      status: 'error',
      error: error.message,
      critical: true
    };
    results.allHealthy = false;
    results.criticalFailure = true;
  }
  
  // Check 2: Frontend Serving
  process.stdout.write('Checking Frontend Serving... ');
  try {
    const frontend = await httpGet('http://localhost:5000');
    
    const hasHtml = frontend.body.includes('<html') || frontend.body.includes('<!DOCTYPE html>');
    const hasViteClient = frontend.body.includes('/@vite/client') || frontend.body.includes('vite');
    const hasErrorPage = frontend.body.includes('Cannot GET') || frontend.body.includes('<pre>Cannot');
    
    const frontendHealthy = frontend.statusCode === 200 && hasHtml && !hasErrorPage;
    results.checks.frontendServing = {
      name: 'Frontend Serving',
      status: frontendHealthy ? 'healthy' : 'unhealthy',
      statusCode: frontend.statusCode,
      hasHtml: hasHtml,
      hasViteClient: hasViteClient,
      isErrorPage: hasErrorPage,
      critical: true
    };
    
    if (frontendHealthy) {
      console.log('✅');
    } else {
      console.log('❌');
      results.allHealthy = false;
      results.criticalFailure = true;
    }
  } catch (error) {
    console.log(`❌ (${error.message})`);
    results.checks.frontendServing = {
      name: 'Frontend Serving',
      status: 'error',
      error: error.message,
      critical: true
    };
    results.allHealthy = false;
    results.criticalFailure = true;
  }
  
  // Check 3: Menu Resources (from App.tsx)
  process.stdout.write('Checking Menu Resources... ');
  try {
    const appTsx = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
    
    const missingResources = [];
    EXPECTED_MENU_ITEMS.forEach(item => {
      if (!appTsx.includes(`name: "${item}"`)) {
        missingResources.push(item);
      }
    });
    
    const menuHealthy = missingResources.length === 0;
    results.checks.menuResources = {
      name: 'Menu Resources',
      status: menuHealthy ? 'healthy' : 'degraded',
      expectedItems: EXPECTED_MENU_ITEMS.length,
      missingItems: missingResources,
      critical: missingResources.length > 5
    };
    
    if (menuHealthy) {
      console.log('✅');
    } else {
      console.log(`⚠️  (${missingResources.length} missing)`);
      results.allHealthy = false;
      if (missingResources.length > 5) {
        results.criticalFailure = true;
      }
    }
  } catch (error) {
    console.log(`❌ (${error.message})`);
    results.checks.menuResources = {
      name: 'Menu Resources',
      status: 'error',
      error: error.message,
      critical: false
    };
    results.allHealthy = false;
  }
  
  // Check 4: Sidebar Component Exists
  process.stdout.write('Checking Sidebar Component... ');
  try {
    const sidebarPath = path.join(__dirname, '../src/components/refine-ui/layout/sidebar.tsx');
    const sidebarExists = fs.existsSync(sidebarPath);
    const sidebarContent = sidebarExists ? fs.readFileSync(sidebarPath, 'utf8') : '';
    const hasSidebarExport = sidebarContent.includes('export function Sidebar');
    
    const sidebarHealthy = sidebarExists && hasSidebarExport;
    results.checks.sidebarComponent = {
      name: 'Sidebar Component',
      status: sidebarHealthy ? 'healthy' : 'unhealthy',
      fileExists: sidebarExists,
      hasExport: hasSidebarExport,
      critical: true
    };
    
    if (sidebarHealthy) {
      console.log('✅');
    } else {
      console.log('❌');
      results.allHealthy = false;
      results.criticalFailure = true;
    }
  } catch (error) {
    console.log(`❌ (${error.message})`);
    results.checks.sidebarComponent = {
      name: 'Sidebar Component',
      status: 'error',
      error: error.message,
      critical: true
    };
    results.allHealthy = false;
    results.criticalFailure = true;
  }
  
  console.log('\n====================================');
  
  if (results.allHealthy) {
    console.log('✅ All UI integrity checks passed\n');
    results.summary = 'All UI integrity checks passed';
  } else if (results.criticalFailure) {
    console.log('❌ CRITICAL: UI integrity failure detected\n');
    results.summary = 'Critical UI integrity failure';
  } else {
    console.log('⚠️  Some non-critical UI issues detected\n');
    results.summary = 'Non-critical UI issues';
  }
  
  try {
    fs.writeFileSync(VALIDATION_LOG, JSON.stringify(results, null, 2));
    console.log(`📝 Validation log: ${VALIDATION_LOG}\n`);
  } catch (err) {
    console.error(`⚠️  Could not save log: ${err.message}\n`);
  }
  
  process.exit(results.criticalFailure ? 1 : 0);
}

validateUIIntegrity().catch(err => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
