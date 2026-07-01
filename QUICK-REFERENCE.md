# Ramp-Agent: Quick Reference Card

**Print this or keep it open while working**

---

## 🎯 Your First 30 Minutes

```
[1] Fill memory/user.profile.md (15 min)
    - Name, role, communication style
    - Top 3 priorities
    - What works/doesn't work for you

[2] Create memory/projects/my-project.md (10 min)
    - Copy from PROJECT-TEMPLATE.md
    - Why it exists, success criteria
    - Tech stack, constraints

[3] Run first agent task (5 min)
    - "Build X for my-project"
    - Context auto-loads
    - No re-explanation needed
```

---

## 📂 Files at a Glance

### MUST Read (Essential Understanding)
| File | Time | Purpose |
|------|------|---------|
| `SYSTEM-COMPLETE.md` | 5 min | Overview of everything |
| `LEARNING-SYSTEM.md` | 20 min | How learning works |
| `QUICKSTART.md` | 10 min | Getting started |

### SHOULD Read (Helpful Context)
| File | Time | Purpose |
|------|------|---------|
| `VSCODE-INTEGRATION.md` | 15 min | VS Code setup |
| `README.md` | 5 min | System overview |
| `AGENTS.md` | 5 min | Available agents |

### SHOULD Update (Your Usage)
| File | When | Frequency |
|------|------|-----------|
| `memory/user.profile.md` | First, then monthly | Once, then monthly |
| `memory/projects/*.md` | Create per project | Weekly updates |
| `memory/CLAUDE.md` | After learning something | As needed |

### System Manages (Don't Edit)
| File | Purpose |
|------|---------|
| `tracking/usage-stats.json` | Auto-updated metrics |
| `tracking/workflow-stats.json` | Auto-updated performance |
| `hooks/context-injection/*.js` | System infrastructure |
| `config/claude-settings.json` | System config |
| `skills/registry.json` | Skill catalog |

---

## 🔑 Five Core Systems

```
1. USER PROFILE SYSTEM
   Where: memory/user.profile.md
   What: Who you are, your preferences, constraints
   When: Fill out first, update monthly
   Why: Agents understand you without asking

2. PROJECT MEMORY SYSTEM
   Where: memory/projects/
   What: Per-project context (status, blockers, tech)
   When: Create per project, update weekly
   Why: No re-explanation between projects

3. SUB-AGENT CONTEXT INJECTOR
   Where: hooks/context-injection/sub-agent-context-injector.js
   What: Inject context into internal agents
   When: Auto-called by system
   Why: Unlimited parallelization with context

4. WORKFLOW LEARNING SYSTEM
   Where: hooks/context-injection/workflow-learning-system.js
   What: Track success, performance, blockers, lessons
   When: Auto-called after each execution
   Why: Continuous workflow improvement

5. SMART CONTEXT ROUTER
   Where: hooks/context-injection/smart-context-router.js
   What: Route relevant context only
   When: Auto-called before each task
   Why: Avoid context bloat, keep relevance high
```

---

## 🚀 Common Tasks

### Create New Project
```bash
1. cp memory/projects/PROJECT-TEMPLATE.md memory/projects/[name].md
2. Edit: Why it exists, success criteria, tech stack
3. Save
4. Done - now "Build X for [name]" works
```

### Review Workflow Performance
```bash
1. Open tracking/workflow-stats.json
2. Look for:
   - successRate > 90% ✓
   - trend: "improving" ✓
   - avgExecutionTime trending down ✓
3. If issues: Check blockers and optimize
```

### Add Learning to System
```bash
1. Open memory/CLAUDE.md
2. Add:
   - What you learned
   - Why it matters
   - When to use it
3. Save - agents will reference it next time
```

### Check Optimization Suggestions
```bash
1. Review LEARNING-SYSTEM.md section "Using the Learning System"
2. Run suggestOptimizations('workflow-name')
3. Implement suggestions
4. Track results
```

### List Available Skills
```bash
1. Open skills/registry.json
2. See all 25 skills organized by category
3. Or review AGENTS.md for personas
```

### Validate Setup
```bash
npm run validate
# or
node scripts/validate-ramp-agent.js
```

---

## 📊 Success Metrics (Check Weekly)

```
✓ Workflows improving?
  tracking/workflow-stats.json → successRate > 80% & trending up

✓ Context being reused?
  Sub-agents not asking "tell me about your project"

✓ System learning?
  memory/CLAUDE.md growing with learnings

✓ Agent decisions better?
  First-try success increasing

✓ Less re-explanation?
  Agents understand project/constraints automatically
```

---

## 🎓 Learning Hierarchy

