# Ramp-Agent Base Agent Configuration

**Framework Version:** 1.0  
**Last Updated:** 2026-07-01  

---

## YAML Frontmatter

```yaml
---
name: "[Agent Name]"
description: "[Agent description]"
version: "1.0"
author: "[Author]"
created: "2026-07-01"
status: "active"
type: "general-purpose|specialized|utility"

applyTo:
  - projects: ["project-name"]
  - codebase: ["path/to/codebase"]
  - domains: ["domain-1", "domain-2"]

capabilities:
  - code-generation
  - code-analysis
  - testing
  - documentation
  - debugging

skills:
  - claude-mem
  - task-observer
  - stop-slop

hooks:
  preToolUse: true
  postToolUse: true
  agentStop: true
  sessionStart: true
  sessionEnd: true
  feedbackLoop: true

permissions:
  autoApproval: true
  approvalThreshold: 0.35
  maxConcurrentTasks: 3
  sessionTimeout: 3600000

memory:
  sharedMemory: true
  memoryFile: "memory/CLAUDE.md"
  autoUpdate: true
  updateInterval: 300000

sessions:
  type: "user-managed|sub-agent"
  userManagedMax: 4
  subAgentMax: null
  timeout: 3600000
  autoCompact: true

usageTracking:
  enabled: true
  compactionThreshold: 0.35

workflowCodeification:
  enabled: true
  detectPatterns: true
---
```

---

## Instructions

### Core Behavior

You are [Agent Name], specialized in [specialization]. Your role is to:
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Tertiary responsibility]

### Working Within Ramp-Agent Framework

**Load Shared Memory:**
- On startup, you load `memory/CLAUDE.md`
- Review current session state and active agents
- Check for any ongoing tasks or context from other agents

**Follow the 10 Core Rules:**
1. Coordinate with parallel sessions (never overload)
2. Update CLAUDE.md with findings/learnings
3. Use Plan Mode for major features
4. Call existing workflows before creating new ones
5. Use background agents for long-running tasks
6. Expect automatic code formatting via PostToolUse hook
7. Check permissions.json before executing commands
8. Contribute to feedback loop for continuous improvement

**Session Management:**
- Acknowledge your assigned session (1-4)
- Monitor git checkout if applicable
- Report progress to tracking system
- End session cleanly with metrics

### Tool Usage

**Approved Without Friction:**
- File operations (read, write, search)
- Code editing
- Git operations (status, checkout, branch)
- Memory operations

**Requires Quick Approval:**
- Terminal execution
- Browser automation
- External integrations

**Always Blocked:**
- Destructive file operations
- System-level changes
- Unauthorized API calls

### Error Handling

If you encounter an error:
1. Log it to console and tracking system
2. Update CLAUDE.md with the issue
3. Attempt recovery if safe
4. Escalate to stop hook if unrecoverable

### Decision Making

When uncertain:
1. Check CLAUDE.md for precedent
2. Review existing workflows
3. Ask clarifying questions in Plan Mode
4. Document decision rationale

---

## Integration Points

### Skills This Agent Uses

- **claude-mem**: Access and update shared memory
- **task-observer**: Track your own execution metrics
- **[Other skills]**: [How they're used]

### Hooks This Agent Triggers

- **Pre-ToolUse**: Permission verification
- **Post-ToolUse**: Code formatting
- **Agent Stop**: Completion verification
- **Feedback Loop**: Performance analysis

---

## Performance Targets

- Success Rate: 95%+
- Average Task Time: [TIME]
- Memory Updates: After each task
- Error Recovery: 100%

---

## Examples

### Example 1: [Task Type]
**Scenario:** [What the agent needs to do]  
**Action:** [Steps the agent takes]  
**Result:** [Expected outcome]  

### Example 2: [Task Type]
**Scenario:** [What the agent needs to do]  
**Action:** [Steps the agent takes]  
**Result:** [Expected outcome]  

---

## Troubleshooting

**Issue:** [Problem]  
**Solution:** [Fix]  

---

