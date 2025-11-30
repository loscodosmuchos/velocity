#!/usr/bin/env node
/**
 * BUG PATTERN ANALYZER
 * When a bug is found:
 * 1. Analyze root cause
 * 2. Rank likelihood of repetition (0-100)
 * 3. Generate grep pattern to find similar bugs
 * 4. Scan codebase for the pattern
 */

const fs = require('fs');
const path = require('path');

// Bug Analysis Framework
const BugAnalyzer = {
  // Likelihood factors that increase repetition chance
  riskFactors: {
    'architectural-pattern': 15, // Using wrong architectural pattern
    'copy-paste': 20, // Bug from copy-paste code
    'type-unsafety': 18, // Type system weakness
    'missing-validation': 22, // Input validation missing
    'async-race': 25, // Async/race condition
    'state-management': 16, // State synchronization issue
    'hardcoded-values': 20, // Hardcoded test data/IDs
    'api-mismatch': 14, // Schema mismatch
    'edge-case': 12, // Edge case not handled
    'performance': 8, // Performance issue
  },

  // Severity multipliers
  severityMultiplier: {
    critical: 1.3,
    high: 1.1,
    medium: 1.0,
    low: 0.8,
  },

  /**
   * Analyze a bug and compute likelihood of repetition
   * Input: {
   *   title: string,
   *   description: string,
   *   rootCause: string,
   *   affectedFiles: string[],
   *   severity: 'critical'|'high'|'medium'|'low'
   *   riskFactorsPresent: string[]
   * }
   */
  analyze: function(bugInfo) {
    let likelihood = 0;

    // Base score from risk factors
    for (const factor of (bugInfo.riskFactorsPresent || [])) {
      likelihood += this.riskFactors[factor] || 0;
    }

    // Number of affected files increases likelihood
    likelihood += (bugInfo.affectedFiles?.length || 0) * 5;

    // Severity multiplier
    const multiplier = this.severityMultiplier[bugInfo.severity || 'medium'] || 1.0;
    likelihood *= multiplier;

    // Cap at 100
    likelihood = Math.min(100, Math.round(likelihood));

    return {
      likelihoodScore: likelihood,
      likelihoodLabel: this.getLikelihoodLabel(likelihood),
      factors: {
        baseRiskFactors: bugInfo.riskFactorsPresent || [],
        fileCount: bugInfo.affectedFiles?.length || 0,
        severity: bugInfo.severity,
        severityMultiplier: multiplier,
      },
    };
  },

  getLikelihoodLabel: function(score) {
    if (score >= 75) return 'VERY LIKELY - Prevent immediately';
    if (score >= 50) return 'LIKELY - Add linting rule';
    if (score >= 25) return 'POSSIBLE - Add test case';
    return 'UNLIKELY - Monitor';
  },

  /**
   * Generate grep pattern to find similar bugs
   * Examples:
   * - If hardcoded IDs: grep for patterns like id:\s*\d{4}
   * - If type mismatch: grep for any/unknown types
   * - If window.reload: grep for reload() calls
   */
  generateGrepPattern: function(bugInfo) {
    const patterns = {
      'hardcoded-mock-ids': /id:\s*\d{4}|invoice-\d{4}|timecard-\d{4}/,
      'window-reload': /window\.location\.reload\(\)|window\.reload\(\)/,
      'page-reload': /location\.reload\(\)|window\.reload\(\)/,
      'any-type': /:\s*any[\s,;]/,
      'type-ignore': /\/\/\s*@ts-ignore/,
      'todo-fixme': /(TODO|FIXME|HACK|XXX):/,
      'console-error': /console\.error/,
      'missing-validation': /UPDATE\s+\w+\s+SET\s+status.*WHERE\s+id\s*=/,
      'state-sync': /useState<string\s*\|\s*number\s*\|\s*null>/,
    };

    // Generate pattern based on bug type
    for (const [key, pattern] of Object.entries(patterns)) {
      for (const factor of (bugInfo.riskFactorsPresent || [])) {
        if (factor.includes(key)) {
          return pattern.source;
        }
      }
    }

    // Default: look for the bug type in code
    return `(${bugInfo.rootCause})|TODO.*${bugInfo.title}`;
  },

  /**
   * Output analysis in console
   */
  printAnalysis: function(bugInfo, analysis) {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          BUG PATTERN ANALYSIS REPORT                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log(`📋 Title: ${bugInfo.title}`);
    console.log(`📝 Description: ${bugInfo.description}`);
    console.log(`🔍 Root Cause: ${bugInfo.rootCause}`);
    console.log(`🔴 Severity: ${bugInfo.severity.toUpperCase()}\n`);

    console.log(`📊 REPETITION LIKELIHOOD: ${analysis.likelihoodScore}/100`);
    console.log(`   ${analysis.likelihoodLabel}\n`);

    console.log('📈 Risk Factors:');
    for (const factor of analysis.factors.baseRiskFactors) {
      console.log(`   ✓ ${factor} (+${this.riskFactors[factor] || 0} points)`);
    }
    console.log(`   ✓ ${analysis.factors.fileCount} files affected (+${analysis.factors.fileCount * 5} points)`);
    console.log(`   ✓ Severity multiplier: ${analysis.factors.severityMultiplier}x\n`);

    console.log('🎯 PREVENTION:');
    if (analysis.likelihoodScore >= 75) {
      console.log('   [CRITICAL] Implement immediately:');
      console.log('   - Add ESLint rule to detect pattern');
      console.log('   - Create automated test case');
      console.log('   - Update code review checklist');
    } else if (analysis.likelihoodScore >= 50) {
      console.log('   [HIGH] Implement soon:');
      console.log('   - Add linting rule');
      console.log('   - Add test case');
    } else {
      console.log('   [MEDIUM] Monitor pattern');
      console.log('   - Add to grep scanning');
    }

    console.log('\n');
  },
};

// Example usage
if (require.main === module) {
  const exampleBug = {
    title: 'Page Reload Instead of State Update',
    description: 'Using window.location.reload() after approval instead of React state management',
    rootCause: 'Architectural pattern misunderstanding - developers using reload as shortcut',
    affectedFiles: ['src/pages/approvals/requests.tsx', 'src/pages/invoices/list.tsx'],
    severity: 'high',
    riskFactorsPresent: ['architectural-pattern', 'copy-paste', 'state-management'],
  };

  const analysis = BugAnalyzer.analyze(exampleBug);
  BugAnalyzer.printAnalysis(exampleBug, analysis);

  const grepPattern = BugAnalyzer.generateGrepPattern(exampleBug);
  console.log(`🔎 GREP PATTERN TO FIND SIMILAR BUGS:`);
  console.log(`   grep -r "${grepPattern}" src/\n`);
}

module.exports = BugAnalyzer;
