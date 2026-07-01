#!/usr/bin/env node
/**
 * Agent Self-Feedback Loop
 * Provides internal feedback mechanism for continuous improvement
 * 
 * Rule #8: Claude needs a feedback loop for self-improvement
 */

const fs = require('fs');
const path = require('path');

async function feedbackLoop(agentId, iteration, metrics, results) {
  try {
    const timestamp = new Date().toISOString();
    
    // Analyze agent performance
    const feedback = {
      agentId,
      iteration,
      timestamp,
      metrics: {
        successRate: metrics.successRate,
        averageExecutionTime: metrics.averageExecutionTime,
        errorCount: metrics.errorCount,
        taskCompletion: metrics.taskCompletion
      },
      analysis: analyzePerformance(metrics),
      improvements: suggestImprovements(metrics, results)
    };
    
    // Store feedback in CLAUDE.md
    updateFeedbackLog(feedback);
    
    console.log(`✓ Feedback loop executed for ${agentId} (iteration ${iteration})`);
    console.log(`  Success Rate: ${(metrics.successRate * 100).toFixed(2)}%`);
    console.log(`  Suggested Improvements: ${feedback.improvements.length}`);
    
    return feedback;
    
  } catch (error) {
    console.error('Feedback loop error:', error);
    return { error: error.message, agentId };
  }
}

function analyzePerformance(metrics) {
  const analysis = [];
  
  if (metrics.successRate < 0.8) {
    analysis.push('Success rate below 80% - review error patterns');
  }
  
  if (metrics.averageExecutionTime > 30000) {
    analysis.push('Execution time exceeds 30s - consider optimization');
  }
  
  if (metrics.errorCount > 5) {
    analysis.push('High error count - increase robustness');
  }
  
  return analysis;
}

function suggestImprovements(metrics, results) {
  const improvements = [];
  
  if (metrics.errorCount > 0) {
    improvements.push('Add error handling for common failure cases');
  }
  
  if (metrics.averageExecutionTime > 10000) {
    improvements.push('Parallelize independent operations');
  }
  
  if (metrics.taskCompletion < 0.95) {
    improvements.push('Review incomplete task patterns');
  }
  
  return improvements;
}

function updateFeedbackLog(feedback) {
  try {
    const claudeMdPath = path.join(__dirname, '../memory/CLAUDE.md');
    let content = fs.readFileSync(claudeMdPath, 'utf8');
    
    const logEntry = `- **${feedback.timestamp}** (Iteration ${feedback.iteration}): ${feedback.agentId}
  - Success Rate: ${(feedback.metrics.successRate * 100).toFixed(2)}%
  - Analysis: ${feedback.analysis.join('; ')}
  - Improvements: ${feedback.improvements.slice(0, 2).join('; ')}`;
    
    content = content.replace(
      '- **Iteration 1:** [To be populated]',
      logEntry
    );
    
    fs.writeFileSync(claudeMdPath, content, 'utf8');
  } catch (error) {
    console.error('Failed to update feedback log:', error);
  }
}

module.exports = { feedbackLoop };
