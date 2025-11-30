# 🔧 MULTI-APP DISCOVERY RUNBOOK
**Technical Implementation Guide for 50+ Replit Application Inventory**

**Version:** 1.0  
**Date:** November 16, 2025  
**Classification:** Technical Implementation - Level 2  
**Prerequisites:** Strategic Master Plan reviewed and approved

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Credentials & Authentication](#credentials--authentication)
5. [Rate Limits & Throttling](#rate-limits--throttling)
6. [Discovery Script](#discovery-script)
7. [Playwright Agent](#playwright-agent)
8. [PostgreSQL Schema](#postgresql-schema)
9. [Error Handling](#error-handling)
10. [Continuous Validation](#continuous-validation)
11. [Deployment](#deployment)
12. [Monitoring](#monitoring)

---

## 🎯 OVERVIEW

### **Objective**
Automate inventory of 50+ Replit applications to establish authoritative system of record containing:
- Purpose and business value
- Technical stack and dependencies
- Current state (functional, buggy, abandoned)
- Unique features (force multipliers)
- Strategic classification (superstar → mothball)

### **Success Criteria**
- ✅ 100% app discovery completion (all 50 repls scanned)
- ✅ Zero data loss during collection
- ✅ <5 hour total runtime (respecting rate limits)
- ✅ Versioned schema preventing data drift
- ✅ Observability dashboard showing progress/health

### **Constraints (Per Architect)**
- ✅ **Credentials Management** - Secure Replit auth handling
- ✅ **Rate Limiting** - Don't overwhelm Replit API, implement backoff
- ✅ **Schema Versioning** - Prevent data drift as apps evolve
- ✅ **Deterministic Targeting** - Ensure all 50 repls are reached
- ✅ **Export Standardization** - Consistent JSON schemas

---

## 🏗️ ARCHITECTURE

```
┌──────────────────────────────────────────────────────────┐
│         PHASE 1: CREDENTIAL SETUP                        │
│  - Store Replit API tokens in environment secrets        │
│  - Configure SSH keys (if needed)                        │
│  - Test authentication with single repl                  │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PHASE 2: DISCOVERY SCRIPT                        │
│  - Bash script runs in each repl                         │
│  - Gathers: directory tree, dependencies, git status     │
│  - Outputs: Standardized JSON                            │
│  - POST to central server                                │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PHASE 3: PLAYWRIGHT AUTOMATION                   │
│  - Login to Replit once                                  │
│  - Iterate through 50 repls (batches of 10)              │
│  - Inject discovery script into each shell               │
│  - Rate limit: Max 5 repls/minute                        │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PHASE 4: CENTRAL INGESTION                       │
│  - PostgreSQL table: replit_apps (versioned schema)      │
│  - Validate JSON against schema                          │
│  - Upsert (INSERT ON CONFLICT UPDATE)                    │
│  - Log successes/failures                                │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PHASE 5: AI ANALYSIS                             │
│  - Claude Architect analyzes each app                    │
│  - Scores: usability, completeness, innovation           │
│  - Categorizes: superstar → mothball                     │
│  - Updates replit_apps table                             │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│         PHASE 6: COMMAND CENTER DASHBOARD                │
│  - React UI displays all 50 apps                         │
│  - Filters, search, drill-down                           │
│  - Actions: mothball, extract, deploy                    │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ PREREQUISITES

### **Development Environment**
- ✅ Node.js 20+ installed
- ✅ Playwright installed (`npm install -D @playwright/test`)
- ✅ Access to Replit account with all 50 apps
- ✅ PostgreSQL database available (Neon or local)

### **Replit Account Requirements**
- ✅ Team/workspace containing all 50 repls
- ✅ Admin-level access (ability to open shells)
- ✅ API key or session cookies for authentication

### **Network Requirements**
- ✅ Stable internet connection (5+ hour runtime)
- ✅ No VPN blocking Replit (can cause auth issues)
- ✅ Minimum 10 Mbps upload (for Playwright screenshots/logs)

---

## 🔐 CREDENTIALS & AUTHENTICATION

### **Option 1: Replit API Key (Preferred)**

**Obtain API Key:**
1. Login to Replit: https://replit.com
2. Navigate to Account Settings → API
3. Generate new token
4. Copy to `.env` file

**Store Securely:**
```bash
# .env (NEVER commit to git)
REPLIT_API_KEY=your_api_key_here
```

**Usage in Playwright:**
```typescript
// discovery-agent.ts
const REPLIT_API_KEY = process.env.REPLIT_API_KEY;

await page.setExtraHTTPHeaders({
  'Authorization': `Bearer ${REPLIT_API_KEY}`
});
```

---

### **Option 2: Session Cookies (Alternative)**

**If API key not available, use session cookies:**

```typescript
// discovery-agent.ts
import { chromium } from '@playwright/test';

const context = await chromium.launchPersistentContext('./playwright-state', {
  headless: false
});

// Manually login to Replit (one-time setup)
const page = await context.newPage();
await page.goto('https://replit.com/login');
// Login manually → cookies are saved in ./playwright-state
```

**Security Note:**
- Store `./playwright-state` in `.gitignore`
- Rotate session every 30 days
- Use read-only tokens if possible

---

### **Credential Rotation Policy**

| Credential Type | Rotation Frequency | Storage Location |
|-----------------|-------------------|------------------|
| Replit API Key | Every 90 days | Environment secrets |
| Session Cookies | Every 30 days | Encrypted file |
| PostgreSQL Password | Every 180 days | Environment secrets |
| SSH Keys (if used) | Every 365 days | `~/.ssh/` |

---

## ⏱️ RATE LIMITS & THROTTLING

### **Replit API Limits (Estimated)**

**Based on typical SaaS rate limits:**
- **Requests per minute:** 100 (unconfirmed, assume conservative)
- **Concurrent connections:** 10
- **Requests per hour:** 1000

**Note:** Replit doesn't publish official limits. Start conservative, monitor for 429 errors.

---

### **Throttling Strategy**

```typescript
// utils/rate-limiter.ts
import pLimit from 'p-limit';
import pRetry from 'p-retry';

const limit = pLimit(5); // Max 5 concurrent repls

export async function discoverWithThrottle(repls: Repl[]) {
  const results = [];
  
  for (const repl of repls) {
    const result = await limit(() => 
      pRetry(
        () => discoverRepl(repl),
        {
          retries: 3,
          onFailedAttempt: (error) => {
            console.log(`Attempt ${error.attemptNumber} failed for ${repl.name}. Retrying...`);
            if (error.message.includes('429')) {
              // Rate limited - exponential backoff
              return new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, error.attemptNumber) * 1000)
              );
            }
          }
        }
      )
    );
    
    results.push(result);
    
    // Delay between each repl
    await new Promise(resolve => setTimeout(resolve, 12000)); // 12 sec = 5 per minute
  }
  
  return results;
}
```

---

### **Execution Timeline (50 Repls)**

**Conservative Estimate:**
```
50 repls × 12 seconds delay = 600 seconds = 10 minutes (waiting time)
50 repls × 30 seconds execution = 1500 seconds = 25 minutes (script runtime)

Total: ~35 minutes for discovery phase
```

**With failures/retries:**
```
Add 50% buffer for errors: 35 min × 1.5 = ~52 minutes total
```

**Realistic expectation:** 1 hour for full discovery run

---

## 📝 DISCOVERY SCRIPT

### **Core Script (Runs in Each Repl)**

```bash
#!/bin/bash
# discovery-script.sh
# Version: 1.0
# Runs inside each Repl to gather metadata

set -e  # Exit on error

REPL_NAME=$(basename "$PWD")
TIMESTAMP=$(date -Iseconds)
OUTPUT_FILE="discovery-output.json"

echo "🔍 Discovery started for: $REPL_NAME at $TIMESTAMP"

# Initialize JSON output
cat > "$OUTPUT_FILE" <<EOF
{
  "repl_name": "$REPL_NAME",
  "timestamp": "$TIMESTAMP",
  "version": "1.0"
}
EOF

# Function to safely add JSON field
add_json_field() {
  local key=$1
  local value=$2
  
  # Use jq to safely merge JSON
  echo $(jq --arg k "$key" --arg v "$value" '.[$k] = $v' "$OUTPUT_FILE") > "$OUTPUT_FILE"
}

# === PURPOSE ===
echo "📄 Extracting purpose..."
if [ -f README.md ]; then
  PURPOSE=$(head -50 README.md | jq -Rs .)
  add_json_field "purpose" "$PURPOSE"
else
  add_json_field "purpose" "No README found"
fi

# === DIRECTORY TREE ===
echo "🌳 Building directory tree..."
TREE=$(tree -L 3 -I 'node_modules|.git|dist|build|__pycache__|.cache' -J | jq -c .)
add_json_field "directory_tree" "$TREE"

# === DEPENDENCIES ===
echo "📦 Extracting dependencies..."
if [ -f package.json ]; then
  DEPS=$(cat package.json | jq -c '{dependencies, devDependencies, scripts}')
  add_json_field "dependencies" "$DEPS"
  add_json_field "framework" "nodejs"
elif [ -f requirements.txt ]; then
  DEPS=$(cat requirements.txt | jq -Rs 'split("\n")')
  add_json_field "dependencies" "$DEPS"
  add_json_field "framework" "python"
elif [ -f Cargo.toml ]; then
  add_json_field "framework" "rust"
  add_json_field "dependencies" "See Cargo.toml"
else
  add_json_field "dependencies" "Unknown"
  add_json_field "framework" "unknown"
fi

# === GIT STATUS ===
echo "🔀 Checking git status..."
if [ -d .git ]; then
  LAST_COMMIT=$(git log --oneline -1 | jq -Rs .)
  LAST_COMMIT_DATE=$(git log -1 --format=%cI | jq -Rs .)
  GIT_STATUS=$(git status --short | jq -Rs .)
  
  add_json_field "last_commit" "$LAST_COMMIT"
  add_json_field "last_commit_date" "$LAST_COMMIT_DATE"
  add_json_field "git_status" "$GIT_STATUS"
  
  # Branch info
  BRANCH=$(git branch --show-current | jq -Rs .)
  add_json_field "git_branch" "$BRANCH"
else
  add_json_field "git_status" "Not a git repository"
fi

# === FILE STATS ===
echo "📊 Calculating file stats..."
FILE_COUNT=$(find . -type f \( ! -path '*/node_modules/*' ! -path '*/.git/*' ! -path '*/dist/*' \) | wc -l)
TOTAL_SIZE=$(du -sk . | cut -f1)

add_json_field "file_count" "$FILE_COUNT"
add_json_field "total_size_kb" "$TOTAL_SIZE"

# === STATE DETECTION ===
echo "🔍 Detecting state..."
if [ -f package.json ] && [ -d node_modules ]; then
  STATE="functional"
elif [ -f requirements.txt ] && [ -d venv ]; then
  STATE="functional"
else
  STATE="incomplete"
fi

add_json_field "state" "$STATE"

# === URL ===
REPL_URL="https://replit.com/@$(whoami)/$REPL_NAME"
add_json_field "url" "$REPL_URL"

echo "✅ Discovery complete for: $REPL_NAME"
echo "📤 Output saved to: $OUTPUT_FILE"

# Pretty print for debugging
jq . "$OUTPUT_FILE"

# POST to central server (if configured)
if [ -n "$CENTRAL_SERVER_URL" ]; then
  echo "📡 Sending to central server..."
  curl -X POST "$CENTRAL_SERVER_URL/api/discovery" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DISCOVERY_TOKEN" \
    -d @"$OUTPUT_FILE" \
    --max-time 30 \
    || echo "⚠️ Failed to send to server"
fi
```

---

### **Installation in Each Repl**

```bash
# Install jq (JSON processor) if not available
if ! command -v jq &> /dev/null; then
  echo "Installing jq..."
  npm install -g jq || pip install jq || echo "Manual jq install required"
fi

# Install tree (directory visualizer)
if ! command -v tree &> /dev/null; then
  echo "Installing tree..."
  npm install -g tree-cli || echo "Manual tree install required"
fi
```

---

## 🤖 PLAYWRIGHT AGENT

### **Setup**

```typescript
// discovery-agent.ts
import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const REPLS = [
  { name: 'velocity-vms', url: 'https://replit.com/@youruser/velocity-vms' },
  { name: 'ats-system', url: 'https://replit.com/@youruser/ats-system' },
  // ... 48 more
];

const CENTRAL_SERVER_URL = process.env.CENTRAL_SERVER_URL || 'http://localhost:3000';
const DISCOVERY_TOKEN = process.env.DISCOVERY_TOKEN;

async function main() {
  console.log('🚀 Starting discovery agent...');
  console.log(`📊 Total repls to scan: ${REPLS.length}`);
  
  const browser = await chromium.launch({ 
    headless: false, // Set true for production
    slowMo: 100 // Slow down for visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Login to Replit (one-time)
  console.log('🔐 Logging into Replit...');
  await loginToReplit(page);
  
  // Wait for auth to settle
  await page.waitForTimeout(3000);
  
  // Process repls with rate limiting
  const results = await discoverAllRepls(page, REPLS);
  
  console.log('\n✅ Discovery complete!');
  console.log(`📊 Success: ${results.filter(r => r.success).length}/${REPLS.length}`);
  console.log(`❌ Failures: ${results.filter(r => !r.success).length}/${REPLS.length}`);
  
  await browser.close();
}

async function loginToReplit(page: Page) {
  await page.goto('https://replit.com/login');
  
  // Check if already logged in
  if (await page.locator('[data-testid="user-menu"]').isVisible()) {
    console.log('✅ Already logged in');
    return;
  }
  
  // Manual login (pause for user to login)
  console.log('⏸️ Please login manually...');
  await page.pause(); // Remove in production, use programmatic login
}

async function discoverAllRepls(page: Page, repls: Repl[]) {
  const results = [];
  
  for (let i = 0; i < repls.length; i++) {
    const repl = repls[i];
    console.log(`\n[${i + 1}/${repls.length}] Processing: ${repl.name}`);
    
    try {
      const result = await discoverRepl(page, repl);
      results.push({ ...result, success: true });
    } catch (error) {
      console.error(`❌ Failed to discover ${repl.name}:`, error.message);
      results.push({ repl: repl.name, success: false, error: error.message });
    }
    
    // Rate limit: 12 seconds between repls (5 per minute)
    if (i < repls.length - 1) {
      console.log('⏳ Waiting 12 seconds (rate limit)...');
      await page.waitForTimeout(12000);
    }
  }
  
  return results;
}

async function discoverRepl(page: Page, repl: Repl) {
  console.log(`📍 Navigating to: ${repl.url}`);
  await page.goto(repl.url, { waitUntil: 'networkidle', timeout: 60000 });
  
  // Wait for shell to be available
  console.log('🔍 Looking for shell...');
  const shellTab = page.locator('[data-testid="shell-tab"]');
  
  if (await shellTab.isVisible()) {
    await shellTab.click();
  } else {
    // Open shell via menu
    await page.locator('[data-testid="tools-menu"]').click();
    await page.locator('text=Shell').click();
  }
  
  await page.waitForSelector('[data-testid="shell-input"]', { timeout: 30000 });
  console.log('✅ Shell ready');
  
  // Upload discovery script
  console.log('📤 Uploading discovery script...');
  const scriptContent = await fs.readFile('./discovery-script.sh', 'utf-8');
  
  await page.locator('[data-testid="shell-input"]').fill('cat > discovery-script.sh << EOF');
  await page.keyboard.press('Enter');
  await page.keyboard.type(scriptContent);
  await page.keyboard.type('\nEOF');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  
  // Make executable
  await page.locator('[data-testid="shell-input"]').fill('chmod +x discovery-script.sh');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  
  // Run discovery script
  console.log('🏃 Running discovery script...');
  await page.locator('[data-testid="shell-input"]').fill(
    `CENTRAL_SERVER_URL="${CENTRAL_SERVER_URL}" DISCOVERY_TOKEN="${DISCOVERY_TOKEN}" bash discovery-script.sh`
  );
  await page.keyboard.press('Enter');
  
  // Wait for completion (look for "Discovery complete" message)
  await page.waitForSelector('text=Discovery complete', { timeout: 120000 });
  console.log('✅ Discovery script finished');
  
  // Download output file
  const output = await page.locator('[data-testid="shell-output"]').textContent();
  const jsonMatch = output.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    const discoveryData = JSON.parse(jsonMatch[0]);
    
    // POST to central server
    await fetch(`${CENTRAL_SERVER_URL}/api/discovery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DISCOVERY_TOKEN}`
      },
      body: JSON.stringify(discoveryData)
    });
    
    console.log('✅ Data sent to central server');
    return discoveryData;
  } else {
    throw new Error('Failed to parse discovery output');
  }
}

main().catch(console.error);
```

---

## 🗄️ POSTGRESQL SCHEMA

### **Versioned Schema Design**

```typescript
// shared/schema-replit-apps.ts
import { pgTable, serial, varchar, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const replitApps = pgTable('replit_apps', {
  // Primary Key
  id: serial('id').primaryKey(),
  
  // Identifiers
  replId: varchar('repl_id', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  url: varchar('url', { length: 500 }),
  
  // Purpose & Context
  purpose: text('purpose'),
  category: varchar('category', { length: 100 }), // VMS, ATS, ITAD, Research, Tools
  industry: varchar('industry', { length: 100 }),
  
  // Technical Details
  framework: varchar('framework', { length: 100 }), // React, Python, Node, Rust
  dependencies: jsonb('dependencies'), // Parsed from package.json/requirements.txt
  directoryTree: jsonb('directory_tree'), // Changed to JSONB for structured queries
  fileCount: integer('file_count'),
  totalSizeKb: integer('total_size_kb'),
  
  // State & Status
  state: varchar('state', { length: 50 }), // functional, buggy, abandoned, incomplete, complete
  lastCommit: varchar('last_commit', { length: 500 }),
  lastCommitDate: timestamp('last_commit_date'),
  gitStatus: text('git_status'),
  gitBranch: varchar('git_branch', { length: 100 }),
  
  // AI Analysis Results (populated in Phase 5)
  usabilityScore: integer('usability_score').default(0), // 0-100
  completenessScore: integer('completeness_score').default(0),
  innovationScore: integer('innovation_score').default(0),
  profitabilityScore: integer('profitability_score').default(0),
  estimatedHoursToComplete: integer('estimated_hours_to_complete'),
  uniqueFeatures: jsonb('unique_features'), // Array of force multipliers
  
  // Strategic Classification (populated in Phase 5)
  priorityTier: varchar('priority_tier', { length: 50 }), // superstar, important, maybe, mothball
  tags: jsonb('tags'), // Searchable keywords
  notes: text('notes'),
  
  // Schema Versioning (CRITICAL for preventing data drift)
  schemaVersion: varchar('schema_version', { length: 10 }).default('1.0'),
  
  // Timestamps
  discoveredAt: timestamp('discovered_at').defaultNow(),
  lastScannedAt: timestamp('last_scanned_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Indexes for performance
export const replitAppsIndexes = {
  byName: 'replit_apps_name_idx',
  byPriorityTier: 'replit_apps_priority_tier_idx',
  byFramework: 'replit_apps_framework_idx',
  byState: 'replit_apps_state_idx',
  byLastScanned: 'replit_apps_last_scanned_idx',
};
```

---

### **Migration to v2.0 (Example)**

```sql
-- When schema evolves, add version column
ALTER TABLE replit_apps ADD COLUMN IF NOT EXISTS schema_version VARCHAR(10) DEFAULT '1.0';

-- Example: v2.0 adds new fields
-- shared/schema-replit-apps-v2.ts
export const replitAppsV2 = pgTable('replit_apps', {
  // ... all v1 fields ...
  
  // New in v2.0
  dockerSupport: boolean('docker_support').default(false),
  cicdConfigured: boolean('cicd_configured').default(false),
  testCoverage: integer('test_coverage'), // 0-100
  
  schemaVersion: varchar('schema_version', { length: 10 }).default('2.0'),
});

-- Drizzle will handle ALTER TABLE safely with `npm run db:push`
```

---

### **Ingestion API Endpoint**

```javascript
// server/routes/discovery.cjs
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Middleware to validate discovery token
function validateDiscoveryToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== process.env.DISCOVERY_TOKEN) {
    return res.status(401).json({ error: 'Invalid discovery token' });
  }
  
  next();
}

router.post('/discovery', validateDiscoveryToken, async (req, res) => {
  const data = req.body;
  
  try {
    // Validate schema version
    const schemaVersion = data.version || '1.0';
    if (schemaVersion !== '1.0') {
      return res.status(400).json({ 
        error: 'Unsupported schema version',
        expected: '1.0',
        received: schemaVersion
      });
    }
    
    // UPSERT (insert or update if exists)
    const result = await pool.query(`
      INSERT INTO replit_apps (
        repl_id, name, url, purpose, framework, dependencies,
        directory_tree, file_count, total_size_kb, state,
        last_commit, last_commit_date, git_status, git_branch,
        schema_version, last_scanned_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      ON CONFLICT (repl_id) 
      DO UPDATE SET
        name = EXCLUDED.name,
        purpose = EXCLUDED.purpose,
        framework = EXCLUDED.framework,
        dependencies = EXCLUDED.dependencies,
        directory_tree = EXCLUDED.directory_tree,
        file_count = EXCLUDED.file_count,
        total_size_kb = EXCLUDED.total_size_kb,
        state = EXCLUDED.state,
        last_commit = EXCLUDED.last_commit,
        last_commit_date = EXCLUDED.last_commit_date,
        git_status = EXCLUDED.git_status,
        git_branch = EXCLUDED.git_branch,
        last_scanned_at = NOW(),
        updated_at = NOW()
      RETURNING id
    `, [
      data.repl_name, // Use as repl_id
      data.repl_name,
      data.url,
      data.purpose,
      data.framework,
      JSON.stringify(data.dependencies),
      JSON.stringify(data.directory_tree),
      parseInt(data.file_count) || 0,
      parseInt(data.total_size_kb) || 0,
      data.state,
      data.last_commit,
      data.last_commit_date,
      data.git_status,
      data.git_branch,
      schemaVersion
    ]);
    
    console.log(`✅ Ingested data for: ${data.repl_name} (id: ${result.rows[0].id})`);
    
    res.json({ 
      success: true, 
      id: result.rows[0].id,
      message: 'Discovery data ingested successfully'
    });
  } catch (error) {
    console.error('❌ Ingestion error:', error);
    res.status(500).json({ 
      error: 'Failed to ingest discovery data',
      details: error.message
    });
  }
});

module.exports = router;
```

---

## 🛡️ ERROR HANDLING

### **Retry Strategy (Per Architect)**

```typescript
// utils/retry.ts
import pRetry from 'p-retry';

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options = {
    retries: 3,
    minTimeout: 1000,
    maxTimeout: 10000,
  }
): Promise<T> {
  return pRetry(fn, {
    ...options,
    onFailedAttempt: (error) => {
      console.log(
        `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
      );
      
      // Exponential backoff for rate limits
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        const backoff = Math.min(
          options.maxTimeout,
          Math.pow(2, error.attemptNumber) * 1000
        );
        console.log(`⏳ Rate limited. Waiting ${backoff}ms before retry...`);
        return new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  });
}
```

---

### **Error Categories**

| Error Type | HTTP Code | Action | Retry? |
|------------|-----------|--------|--------|
| Rate Limit | 429 | Exponential backoff | ✅ Yes (3x) |
| Unauthorized | 401 | Refresh token | ✅ Yes (1x) |
| Not Found | 404 | Skip repl, log warning | ❌ No |
| Server Error | 500, 502, 503 | Retry with backoff | ✅ Yes (3x) |
| Network Timeout | - | Retry immediately | ✅ Yes (2x) |
| Parse Error | - | Log raw output, skip | ❌ No |

---

### **Logging Strategy**

```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'discovery-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'discovery-combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage
logger.info('Starting discovery', { repl: 'velocity-vms' });
logger.error('Discovery failed', { repl: 'ats-system', error: error.message });
```

---

## 🔄 CONTINUOUS VALIDATION

### **Post-Ingestion Validation**

```typescript
// server/services/validation.ts
export async function validateDiscoveryData(replId: string) {
  const result = await pool.query(
    'SELECT * FROM replit_apps WHERE repl_id = $1',
    [replId]
  );
  
  const app = result.rows[0];
  const issues = [];
  
  // Check for required fields
  if (!app.purpose || app.purpose === 'No README found') {
    issues.push('Missing purpose/README');
  }
  
  if (!app.dependencies || app.dependencies === 'Unknown') {
    issues.push('Unknown dependencies');
  }
  
  if (!app.last_commit) {
    issues.push('No git history');
  }
  
  if (app.file_count === 0) {
    issues.push('Empty project');
  }
  
  // Log validation issues
  if (issues.length > 0) {
    await pool.query(
      `UPDATE replit_apps 
       SET notes = $1 
       WHERE repl_id = $2`,
      [`Validation issues: ${issues.join(', ')}`, replId]
    );
  }
  
  return { valid: issues.length === 0, issues };
}
```

---

### **Health Dashboard**

```typescript
// src/pages/super-admin/discovery-health.tsx
export function DiscoveryHealthDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['discovery-stats'],
    queryFn: () => fetch('/api/admin/discovery/stats').then(r => r.json())
  });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Discovery Health</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>Total Apps</CardHeader>
          <CardContent className="text-3xl font-bold">{stats?.total}</CardContent>
        </Card>
        
        <Card>
          <CardHeader>Last Scanned < 7 days</CardHeader>
          <CardContent className="text-3xl font-bold text-green-500">
            {stats?.recentlyScanned}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Missing Data</CardHeader>
          <CardContent className="text-3xl font-bold text-yellow-500">
            {stats?.missingData}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>Failed Scans</CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">
            {stats?.failed}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🚀 DEPLOYMENT

### **Step 1: Prepare Environment**

```bash
# Install dependencies
npm install @playwright/test p-limit p-retry winston

# Install Playwright browsers
npx playwright install chromium

# Create discovery token
openssl rand -hex 32 > .discovery-token
export DISCOVERY_TOKEN=$(cat .discovery-token)

# Configure central server URL
export CENTRAL_SERVER_URL="https://velocity.yourserver.com"
```

---

### **Step 2: Test Single Repl**

```bash
# Run discovery on one repl first
node discovery-agent.ts --repl velocity-vms --dry-run

# Verify output
cat discovery-output.json | jq .

# Test ingestion endpoint
curl -X POST $CENTRAL_SERVER_URL/api/discovery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DISCOVERY_TOKEN" \
  -d @discovery-output.json
```

---

### **Step 3: Full Scan (Batched)**

```bash
# Process in batches of 10
node discovery-agent.ts --batch-size 10

# Monitor progress
tail -f discovery-combined.log
```

---

### **Step 4: Schedule Recurring Scans**

```bash
# Cron job: Scan all repls weekly
0 2 * * 0 cd /path/to/project && node discovery-agent.ts >> discovery-cron.log 2>&1
```

---

## 📊 MONITORING

### **Key Metrics**

```typescript
// server/routes/admin/discovery-stats.cjs
router.get('/discovery/stats', authMiddleware, async (req, res) => {
  const stats = await pool.query(`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE last_scanned_at > NOW() - INTERVAL '7 days') as recently_scanned,
      COUNT(*) FILTER (WHERE purpose IS NULL OR purpose = 'No README found') as missing_data,
      COUNT(*) FILTER (WHERE state = 'incomplete') as incomplete,
      AVG(file_count) as avg_file_count,
      SUM(total_size_kb) / 1024 as total_size_mb
    FROM replit_apps
  `);
  
  res.json(stats.rows[0]);
});
```

---

### **Alerts**

```typescript
// server/services/alerts.ts
export async function checkDiscoveryHealth() {
  const { rows } = await pool.query(`
    SELECT COUNT(*) as stale_count
    FROM replit_apps
    WHERE last_scanned_at < NOW() - INTERVAL '30 days'
  `);
  
  if (rows[0].stale_count > 10) {
    await sendAlert({
      severity: 'WARNING',
      message: `${rows[0].stale_count} repls have not been scanned in 30+ days`,
      action: 'Run discovery agent'
    });
  }
}

// Run daily
setInterval(checkDiscoveryHealth, 86400000); // 24 hours
```

---

## ✅ CHECKLIST

### **Before Running Discovery**
- [ ] Replit credentials configured (`REPLIT_API_KEY` or session cookies)
- [ ] PostgreSQL database available and `replit_apps` table created
- [ ] Discovery token generated (`DISCOVERY_TOKEN`)
- [ ] Central server URL configured
- [ ] Playwright installed and browsers downloaded
- [ ] Rate limiting configured (max 5 repls/minute)
- [ ] Tested on single repl successfully

### **During Discovery**
- [ ] Monitor logs for errors (`tail -f discovery-combined.log`)
- [ ] Check rate limit compliance (no 429 errors)
- [ ] Verify data ingestion in PostgreSQL
- [ ] Track progress (X/50 repls completed)

### **After Discovery**
- [ ] Run validation on all ingested data
- [ ] Review apps with missing data
- [ ] Categorize apps into 4 tiers (Superstar → Mothball)
- [ ] Run AI analysis (Claude Architect scoring)
- [ ] Build Command Center dashboard
- [ ] Schedule recurring scans (weekly cron job)

---

## 🔗 REFERENCES

**Tools:**
- Playwright: https://playwright.dev/
- Drizzle ORM: https://orm.drizzle.team/
- p-retry: https://github.com/sindresorhus/p-retry
- Winston: https://github.com/winstonjs/winston

**Replit Docs:**
- Workflows: https://docs.replit.com/programming-ide/workspace-features/workflows
- API: https://replit.com/api (unofficial)

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 16, 2025 | Initial runbook with Playwright agent, rate limiting, schema versioning |

---

**End of Discovery Runbook**
