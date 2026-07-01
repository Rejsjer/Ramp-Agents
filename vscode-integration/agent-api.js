/**
 * VS Code Agent API Integration
 * 
 * Direct integration with VS Code's agent workflow
 * Enables:
 * - Native skill discovery
 * - Context passing to VS Code agents
 * - Real-time performance monitoring
 * - User preference integration
 * 
 * This module is called by VS Code's agent framework
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

/**
 * Initialize Ramp-Agent with VS Code
 * Called when VS Code agent framework starts
 */
function initializeWithVSCode(vscodeContext) {
  console.log('[VSCODE-INTEGRATION] Initializing Ramp-Agent with VS Code');
  
  return {
    name: 'Ramp-Agent',
    version: '1.0',
    capabilities: {
      skillDiscovery: true,
      contextInjection: true,
      performanceMonitoring: true,
      userProfileAwareness: true,
      parallelExecution: true,
      memoryPersistence: true
    },
    config: loadConfiguration(),
    skillRegistry: loadSkillRegistry(),
    ready: true
  };
}

/**
 * VS Code calls this to discover available skills
 */
function discoverSkills() {
  const registry = loadSkillRegistry();
  
  return registry.skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    capabilities: getSkillCapabilities(skill.id),
    inputSchema: getSkillInputSchema(skill.id),
    outputSchema: getSkillOutputSchema(skill.id),
    estimatedExecutionTime: skill.estimatedTime || 'variable',
    dependencies: skill.dependencies || []
  }));
}

/**
 * VS Code calls this before executing a skill
 * Returns fully contextualized execution plan
 */
function prepareSkillExecution(skillId, userInput, context) {
  console.log(`[VSCODE-INTEGRATION] Preparing execution for skill: ${skillId}`);
  
  const executionPlan = {
    skillId,
    timestamp: new Date().toISOString(),
    context: {},
    recommendations: {},
    warnings: []
  };
  
  // 1. Load user profile
  try {
      const userProfile = fs.readFileSync(
      path.join(ROOT_DIR, 'memory/user.profile.md'),
      'utf8'
    );
    executionPlan.context.userProfile = parseUserProfile(userProfile);
  } catch (e) {
    executionPlan.warnings.push('User profile not found');
  }
  
  // 2. Load project context if available
  if (context?.project) {
    try {
      const projectFile = fs.readFileSync(
        path.join(ROOT_DIR, `memory/projects/${context.project}.md`),
        'utf8'
      );
      executionPlan.context.projectMemory = parseProjectMemory(projectFile);
    } catch (e) {
      executionPlan.warnings.push(`Project ${context.project} not found`);
    }
  }
  
  // 3. Check for related workflows
  executionPlan.context.relatedWorkflows = findRelatedWorkflows(skillId, userInput);
  
  // 4. Load recent learnings
  try {
    const claudeMem = fs.readFileSync(
      path.join(ROOT_DIR, 'memory/CLAUDE.md'),
      'utf8'
    );
    executionPlan.context.recentLearnings = extractLearningsForSkill(skillId, claudeMem);
  } catch (e) {
    executionPlan.warnings.push('CLAUDE.md not accessible');
  }
  
  // 5. Get user communication preferences
  executionPlan.recommendations.communicationStyle = 
    executionPlan.context.userProfile?.communicationStyle || 'clear and concise';
  
  // 6. Suggest optimization if workflow exists
  if (context?.workflow) {
    const workflowSuggestion = getWorkflowOptimizationSuggestion(context.workflow);
    if (workflowSuggestion) {
      executionPlan.recommendations.optimization = workflowSuggestion;
    }
  }
  
  return executionPlan;
}

/**
 * Called after skill execution to record results
 */
