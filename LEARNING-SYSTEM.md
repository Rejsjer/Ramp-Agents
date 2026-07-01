# Learning System Architecture

**Status:** Production-Ready  
**Version:** 1.0  
**Last Updated:** 2026-07-01  

---

## Overview

Ramp-Agent's Learning System transforms your workflows into continuously improving processes. Agents learn what works, optimize automatically, and require less context over time.

**Key Achievement:** Your agents now understand:
- Who you are and why you care about things
- What has worked before and why
- Which workflows are most efficient
- What constraints matter most
- How to communicate with you
- What context is relevant

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Agent Workspace                   │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────▼────────┐
       │  Agent API     │ ← Native integration with VS Code
       │  (agent-api.js)│
       └────────┬───────┘
               │
    ┌──────────▼──────────────┐
    │  Smart Context Router    │ ← Determines relevant context
    │  (smart-context-router)  │
    └──────────┬───────────────┘
               │
    ┌──────────┴────────────────────┬──────────────────┐
    │                               │                  │
┌───▼──────┐  ┌──────────────────┐  │  ┌────────────┐  │
│ User     │  │ Sub-Agent Context │  │  │  Workflow  │  │
│ Profile  │  │ Injector         │  │  │  Learning  │  │
│ (Know    │  │ (know context)   │  │  │  (optimize)│  │
│  who)    │  └──────────────────┘  │  └────────────┘  │
└──────────┘                        │
                   ┌────────────────▼──────────────┐
                   │   Project Memory              │
                   │  (per-project context)       │
                   └──────────────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │   CLAUDE.md         │
                   │  (central learnings)│
                   └─────────────────────┘
```

---

## 5 Core Components

### 1. User Profile System (`memory/user.profile.md`)

**Purpose:** Agents know who you are without re-explanation

**What It Contains:**
- Your identity and values
- Communication preferences
- Work patterns and capacity
- Active projects and interests
- Skill preferences
- What works/doesn't work for you

**How Agents Use It:**
- Load on startup
- Match communication style
- Respect your constraints
- Reference your priorities
- Adapt to your preferences

**How to Maintain It:**
```
1. Fill out identity section (10 min)
2. Document communication style (5 min)
3. List active projects (5 min)
4. Add patterns as you discover them (ongoing)
5. Agents will log feedback in this file
```

---

### 2. Project Memory System (`memory/projects/`)

**Purpose:** Each project has its own context - no confusion between projects

**Structure:**
```
memory/projects/
├── PROJECT-TEMPLATE.md      # Copy this for each project
├── project-alpha.md         # Your active projects
├── project-beta.md
└── project-gamma.md
```

**Each Project Memory Contains:**
- Why it exists and success criteria
- Current status and blockers
- Technical architecture and constraints
- Workflows used and their performance
- Team and resources
- Historical decisions and learnings

**How Agents Use It:**
- Automatically loaded when you specify `--project project-name`
- Agents understand project context without re-explanation
- Constraints are enforced automatically
- Success criteria guide decision-making

**How to Maintain It:**
```
1. Create once per new project (15 min)
2. Update status weekly
3. Log blockers and resolutions
4. Add decisions as they're made
5. Track what works/doesn't work
```

---

### 3. Sub-Agent Context Injection (`hooks/context-injection/sub-agent-context-injector.js`)

**Purpose:** When Claude internally spawns agents, they start with full context

**How It Works:**

```javascript
// When Claude creates a sub-agent:
const contextInjection = prepareSubAgentContext(
  subAgentId,
  task,
  project
);

// Sub-agent receives:
// ✓ Your user profile
// ✓ Project memory (if applicable)
// ✓ Recent learnings
// ✓ Recommended skills
// ✓ Your communication preferences
// ✓ Relevant workflows

// Result: Sub-agent starts with full context, doesn't ask "tell me about..."
```

**Key Benefit:** Unlimited internal parallelization without context loss

---

### 4. Workflow Learning System (`hooks/context-injection/workflow-learning-system.js`)

**Purpose:** Workflows improve over time - the system learns which approaches work best

**What Gets Tracked:**
- Success rate per workflow
- Execution time trends
- Recurring blockers
- Lessons learned
- Performance trends (improving/stable/degrading)

**How It Works:**
```javascript
// After each workflow execution:
recordWorkflowExecution(workflowName, {
  success: true,
  executionTimeMs: 1234,
  project: 'project-alpha',
  blockers: ['integration-test', 'deployment'],
  lessonsLearned: ['Use cache for X', 'Parallel Y for speed']
});

