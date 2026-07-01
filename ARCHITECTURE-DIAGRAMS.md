# System Architecture Diagrams

Quick visual references for the Ramp-Agent learning system

---

## 1. High-Level System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                  VS Code Agent Workspace                       │
│  (Native Integration - Skills, Projects, Metrics, Tips)        │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │   Agent API (agent-api.js)     │
         │                                │
         │ • Skill Discovery (25)         │
         │ • Pre-Execution Prep           │
         │ • Metrics Recording            │
         │ • Recommendations              │
         └────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌─────────┐    ┌─────────────┐    ┌──────────┐
    │ Smart   │    │ Sub-Agent   │    │ Workflow │
    │ Context │    │ Context     │    │ Learning │
    │ Router  │    │ Injector    │    │ System   │
    └─────────┘    └─────────────┘    └──────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
    ┌─────────────────┐          ┌──────────────────┐
    │  User Context   │          │ Project Memory   │
    │  (who you are)  │          │ (per-project)    │
    └─────────────────┘          └──────────────────┘
         │                                 │
         └────────────────┬────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │  Central Learnings      │
            │  (memory/CLAUDE.md)     │
            │                         │
            │ • Patterns Found        │
            │ • Blockers Resolved     │
            │ • Solutions             │
            │ • Improvements          │
            └─────────────────────────┘
```

---

## 2. Context Flow: How Context Gets To Agents

```
Task: "Build search feature for project-alpha"
                 │
                 ▼
      ┌──────────────────────┐
      │ Smart Context Router │
      │ (Analyzes task)      │
      └──────────┬───────────┘
                 │
      ┌──────────▼──────────┐
      │ Task Analysis       │
      │ • Type: development │
      │ • Complexity: high  │
      │ • Project: needed   │
      │ • Keywords: search  │
      └──────────┬──────────┘
                 │
      ┌──────────▼────────────────┐
      │ Determine Context Needed  │
      │ ✓ User profile            │
      │ ✓ Project memory          │
      │ ✓ Recent learnings        │
      │ ✓ Related workflows       │
      │ ✓ Skill recommendations   │
      └──────────┬────────────────┘
                 │
      ┌──────────▼────────────────┐
      │ Load & Prioritize         │
      │ (~50KB max)               │
      │                           │
      │ 1. User Profile (95 pts)  │
      │ 2. Project Memory (90)    │
      │ 3. Learnings (85)         │
      │ 4. Workflows (70)         │
      └──────────┬────────────────┘
                 │
      ┌──────────▼──────────────┐
      │ Context Ready for Agent │
      │                         │
      │ Agent now knows:        │
      │ • Your style            │
      │ • Project constraints   │
      │ • What's worked before  │
      │ • Best workflows        │
      │ • Recommended skills    │
      └─────────────────────────┘
```

---

## 3. Execution Lifecycle

```
START: Agent Task Request
         │
         ▼
┌─────────────────────────┐
│ 1. Context Preparation  │
│                         │
│ Router analyzes request │
│ Loads all context       │
│ Prioritizes by relevance│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. Skill Selection      │
│                         │
│ Best skill for task?    │
│ Historical success?     │
│ Skill capable?          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 3. Execution            │
│                         │
│ Skill runs with:        │
│ • Full context          │
│ • Matched style         │
│ • Proven patterns       │
│ • Respected constraints │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 4. Results Recording    │
│                         │
│ Success? ✓/✗            │
│ Time: XXXms             │
│ Blockers found?         │
│ Lessons learned?        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. Metrics Update       │
│                         │
│ Success rate →  85%     │
│ Avg time    → 2500ms    │
│ Trend       → improving │
│ Recommendations generated
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 6. Learning             │
│                         │
│ Add to CLAUDE.md:       │
│ • Lessons learned       │
│ • Blockers found        │
│ • Optimization ideas    │
│ • Skill recommendations │
└────────────┬────────────┘
             │
             ▼
NEXT EXECUTION IS SMARTER
```

---

## 4. Memory Hierarchy

```
Level 1: Central Learning (Shared by all)
┌──────────────────────────────────────┐
│ memory/CLAUDE.md                     │
│                                      │
│ • Patterns discovered                │
│ • Blockers resolved                  │
│ • Solutions that worked              │
│ • Improvements made                  │
│ • Lessons learned                    │
│                                      │
│ Loaded by: All agents on startup     │
│ Updated by: Every execution          │
└──────────────────────────────────────┘

Level 2: Project Context (Project-specific)
┌──────────────────────────────────────┐
│ memory/projects/[project].md         │
│                                      │
│ • Why project exists                 │
│ • Status & blockers                  │
│ • Tech stack & constraints           │
│ • Success criteria                   │
│ • Workflows & performance            │
│ • Team & resources                   │
│                                      │
│ Loaded by: Agents when project named │
│ Updated by: Weekly/as-needed         │
└──────────────────────────────────────┘

Level 3: User Context (Personal)
┌──────────────────────────────────────┐
│ memory/user.profile.md               │
│                                      │
│ • Who you are                        │
│ • Your values & priorities           │
│ • Communication preferences          │
│ • Work patterns & capacity           │
│ • What works/doesn't for you         │
│ • Decision-making style              │
│                                      │
│ Loaded by: All agents on startup     │
│ Updated by: Monthly (as patterns emerge)
└──────────────────────────────────────┘

