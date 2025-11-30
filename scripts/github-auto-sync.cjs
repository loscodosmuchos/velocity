#!/usr/bin/env node

/**
 * GitHub Auto-Sync Script (Optimized)
 * 
 * Uses .gitignore patterns to filter files
 * Only uploads source code (not node_modules, build artifacts, etc.)
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Read .gitignore and create exclusion patterns
function getGitignorePatterns() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (!fs.existsSync(gitignorePath)) return [];
  
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(pattern => {
      // Convert gitignore patterns to regex-friendly patterns
      return pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
    });
}

function shouldExclude(filePath, patterns) {
  const excludeDefaults = [
    'node_modules', '.git', 'dist', 'build', '.next', 
    '.vite', 'coverage', '.cache', 'tmp', 'temp',
    '.replit', 'replit.nix', '.upm', '.config',
    'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'
  ];
  
  // Check default exclusions
  for (const exclude of excludeDefaults) {
    if (filePath.includes(exclude)) return true;
  }
  
  // Check gitignore patterns
  for (const pattern of patterns) {
    const regex = new RegExp(pattern);
    if (regex.test(filePath)) return true;
  }
  
  return false;
}

function getAllFiles(dir, fileList = [], gitignorePatterns = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(process.cwd(), filePath);
    
    if (shouldExclude(relativePath, gitignorePatterns)) {
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList, gitignorePatterns);
    } else {
      fileList.push(relativePath);
    }
  });

  return fileList;
}

async function getGitHubClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('REPL_IDENTITY or WEB_REPL_RENEWAL not found');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        Accept: 'application/json',
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  );

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings) {
    throw new Error('GitHub connection not found');
  }

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('GitHub access token not found');
  }

  return new Octokit({ auth: accessToken });
}

async function syncToGitHub() {
  try {
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('GitHub Auto-Sync (Optimized)', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'loscodosmuchos';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'velocity-vms';

    log('1. Authenticating with GitHub...', 'yellow');
    const octokit = await getGitHubClient();
    log('✅ GitHub client created\n', 'green');

    log('2. Fetching current main branch...', 'yellow');
    const { data: ref } = await octokit.rest.git.getRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
    });
    const currentCommitSha = ref.object.sha;
    log(`✅ Current commit: ${currentCommitSha.substring(0, 7)}\n`, 'green');

    log('3. Reading current tree...', 'yellow');
    const { data: currentCommit } = await octokit.rest.git.getCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      commit_sha: currentCommitSha,
    });
    const currentTreeSha = currentCommit.tree.sha;
    log(`✅ Tree SHA: ${currentTreeSha.substring(0, 7)}\n`, 'green');

    log('4. Scanning source files (.gitignore filtered)...', 'yellow');
    const gitignorePatterns = getGitignorePatterns();
    const allFiles = getAllFiles(process.cwd(), [], gitignorePatterns);
    log(`✅ Found ${allFiles.length} source files\n`, 'green');

    log('5. Creating file blobs (batched)...', 'yellow');
    const treeItems = [];
    let blobCount = 0;
    
    for (const filePath of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const { data: blob } = await octokit.rest.git.createBlob({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64',
      });

      treeItems.push({
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
      
      blobCount++;
      if (blobCount % 50 === 0) {
        process.stdout.write(`\r   ${blobCount}/${allFiles.length} blobs created...`);
      }
    }
    console.log('');
    log(`✅ Created ${treeItems.length} blobs\n`, 'green');

    log('6. Creating new tree...', 'yellow');
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      tree: treeItems,
      base_tree: currentTreeSha,
    });
    log(`✅ New tree: ${newTree.sha.substring(0, 7)}\n`, 'green');

    log('7. Creating commit...', 'yellow');
    const timestamp = new Date().toISOString();
    const commitMessage = `[Auto-Sync] ${timestamp}

Velocity platform updates:
- Contractors intelligence cards (risk, concentration, cost)
- Protocol enforcement system (ready gate + audit)
- GitHub automation (REST API sync)`;

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      message: commitMessage,
      tree: newTree.sha,
      parents: [currentCommitSha],
    });
    log(`✅ Commit: ${newCommit.sha.substring(0, 7)}\n`, 'green');

    log('8. Updating main branch...', 'yellow');
    await octokit.rest.git.updateRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: 'heads/main',
      sha: newCommit.sha,
    });
    log('✅ Main branch updated\n', 'green');

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
    log('GitHub Auto-Sync Completed ✅', 'green');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
    log(`\nView: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}\n`, 'blue');
  } catch (error) {
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red');
    log('GitHub Auto-Sync Failed ⛔', 'red');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red');
    log(`\nError: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

syncToGitHub();