// System automatically:
// 1. Calculates success rate
// 2. Detects performance trends
// 3. Identifies recurring blockers
// 4. Suggests optimizations
// 5. Recommends best performers
```

**Optimization Suggestions:**
- "Success rate is 75%, need investigation"
- "Performance degrading - consider parallelization"
- "Deployment blocker in 4/5 recent runs - fix upstream"
- "Cache X added 40% speed - now default"

**How to Use It:**
```javascript
// Check workflow performance
const performance = suggestOptimizations('my-workflow');

// Get recommendations
suggestOptimizations('my-workflow').suggestions.forEach(s => {
  console.log(`${s.priority}: ${s.suggestion}`);
});

// Compare all workflows
const comparison = compareWorkflows();

// Auto-select best workflow
const bestWorkflow = selectBestWorkflow('deployment', 'project-alpha');
```

---

### 5. Smart Context Router (`hooks/context-injection/smart-context-router.js`)

**Purpose:** Automatically determine what context is relevant - avoid bloat

**How It Analyzes Tasks:**
```javascript
const context = routeTaskContext(
  "Build RAG system for customer documentation",
  "project-alpha"
);

// Router analyzes:
// 1. Task keywords → "RAG" suggests rag-architect skill
// 2. Complexity → "Build" = high complexity needs more context
// 3. Project → Load project memory
// 4. Recent learnings → What did we learn about RAG?
// 5. Workflows → Which workflows are related?
// 6. Skills → Which skills does this need?

// Returns:
// - taskType: 'rag'
// - requiredContext: [userProfile, projectMemory, learnings, workflows]
// - prioritizedContext: (sorted by relevance)
// - injectionPrompt: (ready to use)
// - estimatedComplexity: 'high'
```

**Context Size Management:**
- Targets ~50KB max context per task
- Prioritizes high-relevance items
- Never excludes critical constraints
- Logs what's selected for learning

---

## Workflow: How Everything Works Together

### Example: Building a New Feature

**Step 1: User Makes Request**
```
"Build search feature for project-alpha"
```

**Step 2: Smart Context Router Analyzes**
```
- Task: "Build search feature"
- Type: "development"
- Complexity: "high"
- Project: "project-alpha"
```

**Step 3: Context Gets Loaded**
```
✓ User Profile
  - Communication style: "bullet points"
  - Capacity: "medium workload"
  - Constraint: "must maintain backward compatibility"

✓ Project Memory (project-alpha)
  - Tech stack: "Node, PostgreSQL, Elasticsearch"
  - Key blocker: "Search indexing performance"
  - Success criteria: "<500ms response time"

✓ Recent Learnings
  - "Elasticsearch bulk indexing 3x faster"
  - "Always warm indexes before search"
  - "User prefers single API endpoint"

✓ Related Workflows
  - search-feature-workflow.md
  - elasticsearch-optimization.md

✓ Skill Recommendations
  - rag-architect (if semantic search)
  - agent-designer (for orchestration)
```

**Step 4: Sub-Agent Spawns with Context**
```
Claude spawns search-builder sub-agent with full context:
"Here's what you need to know:
- User wants bullet points
- Must maintain backward compat
- Elasticsearch bulk indexing works best (3x)
- Previous search features used single endpoint
- Need <500ms response
- Use search-feature-workflow.md
- Consider RAG if semantic search needed"
```

**Step 5: Sub-Agent Works Efficiently**
- No "tell me about your project" questions
- No "what's your tech stack" questions
- Decisions align with your values
- Uses proven patterns

**Step 6: Results Get Logged**
```
Success! Logged to:
✓ project-alpha.md (feature complete)
✓ CLAUDE.md (learned: bulk indexing 3x faster)
✓ search-workflow-stats.json (success rate, execution time)
```

**Step 7: Next Time Same Workflow is Faster**
```
"Build another search feature"
→ Router finds search-feature-workflow
→ Stats show 95% success, improving trend
→ Recommends this workflow
→ Suggests recent optimizations
```

---

## Using the Learning System

### For Creating New Projects

```bash
# 1. Copy project template
cp memory/projects/PROJECT-TEMPLATE.md memory/projects/my-project.md

