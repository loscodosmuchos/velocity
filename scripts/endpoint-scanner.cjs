#!/usr/bin/env node
/**
 * ENDPOINT SCANNER - Detects missing API endpoints before they cause 404s
 * Run: node scripts/endpoint-scanner.cjs
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`${CYAN}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${CYAN}  VELOCITY ENDPOINT SCANNER - Detecting 404 risks${RESET}`);
console.log(`${CYAN}═══════════════════════════════════════════════════════════════${RESET}\n`);

// Step 1: Extract all server endpoints from server/index.cjs and route files
function extractServerEndpoints() {
  const endpoints = new Set();
  const serverDir = path.join(__dirname, '..', 'server');
  
  // Files to scan for endpoints
  const filesToScan = [
    path.join(serverDir, 'index.cjs'),
    ...fs.readdirSync(path.join(serverDir, 'routes')).map(f => path.join(serverDir, 'routes', f))
  ].filter(f => f.endsWith('.cjs') || f.endsWith('.js'));
  
  for (const filePath of filesToScan) {
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      
      // Match static endpoint definitions (app.get, router.get, etc.)
      const staticRegex = /(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*['"`]\/api\/([^'"`$]+)['"`]/gi;
      let match;
      
      while ((match = staticRegex.exec(code)) !== null) {
        const endpoint = match[2].split('/')[0].replace(/:\w+/g, '').replace(/\?.*/, '');
        if (endpoint && !endpoint.includes('${')) {
          endpoints.add(endpoint);
        }
      }
      
      // Match createStubEndpoint calls for dynamically created endpoints
      const stubRegex = /createStubEndpoint\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/gi;
      while ((match = stubRegex.exec(code)) !== null) {
        endpoints.add(match[1]);
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }
  
  return Array.from(endpoints);
}

// Step 2: Extract all resource calls from frontend
function extractFrontendResources() {
  const srcPath = path.join(__dirname, '..', 'src');
  const resources = new Map();
  
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Match useList, useOne, useCreate, useUpdate, useDelete resource calls
          const resourceRegex = /(?:useList|useOne|useCreate|useUpdate|useDelete|useCustom)\s*(?:<[^>]+>)?\s*\(\s*\{[^}]*resource\s*:\s*['"`]([^'"`]+)['"`]/g;
          let match;
          
          while ((match = resourceRegex.exec(content)) !== null) {
            const resource = match[1];
            const relativePath = filePath.replace(srcPath, 'src');
            if (!resources.has(resource)) {
              resources.set(resource, []);
            }
            resources.get(resource).push(relativePath);
          }
        } catch (e) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDir(srcPath);
  return resources;
}

// Step 3: Load resource mappings from api-data-provider.ts
function extractResourceMappings() {
  const providerPath = path.join(__dirname, '..', 'src', 'providers', 'api-data-provider.ts');
  const providerCode = fs.readFileSync(providerPath, 'utf8');
  
  const mappings = {};
  const mappingRegex = /['"`]?(\w+)['"`]?\s*:\s*['"`]([^'"`]+)['"`]/g;
  
  // Extract the resourceToUrl object
  const objectMatch = providerCode.match(/resourceToUrl[^{]*\{([^}]+)\}/s);
  if (objectMatch) {
    let match;
    while ((match = mappingRegex.exec(objectMatch[1])) !== null) {
      mappings[match[1]] = match[2];
    }
  }
  
  return mappings;
}

// Run the scanner
const serverEndpoints = extractServerEndpoints();
const frontendResources = extractFrontendResources();
const resourceMappings = extractResourceMappings();

console.log(`${GREEN}✓ Server endpoints found: ${serverEndpoints.length}${RESET}`);
console.log(`  ${serverEndpoints.slice(0, 10).join(', ')}${serverEndpoints.length > 10 ? '...' : ''}\n`);

console.log(`${GREEN}✓ Frontend resources found: ${frontendResources.size}${RESET}\n`);

// Check each frontend resource against server endpoints
let issues = 0;
const missing = [];

for (const [resource, files] of frontendResources) {
  // Resolve the actual endpoint name
  const mappedEndpoint = resourceMappings[resource] || resource;
  const endpointBase = mappedEndpoint.split('/')[0];
  
  // Check if endpoint exists on server
  const exists = serverEndpoints.some(ep => 
    ep === endpointBase || 
    ep === mappedEndpoint ||
    ep.startsWith(endpointBase)
  );
  
  if (!exists) {
    issues++;
    missing.push({
      resource,
      mappedTo: mappedEndpoint,
      files: files.slice(0, 3)
    });
  }
}

if (missing.length > 0) {
  console.log(`${RED}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${RED}║  ⚠️  MISSING ENDPOINTS DETECTED - WILL CAUSE 404 ERRORS      ║${RESET}`);
  console.log(`${RED}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);
  
  for (const item of missing) {
    console.log(`${RED}✗ Resource: "${item.resource}"${RESET}`);
    console.log(`  Maps to endpoint: /api/${item.mappedTo}`);
    console.log(`  Used in:`);
    for (const file of item.files) {
      console.log(`    - ${file}`);
    }
    console.log();
  }
  
  console.log(`${YELLOW}═══════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${YELLOW}  ACTION REQUIRED: Add these endpoints to server/index.cjs${RESET}`);
  console.log(`${YELLOW}  OR fix the resource name in the frontend component${RESET}`);
  console.log(`${YELLOW}═══════════════════════════════════════════════════════════════${RESET}\n`);
} else {
  console.log(`${GREEN}╔═══════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${GREEN}║  ✓ ALL ENDPOINTS VERIFIED - NO 404 RISKS DETECTED            ║${RESET}`);
  console.log(`${GREEN}╚═══════════════════════════════════════════════════════════════╝${RESET}\n`);
}

console.log(`Scan complete. Found ${issues} potential issues.\n`);
process.exit(issues > 0 ? 1 : 0);
