# Ramp-Agent Architecture

**Framework Version:** 1.0  
**Last Updated:** 2026-07-01  

---

## Session Model

### Two Types of Sessions

#### 1. User-Managed Sessions (Max 4)

These are explicitly assigned by users:

- **Location:** `sessions/session-1.md` through `session-4.md`
- **Assignment:** Manual - edit the session file with agent name and git checkout
- **Lifecycle:** User controls start/end
- **Tracking:** Individual session metrics in `tracking/usage-stats.json`
- **Git Checkout:** Tracked per session
- **Primary Agent:** One agent per user session (orchestrator)
- **Example:** 
  ```markdown
  - **Agent:** Code Quality Agent
  - **Git Checkout:** feature/code-review
  ```

#### 2. Claude Sub-Agent Sessions (Unlimited)

These are spawned internally by Claude:

- **Location:** Managed internally by Claude's orchestration
- **Assignment:** Automatic - Claude decides when/what to spawn
- **Lifecycle:** Claude manages start/end
- **Tracking:** Individual metrics, aggregated to parent
- **No Limit:** Can spawn unlimited internal sub-agents
- **Primary Use:** Parallelizing work internally
- **Example:**
  ```
  Claude Main Agent (Session 1)
    ├─ Sub-Agent A (analyze code)
    ├─ Sub-Agent B (run tests)
    ├─ Sub-Agent C (generate docs)
    └─ Sub-Agent D (update memory)
  ```

---

## Session Management Flow

### User-Managed Session Startup

1. User edits `sessions/session-1.md` with agent name and git checkout
2. System calls `session-start-hook.js`
3. Hook loads `memory/CLAUDE.md` into shared context
4. Hook initializes tracking in `tracking/usage-stats.json`
5. Agent begins execution
6. All tools check `permissions.json` via pre-tool-use hook
7. All outputs formatted via post-tool-use hook

### Sub-Agent Spawn by Claude

1. Claude detects opportunity for parallelization
2. Claude spawns sub-agent (internal, no session file needed)
3. Sub-agent loads `memory/CLAUDE.md` automatically
4. Sub-agent executes independent task
5. Sub-agent reports metrics back to parent
6. Parent aggregates results in `tracking/usage-stats.json`
7. Memory updates contribute to shared CLAUDE.md

---

## Memory & Tracking Across Sessions

### Shared CLAUDE.md

- **All** sessions (user-managed and sub-agents) load this on startup
- **All** sessions update this with learnings/issues
- **Single source of truth** for the entire system
- **Compaction triggered** when usage exceeds 35%

### Usage Tracking

```json
{
  "sessionUsage": {
    "session-1": { /* user-managed */ },
    "session-2": { /* user-managed */ },
    "session-3": { /* user-managed */ },
    "session-4": { /* user-managed */ },
    "sub-agent-runtime-1": { /* internal */ },
    "sub-agent-runtime-2": { /* internal */ },
    // ... unlimited sub-agent sessions
  }
}
```

### Usage Calculation

- **User Session Usage:** Explicit tracking in `session-X.md`
- **Sub-Agent Usage:** Aggregated to parent
- **Total Usage:** Sum of all active sessions
- **Compaction Trigger:** Total > 35%

---

## Agent Configuration

### For User-Managed Agents

```yaml
sessions:
  type: "user-managed"
  userManagedMax: 4
  timeout: 3600000
```

**Behavior:**
- Must be assigned to session 1-4
- Lifecycle controlled by user
- One per session
- Can be long-running

### For Sub-Agent Spawning

```yaml
sessions:
  type: "sub-agent"
  subAgentMax: null
  timeout: 300000
```

**Behavior:**
- Auto-spawned by parent
- Lifecycle managed by Claude
- No session limit
- Typically short-running
- Aggregates metrics to parent

---

## Permissions & Hooks

### Hooks Apply to Both Session Types

