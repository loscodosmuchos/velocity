#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOT_DIR = path.join(__dirname, '../screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const ROUTES_TO_VALIDATE = [
  { path: '/', name: 'dashboard' },
  { path: '/contractors', name: 'contractors-list' },
  { path: '/purchase-orders', name: 'purchase-orders-list' },
  { path: '/timecards', name: 'timecards-list' },
  { path: '/invoices', name: 'invoices-list' },
  { path: '/expenses', name: 'expenses-list' },
  { path: '/assets', name: 'assets-list', waitUntil: 'domcontentloaded' },
];

async function validateVisualState() {
  console.log('🎬 Starting Visual Validation...\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    validations: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    for (const route of ROUTES_TO_VALIDATE) {
      const validation = {
        route: route.path,
        name: route.name,
        status: 'unknown',
        hasSidebar: false,
        hasTopNav: false,
        hasDefaultError: false,
        screenshot: null
      };

      try {
        console.log(`📍 Testing route: ${route.path}`);
        
        await page.goto(`${BASE_URL}${route.path}`, { 
          waitUntil: route.waitUntil || 'domcontentloaded',
          timeout: 20000
        }).catch(async (err) => {
          if (err.message.includes('timeout')) {
            console.log('  ⚠️  Navigation timeout, proceeding with screenshot...');
          } else {
            throw err;
          }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        validation.hasSidebar = await page.evaluate(() => {
          const sidebar = document.querySelector('[data-sidebar]') || 
                         document.querySelector('.sidebar') ||
                         document.querySelector('aside');
          return sidebar !== null && sidebar.offsetHeight > 0;
        });

        validation.hasTopNav = await page.evaluate(() => {
          const topnav = document.querySelector('nav') || 
                        document.querySelector('header');
          return topnav !== null && topnav.offsetHeight > 0;
        });

        validation.hasDefaultError = await page.evaluate(() => {
          const errorText = document.body.textContent || '';
          return errorText.includes('Page not found') || 
                 errorText.includes('404') ||
                 errorText.includes('DefaultErrorComponent');
        });

        const screenshotPath = path.join(SCREENSHOT_DIR, `${route.name}-${Date.now()}.png`);
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        validation.screenshot = screenshotPath;

        validation.status = validation.hasSidebar && validation.hasTopNav && !validation.hasDefaultError
          ? 'pass'
          : 'fail';

        const icon = validation.status === 'pass' ? '✅' : '❌';
        console.log(`  ${icon} ${route.name}: Sidebar=${validation.hasSidebar}, TopNav=${validation.hasTopNav}, Error=${validation.hasDefaultError}`);
        console.log(`  📸 Screenshot: ${screenshotPath}\n`);

      } catch (error) {
        validation.status = 'error';
        validation.error = error.message;
        console.log(`  ❌ ERROR: ${error.message}\n`);
      }

      results.validations.push(validation);
    }

  } finally {
    await browser.close();
  }

  const logPath = path.join(SCREENSHOT_DIR, 'validation-log.json');
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));

  console.log('\n📊 VALIDATION SUMMARY:');
  console.log(`─────────────────────────────`);
  const passed = results.validations.filter(v => v.status === 'pass').length;
  const failed = results.validations.filter(v => v.status === 'fail').length;
  const errors = results.validations.filter(v => v.status === 'error').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log(`📝 Log: ${logPath}\n`);

  if (failed > 0 || errors > 0) {
    console.log('🚨 VALIDATION FAILED - Check screenshots for details');
    process.exit(1);
  } else {
    console.log('🎉 ALL VALIDATIONS PASSED');
    process.exit(0);
  }
}

validateVisualState().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
