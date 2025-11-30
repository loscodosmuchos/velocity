#!/usr/bin/env node

/**
 * Ready Gate - Protocol Enforcement Script
 * 
 * Blocks "ready" claims without evidence.
 * Part of the million-dollar protocol enforcement system.
 * 
 * Usage: npm run ready:gate [evidence-file]
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner(message, type = 'info') {
  const symbols = { pass: '✅', fail: '⛔', warn: '⚠️', info: 'ℹ️' };
  const colorMap = { pass: 'green', fail: 'red', warn: 'yellow', info: 'blue' };
  
  console.log('');
  log('━'.repeat(60), colorMap[type]);
  log(`${symbols[type]}  ${message}`, colorMap[type]);
  log('━'.repeat(60), colorMap[type]);
  console.log('');
}

function findLatestEvidenceFile() {
  const evidenceDir = path.join(process.cwd(), 'evidence');
  
  if (!fs.existsSync(evidenceDir)) {
    return null;
  }
  
  const files = fs.readdirSync(evidenceDir)
    .filter(f => f.startsWith('ready-') && f.endsWith('.yml'))
    .map(f => ({
      name: f,
      path: path.join(evidenceDir, f),
      mtime: fs.statSync(path.join(evidenceDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);
  
  return files[0]?.path || null;
}

function validateEvidence(evidenceFile) {
  banner('READY GATE VALIDATION', 'info');
  
  log(`Evidence File: ${evidenceFile}`, 'blue');
  console.log('');
  
  // Parse YAML
  const content = fs.readFileSync(evidenceFile, 'utf8');
  const evidence = yaml.load(content);
  
  const failures = [];
  const warnings = [];
  
  // Check required fields
  if (!evidence.feature) {
    failures.push('Missing: feature name');
  }
  
  if (!evidence.date) {
    failures.push('Missing: date');
  }
  
  // Check screenshots
  if (!evidence.screenshots || evidence.screenshots.length === 0) {
    failures.push('Missing: screenshots (GUI evidence required)');
  } else {
    log(`✓ Screenshots: ${evidence.screenshots.length} file(s)`, 'green');
    evidence.screenshots.forEach(screenshot => {
      if (!fs.existsSync(screenshot)) {
        warnings.push(`Screenshot not found: ${screenshot}`);
      }
    });
  }
  
  // Check console logs
  if (!evidence.console_logs || evidence.console_logs.length === 0) {
    failures.push('Missing: console logs (browser evidence required)');
  } else {
    log(`✓ Console Logs: ${evidence.console_logs.length} file(s)`, 'green');
    evidence.console_logs.forEach(logFile => {
      if (!fs.existsSync(logFile)) {
        warnings.push(`Log file not found: ${logFile}`);
      }
    });
  }
  
  // Check tests
  if (!evidence.tests || evidence.tests.length === 0) {
    warnings.push('No test results provided (recommended but not required)');
  } else {
    log(`✓ Tests: ${evidence.tests.length} result(s)`, 'green');
  }
  
  // Check workflow status
  if (!evidence.workflow_status) {
    warnings.push('No workflow status provided');
  } else {
    log(`✓ Workflow Status: Documented`, 'green');
  }
  
  // Check architect review
  if (!evidence.architect_review || evidence.architect_review.status !== 'approved') {
    failures.push('Missing: Architect review approval');
  } else {
    log(`✓ Architect Review: APPROVED`, 'green');
  }
  
  // Check checklist items
  if (!evidence.checklist_items || evidence.checklist_items.length === 0) {
    failures.push('Missing: Checklist items verification');
  } else {
    const passedItems = evidence.checklist_items.filter(item => item.status === 'passed').length;
    const totalItems = evidence.checklist_items.length;
    
    if (passedItems === totalItems) {
      log(`✓ Checklist: ${passedItems}/${totalItems} items passed`, 'green');
    } else {
      failures.push(`Checklist incomplete: ${passedItems}/${totalItems} items passed`);
    }
  }
  
  console.log('');
  
  // Show warnings
  if (warnings.length > 0) {
    log('Warnings:', 'yellow');
    warnings.forEach(warning => {
      log(`  ⚠️  ${warning}`, 'yellow');
    });
    console.log('');
  }
  
  // Show failures
  if (failures.length > 0) {
    log('Failures:', 'red');
    failures.forEach(failure => {
      log(`  ⛔ ${failure}`, 'red');
    });
    console.log('');
  }
  
  return { passed: failures.length === 0, failures, warnings, evidence };
}

function updateAuditLog(evidence, gateStatus) {
  const logsDir = path.join(process.cwd(), 'logs', 'protocol');
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const now = new Date();
  const month = now.toISOString().slice(0, 7); // YYYY-MM
  const auditFile = path.join(logsDir, `audit-${month}.md`);
  
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 16);
  const status = gateStatus.passed ? 'READY ✅' : 'BLOCKED ⛔';
  
  const entry = `
### ${timestamp} - ${evidence.feature} - ${status}
- Agent: ${evidence.agent || 'unknown'}
- Evidence: ${evidence.evidence_file || 'N/A'}
- Gate Status: ${gateStatus.passed ? 'PASSED' : 'FAILED'}
- Architect Review: ${evidence.architect_review?.status?.toUpperCase() || 'MISSING'}
- Notes: ${evidence.notes || 'None'}
${gateStatus.failures.length > 0 ? `- Failures: ${gateStatus.failures.join(', ')}` : ''}
`;
  
  fs.appendFileSync(auditFile, entry);
  
  log(`Audit log updated: ${auditFile}`, 'blue');
}

function main() {
  const args = process.argv.slice(2);
  let evidenceFile = args[0];
  
  // If no file specified, find latest
  if (!evidenceFile) {
    evidenceFile = findLatestEvidenceFile();
    
    if (!evidenceFile) {
      banner('READY GATE FAILED', 'fail');
      log('No evidence file found in ./evidence/', 'red');
      log('', 'red');
      log('Create evidence file first:', 'yellow');
      log('  evidence/ready-[feature]-[date].yml', 'yellow');
      console.log('');
      process.exit(1);
    }
    
    log(`Using latest evidence file: ${path.basename(evidenceFile)}`, 'blue');
    console.log('');
  }
  
  // Validate file exists
  if (!fs.existsSync(evidenceFile)) {
    banner('READY GATE FAILED', 'fail');
    log(`Evidence file not found: ${evidenceFile}`, 'red');
    console.log('');
    process.exit(1);
  }
  
  // Validate evidence
  const result = validateEvidence(evidenceFile);
  
  // Update audit log
  result.evidence.evidence_file = evidenceFile;
  updateAuditLog(result.evidence, result);
  
  // Final verdict
  if (result.passed) {
    banner('READY GATE PASSED ✅', 'pass');
    log('All required evidence present.', 'green');
    log('You may claim "ready" status.', 'green');
    console.log('');
    process.exit(0);
  } else {
    banner('READY GATE FAILED ⛔', 'fail');
    log('Cannot claim "ready" - missing required evidence.', 'red');
    log('', 'red');
    log('Fix the failures above and run again.', 'yellow');
    console.log('');
    process.exit(1);
  }
}

main();
