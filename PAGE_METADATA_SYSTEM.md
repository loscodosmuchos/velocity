# PAGE METADATA SYSTEM - "Git for the App" 🚀

## What This Does
Creates a searchable database of all pages/components scanning for:
- Missing dependencies
- Type errors (@ts-ignore, any)
- TODOs/FIXMEs
- API usage patterns
- Component definitions
- Error handling patterns

## Quick Start

**Scan all pages and build database:**
```bash
node scripts/page-metadata-scanner.js
```

**Query the database:**
```bash
# Show all errors across pages
node scripts/query-metadata.js errors

# Find pages using specific API
node scripts/query-metadata.js api /api/approvals

# Find pages with specific component
node scripts/query-metadata.js component DataTable

# Show database statistics
node scripts/query-metadata.js stats

# List all dependencies
node scripts/query-metadata.js deps
```

## Benefits

✅ **Fast Debugging** - Instead of grepping, query: "Which pages use /api/approvals?"
✅ **Change Tracking** - DB records hash of each page, detects what changed
✅ **Error Detection** - Automatically finds TODO, FIXME, @ts-ignore, any types
✅ **Impact Analysis** - Know which pages break when you change a component
✅ **Dependency Audit** - List all npm packages used across pages

## Database Schema

```json
{
  "version": "1.0",
  "scannedAt": "2025-11-27T...",
  "pages": [
    {
      "path": "approvals/requests.tsx",
      "name": "requests",
      "hash": "abc123...",
      "timestamp": "2025-11-27T...",
      "imports": ["react", "@refinedev/react-table", ...],
      "exports": ["ApprovalRequestsPage"],
      "components": ["ApprovalRequestsPage"],
      "hooks": ["useState", "useEffect", "useTable"],
      "apis": ["/api/approvals", "/api/approvals/stats"],
      "errors": [],
      "dependencies": ["react", "@refinedev/react-table"],
      "lines": 280
    }
  ],
  "index": {
    "byPath": {...},
    "byError": {...},
    "byComponent": {...},
    "byApi": {...}
  }
}
```

## Use Cases

### Before Demo
```bash
node scripts/query-metadata.js errors
# Find any TODO/FIXME/ts-ignore before showing stakeholders
```

### After Code Change
```bash
node scripts/page-metadata-scanner.js
node scripts/query-metadata.js api /api/new-endpoint
# Track which pages need updating
```

### Component Refactor
```bash
node scripts/query-metadata.js component OldComponentName
# Find all pages using old component before deleting
```

### Dependency Cleanup
```bash
node scripts/query-metadata.js deps
# See what's actually used before removing packages
```

## Integration with CI/CD

Add to `.replit`:
```yaml
run = "node scripts/page-metadata-scanner.js && npm run dev"
```

This ensures database is updated every dev server start.

## Next Steps
- Run scanner before each demo
- Query for errors to catch issues early
- Track database diffs to understand impact of changes
- Build visual dashboard to display scan results

This is essentially "git blame for your UI" - every page is tracked, indexed, and searchable.
