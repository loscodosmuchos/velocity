#!/usr/bin/env node
/**
 * METADATA QUERY TOOL - Search the page database
 * Usage: node scripts/query-metadata.js [command] [arg]
 * Commands:
 *   errors - Show all pages with errors
 *   api <endpoint> - Find pages using an API endpoint
 *   component <name> - Find pages with a component
 *   deps - List all dependencies
 *   stats - Show database statistics
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../page-metadata.json');

function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found. Run: node scripts/page-metadata-scanner.js');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function showErrors(db) {
  console.log('\n⚠️  PAGES WITH ERRORS:\n');
  for (const [errorType, pages] of Object.entries(db.index.byError)) {
    console.log(`${errorType}:`);
    for (const page of pages) {
      console.log(`  📄 ${page.path}`);
    }
  }
}

function findByApi(db, endpoint) {
  const matches = db.index.byApi[endpoint] || [];
  console.log(`\n🔗 PAGES USING ENDPOINT: ${endpoint}\n`);
  if (matches.length === 0) {
    console.log('No pages found');
  } else {
    for (const page of matches) {
      console.log(`  📄 ${page.path}`);
    }
  }
}

function findByComponent(db, name) {
  const matches = db.index.byComponent[name] || [];
  console.log(`\n⚙️  PAGES WITH COMPONENT: ${name}\n`);
  if (matches.length === 0) {
    console.log('No pages found');
  } else {
    for (const page of matches) {
      console.log(`  📄 ${page.path}`);
    }
  }
}

function showStats(db) {
  console.log('\n📊 DATABASE STATISTICS:\n');
  console.log(`Total pages: ${db.pages.length}`);
  console.log(`Scanned at: ${db.scannedAt}`);
  console.log(`Total components: ${Object.keys(db.index.byComponent).length}`);
  console.log(`Total API endpoints: ${Object.keys(db.index.byApi).length}`);
  console.log(`Pages with errors: ${Object.keys(db.index.byError).length}`);
  
  const totalLines = db.pages.reduce((sum, p) => sum + p.lines, 0);
  console.log(`Total lines of code: ${totalLines}`);
  
  const avgLines = Math.round(totalLines / db.pages.length);
  console.log(`Average lines per page: ${avgLines}`);
}

function listDeps(db) {
  const allDeps = new Set();
  for (const page of db.pages) {
    for (const dep of page.dependencies) {
      allDeps.add(dep);
    }
  }
  
  console.log(`\n📦 DEPENDENCIES (${allDeps.size} total):\n`);
  Array.from(allDeps).sort().forEach(dep => console.log(`  ${dep}`));
}

function main() {
  const db = loadDatabase();
  const [, , command, arg] = process.argv;
  
  switch (command) {
    case 'errors':
      showErrors(db);
      break;
    case 'api':
      if (!arg) console.error('Usage: query-metadata.js api <endpoint>');
      else findByApi(db, arg);
      break;
    case 'component':
      if (!arg) console.error('Usage: query-metadata.js component <name>');
      else findByComponent(db, arg);
      break;
    case 'deps':
      listDeps(db);
      break;
    case 'stats':
      showStats(db);
      break;
    default:
      console.log('Usage: node scripts/query-metadata.js [command] [arg]');
      console.log('Commands: errors, api <endpoint>, component <name>, deps, stats');
  }
}

main();
