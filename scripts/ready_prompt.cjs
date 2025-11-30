#!/usr/bin/env node

/**
 * Ready Prompt - Pre-Message Checkpoint
 * 
 * Displays checklist before claiming "ready"
 * Forces conscious decision and intention reset
 */

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

console.log('');
log('━'.repeat(70), 'yellow');
log('⚠️  READY PROTOCOL VERIFICATION', 'yellow');
log('━'.repeat(70), 'yellow');
console.log('');
log('Before claiming "ready", verify ALL items:', 'bold');
console.log('');

const checklist = [
  { item: '□ LSP diagnostics clean (no errors)', desc: 'Run: npm run check:lsp' },
  { item: '□ GUI tested with screenshot tool', desc: 'Capture: evidence/screenshots/' },
  { item: '□ Browser console checked (zero errors)', desc: 'Save: evidence/logs/console.log' },
  { item: '□ Network tab verified (successful calls)', desc: 'Check: API response status codes' },
  { item: '□ End-to-end user flow tested', desc: 'Manual testing required' },
  { item: '□ Architect review completed', desc: 'Call architect with git diff' },
  { item: '□ Evidence file created', desc: 'evidence/ready-[feature]-[date].yml' },
  { item: '□ Ready gate passed', desc: 'Run: npm run ready:gate' },
];

checklist.forEach(({ item, desc }) => {
  log(item, 'yellow');
  log(`   ${desc}`, 'blue');
  console.log('');
});

log('━'.repeat(70), 'yellow');
log('Evidence Template:', 'bold');
log('━'.repeat(70), 'yellow');
console.log('');
log('feature: [your-feature-name]', 'green');
log('date: [ISO-8601-timestamp]', 'green');
log('screenshots:', 'green');
log('  - evidence/screenshots/[name].png', 'green');
log('console_logs:', 'green');
log('  - evidence/logs/console.log', 'green');
log('tests:', 'green');
log('  - evidence/tests/results.log', 'green');
log('architect_review:', 'green');
log('  status: approved', 'green');
log('checklist_items:', 'green');
log('  - item: "LSP clean"', 'green');
log('    status: passed', 'green');
console.log('');

log('━'.repeat(70), 'yellow');
log('Next Steps:', 'bold');
log('━'.repeat(70), 'yellow');
console.log('');
log('1. Complete all checklist items', 'blue');
log('2. Create evidence file', 'blue');
log('3. Run: npm run ready:gate', 'blue');
log('4. If gate passes → claim "ready"', 'blue');
log('5. If gate fails → fix issues and retry', 'blue');
console.log('');
log('━'.repeat(70), 'yellow');
console.log('');
