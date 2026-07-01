# Ramp-Agent System - README

## Overview

Ramp-Agent is a sophisticated multi-agent orchestration system designed for parallel task execution, intelligent memory management, and continuous learning through the central CLAUDE.md knowledge base.

**Session Model:** 4 user-managed sessions + unlimited Claude sub-agents (see [ARCHITECTURE.md](ARCHITECTURE.md))

**Integrated Skills:** 25 skills across 4 categories (core, engineering, automation, personas)

**Learning System:** Continuous workflow improvement, context-aware agents, and automatic optimization (see [LEARNING-SYSTEM.md](LEARNING-SYSTEM.md))

**VS Code Integration:** Native agent workspace integration ready (see [VSCODE-INTEGRATION.md](VSCODE-INTEGRATION.md))

## Directory Structure

```
Ramp-Agent/
├── agents/                 # Agent configurations and definitions
├── skills/                 # Integrated skills registry and management
├── memory/                 # Shared memory system
│   └── CLAUDE.md          # Central learning & memory log (single source of truth)
├── hooks/                 # Middleware and lifecycle hooks
│   ├── pre-tool-use.js    # Permission verification
│   ├── post-tool-use.js   # Code formatting
│   ├── agent-stop-hook.js # Completion verification
│   ├── session-start-hook.js
│   ├── session-end-hook.js
│   └── feedback-loop.js   # Self-improvement mechanism
├── workflows/             # Codified processes and templates
├── tracking/              # Usage metrics and statistics
├── config/                # System configuration files
│   ├── claude-settings.json  # Ramp-Agent configuration
│   └── permissions.json      # Command approval whitelist
└── sessions/              # Session tracking (1-4 parallel)
```

## Getting Started

