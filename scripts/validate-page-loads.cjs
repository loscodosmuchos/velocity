#!/usr/bin/env node

const puppeteer = require('puppeteer');

const CRITICAL_PAGES = [
  { path: '/', name: 'dashboard' },
  { path: '/contractors', name: 'contractors' },
  { path: '/purchase-orders', name: 'purchase-orders' },
  { path: '/timecards', name: 'timecards' },
  { path: '/invoices', name: 'invoices' },
  { path: '/ai/voice-contract', name: 'ai/voice-contract' },
  { path: '/ai/insights', name: 'ai/insights' },
  { path: '/analytics/dashboard', name: 'analytics/dashboard' },
];

const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : 'http://localhost:5000';

const API_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`.replace(':5000', ':3001')
  : 'http://localhost:3001';

async function validatePageLoads() {
  console.log('🚀 Starting automated page load validation...\n');
  console.log(`📍 Testing ${CRITICAL_PAGES.length} critical pages`);
  console.log(`🌐 Base URL: ${BASE_URL}\n`);

  let browser;
  const results = [];

  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium-browser'
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Visit each page and wait for load
    for (const pageConfig of CRITICAL_PAGES) {
      const startTime = Date.now();
      console.log(`📄 Loading: ${pageConfig.path}`);

      try {
        await page.goto(`${BASE_URL}${pageConfig.path}`, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });

        // Wait additional time for tracking pixel to fire
        await new Promise(resolve => setTimeout(resolve, 2000));

        const loadTime = Date.now() - startTime;
        console.log(`   ✅ Loaded in ${loadTime}ms`);

        results.push({
          page: pageConfig.name,
          path: pageConfig.path,
          loaded: true,
          loadTime
        });
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        results.push({
          page: pageConfig.name,
          path: pageConfig.path,
          loaded: false,
          error: error.message
        });
      }
    }

    await browser.close();
    console.log('\n⏳ Waiting 3 seconds for tracking pixels to register...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check tracking logs for each page
    console.log('🔍 Verifying tracking pixel logs...\n');

    let allPassed = true;
    const validationResults = [];

    for (const result of results) {
      if (!result.loaded) {
        console.log(`❌ ${result.page}: Page failed to load`);
        validationResults.push({ ...result, pixelFired: false });
        allPassed = false;
        continue;
      }

      try {
        const response = await fetch(`${API_URL}/api/tracking/last-load/${result.page}`);
        const data = await response.json();

        if (data.success && data.secondsAgo < 60) {
          console.log(`✅ ${result.page}: Pixel fired ${data.secondsAgo}s ago - ${data.status.toUpperCase()}`);
          validationResults.push({ 
            ...result, 
            pixelFired: true, 
            lastLoad: data.lastValidatedLoad,
            secondsAgo: data.secondsAgo 
          });
        } else if (data.success) {
          console.log(`⚠️  ${result.page}: Last load was ${data.secondsAgo}s ago (STALE)`);
          validationResults.push({ 
            ...result, 
            pixelFired: true, 
            lastLoad: data.lastValidatedLoad,
            secondsAgo: data.secondsAgo,
            stale: true
          });
          allPassed = false;
        } else {
          console.log(`❌ ${result.page}: No tracking pixel record found`);
          validationResults.push({ ...result, pixelFired: false });
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${result.page}: Failed to check tracking - ${error.message}`);
        validationResults.push({ ...result, pixelFired: false, error: error.message });
        allPassed = false;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(60));

    const passed = validationResults.filter(r => r.loaded && r.pixelFired && !r.stale).length;
    const failed = validationResults.length - passed;

    console.log(`Total Pages: ${CRITICAL_PAGES.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / CRITICAL_PAGES.length) * 100)}%`);

    if (allPassed) {
      console.log('\n🎉 ALL PAGES VALIDATED - Ready for demo!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  VALIDATION FAILED - Fix issues before demo\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Fatal error during validation:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

validatePageLoads();
