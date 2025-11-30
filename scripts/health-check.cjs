#!/usr/bin/env node

const http = require('http');

const healthChecks = [
  {
    name: 'API Server',
    host: 'localhost',
    port: 3001,
    path: '/api/health',
    timeout: 5000
  },
  {
    name: 'Frontend',
    host: 'localhost',
    port: 5000,
    path: '/',
    timeout: 5000
  }
];

function checkEndpoint(check) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: check.host,
        port: check.port,
        path: check.path,
        method: 'GET',
        timeout: check.timeout
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            name: check.name,
            status: res.statusCode >= 200 && res.statusCode < 300 ? 'healthy' : 'unhealthy',
            statusCode: res.statusCode,
            responsive: true
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        name: check.name,
        status: 'unhealthy',
        statusCode: null,
        responsive: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: check.name,
        status: 'timeout',
        statusCode: null,
        responsive: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runHealthChecks() {
  console.log('🏥 Running Velocity Health Checks...\n');
  
  const results = await Promise.all(healthChecks.map(checkEndpoint));
  
  let allHealthy = true;
  
  results.forEach(result => {
    const icon = result.status === 'healthy' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.status}`);
    if (result.statusCode) {
      console.log(`   Status Code: ${result.statusCode}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
    
    if (result.status !== 'healthy') {
      allHealthy = false;
    }
  });
  
  if (allHealthy) {
    console.log('✅ All systems healthy\n');
    process.exit(0);
  } else {
    console.log('❌ Some systems are unhealthy\n');
    process.exit(1);
  }
}

runHealthChecks().catch((err) => {
  console.error('❌ Health check failed:', err);
  process.exit(1);
});