Level 4: Contextual Routing (Task-specific)
┌──────────────────────────────────────┐
│ Smart Context Router Decision        │
│                                      │
│ Based on: Task analysis              │
│ • Keywords analyzed                  │
│ • Complexity estimated               │
│ • Project determined                 │
│                                      │
│ Result: Perfect context injection    │
│ • Nothing extra (no bloat)           │
│ • Nothing missing (all relevant)     │
│ • Optimized for this specific task   │
└──────────────────────────────────────┘
```

---

## 5. Sub-Agent Context Injection

```
Claude Internal Sub-Agent Spawn
              │
              ▼
      ┌───────────────────┐
      │ Claude decides:   │
      │ "I need to spawn  │
      │  sub-agents to    │
      │  handle this      │
      │  task better"     │
      └─────────┬─────────┘
                │
                ▼
      ┌──────────────────────────────────┐
      │ Context Injector prepares:       │
      │                                  │
      │ ✓ Load user.profile.md           │
      │ ✓ Load projects/[project].md     │
      │ ✓ Extract recent learnings       │
      │ ✓ Find related workflows         │
      │ ✓ Recommend skills               │
      │                                  │
      │ Creates injection package:       │
      │ ~15-20KB of relevant context     │
      └──────────┬───────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
    Sub-Agent1       Sub-Agent2
    ┌──────────┐    ┌──────────┐
    │ Loads:   │    │ Loads:   │
    │ • User   │    │ • User   │
    │ • Project│    │ • Project│
    │ • Learn. │    │ • Learn. │
    │ • Skills │    │ • Skills │
    │          │    │          │
    │ Starts   │    │ Starts   │
    │ with     │    │ with     │
    │ context  │    │ context  │
    └──────────┘    └──────────┘
        │                │
        └────────┬───────┘
                 │
            Works without
         re-explaining things


RESULT: Unlimited parallelization with full context
```

---

## 6. Workflow Learning Cycle

```
Start: Track Workflow Execution

Run 1: First execution
┌────────────────────┐
│ Success: ✗          │
│ Time: 5000ms        │
│ Blocker: X          │
│ Lesson: Try Y next  │
│                     │
│ Success Rate: 0%    │
│ Trend: Starting     │
└────────────────────┘
         │
         ▼
Run 2: Apply lesson
┌────────────────────┐
│ Success: ✓          │
│ Time: 4500ms        │
│ Blocker: Z          │
│ Lesson: Fix Z       │
│                     │
│ Success Rate: 50%   │
│ Trend: improving    │
└────────────────────┘
         │
         ▼
Run 3: Fix blocker
┌────────────────────┐
│ Success: ✓          │
│ Time: 3000ms        │
│ Blocker: none       │
│ Lesson: Cache help  │
│                     │
│ Success Rate: 67%   │
│ Trend: improving    │
└────────────────────┘
         │
         ▼
Run 4: Add caching
┌────────────────────┐
│ Success: ✓          │
│ Time: 1500ms        │
│ Blocker: none       │
│ Lesson: Paralleliz  │
│                     │
│ Success Rate: 75%   │
│ Trend: improving    │
└────────────────────┘
         │
         ▼
Run 5: Parallelize
┌────────────────────┐
│ Success: ✓          │
│ Time: 800ms         │
│ Blocker: none       │
│ Lesson: Done        │
│                     │
│ Success Rate: 80%   │
│ Trend: stable       │
└────────────────────┘

RESULT: Workflow optimized through learning
         Success: 0% → 80%
         Time: 5000ms → 800ms (6x faster)
```

---

## 7. Three Tiers of Context

```
TIER 3: VS Code Agent Workspace
┌─────────────────────────────┐
│ User selects skill/project  │
│ Context auto-loaded         │
│ Metrics displayed           │
│ Recommendations shown       │
└────────────┬────────────────┘
             │
             ▼
TIER 2: Ramp-Agent System
┌────────────────────────────────┐
│ Smart routing decides context  │
│ Sub-agent injector prepares    │
│ Workflow learning tracks perf  │
│ Metrics updated               │
└────────────┬───────────────────┘
             │
             ▼
TIER 1: Knowledge Base
┌───────────────────────────────┐
│ user.profile.md (who you are) │
│ projects/*.md (context)        │
│ CLAUDE.md (learnings)         │
│ registry.json (skills)        │
│ workflow-stats.json (perf)    │
└───────────────────────────────┘
```

---

## 8. First 30 Minutes Flow

```
START
  │
  ▼
┌──────────────────────────┐
│ 1. Read SYSTEM-COMPLETE │
│    (5 minutes)           │
│                          │
│ Understand what you have │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ 2. Fill user.profile.md  │
│    (15 minutes)          │
│                          │
│ Tell system who you are  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────┐
│ 3. Create first project      │
│    (10 minutes)              │
│                              │
│ Copy PROJECT-TEMPLATE        │
│ Fill out: why, success, tech │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ 4. Run first agent task      │
│    (5 minutes)               │
│                              │
│ "Build X for my-project"     │
│ Watch context auto-load      │
└────────────┬─────────────────┘
             │
             ▼
         SUCCESS!
    System now understands:
    ✓ Who you are
    ✓ Your project
    ✓ Your preferences
    ✓ Your constraints
    
    Ready for real work
```

---

## 9. Continuous Improvement Spiral

```
Week 1: Baseline
  • Success: ~70%
  • Time: ~5000ms
  • Blockers: 3 per run
  ↓

Week 2: Learning Applied
  • Success: ~75%
  • Time: ~4200ms
  • Blockers: 2 per run
  ↓

Week 3: Optimizations Implemented
  • Success: ~82%
  • Time: ~3000ms
  • Blockers: 1 per run
  ↓

Week 4: Patterns Recognized
  • Success: ~88%
  • Time: ~2000ms
  • Blockers: 0-1 per run
  ↓

Month 2: Well-Oiled Machine
  • Success: >90%
  • Time: ~1200ms
  • Blockers: rare
  ↓

Continues improving forever...
```

---

**These diagrams help visualize how everything connects. Print or bookmark for reference!**