function recordSkillExecution(skillId, execution) {
  const statsFile = path.join(ROOT_DIR, 'tracking/usage-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    stats = { executions: [] };
  }
  
  stats.executions = stats.executions || [];
  stats.executions.push({
    skillId,
    timestamp: execution.timestamp,
    success: execution.success,
    executionTimeMs: execution.executionTimeMs,
    project: execution.project,
    agent: execution.agent,
    lessonsLearned: execution.lessonsLearned,
    userFeedback: execution.userFeedback
  });
  
  // Keep last 1000 executions
  stats.executions = stats.executions.slice(-1000);
  
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

/**
 * Get skill performance metrics for VS Code UI
 */
function getSkillMetrics(skillId) {
  const statsFile = path.join(ROOT_DIR, 'tracking/usage-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return null;
  }
  
  const executions = (stats.executions || []).filter(e => e.skillId === skillId);
  if (executions.length === 0) {
    return { executions: 0, metrics: 'No data yet' };
  }
  
  const successful = executions.filter(e => e.success).length;
  const avgTime = Math.round(
    executions.reduce((s, e) => s + (e.executionTimeMs || 0), 0) / executions.length
  );
  
  return {
    totalExecutions: executions.length,
    successRate: ((successful / executions.length) * 100).toFixed(1) + '%',
    avgExecutionTime: avgTime + 'ms',
    trend: calculateTrend(executions),
    recentErrors: executions.filter(e => !e.success).slice(-3)
  };
}

/**
 * List available projects (for project selector)
 */
function listProjects() {
  const projectDir = path.join(ROOT_DIR, 'memory/projects');
  
  try {
    const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.md') && f !== 'PROJECT-TEMPLATE.md');
    
    return files.map(f => {
      const name = f.replace('.md', '');
      try {
        const content = fs.readFileSync(path.join(projectDir, f), 'utf8');
        const status = content.match(/Status:\s*\[([^\]]+)\]/)?.[1] || 'unknown';
        return { name, status };
      } catch (e) {
        return { name, status: 'unknown' };
      }
    });
  } catch (e) {
    return [];
  }
}

/**
 * Get agent status and suggestions
 */
function getAgentRecommendations(currentWorkload) {
  const statsFile = path.join(ROOT_DIR, 'tracking/usage-stats.json');
  
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {
    return { recommendations: [] };
  }
  
  const recommendations = [];
  
  // Check if system is at 35% threshold
  const totalUsage = stats.sessionUsage 
    ? Object.values(stats.sessionUsage).filter(s => s.status === 'active').length / 4
    : 0;
  
  if (totalUsage > 0.35) {
    recommendations.push({
      type: 'optimization',
      priority: 'high',
      message: 'System at optimization threshold. Consider compacting memory.',
      action: 'Review CLAUDE.md for consolidation opportunities'
    });
  }
  
  // Check for degrading workflows
  if (stats.workflows) {
    const degrading = Object.values(stats.workflows)
      .filter(w => w.trend === 'degrading')
      .map(w => w.name);
    
    if (degrading.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `${degrading.length} workflow(s) showing performance degradation`,
        workflows: degrading
      });
    }
  }
  
  return { recommendations, workload: currentWorkload };
}

/**
 * Helper: Parse user profile
 */
function parseUserProfile(profileText) {
  const lines = profileText.split('\n');
  
  return {
    communicationStyle: extractFieldValue(lines, 'Preferred Format'),
    speedVsDetail: extractFieldValue(lines, 'Speed vs Detail'),
    decisionStyle: extractFieldValue(lines, 'Decision Making Style'),
    escalationTrigger: extractFieldValue(lines, 'Escalation Trigger')
  };
}

/**
 * Helper: Parse project memory
 */
function parseProjectMemory(projectText) {
  const lines = projectText.split('\n');
  
  return {
    status: extractFieldValue(lines, 'Status:'),
    blockers: extractFieldValue(lines, 'Blocked'),
    nextSteps: extractFieldValue(lines, 'Next'),
    constraints: extractFieldValue(lines, 'Constraints')
  };
}

