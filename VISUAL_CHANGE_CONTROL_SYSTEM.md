# VISUAL CHANGE CONTROL SYSTEM
**Screenshots + change tracking + visual regression detection for all pages**

---

## OVERVIEW

A comprehensive system to:
1. **Capture** automated screenshots of all pages at key moments
2. **Store** screenshots with metadata (hash, dimensions, git commit, timestamp)
3. **Detect** visual changes between versions automatically
4. **Track** formatting issues, missing elements, color/layout inconsistencies
5. **Display** gallery of current pages showing how site looks
6. **Report** visual regressions before they reach production

---

## DATABASE SCHEMA

### `page_screenshots`
```sql
- id: SERIAL PRIMARY KEY
- page_path: VARCHAR(255) - e.g., '/approvals', '/admin/dashboard'
- screenshot_hash: VARCHAR(64) - SHA256 of image (detect changes)
- captured_at: TIMESTAMP
- is_current: BOOLEAN - marks latest version
- dimensions: JSONB - {width: 1920, height: 1080}
- git_commit: VARCHAR(40) - which commit created this
- branch_name: VARCHAR(255) - git branch
- description: TEXT - what this page shows
```

### `visual_changes`
```sql
- id: SERIAL PRIMARY KEY
- page_path: VARCHAR(255)
- change_type: VARCHAR(50) - 'colors', 'layout', 'typography', 'spacing', 'missing-element', 'extra-element', 'position', 'size'
- severity: VARCHAR(20) - 'critical', 'high', 'medium', 'low'
- previous_screenshot_id: INTEGER (FK)
- current_screenshot_id: INTEGER (FK)
- detected_at: TIMESTAMP
- resolved: BOOLEAN
```

### `page_coverage`
```sql
- page_path: VARCHAR(255) UNIQUE
- last_screenshot_at: TIMESTAMP
- total_screenshots: INTEGER
- current_screenshot_id: INTEGER (FK)
- coverage_status: 'covered', 'partial', 'uncovered'
- priority: 1=critical, 2=high, 3=medium, 4=low
```

---

## FEATURES

### 1. Admin UI Gallery (`/admin/visual-change-gallery`)

**3 Tabs:**

**Gallery Tab**
- Grid or List view of all tracked pages
- Current screenshot of each page
- Visual change indicators
- Click to see full history

**Changes Tab**
- All unresolved visual changes
- Severity badges (critical → low)
- Change type (colors, layout, missing-element, etc)
- Timestamp of detection

**Coverage Tab**
- How many pages are being tracked
- Priority breakdown (critical/high/medium/low)
- Coverage percentage per priority level
- Last capture time per page

### 2. Screenshot Capture (`scripts/capture-page-screenshots.cjs`)

**Automated Capture**
```bash
node scripts/capture-page-screenshots.cjs
```

**What It Does:**
- Launches headless browser with Puppeteer
- Visits each page in priority order
- Captures full-page screenshot at 1920×1080
- Calculates SHA256 hash
- Stores in database with metadata
- Detects changes (new hash = new version)
- Saves files to `screenshots/` directory

**Captured Pages (Priority Order):**
1. Dashboard
2. Approvals - Requests
3. Admin - Change Log
4. Admin - Bug Patterns
5. Contractors List
6. Invoices List
7. Timecards List

### 3. Change Detection

**Automatic Detection:**
- Screenshot hash stored = unique identifier
- Compare current hash to previous
- Hash mismatch = visual change detected
- Creates entry in `visual_changes` table
- Flags severity and change type

**Change Types:**
- `colors` - Color scheme changed
- `layout` - Spacing/positioning changed
- `typography` - Font/text style changed
- `missing-element` - Element removed
- `extra-element` - Element added
- `position` - Element moved
- `size` - Element resized

**Severity Levels:**
- `critical` - Breaks page functionality
- `high` - Significant visual break
- `medium` - Noticeable issue
- `low` - Minor inconsistency

---

## WORKFLOW: Capture → Detect → Report

### Before Each Release

1. **Trigger Capture**
   ```bash
   # From admin UI: Click "Capture All Pages"
   # OR from CLI:
   node scripts/capture-page-screenshots.cjs
   ```

2. **Automatic Detection**
   - System captures screenshots
   - Compares to previous version
   - Hash changes = detected changes
   - Stores in `visual_changes` table

3. **Review Changes**
   - Go to `/admin/visual-change-gallery`
   - See all unresolved changes
   - Click each to investigate
   - Mark as resolved if expected

4. **Fix or Approve**
   - If unwanted: Fix in code
   - If expected: Mark resolved
   - Run capture again to verify

---

## API ENDPOINTS

```
GET /api/page-screenshots
  Returns all screenshots with metadata
  Optional: ?page_path=/approvals (filter by path)

GET /api/visual-changes
  Returns all unresolved visual changes
  Use for detecting unexpected changes

GET /api/page-coverage
  Returns coverage status (which pages tracked)

POST /api/capture-screenshots
  Triggers screenshot capture (background job)
  
PATCH /api/visual-changes/:id
  Mark change as resolved
  Body: { resolved: true, notes: "..." }
```

---

## INTEGRATION WITH CI/CD

### GitHub Actions Workflow

