/**
 * Smart Context Router
 * 
 * Intelligently determines what context is relevant for each task
 * Avoids context bloat while ensuring agents have what they need
 */

const fs = require('fs');
const path = require('path');

/**
 * Route task to determine required context
 */
function routeTaskContext(task, project = null) {
  const context = {
    task,
    project,
    timestamp: new Date().toISOString(),
    components: []
  };
  
  // 1. Analyze task to determine context needs
  const taskAnalysis = analyzeTask(task);
  context.taskType = taskAnalysis.type;
  context.keywords = taskAnalysis.keywords;
  context.estimatedComplexity = taskAnalysis.complexity;
  
  // 2. Determine required context components
  const required = determineRequiredContext(taskAnalysis);
  
  // 3. Load each component with size monitoring
  context.components = loadContextComponents(required, project);
  
  // 4. Prioritize and rank context
  context.prioritizedContext = prioritizeContext(context.components);
  
  // 5. Generate context injection
  context.injectionPrompt = generateContextPrompt(context);
  
  // 6. Log context selection for learning
  logContextSelection(context);
  
  return context;
}

/**
 * Analyze task to understand what context is needed
 */
function analyzeTask(task) {
  const lowerTask = task.toLowerCase();
  
  const analysis = {
    type: null,
    keywords: [],
    complexity: 'low',
    skillHints: []
  };
  
  // Determine task type
  if (lowerTask.includes('security') || lowerTask.includes('vulnerable')) {
    analysis.type = 'security';
    analysis.skillHints = ['security-auditor'];
  } else if (lowerTask.includes('rag') || lowerTask.includes('vector')) {
    analysis.type = 'rag';
    analysis.skillHints = ['rag-architect'];
  } else if (lowerTask.includes('changelog') || lowerTask.includes('release')) {
    analysis.type = 'changelog';
    analysis.skillHints = ['changelog-generator'];
  } else if (lowerTask.includes('agent') || lowerTask.includes('orchestrat')) {
    analysis.type = 'orchestration';
    analysis.skillHints = ['agent-designer'];
  } else if (lowerTask.includes('crm') || lowerTask.includes('customer')) {
    analysis.type = 'crm';
    analysis.skillHints = ['saas-crm-connector'];
  } else if (lowerTask.includes('project') || lowerTask.includes('task')) {
    analysis.type = 'pm';
    analysis.skillHints = ['saas-pm-connector'];
  } else if (lowerTask.includes('slack') || lowerTask.includes('discord') || lowerTask.includes('team')) {
    analysis.type = 'communication';
    analysis.skillHints = ['saas-communication-connector'];
  } else if (lowerTask.includes('strategy') || lowerTask.includes('growth')) {
    analysis.type = 'strategy';
    analysis.skillHints = ['growth-manager-persona', 'cto-advisor-persona', 'ceo-advisor-persona'];
  }
  
  // Extract keywords
  const words = task.split(/\s+/);
  analysis.keywords = words.filter(w => w.length > 4);
  
  // Estimate complexity
  if (task.includes('complex') || task.includes('large-scale') || task.includes('multi')) {
    analysis.complexity = 'high';
  } else if (task.includes('simple') || task.includes('quick')) {
    analysis.complexity = 'low';
  } else {
    analysis.complexity = 'medium';
  }
  
  return analysis;
}

/**
 * Determine what context components are needed
 */
function determineRequiredContext(taskAnalysis) {
  const required = {
    userProfile: true, // Always load
    projectMemory: false,
    recentLearnings: true,
    relatedWorkflows: false,
    skillRecommendations: true,
    previousSolutions: false
  };
  
  // High complexity needs more context
  if (taskAnalysis.complexity === 'high') {
    required.previousSolutions = true;
    required.relatedWorkflows = true;
  }
  
  // Some tasks need more context
  if (['orchestration', 'strategy', 'rag'].includes(taskAnalysis.type)) {
    required.relatedWorkflows = true;
    required.previousSolutions = true;
  }
  
  return required;
}

/**
 * Load context components efficiently
 */
