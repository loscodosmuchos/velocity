#!/usr/bin/env node
/**
 * PAGE METADATA SCANNER - "Git for the App"
 * Scans all .tsx pages and stores metadata in searchable database
 * Enables fast debugging by querying page state across entire app
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '../page-metadata.json');
const PAGES_DIR = path.join(__dirname, '../src/pages');

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = path.basename(filePath);
    
    const metadata = {
      path: path.relative(PAGES_DIR, filePath),
      name: fileName.replace('.tsx', ''),
      hash: crypto.createHash('md5').update(content).digest('hex'),
      timestamp: new Date().toISOString(),
      imports: extractImports(content),
      exports: extractExports(content),
      components: extractComponents(content),
      hooks: extractHooks(content),
      apis: extractApiCalls(content),
      errors: extractErrors(content),
      dependencies: extractDependencies(content),
      lines: lines.length,
    };
    
    return metadata;
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
    return null;
  }
}

function extractImports(content) {
  const imports = [];
  const importRegex = /import\s+(?:\{[^}]+\}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return [...new Set(imports)];
}

function extractExports(content) {
  const exports = [];
  const exportRegex = /export\s+(?:default\s+)?(?:function|const|interface|type)\s+(\w+)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }
  return [...new Set(exports)];
}

function extractComponents(content) {
  const components = [];
  const componentRegex = /(?:const|function)\s+([A-Z]\w+)\s*=/g;
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    components.push(match[1]);
  }
  return [...new Set(components)];
}

function extractHooks(content) {
  const hooks = [];
  const hookRegex = /use[A-Z]\w+/g;
  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    hooks.push(match[0]);
  }
  return [...new Set(hooks)];
}

function extractApiCalls(content) {
  const apis = [];
  const apiRegex = /(?:fetch|axios)\s*\(\s*['"`]([^'"`]+)['""`]/g;
  let match;
  while ((match = apiRegex.exec(content)) !== null) {
    apis.push(match[1]);
  }
  return [...new Set(apis)];
}

function extractErrors(content) {
  const errors = [];
  if (content.includes('TODO') || content.includes('FIXME')) {
    errors.push('has-todo-fixme');
  }
  if (content.match(/console\.error/)) {
    errors.push('has-console-error');
  }
  if (content.match(/throw new Error/)) {
    errors.push('throws-error');
  }
  if (content.includes('// @ts-ignore')) {
    errors.push('has-ts-ignore');
  }
  if (content.includes('any')) {
    errors.push('uses-any-type');
  }
  return errors;
}

function extractDependencies(content) {
  const deps = [];
  const depRegex = /from\s+['"](@?[a-z0-9-]+\/[a-z0-9-]+|[a-z0-9-]+)['"]/g;
  let match;
  while ((match = depRegex.exec(content)) !== null) {
    deps.push(match[1]);
  }
  return [...new Set(deps)];
}

function scanDirectory(dir) {
  const pages = [];
  
  function walk(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.tsx')) {
        const metadata = scanFile(filePath);
        if (metadata) {
          pages.push(metadata);
        }
      }
    }
  }
  
  walk(dir);
  return pages;
}

function buildIndex(pages) {
  const index = {
    byPath: {},
    byError: {},
    byComponent: {},
    byApi: {},
  };
  
  for (const page of pages) {
    index.byPath[page.path] = page;
    
    for (const error of page.errors) {
      if (!index.byError[error]) index.byError[error] = [];
      index.byError[error].push(page);
    }
    
    for (const component of page.components) {
      if (!index.byComponent[component]) index.byComponent[component] = [];
      index.byComponent[component].push(page);
    }
    
    for (const api of page.apis) {
      if (!index.byApi[api]) index.byApi[api] = [];
      index.byApi[api].push(page);
    }
  }
  
  return index;
}

function saveDatabase(pages) {
  const db = {
    version: '1.0',
    scannedAt: new Date().toISOString(),
    pages,
    index: buildIndex(pages),
  };
  
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return db;
}

function main() {
  console.log('🔍 Scanning pages for metadata...');
  const pages = scanDirectory(PAGES_DIR);
  console.log(`✅ Found ${pages.length} pages`);
  
  const db = saveDatabase(pages);
  
  console.log('\n📊 METADATA DATABASE CREATED:');
  console.log(`   Location: ${DB_PATH}`);
  console.log(`   Pages scanned: ${db.pages.length}`);
  console.log(`   Pages with errors: ${Object.keys(db.index.byError).length}`);
  console.log(`   Unique API endpoints: ${Object.keys(db.index.byApi).length}`);
  console.log(`   Unique components: ${Object.keys(db.index.byComponent).length}`);
  
  if (Object.keys(db.index.byError).length > 0) {
    console.log('\n⚠️  ERRORS DETECTED:');
    for (const [errorType, errorPages] of Object.entries(db.index.byError)) {
      console.log(`   ${errorType}: ${errorPages.length} pages`);
    }
  }
  
  console.log('\n🚀 Query tools available:');
  console.log('   node scripts/query-metadata.js errors');
  console.log('   node scripts/query-metadata.js api <endpoint>');
  console.log('   node scripts/query-metadata.js component <name>');
  console.log('   node scripts/query-metadata.js stats');
}

main();
