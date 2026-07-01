# QUICK START - Ramp-Agent System

## 🚀 Getting Your First Agent Running

### Step 1: Create Your First Agent (5 minutes)

```bash
# Copy the base template
cp agents/BASE-AGENT-CONFIG.md agents/my-first-agent.md
```

Open `agents/my-first-agent.md` and customize:

```yaml
name: "My First Agent"
description: "My specialized agent for [domain]"
status: "active"
type: "specialized"

applyTo:
  - projects: ["my-project"]

capabilities:
  - code-generation
  - code-analysis

skills:
  - claude-mem
  - task-observer
  - stop-slop
```

### Step 2: Register Your Agent

Add to `AGENTS.md`:

```markdown
| My First Agent | my-domain | active | 2026-07-01 | - |
```

### Step 3: Start a User-Managed Session

1. Pick an available session (1-4) from `sessions/` - for user-managed sessions
2. Edit `sessions/session-1.md`:
   ```markdown
   - **Agent:** My First Agent
   - **Git Checkout:** main
   - **Start Time:** 2026-07-01T00:00:00Z
   ```

3. The system automatically:
   - Calls `session-start-hook.js`
   - Loads `memory/CLAUDE.md`
   - Initializes tracking in `tracking/usage-stats.json`
   - Sets up permission checks via `config/permissions.json`

**Note:** If Claude spawns sub-agents internally, those operate without session limits.

### Step 4: What Happens Automatically

**On Every Command:**
1. ✅ `pre-tool-use.js` verifies permissions
2. ✅ Command executes
3. ✅ `post-tool-use.js` formats output
4. ✅ `tracking/usage-stats.json` updated

**At Task Completion:**
1. ✅ `agent-stop-hook.js` verifies success
2. ✅ `CLAUDE.md` updated with learnings
3. ✅ `feedback-loop.js` analyzes performance

**When Usage > 35%:**
1. 🔔 `session-end-hook.js` detects threshold
2. 🔔 `compactionLog` triggered
3. 🔔 System optimizes toward goal

---

## 📋 Creating Your First Workflow

### Plan Mode First

Before implementing, answer discovery questions:

```bash
cp workflows/plan-mode-template.md workflows/my-first-feature.md
```

Fill in the questions:
- Problem definition
- Scope & constraints
- Architecture
- Implementation strategy
- Testing approach
- Learnings to codify

### Then Codify It

Once Plan Mode is complete and implementation works:

```bash
cp workflows/WORKFLOW-TEMPLATE.md workflows/my-process.md
```

Document:
- Step-by-step process
- Input/output for each step
- Error handling
- Performance metrics

---

## 💾 Updating CLAUDE.md

Whenever something important happens:

```markdown
## Example Entry in CLAUDE.md

### Learnings
- **2026-07-01:** Discovered pattern for [task type] - use [approach]
  - Success rate: 95%
  - Documents in: workflows/my-process.md

### Issues Resolved
- **2026-07-01:** Permission error on [command] - added to allowlist
  - Impact: Reduced approval delay from 2min to instant

### Integration Status
- New skill added: [skill-name]
- Agents updated: 2
- Workflows affected: 1
```

---

## 🔗 Helpful Commands

### Check Session Status
View any session file:
```
sessions/session-1.md
sessions/session-2.md
```

### Check Usage Tracking
```
tracking/usage-stats.json
```

### Review Central Memory
```
memory/CLAUDE.md
```

### Check Permissions
```
config/permissions.json
```

### Validate Registry and Integration
```bash
npm run validate
# or
node scripts/validate-ramp-agent.js
```

### View All Agents
```
AGENTS.md
```

---

## ⚙️ Configuration Files

### Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `config/claude-settings.json` | Ramp-Agent config | System tweaks |
| `config/permissions.json` | Command allowlist | Add safe commands |
| `memory/CLAUDE.md` | Central memory | After every task |
| `tracking/usage-stats.json` | Metrics | Auto-updated |
| `AGENTS.md` | Agent registry | Register new agents |

---

## 🔄 Typical Workflow Day

### Morning: Plan Mode
1. Check `CLAUDE.md` for context
2. Review ongoing sessions in `sessions/`
3. If starting new feature: Use plan-mode-template.md

### During Day: Parallel Execution
1. Agent 1 in session-1
2. Agent 2 in session-2
3. Agent 3 in session-3
4. Agent 4 in session-4
5. All share and update CLAUDE.md

### Evening: Compaction Check
1. Check `tracking/usage-stats.json`
2. If usage > 35%, review `memory/CLAUDE.md`
3. Optimize toward established goals
4. Update feedback loop

---

## 🐛 Troubleshooting

### Permission Error?
→ Add command to `config/permissions.json`

### Agent Not Starting?
→ Check `agents/my-agent.md` YAML frontmatter

### Session Not Tracked?
→ Edit `sessions/session-X.md` with start time

### Lost Context?
→ Check `memory/CLAUDE.md` for previous work

---

## 📚 Next Steps

1. ✅ Create your first agent
2. ✅ Start your first session
3. ✅ Run your first task
4. ✅ Update CLAUDE.md with results
5. ✅ Create your first workflow
6. ✅ Monitor usage metrics
7. ✅ Set up your first specialized agent for a specific project

---

**You're ready to go!** 🚀