# 2. Fill out project context
# (Why it exists, success criteria, tech stack, constraints)

# 3. When working on project, specify it:
# "Build X for project my-project"
# → Router automatically loads context
```

### For Improving Workflows

```javascript
// Check workflow performance
const suggestions = suggestOptimizations('my-workflow');

// Review suggestions
suggestions.forEach(s => {
  if (s.type === 'success-rate') {
    console.log('Need to investigate failures');
  }
  if (s.type === 'performance') {
    console.log('Consider parallelization');
  }
  if (s.type === 'blocker') {
    console.log('Fix these recurring issues');
  }
});

// Update CLAUDE.md with what worked
// System will use it next time
```

### For Increasing Capacity

```
As workflows improve:
1. Success rates increase → Reduce manual review
2. Execution time decreases → Handle more parallel
3. Blockers decrease → Fewer interruptions
4. Learnings accumulate → Better decisions

Result: You handle more workload without more effort
```

### For Agent Learning

Agents learn by:
1. **User Profile** - Understand your values/constraints
2. **Project Memory** - Know project context
3. **Workflows** - Recognize patterns that work
4. **CLAUDE.md** - Access collective learning
5. **Context Injection** - Get relevant info before task

---

## Key Files

| File | Purpose | Frequency |
|------|---------|-----------|
| `memory/user.profile.md` | Who you are | Update monthly |
| `memory/projects/*.md` | Project context | Update weekly |
| `memory/CLAUDE.md` | Central learnings | Auto-updated |
| `hooks/context-injection/*.js` | System infrastructure | Auto-managed |
| `tracking/usage-stats.json` | Execution metrics | Auto-updated |
| `tracking/workflow-stats.json` | Workflow performance | Auto-updated |

---

## Success Metrics

Track these to see improvement:

```
WORKFLOW EFFICIENCY
├─ Workflow success rate (target: >90%)
├─ Average execution time (trending down)
├─ Blocker frequency (trending down)
└─ Manual review needed (trending down)

WORKLOAD CAPACITY
├─ Parallel tasks handled (trending up)
├─ Context re-explanation needed (trending down)
├─ Agent autonomy level (trending up)
└─ Your actual workload (stable/manageable)

AGENT INTELLIGENCE
├─ First-try success rate (trending up)
├─ Time to solution (trending down)
├─ Decisions align with your values (% trending up)
└─ Proactive suggestions accuracy (% correct)

LEARNING ACCUMULATION
├─ Learnings in CLAUDE.md (trending up)
├─ Project context completeness (% trending up)
├─ Workflow optimizations implemented (cumulative)
└─ System becomes smarter (subjective but real)
```

---

## Next Steps

### Immediate (This week):
1. Fill out `memory/user.profile.md`
2. Create first `memory/projects/[name].md`
3. Test with your first agent task

### Short-term (This month):
1. Create project memories for all active projects
2. Track workflows and log learnings
3. Review optimization suggestions
4. Update user profile as patterns emerge

### Ongoing:
1. Let workflows run and improve
2. Update CLAUDE.md with lessons
3. Add agent feedback to user profile
4. Monitor success metrics

---

## Architecture Guarantees

✅ **No context loss** - Sub-agents have full context  
✅ **No re-explanation** - User profile loaded on startup  
✅ **No workflow bloat** - Context router keeps relevant only  
✅ **Continuous improvement** - Learning system tracks and suggests  
✅ **Scalable** - Handles unlimited sub-agents internally  
✅ **VS Code native** - Perfect integration with agent workspace  

---

**This system enables you to build something that works better every time it's used.**

The more you interact with it, the smarter it becomes.
The more workflows you run, the faster they get.
The more learnings you log, the better decisions get made.

Start small, iterate, learn, improve. 🚀
