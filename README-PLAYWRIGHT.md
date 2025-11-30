# Playwright Route Audit Automation

Automated end-to-end testing for all 93+ application routes using Playwright.

## Purpose

- **Validate clickability** of all routes before demo
- **Monitor UX standards** (hover states, single-click navigation, action visibility)
- **Detect broken links** and missing elements
- **Track demo-critical paths** specifically
- **Generate automated reports** on every push/PR

## Setup

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

```bash
npm install
npx playwright install --with-deps
```

## Running Tests

### Run all route audits

```bash
npm run test:audit
```

### Run specific test suite

```bash
npx playwright test tests/routes-audit.spec.ts
```

### Run in UI mode (interactive)

```bash
npx playwright test --ui
```

### Run with headed browser (see what's happening)

```bash
npx playwright test --headed
```

### Generate HTML report

```bash
npx playwright show-report
```

## Test Suites

### 1. Route Audit - All 93+ Routes

Tests every route for:

- Page loads without errors
- No error messages/components visible
- Content present on page
- Loading spinners resolved
- Primary action buttons clickable

**Routes tested:** All routes defined in `tests/routes-config.json`

### 2. Demo-Critical Paths - Segment Testing

Tests the 5 demo segments specifically:

- Segment 1: Contractor Import Flow
- Segment 2: SOW Creation Flow
- Segment 3: AI Insights Page
- Segment 4: Dashboard Impact View

### 3. List Pages - UX Standards

Tests all list pages for:

- Table/grid present
- Row hover states working
- Primary column clickable
- Proper visual hierarchy

**Pages tested:**

- `/contractors`
- `/purchase-orders`
- `/invoices`
- `/assets`
- `/timecards`
- `/expenses`

## Route Configuration

Edit `tests/routes-config.json` to add/modify routes:

```json
{
  "path": "/route-path",
  "name": "Human Readable Name",
  "priority": "critical|high|medium",
  "expectedElements": ["element-selector1", "element-selector2"]
}
```

**Priority levels:**

- `critical` - Must pass before demo
- `high` - Should pass, affects UX
- `medium` - Nice to have

## CI/CD Integration

### GitHub Actions

Tests run automatically on:

- **Every push** to master/main
- **Every pull request** against master/main
- **Daily at 2 AM UTC** (schedule)

**Artifacts generated:**

- HTML test report
- JSON results file
- JUnit XML for CI systems

**PR Comments:**
Automated comment on PRs with pass/fail summary.

## Report Files

After running tests, check:

- **HTML Report**: `test-results/index.html` (open in browser)
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

## Troubleshooting

### "Browser not found"

```bash
npx playwright install --with-deps
```

### "Connection refused" (localhost)

Make sure dev server is running:

```bash
npm run dev
```

### Timeout on route

- Check if page is actually loading
- Increase timeout in `playwright.config.ts`
- Add trace output: `npm run test:audit -- --trace on`

### Tests pass locally but fail in CI

- Check Node version in CI matches local
- Verify all dependencies installed
- Run with `--headed` to see what CI sees

## Configuration

### playwright.config.ts

Key settings:

- `baseURL`: Application URL (localhost:5173)
- `timeout`: Test timeout (30s default)
- `retries`: Retry failed tests (2 times in CI)
- `workers`: Parallel test workers (1 in CI)

Edit to adjust behavior.

## Performance

### Optimization Tips

- Run tests in parallel: `--workers=4`
- Run only critical tests: `npx playwright test --grep "@critical"`
- Skip screenshots: Remove `screenshot: 'only-on-failure'`

### Expected Runtime

- **All tests**: ~15-25 minutes (full browser suite)
- **Critical paths only**: ~5-10 minutes
- **Single route**: <30 seconds

## Best Practices

1. **Run before demo**: Execute full audit 1 hour before demo
2. **Check reports**: Always review HTML report for visual issues
3. **Monitor CI**: Check GitHub Actions for regex route failures
4. **Update routes**: Keep `routes-config.json` in sync with App.tsx
5. **Add assertions**: Add custom checks for new routes

## Adding New Routes

1. Add route to `App.tsx`
2. Add entry to `tests/routes-config.json`
3. Run: `npm run test:audit`
4. Review: `npx playwright show-report`
5. Commit: `git add . && git commit -m "Add route audit for [route-name]"`

## Debugging

### View test execution

```bash
npm run test:audit -- --debug
```

### Trace specific test

```bash
npx playwright test tests/routes-audit.spec.ts -g "Dashboard" --trace on
```

### Screenshots & videos

Check `test-results/` for:

- `screenshots/` - Failed test screenshots
- `videos/` - Full test video traces

## Support

For issues:

1. Check trace files: `test-results/trace.zip`
2. Review HTML report
3. Run locally with `--headed` to debug
4. Check GitHub Actions logs

---

**Status**: Production Ready ✅  
**Last Updated**: 2025-01-24  
**Maintenance**: Automated via GitHub Actions