```
LEVEL 1: Just Read
├─ SYSTEM-COMPLETE.md
├─ QUICKSTART.md
└─ README.md

LEVEL 2: Understand Architecture
├─ LEARNING-SYSTEM.md (20 min read)
├─ VSCODE-INTEGRATION.md (15 min read)
└─ Understand 5 core systems

LEVEL 3: Hands-On Usage
├─ Fill memory/user.profile.md
├─ Create memory/projects/my-project.md
├─ Run agent tasks
└─ Monitor tracking/workflow-stats.json

LEVEL 4: Optimization
├─ Review optimization suggestions
├─ Implement improvements
├─ Track trending metrics
└─ Update CLAUDE.md with learnings

LEVEL 5: Integration
├─ Review vscode-integration/agent-api.js
├─ Share with VS Code team
├─ Test integration
└─ Deploy to VS Code workspace
```

---

## 🔍 When Something Goes Wrong

```
"Agent doesn't understand my project"
→ Check: memory/projects/my-project.md exists?
→ Fix: Create project memory file

"Agent asking 'tell me about your preferences'"
→ Check: memory/user.profile.md filled out?
→ Fix: Fill out user profile

"Workflow keeps failing"
→ Check: tracking/workflow-stats.json successRate
→ Fix: Review blockers, implement workaround

"Don't remember what we learned"
→ Check: memory/CLAUDE.md
→ Fix: Add learning if missing

"Agents aren't improving"
→ Check: Are you logging learnings?
→ Fix: Update CLAUDE.md after discoveries

"Context seems irrelevant"
→ Check: Smart router in hooks/context-injection/
→ Fix: Router auto-adjusts, monitor it working
```

---

## 💡 Pro Tips

1. **Fill User Profile First**
   - Agents work immediately 10x better
   - Takes 15 minutes
   - Pays off forever

2. **Create Project Memories**
   - One per active project
   - Update status weekly
   - Eliminates context switching confusion

3. **Log Learnings**
   - Write to CLAUDE.md
   - Prevents re-discovery
   - System learns what worked

4. **Monitor Workflow Stats**
   - Check weekly
   - Spot trends early
   - Implement suggestions

5. **Update Optimization Threshold**
   - Default 35% triggers compaction
   - Adjust if needed
   - Helps system stay focused

6. **Trust Sub-Agent Context Injection**
   - Claude can spawn unlimited agents internally
   - Each gets full context
   - No session limit for internal
   - System designed for this

---

## 📞 Command Reference

### Common System Calls
```javascript
// Check how to use any system:
const system = require('./hooks/context-injection/workflow-learning-system.js');

// Record a workflow execution
recordWorkflowExecution('workflow-name', {
  success: true,
  executionTimeMs: 1234,
  blockers: ['what blocked'],
  lessonsLearned: ['what learned']
});

// Get optimization suggestions
const suggestions = suggestOptimizations('workflow-name');

// Compare all workflows
const comparison = compareWorkflows();

// Get best workflow
const best = selectBestWorkflow('task-type', 'project-name');

// Generate report
const report = generateOptimizationReport();
```

---

## 🎯 Next Steps

**NOW (Next hour):**
- [ ] Read SYSTEM-COMPLETE.md (5 min)
- [ ] Fill memory/user.profile.md (15 min)
- [ ] Create first project memory (10 min)
- [ ] Test first agent interaction (5 min)

**THIS WEEK:**
- [ ] Read LEARNING-SYSTEM.md (20 min)
- [ ] Create all project memories (2-3 hours)
- [ ] Run workflows and monitor performance
- [ ] Review optimization suggestions

**THIS MONTH:**
- [ ] Understand all 5 core systems
- [ ] Implement workflow optimizations
- [ ] Track metrics improving
- [ ] Plan VS Code integration (if applicable)

**ONGOING:**
- [ ] Update user profile monthly
- [ ] Add learnings to CLAUDE.md
- [ ] Review optimization suggestions
- [ ] Monitor success metrics trending up

---

## 📈 Track Your Progress

```
Week 1:
- User profile: ✓
- First project: ✓
- First successful interaction: ✓

Week 2-4:
- All projects created: ✓
- Workflows running: ✓
- Success rates: 70-80%

Month 2:
- Optimization suggestions: ✓
- Success rates: 80-90%
- Execution time: trending down

Month 3:
- System self-improving: ✓
- Success rates: 90%+
- Minimal explanation needed: ✓
- Handling more workload: ✓
```

---

## 🏁 Success Looks Like

After one month of using this system:

- ✅ Agents understand your project without asking
- ✅ Workflows 20-30% faster than before
- ✅ Success rate >80% on first try
- ✅ Recurring blockers identified
- ✅ You explain context 50% less
- ✅ System suggests improvements you hadn't thought of
- ✅ Sub-agents spawn with full context
- ✅ Your workload feels more manageable
- ✅ The system is learning who you are

**That's the goal. That's what this enables.**

---

**You've got this.** Start with Step 1 in "Your First 30 Minutes" above. 🚀
