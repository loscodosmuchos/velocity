#!/usr/bin/env node

/**
 * Orphan Page Scanner
 * Finds all page files that are NOT linked from any navigation
 * 
 * Usage: node scripts/scan-orphan-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const appPath = path.join(__dirname, '../src/App.tsx');
const adminHubPath = path.join(__dirname, '../src/pages/hubs/admin-hub.tsx');
const sidebarPath = path.join(__dirname, '../src/components/refine-ui/layout/sidebar.tsx');

console.log('\n' + '═'.repeat(70));
console.log('  🔍 ORPHAN PAGE SCANNER');
console.log('  Finds pages NOT linked from navigation');
console.log('═'.repeat(70));

// Get all page files
function getAllPageFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllPageFiles(fullPath, baseDir));
    } else if (item.endsWith('.tsx')) {
      const relativePath = fullPath.replace(baseDir, '').replace(/^\//, '');
      files.push(relativePath);
    }
  }
  
  return files;
}

// Convert file path to route
function fileToRoute(filePath) {
  let route = filePath
    .replace(/\.tsx$/, '')
    .replace(/\/index$/, '')
    .replace(/^\//, '');
  
  // Handle special cases
  if (route.startsWith('admin/')) route = route;
  else if (route.startsWith('ai/')) route = route;
  else if (route.startsWith('auth/')) route = route;
  
  return '/' + route;
}

// Read all navigation sources
const appContent = fs.readFileSync(appPath, 'utf-8');
const adminHubContent = fs.existsSync(adminHubPath) ? fs.readFileSync(adminHubPath, 'utf-8') : '';

// Extract all routes from App.tsx
const routeRegex = /(?:Route path=["']([^"']+)["']|list:\s*["']([^"']+)["'])/g;
const linkedRoutes = new Set();
let match;

while ((match = routeRegex.exec(appContent)) !== null) {
  const route = match[1] || match[2];
  if (route) {
    linkedRoutes.add('/' + route.replace(/^\//, ''));
    linkedRoutes.add(route.replace(/^\//, ''));
  }
}

// Extract routes from Admin Hub
const goRegex = /go\(\{\s*to:\s*["']([^"']+)["']/g;
while ((match = goRegex.exec(adminHubContent)) !== null) {
  linkedRoutes.add(match[1]);
  linkedRoutes.add(match[1].replace(/^\//, ''));
}

// Get all page files
const allPages = getAllPageFiles(pagesDir);

console.log(`\n📁 Found ${allPages.length} page files`);
console.log(`🔗 Found ${linkedRoutes.size} linked routes\n`);

// Categorize pages
const orphanPages = [];
const linkedPages = [];

allPages.forEach(page => {
  const route = fileToRoute(page);
  const routeWithoutSlash = route.replace(/^\//, '');
  const fileName = path.basename(page, '.tsx');
  
  // Check if this route is linked anywhere
  const isLinked = 
    linkedRoutes.has(route) || 
    linkedRoutes.has(routeWithoutSlash) ||
    linkedRoutes.has(fileName) ||
    Array.from(linkedRoutes).some(r => r.includes(fileName)) ||
    appContent.includes(`"${routeWithoutSlash}"`) ||
    appContent.includes(`'${routeWithoutSlash}'`) ||
    appContent.includes(`/${fileName}"`);
  
  if (isLinked) {
    linkedPages.push({ page, route });
  } else {
    orphanPages.push({ page, route });
  }
});

console.log('-'.repeat(70));
console.log('\n✅ LINKED PAGES (' + linkedPages.length + ')\n');
linkedPages.slice(0, 10).forEach(p => console.log(`  ✓ ${p.route}`));
if (linkedPages.length > 10) console.log(`  ... and ${linkedPages.length - 10} more`);

console.log('\n' + '-'.repeat(70));
console.log('\n❌ ORPHAN PAGES (' + orphanPages.length + ') - NOT LINKED FROM NAVIGATION\n');

// Group orphans by category
const categories = {};
orphanPages.forEach(p => {
  const category = p.page.split('/')[0] || 'root';
  if (!categories[category]) categories[category] = [];
  categories[category].push(p);
});

Object.entries(categories).sort().forEach(([category, pages]) => {
  console.log(`\n  📂 ${category.toUpperCase()} (${pages.length}):`);
  pages.forEach(p => {
    console.log(`     ⚠️  ${p.route}`);
  });
});

// Recommendations
console.log('\n' + '═'.repeat(70));
console.log('\n📋 RECOMMENDATIONS\n');

if (orphanPages.length === 0) {
  console.log('  ✅ All pages are linked! No orphans found.\n');
} else {
  console.log('  The following pages need to be linked to navigation:\n');
  
  // Group by suggested menu location
  const adminOrphans = orphanPages.filter(p => p.route.startsWith('/admin/'));
  const aiOrphans = orphanPages.filter(p => p.route.startsWith('/ai/'));
  const otherOrphans = orphanPages.filter(p => !p.route.startsWith('/admin/') && !p.route.startsWith('/ai/'));
  
  if (adminOrphans.length > 0) {
    console.log('  🔧 ADD TO ADMIN MENU (sidebar resources):');
    adminOrphans.forEach(p => console.log(`     → ${p.route}`));
    console.log('');
  }
  
  if (aiOrphans.length > 0) {
    console.log('  🤖 ADD TO AI MENU:');
    aiOrphans.forEach(p => console.log(`     → ${p.route}`));
    console.log('');
  }
  
  if (otherOrphans.length > 0) {
    console.log('  📍 NEEDS MENU LOCATION:');
    otherOrphans.forEach(p => console.log(`     → ${p.route}`));
    console.log('');
  }
}

// Summary
console.log('═'.repeat(70));
console.log('\n📊 SUMMARY\n');
console.log(`  Total Pages: ${allPages.length}`);
console.log(`  Linked: ${linkedPages.length} (${((linkedPages.length / allPages.length) * 100).toFixed(1)}%)`);
console.log(`  Orphans: ${orphanPages.length} (${((orphanPages.length / allPages.length) * 100).toFixed(1)}%)`);
console.log('');

if (orphanPages.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
