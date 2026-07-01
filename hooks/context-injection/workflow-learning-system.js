/**
 * Workflow Learning System
 * 
 * Tracks performance of workflows and suggests optimizations
 * Continuously learns what works best for your specific context
 */

const fs = require('fs');
const path = require('path');

/**
 * Record workflow execution
 */
function recordWorkflowExecution(workflowName, execution) {
  const statsFile = path.join(__dirname, '../../tracking/workflow-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    stats = { workflows: {} };
  }
  
  if (!stats.workflows[workflowName]) {
    stats.workflows[workflowName] = {
      name: workflowName,
      executions: [],
      successRate: 0,
      avgExecutionTime: 0,
      trend: 'stable'
    };
  }
  
  const workflow = stats.workflows[workflowName];
  
  workflow.executions.push({
    timestamp: new Date().toISOString(),
    success: execution.success,
    executionTimeMs: execution.executionTimeMs,
    agent: execution.agent,
    project: execution.project,
    blockers: execution.blockers || [],
    lessonsLearned: execution.lessonsLearned || []
  });
  
  // Keep last 50 executions per workflow
  workflow.executions = workflow.executions.slice(-50);
  
  // Update metrics
  updateWorkflowMetrics(workflow);
  
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  
  return workflow;
}

/**
 * Calculate workflow metrics
 */
function updateWorkflowMetrics(workflow) {
  if (workflow.executions.length === 0) return;
  
  const successful = workflow.executions.filter(e => e.success).length;
  workflow.successRate = (successful / workflow.executions.length * 100).toFixed(1);
  
  const totalTime = workflow.executions.reduce((sum, e) => sum + (e.executionTimeMs || 0), 0);
  workflow.avgExecutionTime = Math.round(totalTime / workflow.executions.length);
  
  // Trend analysis (last 5 vs previous 5)
  const recent = workflow.executions.slice(-5).map(e => e.success ? 1 : 0);
  const previous = workflow.executions.slice(-10, -5).map(e => e.success ? 1 : 0);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const prevAvg = previous.reduce((a, b) => a + b, 0) / (previous.length || 1);
  
  if (recentAvg > prevAvg) workflow.trend = 'improving';
  else if (recentAvg < prevAvg) workflow.trend = 'degrading';
  else workflow.trend = 'stable';
}

/**
 * Get optimization suggestions for workflow
 */
function suggestOptimizations(workflowName) {
  const statsFile = path.join(__dirname, '../../tracking/workflow-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return { suggestions: [], reason: 'Not enough data' };
  }
  
  const workflow = stats.workflows?.[workflowName];
  if (!workflow) {
    return { suggestions: [], reason: 'Workflow not tracked' };
  }
  
  const suggestions = [];
  
  // Suggestion 1: Success rate issue
  if (workflow.successRate < 80) {
    suggestions.push({
      priority: 'high',
      type: 'success-rate',
      current: `${workflow.successRate}%`,
      suggestion: 'Success rate is below 80%. Analyze recent failures for patterns.',
      action: 'Review CLAUDE.md for failure analysis and blockers'
    });
  }
  
  // Suggestion 2: Performance degradation
  if (workflow.trend === 'degrading') {
    const recent = workflow.executions.slice(-5);
    const slowest = Math.max(...recent.map(e => e.executionTimeMs || 0));
    
    suggestions.push({
      priority: 'medium',
      type: 'performance',
      current: `${workflow.avgExecutionTime}ms avg`,
      suggestion: `Performance is degrading. Recent slowest: ${slowest}ms`,
      action: 'Identify bottlenecks and parallelize if possible'
    });
  }
  
  // Suggestion 3: Consistent blockers
  const blockers = {};
  workflow.executions.forEach(e => {
    e.blockers?.forEach(b => {
      blockers[b] = (blockers[b] || 0) + 1;
    });
  });
  
  const recurring = Object.entries(blockers)
    .filter(([_, count]) => count >= 3)
    .map(([blocker, _]) => blocker);
  
  if (recurring.length > 0) {
    suggestions.push({
      priority: 'high',
      type: 'blocker',
      recurring: recurring,
      suggestion: `${recurring.join(', ')} appear in ${recurring.length}+ executions`,
      action: 'Create permanentsolution or document workaround'
    });
  }
  
  // Suggestion 4: Lessons learned
  const lessons = [];
  workflow.executions
    .filter(e => e.lessonsLearned && e.lessonsLearned.length > 0)
    .forEach(e => {
      lessons.push(...e.lessonsLearned);
    });
  
  if (lessons.length > 0) {
    suggestions.push({
      priority: 'medium',
      type: 'learning',
      suggestions: [...new Set(lessons)],
      action: 'Update workflow documentation with these learnings'
    });
  }
  
  return { suggestions, workflowName, totalExecutions: workflow.executions.length };
}

/**
 * Compare workflows to find best performers
 */
function compareWorkflows() {
  const statsFile = path.join(__dirname, '../../tracking/workflow-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return { comparison: [] };
  }
  
  const workflows = Object.values(stats.workflows || {})
    .sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate));
  
  return {
    comparison: workflows,
    topPerformer: workflows[0]?.name,
    needsAttention: workflows.filter(w => w.successRate < 80).map(w => w.name)
  };
}

/**
 * Auto-select best workflow for task
 */
function selectBestWorkflow(taskType, project = null) {
  const statsFile = path.join(__dirname, '../../tracking/workflow-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return null;
  }
  
  const candidates = Object.values(stats.workflows || {})
    .filter(w => w.name.includes(taskType))
    .filter(w => project ? w.executions.some(e => e.project === project) : true)
    .sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate));
  
  return candidates[0]?.name || null;
}

/**
 * Generate workflow optimization report
 */
function generateOptimizationReport() {
  const statsFile = path.join(__dirname, '../../tracking/workflow-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return 'No workflow data available';
  }
  
  const workflows = Object.values(stats.workflows || {});
  if (workflows.length === 0) {
    return 'No workflows tracked yet';
  }
  
  let report = '# Workflow Performance Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n';
  report += `- Total Workflows: ${workflows.length}\n`;
  report += `- Total Executions: ${workflows.reduce((s, w) => s + w.executions.length, 0)}\n`;
  report += `- Avg Success Rate: ${(workflows.reduce((s, w) => s + parseFloat(w.successRate), 0) / workflows.length).toFixed(1)}%\n\n`;
  
  report += '## Top Performers\n';
  workflows.sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate))
    .slice(0, 5)
    .forEach(w => {
      report += `- **${w.name}**: ${w.successRate}% success, ${w.avgExecutionTime}ms avg\n`;
    });
  
  report += '\n## Needs Attention\n';
  workflows.filter(w => w.successRate < 80)
    .forEach(w => {
      report += `- **${w.name}**: ${w.successRate}% success (${w.trend})\n`;
    });
  
  report += '\n## By Trend\n';
  report += `- **Improving:** ${workflows.filter(w => w.trend === 'improving').length}\n`;
  report += `- **Stable:** ${workflows.filter(w => w.trend === 'stable').length}\n`;
  report += `- **Degrading:** ${workflows.filter(w => w.trend === 'degrading').length}\n`;
  
  return report;
}

module.exports = {
  recordWorkflowExecution,
  suggestOptimizations,
  compareWorkflows,
  selectBestWorkflow,
  generateOptimizationReport,
  updateWorkflowMetrics
};
