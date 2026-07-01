#!/usr/bin/env node
/**
 * Session Start Hook
 * Initializes session, loads shared memory, and sets up tracking
 * 
 * Rule #1: Track parallel sessions with git checkout info
 * Rule #2: Load CLAUDE.md on startup
 */

const fs = require('fs');
const path = require('path');

async function sessionStartHook(sessionId, agentId, gitCheckout) {
  try {
    const timestamp = new Date().toISOString();
    
    // Determine session type
    const isUserSession = sessionId.match(/^session-[1-4]$/);
    const sessionType = isUserSession ? 'user-managed' : 'sub-agent';
    
    // Load CLAUDE.md (shared memory)
    const claudeMdPath = path.join(__dirname, '../memory/CLAUDE.md');
    const sharedMemory = fs.readFileSync(claudeMdPath, 'utf8');
    
    // Update session tracking
    const usageStatsPath = path.join(__dirname, '../tracking/usage-stats.json');
    const usageStats = JSON.parse(fs.readFileSync(usageStatsPath, 'utf8'));
    
    usageStats.sessionUsage[`session-${sessionId}`] = {
      status: 'active',
      agentAssigned: agentId,
      gitCheckout: gitCheckout || null,
      startTime: timestamp,
      sessionType: sessionType,
      usagePercentage: 0,
      activeTime: 0
    };
    
    fs.writeFileSync(usageStatsPath, JSON.stringify(usageStats, null, 2), 'utf8');
    
    console.log(`✓ Session ${sessionId} started (${sessionType})`);
    console.log(`  Agent: ${agentId}`);
    if (gitCheckout) console.log(`  Git Checkout: ${gitCheckout}`);
    console.log(`  Memory loaded: ${sharedMemory.length} bytes`);
    
    return {
      sessionId,
      sessionType,
      agentId,
      gitCheckout,
      timestamp,
      memoryLoaded: true,
      memorySize: sharedMemory.length
    };
    
  } catch (error) {
    console.error('Session start hook error:', error);
    return { error: error.message, sessionId };
  }
}

module.exports = { sessionStartHook };