- ✅ **pre-tool-use** - Permission check (same for all)
- ✅ **post-tool-use** - Code formatting (same for all)
- ✅ **agent-stop** - Completion verification (same for all)
- ✅ **session-start** - Load CLAUDE.md (adaptive per type)
- ✅ **session-end** - Metrics aggregation (adaptive per type)
- ✅ **feedback-loop** - Performance analysis (same for all)

### Permission Override

Both user and sub-agent sessions check `config/permissions.json`:

```json
{
  "autoApprovalEnabled": true,
  "approvedCommands": { /* ... */ },
  "requiresApproval": { /* ... */ }
}
```

**No difference** - same safety checks for all session types.

---

## Scaling Behavior

### When You Have 1 User Session Active

```
Session 1: Code Quality Agent
  ↓ (needs parallelization)
  Claude spawns sub-agents internally:
    Sub-Agent A: Analyze component 1
    Sub-Agent B: Analyze component 2
    Sub-Agent C: Analyze component 3
    Sub-Agent D: Generate report
  ↓ (all complete)
  Results aggregated, memory updated
  Session 1 completes normally
```

### When You Have 4 User Sessions Active

```
Session 1: Code Quality Agent
  └─ Sub-Agents A, B, C (internal)
Session 2: Testing Agent
  └─ Sub-Agents D, E, F (internal)
Session 3: Documentation Agent
  └─ Sub-Agents G, H, I (internal)
Session 4: Deployment Agent
  └─ Sub-Agents J, K, L (internal)

All share CLAUDE.md, all update tracking
Max user sessions = 4 (no overflow)
Max sub-agents = unlimited (no overflow)
```

---

## Benefits

### Controlled User Interface
- Max 4 user sessions keeps UI manageable
- Explicit assignment prevents confusion
- Git checkout tracking for reproducibility

### Unlimited Internal Parallelization
- Claude maximizes throughput internally
- No artificial limits on work parallelization
- Each sub-task gets its own execution context
- Automatic aggregation back to parent

### Unified Memory & Tracking
- Single CLAUDE.md source of truth
- All sessions contribute equally
- Usage metrics aggregate automatically
- Compaction applies system-wide

### Safety & Consistency
- Same hooks apply to all sessions
- Same permissions checked for all
- Deterministic verification at completion
- Feedback loop learns from all activity

---

## Example: Code Review at Scale

### Setup
```
Session 1: Code Quality Agent (user-managed)
  Project: MegaApp
  Git: feature/release-v2
```

### Execution
```
1. Code Quality Agent starts
   - Loads CLAUDE.md
   - Sees 150 files to review
   
2. Agent spawns sub-agents:
   - Sub-Agent 1-10: Analyze React components
   - Sub-Agent 11-20: Analyze utils/helpers
   - Sub-Agent 21-30: Check test coverage
   - Sub-Agent 31-40: Verify documentation
   
3. All 40 run in parallel (no user session limit)
   - Each loads CLAUDE.md
   - Each checks permissions.json
   - Each reports metrics
   
4. Results aggregate back
   - Main Session 1 receives: 40 independent reports
   - CLAUDE.md updated with findings
   - usage-stats.json logs 40 sub-agent executions
   
5. Session 1 completes
   - Generates consolidated report
   - Updates CLAUDE.md with learnings
   - Final metrics logged
```

**Result:** One user session with unlimited internal parallelization ✅

---

## Configuration Summary

| Aspect | User Sessions | Sub-Agents |
|--------|--------------|-----------|
| Max Concurrent | 4 | Unlimited |
| Assignment | Manual | Automatic |
| Lifecycle | User controls | Claude controls |
| Tracking | Individual + aggregate | Aggregated to parent |
| Git Checkout | Yes | No |
| CLAUDE.md Access | Full | Full |
| Permissions Check | Yes | Yes |
| Hooks | All 6 | All 6 |

---

**This architecture enables:**
- Controlled user experience (4 managed sessions)
- Unlimited internal parallelization (no sub-agent cap)
- Unified learning across all execution (single CLAUDE.md)
- Safe and consistent execution (same hooks/permissions for all)