```yaml
name: Visual Regression Tests
on: [pull_request]

jobs:
  capture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start dev server
        run: npm run dev &
      - name: Wait for server
        run: sleep 5
      - name: Capture screenshots
        run: node scripts/capture-page-screenshots.cjs
      - name: Check for visual changes
        run: |
          CHANGES=$(curl -s http://localhost:3000/api/visual-changes \
            -H "Authorization: Bearer ${{ secrets.VELOCITY_TOKEN }}" | jq '.[] | select(.resolved == false) | length')
          if [ "$CHANGES" -gt 0 ]; then
            echo "⚠️ Found $CHANGES unresolved visual changes"
            exit 1
          fi
      - name: Upload screenshots
        uses: actions/upload-artifact@v2
        if: always()
        with:
          name: page-screenshots
          path: screenshots/
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Capture screenshots of changed pages
echo "📸 Checking visual changes..."
node scripts/capture-page-screenshots.cjs

# Check for critical changes
CRITICAL=$(psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c \
  "SELECT COUNT(*) FROM visual_changes WHERE severity='critical' AND resolved=FALSE" | grep -oP '\d+')

if [ "$CRITICAL" -gt 0 ]; then
  echo "❌ Found $CRITICAL critical visual changes"
  exit 1
fi

echo "✅ No critical visual changes"
```

---

## TRACKING CHANGES OVER TIME

**History View (Future Enhancement)**
```
/admin/visual-change-gallery?history=true

Shows timeline:
- Oct 15: Dashboard button color changed (yellow → red)
- Oct 14: KPI cards spacing adjusted (+2px)
- Oct 13: Font size increased (14px → 16px)
```

**Compare Two Versions**
```
/admin/visual-change-gallery/compare?from=2025-10-13&to=2025-10-15

Side-by-side comparison showing:
- What changed
- When it changed
- What it looked like before
- What it looks like now
```

---

## CATCHING FORMATTING ISSUES

### What This System Detects

✅ **Colors**
- Background color changed
- Text color changed
- Border color changed
- Gradient changed

✅ **Layout**
- Spacing changed (padding/margin)
- Width/height changed
- Alignment changed
- Overflow/clipping issues

✅ **Typography**
- Font size changed
- Font family changed
- Font weight changed
- Line height changed
- Text overflow (ellipsis issues)

✅ **Content**
- Missing elements
- Extra elements
- Icon changes
- Image changes

✅ **State**
- Hover states look wrong
- Active states look wrong
- Focus states look wrong
- Error states look wrong

---

## EXAMPLE: Detecting a Bug

**Scenario:** Developer changes approval button color from cyan to green

1. **Screenshot captured** before change
   - SHA256: `abc123def456`
   - Color: cyan button

2. **Code changed** (button color cyan → green)

3. **Screenshot captured** after change
   - SHA256: `xyz789uvw012` (different = change detected)
   - Color: green button

4. **System creates entry:**
   ```
   visual_changes:
   - page_path: /approvals
   - change_type: colors
   - severity: medium
   - description: Button color changed from cyan to green
   - detected_at: 2025-11-27 02:15:00
   - resolved: false
   ```

5. **Admin sees:**
   - Gallery shows change badge on `/approvals`
   - Changes tab shows: "Button color changed"
   - Developer can investigate

6. **Resolved as:**
   - Expected change: Mark `resolved = true`
   - Unintended bug: Fix code & recapture

---

## BEST PRACTICES

1. **Capture regularly**
   - Before each release
   - After major UI changes
   - Daily via CI/CD

2. **Review changes quickly**
   - Don't let unresolved changes pile up
   - Address within 24 hours

3. **Document changes**
   - Add notes explaining why changed
   - Link to related tickets/PRs

4. **Use for demos**
   - Gallery shows current state of all pages
   - Great for showing stakeholders progress
   - Proves no regressions

5. **Integrate into QA**
   - QA runs captures before test
   - Detects unexpected changes automatically
   - Reduces manual visual testing

---

## METRICS & REPORTS

```
Dashboard shows:
- Total pages tracked: 9
- Pages with unresolved changes: 2
- Most changed page: /approvals (12 changes)
- Average time to resolve: 3.2 hours
- Critical issues: 0
- High priority issues: 1
```

---

## DEPLOYMENT

### Local Development
```bash
# Capture screenshots locally
node scripts/capture-page-screenshots.cjs

# View in gallery
# Navigate to http://localhost:5000/admin/visual-change-gallery
```

### CI/CD Pipeline
```bash
# Runs automatically on PR
# Blocks merge if critical changes detected
# Uploads screenshots as artifact
```

### Pre-Demo Checklist
```
□ Run screenshot capture
□ Review all changes in gallery
□ Verify no formatting issues
□ Check all critical pages
□ Take note of expected vs unexpected changes
□ Share gallery link with team
```

---

## FUTURE ENHANCEMENTS

- [ ] Visual diff highlighting (red overlays on changes)
- [ ] Pixel-level comparison engine
- [ ] Mobile viewport captures (360px, 768px)
- [ ] Component-level screenshots (isolated)
- [ ] Automatic regression alerts
- [ ] Screenshot diff heatmaps
- [ ] Public gallery share link
- [ ] Time-travel: view any page at any date
- [ ] A/B comparison tool
- [ ] Accessibility scan integration
