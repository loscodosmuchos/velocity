#!/usr/bin/env node
/**
 * VISUAL CHANGE CONTROL - PAGE SCREENSHOT CAPTURE
 * Captures screenshots of all app pages for visual regression testing
 * Stores in database with metadata for change detection
 */

const puppeteer = require('puppeteer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const pg = require('pg');

const { Pool } = pg;

// Database connection
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

// Pages to capture (priority order)
const PAGES_TO_CAPTURE = [
  { path: '/dashboard', name: 'Dashboard', component_type: 'page', priority: 1 },
  { path: '/approvals', name: 'Approvals - Requests', component_type: 'page', priority: 1 },
  { path: '/admin/change-log-dashboard', name: 'Admin - Change Log', component_type: 'page', priority: 1 },
  { path: '/admin/bug-pattern-detector', name: 'Admin - Bug Patterns', component_type: 'page', priority: 1 },
  { path: '/contractors', name: 'Contractors List', component_type: 'page', priority: 2 },
  { path: '/invoices', name: 'Invoices List', component_type: 'page', priority: 2 },
  { path: '/timecards', name: 'Timecards List', component_type: 'page', priority: 2 },
];

async function captureScreenshot(browser, pageUrl, pageName, devServerUrl = 'http://localhost:5000') {
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const fullUrl = `${devServerUrl}${pageUrl}`;
    console.log(`📸 Capturing: ${pageName} (${fullUrl})`);
    
    // Navigate and wait for load
    await Promise.race([
      page.goto(fullUrl, { waitUntil: 'networkidle2' }),
      new Promise(resolve => setTimeout(resolve, 5000)) // 5 second timeout
    ]);
    
    // Wait for content to render
    await page.waitForTimeout(1000);
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    
    // Calculate hash
    const hash = crypto
      .createHash('sha256')
      .update(screenshotBuffer)
      .digest('hex');
    
    // Save to file system
    const screenshotDir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filename = `${pageUrl.replace(/\//g, '-').substring(1)}_${Date.now()}.png`;
    const filepath = path.join(screenshotDir, filename);
    fs.writeFileSync(filepath, screenshotBuffer);
    
    await page.close();
    
    return {
      success: true,
      path: pageUrl,
      name: pageName,
      hash,
      size: screenshotBuffer.length,
      filepath: filename,
      dimensions: { width: 1920, height: 1080 }
    };
  } catch (error) {
    console.error(`❌ Failed to capture ${pageName}:`, error.message);
    return {
      success: false,
      path: pageUrl,
      name: pageName,
      error: error.message
    };
  }
}

async function storeScreenshot(screenshot, gitCommit = 'unknown', branch = 'main') {
  if (!screenshot.success) return null;
  
  try {
    // Mark previous as non-current
    await pool.query(
      'UPDATE page_screenshots SET is_current = FALSE WHERE page_path = $1 AND is_current = TRUE',
      [screenshot.path]
    );
    
    // Insert new screenshot
    const result = await pool.query(
      `INSERT INTO page_screenshots 
       (page_path, component_type, screenshot_hash, file_size, dimensions, captured_by, version_number, git_commit, branch_name, is_current, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, captured_at`,
      [
        screenshot.path,
        'page',
        screenshot.hash,
        screenshot.size,
        JSON.stringify(screenshot.dimensions),
        'system',
        1,
        gitCommit,
        branch,
        true,
        `Automated capture: ${screenshot.name}`
      ]
    );
    
    console.log(`✅ Stored: ${screenshot.name} (ID: ${result.rows[0].id})`);
    return result.rows[0];
  } catch (error) {
    console.error(`❌ Failed to store ${screenshot.name}:`, error.message);
    return null;
  }
}

async function detectVisualChanges(pageUrl) {
  try {
    // Get previous and current screenshots
    const result = await pool.query(
      `SELECT id, screenshot_hash, captured_at 
       FROM page_screenshots 
       WHERE page_path = $1 
       ORDER BY captured_at DESC 
       LIMIT 2`,
      [pageUrl]
    );
    
    if (result.rows.length < 2) return null;
    
    const [current, previous] = result.rows;
    
    if (current.screenshot_hash === previous.screenshot_hash) {
      console.log(`   No visual changes detected for ${pageUrl}`);
      return null;
    }
    
    // Hash mismatch = visual change detected
    console.log(`   ⚠️  Visual change detected for ${pageUrl}`);
    
    await pool.query(
      `INSERT INTO visual_changes 
       (page_path, change_type, severity, description, previous_screenshot_id, current_screenshot_id, detected_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        pageUrl,
        'visual-diff',
        'medium',
        'Visual change detected between versions',
        previous.id,
        current.id,
        'system'
      ]
    );
    
    return { previous: previous.id, current: current.id };
  } catch (error) {
    console.error(`Error detecting changes for ${pageUrl}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   VISUAL CHANGE CONTROL - PAGE SCREENSHOTS    ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  let browser;
  try {
    // Start browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('📱 Browser launched\n');
    
    // Capture all pages
    const screenshots = [];
    for (const page of PAGES_TO_CAPTURE) {
      const screenshot = await captureScreenshot(
        browser,
        page.path,
        page.name,
        process.env.DEV_SERVER_URL || 'http://localhost:5000'
      );
      
      if (screenshot.success) {
        const stored = await storeScreenshot(screenshot);
        if (stored) {
          screenshots.push(screenshot);
          await detectVisualChanges(page.path);
        }
      }
      
      // Small delay between captures
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    console.log('\n═══════════════════════════════════════════════');
    console.log(`✅ Capture Complete: ${screenshots.length}/${PAGES_TO_CAPTURE.length} pages captured`);
    console.log('═══════════════════════════════════════════════\n');
    
    // Update coverage
    const result = await pool.query(
      `SELECT COUNT(*) as covered FROM page_coverage 
       WHERE page_path IN (SELECT DISTINCT page_path FROM page_screenshots WHERE captured_at > NOW() - INTERVAL '1 day')`
    );
    console.log(`📊 Pages with recent coverage: ${result.rows[0].covered}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    await pool.end();
    console.log('\n✅ Screenshot capture complete\n');
  }
}

main();
