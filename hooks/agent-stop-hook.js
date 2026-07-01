#!/usr/bin/env node
/**
 * Agent Stop Hook - Deterministic Verification
 * Runs when agent stops to verify work completion
 * 
 * Rule #5: Long-running tasks use stop hook for deterministic check
 */

const fs = require('fs');
const path = require('path');

async function agentStopHook(sessionId, agentId, results) {
  try {
    const timestamp = new Date().toISOString();
    
    // Verify work completion
    const verification = {
      sessionId,
      agentId,
      timestamp,
      status: 'completed',
      checks: {
        outputGenerated: !!results.output,
        noErrorsPresent: !results.error,
        memoryUpdated: !!results.memoryUpdated,
        usageTracked: !!results.usageTracked
      }
    };
    
    // All checks must pass
    const allChecksPassed = Object.values(verification.checks).every(check => check === true);
    verification.verified = allChecksPassed;
    
    // Log to CLAUDE.md
    if (allChecksPassed) {
      logStopHookResult(verification);
    } else {
      console.warn('Stop hook verification failed:', verification);
    }
    
    return verification;
    
  } catch (error) {
    console.error('Agent stop hook error:', error);
    return { error: error.message, verified: false };
  }
}

function logStopHookResult(verification) {
  try {
    const claudeMdPath = path.join(__dirname, '../memory/CLAUDE.md');
    let content = fs.readFileSync(claudeMdPath, 'utf8');
    
    // Append to Agent Self-Feedback Log
    const logEntry = `- **${verification.timestamp}**: Session ${verification.sessionId} - Agent ${verification.agentId} - Status: ${verification.verified ? 'VERIFIED' : 'FAILED'}`;
    
    content = content.replace(
      '- **Iteration 1:** [To be populated]',
      logEntry + '\n- **Iteration 1:** [To be populated]'
    );
    
    fs.writeFileSync(claudeMdPath, content, 'utf8');
  } catch (error) {
    console.error('Failed to log stop hook result:', error);
  }
}

module.exports = { agentStopHook };