function loadContextComponents(required, project) {
  const components = [];
  
  // 1. User Profile (always)
  if (required.userProfile) {
    try {
      const profile = fs.readFileSync(
        path.join(__dirname, '../../memory/user.profile.md'),
        'utf8'
      );
      components.push({
        type: 'userProfile',
        size: profile.length,
        content: profile
      });
    } catch (e) {
      console.warn('User profile not found');
    }
  }
  
  // 2. Project Memory
  if (required.projectMemory && project) {
    try {
      const projMemory = fs.readFileSync(
        path.join(__dirname, `../../memory/projects/${project}.md`),
        'utf8'
      );
      components.push({
        type: 'projectMemory',
        size: projMemory.length,
        content: projMemory
      });
    } catch (e) {
      console.warn(`Project memory ${project} not found`);
    }
  }
  
  // 3. Recent Learnings
  if (required.recentLearnings) {
    try {
      const claude = fs.readFileSync(
        path.join(__dirname, '../../memory/CLAUDE.md'),
        'utf8'
      );
      const learnings = extractRecentLearnings(claude);
      components.push({
        type: 'recentLearnings',
        size: learnings.join('\n').length,
        content: learnings.join('\n')
      });
    } catch (e) {
      console.warn('CLAUDE.md not accessible');
    }
  }
  
  // 4. Related Workflows
  if (required.relatedWorkflows) {
    try {
      const workflows = findRelatedWorkflows(project);
      components.push({
        type: 'relatedWorkflows',
        size: workflows.join(',').length,
        content: workflows.join(', ')
      });
    } catch (e) {
      console.warn('Workflows not found');
    }
  }
  
  // 5. Skill Recommendations
  if (required.skillRecommendations) {
    try {
      const registry = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../../skills/registry.json'),
          'utf8'
        )
      );
      components.push({
        type: 'skillRecommendations',
        size: JSON.stringify(registry.skills).length,
        content: registry.skills.slice(0, 10)
      });
    } catch (e) {
      console.warn('Skill registry not found');
    }
  }
  
  // 6. Previous Solutions
  if (required.previousSolutions) {
    try {
      const solutions = findPreviousSolutions(project);
      components.push({
        type: 'previousSolutions',
        size: solutions.length,
        content: solutions
      });
    } catch (e) {
      console.warn('Solutions not found');
    }
  }
  
  return components;
}

/**
 * Prioritize context by relevance and size
 */
function prioritizeContext(components) {
  // Size limits
  const maxTotalSize = 50000; // 50KB max context
  let totalSize = 0;
  
  const sorted = components
    .map(c => ({
      ...c,
      priority: getComponentPriority(c.type),
      sizeRatio: c.size / maxTotalSize
    }))
    .sort((a, b) => b.priority - a.priority);
  
  const prioritized = [];
  for (const component of sorted) {
    if (totalSize + component.size <= maxTotalSize) {
      prioritized.push(component);
      totalSize += component.size;
    } else if (component.priority > 80) {
      // Always include high-priority items even if over budget
      prioritized.push(component);
      totalSize += component.size;
    }
  }
  
  return prioritized;
}

/**
 * Generate context injection prompt
 */
function generateContextPrompt(context) {
  let prompt = '# CONTEXT FOR TASK\n\n';
  
  prompt += `**Task:** ${context.task}\n`;
  prompt += `**Type:** ${context.taskType || 'general'}\n`;
  prompt += `**Complexity:** ${context.estimatedComplexity}\n`;
  prompt += `**Timestamp:** ${context.timestamp}\n\n`;
  
  for (const component of context.prioritizedContext) {
    prompt += `## ${component.type}\n`;
    prompt += `${component.content}\n\n`;
  }
  
  return prompt;
}

/**
 * Helper: Extract recent learnings
 */
function extractRecentLearnings(claudeText) {
  const lines = claudeText.split('\n');
  const learnings = [];
  
  for (const line of lines) {
    if (line.includes('Learnings') || line.includes('discovered') || line.includes('learned')) {
      learnings.push(line.trim());
    }
  }
  
  return learnings.slice(0, 10);
}

/**
 * Helper: Find related workflows
 */
function findRelatedWorkflows(project) {
  const workflowDir = path.join(__dirname, '../../memory/workflows');
  
  try {
    const files = fs.readdirSync(workflowDir);
    return files
      .filter(f => project ? f.includes(project) : true)
      .map(f => f.replace('.md', ''))
      .slice(0, 3);
  } catch (e) {
    return [];
  }
}

/**
 * Helper: Find previous solutions
 */
function findPreviousSolutions(project) {
  try {
    const statsFile = path.join(__dirname, '../../tracking/usage-stats.json');
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    
    const solutions = (stats.executions || [])
      .filter(e => e.success && (project ? e.project === project : true))
      .map(e => ({
        skill: e.skillId,
        project: e.project,
        lessonsLearned: e.lessonsLearned
      }))
      .slice(0, 5);
    
    return solutions;
  } catch (e) {
    return [];
  }
}

/**
 * Helper: Get component priority (0-100)
 */
function getComponentPriority(type) {
  const priorities = {
    userProfile: 95,
    projectMemory: 90,
    recentLearnings: 85,
    skillRecommendations: 80,
    relatedWorkflows: 70,
    previousSolutions: 60
  };
  
  return priorities[type] || 50;
}

/**
 * Helper: Log context selection for learning
 */
function logContextSelection(context) {
  const logFile = path.join(__dirname, '../../tracking/context-routing-log.jsonl');
  
  try {
    const entry = JSON.stringify({
      timestamp: context.timestamp,
      taskType: context.taskType,
      complexity: context.estimatedComplexity,
      componentsSelected: context.components.length,
      totalSize: context.components.reduce((s, c) => s + c.size, 0),
      skills: context.components.find(c => c.type === 'skillRecommendations')?.content || []
    });
    
    fs.appendFileSync(logFile, entry + '\n');
  } catch (e) {
    console.warn('Failed to log context selection:', e.message);
  }
}

module.exports = {
  routeTaskContext,
  analyzeTask,
  determineRequiredContext,
  loadContextComponents,
  prioritizeContext,
  generateContextPrompt
};
