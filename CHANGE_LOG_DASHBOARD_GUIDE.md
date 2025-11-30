# CHANGE LOG DASHBOARD - Admin Page Guide

## What It Does
Real-time tracking dashboard showing:
1. **Each Change** - Title, description, file path, test location
2. **Test Plans** - Auto-generated, copy-paste ready
3. **Test Status** - Track which changes are pending/testing/tested/deployed
4. **Insights** - Page-level issues and warnings
5. **Testing Checklist** - Interactive checklist to mark tests as complete

## Access
Navigate to: `/admin/change-log-dashboard`

## Features

### 1. Changes Tab
- View all changes in chronological order
- Color-coded by priority (critical/high/medium/low)
- Status badges (pending/testing/tested/deployed)
- One-click "Start Testing" button
- "Copy Test Plan" generates formatted test steps

### 2. Insights Tab
- Auto-detected page issues
- Severity levels
- Sourced from metadata database
- Resolved/unresolved tracking

### 3. Testing Tab
- Visual progress: counts of each status
- Interactive testing checklist
- Priority-filtered testing queue
- Download testing summary as file

## Workflow Example

1. **Developer commits changes** → Change appears in dashboard
2. **QA clicks "Start Testing"** → Status changes to "testing"
3. **QA clicks "Copy Test Plan"** → Gets formatted test steps
4. **QA performs tests** → Updates findings in plan
5. **QA clicks "Mark Tested"** → Status changes to "tested", timestamp recorded
6. **Download summary** → Report of all tested changes

## Database Tables

```sql
-- Stores each change
change_log: id, title, description, file_path, test_location, test_plan, status, priority, created_at, tested_at, tested_by

-- Stores test results
test_results: id, change_id, test_status, test_output, tester_name, tested_at

-- Stores page insights
page_insights: id, page_path, insight_type, insight_text, severity, page_hash, created_at
```

## API Endpoints

```
GET /api/change-log
  - Returns all changes

GET /api/page-insights
  - Returns unresolved insights

PATCH /api/change-log/{id}/status
  - Updates change status
  - Body: { "status": "tested|pending|testing|deployed" }
```

## Integration Points

### Metadata Database Integration
- Scans pages with `page-metadata-scanner.js`
- Stores errors/TODOs/FIXMEs as insights
- Auto-populates "Issues Found" in insights tab

### Change Detection
- Manual creation through admin page
- Or automatic when metadata scanner detects changes (hash mismatch)

## Next Steps

1. Add route to admin navigation pointing to `/admin/change-log-dashboard`
2. Run `pnpm dev` to test
3. Navigate to change log dashboard
4. Click on changes to expand and view test plans
5. Use "Start Testing" workflow for QA cycles

## Data Pre-seeded

Initial 4 changes loaded tracking:
- KPI Summary Cards
- Transaction Safety
- JWT Refresh Token
- Approval UI - No Page Reload

These represent the recent work completed and are ready for testing.
