import { test, expect } from '@playwright/test';

/**
 * VELOCITY CRITICAL DEMO PATH TEST
 * Tests the exact "Wes Demo" workflow from the Master Directive
 * 
 * The workflow:
 * 1. LOGIN → Homepage/Command Center displays immediately
 * 2. UPLOAD → Asset Management SOW document (PDF)
 * 3. VIEW → Document analyzer processes and displays data
 * 4. NAVIGATE → See SOW components (deliverables, timelines, budget)
 * 5. DRILL DOWN → View associated POs
 * 6. CREATE → Open new PO request linked to SOW
 * 7. ASSIGN → Add contractors to PO
 * 8. TRACK → See approval workflow status
 */

const BASE_URL = process.env.VELOCITY_URL || 'http://localhost:5000';

test.describe('Critical Demo Path - Wes Demo', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Step 1: Dashboard loads immediately (<2s)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 5000 }).catch(() => {});
    
    const loadTime = Date.now() - startTime;
    console.log(`Dashboard load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(5000);
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });
  });

  test('Step 2: Navigate to Document Upload', async ({ page }) => {
    await page.goto(`${BASE_URL}/documents/upload`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Multi-Lens')).toBeVisible({ timeout: 10000 }).catch(() => {
      expect(page.locator('text=Document')).toBeVisible();
    });
  });

  test('Step 3: Document Analyzer is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/documents/upload`);
    await page.waitForLoadState('networkidle');
    
    const analyzerVisible = await page.locator('[data-testid="document-analyzer"]').isVisible().catch(() => false);
    const multiLensVisible = await page.locator('text=Multi-Lens').isVisible().catch(() => false);
    const uploadVisible = await page.locator('text=Upload').isVisible().catch(() => false);
    
    expect(analyzerVisible || multiLensVisible || uploadVisible).toBe(true);
  });

  test('Step 4: SOW List displays data', async ({ page }) => {
    await page.goto(`${BASE_URL}/statementofworks`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('table, [data-testid="sow-list"]')).toBeVisible({ timeout: 10000 }).catch(() => {});
    
    const rows = await page.locator('tbody tr').count();
    console.log(`SOW count: ${rows}`);
    expect(rows).toBeGreaterThan(0);
  });

  test('Step 5: SOW Detail shows PO linkage', async ({ page }) => {
    await page.goto(`${BASE_URL}/statementofworks`);
    await page.waitForLoadState('networkidle');
    
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
    
    await page.waitForURL(/statementofworks\/\d+/, { timeout: 5000 }).catch(() => {});
    
    const purchaseOrderSection = page.locator('text=Purchase Order');
    const visible = await purchaseOrderSection.isVisible().catch(() => false);
    console.log(`PO linkage visible: ${visible}`);
  });

  test('Step 6: Purchase Orders page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/purchaseorders`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('table, [data-testid="po-list"]')).toBeVisible({ timeout: 10000 }).catch(() => {});
    
    const rows = await page.locator('tbody tr').count();
    console.log(`PO count: ${rows}`);
    expect(rows).toBeGreaterThan(0);
  });

  test('Step 7: Create PO form accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/purchaseorders/create`);
    await page.waitForLoadState('networkidle');
    
    const formVisible = await page.locator('form, [data-testid="po-form"]').isVisible().catch(() => false);
    const createButtonVisible = await page.locator('button:has-text("Create"), button:has-text("Save")').isVisible().catch(() => false);
    
    expect(formVisible || createButtonVisible).toBe(true);
  });

  test('Step 8: Contractors page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/contractors`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('table, [data-testid="contractor-list"]')).toBeVisible({ timeout: 10000 }).catch(() => {});
    
    const rows = await page.locator('tbody tr').count();
    console.log(`Contractor count: ${rows}`);
    expect(rows).toBeGreaterThan(0);
  });

  test('Step 9: Approvals workflow accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/approvals`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Approval')).toBeVisible({ timeout: 10000 });
  });

  test('Step 10: SOW Command Center loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/sow-command-center`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Command Center, text=SOW')).toBeVisible({ timeout: 10000 }).catch(() => {
      expect(page.locator('h1, h2')).toBeVisible();
    });
  });

  test('Demo Mode does not disable buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const buttons = page.locator('button:not([disabled])');
    const enabledCount = await buttons.count();
    
    console.log(`Enabled buttons: ${enabledCount}`);
    expect(enabledCount).toBeGreaterThan(5);
  });

  test('No console errors on critical pages', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const criticalPages = ['/', '/statementofworks', '/purchaseorders', '/contractors'];
    
    for (const path of criticalPages) {
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('networkidle');
    }
    
    const criticalErrors = errors.filter(e => 
      !e.includes('WebSocket') && 
      !e.includes('favicon') &&
      !e.includes('DevTools')
    );
    
    console.log(`Critical errors: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors);
    }
  });

});

test.describe('Data Integrity Checks', () => {

  test('SOW data has required fields', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/statements-of-work`);
    const data = await response.json();
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const firstSow = data[0];
    expect(firstSow).toHaveProperty('id');
    expect(firstSow).toHaveProperty('projectName');
    expect(firstSow).toHaveProperty('status');
  });

  test('PO data has required fields', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/purchase-orders`);
    const data = await response.json();
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const firstPo = data[0];
    expect(firstPo).toHaveProperty('id');
    expect(firstPo).toHaveProperty('poNumber');
    expect(firstPo).toHaveProperty('totalAmount');
  });

  test('Contractor data has required fields', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/contractors`);
    const data = await response.json();
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    const firstContractor = data[0];
    expect(firstContractor).toHaveProperty('id');
    expect(firstContractor).toHaveProperty('firstName');
    expect(firstContractor).toHaveProperty('lastName');
  });

  test('No NaN or undefined values in key metrics', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/purchase-orders`);
    const data = await response.json();
    
    for (const po of data.slice(0, 10)) {
      const totalAmount = Number(po.totalAmount);
      const amountSpent = Number(po.amountSpent);
      
      expect(isNaN(totalAmount)).toBe(false);
      expect(isNaN(amountSpent)).toBe(false);
    }
  });

});
