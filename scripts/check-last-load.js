#!/usr/bin/env node

const API_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : 'http://localhost:5000';

const page = process.argv[2] || 'dashboard';

async function checkLastLoad() {
  try {
    console.log(`🔍 Checking last validated load for: ${page}\n`);
    
    const response = await fetch(`${API_URL}/api/tracking/last-load/${page}`);
    const data = await response.json();
    
    if (!data.success) {
      console.log(`❌ ${data.message}`);
      process.exit(1);
    }
    
    console.log(`✅ Last Validated Load:`);
    console.log(`   Page: ${data.page}`);
    console.log(`   Timestamp: ${data.lastValidatedLoad}`);
    console.log(`   Time Ago: ${data.secondsAgo} seconds (${Math.floor(data.secondsAgo / 60)} minutes)`);
    console.log(`   Status: ${data.status === 'recent' ? '🟢 RECENT' : '🟡 STALE'}`);
    console.log(`   User Agent: ${data.userAgent.substring(0, 60)}...`);
    console.log(`   Referer: ${data.referer}`);
    
  } catch (error) {
    console.error(`❌ Failed to check last load: ${error.message}`);
    process.exit(1);
  }
}

checkLastLoad();
