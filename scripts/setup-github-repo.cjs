#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');

async function setupRepo() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

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
  const accessToken = data.items?.[0]?.settings?.access_token || data.items?.[0]?.settings?.oauth?.credentials?.access_token;

  const octokit = new Octokit({ auth: accessToken });
  
  // Get authenticated user
  const user = await octokit.rest.users.getAuthenticated();
  console.log(`✅ Authenticated as: ${user.data.login}\n`);
  
  // Check for existing Velocity repo
  const repos = await octokit.rest.repos.listForAuthenticatedUser({
    visibility: 'all',
    per_page: 100,
  });

  const velocityRepo = repos.data.find(r => 
    r.name.toLowerCase().includes('velocity') || 
    r.name.toLowerCase().includes('vms')
  );

  if (velocityRepo) {
    console.log(`✅ Found existing repo: ${velocityRepo.full_name} (${velocityRepo.private ? 'PRIVATE' : 'PUBLIC'})\n`);
    console.log(`GITHUB_OWNER=${user.data.login}`);
    console.log(`GITHUB_REPO=${velocityRepo.name}`);
    return { owner: user.data.login, repo: velocityRepo.name };
  }

  // Create new private repo
  console.log(`📦 Creating new private repo: velocity-vms\n`);
  const newRepo = await octokit.rest.repos.createForAuthenticatedUser({
    name: 'velocity-vms',
    description: 'Velocity Workforce Management System - Enterprise VMS Platform',
    private: true,
    auto_init: true,
  });

  console.log(`✅ Created: ${newRepo.data.full_name} (PRIVATE)\n`);
  console.log(`GITHUB_OWNER=${user.data.login}`);
  console.log(`GITHUB_REPO=${newRepo.data.name}`);
  
  return { owner: user.data.login, repo: newRepo.data.name };
}

setupRepo().catch(console.error);
