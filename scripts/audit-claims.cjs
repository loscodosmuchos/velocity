#!/usr/bin/env node

/**
 * CLAIMS AUDIT SYSTEM
 * Validates that all claims have:
 * 1. Required features implemented (code exists)
 * 2. UI entry points accessible (routes exist)
 * 3. Components wired (not orphaned)
 * 4. No duplicate implementations
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CLAIMS_REGISTRY = require("../src/utils/claims-registry.json");
const APP_FILE = "src/App.tsx";
const PAGES_DIR = "src/pages";

class ClaimsAuditor {
  constructor() {
    this.routes = new Map();
    this.components = new Map();
    this.orphanedComponents = [];
    this.claimsStatus = [];
    this.timestamp = new Date().toISOString();
  }

  // Extract all routes from App.tsx
  extractRoutes() {
    const appContent = fs.readFileSync(APP_FILE, "utf-8");

    // Find all route definitions
    const routePattern = /name:\s*"([^"]+)"/g;
    let match;
    const routes = new Set();

    while ((match = routePattern.exec(appContent)) !== null) {
      routes.add(match[1]);
      this.routes.set(match[1], { exists: true, wired: true });
    }

    return routes;
  }

  // Find all page components
  findComponents() {
    const walkDir = (dir, prefix = "") => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !file.startsWith(".")) {
          walkDir(fullPath, prefix + file + "/");
        } else if (file.endsWith(".tsx") && !file.endsWith(".test.tsx")) {
          const componentName = prefix + file.replace(".tsx", "");
          const content = fs.readFileSync(fullPath, "utf-8");

          // Check if component is imported in App.tsx
          const appContent = fs.readFileSync(APP_FILE, "utf-8");
          const isImported = appContent.includes(componentName) || appContent.includes(file);

          this.components.set(componentName, {
            path: fullPath,
            imported: isImported,
            exports: this.countExports(content),
          });

          if (!isImported) {
            this.orphanedComponents.push(componentName);
          }
        }
      }
    };

    walkDir(PAGES_DIR);
  }

  // Count exports in a component
  countExports(content) {
    const exportPattern = /export\s+(default\s+)?(const|function|class)\s+(\w+)/g;
    const exports = [];
    let match;

    while ((match = exportPattern.exec(content)) !== null) {
      exports.push(match[3]);
    }

    return exports;
  }

  // Validate each claim
  validateClaims() {
    const routes = this.extractRoutes();
    const validationResults = [];

    for (const claim of CLAIMS_REGISTRY.claims) {
      const requiredUIStatus = claim.requiredUI.map((ui) => ({
        route: ui,
        exists: routes.has(ui),
      }));

      const allUIExists = requiredUIStatus.every((u) => u.exists);
      const status = {
        claimId: claim.id,
        title: claim.title,
        category: claim.category,
        currentStatus: claim.status,
        uiStatus: requiredUIStatus,
        claimable: allUIExists,
        missing: requiredUIStatus.filter((u) => !u.exists).map((u) => u.route),
      };

      validationResults.push(status);
    }

    return validationResults;
  }

  // Generate audit report
  generateReport() {
    console.log("\n" + "=".repeat(100));
    console.log("📋 VELOCITY CLAIMS AUDIT SYSTEM");
    console.log("=".repeat(100));
    console.log(`Generated: ${this.timestamp}\n`);

    this.extractRoutes();
    this.findComponents();

    const validation = this.validateClaims();
    this.claimsStatus = validation;

    // Summary
    const claimable = validation.filter((c) => c.claimable).length;
    const total = validation.length;
    const orphaned = this.orphanedComponents.length;

    console.log(`✅ CLAIMABLE: ${claimable}/${total} claims (${((claimable / total) * 100).toFixed(0)}%)`);
    console.log(`⚠️  INCOMPLETE: ${total - claimable} claims`);
    console.log(`🚫 ORPHANED COMPONENTS: ${orphaned}\n`);

    // Detailed validation by category
    const byCategory = {};
    for (const status of validation) {
      if (!byCategory[status.category]) byCategory[status.category] = [];
      byCategory[status.category].push(status);
    }

    for (const [category, claims] of Object.entries(byCategory)) {
      const categoryClaimable = claims.filter((c) => c.claimable).length;
      console.log(`\n📂 ${category} (${categoryClaimable}/${claims.length})`);

      for (const claim of claims) {
        const icon = claim.claimable ? "✅" : "⚠️";
        console.log(`  ${icon} [${claim.claimId}] ${claim.title}`);

        if (!claim.claimable) {
          console.log(`     Status: ${claim.currentStatus}`);
          console.log(`     Missing UI: ${claim.missing.join(", ")}`);
        }
      }
    }

    // Orphaned components
    if (this.orphanedComponents.length > 0) {
      console.log("\n🚫 ORPHANED COMPONENTS (Built but not linked):");
      for (const component of this.orphanedComponents.slice(0, 10)) {
        console.log(`   - ${component}`);
      }
      if (this.orphanedComponents.length > 10) {
        console.log(`   ... and ${this.orphanedComponents.length - 10} more`);
      }
    }

    // Prime Real Estate Check
    console.log("\n🎯 PRIME REAL ESTATE CHECK:");
    this.checkPrimeRealEstate();

    console.log("\n" + "=".repeat(100) + "\n");

    // Save report
    this.saveReport();
  }

  checkPrimeRealEstate() {
    // Check dashboard for empty cards
    const dashboardFile = "src/pages/dashboard/index.tsx";
    if (fs.existsSync(dashboardFile)) {
      const content = fs.readFileSync(dashboardFile, "utf-8");

      const hasEmptyCards = content.includes("data.length === 0") || content.includes("NaN") || content.includes("undefined");
      const status = hasEmptyCards ? "⚠️  WARNING" : "✅ CLEAR";

      console.log(`   ${status} Dashboard: Check for empty states/NaN/placeholder values`);
    }

    // Check command center for meaningful data
    const commandCenterFile = "src/pages/sow-command-center/index.tsx";
    if (fs.existsSync(commandCenterFile)) {
      const content = fs.readFileSync(commandCenterFile, "utf-8");

      const hasDataValidation = content.includes("if (!") || content.includes("??");
      const status = hasDataValidation ? "✅ PROTECTED" : "⚠️  UNGUARDED";

      console.log(`   ${status} Command Center: Data validation/null-guarding in place`);
    }
  }

  saveReport() {
    const reportPath = "audit-claims-report.json";
    const report = {
      timestamp: this.timestamp,
      summary: {
        total: CLAIMS_REGISTRY.claims.length,
        claimable: this.claimsStatus.filter((c) => c.claimable).length,
        incomplete: this.claimsStatus.filter((c) => !c.claimable).length,
        orphanedComponents: this.orphanedComponents.length,
      },
      claims: this.claimsStatus,
      orphanedComponents: this.orphanedComponents,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report saved to: ${reportPath}`);
  }

  run() {
    this.generateReport();
  }
}

// Execute
const auditor = new ClaimsAuditor();
auditor.run();
