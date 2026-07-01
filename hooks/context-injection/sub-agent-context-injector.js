/**
 * Sub-Agent Context Injection Hook
 * 
 * Purpose: When Claude internally spawns sub-agents, automatically inject:
 * - User profile context
 * - Project memory context
 * - Relevant workflow history
 * - Agent communication preferences
 * 
 * Result: Sub-agents start with full context, don't require re-explanation
 */

const fs = require('fs');
const path = require('path');

/**
 * Prepare context injection before sub-agent spawn
 * Called when Claude creates internal sub-agents
 */
function prepareSubAgentContext(subAgentId, task, project = null) {
  console.log(`[CONTEXT-INJECT] Preparing context for sub-agent: ${subAgentId}`);
  
  const injectionPackage = {};

  // 1. Load user profile
  try {
    const userProfile = fs.readFileSync(
      path.join(__dirname, '../../memory/user.profile.md'),
      'utf8'
    );
    injectionPackage.userProfile = extractProfileSummary(userProfile);
  } catch (e) {
    console.warn('[CONTEXT-INJECT] User profile not found');
  }

  // 2. Load project memory if specified
  if (project) {
    try {
      const projectMemory = fs.readFileSync(
        path.join(__dirname, `../../memory/projects/${project}.md`),
        'utf8'
      );
      injectionPackage.projectMemory = extractProjectSummary(projectMemory);
    } catch (e) {
      console.warn(`[CONTEXT-INJECT] Project memory not found: ${project}`);
    }
  }

  // 3. Load central CLAUDE.md learnings
  try {
    const claudeMem = fs.readFileSync(
      path.join(__dirname, '../../memory/CLAUDE.md'),
      'utf8'
    );
    injectionPackage.recentLearnings = extractRecentLearnings(claudeMem);
  } catch (e) {
    console.warn('[CONTEXT-INJECT] CLAUDE.md not accessible');
  }

  // 4. Load workflow performance data for this task type
  injectionPackage.workflowContext = selectRelevantWorkflows(task, project);

  // 5. Determine relevant skills based on task
  injectionPackage.recommendedSkills = selectSkillsForTask(task);

  // 6. Format as context injection prompt
  return formatContextInjectionPrompt(injectionPackage, subAgentId, task);
}

/**
 * Extract summary from user profile (avoid bloat)
 */
function extractProfileSummary(profileText) {
  const lines = profileText.split('\n');
  const summary = {
    name: extractField(lines, 'Name'),
    role: extractField(lines, 'Role'),
    focusAreas: extractField(lines, 'Focus Areas'),
    communicationStyle: extractField(lines, 'Preferred Format'),
    priorities: extractField(lines, 'Priority'),
    preferences: {}
  };
  
  return summary;
}

/**
 * Extract project summary
 */
function extractProjectSummary(projectText) {
  const lines = projectText.split('\n');
  return {
    name: extractField(lines, 'Project:'),
    status: extractField(lines, 'Status:'),
    successCriteria: extractField(lines, 'Success Criteria'),
    currentBlockers: extractField(lines, 'Blocked'),
    technicalContext: extractField(lines, 'Tech Stack'),
    keyConstraints: extractField(lines, 'Constraints')
  };
}

/**
 * Extract recent learnings to avoid repetition
 */
function extractRecentLearnings(claudeText, days = 7) {
  const lines = claudeText.split('\n');
  const learnings = [];
  
  for (const line of lines) {
    if (line.includes('Learnings') || line.includes('discovered') || line.includes('learned')) {
      learnings.push(line.trim());
    }
  }
  
  return learnings.slice(0, 10); // Top 10 recent learnings
}

/**
 * Select workflows relevant to this task
 */
function selectRelevantWorkflows(task, project) {
  try {
    const workflowDir = path.join(__dirname, '../../memory/workflows');
    const workflows = fs.readdirSync(workflowDir);
    
    const relevant = workflows.filter(w => 
      task.toLowerCase().includes(w.replace('.md', '')) ||
      (project && w.includes(project))
    );
    
    return relevant.slice(0, 3); // Top 3 relevant workflows
  } catch (e) {
    return [];
  }
}

/**
 * Determine best skills for task type
 */
