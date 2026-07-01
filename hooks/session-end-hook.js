#!/usr/bin/env node
/**
 * Session End Hook
 * Finalizes session, updates CLAUDE.md, and tracks metrics
 */

const fs = require('fs');
const path = require('path');

async function sessionEndHook(sessionId, metrics) {
  try {
    const timestamp = new Date().toISOString();
    
    // Update usage stats
    const usageStatsPath = path.join(__dirname, '../tracking/usage-stats.json');
    const usageStats = JSON.parse(fs.readFileSync(usageStatsPath, 'utf8'));
    
    // Handle both user-managed sessions (1-4) and sub-agent sessions
    const isUserSession = sessionId.match(/^session-[1-4]$/);
    
    if (!usageStats.sessionUsage[`session-${sessionId}`]) {
      usageStats.sessionUsage[`session-${sessionId}`] = {};
    }
    
    usageStats.sessionUsage[`session-${sessionId}`].status = 'completed';
    usageStats.sessionUsage[`session-${sessionId}`].endTime = timestamp;
    usageStats.sessionUsage[`session-${sessionId}`].duration = metrics.duration;
    usageStats.sessionUsage[`session-${sessionId}`].sessionType = isUserSession ? 'user-managed' : 'sub-agent';
    
    // Check if compaction should be triggered (35% threshold)
    const totalUsage = calculateTotalUsage(usageStats);
    if (totalUsage >= 0.35) {
      console.log(`⚠️  Usage threshold reached: ${(totalUsage * 100).toFixed(2)}%`);
      usageStats.compactionTriggered = true;
      usageStats.compactionLog.push({
        timestamp,
        triggerAgent: metrics.agentId,
        triggerSessionType: isUserSession ? 'user-managed' : 'sub-agent',
        usagePercentage: totalUsage * 100,
        sessionId
      });
    }
    
    fs.writeFileSync(usageStatsPath, JSON.stringify(usageStats, null, 2), 'utf8');
    
    console.log(`✓ Session ${sessionId} ended (${isUserSession ? 'user-managed' : 'sub-agent'})`);
    console.log(`  Duration: ${metrics.duration}ms`);
    console.log(`  Total usage: ${(totalUsage * 100).toFixed(2)}%`);
    
    return { sessionId, timestamp, metrics };
    
  } catch (error) {
    console.error('Session end hook error:', error);
    return { error: error.message, sessionId };
  }
}

function calculateTotalUsage(usageStats) {
  const activeSessions = Object.values(usageStats.sessionUsage).filter(s => s.status === 'active');
  const totalUsage = activeSessions.reduce((sum, s) => sum + (s.usagePercentage || 0), 0);
  return Math.min(totalUsage / 100, 1); // Normalize to 0-1
}

module.exports = { sessionEndHook };