/**
 * Helper: Find related workflows
 */
function findRelatedWorkflows(skillId, userInput) {
  const workflowDir = path.join(ROOT_DIR, 'memory/workflows');
  
  try {
    const files = fs.readdirSync(workflowDir);
    return files.filter(f => 
      userInput.toLowerCase().includes(f.replace('.md', '').toLowerCase()) ||
      skillId.includes(f.replace('.md', ''))
    ).slice(0, 3);
  } catch (e) {
    return [];
  }
}

/**
 * Helper: Extract learnings for specific skill
 */
function extractLearningsForSkill(skillId, claudeText) {
  const lines = claudeText.split('\n');
  const learnings = [];
  
  for (const line of lines) {
    if (line.includes(skillId) || line.includes('discovered') || line.includes('learned')) {
      learnings.push(line.trim());
    }
  }
  
  return learnings.slice(0, 5);
}

/**
 * Helper: Get workflow optimization suggestion
 */
function getWorkflowOptimizationSuggestion(workflowName) {
  const statsFile = path.join(ROOT_DIR, 'tracking/workflow-stats.json');
  
  try {
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    const workflow = stats.workflows?.[workflowName];
    
    if (!workflow) return null;
    
    if (workflow.trend === 'degrading') {
      return {
        type: 'performance-degradation',
        suggestion: 'This workflow has been slower recently. Consider parallel execution.',
        avgTime: workflow.avgExecutionTime
      };
    }
    
    if (workflow.successRate < 80) {
      return {
        type: 'success-rate-low',
        suggestion: 'Success rate below 80%. Review recent failures.',
        successRate: workflow.successRate
      };
    }
  } catch (e) {
    return null;
  }
}

/**
 * Helper: Extract field value
 */
function extractFieldValue(lines, fieldName) {
  for (const line of lines) {
    if (line.includes(fieldName)) {
      return line.replace(new RegExp(fieldName + '.*?:'), '').trim();
    }
  }
  return null;
}

/**
 * Helper: Load configuration
 */
function loadConfiguration() {
  try {
    return JSON.parse(
      fs.readFileSync(
        path.join(ROOT_DIR, 'config/claude-settings.json'),
        'utf8'
      )
    );
  } catch (e) {
    return {};
  }
}

/**
 * Helper: Load skill registry
 */
function loadSkillRegistry() {
  try {
    return JSON.parse(
      fs.readFileSync(
          path.join(ROOT_DIR, 'skills/registry.json'),
        'utf8'
      )
    );
  } catch (e) {
    return { skills: [] };
  }
}

/**
 * Helper: Calculate trend
 */
function calculateTrend(executions) {
  if (executions.length < 2) return 'insufficient-data';
  
  const recent = executions.slice(-5).filter(e => e.success).length;
  const previous = executions.slice(-10, -5).filter(e => e.success).length;
  
  if (recent > previous) return 'improving';
  if (recent < previous) return 'degrading';
  return 'stable';
}

/**
 * Helper: Get skill capabilities
 */
function getSkillCapabilities(skillId) {
  const registry = loadSkillRegistry();
  const skill = registry.skills?.find(s => s.id === skillId);
  return skill?.capabilities || [];
}

/**
 * Helper: Get skill input schema
 */
function getSkillInputSchema(skillId) {
  return {
    type: 'object',
    properties: {
      task: { type: 'string', description: 'Task description' },
      context: { type: 'object', description: 'Additional context' }
    }
  };
}

/**
 * Helper: Get skill output schema
 */
function getSkillOutputSchema(skillId) {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      result: { type: 'string' },
      executionTime: { type: 'number' }
    }
  };
}

module.exports = {
  initializeWithVSCode,
  discoverSkills,
  prepareSkillExecution,
  recordSkillExecution,
  getSkillMetrics,
  listProjects,
  getAgentRecommendations
};