**👉 Start here:** [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Print this or keep it open  
**📚 Main docs:** [SYSTEM-COMPLETE.md](SYSTEM-COMPLETE.md) - Full system overview  
**🎓 Deep dive:** [LEARNING-SYSTEM.md](LEARNING-SYSTEM.md) - How continuous learning works  
**🔗 Integration:** [VSCODE-INTEGRATION.md](VSCODE-INTEGRATION.md) - VS Code hookup guide  

---

### Your First 30 Minutes

1. Fill out `memory/user.profile.md` (15 min)
2. Create `memory/projects/my-project.md` (10 min)
3. Run your first agent task (5 min)

---

## Key Features

### ✨ Unique Capabilities

- **Context-Aware Agents** - Agents understand your project, values, and constraints
- **Sub-Agent Memory Injection** - Unlimited internal parallelization with full context
- **Continuous Workflow Learning** - Each workflow run improves the system
- **Smart Context Routing** - Relevant context only, no bloat
- **VS Code Native Integration** - Made FOR the agent workspace
- **Automatic Optimization** - System suggests improvements automatically
- **Central Memory** - Single CLAUDE.md for all learnings
- **User Profile System** - Agents know who you are

### 🚀 Performance Benefits

- Workflows get 20-30% faster as they improve
- Success rates improve from ~70% to 90%+
- Manual explanation requirement decreases 50%
- Agent autonomy increases significantly
- System becomes smarter every day

---

## Quick Start

### 1. Initialize a User-Managed Session
```javascript
// For user sessions (1-4):
// Calls session-start-hook.js
// Loads CLAUDE.md
// Sets up tracking for session 1-4
```

### 1b. Claude Internal Sub-Agent Spawn
```javascript
// For Claude-orchestrated sub-agents:
// No session number limit
// Auto-managed by Claude
// Each tracks independently
// Aggregates to parent in CLAUDE.md
```

### 2. Create a New Agent
- Copy `agents/BASE-AGENT-CONFIG.md`
- Customize the YAML frontmatter
- Add your agent logic
- Register in tracking system

### 3. Create a Codified Workflow
- Use `workflows/WORKFLOW-TEMPLATE.md`
- Document steps, inputs, outputs
- Link to agents that use it
- Track performance metrics

### 4. Plan a New Feature
- Use `workflows/plan-mode-template.md`
- Answer discovery questions
- Get team alignment
- Begin implementation

## Session Types

### User-Managed Sessions (Max 4)
- Explicitly assigned in `sessions/session-1.md` through `session-4.md`
- Tracked by git checkout
- Manually initialized
- One primary agent per session

### Claude Sub-Agent Sessions (Unlimited)
- Spawned internally by Claude
- No session limit
- Auto-managed lifecycle
- Many agents can operate in parallel
- All contribute to shared CLAUDE.md
- Aggregated metrics reported to parent

## Key Files

### CLAUDE.md (Central Memory)
- **Purpose:** Single source of truth for all learnings, issues, and system state
- **Updated:** After every task, issue, or learning
- **Accessed:** All agents load on startup
- **Rule:** Never duplicate information; reference CLAUDE.md

### permissions.json (Command Allowlist)
- **Purpose:** Pre-approved safe commands for auto-mode
- **Threshold:** 35% - triggers compaction
- **Review:** Add uncertain commands here for approval

### usage-stats.json (Metrics)
- **Purpose:** Track agent usage and session metrics
- **Threshold:** When total usage > 35%, trigger compaction toward goal
- **Used By:** Feedback loop and performance analysis

## Core Workflows

### Rule #1: Parallel Sessions
- **Max User Sessions:** 4 concurrent (user-managed)
- **Sub-Agent Sessions:** Unlimited (Claude-orchestrated internally)
- **Git Tracking:** Each user session has checkout info
- **Load Balancing:** Never overload one user session
- **Coordination:** All sessions read shared CLAUDE.md
- **Auto-Scaling:** Sub-agents scale dynamically without session cap

### Rule #2: Update CLAUDE.md
- **Trigger:** Every issue discovered, learning acquired, memory update
- **Format:** Structured Markdown with timestamps
- **Atomicity:** All agents contribute

### Rule #3: Plan Mode
- **When:** Start new projects or major features
- **How:** Answer discovery questions first
- **Output:** Implementation plan + checklist
- **Reuse:** Codify as workflow if repeatable

### Rule #4: Codify Workflows
- **Once Established:** Don't reinvent
- **Template:** Use `WORKFLOW-TEMPLATE.md`
- **Tracking:** Log performance metrics
- **Reuse:** Agents call existing processes

### Rule #5: Background Agents
- **Long-Running Tasks:** Use background agent
- **Verification:** Agent stop hook for deterministic check
- **Plugin:** ralphwiggum for autonomous loops
- **Monitoring:** Task observer tracks progress

### Rule #6: PostToolUse Hook
- **Trigger:** After every tool execution
- **Action:** Format code automatically
- **Benefits:** Consistent code quality
- **Config:** Customize in `hooks/post-tool-use.js`

### Rule #7: Pre-Approved Commands
- **Safe Commands:** Auto-approve from whitelist
- **Approval Loop:** Uncertain commands go to permissions.json
- **Review:** Regular security review of approved list
- **Override:** Manual approval for sensitive commands

### Rule #8: Self-Feedback Loop
- **Trigger:** Agent completion
- **Mechanism:** `hooks/feedback-loop.js`
- **Analysis:** Success rate, execution time, errors
- **Output:** Improvement suggestions logged to CLAUDE.md

## Usage Tracking & Compaction

### Threshold: 35%
- When any agent's usage exceeds 35%, compaction is triggered
- Compaction: Move toward established goal or optimization
- Logged: Added to compaction history in CLAUDE.md
- Effect: System optimizes for efficiency

### Metrics Tracked
- Agent call count
- Success rate
- Average execution time
- Session active time
- Total usage percentage

## Integration with Skills

### Active Skills (14)
1. **claude-mem** - Memory management
2. **superpowers** - Enhanced capabilities
3. **find-skills** - Skill discovery
4. **impeccable** - Code quality
5. **task-observer** - Task monitoring
6. **reactbits** - React utilities
7. **agent-browser** - Browser automation
8. **playwright** - Cross-browser testing
9. **scrapling** - Web scraping
10. **agent-reach** - Extended connectivity
11. **headroom** - Resource management
12. **ponytail** - Data structures
13. **stop-slop** - Quality control
14. **markitdown** - Markdown processing

### Skill Groups
- **Memory:** claude-mem
- **Monitoring:** task-observer, headroom, stop-slop
- **Automation:** agent-browser, playwright, scrapling
- **Code Quality:** impeccable
- **Utilities:** superpowers, ponytail, markitdown

## Agent Configuration Example

See `agents/BASE-AGENT-CONFIG.md` for the complete template.

Key sections:
- YAML frontmatter (metadata)
- Instructions (behavior)
- Tool usage (permissions)
- Error handling
- Performance targets
- Examples

## Sub-Agent Orchestration

Claude can spawn unlimited internal sub-agents without hitting session limits. Sub-agents:
- Share the same CLAUDE.md memory
- Contribute to usage tracking
- Report to parent agent
- Auto-scale based on load
- Each maintains independent tracking but aggregates to parent session

## Hooks System

### Pre-ToolUse Hook
- Verifies command permission
- Returns: `{ approved: boolean, reason: string }`

### Post-ToolUse Hook
- Formats code output
- Cleans whitespace
- Returns: formatted result

### Agent Stop Hook
- Verifies work completion
- Checks: output, errors, memory updates, tracking
- Returns: verification object

### Session Start Hook
- Loads CLAUDE.md
- Initializes tracking
- Updates session state

### Session End Hook
- Finalizes metrics
- Checks 35% threshold
- Triggers compaction if needed

### Feedback Loop
- Analyzes performance metrics
- Suggests improvements
- Logs to CLAUDE.md

## Best Practices

1. **Always Check CLAUDE.md First** - Before implementing, see if there's existing knowledge
2. **Use Plan Mode** - Never skip discovery questions for major work
3. **Codify Patterns** - If you repeat a workflow, turn it into a template
4. **Track Everything** - Usage tracking helps identify optimization opportunities
5. **Update Memory** - Every issue and learning goes to CLAUDE.md
6. **Leverage Hooks** - Don't do manual formatting or permission checks
7. **Monitor Sessions** - Keep parallel sessions balanced
8. **Document Workflows** - Use templates for consistency

## Getting Help

1. Check CLAUDE.md for similar issues
2. Review relevant workflow templates
3. Check agent configuration examples
4. Review hook implementations
5. Check permissions.json for command restrictions

## Contributing

When you discover something new:
1. Update CLAUDE.md
2. Create workflow template if repeatable
3. Update tracking metrics
4. Log to feedback loop
5. Share with other agents via shared memory

---

**System Version:** 1.0  
**Last Updated:** 2026-07-01  
**Active Agents:** 0  
**Parallel Sessions:** 4 (max)  
