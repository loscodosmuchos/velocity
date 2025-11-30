#!/usr/bin/env node

/**
 * ORPHANED PAGES AUDIT
 * Finds pages that exist in src/pages but aren't linked in any menu config
 */

const fs = require('fs');
const path = require('path');

const menusToCheck = [
  'src/config/admin-menu.ts',
  'src/config/sidebar-menu.ts',
  'src/config/main-menu.ts',
];

const pageDirs = [
  'src/pages/dashboard',
  'src/pages/contractors',
  'src/pages/sow',
  'src/pages/purchase-orders',
  'src/pages/admin',
  'src/pages/documents',
];

console.log('🔍 ORPHANED PAGES AUDIT\n');

// Read all menu configs
let allMenuLinks = new Set();
menusToCheck.forEach((menuFile) => {
  if (fs.existsSync(menuFile)) {
    const content = fs.readFileSync(menuFile, 'utf8');
    // Extract route paths (look for "path": "/...", or href="/...")
    const matches = content.match(/["'](?:path|href)["']\s*:\s*["']([^"']+)["']/g) || [];
    matches.forEach((match) => {
      const route = match.match(/["']([^"']+)["']$/)[1];
      allMenuLinks.add(route);
    });
  }
});

console.log(`✅ Found ${allMenuLinks.size} menu links\n`);

// Read all page files
let orphanedPages = [];
pageDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (!file.endsWith('.tsx')) return;
    
    const filePath = path.join(dir, file);
    const routePath = filePath
      .replace('src/pages', '')
      .replace(/\.tsx$/, '')
      .replace(/\/index$/, '')
      .replace(/\[id\]/, ':id');
    
    // Check if this route is in any menu
    const isLinked = Array.from(allMenuLinks).some((link) => {
      return link === routePath || link.includes(routePath);
    });
    
    if (!isLinked) {
      orphanedPages.push({
        file: filePath,
        route: routePath,
      });
    }
  });
});

if (orphanedPages.length === 0) {
  console.log('✅ No orphaned pages found!\n');
  process.exit(0);
}

console.log(`\n⚠️  FOUND ${orphanedPages.length} ORPHANED PAGES:\n`);
orphanedPages.forEach((page, i) => {
  console.log(`${i + 1}. ${page.file}`);
  console.log(`   Route: ${page.route}`);
  console.log(`   Status: NOT IN ANY MENU\n`);
});

console.log('\n📋 TO FIX:');
console.log('Add these routes to src/config/admin-menu.ts or appropriate menu file\n');

process.exit(orphanedPages.length > 0 ? 1 : 0);
