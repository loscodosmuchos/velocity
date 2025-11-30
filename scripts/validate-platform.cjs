#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const VALIDATION_LOG = path.join(__dirname, '../.platform-validation.json');

const checks = {
  api: {
    name: 'API Server Health',
    url: 'http://localhost:3001/api/health',
    critical: true
  },
  frontend: {
    name: 'Frontend Serving',
    url: 'http://localhost:5000',
    critical: true
  },
  apiReady: {
    name: 'API Database Connection',
    url: 'http://localhost:3001/api/ready',
    critical: true
  }
};

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      timeout: 3000
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

async function runValidation() {
  console.log('🔍 Velocity Platform Validation');
  console.log('================================\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    allHealthy: true,
    criticalFailure: false
  };
  
  for (const [key, check] of Object.entries(checks)) {
    process.stdout.write(`Checking ${check.name}... `);
    
    try {
      const response = await httpGet(check.url);
      const healthy = response.statusCode >= 200 && response.statusCode < 300;
      
      results.checks[key] = {
        name: check.name,
        status: healthy ? 'healthy' : 'unhealthy',
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        critical: check.critical
      };
      
      if (healthy) {
        console.log('✅');
      } else {
        console.log(`❌ (Status: ${response.statusCode})`);
        results.allHealthy = false;
        if (check.critical) {
          results.criticalFailure = true;
        }
      }
    } catch (error) {
      console.log(`❌ (Error: ${error.message})`);
      results.checks[key] = {
        name: check.name,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        critical: check.critical
      };
      results.allHealthy = false;
      if (check.critical) {
        results.criticalFailure = true;
      }
    }
  }
  
  console.log('\n================================');
  
  if (results.allHealthy) {
    console.log('✅ All systems operational\n');
    results.summary = 'All systems operational';
  } else if (results.criticalFailure) {
    console.log('❌ CRITICAL: Platform not functional\n');
    results.summary = 'Critical failure detected';
  } else {
    console.log('⚠️  Some non-critical issues detected\n');
    results.summary = 'Non-critical issues detected';
  }
  
  try {
    fs.writeFileSync(VALIDATION_LOG, JSON.stringify(results, null, 2));
    console.log(`📝 Validation log saved to ${VALIDATION_LOG}\n`);
  } catch (err) {
    console.error(`⚠️  Could not save validation log: ${err.message}\n`);
  }
  
  process.exit(results.criticalFailure ? 1 : 0);
}

runValidation().catch(err => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