function selectSkillsForTask(task) {
  const taskKeywords = task.toLowerCase();
  const skillMap = {
    'security': ['security-auditor'],
    'rag': ['rag-architect'],
    'changelog': ['changelog-generator'],
    'design': ['agent-designer'],
    'crm': ['saas-crm-connector'],
    'project': ['saas-pm-connector'],
    'communication': ['saas-communication-connector'],
    'growth': ['growth-manager-persona'],
    'strategy': ['cto-advisor-persona', 'ceo-advisor-persona'],
    'financial': ['cfo-advisor-persona']
  };
  
  const recommended = [];
  for (const [keyword, skills] of Object.entries(skillMap)) {
    if (taskKeywords.includes(keyword)) {
      recommended.push(...skills);
    }
  }
  
  return [...new Set(recommended)].slice(0, 3);
}

/**
 * Format injection as system context
 */
function formatContextInjectionPrompt(injection, subAgentId, task) {
  const prompt = `
# CONTEXT INJECTION FOR SUB-AGENT: ${subAgentId}

## Your Mission
Task: ${task}

## User Context
${injection.userProfile ? `
**User:** ${injection.userProfile.name || 'User'}
**Role:** ${injection.userProfile.role || 'Not specified'}
**Communication Style:** ${injection.userProfile.communicationStyle || 'Clear and concise'}
**Priorities:** ${Array.isArray(injection.userProfile.priorities) ? injection.userProfile.priorities.join(', ') : 'Not specified'}
` : ''}

## Project Context
${injection.projectMemory ? `
**Project:** ${injection.projectMemory.name || 'Not specified'}
**Status:** ${injection.projectMemory.status || 'Unknown'}
**Key Blockers:** ${injection.projectMemory.currentBlockers || 'None known'}
**Constraints:** ${injection.projectMemory.keyConstraints || 'None known'}
` : ''}

## Recent Learnings (To Avoid Re-Discovery)
${injection.recentLearnings.length > 0 ? injection.recentLearnings.map(l => `- ${l}`).join('\n') : '- No recent learnings available'}

## Recommended Skills for This Task
${injection.recommendedSkills.length > 0 ? injection.recommendedSkills.join(', ') : 'Use your judgment'}

## Relevant Workflows
${injection.workflowContext.length > 0 ? injection.workflowContext.join(', ') : 'No specific workflows found'}

---

## Critical Instructions
1. Use the user's communication style above
2. Respect the project constraints
3. Check recent learnings before suggesting anything new
4. Use recommended skills unless better alternatives exist
5. Update CLAUDE.md if you discover new patterns
6. Report back with what worked and why

---
  `;
  
  return {
    contextPrompt: prompt,
    metadata: {
      subAgentId,
      injectedAt: new Date().toISOString(),
      includesUserProfile: !!injection.userProfile,
      includesProjectMemory: !!injection.projectMemory,
      learningsCount: injection.recentLearnings.length,
      recommendedSkillsCount: injection.recommendedSkills.length
    }
  };
}

/**
 * Extract field value (simple parser)
 */
function extractField(lines, fieldName) {
  for (const line of lines) {
    if (line.includes(fieldName)) {
      return line.replace(new RegExp(fieldName + '.*?:'), '').trim();
    }
  }
  return null;
}

/**
 * Track sub-agent execution
 */
function trackSubAgentExecution(subAgentId, task, result, executionTimeMs) {
  const statsFile = path.join(__dirname, '../../tracking/usage-stats.json');
  
  try {
    let stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    
    if (!stats.subAgentExecutions) {
      stats.subAgentExecutions = [];
    }
    
    stats.subAgentExecutions.push({
      subAgentId,
      task,
      success: result.success,
      executionTimeMs,
      contextInjected: true,
      timestamp: new Date().toISOString(),
      lessonsLearned: result.lessonsLearned || []
    });
    
    // Keep last 100 executions
    stats.subAgentExecutions = stats.subAgentExecutions.slice(-100);
    
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch (e) {
    console.error('[CONTEXT-INJECT] Failed to track execution:', e.message);
  }
}

module.exports = {
  prepareSubAgentContext,
  trackSubAgentExecution,
  extractProfileSummary,
  extractProjectSummary,
  selectSkillsForTask
};
